import { allUniverses } from '../index';
import { ConfigLoader } from '../../config-loader';
import { UniverseRegistry } from '../../universe-registry';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { FILM_STUDIO_SPECS, filmStudioUniverses } from './index';
import type { Universe } from '../../../core/types';

/**
 * james-gibson/local-time#111.
 *
 * `studios/studios.ts` defines one `film_studio:<slug>:<span>` universe per
 * distributor, but they were never spread into `allUniverses`, so
 * `UniverseRegistry` never registered them. `studios.test.ts` did not catch it
 * because that suite checks the *config-layer* registry
 * (`isRegisteredFilmStudio`) — a different meaning of "registered" from the
 * `UniverseRegistry`.
 *
 * Two things break when the containers are unregistered:
 *
 * 1. `registry.getOwner('film_studio:20th_century_fox:1935-2020')` is `undefined`.
 * 2. Containment cannot transit. A film is a member of its studio container and the
 *    studio is a member of `HOLLYWOOD_SYSTEM`, but with the studio unregistered the
 *    parent chain stops at the studio — so
 *    `contains(HOLLYWOOD_SYSTEM, '20th_century_fox:titanic:1997')` was false.
 *
 * Both halves are asserted against a *real* registry, per the #27/#67 invariant: a
 * universe is registered iff it is reachable in `allUniverses` *and* retrievable after.
 */

const universes = filmStudioUniverses as unknown as Universe[];
const ids = universes.map((universe) => String(universe.universeId));

/** Every id present in `allUniverses`, flattened (a nested collection must not hide one). */
const registeredIds = new Set(
  (allUniverses as unknown as unknown[]).flatMap((entry) =>
    (Array.isArray(entry) ? entry : [entry]).map(
      (universe) => (universe as { universeId?: string })?.universeId,
    ),
  ),
);

/** A registry populated the way `built-in-universes.ts` populates it. */
const registry = (() => {
  const instance = new UniverseRegistry(new ConfigLoader());
  for (const entry of allUniverses as unknown as unknown[]) {
    for (const universe of Array.isArray(entry) ? entry : [entry]) {
      const id = (universe as { universeId?: string })?.universeId;
      if (id) instance.registerUniverse(id, universe as never);
    }
  }
  return instance;
})();

describe('every film_studio: universe is registered (james-gibson/local-time#111)', () => {
  test('the suite is not vacuous — studios are defined', () => {
    expect(FILM_STUDIO_SPECS.length).toBeGreaterThan(0);
    expect(ids.length).toBe(FILM_STUDIO_SPECS.length);
  });

  test('every studio universe is spread into allUniverses', () => {
    const missing = ids.filter((id) => !registeredIds.has(id));
    expect(missing).toEqual([]);
  });

  test('every studio universe survives a real registry lookup', () => {
    const failures = ids.filter((id) => registry.getOwner(id) === undefined);
    expect(failures).toEqual([]);
  });

  test('a studio container is a member of HOLLYWOOD_SYSTEM', () => {
    const fox = 'film_studio:20th_century_fox:1935-2020';
    expect(registeredIds.has(fox)).toBe(true);
    expect(registry.getMemberships(fox)).toEqual(
      expect.arrayContaining([CommonUniverseIds.HOLLYWOOD_SYSTEM]),
    );
  });

  test('containment transits from a film, through its studio, up to HOLLYWOOD_SYSTEM', () => {
    // `20th_century_fox:titanic:1997` is owned by the Cameron filmography and a member
    // of the Fox studio container (james-cameron.ts `foxRelease`); the studio declares
    // membership of HOLLYWOOD_SYSTEM. The chain must reach the top.
    const titanic = '20th_century_fox:titanic:1997';
    expect(registry.contains(CommonUniverseIds.HOLLYWOOD_SYSTEM, titanic)).toBe(true);
  });
});
