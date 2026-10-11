import { Universe, UniverseType, CommonUniverseIds, TimePrecision } from '../../../../core';
import { dateToNanoseconds } from '../../../../utils/temporal-conversion';

/**
 * Idiocracy (2006) — 20th Century Fox, written and directed by Mike Judge.
 *
 * james-gibson/local-time#41.
 *
 * A satire set in the United States of the year 2505, in which the average
 * intelligence of the population has collapsed and the country is run as a
 * corporate-owned consumocracy. Judge projects the real United States forward
 * five hundred years rather than inventing a separate world, so the universe is
 * *not* pure fiction: it is an `interpretation` of the real line
 * (`fictionalizationDegree: 0.85`) that satirises named real institutions.
 *
 * Three things make it a distinct case in this model:
 *
 * 1. It is a fictional *continuation* of the real timeline, not a fantasy. The
 *    fictional 2505 frame is anchored to the real-era 2005 prologue with an
 *    `IN_A_PRIOR_KEYFRAME` reference, so its zero is *derived* from a prior
 *    keyframe rather than fabricated (see the `zero-reference` block in the KB
 *    lore document).
 *
 * 2. It turns on a *policy direction* — an anti-intellectual corporatocracy —
 *    rather than a single dated event. That is modelled as segments (a regime),
 *    and the film never dates the regime's origin.
 *
 * 3. It is dense with real referents. Each named real entity is recorded as a
 *    `realityAnchor` tying the fiction back to the real world; Costco Wholesale
 *    is substantial enough to carry its own universe (`history:costco:1983`).
 *
 * Hierarchical Context: HOLLYWOOD_SYSTEM -> US_HISTORY -> WORLD_HISTORY
 */

/** ISO-8601 -> nanoseconds since the Unix epoch, via the shared conversion helper. */
const ns = (iso: string): bigint => dateToNanoseconds(new Date(iso));

export const idiocracyUniverse: Universe = {
  universeId: '20th_century_fox:idiocracy:2006',
  type: UniverseType.FILM,
  identifiers: {
    primary: '20th_century_fox:idiocracy:2006',
    aliases: ['Idiocracy', "Mike Judge's Idiocracy"],
  },
  realityRelation: {
    type: 'interpretation',
    fictionalizationDegree: 0.85,
    claimsHistoricalAccuracy: false,
    realityAnchors: [
      {
        realEventId: 'history:costco:1983',
        relationshipType: 'parodies',
        confidence: 0.9,
        evidence: [
          'Costco houses the future state: its courts, its "law school" (a one-day degree) and its public services.',
          'The warehouse club is presented as the natural evolution of the corporation into government itself.',
          'Costco never agreed to this depiction; the anchor records the parody, not a claim about the company.',
        ],
      },
      {
        realEventId: CommonUniverseIds.US_GOVERNMENT,
        relationshipType: 'reinterprets',
        confidence: 0.85,
        evidence: [
          'The presidency is held by a former wrestler and pornographic-film actor, elected as a celebrity.',
          'Legislative and judicial procedure is reduced to spectacle and brand endorsement.',
        ],
      },
    ],
  },
  attribution: {
    copyright: {
      holders: ['20th Century Fox'],
      year: 2006,
      status: 'active',
    },
    creators: {
      director: ['Mike Judge'],
      writer: ['Mike Judge', 'Etan Cohen'],
    },
    citations_required: true,
    usage_restrictions: ['Rights held by the rights holders; fair use for criticism and comment.'],
    sources: [
      '20th Century Fox — Idiocracy (2006), credits and runtime',
      'Wikipedia — Idiocracy',
    ],
  },
  layers: [
    {
      layerId: 'runtime',
      type: 'primary',
      epochs: {
        runtime: {
          epochId: 'idiocracy:runtime',
          startTime: 0n,
          endTime: 84n * 60n * 1_000_000_000n, // 84 minutes
          precision: TimePrecision.SECOND,
          description: 'Film runtime',
        },
      },
    },
    {
      layerId: 'narrative_2005',
      type: 'primary',
      epochs: {
        experiment: {
          epochId: 'idiocracy:experiment',
          startTime: ns('2005-01-01T00:00:00Z'),
          endTime: ns('2006-01-01T00:00:00Z'),
          description: 'The real-era prologue: the hibernation experiment that freezes Joe Bauers and Rita.',
        },
      },
    },
    {
      layerId: 'narrative_2505',
      type: 'primary',
      epochs: {
        awakening: {
          epochId: 'idiocracy:awakening',
          startTime: ns('2505-01-01T00:00:00Z'),
          endTime: ns('2506-01-01T00:00:00Z'),
          description:
            "The 26th-century present. This epoch carries the universe's zero-point: the awakening, the first future moment the film dates.",
        },
      },
    },
  ],
  epochs: {},
  temporalStructure: {
    segments: [
      {
        id: 'real-era-prologue',
        start: ns('2005-07-01T00:00:00Z'),
        end: ns('2005-07-02T00:00:00Z'),
        type: 'phase',
        description: "The film's contemporary prologue and the beginning of the hibernation experiment.",
      },
      {
        id: 'the-drift',
        start: ns('2005-07-02T00:00:00Z'),
        end: ns('2505-01-01T00:00:00Z'),
        type: 'phase',
        description:
          'Five centuries of corporate and dysgenic drift. The film dates none of it — the whole span is a montage — so the regime has no established origin.',
      },
      {
        id: 'awakening',
        start: ns('2505-01-01T00:00:00Z'),
        end: ns('2505-01-02T00:00:00Z'),
        type: 'phase',
        description: "Joe Bauers and Rita wake in the 26th century — the universe's zero-point.",
      },
      {
        id: 'corrective-rule',
        start: ns('2505-01-02T00:00:00Z'),
        end: ns('2506-01-01T00:00:00Z'),
        type: 'phase',
        description: 'Joe, the only competent person alive, is drafted into the government to correct a broken policy direction.',
      },
    ],
    keyframes: [
      {
        id: 'hibernation-experiment',
        timestamp: ns('2005-07-01T00:00:00Z'),
        significance: 0.7,
        tags: ['setup', 'hibernation', 'real-era'],
        certainty: 0.5,
        dateRange: {
          earliest: ns('2005-01-01T00:00:00Z'),
          latest: ns('2006-12-31T00:00:00Z'),
        },
      },
      {
        id: 'awakening',
        timestamp: ns('2505-01-01T00:00:00Z'),
        significance: 1.0,
        tags: ['zero-point', 'awakening', 'future'],
        certainty: 0.5,
        dateRange: {
          earliest: ns('2505-01-01T00:00:00Z'),
          latest: ns('2505-12-31T00:00:00Z'),
        },
      },
      {
        id: 'costco-law-degree',
        timestamp: ns('2505-01-01T00:00:00Z'),
        significance: 0.8,
        tags: ['satire', 'corporatocracy', 'costco', 'law'],
        certainty: 0.3,
        dateRange: {
          earliest: ns('2505-01-01T00:00:00Z'),
          latest: ns('2505-12-31T00:00:00Z'),
        },
      },
      {
        id: 'brawndo-irrigation',
        timestamp: ns('2505-01-01T00:00:00Z'),
        significance: 0.85,
        tags: ['satire', 'anti-intellectualism', 'brawndo', 'policy'],
        certainty: 0.3,
        dateRange: {
          earliest: ns('2505-01-01T00:00:00Z'),
          latest: ns('2505-12-31T00:00:00Z'),
        },
      },
    ],
    windows: { strategy: 'phase_based' },
  },
  metadata: {
    canonicalName: 'Idiocracy',
    description:
      "A satire that projects the real United States five hundred years forward into a corporate-owned consumocracy, where a man of average intelligence wakes up as the smartest person alive.",
    creators: ['Mike Judge'],
    released: new Date('2006-09-01T00:00:00Z'),
    cultural_significance: 0.78,
    tags: ['satire', 'dystopia', 'corporatocracy', 'anti-intellectualism', 'dysgenics', '2000s', 'mike_judge'],
    significance:
      'A cult satire whose vocabulary ("Brawndo", "idiocracy") became a shorthand for anti-intellectualism and corporate capture of governance; it is commonly cited as a prescient reading of the real 2000s-2020s United States.',
    // The real referents the film loads with fiction. Costco is substantial
    // enough to carry its own universe; the rest are anchored by id.
    realReferents: [
      'history:costco:1983',
      CommonUniverseIds.US_GOVERNMENT,
    ],
  },
  connections: {
    natural: {
      parentUniverses: [
        CommonUniverseIds.HOLLYWOOD_SYSTEM,
        CommonUniverseIds.US_HISTORY,
        CommonUniverseIds.WORLD_HISTORY,
      ],
    },
    references: [
      {
        type: 'IN_A_PRIOR_KEYFRAME',
        targetUniverseId: '20th_century_fox:idiocracy:2006',
        targetKeyframeId: 'hibernation-experiment',
        description:
          "The universe's zero (the 2505 awakening) sits inside the frame opened by the real-era 2005 hibernation experiment, so its position is derived rather than fabricated.",
      },
      {
        type: 'PARODIES',
        targetUniverseId: 'history:costco:1983',
        description:
          'Costco is satirically inflated into the state itself — its courts, its law school and its public services.',
      },
    ],
  },
} as unknown as Universe;

/** All universes derived from james-gibson/local-time#41. */
export const idiocracyUniverses: Universe[] = [idiocracyUniverse];
