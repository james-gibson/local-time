import {
    createTechnologyUniverseId,
    isTechnologyUniverseId,
    isTechnicalUniverseId,
    isValidUniverseId,
    UNIVERSE_ID_PATTERNS,
    TechnologyUniverseId,
} from '../universe-ids';

/**
 * local-time#21 — `createTechnologyUniverseId` could not return.
 *
 * It built `technology:${name}:*` and validated it against
 * `TECHNICAL: /^technical:.*:(\*)$/`. The prefixes differed, so every call threw. No
 * callers existed, which is why a permanently-throwing function went unnoticed.
 *
 * The root cause was a naming disagreement that ran three ways: the factory was
 * "technology", the type was `TechnicalUniverseId`, and the pattern was `technical:`.
 * Two of the three names matched nothing in the data.
 */
describe('technology universe IDs (local-time#21)', () => {
    describe('createTechnologyUniverseId', () => {
        /** The regression itself: this threw for every possible argument. */
        test('returns an id instead of throwing', () => {
            expect(createTechnologyUniverseId('electric_telegraph'))
                .toBe('technology:electric_telegraph:*');
        });

        test('normalises free text into a single segment', () => {
            expect(createTechnologyUniverseId('Electric Telegraph'))
                .toBe('technology:electric_telegraph:*');
            expect(createTechnologyUniverseId('  World-Wide Web  '))
                .toBe('technology:world_wide_web:*');
            expect(createTechnologyUniverseId('Transistor Invention'))
                .toBe('technology:transistor_invention:*');
        });

        test('what it returns passes its own validator', () => {
            const id = createTechnologyUniverseId('penicillin');
            expect(isTechnologyUniverseId(id)).toBe(true);
            expect(isValidUniverseId(id)).toBe(true);
        });

        test('rejects a name that normalises to nothing', () => {
            expect(() => createTechnologyUniverseId('!!!')).toThrow(
                /Invalid technology universe ID format/,
            );
        });
    });

    describe('the TECHNOLOGY pattern', () => {
        test('accepts a wildcard span, which is what the factory emits', () => {
            expect(UNIVERSE_ID_PATTERNS.TECHNOLOGY.test('technology:electric_telegraph:*'))
                .toBe(true);
        });

        /**
         * These are the ids the repository actually uses. Before #21 the pattern
         * rejected all of them — wildcard-only span — and they validated solely
         * through ANY_YEAR_TERMINATED rather than as a declared domain.
         */
        test.each([
            'technology:sccs:1972',
            'technology:rcs:1982',
            'technology:cvs:1986',
            'technology:subversion:2000',
            'technology:bitkeeper:2000',
            'technology:git:2005',
            'technology:mercurial:2005',
            'technology:electric_telegraph:1837',
            'technology:penicillin:1928',
            'technology:transistor:1947',
            'technology:world_wide_web:1989',
        ])('accepts the real universe id %s', id => {
            expect(UNIVERSE_ID_PATTERNS.TECHNOLOGY.test(id)).toBe(true);
            expect(isTechnologyUniverseId(id)).toBe(true);
        });

        test('accepts the span vocabulary used by the other ranged patterns', () => {
            expect(UNIVERSE_ID_PATTERNS.TECHNOLOGY.test('technology:arpanet:1969-1983')).toBe(true);
            expect(UNIVERSE_ID_PATTERNS.TECHNOLOGY.test('technology:printing:1440-present')).toBe(true);
        });

        test('rejects the old technical: namespace, which no universe uses', () => {
            expect(UNIVERSE_ID_PATTERNS.TECHNOLOGY.test('technical:anything:*')).toBe(false);
            expect(isTechnologyUniverseId('technical:anything:*')).toBe(false);
        });

        test('rejects malformed shapes', () => {
            expect(UNIVERSE_ID_PATTERNS.TECHNOLOGY.test('technology:no_span')).toBe(false);
            expect(UNIVERSE_ID_PATTERNS.TECHNOLOGY.test('technology:a:b:1999')).toBe(false);
            expect(UNIVERSE_ID_PATTERNS.TECHNOLOGY.test('Technology:Git:2005')).toBe(false);
            // `career` / `founded` are span words for organisations, not technologies.
            expect(UNIVERSE_ID_PATTERNS.TECHNOLOGY.test('technology:git:career')).toBe(false);
        });
    });

    describe('back-compat aliases', () => {
        test('isTechnicalUniverseId still resolves and now tracks technology:', () => {
            expect(isTechnicalUniverseId('technology:git:2005')).toBe(true);
            expect(isTechnicalUniverseId('technical:git:*')).toBe(false);
        });

        test('the brand type still names the same thing', () => {
            const id: TechnologyUniverseId = createTechnologyUniverseId('git');
            expect(isTechnicalUniverseId(id)).toBe(true);
        });
    });

    /**
     * The alias must behave identically, or the deprecation is a trap rather than a
     * courtesy. Same for the type: the two names must stay one type.
     */
    test('isTechnologyUniverseId and isTechnicalUniverseId agree on every input', () => {
        const samples = [
            'technology:git:2005', 'technology:git:*', 'technology:a:b:1999',
            'technical:git:*', 'history:costco:1983', 'film:mary_poppins:1964',
            '', 'technology:', 'TECHNOLOGY:git:2005',
        ];
        for (const id of samples) {
            expect(`${id}:${isTechnologyUniverseId(id) === isTechnicalUniverseId(id)}`)
                .toBe(`${id}:true`);
        }
    });
});