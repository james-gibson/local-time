import {
  KeyframeType,
  TimePrecision,
  Universe,
  UniverseType,
} from '../../../../core/types';
import { CommonUniverseIds } from '../../../../core/common-universe-ids';
import { createHistoricalUniverseId } from '../../../../core/universe-ids';

/**
 * "Discovery Reach" — what the two live proceedings can and cannot compel,
 * modelled per channel rather than per fact.
 *
 * THE POINT OF THIS UNIVERSE: it is a map of *access*, not of evidence. A keyframe
 * here asserts that a record class is reachable by a named mechanism within a stated
 * window — never that the record exists or says anything. Reach is documented law;
 * contents are unknown. Do not let a high-certainty keyframe be read as a finding.
 *
 * STRUCTURAL ASYMMETRY (the module's thesis, 2026-10-23, certainty 0.8):
 *   civil (Rule 202)  -> vendor layer, agent layer, LLC internal records. Wide.
 *   civil (Rule 202)  -> IRS records. ZERO. §6103 does not bend for private litigants.
 *   criminal (DA)     -> everything civil reaches, plus tax filings, plus bank rails.
 * The tax documentation the payer was obliged to create is therefore discoverable
 * only by the state — which is why the criminal referral matters more than the
 * petition for the money question specifically.
 *
 * Cultural Significance: 0.30 — procedural model, no independent cultural weight.
 * Reality Relation: interpretation, fictionalizationDegree 0.35 — the mechanisms are
 * documented; the target universe and every anticipated record are not.
 *
 * Research Sources:
 * - Tex. R. Civ. P. 202.1, 202.2, 202.5 [^2]
 * - In re Elliott line: courts must "strictly limit and carefully supervise" [^3]
 * - Rule 202 misuse / fishing-expedition limits [^4][^8]
 * - One Big Beautiful Bill Act, P.L. 119-21 [^1] [^6]
 * - OBBBA charitable provisions effective TY2026 [^7][^5]
 * - Case reporting carried forward from the payer-ledger module [^f081b0][^a5a51b]
 *
 * Hierarchical Context: US_HISTORY -> US_GOVERNMENT. Drawn against the payer-ledger
 * module of the same thread (not landed; see `metadata.threadSiblings`) and against the
 * on-air segment that made the mailing public, whose transcription record it documents
 * as one reachable-but-shielded channel, not as a target.
 *
 * LANDED WITH THE FAMILY (james-gibson/local-time#200). This is one of seven sibling
 * universes committed together: production_value, dominated_choice, preference_vector,
 * solo_limit, discovery_reach, ambiguity_tolerant_form and this one. The rest of the
 * #200 thread — payer_ledger, shell_hypothesis, operator_profile, stationarity_domicile,
 * five_postulates, automation_stack, residue_and_reach, beck_plane, proper_timelines,
 * kpi_and_signature, trace_and_vendor, api_and_price, expertise_axis, mcp_threshold —
 * is not landed, so edges to it are recorded in `metadata.threadSiblings` instead of
 * being declared as references: a target no module owns is a link the graph cannot
 * resolve, and a dangling edge looks like evidence of a module that does not exist.

 */

const UNIVERSE_ID = createHistoricalUniverseId(
  'texas_mailer_discovery_reach',
  '2026',
);

const PAYER_LEDGER_ID = 'history:texas_mailer_payer_ledger:2026';
const MAILER_EVENT_ID = 'history:texas_trans_student_mailer_controversy:2026';
const BECK_EXCERPT_ID = 'series:beck_pamphlet_transcript:2026';

/* Clock: calendar dates, UTC midnight. m is 1-based here; Date.UTC is 0-based. */
const D = (y: number, m: number, d: number): bigint =>
  BigInt(Date.UTC(y, m - 1, d)) * 1_000_000n;

const ENACTMENT = D(2025, 7, 4);      // OBBBA signed; tax frame predates the scheme
const FORMATION = D(2026, 9, 2);
const DROP = D(2026, 10, 18);
const EXPOSURE = D(2026, 10, 20);
const PETITION = D(2026, 10, 22);     // Rule 202 filed; DA referral same day
const HEARING = D(2026, 10, 29);      // anticipated; unconfirmed
const AGENT_CUT = D(2026, 10, 23);
const HORIZON = D(2026, 11, 3);

export const texasMailerDiscoveryReachUniverse = {
  universeId: UNIVERSE_ID,
  type: UniverseType.HISTORICAL_EVENT,

  identifiers: {
    primary: 'history:texas_mailer_discovery_reach:2026',
    aliases: [
      'what Rule 202 can reach in the mailer case',
      'mailer payer discovery map',
      'TENT petition reach model',
    ],
  },

  realityRelation: {
    type: 'interpretation',
    fictionalizationDegree: 0.35,

    realityAnchors: [
      {
        realEventId: MAILER_EVENT_ID,
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'Rule 202 petition filed Travis County 22 Oct 2026 [^a5a51b#48-54]',
          'DA criminal probe opened same day, possible forgery [^f081b0#190]',
          'Bulk permit held by Three Z Printing, Teutopolis IL [^a5a51b#62-66]',
          'Agent termination 23 Oct 2026 [^a5a51b#68]',
        ],
      },
      {
        realEventId: 'analysis:texas_mailer_discovery_channel_model:2026',
        relationshipType: 'interprets',
        confidence: 0.8,
        evidence: [
          'Channel reach derived from rule text and case law, not from any filed subpoena',
          'No subpoena returns exist; every reach claim is prospective',
          'Asymmetry claim (§6103 bars civil access to tax records) is statutory, high confidence',
        ],
      },
      {
        realEventId: PAYER_LEDGER_ID,
        relationshipType: 'derives_from',
        confidence: 1.0,
        evidence: [
          'Same payer, same artefact inventory; this module tests which of those artefacts are reachable',
        ],
      },
    ],
  },

  attribution: {
    public_domain: false,
    sources: [
      'Tex. R. Civ. P. 202 [^2]',
      'In re Elliott / Rule 202 supervision standard [^3]',
      'P.L. 119-21 business provisions [^1]',
      'P.L. 119-21 charitable provisions [^7]',
      'FOX 26 Houston [^f081b0]; CBS News Texas [^a5a51b]',
    ],
    citations_required: true,
    usage_restrictions: [
      'Reach is not possession. Nothing here implies a record has been produced, subpoenaed, or exists.',
      'Do not cite as legal advice; the procedural claims are a lay reading of the rules.',
      'Out-of-state reach (Illinois permit holder, Wyoming agent) is flagged LOW certainty and must not be presented as settled.',
      'The §6103 asymmetry claim is about civil litigants; it does not describe what a grand jury can obtain.',
    ],
  },

  layers: [
    {
      /* Documented: the rules, the filings, the statutory frame. */
      layerId: 'documented',
      type: 'primary',
      epochs: {
        statutory_frame: {
          epochId: 'history:mailer_discovery:statute',
          startTime: ENACTMENT,
          endTime: FORMATION,
          precision: TimePrecision.DAY,
          description:
            'P.L. 119-21 in force well before the LLC existed; the tax frame is pre-existing background, not a response to anything here.',
        },
        civil_window: {
          epochId: 'history:mailer_discovery:civil',
          startTime: PETITION,
          endTime: HORIZON,
          precision: TimePrecision.DAY,
          description:
            'Rule 202 petition through anticipated hearing and depositions; no suit on file.',
        },
        criminal_window: {
          epochId: 'history:mailer_discovery:criminal',
          startTime: PETITION,
          endTime: HORIZON,
          precision: TimePrecision.DAY,
          description:
            'DA investigation; grand jury powers, no notice requirement, no adversary.',
        },
      },
    },

    {
      /* The reach map itself: prospective, mechanism-keyed. */
      layerId: 'reach_map',
      type: 'reconstruction',
      reality_correspondence: {
        to: 'analysis:texas_mailer_discovery_channel_model:2026',
        accuracy: 0.55,
        deviations: [
          'Assumes the petition survives the "strictly limit and carefully supervise" standard; it may be narrowed or denied [^3].',
          'Assumes the LLC has not dissolved; dissolution would push targets to the agent and the bank.',
          'Out-of-state compulsion (IL, WY) modelled as a barrier, but the exact mechanism is stated with low certainty.',
          'Assumes the payer used ordinary commercial vendors; cash or informal arrangements would empty most channels.',
        ],
      },
      epochs: {
        reach_span: {
          epochId: 'history:mailer_discovery:reach',
          startTime: PETITION,
          endTime: HORIZON,
          precision: TimePrecision.DAY,
          description: 'Coextensive with the civil window by construction.',
        },
      },
    },

    {
      /* OBBBA frame: statute-anchored, mostly negative findings. */
      layerId: 'obbba_frame',
      type: 'documented_reference',
      reality_correspondence: {
        to: 'statute:one_big_beautiful_bill_act_2025',
        accuracy: 1.0,
        deviations: [
          'No deviation: statutory text and effective dates are public.',
          'Interpretation of "does this create a motive" is the compiler\'s and is carried in metadata, not here.',
        ],
      },
      epochs: {
        effective_tax_years: {
          epochId: 'history:mailer_discovery:obbba',
          startTime: ENACTMENT,
          endTime: HORIZON,
          precision: TimePrecision.DAY,
          description:
            'Most business provisions apply to tax years beginning after 31 Dec 2024; charitable changes to years beginning after 31 Dec 2025 [^7].',
        },
      },
    },
  ],

  temporalStructure: {
    segments: [
      { id: 'obbba_enacted', start: ENACTMENT, end: D(2026, 1, 1), type: 'statutory_period', status: 'active' },
      { id: 'pre_formation_gap', start: D(2026, 1, 1), end: FORMATION, type: 'phase', status: 'suspended' },
      { id: 'formation_to_drop', start: FORMATION, end: DROP, type: 'phase', status: 'suspended' },
      { id: 'drop_to_exposure', start: DROP, end: EXPOSURE, type: 'phase', status: 'active' },
      { id: 'press_window', start: EXPOSURE, end: PETITION, type: 'phase', status: 'active' },
      { id: 'petition_filed', start: PETITION, end: AGENT_CUT, type: 'legal_period', status: 'active' },
      { id: 'agent_unwinding', start: AGENT_CUT, end: HEARING, type: 'phase', status: 'active' },
      { id: 'hearing_window', start: HEARING, end: HORIZON, type: 'legal_period', status: 'inactive' },
    ],

    keyframes: [
      /* ---------- statutory frame: what OBBBA actually changed ---------- */
      {
        id: 'obbba_199a_permanent',
        timestamp: ENACTMENT,
        significance: 0.75,
        certainty: 1.0,
        tags: ['statute', 'obbba', '199a', 'pass_through'],
        type: KeyframeType.LEGISLATION,
        description:
          '§199A made permanent indefinitely; phase-in range widened to $75,000 single / $150,000 joint, plus a $400 minimum deduction floor [^6cc4d8#25][^6]. Makes a pass-through wrapper a durable choice rather than a 2025 deadline — but consulting and media businesses are SSTBs, so the deduction phases out at higher income [^6cc4d8#21].',
      },
      {
        id: 'obbba_bonus_and_179',
        timestamp: ENACTMENT,
        significance: 0.5,
        certainty: 1.0,
        tags: ['statute', 'obbba', '168k', '179', 'irrelevant_to_mailer'],
        type: KeyframeType.LEGISLATION,
        description:
          '100% bonus depreciation permanent for property acquired after 19 Jan 2025; §179 cap raised to $2.5M with a $4M phase-out [^6cc4d8#71][^6cc4d8#97]. Bears on a print vendor buying a press, not on a customer buying a print run — paper and postage are current expenses and were never depreciable.',
      },
      {
        id: 'obbba_461l_permanent',
        timestamp: ENACTMENT,
        significance: 0.7,
        certainty: 1.0,
        tags: ['statute', 'obbba', '461l', 'loss_limitation', 'caps_the_motive'],
        type: KeyframeType.LEGISLATION,
        description:
          'Excess business loss limitation made permanent, unchanged at roughly $313k/$626k for 2025 and indexed [^1]. This is the provision that most directly limits a fabricated-expense strategy: an individual owner cannot use a manufactured loss to shelter non-business income beyond the cap.',
      },
      {
        id: 'obbba_charitable_floor',
        timestamp: D(2026, 1, 1),
        significance: 0.65,
        certainty: 1.0,
        tags: ['statute', 'obbba', 'charitable', '2026', 'removes_a_motive'],
        type: KeyframeType.LEGISLATION,
        description:
          'From TY2026, itemizers deduct charitable gifts only above a 0.5%-of-AGI floor, and non-itemizers get a $1,000/$2,000 below-the-line cash deduction [^7][^5]. A 2026 anonymous gift routed through a nonprofit is worth strictly less than the same gift in 2025 — and a payment to an LLC was never deductible as a gift in any year.',
      },

      /* ---------- civil channel ---------- */
      {
        id: 'rule202_scope',
        timestamp: PETITION,
        significance: 0.95,
        certainty: 0.95,
        tags: ['legal', 'rule_202', 'scope', 'civil', 'key_mechanism'],
        type: KeyframeType.RULING,
        description:
          'Rule 202 requires a verified petition on oath stating the substance of expected testimony and the identity of the deponent, notice, and a court order; the authorised scope is "the same as if the anticipated suit or potential claim had been filed" [^2].',
      },
      {
        id: 'rule202_limits',
        timestamp: PETITION,
        significance: 0.9,
        certainty: 0.9,
        tags: ['legal', 'rule_202', 'limits', 'abuse'],
        type: KeyframeType.RULING,
        description:
          'Courts must "strictly limit and carefully supervise" pre-suit discovery to prevent abuse [^3]; petitions seeking to investigate whether any claim exists, or to bypass immunity, are refused [^4][^8]. TENT needs a pleaded claim, not curiosity — the petition names a tortious misuse of its identity, which is what gets it past this gate.',
      },
      {
        id: 'reach_print_vendor',
        timestamp: PETITION,
        significance: 0.95,
        certainty: 0.85,
        tags: ['reach', 'vendor', 'print', 'high_value'],
        description:
          'A non-party subpoena reaches the print vendor\'s job ticket and invoice: quantity, stock, finish, billing contact, and the address the proof was sent to. Highest-value single channel for identifying the buyer.',
      },
      {
        id: 'reach_permit_holder',
        timestamp: PETITION,
        significance: 0.95,
        certainty: 0.8,
        tags: ['reach', 'usps', 'permit', 'postage', 'key_artifact'],
        description:
          'USPS identified the bulk permit holder as Three Z Printing of Teutopolis, Illinois, which may have merely lent the permit for discounted postage [^a5a51b#62-66]. The permit holder necessarily knows who submitted the mailing — but it is an Illinois non-party, so compulsion runs through an out-of-state mechanism whose exact form is UNCERTAIN (0.5): a commission or letters rogatory rather than a direct Texas subpoena.',
      },
      {
        id: 'reach_data_vendor',
        timestamp: PETITION,
        significance: 0.9,
        certainty: 0.6,
        tags: ['reach', 'data', 'privacy', 'minors'],
        description:
          'Addresses styled "Students Of The [Family Name] Family" require a named-household file with implied minors [^f081b0#217]; the DA has said publicly he wants to know where the addresses came from [^f081b0#233]. Reachable in principle, but the vendor is unidentified and may be a broker of brokers.',
      },
      {
        id: 'reach_registered_agent',
        timestamp: PETITION,
        significance: 0.85,
        certainty: 0.85,
        tags: ['reach', 'agent', 'wyoming'],
        description:
          'The agent holds the engagement file, the organiser\'s identity and the formation instructions. Note the timing: the agent moved to cut ties on 23 Oct [^a5a51b#68] — a non-party with no continuing relationship has no commercial reason to resist, and every reason to produce.',
      },
      {
        id: 'reach_llc_internal_records',
        timestamp: PETITION,
        significance: 0.9,
        certainty: 0.7,
        tags: ['reach', 'llc', 'records', 'limits'],
        description:
          'Wyoming filings do not publish members, so the operating agreement, the bank signature card and the EIN application are the real prize — and all three sit with the entity or its bank, not with any third party. If the entity does not appear, these are the records the civil channel most likely never reaches.',
      },

      /* ---------- the wall ---------- */
      {
        id: 'irs_wall_6103',
        timestamp: PETITION,
        significance: 1.0,
        certainty: 0.9,
        tags: ['analysis', 'limit', '6103', 'tax', 'key_finding', 'asymmetry'],
        type: KeyframeType.LEGISLATION,
        description:
          'The decisive limit: §6103 confidentiality bars disclosure of returns and return information to civil litigants. The 1099-NEC the payer owes any unincorporated vendor paid $600+, and the return on which the mailing was expensed, are therefore invisible to TENT at any price. Only a grand jury reaches them. This inverts the module\'s expectation: the best evidence of commercial motive is quarantined in the one forum the plaintiff cannot access.',
      },
      {
        id: 'shield_law',
        timestamp: PETITION,
        significance: 0.6,
        certainty: 0.6,
        tags: ['limit', 'journalism', 'privilege', 'beck'],
        description:
          'The Beck segment is a reachable channel in theory and a shielded one in practice: Texas\'s journalist shield (Code Crim. Proc. art. 38.11) gives a qualified privilege over unpublished work product, so the tape and the booking correspondence behind a syndicated reading are not automatically obtainable. Flags LOW certainty: the privilege is qualified and yields to a showing of relevance and exhaustion.',
      },
      {
        id: 'criminal_channel_opens',
        timestamp: PETITION,
        significance: 1.0,
        certainty: 0.9,
        tags: ['legal', 'criminal', 'grand_jury', 'breadth'],
        type: KeyframeType.MILESTONE,
        description:
          'The DA\'s investigation — opened the same day, on possible forgery [^f081b0#190] — carries grand jury subpoena power: no notice to targets, no adversary at the return, no 15-day clock, and it reaches bank rails, the postage statement and the tax filings that Rule 202 cannot touch.',
      },
      {
        id: 'postage_statement_reconciled',
        timestamp: HEARING,
        significance: 0.85,
        certainty: 0.5,
        tags: ['analysis', 'forensic', 'postage', 'falsifier', 'hypothesis'],
        description:
          'Anticipated result if the permit holder produces: a PS Form 3602-class postage statement fixing piece count and date. Any invoice that does not reconcile to it is false. This is the module\'s one testable prediction about laundering, and it resolves inside the civil window, not the tax one.',
      },
      {
        id: 'tax_motive_collapses',
        timestamp: HEARING,
        significance: 0.9,
        certainty: 0.7,
        tags: ['analysis', 'conclusion', 'obbba', 'no_motive'],
        description:
          'The OBBBA connection, stated as a finding: permanence of §199A, §168(k), §179 and the §163(j) EBITDA addback all raise the value of capital and of net income — none raises the value of a one-off cash print buy, and §162(e) denies any deduction for political advertising outright. Meanwhile §461(l) caps what a manufactured loss can shelter and the 2026 charitable floor lowers the value of an anonymous gift [^7]. No provision of P.L. 119-21 supplies a motive for this structure; the statute makes the plausible tax motives weaker in 2026 than in 2025.',
      },
    ],

    windows: { strategy: 'phase_based' },
  },

  metadata: {
    canonicalName: 'Discovery Reach: the 2026 Texas mailer proceedings, per channel',
    creators: ['Compiled procedural analysis; no author of record'],
    released: new Date('2026-10-26T00:00:00Z'),
    cultural_significance: 0.3,
    platform: 'Local Time universe system',
    externalId: 'texas_mailer_discovery_reach_2026',
    contentType: 'procedural reach model + statutory cross-reference',
    proceedings: {
      civil: 'TENT, Rule 202 petition, Travis County, filed 22 Oct 2026 [^a5a51b#48-54]',
      criminal: 'Ward/Reeves/Loving DA, possible forgery, opened 22 Oct 2026 [^f081b0#190]',
      hearing: 'anticipated on or about 29 Oct 2026 — UNCONFIRMED',
    },
    obbbaProvisions: {
      '199A': 'permanent; phase-in $75k/$150k; $400 floor [^6cc4d8#25]',
      '168(k)': '100% permanent, property after 19 Jan 2025 [^6cc4d8#71]',
      '179': '$2.5M cap, $4M phase-out [^6cc4d8#97]',
      '461(l)': 'permanent, limits unchanged [^6cc4d8#41]',
      '163(j)': 'EBITDA addback restored, permanent [^6cc4d8#57]',
      '170': '0.5% AGI floor; $1k/$2k non-itemizer, from TY2026 [^7][^5]',
      'QPP': 'new §168 special allowance; production activities only [^6cc4d8#77]',
    },
    motiveAssessment: {
      'H1_content_acquisition': 'unaffected by OBBBA; no provision bears on buying editorial material',
      'H2_deductible_advertising': 'STRENGTHENED AS A NEGATIVE: §162(e) bars deduction for political advertising; §162 substantiation unchanged',
      'H3_laundered_placement': 'WEAKENED: §461(l) caps loss shelter; postage statements cap invoice inflation',
      'H4_political_deniability': 'unaffected by OBBBA; remains the best fit',
    },
    uncertaintyNotes: [
      'Every reach claim is prospective; no subpoena has returned anything as of 2026-10-26.',
      'Out-of-state compulsion against the Illinois permit holder and the Wyoming agent is the weakest link (0.5-0.6).',
      '§6103 asymmetry is stated at 0.9: confident in the statute, less so about any specific exception a court might carve.',
      'Shield-law analysis is 0.6 and jurisdiction-specific; a federal forum would change it.',
      'Hearing date is inferred from ordinary Rule 202 scheduling practice, not from a docket entry.',
    ],
  },

  connections: {
    natural: {
      parentUniverses: [
        CommonUniverseIds.US_HISTORY,
        CommonUniverseIds.US_GOVERNMENT,
      ],
    },
    references: [
      {
        type: 'DOCUMENTS',
        targetUniverseId: 'history:texas_mailer_payer_ledger:2026',
        confidence: 0.9,
        description:
          'The ledger this reach map is drawn against: the artefacts it says a payer must ' +
          'have generated are what the channels below can reach. Landed with #221, so the ' +
          'note that used to stand here is now an edge.',
      },
      {
        type: 'DOCUMENTS',
        targetUniverseId: BECK_EXCERPT_ID,
        confidence: 0.9,
        description:
          'The on-air segment that made the mailing public is the earliest reachable account of ' +
          'it; the transcript record is the corpus copy.',
      },
    ],
  },
} as unknown as Universe;

/** All universes derived from james-gibson/local-time#200. */
export const texasMailerDiscoveryReachUniverses: Universe[] = [texasMailerDiscoveryReachUniverse];
