import { readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

import { allUniverses } from '../universes';
import { ConfigLoader } from '../config-loader';
import { UniverseRegistry } from '../universe-registry';
import type { Universe } from '../../core/types';

/**
 * james-gibson/local-time#153.
 *
 * Registration has always been "if someone remembered to spread it into an array", and
 * that is the shape behind #27, #67, #74 and #111: a universe is constructed at module
 * scope, validated, and then handed to nothing, so `registry.getUniverse(id)` is
 * `undefined` and it is invisible to every query.
 *
 * The guards that existed for it were six hand-written barrel walks, one namespace each
 * (`films/`, `people/`, `games/diablo/`, `scotus-ot2013/`, `scotus-ot2025/`,
 * `studios/`). The correlation was exact: the guarded namespaces were clean and every
 * orphan sat in an unguarded one. Measured on `main` (`4d126b3`) before this guard
 * existed, that was 499 ids defined against 490 registered.
 *
 * This is the repo-wide version. It walks **every** module under `src/config/universes`,
 * loads each one, and asserts that every `universeId` it exports is in `allUniverses`
 * *and* survives a real registry lookup. It reads the filesystem rather than importing a
 * barrel, because the two worst offenders — `james/solar.ts` and
 * `podcast/hydrology-impacts.ts` — were reachable from no barrel at all, so a barrel
 * walk could not have seen them however carefully it was written.
 *
 * The one exclusion is explicit and named, so it is a documented hole rather than an
 * implied one.
 */

/** The directory under test. */
const UNIVERSES_DIR = resolve(__dirname, '..', 'universes');

/**
 * Subtrees deliberately outside this guard, each with the open issue that owns it.
 *
 * These are excluded rather than tolerated because tolerating them would mean the guard
 * could pass with those modules throwing or missing, which is the failure it exists to
 * catch. An entry is only legitimate while its issue is open.
 */
const EXCLUDED: Array<{ path: string; reason: string }> = [
  {
    path: join(UNIVERSES_DIR, 'global-politics'),
    reason:
      '#81 — the namespace has no barrel, so none of its four universes load — and #102 — ' +
      '`gaza.ts` and `ukraine.ts` throw the historical-id validator at module scope, so they ' +
      'cannot even be imported. Both are tracked; this guard covers everything else.',
  },
];

const EXCLUDED_PATHS = new Set(EXCLUDED.map((entry) => entry.path));

/** A directory name that is never a universe module. */
const SKIPPED_DIRS = new Set(['__tests__', 'imported']);

/** A file name that is never a universe module. */
const isModuleFile = (name: string): boolean =>
  name.endsWith('.ts') && !name.endsWith('.test.ts') && !name.endsWith('.d.ts');

/** Every universe module under `dir`, excluding tests, the git-ignored tree, and {@link EXCLUDED}. */
const moduleFilesUnder = (dir: string): string[] => {
  const found: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (SKIPPED_DIRS.has(entry) || EXCLUDED_PATHS.has(full)) continue;
      found.push(...moduleFilesUnder(full));
    } else if (isModuleFile(entry)) {
      found.push(full);
    }
  }
  return found;
};

/** The one thing a value needs for this guard to treat it as a universe. */
type UniverseLike = { universeId: string };

const isUniverseLike = (value: unknown): value is UniverseLike =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as UniverseLike).universeId === 'string';

/**
 * A universe, or an array of universes, contributes its members. Anything else — the
 * enums in `cybersecurity/access-control.ts`, the `HomeEnergyMetadata` interfaces in
 * `james/solar.ts` — contributes nothing.
 */
const collect = (value: unknown, into: Map<string, { universe: UniverseLike; module: string }>, module: string): void => {
  if (isUniverseLike(value)) {
    if (!into.has(value.universeId)) into.set(value.universeId, { universe: value, module });
    return;
  }
  if (Array.isArray(value)) for (const item of value) collect(item, into, module);
};

const moduleFiles = moduleFilesUnder(UNIVERSES_DIR);

/**
 * Every universe defined under `src/config/universes`, by id.
 *
 * Loaded with a dynamic import so a module added tomorrow is covered without editing a
 * list here — which is the whole difference between this and the six guards it replaces.
 */
const defined = new Map<string, { universe: UniverseLike; module: string }>();
const importFailures: string[] = [];

beforeAll(async () => {
  for (const file of moduleFiles) {
    try {
      const exports = (await import(file)) as Record<string, unknown>;
      for (const [name, value] of Object.entries(exports)) {
        if (typeof value === 'function' || name === 'default') continue;
        collect(value, defined, relative(UNIVERSES_DIR, file));
      }
    } catch (error) {
      importFailures.push(`${relative(UNIVERSES_DIR, file)}: ${(error as Error).message}`);
    }
  }
});

/** Every id `allUniverses` actually carries, flattened defensively. */
const registered = new Map<string, unknown>();
for (const entry of allUniverses as unknown as unknown[]) {
  for (const universe of Array.isArray(entry) ? entry : [entry]) {
    const id = (universe as { universeId?: unknown })?.universeId;
    if (typeof id === 'string') registered.set(id, universe);
  }
}

describe('every universe defined under src/config/universes is registered (james-gibson/local-time#153)', () => {
  test('the walk is not vacuous — it really does load modules and find universes', () => {
    // If the walk is reshaped and starts matching nothing, every test below would pass
    // for the wrong reason. Pin a floor on both halves.
    expect(moduleFiles.length).toBeGreaterThanOrEqual(90);
    expect(defined.size).toBeGreaterThanOrEqual(450);
  });

  test('no universe module fails to import', () => {
    expect(importFailures).toEqual([]);
  });

  test('every exclusion still points at a real directory', () => {
    // An outdated exclusion is a hole that outlives its issue. If `global-politics` moves
    // or is deleted, this fails instead of silently covering nothing.
    for (const { path } of EXCLUDED) {
      expect(statSync(path).isDirectory()).toBe(true);
    }
  });

  test('nothing defined under src/config/universes is missing from allUniverses', () => {
    const missing = [...defined.entries()]
      .filter(([id]) => !registered.has(id))
      .map(([id, { module }]) => `${module} -> ${id}`);

    expect(missing).toEqual([]);
  });

  /**
   * The half a spread into `allUniverses` does not prove. `loadBuiltInUniverses` swallows
   * a malformed id with a warning, so a universe can be in the array and still be absent
   * from every query — the Ed Sheeran failure in #27.
   */
  test('every universe survives a real registry lookup', () => {
    const registry = new UniverseRegistry(new ConfigLoader());

    const failures: string[] = [];
    for (const [id, { universe, module }] of defined) {
      try {
        registry.registerUniverse(id, universe as unknown as Universe);
        if (!registry.getUniverse(id)) failures.push(`${module} -> ${id}`);
      } catch (error) {
        failures.push(`${module} -> ${id}: ${(error as Error).message}`);
      }
    }

    expect(failures).toEqual([]);
  });
});
