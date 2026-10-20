import { allUniverses } from '../index';
import { ConfigLoader } from '../../config-loader';
import { UniverseRegistry } from '../../universe-registry';
import { isHistoricalUniverseId } from '../../../core/universe-ids';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import type { Universe } from '../../../core/types';
import * as barrel from './index';

/**
 * james-gibson/local-time#126 — the `us-politics` sub-notion.
 *
 * The AUMF universe was in the `global-politics/` folder and imported by
 * nothing. It is a US war-powers statute, so it belongs here; this asserts the
 * namespace is wired and the id the previous "fix" produced — a four-segment
 * historical id with a `2001-present` span — is now a declared shape.
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

describe('the us-politics namespace is wired (#126)', () => {
  test('the barrel exposes the AUMF universe under its intended id', () => {
    expect(fromBarrel.map((universe) => universe.universeId)).toEqual([
      'history:us_gov:aumf_2001_usage:2001-present',
    ]);
  });

  test('it is in allUniverses and survives a registry lookup', () => {
    const registry = new UniverseRegistry(new ConfigLoader());

    for (const universe of fromBarrel) {
      expect(registeredIds.has(universe.universeId)).toBe(true);
      expect(isHistoricalUniverseId(universe.universeId)).toBe(true);

      registry.registerUniverse(universe.universeId, universe as Universe);
      expect(registry.getUniverse(universe.universeId)).toBeDefined();
    }
  });

  test('it declares US government and military membership', () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    const universe = fromBarrel[0] as Universe;
    registry.registerUniverse(universe.universeId, universe);

    expect(registry.getMemberships(universe.universeId)).toEqual(
      expect.arrayContaining([CommonUniverseIds.US_GOVERNMENT, CommonUniverseIds.US_MILITARY]),
    );
  });
});
