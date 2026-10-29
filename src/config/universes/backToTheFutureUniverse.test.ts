import { Universe } from '../../core/types';
import {
  GENERIC_FILM_STUDIO_TOKEN,
  createFilmUniverseId,
  isFilmUniverseId,
  isValidUniverseId,
} from '../../core/universe-ids';
import { CommonUniverseIds } from '../../core/common-universe-ids';
import { ConfigLoader } from '../config-loader';
import { UniverseRegistry } from '../universe-registry';
import {
  distributorOf,
  filmStudioTokenOf,
  resolveFilmStudio,
} from './studios';
import { allUniverses } from './index';
import { backToTheFutureUniverse } from './backToTheFutureUniverse';
import type { TropeFilmMetadata } from './tropes/types';

/**
 * Back to the Future (1985) — james-gibson/local-time#182.
 *
 * The universe shipped as `film:bttf:1985`: `film` is the *generic* studio token
 * ("no studio named") and `bttf` was read as the title, so the record claimed no
 * distributor at all. `resolveFilmStudio('bttf')` returned `undefined`, which cost
 * the universe both its studio parent and its `DISTRIBUTED_BY` edge. These tests
 * pin the id, the two derived edges, and the epoch ids the registry used to
 * substitute (#19), so the same defect cannot return silently.
 */

const ID = 'universal:back_to_the_future:1985';

/** A registry with no external configuration, so `initialize()` is deterministic. */
const emptyLoader = { loadConfigurations: async () => [] } as unknown as ConfigLoader;

const parentsOf = (universe: Universe): string[] =>
  (universe.connections?.natural?.parentUniverses ?? []) as string[];

const epochIds = (universe: Universe): string[] =>
  (universe.layers ?? []).flatMap((layer) =>
    Object.entries(layer.epochs ?? {}).map(([key, epoch]) => {
      const declared = (epoch as { epochId?: string }).epochId;
      return `${layer.layerId}/${key} -> ${declared ?? '(missing)'}`;
    }),
  );

describe('Back to the Future is a film in the film vocabulary (#182)', () => {
  test('the id names the distributor, not the generic `film` token', () => {
    expect(backToTheFutureUniverse.universeId).toBe(
      createFilmUniverseId('universal', 'back_to_the_future', 1985),
    );
    expect(backToTheFutureUniverse.universeId).toBe(ID);

    // The defect: `film` is the generic token, so the second segment was read as
    // the title and no studio could be resolved from the id.
    expect(filmStudioTokenOf(ID)).not.toBe(GENERIC_FILM_STUDIO_TOKEN);
    expect(filmStudioTokenOf(ID)).toBe('universal');
    expect(isFilmUniverseId(ID)).toBe(true);
    expect(isValidUniverseId(ID)).toBe(true);
  });

  test('the distributor resolves from the id, as of the release year', () => {
    const studio = distributorOf(ID);
    expect(studio).toBeDefined();
    expect(studio?.slug).toBe('universal_pictures');
    expect(studio?.universeId).toBe(resolveFilmStudio('universal')!.universeId);
  });

  test('is registered in allUniverses exactly once', () => {
    const count = allUniverses.filter(
      (universe) => String(universe.universeId) === ID,
    ).length;
    expect(count).toBe(1);
  });

  test('is retrievable from a real registry, not merely present in the array', async () => {
    const registry = new UniverseRegistry(emptyLoader);
    await registry.initialize();
    expect(registry.getUniverse(ID)?.universeId).toBe(ID);
    // The old id is retired, not aliased: nothing should resolve it any more.
    expect(registry.getUniverse('film:bttf:1985')).toBeUndefined();
  });

  test('carries both derived parents: Universal Pictures and Hollywood', () => {
    const parents = parentsOf(backToTheFutureUniverse);
    expect(parents).toContain(resolveFilmStudio('universal')!.universeId);
    expect(parents).toContain(CommonUniverseIds.HOLLYWOOD_SYSTEM);
    // The trope collection membership (#130) survives the rename.
    expect(parents).toContain(CommonUniverseIds.EIGHTIES_MOVIE_TROPES);
  });

  test('records the distributor as a typed DISTRIBUTED_BY edge', () => {
    expect(backToTheFutureUniverse.connections?.references).toContainEqual(
      expect.objectContaining({
        type: 'DISTRIBUTED_BY',
        targetUniverseId: resolveFilmStudio('universal')!.universeId,
      }),
    );
  });
});

describe('every epoch of Back to the Future has an epochId (#19, #182)', () => {
  test('no layer key is substituted for a missing epochId', () => {
    const missing = epochIds(backToTheFutureUniverse).filter((entry) =>
      entry.includes('(missing)'),
    );
    expect(missing).toEqual([]);
  });

  test('the two story calendars keep distinct ids and their spans', () => {
    const epochs = new Map(
      (backToTheFutureUniverse.layers ?? []).flatMap((layer) =>
        Object.entries(layer.epochs ?? {}).map(([key, epoch]) => [key, epoch]),
      ),
    );

    const present = epochs.get('present') as { epochId?: string; start?: bigint };
    const past = epochs.get('past') as { epochId?: string; start?: bigint };

    expect(present.epochId).toBe('bttf:narrative_1985');
    expect(past.epochId).toBe('bttf:narrative_1955');
    expect(present.epochId).not.toBe(past.epochId);
    // 1985-10-26 and 1955-11-05, the two dates the film opens on.
    expect(present.start).toBe(BigInt(Date.UTC(1985, 9, 26)) * 1_000_000n);
    expect(past.start).toBe(BigInt(Date.UTC(1955, 10, 5)) * 1_000_000n);
  });

  test('the registered universe exposes both epoch ids', async () => {
    const registry = new UniverseRegistry(emptyLoader);
    await registry.initialize();
    const epochs = registry.getUniverse(ID)?.epochs ?? {};
    expect(Object.keys(epochs)).toEqual(
      expect.arrayContaining(['bttf:runtime', 'bttf:narrative_1985', 'bttf:narrative_1955']),
    );
  });
});

describe('the trope membership is still declared on the owner (#74, #130)', () => {
  test('the film names the trope it anchors', () => {
    const metadata = backToTheFutureUniverse.metadata as TropeFilmMetadata;
    expect(metadata.tropes).toContain('modified_vehicle_time_machine');
  });
});
