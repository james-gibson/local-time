import {
    createUSUniverseId,
    isUSUniverseId,
    isFilmUniverseId,
    isValidUniverseId,
    UNIVERSE_ID_PATTERNS,
} from '../universe-ids';

/**
 * The `us:` domain — james-gibson/local-time#50.
 *
 * `us:` was a de-facto domain long before it was a declared one. Nineteen registered
 * universes use it — `us:constitution:1787`, `us:bill_of_rights:1791`, and amendments 11-27 as
 * `us:amendment:<n>:<year>` — and every one of them validated **only** through
 * `ANY_YEAR_TERMINATED`. So the domain that orders them had no shape, and `us:` read as a
 * *film* to `isFilmUniverseId`.
 *
 * The trailing year is the point of the domain, not a limitation of it: it is what lets a
 * `us:` id be sorted and grouped by year, and by decade, without a lookup. That is exactly what
 * an event that is hard to fit into a finer domain needs. These tests pin that property, so a
 * later "simplification" of the pattern cannot quietly take it away.
 */
describe('us: universe IDs (james-gibson/local-time#50)', () => {
    describe('createUSUniverseId', () => {
        test('builds the three-segment form', () => {
            expect(createUSUniverseId('constitution', 1787)).toBe('us:constitution:1787');
        });

        test('builds the four-segment form for a numbered series member', () => {
            expect(createUSUniverseId('amendment', 1795, 11)).toBe('us:amendment:11:1795');
            expect(createUSUniverseId('amendment', 1933, 21)).toBe('us:amendment:21:1933');
        });

        test('normalises free text in either part', () => {
            expect(createUSUniverseId('Bill of Rights', 1791)).toBe('us:bill_of_rights:1791');
            expect(createUSUniverseId('Bill-of-Rights', 1791)).toBe('us:bill_of_rights:1791');
        });

        test('what it returns passes its own validator', () => {
            const id = createUSUniverseId('amendment', 1865, 13);
            expect(isUSUniverseId(id)).toBe(true);
            expect(isValidUniverseId(id)).toBe(true);
        });

        test('rejects a subject or sub that normalises to nothing', () => {
            expect(() => createUSUniverseId('!!!', 2000)).toThrow(
                /subject and sub must normalise to something/,
            );
            expect(() => createUSUniverseId('amendment', 2000, '???')).toThrow(
                /subject and sub must normalise to something/,
            );
        });

        test('rejects a non-four-digit year', () => {
            expect(() => createUSUniverseId('constitution', 87)).toThrow(/Invalid us universe ID/);
            expect(() => createUSUniverseId('constitution', 17870)).toThrow(
                /Invalid us universe ID/,
            );
        });
    });

    describe('the US pattern', () => {
        /** The ids the corpus actually registers. */
        const inUse = [
            'us:constitution:1787',
            'us:bill_of_rights:1791',
            'us:amendment:11:1795',
            'us:amendment:13:1865',
            'us:amendment:18:1919',
            'us:amendment:21:1933',
            'us:amendment:27:1992',
        ];

        test.each(inUse)('%s is a declared us: id, not a catch-all accident', (id) => {
            expect(UNIVERSE_ID_PATTERNS.US.test(id)).toBe(true);
            expect(isUSUniverseId(id)).toBe(true);
        });

        /**
         * Before the domain was declared these matched `ANY_YEAR_TERMINATED` and nothing else.
         * The point of the pattern is that this is no longer true.
         */
        test('the US pattern is what matches them, not only ANY_YEAR_TERMINATED', () => {
            const declared = inUse
                .map((id) => Object.entries(UNIVERSE_ID_PATTERNS).filter(([, re]) => re.test(id)))
                .flatMap((matches) => matches.map(([name]) => name))
                .filter((name) => name !== 'ANY_YEAR_TERMINATED');
            expect(new Set(declared)).toEqual(new Set(['US']));
        });

        /** The domain is claimed: `us:` must not also read as a film. */
        test('FILM refuses the domain', () => {
            for (const id of inUse) expect(isFilmUniverseId(id)).toBe(false);
        });

        test('caps at one optional middle segment', () => {
            expect(UNIVERSE_ID_PATTERNS.US.test('us:a:b:1999')).toBe(true);
            expect(UNIVERSE_ID_PATTERNS.US.test('us:a:b:c:1999')).toBe(false);
        });

        /**
         * The year is required and singular. A subject whose period genuinely runs belongs in
         * its timeline (epochs/segments), not in its id — and admitting a span here would take
         * away the one property the domain exists to provide.
         */
        test('is year-terminated: no wildcard and no span', () => {
            expect(UNIVERSE_ID_PATTERNS.US.test('us:constitution:*')).toBe(false);
            expect(UNIVERSE_ID_PATTERNS.US.test('us:constitution:1787-present')).toBe(false);
            expect(UNIVERSE_ID_PATTERNS.US.test('us:constitution:1787-1791')).toBe(false);
        });
    });

    /**
     * The affordance the year-terminated shape buys, asserted so it cannot be lost.
     */
    describe('the trailing year is sortable and decade-groupable from the id alone', () => {
        const yearOf = (id: string): number => Number(id.split(':').at(-1));
        const decadeOf = (id: string): number => Math.floor(yearOf(id) / 10) * 10;

        test('sorts chronologically as strings would not', () => {
            const ids = [
                'us:amendment:27:1992',
                'us:amendment:13:1865',
                'us:amendment:11:1795',
                'us:amendment:21:1933',
            ];
            expect([...ids].sort((a, b) => yearOf(a) - yearOf(b))).toEqual([
                'us:amendment:11:1795',
                'us:amendment:13:1865',
                'us:amendment:21:1933',
                'us:amendment:27:1992',
            ]);
        });

        test('groups into decades without a lookup', () => {
            expect(decadeOf('us:amendment:11:1795')).toBe(1790);
            expect(decadeOf('us:amendment:18:1919')).toBe(1910);
            expect(decadeOf('us:amendment:21:1933')).toBe(1930);
            expect(decadeOf('us:constitution:1787')).toBe(1780);
        });
    });
});
