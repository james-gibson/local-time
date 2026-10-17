import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { UniverseRegistry, loadGeneratedUniverses } from '../universe-registry';
import { ConfigLoader } from '../config-loader';
import { Universe } from '../../core/types';
import { CommonUniverseIds } from '../../core/common-universe-ids';

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
