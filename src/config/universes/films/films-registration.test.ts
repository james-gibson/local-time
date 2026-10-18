import { allUniverses } from '../index';
import { ConfigLoader } from '../../config-loader';
import { UniverseRegistry } from '../../universe-registry';
import * as filmsBarrel from './index';
import { apollo13FilmUniverse } from './apollo13-film';

/**
 * james-gibson/local-time#67.
 *
 * `films.ts` shadowed `films/index.ts`, so the entire subtree never executed: 28 universes
 * were defined and unreachable, and the registry could not tell them apart from universes
 * deliberately excluded (its own `loadBuiltInUniverses` skips invalid entries with a
 * warning). This is the films half of the guard added for
 * james-gibson/local-time#27.
 */

type UniverseLike = { universeId: string };

const isUniverseLike = (value: unknown): value is UniverseLike =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as UniverseLike).universeId === 'string';

const universesIn = (value: unknown): UniverseLike[] =>
  Array.isArray(value) ? value.filter(isUniverseLike) : isUniverseLike(value) ? [value] : [];

const registeredIds = new Set(allUniverses.map((u) => (u as UniverseLike).universeId));

/**
 * Every universe defined under `films/`.
 *
 * The barrel is deduplicated by id because it exports both the individual universes and
 * the arrays that group them (`marvelFilmUniverses`, `starWarsUniverses`, …). `Apollo 13`
 * is added explicitly: it is wired straight into `../index`, not re-exported here.
 */
const filmsUniverses: Array<{ name: string; universe: UniverseLike }> = (() => {
  const byId = new Map<string, { name: string; universe: UniverseLike }>();
  for (const [name, value] of Object.entries(filmsBarrel)) {
    if (typeof value === 'function') continue;
    for (const universe of universesIn(value)) {
      if (!byId.has(universe.universeId)) byId.set(universe.universeId, { name, universe });
    }
  }
  byId.set('apollo13FilmUniverse', { name: 'apollo13-film', universe: apollo13FilmUniverse });
  return [...byId.values()];
})();

describe('every universe defined under films/ is registered', () => {
  test('the walk is not vacuous', () => {
    // 24 Marvel + Die Hard + Alien + Home Alone + Lucasfilm Star Wars + 3 20th Century Fox
    // majors + Star Wars (A New Hope) + Idiocracy + 2 Columbia + 3 top-level films.
    expect(filmsUniverses.length).toBeGreaterThanOrEqual(30);
  });

  test('nothing reachable from films/ is missing from allUniverses', () => {
    const missing = filmsUniverses
      .filter(({ universe }) => !registeredIds.has(universe.universeId))
      .map(({ name, universe }) => `${name} -> ${universe.universeId}`);

    expect(missing).toEqual([]);
  });

  /**
   * The half a spread into `allUniverses` does not prove: a malformed id is dropped by the
   * registry with a warning, so it can be present in the array and absent from every
   * query (the Ed Sheeran failure in #27).
   */
  test('every films universe survives a real registry lookup', () => {
    const registry = new UniverseRegistry(new ConfigLoader());

    const failures: string[] = [];
    for (const { name, universe } of filmsUniverses) {
      const id = universe.universeId;
      try {
        registry.registerUniverse(id, universe as never);
        if (!registry.getUniverse(id)) failures.push(`${name} -> ${id}`);
      } catch (error) {
        failures.push(`${name} -> ${id}: ${(error as Error).message}`);
      }
    }

    expect(failures).toEqual([]);
  });
});
