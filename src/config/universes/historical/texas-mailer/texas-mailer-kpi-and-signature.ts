import {
  KeyframeType,
  TimePrecision,
  Universe,
  UniverseType,
} from '../../../../core/types';
import { CommonUniverseIds } from '../../../../core/common-universe-ids';
import { createHistoricalUniverseId } from '../../../../core/universe-ids';

/**
 * "KPI, Signature, Lattice" — three postulates tested.
 *
 * K1  A consultant marks a KPI visible to the payer unless self-funded.
 *     CONFIRMED, with relocation: the KPI cannot be a response metric, because
 *     no response path is printed on the piece and response identifiers must be
 *     chosen before production. It is therefore a DELIVERY KPI: full-service IMb
 *     piece tracking and eDoc/Mail.dat submitted to PostalOne!.
 *     PRECISION: Mail.dat contains all mailing information EXCLUDING the
 *     addresses. eDoc and the address file are separate custodial objects.
 *
 * L1  A past-GOP file carries a signature such as export date via deaths/moves.
 *     CONFIRMED, with a mechanism that works against the test: NCOA returns
 *     updated addresses for moves within 48 months, and pre-mail hygiene strips
 *     deceased and mover suppressions. The move signature is destroyed by the
 *     pipeline that makes the file mailable. SURVIVING BOUNDS: newest
 *     registration date = hard floor; column schema and merge tokens = vendor
 *     fingerprint. Dating by deaths is WITHDRAWN as too weak to ship.
 *
 * R   Rhetorical lattice (R1..R5). The load-bearing member is R5, not R4.
 *     Effort cannot discriminate between the responder and the segment, because
 *     both expound at length. Only the DIRECTION of the disclaimer can: Beck's
 *     hedge protects the speaker; the responder's hedge protects the reader.
 *
 * CORRECTION (this module): the sentence previously quoted as verbatim artifact
 * text — "adults whose job is to help them... become their family if their
 * parents won't" — could not be reproduced and is reclassified as compiler
 * PARAPHRASE of the artifact's framing. T2 in proper_timelines requires the same
 * correction. R4 is unaffected.
 *
 * Reality Relation: interpretation, fictionalizationDegree 0.35 — mostly
 * documentary; the lattice and the KPI inference are the compiler's.
 */

const UNIVERSE_ID = createHistoricalUniverseId('texas_mailer_kpi_and_signature', '2026');

const PROPER_TIMELINES_ID = 'history:texas_mailer_proper_timelines:2026';
const BECK_PLANE_ID = 'history:texas_mailer_beck_plane:2026';
const DISCOVERY_ID = 'history:texas_mailer_discovery_reach:2026';
const AUTOMATION_ID = 'history:texas_mailer_automation_stack:2026';

const D = (y: number, m: number, d: number): bigint =>
  BigInt(Date.UTC(y, m - 1, d)) * 1_000_000n;

const DROP = D(2026, 10, 14);
const DECISION = D(2026, 10, 26);

/** A postulate with its audit verdict. */
interface Audited {
  readonly id: string;
  readonly statement: string;
  readonly verdict: 'confirmed' | 'confirmed_relocated' | 'confirmed_weak' | 'equivocation' | 'invalid' | 'withdrawn' | 'paraphrase';
  readonly defect?: string;
  readonly consequence: string;
}

const POSTULATES: readonly Audited[] = [
  {
    id: 'K1_kpi_marked',
    statement: 'A consultant marks a KPI; the payer sees it unless the operation self-funded.',
    verdict: 'confirmed_relocated',
    defect: 'No response path is printed on the piece, so no response KPI is possible',
    consequence: 'The KPI is a delivery KPI: IMb piece tracking plus eDoc/Mail.dat. The version schedule is already a field in a file the printer submitted',
  },
  {
    id: 'K1a_addresses_excluded',
    statement: 'eDoc exposes the recipient list.',
    verdict: 'invalid',
    defect: 'Mail.dat contains all mailing information excluding the addresses',
    consequence: 'eDoc and address file are separate custodial objects; request both, from different holders',
  },
  {
    id: 'K1b_log_vs_report',
    statement: 'A consultant and a self-funder leave distinguishable residue.',
    verdict: 'confirmed_weak',
    defect: 'Both pull delivery data; only the addressee differs',
    consequence: 'Test is whether delivery data was formatted for a third party — a log is self-use, a report is a deliverable',
  },
  {
    id: 'L1_export_date_signature',
    statement: 'A past-GOP file carries a signature such as export date via deaths and moves.',
    verdict: 'confirmed_weak',
    defect: 'NCOA absorbs moves within 48 months and hygiene strips deceased records; the signature is destroyed by mail preparation',
    consequence: 'Keep only the robust bounds: newest registration date as hard floor, schema and merge tokens as vendor fingerprint',
  },
  {
    id: 'L2_death_dating',
    statement: 'Deceased records date the export.',
    verdict: 'withdrawn',
    defect: 'Presence proves no suppression ran, not when the pull happened',
    consequence: 'Drop from the method; do not ship as a dating technique',
  },
  {
    id: 'R1_adults_shouldnt_help',
    statement: 'Adults should not help children.',
    verdict: 'equivocation',
    defect: 'Universal form is false (teachers, coaches, mandated reporters, parents); narrow form is not the postulate',
    consequence: 'The equivocation between unspecified help and help with this content is the load-bearing error',
  },
  {
    id: 'R2_help_makes_creeps',
    statement: 'Adults who help children are creeps; those who do not are not.',
    verdict: 'invalid',
    defect: 'Converts a norm into a unary character predicate over a set that contains parents',
    consequence: 'Denies the middle; the parent who helps becomes the creep',
  },
  {
    id: 'R3_parents_exempt',
    statement: 'Parents may decline to explain this material.',
    verdict: 'confirmed',
    consequence: 'Combined with R1-R2 it produces the harm it forbids: unexplained material plus forbidden explanation leaves the child with neither',
  },
  {
    id: 'R4_responder_expounded',
    statement: 'The original responder laid out complex material in non-zero fashion.',
    verdict: 'confirmed',
    consequence: 'Decisive empirically — the objectionable act is exposition, which the objector also performs',
  },
  {
    id: 'R5_disclaimers_opposite',
    statement: 'The responder\'s disclaimers were opposite to Beck\'s.',
    verdict: 'confirmed',
    consequence: 'THE LOAD-BEARING MEMBER. Beck hedges his knowledge of the sender (protects the speaker); the responder hedges reader reliance (protects the reader). Only this discriminates, because effort does not',
  },
  {
    id: 'C1_paraphrase_not_quote',
    statement: 'The "adults whose job is to help them / become their family" sentence is verbatim artifact text.',
    verdict: 'paraphrase',
    defect: 'Source text could not be reproduced on re-check',
    consequence: 'Reclassify as compiler paraphrase; correct T2 in proper_timelines. R4 unaffected',
  },
];

export const texasMailerKpiAndSignatureUniverse = {
  universeId: UNIVERSE_ID,
  type: UniverseType.HISTORICAL_EVENT,

  identifiers: {
    primary: 'history:texas_mailer_kpi_and_signature:2026',
    aliases: [
      'did the operator keep score',
      'how to date a voter file',
      'the creep predicate',
      'whose disclaimer protects whom',
    ],
  },

  realityRelation: {
    type: 'interpretation',
    fictionalizationDegree: 0.35,
    realityAnchors: [
      {
        realEventId: 'history:texas_trans_student_mailer_controversy:2026',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'Mailing documentation exists by operation of postal rule: eDoc required for full-service',
          'Version structure is recorded in mailing documentation, not chosen by the compiler',
        ],
      },
      {
        realEventId: 'analysis:direct_mail_measurement_practice:2026',
        relationshipType: 'reinterprets',
        confidence: 0.8,
        evidence: [
          'Response identifiers must be printed before production',
          'Standard measurement paths: PURL, QR, tracked number, offer code',
        ],
      },
      {
        realEventId: 'analysis:ncoa_move_update:2026',
        relationshipType: 'reinterprets',
        confidence: 0.9,
        evidence: [
          'Moves within 48 months returned with updated address',
          'Move date and family/individual flags returned',
          'Deceased and mover suppression is standard pre-mail hygiene',
        ],
      },
    ],
  },

  attribution: {
    public_domain: false,
    sources: ['PostalPro eDoc and IMb documentation', 'NCOA vendor documentation', 'Prior modules'],
    citations_required: true,
    usage_restrictions: [
      'The KPI inference is an inference. No report, log, or invoice has been produced.',
      'The rhetorical lattice is the compiler\'s formalisation; R1-R3 are reconstructed from the postulate set supplied, not quoted from any published argument.',
      'No claim about the responder organisation\'s intent or the host\'s sincerity.',
      'The reclassified sentence must never be quoted as artifact text.',
    ],
  },

  layers: [
    {
      layerId: 'kpi_artifacts',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:kpi_residue:2026',
        accuracy: 0.5,
        deviations: [
          'Assumes a documented engagement; three degenerate cases are indistinguishable absent the documents.',
          'Treats postal-rule documentation as a KPI artifact, which conflates compliance with measurement.',
          'A delivery report may never have been produced even where a consultant existed.',
        ],
      },
      epochs: {
        mailing: {
          epochId: 'history:kpi:mailing',
          startTime: DROP,
          endTime: DECISION,
          precision: TimePrecision.DAY,
          description: 'Window in which eDoc, postage statement, and any delivery summary would have been produced.',
        },
      },
    },
    {
      layerId: 'list_signature',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:voter_file_provenance:2026',
        accuracy: 0.5,
        deviations: [
          'The newest-registration floor assumes a voter file rather than a modelled consumer file, which is inference from the merge convention.',
          'Schema fingerprinting requires a sample of the file, which has not been obtained.',
          'NCOA 48-month behaviour is a vendor-product property, not a legal rule.',
        ],
      },
      epochs: {
        pull: {
          epochId: 'history:list:pull',
          startTime: D(2025, 1, 1),
          endTime: DROP,
          precision: TimePrecision.DAY,
          description: 'Unbounded pull window; floors only. No upper bound is derivable from the artifacts seen.',
        },
      },
    },
    {
      layerId: 'rhetorical_lattice',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:creep_predicate:2026',
        accuracy: 0.55,
        deviations: [
          'Formalises an argument reconstructed from a postulate list as though it were a single authored text; it may be several people\'s positions.',
          'Treats R1-R2 as a conjunction the speaker endorses; they may be rhetorical questions.',
          'The self-application finding assumes the segment\'s audience includes minors, which is likely but unmeasured.',
        ],
      },
      epochs: {
        lattice: {
          epochId: 'history:lattice:audit',
          startTime: DECISION,
          endTime: DECISION,
          precision: TimePrecision.DAY,
        },
      },
    },
  ],

  temporalStructure: {
    segments: [
      { id: 'mailing_window', start: DROP, end: DECISION, type: 'phase', status: 'active' },
      { id: 'audit', start: DECISION, end: DECISION, type: 'phase', status: 'active' },
    ],
    keyframes: [
      {
        id: 'k1_kpi_is_delivery_not_response',
        timestamp: DROP,
        significance: 1.0,
        certainty: 0.75,
        tags: ['K1', 'kpi', 'postal', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'No response path is printed on the piece, and response identifiers must be chosen before production. So any consultant KPI here is a delivery KPI, which is structurally recorded rather than optionally recorded: full-service IMb tracks individual pieces, and full-service requires eDoc submission to PostalOne!. The version schedule requested two rounds ago is therefore a field, not a favour.',
      },
      {
        id: 'k1_addresses_are_a_separate_object',
        timestamp: DROP,
        significance: 0.9,
        certainty: 0.9,
        tags: ['K1', 'precision', 'custody'],
        type: KeyframeType.MILESTONE,
        description:
          'Mail.dat contains all mailing information EXCLUDING the addresses. Corrects an earlier assumption: eDoc gives versions, counts and dates, not recipients. Two custodial objects, two holders, two requests — eDoc from the preparer and USPS, address file from the preparer and the list vendor.',
      },
      {
        id: 'k1_log_versus_report',
        timestamp: DECISION,
        significance: 0.85,
        certainty: 0.6,
        tags: ['K1', 'elimination_test'],
        type: KeyframeType.MILESTONE,
        description:
          'The postulate\'s escape clause is the only discriminator. An informal consultant and a self-funder both pull delivery data; they differ in whether the pull was formatted for a third party. A log is self-use; a named report is a deliverable. This is the question to put to the mail preparer.',
      },
      {
        id: 'l1_ncoa_destroys_the_signature',
        timestamp: DECISION,
        significance: 0.95,
        certainty: 0.85,
        tags: ['L1', 'correction', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The move signature is removed by the pipeline that makes the file mailable: NCOA returns updated addresses for moves in the previous 48 months, and hygiene strips deceased and mover records before a drop. What survives is the newest registration date as a hard floor, and the column schema plus merge tokens as a vendor fingerprint. Dating by deaths is withdrawn as too weak.',
      },
      {
        id: 'l2_household_merge_field',
        timestamp: DECISION,
        significance: 0.8,
        certainty: 0.8,
        tags: ['L1', 'list', 'granularity'],
        type: KeyframeType.MILESTONE,
        description:
          '"Students of the [Surname] Family" is a household-level merge token filled from a surname and an address. It confirms the file\'s granularity — household, not person — and confirms nothing about export date. Consistent with the past-GOP-voter-file reading and with the B3 retraction.',
      },
      {
        id: 'r5_disclaimer_direction',
        timestamp: DECISION,
        significance: 1.0,
        certainty: 0.75,
        tags: ['R5', 'lattice', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'Effort cannot discriminate — both the responder and the segment expound at length. Only the direction of the hedge can. Beck hedges his knowledge of the sender, protecting the speaker from liability for a claim; the responder hedges reader reliance, protecting the reader from harm. This is a fact about the text, not a judgment about intent, and it is the only member of the chain that survives reflexive application.',
      },
      {
        id: 'r2_self_application',
        timestamp: DECISION,
        significance: 0.95,
        certainty: 0.7,
        tags: ['R2', 'lattice', 'self_application'],
        type: KeyframeType.MILESTONE,
        description:
          'R1-R3 form a closed set in which the only non-creep position is non-communication. R4 breaks it: the artifact is expository, so the objectionable act is exposition. Applied reflexively the segment satisfies R2\'s predicate — it explains complex material to an audience including minors and reads a child\'s mail aloud — and survives only because its hedge is aimed inward.',
      },
    ],
    windows: { strategy: 'phase_based' },
  },

  metadata: {
    canonicalName: 'KPI, Signature, Lattice: three postulates and their audit',
    creators: ['Compiled analysis'],
    released: new Date('2026-10-26T00:00:00Z'),
    cultural_significance: 0.25,
    platform: 'Local Time universe system',
    externalId: 'texas_mailer_kpi_and_signature_2026',
    contentType: 'postulate audit / custodial mapping',
    postulateLedger: Object.fromEntries(
      POSTULATES.map((p) => [p.id, { verdict: p.verdict, defect: p.defect ?? null, consequence: p.consequence }]),
    ),
    verdictCensus: { confirmed: 3, confirmed_relocated: 1, confirmed_weak: 2, equivocation: 1, invalid: 2, withdrawn: 1, paraphrase: 1 },
    documentRequests: [
      'From mail preparer: eDoc/Mail.dat submission confirming piece counts per creative version and entry dates',
      'From mail preparer: any delivery summary produced for a third party (named report, not internal log)',
      'From permit holder: postage statement and permit application — the permit applicant is a named human',
      'From list vendor: file product identification by schema, select criteria, and pull date',
      'From USPS: IMb trace and eDoc for the drop, if obtainable by compulsory process',
    ],
    ticketDeltas: [
      'proper_timelines: correct T2 — the "help them / become their family" sentence is compiler paraphrase, not artifact text',
      'five_postulates: add K1 as an elimination test with three cases; the KPI is a delivery metric, and log-versus-report is the discriminator',
      'discovery_reach: split the eDoc request from the address-file request; Mail.dat excludes addresses',
      'discovery_reach: replace the death-dating method with the newest-registration floor and schema fingerprinting',
      'operator_profile: add R5 as the disclaimer-direction test, superseding the effort-based reading of R4',
    ],
    threadSiblings: [
      {
        id: BECK_PLANE_ID,
        note: 'the single-pass Beck reading this lattice corrects; still unlanded',
      },
    ],
    uncertaintyNotes: [
      'No KPI artifact has been produced. The entire K1 line is inference from postal rule plus industry practice.',
      'The 48-month NCOA window is a product property of the move-update service, not a statutory rule, and mailers may process on a different cadence.',
      'Schema fingerprinting is untested here: no file sample has been obtained, so the claim that the schema narrows the vendor universe is a hypothesis about a document we do not hold.',
      'The rhetorical lattice formalises a postulate list as a conjunction; its author may hold none of R1-R3 literally.',
      'A delivery KPI may never have been reported even where a consultant was engaged — absence of a report is weak evidence of absence of a consultant.',
    ],
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.US_HISTORY, CommonUniverseIds.US_GOVERNMENT],
    },
    references: [
      {
        type: 'CORRECTS',
        targetUniverseId: PROPER_TIMELINES_ID,
        confidence: 1.0,
        description: 'T2 quotation reclassified as compiler paraphrase.',
      },
      {
        type: 'SUPERSEDES',
        targetUniverseId: DISCOVERY_ID,
        confidence: 0.9,
        description: 'Replaces death-dating with the newest-registration floor and schema fingerprinting.',
      },
      {
        type: 'DOCUMENTS',
        targetUniverseId: AUTOMATION_ID,
        confidence: 0.9,
        description: 'The production reading the KPI and forensic requests extend.',
      },
    ],
  },
} as unknown as Universe;

/** All universes this draft owns. */
export const texasMailerKpiAndSignatureUniverses: Universe[] = [texasMailerKpiAndSignatureUniverse];
