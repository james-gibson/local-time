import { allUniverses } from './index';
import { ConfigLoader } from '../config-loader';
import { UniverseRegistry } from '../universe-registry';
import { middleEarthUniverse } from './middleEarthUniverse';
import { WELL_KNOWN_UNIVERSES } from '../../core/universe-ids';
import type { Universe } from '../../core/types';

/**
 * james-gibson/local-time#148 — the half of "person-keyed" that a type cannot check.
 *
 * Making `Attribution.creators` person-keyed only says a credit *may* carry a `personId`.
 * The point of the id is that it resolves to a person universe, so this pins the one live
 * credit that does: Tolkien is the writer of *The Lord of the Rings* and his biography is
 * registered. If that id is ever renamed or dropped, this fails here rather than leaving a
 * dangling identity that reads as verified.
 */
describe('a creator credit can name the person universe it resolves to (#148)', () => {
  const tolkiensCredit = (middleEarthUniverse.attribution?.creators ?? []).find(
    (credit) => credit.name === 'J.R.R. Tolkien',
  );

  test('the Tolkien credit is keyed to his biography, not to a slug invented from the name', () => {
    expect(tolkiensCredit?.roles).toEqual(['writer']);
    expect(tolkiensCredit?.personId).toBe(WELL_KNOWN_UNIVERSES.TOLKIEN);
    // The name is what retrieval reads; the id is identity.
    expect(middleEarthUniverse.metadata?.creators).toContain('J.R.R. Tolkien');
  });

  test('the person universe the credit names is registered and retrievable', () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    for (const entry of allUniverses as unknown as unknown[]) {
      for (const universe of Array.isArray(entry) ? entry : [entry]) {
        const id = (universe as { universeId?: string })?.universeId;
        if (id) registry.registerUniverse(id, universe as unknown as Universe);
      }
    }

    expect(tolkiensCredit?.personId).toBeDefined();
    expect(registry.getUniverse(tolkiensCredit!.personId!)).toBeDefined();
  });
});
