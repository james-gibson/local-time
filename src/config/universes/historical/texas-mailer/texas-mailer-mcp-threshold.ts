import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../../core/types';
import { CommonUniverseIds } from '../../../../core/common-universe-ids';
import { createHistoricalUniverseId } from '../../../../core/universe-ids';

/**
 * "MCP Threshold" — counter-postulate: API literacy was conflated with
 * competence and with liveness; a model can write a one-shot integration.
 *
 * VERDICT: UPHELD, AND STRONGER THAN STATED. The counter-postulate understates
 * the position: no integration is written. MCP servers are dropped in as tools.
 *   - Lob exposes 49 tools to an agent [^3]; Composio ships Lob MCP for
 *     Claude, ChatGPT and Cursor [^5][^4].
 *   - Thanks.io: REST API, MCP server, OpenAPI spec, webhooks [^2].
 *   - Sendoso MCP beta, June 2026 [^6]; Mailstream markets itself as "the
 *     first MCP server for physical mail" [^f58bb2#5].
 *   - Mailstream: "three lines of code, or one MCP call" [^f58bb2#28];
 *     "from prompt to postcard in 24 hours" [^f58bb2#7].
 *   - Lob marketing describes an agent that identified accounts, wrote copy,
 *     designed creative and mailed with "zero human intervention" [^7].
 *
 * THREE CONCESSIONS (see metadata.concessions)
 *   C1 The software axis of the expertise_axis two-axis model does no work.
 *      Collapse it. The developer-first-mailer cell dissolves.
 *   C2 The "maintenance burden" argument is refuted: vendors version their MCP
 *      servers, run sandbox by default, supply idempotency keys and verbose
 *      errors [^1]. Maintenance is an SLA, not an operator skill.
 *   C3 The novice's paradox is void. There is no expert-only route to select.
 *
 * WHAT SURVIVES — THE SEAM RELOCATED, NOT REMOVED
 *   Authorization of the spend. PostalForm's MCP flow returns a checkout_url and
 *   "nothing is printed or mailed until the sender reviews and pays"
 *   [^8572de#9]; step 5 is "require approval before opening checkout or
 *   completing payment" [^8572de#40]; FAQ: an agent "can create the draft and
 *   preview, then a human can review and pay" [^8572de#97]. Machine payment
 *   (x402/MPP) exists but is reserved for "an approved autonomous runtime with
 *   an explicit spend limit" [^8572de#21]. So the human persists as PAYER, not
 *   as author. Weaker than the original claim; that is the point of conceding.
 *
 * WHAT SURVIVES AND STRENGTHENS — SKU CONFORMITY
 *   Agent toolchains are MORE template-bound than REST. Mailstream's call passes
 *   front_template_id plus variables [^1]; the catalogue is three
 *   postcard sizes, letters up to six pages in a #10, handwritten cards
 *   [^1]. An agent working from a catalogue has LESS compositional
 *   freedom than a human with InDesign and a job shop. Bespoke multi-panel piece
 *   with photography and a resource directory still does not fit.
 *
 * COST TO THE USER'S OWN POSTULATES — THE REAL FINDING
 *   If a model can produce the integration, prior-mailer experience and API
 *   capability are no longer separable observations. Both postulates read a
 *   latent trait off a production choice; the counter-postulate strips that
 *   choice of information. Expert and novice now emit identical observables.
 *   P1 and P2 become UNFALSIFIABLE, which is worse than refuted.
 *
 * PRICE REVISION
 *   Mailstream wholesale: $0.64 postcard and $0.65 letter, postage included
 *   [^1][^f58bb2#114]; manufacturer-direct, no volume tiers
 *   [^f58bb2#135]. Against a permit piece at ~$0.45-0.55 all-in the delta is a
 *   dime, not a multiple. P2's "cheapest" reading moves UP; the earlier
 *   "platform pricing is disqualified on postage" claim is moderated.
 *
 * LIST EXCLUSION, SOFTENED AT ONE EDGE
 *   A list-side MCP exists for prospecting data [^8]. A machine-fetchable
 *   list is a PURCHASED list, which was already the branch that dissolves the
 *   rental exclusion. The exclusion survives for rentals; it was never a claim
 *   that rentals are the only kind of file.
 *
 * Reality Relation: interpretation, fictionalizationDegree 0.3 — platform
 * capability and approval defaults are documentary; the collapse argument and
 * credences are the compiler's.
 */

const UNIVERSE_ID = createHistoricalUniverseId('texas_mailer_mcp_threshold', '2026');

const EXPERTISE_ID = 'history:texas_mailer_expertise_axis:2026';
const API_PRICE_ID = 'history:texas_mailer_api_and_price:2026';
const SOLO_ID = 'history:texas_mailer_solo_limit:2026';
const TRACE_ID = 'history:texas_mailer_trace_and_vendor:2026';
const AUTOMATION_ID = 'history:texas_mailer_automation_stack:2026';
const DISCOVERY_ID = 'history:texas_mailer_discovery_reach:2026';

const D = (y: number, m: number, d: number): bigint =>
  BigInt(Date.UTC(y, m - 1, d)) * 1_000_000n;

const DROP = D(2026, 10, 14);
const DECISION = D(2026, 10, 26);

/** What each MCP-era capability removes or preserves. */
interface Capability {
  readonly id: string;
  readonly removed: string;
  readonly preserved: string;
  readonly evidence: string;
}

const CAPABILITIES: readonly Capability[] = [
  {
    id: 'mcp_drop_in_tools',
    removed: 'The integration itself; no code is authored',
    preserved: 'Account ownership, funding, and the spend decision',
    evidence: 'Lob 49 tools [^3]; Thanks.io REST+MCP [^2]; "three lines of code, or one MCP call" [^f58bb2#28]',
  },
  {
    id: 'hosted_checkout',
    removed: 'The need to hold API credentials at all',
    preserved: 'A human reviewing a rendered preview and paying [^8572de#9][^8572de#97]',
    evidence: 'PostalForm draft → checkout_url → approval before payment [^8572de#40]',
  },
  {
    id: 'machine_payment',
    removed: 'The required human at the payment step',
    preserved: 'An "approved autonomous runtime with an explicit spend limit" [^8572de#21] — i.e. a human who set the limit',
    evidence: 'x402 / MPP paths, gated by approval',
  },
  {
    id: 'template_catalogue',
    removed: 'Layout and composition work',
    preserved: 'The SKU grid: three postcard sizes, letter ≤6pp in #10, handwritten cards [^1]',
    evidence: 'front_template_id + variables [^1]',
  },
];

export const texasMailerMcpThresholdUniverse = {
  universeId: UNIVERSE_ID,
  type: UniverseType.HISTORICAL_EVENT,

  identifiers: {
    primary: 'history:texas_mailer_mcp_threshold:2026',
    aliases: [
      'could an AI agent have sent this mailing',
      'is API literacy a barrier in 2026',
      'does anyone still have to write the integration',
      'did the human only authorize the spend',
    ],
  },

  realityRelation: {
    type: 'interpretation',
    fictionalizationDegree: 0.3,
    realityAnchors: [
      {
        realEventId: 'analysis:mcp_print_mail_tooling:2026',
        relationshipType: 'documents',
        confidence: 0.85,
        evidence: [
          'Lob MCP server exposing 49 tools [^3]',
          'Lob MCP via Composio for Claude, ChatGPT, Cursor [^5][^4]',
          'Thanks.io REST API, MCP server, OpenAPI, webhooks [^2]',
          'Sendoso MCP beta from June 2026 [^6]',
          'Mailstream: first MCP server for physical mail [^f58bb2#5]',
          'Agent mailer with "zero human intervention" described in Lob marketing [^7]',
        ],
      },
      {
        realEventId: 'analysis:agent_mail_approval_defaults:2026',
        relationshipType: 'documents',
        confidence: 0.9,
        evidence: [
          'Nothing printed or mailed until the sender reviews and pays [^8572de#9]',
          'Require approval before opening checkout or completing payment [^8572de#40]',
          'Agent creates draft and preview; a human reviews and pays [^8572de#97]',
          'Machine payment reserved for approved runtimes with spend limits [^8572de#21]',
        ],
      },
      {
        realEventId: 'analysis:mcp_print_catalogue:2026',
        relationshipType: 'documents',
        confidence: 0.85,
        evidence: [
          'front_template_id plus variables in the example call [^1]',
          'Three postcard sizes, letters ≤6pp in #10, handwritten cards [^1]',
          'Wholesale $0.64 postcard / $0.65 letter, postage included [^1][^f58bb2#114]',
          'Sandbox default, idempotency keys, versioned API [^1]',
        ],
      },
    ],
  },

  attribution: {
    public_domain: false,
    sources: ['MCP tool directories and vendor product pages', 'Vendor approval-flow documentation', 'Prior modules'],
    citations_required: true,
    usage_restrictions: [
      'No vendor is identified as the one used. All capability claims are market structure.',
      'MCP directories aggregate third-party wrappers; a listed tool is not evidence the vendor endorses agentic ordering.',
      'Marketing pages describe capability, not incidence. How often agents actually complete mail orders is unknown here and is not inferred.',
      'Credences are judgements, not frequencies.',
    ],
  },

  layers: [
    {
      layerId: 'capability_frontier',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:mcp_mail_capability:2026',
        accuracy: 0.6,
        deviations: [
          'Reads vendor marketing as capability. Launch pages overstate; several of these tools are wrappers around a single REST API and may be thin.',
          'Treats MCP availability as uniform across vendors when the mature integrations are concentrated in a handful.',
          'Ignores the possibility that a platform\'s manual review would refuse a job that an agent drafted.',
        ],
      },
      epochs: {
        tooling: {
          epochId: 'history:mcp:tooling',
          startTime: D(2025, 6, 1),
          endTime: DECISION,
          precision: TimePrecision.DAY,
          description: 'MCP print-and-mail tooling predates the drop by roughly a year.',
        },
      },
    },
    {
      layerId: 'authorization_seam',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:approval_defaults:2026',
        accuracy: 0.7,
        deviations: [
          'Assumes the operator used a vendor with a hosted-checkout default. A direct REST account with stored payment would put no human at the payment step at all.',
          'A spend-limit machine-payment runtime is "approved autonomy," which is a human decision made once and then absent — a category the model handles poorly.',
        ],
      },
      epochs: {
        authorization: {
          epochId: 'history:mcp:authorization',
          startTime: DROP,
          endTime: DECISION,
          precision: TimePrecision.DAY,
        },
      },
    },
    {
      layerId: 'sku_grid',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:catalogue_conformity:2026',
        accuracy: 0.65,
        deviations: [
          'Infers the artifact\'s incompatibility with catalogue SKUs from a description of the piece, not from the file itself.',
          'A sufficiently capable agent with an HTML-to-PDF step could compose outside a template grid on some platforms; the constraint is commercial, not always technical.',
        ],
      },
      epochs: {
        production: {
          epochId: 'history:mcp:production',
          startTime: DROP,
          endTime: DECISION,
          precision: TimePrecision.DAY,
        },
      },
    },
  ],

  temporalStructure: {
    segments: [
      { id: 'tooling', start: D(2025, 6, 1), end: DROP, type: 'phase', status: 'active' },
      { id: 'drop', start: DROP, end: DECISION, type: 'phase', status: 'active' },
      { id: 'assessment', start: DECISION, end: DECISION, type: 'phase', status: 'active' },
    ],
    keyframes: [
      {
        id: 'counter_upheld',
        timestamp: DECISION,
        significance: 1.0,
        certainty: 0.9,
        tags: ['counter_postulate', 'concession', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The counter-postulate is upheld and understates its own case. No integration is authored: MCP tools are dropped in — Lob exposes 49 tools [^3], Thanks.io ships REST plus MCP [^2], Mailstream advertises "three lines of code, or one MCP call" [^f58bb2#28]. The software axis of the expertise model does no work and is removed.',
      },
      {
        id: 'liveness_relocated',
        timestamp: DECISION,
        significance: 0.95,
        certainty: 0.8,
        tags: ['liveness', 'authorization', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The human moved rather than left. PostalForm returns a checkout_url and nothing mails until the sender reviews and pays [^8572de#9]; approval before payment is step 5 [^8572de#40]; the FAQ says the agent drafts and a human reviews and pays [^8572de#97]. Machine payment requires "an approved autonomous runtime with an explicit spend limit" [^8572de#21] — approved by whom. The surviving human function is AUTHORIZATION OF SPEND, not authorship of code.',
      },
      {
        id: 'maintenance_argument_refuted',
        timestamp: DECISION,
        significance: 0.8,
        certainty: 0.85,
        tags: ['concession', 'maintenance'],
        type: KeyframeType.MILESTONE,
        description:
          'The "someone must keep the bridge alive" argument is refuted on the vendor\'s own page: versioned MCP updates, sandbox by default, idempotency keys, verbose errors with fix hints [^1]. Maintenance is an SLA line item, not an operator competence. Retire the argument.',
      },
      {
        id: 'sku_grid_tightens',
        timestamp: DECISION,
        significance: 0.9,
        certainty: 0.75,
        tags: ['sku', 'artifact', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'Agent toolchains are MORE template-bound than REST. The example call passes front_template_id and variables [^1]; the catalogue is three postcard sizes, letters ≤6pp in a #10, handwritten cards [^1]. An agent composing from a catalogue has less compositional freedom than a human with InDesign and a job shop. The bespoke piece still fails the grid — so artifact evidence keeps pointing away from the platform path even after the concession.',
      },
      {
        id: 'postulates_lose_diagnostic_power',
        timestamp: DECISION,
        significance: 1.0,
        certainty: 0.85,
        tags: ['P1', 'P2', 'unfalsifiable', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'THE REAL COST. If a model produces the integration, prior-mailer experience and API capability are no longer separable observations. Both postulates read a latent trait off a production choice; the counter-postulate strips that choice of information. Expert and novice emit identical observables, so the pair cannot be tested even in principle. Unfalsifiable is worse than refuted.',
      },
      {
        id: 'price_delta_moderated',
        timestamp: DECISION,
        significance: 0.8,
        certainty: 0.8,
        tags: ['P2', 'pricing', 'revision'],
        type: KeyframeType.MILESTONE,
        description:
          'Mailstream wholesale is $0.64 postcard and $0.65 letter, postage included, manufacturer-direct with no volume tiers [^1][^f58bb2#114][^f58bb2#135]. Against a permit piece at roughly $0.45-0.55 all-in the delta is a dime, not a multiple. The earlier "platform pricing is disqualified on postage" claim is moderated; P2\'s cheapest reading moves up.',
      },
    ],
    windows: { strategy: 'phase_based' },
  },

  metadata: {
    canonicalName: 'MCP Threshold: the integration barrier dissolved, the authorization seam survived',
    creators: ['Compiled analysis'],
    released: new Date('2026-10-26T00:00:00Z'),
    cultural_significance: 0.2,
    platform: 'Local Time universe system',
    externalId: 'texas_mailer_mcp_threshold_2026',
    contentType: 'counter-postulate audit / capability revision',
    capabilities: CAPABILITIES,
    concessions: [
      'C1 software literacy is not a barrier to API mailing — removed, 0.75 → 0.10',
      'C2 maintenance burden refuted — removed, 0.60 → 0.15',
      'C3 novice\'s paradox void: no expert-only route exists to be selected',
      'C4 postage-gap claim moderated: delta is ~$0.10, not a multiple',
    ],
    credences: {
      'software_literacy_is_barrier': 0.10,
      'operator_must_maintain_integration': 0.15,
      'human_authorizes_the_spend': 0.80,
      'P1_and_P2_remain_discriminating': 0.10,
      'artifact_fits_catalogue_sku': 0.15,
      'order_placed_programmatically': 0.25,
      'list_side_mcp_permits_rental_exclusion_to_hold': 0.60,
    },
    deciderDocuments: [
      'Platform subscription start date — a $99/mo plan opened days before a one-off drop is a first-timer signature [^f58bb2#204]',
      'Sandbox-to-production transition timestamp, if any platform was used [^1]',
      'Template id used, or absence of one — a template id proves catalogue composition; a bespoke file proves otherwise',
      'Idempotency keys on the order, which indicate programmatic retry logic rather than human double-clicks [^1]',
      'Checkout_url issuance and payment timestamp pair, which locates the authorization seam in time [^8572de#9]',
      'Whether a spend limit was configured, and by whom, on any machine-payment runtime [^8572de#21]',
    ],
    ticketDeltas: [
      'expertise_axis: retire the software axis and the novice\'s paradox; the model is now one-dimensional and weaker for it',
      'api_and_price: the postage disqualifier is downgraded to a ~$0.10 delta; the SKU disqualifier is upgraded to primary',
      'automation_stack: agent-order capability now exists; the 7-of-8 finding is unchanged but its eighth seam is the payment authorization',
      'discovery_reach: add the subscription-start and sandbox-flip requests — they date the operator\'s entry into the platform',
      'solo_limit: the two-entity floor is untouched by MCP; software supply does not supply a permit or a list licence',
    ],
    uncertaintyNotes: [
      'MCP directories list third-party wrappers. A tool being available is not evidence it was used, nor that the vendor sanctions it for this kind of content.',
      'Vendor pages describe capability and defaults, not incidence. Nothing here establishes how often agents complete a mail order with no human at payment.',
      '"Approved autonomous runtime with an explicit spend limit" [^8572de#21] is a category the human/agent dichotomy handles badly: a human decided once and is then absent.',
      'The SKU argument is commercial rather than absolute. Some platforms accept arbitrary PDFs, which would let an agent compose outside the template grid.',
      'The 0.25 on programmatic ordering is the least stable figure in the series; it moves with the artifact description, not with the market.',
    ],
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.US_HISTORY, CommonUniverseIds.US_GOVERNMENT],
    },
    references: [
      {
        type: 'CORRECTS',
        targetUniverseId: EXPERTISE_ID,
        description:
          'Collapses the software axis of the two-axis model.',
      },
      {
        type: 'CORRECTS',
        targetUniverseId: API_PRICE_ID,
        description:
          'Corrects the API-barrier reading with shipped MCP servers.',
      },
      {
        type: 'DOCUMENTS',
        targetUniverseId: SOLO_ID,
        description:
          'The two-entity floor that survives the correction.',
      },
      {
        type: 'DERIVES_FROM',
        targetUniverseId: TRACE_ID,
        description:
          'The vendor-side evidence the MCP finding extends.',
      },
      {
        type: 'SUPERSEDES',
        targetUniverseId: AUTOMATION_ID,
        description:
          'Replaces the maintained-integration claim.',
      },
      {
        type: 'SUPERSEDES',
        targetUniverseId: DISCOVERY_ID,
        description:
          'Replaces the discovery claim with tool availability.',
      },
    ],
  },
} as unknown as Universe;

/** All universes this module owns. */
export const texasMailerMcpThresholdUniverses: Universe[] = [
  texasMailerMcpThresholdUniverse,
];
