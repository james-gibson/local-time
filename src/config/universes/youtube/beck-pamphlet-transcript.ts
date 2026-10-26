import {
  KeyframeType,
  TimePrecision,
  Universe,
  UniverseType,
} from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { toDerived } from '../../../utils/clock-drift';
import {
  RESPONSE_PUBLICATION_INSTANT,
  beckResponderDrift,
} from './beck-responder-clocks';

/**
 * The transcription record for the Beck passage: what is said, by whom, and how sure
 * the record is.
 *
 * `beck-responder-clocks.ts` models the two clocks and then stops, deliberately —
 * "the transcript is a separate question, answered in the lore record rather than here".
 * This module is that question, recorded in the corpus rather than in an issue comment
 * (james-gibson/local-time#200). It carries three things the drift model does not:
 *
 *   1. The audited passage, line by line, with a measured speaker on each line.
 *   2. The corrections the audio forced, including the four table rows a pause had
 *      silently shifted (see below).
 *   3. The caption artifacts, recorded as artifacts so nobody normalises them away.
 *
 * WHY THERE IS A THIRD UNIVERSE. The response video is 1:02:48 and the clip is 11:03;
 * the passage is neither. It is the chapter "Responding To Glenn Beck" (44:21-59:09) —
 * a 14m48s excerpt that contains the clip, the responder's overlays, and the verdict.
 * Modelled as its own work it can carry its own segments and keyframes without
 * inflating either parent, which is the rule the corpus already holds to (a re-slice is
 * not new cultural weight).
 *
 * WHY IT HAS NO CLOCK OF ITS OWN. This excerpt is addressed on the *parent's* runtime,
 * so `responseRuntimeOf(keyframe.timestamp)` on this universe and on
 * `timWhitakerResponseUniverse` return the same number for the same instant. A note
 * written here is addressable against the source video with no conversion. A
 * zero-reference epoch would have given the same instants a second address space and a
 * second chance to drift; the two-clock model over the clip is already in
 * `beckResponderDrift` and is imported, not restated.
 *
 * THE THREE CORRECTIONS (#200, 2026-10-26)
 *
 *   C1  The cost claim is Beck's, not "the programme's". The previous definition
 *       hedged because the transcript had no speaker labels. Two embedding models, six
 *       host anchors and five producer anchors score the passage at 0.86 Beck /
 *       0.33-0.35 producer, and the producer's own reporting reverses. Beck asks at
 *       01:07, answers himself from his own copy, and hands off only at 01:28.
 *
 *   C2  The address field was read aloud twice — "students of the Glenn Beck family"
 *       (04:42) and "students of the Glenn Beck household" (05:11). A role-keyed
 *       salutation with a named household, read by the recipient holding the piece.
 *
 *   C3  The parent is "Why Christians Lie About Transgender Kids", not "I Caught Allie
 *       Stuckey Lying About What's Happening in Texas", which does not exist on the
 *       channel; the Stuckey response is an earlier chapter. The old parent id was
 *       therefore unaddressable and is recorded here as an error, not as a variant.
 *
 * THE FOUR STALE ROWS, AND WHY THEY STAY IN THE FILE. The 01:07-01:36 table was timed
 * before the drift was modelled. A pause begins at clip 01:26.48 (the responder cuts in
 * at 47:03 and resumes at 47:37), and every row after it is 35.5-36.5 s early on the
 * response clock — including the hand-off, which was recorded at 47:02 but is not heard
 * until 47:38. Those values are kept as `supersededResponseSeconds` so the record shows
 * its own history; `tests/youtube/beck-pamphlet-transcript.test.ts` asserts the drift
 * model *disagrees* with them, which is what stops one being quietly re-imported.
 *
 * NOT MODELLED: the pamphlet's printed text. Every quoted line is "as read aloud on
 * air". The addressee field, the stock and the coating remain unobserved except where
 * Beck reads them. The register question (sincere, ironic, or performed) is bounded by
 * where the clip's own laughter marks fall and is otherwise unscored.
 *
 * ALSO NOT MODELLED: the 13-block reading map in the original #200 draft (front panel,
 * body, caveat, return address, emancipation, care, closing). It was caption-derived,
 * out of printed order, and every block carried the same unverified standing, so
 * carrying it here would have preserved the shape of the segment while hiding that no
 * line of it had been checked against audio. The audited passage below is the part that
 * was.
 *
 * Sources: caption track of youtube:uzgYKMZDeJ4 (en-orig/json3) plus an independent ASR
 * pass (faster-whisper, base.en, word timings) — the two agree word for word on the
 * audited passage; speaker embeddings as recorded in `beckSpeakerAttribution`; the
 * responder's caption track and chapter list; the Podscripts transcript of the
 * 21 October 2026 programme. Retrieved 2026-10-26.
 */

const RESPONDER_ID = 'series:tim_whitaker_why_christians_lie_about_transgender_kids:2026';
const CLIP_ID = 'series:glenn_beck_you_wont_believe_what_i_got_in_the_mail:2026';
const CONTROVERSY_ID = 'history:texas_trans_student_mailer_controversy:2026';

/**
 * The excerpt's own id. It is a chapter of the response, so it is a `series:` id; the
 * slug names the passage rather than the parent, because the passage is what this
 * universe owns. (#200 proposed a `media:` path and a `youtube` film id; the corpus has
 * a `youtube/` namespace and uses `series:` for video, so both are correct here.)
 */
const UNIVERSE_ID = 'series:beck_pamphlet_transcript:2026';

/** Seconds — fractional allowed — to nanoseconds, via milliseconds so no float reaches bigint. */
const sec = (seconds: number): bigint => BigInt(Math.round(seconds * 1000)) * 1_000_000n;

/** One instant on the response video's clock, given as seconds into that video. */
const atResponse = (seconds: number): bigint =>
  RESPONSE_PUBLICATION_INSTANT + sec(seconds);

/* ------------------------------------------------------------------ *
 * Segment bounds, on the parent's runtime
 * ------------------------------------------------------------------ */

/** Chapter "Responding To Glenn Beck" opens here; the responder is still talking. */
const CHAPTER_OPEN = 44 * 60 + 21; // 44:21

/** The clip starts playing. Both clocks agree on this instant by construction. */
const PLAYBACK_START = 2692.52; // 44:52.52

/** The clip stops. Its own clock has run 517 s (8:37) of 663 s. */
const PLAYBACK_END = 59 * 60 + 3; // 59:03

/** The responder's verdict, which is where the parent's closing phase begins. */
const VERDICT_START = 59 * 60 + 4; // 59:04

/** The excerpt ends with the verdict's last word; the meditation after it is out of scope. */
const EXCERPT_END = 59 * 60 + 9; // 59:09

/* ------------------------------------------------------------------ *
 * The transcript
 * ------------------------------------------------------------------ */

/**
 * Who is speaking.
 *
 * `unresolved` is a first-class value, not a placeholder: a two-voice model cannot
 * separate a line delivered over studio laughter, and recording "probably Beck" as
 * `beck` would launder a guess into a label.
 */
export type TranscriptSpeaker = 'beck' | 'producer' | 'responder' | 'cbs' | 'unresolved';

export interface TranscriptUtterance {
  id: string;
  speaker: TranscriptSpeaker;
  /** Start on the clip's own clock, seconds into youtube:uzgYKMZDeJ4. */
  clipSeconds: number;
  /**
   * Independently measured position in the response video, where the measurement
   * survived the drift correction. Absent means "derive it" — see
   * {@link deriveResponseSeconds}.
   */
  responseSeconds?: number;
  /**
   * Where the pre-drift timing table put this line. Recorded, not used. Every row after
   * clip 01:26.48 is 35.5-36.5 s early because one pause was not accounted for.
   */
  supersededResponseSeconds?: number;
  /** Confidence in the speaker label, 0-1. */
  attribution: number;
  /** Verified wording, lightly punctuated. "As heard", never "as printed". */
  text: string;
  tags: string[];
  note?: string;
}

/**
 * The passage the audio audit turned on: Beck reads the mailer, prices it aloud, and
 * hands off. Ten lines, clip 01:07-01:36.
 *
 * Wording is verified — caption track and independent ASR agree word for word. The
 * response column is the drift model's, not a second measurement, except where
 * `responseSeconds` is present.
 */
export const beckAuditedPassage: readonly TranscriptUtterance[] = [
  {
    id: 'producer_question',
    speaker: 'beck',
    clipSeconds: 67,
    responseSeconds: 2803,
    attribution: 0.95,
    text: 'Jason, what did you find out?',
    tags: ['beck', 'hand-off', 'verified'],
  },
  {
    id: 'mail_arrival',
    speaker: 'beck',
    clipSeconds: 68,
    responseSeconds: 2804,
    attribution: 0.9,
    text:
      'Now, this is literally — we all came in this morning and we\'re like, "Did you get ' +
      'this in the mail?"',
    tags: ['beck', 'anecdote', 'verified'],
  },
  {
    id: 'candy_in_texas',
    speaker: 'beck',
    clipSeconds: 73,
    responseSeconds: 2809,
    attribution: 0.9,
    text: 'So, this being — it\'s like candy in Texas.',
    tags: ['beck', 'saturation', 'verified'],
    note:
      'Stable across both transcriptions. The referent is not recoverable from the ' +
      'audio alone: volume, desirability, or something shown on screen.',
  },
  {
    id: 'every_mailbox',
    speaker: 'beck',
    clipSeconds: 76,
    responseSeconds: 2810,
    attribution: 0.9,
    text: 'It\'s coming every mailbox.',
    tags: ['beck', 'saturation', 'verified'],
    note:
      'The saturation claim, and it is the host\'s — supplied in the same breath as the ' +
      'addressing observations at 04:42 and 05:11.',
  },
  {
    id: 'cost_claim',
    speaker: 'beck',
    clipSeconds: 79,
    responseSeconds: 2814,
    attribution: 0.86,
    text:
      'Uh, so it had to cost a lot of money, cuz it\'s, you know, it\'s a full color heavy ' +
      'paper mailer.',
    tags: ['beck', 'production-value', 'key_quote', 'verified'],
    note:
      '"Had to" is an epistemic modal of inference: he deduces the spend from the ' +
      'surface of the piece rather than reporting a figure. The claim survives the audit ' +
      'as the host\'s grammar, not as knowledge.',
  },
  {
    id: 'not_cheap',
    speaker: 'beck',
    clipSeconds: 86,
    responseSeconds: 2821,
    attribution: 0.86,
    text: 'I mean, this — this was not cheap.',
    tags: ['beck', 'production-value', 'verified'],
  },
  {
    id: 'handoff_to_producer',
    speaker: 'beck',
    clipSeconds: 88,
    responseSeconds: 2857.5,
    supersededResponseSeconds: 2822,
    attribution: 0.95,
    text: 'And what did you find out about who sent this out, Jason?',
    tags: ['beck', 'hand-off', 'drift_corrected', 'verified'],
    note:
      'The pause starts at clip 01:26.48, before this line. The responder cuts in at ' +
      '47:03 and resumes at 47:37, so the hand-off is heard at 47:37.5 — not at 47:02, ' +
      'which is where the pre-drift table put it.',
  },
  {
    id: 'producer_opens',
    speaker: 'producer',
    clipSeconds: 91,
    supersededResponseSeconds: 2825,
    attribution: 0.89,
    text: 'Well, it\'s weird.',
    tags: ['producer', 'drift_corrected', 'verified'],
    note:
      'The nearest of the clip\'s four laughter marks (01:35) is nine seconds after the ' +
      'cost claim ends and falls at the hand-off, not on the figure. The studio treats ' +
      'the hand-off as the joke.',
  },
  {
    id: 'goes_without_saying',
    speaker: 'unresolved',
    clipSeconds: 95,
    supersededResponseSeconds: 2828,
    attribution: 0.5,
    text: 'Goes without saying.',
    tags: ['drift_corrected', 'laughter', 'unresolved_speaker'],
    note:
      'Delivered over [laughter]. The two-voice model cannot separate speech from ' +
      'laughter, so the label stays unresolved rather than defaulting to the host.',
  },
  {
    id: 'resources_listed',
    speaker: 'producer',
    clipSeconds: 96,
    supersededResponseSeconds: 2830,
    attribution: 0.9,
    text: 'So they list a bunch of different resources…',
    tags: ['producer', 'drift_corrected', 'verified'],
  },
];

/**
 * Where an utterance that starts on the clip clock is heard on the response clock.
 *
 * The single place this module does arithmetic: the drift model is the only thing that
 * knows about the ten stops, and restating the offsets by hand is what produced the
 * four stale rows above.
 */
export const deriveResponseSeconds = (utterance: TranscriptUtterance): number =>
  Number(toDerived(beckResponderDrift, sec(utterance.clipSeconds))) / 1e9;

/* ------------------------------------------------------------------ *
 * The address field, read aloud twice
 * ------------------------------------------------------------------ */

export interface AddressReading {
  id: string;
  /** Where the reading starts, on the clip clock. */
  clipSeconds: number;
  /** The keyframe in this module that records the same reading. */
  keyframeId: string;
  /** Where that keyframe sits, on the parent's runtime. */
  keyframeClipSeconds: number;
  text: string;
  note?: string;
}

/**
 * The one fact in the passage that is about the artifact rather than about Beck: the
 * recipient holding the piece reads the addressee field out, twice, in the same
 * role-keyed form.
 *
 * The two passes disagree by 5 s on where the second reading begins — the audit quotes
 * 05:11, the aligned keyframe sits at 05:16. That is a boundary convention, not a
 * contradiction (the audit marks the start of the quotation, the keyframe marks the
 * field itself), and it is recorded rather than reconciled: the audio is not in the
 * corpus, so picking one would be a guess wearing a timestamp.
 */
export const beckAddressReadings: readonly AddressReading[] = [
  {
    id: 'household_family',
    clipSeconds: 282,
    keyframeId: 'addressing_read',
    keyframeClipSeconds: 282,
    text: 'this is coming to the house of students of the Glenn Beck family',
  },
  {
    id: 'household_students',
    clipSeconds: 311,
    keyframeId: 'household_read',
    keyframeClipSeconds: 316,
    text: 'if it\'s addressed directly to them, students of the Glenn Beck household',
    note:
      'Read 5 s apart from the aligned keyframe. See this record\'s header: the ' +
      'difference is where each pass put the boundary, and it is not resolved here.',
  },
];

/* ------------------------------------------------------------------ *
 * The measurements
 * ------------------------------------------------------------------ */

/**
 * Speaker attribution, as measured. Two models, independent, from anchors taken inside
 * the same clip — not inferred from turn structure, which is what the caption track
 * invites and what the previous definition could not do.
 */
export const beckSpeakerAttribution = {
  method: 'cosine similarity to anchor centroids, two models independently',
  models: ['ECAPA-VoxCeleb', 'ResNet-VoxCeleb'],
  beckAnchors: 6,
  producerAnchors: 5,
  auditedPassage: {
    clipRange: '01:08-01:27',
    beck: 0.86,
    producer: { min: 0.33, max: 0.35 },
    verdict: 'beck' as const,
  },
  producerPassage: {
    clipRange: '01:32-01:53',
    beck: { min: 0.07, max: 0.21 },
    producer: { min: 0.87, max: 0.94 },
    verdict: 'producer' as const,
  },
  namedProducer: 'Jason',
  captionArtifact: 'The responder\'s caption track renders the producer as "Grace".',
} as const;

/**
 * Non-speech marks on the clip clock, from the caption track. They are data about
 * delivery, not punctuation — the only delivery evidence the corpus has, and the reason
 * the register question is *bounded* rather than answered.
 */
export const beckLaughterMarks = [
  { clipSeconds: 95, label: '[laughter]' },
  { clipSeconds: 138, label: '[laughter]' },
  { clipSeconds: 237, label: '[laughter]' },
  { clipSeconds: 274, label: '[laughter]' },
] as const;

/**
 * Captions that guess. Recorded with the value they should have had, because the
 * failure mode here is a caption inventing a *cast*: two names that do not exist,
 * restated across four rounds of analysis as if a studio of Jason-and-Grace had been
 * modelled.
 */
export const beckCaptionArtifacts = [
  {
    id: 'grace_for_jason',
    kind: 'proper_noun' as const,
    caption: 'Grace, what did you find?',
    verified: 'Jason, what did you find out?',
    clipSeconds: 67,
    note: 'A producer who is not there. One named producer, not two.',
  },
  {
    id: 'tint_for_tent',
    kind: 'proper_noun' as const,
    caption: 'Tint',
    verified: 'TENT',
    note: 'The Transgender Education Network of Texas, in the same pass that invented "Grace".',
  },
] as const;

/**
 * One finding that runs the other way, recorded so the series does not only collect
 * errors that flatter it.
 */
export const beckSecondaryFinding = {
  id: 'switcheroo_is_the_producers',
  clipRange: '04:07-04:20',
  beck: 0.13,
  producer: 0.83,
  verdict: 'producer' as const,
  note:
    'The "I don\'t know if it\'s Republicans, I don\'t know if it\'s Democrats doing a ' +
    'double switcheroo" passage is the producer\'s, and the responder quotes it back as ' +
    'Beck\'s at 52:16. Not load-bearing for this segment — but it is the same error class ' +
    'running in the opposite direction: attributing a line on the strength of the ' +
    'register one expected.',
} as const;

/* ------------------------------------------------------------------ *
 * Keyframes
 * ------------------------------------------------------------------ */

/**
 * One keyframe of the excerpt, on the parent's clock.
 *
 * Where the excerpt records the same occurrence as the parent, it names the parent's
 * keyframe rather than the clip's: the immediate container is the honest target, and the
 * parent already points at the clip per occurrence. Two hops, no ambiguous edges.
 */
const keyframe = (
  id: string,
  responseSeconds: number,
  type: KeyframeType,
  significance: number,
  tags: string[],
  description: string,
  targetKeyframeType?: KeyframeType,
) => ({
  id,
  timestamp: atResponse(responseSeconds),
  significance,
  certainty: 0.9,
  precision: TimePrecision.SECOND,
  tags,
  type,
  description,
  ...(targetKeyframeType
    ? {
        targetUniverseId: RESPONDER_ID,
        targetKeyframeId: id,
        targetKeyframeType,
      }
    : {}),
});

/* ------------------------------------------------------------------ *
 * The excerpt
 * ------------------------------------------------------------------ */

export const beckPamphletTranscriptUniverse = {
  universeId: UNIVERSE_ID,
  type: UniverseType.SERIES,

  identifiers: {
    primary: `${RESPONDER_ID}#t=44m21s-59m09s`,
    aliases: [
      'Responding To Glenn Beck',
      'Beck reads the Texas Trans and LGBTQ+ Student Resource Guide',
      'toxic empathy segment',
      'Glenn Beck pamphlet transcript',
    ],
  },

  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,

    realityAnchors: [
      {
        realEventId: CLIP_ID,
        relationshipType: 'excerpts',
        confidence: 0.95,
        evidence: [
          'The clip exists on the Glenn Beck channel: youtube:uzgYKMZDeJ4, 2026-10-21T23:00:21Z, 11:03',
          'The responder names its source on air ("Glenn posted this clip I\'m showing", 50:56)',
          'Caption track and independent ASR agree word for word on the audited passage (01:07-01:36)',
          'Speaker labels measured with two embedding models; see `beckSpeakerAttribution`',
        ],
      },
      {
        realEventId: 'event:glenn_beck_program:2026',
        relationshipType: 'excerpts',
        confidence: 0.9,
        evidence: [
          'Programme episode dated 2026-10-21: "Millions of Texans Receive Transgender Pamphlets Targeted at KIDS?! | Guest: Andy Ngo"',
          'The same passage sits in the programme transcript at 01:32:49, immediately after a Medicare/Chapter paid read at 01:31:06',
        ],
      },
      {
        realEventId: CONTROVERSY_ID,
        relationshipType: 'documents',
        confidence: 0.9,
        evidence: [
          'CBS News Texas insert replayed at 49:43-51:14: Meadow Place return address, Sheridan WY registration',
          'Beck, holding a copy: "a full color heavy paper mailer" (01:23), "coming every mailbox" (01:16)',
          'Beck reads the addressee field aloud twice: "students of the Glenn Beck household" (05:11)',
        ],
      },
    ],
  },

  attribution: {
    copyright: {
      holders: ['Tim Whitaker Speaks', 'Glenn Beck', 'Blaze Media'],
      year: 2026,
      status: 'active',
    },
    citations_required: true,
    sources: [
      'Caption track of youtube:uzgYKMZDeJ4 (en-orig/json3) and an independent ASR pass (faster-whisper base.en), 2026-10-26',
      'Caption track and chapter list of youtube:7g2IoTMGfPs, 2026-10-26',
      'Podscripts transcript of The Glenn Beck Program, 21 October 2026',
      'CBS News Texas segment as replayed at 49:43-51:14',
    ],
    usage_restrictions: [
      'Quotes are re-verified against the source audio but remain ASR-derived: "as read aloud" is not "as printed".',
      'Three stacked rights holders — the response channel, the Beck programme, and the CBS insert. The pamphlet is a fourth and unidentified.',
      'Do not re-publish Beck programme audio from this definition.',
      'Speaker labels are measured for two dominant studio voices only. A third voice would collapse into the nearer cluster.',
      'Cite by time, not by transcript line: the Podscripts line anchors used in earlier rounds no longer resolve.',
    ],
  },

  layers: [
    {
      layerId: 'runtime',
      type: 'primary',
      epochs: {
        chapter: {
          epochId: `${UNIVERSE_ID}:runtime`,
          startTime: atResponse(CHAPTER_OPEN),
          endTime: atResponse(EXCERPT_END),
          precision: TimePrecision.SECOND,
          description:
            'Deliberately the parent\'s clock: this epoch starts at the parent\'s 44:21 ' +
            'and every keyframe below is an absolute instant on it, so a note written ' +
            'here resolves against the source video without conversion.',
        },
      },
    },
    {
      layerId: 'clip_playback',
      type: 'recreation',
      reality_correspondence: {
        to: CLIP_ID,
        accuracy: 0.9,
        deviations: [
          'Discontinuous: the responder plays 00:00-08:37 of an 11:03 clip, and stops it ten times.',
          'The responder talks over the studio audio and, at 47:03, cuts in at the hand-off to the producer.',
          'Two voices are separable; laughter, crosstalk and any third studio voice are not.',
        ],
      },
      epochs: {
        playback: {
          epochId: `${UNIVERSE_ID}:playback`,
          startTime: atResponse(PLAYBACK_START),
          endTime: atResponse(PLAYBACK_END),
          precision: TimePrecision.SECOND,
          description:
            'The clip runs inside the response. Its offset grows across the band ' +
            '(0 s at the start, 333.39 s at the last frame); `beckResponderDrift` is the ' +
            'map, and this epoch is the span, not the arithmetic.',
        },
      },
    },
  ],

  temporalStructure: {
    segments: [
      {
        id: 'chapter_open',
        start: atResponse(CHAPTER_OPEN),
        end: atResponse(PLAYBACK_START),
        type: 'phase',
        status: 'active',
        description:
          'The chapter opens and the responder introduces the clip. No Beck playback yet.',
      },
      {
        id: 'clip_playback',
        start: atResponse(PLAYBACK_START),
        end: atResponse(PLAYBACK_END),
        type: 'phase',
        status: 'active',
        description:
          'Beck plays, paused ten times for overlays. The transcript in this module is ' +
          'a record of this phase at the clip\'s own resolution.',
      },
      {
        id: 'verdict',
        start: atResponse(VERDICT_START),
        end: atResponse(EXCERPT_END),
        type: 'phase',
        status: 'active',
        description:
          'The clip has stopped and the responder delivers the verdict — "these people ' +
          'are just vile" — which is also where the parent\'s closing phase begins.',
      },
    ],

    keyframes: [
      keyframe(
        'chapter_opens',
        CHAPTER_OPEN,
        KeyframeType.MILESTONE,
        0.6,
        ['chapter', 'excerpt_start'],
        'The chapter "Responding To Glenn Beck" opens at 44:21 in the response video. ' +
          'The excerpt band starts here rather than at the playback point, because the ' +
          'responder is already speaking about the piece.',
      ),
      keyframe(
        'playback_start',
        PLAYBACK_START,
        KeyframeType.ZERO_POINT,
        1.0,
        ['clock', 'zero', 'clip-start'],
        'The clip starts: "Jason, did you get one of these?" The one instant the two ' +
          'clocks share without arithmetic.',
        KeyframeType.ZERO_POINT,
      ),
      keyframe(
        'cost_claim',
        2814,
        KeyframeType.PUBLIC_STATEMENT,
        1.0,
        ['beck', 'production-value', 'key_quote', 'transcript'],
        'Beck prices the mailer from its surface: "it had to cost a lot of money ... a ' +
          'full color heavy paper mailer ... this was not cheap." Measured as his, 0.86 ' +
          'beck against 0.33-0.35 producer.',
        KeyframeType.PUBLIC_STATEMENT,
      ),
      keyframe(
        'handoff_to_producer',
        2857.5,
        KeyframeType.MILESTONE,
        0.9,
        ['hand-off', 'drift_corrected', 'transcript'],
        'The hand-off is heard at 47:37.5, after the third stop — not at 47:02, where the ' +
          'pre-drift table put it. The responder cuts in at 47:03 and the clip resumes at ' +
          '47:36.',
        KeyframeType.MILESTONE,
      ),
      keyframe(
        'addressing_read',
        3183,
        KeyframeType.PUBLIC_STATEMENT,
        1.0,
        ['addressing', 'artifact', 'key_finding', 'transcript'],
        'Beck reads the addressee field aloud: "this is coming to the house of students of ' +
          'the Glenn Beck family." A role-keyed salutation with a named household, read ' +
          'by the recipient holding the piece.',
        KeyframeType.PUBLIC_STATEMENT,
      ),
      keyframe(
        'household_read',
        3252,
        KeyframeType.PUBLIC_STATEMENT,
        0.9,
        ['addressing', 'artifact', 'transcript'],
        'The second reading of the same field: "if it\'s addressed directly to them, ' +
          'students of the Glenn Beck household." The transcript audit quotes the boundary ' +
          'at 05:11; this keyframe sits at 05:16.',
        KeyframeType.PUBLIC_STATEMENT,
      ),
      keyframe(
        'playback_end',
        PLAYBACK_END,
        KeyframeType.MILESTONE,
        1.0,
        ['clock', 'clip-end'],
        'The clip stops at "Wow", 8:37 into its own 11:03 runtime. The remaining 146 s are ' +
          'never played and must not be treated as part of the excerpt.',
        KeyframeType.MILESTONE,
      ),
      keyframe(
        'verdict',
        VERDICT_START,
        KeyframeType.PUBLIC_STATEMENT,
        0.6,
        ['responder', 'verdict', 'excerpt_end'],
        '"These people are just — these people are vile." The responder, not the clip: ' +
          'the excerpt ends on a comment, and the meditation after 59:09 is out of scope.',
      ),
    ],

    windows: { strategy: 'phase_based' },
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.US_HISTORY],
    },
    references: [
      {
        type: 'EXCERPTS',
        targetUniverseId: RESPONDER_ID,
        confidence: 1.0,
        description:
          'A 14m48s slice of the response video\'s own runtime: the chapter "Responding ' +
          'To Glenn Beck", 44:21-59:09.',
        evidence: ['Chapter boundary at 44:21 from the video\'s chapter list'],
      },
      {
        type: 'QUOTES',
        targetUniverseId: CLIP_ID,
        confidence: 0.95,
        description:
          'The excerpt quotes the clip line by line: ten utterances transcribed at the ' +
          'clip\'s own resolution, with a measured speaker on each.',
        evidence: [
          'Caption track and independent ASR agree word for word on 01:07-01:36',
          'Speaker labels corroborated by two embedding models',
        ],
      },
    ],
  },

  metadata: {
    canonicalName: 'Responding To Glenn Beck (transcription record)',
    description:
      'The chapter in which a mailed pamphlet about Texas transgender students is read ' +
      'aloud inside a response video: Beck prices it, a producer reports the return ' +
      'address and registration, and a CBS News Texas insert is replayed. Recorded here ' +
      'for its transcript, not for its argument.',
    creators: ['Tim Whitaker'],
    released: new Date(Number(RESPONSE_PUBLICATION_INSTANT / 1_000_000n)),
    cultural_significance: 0.3,
    platform: 'YouTube',
    externalId: '7g2IoTMGfPs#44:21-59:09',
    contentType: 'excerpted broadcast reading / transcription record',

    /**
     * Counts and provenance only. The text lives in `beckAuditedPassage`, and the test
     * asserts these numbers describe it — duplicating the lines here would create a
     * second copy that can drift.
     */
    transcript: {
      source: 'clip clock (youtube:uzgYKMZDeJ4)',
      verification: 'caption track + independent ASR, word-for-word agreement',
      auditedUtterances: 10,
      addressReadings: 2,
      laughterMarks: 4,
      captionArtifacts: 2,
      drift: 'beckResponderDrift (src/utils/clock-drift.ts); response offsets derived, not restated',
    },

    verification: {
      performed: '2026-10-26',
      instruments: [
        'Machine caption track, youtube:uzgYKMZDeJ4, en-orig json3',
        'Independent ASR: faster-whisper, base.en, word timings',
        'Speaker embeddings: ECAPA-VoxCeleb and ResNet-VoxCeleb',
        'Chapter metadata and upload instants from both videos',
        'Podscripts transcript of the 21 October 2026 programme',
      ],
      result: 'word-for-word agreement between the caption track and the ASR pass on 01:07-01:36',
      limits: [
        'Register is not measured. Only the position of the clip\'s own laughter marks.',
        'Two-voice model. A third studio voice would be assigned to the nearer cluster.',
        'The pamphlet has not been examined. Everything printed is known only as read aloud.',
      ],
    },

    speakerAttribution: beckSpeakerAttribution,

    findings: [
      'C1 — the cost claim is Beck\'s. The "attribute it to the programme" hedge is retired, and with it the 0.55 cap on every reading of this segment.',
      'C2 — the address field was read aloud twice, by the recipient, in a role-keyed form: "students of the Glenn Beck family" / "students of the Glenn Beck household".',
      'C3 — the parent is "Why Christians Lie About Transgender Kids". "I Caught Allie Stuckey Lying About What\'s Happening in Texas" does not exist on the channel; the Stuckey response is a chapter at 28:44.',
      'The clip\'s laughter marks fall at 01:35, 02:18, 03:57 and 04:34 — none on the cost claim. The register question is bounded, not answered.',
      'The mailer segment begins immediately after a Medicare/Chapter paid read (programme 01:31:06). Adjacent to an ad, not inside one.',
      'Four rows of the pre-drift timing table are 35.5-36.5 s early because the pause at clip 01:26.48 was not accounted for. They are kept as `supersededResponseSeconds`.',
    ],

    /**
     * Credences the audit produced. Recorded at the precision they were stated, and not
     * renormalised: several were revised mid-thread, and the revision is the data.
     */
    credences: {
      cost_line_spoken_by_beck: 0.95,
      cost_line_spoken_by_a_producer: 0.05,
      beck_holds_non_public_knowledge_of_payer: 0.1,
      register_is_ironic_or_mocking: 0.2,
      register_is_sincere: 0.6,
      audience_receives_they_have_money_regardless: 0.9,
      addressed_to_students_means_generic_salutation: 0.7,
      segment_was_bracketed_by_paid_reads: 0.9,
      transcript_reverified: 0.97,
      production_value_was_the_message_not_the_overhead: 0.55,
    },

    deciderDocuments: [
      'A photograph of the address panel: the verbatim field above the household name',
      'A second recipient\'s piece, to see whether "students" varies or is fixed copy',
      'The hour\'s ad log, to place the Medicare read relative to the segment',
      'The Mail.dat or permit paperwork, now that saturation is live again',
      'Audio of the same passage on the 21 October broadcast, to compare against the YouTube cut',
    ],

    /**
     * What the record still cannot say. Kept next to the data rather than in prose, so
     * the gap travels with the file.
     */
    uncertaintyNotes: [
      'The pamphlet has not been examined. Coating, stock and the addressee field are known only from Beck reading them aloud.',
      '"It\'s like candy in Texas" (01:13) is stable across both transcriptions, but its referent is not recoverable from the audio.',
      'Speaker attribution is a two-voice model; "Goes without saying" (01:35) is recorded unresolved because laughter overlaps it.',
      'The register question is bounded rather than answered: four laughter marks, none on the claim.',
      'The second address reading is quoted at 05:11 by the transcript audit and placed at 05:16 by the aligned keyframe. Boundary convention; unresolved without the audio in hand.',
      'Beck\'s "Meadow Place" / "Meadows Place" toponym was recorded in an earlier round and was not re-audited in the final pass.',
      'The 13-block reading map in the #200 draft is not carried: caption-derived, out of printed order, and never checked against audio. The audited passage is the part that was.',
    ],

    sourcing: {
      verified: [
        'Both upload instants, runtimes and the chapter list from YouTube metadata',
        'Caption track and ASR agreement on the audited passage',
        'Ten pauses recovered from word-level alignment of the two caption tracks (see `beckResponderDrift`)',
        'Programme episode date and the adjacent paid read from the Podscripts transcript',
      ],
      notRecorded: [
        'The broadcast hour: the episode date is known, the airtime is not',
        'Whether the YouTube cut is the broadcast cut or an edit',
        'The Podscripts line anchors used in earlier rounds; they no longer resolve (the passage now sits near line 3226, not 3462)',
      ],
    },
  },
} as unknown as Universe;
