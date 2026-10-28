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
 * "Glenn Beck reads the Texas Trans & LGBTQ+ Student Resource Guide" — the reading map.
 *
 * WHAT THIS IS. The pamphlet is a printed document that exists, in this corpus, only as
 * spoken fragments. This universe is the map of those fragments: thirteen discrete
 * readings, in the order they were read, each with the printed slot it came from, the
 * voice that read it, and how far the wording can be trusted. It is not a transcript of
 * the segment — that is `series:beck_pamphlet_transcript:2026` — and it is not a slice of
 * rhetoric — that is `series:beck_pamphlet_doublespeak:2026`. It is the document as it
 * was ventriloquised on air, minuted.
 *
 * WHY IT IS A SEPARATE UNIVERSE. The draft this replaces (james-gibson/local-time#200,
 * issue body, `media/beck_pamphlet_reading_2026.ts`) was declined by PR #202 because it
 * was caption-derived, read out of printed order, and never checked against audio. The
 * re-verification of 2026-10-26 did not make the whole map auditable: it audited ten
 * lines of the cost passage, the two address readings, the four laughter marks and the
 * speaker identity. Twelve of the thirteen blocks below therefore remain caption-only
 * (one of the twelve contains a verified clause), and the module says so block by block
 * instead of carrying one unverified standing for all of them. What the re-verification
 * does change is the *attribution*: the draft's cost block names the wrong speaker, and a
 * map that copied it would have reintroduced the error the audit retired.
 *
 * THE THREE CORRECTIONS (#200, 2026-10-26 04:32), APPLIED
 *
 *   C1  THE COST CLAIM IS BECK'S, NOT THE PRODUCER'S. The draft's `cost_and_saturation`
 *       block attributes "we all came in this morning ... it had to cost a lot of money"
 *       to the producer. Two embedding models put the passage at 0.86 Beck / 0.33-0.35
 *       producer, and the producer's own reporting reverses (0.87-0.94 producer /
 *       0.07-0.21 Beck). Beck asks at 01:07, answers from his own copy at 01:08-01:26,
 *       and hands off at 01:28. The cost line is not one of the thirteen readings, so it
 *       appears here as a claim with a measured voice rather than as a block — but the
 *       draft's attribution must not be reintroduced through this map.
 *
 *       THE PRECEDENCE IS NOT SYMMETRIC. The first attribution was made under
 *       uncertainty — an unlabelled machine transcript, no speaker marks — and the second
 *       pass re-checked it against the audio and decided it. The earlier record is kept in
 *       `beckReadingCorrections` as history, not as standing: a pass that verifies an
 *       uncertain claim outranks it, and the two are not rival opinions to be weighed.
 *
 *   C2  THE ADDRESS FIELD WAS READ ALOUD, TWICE, BY THE RECIPIENT: "this is coming to the
 *       house of students of the Glenn Beck family" (04:42 on the clip) and "if it's
 *       addressed directly to them, students of the Glenn Beck household" (05:11). A
 *       role-keyed salutation with a named household. These are the only two blocks whose
 *       wording the audio audit touched, and they are the map's load-bearing readings.
 *
 *   C3  THE PARENT IS "Why Christians Lie About Transgender Kids" (Tim Whitaker Speaks,
 *       2026-10-23, 1:02:48), not "I Caught Allie Stuckey Lying About What's Happening in
 *       Texas", which does not exist on the channel. The Stuckey response is an earlier
 *       chapter at 28:44. The draft's parent id was unaddressable, and every instant in
 *       it was therefore unaddressable too.
 *
 * WHAT THE MAP STILL CANNOT SAY. The printed document has not been examined. The order of
 * the blocks is the order of reading, not the order of printing; the addressee and return
 * address are envelope panels and were read *after* the body. The claim that the printed
 * first panel says "will help you find support" while it was read as "will find and
 * support you" rests on an unexamined print copy, so it stays at 0.4. "Meadow Place" and
 * "Meadows Place" are both in the captions; the municipality is Meadows Place. "lamb bda
 * legal" is almost certainly Lambda Legal and "tent.trans texas.org" almost certainly
 * transtexas.org, and neither is corrected silently.
 *
 * THE CLOCK. Every instant is an offset on the response video's own runtime, using the
 * origin imported from `beck-responder-clocks` rather than a restated midnight. So 53:03
 * here and 53:03 in the transcription record are the same instant, and the two modules
 * can be checked against each other without conversion (the test does exactly that for
 * the two address readings). The clip's own clock is the same fact one hop back:
 * `toSource(beckResponderDrift, ...)` in `src/utils/clock-drift.ts`.
 *
 * Cultural significance is 0.3, not the segment's 0.45: re-slicing a work is not new
 * cultural weight.
 *
 * Sources: caption track of youtube:7g2IoTMGfPs and its chapter list; the re-verification
 * of 2026-10-26 (caption track + independent faster-whisper ASR + VoxCeleb speaker
 * embeddings) as recorded in `beck-pamphlet-transcript.ts`; the CBS News Texas insert
 * replayed at 49:43-51:14; the Podscripts transcript of the 21 October 2026 programme.
 * Retrieved 2026-10-26.
 */

export const BECK_PAMPHLET_READING_UNIVERSE_ID = createSeriesUniverseId(
  'series',
  'beck_pamphlet_reading_map',
  2026,
);

export const BECK_READING_EXCERPT_ID = 'series:beck_pamphlet_transcript:2026';
export const BECK_READING_CLIP_ID =
  'series:glenn_beck_you_wont_believe_what_i_got_in_the_mail:2026';
export const BECK_READING_PARENT_ID =
  'series:tim_whitaker_why_christians_lie_about_transgender_kids:2026';

/**
 * The printed document. Referenced, never declared — no module in this corpus owns it.
 * It is a presumed address: `hydration: 'presumed'` on the anchor, a ledger entry with
 * `contributesCharge: false`, and a test that fails the day someone authors it.
 */
export const BECK_READING_DOCUMENT_ID =
  'document:texas_trans_lgbtq_student_resource_guide:2026';

const ORIGIN = RESPONSE_PUBLICATION_INSTANT;

/** Seconds, fractional allowed, to nanoseconds via milliseconds. */
const sec = (seconds: number): bigint => BigInt(Math.round(seconds * 1000)) * 1_000_000n;

/** One instant on the response video's clock, in seconds into that video. */
const atSeconds = (seconds: number): bigint => ORIGIN + sec(seconds);

/* ------------------------------------------------------------------ *
 * The band
 * ------------------------------------------------------------------ */

/** The clip starts playing inside the response. The two clocks agree here. */
const PLAYBACK_START = 2692.52; // 44:52.52

/** The clip stops, 8:37 into its own 11:03. Nothing after this is a reading. */
const PLAYBACK_END = 59 * 60 + 3; // 59:03

/* ------------------------------------------------------------------ *
 * The reading map
 * ------------------------------------------------------------------ */

/**
 * Who read the block.
 *
 * `alternating` and `unresolved` are first-class values, not placeholders. The caption
 * track marks no speaker changes, and the audio audit scores two dominant voices — it
 * does not label every block. Recording "probably Beck" as `beck` would launder a guess
 * into a label, which is what the draft's producer-name conflict did.
 */
export type ReadingVoice = 'beck' | 'producer' | 'alternating' | 'unresolved';

/**
 * Where the block sits in the printed document, where that can be inferred from what the
 * reader says around it. It is deliberately coarse: the document has not been examined,
 * and a precise page position would be invention.
 */
export type PrintedSlot =
  | 'front_panel'
  | 'body'
  | 'legality_notice'
  | 'envelope_return_address'
  | 'envelope_addressee'
  | 'emancipation_heading'
  | 'emancipation_box'
  | 'care_section'
  | 'closing_panel';

export interface ReadingBlock {
  id: string;
  /** Position in the order the blocks were read aloud, 1-based. */
  readOrder: number;
  /** Where the text is printed, where the reader's own framing identifies it. */
  printedSlot: PrintedSlot;
  /**
   * True when the block is printed on the envelope but was read after body text. The
   * draft's "read out of printed order" note is carried here as data rather than prose.
   */
  outOfPrintedOrder: boolean;
  /** Start on the response video's clock, seconds into youtube:7g2IoTMGfPs. */
  startSeconds: number;
  /** End on the response clock. The block is the reading, not the aside after it. */
  endSeconds: number;
  voice: ReadingVoice;
  /** Confidence in the voice label, 0-1. */
  attribution: number;
  /**
   * Resolution of the *text*, not doubt about what was said. `audio` means the caption
   * track and an independent ASR pass agreed word for word; `caption` means one machine
   * track and nothing else.
   */
  verifiedAgainst: 'audio' | 'caption';
  /** Confidence in the wording, 0-1, at the resolution `verifiedAgainst` earns. */
  certainty: number;
  /** The block as heard, lightly punctuated. "As read aloud", never "as printed". */
  text: string;
  note?: string;
}

/**
 * The thirteen readings. Times are the caption track's cue boundaries, cross-checked
 * against the aligned segment map in `beck-doublespeak.ts` (same track, same band).
 *
 * Two entries differ from the #200 draft on purpose:
 *   - `household_field` starts at 53:03, the transcription record's keyframe instant,
 *     not at the draft's 53:05, so the two modules address the same instant.
 *   - `emancipation_heading` absorbs the second address reading at 54:12, which the
 *     draft split into a producer-name conflict it could not resolve.
 */
export const beckReadingBlocks: readonly ReadingBlock[] = [
  {
    id: 'front_panel',
    readOrder: 1,
    printedSlot: 'front_panel',
    outOfPrintedOrder: false,
    startSeconds: 45 * 60 + 1, // 45:01
    endSeconds: 45 * 60 + 7,
    voice: 'unresolved',
    attribution: 0.4,
    verifiedAgainst: 'caption',
    certainty: 0.5,
    text: 'There are people in Texas who will find and support you.',
    note:
      'The draft attributes this to the producer and the printed text to "will help you ' +
      'find support". Neither the voice nor the print comparison was audited: the ' +
      'document has not been examined, so the paraphrase claim stays below 0.5 and the ' +
      'voice stays unresolved. The cover title — "The Texas Trans and LGBTQ+ Student ' +
      'Resource Guide" — is read in the opening line at 44:52.52 and is keyframed as the ' +
      'zero point rather than as a block: it names the artifact, it is not one of the ' +
      'thirteen fragments.',
  },
  {
    id: 'body_panel',
    readOrder: 2,
    printedSlot: 'body',
    outOfPrintedOrder: false,
    startSeconds: 45 * 60 + 42, // 45:42
    endSeconds: 45 * 60 + 55,
    voice: 'alternating',
    attribution: 0.4,
    verifiedAgainst: 'caption',
    certainty: 0.55,
    text: 'You don\'t have to figure everything out by yourself.',
    note:
      'Speaker turns every one to three seconds. The draft calls this the hardest passage ' +
      'in the excerpt to attribute, and the audit did not score it.',
  },
  {
    id: 'family_line',
    readOrder: 3,
    printedSlot: 'body',
    outOfPrintedOrder: false,
    startSeconds: 45 * 60 + 56, // 45:56
    endSeconds: 46 * 60 + 8,
    voice: 'beck',
    attribution: 0.6,
    verifiedAgainst: 'caption',
    certainty: 0.6,
    text:
      'If your family, your school, your community isn\'t supportive, we are.',
    note:
      'Immediately editorialised — "Trust a group of strangers who don\'t live in Texas ... ' +
      'who want to talk to you about your private parts" — so only the first clause is ' +
      'the document. The split is this module\'s, not the caption track\'s.',
  },
  {
    id: 'legality_notice',
    readOrder: 4,
    printedSlot: 'legality_notice',
    outOfPrintedOrder: false,
    startSeconds: 46 * 60 + 19, // 46:19
    endSeconds: 46 * 60 + 33,
    voice: 'unresolved',
    attribution: 0.3,
    verifiedAgainst: 'caption',
    certainty: 0.6,
    text:
      'This guide is a starting point. Finding supportive people and programs and legal ' +
      'information and community ... Important laws and programs can change quickly. ' +
      'Always confirm current rules and eligibility directly with the organization.',
    note:
      'The document\'s own disclaimer, read unremarked. It answers the segment\'s later ' +
      'complaint that the guide points children at organisations without checking them, ' +
      'and nothing in the segment acknowledges that it does.',
  },
  {
    id: 'return_address',
    readOrder: 5,
    printedSlot: 'envelope_return_address',
    outOfPrintedOrder: true,
    startSeconds: 49 * 60 + 28, // 49:28
    endSeconds: 49 * 60 + 43,
    voice: 'producer',
    attribution: 0.8,
    verifiedAgainst: 'caption',
    certainty: 0.7,
    text:
      'On the return address, it actually lists another completely different group called ' +
      'the Texas Transgender Student Union ... Meadows Place, Texas.',
    note:
      'Printed on the envelope and read after the body. The municipality is Meadows Place; ' +
      'the captions carry both "Meadow Place" and "Meadows Place", and Beck says both. The ' +
      'producer voice is inferred from the reporting turn, not separately scored.',
  },
  {
    id: 'household_field',
    readOrder: 6,
    printedSlot: 'envelope_addressee',
    outOfPrintedOrder: true,
    startSeconds: 53 * 60 + 3, // 53:03 — the transcript record's keyframe, not the draft's 53:05
    endSeconds: 53 * 60 + 22,
    voice: 'beck',
    attribution: 0.8,
    verifiedAgainst: 'audio',
    certainty: 0.8,
    text: 'This is coming to the house of students of the Glenn Beck family.',
    note:
      'C2. The recipient holding the piece reads the addressee field aloud. A role-keyed ' +
      'salutation (students of the <household>) with a named household, printed on the ' +
      'envelope and read after the body — the configuration the mailer series\' structural ' +
      'floor was built to exclude. The audit names this reading as Beck\'s but scores the ' +
      'cost passage, not this line, so the voice carries 0.8 rather than the passage\'s 0.86.',
  },
  {
    id: 'emancipation_heading',
    readOrder: 7,
    printedSlot: 'emancipation_heading',
    outOfPrintedOrder: false,
    startSeconds: 54 * 60 + 4, // 54:04
    endSeconds: 54 * 60 + 16,
    voice: 'beck',
    attribution: 0.8,
    verifiedAgainst: 'caption',
    certainty: 0.75,
    text: 'What if I want to be emancipated?',
    note:
      'Contains the second address reading at 54:12 — "if it\'s addressed directly to ' +
      'them, students of the Glenn Beck household" — which is the one audio-verified clause ' +
      'in this block. The heading itself is caption-only. Beck frames the reading as opening ' +
      'his child\'s mail: "if I broke the law, which I guess I did, I opened it up".',
  },
  {
    id: 'emancipation_box',
    readOrder: 8,
    printedSlot: 'emancipation_box',
    outOfPrintedOrder: false,
    startSeconds: 54 * 60 + 58, // 54:58
    endSeconds: 55 * 60 + 30,
    voice: 'beck',
    attribution: 0.6,
    verifiedAgainst: 'caption',
    certainty: 0.7,
    text:
      'Texas law generally allows a minor to petition for emancipation if they are 17 or ' +
      'at least 16 and living separately from their parents. And they must be legally ' +
      'self-supporting and managing their own financial affairs. A court also has to ' +
      'determine that emancipation is in the minor\'s best interest.',
    note:
      'The qualifications are read aloud in full and not engaged with: the segment treats ' +
      'the box as evidence of recruitment, and the conditions are the answer to that. ' +
      'Voice is caption-attributed; the audit did not score it.',
  },
  {
    id: 'care_section',
    readOrder: 9,
    printedSlot: 'care_section',
    outOfPrintedOrder: false,
    startSeconds: 55 * 60 + 30, // 55:30
    endSeconds: 56 * 60 + 2,
    voice: 'beck',
    attribution: 0.7,
    verifiedAgainst: 'caption',
    certainty: 0.65,
    text:
      'Lots of students are going through the same process you are. Lots of them. In fact, ' +
      'the numbers are growing.',
    note:
      'The read sentence is followed immediately by two incompatible editorial claims — ' +
      '"they\'re actually shrinking" and "they\'re actually falling off a cliff" — which ' +
      'are Beck\'s, not the document\'s. Kept out of the block so the document is not made ' +
      'to contradict itself.',
  },
  {
    id: 'out_of_state_heading',
    readOrder: 10,
    printedSlot: 'care_section',
    outOfPrintedOrder: false,
    startSeconds: 56 * 60 + 2, // 56:02
    endSeconds: 56 * 60 + 9,
    voice: 'beck',
    attribution: 0.7,
    verifiedAgainst: 'caption',
    certainty: 0.7,
    text: 'Can I go out of state for care?',
    note:
      'Read as a section heading, then answered by the reader — "Another flag. That\'s a ' +
      'green flag for me as a parent" — which inverts the section\'s purpose in the same ' +
      'breath. The doublespeak pass records the inversion; this map records only that the ' +
      'heading is the document\'s.',
  },
  {
    id: 'out_of_state',
    readOrder: 11,
    printedSlot: 'care_section',
    outOfPrintedOrder: false,
    startSeconds: 57 * 60 + 11, // 57:11
    endSeconds: 57 * 60 + 52,
    voice: 'beck',
    attribution: 0.6,
    verifiedAgainst: 'caption',
    certainty: 0.5,
    text:
      'Go out of state for medical care? Of course. If you\'re under 18, parental consent, ' +
      'custody, and other laws of both states can matter. If you\'re considering ' +
      'out-of-state care, talk to a legal organization rather than trying to arrange it ' +
      'for yourself.',
    note:
      'Two proper nouns in this block are caption garbles and are not silently corrected: ' +
      '"lamb bda legal" is almost certainly Lambda Legal, and "tent.trans texas.org" is ' +
      'almost certainly transtexas.org. Neither is verifiable from the caption track, which ' +
      'is why the block sits at 0.5.',
  },
  {
    id: 'stranger_danger',
    readOrder: 12,
    printedSlot: 'care_section',
    outOfPrintedOrder: false,
    startSeconds: 58 * 60 + 6, // 58:06
    endSeconds: 58 * 60 + 36,
    voice: 'beck',
    attribution: 0.75,
    verifiedAgainst: 'caption',
    certainty: 0.65,
    text: 'You don\'t have to decide about hormones or surgery right now.',
    note:
      'Answered with the stranger-danger frame — "No, talk to us, strangers, adults" — which ' +
      'is the segment\'s central substitution: the document\'s offer of a deferral is read ' +
      'as an invitation.',
  },
  {
    id: 'found_family',
    readOrder: 13,
    printedSlot: 'closing_panel',
    outOfPrintedOrder: false,
    startSeconds: 58 * 60 + 53, // 58:53
    endSeconds: 59 * 60 + 1,
    voice: 'beck',
    attribution: 0.7,
    verifiedAgainst: 'caption',
    certainty: 0.75,
    text: 'These adults are ready to become your found family.',
    note:
      'The designed climax: "Oh my god. You read the last line in this?" Everything before ' +
      'it is setup for this sentence. Because the segment is built to land here, the block ' +
      'is the worst possible sample of the document and the best sample of the reading.',
  },
];

/* ------------------------------------------------------------------ *
 * Segments — the same partition, tiled gaplessly
 * ------------------------------------------------------------------ */

export interface ReadingSegment {
  id: string;
  start: bigint;
  end: bigint;
  type: 'phase';
  status: 'active' | 'suspended';
  description: string;
}

/**
 * The band partitioned at every block boundary: a reading segment per block, and a
 * `suspended` gap between readings where the studio asides or the responder's overlays
 * run. Tiled from the same block list the keyframes use, so the two cannot drift.
 */
const buildReadingSegments = (): ReadingSegment[] => {
  const segments: ReadingSegment[] = [];
  let cursor = PLAYBACK_START;

  for (const block of beckReadingBlocks) {
    if (block.startSeconds > cursor) {
      segments.push({
        id: `gap_before_${block.id}`,
        start: atSeconds(cursor),
        end: atSeconds(block.startSeconds),
        type: 'phase',
        status: 'suspended',
        description: `Not a reading: overlay or aside before "${block.id}".`,
      });
    }

    segments.push({
      id: block.id,
      start: atSeconds(block.startSeconds),
      end: atSeconds(block.endSeconds),
      type: 'phase',
      status: 'active',
      description: `Reading ${block.readOrder}: ${block.text}`,
    });

    cursor = block.endSeconds;
  }

  if (cursor < PLAYBACK_END) {
    segments.push({
      id: 'gap_after_last_reading',
      start: atSeconds(cursor),
      end: atSeconds(PLAYBACK_END),
      type: 'phase',
      status: 'suspended',
      description:
        'The last two seconds of playback: the responder takes the piece back before the ' +
        'verdict at 59:04, which is not a reading and is recorded in the transcript module.',
    });
  }

  return segments;
};

export const beckReadingSegments: readonly ReadingSegment[] = buildReadingSegments();

/* ------------------------------------------------------------------ *
 * Keyframes
 * ------------------------------------------------------------------ */

interface ReadingKeyframe {
  id: string;
  timestamp: bigint;
  significance: number;
  certainty: number;
  precision: TimePrecision;
  tags: string[];
  type: KeyframeType;
  description: string;
}

const keyframe = (
  id: string,
  responseSeconds: number,
  type: KeyframeType,
  significance: number,
  certainty: number,
  tags: string[],
  description: string,
): ReadingKeyframe => ({
  id,
  timestamp: atSeconds(responseSeconds),
  significance,
  certainty,
  precision: TimePrecision.SECOND,
  tags,
  type,
  description,
});

/** One keyframe at each block's start. The description is the block, so the two agree. */
const blockKeyframes = (): ReadingKeyframe[] =>
  beckReadingBlocks.map((block) =>
    keyframe(
      block.id,
      block.startSeconds,
      KeyframeType.PUBLIC_STATEMENT,
      block.readOrder === 6 || block.readOrder === 13 ? 0.95 : 0.7,
      block.certainty,
      ['read_aloud', 'reading_map', block.printedSlot, block.verifiedAgainst],
      `${block.text} — read ${block.readOrder} of 13${
        block.outOfPrintedOrder ? ', out of printed order' : ''
      }. Voice: ${block.voice} (${block.attribution.toFixed(2)}); wording verified against ${
        block.verifiedAgainst
      } (${block.certainty.toFixed(2)}).`,
    ),
  );

/**
 * The corrections sit between the block keyframes they interrupt, so the array is sorted
 * once by instant rather than hand-ordered. A keyframe list that is not in time order is
 * the first sign that a correction was appended without being placed.
 */
export const beckReadingKeyframes: readonly ReadingKeyframe[] = [
  keyframe(
    'reading_map_opens',
    PLAYBACK_START,
    KeyframeType.ZERO_POINT,
    1.0,
    0.98,
    ['clock', 'zero', 'correction', 'parent_identity'],
    'The clip starts playing at 44:52.52 in the response. C3: the parent is "Why ' +
      'Christians Lie About Transgender Kids" (Tim Whitaker Speaks, 2026-10-23, 1:02:48), ' +
      'not "I Caught Allie Stuckey Lying About What\'s Happening in Texas", which does not ' +
      'exist on the channel; the Stuckey response is a chapter at 28:44. The draft\'s ' +
      'parent id was unaddressable, so every instant written against it was too.',
  ),
  ...blockKeyframes(),
  keyframe(
    'producer_name_resolved',
    46 * 60 + 42, // 46:42, where the draft places "Grace"
    KeyframeType.MILESTONE,
    0.7,
    0.95,
    ['correction', 'caption_artifact', 'cast'],
    'The draft records two producers, Jason and Grace, and leaves the conflict unresolved. ' +
      'There is one: the caption track renders "Jason" as "Grace" here, in the same pass ' +
      'that renders TENT as "Tint". The clip says Jason. A caption that guesses a proper ' +
      'noun invents a cast, and four rounds of analysis then modelled the cast.',
  ),
  keyframe(
    'cost_claim_is_the_hosts',
    46 * 60 + 54, // 46:54, the transcript record's cost-claim instant
    KeyframeType.MILESTONE,
    0.95,
    0.95,
    ['correction', 'attribution', 'production_value'],
    'C1: "we all came in this morning ... it had to cost a lot of money ... a full color ' +
      'heavy paper mailer ... this was not cheap" is Beck\'s, measured at 0.86 Beck / ' +
      '0.33-0.35 producer on two embedding models; the producer\'s own reporting reverses. ' +
      'The draft attributes the passage to the producer, and a map that copied it would ' +
      'have reintroduced the error the audit retired.',
  ),
  keyframe(
    'second_household_read',
    54 * 60 + 12, // 54:12 — the transcript record's second address keyframe
    KeyframeType.PUBLIC_STATEMENT,
    0.9,
    0.8,
    ['read_aloud', 'addressing', 'artifact', 'verified'],
    'C2, second reading: "if it\'s addressed directly to them, students of the Glenn Beck ' +
      'household." The transcript audit quotes the boundary at 05:11 on the clip clock and ' +
      'places its keyframe at 05:16; this module takes the record\'s keyframe instant so ' +
      'both address the same moment, and the five-second boundary difference is not ' +
      'resolved here.',
  ),
].sort((left, right) =>
  left.timestamp < right.timestamp ? -1 : left.timestamp > right.timestamp ? 1 : 0,
);

/* ------------------------------------------------------------------ *
 * Artifacts, corrections and claims
 * ------------------------------------------------------------------ */

/**
 * Captions that guess. Recorded with the value they should have had, because the failure
 * mode is a caption inventing a *cast* or a *source* and the invention then being read as
 * evidence for four rounds.
 */
export const beckReadingCaptionArtifacts = [
  {
    id: 'grace_for_jason',
    kind: 'proper_noun' as const,
    caption: 'Grace, what did you find?',
    verified: 'Jason, what did you find out?',
    atSeconds: 46 * 60 + 42,
    note: 'One named producer, not two. The draft\'s "producer_name_conflict" is this.',
  },
  {
    id: 'tint_for_tent',
    kind: 'proper_noun' as const,
    caption: 'Tint',
    verified: 'TENT — the Transgender Education Network of Texas',
    atSeconds: 47 * 60 + 46,
    note: 'Same pass, same failure mode: a proper noun guessed from audio.',
  },
  {
    id: 'meadow_for_meadows',
    kind: 'toponym' as const,
    caption: 'Meadow Place',
    verified: 'Meadows Place, Texas',
    atSeconds: 49 * 60 + 41,
    note:
      'Beck says "Meadow Place" at 49:41 and "Meadows Place" at 50:35; the municipality is ' +
      'Meadows Place. Capitalisation is not uniform in the captions either.',
  },
  {
    id: 'tent_denial_two_renderings',
    kind: 'same_sentence_twice' as const,
    caption: 'These text messages and mailers were are authorized at all (03:49)',
    verified:
      'These text messages and mailers were not authorized, authored, approved, or ' +
      'distributed by TENT (48:43)',
    atSeconds: 48 * 60 + 43,
    note:
      'The same sentence, two captioned renderings, neither trustworthy. The second is more ' +
      'coherent and matches the responder\'s on-screen screenshot claim; it is recorded as ' +
      'the reading and not as the statement\'s text.',
  },
  {
    id: 'lambda_legal_garble',
    kind: 'proper_noun' as const,
    caption: 'Or land Or is it lamb bda legal?',
    verified: 'Lambda Legal (probable, unverified)',
    atSeconds: 57 * 60 + 27,
    note:
      'Not corrected silently. Eight seconds later the studio pronounces it "Lambda" in ' +
      'banter, which corroborates the reading without verifying the organisation\'s presence ' +
      'in the document.',
  },
  {
    id: 'transtexas_url_garble',
    kind: 'url' as const,
    caption: 'tent.trans texas.org',
    verified: 'transtexas.org (probable, unverified)',
    atSeconds: 57 * 60 + 33,
    note: 'A URL read off paper and mangled by the caption track. Unverified either way.',
  },
];

/**
 * The three corrections from the audio audit, as data rather than prose.
 *
 * Each carries the draft's value and the corrected one, so a reader can see what the
 * map would have said without the audio — which is the whole reason the draft was
 * refused.
 */
export const beckReadingCorrections = [
  {
    id: 'C1',
    subject: 'speaker of the cost claim',
    draft: 'producer',
    corrected: 'beck',
    evidence: '0.86 Beck / 0.33-0.35 producer on ECAPA-VoxCeleb and ResNet-VoxCeleb',
    certainty: 0.95,
  },
  {
    id: 'C2',
    subject: 'the addressee field',
    draft: 'a reporter\'s paraphrase of the salutation, read once, unresolved speaker',
    corrected:
      'read aloud twice by the recipient: "students of the Glenn Beck family" (04:42) and ' +
      '"students of the Glenn Beck household" (05:11)',
    evidence: 'Match of the clip caption track and an independent faster-whisper pass',
    certainty: 0.8,
  },
  {
    id: 'C3',
    subject: 'the parent video',
    draft: '"I Caught Allie Stuckey Lying About What\'s Happening in Texas"',
    corrected:
      '"Why Christians Lie About Transgender Kids" (2026-10-23, 1:02:48); Stuckey is a ' +
      'chapter at 28:44',
    evidence: 'The draft title does not exist on the channel; the landing page and chapter list agree',
    certainty: 0.98,
  },
];

/**
 * The claim inventory: what the segment asserts about the piece, on whose authority, and
 * with what standing. `certainty` is the standing of the *claim as recorded*, not of the
 * claim's truth.
 */
export const beckReadingClaimInventory = [
  {
    id: 'production_value',
    claim:
      '"It had to cost a lot of money ... a full color heavy paper mailer ... this was not ' +
      'cheap."',
    voice: 'beck' as const,
    standing: 'measured' as const,
    certainty: 0.95,
    note:
      '"Had to" is an epistemic modal of inference: he deduces the spend from the piece\'s ' +
      'surface. The correction is the voice, not the modality.',
  },
  {
    id: 'saturation',
    claim: '"It\'s like candy in Texas." / "It\'s coming every mailbox."',
    voice: 'beck' as const,
    standing: 'measured' as const,
    certainty: 0.9,
    note:
      'The saturation claim, supplied in the same breath as the addressing observations. ' +
      'The referent of "candy" is not recoverable from the audio.',
  },
  {
    id: 'addressing',
    claim:
      'The envelope is addressed to "students of the Glenn Beck family" / "students of the ' +
      'Glenn Beck household".',
    voice: 'beck' as const,
    standing: 'verified' as const,
    certainty: 0.8,
    note:
      'Read aloud twice by the recipient. A role-keyed salutation with a named household — ' +
      'the configuration the mailer series built its structural floor to exclude.',
  },
  {
    id: 'provenance',
    claim:
      'The sender is unidentified; TENT denies authorship; the return address does not ' +
      'resolve to a valid address; an organisation of that name is registered in Sheridan, ' +
      'Wyoming.',
    voice: 'producer' as const,
    standing: 'caption_and_cbs' as const,
    certainty: 0.85,
    note:
      'The strongest external fact — the Sheridan registration — is CBS News Texas\'s ' +
      'reporting, replayed inside the clip. The Wyoming address is a registered-agent ' +
      'service used by hundreds of thousands of businesses, which the segment labels as a ' +
      'concealment rather than a service.',
  },
  {
    id: 'intent',
    claim:
      '"I don\'t know if it\'s Republicans, I don\'t know if it\'s Democrats doing a double ' +
      'switch switcheroo."',
    voice: 'producer' as const,
    standing: 'measured' as const,
    certainty: 0.8,
    note:
      'The re-verification scores this passage 0.83 producer / 0.13 Beck on both models, ' +
      'and the responder quotes it back as Beck\'s at 52:16. The draft\'s "Beck: either ' +
      'party" row is the same error class running in reverse: a line attributed on the ' +
      'strength of the register one expected.',
  },
  {
    id: 'document_completeness',
    claim: 'The pamphlet is characterised from thirteen fragments read on air.',
    voice: 'unresolved' as const,
    standing: 'unresolved' as const,
    certainty: 0.4,
    note:
      'The document has not been examined. Every block is "as read aloud", the order is the ' +
      'order of reading, and the one print-vs-caption comparison in the draft depends on a ' +
      'copy nobody has looked at.',
  },
  {
    id: 'air_date',
    claim: 'The programme episode aired on 21 October 2026.',
    voice: 'producer' as const,
    standing: 'verified' as const,
    certainty: 0.9,
    note:
      'Corrected from the draft\'s "unverified, 19-24 Oct": the published transcript index ' +
      'dates the episode, and the clip was uploaded that evening. The broadcast airtime is ' +
      'still not known.',
  },
];

/* ------------------------------------------------------------------ *
 * The universe
 * ------------------------------------------------------------------ */

export const beckPamphletReadingUniverse = {
  universeId: BECK_PAMPHLET_READING_UNIVERSE_ID,
  type: UniverseType.SERIES,

  identifiers: {
    primary: `${BECK_READING_PARENT_ID}#t=44m52.52s-59m03s`,
    aliases: [
      'Glenn Beck reads the Texas Trans and LGBTQ+ Student Resource Guide',
      'Beck pamphlet reading map',
      'the pamphlet as read aloud',
      'toxic empathy segment reading map',
    ],
  },

  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,

    realityAnchors: [
      {
        realEventId: BECK_READING_CLIP_ID,
        relationshipType: 'documents',
        confidence: 0.95,
        evidence: [
          'The clip exists on the Glenn Beck channel: youtube:uzgYKMZDeJ4, 2026-10-21T23:00:21Z, 11:03',
          'Every block is measured on the clip\'s own audio, replayed inside the response',
          'The two address readings and ten lines of the cost passage were re-verified against the audio on 2026-10-26',
        ],
      },
      {
        realEventId: BECK_READING_PARENT_ID,
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'The reading happens inside the response video\'s chapter "Responding To Glenn Beck" (44:21-59:09)',
          'Every instant here is an offset on that video\'s runtime, using the imported publication origin',
        ],
      },
      {
        realEventId: BECK_READING_DOCUMENT_ID,
        relationshipType: 'documents',
        confidence: 0.45,
        hydration: 'presumed' as const,
        evidence: [
          'The printed guide is the object read aloud; no copy has been examined',
          'Blocks are identified by the reader\'s own framing of where they sit in the document',
          'Printed wording is not verifiable from the audio except where the document\'s own disclaimer is read',
        ],
      },
    ],
  },

  attribution: {
    copyright: {
      holders: ['The Glenn Beck Program / Blaze Media', 'CBS News Texas', 'Tim Whitaker Speaks'],
      year: 2026,
      status: 'active',
    },
    citations_required: true,
    sources: [
      'Caption track of youtube:7g2IoTMGfPs (en-orig/json3) and its chapter list, 2026-10-26',
      'Re-verification of 2026-10-26: independent faster-whisper base.en pass and VoxCeleb speaker embeddings, as recorded in `beck-pamphlet-transcript.ts`',
      'CBS News Texas segment as replayed at 49:43-51:14',
      'Podscripts transcript of The Glenn Beck Program, 21 October 2026',
    ],
    usage_restrictions: [
      'Twelve of the thirteen blocks are caption-only, and one of those contains a verified clause. Do not publish them as verbatim quotations of either the document or the speaker.',
      'The document itself has not been examined. Any reconstruction of its printed sequence from this map is wrong: the envelope was read after the body.',
      'Three stacked rights holders, plus an unidentified sender. Re-use needs all of them cleared.',
      'Do not re-publish Beck programme audio from this definition.',
      'Speaker labels are measured for two dominant studio voices only. A third voice would collapse into the nearer cluster, and five passages in the draft remain genuinely ambiguous.',
      'The cost passage\'s speaker is measured; the thirteen reading blocks\' voices are not, except where noted.',
    ],
  },

  layers: [
    {
      layerId: 'runtime',
      type: 'primary',
      epochs: {
        reading_band: {
          epochId: `${BECK_PAMPHLET_READING_UNIVERSE_ID}:runtime`,
          startTime: atSeconds(PLAYBACK_START),
          endTime: atSeconds(PLAYBACK_END),
          precision: TimePrecision.SECOND,
          description:
            'The response video\'s own runtime, from the clip starting to the clip stopping. ' +
            'Deliberately the same origin as the transcription record, so 53:03 here and ' +
            '53:03 there are the same instant.',
        },
      },
    },
    {
      layerId: 'clip_playback',
      type: 'recreation',
      reality_correspondence: {
        to: BECK_READING_CLIP_ID,
        accuracy: 0.9,
        deviations: [
          'Discontinuous: the responder plays 00:00-08:37 of an 11:03 clip and stops it ten times.',
          'The responder talks over the studio audio; two voices are separable, laughter and crosstalk are not.',
          'The clip\'s own clock is one hop back through `beckResponderDrift`; this layer keeps the response clock so the map stays addressable against the transcript record.',
        ],
      },
      epochs: {
        playback: {
          epochId: `${BECK_PAMPHLET_READING_UNIVERSE_ID}:playback`,
          startTime: atSeconds(PLAYBACK_START),
          endTime: atSeconds(PLAYBACK_END),
          precision: TimePrecision.SECOND,
          description:
            'The clip runs inside the response. Its offset grows across the band (0 s at the ' +
            'start, 333.39 s at the last frame); `beckResponderDrift` is the map.',
        },
      },
    },
    {
      layerId: 'pamphlet_text',
      type: 'subjective',
      reality_correspondence: {
        to: BECK_READING_DOCUMENT_ID,
        accuracy: 0.45,
        deviations: [
          'The document is never shown clearly; it exists here only as spoken fragments.',
          'Read out of printed order: the body and legality notice, then the envelope\'s return address and addressee, then the emancipation box, then care, then the closing panel.',
          'Thirteen fragments of an unknown-length document. The map cannot say what proportion of the guide was read.',
          'At 45:01-45:07 the printed "will help you find support" is heard as "will find and support you" — a paraphrase presented as quotation, and neither side of the comparison has been checked against a copy.',
          'Interactive affordances are read aloud as if operable on paper: "I keep clicking on it and it won\'t go" (55:19).',
        ],
      },
      epochs: {
        reading_span: {
          epochId: `${BECK_PAMPHLET_READING_UNIVERSE_ID}:reading`,
          startTime: atSeconds(PLAYBACK_START),
          endTime: atSeconds(59 * 60 + 1),
          precision: TimePrecision.SECOND,
          description:
            'The thirteen readings, from the first panel to the closing line. Ends before ' +
            'the responder\'s verdict at 59:04, which is not a reading.',
        },
      },
    },
  ],

  temporalStructure: {
    segments: beckReadingSegments,
    keyframes: beckReadingKeyframes,
    windows: { strategy: 'scene_based' },
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.US_HISTORY],
    },
    references: [
      {
        type: 'DERIVES_FROM',
        targetUniverseId: BECK_READING_EXCERPT_ID,
        confidence: 1.0,
        description:
          'The transcription record for the same chapter. This map is a reading-order view of ' +
          'the same band, not a re-read; the two address instants coincide by construction.',
        evidence: [
          'Same origin (`RESPONSE_PUBLICATION_INSTANT`) and same band (44:52.52-59:03)',
          'The two address readings are keyframed at the transcript record\'s own instants',
        ],
      },
      {
        type: 'QUOTES',
        targetUniverseId: BECK_READING_CLIP_ID,
        confidence: 0.95,
        description:
          'The map quotes the clip line by line, as played inside the response. Every block ' +
          'has a position on the clip clock through the drift model.',
        evidence: [
          'The clip is on Beck\'s own channel, 2026-10-21T23:00:21Z, 11:03',
          'The two address readings were re-verified against the audio',
        ],
      },
      {
        type: 'DERIVES_FROM',
        targetUniverseId: BECK_READING_PARENT_ID,
        confidence: 1.0,
        description:
          'The response video whose runtime every offset inherits, via the excerpt.',
      },
    ],
  },

  metadata: {
    canonicalName:
      'Glenn Beck reads the Texas Trans & LGBTQ+ Student Resource Guide (reading map, re-verified)',
    description:
      'The pamphlet as it was read aloud on air: thirteen readings in reading order, each ' +
      'with the printed slot it came from and the voice that read it. The document is never ' +
      'shown, the printed sequence is not the reading sequence, and most blocks are ' +
      'caption-only — but the two address readings and the speaker of the cost passage were ' +
      're-verified against the audio, which is what the draft this replaces never was.',
    creators: ['Compiled transcription map'],
    released: new Date(Number(RESPONSE_PUBLICATION_INSTANT / 1_000_000n)),
    cultural_significance: 0.3,
    platform: 'YouTube',
    externalId: '7g2IoTMGfPs#44:52.52-59:03',
    contentType: 'reading map / document reconstruction',
    durationSeconds: PLAYBACK_END - PLAYBACK_START,

    readingMap: {
      blocks: beckReadingBlocks.length,
      verifiedAgainstAudio: beckReadingBlocks.filter(
        (block) => block.verifiedAgainst === 'audio',
      ).length,
      captionOnly: beckReadingBlocks.filter(
        (block) => block.verifiedAgainst === 'caption',
      ).length,
      readingSeconds: beckReadingBlocks.reduce(
        (total, block) => total + (block.endSeconds - block.startSeconds),
        0,
      ),
      printedOrderDeviations: beckReadingBlocks
        .filter((block) => block.outOfPrintedOrder)
        .map((block) => ({
          block: block.id,
          printedSlot: block.printedSlot,
          readOrder: block.readOrder,
          note:
            'Printed on the envelope and read after body text. The envelope panels are ' +
            'addressed to a named household and a student union, which is the artifact fact ' +
            'the mailer series turns on.',
        })),
      orderNote:
        'The thirteen blocks are the readings, not the document. Reading order is recorded; ' +
        'printed order is inferred from the reader\'s framing and is not recoverable from the ' +
        'segment alone.',
    },

    corrections: beckReadingCorrections,
    claimInventory: beckReadingClaimInventory,
    captionArtifacts: beckReadingCaptionArtifacts,

    verification: {
      performed: '2026-10-26',
      instruments: [
        'Machine caption track of youtube:7g2IoTMGfPs (en-orig/json3)',
        'Independent ASR: faster-whisper 1.2.1, base.en, word timings',
        'Speaker embeddings: speechbrain ECAPA-VoxCeleb and ResNet-VoxCeleb',
        'Chapter metadata and upload instants from both videos',
        'Podscripts transcript of the 21 October 2026 programme',
      ],
      result:
        'word-for-word agreement between the caption track and the ASR pass on the cost ' +
        'passage (clip 01:07-01:36); the two address readings were located in the same ' +
        're-verified pass',
      limits: [
        'Twelve of thirteen blocks are single-track caption transcriptions; their wording is indicative, not verbatim.',
        'The printed document has not been examined. The print-vs-caption comparison at the front panel depends on a copy nobody has read.',
        'Register is not measured; only the position of the clip\'s laughter marks.',
        'Two-voice speaker model. Five passages in the source draft remain genuinely ambiguous and are recorded as such.',
        'The five-second boundary difference on the second address reading is inherited from the transcript record and not resolved here.',
      ],
    },

    presumed: [
      {
        universeId: BECK_READING_DOCUMENT_ID,
        hydration: 'presumed' as const,
        referredBy: BECK_PAMPHLET_READING_UNIVERSE_ID,
        contributesCharge: false,
        revisitIf:
          'Author the guide\'s universe (or obtain a copy and record it elsewhere) and flip ' +
          'this anchor to hydration: "declared" — the suite fails while a presumed id is ' +
          'still marked presumed.',
      },
    ],

    uncertaintyNotes: [
      'The document has not been examined. The map records where the reader said each block sits, not where it sits.',
      'The addressee and return address are envelope panels read after the body. Any reconstruction of the printed sequence from this map will be wrong.',
      '"Will find and support you" versus "will help you find support" is a caption-vs-print comparison in which neither side was checked against a copy. It stays at 0.5.',
      'The municipality is Meadows Place; the captions and the host say both forms. Recorded, not normalised.',
      '"lamb bda legal" and "tent.trans texas.org" are caption garbles. Lambda Legal and transtexas.org are probable readings, not verified strings.',
      'Five speaker boundaries stay unresolved: 45:08, 49:20-49:28, 51:55, 54:03 and 57:42 in the draft\'s numbering.',
      'The cost passage is measured as Beck\'s; that measurement is for 01:08-01:27 of the clip, not for the thirteen readings.',
      'The responder\'s verdict at 59:04 ("these people are vile") is not a reading and is recorded in the transcript module.',
    ],

    sourcing: {
      verified: [
        'Both upload instants, runtimes and chapter lists from YouTube metadata',
        'Caption track and ASR agreement on the cost passage; the two address readings located in the same pass',
        'Speaker attribution of the cost passage by two embedding models',
        'Programme episode date from the Podscripts transcript index',
        'Ten pauses recovered from word-level alignment of the two caption tracks',
      ],
      notRecorded: [
        'A copy of the printed guide',
        'The broadcast airtime of the 21 October programme',
        'Whether the YouTube cut is the broadcast cut or an edit',
        'The identity of the sender, and whether TENT\'s denial is accurate',
      ],
    },
  },
} as unknown as Universe;

/** All universes derived from the #200 reading map. */
export const beckPamphletReadingUniverses: Universe[] = [beckPamphletReadingUniverse];
