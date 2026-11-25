import {
    UNIVERSE_ID_PATTERNS,
    isFilmUniverseId,
    isValidUniverseId,
} from '../universe-ids';

/**
 * local-time#50 — the escape hatch's arity.
 *
 * `FALLBACK` was renamed `ANY_YEAR_TERMINATED` as documentation, then tightened from
 * `[a-z0-9_:]+` to `[a-z0-9_]+` so it is a genuine three-segment pattern. What made the
 * tightening safe was the inventory: exactly one registered id relied on it,
 * `film:star_wars:a_new_hope:1977`, and that id got a declared shape (`FILM_SERIES`)
 * rather than a widened FILM.
 *
 * What remains permissive is deliberate: an *undeclared three-segment* domain still
 * passes, because a recorder may not know the domain yet and the year is the shared
 * temporal index. That is why `hearing:rogers_commission:1986` still reads as a film —
 * the #57 trap, which tightening the arity does not fix.
 */
describe('ANY_YEAR_TERMINATED (#50)', () => {
    const escapeHatch = UNIVERSE_ID_PATTERNS.ANY_YEAR_TERMINATED;

    describe('the rename', () => {
        test('the pattern is named for what it does', () => {
            expect(Object.keys(UNIVERSE_ID_PATTERNS)).toContain('ANY_YEAR_TERMINATED');
        });

        test('the old name is gone from the pattern table', () => {
            expect(Object.keys(UNIVERSE_ID_PATTERNS)).not.toContain('FALLBACK');
            expect('FALLBACK' in UNIVERSE_ID_PATTERNS).toBe(false);
        });
    });

    describe('the arity is three, not "any"', () => {
        test('an undeclared three-segment domain still passes', () => {
            expect(escapeHatch.test('a:b:1999')).toBe(true);
            expect(isValidUniverseId('a:b:1999')).toBe(true);
        });

        test.each([
            ['four segments', 'a:b:c:1999'],
            ['five segments', 'a:b:c:d:1999'],
            ['seven segments', 'a:b:c:d:e:f:1999'],
            ['the absurd id', 'this:is:not:a:real:id:at:all:1999'],
        ])('%s is rejected now', (_label, id) => {
            expect(escapeHatch.test(id as string)).toBe(false);
            expect(isValidUniverseId(id as string)).toBe(false);
        });

        test.each([
            ['not a four-digit year suffix', 'a:b:c'],
            ['two-digit year', 'a:b:99'],
            ['five-digit year', 'a:b:19999'],
            ['uppercase segment', 'A:b:1999'],
            ['no segments at all', 'b1999'],
        ])('%s is still rejected', (_label, id) => {
            expect(escapeHatch.test(id as string)).toBe(false);
        });
    });

    describe('the one corpus id that relied on it is declared', () => {
        const starWars = 'film:star_wars:a_new_hope:1977';

        test('FILM_SERIES covers it; FILM itself is still three-segment', () => {
            expect(UNIVERSE_ID_PATTERNS.FILM.test(starWars)).toBe(false);
            expect(UNIVERSE_ID_PATTERNS.FILM_SERIES.test(starWars)).toBe(true);
            expect(isFilmUniverseId(starWars)).toBe(true);
            expect(isValidUniverseId(starWars)).toBe(true);
        });

        test('the series list is closed, so a new token is not silently a film', () => {
            expect(isFilmUniverseId('film:star_trek:the_motion_picture:1979')).toBe(false);
            expect(isValidUniverseId('film:star_trek:the_motion_picture:1979')).toBe(false);
        });
    });

    /**
     * The cost #50 documents and does not fix. `isValidUniverseId` is
     * `Object.values(...).some(...)`, so a three-segment id in an undeclared domain is still
     * valid — and FILM's generic shape still accepts it as a film.
     */
    describe('the cost that remains is three-segment, not arity', () => {
        test('a congressional hearing id validates as FILM — the #57 trap', () => {
            expect(UNIVERSE_ID_PATTERNS.FILM.test('hearing:rogers_commission:1986')).toBe(true);
            expect(UNIVERSE_ID_PATTERNS.HISTORICAL.test('history:rogers_commission:1986')).toBe(true);
        });

        test('the four-segment technical ids are covered by SYSTEM, not only the escape hatch', () => {
            const id = 'system:secure_ledger:authentication_v1:2026';
            expect(UNIVERSE_ID_PATTERNS.SYSTEM.test(id)).toBe(true);
            expect(isValidUniverseId(id)).toBe(true);
            // The escape hatch no longer reaches four segments at all.
            expect(escapeHatch.test(id)).toBe(false);
        });

        test('the undeclared `log:` namespace still validates as FILM', () => {
            const id = 'log:x_y:2026';
            expect(UNIVERSE_ID_PATTERNS.FILM.test(id)).toBe(true);
            expect(UNIVERSE_ID_PATTERNS.SYSTEM.test(id)).toBe(false);
        });
    });

    describe('no pattern is a catch-all over arity', () => {
        test('nothing matches an absurd seven-segment id', () => {
            const absurd = 'this:is:not:a:real:id:at:all:1999';
            const matches = Object.entries(UNIVERSE_ID_PATTERNS)
                .filter(([, re]) => re.test(absurd))
                .map(([name]) => name);
            expect(matches).toEqual([]);
        });

        test('the escape hatch is the only pattern that accepts an unknown three-segment domain', () => {
            const id = 'undeclared_domain:subject:1999';
            const matches = Object.entries(UNIVERSE_ID_PATTERNS)
                .filter(([, re]) => re.test(id))
                .map(([name]) => name);
            // FILM still matches because it is the generic three-segment shape (#57).
            expect(matches).toEqual(['FILM', 'ANY_YEAR_TERMINATED']);
        });
    });
});
