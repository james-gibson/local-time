import {
  TimePrecision,
  Universe,
  UniverseType,
  KeyframeType,
  TemporalKeyframe,
  TemporalLayer,
  TemporalSegment,
  WindowingStrategy,
} from '../../../core/types';
import { UniverseId, createUniverseId } from '../../../core/universe-ids';

/**
 * Shared vocabulary for the SCOTUS October Term 2013 universes.
 * See james-gibson/local-time#89.
 *
 * Every id is pinned as a literal; nothing goes through
 * `UniverseBuilder.historical()`, because a case caption is full of punctuation
 * (commas, periods, "Inc.", "Co.", "L.P.", "U.S.") and slugging it would either
 * throw or produce a different id than the one the ticket pins (#70, §3.1).
 */

/** The term container — the single owner of both dockets. */
export const SCOTUS_TERM_ID: UniverseId = createUniverseId('history:scotus_october_term_2013:2013');
/** The official (merits) docket collection (children of the term). */
export const SCOTUS_MERITS_DOCKET_ID: UniverseId = createUniverseId('history:scotus_ot2013_official_docket:2013');
/** The shadow (interim/emergency) docket collection (siblings of the merits docket). */
export const SCOTUS_SHADOW_DOCKET_ID: UniverseId = createUniverseId('history:scotus_ot2013_shadow_docket:2013');

/** OT2013 ran from the first Monday of October 2013 to the day before the first Monday of October 2014. */
export const TERM_START_ISO = '2013-10-07';
export const TERM_END_ISO = '2014-10-05';

/**
 * Authoritative sources, cross-verified (§4, §6). `supremecourt.gov` (the slip
 * opinions and orders lists) and the *Journal of the Supreme Court* are primary;
 * SCOTUSblog and Wikipedia are the counts' provenance; the Shadow Docket Database
 * (Kastellec et al.) is the shadow corpus.
 */
export const SCOTUS_SOURCES = [
  'supremecourt.gov — slip opinions and orders lists',
  'SCOTUSblog — OT2013 term page and Final Stat Pack',
  'Journal of the Supreme Court of the United States',
  'Shadow Docket Database (Kastellec et al., Journal of Law and Courts)',
  'Wikipedia — 2013 term opinions of the Supreme Court of the United States',
  'Justia / Cornell LII',
];

export const SCOTUS_CREATOR = 'Supreme Court of the United States';

/** ISO instant -> nanoseconds since the Unix epoch, as `bigint`. */
export const fromIso = (iso: string): bigint => BigInt(new Date(iso).getTime()) * 1_000_000n;

/** A caption -> the `[a-z0-9_]` slug an id segment requires. */
export const slug = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

/** The first and last instant of a `YYYY-MM` sitting month, for an approximate window. */
export const monthBounds = (month: string): { start: string; end: string } => {
  const [year, mon] = month.split('-').map(Number);
  const lastDay = new Date(Date.UTC(year, mon, 0)).getUTCDate();
  return {
    start: `${month}-01T12:00:00Z`,
    end: `${month}-${String(lastDay).padStart(2, '0')}T12:00:00Z`,
  };
};

/**
 * A keyframe on a real docket event.
 *
 * The ticket (§5) asks for `KeyframeType.CERT_GRANT` / `ORAL_ARGUMENT` / `DECISION`.
 * Those members do not exist in the closed `KeyframeType` enum, so a procedural
 * filing/argument is recorded as `MILESTONE` and a decision or order as `RULING`.
 * (The same mapping was adopted for OT2025 in james-gibson/local-time#88.)
 */
export const keyframe = (
  id: string,
  iso: string,
  options: {
    significance: number;
    tags: string[];
    type?: KeyframeType;
    certainty?: number;
    dateRange?: { earliest: string; latest: string };
    description?: string;
  },
): TemporalKeyframe => ({
  id,
  timestamp: fromIso(iso),
  significance: options.significance,
  tags: options.tags,
  type: options.type ?? KeyframeType.MILESTONE,
  ...(options.certainty !== undefined ? { certainty: options.certainty } : {}),
  ...(options.dateRange
    ? {
        dateRange: {
          earliest: fromIso(options.dateRange.earliest),
          latest: fromIso(options.dateRange.latest),
        },
      }
    : {}),
  ...(options.description ? { description: options.description } : {}),
});

export interface ScotusUniverseInput {
  universeId: string;
  type: UniverseType;
  canonicalName: string;
  aliases?: string[];
  description: string;
  /** When the universe "happened" — the argument, filing, or ruling date. */
  released: Date;
  culturalSignificance: number;
  /** `connections.natural.parentUniverses` — the containment edge. */
  parents: string[];
  segments: TemporalSegment[];
  keyframes: TemporalKeyframe[];
  layers?: TemporalLayer[];
  windows?: WindowingStrategy;
  references?: Array<Record<string, unknown>>;
  /** Extra, ticket-specific metadata (e.g. the retroactive-label flag, §5). */
  extraMetadata?: Record<string, unknown>;
}

/**
 * A hand-authored HISTORICAL/LEGAL universe literal.
 *
 * A literal rather than a `UniverseBuilder` result: the builder writes a
 * containment edge to `metadata.connections`, while this subtree authors the
 * first-class `connections.natural.parentUniverses` object directly — the form
 * `UniverseRegistry.declaredParentUniverses` reads and folds into
 * `CommonUniverseIds` (#74/#106). Both paths are now folded, but the literal keeps
 * the universes' shape explicit and matches the sibling `scotus-ot2025` subtree
 * (james-gibson/local-time#88). The trailing cast mirrors
 * `usStatehoodHistory.universe.ts`.
 */
export const scotusUniverse = (input: ScotusUniverseInput): Universe => ({
  universeId: input.universeId,
  type: input.type,
  identifiers: {
    primary: input.universeId,
    aliases: input.aliases ?? [],
  },
  realityRelation: {
    // Real, government-authored events (§6). Charges are derived downstream, never
    // hand-set: `RealityGradientAnalyzer` reads this to project `level ~ 0.0` (#76).
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: SCOTUS_TERM_ID,
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'supremecourt.gov slip opinions and orders lists',
          'Journal of the Supreme Court of the United States',
        ],
      },
    ],
  },
  attribution: {
    // 17 U.S.C. §105 — works of the U.S. government are public domain.
    public_domain: true,
    sources: SCOTUS_SOURCES,
    citations_required: false,
    usage_restrictions: [],
  },
  layers: input.layers ?? [{ layerId: 'primary', type: 'primary', epochs: {} }],
  epochs: {},
  temporalStructure: {
    segments: input.segments,
    keyframes: input.keyframes,
    windows: input.windows ?? { strategy: 'time_based', avgWindowSize: BigInt(TimePrecision.DAY) },
  },
  metadata: {
    canonicalName: input.canonicalName,
    description: input.description,
    creators: [SCOTUS_CREATOR],
    released: input.released,
    cultural_significance: input.culturalSignificance,
    ...(input.extraMetadata ?? {}),
  },
  connections: {
    natural: { parentUniverses: input.parents },
    references: input.references ?? [],
  },
} as unknown as Universe);
