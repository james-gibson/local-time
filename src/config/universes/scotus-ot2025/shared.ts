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
 * Shared vocabulary for the SCOTUS October Term 2025 universes.
 * See james-gibson/local-time#88.
 *
 * Every id here is pinned as a literal; nothing goes through
 * `UniverseBuilder.historical()`, because a case caption is full of punctuation
 * (commas, periods, "Inc.", "U.S.") and slugging it would either throw or
 * produce a different id than the one the ticket pins (#70). See the ticket §3.1.
 */

/** The term container — the single owner of both dockets. */
export const SCOTUS_TERM_ID: UniverseId = createUniverseId('history:scotus_october_term_2025:2025');
/** The merits docket collection (children of the term). */
export const SCOTUS_MERITS_DOCKET_ID: UniverseId = createUniverseId('history:scotus_ot2025_merits_docket:2025');
/** The shadow docket collection (siblings of the merits docket). */
export const SCOTUS_SHADOW_DOCKET_ID: UniverseId = createUniverseId('history:scotus_ot2025_shadow_docket:2025');

/** OT2025 opens on the first Monday of October 2025 and runs to the first Monday of October 2026. */
export const TERM_START_ISO = '2025-10-06';
export const TERM_END_ISO = '2026-10-04';

/** Authoritative sources, cross-verified (§4, §6). */
export const SCOTUS_SOURCES = [
  'supremecourt.gov',
  'SCOTUSblog',
  'Ballotpedia',
  'Brennan Center for Justice',
  'Britannica',
  'supremecourtcasetracker.com',
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
}

/**
 * A hand-authored HISTORICAL/LEGAL universe literal.
 *
 * This is a literal rather than a `UniverseBuilder` result on purpose: the
 * builder cannot emit the top-level `connections.natural.parentUniverses`
 * object the containment edge needs (`Universe` has no `connections` field —
 * see james-gibson/local-time#103/#106), so the object form is attached with a
 * cast, exactly as `usStatehoodHistory.universe.ts` and
 * `usConstitutionalAmendments.universe.ts` already do.
 */
export const scotusUniverse = (input: ScotusUniverseInput): Universe => ({
  universeId: input.universeId,
  type: input.type,
  identifiers: {
    primary: input.universeId,
    aliases: input.aliases ?? [],
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: input.universeId,
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: ['supremecourt.gov slip opinions', 'SCOTUSblog docket'],
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
  },
  connections: {
    natural: { parentUniverses: input.parents },
    references: input.references ?? [],
  },
} as unknown as Universe);
