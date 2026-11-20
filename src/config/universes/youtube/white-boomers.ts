import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * The White Baby Boomers Had So Much Money — David Hoffman, 2018 (2018-11-08T14:17:22Z).
 *
 * A 5:51 clip of a 1989 interview with Theodore Roszak. His argument: the first
 * post-war generation of middle-class white children grew up in an unprecedented
 * "social vacuum" made by affluence and permissive child-rearing; they carried
 * expectations of freedom and happiness into adulthood; a small obstreperous
 * minority treated those expectations as a right to self-definition and became the
 * resistant core of 1960s campus protest; and the cultural result is a new
 * plateau — people claiming to be "the captains of their own soul".
 *
 * THE WORK IS THE UNIT. Every keyframe is addressed on the clip's own clock at
 * publication + offset. The 1989 interview this clip is cut from is a different
 * work; no id is invented for it because the source gives no published title or
 * stable identity, only a year and a speaker (see metadata.uncertaintyNotes).
 *
 * THE TRACKS ARE ONE RENDERING. `en-orig` and `en` were both fetched as json3
 * and are byte-identical (sha256 b470247b…). That is one automatic rendering,
 * not two independent checks. Confidence is capped at 0.8, a second attempt is
 * recommended, and all conspicuous ASR errors are kept in `captionArtifacts`
 * with no invented second reading.
 *
 * NO PUBLISHED CHAPTERS. `info.json` has an empty `chapters[]`. The eight
 * segments below are editorial phases of the argument; their bounds are cue
 * starts or the runtime, and they are gapless. They are not presented as
 * chapters the channel published.
 *
 * ID: `series:the_white_baby_boomers_had_so_much_money:2018`, produced by
 * `createSeriesUniverseId`; `series:` because `UniverseType` has no video-clip
 * member. Guarded by `isSeriesUniverseId` in the test, not merely by
 * `isValidUniverseId`.
 *
 * Sources: the video's own public metadata and its English caption rendering
 * (`youtube:gXro9FaNkIU`), read 2026-11-19 — see `metadata.verification`.
 */

export const WHITE_BOOMERS_UNIVERSE_ID =
  'series:the_white_baby_boomers_had_so_much_money:2018';

/** Publication instant: 2018-11-08T14:17:22Z, from `info.json` `timestamp` (epoch seconds). */
export const WHITE_BOOMERS_PUBLISHED = dateToNanoseconds(
  new Date('2018-11-08T14:17:22Z'),
);

/** YouTube `videoDetails.lengthSeconds`. 351 s = 5:51. */
export const WHITE_BOOMERS_RUNTIME_SECONDS = 351;

/** A runtime offset on the clip's own clock: publication instant + seconds. */
const at = (seconds: number): bigint =>
  WHITE_BOOMERS_PUBLISHED + BigInt(Math.round(seconds * 1000)) * 1_000_000n;

/**
 * Editorial phases of the argument, in order and gapless. The channel publishes
 * no chapters, so these are derived from cue starts in the caption rendering.
 * Exported so the segments, the metadata copy and the test read one list.
 */
export const whiteBoomersPhases = [
  { id: 'social_vacuum', title: 'A strange new social vacuum', startSeconds: 0, endSeconds: 38.579 },
  { id: 'affluence', title: 'Affluence with a capital A', startSeconds: 38.579, endSeconds: 84.09 },
  { id: 'permissive_childhood', title: 'Permissive childhood and high expectations', startSeconds: 84.09, endSeconds: 138.6 },
  { id: 'gray_flannel_majority', title: 'The gray-flannel majority', startSeconds: 138.6, endSeconds: 152.13 },
  { id: 'obstreperous_minority', title: 'The obstreperous minority', startSeconds: 152.13, endSeconds: 198.57 },
  { id: 'campus_self_definition', title: 'Campus, self-definition and the deep questions', startSeconds: 198.57, endSeconds: 258.63 },
  { id: 'resistant_segment', title: 'The resistant segment of a generation', startSeconds: 258.63, endSeconds: 290.8 },
  { id: 'cultural_significance', title: 'A new plateau in cultural history', startSeconds: 290.8, endSeconds: 351 },
] as const;

/**
 * Conspicuous errors in the single caption rendering. There is no second
 * English rendering to compare: `enUs` is null everywhere, and the adopted
 * reading is a repair from the surrounding words, not a citation.
 */
export const whiteBoomersCaptionArtifacts = [
  {
    atSeconds: 143.73,
    enOrig: 'obedient wives are raising kids in the suburbs',
    enUs: null,
    reading: 'obedient wives raising kids in the suburbs',
    note: 'A function word is inserted by the recogniser; the parallel phrase above is "men in gray flannel suits".',
  },
  {
    atSeconds: 226.26,
    enOrig: 'if you eventually social critics would call these people narcissistic',
    enUs: null,
    reading: 'as eventual social critics would call these people narcissistic',
    note: 'The opening function words are garbled; the following clause is clear. Single-source repair.',
  },
  {
    atSeconds: 256.65,
    enOrig: 'what the government eventually wanted was obediently cannon fodder',
    enUs: null,
    reading: 'obedient cannon fodder',
    note: 'Adverb substituted for the adjective; parallel to "loyal employees" in the previous cue.',
  },
  {
    atSeconds: 283.84,
    enOrig: 'decided to claim when the opportunity for freedom and happiness',
    enUs: null,
    reading: 'decided to claim the opportunity for freedom and happiness',
    note: 'Spurious "when"; the noun phrase is complete without it.',
  },
  {
    atSeconds: 315.61,
    enOrig: 'one very large identity worth most people belong called the masses',
    enUs: null,
    reading: 'one very large identity, to which most people belong, called the masses',
    note: 'The relative clause is garbled but recoverable from the following "nobody wants to be that anymore".',
  },
  {
    atSeconds: 327.789,
    enOrig: 'they are their own they are the captains of their own soul',
    enUs: null,
    reading: 'they are the captains of their own soul',
    note: 'A repeated fragment precedes the quotation. Single-source repair; no second rendering exists.',
  },
];

export const whiteBoomersUniverse = {
  universeId: WHITE_BOOMERS_UNIVERSE_ID,
  type: UniverseType.SERIES,

  identifiers: {
    primary: WHITE_BOOMERS_UNIVERSE_ID,
    aliases: [
      'The White Baby Boomers Had So Much Money',
      'Theodore Roszak on the white baby boomers',
      'youtube:gXro9FaNkIU',
    ],
  },

  realityRelation: {
    type: 'interpretation',
    fictionalizationDegree: 0.0,
    realityAnchors: [],
  },

  attribution: {
    public_domain: false,
    copyright: {
      holders: ['David Hoffman (video publisher)', 'Theodore Roszak (speaker)'],
      year: 2018,
      status: 'active',
    },
    sources: [
      'YouTube gXro9FaNkIU — public metadata (info.json: timestamp, duration, title, channel, counts, empty chapters[]), read 2026-11-19',
      'Video description — published second source for the speaker name (Theodore Roszak), the 1989 interview date and the author/historian attribution',
      'English caption rendering (json3): 150 text events, 1031 words, 100% coverage of the 351 s runtime',
      'The en-orig and en tracks were both fetched; they are byte-identical and are one rendering, not two',
    ],
    citations_required: true,
    usage_restrictions: [
      'Do not reproduce the audio or video. This module stores metadata, offsets and short quotations only.',
      'The clip is a 1989 interview excerpt republished in 2018. Its claims are the speaker\'s, recorded as interpretations.',
      'Quotations come from a single caption rendering; the repairs in metadata.captionArtifacts are not independently confirmed.',
    ],
  },

  layers: [
    {
      layerId: 'primary_layer',
      type: 'primary',
      epochs: {
        runtime: {
          epochId: `${WHITE_BOOMERS_UNIVERSE_ID}:runtime`,
          startTime: WHITE_BOOMERS_PUBLISHED,
          endTime: at(WHITE_BOOMERS_RUNTIME_SECONDS),
          precision: TimePrecision.SECOND,
          description:
            'The 351 s runtime from the measured upload instant. No chapters are published; ' +
            'the eight editorial phases and every keyframe offset come from cue starts in the ' +
            'caption rendering. The last text cue begins at 348.639 s.',
        },
      },
    },
  ],

  epochs: {},

  temporalStructure: {
    segments: whiteBoomersPhases.map((phase) => ({
      id: phase.id,
      start: at(phase.startSeconds),
      end: at(phase.endSeconds),
      type: 'phase' as const,
      status: 'active' as const,
      description: phase.title,
    })),

    keyframes: [
      {
        id: 'published',
        timestamp: at(0),
        significance: 1.0,
        certainty: 1.0,
        precision: TimePrecision.SECOND,
        tags: ['publication', 'verified_metadata', 'zero_reference'],
        type: KeyframeType.RELEASE,
        description:
          'Upload instant from the video\'s own metadata: 2018-11-08T14:17:22Z. ' +
          'Runtime 351 s. The description dates the interview itself to 1989, a different event.',
      },
      {
        id: 'social_vacuum',
        timestamp: at(4.7),
        significance: 1.0,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'framing'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The framing claim: it was "not so much that they were under pressure" as that ' +
          'they were "living in a strange new kind of social vacuum" made by affluence and ' +
          'what "we came to call the permissiveness" of the 40s and 50s.',
      },
      {
        id: 'unprecedented_affluence',
        timestamp: at(31.289),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['affluence', 'definition'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The middle-class white children he is describing were raised "in a period of ' +
          'affluence that was unprecedented affluence in a very special sense of the word".',
      },
      {
        id: 'affluence_capital_a',
        timestamp: at(38.579),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['affluence', 'definition'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Affluence with a capital a": "the sky\'s the limit", no environmental or ' +
          'ecological restraints, endless merchandise and no anxiety about waste or resources.',
      },
      {
        id: 'free_college',
        timestamp: at(67.29),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['education', 'opportunity', 'example'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The easy life was available to anyone who qualified, and qualifying was simple: ' +
          '"you simply went to college many cases for free".',
      },
      {
        id: 'spock_permissiveness',
        timestamp: at(84.09),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['child_rearing', 'permissiveness', 'spock'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The openness in childhood was filled by "a new idea dr. Spock\'s ideas about ' +
          'being permissive with your kids" — don\'t freak out if they rebel or talk back.',
      },
      {
        id: 'spoiled_kids',
        timestamp: at(108.119),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['child_rearing', 'reframing'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The generation "I suppose we would now call spoiled kids" — from another point ' +
          'of view, kids with very high expectations in life.',
      },
      {
        id: 'high_expectations',
        timestamp: at(114.45),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['expectations', 'freedom', 'happiness'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Kids who had very high expectations in life with respect to freedom and ' +
          'happiness": they thought life was about being free and being happy.',
      },
      {
        id: 'unprecedented_expectations',
        timestamp: at(129.36),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['expectations', 'world_history'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The expectations carried into high school and college produced "a level of ' +
          'expectation that was simply unprecedented in I would say in world history".',
      },
      {
        id: 'gray_flannel_suits',
        timestamp: at(143.73),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['conformity', 'majority', 'suburbs'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The caution against over-generalising: an enormous number took the opportunities ' +
          'to become "men in gray flannel suits" and obedient wives raising kids in the suburbs.',
      },
      {
        id: 'obstreperous_minority',
        timestamp: at(154.26),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['dissent', 'minority', '1960s'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The others became "a distinct but very obstreperous minority in the 60s" when ' +
          'they arrived on the college campuses and interpreted their position as a chance to be assertive.',
      },
      {
        id: 'do_your_own_thing',
        timestamp: at(167.459),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['emerson', 'dissent', 'quotation'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The phrase they used, taken from Emerson, was "to do your own thing": to take ' +
          'advantage of the freedom available on the assumption that you could never fall too far in affluent America.',
      },
      {
        id: 'society_catches_you',
        timestamp: at(184.2),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['affluence', 'security', 'dropping_out'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Even if you dropped out, "you couldn\'t drop too far": "the society would somehow ' +
          'catch you and sustain you".',
      },
      {
        id: 'free_creative_life',
        timestamp: at(193.02),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['creativity', 'freedom', 'career'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Not being hung up on a career or money made "the opportunity to live a very free ' +
          'creative life" possible.',
      },
      {
        id: 'college_for_them',
        timestamp: at(218.51),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['campus', 'institutions', '1960s'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'They arrived at college "under the assumption that college was for them not for ' +
          'IBM or for the government or for the greater American economy".',
      },
      {
        id: 'narcissistic_label',
        timestamp: at(228.78),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['criticism', 'reframing', 'self_centered'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Social critics "would call these people narcissistic" — "very self-centered" — ' +
          'but from another point of view they were taking advantage of a unique situation.',
      },
      {
        id: 'deep_questions',
        timestamp: at(240.57),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['identity', 'questions', 'affluence'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The affluence "gave people the opportunity to ask deep questions": who am I, ' +
          'what do I want, independently of parents, teachers and government.',
      },
      {
        id: 'employees_and_cannon_fodder',
        timestamp: at(253.11),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['institutions', 'conformity', 'resistance'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'What IBM and the corporations wanted was "loyal employees"; what the government ' +
          'eventually wanted was "obedient cannon fodder". These kids had not been raised to be obedient, docile or loyal.',
      },
      {
        id: 'resistant_elements',
        timestamp: at(273.88),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['protest', '1960s', 'resistance'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'These are "the people who became the most difficult resistant elements of the ' +
          'protest of the 60s" — explicitly a segment of a generation, not the whole generation.',
      },
      {
        id: 'claim_the_opportunity',
        timestamp: at(286.03),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['freedom', 'happiness', 'agency'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The segment "decided to claim the opportunity for freedom and happiness that was ' +
          'presented to them".',
      },
      {
        id: 'significant_postwar_development',
        timestamp: at(293.169),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['significance', 'postwar', 'identity'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'He takes this as "a very significant development of the post-world War two ' +
          'period in America and in other affluent societies": the desire to define oneself ' +
          'and find one\'s own identity.',
      },
      {
        id: 'no_masses',
        timestamp: at(315.61),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['identity', 'masses', 'culture'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Society no longer has to have "one very large identity to which most people ' +
          'belong called the masses": "nobody wants to be that anymore".',
      },
      {
        id: 'captains_of_their_own_soul',
        timestamp: at(327.789),
        significance: 1.0,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['identity', 'agency', 'quotation'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The formulation he returns to: people want "a sense that they are the captains ' +
          'of their own soul and masters of their own fate" — with the admission that they ' +
          'may sometimes be deeply deluded about it.',
      },
      {
        id: 'cultural_plateau',
        timestamp: at(339.219),
        significance: 0.95,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['significance', 'cultural_history', 'conclusion'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The conclusion: "I take that to be a significant new plateau in cultural history", ' +
          'which makes the world more interesting through "this grand variety of lifestyles".',
      },
    ],

    windows: { strategy: 'time_based' },
  },

  metadata: {
    canonicalName: 'The White Baby Boomers Had So Much Money',
    description:
      'A 5:51 clip from a 1989 interview in which Theodore Roszak argues that the first ' +
      'post-war generation of middle-class white children grew up in an unprecedented social ' +
      'vacuum of affluence and permissiveness, that they carried unprecedented expectations ' +
      'of freedom and happiness, that a small obstreperous minority became the resistant core ' +
      'of 1960s campus protest, and that the cultural result is a new claim to individual identity.',
    creators: ['Theodore Roszak (speaker)', 'David Hoffman (interviewer and publisher)'],
    released: new Date('2018-11-08T14:17:22Z'),
    cultural_significance: 0.4,
    significance:
      'A widely viewed clip (275,146 views at verification) of an early account of the ' +
      'post-war generation that supplies a first-person framing for affluence, permissive ' +
      'child-rearing and the 1960s campus minority. Recorded for that argument and its clock.',
    tags: ['youtube', 'interview', 'baby-boomers', 'counterculture', 'affluence'],
    platform: 'YouTube',
    externalId: 'gXro9FaNkIU',
    externalIds: { youtubeVideoId: 'gXro9FaNkIU' },
    durationSeconds: WHITE_BOOMERS_RUNTIME_SECONDS,
    contentType: 'video clip',
    metricsAsOf: '2026-11-19',

    chapters: [],

    phases: whiteBoomersPhases.map((phase) => ({
      id: phase.id,
      title: phase.title,
      startSeconds: phase.startSeconds,
      endSeconds: phase.endSeconds,
    })),

    interpretations: [
      {
        id: 'I-1',
        claim:
          'The first post-war generation of middle-class white children grew up in an ' +
          'unprecedented social vacuum of affluence and permissiveness, not under simple pressure.',
        statedAtSeconds: 4.7,
        standing:
          'The speaker\'s framing of his own generation. Supported by example and contrast, ' +
          'not by measurement; recorded as the work\'s interpretation.',
      },
      {
        id: 'I-2',
        claim:
          'Affluence turned freedom and happiness into the expected defaults and produced a ' +
          'level of expectation unprecedented in world history.',
        statedAtSeconds: 129.36,
        standing:
          'A comparative historical claim asserted in the interview. No comparative data ' +
          'is offered here; the claim is kept at the standing of the speaker.',
      },
      {
        id: 'I-3',
        claim:
          'A small obstreperous minority read those expectations as a right to self-definition ' +
          'and became the resistant core of 1960s campus protest.',
        statedAtSeconds: 273.88,
        standing:
          'Explicitly a segment, not a whole generation. The distinction is the speaker\'s ' +
          'own and is part of the claim.',
      },
      {
        id: 'I-4',
        claim:
          'The significant cultural result is the claim to individual identity — people as ' +
          '"captains of their own soul" — a new plateau in cultural history.',
        statedAtSeconds: 339.219,
        standing:
          'Normative periodisation offered by the speaker in the closing passage; not an ' +
          'independent finding about cultural history.',
      },
    ],

    captionArtifacts: whiteBoomersCaptionArtifacts,

    verification: {
      performed: '2026-11-19',
      instruments: [
        'yt-dlp 2025.10.14 (python 3.9, youtube:player_client=android_vr) — info.json with timestamp, duration, title, channel, counts and empty chapters[]',
        'Caption track en-orig (json3): 150 text events, 1031 words, first cue 0.120 s, last cue 348.639 s',
        'Caption track en (json3): byte-identical to en-orig — sha256 b470247bd009b7dacf0d3a9fb3e572013e4089ff387f426238b7d5193a0195b6',
        'read_captions.py --confidence: 150 cues, 1031 words, 100.0% coverage, 25.6 cues/min, printed ceiling 0.90',
        'Video description: published second source for the speaker, the 1989 interview and the author/historian attribution',
      ],
      measured: {
        title: 'The White Baby Boomers Had So Much Money',
        channel: 'David Hoffman',
        handle: '@DavidHoffmanFilmmaker',
        published: '2018-11-08T14:17:22Z',
        interviewedIn: '1989 (per the video description)',
        durationSeconds: WHITE_BOOMERS_RUNTIME_SECONDS,
        viewCountAtVerification: 275146,
        likeCountAtVerification: 8662,
        publishedChapterCount: 0,
        editorialPhaseCount: 8,
        captionEvents: 150,
        lastSpokenCueSeconds: 348.639,
      },
      scope: { start: 0, end: WHITE_BOOMERS_RUNTIME_SECONDS },
      confidence: 0.8,
      secondAttempt: {
        recommended: true,
        why:
          'The two requested English tracks are byte-identical: YouTube served one automatic ' +
          'rendering under both names. One rendering is not a cross-check, so the printed ' +
          '0.90 ceiling is lowered to the single-source cap of 0.80.',
        what:
          'Acquire a published transcript of the 1989 Roszak interview, or ASR the quoted spans ' +
          'with a named model and record which reading carries the trust. No manual English ' +
          'subtitles were listed for this video.',
        attempted:
          'Both en-orig and en were fetched as json3 and hashed; they are byte-identical. No second ' +
          'attempt was made because no independent rendering or published transcript was found.',
      },
      limits: [
        'The en-orig and en tracks are byte-identical; all quotations are a single rendering, and the repairs in metadata.captionArtifacts are unconfirmed reads from context.',
        'The published video metadata carries no chapters. The eight phases are editorial, bounded by cue starts and the runtime, and are not a channel-published chapter list.',
        'The last text cue starts at 348.639 s; the epoch and final phase run to 351 s. No claim is keyframed after the last cue.',
        'The clip is an excerpt of a 1989 interview republished in 2018. The publication instant anchors this clip only, not the interview.',
        'No audio or video was archived: no ticket named this source as volatile and it is not in the archive subset.',
        'View and like counts are point-in-time reads, not properties of the work.',
        'The talk is advocacy and recollection. Its claims about postwar affluence, child-rearing and 1960s protest are recorded as interpretations and are not verified against external sources here.',
      ],
    },

    uncertaintyNotes: [
      'One speaker throughout, so there is no diarisation problem; the clip is a monologue excerpt.',
      'The 1989 interview is not given a universe id: the description supplies a year and a speaker but no published title or stable identity, so a defensible id cannot be formed. The reference is left as prose.',
      'Names inside the renderings — Dr. Spock, Emerson, IBM — are left as the speaker\'s references. No id is invented for them and no external confirmation is claimed.',
      'The upload instant is UTC from info.json; the 1989 interview date in the description is a different event and is recorded separately.',
      'Significance and cultural-significance values are editorial weights for retrieval, not measurements of influence.',
    ],
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.US_HISTORY],
    },
  },
} as unknown as Universe;
