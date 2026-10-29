import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../core/types';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';
import { ClockDrift, totalDrift } from '../../../utils/clock-drift';

/**
 * Two clocks over one segment, and the drift between them.
 *
 * `series:glenn_beck_you_wont_believe_what_i_got_in_the_mail:2026` is an 11:03 clip from
 * The Glenn Beck Program, published 2026-10-21T23:00:21Z. It is played, with commentary
 * over the top, inside `series:tim_whitaker_why_christians_lie_about_transgender_kids:2026`
 * — a 1:02:48 response published 2026-10-23T20:15:30Z, in which the segment occupies
 * 44:52.5-59:03.
 *
 * WHAT THE DRIFT IS. The responder does not talk over a running clip; he stops it, talks,
 * and restarts it. Ten times. Each stop costs the response timeline time that the clip
 * timeline never spends, so by the end of the segment "1:19 into the clip" is "46:54 into
 * the response": 333.39 s of accumulated drift, plus the 2692.52 s the segment starts
 * into the video.
 *
 * WHY IT IS MODELLED RATHER THAN NOTED. The two clocks are both queried by timestamp, and
 * a note saying "add about six minutes" is wrong by up to a minute at any given point. So
 * the drift is data (`beckResponderDrift`) with arithmetic (`src/utils/clock-drift.ts`),
 * and the two universes are connected **four ways** that a test holds together:
 *
 *   1. `connections.references` — EXCERPTS / PLAYED_BACK_WITH_PAUSES on the responder,
 *      PLAYED_IN on the clip.
 *   2. Keyframe-to-keyframe links — every responder keyframe names the clip keyframe it
 *      corresponds to (`targetUniverseId` + `targetKeyframeId` + `targetKeyframeType`),
 *      which is the deferred, name-level reference the type was built for (#3).
 *   3. Zero-reference epochs — both universes are addressable as T+ from their own first
 *      frame, so the same instant has an address on each clock.
 *   4. The drift model itself — `toDerived` / `toSource` between the two runtime clocks.
 *
 * Those four are not decoration; `tests/youtube/beck-responder-clocks.test.ts` asserts
 * they agree. A timestamp that resolves through the reference, the address and the drift
 * arithmetic to the same instant is a timestamp that survived four independent chances to
 * be wrong.
 *
 * HOW THE PAUSES WERE MEASURED. Word-level alignment of the clip's own caption track
 * against the caption track of the response video: 1794 words, 62 aligned blocks, each
 * block giving an offset to well under a second. A pause is a step in that offset. The
 * step positions land within 0.5 s of the start of each of the responder's overlays, and
 * the ten durations sum to the measured end-to-end drift. Method and residuals are
 * recorded in `metadata.clockDrift`.
 *
 * Reality Relation: `documentary` at 0.0 for both. Both are published recordings; the
 * transcript is a separate question, answered in the lore record rather than here.
 *
 * Cultural Significance: 0.35 — a recording of a broadcast reaction, notable as a
 * worked example of one recording containing another, not as a work in its own right.
 *
 * Sourcing: caption tracks and metadata of both videos, retrieved 2026-10-26.
 */

const CLIP_ID = 'series:glenn_beck_you_wont_believe_what_i_got_in_the_mail:2026';
const RESPONDER_ID = 'series:tim_whitaker_why_christians_lie_about_transgender_kids:2026';

const ns = (iso: string): bigint => dateToNanoseconds(new Date(iso));

/** Seconds (fractional allowed) to nanoseconds, via milliseconds so no float reaches bigint. */
const sec = (seconds: number): bigint => BigInt(Math.round(seconds * 1000)) * 1_000_000n;

/* ------------------------------------------------------------------ *
 * Publication instants and runtimes — the two clocks' origins
 * ------------------------------------------------------------------ */

const CLIP_PUBLISHED = ns('2026-10-21T23:00:21Z');
const CLIP_RUNTIME = sec(663); // 11:03

const RESPONDER_PUBLISHED = ns('2026-10-23T20:15:30Z');
const RESPONDER_RUNTIME = sec(3768); // 1:02:48

/** Where the segment sits inside the response video: 44:52.52. */
const SEGMENT_EMBED_AT = 2692.52;

/** One instant on the clip's own clock, given as seconds into the clip. */
const atClip = (seconds: number): bigint => CLIP_PUBLISHED + sec(seconds);

/** One instant on the response video's clock, given as seconds into the video. */
const atResponse = (seconds: number): bigint => RESPONDER_PUBLISHED + sec(seconds);

/* ------------------------------------------------------------------ *
 * The aligned events
 * ------------------------------------------------------------------ */

/**
 * One instant that exists on both clocks.
 *
 * `clipSeconds` and `responseSeconds` are measured independently, from each video's own
 * caption track. They are recorded rather than derived *on purpose*: the drift model must
 * be able to disagree with them, or the test holding the two together proves nothing.
 */
export interface AlignedEvent {
  /** Shared keyframe id: the same id in both universes. */
  id: string;
  /** Seconds into the clip, on the clip's clock. */
  clipSeconds: number;
  /** Seconds into the response video, on the response clock. */
  responseSeconds: number;
  type: KeyframeType;
  significance: number;
  tags: string[];
  description: string;
}

export const beckResponderAlignedEvents: readonly AlignedEvent[] = [
  {
    id: 'playback_start',
    clipSeconds: 0,
    responseSeconds: SEGMENT_EMBED_AT,
    type: KeyframeType.ZERO_POINT,
    significance: 1.0,
    tags: ['clock', 'zero', 'clip-start'],
    description:
      'The clip starts playing inside the response: "Jason, did you get one of these?" ' +
      'This is the only instant the two clocks share without arithmetic — it is the ' +
      'drift model\'s base offset.',
  },
  {
    id: 'producer_question',
    clipSeconds: 67,
    responseSeconds: 2803.0,
    type: KeyframeType.PUBLIC_STATEMENT,
    significance: 0.8,
    tags: ['attribution', 'hand-off'],
    description:
      'Beck asks the producer what he found out about the mailer, then answers the ' +
      'question himself from his own copy before handing off.',
  },
  {
    id: 'cost_claim',
    clipSeconds: 79,
    responseSeconds: 2814.0,
    type: KeyframeType.PUBLIC_STATEMENT,
    significance: 1.0,
    tags: ['attribution', 'production-value'],
    description:
      '"It had to cost a lot of money ... it\'s a full color heavy paper mailer ... this ' +
      'was not cheap." The line the transcript audit turned on; on this clock it is 1:19 ' +
      'into the clip and 46:54 into the response.',
  },
  {
    id: 'handoff_to_producer',
    clipSeconds: 88,
    responseSeconds: 2857.5,
    type: KeyframeType.MILESTONE,
    significance: 0.9,
    tags: ['hand-off', 'overlay'],
    description:
      'Beck hands the reporting to Jason ("what did you find out about who sent this out") ' +
      '— but the line is only heard after the third pause: the responder cuts in at 47:03, ' +
      'eight seconds before this point on the clip clock, and the hand-off resumes at 47:37 ' +
      'in the response.',
  },
  {
    id: 'cbs_insert',
    clipSeconds: 161,
    responseSeconds: 2983.0,
    type: KeyframeType.PUBLICATION,
    significance: 0.9,
    tags: ['reporting', 'cbs'],
    description:
      'The CBS News Texas investigation is replayed inside the clip: the Meadow Place ' +
      'return address does not resolve, a nearby identical address reaches a UPS Store.',
  },
  {
    id: 'sheridan_registration',
    clipSeconds: 212,
    responseSeconds: 3067.0,
    type: KeyframeType.REGULATION,
    significance: 0.9,
    tags: ['reporting', 'registry'],
    description:
      'Business records place the company registered under that name in Sheridan, ' +
      'Wyoming — a registered-agent address used by hundreds of thousands of businesses.',
  },
  {
    id: 'addressing_read',
    clipSeconds: 282,
    responseSeconds: 3183.0,
    type: KeyframeType.PUBLIC_STATEMENT,
    significance: 1.0,
    tags: ['addressing', 'artifact'],
    description:
      'Beck reads the addressee field aloud: what arrived was addressed to the students ' +
      'of his own household. The artifact speaking for itself, on both clocks.',
  },
  {
    id: 'household_read',
    clipSeconds: 316,
    responseSeconds: 3252.0,
    type: KeyframeType.PUBLIC_STATEMENT,
    significance: 0.9,
    tags: ['addressing', 'artifact'],
    description:
      'The second reading of the same field — "students of the Glenn Beck household" — ' +
      'immediately before he says he opened it anyway.',
  },
  {
    id: 'playback_end',
    clipSeconds: 517,
    responseSeconds: 3543.0,
    type: KeyframeType.MILESTONE,
    significance: 1.0,
    tags: ['clock', 'clip-end'],
    description:
      'The clip stops: the response leaves it at "Wow" and the responder resumes in his ' +
      'own voice. 8:37 of clip, 59:03 of response, and 333.39 s of drift in between.',
  },
];

/* ------------------------------------------------------------------ *
 * The drift
 * ------------------------------------------------------------------ */

/**
 * The ten stops, as measured. `at` is a position on the *clip* clock; `duration` is time
 * the *response* clock spent with the clip stopped. Both are seconds in the source file,
 * converted once here so the table can be read against a player.
 */
const PAUSES: ReadonlyArray<{ id: string; at: number; duration: number; cause: string }> = [
  { id: 'overlay_4508', at: 15.8, duration: 34.1, cause: 'Overlay 45:08-45:41 — "toxic empathy" commentary' },
  { id: 'overlay_4610', at: 44.42, duration: 8.48, cause: 'Overlay 46:10-46:18 — "mischaracterisation" aside' },
  { id: 'overlay_4703', at: 86.48, duration: 34.4, cause: 'Overlay 47:03-47:36 — "he is putting pieces together"' },
  { id: 'overlay_4828', at: 137.66, duration: 52.33, cause: 'Overlay 48:28-49:20 — TENT statement read back' },
  { id: 'overlay_4952', at: 170.01, duration: 33.82, cause: 'Overlay 49:52-50:24 — "come on, Glenn"' },
  { id: 'overlay_5134', at: 236.52, duration: 20.33, cause: 'Overlay 51:34-51:54 — Biden-family bank comparison' },
  { id: 'overlay_5216', at: 259.26, duration: 24.31, cause: 'Overlay 52:16-52:39 — "both sides" plausible deniability' },
  { id: 'overlay_5322', at: 301.98, duration: 36.6, cause: 'Overlay 53:22-53:59 — "their plan worked"' },
  { id: 'overlay_5430', at: 333.45, duration: 27.3, cause: 'Overlay 54:30-54:58 — "no LGBTQ+ group would do this"' },
  { id: 'overlay_5609', at: 405.06, duration: 61.72, cause: 'Overlay 56:09-57:10 — the invented clinic scenario' },
];

export const beckResponderDrift: ClockDrift = {
  sourceId: CLIP_ID,
  derivedId: RESPONDER_ID,
  baseOffset: sec(SEGMENT_EMBED_AT),
  pauses: PAUSES.map((pause) => ({
    id: pause.id,
    at: sec(pause.at),
    duration: sec(pause.duration),
    cause: pause.cause,
    tolerance: sec(1),
  })),
  precision: TimePrecision.SECOND,
  provenance:
    'Word-level alignment of the clip caption track against the response video caption ' +
    'track, 2026-10-26: 1,794 clip words, 62 aligned blocks. Step positions agree with the ' +
    'start of each responder overlay to within 0.5 s; durations sum to the measured ' +
    'end-to-end drift (333.39 s) and reproduce every aligned keyframe within 1.0 s.',
};

/* ------------------------------------------------------------------ *
 * The two servers of the same instants
 * ------------------------------------------------------------------ */

const keyframe = (event: AlignedEvent, clock: 'clip' | 'response') => ({
  id: event.id,
  timestamp:
    clock === 'clip'
      ? atClip(event.clipSeconds)
      : atResponse(event.responseSeconds),
  significance: event.significance,
  tags: [...event.tags, clock === 'clip' ? 'clip-clock' : 'response-clock'],
  type: event.type,
  precision: TimePrecision.SECOND,
  description: event.description,
  // Only the response clock points at the clip. The clip cannot know it will be played
  // inside this particular video; the response is the universe that chose to play it, so
  // the per-occurrence reference is declared there and the converse is a universe-level
  // `PLAYED_IN` edge.
  ...(clock === 'response'
    ? {
        targetUniverseId: CLIP_ID,
        targetKeyframeId: event.id,
        targetKeyframeType: event.type,
      }
    : {}),
});

const zeroReference = (
  universeId: string,
  zeroPoint: bigint,
  runtime: bigint,
  zeroEvent: string,
) => ({
  layerId: 'zero_reference',
  type: 'meta' as const,
  epochs: {
    runtime_zero: {
      epochId: `${universeId}:runtime_zero`,
      startTime: zeroPoint,
      endTime: zeroPoint + runtime,
      precision: TimePrecision.SECOND,
      zeroPoint,
      zeroEvent,
      beforePrefix: 'T-',
      afterPrefix: 'T+',
      relativeFormat: 'HMS' as const,
    },
  },
});

/* ------------------------------------------------------------------ *
 * The clip
 * ------------------------------------------------------------------ */

export const beckMailClipUniverse = {
  universeId: CLIP_ID,
  type: UniverseType.SERIES,

  identifiers: {
    primary: CLIP_ID,
    // The channel retitled the video after publication: YouTube's own metadata reports
    // "You Won't BELIEVE What I Got In The Mail..." while the channel listing (and the
    // first search index) carried "What Was Just Mailed To Texas Teenagers Should Terrify
    // Every Parent". Both are the same 11:03 upload.
    aliases: [
      'You Won\'t BELIEVE What I Got In The Mail...',
      'What Was Just Mailed To Texas Teenagers Should Terrify Every Parent',
      'Glenn Beck reads the Texas Trans and LGBTQ+ Student Resource Guide',
      'youtube:uzgYKMZDeJ4',
    ],
  },

  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [],
  },

  attribution: {
    copyright: {
      holders: ['Glenn Beck', 'Blaze Media'],
      year: 2026,
      status: 'active',
    },
    citations_required: true,
    sources: [
      'YouTube video uzgYKMZDeJ4 — "You Won\'t BELIEVE What I Got In The Mail...", Glenn Beck, published 2026-10-21T23:00:21Z, 11:03',
      'Caption track (en-orig) and video description, retrieved 2026-10-26',
      'The Glenn Beck Program, episode dated 2026-10-21 (podscripts transcript), where the same passage runs from 01:31:06',
    ],
    usage_restrictions: [
      'A clip from a copyrighted programme; re-use needs the programme cleared, not just the upload.',
      'The transcript was produced by machine captioning and re-checked by ASR. It is not a human-verified transcript.',
    ],
  },

  layers: [
    {
      layerId: 'runtime',
      type: 'primary',
      epochs: {
        main: {
          epochId: `${CLIP_ID}:runtime`,
          startTime: CLIP_PUBLISHED,
          endTime: CLIP_PUBLISHED + CLIP_RUNTIME,
          precision: TimePrecision.SECOND,
          description:
            'The clip\'s published runtime, 11:03, zeroed at the publication instant so ' +
            'every keyframe is addressable in the same absolute form as the rest of the corpus.',
        },
      },
    },
    zeroReference(CLIP_ID, CLIP_PUBLISHED, CLIP_RUNTIME, 'first frame of the clip'),
  ],

  temporalStructure: {
    segments: [
      {
        id: 'mailer_segment',
        start: CLIP_PUBLISHED,
        end: CLIP_PUBLISHED + CLIP_RUNTIME,
        type: 'phase',
        status: 'active',
        description:
          'The whole upload: an opening exchange over the pamphlet, a producer report on ' +
          'the return address and registration, and a reading of the pamphlet\'s advice ' +
          'sections. No ad break falls inside it.',
      },
    ],
    keyframes: beckResponderAlignedEvents.map((event) => keyframe(event, 'clip')),
    windows: { strategy: 'phase_based' },
  },

  connections: {
    references: [
      {
        type: 'PLAYED_IN',
        targetUniverseId: RESPONDER_ID,
        confidence: 1.0,
        description:
          'The clip is played inside the response video from 44:52.52, paused ten times ' +
          '(333.39 s of drift) and left at 59:03.',
        evidence: [
          'Both videos\' caption tracks align word for word on the segment',
          'The response video names its source on air ("Glenn posted this clip I\'m showing")',
        ],
      },
    ],
  },

  metadata: {
    canonicalName: 'You Won\'t BELIEVE What I Got In The Mail (Glenn Beck clip)',
    description:
      'An 11:03 clip from The Glenn Beck Program in which Beck and a producer read a ' +
      'mailed pamphlet about Texas transgender students, then quote the return address ' +
      'and registration the CBS News Texas investigation reported.',
    creators: ['Glenn Beck'],
    released: new Date(Number(CLIP_PUBLISHED / 1_000_000n)),
    cultural_significance: 0.35,
    /** The clock record. Seconds are the readable form; the model holds nanoseconds. */
    clockDrift: {
      role: 'source',
      runtimeSeconds: Number(CLIP_RUNTIME / 1_000_000_000n),
      derivedUniverseId: RESPONDER_ID,
      derivation: 'beckResponderDrift (src/utils/clock-drift.ts)',
    },
    startingPoints: {
      /** The same event has an address on each clock. */
      addresses: {
        cost_claim: {
          clip: `${CLIP_ID}:runtime_zero:T+00:01:19`,
          response: `${RESPONDER_ID}:runtime_zero:T+00:46:54`,
        },
      },
    },
    sourcing: {
      verified: [
        'Title, channel, publication instant (2026-10-21T23:00:21Z) and runtime (663 s) from YouTube metadata',
        'Caption track and chapters retrieved 2026-10-26',
        'Passage also present in the programme transcript at 01:31:06 (podscripts)',
      ],
      notRecorded: [
        'The broadcast hour: the episode date is known, the airtime is not',
        'Whether the YouTube cut is the broadcast cut or an edit',
      ],
    },
  },
} as unknown as Universe;

/* ------------------------------------------------------------------ *
 * The response
 * ------------------------------------------------------------------ */

export const timWhitakerResponseUniverse = {
  universeId: RESPONDER_ID,
  type: UniverseType.SERIES,

  identifiers: {
    primary: RESPONDER_ID,
    aliases: [
      'Why Christians Lie About Transgender Kids',
      'Tim Whitaker responds to Glenn Beck',
      'youtube:7g2IoTMGfPs',
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
          'Segment occupies 44:52.5-59:03 of the response, inside the chapter "Responding To Glenn Beck" (44:21)',
          'The response names its source on air and the clip exists on the source channel',
        ],
      },
    ],
  },

  attribution: {
    copyright: {
      holders: ['Tim Whitaker Speaks'],
      year: 2026,
      status: 'active',
    },
    citations_required: true,
    sources: [
      'YouTube video 7g2IoTMGfPs — "Why Christians Lie About Transgender Kids", Tim Whitaker Speaks, published 2026-10-23T20:15:30Z, 1:02:48',
      'Caption track and chapter metadata, retrieved 2026-10-26',
    ],
    usage_restrictions: [
      'Contains a replayed third-party programme; re-use needs both rights holders cleared.',
      'Overlays are commentary, not transcript.',
    ],
  },

  layers: [
    {
      layerId: 'runtime',
      type: 'primary',
      epochs: {
        main: {
          epochId: `${RESPONDER_ID}:runtime`,
          startTime: RESPONDER_PUBLISHED,
          endTime: RESPONDER_PUBLISHED + RESPONDER_RUNTIME,
          precision: TimePrecision.SECOND,
          description:
            'The response video\'s runtime, 1:02:48, zeroed at its publication instant. ' +
            'It runs two days after the clip it responds to; that gap is publication drift, ' +
            'not playback drift, and the two are never added together implicitly.',
        },
      },
    },
    zeroReference(RESPONDER_ID, RESPONDER_PUBLISHED, RESPONDER_RUNTIME, 'first frame of the response'),
  ],

  temporalStructure: {
    segments: [
      {
        id: 'responds_to_allie_stuckey',
        start: RESPONDER_PUBLISHED,
        end: atResponse(44 * 60 + 21),
        type: 'phase',
        status: 'active',
        description: 'Chapters up to 44:21 (intro, flyer explainer, data section, Stuckey response).',
      },
      {
        id: 'responding_to_glenn_beck',
        start: atResponse(44 * 60 + 21),
        end: atResponse(59 * 60 + 4),
        type: 'phase',
        status: 'active',
        description:
          'Chapter "Responding To Glenn Beck": the clip plays from 44:52.5, stopped ten ' +
          'times for commentary, and is left at 59:03.',
      },
      {
        id: 'closing',
        start: atResponse(59 * 60 + 4),
        end: RESPONDER_PUBLISHED + RESPONDER_RUNTIME,
        type: 'phase',
        status: 'active',
        description: 'The responder\'s closing reflection, to the end of the video.',
      },
    ],
    keyframes: beckResponderAlignedEvents.map((event) => keyframe(event, 'response')),
    windows: { strategy: 'phase_based' },
  },

  connections: {
    references: [
      {
        type: 'EXCERPTS',
        targetUniverseId: CLIP_ID,
        confidence: 1.0,
        description:
          'The response replays 44:52.5-59:03 of its own runtime from the clip, which ' +
          'supplies 0:00-8:37 of the clip\'s runtime.',
        evidence: ['Caption tracks align word for word across the segment'],
      },
      {
        type: 'PLAYED_BACK_WITH_PAUSES',
        targetUniverseId: CLIP_ID,
        confidence: 0.95,
        description:
          'The excerpt is not a single playback: the clip is stopped ten times for ' +
          'overlays, adding 333.39 s of drift, so one fixed offset cannot map the two ' +
          'clocks. See `beckResponderDrift`.',
        evidence: [
          'Ten offset steps recovered by word-level alignment; each coincides with an overlay',
          'A single offset misplaces the cost claim by 214 s at the end of the segment',
        ],
      },
    ],
  },

  metadata: {
    canonicalName: 'Why Christians Lie About Transgender Kids (Tim Whitaker Speaks)',
    description:
      'A 1:02:48 response video: a flyer explainer, a data section, a response to Allie ' +
      'Stuckey, and a response to Glenn Beck in which a mailed pamphlet is read out line ' +
      'by line while the responder talks over it.',
    creators: ['Tim Whitaker'],
    released: new Date(Number(RESPONDER_PUBLISHED / 1_000_000n)),
    cultural_significance: 0.45,
    clockDrift: {
      role: 'derived',
      runtimeSeconds: Number(RESPONDER_RUNTIME / 1_000_000_000n),
      sourceUniverseId: CLIP_ID,
      embedAtSeconds: SEGMENT_EMBED_AT,
      pauseCount: PAUSES.length,
      totalDriftSeconds: Number(totalDrift(beckResponderDrift)) / 1e9,
      publicationLagSeconds: Number(
        (RESPONDER_PUBLISHED - CLIP_PUBLISHED) / 1_000_000_000n,
      ),
      derivation: 'beckResponderDrift (src/utils/clock-drift.ts)',
    },
    alignedEvents: beckResponderAlignedEvents.map((event) => ({
      id: event.id,
      clipSeconds: event.clipSeconds,
      responseSeconds: event.responseSeconds,
    })),
    sourcing: {
      verified: [
        'Title, channel, publication instant (2026-10-23T20:15:30Z), runtime (3,768 s) and chapter list from YouTube metadata',
        'Chapter "Responding To Glenn Beck" starts at 44:21',
        'Ten pauses recovered from word-level alignment of the two caption tracks',
      ],
      notRecorded: [
        'Whether the clip audio was altered between upload and re-use',
        'The responder\'s editing decisions: a pause is measured, not explained',
      ],
    },
  },
} as unknown as Universe;

/* ------------------------------------------------------------------ *
 * Convenience accessors
 * ------------------------------------------------------------------ */

/** Runtime position (ns from the clip's zero) of an instant on the clip's clock. */
export const clipRuntimeOf = (instant: bigint): bigint => instant - CLIP_PUBLISHED;

/** Runtime position (ns from the response's zero) of an instant on the response clock. */
export const responseRuntimeOf = (instant: bigint): bigint => instant - RESPONDER_PUBLISHED;

export const CLIP_PUBLICATION_INSTANT = CLIP_PUBLISHED;
export const RESPONSE_PUBLICATION_INSTANT = RESPONDER_PUBLISHED;
export const CLIP_RUNTIME_NS = CLIP_RUNTIME;
export const RESPONSE_RUNTIME_NS = RESPONDER_RUNTIME;
