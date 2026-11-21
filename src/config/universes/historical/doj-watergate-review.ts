import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { createHistoricalUniverseId } from '../../../core/universe-ids';
import { WATERGATE_SCANDAL_UNIVERSE_ID } from './watergate-scandal';

/**
 * The DOJ review of the Watergate special prosecutor's conduct (james-gibson/local-time#208).
 *
 * The real event the second Oyer short reports. Sourced from the Wall Street Journal's story
 * of 1-2 Oct 2026 and the Verity summary of it: DOJ is reviewing whether the special
 * prosecutor's office committed misconduct; Geoff Shepard, a former Nixon aide, gave a
 * two-hour presentation at DOJ headquarters to the Office of Professional Responsibility; a
 * department spokeswoman said the presentation "does not constitute an investigation"; the
 * office had declined Shepard's request in 2022.
 *
 * THE COLLISION IS RECORDED, NOT RESOLVED. The review's premise (prosecutors committed
 * misconduct; Nixon was the victim) contradicts the record it revisits. The counterfactual is
 * held as a `recreation` layer of the *short* — see
 * `series:doj_revisits_watergate:2026` — and this event record keeps only the reporting: who
 * is reviewing what, and what DOJ said about it.
 *
 * ID. `createHistoricalUniverseId('doj_watergate_review', '2026')`.
 */

export const DOJ_WATERGATE_REVIEW_UNIVERSE_ID = 'history:doj_watergate_review:2026';

const D = (y: number, m: number, d: number): bigint => BigInt(Date.UTC(y, m - 1, d)) * 1_000_000n;

export const dojWatergateReviewUniverse: Universe = {
  universeId: createHistoricalUniverseId('doj_watergate_review', '2026'),
  type: UniverseType.HISTORICAL_EVENT,

  identifiers: {
    primary: DOJ_WATERGATE_REVIEW_UNIVERSE_ID,
    aliases: [
      'Watergate review',
      'DOJ review of Watergate prosecutors',
      'Shepard presentation at DOJ',
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
      'The Wall Street Journal, "Decades After Watergate, Justice Department Reviews Whether Nixon Got a Raw Deal", reported 1-2 Oct 2026',
      'Verity summary of the same reporting, dated 2 Oct 2026 (Shepard, the deck title, the DOJ statement, the 2022 refusal)',
    ],
    usage_restrictions: [
      'The review is recorded as the Journal reported it; the newspaper story itself is not held here.',
      'The theory the review entertains is not asserted; only the reporting and DOJ\'s own statement are.',
    ],
  },

  layers: [
    {
      layerId: 'review',
      type: 'primary',
      epochs: {
        reporting: {
          epochId: 'doj_watergate_review:reporting',
          startTime: D(2026, 10, 1),
          endTime: D(2026, 10, 3),
          precision: TimePrecision.DAY,
          description: 'The window in which the review was reported and DOJ responded.',
        },
      },
    },
  ],

  epochs: {},

  temporalStructure: {
    segments: [
      {
        id: 'reported_and_answered',
        start: D(2026, 10, 1),
        end: D(2026, 10, 3),
        type: 'phase' as const,
        status: 'active' as const,
        description: 'The Journal\'s report, the presentation it describes, and DOJ\'s statement.',
      },
    ],

    keyframes: [
      {
        id: 'review_reported',
        timestamp: D(2026, 10, 2),
        significance: 1.0,
        certainty: 0.8,
        precision: TimePrecision.DAY,
        tags: ['doj', 'watergate', 'reporting'],
        type: KeyframeType.PUBLICATION,
        description:
          'The Wall Street Journal reports that DOJ is reviewing whether the special prosecutor\'s ' +
          'office that investigated the 1972 break-in committed misconduct. Verity dates its ' +
          'summary to 2 Oct 2026 and attributes the story to the Journal "Thursday"; the exact ' +
          'publication day is 1 or 2 Oct, hence 0.8 on the timestamp.',
      },
      {
        id: 'shepard_presentation',
        timestamp: D(2026, 10, 1),
        significance: 0.9,
        certainty: 0.85,
        precision: TimePrecision.DAY,
        tags: ['doj', 'opr', 'theory'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Geoff Shepard, a former Nixon aide, gives a two-hour presentation at DOJ headquarters ' +
          'to the Office of Professional Responsibility; his slide deck is titled "Watergate As ' +
          'Lawfare". He alleges Cox and Jaworski met secretly with the trial judges and withheld ' +
          'evidence. The presentation\'s date is not in the reporting.',
      },
      {
        id: 'doj_statement',
        timestamp: D(2026, 10, 2),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.DAY,
        tags: ['doj', 'statement', 'key_finding'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'A department spokeswoman says Shepard was invited for his expertise and scholarship on ' +
          'Watergate, but that the "presentation does not constitute an investigation". The one ' +
          'statement in the record that bounds the event\'s official status.',
      },
      {
        id: 'earlier_refusal',
        timestamp: D(2026, 10, 1),
        significance: 0.6,
        certainty: 0.85,
        precision: TimePrecision.DAY,
        tags: ['doj', 'opr', 'context'],
        type: KeyframeType.MILESTONE,
        description:
          'The same office declined Shepard\'s request for an inquiry in 2022 — recorded because ' +
          'the short\'s "why now" is answered by the contrast, not by the presentation alone.',
      },
    ],

    windows: { strategy: 'phase_based' },
  },

  metadata: {
    canonicalName: 'DOJ review of the Watergate special prosecutor\'s conduct (2026)',
    description:
      'The reported DOJ review of whether the Watergate special prosecutor\'s office committed ' +
      'misconduct, and the department\'s statement that Shepard\'s presentation "does not ' +
      'constitute an investigation".',
    cultural_significance: 0.55,
    platform: 'local-time corpus',
    contentType: 'historical event',
    limits: [
      'Reported, not documented: no DOJ memorandum or docket is in this record.',
      'The presentation\'s date, the review\'s scope and any outcome are not in the reporting.',
    ],
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.US_HISTORY, CommonUniverseIds.US_GOVERNMENT],
    },
    references: [
      {
        type: 'DOCUMENTS',
        targetUniverseId: WATERGATE_SCANDAL_UNIVERSE_ID,
        confidence: 0.9,
        description: 'The 1972-74 record the review is premised on revisiting.',
      },
    ],
  },
} as unknown as Universe;

export const dojWatergateReviewUniverses: Universe[] = [dojWatergateReviewUniverse];
