import { marvelFilmUniverses } from '../films/marvel';
import {
    getMarvelFilmNotables,
    marvelFilmNotables,
    marvel_phase_one_notables,
    marvel_phase_two_notables,
} from './marvel';

/**
 * james-gibson/local-time#27, the notables half.
 *
 * `marvel/phase_*_notables` are not universes — they carry no `universeId` and never were
 * spreadable into `allUniverses`. The defect was that they were exported and read by
 * nothing. They are now attached to the `films/marvel` universes they describe; these
 * tests fail if that link breaks, or if a film's notables silently stop matching.
 *
 * The film universes themselves are unreachable from `allUniverses` today because of
 * james-gibson/local-time#67, which is why this imports `../films/marvel` directly.
 */
describe('Marvel film notables are attached, not orphaned', () => {
    test('every notables entry maps onto a film universe we define', () => {
        const filmIds = new Set(
            marvelFilmUniverses.map((u) => String(u.universeId)),
        );

        const orphans = Object.keys(marvelFilmNotables).filter(
            (key) => !filmIds.has(key.replace(/^marvel:/, 'marvel_studios:')),
        );

        expect(orphans).toEqual([]);
    });

    test('the attached notables are the ones the lookup returns', () => {
        for (const universe of marvelFilmUniverses) {
            const id = String(universe.universeId);
            const expected = getMarvelFilmNotables(id);
            const attached = (universe.metadata as { notables?: unknown } | undefined)?.notables;

            expect(`${id}:${JSON.stringify(attached) === JSON.stringify(expected)}`).toBe(`${id}:true`);
        }
    });

    test('phases one and two attach, and a later phase carries none', () => {
        const phases = { ...marvel_phase_one_notables, ...marvel_phase_two_notables };
        const withNotables = marvelFilmUniverses.filter(
            (u) => (u.metadata as { notables?: unknown } | undefined)?.notables !== undefined,
        );

        expect(withNotables).toHaveLength(Object.keys(phases).length);

        const ironMan = marvelFilmUniverses.find((u) => String(u.universeId) === 'marvel_studios:iron_man:2008');
        expect((ironMan!.metadata as any).notables.director).toBe('Jon Favreau');

        const endgame = marvelFilmUniverses.find((u) => String(u.universeId) === 'marvel_studios:avengers_endgame:2019');
        expect((endgame!.metadata as { notables?: unknown }).notables).toBeUndefined();
        expect(getMarvelFilmNotables('marvel_studios:avengers_endgame:2019')).toBeUndefined();
    });

    test('the lookup ignores the studio segment, since notables are keyed by namespace', () => {
        expect(getMarvelFilmNotables('marvel_studios:iron_man:2008')).toBe(
            marvel_phase_one_notables['marvel:iron_man:2008'],
        );
        expect(getMarvelFilmNotables('not-a-universe')).toBeUndefined();
    });
});
