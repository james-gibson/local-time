import {
  KeyframeType,
  TimePrecision,
  Universe,
  UniverseType,
} from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { createSeriesUniverseId } from '../../../core/universe-ids';
import { RESPONSE_PUBLICATION_INSTANT } from './beck-responder-clocks';

/**
 * "Doublespeak in the Glenn Beck pamphlet reading" — derived analytical universe.
 *
 * Scope, deliberately narrower than the excerpt universe it is cut from:
 *   ONLY utterances attributable to Beck in the studio, 44:52-59:04 of
 *   youtube:7g2IoTMGfPs, and ONLY those utterances that perform a
 *   say-one-thing-that-does-another move.
 *
 * EXCLUDED BY CONSTRUCTION:
 *   - the responder's overlays (a different speaker's rhetoric; belongs to the parent)
 *   - the CBS News Texas insert (third-party journalism, not Beck's language)
 *   - producer speech (Jason/Grace), except where it is the foil Beck answers
 *   - the pamphlet AS A DOCUMENT: it is the object he reframes, never the object studied
 *   - Beck's non-argumentative banter, laughter, and the Torch plug as advertising
 *
 * This is a FILTER, not a summary. Most of the 14m12s is absent, and the absence is
 * the finding: doublespeak here is dense and local, not continuous. Do not read this
 * universe as a complete account of the segment.
 *
 * Cultural Significance: 0.30 — a derived teaching/QA artifact. It must NOT inherit
 * the parent's 0.72; re-slicing a work is not new cultural weight (#weight-inflation).
 *
 * Research Sources:
 * - Caption track of youtube:7g2IoTMGfPs, transcript lines 1320-1765, as established
 *   in the sibling excerpt universe. AUTO-GENERATED: wording is indicative, not verbatim.
 * - No independent audio verification of any timestamp in this module.
 *
 * Hierarchical Context: derives_from the transcription record for the same chapter;
 * member_of US_HISTORY
 * (media rhetoric of the 2026 US midterms). Contradiction edges are NOT redeclared
 * here — they belong to the excerpt universe, and duplicating them would double-count
 * the same dispute in the graph.
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

const UNIVERSE_ID = createSeriesUniverseId('series', 'beck_pamphlet_doublespeak', 2026);

const EXCERPT_UNIVERSE_ID = 'series:beck_pamphlet_transcript:2026';
const PARENT_UNIVERSE_ID =
  'series:tim_whitaker_why_christians_lie_about_transgender_kids:2026';

/* ------------------------------------------------------------------ *
 * Clock: parent-runtime offsets on the response video's own origin, imported from
 * `beck-responder-clocks` rather than restated, so a note here resolves to the same
 * absolute instant as the transcript record with zero conversion. Inherited timings
 * carry inherited error: the caption track is accurate to roughly +/- 2s at speaker
 * boundaries.
 * ------------------------------------------------------------------ */

const ORIGIN = RESPONSE_PUBLICATION_INSTANT;
const at = (minute: number, second = 0): bigint =>
  ORIGIN + BigInt(minute * 60 + second) * 1_000_000n;

const ANALYSIS_START = at(44, 52);
const ANALYSIS_END = at(59, 4);

export const beckDoublespeakUniverse = {
  universeId: UNIVERSE_ID,
  type: UniverseType.SERIES,

  identifiers: {
    primary: UNIVERSE_ID,
    aliases: [
      'youtube:7g2IoTMGfPs#doublespeak@44:52-59:04',
      'Beck doublespeak in the Texas Trans Resource Guide reading',
      'toxic empathy segment doublespeak pass',
    ],
  },

  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,

    realityAnchors: [
      {
        realEventId: EXCERPT_UNIVERSE_ID,
        relationshipType: 'derives_from',
        confidence: 1.0,
        evidence: [
          'Same byte range (44:52-59:04) as the sibling excerpt universe',
          'Same timestamps, same origin; this universe is a filtered view, not a re-read',
        ],
      },
      {
        realEventId: PARENT_UNIVERSE_ID,
        relationshipType: 'derives_from',
        confidence: 1.0,
        evidence: ['Transitive: parent -> excerpt -> filter'],
      },
      {
        // The analytical claim being made, stated as a claim and not as a fact about Beck.
        realEventId: 'analysis:glenn_beck_pamphlet_reading_doublespeak:2026',
        relationshipType: 'interprets',
        confidence: 0.7,
        evidence: [
          'Nineteen discrete devices catalogued; each carries its own certainty',
          'Attribution to Beck is inferred from captions with no speaker labels',
          'Satire and editorialising are distinguished from factual assertion in each entry',
        ],
      },
    ],
  },

  attribution: {
    public_domain: false,
    sources: [
      'YouTube 7g2IoTMGfPs caption track, lines 1320-1765',
      'Sibling excerpt universe for segment boundaries',
    ],
    citations_required: true,
    usage_restrictions: [
      'Quotations are caption-derived and unverified; do not publish as verbatim Beck quotes.',
      'This module characterises speech, not the speaker: devices are described, intent is not diagnosed.',
      'Do not cite this universe as evidence of what the pamphlet said; it models only Beck on the pamphlet.',
      'Satirical bits (hyperlinks, searchlight, Lambda pronunciation) are tagged `bit` and must not be cited as claims.',
    ],
  },

  layers: [
    {
      layerId: 'filtered_speech',
      type: 'primary',
      epochs: {
        publication: {
          epochId: 'youtube:beck_doublespeak:publication',
          startTime: BigInt(Date.UTC(2026, 9, 23)) * 1_000_000n,
          endTime: BigInt(Date.UTC(2026, 9, 24)) * 1_000_000n,
          precision: TimePrecision.DAY,
          description: 'Parent publication day; upload instant unverified.',
        },
        analysis_band: {
          epochId: 'youtube:beck_doublespeak:band',
          startTime: ANALYSIS_START,
          endTime: ANALYSIS_END,
          precision: TimePrecision.SECOND,
          description:
            'The 14m12s screened; 8m04s of it is Beck-attributable and active, 6m08s suspended.',
        },
      },
    },

    {
      layerId: 'device_taxonomy',
      type: 'subjective',
      reality_correspondence: {
        to: EXCERPT_UNIVERSE_ID,
        accuracy: 0.65,
        deviations: [
          'Selection bias is structural: the filter keeps rhetorical moves and drops the arguments they serve, which makes any speaker look more evasive than the whole does.',
          'The vocabulary (D1-D19) is this module\'s, not the literature\'s; no claim of alignment with any published doublespeak taxonomy.',
          'Borderline cases are kept and flagged rather than dropped, inflating count and lowering average certainty.',
        ],
      },
      epochs: {
        interpretation_span: {
          epochId: 'youtube:beck_doublespeak:interpretation',
          startTime: ANALYSIS_START,
          endTime: ANALYSIS_END,
          precision: TimePrecision.SECOND,
          description:
            'Coextensive with the band by design; this layer never claims an instant the primary plane lacks.',
        },
      },
    },
  ],

  temporalStructure: {
    // Tiled gaplessly, as required. `suspended` marks windows where Beck is not the
    // speaker being heard — the filter's negative space, kept explicit rather than
    // closed up, so the timeline cannot be mistaken for continuous Beck monologue.
    segments: [
      { id: 'open_and_front_panel', start: at(44, 52), end: at(45, 10), type: 'act', status: 'active' },
      { id: 'responder_overlay_1', start: at(45, 10), end: at(45, 41), type: 'act', status: 'suspended' },
      { id: 'body_panel_and_strangers', start: at(45, 41), end: at(46, 9), type: 'act', status: 'active' },
      { id: 'responder_overlay_2', start: at(46, 9), end: at(46, 19), type: 'act', status: 'suspended' },
      { id: 'caveat_and_who_pays', start: at(46, 19), end: at(47, 3), type: 'act', status: 'active' },
      { id: 'responder_deduction_1', start: at(47, 3), end: at(47, 37), type: 'act', status: 'suspended' },
      { id: 'producer_tent_finding', start: at(47, 37), end: at(48, 2), type: 'act', status: 'suspended' },
      { id: 'torch_analogy', start: at(48, 2), end: at(48, 28), type: 'act', status: 'active' },
      { id: 'responder_statement', start: at(48, 28), end: at(49, 20), type: 'act', status: 'suspended' },
      { id: 'love_it_and_return_address', start: at(49, 20), end: at(49, 52), type: 'act', status: 'active' },
      { id: 'responder_enumeration', start: at(49, 52), end: at(50, 25), type: 'act', status: 'suspended' },
      { id: 'cbs_ups_store', start: at(50, 25), end: at(50, 33), type: 'act', status: 'suspended' },
      { id: 'ups_store_mockery', start: at(50, 33), end: at(50, 49), type: 'act', status: 'active' },
      { id: 'responder_source_note', start: at(50, 49), end: at(50, 58), type: 'act', status: 'suspended' },
      { id: 'cbs_sheridan', start: at(50, 58), end: at(51, 15), type: 'act', status: 'suspended' },
      { id: 'sheridan_reaction', start: at(51, 15), end: at(51, 22), type: 'act', status: 'active' },
      { id: 'cyprus_and_responder', start: at(51, 22), end: at(51, 55), type: 'act', status: 'suspended' },
      { id: 'finest_orgs_and_both_sides', start: at(51, 55), end: at(52, 16), type: 'act', status: 'active' },
      { id: 'responder_deniability', start: at(52, 16), end: at(52, 40), type: 'act', status: 'suspended' },
      { id: 'searchlight', start: at(52, 40), end: at(53, 5), type: 'act', status: 'active' },
      { id: 'mail_and_trash', start: at(53, 5), end: at(53, 22), type: 'act', status: 'active' },
      { id: 'responder_bait', start: at(53, 22), end: at(54, 4), type: 'act', status: 'suspended' },
      { id: 'emancipation_reading', start: at(54, 4), end: at(55, 24), type: 'act', status: 'active' },
      { id: 'numbers_growing', start: at(55, 24), end: at(56, 2), type: 'act', status: 'active' },
      { id: 'green_flag', start: at(56, 2), end: at(56, 9), type: 'act', status: 'active' },
      { id: 'responder_hippocratic', start: at(56, 9), end: at(57, 11), type: 'act', status: 'suspended' },
      { id: 'out_of_state_and_lambda', start: at(57, 11), end: at(57, 52), type: 'act', status: 'active' },
      { id: 'final_panel', start: at(57, 52), end: at(58, 53), type: 'act', status: 'active' },
      { id: 'found_family_payoff', start: at(58, 53), end: at(59, 4), type: 'act', status: 'active' },
    ],

    keyframes: [
      /* ---- D1: paraphrase delivered as quotation ---- */
      {
        id: 'd1_find_and_support_you',
        timestamp: at(45, 1),
        significance: 0.9,
        certainty: 0.6,
        tags: ['doublespeak', 'D1_paraphrase_as_quote', 'read_aloud', 'borderline'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Producer reads "There are people in Texas who will find and support you." If the printed text is "will help you find support," the inversion converts an offer of help into a promise of pursuit — the sentence the rest of the segment assumes. CERTAINTY LOW: rests on a caption-vs-print comparison, neither verified.',
      },

      /* ---- D2: coinage that replaces an argument ---- */
      {
        id: 'd2_toxic_empathy',
        timestamp: at(45, 8),
        significance: 0.95,
        certainty: 0.85,
        tags: ['doublespeak', 'D2_naming_as_verdict', 'framework', 'beck'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"I\'m trying to point out this is toxic empathy. This is where it gets you." A coinage that pre-loads the verdict: once empathy can be toxic, no sympathetic reading of the pamphlet survives without being pathology. Does definitional work in nine words and is never argued for.',
      },

      /* ---- D3: sarcasm carrying the assertion ---- */
      {
        id: 'd3_that_sounds_safe',
        timestamp: at(46, 5),
        significance: 0.8,
        certainty: 0.75,
        tags: ['doublespeak', 'D3_sarcastic_entailment', 'beck'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Trust a group of strangers who don\'t live in Texas, who are adults, who want to talk to you about your private parts." — "That sounds safe." The predicate "safe/unsafe" is never asserted; it is delivered as irony, so the claim is audible but unquotable as a claim.',
      },

      /* ---- D4: disclaimed premise ---- */
      {
        id: 'd4_reads_the_caveat',
        timestamp: at(46, 26),
        significance: 0.8,
        certainty: 0.85,
        tags: ['doublespeak', 'D4_disclaimed_premise', 'read_aloud', 'beck'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Reads the document\'s own limitation — "Important laws and programs can change quickly. Always confirm current rules and eligibility directly with the organization" — then proceeds as though no limitation exists. The strongest available answer to his later complaint is quoted by him and dropped without comment.',
      },

      /* ---- D5: question that is an assertion ---- */
      {
        id: 'd5_who_is_paying',
        timestamp: at(46, 34),
        significance: 0.85,
        certainty: 0.8,
        tags: ['doublespeak', 'D5_question_as_assertion', 'provenance', 'beck'],
        description:
          '"who is paying for this? Who\'s behind it?" Interrogative form, accusatory function: the questions presuppose a hidden payer, and the presupposition is the content. Nothing in the segment retracts it when the CBS insert supplies an answer he does not adopt.',
      },

      /* ---- D6: denial treated as confirmation ---- */
      {
        id: 'd6_love_it',
        timestamp: at(49, 20),
        significance: 0.8,
        certainty: 0.5,
        tags: ['doublespeak', 'D6_denial_as_confirmation', 'tent', 'borderline'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'On TENT\'s denial: "Love it." / "Really?" / "Yeah, really." Reads as a man hearing a cover story, not a refutation. CERTAINTY LOW: four short lines with unmarked speakers; the "denial as confirmation" reading is inference from tone that captions cannot carry.',
      },

      /* ---- D7: geography as insinuation ---- */
      {
        id: 'd7_finest_organizations',
        timestamp: at(51, 55),
        significance: 0.6,
        certainty: 0.7,
        tags: ['doublespeak', 'D7_geographic_innuendo', 'bit', 'beck'],
        description:
          '"Only the finest organizations hide in Sheridan, Wyoming. And claim to be Texan." Mock-praise: the sentence\'s literal content is a compliment, its operative content is that the sender is a shell. Works because the audience completes the accusation, so he never states it.',
      },

      /* ---- D8 + D9: the marquee pairing ---- */
      {
        id: 'd8_shenanigans_admission',
        timestamp: at(52, 3),
        significance: 0.95,
        certainty: 0.9,
        tags: ['doublespeak', 'D8_vague_certainty', 'beck', 'key_quote'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"I don\'t really know what is going on here. Uh, shenanigans clearly are involved." Certainty and ignorance asserted in one breath: "clearly" attaches to the wrongdoing, "I don\'t know" attaches to everything that would identify it. The vague noun "shenanigans" is what lets both stand.',
      },
      {
        id: 'd9_double_switch_switcheroo',
        timestamp: at(52, 6),
        significance: 1.0,
        certainty: 0.9,
        tags: ['doublespeak', 'D9_symmetrical_speculation', 'beck', 'key_quote', 'marquee'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"I don\'t know if it\'s Republicans, I don\'t know if it\'s Democrats doing a double switch switcheroo." The segment\'s load-bearing hedge. Every fact on his own air — a Wyoming shell, an invalid return address, a denial from the named group, a mailer aimed at Republican and Hispanic households days before an election — points one way, and the sentence assigns equal weight to an unnamed alternative. Presents as open-mindedness; functions as indemnity.',
      },

      /* ---- D10: delegated accusation ---- */
      {
        id: 'd10_searchlight',
        timestamp: at(52, 40),
        significance: 0.75,
        certainty: 0.75,
        tags: ['doublespeak', 'D10_delegated_accusation', 'bit', 'beck'],
        description:
          '"We need a giant searchlight... Data Republican, Data Republican, you\'re needed... we put the big DR searchlight up on the clouds at night and she flies in." The conclusion he will not state is outsourced to a third party he summons; the invitation is the claim. Tagged `bit` — comedic form, real function.',
      },

      /* ---- D11: states the norm, breaks it in the same breath ---- */
      {
        id: 'd11_trash',
        timestamp: at(53, 13),
        significance: 0.8,
        certainty: 0.85,
        tags: ['doublespeak', 'D11_norm_stated_then_voided', 'beck'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"I can\'t throw their mail out illegally. That would be illegal for me to touch them. Nope, it\'s going right in the trash." Names the rule, asserts compliance, then narrates the violation in the next sentence — and the pivot word "Nope" is where the norm is discarded. Candour here is what makes the later framing of the sender as lawless register as fair.',
      },

      /* ---- D12: confession as rapport ---- */
      {
        id: 'd12_if_i_broke_the_law',
        timestamp: at(54, 4),
        significance: 0.7,
        certainty: 0.8,
        tags: ['doublespeak', 'D12_confession_as_charm', 'beck'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"I would never open my child\'s mail... but if I broke the law, which I guess I did, I opened it up and it says, What if I want to be emancipated?" The admission is volunteered, hedged ("I guess"), and immediately traded for the payoff quote — a confession that buys the standing to be scandalised.',
      },

      /* ---- D13: manufacturing the defect ---- */
      {
        id: 'd13_hyperlink',
        timestamp: at(55, 19),
        significance: 0.65,
        certainty: 0.9,
        tags: ['doublespeak', 'D13_manufactured_defect', 'bit', 'beck'],
        description:
          '"it gives a hyperlink, which I\'ve been clicking on on this paper. I keep clicking on it and it won\'t go." The joke has a second job: a printed guide is convicted of failing to be a website. Tagged `bit`, but it lands inside the segment\'s competence argument.',
      },

      /* ---- D14: statistics that cancel ---- */
      {
        id: 'd14_numbers_growing',
        timestamp: at(55, 37),
        significance: 0.85,
        certainty: 0.8,
        tags: ['doublespeak', 'D14_self_cancelling_statistics', 'claim', 'beck'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Lots of students are going through the same process you are. Lots of them. In fact, the numbers are growing. They\'re actually shrinking. They\'re actually falling off a cliff. But that has nothing to do with this fad being over." Four trend claims in five sentences, mutually exclusive, delivered with identical confidence, and "fad" carries the whole thesis.',
      },

      /* ---- D15: inverted signal ---- */
      {
        id: 'd15_green_flag',
        timestamp: at(56, 2),
        significance: 0.7,
        certainty: 0.75,
        tags: ['doublespeak', 'D15_inverted_signal', 'sarcasm', 'beck'],
        description:
          '"Can I go out of state for care? Another flag. That\'s a green flag for me as a parent. I got to give this right to my kid." Borrows the safety vocabulary of the caution it is mocking; "flag" and "green" are used against their plain sense so that a warning reads as an endorsement.',
      },

      /* ---- D16: inversive reframing of a familiar warning ---- */
      {
        id: 'd16_stranger_danger',
        timestamp: at(58, 6),
        significance: 0.85,
        certainty: 0.85,
        tags: ['doublespeak', 'D16_borrowed_warning', 'beck'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"No, talk to us, strangers, adults. Remember stranger danger? Doesn\'t apply here... we want to talk to you about your private parts and your most personal feelings and we\'ll tell you to keep secrets from your parents." Appropriates a child-safety slogan and reassigns its referent from predators to the pamphlet\'s authors — with "we" voiced as the document, so the accusation is spoken in the accused\'s mouth.',
      },

      /* ---- D17: autobiography as universal solvent ---- */
      {
        id: 'd17_until_i_was_35',
        timestamp: at(58, 36),
        significance: 0.6,
        certainty: 0.8,
        tags: ['doublespeak', 'D17_autobiographical_deflection', 'beck'],
        description:
          'After reading "give yourself time to figure out who you are": "Who am I? I don\'t know. I didn\'t know who I was until I was like 35." Converts a specific claim about adolescent identity into a joke at his own expense, which dissolves the claim without disputing it.',
      },

      /* ---- D18: stage-managed reveal ---- */
      {
        id: 'd18_last_line',
        timestamp: at(58, 53),
        significance: 0.9,
        certainty: 0.85,
        tags: ['doublespeak', 'D18_staged_reveal', 'framing', 'beck'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Oh my god. You read the last line in this?" Then the line: "These adults are ready to become your found family." "Last line" instructs the audience that what follows is the document\'s true conclusion rather than its closing sentence — sequencing presented as disclosure.',
      },

      /* ---- D19: the analogy that describes himself ---- */
      {
        id: 'd19_torch_analogy',
        timestamp: at(48, 7),
        significance: 0.8,
        certainty: 0.7,
        tags: ['doublespeak', 'D19_self_referential_analogy', 'beck', 'irony'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"like, Hey, we\'re just doing you a favor... join Torch... Somebody calls me and like, I didn\'t have anything to do with it, but I love it." Built to distance himself from anonymous benefactors, in the middle of a plug for his own subscription product, and it ends by endorsing the thing he claims no part in. The analogy reaches further than intended.',
      },
    ],

    windows: { strategy: 'scene_based' },
  },

  metadata: {
    canonicalName:
      'Doublespeak in the Glenn Beck pamphlet reading (derived analytical slice)',
    creators: ['Derived; no new authorship. Underlying audio: The Glenn Beck Program'],
    released: new Date('2026-10-23T00:00:00Z'),
    cultural_significance: 0.3,
    platform: 'Derived from YouTube 7g2IoTMGfPs',
    externalId: '7g2IoTMGfPs#doublespeak',
    durationSeconds: 14 * 60 + 12,
    activeSeconds: 8 * 60 + 4,
    suspendedSeconds: 6 * 60 + 8,
    contentType: 'rhetorical analysis / derived filter',
    transcriptProvenance:
      'Inherited from parent caption track; no audio verification; +/-2s at boundaries',
    deviceInventory: {
      D1: 'paraphrase as quotation (45:01)',
      D2: 'coinage as verdict — "toxic empathy" (45:08)',
      D3: 'sarcastic entailment — "that sounds safe" (46:05)',
      D4: 'disclaimed premise (46:26)',
      D5: 'question as assertion (46:34)',
      D6: 'denial as confirmation (49:20)',
      D7: 'geographic innuendo (51:55)',
      D8: 'vague certainty — "shenanigans" (52:03)',
      D9: 'symmetrical speculation — "double switch switcheroo" (52:06)',
      D10: 'delegated accusation — searchlight (52:40)',
      D11: 'norm stated then voided (53:13)',
      D12: 'confession as charm (54:04)',
      D13: 'manufactured defect — hyperlink (55:19)',
      D14: 'self-cancelling statistics (55:37)',
      D15: 'inverted signal — "green flag" (56:02)',
      D16: 'borrowed warning — stranger danger (58:06)',
      D17: 'autobiographical deflection (58:36)',
      D18: 'staged reveal — "last line" (58:53)',
      D19: 'self-referential analogy — Torch (48:07)',
    },
    deviceCounts: { assertional: 11, ironic_or_comic: 6, framing: 2 },
    uncertaintyNotes: [
      'All timestamps inherited from the excerpt universe, not re-derived.',
      'D1 depends on a print-vs-caption mismatch that was never verified against the physical mailer.',
      'D6 and D19 turn on tone, which auto-captions destroy; both carried below 0.6.',
      'D9 is the most confident entry (0.9) and the most consequential; if only one thing is checked against audio, check this.',
      'Filtering for one device type will always over-represent it. This universe cannot support a claim that Beck\'s segment is "mostly doublespeak" — only that these nineteen moments are.',
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
        type: 'DERIVES_FROM',
        targetUniverseId: EXCERPT_UNIVERSE_ID,
        confidence: 1.0,
        description:
          'Filtered from the transcription record for the same chapter: only Beck\'s own studio ' +
          'speech is kept, and the filter is the finding.',
      },
      {
        type: 'DERIVES_FROM',
        targetUniverseId: PARENT_UNIVERSE_ID,
        confidence: 1.0,
        description:
          'The response video whose runtime every offset here inherits, via the excerpt.',
      },
    ],
  },
} as unknown as Universe;

/** All universes derived from james-gibson/local-time#200. */
export const beckDoublespeakUniverses: Universe[] = [beckDoublespeakUniverse];
