import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { createHistoricalUniverseId } from '../../../core/universe-ids';

/**
 * The DOJ indictment of Virginia State Senator Louise Lucas (james-gibson/local-time#208).
 *
 * The real event the Oyer short comments on. The dates and structure here come from the
 * Department of Justice's own press release 26-1246 (Office of Public Affairs, 22 Oct 2026),
 * which is the strongest source in the pair: eight counts, seven defendants, Lillie Louise
 * Lucas of Portsmouth, a five-year scheme the FBI estimated at $4.5 million.
 *
 * WHAT IS ASSERTED, AND WHAT IS NOT. The release's factual skeleton is here. Two things are
 * not: the allegation's truth (the release itself says an indictment is merely an allegation
 * and all defendants are presumed innocent), and the short's claim that announcing charges
 * twelve days before an election violates DOJ policy — that is a contested characterisation
 * and it is keyframed at certainty 0.5.
 *
 * ID. `createHistoricalUniverseId('louise_lucas_indictment', '2026')` — the event is the
 * indictment, not the senator; `person:louise_lucas:1944` would be a different universe and
 * is not created here (#208 §8: no new person universes).
 */

export const LUCAS_INDICTMENT_UNIVERSE_ID = 'history:louise_lucas_indictment:2026';

const D = (y: number, m: number, d: number, h = 0): bigint =>
  BigInt(Date.UTC(y, m - 1, d, h)) * 1_000_000n;

export const lucasIndictmentUniverse: Universe = {
  universeId: createHistoricalUniverseId('louise_lucas_indictment', '2026'),
  type: UniverseType.HISTORICAL_EVENT,

  identifiers: {
    primary: LUCAS_INDICTMENT_UNIVERSE_ID,
    aliases: [
      'Louise Lucas indictment',
      'Lucas Enterprise indictment',
      'DOJ press release 26-1246',
    ],
  },

  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [],
  },

  attribution: {
    public_domain: false,
    citations_required: true,
    sources: [
      'DOJ Office of Public Affairs press release 26-1246, "Virginia State Senator Indicted for Leading a Criminal Marijuana Distribution Enterprise", 22 Oct 2026',
      'NBC News, 23 Oct 2026',
      'Virginia Mercury, 22 Oct 2026',
    ],
    usage_restrictions: [
      'The indictment is an allegation. Nothing here records a conviction, plea or finding.',
      'The senator\'s biographical detail belongs to the short\'s commentary, not to this event record.',
    ],
  },

  layers: [
    {
      layerId: 'indictment',
      type: 'primary',
      epochs: {
        announcement: {
          epochId: 'louise_lucas_indictment:announcement',
          startTime: D(2026, 10, 21),
          endTime: D(2026, 10, 23),
          precision: TimePrecision.DAY,
          description: 'The day the indictment was returned and announced, and the day after.',
        },
      },
    },
  ],

  epochs: {},

  temporalStructure: {
    segments: [
      {
        id: 'returned_and_announced',
        start: D(2026, 10, 21),
        end: D(2026, 10, 23),
        type: 'phase' as const,
        status: 'active' as const,
        description: 'Grand jury indictment, DOJ announcement, and first coverage.',
      },
    ],

    keyframes: [
      {
        id: 'eight_count_indictment',
        timestamp: D(2026, 10, 22),
        significance: 1.0,
        certainty: 0.95,
        precision: TimePrecision.DAY,
        tags: ['doj', 'indictment', 'virginia'],
        type: KeyframeType.RELEASE,
        description:
          'An eight-count indictment charges seven defendants over a racketeering conspiracy: ' +
          'marijuana distribution, money laundering, honest-services fraud through bribery, ' +
          'maintaining drug-involved premises, firearms in furtherance of trafficking, and wire ' +
          'fraud. Lillie Louise Lucas, 82, of Portsmouth, is named as the enterprise\'s leader.',
      },
      {
        id: 'alleged_scheme',
        timestamp: D(2026, 10, 22),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.DAY,
        tags: ['indictment', 'allegation'],
        type: KeyframeType.PUBLICATION,
        description:
          'The alleged object: a five-year scheme worth an estimated $4.5 million, using Lucas\'s ' +
          'position as chair of Senate Finance and Appropriations to insulate the "Lucas ' +
          'Enterprise" from scrutiny and influence legislation; 100 kg or more of marijuana and ' +
          'the laundering of its proceeds. Allegations, not findings.',
      },
      {
        id: 'defendants',
        timestamp: D(2026, 10, 22),
        significance: 0.85,
        certainty: 0.95,
        precision: TimePrecision.DAY,
        tags: ['indictment', 'defendants'],
        type: KeyframeType.MILESTONE,
        description:
          'Seven defendants, "a close-knit group of associates and family members, including her ' +
          'two daughters and her grandson": Carlton Upton Jr., Lisa Lucas-Burke, Theresa ' +
          'Lucas-Lamb, Ryan Eichelberger and others per the indictment.',
      },
      {
        id: 'timing_allegation',
        timestamp: D(2026, 10, 22),
        significance: 0.6,
        certainty: 0.5,
        precision: TimePrecision.DAY,
        tags: ['contested', 'election', 'doj_policy'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The claim that announcing the charges days before an election violates DOJ policy. ' +
          'Recorded because the pair turns on it — and at 0.5, because the policy, the election ' +
          'and the interval are all asserted rather than shown in either artefact.',
      },
    ],

    windows: { strategy: 'phase_based' },
  },

  metadata: {
    canonicalName: 'Indictment of Louise Lucas (2026)',
    description:
      'The DOJ\'s eight-count, seven-defendant racketeering indictment of Virginia State ' +
      'Senator Lillie Louise Lucas, returned and announced on 22 Oct 2026.',
    cultural_significance: 0.6,
    platform: 'local-time corpus',
    contentType: 'historical event',
    limits: [
      'No court outcome, plea or filing beyond the indictment date is recorded.',
      'The "12 days before an election" claim is not resolved here; see `timing_allegation`.',
    ],
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.US_HISTORY, CommonUniverseIds.US_GOVERNMENT],
    },
  },
} as unknown as Universe;

export const lucasIndictmentUniverses: Universe[] = [lucasIndictmentUniverse];
