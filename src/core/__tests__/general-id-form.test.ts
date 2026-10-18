import {
    createBookUniverseId,
    createPersonalUniverseId,
    isBookUniverseId,
    isFilmUniverseId,
    isHistoricalUniverseId,
    isPersonalUniverseId,
    isValidUniverseId,
    UNIVERSE_ID_PATTERNS,
} from '../universe-ids';

/**
 * The general id form — `<namespace>:<subject>[:<sub>]:<year>`.
 *
 * From `explorations/proposal.md`, whose worked examples are
 * `personal:tolkien:war_experience:1916`, `history:wwi:battle_of_somme:1916`,
 * `literature:sassoon:poems:1916` and `film:lawrence_of_arabia:1962`.
 *
 * The year is not a sort key bolted on: it is the **shared temporal index**. It is what lets a
 * query for `cal:1916` gather a personal experience, a battle, a poem collection and a film
 * without resolving any of them. So the optional middle segment is a grammar feature, and
 * year-termination is a requirement of the form rather than a property of any one namespace.
 *
 * Before this, every four-segment id in the corpus validated **only** through
 * `ANY_YEAR_TERMINATED` — the ids were the design, and no pattern declared them
 * (james-gibson/local-time#50).
 */
describe('the general id form `<ns>:<subject>[:<sub>]:<year>`', () => {
    describe("the proposal's worked examples are declared, not catch-all accidents", () => {
        const cases: Array<[string, string, (id: string) => boolean]> = [
            ['personal:tolkien:war_experience:1916', 'PERSONAL', isPersonalUniverseId],
            ['history:wwi:battle_of_somme:1916', 'HISTORICAL', isHistoricalUniverseId],
            ['literature:sassoon:poems:1916', 'BOOK', isBookUniverseId],
            ['film:lawrence_of_arabia:1962', 'FILM', isFilmUniverseId],
        ];

        test.each(cases)('%s is a declared %s id', (id, _namespace, guard) => {
            expect(guard(id)).toBe(true);
            expect(isValidUniverseId(id)).toBe(true);
        });

        /** The same shapes as the repo actually registers. */
        test.each([
            ['personal:tolkien:wwi_experience:1916', isPersonalUniverseId],
            ['literature:tolkien:lotr:1954', isBookUniverseId],
            ['history:disney:pixar_acquisition:2006', isHistoricalUniverseId],
        ])('%s matches its namespace, not only the catch-all', (id, guard: (value: string) => boolean) => {
            expect(guard(id)).toBe(true);
            const declared = Object.entries(UNIVERSE_ID_PATTERNS)
                .filter(([, re]) => re.test(id))
                .map(([name]) => name)
                .filter((name) => name !== 'ANY_YEAR_TERMINATED');
            expect(declared.length).toBeGreaterThan(0);
        });
    });

    describe('the optional middle segment is exactly that', () => {
        test('omitting it still validates', () => {
            expect(isPersonalUniverseId('personal:tolkien:1916')).toBe(true);
            expect(isHistoricalUniverseId('history:wwi:1916')).toBe(true);
            expect(isBookUniverseId('literature:tolkien:1954')).toBe(true);
        });

        test('a second one is not allowed', () => {
            expect(isPersonalUniverseId('personal:tolkien:a:b:1916')).toBe(false);
            expect(isHistoricalUniverseId('history:a:b:c:1916')).toBe(false);
            expect(isBookUniverseId('literature:tolkien:a:b:1954')).toBe(false);
        });

        test('the trailing year is still required — it is the shared index', () => {
            expect(isPersonalUniverseId('personal:tolkien:war_experience')).toBe(false);
            expect(isHistoricalUniverseId('history:disney:pixar_acquisition')).toBe(false);
            expect(isBookUniverseId('literature:tolkien:lotr')).toBe(false);
        });
    });

    describe('the factories can now express the form they name', () => {
        test('createPersonalUniverseId takes a sub', () => {
            expect(createPersonalUniverseId('tolkien', 1916, 'war_experience'))
                .toBe('personal:tolkien:war_experience:1916');
            // The three-segment call is unchanged.
            expect(createPersonalUniverseId('tolkien', 1916)).toBe('personal:tolkien:1916');
        });

        test('createBookUniverseId takes a sub', () => {
            expect(createBookUniverseId('literature', 'tolkien', 1954, 'lotr'))
                .toBe('literature:tolkien:lotr:1954');
            expect(createBookUniverseId('literature', 'tolkien', 1954)).toBe('literature:tolkien:1954');
        });

        test('what they return passes their own guards', () => {
            expect(isPersonalUniverseId(createPersonalUniverseId('owen', 1916, 'war_poetry'))).toBe(true);
            expect(isBookUniverseId(createBookUniverseId('literature', 'sassoon', 1916, 'poems'))).toBe(true);
        });

        /** `createHistoricalUniverseId` already expresses it: the event itself is namespaced. */
        test('the historical form needs no new parameter', () => {
            expect(isHistoricalUniverseId('history:disney:pixar_acquisition:2006')).toBe(true);
        });
    });

    /**
     * One deliberate exception, pinned so it stays a decision rather than drifting into an
     * accident. FILM is the pattern that doubles as the generic fallback: it is `[a-z0-9_]+` on
     * both sides of the colon, so giving it a third segment would make *any* undeclared
     * four-segment id read as a film — the #57 trap (`hearing:rogers_commission:1986`) widened
     * rather than fixed.
     */
    describe('FILM is deliberately not widened', () => {
        test('the corpus film id of the general form is not a film id', () => {
            expect(UNIVERSE_ID_PATTERNS.FILM.test('film:star_wars:a_new_hope:1977')).toBe(false);
            expect(isFilmUniverseId('film:star_wars:a_new_hope:1977')).toBe(false);
        });

        test('no undeclared four-segment id reads as a film', () => {
            expect(isFilmUniverseId('undeclared_ns:subject:sub:1999')).toBe(false);
            expect(isFilmUniverseId('a:b:c:1999')).toBe(false);
        });

        test('and the three-segment film form is untouched', () => {
            expect(isFilmUniverseId('film:lawrence_of_arabia:1962')).toBe(true);
            expect(isFilmUniverseId('universal:warcraft:2016')).toBe(true);
        });
    });
});
