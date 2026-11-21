import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../../core/types';
import { CommonUniverseIds } from '../../../../core/common-universe-ids';
import { createHistoricalUniverseId } from '../../../../core/universe-ids';

/**
 * "Expertise Axis" — two postulates about the operator's competence, and why
 * neither locates it.
 *
 * E1  If a human knew how to minimize the steps, they have probably conducted
 *     mailers before.
 *     INFERENCE VALID, PREDICATE TOO NARROW, OBSERVABLE WRONG.
 *     - The transferable skill is vendor management under a fixed deadline —
 *       briefing a supplier, approving a proof, sequencing list/artwork/drop.
 *       Print buyers, publishers and event marketers hold it without ever having
 *       run a USPS bulk mailing. Strict reading produces false negatives on the
 *       most competent population. Revised predicate: "has run a bulk production
 *       through a third-party vendor."
 *     - Step count is fixed by the task; the expert's contribution is invisible.
 *       The mandatory burdens are named and non-optional: CASS certification for
 *       any automation price [^2]; Move Update for First-Class presort /
 *       automation and Marketing Mail [^3]; eDoc/Mail.dat for full service;
 *       a Mailer Scorecard for every letter and flat mailing [^4]. An expert
 *       does not remove CASS — they know it is the lettershop's line item. So
 *       expertise appears as a CLEAN HANDOFF, not a short list.
 *
 * E2  If the human didn't know, they would prioritize API access.
 *     INVERTED. The USPS OIG says MSPs are "an efficient and cost-effective
 *     option for organizations that have limited expertise in navigating complex
 *     Postal Service business mailing" requirements [^8]. That is the direct
 *     answer: inexperience predicts OUTSOURCING, not API adoption.
 *     The API is addressed to a different competence: "designed for developers"
 *     [^6], REST and SDKs [^1][^5], OAuth2 [^7], sandbox
 *     [^5]. Stannp and Postalytics do market the API as absorbing postal
 *     complexity — Postalytics promises integration "without becoming a direct
 *     mail expert" [^1] — but the trade is a SUBSTITUTION: technical
 *     integration burden replaces postal burden. Competence changes KIND, not
 *     quantity. A no-code bridge still needs someone who knows what the bridge is
 *     and will maintain it.
 *
 * E3  THE PAIR IS A FALSE DICHOTOMY. Two orthogonal axes (postal, software)
 *     produce four actors; the pair names three and predicts the wrong branch for
 *     two of them. The missing cell — low postal, low software — resolves to an
 *     MSP, the option neither postulate names.
 *     NOVICE'S PARADOX: the only route a true novice can use (platform managed
 *     tier) requires enough expertise to know the tier exists and to choose it.
 *
 * E4  THE DISCRIMINATING TEST IS A DOCUMENT. The Mailer Scorecard is a monthly
 *     dashboard of letter and flat activity, available to the eDoc submitter and
 *     the mail owner/mail preparer [^4]. Three-way reading:
 *       - operator's own permit/MID has history predating the drop -> E1 CONFIRMED,
 *         their name is on it;
 *       - no operator history, vendor has years of it -> experience RENTED, not
 *         held; a first-timer whose competence is vendor-sourced. Satisfies E1's
 *         conclusion while falsifying its premise;
 *       - no history anywhere -> the drop did not go through eDoc; reopen the
 *         retail-stamp branch.
 *
 * Reality Relation: interpretation, fictionalizationDegree 0.3 — postal
 * requirements and vendor positioning are documentary; the two-axis model, the
 * substitution argument and the credences are the compiler's.
 */

const UNIVERSE_ID = createHistoricalUniverseId('texas_mailer_expertise_axis', '2026');

const API_PRICE_ID = 'history:texas_mailer_api_and_price:2026';
const SOLO_ID = 'history:texas_mailer_solo_limit:2026';
const TRACE_ID = 'history:texas_mailer_trace_and_vendor:2026';
const AUTOMATION_ID = 'history:texas_mailer_automation_stack:2026';
const DISCOVERY_ID = 'history:texas_mailer_discovery_reach:2026';

const D = (y: number, m: number, d: number): bigint =>
  BigInt(Date.UTC(y, m - 1, d)) * 1_000_000n;

const DROP = D(2026, 10, 14);
const DECISION = D(2026, 10, 26);

/** Two-axis model of the operator. */
interface Actor {
  readonly id: string;
  readonly postal: 'high' | 'low';
  readonly software: 'high' | 'low';
  readonly likelyPath: string;
  readonly namedBy: 'E1' | 'E2' | 'neither';
}

const ACTORS: readonly Actor[] = [
  {
    id: 'seasoned_print_buyer',
    postal: 'high',
    software: 'low',
    likelyPath: 'Job shop; knows what to brief and what to check',
    namedBy: 'E1',
  },
  {
    id: 'developer_first_mailer',
    postal: 'low',
    software: 'high',
    likelyPath: 'API platform; postal complexity absorbed [^1]',
    namedBy: 'E2',
  },
  {
    id: 'agency_ops_lead',
    postal: 'high',
    software: 'high',
    likelyPath: 'Either; chooses on economics, not capability',
    namedBy: 'neither',
  },
  {
    id: 'true_novice_no_technical_staff',
    postal: 'low',
    software: 'low',
    likelyPath: 'MSP or lettershop — the OIG\'s stated case [^8]',
    namedBy: 'neither',
  },
];

/** Mandatory burdens and who can carry each. */
const BURDENS = [
  { burden: 'CASS certification', required: 'any automation price [^2]', skippable: false, carryBy: 'preparer or certified software' },
  { burden: 'Move Update', required: 'First-Class presort/automation and Marketing Mail [^3]', skippable: false, carryBy: 'mailer, via NCOA or equivalent' },
  { burden: 'eDoc / Mail.dat', required: 'full service', skippable: false, carryBy: 'mail preparer' },
  { burden: 'Mailer Scorecard', required: 'every letter and flat mailing [^4]', skippable: false, carryBy: 'generated by USPS; read by submitter and owner' },
] as const;

export const texasMailerExpertiseAxisUniverse = {
  universeId: UNIVERSE_ID,
  type: UniverseType.HISTORICAL_EVENT,

  identifiers: {
    primary: 'history:texas_mailer_expertise_axis:2026',
    aliases: [
      'had they done this before',
      'does inexperience predict an API',
      'where did the competence come from',
      'who has scorecard history',
    ],
  },

  realityRelation: {
    type: 'interpretation',
    fictionalizationDegree: 0.3,
    realityAnchors: [
      {
        realEventId: 'analysis:usps_mailing_requirements:2026',
        relationshipType: 'documents',
        confidence: 0.95,
        evidence: [
          'CASS required for automation prices [^2]',
          'Move Update required for First-Class presort/automation and Marketing Mail [^3]',
          'Mailer Scorecard available to eDoc submitter and mail owner/preparer [^4]',
        ],
      },
      {
        realEventId: 'analysis:usps_oig_mail_service_providers:2026',
        relationshipType: 'documents',
        confidence: 0.9,
        evidence: [
          'MSPs cost-effective for organizations with limited expertise in complex mailing requirements [^8]',
        ],
      },
      {
        realEventId: 'analysis:print_mail_api_positioning:2026',
        relationshipType: 'documents',
        confidence: 0.85,
        evidence: [
          'API "designed for developers" [^6]',
          'REST API for developers; SDKs [^1]',
          'OAuth2 authentication [^7]',
          'Sandbox and SDK onboarding [^5]',
          'Marketed as absorbing postal complexity [^1]',
        ],
      },
    ],
  },

  attribution: {
    public_domain: false,
    sources: ['PostalPro CASS, Move Update and Mailer Scorecard pages', 'USPS OIG white paper on Mail Service Providers', 'Print-and-mail platform documentation', 'Prior modules'],
    citations_required: true,
    usage_restrictions: [
      'The two-axis model is the compiler\'s abstraction, not a measured typology.',
      'No vendor is identified; platform positioning is cited as market structure.',
      'Scorecard availability does not imply the compiler can obtain a given scorecard; access is limited to the submitter and owner/preparer [^4].',
      'Credences are judgements, not frequencies.',
    ],
  },

  layers: [
    {
      layerId: 'skill_attribution',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:operator_competence:2026',
        accuracy: 0.35,
        deviations: [
          'Infers competence from production choices, which is indirect: a competent operator may delegate precisely because they are competent, and an incompetent one may micromanage for the same reason.',
          'Assumes the operator and the decider are the same person; a payer may have competence the operator lacks.',
          'Treats software literacy as a stable trait rather than a function of available staff.',
        ],
      },
      epochs: {
        operator: {
          epochId: 'history:expertise:operator',
          startTime: D(2025, 1, 1),
          endTime: DROP,
          precision: TimePrecision.DAY,
        },
      },
    },
    {
      layerId: 'burden_routing',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:mandatory_burdens:2026',
        accuracy: 0.7,
        deviations: [
          'Lists four burdens as if all apply; a retail-stamped mailing at First-Class rates would trigger none of the automation requirements.',
          'Treats the scorecard as universal, which it is for letters and flats, but its content differs by class and volume.',
        ],
      },
      epochs: {
        production: {
          epochId: 'history:expertise:production',
          startTime: DROP,
          endTime: DECISION,
          precision: TimePrecision.DAY,
        },
      },
    },
    {
      layerId: 'experience_record',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:prior_mailing_history:2026',
        accuracy: 0.5,
        deviations: [
          'Assumes scorecard history is retrievable. Access is limited to the eDoc submitter and the mail owner/preparer [^4], so the compiler may be able to confirm existence without reading content.',
          'A first mailing through a new vendor would show the VENDOR\'s history, not the operator\'s — the test reads the vendor\'s record as a proxy for the operator\'s competence, which is the point but also the limitation.',
        ],
      },
      epochs: {
        history: {
          epochId: 'history:expertise:history',
          startTime: D(2020, 1, 1),
          endTime: DECISION,
          precision: TimePrecision.DAY,
        },
      },
    },
  ],

  temporalStructure: {
    segments: [
      { id: 'prior_history', start: D(2020, 1, 1), end: DROP, type: 'phase', status: 'active' },
      { id: 'production', start: DROP, end: DECISION, type: 'phase', status: 'active' },
      { id: 'assessment', start: DECISION, end: DECISION, type: 'phase', status: 'active' },
    ],
    keyframes: [
      {
        id: 'e3_false_dichotomy',
        timestamp: DECISION,
        significance: 1.0,
        certainty: 0.9,
        tags: ['E3', 'logic', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The pair assumes one skill axis. There are two — postal knowledge and software integration — and they are orthogonal. Four actors result; the pair names three and mispredicts two. The missing cell, low postal plus low software, resolves to an MSP or lettershop, the option neither postulate names, and it is the modal first-time mailer.',
      },
      {
        id: 'e2_inversion',
        timestamp: DECISION,
        significance: 1.0,
        certainty: 0.85,
        tags: ['E2', 'inversion', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The USPS OIG states that MSPs are cost-effective for organizations with limited expertise in complex mailing requirements [^8]. Inexperience therefore predicts outsourcing, not API adoption. The API is addressed to developers — "designed for developers" [^6], REST and SDKs [^1], OAuth2 [^7] — so it demands a competence the postal novice may not have.',
      },
      {
        id: 'e2_substitution_not_reduction',
        timestamp: DECISION,
        significance: 0.95,
        certainty: 0.8,
        tags: ['E2', 'substitution', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The API does absorb postal complexity; Postalytics sells integration "without becoming a direct mail expert" [^1]. But it substitutes technical burden for postal burden. Competence changes KIND, not quantity. A no-code bridge still requires someone who knows what the bridge is and will maintain it — which is why the novice\'s paradox exists: the only novice-usable route requires knowing it exists.',
      },
      {
        id: 'e1_expertise_is_handoff',
        timestamp: DECISION,
        significance: 0.95,
        certainty: 0.8,
        tags: ['E1', 'observable', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The burdens are named and non-optional: CASS for automation prices [^2], Move Update for presort and Marketing Mail [^3], eDoc for full service, a scorecard for every letter and flat mailing [^4]. An expert does not remove them; they know which are the lettershop\'s line items. So expertise looks like a CLEAN HANDOFF, not a short step list — which is a weaker signature than P1 assumes and the accurate one.',
      },
      {
        id: 'e4_scorecard_test',
        timestamp: DECISION,
        significance: 1.0,
        certainty: 0.75,
        tags: ['E4', 'test', 'discovery', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The Mailer Scorecard is a monthly dashboard of letter and flat activity available to the eDoc submitter and the mail owner/preparer [^4]. Operator history predating the drop confirms E1 with their name on it. Vendor history with no operator history means experience was RENTED — satisfying E1\'s conclusion while falsifying its premise. No history anywhere reopens the retail-stamp branch.',
      },
      {
        id: 'e1_predicate_too_narrow',
        timestamp: DECISION,
        significance: 0.7,
        certainty: 0.85,
        tags: ['E1', 'definition'],
        type: KeyframeType.MILESTONE,
        description:
          'The transferable skill is vendor management under deadline — briefing, proof approval, sequencing — not USPS knowledge. Print buyers, publishers and event marketers hold it without a prior bulk mailing. Read strictly as "USPS mailers," E1 produces false negatives on the most competent population in the model.',
      },
    ],
    windows: { strategy: 'phase_based' },
  },

  metadata: {
    canonicalName: 'Expertise Axis: two postulates, two axes, one missing actor',
    creators: ['Compiled analysis'],
    released: new Date('2026-10-26T00:00:00Z'),
    cultural_significance: 0.15,
    platform: 'Local Time universe system',
    externalId: 'texas_mailer_expertise_axis_2026',
    contentType: 'postulate audit / competence attribution',
    actors: ACTORS,
    burdens: BURDENS,
    credences: {
      'E1_as_stated_strict_usps': 0.30,
      'E1_as_stated_any_prior_mailer': 0.45,
      'E1_broadened_prior_bulk_production_via_vendor': 0.70,
      'E2_inexperience_predicts_api': 0.10,
      'E2_inexperience_predicts_msp_or_managed_tier': 0.75,
      'shared_premise_api_is_the_easy_path': 0.15,
      'operator_expertise_vendor_sourced_not_held': 0.55,
    },
    deciderDocuments: [
      'Mailer Scorecard history: presence of prior months against the operator name, permit, or MID [^4]',
      'Permit application date (PS Form 3615) versus drop date — a permit obtained days before the drop implies a first mailing',
      'MID assignment date for the mailing agent or owner',
      'Platform account creation date and first campaign date, if any platform was used',
      'Vendor-side: number of prior jobs for this client, and whether the client had a standing spec sheet',
    ],
    ticketDeltas: [
      'api_and_price: E2 reframes the API question — adoption implies software capability, not postal inexperience; the two must be scored separately',
      'automation_stack: the 7-of-8 finding is now readable as vendor-supplied competence rather than operator sophistication',
      'discovery_reach: add the scorecard-history request; it is the only document that tests prior experience directly',
      'operator_profile: record the novice\'s paradox — the novice-usable route requires expertise to select',
      'solo_limit: the floor of two entities is re-expressed in skill terms — the second entity supplies the competence, not just the permit',
    ],
    uncertaintyNotes: [
      'No scorecard has been obtained. Access is limited to the eDoc submitter and the mail owner/preparer [^4], so presence may be confirmable where content is not.',
      'The two-axis model is an abstraction. Real operators are teams whose members sit in different cells, which dissolves single-actor reasoning.',
      'The claim that APIs demand developer skill is drawn from vendor positioning; a no-code tier exists and lowers the barrier in ways this module does not fully credit.',
      'Credences are judgements. The 0.55 on vendor-sourced expertise is the least stable number here — it rests on supplied artwork, which is unconfirmed.',
    ],
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.US_HISTORY, CommonUniverseIds.US_GOVERNMENT],
    },
    references: [
      {
        type: 'DERIVES_FROM',
        targetUniverseId: API_PRICE_ID,
        description:
          'The vendor populations the two-axis model is applied to.',
      },
      {
        type: 'CORRECTS',
        targetUniverseId: SOLO_ID,
        description:
          'Reframes the two-entity floor in skill terms.',
      },
      {
        type: 'DOCUMENTS',
        targetUniverseId: TRACE_ID,
        description:
          'The vendor-side evidence for the competence reading.',
      },
      {
        type: 'SUPERSEDES',
        targetUniverseId: AUTOMATION_ID,
        description:
          'Replaces operator sophistication with vendor-sourced competence.',
      },
      {
        type: 'SUPERSEDES',
        targetUniverseId: DISCOVERY_ID,
        description:
          'Replaces the discovery claim with a scorecard test.',
      },
    ],
  },
} as unknown as Universe;

/** All universes this module owns. */
export const texasMailerExpertiseAxisUniverses: Universe[] = [
  texasMailerExpertiseAxisUniverse,
];
