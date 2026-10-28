import {
  KeyframeType,
  TimePrecision,
  Universe,
  UniverseType,
} from '../../../../core/types';
import { CommonUniverseIds } from '../../../../core/common-universe-ids';
import { createHistoricalUniverseId } from '../../../../core/universe-ids';

/**
 * "The Payer's Ledger" — counterfactual reconstruction of the undisclosed funder
 * of the October 2026 Texas Trans & LGBTQ+ Student Resource Guide mailers.
 *
 * WHAT THIS IS: a model of the *paperwork* an entity paying for this mailing would
 * necessarily have generated, whether its motive was legitimate advertising, content
 * acquisition, or laundering. It is built from the money trail that has been
 * independently reported, and from the accounting and postal artefacts that a mass
 * mailing cannot avoid creating.
 *
 * WHAT THIS IS NOT: an identification of the payer. As of 26 Oct 2026 no sender has
 * been named; a West Texas DA has opened a criminal probe [^2], and TENT has
 * filed a Rule 202 petition in Travis County specifically to discover unknown
 * defendants [^1]. Every claim about motive in this module is a HYPOTHESIS
 * carried in a `recreation` layer, tagged `hypothesis`, and must not be cited as
 * evidence about any real person or entity.
 *
 * THE ANALYTIC PAYOFF: concealment is diagnostic. A legitimate commercial payer
 * needs no shell; the elaborate structure — fictitious return address, third-party
 * bulk permit, co-opted nonprofit branding, registered-agent chain — is *evidence
 * against* a benign advertising motive and *for* deniability as the product being
 * purchased. The module's own conclusion is stated at 2026-10-22 with certainty 0.55.
 *
 * Cultural Significance: 0.35 — an analytical construct, not a work. It ranks high
 * only as a retrieval handle for the money-trail question.
 * Reality Relation: interpretation, fictionalizationDegree 0.85 — the primary layer
 * is documented; the ledger and the motives are not.
 *
 * Research Sources:
 * - FOX 26 Houston, "Who sent transgender mailers to Texas kids? West Texas DA opens
 *   criminal investigation", 22 Oct 2026 [^2]
 * - CBS News Texas, "Fight over transgender mystery mailers heads to court",
 *   23 Oct 2026 [^1]
 * - KXAN, "Agent cutting ties with LLC that sent 'trans student guide' mailers",
 *   23 Oct 2026 [^4]
 * - Texas Tribune, "Texas trans rights group blames backlash on false mailers",
 *   20 Oct 2026 [^5]
 * - CBS News Texas, "Mystery transgender mailers sent to Texas students traced to
 *   newly formed company", 22 Oct 2026 [^3]
 * - 26 U.S.C. §162; Treas. Reg. §1.162-1(a); 26 U.S.C. §274(d); 26 U.S.C. §7206
 *   (fraudulent returns); USPS Publication 604a / PS Form 3602 (postage statements)
 *
 * Hierarchical Context: US_HISTORY -> US_GOVERNMENT. Sibling to the response-video
 * universes. The mailer-controversy event is a reality anchor, not a reference: no
 * module owns that id, and a declared edge to an unowned id is a dangling edge, not a
 * link (#92). The one reference below points at the transcription record, which exists.
 */

const UNIVERSE_ID = createHistoricalUniverseId(
  'texas_mailer_payer_ledger',
  '2026',
);

const MAILER_EVENT_ID = 'history:texas_trans_student_mailer_controversy:2026';
const EXCERPT_ID = 'series:beck_pamphlet_transcript:2026';

/* ------------------------------------------------------------------ *
 * Clock. Calendar dates, UTC midnight. Month index is 0-based: 8 = September.
 * ------------------------------------------------------------------ */

const D = (y: number, m: number, d: number): bigint =>
  BigInt(Date.UTC(y, m - 1, d)) * 1_000_000n;

const FORMATION = D(2026, 9, 2);      // WY filing, per corporate records
const OPS_START = D(2026, 8, 15);     // counterfactual window opens (pre-formation)
const DROP = D(2026, 10, 18);         // mail drop, estimated from delivery reports
const DELIVERY = D(2026, 10, 19);     // in mailboxes as early voting begins
const EXPOSURE = D(2026, 10, 20);     // first press
const PLEADING = D(2026, 10, 22);     // Rule 202 + criminal referral same day
const UNWIND = D(2026, 10, 23);       // agent cuts ties; USPS names permit holder
const HORIZON = D(2026, 11, 3);       // Election Day

export const texasMailerPayerLedgerUniverse = {
  universeId: UNIVERSE_ID,
  type: UniverseType.HISTORICAL_EVENT,

  identifiers: {
    primary: 'history:texas_mailer_payer_ledger:2026',
    aliases: [
      'who paid for the Texas trans student resource guide',
      'Texas Transgender Student Union LLC money trail',
      'mailer payer ledger model',
    ],
  },

  realityRelation: {
    type: 'interpretation',
    fictionalizationDegree: 0.85,

    realityAnchors: [
      {
        realEventId: MAILER_EVENT_ID,
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'LLC filed in Wyoming 2 Sept 2026, registered agent service in Sheridan [^f081b0#201]',
          'Return address in Meadows Place does not exist [^f081b0#203]',
          'USPS identifies bulk permit holder as Three Z Printing, Teutopolis IL [^1]',
          'TENT Rule 202 petition, Form 202 filed 22 Oct 2026 [^1]',
          'Ward/Reeves/Loving DA criminal probe, possible forgery [^f081b0#190]',
        ],
      },
      {
        // The interpretive claim, declared as a claim.
        realEventId: 'analysis:texas_mailer_payer_motive_model:2026',
        relationshipType: 'reinterprets',
        confidence: 0.5,
        evidence: [
          'Three competing motives modelled; none confirmed',
          'Posterior favours deniability over financial concealment, at 0.55',
          'Model built from artefacts a mass mailing cannot avoid, not from testimony',
        ],
      },
      {
        realEventId: EXCERPT_ID,
        relationshipType: 'documents',
        confidence: 0.9,
        evidence: [
          'The mailer produced a nationally syndicated segment within days — the "earned media" leg of the content hypothesis',
          'Segment is hostile, not paid; hostility is not evidence of a commercial relationship',
        ],
      },
    ],
  },

  attribution: {
    public_domain: false,
    sources: [
      'FOX 26 Houston, 22 Oct 2026 [^2]',
      'CBS News Texas, 23 Oct 2026 [^1]',
      'KXAN, 23 Oct 2026 [^4]',
      'Texas Tribune, 20 Oct 2026 [^5]',
      '26 U.S.C. §162, §274(d), §7206; USPS PS Form 3602',
    ],
    citations_required: true,
    usage_restrictions: [
      'SPECULATIVE. Do not cite as evidence about any identified or unidentified person or entity.',
      'Do not combine this universe with a named party. No reporting links any named individual to the payment.',
      'Counterfactual ledger entries are reconstructions of what the paperwork would look like, not records of paperwork that exists.',
      'Motives are ranked hypotheses with stated falsifiers; they are not findings.',
      'Legal characterisations (forgery, laundering) are the cited officials\' and this model\'s, not adjudicated facts.',
    ],
  },

  layers: [
    {
      /* Documented money trail. +1 plane: every keyframe here is sourced. */
      layerId: 'documented_trail',
      type: 'primary',
      epochs: {
        corporate_formation: {
          epochId: 'history:texas_mailer_payer:formation',
          startTime: FORMATION,
          endTime: DROP,
          precision: TimePrecision.DAY,
          description:
            'From Wyoming filing (2 Sept) to mail drop: the window in which print, data and postage were bought.',
        },
        circulation: {
          epochId: 'history:texas_mailer_payer:circulation',
          startTime: DROP,
          endTime: DELIVERY + 86_400_000_000n,
          precision: TimePrecision.DAY,
          description:
            'Mail drop through delivery, timed to early voting [^f081b0#217].',
        },
        enforcement: {
          epochId: 'history:texas_mailer_payer:enforcement',
          startTime: EXPOSURE,
          endTime: HORIZON,
          precision: TimePrecision.DAY,
          description:
            'Press exposure, Rule 202 petition, DA probe, registered-agent termination.',
        },
      },
    },

    {
      /* The counterfactual ledger. -1 plane: invented, and labelled so. */
      layerId: 'payer_ledger',
      type: 'recreation',
      reality_correspondence: {
        to: MAILER_EVENT_ID,
        accuracy: 0.4,
        deviations: [
          'The payer is unknown; this layer invents a bookkeeping subject, not a person.',
          'Line items are constrained by artefact physics (postage statements, print volume), not by any document produced.',
          'The layer assumes a single paying entity; a pass-through or multiple funders would fit the same evidence.',
          'The layer assumes the payer intended commercial documentation; an informal or cash arrangement would leave no ledger at all, and the model cannot exclude that.',
        ],
      },
      epochs: {
        fiscal_window: {
          epochId: 'history:texas_mailer_payer:fiscal',
          startTime: OPS_START,
          endTime: HORIZON,
          precision: TimePrecision.DAY,
          description:
            'The payer\'s own bookkeeping period: cost incurred in Q4 2026, deduction claimed on the FY2026 return.',
        },
      },
    },

    {
      /* Motive space. -1 plane: hypotheses. */
      layerId: 'motive_space',
      type: 'subjective',
      reality_correspondence: {
        to: 'analysis:texas_mailer_payer_motive_model:2026',
        accuracy: 0.3,
        deviations: [
          'H1 (content acquisition), H2 (deductible advertising), H3 (laundered placement) are not exhaustive.',
          'H2 and H3 predict materially different paperwork; the model cannot observe which paperwork exists.',
          'A fourth possibility — payer is a foreign or non-commercial actor with no US filing obligation — is modelled only as an escape hatch, not developed.',
        ],
      },
      epochs: {
        hypothesis_span: {
          epochId: 'history:texas_mailer_payer:hypotheses',
          startTime: OPS_START,
          endTime: HORIZON,
          precision: TimePrecision.DAY,
          description:
            'Hypotheses held across the whole window; none retracted by evidence.',
        },
      },
    },
  ],

  temporalStructure: {
    // Contiguous, 15 Aug -> 3 Nov. Phases without documentary trace carry
    // status: 'suspended' — the filter's negative space, kept explicit.
    segments: [
      { id: 'pre_formation', start: OPS_START, end: FORMATION, type: 'phase', status: 'suspended' },
      { id: 'entity_formation', start: FORMATION, end: D(2026, 9, 20), type: 'phase', status: 'active' },
      { id: 'procurement', start: D(2026, 9, 20), end: D(2026, 10, 10), type: 'phase', status: 'suspended' },
      { id: 'print_and_postage', start: D(2026, 10, 10), end: DROP, type: 'phase', status: 'suspended' },
      { id: 'mail_drop', start: DROP, end: DELIVERY, type: 'phase', status: 'active' },
      { id: 'delivery', start: DELIVERY, end: EXPOSURE, type: 'phase', status: 'active' },
      { id: 'exposure', start: EXPOSURE, end: PLEADING, type: 'phase', status: 'active' },
      {
        id: 'compelled_disclosure',
        start: PLEADING,
        end: UNWIND,
        type: 'legal_period',
        status: 'active',
        jurisdiction: 'Travis County, Texas',
        description:
          'Rule 202 petition and the DA referral, filed the same day. The draft split this ' +
          'and the court-jurisdiction span into overlapping segments; a partition cannot ' +
          'hold both, so the jurisdiction is an attribute of the phase rather than a ' +
          'second overlapping phase.',
      },
      { id: 'unwinding', start: UNWIND, end: D(2026, 10, 26), type: 'phase', status: 'active' },
      { id: 'open_after_horizon', start: D(2026, 10, 26), end: HORIZON, type: 'phase', status: 'inactive' },
    ],

    keyframes: [
      {
        id: 'llc_filed_wyoming',
        timestamp: FORMATION,
        significance: 0.95,
        certainty: 1.0,
        tags: ['documented', 'corporate', 'money_trail', 'formation'],
        description:
          'Texas Transgender Student Union LLC filed in Wyoming on 2 Sept 2026 — five weeks before the drop, and a month before any public trace of the campaign [^f081b0#201].',
      },
      {
        id: 'registered_agent_is_an_llc',
        timestamp: FORMATION,
        significance: 0.85,
        certainty: 0.9,
        tags: ['documented', 'corporate', 'anonymity', 'structure'],
        description:
          'The registered agent is itself another LLC, in a chain linked to hundreds of shell companies [^f081b0#201] — two corporate layers deep before any human name would appear.',
      },
      {
        id: 'procurement_band',
        timestamp: D(2026, 9, 25),
        significance: 0.7,
        certainty: 0.25,
        tags: ['hypothesis', 'ledger', 'procurement', 'suspended'],
        description:
          'Counterfactual: the window in which a data append, a print run and a postage deposit must have been ordered. No document has surfaced; the timing is inferred backwards from the drop.',
      },
      {
        id: 'print_and_permit',
        timestamp: D(2026, 10, 12),
        significance: 0.9,
        certainty: 0.6,
        tags: ['hypothesis', 'ledger', 'postage', 'permit', 'key_artifact'],
        description:
          'The mailing rides on a third party\'s bulk permit — later identified as Three Z Printing of Teutopolis, Illinois, which owned the permit but may have done nothing more than lend it for discounted postage [^1]. The postage statement behind that permit is the one artefact that cannot be forged cheaply.',
      },
      {
        id: 'data_list_purchase',
        timestamp: D(2026, 10, 2),
        significance: 0.8,
        certainty: 0.4,
        tags: ['hypothesis', 'ledger', 'data', 'privacy'],
        description:
          'Households were addressed "Students Of The [Family Name] Family" [^f081b0#217], which requires a named-household list with implied minors — a purchased or appended file, and the DA\'s stated question is where the addresses came from [^f081b0#233].',
      },
      {
        id: 'co_opted_branding',
        timestamp: D(2026, 10, 10),
        significance: 0.95,
        certainty: 0.95,
        tags: ['documented', 'legal_exposure', 'tent', 'key_artifact'],
        description:
          'The pamphlet carries TENT\'s branding, website links and event dates [^f081b0#205]; TENT\'s petition alleges its name, materials including photographs, branding and website were used "without TENT\'s knowledge or consent, violating state law" [^a5a51b#50].',
      },
      {
        id: 'invoice_that_should_exist',
        timestamp: D(2026, 10, 15),
        significance: 0.75,
        certainty: 0.3,
        tags: ['hypothesis', 'ledger', 'invoice', 'deliverable'],
        description:
          'Counterfactual: a print-and-mail invoice, a data invoice and a postage line. Note what a §162 deduction actually requires — a substantiated payment, not proof the mailing worked; and note that a 1099-NEC is owed only if the vendor is unincorporated and paid $600 or more.',
      },
      {
        id: 'mail_drop',
        timestamp: DROP,
        significance: 0.9,
        certainty: 0.7,
        tags: ['documented', 'circulation', 'timing'],
        description:
          'Drop timed so delivery lands as early voting begins [^f081b0#217] — the one scheduling choice in the operation that is unambiguous.',
      },
      {
        id: 'first_press',
        timestamp: EXPOSURE,
        significance: 0.9,
        certainty: 1.0,
        tags: ['documented', 'exposure', 'tent'],
        description:
          'Texas Tribune reports the mailers and TENT\'s denial on 20 Oct [^5] — 48 hours after delivery, the operation becomes a story about itself.',
      },
      {
        id: 'rule_202_filed',
        timestamp: PLEADING,
        significance: 0.95,
        certainty: 0.95,
        tags: ['documented', 'legal', 'discovery', 'travis_county'],
        type: KeyframeType.MILESTONE,
        description:
          'TENT files Form 202 in Travis County — a pre-suit deposition tool used to identify unknown defendants, aimed squarely at the payer\'s identity [^1].',
      },
      {
        id: 'da_criminal_probe',
        timestamp: PLEADING,
        significance: 0.95,
        certainty: 0.95,
        tags: ['documented', 'legal', 'criminal', 'forgery'],
        description:
          'Ward, Reeves and Loving County DA Sarah Stogner opens a criminal investigation, saying the mailers could constitute forgery, and wants to know where the addresses came from [^f081b0#190][^f081b0#233].',
      },
      {
        id: 'motive_posterior',
        timestamp: PLEADING,
        significance: 0.8,
        certainty: 0.55,
        tags: ['analysis', 'hypothesis', 'conclusion', 'deniability'],
        description:
          'The model\'s own reading: the concealment stack — fictitious return address, borrowed permit, two-layer agent chain, co-opted nonprofit identity — buys deniability, not tax treatment. Financial concealment has cheaper tools; false-flag deniability needs exactly this much structure. H2 and H3 are therefore less likely than a political payer with no filing obligation at all.',
      },
      {
        id: 'agent_cuts_ties',
        timestamp: UNWIND,
        significance: 0.85,
        certainty: 0.9,
        tags: ['documented', 'unwinding', 'registered_agent'],
        description:
          'Hours after the I-Team visits the Sheridan office, Northwest Registered Agent says it is cutting ties with the LLC [^a5a51b#68] — the anonymity layer failing first.',
      },
      {
        id: 'usps_names_permit_holder',
        timestamp: UNWIND,
        significance: 0.9,
        certainty: 0.95,
        tags: ['documented', 'postage', 'key_artifact', 'usps'],
        type: KeyframeType.PUBLICATION,
        description:
          'USPS identifies the bulk mail permit holder as Three Z Printing of Teutopolis, Illinois; owning the permit does not mean it printed the flyers, only that it lent the permit for discounted postage [^1].',
      },
      {
        id: 'audit_hinge',
        timestamp: UNWIND,
        significance: 0.85,
        certainty: 0.8,
        tags: ['analysis', 'forensic', 'postage', 'falsifier'],
        description:
          'Why this matters for the laundering hypothesis: a USPS postage statement fixes volume and date, so an inflated print invoice is detectable against it. Any ledger that does not reconcile to the postage statement is a false ledger.',
      },
      {
        id: 'earned_media_leg',
        timestamp: D(2026, 10, 23),
        significance: 0.8,
        certainty: 0.85,
        tags: ['documented', 'media', 'content_hypothesis'],
        description:
          'Within five days the mailer generates a nationally syndicated reading and a response video — the outcome the content-acquisition hypothesis needs. But the coverage is hostile and unpaid, so it evidences salience, not a purchase.',
      },
    ],

    windows: { strategy: 'phase_based' },
  },

  metadata: {
    canonicalName: 'The Payer\'s Ledger: funding model for the 2026 Texas trans student mailers',
    creators: ['Compiled analysis; no author of record'],
    released: new Date('2026-10-26T00:00:00Z'),
    cultural_significance: 0.35,
    platform: 'Local Time universe system',
    externalId: 'texas_mailer_payer_ledger_2026',
    contentType: 'counterfactual financial reconstruction',
    payerStatus: 'unidentified as of 2026-10-26',
    legalPosture: {
      civil: 'TENT Rule 202 petition, Travis County, filed 22 Oct 2026 [^1]',
      criminal: 'Ward/Reeves/Loving DA probe, possible forgery, 22 Oct 2026 [^f081b0#190]',
      corporate: 'Wyoming LLC, agent terminated 23 Oct 2026 [^a5a51b#68]',
    },
    motives: {
      H1_content_acquisition: {
        claim: 'Payer is a media operator buying outrage as segment content.',
        prior: 0.2,
        falsifiers: [
          'No insertion order, agency or rights arrangement would exist, since the content is third-party coverage',
          'Co-opting TENT branding makes the asset unusable and legally toxic, which a content buyer would avoid',
          'Hostile coverage is not licensable and generates no revenue for the payer',
        ],
      },
      H2_deductible_advertising: {
        claim: 'Payer is a consultancy or vendor booking a §162 advertising expense.',
        prior: 0.15,
        falsifiers: [
          '§162 requires substantiated payment, not proof of effectiveness — so no "usage documentation" motive exists',
          'A legitimate ad buy leaves a normal trail; the concealment stack is unexplained by this hypothesis',
          'Wyoming offers no income-tax advantage, so the jurisdiction choice points to privacy, not deduction',
        ],
      },
      H3_laundered_placement: {
        claim: 'Payer needs an invoice for a service whose price is hard to benchmark.',
        prior: 0.15,
        falsifiers: [
          'USPS postage statements cap true mailing cost, defeating invoice inflation [^1]',
          'Laundering prefers low-scrutiny, high-value invoices; a mass mailing to named households guarantees a DA and a civil petition',
          'Print and data vendors are ordinary counterparties with ordinary records — nothing here is hard to price',
        ],
      },
      H4_political_deniability: {
        claim: 'Payer wanted the mailer attributed to a trans organization, and never intended a financial return.',
        prior: 0.5,
        falsifiers: [
          'Would be falsified by discovery of a commercial advertising contract or a political committee filing',
          'Would be weakened if the payer turns out to be an existing vendor with a marketing line item',
        ],
      },
    },
    deliverableArtifactsThatWouldExist: [
      'USPS postage statement (PS Form 3602) under the borrowed permit — volume and date',
      'Print vendor invoice and job ticket — quantity, stock, finish',
      'Data/list vendor invoice — household names, appended ages',
      'Payment rails record — cheque, ACH, card',
      '1099-NEC if any vendor is unincorporated and paid $600+',
      'Registered-agent engagement letter and the Wyoming filing itself',
      'Any political committee filing, if the payer is a committee',
    ],
    uncertaintyNotes: [
      'The payer is unidentified; this module models paperwork, not a party.',
      'Drop and print dates are inferred from delivery reporting, not from postage records.',
      'Motive priors are the compiler\'s, not derived from evidence; they sum to 1.0 by construction, which is itself an artificial constraint.',
      'A non-US payer with no filing obligation is unmodelled beyond acknowledgement.',
      'The "earned media" leg is an observation about salience, not about payment.',
    ],
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.US_HISTORY, CommonUniverseIds.US_GOVERNMENT],
    },
    references: [
      {
        type: 'DOCUMENTS',
        targetUniverseId: EXCERPT_ID,
        confidence: 0.9,
        description:
          'The earned-media leg of the content hypothesis: the mailer produced a nationally ' +
          'syndicated reading and a response video within days.',
        evidence: [
          'The segment is hostile and unpaid, so it evidences salience, not a purchase',
        ],
      },
    ],
  },
} as unknown as Universe;

/** All universes this draft owns. */
export const texasMailerPayerLedgerUniverses: Universe[] = [texasMailerPayerLedgerUniverse];
