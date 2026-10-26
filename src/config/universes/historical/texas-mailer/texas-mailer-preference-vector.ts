import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../../core/types';
import { CommonUniverseIds } from '../../../../core/common-universe-ids';
import { createHistoricalUniverseId } from '../../../../core/universe-ids';

/**
 * "Preference Vector" — observation: an autonomous agent and an inexperienced
 * mailer would look similar, while an experienced mailer would have preferences
 * or anti-preferences.
 *
 * VERDICT: RIGHT ABOUT THE ARTIFACT, WRONG ABOUT THE MECHANISM. The correction
 * SPLITS the two "similar" cases rather than merging them.
 *
 * F1  AGENTS DO NOT LACK PREFERENCES; THEY HOLD THE MEDIAN ONE.
 *     Post-training alignment reduces output diversity; the data-level driver is
 *     TYPICALITY BIAS — annotators systematically favour familiar, fluent,
 *     predictable text [^1][^2][^4]. Not an absence of preference
 *     but a specific one: the mode of the corpus.
 *     The print trade publishes the mode AS ADVICE: matte or satin aqueous
 *     coating is "the safest choice" for most direct mail, uncoated is "the most
 *     forgiving stock for addressing" [^5]; a 100 lb cover with an AQ surface
 *     "accept[s] inkjet printing and laser toner, making it the right choice for
 *     address panels" [^6]. "Safest choice" is mode-stated-as-guidance, so an
 *     agent trained on this literature selects the modal spec for the same reason
 *     a novice accepts the form default — by an entirely different route.
 *
 * F2  FOUR SIGNATURES, NOT THREE.
 *     novice   — vendor default; no justification; zero cost tolerance.
 *     agent    — corpus mode; articulate justification; zero cost tolerance.
 *     expert   — owned stance; personal justification; COHERENT AND OFF-MODE;
 *                pays to avoid.
 *     inherited— a copied spec sheet; appears off-mode; cites someone else.
 *     Row 4 is the confound.
 *
 * F3  ANTI-PREFERENCES ARE THE STRONG SIGNAL BECAUSE OF COST ASYMMETRY.
 *     A preference for a better option can be satisfied by an agent whose
 *     objective function spent the money — the agent did not choose to spend it.
 *     An anti-preference requires PAYING TO FORGO: rejecting a cheaper compliant
 *     option, often on unverifiable grounds ("never a window envelope").
 *     An agent will not pay to avoid unless a human wrote the avoidance into the
 *     brief; a novice does not know the thing exists. So A REJECTED CHEAPER
 *     OPTION IS NEAR-CONCLUSIVE OF A HUMAN HOLDING A BELIEF — landing on humanity,
 *     not yet on experience.
 *     NOT diagnostic: tabbing presence. Unenveloped letter-size mail at automation
 *     prices must be tabbed, standards by stock basis weight and fold edge
 *     [^3]. Presence proves automation rate; only tab count above minimum is
 *     a preference.
 *
 * F4  THE CEILING — ONE PIECE IS ONE DRAW.
 *     A preference is a distribution over choices; one artifact is one vector and
 *     the base rate is unobserved. Honest maximum inference: "deviates from the
 *     published mode" — compatible with expert, eccentric novice, or copied spec.
 *     The only workaround without a second document is INTERNAL COHERENCE: five
 *     independent axes leaning one way makes chance alignment unlikely and
 *     indicates intent rather than a draw. Coherence substitutes for replication;
 *     it is the only substitution that works.
 *
 * F5  WHAT THIS BUYS BACK — AND WHAT IT DOES NOT.
 *     The previous module concluded the integration barrier collapsed, killing P1
 *     and P2 as vendor-scored tests. This observation recovers EXPERIENCE
 *     DETECTION via coherence off-mode. It does NOT recover AUTHORSHIP detection:
 *     on spec axes the agent and the novice occupy the same cell. P1 alone is
 *     alive; P1-and-P2 remains dead.
 *
 * F6  AUTHORSHIP IS TESTABLE ONLY IN THE COPY.
 *     Spec vectors cannot separate agent from novice; prose can. Typicality bias
 *     predicts the tells — prototypical fluent phrasing rather than the specific,
 *     odd, local detail a person with direct knowledge supplies.
 *     THE IRONY: the same property makes agents good forgers. Asked to write as a
 *     named organisation, a model emits the PROTOTYPICAL version of the genre, not
 *     that organisation's idiosyncrasies. To a reader without a specific prior it
 *     is indistinguishable from the real voice — which is the whole requirement
 *     for impersonation. To a reader who knows the org, genericness is the tell.
 *     Detection requires a specific reader; the recipients mostly were not one.
 *
 * Reality Relation: interpretation, fictionalizationDegree 0.3 — the diversity
 * literature and the print guidance are documentary; the four-signature model,
 * the coherence test and the credences are the compiler's.
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

const UNIVERSE_ID = createHistoricalUniverseId('texas_mailer_preference_vector', '2026');

const SOLO_ID = 'history:texas_mailer_solo_limit:2026';
const DISCOVERY_ID = 'history:texas_mailer_discovery_reach:2026';

const D = (y: number, m: number, d: number): bigint =>
  BigInt(Date.UTC(y, m - 1, d)) * 1_000_000n;

const DROP = D(2026, 10, 14);
const DECISION = D(2026, 10, 26);

/** The four signatures and their observable traces. */
interface Signature {
  readonly id: string;
  readonly justification: 'none' | 'articulate' | 'personal' | 'third_party';
  readonly relationToMode: 'is_mode' | 'near_mode' | 'off_mode';
  readonly costTolerance: 'zero' | 'pays_to_avoid';
  readonly resolvedBy: string;
}

const SIGNATURES: readonly Signature[] = [
  {
    id: 'novice_vendor_default',
    justification: 'none',
    relationToMode: 'near_mode',
    costTolerance: 'zero',
    resolvedBy: 'Job ticket shows accepted form values; no RFQ correspondence',
  },
  {
    id: 'agent_corpus_mode',
    justification: 'articulate',
    relationToMode: 'is_mode',
    costTolerance: 'zero',
    resolvedBy: 'Every axis on "safest choice" [^5]; spec vector matches published guidance with no deviation',
  },
  {
    id: 'expert_owned_deviation',
    justification: 'personal',
    relationToMode: 'off_mode',
    costTolerance: 'pays_to_avoid',
    resolvedBy: 'Coherent off-mode stance plus a rejected cheaper option; stable across a second artifact',
  },
  {
    id: 'inherited_spec_false_expert',
    justification: 'third_party',
    relationToMode: 'off_mode',
    costTolerance: 'pays_to_avoid',
    resolvedBy: 'Job ticket shows the spec sheet supplied by the client, sourced from a prior vendor',
  },
];

/** Diagnostic value of each observable, ranked. */
const OBSERVABLES = [
  { observable: 'A rejected cheaper compliant option', value: 'near-conclusive of a human belief', confidence: 0.75 },
  { observable: 'Coherence of the spec vector off the mode', value: 'best proxy for an owned preference', confidence: 0.6 },
  { observable: 'Presence of tabbing', value: 'proves automation rate only [^3]', confidence: 0.9 },
  { observable: 'Tabbing above the stock/fold minimum', value: 'weak preference signal', confidence: 0.3 },
  { observable: 'Copy register versus the genre prototype', value: 'only direct authorship test', confidence: 0.5 },
] as const;

export const texasMailerPreferenceVectorUniverse = {
  universeId: UNIVERSE_ID,
  type: UniverseType.HISTORICAL_EVENT,

  identifiers: {
    primary: 'history:texas_mailer_preference_vector:2026',
    aliases: [
      'would an agent and a novice look the same',
      'what does an experienced mailer specify',
      'is there an anti-preference in the artifact',
      'can one mailer prove experience',
    ],
  },

  realityRelation: {
    type: 'interpretation',
    fictionalizationDegree: 0.3,
    realityAnchors: [
      {
        realEventId: 'spec:llm_typicality_bias',
        relationshipType: 'documents',
        confidence: 0.85,
        evidence: [
          'Post-training alignment reduces output diversity — mode collapse [^1]',
          'Typicality bias in preference data identified as the data-level driver [^2]',
          'Annotators favour familiar, fluent, predictable text [^4]',
        ],
      },
      {
        realEventId: 'spec:print_spec_guidance',
        relationshipType: 'documents',
        confidence: 0.8,
        evidence: [
          'Matte or satin aqueous coating is "the safest choice" for most direct mail [^5]',
          'Uncoated is "the most forgiving stock for addressing" [^5]',
          '100 lb cover with AQ surface "accept[s] inkjet printing and laser toner... the right choice for address panels" [^6]',
        ],
      },
      {
        realEventId: 'spec:usps_tabbing',
        relationshipType: 'documents',
        confidence: 0.9,
        evidence: [
          'Unenveloped letter-size pieces at automation prices must be tabbed; standards by basis weight and fold edge [^3]',
        ],
      },
    ],
  },

  attribution: {
    public_domain: false,
    sources: ['LLM diversity literature', 'Direct mail paper and finishing guidance', 'USPS tabbing requirements', 'Prior modules'],
    citations_required: true,
    usage_restrictions: [
      'The artifact is described, not inspected. No spec vector has been read off the actual piece.',
      'The four-signature model is an abstraction; real jobs mix default, mode and deviation across axes.',
      'The claim that agents emit the corpus mode applies to unconstrained generation; a human-written brief suppresses the signature.',
      'Credences are judgements, not frequencies.',
    ],
  },

  layers: [
    {
      layerId: 'spec_vector',
      type: 'reconstruction',
      reality_correspondence: {
        to: 'analysis:artifact_specs:2026',
        accuracy: 0.3,
        deviations: [
          'No specification has been observed directly; the vector is inferred from a description of the piece.',
          'Axes are not independent — stock constrains finishing, finishing constrains tabbing, so coherence is partly mechanical and partly designed.',
          'Assumes the piece faced real print choices; a photocopied handbill at retail postage would carry far fewer axes.',
        ],
      },
      epochs: {
        production: {
          epochId: 'history:pref:production',
          startTime: DROP,
          endTime: DECISION,
          precision: TimePrecision.DAY,
        },
      },
    },
    {
      layerId: 'stance_reconstruction',
      type: 'reconstruction',
      reality_correspondence: {
        to: 'analysis:operator_stance:2026',
        accuracy: 0.4,
        deviations: [
          'Treats coherence as evidence of intent; a committee can produce coherence by deferring to one member, and a novice by copying one article.',
          'Cannot distinguish an owned preference from an inherited one without the job ticket.',
        ],
      },
      epochs: {
        authorship: {
          epochId: 'history:pref:authorship',
          startTime: D(2024, 1, 1),
          endTime: DECISION,
          precision: TimePrecision.DAY,
        },
      },
    },
  ],

  temporalStructure: {
    segments: [
      { id: 'artwork', start: D(2026, 8, 1), end: DROP, type: 'phase', status: 'active' },
      { id: 'production', start: DROP, end: DROP, type: 'phase', status: 'active' },
      { id: 'assessment', start: DECISION, end: DECISION, type: 'phase', status: 'active' },
    ],
    keyframes: [
      {
        id: 'agent_is_modal',
        timestamp: DECISION,
        significance: 1.0,
        certainty: 0.8,
        tags: ['agent', 'typicality', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The agent does not lack preferences; it holds the median one. Typicality bias makes models emit the familiar and predictable [^1][^2], and the trade publishes that mode as advice — "the safest choice" [^5], "the right choice for address panels" [^6]. The observed similarity between agent and novice is real and arises from two unrelated processes converging on the same output.',
      },
      {
        id: 'four_signatures',
        timestamp: DECISION,
        significance: 0.95,
        certainty: 0.8,
        tags: ['typology', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'Four signatures, not three: vendor default (novice), corpus mode (agent), owned off-mode stance (expert), copied spec (inherited). The fourth looks exactly like the third and is resolved only by who authored the spec on the job ticket.',
      },
      {
        id: 'anti_preference_cost_asymmetry',
        timestamp: DECISION,
        significance: 0.95,
        certainty: 0.75,
        tags: ['anti_preference', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'A preference for a better option can be satisfied by an agent whose objective spent the money. An anti-preference requires paying to forgo a cheaper compliant option, sometimes on unverifiable grounds. An agent will not pay to avoid unless a human wrote the avoidance into the brief; a novice does not know the thing exists. A rejected cheaper option is therefore near-conclusive of a human holding a belief — humanity, not yet experience.',
      },
      {
        id: 'one_piece_one_draw',
        timestamp: DECISION,
        significance: 0.9,
        certainty: 0.85,
        tags: ['ceiling', 'method', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'A preference is a distribution over choices; one artifact is one vector with an unobserved base rate. The maximum inference from a single piece is "deviates from the published mode," compatible with expert, eccentric novice, or copied sheet. Internal coherence across independent axes is the only substitute for replication, and it is imperfect because some axes are mechanically coupled.',
      },
      {
        id: 'experience_recovered_authorship_not',
        timestamp: DECISION,
        significance: 0.9,
        certainty: 0.8,
        tags: ['P1', 'P2', 'scope', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The previous module killed P1 and P2 as vendor-scored tests. This observation recovers EXPERIENCE detection via coherence off-mode but not AUTHORSHIP detection: on specification axes the agent and the novice share a cell. P1 alone is alive; the P1-and-P2 pair remains dead.',
      },
      {
        id: 'forgery_irony',
        timestamp: DECISION,
        significance: 1.0,
        certainty: 0.7,
        tags: ['copy', 'impersonation', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'Typicality bias makes agents good forgers. Asked to write as a named organisation, a model emits the prototypical version of the genre rather than that organisation\'s idiosyncrasies. To a reader without a specific prior this is indistinguishable from the real voice — precisely the requirement for impersonation. Only a reader who knows the org\'s actual voice hears the genericness. The property that makes agent output detectable is the property that makes it usable.',
      },
    ],
    windows: { strategy: 'phase_based' },
  },

  metadata: {
    canonicalName: 'Preference Vector: the agent holds the mode, the expert holds a stance',
    creators: ['Compiled analysis'],
    released: new Date('2026-10-26T00:00:00Z'),
    cultural_significance: 0.2,
    platform: 'Local Time universe system',
    externalId: 'texas_mailer_preference_vector_2026',
    contentType: 'observation audit / signature discrimination',
    signatures: SIGNATURES,
    observables: OBSERVABLES,
    credences: {
      'agent_and_novice_similar_in_artifact': 0.70,
      'agent_signature_is_modal_not_absent': 0.80,
      'rejected_cheaper_option_implies_human_belief': 0.75,
      'coherence_off_mode_implies_owned_preference': 0.60,
      'preferences_present_but_inherited': 0.35,
      'single_artifact_can_establish_experience': 0.20,
      'copy_is_better_authorship_test_than_spec': 0.50,
    },
    deciderDocuments: [
      'Job ticket: who authored the spec sheet, client or vendor — separates owned from inherited preference',
      'RFQ or email thread containing a rejection ("not that stock", "no window", "not that indicia")',
      'Invoice line for any upgrade above the compliant minimum, and whether it was requested or offered',
      'Spec vector compared against published guidance: full agreement with "safest choice" [^5] reads as agent or default',
      'Tabbing count versus the stock/fold minimum [^3] — above minimum indicates requested caution',
      'Copy: presence or absence of a specific local detail that a model would not generate and a copywriter would',
    ],
    ticketDeltas: [
      'mcp_threshold: authorship detection is not recovered; only experience detection is — correct the scope note',
      'expertise_axis: replace the retired software axis with the preference-vector axis; the model becomes one-dimensional but measurable',
      'api_and_price: SKU conformity is a spec-vector axis like any other and can be scored inside the coherence test rather than separately',
      'discovery_reach: add the rejection thread — it is the single highest-value document named in this series',
      'trace_and_vendor: the tabbing requirement [^3] is a constraint, not a preference; remove it from the preference set',
    ],
    uncertaintyNotes: [
      'No spec vector has been read from the actual piece. Everything here is method, not result.',
      'Coherence is partly mechanical: stock constrains finishing and finishing constrains tabbing, so alignment across those axes is not independent evidence.',
      'The modal-signature argument depends on the operator not having written a detailed brief; a good brief suppresses the agent tell entirely.',
      'A novice who inherited a vendor-authored spec is indistinguishable from an expert without the job ticket, and that is the most likely false positive here.',
      'The copy test fails if the impersonation deliberately suppressed the voice, or if the piece is too short for register to register.',
    ],
    threadSiblings: [
      {
        id: 'history:texas_mailer_mcp_threshold:2026',
        note: 'the integration-barrier module this one corrects; not landed',
      },
      {
        id: 'history:texas_mailer_expertise_axis:2026',
        note: 'the two-axis expertise module this one corrects; not landed',
      },
      {
        id: 'history:texas_mailer_api_and_price:2026',
        note: 'the vendor-population module this one documents; not landed',
      },
      {
        id: 'history:texas_mailer_trace_and_vendor:2026',
        note: 'the physical-evidence module this one derives from; not landed',
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
        targetUniverseId: SOLO_ID,
        confidence: 0.75,
        description:
          'Headcount is replaced by the preference vector as the discriminator between novice, ' +
          'agent and expert.',
      },
      {
        type: 'SUPERSEDES',
        targetUniverseId: DISCOVERY_ID,
        confidence: 0.7,
        description:
          'The reach map is scope, not authorship; this module answers the authorship question ' +
          'the reach map cannot.',
      },
    ],
  },
} as unknown as Universe;

/** All universes derived from james-gibson/local-time#200. */
export const texasMailerPreferenceVectorUniverses: Universe[] = [texasMailerPreferenceVectorUniverse];
