import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { UniverseRegistry, loadGeneratedUniverses } from '../universe-registry';
import { ConfigLoader } from '../config-loader';
import { Universe } from '../../core/types';
import { CommonUniverseIds } from '../../core/common-universe-ids';
import { isValidUniverseId } from '../../core/universe-ids';

/**
 * james-gibson/local-time#98.
 *
 * The lore pipeline (`scripts/sync-lore.sh`) writes `src/config/universes/imported/`,
 * which is git-ignored — the compendia belong to a private KB and this repo is public.
 * Nothing was on the load path, so the generated universes were never registered.
 * The registry now loads the generated barrel at runtime; this asserts that wiring
 * and that the universes really resolve from a fresh registry.
 *
 * The tree is absent on a clean checkout / in CI, so the tree-dependent assertions
 * are skipped there. The loader contract itself is asserted unconditionally, so a
 * refactor that unhooks the loader still fails.
 */

const IMPORTED_DIR = join(__dirname, '..', 'universes', 'imported');
const hasGeneratedTree = existsSync(join(IMPORTED_DIR, 'index.ts'));

/** A registry that loads no external configuration, so `initialize()` is deterministic. */
const emptyLoader = { loadConfigurations: async () => [] } as unknown as ConfigLoader;

const idOf = (universe: Universe | { universeId?: unknown }): string =>
  String((universe as { universeId?: unknown }).universeId);

/** What {@link auditGeneratedTree} reports — one entry per way the tree can drift. */
interface TreeAudit {
  /** A module on disk the barrel never re-exports: written, never loaded. */
  orphanModules: string[];
  /** A barrel re-export with no module behind it: the barrel cannot build. */
  absentModules: string[];
  /** A universe the barrel re-exports but omits from `importedUniverses`. */
  unlistedUniverses: string[];
  /** A `universeId` the registry's own validator refuses, so registration silently skips it. */
  invalidUniverseIds: string[];
  /** An id-form declared parent that is neither a registered universe nor a declared container. */
  danglingParents: string[];
}

interface TreeAuditInput {
  /** Basenames of the `.ts` files in the tree, `index.ts` excluded. */
  moduleFiles: string[];
  /** The text of the barrel, `imported/index.ts`. */
  barrelSource: string;
  /** What the barrel actually yielded once loaded. */
  universes: { universeId: unknown; parents: unknown[] }[];
  /** Every id the registry holds — generated and built-in alike. */
  registeredIds: Iterable<string>;
}

/**
 * james-gibson/local-time#135.
 *
 * The generated tree is git-ignored (`.gitignore:25`) because the compendia are
 * private, so nothing in a pull request can show it and nothing on a clean
 * checkout can see it. `UniverseRegistry.registerGeneratedUniverses` catches and
 * warns, which is right for a runtime loader and useless as a guard: a bad id,
 * an orphaned module or a half-written barrel all still start up.
 *
 * This audits the three copies of the same list — files on disk, the barrel, and
 * the registry — against each other. It takes its inputs rather than reading them
 * so the audit can be pointed at synthetic drift in CI, where the real tree does
 * not exist.
 */
function auditGeneratedTree(input: TreeAuditInput): TreeAudit {
  /** ident -> module basename, from `export { ident } from './module.js';`. */
  const exported = new Map<string, string>();
  for (const match of input.barrelSource.matchAll(
    /export\s*\{([^}]*)\}\s*from\s*'\.\/([^']+)\.js';/g,
  )) {
    for (const ident of match[1].split(',')) {
      const name = ident.trim().replace(/^type\s+/, '');
      if (name) exported.set(name, match[2]);
    }
  }

  /** Idents the barrel actually puts in `importedUniverses`, so a name that is exported but never listed is caught. */
  const listed = new Set<string>();
  const array = input.barrelSource.match(/importedUniverses[^=]*=\s*\[([\s\S]*?)\];/);
  for (const ident of (array?.[1] ?? '').split(',')) {
    const name = ident.trim();
    if (name) listed.add(name);
  }

  const modules = new Set(input.moduleFiles.filter((f) => f !== 'index.ts').map((f) => f.replace(/\.ts$/, '')));
  const exportedModules = new Set(exported.values());
  const registered = new Set(input.registeredIds);

  /**
   * Container ids are valid `UniverseId`s that are deliberately not registered
   * universes — `history:software_engineering:*` is what `SOFTWARE_ENGINEERING`
   * resolves to. The registry accepts either, so the audit must too, or it would
   * report every symbolic parent as missing.
   */
  const containers = new Set(
    Object.values(CommonUniverseIds as unknown as Record<string, unknown>).filter(
      (value): value is string => typeof value === 'string' && isValidUniverseId(value),
    ),
  );

  const danglingParents: string[] = [];
  for (const universe of input.universes) {
    for (const parent of universe.parents) {
      // Id-form only: #133's test covers the symbolic case, where
      // `resolveDeclaredName` returning nothing is the whole signal.
      if (typeof parent !== 'string' || !isValidUniverseId(parent)) continue;
      if (!registered.has(parent) && !containers.has(parent)) {
        danglingParents.push(`${universe.universeId} -> ${parent}`);
      }
    }
  }

  return {
    orphanModules: [...modules].filter((m) => !exportedModules.has(m)).sort(),
    absentModules: [...exportedModules].filter((m) => !modules.has(m)).sort(),
    unlistedUniverses: [...exported.keys()].filter((ident) => !listed.has(ident)).sort(),
    invalidUniverseIds: input.universes
      .filter((u) => typeof u.universeId !== 'string' || !isValidUniverseId(u.universeId))
      .map((u) => String(u.universeId))
      .sort(),
    danglingParents: danglingParents.sort(),
  };
}

describe('lore-generated universes (james-gibson/local-time#98)', () => {
  test('the loader is wired and resolves to an array whether or not the tree exists', async () => {
    await expect(loadGeneratedUniverses()).resolves.toEqual(expect.any(Array));
  });

  test('initialize() completes without throwing', async () => {
    const registry = new UniverseRegistry(emptyLoader);
    await expect(registry.initialize()).resolves.toBeUndefined();
  });

  (hasGeneratedTree ? describe : describe.skip)('with the generated tree present', () => {
    test('the loader returns the generated universes', async () => {
      const generated = await loadGeneratedUniverses();
      expect(generated.length).toBeGreaterThan(0);
    });

    test('every generated universe is retrievable from a fresh registry', async () => {
      const registry = new UniverseRegistry(emptyLoader);
      await registry.initialize();

      const generated = await loadGeneratedUniverses();
      const missing = generated.map(idOf).filter((id) => !registry.getUniverse(id));
      expect(missing).toEqual([]);
    });

    /**
     * james-gibson/local-time#133. The compendia author `parent-universes` as
     * symbolic names, and nothing resolved them, so every declared edge was
     * dropped. This asserts the whole tree's declarations now land — which is the
     * half that a per-universe lookup above cannot see, because a universe with no
     * parents is still retrievable.
     */
    test('every declared parent in the tree resolves to a container', async () => {
      const generated = await loadGeneratedUniverses();

      const unresolved: string[] = [];
      for (const universe of generated) {
        const parents = universe.connections?.natural?.parentUniverses ?? [];
        for (const parent of parents as unknown[]) {
          if (typeof parent !== 'string' || !CommonUniverseIds.resolveDeclaredName(parent)) {
            unresolved.push(`${idOf(universe)} -> ${String(parent)}`);
          }
        }
      }

      expect(unresolved).toEqual([]);
    });

    /**
     * james-gibson/local-time#135. The guard proper: the files on disk, the
     * barrel, and what the registry ends up holding must be three views of one
     * list. Drift here is silent by construction — the tree is git-ignored, and
     * `registerGeneratedUniverses` warns and continues rather than throwing — so
     * this is the only place it can be reported.
     */
    test('the files on disk, the barrel and the registry agree', async () => {
      const registry = new UniverseRegistry(emptyLoader);
      await registry.initialize();

      const generated = await loadGeneratedUniverses();
      const barrelSource = readFileSync(join(IMPORTED_DIR, 'index.ts'), 'utf-8');

      expect(
        auditGeneratedTree({
          moduleFiles: readdirSync(IMPORTED_DIR),
          barrelSource,
          universes: generated.map((universe) => ({
            universeId: idOf(universe),
            parents: (universe.connections?.natural?.parentUniverses ?? []) as unknown[],
          })),
          registeredIds: registry.getAllUniverses().map(idOf),
        }),
      ).toEqual({
        orphanModules: [],
        absentModules: [],
        unlistedUniverses: [],
        invalidUniverseIds: [],
        danglingParents: [],
      });
    });
  });
});

/**
 * The guard above only runs where the tree exists, which is exactly where CI is
 * not. So the audit is asserted against synthetic drift here, unconditionally: a
 * change that hollows it out fails on a clean checkout rather than in silence.
 */
describe('the generated-tree audit reports drift (james-gibson/local-time#135)', () => {
  const audit = (overrides: Partial<TreeAuditInput> = {}): TreeAudit =>
    auditGeneratedTree({
      moduleFiles: ['personal_docs_2026.ts'],
      barrelSource: [
        "export { personalDocs2026Universe } from './personal_docs_2026.js';",
        "import type { Universe } from '../../../core/types.js';",
        'export const importedUniverses: Universe[] = [personalDocs2026Universe];',
      ].join('\n'),
      universes: [
        { universeId: 'personal:docs:2026', parents: ['history:software_engineering:*'] },
      ],
      registeredIds: ['personal:docs:2026'],
      ...overrides,
    });

  test('a module the barrel never exports is named', () => {
    expect(audit({ moduleFiles: ['personal_docs_2026.ts', 'personal_orphan_2027.ts'] }).orphanModules).toEqual([
      'personal_orphan_2027',
    ]);
  });

  test('a barrel export with no module behind it is named', () => {
    expect(
      audit({
        barrelSource: [
          "export { personalDocs2026Universe } from './personal_docs_2026.js';",
          "export { personalGone2027Universe } from './personal_gone_2027.js';",
          'export const importedUniverses: Universe[] = [personalDocs2026Universe];',
        ].join('\n'),
      }).absentModules,
    ).toEqual(['personal_gone_2027']);
  });

  test('a universe exported but left out of `importedUniverses` is named', () => {
    expect(
      audit({
        barrelSource: [
          "export { personalDocs2026Universe } from './personal_docs_2026.js';",
          "export { personalGhost2027Universe } from './personal_ghost_2027.js';",
          'export const importedUniverses: Universe[] = [personalDocs2026Universe];',
        ].join('\n'),
      }).unlistedUniverses,
    ).toEqual(['personalGhost2027Universe']);
  });

  test('a universeId the registry would silently skip is named', () => {
    expect(
      audit({ universes: [{ universeId: 'personal docs 2026', parents: [] }] }).invalidUniverseIds,
    ).toEqual(['personal docs 2026']);
  });

  test('a declared parent that is neither a universe nor a container is named', () => {
    expect(
      audit({ universes: [{ universeId: 'personal:docs:2026', parents: ['personal:nobody:1999'] }] })
        .danglingParents,
    ).toEqual(['personal:docs:2026 -> personal:nobody:1999']);
  });

  test('a container id is not mistaken for a missing universe', () => {
    // `history:software_engineering:*` is a valid `UniverseId` and a container,
    // and is deliberately never a registered universe. The registry accepts
    // either form, so the audit must too — otherwise every symbolic parent in
    // the tree would report as missing.
    expect(audit().danglingParents).toEqual([]);
  });
});

/**
 * The resolution itself, asserted without the generated tree, so this half still
 * runs on a clean checkout and in CI.
 */
describe('declared parents resolve from the KB name form (james-gibson/local-time#133)', () => {
  const registry = new UniverseRegistry(emptyLoader);

  /** The edge-resolution step, exercised directly so no full universe is needed. */
  const resolve = (universe: unknown): string[] =>
    (
      registry as unknown as {
        declaredParentUniverses: (u: unknown) => string[];
      }
    ).declaredParentUniverses(universe);

  const declaring = (parents: unknown[]) => ({
    universeId: 'personal:test_declared_parents:2026',
    connections: { natural: { parentUniverses: parents } },
  });

  test('a symbolic name and an id both become real edges', () => {
    expect(resolve(declaring(['SOFTWARE_ENGINEERING', 'personal:docs:2026']))).toEqual([
      'history:software_engineering:*',
      'personal:docs:2026',
    ]);
  });

  test('duplicates collapse after resolution', () => {
    expect(resolve(declaring(['PERSONAL_PROJECTS', 'PERSONAL_PROJECTS']))).toEqual([
      'history:personal_projects:*',
    ]);
  });

  test('an unresolvable name is reported in the open, not dropped in silence', () => {
    const warnings: string[] = [];
    const realWarn = console.warn;
    console.warn = (...args: unknown[]) => warnings.push(args.map(String).join(' '));
    const resolved = resolve(declaring(['NOPE_CONTAINER']));
    console.warn = realWarn;

    expect(resolved).toEqual([]);
    expect(warnings.join('\n')).toContain('NOPE_CONTAINER');
  });
});
