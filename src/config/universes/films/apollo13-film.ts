import { TimePrecision, Universe, UniverseType } from '../../../core/types';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * Apollo 13 (1995 film) — `movie:apollo13:1995`.
 *
 * james-gibson/local-time#57. The film half of the mission-to-screen cross-reference in
 * `tests/jfk.test.ts`.
 *
 * Released 30 June 1995, twenty-five years and roughly two and a half months after the
 * mission. This is the dramatisation, kept as a separate universe from
 * `nasa:apollo13:1970` precisely because the two disagree about events: the film moves the
 * explosion to the second stage and changes the sequence of the free-return burn. The
 * `fictionalizationDegree` below is the record of that, not a hedge.
 */

const ns = (iso: string): bigint => dateToNanoseconds(new Date(iso));

export const apollo13FilmUniverse: Universe = {
  universeId: 'movie:apollo13:1995',
  type: UniverseType.FILM,
  identifiers: {
    primary: 'movie:apollo13:1995',
    aliases: ['Apollo 13 (film)', 'Apollo 13 (1995)'],
  },
  realityRelation: {
    type: 'fictionalized',
    // High: the film relocates the explosion from the service module to the second stage
    // and reorders the free-return burn.
    fictionalizationDegree: 0.75,
    claimsHistoricalAccuracy: false,
    realityAnchors: [
      {
        realEventId: 'nasa:apollo13:1970',
        relationshipType: 'reinterprets',
        confidence: 1.0,
        evidence: [
          'The film dramatises the Apollo 13 mission of 11-17 April 1970; the crew and the sequence of the actual events are documented.',
          'Two substantive changes: the oxygen tank explosion is placed in the second-stage Service Module at ~2 hours rather than ~55 minutes, and the free-return burn is reordered.',
        ],
      },
    ],
  },
  attribution: {
    public_domain: false,
    copyright: { holders: ['Universal Pictures'], year: 1995, status: 'active' },
    citations_required: true,
    usage_restrictions: [
      'Copyrighted. This record contains no dialogue, script, or footage and must not be used to reproduce protected material.',
      'Use as the *dramatisation*, never as a source for what happened on the mission. For that, use `nasa:apollo13:1970`.',
    ],
    sources: ['Universal Pictures release record', 'NASA Apollo 13 mission report (contrast)'],
  },
  layers: [
    {
      layerId: 'primary',
      type: 'primary',
      epochs: {
        // `tests/jfk.test.ts` reads `epochs.theatrical`, so the epoch id is load-bearing.
        theatrical: {
          epochId: 'apollo13film:theatrical',
          startTime: ns('1995-06-30T00:00:00Z'),
          endTime: ns('1995-06-30T00:00:00Z'),
          precision: TimePrecision.DAY,
          description: 'US theatrical release',
        },
      },
    },
  ],
  temporalStructure: {
    segments: [
      {
        id: 'theatrical-run',
        start: ns('1995-06-30T00:00:00Z'),
        end: ns('1995-06-30T00:00:00Z'),
        type: 'phase',
        status: 'ended',
        description: 'Opening day only; the universe records the release instant, not the run.',
      },
    ],
    keyframes: [
      {
        id: 'theatrical-release',
        timestamp: ns('1995-06-30T00:00:00Z'),
        significance: 0.85,
        tags: ['release', 'universal-pictures'],
        certainty: 0.95,
      },
    ],
    windows: { strategy: 'time_based' },
  },
  metadata: {
    canonicalName: 'Apollo 13 (1995)',
    description:
      'Universal\'s dramatisation of the Apollo 13 mission, directed by Ron Howard. Widened the audience for the programme considerably; it is the version most people know.',
    cultural_significance: 0.8,
    tags: ['film', 'nasa', 'drama', 'historical-drama'],
    director: 'Ron Howard',
    sourceIssue: 57,
  },
  connections: {
    natural: { parentUniverses: ['nasa:apollo13:1970'] },
    references: [],
  },
} as unknown as Universe;
