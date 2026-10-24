import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../core/types';
import { creatorRefs } from '../../../core/creators';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * OpenTTD Season 12 — "Connect The World" (Master Hellish, 2025-2026).
 *
 * The channel's 12th community Let's Play: one shared transport company, two
 * guests per stream drawn at random (nobody appears in two consecutive
 * streams), and one "huge" map. This is the human build that the AI-vs-human
 * video measures itself against, so its numbers are ground truth here and stay
 * out of the video's recreation layer.
 *
 * TWO TIME AXES, KEPT SEPARATE.
 * This universe has two clocks that must never be conflated:
 *   1. wall-clock broadcast time (Oct 2025 -> Aug 2026) — the `broadcast` layer
 *   2. in-game simulation time (1930 -> 2070) — the `ingame_world` layer
 * `TemporalEpoch.startTime` is absolute, and the in-game calendar is not, so the
 * in-game span is recorded as an epoch *label* anchored to the broadcast window
 * and never as a wall-clock date range.
 *
 * IN-GAME AXIS — CORRECTED. The previous draft said the season started in 2000.
 * The published Season 12 settings say `Start Year: 1930`, and the downloads
 * page ships "Part 1 End Save (Before the Y2k wipe)" plus "PART 2 (Y2000) -
 * Starting Scenario". So the season has two lineages: Part 1 runs 1930 -> 2000,
 * Part 2 restarts at 2000 and runs to 2070. The AI experiment uses the Part 2
 * (Y2000) canvas.
 *
 * Reality Relation: `documentary` at 0.0. The broadcast, its participants and
 * its save files are real. The transport empire inside the game is a simulation
 * and is confined to the `ingame_world` layer.
 *
 * Cultural Significance: 0.65 — a 42-episode, ~10-month community series with a
 * documented guest format and publicly released saves; significant within
 * OpenTTD community content, below the cross-domain 0.85 band.
 *
 * Research Sources (all retrieved 2026-10-19):
 * - https://masterhellish.net/s12 — season identity, format, goals, mods,
 *   settings (start year 1930, 45 minutes/year, 5000 vehicle caps), showcase
 *   years 2000 and 2050, guest rules.
 * - https://masterhellish.net/downloads/category/8-let-s-plays — the three
 *   Season 12 save artefacts.
 * - https://masterhellish.net/downloads/download/8-let-s-plays/100-… —
 *   Starting Scenario created 2025-10-16.
 * - https://www.youtube.com/watch?v=LWb_pcwsXKM — finale, "S12 #42", published
 *   2026-08-28T16:44:15-07:00, duration 15,524 s (4:18:44).
 * - Video transcript of https://www.youtube.com/watch?v=Pd0q5Xit13U — the
 *   human company's in-game figures.
 */

const ns = (iso: string): bigint => dateToNanoseconds(new Date(iso));

/* ------------------------------------------------------------------ *
 * Time base — wall-clock broadcast only
 * ------------------------------------------------------------------ */

/** The Starting Scenario was published 2025-10-16 (verified on the download page). */
const SCENARIO_PUBLISHED = ns('2025-10-16T00:00:00Z');

/** Finale publication instant: 2026-08-28T16:44:15-07:00 == 2026-08-28T23:44:15Z. */
const FINALE_PUBLISHED = ns('2026-08-28T23:44:15Z');

/** The finale's published runtime: 15,524 seconds (4:18:44). */
const FINALE_RUNTIME_SECONDS = 15_524;

const FINALE_END =
  FINALE_PUBLISHED + BigInt(FINALE_RUNTIME_SECONDS) * 1_000_000_000n;

/* ------------------------------------------------------------------ *
 * In-game metric payloads (simulation time — NOT wall-clock)
 * ------------------------------------------------------------------ */

/**
 * One snapshot of the shared company at a given IN-GAME year.
 *
 * `null` means "not reported by the source", never zero. Money is in GBP as the
 * source reports it; the raw figure is kept so the transcript's wording
 * ("half a billion", "34 billion") is recoverable.
 */
export interface IngameMetricSnapshot {
  ingameYear: number;
  /** Operating profit per financial period, GBP. The company is shared, so this is company-level. */
  operatingProfitGbp: number | null;
  /** Bank balance, GBP. */
  bankGbp: number | null;
  trains: number | null;
  roadVehicles: number | null;
  ships: number | null;
  aircraft: number | null;
  /** True when the figure is an inference, not a stated number. */
  derived: boolean;
  /** Where the figure comes from, verbatim where possible. */
  source: string;
}

/**
 * The Season 12 human build. Every row is transcribed from the video's on-screen
 * figures; none is invented, and gaps are `null`.
 */
export const season12HumanMetrics: IngameMetricSnapshot[] = [
  {
    ingameYear: 2002,
    operatingProfitGbp: 2_500_000,
    bankGbp: 25_000_000,
    trains: null,
    roadVehicles: null,
    ships: null,
    aircraft: null,
    derived: false,
    source:
      'Video: "our operating profit was only sitting at 2.5 million, we had a ' +
      'solid 25 million in the bank account" (end of the first stream).',
  },
  {
    ingameYear: 2009,
    operatingProfitGbp: 13_000_000,
    bankGbp: 500_000_000,
    trains: 277,
    roadVehicles: 190,
    ships: 225,
    aircraft: 72,
    derived: false,
    source:
      'Video: "13 million in operating profit, half a billion in the bank ... ' +
      '277 trains, 190 road vehicles, 225 ships, and 72 aircraft".',
  },
  {
    ingameYear: 2040,
    operatingProfitGbp: 250_000_000,
    bankGbp: 34_000_000_000,
    trains: null,
    roadVehicles: null,
    ships: null,
    aircraft: null,
    derived: false,
    source:
      'Video: "around 250 million in profit every financial period ... 34 ' +
      'billion sitting in the bank account"; the fleet is stated only as ' +
      '"just over 1,000 of each specific vehicle type" — a deliberate ' +
      'player-set target, so no single per-type figure is recorded here.',
  },
  {
    ingameYear: 2070,
    operatingProfitGbp: 850_000_000,
    bankGbp: null,
    trains: null,
    roadVehicles: null,
    ships: null,
    aircraft: null,
    derived: false,
    source:
      'Video: "by the time we\'d reached the final year of the game in 2070 ... ' +
      'operating profit had peaked to over 850 million".',
  },
];

/* ------------------------------------------------------------------ *
 * The universe
 * ------------------------------------------------------------------ */

export const season12ConnectTheWorldUniverse = {
  universeId: 'series:openttd_season_12_connect_the_world:2025',
  type: UniverseType.SERIES,

  identifiers: {
    primary: 'series:openttd_season_12_connect_the_world:2025',
    aliases: [
      'OpenTTD Season 12',
      'Connect The World - OpenTTD Season 12',
      'OpenTTD Let\'s Play Season 12',
      'S12',
    ],
  },

  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [],
  },

  attribution: {
    copyright: {
      holders: ['Master Hellish'],
      year: 2025,
      status: 'active',
    },
    creators: creatorRefs({
      director: ['Master Hellish'],
    }),
    citations_required: true,
    sources: [
      'masterhellish.net/s12 — season identity, format, goals, mods and settings',
      'masterhellish.net/downloads — Season 12 save artefacts',
      'masterhellish.net/downloads/…/100-openttd-lets-play-season-12-starting-scenario — created 2025-10-16',
      'YouTube: "OpenTTD Season 12 Finale: Did We Connect The World?" (S12 #42), published 2026-08-28',
    ],
  },

  layers: [
    /* ---------------- Layer 1: the broadcast (real, wall-clock) ------------- */
    {
      layerId: 'broadcast',
      type: 'primary',
      epochs: {
        season_run: {
          // #19 — explicit epochId is mandatory; without it the registry
          // silently renames the epoch to the layer key.
          epochId: 'series:openttd_season_12:2025:broadcast_run',
          startTime: SCENARIO_PUBLISHED,
          endTime: FINALE_END,
          precision: TimePrecision.MINUTE,
          description:
            'Wall-clock run of the 42-stream season. The start is the Starting ' +
            'Scenario publication (2025-10-16), the earliest verified instant; ' +
            'the first live stream date is not recorded. The end is the finale ' +
            '(#42) publication instant 2026-08-28T23:44:15Z plus its published ' +
            'runtime of 4:18:44.',
        },
      },
      windows: {
        strategy: 'time_based',
        avgWindowSize: BigInt(7 * 24 * 3600) * 1_000_000_000n, // ~one week
      },
    },

    /* ---------------- Layer 2: the in-game world (simulation time) ---------- */
    {
      layerId: 'ingame_world',
      type: 'recreation',
      /**
       * NO `reality_correspondence`. There is no real place, person or event the
       * in-game world corresponds to: it is a fictional map played inside a game.
       * Pointing the layer at its own universe would assert a correspondence
       * instead of recording one, so the deviations live in the epoch text.
       */
      epochs: {
        ingame_era: {
          epochId: 'series:openttd_season_12:ingame:1930_2070',
          // Anchored to the broadcast window purely so the epoch has absolute
          // bounds. The 1930-2070 span is the epoch's LABEL, not its time.
          startTime: SCENARIO_PUBLISHED,
          endTime: FINALE_PUBLISHED,
          precision: TimePrecision.YEAR,
          description:
            'In-game era label: 1930-2070. SIMULATION time — NOT a wall-clock ' +
            'date range. Part 1 runs 1930 -> 2000 ("Part 1 End Save (Before the ' +
            'Y2k wipe)"); Part 2 (Y2000) restarts at 2000 and runs to 2070. The ' +
            'season page sets Start Year 1930, 45 minutes per game year, and ' +
            '5,000 vehicle caps. The season showcases years 2000 and 2050.',
        },
      },
    },
  ],

  temporalStructure: {
    /**
     * No `segments`: the Part 1 / Part 2 boundary is the "Y2K wipe", whose date
     * is not recorded. Splitting a timeline at an unknown instant would assert
     * a boundary the source does not give, so the two-part structure lives in
     * the `ingame_era` description instead.
     */
    keyframes: [
      {
        id: 'starting_scenario_published',
        timestamp: SCENARIO_PUBLISHED,
        significance: 0.8,
        tags: ['scenario', 'publication', 'part-1'],
        type: KeyframeType.PUBLICATION,
        certainty: 0.9,
        description:
          'The Season 12 Starting Scenario is published for download, giving ' +
          'players the shared map. The Part 2 (Y2000) scenario is a later, ' +
          'separate download whose publication date is not recorded.',
      },
      {
        id: 'finale_stream_42',
        timestamp: FINALE_PUBLISHED,
        significance: 1.0,
        tags: ['finale', 'stream-42', 'season-end'],
        type: KeyframeType.PUBLICATION,
        certainty: 1.0,
        description:
          'Finale (#42): "Did We Connect The World?" — the crew returns for one ' +
          'night to stress the completed network. Runtime 4:18:44.',
      },
    ],
    windows: { strategy: 'time_based' },
  },

  /**
   * Containment (#74) — one owner, many memberships. This universe is owned by
   * the season id and is a MEMBER of the channel. The video points at it through
   * a `documents` anchor; do not re-declare this id to place it in the channel.
   */
  connections: {
    natural: {
      parentUniverses: ['history:master_hellish_channel:*'],
    },
    references: [
      {
        type: 'PLAYED_WITH',
        targetUniverseId: 'game:openttd:openttd:2004',
        confidence: 1.0,
        description:
          'The season is a Let\'s Play of OpenTTD, played on the published ' +
          'Starting Scenario under the mods and settings listed in seasonFacts.',
        evidence: [
          'masterhellish.net/s12 — mods and settings list for the season',
          'The season page links https://fantasticfreegames.com/openttd and the OpenTTD mod set',
        ],
      },
    ],
  },

  metadata: {
    canonicalName: 'OpenTTD Season 12: Connect The World',
    description:
      'A 42-stream community Let\'s Play in which Master Hellish and two guests ' +
      'per stream share one OpenTTD transport company on a single huge map, with ' +
      'the goal of connecting the world by rail, air, sea and road.',
    creators: ['Master Hellish', 'Two guests per stream (drawn at random)'],
    released: new Date('2025-10-16T00:00:00Z'),
    cultural_significance: 0.65,

    /** Structured, retrievable season figures. */
    seasonFacts: {
      seasonNumber: 12,
      title: 'Connect The World',
      platform: 'OpenTTD',
      format: 'shared company, two rotating guests per stream',
      streamCount: 42,
      guestSlots: 84,
      guestSlotsDerived: true,
      guestRule: 'drawn at random; never two consecutive streams',
      cadence: 'Saturday and Sunday, 20:00 UK',
      cadenceVerified: false,
      startingScenarioPublished: '2025-10-16',
      firstStreamDate: null,
      finaleDate: '2026-08-28',
      finaleStreamNumber: 42,
      finaleRuntimeSeconds: 15_524,
      ingamePart1StartYear: 1930,
      ingamePart2StartYear: 2000,
      ingameEndYear: 2070,
      ingameShowcaseYears: [2000, 2050],
      minutesPerGameYear: 45,
      vehicleCapPerType: 5_000,
      mapScale: 'huge (dimensions not published)',
      goals: [
        'connect the world',
        'largest network',
        'most connected',
        'most efficient',
      ],
      modes: ['trains', 'planes', 'ships', 'road vehicles'],
      mods: [
        'Iron Horse 3.37.0',
        'av8 Aviators Aircraft Set',
        'SHARK 1.0',
        'Hover Vehicles 1.0',
        'Vactrain Set Fork 1.1.3',
        'Industrial Stations Renewal 1.0.2',
        'ISR Rail & Road Depots v0.2',
        'Improved Generic Tram Set',
        'Total Town Replacement Set 3.14',
        'Total Bridge Renewal Set Version 1',
        'UK Town Names v1.0',
        'British Station Set v0.0.4',
      ],
      artefacts: [
        'OpenTTD Let\'s Play Season 12 - Starting Scenario (2025-10-16)',
        'OpenTTD Let\'s Play Season 12 Part 1 End Save (Before the Y2k wipe)',
        'OpenTTD Let\'s Play Season 12 PART 2 (Y2000) - Starting Scenario',
      ],
      externalLinks: {
        seasonPage: 'http://masterhellish.net/s12',
        downloads: 'http://masterhellish.net/downloads/category/8-let-s-plays',
        playlist: 'https://www.youtube.com/playlist?list=PLX9TPVcxrORPySDAZQ5OZDjIqYNr6viTI',
        finale: 'https://www.youtube.com/watch?v=LWb_pcwsXKM',
      },
    },

    /**
     * The video's numeric payload. These are season data: the video reports the
     * same shared company the season built, so the figures are ground truth for
     * this universe, not for the video's AI recreation layer.
     */
    ingameMetrics: {
      humanRun: season12HumanMetrics,
      /** Shared map scale, as read from the video's directory screens. */
      mapScaleFromVideo: { towns: 1800, industries: 3500, derived: false },
    },

    /**
     * What was verified in this environment versus carried over from the research
     * transcript. The distinction is the difference between a fact and a guess.
     */
    sourcing: {
      verified: [
        'Season 12 title, format, goals, mods, start year 1930, 45 min/year, 5000 vehicle caps (masterhellish.net/s12)',
        'Starting Scenario published 2025-10-16 (download page "Created")',
        'Finale is S12 #42, published 2026-08-28T23:44:15Z, runtime 15,524 s (YouTube)',
        'Save artefacts Part 1 End / Part 2 (Y2000) (downloads page)',
      ],
      carriedFromResearchTranscript: [
        'Two guests per stream, 42 numbered streams',
        'Saturday/Sunday 20:00 UK cadence',
        'Human in-game profit and fleet figures (reported on screen in the video)',
      ],
      notRecorded: [
        'Channel launch date',
        'First live stream date',
        'Part 1 End / Part 2 (Y2000) publication dates',
        'Map dimensions',
      ],
    },

    retrieval: {
      domain: 'transport simulation / community Let\'s Play',
      format: 'live streamed series',
      subjects: [
        'OpenTTD',
        'community building',
        'shared company',
        'transport networks',
        'guest collaboration',
        'long-form Let\'s Play',
      ],
      charge_source: 'realityRelation.type = documentary -> +1 (non-fiction tier)',
      weight_source:
        'RealityGradient.level folded with cultural_significance (0.65), ' +
        'anchor confidences and the season figures',
    },
  },
} as unknown as Universe;
