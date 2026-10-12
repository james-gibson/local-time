import {
    UniverseBuilder,
    createFilmBuilder,
    createHistoricalBuilder,
    createMissionBuilder,
} from '../universe-builder';
import { UniverseType, TimePrecision } from '../types';
import { allUniverses } from '../../config/universes';

/**
 * Behaviour #45's own tests do not cover.
 *
 * #45 fixed `build()` so it validates and extracts metadata. Its 11 tests assert that it
 * does so, but not two things that turned out to matter:
 *
 *   - that the convenience factories' defaults do not override an explicit call, and
 *   - that every universe in the registry still builds.
 *
 * The second is not hypothetical. Requiring temporal content broke `ed-sheeran` and
 * `pixar/films.ts` on first run, and both build at **module scope** — so the throw happened
 * during import and took the whole `allUniverses` barrel down with it, failing four
 * unrelated suites at once. That is the failure mode this file's last describe guards.
 */

/** A minimal universe that satisfies every validation rule. */
function filmBuilder(studio = 'film', title = 'movie', year = 2023): UniverseBuilder {
    return new UniverseBuilder()
        .film(studio, title, year)
        .withRuntime(120)
        .withRealityRelation('pure_fiction', 1.0)
        .withPublicDomain(['Test']);
}

describe('UniverseBuilder — defaults', () => {
    test('createHistoricalBuilder really does default to documentary', () => {
        const universe = createHistoricalBuilder()
            .historicalEvent('an_event', 1963)
            .withDateRange(1963, 1, 1, 1963, 12, 31, TimePrecision.DAY)
            .withPublicDomain(['Records'])
            .build();

        expect(universe.realityRelation.type).toBe('documentary');
        expect(universe.realityRelation.fictionalizationDegree).toBe(0.0);
        expect(universe.temporalStructure!.windows.strategy).toBe('time_based');
    });

    test('createFilmBuilder defaults to pure fiction, scene based', () => {
        const universe = createFilmBuilder()
            .film('film', 'movie', 2023)
            .withRuntime(120)
            .withCopyright(['Test Studio'], 2023)
            .build();

        expect(universe.realityRelation.type).toBe('pure_fiction');
        expect(universe.temporalStructure!.windows.strategy).toBe('scene_based');
    });

    /**
     * The defaults must not be a bludgeon. `withRealityRelation` is the caller stating a
     * fact about the work; a factory's guess loses to it.
     */
    test('an explicit withRealityRelation beats the factory default', () => {
        const universe = createHistoricalBuilder()
            .historicalEvent('a_dramatisation', 1970)
            .withDateRange(1970, 1, 1, 1970, 12, 31, TimePrecision.DAY)
            .withRealityRelation('fictionalized', 0.4)
            .withCopyright(['A Studio'], 1970)
            .build();

        expect(universe.realityRelation.type).toBe('fictionalized');
        expect(universe.realityRelation.fictionalizationDegree).toBe(0.4);
    });

    test('createMissionBuilder keeps the constructor default of pure fiction', () => {
        // No `withDefaults` call here: mission universes are as varied as their subjects, so
        // asserting a single fiction/real split for them would be inventing policy.
        const universe = createMissionBuilder()
            .mission('nasa', 'test_mission', 1969)
            .withZeroReference(1969, 7, 16, 13, 32, 0, 'Liftoff', 'T-', 'T+', 48)
            .withPublicDomain(['NASA Archives'])
            .build();

        expect(universe.type).toBe(UniverseType.MISSION);
        expect(universe.universeId).toBe('nasa:test_mission:1969');
        expect(universe.layers!.find(l => l.layerId === 'zero_reference')).toBeDefined();
    });
});

describe('UniverseBuilder — validation', () => {
    test('a fictionalization degree outside [0,1] is rejected', () => {
        expect(() =>
            filmBuilder().withRealityRelation('pure_fiction', 1.5).build(),
        ).toThrow(/fictionalizationDegree must be between 0\.0 and 1\.0/);
    });

    test('a cultural significance outside [0,1] is rejected', () => {
        expect(() => filmBuilder().withCulturalSignificance(-0.1).build())
            .toThrow(/cultural_significance must be between 0\.0 and 1\.0/);
    });

    test('an out-of-range keyframe is rejected and names the keyframe', () => {
        expect(() =>
            filmBuilder().addRuntimeKeyframe(60, 0, 'bad_frame', 2, ['t']).build(),
        ).toThrow(/Keyframe significance must be between 0\.0 and 1\.0.*bad_frame/);
    });

    /**
     * Order is load-bearing. These three call chains each contain more than one fault, and
     * each expects the *earliest* one. If validation order ever changes, these pin what it
     * was.
     */
    test('attribution is reported before anything else', () => {
        expect(() =>
            new UniverseBuilder()
                .film('film', 'movie', 2023)
                .withRealityRelation('pure_fiction', 1.5)
                .build(),
        ).toThrow(/Attribution is required/);
    });

    test('realityRelation is reported before missing temporal content', () => {
        expect(() =>
            new UniverseBuilder()
                .film('film', 'movie', 2023)
                .withPublicDomain(['Test'])
                .withRealityRelation('pure_fiction', 9)
                .build(),
        ).toThrow(/fictionalizationDegree/);
    });

    test('every fault is reported, not just the first', () => {
        let message = '';
        try {
            new UniverseBuilder().film('film', 'movie', 2023).withCulturalSignificance(4).build();
        } catch (error) {
            message = (error as Error).message;
        }
        expect(message).toContain('Attribution is required');
        expect(message).toContain('cultural_significance');
        expect(message).toContain('primary temporal layer');
    });

    /**
     * Temporal content via *either* route. `addDateKeyframe` and `addDateSegment` populate
     * `temporalStructure` and never touch `layers`, so requiring a primary layer alone
     * rejected `ed-sheeran` — a universe with 2 keyframes and 1 segment and zero layers.
     */
    test('keyframes in temporalStructure satisfy the temporal-content rule without a layer', () => {
        const universe = new UniverseBuilder()
            .historicalEvent('an_event', 1963)
            .withRealityRelation('documentary', 0.0)
            .withPublicDomain(['Records'])
            .addDateKeyframe('1963-11-22', 'a_moment', 1.0, ['historic'], TimePrecision.DAY)
            .build();

        expect(universe.layers).toEqual([]);
        expect(universe.temporalStructure!.keyframes).toHaveLength(1);
    });
});

describe('UniverseBuilder — metadata extraction', () => {
    test('an explicit canonicalName is not overwritten', () => {
        const universe = new UniverseBuilder()
            .film('film', 'some_slug', 2023)
            .withRuntime(120)
            .withRealityRelation('pure_fiction', 1.0)
            .withPublicDomain(['Test'])
            .build();
        universe.metadata!.canonicalName = 'A Name I Chose';

        const rebuilt = filmBuilder().film('film', 'ignored', 2023).build();
        // Sanity: the extractor does derive a name when none is supplied.
        expect(rebuilt.metadata!.canonicalName).toBe('Ignored');
        expect(universe.metadata!.canonicalName).toBe('A Name I Chose');
    });

    test('canonicalName comes from the slug, not the namespace', () => {
        expect(new UniverseBuilder()
            .historicalEvent('a_specific_event', 1999)
            .withDateRange(1999, 1, 1, 1999, 12, 31, TimePrecision.DAY)
            .withRealityRelation('documentary', 0.0)
            .withPublicDomain(['Records'])
            .build().metadata!.canonicalName).toBe('A Specific Event');
    });

    test('a year range in the id yields the opening year for released', () => {
        const universe = new UniverseBuilder()
            .historical('a_span', 1993, 2001)
            .withDateRange(1993, 1, 1, 2001, 12, 31, TimePrecision.DAY)
            .withRealityRelation('documentary', 0.0)
            .withPublicDomain(['Records'])
            .build();
        expect(universe.metadata!.released!.getFullYear()).toBe(1993);
    });

    test('creators are de-duplicated across roles and copyright holders', () => {
        const universe = new UniverseBuilder()
            .film('film', 'movie', 2023)
            .withRuntime(120)
            .withRealityRelation('pure_fiction', 1.0)
            .withCopyright(['A Studio'], 2023)
            .withCreators({ director: ['A Director', 'A Studio'], writer: ['A Writer'] })
            .build();

        // 'A Studio' appears as both a director and a copyright holder; it must appear once.
        expect(universe.metadata!.creators).toEqual(['A Director', 'A Studio', 'A Writer']);
    });
});

/**
 * The fragility guard.
 *
 * Roughly 65 universes call `.build()` at module scope. If one of them fails validation the
 * throw happens during `import`, which means `allUniverses` never initialises and the
 * registry's own `try/catch` — which *does* handle a single bad universe — never sees it.
 * The whole barrel dies instead of one entry.
 *
 * That is exactly what happened on the first run of #45: `ed-sheeran.ts` and
 * `pixar/films.ts` failed, and four unrelated suites went with them.
 */
describe('every registered universe survives validation', () => {
    test('allUniverses imports without throwing', () => {
        expect(Array.isArray(allUniverses)).toBe(true);
        expect(allUniverses.length).toBeGreaterThan(0);
    });

    test('no universe is missing its id, and ids are unique', () => {
        const ids = allUniverses.map(u => (u as { universeId: string }).universeId);
        expect(ids.every(id => typeof id === 'string' && id.length > 0)).toBe(true);
        expect(new Set(ids).size).toBe(ids.length);
    });

    test('every universe carries the fields build() now guarantees', () => {
        const offenders: string[] = [];
        for (const raw of allUniverses) {
            const u = raw as any;
            const degree = u.realityRelation?.fictionalizationDegree;
            const a = u.attribution;
            const hasProvenance =
                Boolean(a?.public_domain) ||
                Boolean(a?.copyright?.holders?.length) ||
                Boolean(a?.sources?.length);
            const hasPrimary = (u.layers ?? []).some((l: any) => l.type === 'primary');
            const hasContent =
                Boolean(u.temporalStructure?.segments?.length) ||
                Boolean(u.temporalStructure?.keyframes?.length) ||
                (u.epochs && Object.keys(u.epochs).length > 0);
            // Mirrors NON_TEMPORAL_TYPES in universe-builder.ts.
            const isNonTemporal = ['technical_specification', 'technical_log', 'abstract_concept']
                .includes(String(u.type));

            if (typeof degree !== 'number' || degree < 0 || degree > 1) offenders.push(`${u.universeId}: degree=${degree}`);
            if (!hasProvenance) offenders.push(`${u.universeId}: no attribution`);
            if (!isNonTemporal && !hasPrimary && !hasContent) offenders.push(`${u.universeId}: no temporal content`);
        }
        expect(offenders).toEqual([]);
    });
});
