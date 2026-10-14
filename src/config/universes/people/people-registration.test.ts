import { allUniverses } from '../index';
import { ConfigLoader } from '../../config-loader';
import { UniverseRegistry } from '../../universe-registry';
import * as peopleBarrel from './index';
import { jamesCameronFilmography } from './james-cameron';
import { edSheeranCopyrightTrial2023Universe } from './ed-sheeran';
import { trumpAssassinationAttemptUniverse } from './trump';
import { hillaryClintonUniverses } from './hillary-clinton';
import { hillaryClintonConspiracyTheoriesUniverses } from './clinton-conspiracy-theories';
import { hillaryClintonConspiracyRebuttalsUniverses } from './clinton-conspiracy-rebuttals';

/**
 * james-gibson/local-time#27.
 *
 * A universe defined under `people/` used to build at module scope, get exported from the
 * barrel, and never be spread into `allUniverses` — constructed, validated and discarded,
 * with nothing failing. Worse, a universe that *was* in `allUniverses` could still be
 * dropped by the registry if its id was malformed, since `loadBuiltInUniverses` skips
 * invalid entries with a warning (that is exactly what happened to Ed Sheeran).
 *
 * So this asserts both halves of "registered": present in `allUniverses`, *and* retrievable
 * from the registry afterwards.
 *
 * Deliberately scoped to `people/`. The same property fails repository-wide today because
 * `./films.ts` shadows `./films/index.ts`, so the entire `films/` subtree never loads —
 * that is james-gibson/local-time#67, tracked separately.
 */

/** The one thing a value needs for these tests to treat it as a universe. */
type UniverseLike = { universeId: string };

const isUniverseLike = (value: unknown): value is UniverseLike =>
    typeof value === 'object' &&
    value !== null &&
    typeof (value as UniverseLike).universeId === 'string';

/**
 * A universe, or an array of universes, contributes its members. Anything else — the
 * Marvel notables objects, the `getMarvelFilmNotables` helper — contributes nothing.
 */
const universesIn = (value: unknown): UniverseLike[] =>
    Array.isArray(value) ? value.filter(isUniverseLike) : isUniverseLike(value) ? [value] : [];

const registeredIds = new Set(allUniverses.map((u) => (u as UniverseLike).universeId));

/**
 * Every universe defined under `people/`, from two sources:
 *
 * - the barrel `./index`, walked dynamically so a newly added and re-exported universe is
 *   covered without editing this list; and
 * - the universes wired straight into `../index` rather than re-exported from the barrel
 *   (the #8 Hillary Clinton work), which the barrel walk cannot see.
 */
const peopleUniverses: Array<{ name: string; universe: UniverseLike }> = [
    ...Object.entries(peopleBarrel),
    ['hillaryClintonUniverses', hillaryClintonUniverses] as const,
    ['hillaryClintonConspiracyTheoriesUniverses', hillaryClintonConspiracyTheoriesUniverses] as const,
    ['hillaryClintonConspiracyRebuttalsUniverses', hillaryClintonConspiracyRebuttalsUniverses] as const,
].flatMap(([name, value]) =>
    universesIn(value).map((universe) => ({ name, universe })),
);

describe('every universe defined under people/ is registered', () => {
    test('the walk is not vacuous — it really does find universes', () => {
        // If the barrel is reshaped and the collector starts matching nothing, the
        // "nothing missing" test below would pass for the wrong reason. Pin a floor:
        // 9 Cameron + 1 Sheeran + 1 Trump + 6 Williams + 2 biography = 19.
        expect(peopleUniverses.length).toBeGreaterThanOrEqual(19);
    });

    test('nothing reachable from people/ is missing from allUniverses', () => {
        const missing = peopleUniverses
            .filter(({ universe }) => !registeredIds.has(universe.universeId))
            .map(({ name, universe }) => `${name} -> ${universe.universeId}`);

        expect(missing).toEqual([]);
    });

    /**
     * The half that a spread into `allUniverses` does not prove. `loadBuiltInUniverses`
     * swallows a malformed id and warns, so a universe can be in the array and still be
     * absent from the registry — the Ed Sheeran case, whose id was
     * `history:ed_sheeran_'thinking_out_loud'_copyright_trial:2023-2023`.
     */
    test('every people universe survives a real registry lookup', () => {
        const registry = new UniverseRegistry(new ConfigLoader());

        const failures: string[] = [];
        for (const { name, universe } of peopleUniverses) {
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

    /**
     * The collections #27 named, pinned by name so a regression reports them directly
     * rather than only through the aggregate above.
     */
    test('the #27 collections are wired, not merely defined', () => {
        expect(jamesCameronFilmography.length).toBeGreaterThan(0);
        for (const id of jamesCameronFilmography.map((u) => u.universeId as string)) {
            expect(registeredIds.has(id)).toBe(true);
        }
        expect(registeredIds.has(edSheeranCopyrightTrial2023Universe.universeId as string)).toBe(true);
    });

    /**
     * Found by the general walk, not named in the issue: `trumpAssassinationAttemptUniverse`
     * is re-exported from the `people` barrel and, like the others, was spread into nothing.
     */
    test('the Trump assassination universe found by the walk is registered too', () => {
        expect(registeredIds.has(trumpAssassinationAttemptUniverse.universeId as string)).toBe(true);
    });
});
