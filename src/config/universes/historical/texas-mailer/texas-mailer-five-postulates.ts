import {
  KeyframeType,
  TimePrecision,
  Universe,
  UniverseType,
} from '../../../../core/types';
import { CommonUniverseIds } from '../../../../core/common-universe-ids';
import { createHistoricalUniverseId } from '../../../../core/universe-ids';

/**
 * "Five Postulates" — second-round hypothesis test against the mailer payer model.
 *
 * VERDICTS:
 *   P1 (deletion lagged enforcement)        -> CONFIRMED, with a correction that
 *        inverts its use: the deletion is prospective and incomplete, but the entity
 *        in question post-dates the exemption and is in no database at all.
 *   P2 (data vendor as laundering vector)   -> CONFIRMED as the softest line item,
 *        REFUTED as a large one: the soft band is ~$25k-$350k, and the vendor is the
 *        most regulated counterparty in the chain.
 *   P3 (podcasters need content; newsrooms make it) -> CONFIRMED. Splits H1 into
 *        H1a (refuted: dominated by waiting) and H1b (survives: oppo vendor).
 *   P4 (printer would clean money)          -> REFUTED. Countable inputs, identifiable
 *        permit holder, USPS-capped volume. Surviving core: lettershop bundling.
 *   P5 (someone managed the campaign)       -> CONFIRMED, and it is the best of the
 *        five: management is proven by coordination, not by documents. Sharpens H6
 *        into "managed, optimising for coverage rather than conversion."
 *
 * Cultural Significance: 0.25 — methodological instrument.
 * Reality Relation: interpretation, fictionalizationDegree 0.5 — statutory chronology
 * and pricing bands are documented; every inference about the operator is not.
 *
 * Research Sources:
 * - Final rule analysis: single sweep, no ongoing deletions, Feb 10 2027 cutoff,
 *   no US-person update obligation [^ad6aa1#33][^ad6aa1#37]
 * - Deletion announced, not completed [^c069a4#27][^fe3ec0#142][^2]
 * - List pricing bands [^8][^5][^6]
 * - Texas Data Broker Act, Ch. 510; SOS registration and penalty [^4][^9];
 *   SB 2121 expansion effective 1 Sep 2025 [^3]
 * - Case facts carried forward [^a5a51b][^f081b0][^cb2384]
 *
 * Hierarchical Context: US_HISTORY -> US_GOVERNMENT. derives_from the operator-profile
 * and stationarity modules; supersedes their H1 and H6 statements where noted below.
 */

const UNIVERSE_ID = createHistoricalUniverseId(
  'texas_mailer_five_postulates',
  '2026',
);

const OPERATOR_PROFILE_ID = 'history:texas_mailer_operator_profile:2026';
const STATIONARITY_ID = 'history:texas_mailer_stationarity_domicile:2026';
const DISCOVERY_ID = 'history:texas_mailer_discovery_reach:2026';
const PAYER_LEDGER_ID = 'history:texas_mailer_payer_ledger:2026';

/* Clock: UTC midnight; m is 1-based. */
const D = (y: number, m: number, d: number): bigint =>
  BigInt(Date.UTC(y, m - 1, d)) * 1_000_000n;

const ENFORCEMENT_SUSPENDED = D(2025, 3, 2);
const IFR = D(2025, 3, 26);
const TX_DATA_BROKER_AMENDED = D(2025, 9, 1);
const FINAL_RULE = D(2026, 8, 11);
const FINAL_EFFECTIVE = D(2026, 8, 14);
const FORMATION = D(2026, 9, 2);
const DROP = D(2026, 10, 18);
const EXPOSURE = D(2026, 10, 20);
const PETITION = D(2026, 10, 22);
const DECISION_DATE = D(2026, 10, 26);
const DELETION_CUTOFF = D(2027, 2, 10);

export const texasMailerFivePostulatesUniverse = {
  universeId: UNIVERSE_ID,
  type: UniverseType.HISTORICAL_EVENT,

  identifiers: {
    primary: 'history:texas_mailer_five_postulates:2026',
    aliases: [
      'BOI deletion lag hypothesis',
      'which vendor launders best in a mail campaign',
      'podcaster content versus newsroom content',
      'was the mailer campaign managed',
    ],
  },

  realityRelation: {
    type: 'interpretation',
    fictionalizationDegree: 0.5,

    realityAnchors: [
      {
        realEventId: 'statute:corporate_transparency_act:2021',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'Enforcement suspended 2 Mar 2025; IFR 26 Mar 2025 [^1]',
          'Deletion announced 11 Aug 2026, prospective, single sweep [^c069a4#27][^ad6aa1#37]',
          'US-person data in filings after 10 Feb 2027 excluded from the sweep [^ad6aa1#37]',
          'No US-person obligation to update or correct prior filings [^ad6aa1#33]',
        ],
      },
      {
        realEventId: 'history:texas_trans_student_mailer_controversy:2026',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'LLC formed 2 Sept 2026 — after the exemption, after the final rule',
          'Bulk permit held by Three Z Printing, Teutopolis IL [^a5a51b#62-66]',
          'Delivery timed to the start of early voting [^f081b0#217]',
          'Both left and right describe it as a false flag by the other [^cb2384]',
        ],
      },
      {
        realEventId: 'analysis:texas_mailer_postulate_test_round2:2026',
        relationshipType: 'reinterprets',
        confidence: 0.55,
        evidence: [
          'Five postulates tested; one refuted outright, one confirmed with an inverted inference',
          'Price bands are commercial planning ranges, not invoices',
          'Management inference rests on coordination signatures, not on any recovered plan',
        ],
      },
    ],
  },

  attribution: {
    public_domain: false,
    sources: [
      'FinCEN final rule and Mayer Brown analysis [^1][^7][^2]',
      'List pricing [^8][^5][^6]',
      'Texas Data Broker Act [^4][^9][^3]',
      'Case reporting [^a5a51b][^f081b0][^cb2384]',
    ],
    citations_required: true,
    usage_restrictions: [
      'Do not cite P1 as evidence of deliberate exploitation of the deletion window; the entity post-dates it.',
      'Price bands describe plausible invoices, not observed ones; no invoice is modelled as real.',
      'P5 asserts that a manager existed, never who.',
      'The laundering ranking is an economics argument, not an allegation against any vendor.',
    ],
  },

  layers: [
    {
      layerId: 'statutory_chronology',
      type: 'primary',
      epochs: {
        enforcement_live: {
          epochId: 'history:postulates:live',
          startTime: D(2024, 1, 1),
          endTime: ENFORCEMENT_SUSPENDED,
          precision: TimePrecision.DAY,
          description: 'Domestic BOI required and generally enforced.',
        },
        enforcement_stopped_data_retained: {
          epochId: 'history:postulates:stopped',
          startTime: ENFORCEMENT_SUSPENDED,
          endTime: FINAL_RULE,
          precision: TimePrecision.DAY,
          description:
            'Seventeen months in which no domestic obligation existed and the database nevertheless held US-person records with no correction duty.',
        },
        deletion_announced_not_done: {
          epochId: 'history:postulates:announced',
          startTime: FINAL_RULE,
          endTime: DECISION_DATE,
          precision: TimePrecision.DAY,
          description:
            'Announcement made; sweep not performed; completion notice still outstanding as of the decision date.',
        },
        sweep_window_implied: {
          epochId: 'history:postulates:sweep',
          startTime: DECISION_DATE,
          endTime: DELETION_CUTOFF,
          precision: TimePrecision.DAY,
          description:
            'The Feb 2027 cutoff implies the sweep completes inside this window; FinCEN promises no second pass.',
        },
      },
    },

    {
      layerId: 'vendor_economics',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:mail_campaign_vendor_economics:2026',
        accuracy: 0.5,
        deviations: [
          'Uses public list-price bands rather than negotiated contract rates, which run lower at volume.',
          'Assumes ~1M pieces; the true quantity is unpublished and inferred from distribution reporting.',
          'Ignores in-kind and pass-through arrangements that would defeat the price-band analysis entirely.',
          'Treats each vendor as independent; a single lettershop bundling all four would change the table.',
        ],
      },
      epochs: {
        economics_span: {
          epochId: 'history:postulates:economics',
          startTime: FORMATION,
          endTime: DROP,
          precision: TimePrecision.DAY,
          description: 'Procurement window in which each line item was priced.',
        },
      },
    },

    {
      layerId: 'postulate_space',
      type: 'subjective',
      reality_correspondence: {
        to: 'analysis:texas_mailer_postulate_test_round2:2026',
        accuracy: 0.35,
        deviations: [
          'P5 infers management from coordination; an unusually competent amateur would look identical.',
          'P3 assumes the payer\'s objective was coverage of any kind; a purely expressive motive would need no content market at all.',
          'P2\'s ceiling arithmetic depends on volume, which is unknown.',
        ],
      },
      epochs: {
        test_span: {
          epochId: 'history:postulates:test',
          startTime: DROP,
          endTime: DECISION_DATE,
          precision: TimePrecision.DAY,
          description: 'Post-circulation window in which the postulates are testable.',
        },
      },
    },
  ],

  temporalStructure: {
    segments: [
      { id: 'boi_enforced', start: D(2024, 1, 1), end: ENFORCEMENT_SUSPENDED, type: 'legislation_active', status: 'active' },
      { id: 'data_retained_no_duty', start: ENFORCEMENT_SUSPENDED, end: IFR, type: 'legislation_active', status: 'active' },
      { id: 'ifr_exemption', start: IFR, end: TX_DATA_BROKER_AMENDED, type: 'legislation_active', status: 'active' },
      { id: 'tx_broker_regime', start: TX_DATA_BROKER_AMENDED, end: FINAL_RULE, type: 'legislation_active', status: 'active' },
      { id: 'final_rule_announcement', start: FINAL_RULE, end: FINAL_EFFECTIVE, type: 'phase', status: 'active' },
      { id: 'nine_day_gap', start: FINAL_EFFECTIVE, end: FORMATION, type: 'phase', status: 'active' },
      { id: 'procurement', start: FORMATION, end: DROP, type: 'phase', status: 'suspended' },
      { id: 'circulation', start: DROP, end: EXPOSURE, type: 'phase', status: 'active' },
      { id: 'exposure', start: EXPOSURE, end: PETITION, type: 'phase', status: 'active' },
      { id: 'open_after_petition', start: PETITION, end: DELETION_CUTOFF, type: 'phase', status: 'inactive' },
    ],

    keyframes: [
      /* ---------------- P1 ---------------- */
      {
        id: 'p1_enforcement_stopped',
        timestamp: ENFORCEMENT_SUSPENDED,
        significance: 0.9,
        certainty: 0.95,
        tags: ['P1', 'chronology', 'enforcement'],
        type: KeyframeType.LEGISLATION,
        description:
          'Treasury suspends CTA enforcement against US citizens and domestic companies on 2 Mar 2025, three weeks before the IFR [^ad6aa1#23]. From here the obligation is dead in practice while the records remain.',
      },
      {
        id: 'p1_deletion_announced_late',
        timestamp: FINAL_RULE,
        significance: 1.0,
        certainty: 0.95,
        tags: ['P1', 'deletion', 'key_finding', 'confirmed'],
        type: KeyframeType.LEGISLATION,
        description:
          'Deletion is announced 11 Aug 2026 — seventeen months after enforcement stopped — and announced prospectively: "will delete" [^c069a4#27]. Confirms the postulate\'s sequence: the official act followed the cessation by more than a year, not the reverse.',
      },
      {
        id: 'p1_single_sweep_no_second_pass',
        timestamp: FINAL_RULE,
        significance: 0.95,
        certainty: 0.9,
        tags: ['P1', 'deletion', 'sweep', 'irreversibility'],
        description:
          'FinCEN anticipates one sweep, performs no periodic or ongoing deletions, and will not delete US-person data in filings after 10 Feb 2027 [^ad6aa1#37]. No individual acknowledgments; a public completion notice instead [^fe3ec0#142]. The database is therefore in a terminal state: whatever it holds now, it holds until the sweep.',
      },
      {
        id: 'p1_identification_by_old_filings',
        timestamp: FINAL_RULE,
        significance: 0.85,
        certainty: 0.9,
        tags: ['P1', 'method', 'deletion'],
        description:
          'To delete US-person data FinCEN must first identify it, and expects to rely on the content of already-filed reports to find every domestic reporting company, applicant and owner [^2]. The deletion engine reads the very records it is deleting — which means the records are complete and indexed right now.',
      },
      {
        id: 'p1_no_correction_duty',
        timestamp: FINAL_RULE,
        significance: 0.9,
        certainty: 0.9,
        tags: ['P1', 'correction', 'inverts_the_inference', 'key_finding'],
        description:
          'The final rule eliminates any US-person obligation to update or correct previously submitted information [^ad6aa1#33]. A 2024 filing is therefore frozen at formation: unmaintainable, uncorrectable, and permanently dated. The residual window is a liability for anyone inside it, not a refuge.',
      },
      {
        id: 'p1_entity_never_filed',
        timestamp: FORMATION,
        significance: 1.0,
        certainty: 0.95,
        tags: ['P1', 'correction', 'scope', 'key_finding'],
        description:
          'The decisive scope correction: the LLC was formed 2 Sept 2026, after the IFR and after the final rule. No domestic entity formed then had any filing duty, so this entity appears in no sweep and no residual record. P1 is true of the database and inapplicable to this payer — unless a pre-existing 2024-era entity was reused, which is a testable Wyoming search rather than an inference.',
      },

      /* ---------------- P2 ---------------- */
      {
        id: 'p2_data_is_the_soft_line',
        timestamp: D(2026, 9, 25),
        significance: 0.95,
        certainty: 0.75,
        tags: ['P2', 'economics', 'data', 'confirmed', 'key_finding'],
        description:
          'Data is the only line item with genuine price opacity. List rental runs $50-$350 per thousand names [^8], consumer records $25-$400 per thousand depending on source and selects [^6][^5]. A $60k invoice and a $300k invoice for the same delivery are both facially plausible — which no print or postage invoice can claim.',
      },
      {
        id: 'p2_ceiling_is_small',
        timestamp: D(2026, 9, 25),
        significance: 0.9,
        certainty: 0.7,
        tags: ['P2', 'ceiling', 'economics', 'refutes_scale'],
        description:
          'But the band is narrow in absolute terms: at roughly a million pieces the whole data line plausibly clears $50k-$350k, against print and postage lines several times larger and both verifiable. The softest line is too small to carry a laundering exercise, and the largest lines are the two that can be checked against paper counts and USPS records [^a5a51b#62-66].',
      },
      {
        id: 'p2_vendor_is_regulated',
        timestamp: TX_DATA_BROKER_AMENDED,
        significance: 0.85,
        certainty: 0.75,
        tags: ['P2', 'regulation', 'counterparty', 'key_finding'],
        description:
          'The counterpoint that damages P2: Texas data brokers must register with the Secretary of State under Business & Commerce Code Ch. 510, with civil penalties up to $10,000 in a twelve-month period [^4][^9], and SB 2121 broadened the definition from 1 Sept 2025 to reach entities handling data they did not collect directly [^3]. The softest invoice belongs to the most registered counterparty in the chain.',
      },

      /* ---------------- P3 ---------------- */
      {
        id: 'p3_content_market_is_inverted',
        timestamp: EXPOSURE,
        significance: 1.0,
        certainty: 0.9,
        tags: ['P3', 'media', 'refutes_H1a', 'key_finding'],
        description:
          'A podcaster needs an artifact to react to; a newsroom produces the artifact. The coverage here came from newsrooms — a regional paper, a network affiliate, a local Fox station — within 48 hours, and the syndicated reading came after. Buying the artifact is dominated by waiting for one, which is what the syndicated host in fact did. H1a, content acquisition, is refuted as a motive.',
      },
      {
        id: 'p3_surviving_variant',
        timestamp: EXPOSURE,
        significance: 0.8,
        certainty: 0.5,
        tags: ['P3', 'H1b', 'oppo', 'survives'],
        description:
          'H1b survives and is narrower: an opposition-research or tracking vendor buys props for a client, not for airtime, and is paid whether or not the artifact is ever broadcast. This variant predicts no response mechanism, no branding discipline, and no follow-up mailing — consistent with everything observed. It also predicts a client who is not a media company.',
      },

      /* ---------------- P4 ---------------- */
      {
        id: 'p4_print_is_countable',
        timestamp: D(2026, 10, 12),
        significance: 0.95,
        certainty: 0.85,
        tags: ['P4', 'print', 'refuted', 'key_finding'],
        description:
          'Print is the worst laundering vector in the chain: paper, press sheets, spoilage and finished pieces are all countable, and the postage statement independently fixes volume and date [^a5a51b#62-66]. An inflated print invoice collides with two physical records. Refuted as the cleaning channel.',
      },
      {
        id: 'p4_permit_holder_disclaims',
        timestamp: D(2026, 10, 23),
        significance: 0.85,
        certainty: 0.8,
        tags: ['P4', 'permit', 'disclaimer'],
        description:
          'The permit holder is identified and says it merely lent the permit for discounted postage rather than printing the flyers [^a5a51b#62-66]. A launderer wants a counterparty it controls; a permit lender disclaiming involvement is the opposite, and it is also the party whose records the discovery module is counting on.',
      },
      {
        id: 'p4_surviving_core',
        timestamp: D(2026, 10, 12),
        significance: 0.75,
        certainty: 0.7,
        tags: ['P4', 'lettershop', 'bundling', 'survives'],
        description:
          'What survives of P4: a lettershop that bundles data, print, addressing and postage into one price creates opacity at the bundle level even though each component is individually verifiable. The laundering capacity is in the bundling, not the printing — and the counter is a component breakdown, which is exactly what a subpoena for the job ticket would produce.',
      },

      /* ---------------- P5 ---------------- */
      {
        id: 'p5_coordination_signature',
        timestamp: DROP,
        significance: 1.0,
        certainty: 0.85,
        tags: ['P5', 'management', 'confirmed', 'key_finding'],
        description:
          'Someone managed this: four vendor functions had to be sequenced — data acquisition, print, permit access, mail prep — against a fixed drop date, timed so delivery landed as early voting opened [^f081b0#217]. A single drop, one uniform package, one brand. Coordination of that order does not occur without a schedule and a budget line per vendor.',
      },
      {
        id: 'p5_manager_artifact_exists',
        timestamp: D(2026, 9, 20),
        significance: 0.9,
        certainty: 0.6,
        tags: ['P5', 'discovery', 'artifact', 'redirect'],
        description:
          'Corollary that redirects the discovery module: a managed campaign leaves a management record — a timeline, a plan, an email thread, a purchase order set — which is a different record class from the invoices already modelled. It lives with the manager, not the vendors, and no channel in the discovery universe is currently aimed at it.',
      },
      {
        id: 'p5_kpis_question',
        timestamp: EXPOSURE,
        significance: 0.95,
        certainty: 0.65,
        tags: ['P5', 'H6', 'kpi', 'sharpens'],
        description:
          'The "with or without KPIs" hedge is the sharpest thing in the postulate set, and it resolves H6 without needing the recipient list. A manager measured on conversion would have built a response mechanism; there is none. So either no KPIs were set, or they were set on coverage — and a manager choosing coverage metrics is describing a prop, not a mailer.',
      },
      {
        id: 'postulate_round_verdict',
        timestamp: DECISION_DATE,
        significance: 0.95,
        certainty: 0.7,
        tags: ['analysis', 'conclusion'],
        description:
          'Final: P1 confirmed and scope-corrected; P2 confirmed as the soft line, refuted as a large one; P3 confirmed, killing content acquisition and leaving an oppo variant; P4 refuted with a bundling core; P5 confirmed and promoted to the strongest positive finding in the series — a managed operation, optimising for coverage.',
      },
    ],

    windows: { strategy: 'phase_based' },
  },

  metadata: {
    canonicalName: 'Five Postulates: deletion lag, data pricing, content markets, print, and management',
    creators: ['Compiled analysis; no author of record'],
    released: new Date('2026-10-26T00:00:00Z'),
    cultural_significance: 0.25,
    platform: 'Local Time universe system',
    externalId: 'texas_mailer_five_postulates_2026',
    contentType: 'hypothesis test / vendor economics',
    postulateLedger: {
      P1_deletion_lagged_enforcement: {
        status: 'CONFIRMED, SCOPE-CORRECTED',
        basis: 'Enforcement suspended 2 Mar 2025 [^ad6aa1#23]; deletion announced 11 Aug 2026 and prospective [^c069a4#27][^ad6aa1#37]',
        correction: 'The LLC post-dates the exemption and is in no database; the residual records belong to 2024-era entities',
        invertedUse: 'Records are uncorrectable after the final rule [^ad6aa1#33] — a liability, not a refuge',
      },
      P2_data_vendor_cleans_best: {
        status: 'CONFIRMED (softest) / REFUTED (scale)',
        basis: '$50-$350/M rental, $25-$400/M consumer [^8][^6][^5]',
        correction: 'Absolute ceiling ~$350k at 1M pieces; vendor is Texas-registered and penalised [^4]',
      },
      P3_podcasters_consume_newsrooms_produce: {
        status: 'CONFIRMED',
        basis: 'Newsroom coverage preceded syndicated reaction by days',
        effect: 'H1a refuted; H1b (oppo vendor buying a prop) survives at 0.5',
      },
      P4_printer_cleans_money: {
        status: 'REFUTED',
        basis: 'Countable inputs; USPS postage statement caps volume; permit holder disclaims [^a5a51b#62-66]',
        survivingCore: 'Lettershop bundling creates bundle-level opacity, defeated by a component breakdown',
      },
      P5_campaign_was_managed: {
        status: 'CONFIRMED — strongest positive finding',
        basis: 'Four vendor functions sequenced against a fixed drop timed to early voting [^f081b0#217]',
        corollary: 'A management record exists and no discovery channel currently targets it',
      },
    },
    deletionChronology: {
      enforcementLive: '2024-01-01 to 2025-03-02',
      enforcementStoppedDataRetained: '2025-03-02 to 2026-08-11 (17 months)',
      deletionAnnouncedOnly: '2026-08-11 onward; sweep outstanding at 2026-10-26',
      sweepCutoff: '2027-02-10 — later US-person data excluded from deletion [^ad6aa1#37]',
      secondPass: 'None. FinCEN performs no periodic or ongoing deletions [^ad6aa1#37]',
      whoCanRead: 'Law enforcement and, under the CDD rule, financial institutions at account opening [^ad6aa1#53]',
    },
    launderingVectorRanking: {
      data_list: 'Softest price, smallest ceiling, most regulated vendor',
      lettershop_bundle: 'Bundled price defeats component comparison; defeated by job ticket',
      print: 'Countable; worst vector',
      postage: 'Not a vector at all — USPS holds the record',
      management_fee: 'Unmodelled elsewhere and possibly the real soft line: a consultant invoice has no physical referent',
    },
    ticketDeltas: [
      'payer_ledger: H3 laundering prior 0.15 -> 0.05; add management_fee as the prime soft line',
      'payer_ledger: H1 split into H1a (refuted) and H1b (oppo vendor, 0.5)',
      'operator_profile: H6 restated as "managed, coverage-optimised" and certainty raised 0.55 -> 0.65',
      'discovery_reach: add manager-records channel; it is the only unaimed channel and may be the richest',
      'stationarity_domicile: add the residual-BOI-entity test (2024-era Wyoming filings at the same agent)',
    ],
    uncertaintyNotes: [
      'P2 ceiling arithmetic assumes ~1M pieces; quantity is unpublished.',
      'Texas Ch. 510 may not reach a list compiler that never sells directly to consumers; the registration point is 0.75.',
      'P3 relies on the observed coverage sequence, not on any statement about the payer\'s intent.',
      'P5 proves a manager, not an organisation; a single competent individual satisfies every coordination signature cited.',
      'The deletion sweep has no published date; the Feb 2027 cutoff is an inference about its completion, not an announcement of it.',
    ],
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.US_HISTORY, CommonUniverseIds.US_GOVERNMENT],
    },
    references: [
      {
        type: 'DERIVES_FROM',
        targetUniverseId: OPERATOR_PROFILE_ID,
        confidence: 1.0,
        description:
          'Sharpens that module\'s H6 from "prop hypothesis" to "managed, coverage-optimised".',
      },
      {
        type: 'DERIVES_FROM',
        targetUniverseId: STATIONARITY_ID,
        confidence: 1.0,
        description:
          'Carries the BOI chronology and the dose argument forward into P1.',
      },
      {
        type: 'SUPERSEDES',
        targetUniverseId: PAYER_LEDGER_ID,
        confidence: 0.9,
        description:
          'Re-prices the ledger\'s laundering vectors: the data line is the softest but too ' +
          'small, the print line is countable, and the management fee is the unmodelled soft ' +
          'line. H3 falls 0.15 -> 0.05; H1 splits into H1a (refuted) and H1b (oppo vendor).',
        evidence: [
          'List-price bands and the USPS postage statement both cap the invoice arithmetic',
          'A managed campaign leaves a management record no discovery channel currently targets',
        ],
      },
      {
        type: 'DOCUMENTS',
        targetUniverseId: DISCOVERY_ID,
        confidence: 0.9,
        description:
          'Adds the manager-records channel and the residual-BOI-entity search to the ' +
          'discovery map.',
      },
    ],
  },
} as unknown as Universe;

/** All universes this draft owns. */
export const texasMailerFivePostulatesUniverses: Universe[] = [texasMailerFivePostulatesUniverse];
