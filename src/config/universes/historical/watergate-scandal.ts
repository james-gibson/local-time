import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { createHistoricalUniverseId } from '../../../core/universe-ids';

/**
 * The Watergate scandal, 1972-1974 (james-gibson/local-time#208).
 *
 * The ground-truth timeline the two 2026 artefacts are read against: the Oyer short about
 * DOJ reviewing the special prosecutor's conduct, and the review itself. This module is the
 * retrieval target for that pair, and the `reality_correspondence.to` of the short's
 * `nixon_was_framed` layer — the counterfactual is inspectable only if the record it
 * diverges from is.
 *
 * SCOPE. Four dated facts and a gapless partition, not a history of the scandal: break-in,
 * the special prosecutor's dismissal, the resignation, the pardon. The dates are the
 * commonly recorded ones; the sources are secondary summaries, and the record says so
 * rather than dressing a timeline in citations it does not hold.
 *
 * ID. `createHistoricalUniverseId('watergate_scandal', '1972-1974')` — a span, because the
 * scandal is a period, not an instant.
 */

export const WATERGATE_SCANDAL_UNIVERSE_ID =
  'history:watergate_scandal:1972-1974';

const D = (y: number, m: number, d: number, h = 0): bigint =>
  BigInt(Date.UTC(y, m - 1, d, h)) * 1_000_000n;

export const watergateScandalUniverse: Universe = {
  universeId: createHistoricalUniverseId('watergate_scandal', '1972-1974'),
  type: UniverseType.HISTORICAL_EVENT,

  identifiers: {
    primary: WATERGATE_SCANDAL_UNIVERSE_ID,
    aliases: ['Watergate', 'Watergate scandal', 'history:watergate:1972-1974'],
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
      'The 1972-74 record as recounted in the Wall Street Journal reporting of 1-2 Oct 2026 that #208 is built on',
      'Dates as commonly recorded: break-in 17 Jun 1972, Cox dismissed 20 Oct 1973, Nixon resigned 9 Aug 1974, Ford pardoned 8 Sep 1974',
    ],
    usage_restrictions: [
      'A four-fact timeline, not an archive. Claims outside it are not in this record.',
    ],
  },

  layers: [
    {
      layerId: 'scandal',
      type: 'primary',
      epochs: {
        scandal: {
          epochId: 'watergate_scandal:1972_1974',
          startTime: D(1972, 6, 17),
          endTime: D(1974, 9, 8),
          precision: TimePrecision.DAY,
          description: 'From the break-in to the pardon.',
        },
      },
    },
  ],

  epochs: {},

  temporalStructure: {
    segments: [
      {
        id: 'investigation',
        start: D(1972, 6, 17),
        end: D(1973, 5, 17),
        type: 'phase' as const,
        status: 'active' as const,
        description: 'Break-in, cover-up, and the Senate select committee convening.',
      },
      {
        id: 'hearings_and_tapes',
        start: D(1973, 5, 17),
        end: D(1974, 7, 24),
        type: 'phase' as const,
        status: 'active' as const,
        description: 'The hearings and the tapes, through the Supreme Court\'s disclosure order.',
      },
      {
        id: 'resignation_and_pardon',
        start: D(1974, 7, 24),
        end: D(1974, 9, 8),
        type: 'phase' as const,
        status: 'active' as const,
        description: 'Nixon\'s resignation and Ford\'s pardon.',
      },
    ],

    keyframes: [
      {
        id: 'break_in',
        timestamp: D(1972, 6, 17),
        significance: 1.0,
        certainty: 0.95,
        precision: TimePrecision.DAY,
        tags: ['watergate', 'origin'],
        type: KeyframeType.MILESTONE,
        description:
          'Five men are arrested inside the Democratic National Committee offices at the ' +
          'Watergate complex. The date the whole timeline is ordered from.',
      },
      {
        id: 'cox_dismissed',
        timestamp: D(1973, 10, 20),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.DAY,
        tags: ['watergate', 'justice_department'],
        type: KeyframeType.MILESTONE,
        description:
          'Special prosecutor Archibald Cox is dismissed — the event that names the night and ' +
          'the one the 2026 review is about, since it is Cox, with Jaworski, whom the theory ' +
          'accuses of misconduct.',
      },
      {
        id: 'nixon_resigns',
        timestamp: D(1974, 8, 9),
        significance: 1.0,
        certainty: 0.95,
        precision: TimePrecision.DAY,
        tags: ['watergate', 'resignation'],
        type: KeyframeType.RELEASE,
        description:
          'Nixon resigns the presidency, the only U.S. president to do so. The short\'s recap ' +
          'and the review both depend on this endpoint.',
      },
      {
        id: 'ford_pardon',
        timestamp: D(1974, 9, 8),
        significance: 0.9,
        certainty: 0.95,
        precision: TimePrecision.DAY,
        tags: ['watergate', 'pardon'],
        type: KeyframeType.RULING,
        description:
          'Gerald Ford pardons Nixon — why, as the short puts it, "Nixon was not prosecuted".',
      },
    ],

    windows: { strategy: 'phase_based' },
  },

  metadata: {
    canonicalName: 'Watergate scandal (1972-1974)',
    description:
      'The break-in, the special prosecutor\'s dismissal, the resignation and the pardon: the ' +
      'four dated facts the 2026 review and the Oyer short are read against.',
    cultural_significance: 0.9,
    platform: 'local-time corpus',
    contentType: 'historical period',
    limits: [
      'A four-fact timeline. The Senate hearings, the tape litigation and the Saturday Night ' +
        'Massacre\'s aftermath are named in segments, not keyframed.',
      'Composed for #208 as the retrieval target of a 2026 review; it is not a sourced history.',
    ],
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.US_HISTORY, CommonUniverseIds.US_GOVERNMENT],
    },
  },
} as unknown as Universe;

/** One universe; the array keeps the barrel shape uniform. */
export const watergateScandalUniverses: Universe[] = [watergateScandalUniverse];
