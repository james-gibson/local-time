import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../../core/types';
import { CommonUniverseIds } from '../../../../core/common-universe-ids';
import { createHistoricalUniverseId } from '../../../../core/universe-ids';

/**
 * "API and Price" — two postulates about the vendor, tested against the vendor market.
 *
 * P1  If agent-driven, the printer had a clean API or equivalent.
 *     SPLIT. Two requirements are conflated:
 *       A. ASYNC COMPLETION — order placed without a vendor human replying.
 *       B. SKU CONFORMITY  — artifact fits a catalogue product (postcard, letter,
 *          self-mailer, fixed size and weight) [^1].
 *     The population satisfying A exists: Stannp's API gives programmatic access
 *     to a bulk mailer account, configures campaigns, and triggers pieces
 *     [^3], accepting a whole list as CSV/XLS by binary, base64 or URL
 *     [^4]; a political vertical is an explicit product line [^1].
 *     BUT that vertical's enumerated use cases are all first-person advocacy —
 *     candidate introduction, policy, events, turnout, absentee, thank-yous
 *     [^1] — with voter name/precinct/polling personalization
 *     [^1][^1]. The taxonomy assumes a campaign speaking
 *     as itself. Impersonation is not a SKU.
 *     AND the vendors institutionalise the approval gate rather than removing it:
 *     "once approved and ordered, we'll print and ship... the next working day"
 *     [^ab0496#75]; out within 24 business hours "once the design has been
 *     finalized" [^ab0496#253]. Independent confirmation of F2's refutation.
 *
 * P1-CONTRADICTION (the round's key finding)
 *     An API order requires the operator to UPLOAD the recipient file [^4].
 *     List rental is a single-use licence: the renter acquires no ownership and no
 *     right beyond one use [^9]; names may not be duplicated or distributed
 *     to a third party [^5]; owners embed seed names and decoys to detect
 *     reuse [^11][^8][^10].
 *     THEREFORE: API branch and rented-file branch are mutually exclusive.
 *       - API branch → operator possessed the data → not a standard rental
 *         (purchased, modelled, or co-op file). Vendor universe reopens.
 *       - Rental branch → names never touched the operator → order could not have
 *         gone through an API → P1 false.
 *     Decided by one record: who transmitted the recipient file, and to whom.
 *
 * P2  If agent-driven, the printer was the cheapest.
 *     REFUTED AS A SELECTOR FOR P1. Per-piece API pricing starts at $0.905
 *     postcard / $0.828 letter [^6], print-and-post components $0.48 / $0.69
 *     [^12], and Lob states plainly that it does not discount postage
 *     [^6]. Postage is the largest line in a bulk drop and the permit-imprint
 *     route exists to reduce it. Stannp offers tiered bulk pricing [^ab0496#265],
 *     which narrows but does not close the gap: tiering applies to the platform
 *     price, not to USPS's. So "cheapest" selects the job shop; "clean API"
 *     selects the platform; the two populations barely intersect.
 *
 * INVERSION 1 — the API path is the SURVEILLED path. An API vendor's record is a
 *   database row (account, key, campaign id, upload timestamp, idempotency key,
 *   payment token, source IP). A lettershop's record is a folder with a job
 *   ticket. Agent-optimisation leaves BETTER evidence. Whatever concealment this
 *   operation achieved came from being low-tech: human job shop, rented list.
 *
 * INVERSION 2 — the AUP is a SIGNED WARRANTY. Lob's AUP prohibits illegal,
 *   harmful or hate-group content [^7]; the terms place content legality
 *   entirely on the customer, who must ensure content is "appropriate and legal
 *   to mail" [^2]. Not a filter that catches impersonation — automated intake
 *   inspects neither trademark rights nor identity claims — but a written
 *   representation of rights, accepted at order time, stored, account-linked.
 *   Weaker on knowledge than a proof approval; stronger on deniability.
 *
 * NEW CUSTODIAN — the LIST OWNER. Seeds and decoys [^8][^10] mean the
 *   owner can detect reuse and holds the executed rental contract [^5],
 *   naming the licensee and the select criteria. Standing, documentation, and an
 *   active monitoring interest. Unapproached in six rounds.
 *
 * Reality Relation: interpretation, fictionalizationDegree 0.3 — vendor capability
 * and pricing are documentary; the mutual-exclusion argument and credences are the
 * compiler's.
 */

const UNIVERSE_ID = createHistoricalUniverseId('texas_mailer_api_and_price', '2026');

const SOLO_ID = 'history:texas_mailer_solo_limit:2026';
const TRACE_ID = 'history:texas_mailer_trace_and_vendor:2026';
const KPI_ID = 'history:texas_mailer_kpi_and_signature:2026';
const AUTOMATION_ID = 'history:texas_mailer_automation_stack:2026';
const DISCOVERY_ID = 'history:texas_mailer_discovery_reach:2026';

const D = (y: number, m: number, d: number): bigint =>
  BigInt(Date.UTC(y, m - 1, d)) * 1_000_000n;

const DROP = D(2026, 10, 14);
const DECISION = D(2026, 10, 26);

/** Vendor populations and which postulate each satisfies. */
interface Population {
  readonly id: string;
  readonly satisfiesAsync: boolean;
  readonly satisfiesSku: boolean;
  readonly satisfiesCheapest: boolean;
  readonly holdsList: boolean;
  readonly evidenceClass: 'database' | 'paper';
  readonly note: string;
}

const POPULATIONS: readonly Population[] = [
  {
    id: 'platform_api_transactional',
    satisfiesAsync: true,
    satisfiesSku: true,
    satisfiesCheapest: false,
    holdsList: true,
    evidenceClass: 'database',
    note: 'Per-piece pricing embeds postage at a rate a permit avoids [^6][^12]; requires operator to upload the file [^4]',
  },
  {
    id: 'platform_api_political_vertical',
    satisfiesAsync: true,
    satisfiesSku: true,
    satisfiesCheapest: false,
    holdsList: true,
    evidenceClass: 'database',
    note: 'Explicit political product line with tiered bulk pricing [^1][^ab0496#265]; taxonomy assumes first-person advocacy [^1]',
  },
  {
    id: 'trade_lettershop',
    satisfiesAsync: false,
    satisfiesSku: false,
    satisfiesCheapest: true,
    holdsList: true,
    evidenceClass: 'paper',
    note: 'Quote, proof, approval: three human round trips. Receives rented names direct from broker under single-use licence [^9][^5]',
  },
  {
    id: 'print_broker_reseller',
    satisfiesAsync: false,
    satisfiesSku: false,
    satisfiesCheapest: true,
    holdsList: false,
    evidenceClass: 'paper',
    note: 'Adds a resale layer; the broker may never see names, which weakens the list-side record',
  },
];

export const texasMailerApiAndPriceUniverse = {
  universeId: UNIVERSE_ID,
  type: UniverseType.HISTORICAL_EVENT,

  identifiers: {
    primary: 'history:texas_mailer_api_and_price:2026',
    aliases: [
      'did the agent order the printing',
      'was the printer the cheapest',
      'could an API mailer impersonate a nonprofit',
      'who uploaded the voter file',
    ],
  },

  realityRelation: {
    type: 'interpretation',
    fictionalizationDegree: 0.3,
    realityAnchors: [
      {
        realEventId: 'analysis:print_mail_api_platforms:2026',
        relationshipType: 'documents',
        confidence: 0.9,
        evidence: [
          'Programmatic access to a bulk mailer account; configure campaigns, feed data, trigger pieces [^3]',
          'List import as CSV/XLS by binary, base64 or URL [^4]',
          'Products: postcards, letters, self-mailers [^1]',
          'Political vertical with first-person advocacy use cases [^1]',
          'Approval gate retained: ships next working day "once approved and ordered" [^ab0496#75]',
        ],
      },
      {
        realEventId: 'analysis:print_mail_api_pricing:2026',
        relationshipType: 'documents',
        confidence: 0.85,
        evidence: [
          'Postcards from $0.905, letters from $0.828 [^6]',
          'Print and post components $0.48 and $0.69 [^12]',
          'Lob does not discount postage [^6]',
          'Tiered bulk pricing advertised for political volume [^ab0496#265]',
        ],
      },
      {
        realEventId: 'analysis:list_rental_norms:2026',
        relationshipType: 'documents',
        confidence: 0.95,
        evidence: [
          'Single-use licence; no ownership acquired [^9]',
          'Names may not be duplicated or distributed to a third party [^5]',
          'Seed names and decoy addresses detect unauthorized reuse [^11][^8][^10]',
        ],
      },
      {
        realEventId: 'analysis:print_mail_aup:2026',
        relationshipType: 'documents',
        confidence: 0.8,
        evidence: [
          'AUP prohibits illegal, harmful, hate-group content [^7]',
          'Customer solely responsible for legality and appropriateness of content [^2]',
        ],
      },
    ],
  },

  attribution: {
    public_domain: false,
    sources: ['Print-and-mail platform documentation and pricing', 'List-rental trade terms', 'Acceptable-use policies', 'Prior modules'],
    citations_required: true,
    usage_restrictions: [
      'No vendor is identified as the one used. Vendor capabilities are cited as market structure, not as evidence about this mailing.',
      'Pricing figures are list prices, not quotes, and do not include the volume tiers a large order would negotiate.',
      'The mutual-exclusion argument assumes a standard rental. A purchased or modelled file would dissolve it, and that possibility is live.',
      'Credences are judgements, not frequencies.',
    ],
  },

  layers: [
    {
      layerId: 'vendor_market',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:vendor_populations:2026',
        accuracy: 0.55,
        deviations: [
          'Four populations modelled; the real market has hundreds of shops with mixed capabilities, and hybrids exist (a lettershop with a web-to-print storefront).',
          'Treats "cheapest" as a per-piece comparison, ignoring that a shop may be cheapest on print and mid-market on postage.',
          'Assumes the political-vertical platforms would have accepted the job if asked; a manual review could have refused it before printing.',
        ],
      },
      epochs: {
        market: {
          epochId: 'history:api:market',
          startTime: D(2024, 1, 1),
          endTime: DECISION,
          precision: TimePrecision.DAY,
          description: 'Capability window; the platforms and their product lines predate the mailing.',
        },
      },
    },
    {
      layerId: 'list_custody',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:list_possession:2026',
        accuracy: 0.5,
        deviations: [
          'Infers licence terms from trade-standard rental practice, not from the contract actually used.',
          'A purchased file, a modelled file, or a cooperative data arrangement would make the operator a lawful possessor and dissolve the exclusion.',
        ],
      },
      epochs: {
        custody: {
          epochId: 'history:api:custody',
          startTime: D(2025, 1, 1),
          endTime: DROP,
          precision: TimePrecision.DAY,
        },
      },
    },
    {
      layerId: 'evidence_surface',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:record_class:2026',
        accuracy: 0.6,
        deviations: [
          'Assumes the platform retains request logs and payment tokens; retention periods vary and are often shorter than a litigation timeline.',
          'Contrasts database against paper as an ideal type; both shops keep email, and both can lose records.',
        ],
      },
      epochs: {
        retention: {
          epochId: 'history:api:retention',
          startTime: DROP,
          endTime: DECISION,
          precision: TimePrecision.DAY,
        },
      },
    },
  ],

  temporalStructure: {
    segments: [
      { id: 'capability', start: D(2024, 1, 1), end: DROP, type: 'phase', status: 'active' },
      { id: 'order', start: DROP, end: DECISION, type: 'phase', status: 'active' },
      { id: 'assessment', start: DECISION, end: DECISION, type: 'phase', status: 'active' },
    ],
    keyframes: [
      {
        id: 'p1_async_vs_sku',
        timestamp: DECISION,
        significance: 0.85,
        certainty: 0.8,
        tags: ['P1', 'decomposition'],
        type: KeyframeType.MILESTONE,
        description:
          'The postulate conflates async completion with SKU conformity. Async ordering exists and is used by political campaigns [^3][^1]; but the SKU catalogue — postcard, letter, self-mailer at fixed size and weight [^1] — is a product taxonomy in which the piece must fit. A bespoke multi-panel brochure with photographs and a resource directory fits a job shop, not a catalogue.',
      },
      {
        id: 'p1_approval_gate_confirmed',
        timestamp: DECISION,
        significance: 0.8,
        certainty: 0.85,
        tags: ['P1', 'F2', 'confirmation'],
        type: KeyframeType.MILESTONE,
        description:
          'The platform vendors confirm last round\'s refutation of F2 from their own marketing: mail ships "once approved and ordered" [^ab0496#75], within 24 business hours "once the design has been finalized" [^ab0496#253]. The approval gate is institutionalised, not compressed. Speed is a priced SKU; approval is a prerequisite.',
      },
      {
        id: 'p1_rental_exclusion',
        timestamp: DECISION,
        significance: 1.0,
        certainty: 0.9,
        tags: ['P1', 'list', 'key_finding', 'mutual_exclusion'],
        type: KeyframeType.MILESTONE,
        description:
          'THE ROUND\'S KEY FINDING. An API order requires uploading the recipient file [^4]. A rental forbids the renter from holding or distributing the names [^9][^5] and is enforced with seeds [^11][^8]. So the API branch and the rented-voter-file branch are mutually exclusive. If the API branch holds, the file was purchased, modelled or co-op and the vendor universe reopens. If the rental branch holds, P1 is false. One record decides: who transmitted the recipient file.',
      },
      {
        id: 'p2_postage_is_the_disqualifier',
        timestamp: DECISION,
        significance: 0.95,
        certainty: 0.85,
        tags: ['P2', 'pricing', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'Per-piece API pricing starts at $0.905 postcard / $0.828 letter [^6], and Lob does not discount postage [^6]. Postage is the largest line in a bulk drop and the permit route exists to cut it. Tiered bulk pricing [^ab0496#265] narrows the gap without closing it, because the tiering applies to the platform price, not to USPS\'s. "Cheapest" therefore selects the job shop while "clean API" selects the platform: two populations, not two properties of one vendor.',
      },
      {
        id: 'inversion_surveilled_path',
        timestamp: DECISION,
        significance: 0.9,
        certainty: 0.75,
        tags: ['inversion', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'If P1 is true, the operator left BETTER evidence. A platform record is a database row — account, key, campaign id, upload timestamp, idempotency key, payment token, source IP — while a lettershop record is a folder with a job ticket. Agent-optimisation is self-defeating as concealment. The corollary closes the series: whatever concealment this operation achieved came from being low-tech, a human job shop and a rented list.',
      },
      {
        id: 'inversion_aup_warranty',
        timestamp: DECISION,
        significance: 0.9,
        certainty: 0.75,
        tags: ['inversion', 'aup', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The AUP would not have caught the impersonation — automated intake inspects neither trademark rights nor identity claims. But accepting it is a written warranty of rights [^2][^7], machine-generated, timestamped, account-linked. Weaker than a proof approval on knowledge; stronger on deniability, because the orderer cannot claim they never represented a right to mail the content.',
      },
      {
        id: 'new_custodian_list_owner',
        timestamp: DECISION,
        significance: 0.9,
        certainty: 0.7,
        tags: ['custodian', 'list_owner', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'Seeds and decoys give the list owner both detection capability and an active monitoring interest [^8][^10]; the rental contract names the licensee and the select criteria [^5]. A custodian with standing, documentation, and independent records — unapproached in six rounds. They also hold the one fact that distinguishes targeting from accident: what was selected for.',
      },
    ],
    windows: { strategy: 'phase_based' },
  },

  metadata: {
    canonicalName: 'API and Price: two vendor postulates and the population they select',
    creators: ['Compiled analysis'],
    released: new Date('2026-10-26T00:00:00Z'),
    cultural_significance: 0.15,
    platform: 'Local Time universe system',
    externalId: 'texas_mailer_api_and_price_2026',
    contentType: 'postulate audit / vendor market structure',
    populations: POPULATIONS,
    credences: {
      'P1_as_stated': 0.15,
      'P1_agent_placed_order_programmatically': 0.10,
      'P1_human_placed_order_job_shop': 0.85,
      'P2_cheapest': 0.35,
      'P1_and_P2_jointly': 0.05,
    },
    deciderDocuments: [
      'Platform account record: registered entity, API key issuance date, campaign upload timestamp, source IP, payment token',
      'List-rental contract: licensee name, select criteria, permitted use count, ship-to destination (broker or lettershop)',
      'Lettershop job ticket: whether the recipient file arrived from the operator or from a broker',
      'List owner seed report: whether any decoy address received a piece, and how many times',
      'Terms-of-service acceptance record with timestamp, if any platform was used',
    ],
    ticketDeltas: [
      'discovery_reach: add the list owner as a custodian with standing; ask for the rental contract and the seed report',
      'discovery_reach: the "who uploaded the file" question replaces "which printer" as the first-order question',
      'automation_stack: the 7-of-8 finding holds, but the eighth seam is now doubly located — proof approval at the shop, and file transmission at the broker',
      'kpi_and_signature: the tiered-platform hypothesis is added to the vendor universe; platform pricing embeds postage, so a price below permit rate falsifies it',
      'trace_and_vendor: F2 refutation independently confirmed by platform marketing [^ab0496#75][^ab0496#253]',
    ],
    uncertaintyNotes: [
      'No platform is identified. All capability and pricing claims are market structure, not evidence about this mailing.',
      'The mutual exclusion assumes a standard single-use rental. A purchased, modelled, or co-op file makes the operator a lawful possessor and dissolves it — and that branch is live, not excluded.',
      'List prices are not quotes. A 10k+ order would negotiate, and a platform could in principle match a permit rate on print while losing on postage.',
      'Retention is the weak point of the surveilled-path argument: platform logs and payment tokens may be gone by the time process issues.',
      'A lettershop with a web-to-print storefront is a hybrid that satisfies neither postulate cleanly and is not modelled above.',
    ],
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.US_HISTORY, CommonUniverseIds.US_GOVERNMENT],
    },
    references: [
      {
        type: 'DERIVES_FROM',
        targetUniverseId: TRACE_ID,
        description:
          'The physical-evidence routes the vendor populations are read against.',
      },
      {
        type: 'CORRECTS',
        targetUniverseId: SOLO_ID,
        description:
          'Corrects the cost floor with advertised per-piece pricing.',
      },
      {
        type: 'DOCUMENTS',
        targetUniverseId: KPI_ID,
        description:
          'The KPI and signature reading of the artifact.',
      },
      {
        type: 'SUPERSEDES',
        targetUniverseId: AUTOMATION_ID,
        description:
          'Replaces the automation estimate with vendor price data.',
      },
      {
        type: 'SUPERSEDES',
        targetUniverseId: DISCOVERY_ID,
        description:
          'Replaces the discovery claim with a population read.',
      },
    ],
  },
} as unknown as Universe;

/** All universes this module owns. */
export const texasMailerApiAndPriceUniverses: Universe[] = [
  texasMailerApiAndPriceUniverse,
];
