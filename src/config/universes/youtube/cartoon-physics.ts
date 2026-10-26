import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * Cartoon Physics Are More Logical Than You Think — BigBlueBackpack (2023).
 *
 * A 10:15 video essay with one argument: the impossible physics of animated shorts are
 * not arbitrary. They are the cartoon's way of showing an interior state the drawing
 * cannot depict — a bump for pain, a leap for surprise, a knot for humiliation — and they
 * stop the moment the state has been shown. The essay then reads the *distribution* of
 * that device: the world bends for one character and is arranged against the other (the
 * "butt-monkey"), and the order behind the arrangement is karmic. The one law that
 * outranks the rest is humility: a cartoon cannot sustain a character who is certain of
 * victory, which is why the good guy only loses when he gets cocky.
 *
 * THE WORK IS THE UNIT. Every keyframe is addressed on the video's own clock, at
 * publication + offset, and every description is what the essay says at that point. The
 * thesis is recorded as the work's argument (`metadata.interpretations`), not asserted
 * here as a fact about animation.
 *
 * TIME BASE. `uploadDate` is 2023-05-10T12:00:08-07:00 (= 19:00:08Z) and
 * `videoDetails.lengthSeconds` is 615. The player response also carries a rounded 616 —
 * the measured value is 615 and the epoch uses it. The caption track's last spoken cue is
 * at 589.92 s and its final event — an outro `[Music]` cue — ends at 614.259 s; the
 * file ends at 615 s, so the epoch and the final segment run to the runtime while the last
 * spoken line sits 25 s before it. Offsets are cue starts from the auto-caption track,
 * which resolves a line to about a third of a second; `certainty` on each keyframe records
 * that resolution, not doubt about what is being said.
 *
 * ID: `series:cartoon_physics_are_more_logical_than_you_think:2023`. `series:` is the
 * namespace the other YouTube works use, because `UniverseType` has no video-essay
 * member; the id is produced by `createSeriesUniverseId` and guarded by
 * `isSeriesUniverseId` in the test, not merely by `isValidUniverseId`.
 *
 * PRESUMED ANCHORS. The three works the essay analyses — Looney Tunes, Tom and Jerry and
 * Donald Duck — are referenced constantly and declared nowhere in this corpus. The ids
 * are kept visible with `hydration: 'presumed'` and `metadata.presumed` is the ledger of
 * the same ids. The test pins that a presumed id is still unregistered, so the day one of
 * these works is authored the failure is the reminder to flip the marker.
 *
 * CONTAINMENT. One owner, many memberships: the essay is a member of the Hollywood
 * system container because its subject is the American animated short.
 *
 * Sources: the video's own public metadata and caption tracks (`youtube:G5dFEqC46rw`),
 * read 2026-10-26 — see `metadata.verification` for the instruments and their limits.
 */

export const CARTOON_PHYSICS_UNIVERSE_ID =
  'series:cartoon_physics_are_more_logical_than_you_think:2023';

/** Publication instant: 2023-05-10T12:00:08-07:00 == 2023-05-10T19:00:08Z. */
export const CARTOON_PHYSICS_PUBLISHED = dateToNanoseconds(
  new Date('2023-05-10T19:00:08Z'),
);

/** YouTube `videoDetails.lengthSeconds`. 615 s = 10:15. */
export const CARTOON_PHYSICS_RUNTIME_SECONDS = 615;

/** A runtime offset on the video's own clock: publication instant + mm:ss. */
const at = (seconds: number): bigint =>
  CARTOON_PHYSICS_PUBLISHED + BigInt(Math.round(seconds * 1000)) * 1_000_000n;

/**
 * The five chapters the channel publishes, in order and gapless.
 *
 * Read from the video's `chapters` list (info.json), not from the description text, and
 * exported so the segments and the test read one list. Ends are the next chapter's start;
 * the last end is the runtime.
 */
export const cartoonPhysicsChapters = [
  { id: 'intro', title: 'Intro', startSeconds: 0, endSeconds: 85 },
  { id: 'emotional_truth', title: 'Emotional Truth', startSeconds: 85, endSeconds: 182 },
  { id: 'butt_monkeys', title: 'Butt-Monkeys', startSeconds: 182, endSeconds: 351 },
  { id: 'karma', title: 'Karma', startSeconds: 351, endSeconds: 429 },
  { id: 'overconfidence', title: 'Overconfidence', startSeconds: 429, endSeconds: 615 },
] as const;

/**
 * The three works the essay analyses, all referenced and none declared yet.
 *
 * The year in each id is the series' first release, as an id anchor — not a keyframe and
 * not a claim made by the essay. Hydrating one means authoring its universe, not editing
 * this file.
 */
export const cartoonPhysicsPresumedAnchors = [
  {
    realEventId: 'series:looney_tunes:1930',
    relationshipType: 'documents' as const,
    confidence: 0.95,
    hydration: 'presumed' as const,
    evidence: [
      'The essay names Looney Tunes in its own tags and uses Bugs Bunny as its main example of the character the world bends for',
    ],
  },
  {
    realEventId: 'series:tom_and_jerry:1940',
    relationshipType: 'documents' as const,
    confidence: 0.95,
    hydration: 'presumed' as const,
    evidence: [
      'Named as the pair the audience learns to read from the loser\'s point of view ("stopped rooting for Jerry and started feeling sorry for Tom")',
    ],
  },
  {
    realEventId: 'series:donald_duck:1937',
    relationshipType: 'documents' as const,
    confidence: 0.9,
    hydration: 'presumed' as const,
    evidence: [
      'Named as the standing example of a character who loses every conflict he is in',
    ],
  },
];

/**
 * Two places where the two auto-caption renderings of the same audio disagree — kept as
 * artifacts so nobody normalises them away, and because the disagreement is what localises
 * the error.
 */
export const cartoonPhysicsCaptionArtifacts = [
  {
    atSeconds: 409.76,
    enOrig: "that there's a problem audacious bacon powder",
    enUs: 'that there\u2019s a problem. "A dash of baking powder\u2026"',
    reading: 'A dash of baking powder…',
    note:
      'A quoted cartoon line. The en-orig track renders it as phonetically plausible ' +
      'nonsense; the en-US track recovers it and marks it with quotation marks, which is ' +
      'the only signal in either track that the narrator has stopped speaking. Recorded ' +
      'rather than corrected because the en-orig token is what a text search would find.',
  },
  {
    atSeconds: 210.44,
    enOrig: 'butt monkey is a TV Tropes term for a',
    enUs: 'butt-monkey is a TvTropes term for a character',
    reading: 'butt-monkey, credited to TV Tropes',
    note:
      'Hyphenation and capitalisation only: the en-orig track writes the term open and the ' +
      'site as "TV Tropes", the en-US track hyphenates the term and writes "TvTropes". The ' +
      'essay\'s own spelling is unrecoverable from either; the record uses the open form the ' +
      'narrator\'s sentence supports and names the source as TV Tropes.',
  },
];

export const cartoonPhysicsUniverse = {
  universeId: CARTOON_PHYSICS_UNIVERSE_ID,
  type: UniverseType.SERIES,

  identifiers: {
    primary: CARTOON_PHYSICS_UNIVERSE_ID,
    aliases: [
      'Cartoon Physics Are More Logical Than You Think',
      'BigBlueBackpack cartoon physics essay',
      'youtube:G5dFEqC46rw',
    ],
  },

  realityRelation: {
    type: 'interpretation',
    fictionalizationDegree: 0.0,
    realityAnchors: cartoonPhysicsPresumedAnchors,
  },

  attribution: {
    public_domain: false,
    copyright: {
      holders: ['BigBlueBackpack (YouTube channel)'],
      year: 2023,
      status: 'active',
    },
    sources: [
      'YouTube G5dFEqC46rw — public metadata read 2026-10-26 (oEmbed + watch page + info.json)',
      'Auto-caption track en-orig (json3), 510 events of which 255 carry text; the last spoken line is at 589.92 s, and the track\'s final event — an outro [Music] cue — ends at 614.259 s',
      'Auto-caption track en-US (vtt), the same engine re-rendered with punctuation',
      'Video description: chapter list, music and intro-animation credits',
    ],
    citations_required: true,
    usage_restrictions: [
      'Do not reproduce the audio or video. This module stores metadata, offsets and short quotations.',
      'Quotations are caption renderings, not a checked transcript. Wording inside a quoted cartoon line is the ASR\'s.',
      'The essay\'s argument is recorded as the work\'s interpretation, not as a finding about animation.',
    ],
  },

  layers: [
    {
      layerId: 'primary_layer',
      type: 'primary',
      epochs: {
        runtime: {
          epochId: 'youtube:cartoon_physics_are_more_logical_than_you_think:runtime',
          startTime: CARTOON_PHYSICS_PUBLISHED,
          endTime: at(CARTOON_PHYSICS_RUNTIME_SECONDS),
          precision: TimePrecision.SECOND,
          description:
            'The 615 s runtime, from the measured upload instant. Offsets are cue starts ' +
            'on the auto-caption track; the last spoken line is 589.92 s, the track\'s final ' +
            'event is an outro music cue ending at 614.259 s, and the file ends at 615 s.',
        },
      },
    },
  ],

  epochs: {},

  temporalStructure: {
    segments: cartoonPhysicsChapters.map((chapter) => ({
      id: chapter.id,
      start: at(chapter.startSeconds),
      end: at(chapter.endSeconds),
      type: 'phase' as const,
      status: 'active' as const,
      description: chapter.title,
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
          'Upload instant measured from the video\'s own metadata: 2023-05-10T19:00:08Z ' +
          '(12:00:08-07:00). Runtime 615 s, five published chapters.',
      },
      {
        id: 'thesis_not_random',
        timestamp: at(23.12),
        significance: 1.0,
        certainty: 0.95,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'cartoon_physics', 'narrative'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The thesis, stated: the impossible moments are not random. "these genre ' +
          'conventions don\'t come out of nowhere they exist for a reason" — cartoon ' +
          'physics is a narrative grammar, and its placement is the evidence.',
      },
      {
        id: 'method_placement_and_purpose',
        timestamp: at(34.2),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['method', 'thesis'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'States the method the rest of the essay follows: "by studying the placement and ' +
          'purpose of cartoon physics we can learn a lot about what a cartoon is ' +
          'communicating to us".',
      },
      {
        id: 'artistic_licence',
        timestamp: at(84.64),
        significance: 0.6,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['suspension_of_disbelief', 'out_of_universe'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Gives the first, out-of-universe answer before the argument proper: cartoons can ' +
          'do this because the audience\'s suspension of disbelief stretches further when ' +
          'nothing on screen looks like real life.',
      },
      {
        id: 'identification_needs_exaggeration',
        timestamp: at(111.48),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['identification', 'emotional_truth'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The in-universe answer: because a cartoon does not look like reality, ' +
          'identification has to be carried by exaggeration. A live-action blow makes the ' +
          'audience flinch; a drawing of an animal being hit does not, so the cartoon draws ' +
          'the injury instead of depicting it.',
      },
      {
        id: 'bump_stands_for_pain',
        timestamp: at(137.56),
        significance: 0.8,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['emotional_truth', 'worked_example'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The head bump as the worked example: the injury is drawn to be felt — "it has ' +
          'the character grow that big bump on its head to tell you that this hurts".',
      },
      {
        id: 'emotional_truth_named',
        timestamp: at(143.84),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['emotional_truth', 'rule'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Names the rule the chapter is titled for: cartoon physics show the emotional ' +
          'truth of a moment and, by extension, tell the audience how to feel. The ' +
          'pin-prick, the one-bite meal and the tied-in-a-knot are the same device turned to ' +
          'surprise, hunger and humiliation.',
      },
      {
        id: 'effects_do_not_persist',
        timestamp: at(174.92),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['emotional_truth', 'rule'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The consequence that makes the device a grammar rather than decoration: the ' +
          'effect ends with the shot. "moments like these never carry over into the next ' +
          'shot once they\'ve told us how to feel they\'ve served their purpose".',
      },
      {
        id: 'butt_monkey_defined',
        timestamp: at(204.84),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['butt_monkey', 'tvtropes', 'terminology'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Introduces the term the power dynamic is organised around: the butt-monkey, ' +
          'credited to TV Tropes — a character who never has anything go right because the ' +
          'world of the story is arranged against them.',
      },
      {
        id: 'power_dynamic',
        timestamp: at(224.28),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['butt_monkey', 'structure'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The structural claim: cartoons pair a character the world beats down with a ' +
          'character who bends it. Bugs Bunny against whoever is bothering him, Jerry ' +
          'against Tom, Donald Duck losing every conflict he is in.',
      },
      {
        id: 'pixar_coincidence_rule',
        timestamp: at(302.56),
        significance: 0.8,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['pixar', 'contrivance', 'objection'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Raises the objection — contrivance should rob the story of stakes — and answers ' +
          'it with the Pixar rule: coincidences that get a character into trouble are fine, ' +
          'coincidences that get them out are cheating.',
      },
      {
        id: 'identification_with_the_butt_monkey',
        timestamp: at(316.0),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['butt_monkey', 'identification', 'objection'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Why the rule survives: the audience is made to identify with the butt-monkey — ' +
          'more frame time, more point of view — which is the essay\'s explanation of the ' +
          'familiar shift from rooting for Jerry to feeling sorry for Tom.',
      },
      {
        id: 'karmic_justice',
        timestamp: at(363.08),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['karma', 'structure', 'rule'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The order behind the apparent inconsistency: a karmic justice in which the ' +
          'character the audience is told to root against is always the one who starts it — ' +
          'looks for trouble, inconveniences someone, or shows no empathy.',
      },
      {
        id: 'cardinal_sin',
        timestamp: at(447.72),
        significance: 1.0,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['overconfidence', 'rule', 'exception'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The law that outranks the others and explains the cases that look like ' +
          'exceptions: a cartoon cannot sustain a character who is certain of victory. ' +
          'Overconfidence is the cardinal sin.',
      },
      {
        id: 'humility_opens_the_world',
        timestamp: at(482.84),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['humility', 'rule'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The positive form of the law: a character who accepts their limits can shape ' +
          'their surroundings; one who believes the win is in the bag has the world turn on ' +
          'them. "that is the only time when Good Guys lose when they get cocky".',
      },
      {
        id: 'cliff_trope',
        timestamp: at(517.0),
        significance: 0.7,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['gravity', 'cliff', 'opening_example'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Returns to the opening example: the character who runs off a cliff and stands on ' +
          'air until they look down. The essay notes the trope is not universal — nine times ' +
          'in ten the fall lands, and the tenth is the case left to explain.',
      },
      {
        id: 'cliff_exception',
        timestamp: at(550.52),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['gravity', 'cliff', 'humility'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The exception: a character who recognises the mistake can run back to safety. ' +
          'Confidence is what the world punishes; recognition is what it permits.',
      },
      {
        id: 'confidence_decides_the_fall',
        timestamp: at(563.56),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['gravity', 'cliff', 'rule'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The law restated on the cliff: the fall is for the character who runs out with ' +
          'full confidence that they are on solid ground. "the cartoon world will be right ' +
          'there to prove them wrong waiting just long enough for them to realize what a ' +
          'fool they\'ve been".',
      },
      {
        id: 'closing_callback',
        timestamp: at(587.24),
        significance: 0.6,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['closing', 'callback', 'quotation'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Closes on the oldest version of the gag — "I know this defies the law of gravity ' +
          'but uh you see I never studied law" — which is the thesis in one line: the ' +
          'cartoon\'s physics are its rhetoric.',
      },
    ],

    windows: { strategy: 'time_based' },
  },

  metadata: {
    canonicalName: 'Cartoon Physics Are More Logical Than You Think',
    description:
      'A 10:15 video essay arguing that cartoon physics are a narrative grammar rather ' +
      'than arbitrary absurdity: exaggeration carries the emotion a drawing cannot depict, ' +
      'the effect ends with the shot, a power dynamic decides which character the world ' +
      'bends for, karmic justice decides who deserves it, and overconfidence is the one sin ' +
      'the cartoon world will not sustain.',
    creators: ['BigBlueBackpack'],
    released: new Date('2023-05-10T19:00:08Z'),
    cultural_significance: 0.35,
    significance:
      'A mid-sized essay in the video-essay genre that gives a compact, testable account ' +
      'of the toon-physics convention. Recorded for the structure of its argument and for ' +
      'the three works it reads, not for influence.',
    tags: ['youtube', 'video-essay', 'animation', 'cartoon-physics', 'looney-tunes'],
    platform: 'YouTube',
    externalId: 'G5dFEqC46rw',
    externalIds: { youtubeVideoId: 'G5dFEqC46rw' },
    durationSeconds: CARTOON_PHYSICS_RUNTIME_SECONDS,
    contentType: 'video essay',
    metricsAsOf: '2026-10-26',

    /** From the description: the humans the video credits for its own making. */
    credits: {
      music: 'Sam LaGrego (@samlagregomusic)',
      introAnimation: 'AronGIsMe (@AronGIsMe)',
      royaltyFreeMusic: 'Bensound',
    },

    /** The chapter list as published, so the segments can be checked against it. */
    chapters: cartoonPhysicsChapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      startSeconds: chapter.startSeconds,
      endSeconds: chapter.endSeconds,
    })),

    /**
     * The argument, at its own standing. These are readings, not findings: the essay
     * cites no survey, no study and no date.
     */
    interpretations: [
      {
        id: 'I-1',
        claim:
          'Cartoon physics are the medium\'s emotional vocabulary, not arbitrary absurdity; ' +
          'placement and purpose are the evidence.',
        statedAtSeconds: 23.12,
        standing:
          'The essay\'s thesis. Recorded as the work\'s argument. The support is readings ' +
          'of individual gags, offered as illustration rather than as a survey.',
      },
      {
        id: 'I-2',
        claim:
          'The butt-monkey is the character the audience is invited to identify with, which ' +
          'is why contrivance does not cost the cartoon its stakes.',
        statedAtSeconds: 316.0,
        standing:
          'Argued from frame time and point of view. No measurement or citation is offered, ' +
          'and the claim is not carried as a fact about audiences here.',
      },
    ],

    /**
     * The two tracks disagree in two places. Kept because a disagreement is a measurement:
     * it localises the artifact and bounds how much of the transcript is verbatim.
     */
    captionArtifacts: cartoonPhysicsCaptionArtifacts,

    verification: {
      performed: '2026-10-26',
      instruments: [
        'yt-dlp 2026.10.21 — info.json (videoDetails, chapters) and both auto-caption tracks',
        'YouTube auto-caption track en-orig (json3): 510 events, 255 carrying text; last spoken line 589.92 s, track tail 614.259 s',
        'YouTube auto-caption track en-US (vtt): 1,630 words against en-orig\'s 1,652, punctuated',
        'YouTube oEmbed endpoint (title, author_name, author_url)',
      ],
      measured: {
        title: 'Cartoon Physics Are More Logical Than You Think',
        channel: 'BigBlueBackpack',
        handle: '@BigBlueBackpack',
        published: '2023-05-10T19:00:08Z',
        durationSeconds: CARTOON_PHYSICS_RUNTIME_SECONDS,
        viewCountAtVerification: 828108,
        likeCountAtVerification: 30134,
        chapterCount: 5,
      },
      limits: [
        'Both caption tracks are automatic; the channel publishes no manual track. Word order is reliable; punctuation and quoted lines are the engine\'s.',
        'A cue start is where the engine began a phrase, not where a word begins. Offset certainty is 0.9, about a third of a second.',
        'The player response rounds the runtime to 616 s; videoDetails.lengthSeconds is 615 s and the epoch uses it.',
        'The last spoken line is at 589.92 s and the last text event is an outro [Music] cue at 595.9 s. The track\'s final event ends at 614.259 s; the file ends at 615 s. A cue is not the file, and the final [Music] cue\'s 18.4 s duration is not speech.',
        'View and like counts are point-in-time reads, not properties of the work.',
        'The essay quotes cartoon dialogue that the caption tracks cannot delimit; only the en-US track\'s quotation marks mark a switch of voice.',
      ],
    },

    /** The presumption ledger for the anchors above. */
    presumed: cartoonPhysicsPresumedAnchors.map((anchor) => ({
      universeId: anchor.realEventId,
      hydration: anchor.hydration,
      referredBy: CARTOON_PHYSICS_UNIVERSE_ID,
      contributesCharge: false,
      revisitIf:
        'Author the work\'s universe, then flip this anchor to hydration: "declared" — the ' +
        'suite fails while a declared id is still marked presumed.',
    })),

    uncertaintyNotes: [
      'One narrator, so there is no speaker-attribution problem: every line in the transcript is the essayist\'s except the quoted cartoon dialogue, which neither track delimits reliably.',
      'The three analysed works are presumed addresses, not verified links. The year in each id is the series\' first release, used as a naming anchor.',
      'The essay offers no dates, sources or studies. Its claims are recorded as interpretations and are not read back as facts about animation or audiences.',
    ],
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.HOLLYWOOD_SYSTEM],
    },
  },
} as unknown as Universe;
