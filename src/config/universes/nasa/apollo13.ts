import { TimePrecision, Universe, UniverseType } from '../../../core/types';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * Apollo 13 — `nasa:apollo13:1970`.
 *
 * james-gibson/local-time#57. Referenced by `tests/jfk.test.ts` as the mission half of a
 * mission-to-film cross-reference; it did not exist.
 *
 * Launched 11 April 1970 at 19:13:00 EST and splashed down 17 April 1970. The explosion
 * occurred roughly two hours after liftoff, when an oxygen tank was damaged by a cryogenic
 * burn; the free-return trajectory improvised by the crew and the ground is the reason the
 * mission is remembered at all.
 */

const ns = (iso: string): bigint => dateToNanoseconds(new Date(iso));

export const apollo13Universe: Universe = {
  universeId: 'nasa:apollo13:1970',
  type: UniverseType.MISSION,
  identifiers: {
    primary: 'nasa:apollo13:1970',
    aliases: ['Apollo 13', 'AS-508'],
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: 'nasa:apollo13:1970',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: ['NASA Apollo 13 mission record, 11-17 April 1970'],
      },
    ],
  },
  attribution: {
    public_domain: true,
    copyright: { holders: [], year: 2026, status: 'active' },
    citations_required: true,
    usage_restrictions: [
      'Film dramatisations differ from the mission record. This universe records the mission; the 1995 film is a separate universe and is explicitly fictionalised.',
    ],
    sources: ['NASA Apollo 13 mission record', 'NASA Apollo 13 mission report (NASA SP-3309)'],
  },
  layers: [
    {
      layerId: 'primary',
      type: 'primary',
      epochs: {
        mission: {
          epochId: 'apollo13:mission',
          startTime: ns('1970-04-11T23:13:00Z'), // 19:13:00 EST
          endTime: ns('1970-04-17T22:00:00Z'),
          precision: TimePrecision.SECOND,
          description: 'Apollo 13 from launch to splashdown, 6 days 1 hour 47 minutes',
        },
      },
    },
  ],
  temporalStructure: {
    segments: [
      {
        id: 'free-return',
        start: ns('1970-04-11T23:13:00Z'),
        end: ns('1970-04-17T18:07:00Z'),
        type: 'phase',
        status: 'ended',
        description:
          'Launch, the service-module oxygen tank explosion, the improvised free-return trajectory, the live television broadcast from the lunar module, and the safe return.',
      },
    ],
    keyframes: [
      {
        id: 'liftoff',
        timestamp: ns('1970-04-11T23:13:00Z'),
        significance: 0.8,
        tags: ['launch', 'saturn-v', 'pad-39a'],
        certainty: 0.98,
      },
      {
        id: 'oxygen-tank-explosion',
        timestamp: ns('1970-04-13T04:07:00Z'),
        significance: 1.0,
        tags: ['explosion', 'failure', 'service-module'],
        certainty: 0.9,
      },
      {
        id: 'free-return-burn',
        timestamp: ns('1970-04-14T00:00:00Z'),
        significance: 0.95,
        tags: ['trajectory', 'free-return', 'lm-powered'],
        certainty: 0.85,
      },
      {
        id: 'lifeboat-broadcast',
        timestamp: ns('1970-04-15T02:43:00Z'),
        significance: 0.9,
        tags: ['broadcast', 'cultural', 'squid-'],
        certainty: 0.9,
      },
      {
        id: 'splashdown',
        timestamp: ns('1970-04-17T18:07:00Z'),
        significance: 0.9,
        tags: ['splashdown', 'recovery'],
        certainty: 0.95,
      },
    ],
    windows: { strategy: 'time_based', avgWindowSize: BigInt(24) * 3600n * 1_000_000_000n },
  },
  metadata: {
    canonicalName: 'Apollo 13',
    description:
      'The third crewed lunar landing attempt, and the third NASA mission never to reach the Moon. An oxygen tank exploded roughly two hours after liftoff and the crew improvised a free-return trajectory home.',
    cultural_significance: 0.9,
    cultural_significance_justification:
      'The "Houston, we have a problem" broadcast reached a global television audience at the moment television was becoming the primary medium for experiencing events as they happened.',
    tags: ['nasa', 'apollo', 'space-mission', 'near-miss'],
    crew: ['James A. Lovell Jr.', 'John L. Swigert Jr.', 'Fred W. Haise Jr.'],
    sourceIssue: 57,
  },
  connections: {
    natural: { parentUniverses: ['history:us_military:founded'] },
    references: [],
  },
} as unknown as Universe;
