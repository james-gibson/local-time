import { allUniverses } from '../index';
import { ConfigLoader } from '../../config-loader';
import { UniverseRegistry } from '../../universe-registry';
import { isHistoricalUniverseId } from '../../../core/universe-ids';
import type { Universe } from '../../../core/types';
import * as barrel from './index';

/**
 * james-gibson/local-time#126 / #102.
 *
 * `global-politics/` had no barrel and nothing imported it, so the modules were
 * never evaluated — three of them threw on import. This is the guard that keeps
 * the namespace wired: everything the barrel exports must be in `allUniverses`
 * *and* survive a real registry lookup, which is the half a spread does not
 * prove (an invalid id is dropped with a warning).
 *
 * It also pins the repair: the ids are the intended namespaced historical ids,
 * and the timestamps are nanoseconds, not the milliseconds the modules shipped
 * with.
 */

type UniverseLike = { universeId: string };

const isUniverseLike = (value: unknown): value is UniverseLike =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as UniverseLike).universeId === 'string';

const universesIn = (value: unknown): UniverseLike[] =>
  Array.isArray(value) ? value.filter(isUniverseLike) : isUniverseLike(value) ? [value] : [];

const fromBarrel = (() => {
  const byId = new Map<string, UniverseLike>();
  for (const value of Object.values(barrel)) {
    if (typeof value === 'function') continue;
    for (const universe of universesIn(value)) {
      if (!byId.has(universe.universeId)) byId.set(universe.universeId, universe);
    }
  }
  return [...byId.values()];
})();

const registeredIds = new Set(allUniverses.map((universe) => (universe as UniverseLike).universeId));

describe('the global-politics namespace is wired (#126)', () => {
  test('the barrel exposes the sourced universes', () => {
    expect(fromBarrel.map((universe) => universe.universeId).sort()).toEqual([
      'history:gaza:israel_hamas_war:2023-2025',
      'history:ukraine:path_to_conflict:1991-2014',
    ]);
  });

  test('every exported universe is in allUniverses', () => {
    const missing = fromBarrel
      .filter((universe) => !registeredIds.has(universe.universeId))
      .map((universe) => universe.universeId);
    expect(missing).toEqual([]);
  });

  test('every exported universe survives a registry lookup', () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    const failures: string[] = [];

    for (const universe of fromBarrel) {
      try {
        registry.registerUniverse(universe.universeId, universe as Universe);
        if (!registry.getUniverse(universe.universeId)) failures.push(universe.universeId);
      } catch (error) {
        failures.push(`${universe.universeId}: ${(error as Error).message}`);
      }
    }

    expect(failures).toEqual([]);
  });

  test('the ids are the declared historical shape, not the underscore ranges', () => {
    for (const universe of fromBarrel) {
      expect(isHistoricalUniverseId(universe.universeId)).toBe(true);
    }
  });

  test('timestamps are nanoseconds, not the milliseconds the modules shipped with', () => {
    for (const universe of fromBarrel as Universe[]) {
      const keyframes = universe.temporalStructure?.keyframes ?? [];
      expect(keyframes.length).toBeGreaterThan(0);
      for (const keyframe of keyframes) {
        // 1991 in ns is ~6.8e17 and 2023 is ~1.7e18; the same instants in ms are
        // ~6.8e11 and ~1.7e12. 1e15 separates the two by three orders of magnitude.
        expect(keyframe.timestamp > 1_000_000_000_000_000n).toBe(true);
      }
    }
  });
});
