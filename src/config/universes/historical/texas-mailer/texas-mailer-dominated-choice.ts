import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../../core/types';
import { CommonUniverseIds } from '../../../../core/common-universe-ids';
import { createHistoricalUniverseId } from '../../../../core/universe-ids';

/**
 * "Dominated Choice" — postulate: an expert wouldn't make an anti-choice on
 * purpose; if an ink is likely to smear and costs more, the expert won't touch it.
 *
 * VERDICT: POSTULATE UPHELD ON FACT, SELF-DEFEATING AS A TEST. The smearing
 * option is ALSO the dearer one, so it is dominated, so everyone rejects it, so
 * the rejection is informationless. The postulate's truth is exactly what
 * destroys its diagnostic value.
 *
 * D1  THE INK FACT IS RIGHT.
 *     UV and gloss coatings repel water-based inkjet ink — "the ink beads up,
 *     smears, or doesn't adhere" [^7]; the address panel "has to be knocked
 *     out" [^3]. Trade framing matches the postulate almost verbatim: giving
 *     different jobs the same UV spec "because someone likes the word 'UV' is how
 *     an attractive finish becomes an expensive production problem" [^4].
 *
 * D2  THE COST DIRECTION INVERTS THE ANTI-PREFERENCE MECHANISM.
 *     Aqueous: 20-40% cheaper than UV [^6]; "the default finish... because of
 *     the economy it offers" [^5]; accepts inkjet without special handling and
 *     reads cleanly under an optical scanner [^3].
 *     UV: dearer — specialised resins and equipment [^6], "slightly more
 *     expensive" [^5]; does not accept inkjet [^7].
 *     So the expert's rejection is NOT paying to forgo. It is DECLINING TO PAY A
 *     PREMIUM FOR A DEFECT. The expert's option is cheaper, is the default, and is
 *     the published advice — "the safest choice" [^3]. Expert, novice and
 *     agent converge from three directions. No signal.
 *
 * D3  F3 IS RESTRICTED (self-correction to preference_vector).
 *     F3 defined an anti-preference as "paying to forgo a cheaper compliant
 *     option." Here the cheaper option IS the compliant one, so the mechanism
 *     cannot fire. F3 survives only where the rejected option is genuinely
 *     cheaper AND the sacrifice is real. Coating is not that case.
 *
 * D4  THE NECESSARILY-TRUE POSTULATE IS EVIDENTIALLY EMPTY.
 *     Worse on performance AND higher in cost = dominated = selected by nobody.
 *     A postulate predicting identical behaviour for every actor discriminates
 *     nothing. Same failure mode as P1/P2 in mcp_threshold: unfalsifiable is worse
 *     than refuted.
 *
 * D5  THE RISK IS ARITHMETIC, NOT COSMETIC.
 *     An IMB below the 90% verification threshold triggers additional postage at
 *     non-automation prices for ALL automation-price pieces in the mailing
 *     [^1]; the charge lands on the CRID that submitted the eDoc [^2].
 *     Mailing-wide repricing from a per-piece defect. An expert prices a tail risk
 *     whose downside is the whole drop. A novice doesn't know the mechanism. An
 *     agent may recite it. Convergence again.
 *
 * D6  THE SURVIVING SIGNATURE — PAID RECONCILIATION.
 *     A designer wanting gloss AND addressing must pay for a knockout or spot coat
 *     [^3]. A real premium, paid to solve a conflict the designer introduced.
 *     Not an anti-preference: the deliberate purchase of two incompatible goods
 *     plus the cost of making them compatible — requiring knowledge of both halves
 *     of a technical trade-off, unprompted by advice, which says pick one.
 *     Physical trace: glossy card, matte uncoated address panel.
 *
 * D7  WHERE ANTI-CHOICE SURVIVES — TACIT KNOWLEDGE AS FOLKLORE.
 *     Experts hold exclusions that look arbitrary; the important class is correct
 *     belief whose mechanism the holder cannot articulate ("never a window
 *     envelope" as compressed shifting/show-through). Not an anti-choice: it is
 *     experience whose explanation was lost in transmission. The artifact cannot
 *     distinguish this from wrong folklore — both are off-mode rejections with no
 *     visible justification. Resolution requires asking the person: a document
 *     question, and the custodian problem again.
 *
 * Reality Relation: interpretation, fictionalizationDegree 0.3 — coating behaviour,
 * pricing and the MERLIN threshold are documentary; the dominance argument, the
 * reconciliation signature and the credences are the compiler's.
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

const UNIVERSE_ID = createHistoricalUniverseId('texas_mailer_dominated_choice', '2026');

const PREF_ID = 'history:texas_mailer_preference_vector:2026';
const DISCOVERY_ID = 'history:texas_mailer_discovery_reach:2026';

const D = (y: number, m: number, d: number): bigint =>
  BigInt(Date.UTC(y, m - 1, d)) * 1_000_000n;

const DROP = D(2026, 10, 14);
const DECISION = D(2026, 10, 26);

/** Coating options in cost/compliance space. */
interface FinishOption {
  readonly id: string;
  readonly relativeCost: 'cheaper' | 'dearer';
  readonly acceptsInkjet: boolean;
  readonly diagnosticValue: number;
  readonly note: string;
}

const FINISHES: readonly FinishOption[] = [
  {
    id: 'aqueous_matte_satin',
    relativeCost: 'cheaper',
    acceptsInkjet: true,
    diagnosticValue: 0.05,
    note: 'Aqueous runs 20-40% cheaper than UV [^6]; default for economy [^5]; "the safest choice" [^3]',
  },
  {
    id: 'uv_gloss_flood',
    relativeCost: 'dearer',
    acceptsInkjet: false,
    diagnosticValue: 0.1,
    note: 'Dearer [^6][^5]; ink beads, smears, fails to adhere [^7]; dominated on both axes, so rejection by anyone',
  },
  {
    id: 'uv_gloss_knockout_panel',
    relativeCost: 'dearer',
    acceptsInkjet: true,
    diagnosticValue: 0.7,
    note: 'Pays a premium to reconcile two incompatible goods [^3]; requires knowing both halves of the trade-off; the surviving signal',
  },
  {
    id: 'uv_gloss_labelled_address',
    relativeCost: 'dearer',
    acceptsInkjet: false,
    diagnosticValue: 0.25,
    note: 'Conflict known but not paid to solve, or discovered late; the retrofit signature',
  },
];

/** Address method crossed with coating — the triage grid. */
const TRIAGE = [
  { coating: 'aqueous/matte', addressing: 'inkjet direct', reading: 'Mode — expert, novice and agent indistinguishable', signal: 0.05 },
  { coating: 'UV gloss + knockout', addressing: 'inkjet on panel', reading: 'Paid reconciliation — strongest coating-level expert signal', signal: 0.7 },
  { coating: 'UV gloss', addressing: 'label applied', reading: 'Retrofit — conflict known but not paid to solve, or found late', signal: 0.25 },
  { coating: 'UV gloss', addressing: 'inkjet direct, uneven', reading: 'Failure — the conflict was not known', signal: 0.15 },
] as const;

export const texasMailerDominatedChoiceUniverse = {
  universeId: UNIVERSE_ID,
  type: UniverseType.HISTORICAL_EVENT,

  identifiers: {
    primary: 'history:texas_mailer_dominated_choice:2026',
    aliases: [
      'would an expert choose a smearing ink',
      'what does the coating choice prove',
      'is the address panel knocked out',
      'why does gloss break inkjet addressing',
    ],
  },

  realityRelation: {
    type: 'interpretation',
    fictionalizationDegree: 0.3,
    realityAnchors: [
      {
        realEventId: 'spec:coating_inkjet_interaction',
        relationshipType: 'documents',
        confidence: 0.9,
        evidence: [
          'Gloss and UV repel water-based inkjet ink; address panel must be knocked out [^3]',
          'Ink beads up, smears, or does not adhere on UV-coated cards [^7]',
          'Matte or satin aqueous accepts inkjet without special handling, reads cleanly under an optical scanner [^3]',
          'Same UV spec across different jobs becomes an expensive production problem [^4]',
        ],
      },
      {
        realEventId: 'spec:coating_cost_direction',
        relationshipType: 'documents',
        confidence: 0.85,
        evidence: [
          'Aqueous typically 20-40% cheaper than UV [^6]',
          'UV slightly more expensive than aqueous [^5]',
          'Aqueous is the default finish for economy [^5]',
        ],
      },
      {
        realEventId: 'spec:imb_verification_threshold',
        relationshipType: 'documents',
        confidence: 0.9,
        evidence: [
          'IMB below 90% verification threshold assessed additional postage at non-automation prices for all automation-price pieces in the mailing [^1]',
          'Additional postage charged to the CRID that submitted the eDoc [^2]',
        ],
      },
    ],
  },

  attribution: {
    public_domain: false,
    sources: ['Commercial print finishing guidance', 'Inkjet addressing service documentation', 'USPS MERLIN programme pages', 'Prior modules'],
    citations_required: true,
    usage_restrictions: [
      'No coating or address method has been observed on the actual piece. This is method, not result.',
      'The dominance argument assumes UV is dearer in the relevant shop; short-run digital workflows can invert coating economics.',
      'MERLIN and seamless-acceptance mechanics have changed over time; the 90% IMB threshold is current but the penalty implementation varies [^8].',
      'Credences are judgements, not frequencies.',
    ],
  },

  layers: [
    {
      layerId: 'finish_economics',
      type: 'reconstruction',
      reality_correspondence: {
        to: 'analysis:coating_cost_compliance:2026',
        accuracy: 0.6,
        deviations: [
          'Treats cost direction as stable; short-run digital jobs may price a flood UV below an aqueous flood after setup amortisation.',
          'Ignores that some shops include a knockout at no extra charge, which would erase the reconciliation premium and its signal.',
          'Assumes the address panel is the constrained surface; addressing on a separate insert or envelope changes the whole analysis.',
        ],
      },
      epochs: {
        market: {
          epochId: 'history:dom:market',
          startTime: D(2024, 1, 1),
          endTime: DECISION,
          precision: TimePrecision.DAY,
        },
      },
    },
    {
      layerId: 'tacit_knowledge',
      type: 'reconstruction',
      reality_correspondence: {
        to: 'analysis:unarticulated_beliefs:2026',
        accuracy: 0.35,
        deviations: [
          'Cannot separate correct-but-unarticulated belief from wrong folklore without interviewing the holder.',
          'Assumes beliefs are held by an individual; a committee\'s folklore is a different object with the same surface.',
        ],
      },
      epochs: {
        craft: {
          epochId: 'history:dom:craft',
          startTime: D(1990, 1, 1),
          endTime: DECISION,
          precision: TimePrecision.YEAR,
        },
      },
    },
  ],

  temporalStructure: {
    segments: [
      { id: 'specification', start: D(2026, 8, 1), end: DROP, type: 'phase', status: 'active' },
      { id: 'verification', start: DROP, end: DECISION, type: 'phase', status: 'active' },
      { id: 'assessment', start: DECISION, end: DECISION, type: 'phase', status: 'active' },
    ],
    keyframes: [
      {
        id: 'dominated_rejection_is_informationless',
        timestamp: DECISION,
        significance: 1.0,
        certainty: 0.9,
        tags: ['dominance', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The smearing option is also the dearer one: UV costs more than aqueous [^6][^5] and repels water-based inkjet [^7]. Dominated on both axes, so rejected by expert, novice and agent alike. The postulate is true and, being necessarily true, discriminates nothing — the same failure mode as P1/P2: unfalsifiable is worse than refuted.',
      },
      {
        id: 'expert_declines_premium_for_defect',
        timestamp: DECISION,
        significance: 0.95,
        certainty: 0.85,
        tags: ['revision', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The expert\'s rejection is not paying to forgo; it is declining to pay extra for a defect. Their option is cheaper, is the default, and is the published advice [^3][^5]. This is a direct restriction on F3, which required the rejected option to be cheaper for the mechanism to fire. In coating, the cheaper option is the compliant one.',
      },
      {
        id: 'smear_is_a_repricing_event',
        timestamp: DECISION,
        significance: 0.95,
        certainty: 0.85,
        tags: ['risk', 'postage', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The risk is arithmetic, not cosmetic: an IMB below 90% verification triggers additional postage at non-automation prices for ALL automation-price pieces in the mailing [^1], charged to the submitting CRID [^2]. A per-piece defect reprices the drop. The expert prices a tail risk; the novice doesn\'t know the mechanism; the agent may recite it. Convergence.',
      },
      {
        id: 'paid_reconciliation_survives',
        timestamp: DECISION,
        significance: 1.0,
        certainty: 0.7,
        tags: ['reconciliation', 'signal', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'A designer wanting gloss AND addressing must pay for a knockout or spot coat [^3]. Not an anti-preference but the purchase of two incompatible goods plus the cost of compatibility — requiring knowledge of both halves of a trade-off, unprompted by advice, which says pick one. Physical trace: glossy card, matte uncoated address panel. The only coating-level expert signal in the series.',
      },
      {
        id: 'folklore_class',
        timestamp: DECISION,
        significance: 0.8,
        certainty: 0.6,
        tags: ['tacit_knowledge', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'Where anti-choice genuinely survives: correct beliefs whose mechanism the holder cannot articulate ("never a window envelope" compressing shifting and show-through). Not an anti-choice but experience whose explanation was lost in transmission. The artifact cannot separate this from wrong folklore — both are off-mode rejections with no visible justification. Resolution requires asking the person.',
      },
    ],
    windows: { strategy: 'phase_based' },
  },

  metadata: {
    canonicalName: 'Dominated Choice: the postulate is true, therefore empty',
    creators: ['Compiled analysis'],
    released: new Date('2026-10-26T00:00:00Z'),
    cultural_significance: 0.15,
    platform: 'Local Time universe system',
    externalId: 'texas_mailer_dominated_choice_2026',
    contentType: 'postulate audit / finish economics',
    finishes: FINISHES,
    triage: TRIAGE,
    credences: {
      'expert_rejects_smearing_dearer_ink': 0.95,
      'that_rejection_discriminates_expert_from_novice_or_agent': 0.10,
      'anti_preference_requires_rejecting_a_cheaper_option': 0.75,
      'uv_is_the_dearer_option': 0.85,
      'expert_choice_here_is_cheaper_and_compliant': 0.90,
      'glossary_tacit_knowledge_is_a_real_expert_class': 0.60,
      'paid_reconciliation_implies_expertise': 0.70,
      'coating_choice_alone_discriminates_the_operator': 0.15,
    },
    deciderDocuments: [
      'The piece itself: is the address panel coated or knocked out, and was the address inkjet or applied label',
      'Job ticket coating line: flood UV, aqueous, or spot/knockout — and whether the knockout was requested or offered',
      'Invoice: whether the knockout appears as a charged line item, which evidences a paid reconciliation [^3]',
      'MERLIN report or scorecard: whether barcode verification cleared the 90% threshold [^1]',
      'Any post-acceptance additional-postage assessment against the CRID [^2]',
      'Correspondence: whether the shop warned the client off gloss, and whether the client overrode it',
    ],
    ticketDeltas: [
      'preference_vector: restrict F3 to cases where the rejected option is CHEAPER; the coating case does not qualify',
      'preference_vector: replace "anti-preference" with "paid reconciliation" as the headline expert signal at artifact level',
      'mcp_threshold: the unfalsifiability risk is now demonstrated twice; add a standing rule to reject any postulate that predicts identical behaviour for all actors',
      'api_and_price: SKU conformity should be re-scored through the triage grid — knockout compliance is a spec axis, not a template key',
      'discovery_reach: request the MERLIN report alongside the scorecard; it is the one record that prices the smear risk after the fact',
    ],
    uncertaintyNotes: [
      'Nothing has been observed on the actual piece. The triage grid is a method awaiting a specimen.',
      'Cost direction is not universal: short-run digital work can price flood UV below aqueous after setup amortisation, which would restore dominance to aqueous and invert the reading.',
      'Some shops include a knockout at no charge, which would erase the reconciliation premium and with it the signal.',
      'The 90% IMB threshold is current, but penalty implementation has shifted between MERLIN and seamless acceptance [^8], so the dollar size of the risk is uncertain.',
      'The folklore class is unfalsifiable from the artifact by construction; it is listed to be honest about the limit, not as a testable category.',
    ],
    threadSiblings: [
      {
        id: 'history:texas_mailer_mcp_threshold:2026',
        note: 'the integration-barrier module this one corrects; not landed',
      },
      {
        id: 'history:texas_mailer_expertise_axis:2026',
        note: 'the two-axis expertise module this one documents; not landed',
      },
      {
        id: 'history:texas_mailer_api_and_price:2026',
        note: 'the vendor-population module this one derives from; not landed',
      },
      {
        id: 'history:texas_mailer_trace_and_vendor:2026',
        note: 'the physical-evidence module this one supersedes; not landed',
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
        type: 'CORRECTS',
        targetUniverseId: PREF_ID,
        confidence: 0.9,
        description:
          'Restricts the anti-preference mechanism: it fires only where the rejected option is ' +
          'genuinely cheaper, which coating is not.',
      },
      {
        type: 'SUPERSEDES',
        targetUniverseId: DISCOVERY_ID,
        confidence: 0.7,
        description:
          'A dominated option is rejected by everyone, so its rejection carries no information ' +
          'about who chose it.',
      },
    ],
  },
} as unknown as Universe;

/** All universes derived from james-gibson/local-time#200. */
export const texasMailerDominatedChoiceUniverses: Universe[] = [texasMailerDominatedChoiceUniverse];
