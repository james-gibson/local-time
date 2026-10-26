import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../../core/types';
import { CommonUniverseIds } from '../../../../core/common-universe-ids';
import { createHistoricalUniverseId } from '../../../../core/universe-ids';

/**
 * "Ambiguity-Tolerant Form" — counter-counter-postulate: Beck speaks backwards;
 * if he, or someone in his situation, wanted to praise the money wasted on
 * trolling via a meme mailer, gesture at the printer's good work, or highlight
 * that this was content creation for someone. And: Beck isn't speaking honestly.
 *
 * VERIFICATION FAILURE, DECLARED UP FRONT. The transcript is no longer in the
 * sandbox and "full color heavy paper mailer" does not surface in the index. The
 * segment rests on ONE machine transcript with NO speaker labels. A claim about
 * DELIVERY cannot be scored from a record that strips delivery. Flagged, not
 * papered over.
 *
 * A1  "SPEAKS BACKWARDS" FORKS; ONLY ONE BRANCH IS USABLE.
 *       literal reverse speech — pseudoscientific, no mechanism, no evidence
 *       base. DISCARD.
 *       ironic register — real rhetorical move. Requires TONE, which a machine
 *       transcript strips first.
 *     So: the hypothesis is about how something was said; the surviving record is
 *     of what was said. Unscoreable from this artifact, and the right response is
 *     to name what WOULD score it (audio, video, the hour's ad log), not to
 *     dismiss or to assert.
 *
 * A2  THE WORDING SETTLES ONE NARROW QUESTION, AGAINST PLAIN DISHONESTY.
 *     "It HAD TO cost a lot of money" [^d02ba2#3462]. "Had to" is an epistemic
 *     modal of INFERENCE, not of knowledge. A speaker with inside information says
 *     "it cost a lot" / "they spent a fortune" / "I know what that costs" — all
 *     assert. "It had to cost" DEDUCES, from the same surface features the
 *     investigator has: full colour, heavy stock, saturation. The disfluencies
 *     ("you know," "I mean") hedge in the same direction.
 *     An inference is not a lie. The HONEST reformulation: Beck does not know, and
 *     is filling the gap with the plausible inference the audience would also
 *     make. That is a different and more defensible claim, and his own grammar
 *     supports it rather than the postulate as written.
 *
 * A3  RHETORICAL CONVERGENCE — A NEW MECHANISM FOR THE SERIES' RECURRING PATTERN.
 *     Four inputs, one output:
 *       sincere alarm -> "it had to cost" -> THEY HAVE MONEY
 *       sarcastic mockery of waste -> same
 *       paid or tipped -> same
 *       coded wink -> same
 *     Previous rounds had MARKET convergence (dominated options; MCP collapsing a
 *     skill gap). This is DESIGNED convergence, and it is what the figure is FOR:
 *     a move that survived only one reading would be a weak move. "They spent real
 *     money" is durable precisely because it commits the speaker to the FACT of
 *     spending, already hedged as inference, and not to a stance toward it.
 *     So "is Beck honest" is undecidable AND irrelevant to the effect — the
 *     undecidability is a property of the sentence, not a gap in the evidence.
 *
 * A4  WHAT SURVIVES IS "SOMEONE IN HIS SITUATION" — the functional claim.
 *     Shifting from Beck's mind to the FUNCTION OF THE SLOT is the sharper version:
 *     functional claims are checkable against outcomes, not minds.
 *     Under that reading, "content creation for someone" is the strongest element
 *     and it reframes the artifact: IF THE MAILER IS A MEME, PRODUCTION VALUE IS
 *     THE PAYLOAD, NOT THE OVERHEAD. A meme mailer that cost real money is a
 *     BETTER meme because the cost is legible — costly signalling; the expense is
 *     the message. This directly corrects production_value, which treated expense
 *     as a cost to justify against a persuasive purpose.
 *     THEN Beck's segment is not a leak, an endorsement or a confession: it is the
 *     mailer COMPLETING ITS SPEECH ACT. His sincerity drops out as a variable —
 *     sincere, sarcastic and bought all deliver the payload. He is a distribution
 *     channel, and the operation may have counted on exactly this host.
 *
 * A5  THE GESTURE AT THE PRINTER FAILS; A NEARBY GESTURE WORKS.
 *     No printer was named [^d02ba2#3458-3464], so there is no referent. But the
 *     gesture need not be toward A printer: "full colour heavy paper" argues that
 *     this was not scrappy grassroots effort but institutional effort with a
 *     vendor, a budget and a process. That serves the single-payer narrative
 *     [^5eb8c4#135] without requiring anyone to be bribed. It is an argument about
 *     the adversary's COMPETENCE, offered as evidence of ORGANISATION.
 *
 * A6  COST TO THE INVESTIGATION — BECK LEAVES THE PRODUCTION COLUMN.
 *     production_value used his segment as corroboration that the piece was
 *     perceived as expensive, flagged as perception. Honest revision: withdraw the
 *     production reading; retain the reception reading; and add that the segment is
 *     now PRIMARY evidence of what the mailer did, which is the question that
 *     actually matters. Not a demotion — a change of subject.
 *
 * Reality Relation: interpretation, fictionalizationDegree 0.3 — the wording and
 * its modal, the unlabelled transcript and the failed re-verification are
 * documentary; the convergence table, the payload argument and the credences are
 * the compiler's.
 *
 * LANDED WITH THE FAMILY (james-gibson/local-time#200). This is one of seven sibling
 * universes committed together: production_value, dominated_choice, preference_vector,
 * solo_limit, discovery_reach, ambiguity_tolerant_form and this one. The rest of the
 * #200 thread (payer_ledger, shell_hypothesis, operator_profile, stationarity_domicile,
 * five_postulates, automation_stack, residue_and_reach, beck_plane, proper_timelines,
 * kpi_and_signature, trace_and_vendor, api_and_price, expertise_axis, mcp_threshold)
 * was not landed. This module's draft pointed only at modules that *were* landed, so
 * every edge it declares resolves; where a sibling draft pointed at one that was not,
 * the edge was dropped rather than dangled (see the family barrel for the list).
 */

const UNIVERSE_ID = createHistoricalUniverseId('texas_mailer_ambiguity_tolerant_form', '2026');

const PROD_ID = 'history:texas_mailer_production_value:2026';
const DOM_ID = 'history:texas_mailer_dominated_choice:2026';
const PREF_ID = 'history:texas_mailer_preference_vector:2026';
const SOLO_ID = 'history:texas_mailer_solo_limit:2026';

const D = (y: number, m: number, d: number): bigint =>
  BigInt(Date.UTC(y, m - 1, d)) * 1_000_000n;

const BROADCAST = D(2026, 10, 21);
const DECISION = D(2026, 10, 26);

/** Conflicting inputs that produce one rhetorical output. */
interface IntentReading {
  readonly id: string;
  readonly speakerState: string;
  readonly utterance: string;
  readonly audienceReceives: string;
  readonly distinguishable: boolean;
}

const INTENT_READINGS: readonly IntentReading[] = [
  {
    id: 'sincere_alarm',
    speakerState: 'Genuinely alarmed at adversary resources',
    utterance: '"It had to cost a lot of money" [^d02ba2#3462]',
    audienceReceives: 'They have money',
    distinguishable: false,
  },
  {
    id: 'sarcastic_waste',
    speakerState: 'Mocking money wasted on a troll mailer',
    utterance: '"It had to cost a lot of money"',
    audienceReceives: 'They have money, and it was wasted',
    distinguishable: false,
  },
  {
    id: 'paid_or_tipped',
    speakerState: 'Informed or compensated by an interested party',
    utterance: '"It had to cost a lot of money"',
    audienceReceives: 'They have money',
    distinguishable: false,
  },
  {
    id: 'coded_wink',
    speakerState: 'Signalling allies about professional content production',
    utterance: '"It had to cost a lot of money"',
    audienceReceives: 'They have money, professionally',
    distinguishable: false,
  },
];

/** Where the segment moves in the evidence ledger. */
const LEDGER = [
  { use: 'Production-value corroboration', before: 'Lay witness, imperfect, admissible', after: 'WITHDRAWN', weight: 0.1 },
  { use: 'Audience reception of expense', before: 'Usable', after: 'Usable, and the only witness present', weight: 0.85 },
  { use: 'Evidence of the artifact\'s function', before: 'Not considered', after: 'PRIMARY — data about what the mailer did', weight: 0.8 },
  { use: 'Evidence of payer identity', before: 'Not considered', after: 'Nil — the claim is an inference, not testimony', weight: 0.05 },
] as const;

export const texasMailerAmbiguityTolerantFormUniverse = {
  universeId: UNIVERSE_ID,
  type: UniverseType.HISTORICAL_EVENT,

  identifiers: {
    primary: 'history:texas_mailer_ambiguity_tolerant_form:2026',
    aliases: [
      'was Glenn Beck being sarcastic about the mailer',
      'did Beck speak in code',
      'was the segment content creation',
      'did Beck know who paid',
      'is production value the message',
    ],
  },

  realityRelation: {
    type: 'interpretation',
    fictionalizationDegree: 0.3,
    realityAnchors: [
      {
        realEventId: 'event:glenn_beck_program_2026_10_21',
        relationshipType: 'documents',
        confidence: 0.55,
        evidence: [
          '"it had to cost a lot of money because it\'s, you know, it\'s a full color heavy paper mailer" [^d02ba2#3462-3464]',
          'No printer named anywhere in the segment [^d02ba2#3458-3464]',
          'Guest Andy Ngo; transcript machine-generated and unlabelled by speaker [^d02ba2#35-39]',
          'RE-VERIFICATION FAILED on 2026-10-26: transcript absent from sandbox, exact phrase not indexed',
        ],
      },
      {
        realEventId: 'analysis:single_payer_claim',
        relationshipType: 'documents',
        confidence: 0.8,
        evidence: [
          'TENT counsel describes a single entity or single payer [^5eb8c4#135]',
        ],
      },
    ],
  },

  attribution: {
    public_domain: false,
    sources: ['The Glenn Beck Program transcript, 21 October 2026 (single machine transcript, unlabelled)', 'Prior modules'],
    citations_required: true,
    usage_restrictions: [
      'The supporting transcript could not be re-verified on the date of this module. The segment is cited at reduced confidence (0.55) and every reading built on it inherits that discount.',
      'No audio or video was examined. Any claim about register, tone or delivery is unverifiable from the material held here.',
      'Attributing the remark to Beck personally is not supported by an unlabelled machine transcript; attribute it to the program.',
      'Credences are judgements, not frequencies.',
    ],
  },

  layers: [
    {
      layerId: 'delivery',
      type: 'reconstruction',
      reality_correspondence: {
        to: 'analysis:vocal_register:2026',
        accuracy: 0.15,
        deviations: [
          'No audio examined. Register is inferred from wording alone, which is close to no evidence at all.',
          'The transcript is unlabelled, so the speaker of the remark is presumed rather than known — a host, a guest, or a producer reading a note would all render identically.',
        ],
      },
      epochs: {
        broadcast: {
          epochId: 'history:atf:delivery',
          startTime: BROADCAST,
          endTime: BROADCAST,
          precision: TimePrecision.DAY,
        },
      },
    },
    {
      layerId: 'function',
      type: 'reconstruction',
      reality_correspondence: {
        to: 'analysis:mailer_speech_act:2026',
        accuracy: 0.45,
        deviations: [
          'Treats circulation as the artefact\'s purpose; a mailer may have been designed to persuade recipients directly and been talked about incidentally.',
          'Assumes the operation anticipated host reaction. Opportunistic design is equally consistent with the same outcome.',
        ],
      },
      epochs: {
        circulation: {
          epochId: 'history:atf:circulation',
          startTime: BROADCAST,
          endTime: DECISION,
          precision: TimePrecision.DAY,
        },
      },
    },
  ],

  temporalStructure: {
    segments: [
      { id: 'drop', start: D(2026, 10, 14), end: BROADCAST, type: 'phase', status: 'active' },
      { id: 'circulation', start: BROADCAST, end: DECISION, type: 'phase', status: 'active' },
      { id: 'assessment', start: DECISION, end: DECISION, type: 'phase', status: 'active' },
    ],
    keyframes: [
      {
        id: 'verification_failure_declared',
        timestamp: DECISION,
        significance: 0.9,
        certainty: 0.95,
        tags: ['evidence', 'limitation', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The transcript could not be re-verified: absent from the sandbox, exact phrase unindexed. The segment therefore rests on one machine transcript with no speaker labels, at reduced confidence. A claim about DELIVERY cannot be scored from a record that strips delivery — this is stated rather than papered over, because every reading in this module inherits the discount.',
      },
      {
        id: 'speaks_backwards_forks',
        timestamp: DECISION,
        significance: 0.85,
        certainty: 0.9,
        tags: ['definition', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'Literal reverse speech is pseudoscience and is discarded. Ironic register is real but requires tone, which the transcript strips. The usable branch is therefore unscoreable from the artifact, and the correct response is to name the scoring instrument — audio, video, the hour\'s ad log — rather than to assert either reading.',
      },
      {
        id: 'had_to_cost_is_inference',
        timestamp: DECISION,
        significance: 1.0,
        certainty: 0.85,
        tags: ['modal', 'honesty', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          '"It HAD TO cost a lot of money" [^d02ba2#3462] is an epistemic modal of inference, not of knowledge. A speaker with inside information asserts; "had to" deduces. So on the one question the text can settle, Beck is not claiming knowledge of the spend — he is performing the same inference the audience would make, and marking it as one. An inference is not a lie. The honest reformulation of the postulate: he does not know, and fills the gap.',
      },
      {
        id: 'rhetorical_convergence',
        timestamp: DECISION,
        significance: 1.0,
        certainty: 0.85,
        tags: ['convergence', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'Four speaker states — sincere alarm, sarcastic mockery, paid or tipped, coded wink — produce one utterance and one audience receipt: THEY HAVE MONEY. Previous rounds had market convergence; this is DESIGNED convergence, and it is what the figure is for. A move surviving only one reading is a weak move. "Is Beck honest" is therefore undecidable AND irrelevant to the effect, and the undecidability is a property of the sentence rather than a gap in the evidence.',
      },
      {
        id: 'production_value_is_the_payload',
        timestamp: DECISION,
        significance: 1.0,
        certainty: 0.7,
        tags: ['A4', 'meme', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The strongest surviving element is "someone in his situation," not "Beck is dishonest." Shifting from a mind to the FUNCTION OF A SLOT yields a checkable claim. If the mailer is a meme, production value is the payload, not the overhead: a meme mailer that cost real money is a better meme because the cost is legible. Costly signalling — the expense is the message. This corrects production_value, which treated expense as a cost to justify against a persuasive purpose.',
      },
      {
        id: 'segment_completes_the_speech_act',
        timestamp: DECISION,
        significance: 0.95,
        certainty: 0.65,
        tags: ['A4', 'reception', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'On the payload reading, the segment is not a leak, an endorsement or a confession: it is the mailer completing its speech act. Sincerity drops out as a variable, since sincere, sarcastic and bought all deliver the same payload. He is a distribution channel, and the operation may have counted on exactly this host delivering exactly this observation.',
      },
      {
        id: 'gesture_inverts_to_competence',
        timestamp: DECISION,
        significance: 0.85,
        certainty: 0.75,
        tags: ['A5', 'printer', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The gesture toward "the good work the printer did" fails: no printer was named [^d02ba2#3458-3464], so there is no referent. But the gesture need not be toward A printer — "full colour heavy paper" argues the effort was institutional rather than grassroots, with a vendor, a budget and a process. That serves the single-payer narrative [^5eb8c4#135] without requiring anyone to be bribed: an argument about COMPETENCE offered as evidence of ORGANISATION.',
      },
      {
        id: 'beck_leaves_the_production_column',
        timestamp: DECISION,
        significance: 0.9,
        certainty: 0.8,
        tags: ['ledger', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The production-value reading of the segment is withdrawn; the reception reading is retained and promoted. He is not a witness to how the piece was made — he is the principal evidence of what it did. A change of subject, not a demotion, and the reception column answers the question that matters: whether the mailer worked.',
      },
    ],
    windows: { strategy: 'phase_based' },
  },

  metadata: {
    canonicalName: 'Ambiguity-Tolerant Form: four intents, one receipt',
    creators: ['Compiled analysis'],
    released: new Date('2026-10-26T00:00:00Z'),
    cultural_significance: 0.35,
    platform: 'Local Time universe system',
    externalId: 'texas_mailer_ambiguity_tolerant_form_2026',
    contentType: 'counter-counter-postulate audit / rhetorical function',
    intentReadings: INTENT_READINGS,
    ledger: LEDGER,
    credences: {
      'speaks_backwards_as_literal_reverse_speech': 0.02,
      'cost_claim_marked_as_inference_by_modal': 0.85,
      'beck_holds_non_public_knowledge_of_payer': 0.10,
      'register_is_ironic_or_mocking': 0.30,
      'register_is_sincere': 0.45,
      'audience_receives_they_have_money_regardless': 0.90,
      'beck_is_not_speaking_honestly_as_stated': 0.25,
      'production_value_was_the_message_not_the_overhead': 0.55,
      'beck_functioned_as_distribution_channel': 0.60,
      'withdraw_segment_as_production_evidence': 0.70,
    },
    deciderDocuments: [
      'Audio or video of the segment — the only instrument that scores register',
      'The hour\'s ad log, to test whether the passage sits inside or outside a paid read',
      'Full episode transcript with speaker labels and timestamps',
      'Any subsequent Beck segment on the same mailer, which would reveal whether the framing shifted',
      'Beck\'s own sourcing: whether he or a producer had seen a sample piece, or was describing a photograph on screen',
      'Whether "candy in Texas" refers to the volume of mail or to a specific image shown on air',
    ],
    ticketDeltas: [
      'production_value: withdraw the production-value use of the segment; retain and promote the reception use',
      'production_value: expense should be treated as possible PAYLOAD rather than overhead; re-derive the "per-piece to total" inversion under that frame',
      'dominated_choice: if expense is the message, an inefficient or dominated spec choice stops being an error and becomes a signal — the triage grid needs a costly-signalling row',
      'preference_vector: the "paid reconciliation" signal weakens if visible expense is itself the objective',
      'discovery_reach: add the audio of the 21 October segment as a request; it is cheap and it scores the one thing this module cannot',
    ],
    uncertaintyNotes: [
      'The transcript could not be re-verified on 2026-10-26. Every reading here inherits a 0.55 confidence cap from that failure.',
      'No audio or video was examined. Register claims are unverifiable from the material held.',
      'The transcript is unlabelled, so the speaker is presumed. A host, a guest, or a producer reading a note render identically.',
      'The payload reading assumes circulation was a design objective. Opportunistic design is equally consistent with the observed outcome, which is why it is held at 0.55 rather than higher.',
      '"Beck isn\'t speaking honestly" is scored low not because he is credible but because the form is built to make the question unanswerable — undecidability is not evidence of dishonesty.',
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
        targetUniverseId: PROD_ID,
        confidence: 0.85,
        description:
          'Withdraws the production-value use of the segment and retains only the reception ' +
          'reading.',
      },
      {
        type: 'CORRECTS',
        targetUniverseId: DOM_ID,
        confidence: 0.8,
        description:
          'If visible expense is the objective, a dominated spec choice stops being an error ' +
          'and becomes a signal.',
      },
      {
        type: 'DOCUMENTS',
        targetUniverseId: PREF_ID,
        confidence: 0.8,
        description:
          'Four speaker states produce one utterance, so the preference vector cannot be read ' +
          'off the receipt.',
      },
      {
        type: 'SUPERSEDES',
        targetUniverseId: SOLO_ID,
        confidence: 0.7,
        description:
          'Whether one person could have done it is silent on whether the segment was a paid, ' +
          'sincere or ironic performance.',
      },
    ],
  },
} as unknown as Universe;

/** All universes derived from james-gibson/local-time#200. */
export const texasMailerAmbiguityTolerantFormUniverses: Universe[] = [texasMailerAmbiguityTolerantFormUniverse];
