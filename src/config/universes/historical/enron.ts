import { TimePrecision, Universe } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { createHistoricalBuilder } from '../../../core/universe-builder';
import { NamedBoundary, NamedBoundaryEpoch, beforeAfter } from '../../../core/named-boundary';

/**
 * Enron — Rise and Collapse (1985-2001)
 *
 * Enron was formed by the 1985 merger of Houston Natural Gas and InterNorth, and
 * became the archetype of the deregulated energy trader: an asset-light company
 * whose value was its trading book and its story. Its 2001 collapse — a $586
 * million restatement covering 1997-2000, an SEC inquiry, and a Chapter 11
 * filing on 2 December 2001 — destroyed the company and took Arthur Andersen
 * with it, and produced the Sarbanes-Oxley Act.
 *
 * ## The named boundary (pre/post Enron)
 *
 * `chapter_11_filing` is the dividing instant, declared once as `FILING` and
 * re-exported as a `NamedBoundary`. "Pre-Enron" and "post-Enron" elsewhere in the
 * corpus derive from it rather than re-declaring 2 December 2001 — the same rule
 * as pre/post 9/11 (`./911.ts`).
 *
 * The two derived epochs are part of this universe's own timeline: the collapse
 * divides its rise from its aftermath. They are half-open, so `pre` claims only
 * where it ended and `post` only where it began.
 *
 * Sources: Enron Corp. SEC filings (10-K 2000, 8-K November 2001), the U.S.
 * Senate Permanent Subcommittee on Investigations report on Enron, and the
 * Department of Justice Enron Task Force records.
 */

const at = (iso: string): bigint => BigInt(new Date(iso).getTime()) * 1_000_000n;

/** 2001-12-02 — Enron files for Chapter 11 bankruptcy protection. */
const FILING = at('2001-12-02T00:00:00Z');

export const ENRON_BOUNDARY: NamedBoundary = {
  idPrefix: 'period:enron',
  label: 'the Enron collapse',
  instant: FILING,
  precision: TimePrecision.DAY,
  source: {
    universeId: 'history:enron:1985-2001',
    keyframeId: 'chapter_11_filing',
  },
};

export const {
  before: PRE_ENRON,
  after: POST_ENRON,
}: { before: NamedBoundaryEpoch; after: NamedBoundaryEpoch } = beforeAfter(ENRON_BOUNDARY);

const enron = createHistoricalBuilder()
    .historical('enron', 1985, 2001)
    .withAliases(['Enron Corporation', 'Enron collapse', 'Enron scandal'])
    .withCanonicalName('Enron: Rise and Collapse (1985-2001)')
    .withDescription(
        'The deregulated energy trader whose 2001 collapse, restatement and bankruptcy became the reference case for corporate-governance failure.',
    )
    .withReleased('1985-07-01')
    .withCulturalSignificance(0.8)
    .withRealityRelation('documentary', 0.0, [
        {
            realEventId: 'history:enron:1985-2001',
            relationshipType: 'documents',
            confidence: 1.0,
            evidence: ['Enron Corp. SEC filings, including the 2000 Form 10-K'],
        },
        {
            realEventId: 'enron_restatement_2001',
            relationshipType: 'documents',
            confidence: 1.0,
            evidence: ['Enron 8-K, 8 November 2001: restatement of 1997-2000 results'],
        },
        {
            realEventId: 'enron_chapter_11_2001',
            relationshipType: 'documents',
            confidence: 1.0,
            evidence: ['Chapter 11 petition, U.S. Bankruptcy Court, Southern District of New York'],
        },
    ])
    .withPublicDomain([
        'Enron Corp. SEC filings',
        'U.S. Senate Permanent Subcommittee on Investigations',
        'U.S. Department of Justice, Enron Task Force',
    ])
    .addParent(CommonUniverseIds.US_HISTORY)
    .addParent(CommonUniverseIds.GLOBAL_ECONOMY)
    .addEpoch('primary', PRE_ENRON.epochId, { ...PRE_ENRON })
    .addEpoch('primary', POST_ENRON.epochId, { ...POST_ENRON })
    .addDateSegment(
        '1985-07-01',
        '2001-10-15',
        'rise',
        'phase',
        'inactive',
        'United States',
        'From the Houston Natural Gas / InterNorth merger through the years of reported growth and the energy-trading expansion.',
    )
    .addDateSegment(
        '2001-10-16',
        '2001-12-02',
        'collapse',
        'phase',
        'inactive',
        'United States',
        'From the third-quarter loss and SEC inquiry to the Chapter 11 filing.',
    )
    .addDateKeyframe('1985-07-01', 'merger_completed', 0.9, ['founding', 'merger', 'energy'], {
        certainty: 1.0,
        precision: TimePrecision.DAY,
        description:
            'Houston Natural Gas and InterNorth complete their merger; the combined company is renamed Enron the following year.',
    })
    .addDateKeyframe('2001-10-16', 'loss_announced', 1.0, ['collapse', 'earnings', 'sec_inquiry'], {
        certainty: 1.0,
        precision: TimePrecision.DAY,
        description:
            'Enron reports a third-quarter loss and discloses an SEC inquiry; the disclosure begins the public collapse.',
    })
    .addDateKeyframe('2001-11-08', 'restatement', 1.0, ['collapse', 'restatement', 'accounting'], {
        certainty: 1.0,
        precision: TimePrecision.DAY,
        description:
            'Enron restates its results for 1997-2000, reducing reported profit by $586 million.',
    })
    .addDateKeyframe('2001-12-02', 'chapter_11_filing', 1.0, ['collapse', 'bankruptcy', 'boundary'], {
        certainty: 1.0,
        precision: TimePrecision.DAY,
        description:
            'Enron files for Chapter 11 bankruptcy protection — the instant the pre/post-Enron boundary divides on.',
    })
    .withWindowing('phase_based')
    .build();

// `metadata.creators` has no builder setter; the record is institutional.
enron.metadata = { ...enron.metadata, creators: ['Enron Corporation'] };

export const enronCollapseUniverse: Universe = enron;
