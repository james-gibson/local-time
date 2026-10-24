import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../core/types';
import { creatorRefs } from '../../../core/creators';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * Can 5 Overpowered AIs Beat Our Community OpenTTD Map? — Master Hellish (2026).
 *
 * A 19:03 documentary-style video essay. Five instances of the aggressive
 * "AAAhogEX" AI script are given a blank Year 2000 version of the Season 12
 * community map with all top-tier technology mods enabled; their algorithmic
 * network is then compared against the organic network the community built
 * across 42 live streams.
 *
 * Thesis (closing keyframe): brute force code versus human adaptability. The AIs
 * dominate early by spamming buses and airports, then freeze when every company
 * saturates the 5,000-road-vehicle cap and the script cannot pivot to another
 * strategy. The human team, starting slower, overtakes them.
 *
 * ID: `series:can_5_overpowered_ais_beat_our_community_openttd_map:2026`.
 * The `series:` namespace is deliberate — the video's own description places it
 * in the channel's "OpenTTD AI Battles" series. The title ends in "?" and would
 * not survive a derived slug, so the id is pinned verbatim.
 *
 * TWO LAYERS, TWO CLAIMS.
 * - `primary` is the published video: a real work, real recording, real
 *   publication instant.
 * - `ai_simulation_recreation` is the simulated AI world. The five companies are
 *   script instances inside OpenTTD, not operators. They are a counterfactual
 *   composition over the Season 12 map, recorded with low accuracy, and are
 *   never asserted as fact.
 *
 * Reality Relation: `documentary` at 0.0. The reported events — the community
 * build, the live streams, the script behaviour, the vehicle counts and the
 * crash tally — are real. The AI companies themselves are simulations.
 *
 * Cultural Significance: 0.70 — domain-significant, with a reusable
 * AI-vs-human format and both save files released publicly. Below the
 * cross-domain 0.85 band.
 *
 * Research Sources (all retrieved 2026-10-19):
 * - The video https://www.youtube.com/watch?v=Pd0q5Xit13U — transcript,
 *   chapters, runtime, publication instant and view count.
 * - YouTube oEmbed endpoint — title "Can 5 Overpowered AIs Beat Our Community
 *   OpenTTD Map?", author "Master Hellish".
 * - Video description — "five instances of the aggressive AAAhogEX AI", "blank
 *   Year 2000 map", "4,000km/h vacuum tube trains", the "OpenTTD AI Battles"
 *   series name and playlist, and the chapter list used for keyframe anchors.
 * - Season sources — see ./season-12-connect-the-world.ts.
 *
 * Key Facts Verified:
 * - Publication: 2026-10-16T15:08:21Z (`uploadDate` 2026-10-16T08:08:21-07:00).
 *   The previous draft's 2026-10-17 was one day late.
 * - Runtime: 1,143 s = 19:03. The previous draft's "~18:30" was approximate.
 * - In-game canvas: Year 2000, per the description.
 * - AI script: AAAhogEX, per the description.
 *
 * Hierarchical Context:
 *   history:master_hellish_channel:*  ->  series:master_hellish_openttd_ai_battles:2026
 *                                                          |
 *                                                    [this work]
 *   series:openttd_season_12_connect_the_world:2025  <-- documents (reality anchor)
 */

const ns = (iso: string): bigint => dateToNanoseconds(new Date(iso));

/* ------------------------------------------------------------------ *
 * Time base
 * ------------------------------------------------------------------ */

/** Publication instant: 2026-10-16T08:08:21-07:00 == 2026-10-16T15:08:21Z. */
const VIDEO_PUBLISHED = ns('2026-10-16T15:08:21Z');

/** Published runtime in seconds: 1,143 = 19:03. */
const RUNTIME_SECONDS = 1_143;

/** `at(11, 55)` === 11m55s into the video, as an absolute instant. */
const at = (minutes: number, seconds = 0): bigint =>
  VIDEO_PUBLISHED + BigInt(minutes * 60 + seconds) * 1_000_000_000n;

/* ------------------------------------------------------------------ *
 * In-game metric payloads (simulation time — NOT wall-clock)
 * ------------------------------------------------------------------ */

/**
 * One snapshot of the SIMULATED AI companies at a given IN-GAME year.
 *
 * The parallel array to `season12HumanMetrics`, which lives in the season file
 * because those are ground truth about the shared company. These are script
 * instances inside OpenTTD and belong to the video's recreation layer.
 *
 * `null` means "not reported", never zero.
 */
export interface AiMetricSnapshot {
  ingameYear: number;
  /** Profit per financial period as reported, GBP. */
  reportedProfitGbp: number | null;
  /**
   * What the reported figure covers. The video shifts between "the AIs ... are
   * raking in" and "all of the AI companies ... pulling in", so the scope is
   * recorded rather than silently harmonised into one total.
   */
  profitScope: 'ambiguous' | 'per_company' | 'combined';
  /** Total active vehicles across all five companies. */
  totalVehicles: number | null;
  /** Per-company aircraft count (they are near-uniform by construction). */
  aircraftPerCompany: number | null;
  /** Per-company road vehicles. */
  roadVehiclesPerCompany: number | null;
  /** Total trains across the map. */
  trainsTotal: number | null;
  /** Companies that had adopted ships by this year. */
  companiesWithShips: number | null;
  /** True when the figure is an inference, not a stated number. */
  derived: boolean;
  /** The wording the figure comes from. */
  source: string;
}

export const aiRunMetrics: AiMetricSnapshot[] = [
  {
    ingameYear: 2000,
    reportedProfitGbp: 10_000_000,
    profitScope: 'ambiguous',
    totalVehicles: null,
    aircraftPerCompany: null,
    roadVehiclesPerCompany: null,
    trainsTotal: null,
    companiesWithShips: null,
    derived: false,
    source:
      'Video: no station placed before June 2000 (script evaluation stall); "by ' +
      'the end of the year ... raking in nearly 10 million pounds of profit ' +
      'every single financial period". The scope is not stated.',
  },
  {
    ingameYear: 2009,
    reportedProfitGbp: 100_000_000,
    profitScope: 'per_company',
    totalVehicles: 13_746,
    aircraftPerCompany: 700, // stated as "over 700" — floor, not exact
    roadVehiclesPerCompany: null,
    trainsTotal: null,
    companiesWithShips: null,
    derived: false,
    source:
      'Video: "13,746 vehicles active on the map. Every single one of the AIs ' +
      'had a fleet of over 700 aircraft ... all of the AI companies are raking ' +
      'in over a 100 million in profit every single financial period".',
  },
  {
    ingameYear: 2040,
    reportedProfitGbp: 500_000_000,
    profitScope: 'per_company',
    totalVehicles: null,
    aircraftPerCompany: null,
    roadVehiclesPerCompany: 4_000, // "over 4,000"
    trainsTotal: 700, // "around 700 trains across the map"
    companiesWithShips: 4, // "four of the five AIs have also dabbled in ships"
    derived: false,
    source:
      'Video: "Every single one of the AIs was running over 4,000 road ' +
      'vehicles each ... around 700 trains across the map ... four of the five ' +
      'AIs have also dabbled in ships ... pulling in around 500 million in ' +
      'profit every financial period".',
  },
  {
    ingameYear: 2050, // "shortly after the year 2050"
    reportedProfitGbp: 700_000_000,
    profitScope: 'ambiguous',
    totalVehicles: null,
    aircraftPerCompany: null,
    roadVehiclesPerCompany: 5_000, // the hard cap
    trainsTotal: null,
    companiesWithShips: 4,
    derived: false,
    source:
      'Video: "Every single company had reached the maximum limit of 5,000 ' +
      'road vehicles ... the AI strategy stalling at just under 700 million per ' +
      'financial period". This is the freeze point — no further growth.',
  },
  {
    ingameYear: 2070,
    reportedProfitGbp: 700_000_000,
    profitScope: 'ambiguous',
    totalVehicles: 40_000, // "just under 40,000 active vehicles"
    aircraftPerCompany: null,
    roadVehiclesPerCompany: 5_000,
    trainsTotal: null,
    companiesWithShips: 4,
    derived: true,
    source:
      'Video: "just under 40,000 active vehicles pathing across the map"; AI ' +
      'expansion frozen since the 2050 cap. The 2070 row is DERIVED: the video ' +
      'freezes the AI narrative shortly after 2050, and 2070 is used only to ' +
      'align this array with the human run.',
  },
];

/**
 * End-state totals for the AI run. Kept separate from the per-year snapshots
 * because they are cumulative outcomes, not point-in-time company stats.
 */
export const aiRunEndState = {
  /** Total vehicles destroyed across the whole game. */
  vehiclesDestroyed: 14_640,
  /** Of which road vehicles. */
  roadVehiclesDestroyed: 77,
  /** Of which aircraft — the remainder. */
  aircraftDestroyed: 14_563, // derived: 14,640 - 77
  aircraftDestroyedDerived: true,
  /** First crash toll, at Miningbury. */
  miningburyPassengersKilled: 115,
  /** Engine performance at the end: "between a third and half normal speed". */
  engineSpeedFraction: { low: 1 / 3, high: 0.5, derived: true },
  /** Configured game-year length, minutes. Also published on the Season 12 page. */
  minutesPerGameYear: 45,
  /** The hard cap that caused the collapse. */
  roadVehicleCap: 5_000,
  /** Vehicle cap per transport type set by the operator. */
  vehicleCapPerType: 5_000,
  source:
    'Video end-game tally: "14,640 vehicles destroyed ... only 77 of them were ' +
    'road vehicles ... well over 14,000 aircraft smashed into the runways"; ' +
    '"115 virtual passengers ... perish in a fiery crash ... at Miningbury"; ' +
    '"between a third and half normal speed"; "each game year to last 45 minutes".',
} as const;

/* ------------------------------------------------------------------ *
 * The universe
 * ------------------------------------------------------------------ */

export const masterHellishAiVsCommunityUniverse = {
  universeId: 'series:can_5_overpowered_ais_beat_our_community_openttd_map:2026',
  type: UniverseType.SERIES,

  identifiers: {
    primary: 'series:can_5_overpowered_ais_beat_our_community_openttd_map:2026',
    aliases: [
      'Can 5 Overpowered AIs Beat Our Community OpenTTD Map?',
      'I Gave 5 AIs the Exact Same Map as My Community',
      'OpenTTD AI Battles: 5 AIs vs the Community Map',
    ],
  },

  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: 'series:openttd_season_12_connect_the_world:2025',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'The video states the map is a blank version of the community starting map rolled back to the year 2000.',
          'masterhellish.net/downloads ships "OpenTTD Let\'s Play Season 12 PART 2 (Y2000) - Starting Scenario", the canvas the video describes.',
          'masterhellish.net/s12 records the Season 12 identity, format and goals the video reports on.',
        ],
      },
    ],
  },

  attribution: {
    copyright: {
      holders: ['Master Hellish'],
      year: 2026,
      status: 'active',
    },
    creators: creatorRefs({
      director: ['Master Hellish'],
      writer: ['Master Hellish'],
    }),
    citations_required: true,
    usage_restrictions: [
      'Copyrighted video. This record contains no footage, audio or transcript excerpt beyond short quotations for identification and analysis.',
    ],
    sources: [
      'https://www.youtube.com/watch?v=Pd0q5Xit13U — transcript, chapters, runtime, publication and view count (retrieved 2026-10-19)',
      'YouTube oEmbed endpoint — title and author verification',
      'Video description — AAAhogEX, blank Year 2000 map, 4,000km/h vacuum tubes, AI Battles series and playlist',
      'masterhellish.net/s12 and masterhellish.net/downloads — Season 12 ground truth',
      'https://www.youtube.com/watch?v=LWb_pcwsXKM — Season 12 finale, for the season window',
    ],
  },

  layers: [
    {
      layerId: 'primary_layer',
      type: 'primary',
      epochs: {
        publication: {
          // #19 — explicit epochId is mandatory; without it the registry
          // silently renames the epoch to the layer key.
          epochId: 'series:can_5_overpowered_ais_beat_our_community_openttd_map:publication',
          startTime: VIDEO_PUBLISHED,
          endTime: VIDEO_PUBLISHED + BigInt(RUNTIME_SECONDS) * 1_000_000_000n,
          precision: TimePrecision.SECOND,
          description:
            'Runtime of the published video (19:03), expressed on the wall ' +
            'clock. The publication instant is verified from the video metadata ' +
            '(2026-10-16T15:08:21Z).',
        },
      },
    },
    {
      /**
       * The simulated AI world. Modelled as a recreation layer rather than
       * asserted as fact — the five AI companies are script instances inside
       * OpenTTD, not real operators.
       *
       * NOTE ON THE TIME AXIS: the in-game calendar runs 2000-2070, which is
       * simulation time and is NOT wall-clock. The epoch below is anchored to
       * the publication window because epochs are absolute; the 2000-2070 span
       * is recorded as a deviation and must not be read as a date range.
       */
      layerId: 'ai_simulation_recreation',
      type: 'recreation',
      reality_correspondence: {
        // The counterfactual composition over Season 12's Part 2 (Y2000) canvas.
        to: 'series:openttd_season_12_connect_the_world:2025',
        // Low accuracy: five identical scripts on a blank canvas, not a
        // re-enactment of what the humans actually did.
        accuracy: 0.35,
        deviations: [
          'Blank year-2000 canvas (the Season 12 Part 2 Y2000 scenario). The Season 12 map at the same in-game date carries the human team\'s accumulated infrastructure.',
          'No human participants. All five companies are the same script (AAAhogEX) instantiated five times, so strategy diversity is zero by construction — the opposite of Season 12\'s two-guests-per-stream format.',
          'Top-tier technology mods left enabled, including Vactrain Set Fork vacuum tubes, av8 aircraft and Hover Vehicles, per the video\'s stated premise.',
          'Vehicle caps raised to 5,000 per transport type — an operator setting, not a game rule. This cap directly causes the AI collapse and has no counterpart in the human run.',
          'The in-game press releases announced construction had begun while zero stations existed — a simulated assertion contradicted by observable game state. Recorded here rather than as a `contradicts` anchor, which would flip the charge sign of a documentary work.',
          'Aircraft loss is a simulation artefact, not a real safety claim: 14,563 of 14,640 destroyed vehicles were aircraft.',
          'The in-game calendar 2000-2070 is simulation time; the wall-clock publication window is 19 minutes.',
        ],
      },
      epochs: {
        ai_run: {
          epochId: 'series:can_5_overpowered_ais_beat_our_community_openttd_map:ai_run',
          startTime: VIDEO_PUBLISHED,
          endTime: VIDEO_PUBLISHED + BigInt(RUNTIME_SECONDS) * 1_000_000_000n,
          precision: TimePrecision.SECOND,
          description:
            'Wall-clock anchor for the AI simulation as presented. In-game ' +
            'years 2000-2070 are a compressed simulation axis, not real dates.',
        },
      },
    },
  ],

  temporalStructure: {
    /**
     * Keyframe timestamps are absolute: the publication instant plus the cue
     * offset. They are therefore comparable with the epochs above, and the
     * `at()` helper makes an offset auditable from the chapter list.
     */
    keyframes: [
      {
        id: 'premise_ai_vs_human_format',
        timestamp: at(0, 0),
        significance: 0.8,
        tags: ['premise', 'format', 'ai_vs_human'],
        type: KeyframeType.MILESTONE,
        description:
          'Cold open. The channel\'s hand-built community transport empire is ' +
          'introduced, and the two-part experiment is framed: five AI instances ' +
          'on a blank map, then a head-to-head against the human build.',
      },
      {
        id: 'five_aaahogex_instances_deployed',
        timestamp: at(0, 46),
        significance: 0.9,
        tags: ['ai_deployment', 'aaahogex', 'overpowered_mods'],
        type: KeyframeType.LAUNCH,
        description:
          'Five instances of AAAhogEX — a notoriously aggressive script that ' +
          'evaluates cargo routes and dominates supply chains — are released ' +
          'with all overpowered top-tier technology mods left enabled.',
      },
      {
        id: 'blank_2000_canvas_unleashed',
        timestamp: at(1, 37),
        significance: 0.85,
        tags: ['experiment_start', 'year_2000', 'season_12_part_2_scenario'],
        type: KeyframeType.LAUNCH,
        description:
          'A blank Year 2000 version of the Season 12 Part 2 canvas is handed ' +
          'entirely to the AIs. In-game press releases claim construction has ' +
          'begun while no station exists; the script is still evaluating ~1,800 ' +
          'towns and ~3,500 industries, and nothing is built before May.',
      },
      {
        id: 'spiffing_brit_oil_helicopter',
        timestamp: at(2, 41),
        significance: 0.8,
        tags: ['guest', 'spiffing_brit', 'mod', 'helicopter', 'improvisation'],
        type: KeyframeType.MILESTONE,
        description:
          'Flashback to the human origin. The Spiffing Brit joins the first ' +
          'community stream and finds a mod helicopter capable of carrying ' +
          'crude oil. Impractical and low-margin, but spectacular — and later ' +
          'overhauled by the community.',
      },
      {
        id: 'ai_targets_passengers_and_mail',
        timestamp: at(4, 4),
        significance: 0.9,
        tags: ['ai_strategy', 'airports', 'buses', 'join_station'],
        type: KeyframeType.MILESTONE,
        description:
          'The AIs ignore heavy industry and optimise for passengers and mail: ' +
          'airports around the largest towns plus a web of bus stations. ' +
          'Frequent station activity drives town growth; the join-station ' +
          'feature merges bus stops into airport catchments to expand coverage.',
      },
      {
        id: 'miningbury_runway_crash',
        timestamp: at(4, 30),
        significance: 0.9,
        tags: ['aircraft_crash', 'casualties', 'first_loss'],
        type: KeyframeType.MILESTONE,
        description:
          '115 virtual passengers die in the first fiery runway crash at ' +
          'Miningbury. Aircraft are notoriously dangerous in OpenTTD relative ' +
          'to real life, and the video predicts more losses.',
      },
      {
        id: 'openttd_dev_and_david_x_newton_join',
        timestamp: at(5, 55),
        significance: 0.75,
        tags: ['guest', 'openttd_developer', 'david_x_newton', 'hidden_mechanics'],
        type: KeyframeType.MILESTONE,
        description:
          'Two more guests join — a core OpenTTD developer and David X Newton. ' +
          'Rather than a mega-network, the session becomes a long discussion of ' +
          'hidden game mechanics. The most striking: the longer an aircraft ' +
          'spends on a runway during a landing attempt, the higher its crash ' +
          'probability, so longer runways and slower aircraft are worse.',
      },
      {
        id: 'ai_2009_13746_vehicles',
        timestamp: at(8, 6),
        significance: 0.9,
        tags: ['ai_peak', 'fleet_size', 'urban_growth', 'spaghetti'],
        type: KeyframeType.MILESTONE,
        description:
          'At 2009 the AI map carries 13,746 active vehicles; every AI runs ' +
          'over 700 aircraft and town populations have exploded. All AI ' +
          'companies exceed £100M per period, but some rail networks are ' +
          'spaghetti and the skies are a swarm of aircraft.',
      },
      {
        id: 'vacuum_tube_mega_projects',
        timestamp: at(9, 35),
        significance: 0.85,
        tags: ['vacuum_tube', 'technology', 'mega_project', 'collaboration'],
        type: KeyframeType.MILESTONE,
        description:
          'The human team adopts vacuum tube technology — extremely expensive ' +
          'to deploy, but highly profitable once set up. Three mega-projects ' +
          'follow: a loop of loops, a railway around the world, and the great ' +
          'oil line, a bidirectional vacuum-tube spine fed by ship networks and ' +
          'moving cargo above 4,000 km/h.',
      },
      {
        id: 'ai_2040_urban_sprawl',
        timestamp: at(11, 55),
        significance: 0.9,
        tags: ['urban_sprawl', 'town_growth', 'bus_flooding'],
        type: KeyframeType.MILESTONE,
        description:
          'By mid-2040 the AI map is overrun by cities. Every AI runs over ' +
          '4,000 road vehicles, the town-growth algorithm goes wild, and urban ' +
          'sprawl covers much of the map — engulfing bus routes and most ' +
          'airports, which can no longer expand to larger, higher-throughput ' +
          'variants. With barely any countryside left, new rail between ' +
          'industries is nearly impossible and some AIs resort to aircraft for ' +
          'industrial setups. All five pull in around £500M per period.',
      },
      {
        id: 'ai_hits_5000_road_vehicle_cap',
        timestamp: at(14, 58),
        significance: 1.0,
        tags: ['turning_point', 'vehicle_cap', 'logic_loop', 'defining_moment'],
        type: KeyframeType.MILESTONE,
        description:
          'DEFINING MOMENT. Shortly after 2050 every AI reaches the hard 5,000 ' +
          'road-vehicle cap. Each AI keeps scanning for the best town, attempts ' +
          'its bus-and-airport strategy, fails at the vehicle-purchase step, and ' +
          'restarts — an endless logic loop. No crash, no adaptation, no growth. ' +
          'The script cannot pivot to another strategy.',
      },
      {
        id: 'simulation_slowdown_40000_vehicles',
        timestamp: at(16, 12),
        significance: 0.85,
        tags: ['performance', 'gridlock', 'simulation_limits'],
        type: KeyframeType.MILESTONE,
        description:
          'With just under 40,000 vehicles pathing at once, the engine runs at a ' +
          'third to half normal speed; each game year was already configured to ' +
          'last 45 minutes. Expansion has stopped and the simulation is grinding.',
      },
      {
        id: '14640_destroyed_vehicles_tally',
        timestamp: at(16, 50),
        significance: 0.8,
        tags: ['statistics', 'aircraft_crashes', 'cost_of_strategy'],
        type: KeyframeType.MILESTONE,
        description:
          'Out of 14,640 vehicles destroyed across the game, only 77 were road ' +
          'vehicles — well over 14,000 aircraft smashed into runways. The final ' +
          'cost of the AI profit strategy.',
      },
      {
        id: 'humans_overtake_850m_profit',
        timestamp: at(17, 14),
        significance: 1.0,
        tags: ['human_victory', 'defining_moment', 'community_result', 'season_12'],
        type: KeyframeType.MILESTONE,
        description:
          'DEFINING MOMENT. The community, once at half the AI\'s profit, ' +
          'marches past it. By the final year, 2070, human operating profit ' +
          'peaks above £850M.',
      },
      {
        id: 'brute_force_versus_adaptability',
        timestamp: at(17, 53),
        significance: 0.9,
        tags: ['conclusion', 'thesis', 'ai_limits', 'human_adaptability'],
        type: KeyframeType.MILESTONE,
        description:
          'The video\'s thesis: brute-force code versus human adaptability. Bus ' +
          'spam is a strong early system right up until a hard limit locks the ' +
          'script into an endless loop. Humans naturally collaborate, connect ' +
          'disparate systems, and overcome logical bottlenecks. Both save files ' +
          'are released for download.',
      },
    ],
    windows: { strategy: 'time_based' },
  },

  /**
   * Containment (#74): one owner, many memberships. The series and the channel
   * are containers; the Season 12 tie is a `documents` reality anchor, not a
   * parent, because the video is about the season rather than part of it.
   */
  connections: {
    natural: {
      parentUniverses: [
        'series:master_hellish_openttd_ai_battles:2026',
        'history:master_hellish_channel:*',
      ],
    },
    references: [
      {
        type: 'RUNS_ON',
        targetUniverseId: 'game:openttd:openttd:2004',
        confidence: 1.0,
        description:
          'The experiment is run inside OpenTTD, with all top-tier technology ' +
          'mods left enabled.',
        evidence: [
          'Video description: "In this OpenTTD AI vs Humans experiment"',
          'Video description: "with overpowered future tech mods enabled"',
        ],
      },
      {
        type: 'INSTANTIATES',
        targetUniverseId: 'technology:aaahogex:2022',
        confidence: 1.0,
        description:
          'The five AI companies are five instances of the AAAhogEX script.',
        evidence: [
          'Video description: "five instances of the aggressive AAAhogEX AI"',
          'The video transcript calls the script "a notoriously aggressive artificial intelligence"',
        ],
      },
    ],
  },

  metadata: {
    canonicalName: 'Can 5 Overpowered AIs Beat Our Community OpenTTD Map?',
    description:
      'A 19:03 video essay in which five instances of the aggressive AAAhogEX ' +
      'AI play a blank Year 2000 copy of the Season 12 community map with ' +
      'top-tier technology mods enabled. The AIs dominate early by flooding ' +
      'towns with buses and airports, then freeze permanently at the 5,000 ' +
      'road-vehicle cap; the human community build overtakes them.',
    creators: [
      'Master Hellish (presenter, author)',
      'The Spiffing Brit (guest, first community stream)',
      'David X Newton (guest, OpenTTD mechanics deep-dive)',
      'A core OpenTTD developer (guest; name garbled in the auto-transcript as "two tall Tyler" and NOT verified)',
      'The Master Hellish community (build contributors across live streams)',
    ],
    released: new Date('2026-10-16T15:08:21Z'),
    cultural_significance: 0.70,

    externalIds: { youtubeVideoId: 'Pd0q5Xit13U' },
    metricsAsOf: '2026-10-19',
    viewCountAtRetrieval: 112_302,

    /**
     * The video's numeric payload for the simulated run. The human run is in
     * `season-12-connect-the-world.ts` because those numbers are season ground
     * truth, not a property of this video.
     */
    ingameMetrics: {
      aiRun: aiRunMetrics,
      endState: aiRunEndState,
      mapScaleFromVideo: { towns: 1800, industries: 3500, derived: false },
    },

    chapters: [
      { time: '0:00', title: 'The grand experiment' },
      { time: '1:38', title: 'Unleashing the algorithms' },
      { time: '2:41', title: 'Spiff\'s questionable oil idea' },
      { time: '4:04', title: 'A sneaky two-part strategy' },
      { time: '5:55', title: 'Calling in the experts' },
      { time: '8:06', title: 'Spaghetti tracks and swarming skies' },
      { time: '9:35', title: 'Vacuum tubes and mega projects' },
      { time: '11:55', title: 'Attack of the urban sprawl' },
      { time: '14:58', title: 'The 2050 plot twist' },
      { time: '17:17', title: 'The final showdown' },
    ],

    retrieval: {
      domain: 'transport simulation / video game commentary',
      format: 'video essay',
      subjects: [
        'OpenTTD',
        'artificial intelligence',
        'transport simulation',
        'AI versus human strategy',
        'agent design limits',
        'community building',
      ],
      charge_source: 'realityRelation.type = documentary -> +1 (non-fiction tier)',
      weight_source:
        'RealityGradient.level folded with cultural_significance (0.70), ' +
        'keyframe significances and certainties, and anchor confidences',
    },
  },
} as unknown as Universe;
