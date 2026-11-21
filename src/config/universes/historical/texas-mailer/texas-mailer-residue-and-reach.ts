import {
  KeyframeType,
  TimePrecision,
  Universe,
  UniverseType,
} from '../../../../core/types';
import { CommonUniverseIds } from '../../../../core/common-universe-ids';
import { createHistoricalUniverseId } from '../../../../core/universe-ids';

/**
 * "Residue and Reach" — fourth-round test.
 *
 * P6a-REV (LLM leaves recoverable residue) -> UPHELD IN SPLIT FORM.
 *       The "plan appears online" half is WEAK: people publish workflows, not
 *       operations, and generic text has no discriminating power. The "residue in
 *       output" half is STRONG and now testable across TWO corpora, because the
 *       campaign produced both a flyer and SMS traffic [^16]. Cross-channel
 *       verbatim repetition is not producible by house style.
 *       Relocated from "open web" to THREE CUSTODIANS: model provider, printer,
 *       production file.
 *
 * P9  (the printer is not a "woke" company) -> CONFIRMED WITH A NUMBER, and
 *       INERT as an explanation. Owners gave ~$662k federally since 2012, all
 *       Republican, mostly Trump committees [^17][^18]; Musk PAC client
 *       [^19]. But political mail is a product line [^14], so ideology
 *       adds nothing to why the job was taken. It changes cooperation incentives.
 *
 * P10 (Texas cannot reach Wyoming; content lawful; only the US has standing)
 *       -> REFUTED on two of three limbs, CONFIRMED on the third.
 *       Wyoming codified UIDDA at Rule 28(c) [^3][^4]; Texas has the
 *       reciprocal machinery [^20]; limits are travel and delivery, not access
 *       [^5]. A private suit is already filed on appropriation [^15].
 *       Content is genuinely near-unregulated: disclaimer duty attaches only to
 *       express advocacy [^21][^22]; the deepfake statute is video-only
 *       [^9][^11].
 *
 * Cultural Significance: 0.25 — methodological instrument.
 * Reality Relation: interpretation, fictionalizationDegree 0.4.
 *
 * Hierarchical Context: US_HISTORY -> US_GOVERNMENT. derives_from automation_stack
 * and discovery_reach. Supersedes the "no one can do anything" framing carried in
 * the earlier reach module, and the open-web reading of P6a.
 */

const UNIVERSE_ID = createHistoricalUniverseId(
  'texas_mailer_residue_and_reach',
  '2026',
);

const AUTOMATION_ID = 'history:texas_mailer_automation_stack:2026';
const DISCOVERY_ID = 'history:texas_mailer_discovery_reach:2026';
const STATIONARITY_ID = 'history:texas_mailer_stationarity_domicile:2026';

/* Clock: UTC midnight; m is 1-based. */
const D = (y: number, m: number, d: number): bigint =>
  BigInt(Date.UTC(y, m - 1, d)) * 1_000_000n;

const FORMATION = D(2026, 9, 2);
const DROP = D(2026, 10, 18);
const EXPOSURE = D(2026, 10, 20);
const SUIT_FILED = D(2026, 10, 22);
const AGENT_RESIGNS = D(2026, 10, 23);
const DONATIONS_REPORTED = D(2026, 10, 25);
const DECISION_DATE = D(2026, 10, 26);

export const texasMailerResidueAndReachUniverse = {
  universeId: UNIVERSE_ID,
  type: UniverseType.HISTORICAL_EVENT,

  identifiers: {
    primary: 'history:texas_mailer_residue_and_reach:2026',
    aliases: [
      'does an LLM leave residue in the mailer',
      'can Texas subpoena a Wyoming LLC',
      'who actually has standing over the mailer',
      'is the printer ideologically aligned',
    ],
  },

  realityRelation: {
    type: 'interpretation',
    fictionalizationDegree: 0.4,

    realityAnchors: [
      {
        realEventId: 'history:texas_trans_student_mailer_controversy:2026',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'LLC formed in Wyoming in September 2026 [^12]',
          'TENT states its name and images were used without permission [^15]',
          'Mailers accompanied by text messages [^16]',
          'Commercial registered agent resigned [^25]',
        ],
      },
      {
        realEventId: 'org:three_z_printing:1978',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'Founded 1978, Teutopolis IL, family-owned [^8]',
          'Political mailings listed among services [^14]',
          'Owners ~$662k federal donations since 2012, Republican [^17][^18]',
          'Named as permit holder by USPS reporting [^26]',
        ],
      },
      {
        realEventId: 'analysis:texas_mailer_reach_test:2026',
        relationshipType: 'reinterprets',
        confidence: 0.55,
        evidence: [
          'Jurisdictional analysis is the compiler\'s; no court has ruled on jurisdiction over this LLC',
          'The stylometric test is specified but has not been run',
          'No allegation is made that any donation or permit use was unlawful',
        ],
      },
    ],
  },

  attribution: {
    public_domain: false,
    sources: [
      'Case reporting [^15][^12][^13]',
      'Printer record [^8][^14][^26]',
      'FEC-derived donation reporting [^17][^18][^19]',
      'UIDDA [^3][^4][^5][^20]',
      'Election law [^21][^22][^9][^11]; federal [^1][^6]',
    ],
    citations_required: true,
    usage_restrictions: [
      'Do not present the printer\'s donations as evidence of wrongdoing; they are lawful, disclosed, and irrelevant to the content of any job.',
      'Do not cite P6a as established by any published post; no such post has been identified.',
      'The jurisdiction analysis is prediction, not holding.',
    ],
  },

  layers: [
    {
      layerId: 'residue_surface',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:llm_residue_test:2026',
        accuracy: 0.45,
        deviations: [
          'Specifies tests that have not been run; nothing here is a finding about the artifact.',
          'Assumes the SMS and flyer share an author, which is the very thing to be tested.',
          'Cannot distinguish LLM residue from a reused template, a house style, or a careful imitator.',
        ],
      },
      epochs: {
        residue_window: {
          epochId: 'history:residue:window',
          startTime: FORMATION,
          endTime: DECISION_DATE,
          precision: TimePrecision.DAY,
          description: 'Window in which the production file and vendor correspondence still exist.',
        },
      },
    },

    {
      layerId: 'jurisdiction_matrix',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:interstate_reach:2026',
        accuracy: 0.85,
        deviations: [
          'Describes mechanisms available in the abstract; no petition has been filed in Wyoming.',
          'Treats the LLC as subject to Texas jurisdiction, which is the compiler\'s prediction and has not been tested.',
        ],
      },
      epochs: {
        reach_vintage: {
          epochId: 'history:residue:reach',
          startTime: SUIT_FILED,
          endTime: DECISION_DATE,
          precision: TimePrecision.DAY,
          description: 'Rules as they stood once litigation commenced.',
        },
      },
    },

    {
      layerId: 'postulate_space',
      type: 'subjective',
      reality_correspondence: {
        to: 'analysis:texas_mailer_postulate_test_round4:2026',
        accuracy: 0.35,
        deviations: [
          'P9 is confirmed on facts and then discounted on relevance; that split is a judgement.',
          'P10\'s refutation assumes a Texas plaintiff can establish jurisdiction over the LLC, which is untested.',
        ],
      },
      epochs: {
        test_span: {
          epochId: 'history:residue:test',
          startTime: EXPOSURE,
          endTime: DECISION_DATE,
          precision: TimePrecision.DAY,
        },
      },
    },
  ],

  temporalStructure: {
    segments: [
      { id: 'assembly', start: FORMATION, end: DROP, type: 'phase', status: 'active' },
      { id: 'circulation', start: DROP, end: EXPOSURE, type: 'phase', status: 'active' },
      { id: 'litigation', start: SUIT_FILED, end: DECISION_DATE, type: 'legal_period', status: 'active' },
      { id: 'preservation_window', start: DECISION_DATE, end: D(2027, 1, 1), type: 'legal_period', status: 'inactive' },
    ],

    keyframes: [
      /* ---------------- P6a revised ---------------- */
      {
        id: 'p6a_split_into_two_claims',
        timestamp: DECISION_DATE,
        significance: 0.95,
        certainty: 0.85,
        tags: ['P6a', 'revision', 'epistemics', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The postulate contains two claims of unequal value. "The plan was posted" is weak: practitioners publish workflows, not operations, and generic text matches thousands of authors. "The output carries residue" is strong, because residue is a property of the artifact rather than of somebody\'s posting habits. Only the second is worth a test.',
      },
      {
        id: 'p6a_two_corpora',
        timestamp: DROP,
        significance: 1.0,
        certainty: 0.8,
        tags: ['P6a', 'forensics', 'corpora', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The decisive detail is that the campaign emitted text in two channels — printed flyer and SMS [^16]. Cross-channel verbatim repetition of distinctive phrasing is not producible by a printer\'s house style, and is unlikely to be produced by a human writing twice for two media. It is the highest-value stylometric test available and it needs no subpoena to start.',
      },
      {
        id: 'p6a_relocated_to_custodians',
        timestamp: DECISION_DATE,
        significance: 0.95,
        certainty: 0.8,
        tags: ['P6a', 'custodian', 'discovery', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The prompt is not on the open web. It is held by three custodians: the model provider (account, subscriber data, retention-window logs, reachable by email/card/phone hash from the formation filing), the printer (the request, the thread, the art files), and the production file itself. The correct ticket language is "subpoena the custodian", not "search for the post".',
      },
      {
        id: 'p6a_discrimination_problem',
        timestamp: DECISION_DATE,
        significance: 0.85,
        certainty: 0.75,
        tags: ['P6a', 'falsifier', 'limits'],
        type: KeyframeType.MILESTONE,
        description:
          'The honest limit: repetition is equally consistent with a template, a house style, or a copywriter imitating a style. What discriminates is LLM-typical over-regularity — uniform sentence length, parallel tricolon, "not just X but Y", em-dash-then-colon constructions — combined with cross-channel consistency. Absent both, residue is suggestive and not probative.',
      },

      /* ---------------- P9 ---------------- */
      {
        id: 'p9_ideology_confirmed',
        timestamp: DONATIONS_REPORTED,
        significance: 0.9,
        certainty: 0.9,
        tags: ['P9', 'printer', 'confirmed', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'Confirmed on the facts: owners of Three Z Printing have given roughly $662,000 in federal donations since 2012, all to Republicans and mostly to Trump committees [^17][^18]; the firm has been used by Musk\'s PAC [^19]; sole owner Bill Zerrusen, with his son Matthew in leadership [^7]. The postulate is correct.',
      },
      {
        id: 'p9_ideology_is_inert',
        timestamp: DECISION_DATE,
        significance: 0.95,
        certainty: 0.8,
        tags: ['P9', 'irrelevance', 'product_line', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'And nearly inert as an explanation: political mailings are a listed service [^14]. A commercial printer prices content rather than screening it, so alignment adds nothing to why the job was accepted. Ideology explains acceptance only if the firm had ever refused a job, and there is no evidence of that in either direction.',
      },
      {
        id: 'p9_what_it_actually_changes',
        timestamp: DECISION_DATE,
        significance: 0.9,
        certainty: 0.75,
        tags: ['P9', 'cooperation', 'leverage', 'redirect'],
        type: KeyframeType.MILESTONE,
        description:
          'What the donor profile does change: a family firm with a public name, a 1978 founding [^8], and a Guinness-record item on its own news page [^2] has maximum incentive to be seen cooperating once named as permit holder [^26]. It becomes the most cooperative custodian in the chain, and its disclosure obligations run to its own counsel, not to the operator.',
      },
      {
        id: 'p9_fec_is_a_free_dataset',
        timestamp: DECISION_DATE,
        significance: 0.75,
        certainty: 0.8,
        tags: ['P9', 'fec', 'data', 'method'],
        type: KeyframeType.MILESTONE,
        description:
          'Method note: FEC contribution data is public and machine-readable. Any relationship between the printer and a vendor, consultant or committee in this chain can be tested by joining public filings, with no subpoena and no court. That is the only free cross-check in the file.',
      },

      /* ---------------- P10 ---------------- */
      {
        id: 'p10_uid_uda_reaches_wyoming',
        timestamp: DECISION_DATE,
        significance: 1.0,
        certainty: 0.9,
        tags: ['P10', 'jurisdiction', 'refuted', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'Refuted on the first limb: Wyoming has codified the Uniform Interstate Depositions and Discovery Act at Rule 28(c), under which a foreign subpoena is submitted to a Wyoming clerk who issues a Wyoming subpoena [^3][^4]. Texas has reciprocal machinery and its Supreme Court has embraced the interstate act [^20]. Texas can reach Wyoming documents.',
      },
      {
        id: 'p10_uid_uda_limits_are_narrow',
        timestamp: DECISION_DATE,
        significance: 0.8,
        certainty: 0.8,
        tags: ['P10', 'jurisdiction', 'limits'],
        type: KeyframeType.MILESTONE,
        description:
          'The genuine limits: a UIDDA subpoena cannot compel a Wyoming deponent to travel to Texas, and cannot force the witness to send production to Texas [^5]. For documents this is a formality. For testimony it means travelling to Wyoming or deposing by remote means under the issuing court\'s order.',
      },
      {
        id: 'p10_party_not_subpoena',
        timestamp: DECISION_DATE,
        significance: 0.95,
        certainty: 0.8,
        tags: ['P10', 'jurisdiction', 'party', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The deeper correction: a party is not subpoenaed. If a Texas court has personal jurisdiction over the LLC — and an intentional tort aimed at Texas residents supports it, because jurisdiction follows the conduct rather than the state of registration — the LLC answers by court order. Formation in Wyoming delays identification; it does not defeat jurisdiction.',
      },
      {
        id: 'p10_content_law_is_narrow',
        timestamp: DECISION_DATE,
        significance: 1.0,
        certainty: 0.9,
        tags: ['P10', 'confirmed', 'election_law', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'Confirmed, and this is the postulate\'s solid core: Texas requires a disclaimer only in political advertising containing express advocacy [^21][^22][^10][^27]. A resource guide naming no candidate, measure or election is very unlikely to qualify. The deepfake statute is a 2019 law limited to video within 30 days of an election with intent to injure a candidate [^9][^11][^23] — print falls outside it entirely.',
      },
      {
        id: 'p10_private_standing_exists',
        timestamp: SUIT_FILED,
        significance: 1.0,
        certainty: 0.9,
        tags: ['P10', 'standing', 'refuted', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'Refuted on the third limb: a suit is already filed, and its theory is appropriation rather than speech — TENT states its name and images were used without permission [^15]. That is a private plaintiff with standing on a claim the First Amendment does not reach. The Texas AG holds separate Election Code and consumer-protection authority, and the Postal Inspection Service has jurisdiction over permit use irrespective of content.',
      },
      {
        id: 'p10_federal_hook_is_narrow',
        timestamp: DECISION_DATE,
        significance: 0.9,
        certainty: 0.8,
        tags: ['P10', 'federal', 'voter_intimidation', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The federal branch is the weakest, not the strongest: 52 U.S.C. §10307(b) reaches intimidation, threats and coercion [^1][^6][^24]. A deceptive flyer that threatens nobody fits badly. "Unless it was election interference" therefore names the hardest theory to prove, while the easiest one is already in a courthouse.',
      },
      {
        id: 'p10_agent_resignation_cuts_against',
        timestamp: AGENT_RESIGNS,
        significance: 0.9,
        certainty: 0.85,
        tags: ['P10', 'service', 'agent', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The agent\'s resignation [^25] does not shield the LLC. It removes a cooperative in-state custodian and triggers substituted service on the Wyoming Secretary of State, which creates a state record and starts a clock toward default. Operationally it is the operator\'s worst decision since forming the entity.',
      },
      {
        id: 'residue_reach_verdict',
        timestamp: DECISION_DATE,
        significance: 0.95,
        certainty: 0.75,
        tags: ['analysis', 'conclusion'],
        type: KeyframeType.MILESTONE,
        description:
          'Final: P6a upheld in split form — residue testable across two corpora, prompt relocated to three custodians. P9 confirmed with a figure and discounted as explanation, retained as a cooperation and dataset lead. P10 refuted on reach and standing, confirmed on content: the speech is protected, the impersonation is not, and the impersonation is the claim already filed.',
      },
    ],

    windows: { strategy: 'phase_based' },
  },

  metadata: {
    canonicalName: 'Residue and Reach: LLM residue, printer alignment, and the limits of interstate process',
    creators: ['Compiled analysis; no author of record'],
    released: new Date('2026-10-26T00:00:00Z'),
    cultural_significance: 0.25,
    platform: 'Local Time universe system',
    externalId: 'texas_mailer_residue_and_reach_2026',
    contentType: 'forensic specification / jurisdictional analysis',
    postulateLedger: {
      'P6a-rev_llm_residue': {
        status: 'UPHELD — SPLIT',
        strongHalf: 'Cross-channel verbatim repetition between flyer and SMS [^16]',
        weakHalf: 'Published plan/workflow — no discriminating power, none found',
        custodians: 'Model provider, printer, production file',
        falsifier: 'Residue without LLM-typical over-regularity is consistent with a template',
      },
      P9_printer_not_woke: {
        status: 'CONFIRMED, THEN DISCOUNTED',
        facts: '~$662k federal donations since 2012, all Republican [^17][^18]; Musk PAC client [^19]',
        whyInert: 'Political mail is a product line [^14]; printers price, they do not screen',
        whatSurvives: 'Cooperative-custodian prediction, and FEC data as a free join',
      },
      P10_texas_cannot_reach_wyoming: {
        status: 'REFUTED ON TWO LIMBS, CONFIRMED ON ONE',
        reach: 'Wyoming Rule 28(c) UIDDA [^3][^4]; Texas reciprocal [^20]; limits are travel and delivery [^5]',
        standing: 'Private suit already filed on appropriation [^15]',
        content: 'CONFIRMED — disclaimer needs express advocacy [^21]; deepfake law is video-only [^9]',
        federal: 'Narrower than assumed — §10307(b) requires intimidation [^1][^6]',
      },
    },
    residueTestPlan: [
      'Extract verbatim n-grams (6+) from flyer body and from SMS traffic; intersect',
      'Score both corpora for sentence-length variance and parallel-structure density',
      'Flag dash/colon constructions, tricolon, and "not just X but Y" frames',
      'Compare resource-list formatting conventions against default assistant output',
      'Check production file for producer strings, XMP history, layer naming',
      'Match embedded image hashes against TENT site assets',
    ],
    reachMatrix: {
      'Wyoming LLC records': 'UIDDA subpoena to Wyoming clerk under Rule 28(c) [^3]',
      'Wyoming testimony': 'Available, but not compelled to travel to Texas [^5]',
      'Illinois printer records': 'UIDDA subpoena to Illinois; highest-value custodian',
      'The LLC as defendant': 'Court order, not subpoena — jurisdiction follows the tort',
      'Model provider account': 'Subpoena by email, card, or phone hash from the formation filing',
      'Federal criminal route': 'Requires intimidation or threats [^1]; poor fit here',
    },
    ticketDeltas: [
      'discovery_reach: replace "search for the posted prompt" with "subpoena three custodians"',
      'discovery_reach: add cross-channel stylometry as a no-subpoena first step',
      'payer_ledger: record printer donor profile as a cooperation factor, not a motive finding',
      'stationarity_domicile: note that agent resignation triggers SOS substituted service, not immunity',
      'operator_profile: the Wyoming choice bought delay in identification, not immunity from process',
    ],
    uncertaintyNotes: [
      'No stylometric test has been run; every residue claim here is a specification.',
      'Jurisdiction over the LLC is predicted, not established; no court has ruled.',
      'The printer\'s donations are lawful and irrelevant to the legality of any job it printed.',
      'Provider retention windows for consumer chatbot accounts vary and may be shorter than litigation timelines.',
      'The federal statutes cited are named to show narrowness, not to suggest a charge is available.',
    ],
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.US_HISTORY, CommonUniverseIds.US_GOVERNMENT],
    },
    references: [
      {
        type: 'DERIVES_FROM',
        targetUniverseId: AUTOMATION_ID,
        description:
          'The pipeline decomposition whose residue this module measures.',
      },
      {
        type: 'DERIVES_FROM',
        targetUniverseId: STATIONARITY_ID,
        description:
          'The dose-response reading of the domestic-enforcement gap.',
      },
      {
        type: 'SUPERSEDES',
        targetUniverseId: DISCOVERY_ID,
        description:
          'Replaces the discovery-readability claim with a residue measure.',
      },
    ],
  },
} as unknown as Universe;

/** All universes this module owns. */
export const texasMailerResidueAndReachUniverses: Universe[] = [
  texasMailerResidueAndReachUniverse,
];
