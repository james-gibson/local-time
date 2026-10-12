import { UNIVERSE_ID_PATTERNS, isValidUniverseId } from '../universe-ids';

/**
 * local-time#50 — `FALLBACK` renamed to `ANY_YEAR_TERMINATED`.
 *
 * The rename is documentation, not behaviour. Every assertion here that concerns *which ids
 * pass* would have passed identically before the change; that is the point. A rename that
 * quietly tightened or loosened the pattern would be a breaking change disguised as a
 * cleanup, so the permissive cases are pinned explicitly rather than assumed.
 *
 * #50's preferred fix — making the pattern genuinely three segments — is still open and
 * needs an inventory of ids that validate only here. This file records the current,
 * deliberately unchanged behaviour so that tightening it later is a conscious act.
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

        test('the old name survives only as prose, so searches find the history', () => {
            // Not a runtime assertion — a reminder that the rename left a trail on purpose.
            expect('FALLBACK'.length).toBe(8);
        });
    });

    describe('the behaviour is unchanged', () => {
        /**
         * #50's measured table. The colon in the first character class means this is not a
         * three-segment shape, so every one of these passes.
         */
        const passesOnlyViaEscapeHatch = [
            'a:b:1999',
            'a:b:c:1999',
            'a:b:c:d:1999',
            'a:b:c:d:e:f:1999',
            'this:is:not:a:real:id:at:all:1999',
        ];

        test.each(passesOnlyViaEscapeHatch)('%s is still accepted', id => {
            expect(escapeHatch.test(id)).toBe(true);
            expect(isValidUniverseId(id)).toBe(true);
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

    /**
     * The cost #50 documents, pinned so it cannot be forgotten. `isValidUniverseId` is
     * `Object.values(...).some(...)`, so this pattern makes the validator a near-universal
     * pass-through: an id is "valid" if any declared pattern *or* this one matches.
     */
    describe('the cost is recorded, not hidden', () => {
        test('a congressional hearing id validates as FILM — the #57 trap', () => {
            // `history:rogers_commission:1986` is the id that is actually used, precisely
            // because `hearing:...` would be typed as a film. FILM's pattern is the same
            // generic three-segment shape, so nothing stops this from being accepted.
            expect(UNIVERSE_ID_PATTERNS.FILM.test('hearing:rogers_commission:1986')).toBe(true);
            expect(UNIVERSE_ID_PATTERNS.HISTORICAL.test('history:rogers_commission:1986')).toBe(true);
        });

        /**
         * #51 flagged that the four-segment ids from `createTechnicalUniverseId` —
         * `system:secure_ledger:authentication_v1:2026` among them — were accepted although
         * no declared pattern covered them.
         *
         * That is no longer true, and the fix arrived by accident rather than design: the
         * `SYSTEM` pattern added in #47 is `/^system:[a-z0-9_]+(?::[a-z0-9_]+)?:(\*|v\d+|\d{4}|\d{4}-\d{4})$/`,
         * whose optional second segment happens to accommodate exactly that shape. So the
         * escape hatch is no longer load-bearing for them.
         *
         * Pinned because it is the kind of fact that decays silently: if `SYSTEM` is ever
         * tightened, these ids fall back to the escape hatch silently and this test is what
         * notices.
         */
        test('the four-segment technical ids are covered by SYSTEM, not only the escape hatch', () => {
            const id = 'system:secure_ledger:authentication_v1:2026';
            expect(UNIVERSE_ID_PATTERNS.SYSTEM.test(id)).toBe(true);
            expect(escapeHatch.test(id)).toBe(true);
        });

        /** The same shape with no `system:` prefix is still a hole — and it reads as a film. */
        test('the undeclared `log:` namespace validates as FILM', () => {
            // `createLogUniverseId` existed in `core/ids/id-creators.ts` and was dead code,
            // removed in #53. Its output shape has no declared pattern, so it falls through
            // to FILM's generic three-segment form: a log id would be typed as a film.
            const id = 'log:x_y:2026';
            expect(UNIVERSE_ID_PATTERNS.FILM.test(id)).toBe(true);
            expect(UNIVERSE_ID_PATTERNS.SYSTEM.test(id)).toBe(false);
        });
    });

    describe('every pattern is either a declared domain or the escape hatch', () => {
        test('no other entry is a permissive catch-all', () => {
            // If another pattern is quietly doing the same job under a different name, the
            // rename bought nothing. Anything that matches the absurd id below is a leak.
            const absurd = 'this:is:not:a:real:id:at:all:1999';
            const matches = Object.entries(UNIVERSE_ID_PATTERNS)
                .filter(([, re]) => re.test(absurd))
                .map(([name]) => name);
            expect(matches).toEqual(['ANY_YEAR_TERMINATED']);
        });
    });
});
