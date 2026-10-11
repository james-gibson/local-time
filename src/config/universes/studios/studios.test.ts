import {
  isFilmUniverseId,
  isFilmStudioUniverseId,
  createFilmUniverseId,
  createFilmStudioUniverseId,
  GENERIC_FILM_STUDIO_TOKEN,
  UNIVERSE_ID_PATTERNS,
} from '../../../core/universe-ids';
import { ReferenceType } from '../../../core/types';
import {
  FILM_STUDIO_REGISTRY,
  FILM_STUDIO_TOKENS,
  DEFAULT_FILM_STUDIO_TOKEN,
  filmStudioUniverses,
  FILM_STUDIO_SPECS,
  isRegisteredFilmStudio,
  isRegisteredFilmUniverseId,
  resolveFilmStudio,
  resolveStudioBySlug,
  distributorOf,
  filmStudioTokenOf,
  distributedByRef,
} from '../studios';

describe('Film studio universes (local-time#44)', () => {
  describe('Core validates shape, config validates membership', () => {
    test('the FILM pattern accepts any well-formed studio token', () => {
      expect(isFilmUniverseId('disney:frozen:2013')).toBe(true);
      expect(isFilmUniverseId('a_distributor_nobody_registered:title:2020')).toBe(true);
    });

    test('the FILM pattern still rejects malformed IDs', () => {
      expect(isFilmUniverseId('invalid:format')).toBe(false);
      expect(isFilmUniverseId('studio:Title:2020')).toBe(false); // upper case
      expect(isFilmUniverseId('studio:title:202')).toBe(false); // short year
    });

    test('the FILM_STUDIO pattern accepts the institutional span vocabulary', () => {
      expect(isFilmStudioUniverseId('film_studio:mgm:founded')).toBe(true);
      expect(isFilmStudioUniverseId('film_studio:mgm:1924')).toBe(true);
      expect(isFilmStudioUniverseId('film_studio:united_artists:1919-1981')).toBe(true);
      expect(isFilmStudioUniverseId('film_studio:a24:2012-present')).toBe(true);
      expect(isFilmStudioUniverseId('film_studio:mgm:*')).toBe(true);
    });

    test('FILM_STUDIO is its own namespace, disjoint from the film-universe one', () => {
      // The reserved-prefix lookahead is what keeps them apart. `isRegistered-
      // FilmUniverseId` is the check that says a studio actually exists: a
      // well-formed but unregistered studio ID resolves to nothing.
      expect(isFilmStudioUniverseId('film_studio:mgm:1924-present')).toBe(true);
      expect(isFilmUniverseId('film_studio:mgm:1924-present')).toBe(false);

      expect(isFilmStudioUniverseId('film_studio:dreamworks:1994')).toBe(true);
      expect(isRegisteredFilmUniverseId('film_studio:dreamworks:1994')).toBe(false);
      expect(isRegisteredFilmUniverseId('film_studio:mgm:1924-present')).toBe(true);

      // A film whose studio is not registered is still a valid film ID.
      expect(isFilmUniverseId('dreamworks:the_passion_of_the_christ:2004')).toBe(true);
      expect(resolveFilmStudio('dreamworks')).toBeUndefined();
    });

    test('the generic token is the only "unknown studio"', () => {
      expect(DEFAULT_FILM_STUDIO_TOKEN).toBe('film');
      expect(GENERIC_FILM_STUDIO_TOKEN).toBe('film');
      expect(resolveFilmStudio('film')).toBeUndefined();
    });

    test('createFilmUniverseId throws only for malformed fragments', () => {
      expect(() => createFilmUniverseId('nonexistent_studio', 'title', 2020)).not.toThrow();
      expect(() => createFilmUniverseId('disney', '!!!', 2020)).toThrow(); // empty fragment
      expect(() => createFilmUniverseId('disney', 'title', 20)).toThrow(); // short year
    });

    test('createFilmStudioUniverseId normalises and validates', () => {
      expect(createFilmStudioUniverseId('20th Century Fox', 1935)).toBe(
        'film_studio:20th_century_fox:1935',
      );
      expect(createFilmStudioUniverseId('mgm', 'founded')).toBe('film_studio:mgm:founded');
      expect(() => createFilmStudioUniverseId('mgm', 'nonsense')).toThrow();
    });

    test('the FILM pattern is shape-only — only reserved prefixes are core job', () => {
      // The old behaviour: a hardcoded set of studio tokens in src/core. The
      // split means the core pattern accepts any well-formed non-reserved token.
      expect(UNIVERSE_ID_PATTERNS.FILM.source).not.toContain('miramax');
      expect(UNIVERSE_ID_PATTERNS.FILM.source).not.toContain('touchstone_pictures');
      expect(UNIVERSE_ID_PATTERNS.FILM_STUDIO.source).toContain('film_studio');
    });
  });

  describe('The registry is derived from the studio universes', () => {
    test('every spec produced a universe', () => {
      expect(filmStudioUniverses).toHaveLength(FILM_STUDIO_SPECS.length);
    });

    test('every studio universe is well-formed and registered', () => {
      for (const universe of filmStudioUniverses) {
        const id = String(universe.universeId);
        expect(isFilmStudioUniverseId(id)).toBe(true);
        expect(isRegisteredFilmUniverseId(id)).toBe(true);
      }
    });

    test('every token resolves to a real studio universe', () => {
      expect(FILM_STUDIO_TOKENS.length).toBeGreaterThan(20);
      for (const token of FILM_STUDIO_TOKENS) {
        const entry = resolveFilmStudio(token);
        expect(entry).toBeDefined();
        expect(isRegisteredFilmStudio(token)).toBe(true);
        expect(filmStudioUniverseIdsContain(entry!.universeId)).toBe(true);
      }
    });

    test('the classic studios are all registered', () => {
      // The distributors from the issue, and the majors.
      for (const token of [
        '20th_century_fox', '20th_century_studios', 'columbia', 'sony',
        'mgm', 'paramount', 'paramount_pictures', 'universal',
        'warner', 'warner_bros', 'disney',
        'touchstone', 'touchstone_pictures', 'hollywood_pictures',
        'united_artists', 'orion', 'orion_pictures',
        'tristar', 'tristar_pictures', 'miramax',
        'new_line', 'lionsgate', 'a24',
        'lucasfilm', 'marvel_studios', 'pixar', 'saturn', 'saturn_international',
      ]) {
        expect(isRegisteredFilmStudio(token)).toBe(true);
      }
    });

    test('an unregistered token is not a studio', () => {
      expect(isRegisteredFilmStudio('dreamworks')).toBe(false);
      expect(resolveFilmStudio('dreamworks')).toBeUndefined();
    });

    test('studio ids are unique per slug', () => {
      const ids = filmStudioUniverses.map((u) => String(u.universeId));
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('A distributor is a fact as of the film release', () => {
    /** The `Universe` behind a token, for reaching its temporalStructure. */
    const studioUniverse = (token: string) =>
      filmStudioUniverses.find(
        (u) => String(u.universeId) === resolveFilmStudio(token)?.universeId,
      )!;

    test('the token resolves through the film ID, not a current roster', () => {
      expect(distributorOf('20th_century_fox:idiocracy:2006')?.slug).toBe(
        '20th_century_fox',
      );
      expect(distributorOf('touchstone_pictures:dead_poets_society:1989')?.slug).toBe(
        'touchstone_pictures',
      );
      expect(filmStudioTokenOf('pixar:toy_story:1995')).toBe('pixar');
    });

    test('a film with no studio to name resolves to nothing', () => {
      expect(distributorOf('film:mary_poppins:1964')).toBeUndefined();
      expect(distributorOf('film:some_unknown_distributor_film:2020')).toBeUndefined();
    });

    test('Fox was acquired and renamed, but 2006 is unchanged', () => {
      const fox = resolveFilmStudio('20th_century_fox')!;
      const studios = resolveFilmStudio('20th_century_studios')!;

      // Same legal entity, two identities, one continuous span.
      expect(fox.universeId).toBe('film_studio:20th_century_fox:1935-2020');
      expect(studios.universeId).toBe('film_studio:20th_century_studios:1935-present');
      expect(fox.years.replace(/-\d{4}$/, '')).toBe('1935');
    });

    test('the rename and the acquisition are keyframes in the studio universe', () => {
      const fox = studioUniverse('20th_century_fox');
      const keyframeIds = fox.temporalStructure!.keyframes!.map((k) => k.id);

      expect(keyframeIds).toContain('disney_acquisition');
      expect(keyframeIds).toContain('renamed_twentieth_century_studios');

      // The 1935 founding survives as the zero-point of the same universe, so
      // the rename is a change of identity inside one continuous record.
      expect(keyframeIds).toContain('merger');
      expect(fox.temporalStructure!.keyframes![0].tags).toContain('zero-point');
    });

    test('every studio records its founding as a zero-point keyframe', () => {
      const missing = filmStudioUniverses.filter(
        (u) => !u.temporalStructure?.keyframes?.[0]?.tags?.includes('zero-point'),
      );
      expect(missing.map((u) => String(u.universeId))).toEqual([]);
    });

    test('every lineage edge points at a registered studio universe', () => {
      const dangling: string[] = [];
      for (const spec of FILM_STUDIO_SPECS) {
        for (const edge of spec.lineage ?? []) {
          // Lineage is between studios, so it is keyed by slug.
          if (!resolveStudioBySlug(edge.toSlug)) {
            dangling.push(`${spec.slug} -> ${edge.toSlug}`);
          }
          // The edge must be a real ReferenceType member.
          expect(Object.values(ReferenceType)).toContain(edge.type);
        }
      }
      expect(dangling).toEqual([]);
    });

    test('dates that only support a range are recorded as ranges, not fabricated', () => {
      // MGM's founding merger is only recoverable to a spring window.
      const mgm = studioUniverse('mgm');
      const merger = mgm.temporalStructure!.keyframes!.find((k) => k.id === 'merger');

      expect(merger!.dateRange).toBeDefined();
      expect(merger!.certainty).toBeLessThan(1);

      // A firm date carries no range and stays certain.
      const fox = studioUniverse('20th_century_fox');
      const renamed = fox.temporalStructure!.keyframes!.find(
        (k) => k.id === 'renamed_twentieth_century_studios',
      );
      expect(renamed!.dateRange).toBeUndefined();
      expect(renamed!.certainty!).toBeGreaterThan(merger!.certainty!);
    });
  });

  describe('distributedByRef', () => {
    test('builds a reference from a registered token', () => {
      const ref = distributedByRef('20th_century_fox', 'Distributed theatrically.');
      expect(ref.type).toBe('DISTRIBUTED_BY');
      expect(ref.targetUniverseId).toBe('film_studio:20th_century_fox:1935-2020');
      expect(ref.description).toContain('as of this film\'s release');
    });

    test('refuses an unregistered token', () => {
      expect(() => distributedByRef('dreamworks', 'Distributed.')).toThrow(/not a registered/);
    });
  });
});

// Helpers — resolveFilmStudio returns the spec-derived entry, but the
// assertions above want the universe objects, so go through the registry.
function filmStudioUniverseIdsContain(id: string): boolean {
  return filmStudioUniverses.some((u) => String(u.universeId) === id);
}
