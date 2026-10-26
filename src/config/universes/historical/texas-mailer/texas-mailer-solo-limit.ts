import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../../core/types';
import { CommonUniverseIds } from '../../../../core/common-universe-ids';
import { createHistoricalUniverseId } from '../../../../core/universe-ids';

/**
 * "Solo Limit" — headcount as a discriminator for intent, tested and replaced.
 *
 * POSTULATE (S0): as the number of people required to pull the mailer off falls
 * toward one, P(not an accident) rises.
 * ANTI-POSTULATE (S0'): solo execution requires effort.
 *
 * VERDICT: S0' is not a rival to S0. Effort is a property of the ARTIFACT, not of
 * the team — the same impressions are required whoever commissions them — so
 * effort measures the task, which is what a printer sells. S0' restates S0's
 * conclusion by a second route. Neither reaches the live question.
 *
 * S1  "ACCIDENT" DECOMPOSES. A1 existence / A2 targeting / A3 consequence.
 *     A1 is answered by the existence of a purchase order. A2 is a data question
 *     at a single node. Only A3 is live, and headcount is silent on A3.
 *
 * S2  THE LIMIT IS UNATTAINABLE. An addressed bulk mailing cannot be a one-person
 *     operation. Permit imprint requires a signed PS Form 3615 with two forms of
 *     ID, one photographic [^3][^1]; minimum 200 pieces or 50 lb
 *     [^2][^8]; all pieces identical weight [^7]; full-service eDoc
 *     requires a MID assigned to a Mail Owner or Mailing Agent [^9][^10];
 *     a mailing agent is "a business entity, organization, or individual acting
 *     on behalf of one or more mail owners" [^11]. FLOOR = 2 named entities,
 *     one of them a commercial vendor. The operator may rent the lettershop's
 *     permit [^2], which removes the operator's name from the mail and
 *     substitutes a vendor for it — the vendor is not removed.
 *
 * S3  THE DOCUMENTATION-FREE PATH IS RULED OUT BY THE ADDRESSING. EDDM requires
 *     no permit and no list, and its pieces are addressed to "Local Postal
 *     Customer" [^4][^6]. This mailer was addressed to a named
 *     household. That fact forces the mailing into the permit/MID/agent regime.
 *     The solo maximum is not rare; it is unavailable, and provably so from the
 *     artifact itself.
 *
 * S4  THE PROXY FAILS. D = documented handoffs saturates at the vendor boundary:
 *     a ten-person org and a solo operator both produce D = 2. D is therefore
 *     constant across the range S0 cares about. S0 is well-formed and the
 *     instrument reads a flat line. Separately, low N cuts both ways — fewer
 *     checkpoints raise the chance an error reaches the stream — so N = 1 is
 *     consistent with both directions of S0.
 *
 * S5  REPLACEMENT VARIABLE. Binary: did the TENT identity survive a vendor
 *     checkpoint? If yes, impersonation passed a professional check and was
 *     approved in writing at a timestamp. If no, impersonation was authored
 *     upstream and localizes to the operator. Both branches informative, both
 *     obtainable. The PROOF APPROVAL is the single best document in the chain
 *     because it is where a human signs that they saw the stolen identity and
 *     authorised its reproduction.
 *
 * S6  DISCOVERY CONSEQUENCE. As N falls, independent witnesses fall but per-document
 *     probative value rises. A single lettershop that handled creative, list,
 *     print and drop is one subpoena from the whole production history, and has
 *     no institutional stake in the operator's reputation. Concentration is bad
 *     for corroboration and good for discovery: if S0 is true, the case is easier.
 *
 * Reality Relation: interpretation, fictionalizationDegree 0.3 — postal rules and
 * product behaviour are documentary; S0's formalisation and S5 are the compiler's.
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

const UNIVERSE_ID = createHistoricalUniverseId('texas_mailer_solo_limit', '2026');

const DISCOVERY_ID = 'history:texas_mailer_discovery_reach:2026';

const D = (y: number, m: number, d: number): bigint =>
  BigInt(Date.UTC(y, m - 1, d)) * 1_000_000n;

const DROP = D(2026, 10, 14);
const DECISION = D(2026, 10, 26);

/** Sense of "accident" and whether headcount discriminates. */
interface Sense {
  readonly id: 'A1' | 'A2' | 'A3';
  readonly claim: string;
  readonly discriminates: 'weakly' | 'no';
  readonly because: string;
}

const SENSES: readonly Sense[] = [
  {
    id: 'A1',
    claim: 'Nobody meant to produce and send this artifact.',
    discriminates: 'weakly',
    because: 'Answered by the existence of a purchase order; every version was produced on purpose by someone',
  },
  {
    id: 'A2',
    claim: 'Sent intentionally, to the wrong list.',
    discriminates: 'no',
    because: 'List selection is one decision at one node regardless of team size',
  },
  {
    id: 'A3',
    claim: 'Sent intentionally, but the impersonation and outrage cycle were not foreseen.',
    discriminates: 'no',
    because: 'THE LIVE SENSE. Foreseeing identity theft as liability transfer does not depend on room size; fewer people means fewer objectors, not more',
  },
];

/** Minimum viable chain and what each node documents. */
const CHAIN = [
  { node: 'decider', required: true, documents: 'purchase order, creative brief, payment instrument' },
  { node: 'list vendor', required: true, documents: 'rental agreement, select criteria, pull date, schema' },
  { node: 'printer / lettershop', required: true, documents: 'job ticket, proof approval, version schedule, eDoc' },
  { node: 'permit holder', required: true, documents: 'PS Form 3615 (signed, photo ID) [^3], postage statement' },
  { node: 'mailing agent (MID)', required: true, documents: 'MID assignment as Mail Owner or Mailing Agent [^9]' },
] as const;

export const texasMailerSoloLimitUniverse = {
  universeId: UNIVERSE_ID,
  type: UniverseType.HISTORICAL_EVENT,

  identifiers: {
    primary: 'history:texas_mailer_solo_limit:2026',
    aliases: [
      'can one person mail this alone',
      'headcount as evidence of intent',
      'why the anti-postulate agrees with the postulate',
      'who approved the proof',
    ],
  },

  realityRelation: {
    type: 'interpretation',
    fictionalizationDegree: 0.3,
    realityAnchors: [
      {
        realEventId: 'spec:usps_permit_imprint_regime',
        relationshipType: 'documents',
        confidence: 0.95,
        evidence: [
          'PS Form 3615 signed with two forms of ID, one photographic [^3][^1]',
          'Minimum 200 pieces or 50 lb [^2][^8]',
          'Pieces in a permit imprint mailing must be of identical weight [^7]',
          'Permit is permission to mail, held per post office [^5]',
        ],
      },
      {
        realEventId: 'spec:usps_full_service_mid',
        relationshipType: 'documents',
        confidence: 0.9,
        evidence: [
          'MIDs assigned to Mail Owner or Mailing Agent [^9][^10]',
          'Mailing agent defined as entity, organization, or individual acting on behalf of mail owners [^11]',
        ],
      },
      {
        realEventId: 'spec:usps_eddm',
        relationshipType: 'documents',
        confidence: 0.95,
        evidence: [
          'EDDM needs no permit and no address list [^4][^6]',
          'EDDM pieces addressed to "Local Postal Customer", not a name [^6]',
          '200 to 5,000 pieces per day per ZIP [^4]',
        ],
      },
      {
        realEventId: 'history:texas_trans_student_mailer_controversy:2026',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: ['Piece addressed to a named household, which eliminates the EDDM path'],
      },
    ],
  },

  attribution: {
    public_domain: false,
    sources: ['PostalPro and DMM quick service guides', 'PS Form 3615', 'Prior modules'],
    citations_required: true,
    usage_restrictions: [
      'The floor of two named entities is derived from postal rule, not from evidence about this mailing. It is a structural bound, not a finding.',
      'Renting a lettershop permit is lawful and common [^2]; it is not an indicator of concealment and must not be described as one.',
      'Nothing here speaks to intent. S5 is a test design, not a result.',
      'The postulate under audit is the compiler\'s formalisation of a hypothesis supplied in conversation, not a published claim.',
    ],
  },

  layers: [
    {
      layerId: 'postal_structure',
      type: 'reconstruction',
      reality_correspondence: {
        to: 'analysis:structural_floor:2026',
        accuracy: 0.75,
        deviations: [
          'Assumes a commercial bulk mailing. A retail-stamped mailing at First-Class rates needs no permit and no eDoc, but is economically implausible at this scale and produces no documentation at all — a branch that cannot be excluded by rule, only by cost.',
          'Assumes the lettershop rather than the operator held the permit; the reverse is equally consistent with the addressing.',
          'Treats the identical-weight rule as evidence the pieces were machine-prepared, which is an inference about method.',
        ],
      },
      epochs: {
        production: {
          epochId: 'history:solo:production',
          startTime: DROP,
          endTime: DECISION,
          precision: TimePrecision.DAY,
          description: 'Window in which permit, MID, eDoc, and proof approval were created.',
        },
      },
    },
    {
      layerId: 'headcount_evidence',
      type: 'reconstruction',
      reality_correspondence: {
        to: 'analysis:headcount_proxy:2026',
        accuracy: 0.25,
        deviations: [
          'No headcount is observed. The proxy D is shown to saturate and is therefore rejected rather than measured.',
          'The claim that concentration helps discovery assumes the vendor is cooperative once subpoenaed, which is the same assumption the printer module already flags.',
        ],
      },
      epochs: {
        estimate: {
          epochId: 'history:solo:estimate',
          startTime: DECISION,
          endTime: DECISION,
          precision: TimePrecision.DAY,
        },
      },
    },
  ],

  temporalStructure: {
    segments: [
      { id: 'production', start: DROP, end: DECISION, type: 'phase', status: 'active' },
      { id: 'test_design', start: DECISION, end: DECISION, type: 'phase', status: 'active' },
    ],
    keyframes: [
      {
        id: 's0_pair_collapses',
        timestamp: DECISION,
        significance: 0.9,
        certainty: 0.85,
        tags: ['S0', 'logic', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The anti-postulate is not a rival. Effort is a property of the artifact, not the team: the same impressions are required whoever commissions them, and effort is precisely what a printer sells. So effort measures the task, and the task is constant. Both postulates reach "intentional" by different routes without touching the live question.',
      },
      {
        id: 's1_three_senses',
        timestamp: DECISION,
        significance: 0.9,
        certainty: 0.9,
        tags: ['S1', 'decomposition'],
        type: KeyframeType.MILESTONE,
        description:
          'Accident means existence, targeting, or consequence. Existence is answered by the purchase order. Targeting is a single node. Only consequence is live, and headcount is silent on it because foreseeing a liability transfer does not depend on room size. Fewer people means fewer objectors, not more foresight.',
      },
      {
        id: 's2_floor_is_two',
        timestamp: DROP,
        significance: 1.0,
        certainty: 0.9,
        tags: ['S2', 'postal', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'N = 1 cannot occur for an addressed bulk mailing. Permit imprint requires a signed PS Form 3615 with photographic ID [^3]; full-service eDoc requires a MID held by a Mail Owner or Mailing Agent [^9][^10]; a mailing agent is an entity, organization, or individual acting on behalf of mail owners [^11]. Floor = two named entities, one a commercial vendor. Renting the lettershop permit [^2] removes the operator\'s name and substitutes the vendor; it does not remove the vendor.',
      },
      {
        id: 's3_eddm_eliminated',
        timestamp: DECISION,
        significance: 0.95,
        certainty: 0.9,
        tags: ['S3', 'addressing', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The only permitless, listless path is EDDM, whose pieces are addressed to "Local Postal Customer" rather than a name [^6][^4]. This mailer was addressed to a named household. The solving fact is in the addressing: it forces the mailing into the permit/MID/agent regime and eliminates the documentation-free solo route. The solo limit is unavailable, not merely rare.',
      },
      {
        id: 's4_proxy_saturates',
        timestamp: DECISION,
        significance: 0.85,
        certainty: 0.85,
        tags: ['S4', 'measurement'],
        type: KeyframeType.MILESTONE,
        description:
          'Documented handoffs D saturates at the vendor boundary: a ten-person organization and a solo operator both produce D = 2. The proxy is constant across the range the postulate cares about, which is why three rounds of argument have not resolved it. Separately, low N cuts both ways: fewer checkpoints raise the chance an error reaches the stream, so N = 1 supports both directions.',
      },
      {
        id: 's5_proof_approval',
        timestamp: DECISION,
        significance: 1.0,
        certainty: 0.8,
        tags: ['S5', 'replacement', 'discovery', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'Replacement variable: did the TENT identity survive a vendor checkpoint. If the vendor saw the name and logo and printed them, impersonation passed a professional check and was approved in writing at a timestamp. If the artwork arrived camera-ready, impersonation was authored upstream and localizes to the operator. THE PROOF APPROVAL is the best document in the chain — the one place a human signs that they saw a stolen identity and authorised its reproduction. It beats the permit, the eDoc, and the version schedule on probative value.',
      },
      {
        id: 's6_concentration_helps',
        timestamp: DECISION,
        significance: 0.8,
        certainty: 0.65,
        tags: ['S6', 'discovery', 'counterintuitive'],
        type: KeyframeType.MILESTONE,
        description:
          'As N falls, independent witnesses fall but per-document value rises. A single lettershop handling creative, list, print and drop is one subpoena from the entire production history and has no institutional stake in the operator\'s reputation. Concentration is bad for corroboration and good for discovery: if the postulate is true, the case is easier, not harder.',
      },
    ],
    windows: { strategy: 'phase_based' },
  },

  metadata: {
    canonicalName: 'Solo Limit: headcount as a discriminator, tested and replaced',
    creators: ['Compiled analysis'],
    released: new Date('2026-10-26T00:00:00Z'),
    cultural_significance: 0.2,
    platform: 'Local Time universe system',
    externalId: 'texas_mailer_solo_limit_2026',
    contentType: 'postulate audit / structural bound',
    structuralFloor: {
      minimumNamedEntities: 2,
      nodes: CHAIN,
      reason: 'Permit imprint signatory plus MID holder; the two may be the same vendor, never the operator alone',
      eliminatedPath: 'EDDM — permitless and listless, but addressed to "Local Postal Customer" [^6]',
      residualBranch: 'Retail-stamped First-Class, no permit and no eDoc; uneconomic at scale, undocumented, not excludable by rule',
    },
    senses: SENSES,
    replacementTest: {
      question: 'Did the TENT identity survive a vendor checkpoint?',
      yes: 'Documented act of impersonation, timestamped, with a named approver',
      no: 'Impersonation authored upstream; localizes to operator and layout author',
      document: 'Signed proof approval, job ticket, preflight record, approval correspondence',
    },
    documentRequests: [
      'From lettershop: signed proof approval and the approval correspondence, with date and approver identity',
      'From lettershop: job ticket showing whether artwork was supplied camera-ready or composed in-house',
      'From lettershop or permit holder: postage statement naming the permit used and the mailing agent MID',
      'From list vendor: rental agreement, select criteria, pull date, and column schema',
      'From mail preparer: eDoc version schedule and per-version counts',
    ],
    ticketDeltas: [
      'automation_stack: the "one human seam" claim is restated — the seam is not the permit alone, it is the proof approval, which is a second and better seam',
      'discovery_reach: promote proof approval to first request; demote permit and eDoc to corroboration',
      'five_postulates: retire headcount as a discriminator and record D-saturation as the reason; keep the three-sense decomposition',
      'operator_profile: note that renting a lettershop permit [^2] is lawful and common and is not evidence of concealment',
      'proper_timelines: no change',
    ],
    uncertaintyNotes: [
      'The two-entity floor is a structural bound from postal rule, not evidence about this mailing. A retail-stamped First-Class mailing would defeat it and leave no documentation at all; it is excluded on cost, not on rule.',
      'No headcount is observed anywhere in this module. The entire round is about the impossibility of observing it, not about an estimate.',
      'The claim that the proof approval exists assumes a commercial print vendor with standard preflight practice. A vendor printing supplied artwork without proofing would defeat the request.',
      'Whether a proof approval would be retained 12 days after the drop is likely but unverified.',
      'Nothing here bears on intent. S5 is a test, and its two outcomes are equally compatible with a careless operator and a calculating one.',
    ],
    threadSiblings: [
      {
        id: 'history:texas_mailer_kpi_and_signature:2026',
        note: 'the KPI module this one derives from; not landed',
      },
      {
        id: 'history:texas_mailer_automation_stack:2026',
        note: 'the automation module this one corrects; not landed',
      },
      {
        id: 'history:texas_mailer_proper_timelines:2026',
        note: 'the timeline module this one documents; not landed',
      },
    ],
  },

  connections: {
    natural: {
      parentUniverses: [
        CommonUniverseIds.US_HISTORY,
      ],
    },
    references: [
      {
        type: 'SUPERSEDES',
        targetUniverseId: DISCOVERY_ID,
        confidence: 0.8,
        description:
          'Replaces the discovery module\'s unattainable solo-operator limit with the ' +
          'two-entity postal floor.',
      },
      {
        type: 'DOCUMENTS',
        targetUniverseId: 'series:beck_pamphlet_transcript:2026',
        confidence: 0.9,
        description:
          'The addressee field read aloud on air is the artifact fact that rules out the ' +
          'permitless EDDM path.',
      },
    ],
  },
} as unknown as Universe;

/** All universes derived from james-gibson/local-time#200. */
export const texasMailerSoloLimitUniverses: Universe[] = [texasMailerSoloLimitUniverse];
