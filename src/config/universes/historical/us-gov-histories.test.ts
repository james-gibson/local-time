import { isHistoricalUniverseId, isValidUniverseId } from '../../../core/universe-ids';
import { allUniverses } from '../index';
import { usMilitaryOperationsUniverse } from './us-military';
import { usNativeAmericanPolicyUniverse } from './us-policy';

/**
 * The two `us_gov` histories — james-gibson/local-time#50.
 *
 * Both files carry a `@universe` docblock recording the id the author intended, and in both the
 * code disagreed with its own docblock: each passed an already-namespaced event to
 * `.historical()`, which prefixes the namespace itself, so the universe registered under a
 * **doubled** prefix and a year that matched neither the docblock nor the content.
 *
 *     us-military.ts  documented history:us_gov_military_operations:1870-1989
 *                     registered history:history:us_gov:timeline:1981
 *     us-policy.ts    documented history:us_native_american_policy:1787-present
 *                     registered history:history:us_gov_native_american:1787
 *
 * The docblock is the checkable half of this: an id a reader can compare against. These tests pin
 * the ids to their documented values, and pin the defect class — an id must never repeat its own
 * namespace segment.
 */

const DOCUMENTED: Array<[string, { universeId: string | unknown }, string]> = [
  ['us-military', usMilitaryOperationsUniverse, 'history:us_gov_military_operations:1870-1989'],
  ['us-policy', usNativeAmericanPolicyUniverse, 'history:us_native_american_policy:1787-present'],
];

describe('the us_gov histories register the ids their docblocks document (#50)', () => {
  test.each(DOCUMENTED)('%s', (_name, universe, expected) => {
    expect(universe.universeId).toBe(expected);
    expect(isValidUniverseId(universe.universeId as string)).toBe(true);
    // The domain, not just the catch-all.
    expect(isHistoricalUniverseId(universe.universeId as string)).toBe(true);
  });

  test('no id repeats its own namespace segment', () => {
    const offenders = DOCUMENTED.map(([, universe]) => universe.universeId as string).filter(
      (id) => id.split(':')[0] === id.split(':')[1],
    );
    expect(offenders).toEqual([]);
  });

  test('each is registered in allUniverses exactly once', () => {
    const ids = DOCUMENTED.map(([, universe]) => universe.universeId as string);
    for (const id of ids) {
      const count = allUniverses.filter(
        (u) => (u as { universeId?: string }).universeId === id,
      ).length;
      expect(`${id}: ${count}`).toBe(`${id}: 1`);
    }
  });
});
