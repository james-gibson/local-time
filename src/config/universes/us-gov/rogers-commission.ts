import { TimePrecision, Universe, UniverseType } from '../../../core/types';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * Presidential Commission on the Space Shuttle Challenger Accident — `history:rogers_commission:1986`.
 *
 * james-gibson/local-time#57.
 *
 * ## Why `history:` and not `hearing:`
 *
 * `tests/jfk.test.ts` originally referenced `hearing:rogers_commission:1986`. That id
 * validates as **FILM** — `UNIVERSE_ID_PATTERNS.FILM` is the generic three-segment shape, so
 * a congressional commission would be typed as a movie. #50 documented how permissive the
 * validator is; this is a concrete instance. The test was updated to the `history:` id.
 *
 * ## Dates
 *
 * Created by Executive Order 12575, signed 3 February 1986 — six days after the
 * Challenger breakup. The commission reported on 29 July 1986, and the shuttle returned to
 * flight with STS-26 on 29 September 1986. `tests/jfk.test.ts` asserts the six-day gap
 * between accident and commission, which is the temporal relationship this universe exists
 * to make queryable.
 */

const ns = (iso: string): bigint => dateToNanoseconds(new Date(iso));

export const rogersCommissionUniverse: Universe = {
  universeId: 'history:rogers_commission:1986',
  type: UniverseType.INSTITUTIONAL_PERIOD,
  identifiers: {
    primary: 'history:rogers_commission:1986',
    aliases: ['Rogers Commission', 'Presidential Commission on the Space Shuttle Challenger Accident'],
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: 'history:rogers_commission:1986',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: ['Executive Order 12575, 3 February 1986', 'Commission report, 29 July 1986'],
      },
    ],
  },
  attribution: {
    public_domain: true,
    copyright: { holders: [], year: 2026, status: 'active' },
    citations_required: true,
    usage_restrictions: [
      'The commission examined causation and management, and its findings concern named individuals in NASA and Thiokol. Quote the report rather than paraphrasing allegations.',
    ],
    sources: ['Executive Order 12575', 'Rogers Commission report (July 1986)'],
  },
  layers: [
    {
      layerId: 'primary',
      type: 'primary',
      epochs: {
        // `tests/jfk.test.ts` reads `epochs.hearing.startTime`, so the epoch id is load-bearing.
        hearing: {
          epochId: 'rogers:hearing',
          startTime: ns('1986-02-03T00:00:00Z'),
          endTime: ns('1986-07-29T00:00:00Z'),
          precision: TimePrecision.DAY,
          description: 'From the commission\'s creation to the publication of its report',
        },
      },
    },
  ],
  temporalStructure: {
    segments: [
      {
        id: 'investigation',
        start: ns('1986-02-03T00:00:00Z'),
        end: ns('1986-07-29T00:00:00Z'),
        type: 'phase',
        status: 'ended',
        description:
          'Hearings, testimony, and the O-ring and launch-decision analysis that concluded the accident was foreseeable.',
      },
    ],
    keyframes: [
      {
        id: 'commission-created',
        timestamp: ns('1986-02-03T00:00:00Z'),
        significance: 0.9,
        tags: ['executive-order-12575', 'investigation', 'six-days-after-challenger'],
        certainty: 0.95,
      },
      {
        id: 'hearings-begin',
        timestamp: ns('1986-02-06T00:00:00Z'),
        significance: 0.7,
        tags: ['hearings', 'congressional-testimony'],
        certainty: 0.7,
      },
      {
        id: 'report-published',
        timestamp: ns('1986-07-29T00:00:00Z'),
        significance: 0.95,
        tags: ['report', 'findings', 'oring'],
        certainty: 0.95,
      },
    ],
    windows: { strategy: 'time_based', avgWindowSize: BigInt(30) * 86400n * 1_000_000_000n },
  },
  metadata: {
    canonicalName: 'Rogers Commission',
    description:
      'The independent commission appointed by President Reagan on 3 February 1986 to investigate the Challenger accident. Its report concluded the disaster was foreseeable and attributed it to both NASA management and Thiokol.',
    cultural_significance: 0.85,
    cultural_significance_justification:
      'Its findings reshaped shuttle launch decision-making and produced the launch-commit criteria NASA still uses.',
    tags: ['us-government', 'investigation', 'nasa', 'space-shuttle'],
    chair: 'William P. Rogers',
    sourceIssue: 57,
  },
  connections: {
    natural: { parentUniverses: ['nasa:challenger:1986'] },
    references: [],
  },
} as unknown as Universe;
