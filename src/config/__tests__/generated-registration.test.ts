import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { UniverseRegistry, loadGeneratedUniverses } from '../universe-registry';
import { ConfigLoader } from '../config-loader';
import { Universe } from '../../core/types';

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
  });
});
