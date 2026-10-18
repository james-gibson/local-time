import {
    UNIVERSE_ID_PATTERNS,
    isFilmUniverseId,
    createFilmUniverseId,
} from '../universe-ids';

/**
 * The FILM pattern refuses any studio token in `RESERVED_STUDIO_TOKENS`, which is how
 * `isFilmUniverseId` distinguishes a film universe from a mission, a game, a series or a
 * system spec.
 *
 * That reserved list is a hand-maintained duplicate of the namespace vocabulary, and it
 * drifted twice after #44: `system` was missed when #47 added the `system:` namespace, and
 * `technology` was missed when #49 gave `technology:` a declared pattern. Meanwhile `technical`
 * stayed listed after #49 deleted that namespace — so the list reserved a prefix matching
 * nothing while missing the two that had become real.
 *
 * Nothing caught it because no film studio is named "System" or "Technology".
 *
 * These tests derive the vocabulary from `UNIVERSE_ID_PATTERNS` rather than hardcoding it,
 * so the next namespace added without a reservation fails here.
 */

/**
 * Pull the leading literal token(s) out of a pattern's source.
 *
 * Handles the two shapes the namespace patterns use: a plain literal prefix (`^history:`)
 * and an alternation of literals (`^(nasa|esa|spacex|military):`).
 */
function leadingTokens(source: string): string[] {
    const s = source.replace(/^\^/, '');

    const alternation = s.match(/^\(([a-z0-9_|]+)\)/);
    if (alternation) {
        return alternation[1].split('|').filter(Boolean);
    }

    // A bare literal run up to the first separator. `legal-` keeps its dash, because the
    // LEGAL pattern genuinely claims `legal-<something>:` rather than `legal:`.
    const literal = s.match(/^[a-z0-9_-]+/);
    return literal ? [literal[0].replace(/[-_]+$/, '')] : [];
}

/** Patterns that cannot collide with a 3-segment FILM id, so are not namespace claims. */
const NOT_A_NAMESPACE_CLAIM = new Set(['FILM', 'ANY_YEAR_TERMINATED', 'SPARKLE_FART']);

const namespacePrefixes: string[] = [];
for (const [name, pattern] of Object.entries(UNIVERSE_ID_PATTERNS)) {
    if (NOT_A_NAMESPACE_CLAIM.has(name)) continue;
    namespacePrefixes.push(...leadingTokens(pattern.source));
}

describe('FILM refuses every declared namespace prefix', () => {
    test('the test actually found namespaces to check', () => {
        // Guards against the derivation silently returning [] and every assertion below
        // passing vacuously.
        expect(namespacePrefixes.length).toBeGreaterThan(8);
        expect(namespacePrefixes).toContain('history');
        expect(namespacePrefixes).toContain('nasa');
    });

    test('isFilmUniverseId rejects an id opening with each declared namespace', () => {
        const offenders: string[] = [];
        for (const prefix of namespacePrefixes) {
            const id = `${prefix}:example:2000`;
            if (isFilmUniverseId(id)) offenders.push(id);
        }
        expect(offenders).toEqual([]);
    });

    /**
     * The behavioural half: a caller cannot accidentally mint a film universe whose
     * studio token is another namespace's name.
     */
    test('createFilmUniverseId refuses each declared namespace as a studio', () => {
        const leaked: string[] = [];
        for (const prefix of namespacePrefixes) {
            try {
                leaked.push(String(createFilmUniverseId(prefix, 'example', 2000)));
            } catch {
                // expected
            }
        }
        expect(leaked).toEqual([]);
    });

    /** The two tokens that were missed, pinned explicitly so the drift cannot recur. */
    test('system: and technology: are reserved', () => {
        expect(isFilmUniverseId('system:example:2000')).toBe(false);
        expect(isFilmUniverseId('technology:example:2000')).toBe(false);
        expect(() => createFilmUniverseId('system', 'x', 2000)).toThrow();
        expect(() => createFilmUniverseId('technology', 'x', 2000)).toThrow();
    });

    /**
     * `us:` became a declared domain while closing out #50 — nineteen registered universes
     * (`us:constitution:1787`, `us:amendment:<n>:<year>`) were validating only through the
     * catch-all, and reading as films. Pinned like `system`/`technology` above.
     */
    test('us: is reserved', () => {
        expect(isFilmUniverseId('us:constitution:1787')).toBe(false);
        expect(isFilmUniverseId('us:amendment:11:1795')).toBe(false);
        expect(() => createFilmUniverseId('us', 'x', 2000)).toThrow();
    });

    /** `technical:` was deleted in #49; reserving it was reserving nothing. */
    test('technical: is no longer reserved, because the namespace is gone', () => {
        expect(namespacePrefixes).not.toContain('technical');
    });

    /**
     * Guard the other direction: the reservation must not swallow real studios. These are
     * the distributors #26 named, and they must all keep working.
     */
    test('real studio tokens from issue #26 still work', () => {
        const studios = [
            'touchstone_pictures',
            'miramax',
            'united_artists',
            'saturn_international',
            'a24',
            '20th_century_studios',
            'orion_pictures',
            'tristar_pictures',
        ];
        for (const s of studios) {
            const id = createFilmUniverseId(s, 'some_film', 1987);
            expect(`${s}:${isFilmUniverseId(id)}`).toBe(`${s}:true`);
        }
    });

    /** Longest-first ordering matters: `film_studio` must beat the generic `film`. */
    test('the generic film token still works', () => {
        expect(isFilmUniverseId('film:some_movie:2000')).toBe(true);
        expect(isFilmUniverseId('film_studio:disney:1990')).toBe(false);
    });
});