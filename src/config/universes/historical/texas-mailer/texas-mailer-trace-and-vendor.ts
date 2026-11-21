import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../../core/types';
import { CommonUniverseIds } from '../../../../core/common-universe-ids';
import { createHistoricalUniverseId } from '../../../../core/universe-ids';

/**
 * "Trace and Vendor" — four postulates on physical evidence, scheduling, and the
 * printer's posture.
 *
 * F1  First-Class mail may leave DNA or fingerprints. TRUE IN GENERAL, DEAD HERE.
 *     Latent prints develop on paper, including historic marks [^11][^5];
 *     envelope and stamp DNA are worked problems [^12][^13]; and the Sayoc
 *     case shows both vectors succeeding on mailed items — print from one
 *     envelope [^14], DNA from ten devices [^15].
 *     FAILURES, ascending: (1) bulk mail cross-contaminates in trays, bins and
 *     bags within a short period [^7], and low-template mixtures are the
 *     weakest evidence class [^16], with ninhydrin itself reducing DNA
 *     recovery [^8]; (2) chain of custody is destroyed by delivery and
 *     handling, and mail cover is prospective and covers only the outside
 *     [^1]; (3) no charged offense means no public lab, and no litigant will
 *     fund a mixture deconvolution with no custody.
 *     INVERSION: presence proves the sender touched that piece; absence proves
 *     nothing. So the trace question is a PRODUCTION-MODEL test, not an identity
 *     test — it discriminates permit-imprint/window (no contact, no trace) from
 *     hand-stamped/hand-addressed (contact, trace exists).
 *
 * F2  A tight schedule left no time for review or pushback. REFUTED AS STATED.
 *     Speed is a product, not a constraint: proofs in 24-48h [^2], 48-hour
 *     print-and-mail to USPS handoff [^4], 3-5 business days EDDM [^17],
 *     conventional full timeline 10-18 business days [^10]. Rush buys a
 *     faster proof at a price; it does not buy its absence. Vendors treat
 *     proof-approval time as a scheduled dependency to be named in the milestone
 *     schedule [^9]. Pressure propagates backward from the drop date and
 *     compresses the CLIENT's drafting, not the vendor's liability control.
 *     SURVIVING VERSION (0.7): tight schedule predicted compressed client-side
 *     process and supplied camera-ready artwork — i.e. it predicts automation.
 *     The mechanism that lets impersonation through is ARTWORK PROVENANCE, not
 *     speed: supplied files are proofed for color, registration, stock and trim,
 *     not for rights to the marks.
 *
 * F3  The printer was extra fast or extra unobservant. FALSE DICHOTOMY. Fast is a
 *     commodity [^4]; unobservant is the trade default, since a commercial
 *     printer inspects print quality and does not audit the client's rights.
 *     Third branch — normal speed, supplied artwork, print-quality proof only —
 *     requires no anomaly. Consequence: the vendor's ordinariness is not a gap in
 *     the evidence, it IS the evidence that impersonation was authored upstream.
 *
 * F4  Kickback, or the printer was ok with the reproduction. SPLIT.
 *     F4a kickback (0.03): a printer paying its own customer is a rebate; it is
 *     bribery only if concealed from a principal, which requires a consultant
 *     ordering on a payer's behalf. Penal Code ch. 36 provisions returned by
 *     search govern PUBLIC SERVANTS [^6]; the private commercial-bribery
 *     offense was NOT verified and must not be cited by section. The claim is
 *     checkable without the printer: quote vs invoice vs payment.
 *     F4b knowing facilitation (0.10): requires knowledge, not approval. A vendor
 *     printing supplied art under a standard warranty of rights is not complicit.
 *     Evidence would be a proof visibly bearing another organisation's marks plus
 *     an internal admission — and the signed proof approval cuts both ways,
 *     because it proves the CLIENT authorised the reproduction.
 *
 * Reality Relation: interpretation, fictionalizationDegree 0.25 — forensic and
 * postal facts are documentary; the credences and the production-model inversion
 * are the compiler's.
 */

const UNIVERSE_ID = createHistoricalUniverseId('texas_mailer_trace_and_vendor', '2026');

const SOLO_ID = 'history:texas_mailer_solo_limit:2026';
const KPI_ID = 'history:texas_mailer_kpi_and_signature:2026';
const AUTOMATION_ID = 'history:texas_mailer_automation_stack:2026';
const DISCOVERY_ID = 'history:texas_mailer_discovery_reach:2026';

const D = (y: number, m: number, d: number): bigint =>
  BigInt(Date.UTC(y, m - 1, d)) * 1_000_000n;

const DROP = D(2026, 10, 14);
const DECISION = D(2026, 10, 26);

interface TraceRoute {
  readonly model: string;
  readonly senderContact: 'none' | 'adhesive' | 'paper';
  readonly tracePossible: 'no' | 'yes';
  readonly discriminates: string;
}

const ROUTES: readonly TraceRoute[] = [
  {
    model: 'permit imprint, machine-inserted, window envelope',
    senderContact: 'none',
    tracePossible: 'no',
    discriminates: 'Absence proves nothing; requesting trace evidence here betrays unfamiliarity with production',
  },
  {
    model: 'stamps affixed by hand',
    senderContact: 'adhesive',
    tracePossible: 'yes',
    discriminates: 'Print or DNA on the stamp, per piece [^13] — but mixture risk from postal handling [^7]',
  },
  {
    model: 'hand-addressed',
    senderContact: 'paper',
    tracePossible: 'yes',
    discriminates: 'Best substrate in the chain; would falsify the seven-of-eight automation finding',
  },
];

export const texasMailerTraceAndVendorUniverse = {
  universeId: UNIVERSE_ID,
  type: UniverseType.HISTORICAL_EVENT,

  identifiers: {
    primary: 'history:texas_mailer_trace_and_vendor:2026',
    aliases: [
      'was there DNA on the mailers',
      'did the printer have time to review',
      'was the printer paid off',
      'why rush service does not skip proofing',
    ],
  },

  realityRelation: {
    type: 'interpretation',
    fictionalizationDegree: 0.25,
    realityAnchors: [
      {
        realEventId: 'analysis:forensic_trace_on_paper:2026',
        relationshipType: 'documents',
        confidence: 0.9,
        evidence: [
          'Historic latent marks recoverable on old paper [^11]',
          'Porous-surface reagent sequences evaluated [^5]',
          'Envelope DNA extraction and seal separation [^12]',
          'Stamp examination combined dactyloscopic and DNA [^13]',
        ],
      },
      {
        realEventId: 'case:us_v_sayoc:2018',
        relationshipType: 'documents',
        confidence: 0.95,
        evidence: [
          'Latent print from one envelope containing an IED [^14]',
          'DNA linked to the suspect from ten devices [^15]',
          'Both vectors worked on hand-packed, hand-addressed mail',
        ],
      },
      {
        realEventId: 'analysis:postal_cross_contamination:2026',
        relationshipType: 'documents',
        confidence: 0.9,
        evidence: [
          'Cross-contamination during tray, bin, bag and route handling [^7]',
        ],
      },
      {
        realEventId: 'analysis:direct_mail_production_timelines:2026',
        relationshipType: 'documents',
        confidence: 0.85,
        evidence: [
          'Proof in 24-48 hours [^2]',
          '48-hour print-and-mail to USPS handoff [^4]',
          'EDDM 3-5 business days; Marketing Mail 5-7 [^17]',
          'Conventional timeline 10-18 business days [^10]',
          'Milestone schedules name assumed proof-approval time [^9]',
        ],
      },
      {
        // The year is the code's effective date (1 Jan 1974), not a claim about when the
        // section the anchor cites was last amended.
        realEventId: 'legal:texas_penal_code_ch36:1974',
        relationshipType: 'documents',
        confidence: 0.6,
        evidence: [
          'Ch. 36 provisions surfaced govern public servants [^6]',
          'UNVERIFIED: the private commercial-bribery section was not confirmed in this round',
        ],
      },
    ],
  },

  attribution: {
    public_domain: false,
    sources: ['Forensic literature on paper substrates', 'FBI remarks in US v. Sayoc', 'Postal and print-industry scheduling sources', 'Prior modules'],
    citations_required: true,
    usage_restrictions: [
      'All credences are the compiler\'s judgement and are not measurements. They must not be presented as frequencies.',
      'No claim that any offense was committed. F4a names a possible offense in the abstract.',
      'The Sayoc comparison is about forensic feasibility on mailed items, not about the character of any party here.',
      'Do not cite a Texas commercial-bribery section number: it was not verified.',
    ],
  },

  layers: [
    {
      layerId: 'trace_feasibility',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:trace_evidence_feasibility:2026',
        accuracy: 0.35,
        deviations: [
          'Assumes the pieces are still available and unaltered; the recipient broadcast from them, which implies handling.',
          'Mixture interpretation depends on contributor numbers and DNA quantity, neither measured.',
          'Treats "no charged offense" as dispositive for lab access, which is true for public labs and not for private ones.',
        ],
      },
      epochs: {
        delivery: {
          epochId: 'history:trace:delivery',
          startTime: DROP,
          endTime: D(2026, 10, 19),
          precision: TimePrecision.DAY,
          description: 'Delivery window in which postal handling deposited any incidental DNA.',
        },
        custody_lost: {
          epochId: 'history:trace:custody_lost',
          startTime: D(2026, 10, 19),
          endTime: DECISION,
          precision: TimePrecision.DAY,
          description: 'From first recipient handling onward: no chain of custody exists or can be reconstructed.',
        },
      },
    },
    {
      layerId: 'vendor_schedule',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:production_schedule:2026',
        accuracy: 0.45,
        deviations: [
          'Turnaround figures are vendor advertisements, not contracts for this job.',
          'Assumes a commercial lettershop; a fully in-house or retail-stamp branch has no comparable schedule.',
          'The claim that proof-approval time is not compressible is an inference from liability logic, not a measured property.',
        ],
      },
      epochs: {
        production: {
          epochId: 'history:vendor:production',
          startTime: DROP,
          endTime: DECISION,
          precision: TimePrecision.DAY,
        },
      },
    },
    {
      layerId: 'vendor_posture',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:vendor_intent:2026',
        accuracy: 0.2,
        deviations: [
          'Assigns probabilities to states of mind with no direct evidence of any of them.',
          'The rebate-versus-bribe distinction depends on whether a principal existed, which is unknown.',
          'Treats trade practice as uniform; a small shop may have no formal proof process at all.',
        ],
      },
      epochs: {
        assessment: {
          epochId: 'history:vendor:assessment',
          startTime: DECISION,
          endTime: DECISION,
          precision: TimePrecision.DAY,
        },
      },
    },
  ],

  temporalStructure: {
    segments: [
      { id: 'production', start: DROP, end: D(2026, 10, 19), type: 'phase', status: 'active' },
      { id: 'post_delivery', start: D(2026, 10, 19), end: DECISION, type: 'phase', status: 'active' },
      { id: 'assessment', start: DECISION, end: DECISION, type: 'phase', status: 'active' },
    ],
    keyframes: [
      {
        id: 'f1_trace_is_a_production_test',
        timestamp: DECISION,
        significance: 1.0,
        certainty: 0.85,
        tags: ['F1', 'inversion', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The trace question is not an identity test, it is a production-model test. Presence proves the sender touched that specific piece; absence proves nothing, because a permit-imprint window envelope is never touched by the sender. So the observation discriminates permit-imprint/machine-inserted from hand-stamped/hand-addressed — which is the open branch from the previous round — using the artifact rather than the printer\'s records. One-directional, like the registration floor.',
      },
      {
        id: 'f1_custody_failure',
        timestamp: D(2026, 10, 19),
        significance: 0.95,
        certainty: 0.9,
        tags: ['F1', 'custody', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The failure is custodial, not scientific. By the time any analyst could see a piece it had passed through sorting, carriage, a mailbox and a broadcast studio. Bulk mail cross-contaminates in trays, bins and bags within a short period [^7]; low-template mixtures are the weakest evidence class [^16]; ninhydrin reduces downstream DNA recovery [^8]. Mail cover records only the outside of a mailpiece and is prospective [^1], so it cannot be applied after delivery.',
      },
      {
        id: 'f1_sayoc_contrast',
        timestamp: DECISION,
        significance: 0.8,
        certainty: 0.9,
        tags: ['F1', 'precedent'],
        type: KeyframeType.MILESTONE,
        description:
          'The strongest precedent cuts the other way in its facts: Sayoc\'s print came off one envelope [^14] and his DNA off ten devices [^15], on mail he personally packed and addressed. It proves the vectors work on mailed items; it also shows what they require — individual, manual contact. Its success is evidence that the trace route is a manual-production route.',
      },
      {
        id: 'f2_speed_is_a_product',
        timestamp: DECISION,
        significance: 1.0,
        certainty: 0.9,
        tags: ['F2', 'refutation', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'Rush service is a priced SKU, not a skipped step: proofs in 24-48 hours [^2], 48-hour print-and-mail [^4], EDDM in 3-5 business days [^17], against a conventional 10-18 business day timeline [^10]. Vendors name proof-approval time as a scheduled dependency [^9]. Schedule pressure propagates backward from the drop date and compresses the client\'s drafting, not the vendor\'s liability control.',
      },
      {
        id: 'f2_artwork_provenance',
        timestamp: DECISION,
        significance: 1.0,
        certainty: 0.8,
        tags: ['F2', 'mechanism', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The mechanism is provenance, not speed. Supplied camera-ready files are proofed for colour, registration, stock and trim — not for the client\'s right to reproduce another organisation\'s marks. That written division of responsibility is how a stolen identity prints without anyone approving it AS an identity claim. Testable in the job ticket: does it show supplied artwork or in-house composition.',
      },
      {
        id: 'f3_ordinary_vendor',
        timestamp: DECISION,
        significance: 0.85,
        certainty: 0.75,
        tags: ['F3', 'dissolution'],
        type: KeyframeType.MILESTONE,
        description:
          'Neither branch of the half-postulate requires an anomaly. Fast is purchasable [^4]; unobservant is the trade default because printers inspect output, not rights. Normal speed plus supplied artwork plus a print-quality proof requires no special assumption. Therefore the vendor\'s ordinariness is not an evidential gap — it is the positive evidence that impersonation was authored upstream of the vendor.',
      },
      {
        id: 'f4a_price_signature',
        timestamp: DECISION,
        significance: 0.7,
        certainty: 0.6,
        tags: ['F4a', 'kickback'],
        type: KeyframeType.MILESTONE,
        description:
          'A printer paying its own customer is a rebate. It becomes bribery only when concealed from a principal, which requires a consultant ordering on a payer\'s behalf. The claim is testable without the printer: quote, invoice and payment instrument, compared. Divergence between quoted and invoiced totals is the signature. Texas ch. 36 provisions surfaced govern public servants [^6]; the private commercial-bribery section was not verified and must not be cited.',
      },
      {
        id: 'f4b_proof_cuts_both_ways',
        timestamp: DECISION,
        significance: 0.8,
        certainty: 0.7,
        tags: ['F4b', 'facilitation', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'Knowing facilitation needs knowledge, not approval. A vendor printing supplied art under a standard warranty of rights is a vendor, not an accomplice. The signed proof approval is the document that would carry complicity — and it cuts both ways, because a signature on that proof establishes that the CLIENT authorised reproduction of the marks. First document to read, whichever branch you are testing.',
      },
    ],
    windows: { strategy: 'phase_based' },
  },

  metadata: {
    canonicalName: 'Trace and Vendor: four postulates on physical evidence, schedule, and posture',
    creators: ['Compiled analysis'],
    released: new Date('2026-10-26T00:00:00Z'),
    cultural_significance: 0.15,
    platform: 'Local Time universe system',
    externalId: 'texas_mailer_trace_and_vendor_2026',
    contentType: 'postulate audit / forensic feasibility',
    traceRoutes: ROUTES,
    credences: {
      'F1_usable_trace_evidence': 0.02,
      'F2_no_time_for_review_as_stated': 0.05,
      'F2_compressed_client_process_and_supplied_art': 0.70,
      'F3_vendor_anomalous': 0.10,
      'F4a_kickback': 0.03,
      'F4b_printer_knowing_facilitation': 0.10,
    },
    credenceMovers: {
      'F1_up': 'Any piece observed hand-addressed, hand-stamped, or in a non-window envelope',
      'F1_down': 'Any piece observed with a permit imprint and a window — closes the route entirely',
      'F2_up': 'Job ticket showing in-house composition from a written brief, i.e. vendor authored the layout',
      'F2_down': 'Job ticket showing supplied print-ready artwork and a print-quality-only proof',
      'F3_down': 'Milestone schedule matching the advertised standard against a normal drop date',
      'F4a_up': 'Invoice total above or below the quote, or an off-invoice credit from printer to a consultant',
      'F4b_up': 'A proof visibly bearing TENT marks plus a note or admission the vendor recognised them',
    },
    documentRequests: [
      'From lettershop: job ticket distinguishing supplied artwork from in-house composition',
      'From lettershop: the proof actually approved, and whether it was a content proof or a print-quality proof',
      'From lettershop: milestone schedule showing the assumed proof-approval date against the actual one',
      'From the payer or operator: quote, invoice and payment instrument, compared for divergence',
      'From the recipient: the physical piece, unbagged if possible, if any trace question is ever pursued',
    ],
    ticketDeltas: [
      'discovery_reach: add the artwork-provenance request; it replaces "who reviewed it" with "who authored the layout"',
      'automation_stack: the 7-of-8 finding gains an independent test — hand-addressed or hand-stamped pieces would falsify it',
      'solo_limit: the trace route is a production-model test, not a headcount test; cross-reference, do not merge',
      'operator_profile: record that the vendor posture is expected to be ordinary and that ordinariness is evidence, not absence of evidence',
      'five_postulates: retire "no time for review" and replace with "compressed client drafting, supplied artwork"',
    ],
    uncertaintyNotes: [
      'No piece has been examined. Every forensic statement here is about feasibility classes, not about these envelopes.',
      'Turnaround figures are vendor marketing, not contract terms for this mailing, and rush availability varies by shop.',
      'The claim that a rush job never skips proofing is an inference from liability logic; small shops do print supplied art unreviewed.',
      'The Texas commercial-bribery section number was not verified this round and is deliberately omitted.',
      'The credences are judgements. Two of them (0.02, 0.03) express near-exclusion, and near-exclusion is the claim most likely to be wrong once a physical piece is seen.',
    ],
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.US_HISTORY, CommonUniverseIds.US_GOVERNMENT],
    },
    references: [
      {
        type: 'DERIVES_FROM',
        targetUniverseId: SOLO_ID,
        description:
          'The two-entity floor that makes a vendor the second entity.',
      },
      {
        type: 'DOCUMENTS',
        targetUniverseId: KPI_ID,
        description:
          'The KPI line the physical-evidence routes discriminate.',
      },
      {
        type: 'CORRECTS',
        targetUniverseId: AUTOMATION_ID,
        description:
          'Corrects the automation reading on artwork provenance.',
      },
      {
        type: 'SUPERSEDES',
        targetUniverseId: DISCOVERY_ID,
        description:
          'Replaces the discovery claim with vendor-side route evidence.',
      },
    ],
  },
} as unknown as Universe;

/** All universes this module owns. */
export const texasMailerTraceAndVendorUniverses: Universe[] = [
  texasMailerTraceAndVendorUniverse,
];
