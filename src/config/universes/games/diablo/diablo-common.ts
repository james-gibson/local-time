import {
  KeyframeType,
  RealityAnchor,
  TimePrecision,
  Universe,
  UniverseType,
} from '../../../../core/types';
import { UniverseId, createGameUniverseId } from '../../../../core/universe-ids';

/**
 * Diablo — shared builder for the mainline game universes.
 *
 * The `game:` namespace (`createGameUniverseId` -> `game:<franchise>:<title>:<year>`)
 * is the declared video-game vocabulary, so every Diablo entry is
 * `game:diablo:<entry>:<year>`. The franchise container is the one exception: it
 * carries a 1996–2026 *span*, and `game:` requires a `\d{4}` release year, so it
 * uses the HISTORICAL vocabulary like every other franchise umbrella
 * (`CommonUniverseIds.DIABLO_FRANCHISE`).
 *
 * These are hand-authored literals rather than `UniverseBuilder` calls: the
 * builder has no `.game()` method (james-gibson/local-time#112 §11.1), it cannot
 * set `UniverseType.GAME`, and `addDateSegment`/`addSegment` drop a segment's
 * `description`/`status` (james-gibson/local-time#100). A factory keeps the nine
 * base/expansion universes identical in every dimension that is not their data.
 *
 * Research sources (Wikipedia *Diablo (series)*, Blizzard product pages, the
 * Diablo Wiki series listing) are repeated per universe so an individual
 * universe is attributable without the container.
 */

/** The three research sources shared by every Diablo universe. */
export const DIABLO_SOURCES = [
  'Wikipedia, "Diablo (series)" — release dates, developer chain, expansion list',
  'Blizzard Entertainment official product pages',
  'Diablo Wiki (Fandom) series listing',
] as const;

const USAGE_RESTRICTIONS = [
  'Trademarks, character names and game assets © Blizzard Entertainment',
  'Fair use for criticism, commentary and knowledge indexing',
];

const MICROS_PER_NANOSECOND = 1_000_000n;

/** An absolute timestamp from a UTC calendar date, in the repository's ns convention. */
export function diabloTimestamp(year: number, monthIndex: number, day: number): bigint {
  return BigInt(Date.UTC(year, monthIndex, day)) * MICROS_PER_NANOSECOND;
}

export interface DiabloGameSpec {
  /** Branded id from `createGameUniverseId`. */
  id: ReturnType<typeof createGameUniverseId>;
  /** Canonical display name, e.g. "Diablo II: Lord of Destruction". */
  canonicalName: string;
  /** Slug used for keyframe/epoch ids, e.g. "diablo_ii_lord_of_destruction". */
  slug: string;
  aliases: string[];
  /** Release year — the trailing id segment and the flavour of the era epoch. */
  year: number;
  /** The release keyframe's timestamp. */
  releaseTimestamp: bigint;
  certainty: number;
  dateRange?: { earliest: bigint; latest: bigint };
  /** Keyframe tags; `release` is always added by the factory. */
  tags: string[];
  significance: number;
  culturalSignificance: number;
  culturalNote: string;
  creators: { director?: string[]; writer?: string[] };
  copyrightHolders: string[];
  /** Containers this universe is a member of (one owner, many memberships). */
  parentUniverses?: UniverseId[];
  realityAnchors?: RealityAnchor[];
  /** Extra keyframes (all RELEASE-typed) for a universe with more than one launch. */
  extraKeyframes?: Array<{
    id: string;
    timestamp: bigint;
    significance: number;
    tags: string[];
    certainty?: number;
    dateRange?: { earliest: bigint; latest: bigint };
  }>;
}

const DAY = 86_400_000_000_000n;

/**
 * Build one Diablo game universe. Every universe is fiction
 * (`pure_fiction`, degree 1.0 — Sanctuary and the Prime Evils are not real), so
 * it projects `plane_charge = -1` (james-gibson/local-time#112 §9).
 */
export function createDiabloGameUniverse(spec: DiabloGameSpec): Universe {
  const eraStart = BigInt(Date.UTC(spec.year, 0, 1)) * MICROS_PER_NANOSECOND;
  const eraEnd = BigInt(Date.UTC(spec.year, 11, 31, 23, 59, 59)) * MICROS_PER_NANOSECOND;

  const keyframes = [
    {
      id: `${spec.slug}_release`,
      timestamp: spec.releaseTimestamp,
      significance: spec.significance,
      tags: ['release', ...spec.tags],
      type: KeyframeType.RELEASE,
      certainty: spec.certainty,
      ...(spec.dateRange ? { dateRange: spec.dateRange } : {}),
    },
    ...(spec.extraKeyframes ?? []).map((k) => ({
      id: k.id,
      timestamp: k.timestamp,
      significance: k.significance,
      tags: ['release', ...k.tags],
      type: KeyframeType.RELEASE,
      certainty: k.certainty,
      ...(k.dateRange ? { dateRange: k.dateRange } : {}),
    })),
  ];

  const firstRelease = keyframes
    .map((k) => k.timestamp)
    .reduce((a, b) => (a < b ? a : b), spec.releaseTimestamp);

  return {
    universeId: spec.id,
    type: UniverseType.GAME,
    epochs: undefined,
    identifiers: {
      primary: spec.id,
      aliases: spec.aliases,
    },
    realityRelation: {
      type: 'pure_fiction',
      fictionalizationDegree: 1.0,
      realityAnchors: spec.realityAnchors ?? [],
    },
    attribution: {
      public_domain: false,
      copyright: {
        holders: spec.copyrightHolders,
        year: spec.year,
        status: 'active',
      },
      creators: spec.creators,
      sources: [...DIABLO_SOURCES],
      citations_required: true,
      usage_restrictions: [...USAGE_RESTRICTIONS],
    },
    connections: {
      natural: { parentUniverses: spec.parentUniverses ?? [] },
    },
    layers: [
      {
        layerId: 'release_timeline',
        type: 'primary',
        epochs: {
          release_era: {
            epochId: `diablo:${spec.slug}`,
            startTime: eraStart,
            endTime: eraEnd,
            precision: TimePrecision.YEAR,
            description: `${spec.canonicalName} release era (${spec.year})`,
          },
        },
      },
    ],
    temporalStructure: {
      segments: [
        {
          id: `${spec.slug}_release_window`,
          start: firstRelease - 7n * DAY,
          end: firstRelease + 7n * DAY,
          type: 'phase',
          status: 'active',
          description: `Launch window around the ${spec.year} release of ${spec.canonicalName}`,
        },
      ],
      keyframes,
      windows: { strategy: 'phase_based' },
    },
    metadata: {
      canonicalName: spec.canonicalName,
      creators: [...(spec.creators.director ?? []), ...(spec.creators.writer ?? [])],
      // `releaseTimestamp` is the repository's ns convention
      // (`Date.UTC(...) * 1e6`), so dividing back yields the real release Date.
      released: new Date(Number(spec.releaseTimestamp / MICROS_PER_NANOSECOND)),
      cultural_significance: spec.culturalSignificance,
    },
  };
}
