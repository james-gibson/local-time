import { allUniverses } from '../index';
import { ConfigLoader } from '../../config-loader';
import { UniverseRegistry } from '../../universe-registry';
import {
  isGameUniverseId,
  isHistoricalUniverseId,
  isSeriesUniverseId,
  isTechnologyUniverseId,
  isValidUniverseId,
} from '../../../core/universe-ids';
import {
  KeyframeType,
  TemporalEpoch,
  TimePrecision,
  Universe,
  UniverseType,
} from '../../../core/types';
import {
  aaahogexUniverse,
  aiBattlesSeriesUniverse,
  masterHellishAiVsCommunityUniverse,
  masterHellishChannelUniverse,
  openTTDGameUniverse,
  openttdUniverses,
  season12ConnectTheWorldUniverse,
  transportTycoonDeluxeUniverse,
} from './index';

/**
 * The `openttd/` namespace registration guard.
 *
 * Mirrors `films/films-registration.test.ts` and
 * `games/diablo/diablo-registration.test.ts`. The lesson (#27, #67, #98) is that a
 * universe can be defined, built and validated at module scope and then silently
 * discarded: `loadBuiltInUniverses` warns and skips a malformed id, so being in
 * `allUniverses` is not proof of a lookup.
 *
 * The ids are also guarded *by domain*, not by `isValidUniverseId` alone: the
 * permissive ANY_YEAR_TERMINATED pattern accepts almost anything ending in a
 * year, and the previous draft's `gaming:`/`youtube:` prefixes are not declared
 * namespaces at all — both would have been dropped or mis-validated.
 */

const asId = (universe: Universe): string => String(universe.universeId);

const openttdIds = openttdUniverses.map(asId);

const universesIn = (
  universe: Universe,
): Array<{ epoch: TemporalEpoch; label: string }> =>
  (universe.layers ?? []).flatMap((layer) =>
    Object.entries(layer.epochs ?? {}).map(([key, epoch]) => ({
      epoch: epoch as TemporalEpoch,
      label: `${asId(universe)}#${layer.layerId}.${key}`,
    })),
  );

const instanceofAllUniverses = new Map<string, number>();
for (const universe of allUniverses) {
  const id = (universe as { universeId?: unknown }).universeId;
  if (typeof id === 'string') {
    instanceofAllUniverses.set(id, (instanceofAllUniverses.get(id) ?? 0) + 1);
  }
}

describe('the openttd namespace is registered', () => {
  test('the namespace has seven universes', () => {
    // TTD, OpenTTD, the AI script, the channel, the series, the season, the video.
    expect(openttdUniverses).toHaveLength(7);
  });

  test('every id is present in allUniverses exactly once', () => {
    const missing = openttdIds.filter((id) => (instanceofAllUniverses.get(id) ?? 0) === 0);
    const duplicated = openttdIds.filter((id) => (instanceofAllUniverses.get(id) ?? 0) > 1);
    expect(missing).toEqual([]);
    expect(duplicated).toEqual([]);
  });

  test('every id is a valid UniverseId', () => {
    expect(openttdIds.filter((id) => !isValidUniverseId(id))).toEqual([]);
  });

  /**
   * The domain claim, not the shape suggestion. `series:` is a declared
   * namespace with a three-segment pattern; the channel container is
   * `history:<slug>:*`, which is what an open-ended institution looks like.
   */
  test('each id satisfies the guard for the domain it claims', () => {
    expect(isSeriesUniverseId(asId(aiBattlesSeriesUniverse))).toBe(true);
    expect(isSeriesUniverseId(asId(season12ConnectTheWorldUniverse))).toBe(true);
    expect(isSeriesUniverseId(asId(masterHellishAiVsCommunityUniverse))).toBe(true);
    expect(isHistoricalUniverseId(asId(masterHellishChannelUniverse))).toBe(true);
    expect(isGameUniverseId(asId(openTTDGameUniverse))).toBe(true);
    expect(isGameUniverseId(asId(transportTycoonDeluxeUniverse))).toBe(true);
    expect(isTechnologyUniverseId(asId(aaahogexUniverse))).toBe(true);
  });

  test('the game and the AI use the game: and technology: factories', () => {
    // `game:<franchise>:<title>:<year>` — the franchise and title are both the
    // game's name; the declared GAME pattern is the only one that claims it.
    expect(asId(openTTDGameUniverse)).toBe('game:openttd:openttd:2004');
    expect(asId(transportTycoonDeluxeUniverse)).toBe('game:transport_tycoon:deluxe:1995');
    expect(asId(aaahogexUniverse)).toBe('technology:aaahogex:2022');
  });

  test('the three series ids are not film ids', () => {
    // FILM excludes the `series` prefix, so a `series:` id must not be
    // claimable by the film vocabulary (james-gibson/local-time#44/#50).
    const film = /^(?!series:)[a-z0-9_]+:[a-z0-9_]+:\d{4}$/;
    for (const universe of [
      aiBattlesSeriesUniverse,
      season12ConnectTheWorldUniverse,
      masterHellishAiVsCommunityUniverse,
    ]) {
      expect(film.test(asId(universe))).toBe(false);
    }
  });

  /**
   * The half a spread into `allUniverses` does not prove: an invalid id is
   * present in the array and absent from every query (#27).
   */
  test('every universe survives a real registry lookup', async () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    await registry.initialize();

    const missing = openttdIds.filter((id) => registry.getUniverse(id) === undefined);
    expect(missing).toEqual([]);
  });

  test('every epoch carries an explicit, non-empty epochId', () => {
    // A missing epochId is silently replaced by the layer key, changing the
    // meaning of every reference to the epoch (#19).
    const offenders = openttdUniverses
      .flatMap(universesIn)
      .filter(({ epoch }) => !epoch.epochId || epoch.epochId.trim() === '')
      .map(({ label }) => label);
    expect(offenders).toEqual([]);
  });

  test('the video and the season are typed as series works', () => {
    expect(masterHellishAiVsCommunityUniverse.type).toBe(UniverseType.SERIES);
    expect(season12ConnectTheWorldUniverse.type).toBe(UniverseType.SERIES);
    expect(aiBattlesSeriesUniverse.type).toBe(UniverseType.SERIES);
    expect(masterHellishChannelUniverse.type).toBe(UniverseType.INSTITUTIONAL_PERIOD);
    expect(openTTDGameUniverse.type).toBe(UniverseType.GAME);
    expect(transportTycoonDeluxeUniverse.type).toBe(UniverseType.GAME);
    expect(aaahogexUniverse.type).toBe(UniverseType.TECHNOLOGY);
  });
});

describe('the openttd graph has no dangling edges', () => {
  const registered = new Set(
    allUniverses
      .map((u) => (u as { universeId?: unknown }).universeId)
      .filter((id): id is string => typeof id === 'string'),
  );

  test('every reality anchor resolves to a registered universe', () => {
    const dangling = openttdUniverses.flatMap((universe) =>
      (universe.realityRelation.realityAnchors ?? [])
        .filter((anchor) => !registered.has(anchor.realEventId))
        .map((anchor) => `${asId(universe)} -> ${anchor.realEventId}`),
    );
    expect(dangling).toEqual([]);
  });

  test('every declared parent resolves to a registered universe', () => {
    const dangling = openttdUniverses.flatMap((universe) =>
      (universe.connections?.natural?.parentUniverses ?? [])
        .map((parent) => String(parent))
        .filter((parent) => !registered.has(parent))
        .map((parent) => `${asId(universe)} -> ${parent}`),
    );
    expect(dangling).toEqual([]);
  });

  test('every composition target resolves to a registered universe', () => {
    const dangling = openttdUniverses.flatMap((universe) =>
      (universe.layers ?? [])
        .map((layer) => layer.reality_correspondence?.to)
        .filter((to): to is string => typeof to === 'string' && !registered.has(to))
        .map((to) => `${asId(universe)} -> ${to}`),
    );
    expect(dangling).toEqual([]);
  });

  test('every declared reference target resolves to a registered universe', () => {
    const dangling = openttdUniverses.flatMap((universe) =>
      (universe.connections?.references ?? [])
        .filter((reference) => !registered.has(reference.targetUniverseId))
        .map((reference) => `${asId(universe)} -> ${reference.targetUniverseId}`),
    );
    expect(dangling).toEqual([]);
  });

  test('the graph carries the platform and the agent edges', () => {
    const videoRefs = masterHellishAiVsCommunityUniverse.connections?.references ?? [];
    const seasonRefs = season12ConnectTheWorldUniverse.connections?.references ?? [];
    const aiRefs = aaahogexUniverse.connections?.references ?? [];

    expect(videoRefs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'RUNS_ON', targetUniverseId: asId(openTTDGameUniverse) }),
        expect.objectContaining({ type: 'INSTANTIATES', targetUniverseId: asId(aaahogexUniverse) }),
      ]),
    );
    expect(seasonRefs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'PLAYED_WITH', targetUniverseId: asId(openTTDGameUniverse) }),
      ]),
    );
    expect(aiRefs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'RUNS_ON', targetUniverseId: asId(openTTDGameUniverse) }),
      ]),
    );
  });

  test('every collection member id resolves', () => {
    const dangling: string[] = [];
    for (const universe of openttdUniverses) {
      const collection = (universe.metadata as { collection?: Record<string, unknown> } | undefined)
        ?.collection;
      if (!collection) continue;
      const members = [
        ...((collection.memberUniverseIds as string[] | undefined) ?? []),
        ...((collection.episodeUniverseIds as string[] | undefined) ?? []),
      ];
      for (const member of members) {
        if (!registered.has(member)) dangling.push(`${asId(universe)} -> ${member}`);
      }
    }
    expect(dangling).toEqual([]);
  });
});

describe('the AI-vs-community video records the verified publication facts', () => {
  const universe = masterHellishAiVsCommunityUniverse as unknown as Universe;
  const primary = universe.layers.find((layer) => layer.layerId === 'primary_layer');
  const publication = primary?.epochs.publication as TemporalEpoch | undefined;

  test('the publication instant is 2026-10-16T15:08:21Z', () => {
    // 2026-10-16T08:08:21-07:00 == 2026-10-16T15:08:21Z. The draft said
    // 2026-10-17, one day late.
    expect(publication?.startTime).toBe(
      BigInt(Date.UTC(2026, 9, 16, 15, 8, 21)) * 1_000_000n,
    );
  });

  test('the runtime is 1,143 s (19:03), not the estimated 18:30', () => {
    const start = publication?.startTime as bigint;
    const end = publication?.endTime as bigint;
    expect((end - start) / 1_000_000_000n).toBe(BigInt(1_143));
  });

  test('every keyframe falls inside the publication window', () => {
    const start = publication?.startTime as bigint;
    const end = publication?.endTime as bigint;
    const outside = (universe.temporalStructure?.keyframes ?? [])
      .filter((frame) => frame.timestamp < start || frame.timestamp > end)
      .map((frame) => frame.id);
    expect(outside).toEqual([]);
  });

  test('the chapter keyframes are anchored to the video\'s own chapter list', () => {
    const byId = new Map(
      (universe.temporalStructure?.keyframes ?? []).map((frame) => [frame.id, frame]),
    );
    const start = publication?.startTime as bigint;
    const offsetSeconds = (id: string): number =>
      Number(((byId.get(id)?.timestamp as bigint) - start) / 1_000_000_000n);

    expect(offsetSeconds('premise_ai_vs_human_format')).toBe(0);
    expect(offsetSeconds('blank_2000_canvas_unleashed')).toBe(97); // 1:37
    expect(offsetSeconds('spiffing_brit_oil_helicopter')).toBe(161); // 2:41
    expect(offsetSeconds('ai_targets_passengers_and_mail')).toBe(244); // 4:04
    expect(offsetSeconds('openttd_dev_and_david_x_newton_join')).toBe(355); // 5:55
    expect(offsetSeconds('ai_2009_13746_vehicles')).toBe(486); // 8:06
    expect(offsetSeconds('vacuum_tube_mega_projects')).toBe(575); // 9:35
    expect(offsetSeconds('ai_2040_urban_sprawl')).toBe(715); // 11:55
    expect(offsetSeconds('ai_hits_5000_road_vehicle_cap')).toBe(898); // 14:58
    expect(offsetSeconds('humans_overtake_850m_profit')).toBe(1034); // 17:14
  });

  test('keyframe types use the KeyframeType enum rather than bare strings', () => {
    const validTypes = new Set(Object.values(KeyframeType));
    const offenders = (universe.temporalStructure?.keyframes ?? [])
      .filter((frame) => frame.type !== undefined && !validTypes.has(frame.type))
      .map((frame) => `${frame.id}: ${String(frame.type)}`);
    expect(offenders).toEqual([]);
  });

  test('the AI layer composes over the Season 12 universe', () => {
    const recreation = universe.layers.find(
      (layer) => layer.layerId === 'ai_simulation_recreation',
    );
    expect(recreation?.reality_correspondence?.to).toBe(asId(season12ConnectTheWorldUniverse));
    expect(recreation?.reality_correspondence?.accuracy).toBe(0.35);
  });
});

describe('the Season 12 universe records the verified run facts', () => {
  const universe = season12ConnectTheWorldUniverse as unknown as Universe;
  const broadcast = universe.layers.find((layer) => layer.layerId === 'broadcast');
  const seasonRun = broadcast?.epochs.season_run as TemporalEpoch | undefined;

  test('the broadcast window starts at the Starting Scenario publication', () => {
    expect(seasonRun?.startTime).toBe(BigInt(Date.UTC(2025, 9, 16)) * 1_000_000n);
  });

  test('the broadcast window ends after the finale\'s 4:18:44 runtime', () => {
    // Finale published 2026-08-28T23:44:15Z, runtime 15,524 s.
    expect(seasonRun?.endTime).toBe(
      BigInt(Date.UTC(2026, 7, 29, 4, 2, 59)) * 1_000_000n,
    );
  });

  test('the in-game epoch is a label, not a wall-clock date range', () => {
    const ingame = universe.layers.find((layer) => layer.layerId === 'ingame_world');
    const era = ingame?.epochs.ingame_era as TemporalEpoch | undefined;
    expect(era?.description).toContain('1930-2070');
    expect(era?.description).toContain('SIMULATION time');
    // No reality_correspondence: there is no real-world referent for the map.
    expect(ingame?.reality_correspondence).toBeUndefined();
  });

  test('the season start year is 1930, not 2000 (Part 2 restarts at 2000)', () => {
    const facts = (universe.metadata as { seasonFacts: Record<string, unknown> })
      .seasonFacts;
    expect(facts.ingamePart1StartYear).toBe(1930);
    expect(facts.ingamePart2StartYear).toBe(2000);
    expect(facts.finaleStreamNumber).toBe(42);
    expect(facts.finaleRuntimeSeconds).toBe(15_524);
  });

  test('the September 2050 claim is not encoded as a date', () => {
    // The AI freeze is "shortly after the year 2050" in-game, not wall-clock.
    const aiRun = (masterHellishAiVsCommunityUniverse.metadata as {
      ingameMetrics: { aiRun: Array<{ ingameYear: number; derived: boolean }> };
    }).ingameMetrics.aiRun;
    const row = aiRun.find((entry) => entry.ingameYear === 2070);
    // The 2070 row is aligned to the human run and is flagged as derived.
    expect(row?.derived).toBe(true);
  });
});

describe('the platform and the agent are recorded from their own sources', () => {
  const openTTD = openTTDGameUniverse as unknown as Universe;
  const aaahogex = aaahogexUniverse as unknown as Universe;
  const openTTDEpoch = openTTD.layers[0].epochs.active as TemporalEpoch;

  test('OpenTTD is dated from its 0.1 release, not its GitHub mirror', () => {
    // 0.1 released 2004-03-06; the GitHub repo was created 2018-04-06.
    expect(openTTDEpoch.startTime).toBe(BigInt(Date.UTC(2004, 2, 6)) * 1_000_000n);
    const firstRelease = (openTTD.temporalStructure?.keyframes ?? []).find(
      (frame) => frame.id === 'openttd_0_1',
    );
    expect(firstRelease?.timestamp).toBe(BigInt(Date.UTC(2004, 2, 6)) * 1_000_000n);
  });

  test('OpenTTD records the GPL v2 lineage and the current stable release', () => {
    const facts = (openTTD.metadata as { gameFacts: Record<string, any> }).gameFacts;
    expect(facts.license).toContain('General Public License v2.0');
    expect(facts.basedOn).toEqual(
      expect.objectContaining({ title: 'Transport Tycoon Deluxe', year: 1995, publisher: 'MicroProse' }),
    );
    expect(facts.latestStableAtRetrieval).toBe('15.3');
  });

  test('AAAhogEx is dated from its public repository, not a guessed founding', () => {
    const epoch = aaahogex.layers[0].epochs.active as TemporalEpoch;
    expect(epoch.startTime).toBe(
      BigInt(Date.UTC(2022, 0, 4, 11, 12, 11)) * 1_000_000n,
    );
  });

  test('AAAhogEx records author, licence and current in-tree version', () => {
    const facts = (aaahogex.metadata as { technologyFacts: Record<string, any> })
      .technologyFacts;
    expect(aaahogex.attribution.copyright?.holders).toEqual(['Rei Ishibashi']);
    expect(facts.license).toBe('GPL-3.0');
    expect(facts.currentVersion).toBe(115);
    expect(facts.currentVersionDate).toBe('2026-03-18');
    expect(facts.openTtdAiApiVersion).toBe('14');
  });

  test('the AI is not presented as a real operator of the in-game companies', () => {
    // The script is a documentary TECHNOLOGY universe; the companies it creates
    // are a simulation and stay in the video's recreation layer.
    expect(aaahogex.realityRelation.type).toBe('documentary');
    expect(aaahogex.realityRelation.fictionalizationDegree).toBe(0.0);
    expect(openTTD.realityRelation.type).toBe('pure_fiction');
  });
});

describe('Transport Tycoon Deluxe is recorded from its own sources', () => {
  const ttd = transportTycoonDeluxeUniverse as unknown as Universe;
  const openTTD = openTTDGameUniverse as unknown as Universe;
  const epoch = ttd.layers[0].epochs.available as TemporalEpoch;

  test('the availability window opens in November 1995', () => {
    expect(epoch.startTime).toBe(BigInt(Date.UTC(1995, 10, 1)) * 1_000_000n);
    expect(epoch.precision).toBe(TimePrecision.MONTH);
    // No end: the game is still sold (Atari port, 2026).
    expect(epoch.endTime).toBeUndefined();
  });

  test('the release keyframe is the same month and is marked uncertain by a day', () => {
    const release = (ttd.temporalStructure?.keyframes ?? []).find(
      (frame) => frame.id === 'ttd_release',
    );
    expect(release?.timestamp).toBe(BigInt(Date.UTC(1995, 10, 1)) * 1_000_000n);
    expect(release?.certainty).toBe(0.9);
    expect(release?.type).toBe(KeyframeType.RELEASE);
  });

  test('the 1994 original\'s name is not claimed as an alias', () => {
    // Aliases are global lookup keys; "Transport Tycoon" belongs to the 1994
    // game, not to Deluxe.
    expect(ttd.identifiers.aliases ?? []).not.toContain('Transport Tycoon');
    expect(ttd.identifiers.aliases ?? []).toEqual(
      expect.arrayContaining(['Transport Tycoon Deluxe', 'TTD']),
    );
  });

  test('the credits and the 1950-2050 timeline are recorded', () => {
    const facts = (ttd.metadata as { gameFacts: Record<string, any> }).gameFacts;
    expect(facts.designer).toBe('Chris Sawyer');
    expect(facts.programmer).toBe('Chris Sawyer');
    expect(facts.publisher).toBe('MicroProse Software');
    expect(facts.composer).toBe('John Broomhall');
    expect(facts.ingameStartYear).toBe(1950);
    expect(facts.ingameEndYear).toBe(2050);
    expect(facts.climates).toHaveLength(4);
    expect(facts.originalGame).toEqual({ title: 'Transport Tycoon', year: 1994 });
  });

  test('the 1950 default is not confused with the season start year', () => {
    // TTD defaults to 1950 (the 1994 original started in 1930); Season 12 set
    // its own 1930 start. Both are recorded where they belong.
    const ttdFacts = (ttd.metadata as { gameFacts: Record<string, any> }).gameFacts;
    const seasonFacts = (season12ConnectTheWorldUniverse.metadata as {
      seasonFacts: Record<string, any>;
    }).seasonFacts;
    expect(ttdFacts.ingameStartYear).toBe(1950);
    expect(seasonFacts.ingamePart1StartYear).toBe(1930);
  });

  test('the rights transfer and the 2026 port are recorded as separate events', () => {
    const facts = (ttd.metadata as { gameFacts: Record<string, any> }).gameFacts;
    const ids = (ttd.temporalStructure?.keyframes ?? []).map((frame) => frame.id);
    expect(ids).toEqual(expect.arrayContaining(['atari_acquires_ip', 'steam_gog_port']));
    expect(facts.rightsOwner).toEqual(
      expect.objectContaining({ holder: 'Atari SA', since: '2024-11' }),
    );
    expect(facts.rerelease).toEqual(
      expect.objectContaining({ date: '2026-03-13' }),
    );
  });

  test('OpenTTD declares the remake edge back to TTD, and it resolves', () => {
    const refs = openTTD.connections?.references ?? [];
    const remake = refs.find((reference) => reference.type === 'REMAKE_OF');
    expect(remake?.targetUniverseId).toBe(asId(transportTycoonDeluxeUniverse));
    expect(String(remake?.targetUniverseId)).toBe(
      (openTTD.metadata as { gameFacts: Record<string, any> }).gameFacts.basedOn.universeId,
    );
  });

  test('TTD itself claims no reverse edge — the remake relation is directional', () => {
    expect(ttd.connections?.references ?? []).toEqual([]);
  });
});
