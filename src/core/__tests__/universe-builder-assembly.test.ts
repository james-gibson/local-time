import { UniverseBuilder, createFilmBuilder, createHistoricalBuilder } from '../universe-builder';
import { CommonUniverseIds } from '../common-universe-ids';
import { createFilmUniverseId } from '../universe-ids';
import { UniverseType } from '../types';

/**
 * Assembly, not hand-authoring — james-gibson/local-time#103.
 *
 * The large universes in this repo are hand-authored literals, and #103 names the reasons:
 * the builder could not emit the containment/reference shape, and it dropped the fields
 * segments need (#100). This suite pins the closing of those gaps, and then proves the point
 * by assembling a *film* — the case that was written by hand in #115/#116 — through the
 * builder alone, with no `as unknown as Universe` cast anywhere.
 *
 * If the last test can be written without a cast, the literal was never necessary; it was
 * what the builder could not yet express.
 */

const runtime = (minutes: number, seconds = 0): bigint =>
  (BigInt(minutes) * 60n + BigInt(seconds)) * 1_000_000_000n;

const segmentsOf = (universe: { temporalStructure?: { segments?: unknown[] } }) =>
  (universe.temporalStructure?.segments ?? []) as Array<Record<string, unknown>>;

describe('segments keep the fields they are given (james-gibson/local-time#100)', () => {
  const base = () =>
    new UniverseBuilder('history:segment_fields:2000')
      .withRealityRelation('documentary', 0.0)
      .withPublicDomain(['test']);

  test('addSegment writes description, status and jurisdiction', () => {
    const universe = base()
      .addSegment(
        'first_phase',
        runtime(0),
        runtime(10),
        'phase',
        'The first phase.',
        'active',
        'US',
      )
      .build();

    expect(segmentsOf(universe)[0]).toEqual({
      id: 'first_phase',
      start: runtime(0),
      end: runtime(10),
      type: 'phase',
      description: 'The first phase.',
      status: 'active',
      jurisdiction: 'US',
    });
  });

  test('addDateSegment forwards status, jurisdiction and description', () => {
    const universe = base()
      .addDateSegment(
        '2000-01-01',
        '2000-12-31',
        'year_2000',
        'phase',
        'active',
        'US',
        'The year the fields stopped being dropped.',
      )
      .build();

    const segment = segmentsOf(universe)[0];
    expect(segment.description).toBe('The year the fields stopped being dropped.');
    expect(segment.status).toBe('active');
    expect(segment.jurisdiction).toBe('US');
  });

  test('an omitted optional field stays absent, not undefined-valued', () => {
    const universe = base().addSegment('bare', runtime(0), runtime(1), 'phase').build();

    const segment = segmentsOf(universe)[0];
    expect('description' in segment).toBe(false);
    expect('status' in segment).toBe(false);
    expect('jurisdiction' in segment).toBe(false);
  });
});

describe('a convenience factory default does not clobber an explicit call (#99)', () => {
  test('withWindowing survives createFilmBuilder', () => {
    const universe = createFilmBuilder()
      .film('disney', 'mary_poppins', 1964)
      .withRuntime(139)
      .withWindowing('time_based')
      .withCopyright(['Walt Disney Productions'], 1964)
      .build();

    expect(universe.temporalStructure?.windows.strategy).toBe('time_based');
  });

  test('setRealityRelation survives createHistoricalBuilder', () => {
    // The sharp case: without the guard this flipped to `pure_fiction` / 1.0 — the opposite of
    // what the caller asked for.
    const universe = createHistoricalBuilder()
      .historical('test_event', 2000)
      .setRealityRelation({ type: 'pure_fiction', fictionalizationDegree: 1.0, realityAnchors: [] })
      .withPublicDomain(['test'])
      .addDateSegment('2000-01-01', '2000-12-31', 'phase', 'phase')
      .build();

    expect(universe.realityRelation.type).toBe('pure_fiction');
    expect(universe.realityRelation.fictionalizationDegree).toBe(1.0);
  });

  test('an untouched factory default still applies', () => {
    const universe = createHistoricalBuilder()
      .historical('untouched_default', 2000)
      .withPublicDomain(['test'])
      .addDateSegment('2000-01-01', '2000-12-31', 'phase', 'phase')
      .build();

    expect(universe.realityRelation.type).toBe('documentary');
    expect(universe.realityRelation.fictionalizationDegree).toBe(0.0);
    expect(universe.temporalStructure?.windows.strategy).toBe('time_based');
  });
});

describe('assembly: the edges a builder could not previously emit (#103)', () => {
  test('addParent writes the first-class connections.natural shape', () => {
    const universe = new UniverseBuilder('history:edges:2000')
      .addParent(CommonUniverseIds.WORLD_HISTORY)
      .withPublicDomain(['test'])
      .addSegment('phase', runtime(0), runtime(1), 'phase')
      .build();

    expect(universe.connections?.natural?.parentUniverses).toEqual([
      CommonUniverseIds.WORLD_HISTORY,
    ]);
    // It did *not* go to the legacy location, so there is one shape to read, not two.
    expect((universe.metadata as { connections?: unknown } | undefined)?.connections).toBeUndefined();
  });

  test('addParent accumulates', () => {
    const universe = new UniverseBuilder('history:edges_two:2000')
      .addParent(CommonUniverseIds.WORLD_HISTORY)
      .addParent(CommonUniverseIds.SOFTWARE_ENGINEERING)
      .withPublicDomain(['test'])
      .addSegment('phase', runtime(0), runtime(1), 'phase')
      .build();

    expect(universe.connections?.natural?.parentUniverses).toEqual([
      CommonUniverseIds.WORLD_HISTORY,
      CommonUniverseIds.SOFTWARE_ENGINEERING,
    ]);
  });

  test('addReference writes connections.references', () => {
    const universe = new UniverseBuilder('history:ref:2000')
      .addReference({
        type: 'DEPICTS',
        targetUniverseId: 'technology:world_wide_web:1989',
        description: 'The subject of this record.',
      })
      .withPublicDomain(['test'])
      .addSegment('phase', runtime(0), runtime(1), 'phase')
      .build();

    expect(universe.connections?.references).toEqual([
      {
        type: 'DEPICTS',
        targetUniverseId: 'technology:world_wide_web:1989',
        description: 'The subject of this record.',
      },
    ]);
  });

  test('the legacy addConnection still lands in metadata.connections', () => {
    // `pixar/films.ts` and the pixar tests read that location, so it must keep working.
    const universe = new UniverseBuilder('pixar:toy_story:1995')
      .addConnection({ type: 'member_of', targetUniverseId: CommonUniverseIds.PIXAR_STUDIO })
      .withPublicDomain(['test'])
      .addSegment('phase', runtime(0), runtime(1), 'phase')
      .build();

    expect(
      (universe.metadata as { connections: Array<{ targetUniverseId: string }> }).connections.map(
        (c) => c.targetUniverseId,
      ),
    ).toEqual([CommonUniverseIds.PIXAR_STUDIO]);
  });
});

describe('assembly: attribution and metadata the literal had and the builder did not (#103)', () => {
  test('withSources and withUsageRestrictions merge with withCopyright', () => {
    const universe = new UniverseBuilder('history:attribution:2000')
      .withCopyright(['Example Pictures'], 2000, 'active')
      .withSources(['source one', 'source two', 'source three'])
      .withUsageRestrictions(['No reproduction.'])
      .addSegment('phase', runtime(0), runtime(1), 'phase')
      .build();

    expect(universe.attribution.copyright?.holders).toEqual(['Example Pictures']);
    expect(universe.attribution.sources).toEqual(['source one', 'source two', 'source three']);
    expect(universe.attribution.usage_restrictions).toEqual(['No reproduction.']);
    expect(universe.attribution.citations_required).toBe(true);
  });

  test('withCanonicalName sets the human title, not the slug-derived one', () => {
    const universe = new UniverseBuilder('paramount:dungeons_and_dragons_honor_among_thieves:2023')
      .withCanonicalName('Dungeons & Dragons: Honor Among Thieves')
      .withPublicDomain(['test'])
      .addSegment('phase', runtime(0), runtime(1), 'phase')
      .build();

    // Derived, it would be 'Dungeons And Dragons Honor Among Thieves'.
    expect(universe.metadata?.canonicalName).toBe('Dungeons & Dragons: Honor Among Thieves');
  });

  test('withReleased sets the typed metadata.released, not the untyped extra', () => {
    const universe = new UniverseBuilder('history:released:2000')
      .withReleased('2000-06-10')
      .withPublicDomain(['test'])
      .addSegment('phase', runtime(0), runtime(1), 'phase')
      .build();

    expect(universe.metadata?.released).toEqual(new Date('2000-06-10'));
    expect((universe.metadata as { releaseDate?: unknown }).releaseDate).toBeUndefined();
  });
});

describe('a film can be assembled through the builder, with no cast (#103, #115, #116)', () => {
  const STUDIO = 'film_studio:universal_pictures:1912-present';

  /** A film, built entirely by method calls. No literal, no `as unknown as Universe`. */
  const warcraft = createFilmBuilder()
    .film('universal', 'warcraft', 2016)
    .withRuntime(123)
    .withWindowing('scene_based', runtime(10))
    .withAliases(['Warcraft', 'Warcraft (2016)'])
    .withRealityRelation('pure_fiction', 1.0)
    .withCopyright(['Universal Pictures', 'Legendary Pictures', 'Blizzard Entertainment'], 2016, 'active')
    .withSources([
      'Wikipedia, "Warcraft (film)"',
      'Box Office Mojo / The Numbers',
      'Rotten Tomatoes / Metacritic',
    ])
    .withUsageRestrictions(['Copyrighted. This record contains no stills or footage.'])
    .withCreators({
      director: ['Duncan Jones'],
      writer: ['Charles Leavitt', 'Duncan Jones'],
      based_on: ['Warcraft by Blizzard Entertainment'],
    })
    .withReleased('2016-06-10')
    .withCulturalSignificance(0.8, 'Highest-grossing video-game film at release; critically divisive.')
    .addSegment('act_i', runtime(0), runtime(61, 30), 'act', 'The Dark Portal opens.', 'active')
    .addSegment('act_ii', runtime(61, 30), runtime(120), 'act', 'The alliance forms.', 'active')
    .addSegment('act_iii', runtime(120), runtime(123), 'act', 'The portal is closed.', 'active')
    .addRuntimeKeyframe(0, 0, 'stormwind_opens', 0.7, ['act_i'], 'The Dark Portal opens over Draenor.')
    .addRuntimeKeyframe(61, 30, 'dark_portal_midpoint', 0.9, ['act_ii'], 'The midpoint turn.')
    .addRuntimeKeyframe(120, 0, 'climax_resolution', 1.0, ['act_iii'], 'The climax at the portal.')
    .addParent(CommonUniverseIds.HOLLYWOOD_SYSTEM)
    .addParent(STUDIO)
    .addReference({
      type: 'DISTRIBUTED_BY',
      targetUniverseId: STUDIO,
      description: 'Distributed theatrically worldwide by Universal Pictures.',
    })
    .build();

  test('a film can be assembled through the builder', () => {
    expect(warcraft.universeId).toBe('universal:warcraft:2016');
    expect(warcraft.universeId).toBe(createFilmUniverseId('universal', 'warcraft', 2016));
    expect(warcraft.type).toBe(UniverseType.FILM);
  });

  test('identity and runtime survive', () => {
    expect(warcraft.identifiers.aliases).toEqual(['Warcraft', 'Warcraft (2016)']);
    expect(warcraft.metadata?.canonicalName).toBe('Warcraft');
    const epoch = Object.values(warcraft.layers[0].epochs)[0] as { epochId?: string; endTime?: bigint };
    expect(epoch.epochId).toBeTruthy();
    expect(epoch.endTime).toBe(runtime(123));
    expect(warcraft.temporalStructure?.windows.strategy).toBe('scene_based');
  });

  test('the acts are gapless because the boundaries are the data, not arithmetic', () => {
    const acts = segmentsOf(warcraft);
    expect(acts.map((a) => a.type)).toEqual(['act', 'act', 'act']);
    expect(acts.map((a) => a.description)).toEqual([
      'The Dark Portal opens.',
      'The alliance forms.',
      'The portal is closed.',
    ]);
    for (let i = 1; i < acts.length; i += 1) expect(acts[i].start).toBe(acts[i - 1].end);
    expect(acts[0].start).toBe(0n);
    expect(acts[acts.length - 1].end).toBe(runtime(123));
  });

  test('runtime keyframes are positions, and keep their prose (#77)', () => {
    const keyframes = warcraft.temporalStructure?.keyframes ?? [];
    const midpoint = keyframes.find((k) => k.id === 'dark_portal_midpoint');
    expect(midpoint?.timestamp).toBe(runtime(61, 30));
    expect(midpoint?.description).toBe('The midpoint turn.');
    // No `type` was given, so the key is absent rather than guessed at (#112: a runtime
    // position is not a RELEASE).
    expect((midpoint as { type?: unknown }).type).toBeUndefined();
  });

  test('attribution and provenance survive, which is what the literal was for', () => {
    expect(warcraft.attribution.copyright?.holders).toEqual([
      'Universal Pictures',
      'Legendary Pictures',
      'Blizzard Entertainment',
    ]);
    expect(warcraft.attribution.sources).toHaveLength(3);
    expect(warcraft.attribution.usage_restrictions).toEqual([
      'Copyrighted. This record contains no stills or footage.',
    ]);
    // `based_on` is not a person, so `withCreators` routes it to metadata, not to
    // `attribution.creators`. Creators are keyed by person (#148): Jones directed and wrote,
    // so he is one entry with two roles, not one entry per role.
    expect(warcraft.attribution.creators).toEqual([
      { name: 'Duncan Jones', roles: ['director', 'writer'] },
      { name: 'Charles Leavitt', roles: ['writer'] },
    ]);
    expect((warcraft.metadata as { based_on?: string[] }).based_on).toEqual([
      'Warcraft by Blizzard Entertainment',
    ]);
    expect(warcraft.metadata?.released).toEqual(new Date('2016-06-10'));
    expect(warcraft.metadata?.cultural_significance).toBe(0.8);
  });

  test('containment and the distributor edge survive, which the builder could not emit', () => {
    expect(warcraft.connections?.natural?.parentUniverses).toEqual([
      CommonUniverseIds.HOLLYWOOD_SYSTEM,
      STUDIO,
    ]);
    expect(warcraft.connections?.references).toEqual([
      {
        type: 'DISTRIBUTED_BY',
        targetUniverseId: STUDIO,
        description: 'Distributed theatrically worldwide by Universal Pictures.',
      },
    ]);
  });

  test('the factory default did not clobber the explicit reality relation (#99)', () => {
    expect(warcraft.realityRelation.type).toBe('pure_fiction');
    expect(warcraft.realityRelation.fictionalizationDegree).toBe(1.0);
  });
});
