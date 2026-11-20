import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * Every Conspiracy Theory I Was Taught as a Fundamentalist Homeschooler —
 * Genetically Modified Skeptic (Drew), 2025 (2025-08-29T16:25:11Z).
 *
 * A 59:49 "story time" testimony in which the speaker recounts the conspiracy
 * theories of his fundamentalist homeschool upbringing in 1990s/2000s Texas.
 * Thirteen topics — satanic communism, the great replacement, public education,
 * the demonic Catholic Church, the RFID mark of the beast, dinosaurs and
 * evolution, cryptids, the rhythms of rock and roll, Pokémon and Yu-Gi-Oh,
 * climate-change denial, Atlantis, and a closing conversation with Alyssa
 * Grenfell — are traced back to one controlling idea: a grand conspiracy of
 * demon-possessed satanic communists, which functions to mark the in-group as
 * special and persecuted.
 *
 * THE WORK IS THE UNIT. Every keyframe is addressed on the video's own clock at
 * publication + offset, and every non-zero offset is an exact start of a text
 * cue in the English caption track. `info.json` publishes a single chapter
 * ("Intro") covering the whole runtime, so the fourteen segments below are
 * explicitly editorial phases, bounded by cue starts or the runtime, and are
 * NOT presented as a chapter list.
 *
 * ONE RENDERING, NOT TWO. Both requested English tracks (en-orig and en) were
 * fetched and are byte-identical (sha256 0cd88c2d…), so confidence is the
 * single-source cap 0.80 and `verification.secondAttempt.recommended` is true.
 * Conspicuous ASR errors are kept in `metadata.captionArtifacts` with
 * `enUs: null` — repairs from context, not an invented second reading.
 *
 * The conspiracy theories themselves are reported at the standing of the
 * people who taught them; this module verifies only the video's clock and its
 * account of what the speaker was taught. Hillary Clinton, Barack Obama, Karl
 * Marx, the KKK, Charlie Kirk, Ken Hovind, the Duggars, the Abeka curriculum,
 * Alyssa Grenfell, Ferris Wilks, the Daily Wire, the named cryptids and the
 * cited scriptures are outside works; no id is invented for them.
 *
 * ID: `series:every_conspiracy_theory_fundamentalist_homeschooler:2025`, produced
 * by `createSeriesUniverseId`; `series:` because `UniverseType` has no video
 * member. Guarded by `isSeriesUniverseId` in the test, not merely by
 * `isValidUniverseId`.
 *
 * Sources: the video's own public metadata and English caption track
 * (`youtube:LS6CNpSwpEs`), read 2026-11-19 — see `metadata.verification`.
 */

export const FUNDAMENTALIST_CONSPIRACIES_UNIVERSE_ID =
  'series:every_conspiracy_theory_fundamentalist_homeschooler:2025';

/** Publication instant: 2025-08-29T16:25:11Z, from `info.json` `timestamp`. */
export const FUNDAMENTALIST_CONSPIRACIES_PUBLISHED = dateToNanoseconds(
  new Date('2025-08-29T16:25:11Z'),
);

/** YouTube `videoDetails.lengthSeconds`. 3589 s = 59:49. */
export const FUNDAMENTALIST_CONSPIRACIES_RUNTIME_SECONDS = 3589;

/** A runtime offset on the video's own clock: publication instant + seconds. */
const at = (seconds: number): bigint =>
  FUNDAMENTALIST_CONSPIRACIES_PUBLISHED + BigInt(Math.round(seconds * 1000)) * 1_000_000n;

/** Editorial phases, not published chapters (info.json has one empty "Intro" chapter). */
export const fundamentalistConspiraciesPhases = [
  { id: 'framing', title: 'Story time: a fundamentalist homeschool childhood', startSeconds: 0, endSeconds: 42.879 },
  { id: 'satanic_communism', title: 'Politics: the world is controlled by satanic communists', startSeconds: 42.879, endSeconds: 276.56 },
  { id: 'great_replacement', title: 'The great replacement', startSeconds: 276.56, endSeconds: 689.12 },
  { id: 'public_education', title: 'Public education is set up to oppose God', startSeconds: 689.12, endSeconds: 898.24 },
  { id: 'catholic_church', title: 'The Catholic Church was demonic', startSeconds: 898.24, endSeconds: 1258.08 },
  { id: 'mark_of_the_beast', title: 'RFID chips are the mark of the beast', startSeconds: 1258.08, endSeconds: 1514.72 },
  { id: 'evolution_dinosaurs', title: 'Evolution, dinosaurs and suppressed knowledge', startSeconds: 1514.72, endSeconds: 1831.039 },
  { id: 'cryptids', title: 'Cryptids are real and they are dinosaurs', startSeconds: 1831.039, endSeconds: 2383.52 },
  { id: 'media_pop_culture', title: 'Hidden messages in music and the rhythms of rock and roll', startSeconds: 2383.52, endSeconds: 2592.0 },
  { id: 'pokemon_demons', title: 'Pokémon, Yu-Gi-Oh and possessing demons', startSeconds: 2592.0, endSeconds: 3030.319 },
  { id: 'climate_hoax', title: 'Climate change is all a hoax', startSeconds: 3030.319, endSeconds: 3234.8 },
  { id: 'atlantis', title: 'Atlantis was real and they are covering it up', startSeconds: 3234.8, endSeconds: 3331.359 },
  { id: 'closing_conversation', title: 'Closing conversation with Alyssa Grenfell', startSeconds: 3331.359, endSeconds: 3511.28 },
  { id: 'outro', title: 'Outro, patrons and resources', startSeconds: 3511.28, endSeconds: 3589 },
] as const;

/** Single-source ASR repairs — both requested tracks were byte-identical. */
export const fundamentalistConspiraciesCaptionArtifacts = [
  {
    atSeconds: 78.4,
    enOrig: 'and totally conformous. This was sold to',
    enUs: null,
    reading: 'and totally conformist. This was sold to',
    note: 'The nightmare vision of communist conformity is described in the surrounding cues.',
  },
  {
    atSeconds: 944.8,
    enOrig: '1910s were uh American nivists. So, what',
    enUs: null,
    reading: '1910s were Americanists. So, what',
    note: 'The movement is named again in the following cues as extreme Christian nationalism.',
  },
  {
    atSeconds: 1062.96,
    enOrig: 'and Bruce Aroni and some Mormon leaders',
    enUs: null,
    reading: 'and Bruce Aroni and some Mormon leaders',
    note: 'The LDS leader\'s name is uncertain in the audio; recorded verbatim rather than guessed.',
  },
  {
    atSeconds: 1290.48,
    enOrig: 'doowled out by the antichrist. Uh, and',
    enUs: null,
    reading: 'doled out by the antichrist. Uh, and',
    note: 'The mark of the beast is described in the surrounding cues.',
  },
  {
    atSeconds: 1960.559,
    enOrig: 'Congolese all knew about called Mole',
    enUs: null,
    reading: 'Congolese all knew about called Mokele-mbembe',
    note: 'The Congo cryptid is continued in the next cue ("Embe"); the name is garbled across the two.',
  },
  {
    atSeconds: 2090.96,
    enOrig: 'most famous crypted, at least in North',
    enUs: null,
    reading: 'most famous cryptid, at least in North',
    note: 'The speaker uses the same word correctly elsewhere.',
  },
  {
    atSeconds: 2365.839,
    enOrig: 'you look like Grenle from Beaolf or',
    enUs: null,
    reading: 'you look like Grendel from Beowulf or',
    note: 'The literary allusion is clear from context.',
  },
  {
    atSeconds: 2401.44,
    enOrig: 'Bohemian Rap City in his car. And of',
    enUs: null,
    reading: 'Bohemian Rhapsody in his car. And of',
    note: 'The Queen song title is unambiguous.',
  },
  {
    atSeconds: 2609.92,
    enOrig: 'reaction to both an ASP sting and',
    enUs: null,
    reading: 'reaction to both a wasp sting and',
    note: 'The speaker describes an anaphylactic reaction in childhood.',
  },
  {
    atSeconds: 3033.68,
    enOrig: 'all a hoax. I grew up with the Abeca',
    enUs: null,
    reading: 'all a hoax. I grew up with the Abeka',
    note: 'The curriculum is named again correctly in the following cue.',
  },
];

export const fundamentalistConspiraciesUniverse = {
  universeId: FUNDAMENTALIST_CONSPIRACIES_UNIVERSE_ID,
  type: UniverseType.SERIES,

  identifiers: {
    primary: FUNDAMENTALIST_CONSPIRACIES_UNIVERSE_ID,
    aliases: [
      'Every Conspiracy Theory I Was Taught as a Fundamentalist Homeschooler',
      'Genetically Modified Skeptic fundamentalist conspiracy testimony',
      'youtube:LS6CNpSwpEs',
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
      holders: ['Drew (Genetically Modified Skeptic, speaker and publisher)'],
      year: 2025,
      status: 'active',
    },
    sources: [
      'YouTube LS6CNpSwpEs — public metadata (info.json: timestamp, duration, title, channel, counts, single empty "Intro" chapter), read 2026-11-19',
      'Video description — the ex-fundamentalist framing, the collab with Alyssa Grenfell and the Ground News sponsorship',
      'English caption track en-orig (json3): 1496 text events, 10114 words, first cue 0.240 s, last cue 3587.359 s',
      'English caption track en (json3): byte-identical to en-orig — sha256 0cd88c2d…; one rendering, not a cross-check',
    ],
    citations_required: true,
    usage_restrictions: [
      'Do not reproduce the audio or video. This module stores metadata, offsets and short quotations only.',
      'The video is both a personal testimony and a sponsored upload: the Ground News read near 620 s is part of the source, not an endorsement by this vault.',
      'The conspiracy theories are reported at the standing of the people who taught them. Recording a belief here is not asserting it.',
    ],
  },

  layers: [
    {
      layerId: 'primary_layer',
      type: 'primary',
      epochs: {
        runtime: {
          epochId: `${FUNDAMENTALIST_CONSPIRACIES_UNIVERSE_ID}:runtime`,
          startTime: FUNDAMENTALIST_CONSPIRACIES_PUBLISHED,
          endTime: at(FUNDAMENTALIST_CONSPIRACIES_RUNTIME_SECONDS),
          precision: TimePrecision.SECOND,
          description:
            'The 3589 s runtime from the measured upload instant. info.json publishes only ' +
            'one "Intro" chapter covering the whole runtime, so the fourteen segments below ' +
            'are editorial phases bounded by cue starts or the runtime, not a chapter list. ' +
            'Every keyframe offset is a cue start in the caption rendering.',
        },
      },
    },
  ],

  epochs: {},

  temporalStructure: {
    segments: fundamentalistConspiraciesPhases.map((phase) => ({
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
          'Upload instant from the video\'s own metadata: 2025-08-29T16:25:11Z. ' +
          'Runtime 3589 s with one empty "Intro" chapter; 920,573 views and 34,718 likes at verification.',
      },
      {
        id: 'homeschool_framing',
        timestamp: at(4.24),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['framing', 'testimony'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"I was a Christian fundamentalist homeschooler for the first 18 years of my ' +
          'life" — the standpoint from which the whole retrospective is told.',
      },
      {
        id: 'one_big_conspiracy',
        timestamp: at(18.0),
        significance: 0.95,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'framing'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"My whole outlook... was one big conspiracy theory which positioned us as very ' +
          'special and very persecuted as fundamentalists."',
      },
      {
        id: 'politics_start',
        timestamp: at(41.36),
        significance: 0.8,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['transition', 'politics'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description: '"Let\'s start with what we thought about politics. The world is controlled..."',
      },
      {
        id: 'satanic_communists',
        timestamp: at(42.879),
        significance: 0.95,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'politics'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"by satanic communists" — the opening claim of the politics section, later named ' +
          'as the grand conspiracy behind every smaller theory.',
      },
      {
        id: 'communism_is',
        timestamp: at(112.399),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'politics'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"she\'s a communist, and that\'s what communism is" — the explanation given for ' +
          'Hillary Clinton wanting "complete and total conformity", which struck the child ' +
          'as odd because fundamentalism demanded the same conformity.',
      },
      {
        id: 'communism_satanic',
        timestamp: at(131.599),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'politics'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Communism was a satanic ideology created by a demon-possessed atheist man in the ' +
          '1800s" — Karl Marx, whose name the speaker says he was not told.',
      },
      {
        id: 'one_world_government',
        timestamp: at(160.319),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'politics'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"communists want a one world government" — so any "global something", "whether ' +
          'it\'s trade or alliances", was read as the shadowy communist group.',
      },
      {
        id: 'grand_conspiracy',
        timestamp: at(265.759),
        significance: 0.95,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'grand_conspiracy'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"satanic communists at the highest levels" — the speaker\'s own summary that ' +
          '"just about every other smaller conspiracy theory" reduces to one grand conspiracy.',
      },
      {
        id: 'great_replacement_start',
        timestamp: at(276.56),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'great_replacement'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description: '"The great replacement" — introduced by an ex-Muslim speaker at his church.',
      },
      {
        id: 'muslim_outbreeding',
        timestamp: at(342.24),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'great_replacement'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Muslims planned to take over the world by outbreeding every other" person — ' +
          'the chart-driven claim the congregation was meant to fear, with 2050 as "the big year".',
      },
      {
        id: 'duggars',
        timestamp: at(399.28),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'great_replacement', 'hypocrisy'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"The Duggars are people who believe in outbreeding every other type of person in ' +
          'order to take over the world" — the same idea was "completely supported when it was ' +
          'white Christians" (the Quiverfull movement).',
      },
      {
        id: 'great_replacement_named',
        timestamp: at(486.56),
        significance: 0.95,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'great_replacement', 'refutation'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"untrue, called the great replacement" — the speaker names the theory as a white ' +
          'supremacist conspiracy theory now mainstream in Republican circles.',
      },
      {
        id: 'kkk_origin',
        timestamp: at(513.44),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'great_replacement', 'history'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"propagated very much by the KKK back in the day" — yet now "a regular thing you ' +
          'can just believe if you\'re a Republican".',
      },
      {
        id: 'racism_framework',
        timestamp: at(554.959),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'white_supremacy'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"They didn\'t see how their want to spread, propagate, and preserve Christianity ' +
          'could possibly be used to further bigoted ends" — the blind spot that let the ' +
          'theory through a framework that otherwise called racism "a grave sin like murder".',
      },
      {
        id: 'public_education_start',
        timestamp: at(689.12),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'education'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"The public education system is set up to oppose God" — introduced with a clip ' +
          'from creationist teacher Ken Hovind.',
      },
      {
        id: 'should_be_public_schools',
        timestamp: at(710.079),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'education'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Hovind\'s reframing: "the real question is, should we have public schools?" — ' +
          'only then what is taught and who decides.',
      },
      {
        id: 'schools_new_world_order',
        timestamp: at(736.639),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'education'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"It\'s all part of the plan for a new world order" — Hovind citing Samuel Blumenfeld ' +
          'on why the public school system exists.',
      },
      {
        id: 'schools_oppose_god',
        timestamp: at(818.72),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'education'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"this whole environment was designed to oppose God. This is why they taught things ' +
          'like evolution" — the demons-on-the-monkey-bars imagery of the speaker\'s childhood fear.',
      },
      {
        id: 'voucher_bill',
        timestamp: at(881.199),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['consequence', 'education'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"isn\'t this exact idea being used to destroy public education in the United States ' +
          'right now?" — the speaker points to the voucher bill as the conspiracy made policy.',
      },
      {
        id: 'catholic_church_start',
        timestamp: at(898.24),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'catholic_church'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"The Catholic Church was demonic" — discussed with Alyssa Grenfell, an ex-Mormon ' +
          'YouTuber whose background produced a "surprising" amount of common ground.',
      },
      {
        id: 'fundamentalist_roots',
        timestamp: at(954.639),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'catholic_church', 'history'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The founders of fundamentalist Christianity in the 1910s "had an ideology that we ' +
          'would recognize today as extreme Christian nationalism".',
      },
      {
        id: 'white_ethnostate',
        timestamp: at(962.48),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'catholic_church', 'white_supremacy'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"this land needs to be basically a white ethnostate" — the speaker\'s account of ' +
          'what that founding ideology implied for immigrants and those already here.',
      },
      {
        id: 'catholics_worse',
        timestamp: at(1024.24),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'catholic_church'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Catholics are worse than Satanists or atheists" — what the speaker says he ' +
          'actually believed as a child; Grenfell describes the parallel Mormon "great and ' +
          'abominable church" teaching.',
      },
      {
        id: 'condescension',
        timestamp: at(1171.679),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'catholic_church', 'testimony'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"very... condescending" — at another church he stood with "you guys have ' +
          'some of the truth but let me tell you the real program"; "it wasn\'t like I ' +
          'was scared as much as I was like, I feel sorry for you".',
      },
      {
        id: 'qanon_parallel',
        timestamp: at(1210.16),
        significance: 0.8,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['comparison', 'qanon'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Grenfell compares the "I have the truth" posture to QAnon\'s certainty that ' +
          '"the storm is coming" and that they alone can "deliver that unto people".',
      },
      {
        id: 'rfid_mark',
        timestamp: at(1258.08),
        significance: 0.95,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'end_times'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description: '"RFID chips are the mark of the beast" — the section heading.',
      },
      {
        id: 'mark_from_antichrist',
        timestamp: at(1290.48),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'end_times'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The mark "doled out by the antichrist" and required "to buy and sell" — a ' +
          'fundamentalist eschatological reading of Revelation over its scholarly ' +
          'first-century meaning.',
      },
      {
        id: 'rfid_panic',
        timestamp: at(1329.28),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'end_times', 'testimony'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"the one that I remember the most panic about in my own household was RFID chips" ' +
          '— believed to be "the mark of the beast" with which "the antichrist will know his people".',
      },
      {
        id: 'jerusalem_temple',
        timestamp: at(1436.08),
        significance: 0.8,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'end_times', 'mormonism'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Grenfell\'s Mormon parallel: members read the BYU Jerusalem land lease as a ' +
          '"foothold" and precursor to the temple from which Jesus would "rule and reign".',
      },
      {
        id: 'evolution_start',
        timestamp: at(1514.72),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['transition', 'evolution'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"let\'s get into some conspiratorial thinking surrounding the theory of evolution" ' +
          '— knowledge believed "suppressed in order to serve the evolutionist narrative".',
      },
      {
        id: 'satan_dinosaurs',
        timestamp: at(1547.76),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'evolution'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"One of Satan\'s favorite tools to use is dinosaurs because kids love them" — ' +
          'Hovind\'s line that dinosaurs and humans lived side by side.',
      },
      {
        id: 'human_footprints',
        timestamp: at(1573.039),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'evolution'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"there are human footprints inside the dinosaur tracks" at Glen Rose, Texas — ' +
          'read as confirmation that humans "walked with dinosaurs"; the stride spacing ' +
          'was never questioned.',
      },
      {
        id: 'dragons',
        timestamp: at(1703.279),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'evolution'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"the word dinosaur didn\'t exist until the 1800s" — so the same creatures were ' +
          '"called... dragons", with Marco Polo\'s "great serpents" taken as confirmation ' +
          '(they were Chinese alligators).',
      },
      {
        id: 'apostle_paul_race',
        timestamp: at(1801.84),
        significance: 0.8,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['testimony', 'evolution'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The announcer of his fifth-grade dinosaur-race story "was the Apostle Paul from ' +
          '2,000 years ago" — the depth of the childhood conviction.',
      },
      {
        id: 'cryptids_start',
        timestamp: at(1831.039),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'cryptids'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Cryptids are real and they\'re dinosaurs" — the question was not what made them ' +
          'go extinct but "did they go extinct".',
      },
      {
        id: 'lake_champlain',
        timestamp: at(1867.36),
        significance: 0.8,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'cryptids'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The "Lake Champlain monster" — a family member hoped to glimpse it "cresting up ' +
          'out of the water", believed to be "probably a plesiosaur".',
      },
      {
        id: 'congo_expeditions',
        timestamp: at(2014.24),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'cryptids'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Mokele-mbembe: the locals "were receiving material compensation for taking these ' +
          'relatively rich and gullible missionaries" on repeated fake expeditions.',
      },
      {
        id: 'single_find',
        timestamp: at(2075.839),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['refutation', 'evolution'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The book excerpt the speaker read later: "a single find of a relic species does ' +
          'not overturn this mountain of data" from the fossil record.',
      },
      {
        id: 'nine_feet_nine_hundred',
        timestamp: at(2121.52),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'evolution'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Humans used to be at least 9 ft tall and live to be over 900 years old" — ' +
          'inferred only from the long lifespans in the Bible\'s genealogies.',
      },
      {
        id: 'hyperbaric_chamber',
        timestamp: at(2155.76),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'evolution'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The pre-flood firmament made the earth "a giant hyperbaric chamber" with higher ' +
          'oxygen, so humans supposedly grew much larger — illustrated with giant piranhas.',
      },
      {
        id: 'giant_skeletons_hoax',
        timestamp: at(2221.599),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['refutation', 'evolution'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The 9–11 foot skeleton photos were "not verified or... known to be hoaxes", ' +
          'and hominin skulls were explained as merely very old humans whose brow ridges ' +
          'grew from "making facial expressions for that long".',
      },
      {
        id: 'suppression_claim',
        timestamp: at(2369.599),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'grand_conspiracy'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"we believe that all of this knowledge was just common knowledge... but it was ' +
          'being suppressed purposely by the satanic communists in order to fight God\'s will" ' +
          '— the evolution section\'s tie back to the grand conspiracy.',
      },
      {
        id: 'media_pop_culture_start',
        timestamp: at(2383.52),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['transition', 'media'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description: '"let\'s get into some conspiracies about media and pop culture" — beginning with hidden messages in music.',
      },
      {
        id: 'freddie_mercury',
        timestamp: at(2425.92),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'media'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'A parent\'s claim about Queen: "Freddy Mercury... turned him gay" and "worships ' +
          'Satan and the rest of the band does too" — the music "made in order to get other ' +
          'people to worship Satan".',
      },
      {
        id: 'rhythms',
        timestamp: at(2486.4),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'media'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"it was actually the rhythms themselves that were infecting and changing people" ' +
          '— not the backmasked words the speaker had expected.',
      },
      {
        id: 'rock_and_roll',
        timestamp: at(2546.72),
        significance: 0.95,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'media', 'race'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The origin story he was told: missionaries brought Caribbean "demonic rhythms" ' +
          'home and "create rock and roll... based on religious technology created in order ' +
          'to summon demons".',
      },
      {
        id: 'credit_and_blame',
        timestamp: at(2571.92),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['refutation', 'race'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"white people get the credit for creating rock and roll, which white people did ' +
          'not" while enslaved "black people... get blamed for all the moral degeneracy" — ' +
          'a myth he traces to 1950s fundamentalist circles.',
      },
      {
        id: 'pokemon_start',
        timestamp: at(2592.0),
        significance: 0.95,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'pokemon'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Pokemon and Yu-Gi-Oh were created to corrupt and possess children" — introduced ' +
          'as "the scariest experience... of my entire childhood".',
      },
      {
        id: 'pokemon_talk',
        timestamp: at(2671.839),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'pokemon', 'testimony'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'His parents, after watching an episode: "We have to tell you what Pokémon actually ' +
          'is" — the five-year-old\'s conversion to the belief that demons were real.',
      },
      {
        id: 'japan_satan',
        timestamp: at(2725.2),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'pokemon'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Basically, all of Japan had been captured by Satan himself and were caught up in ' +
          'demon worship" — the creatures believed to be real demons named after Japanese ' +
          'ones; the goal to "possess their child bodies with demonic powers".',
      },
      {
        id: 'weeks_of_terror',
        timestamp: at(2807.599),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['testimony', 'pokemon'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"weeks, if not months. I was constantly horrified" — unable to sleep alone for ' +
          'fear of demons "hiding just out of my field of vision".',
      },
      {
        id: 'sleep_paralysis',
        timestamp: at(2876.56),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['testimony', 'pokemon'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'First sleep paralysis at about six: "a skeletonlike demon hovering over me", ' +
          'read through the lens that "demons are real" as "They got me".',
      },
      {
        id: 'depression_demon',
        timestamp: at(2960.64),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['testimony', 'pokemon'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'As an older teenager "when I experienced depression... I thought it was because ' +
          'there was a demon in my room" — now understood as "an effect of the repressive ' +
          'environment that I was in".',
      },
      {
        id: 'climate_start',
        timestamp: at(3030.319),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'climate'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Climate change is all a hoax. I grew up with the Abeka curriculum" — his actual ' +
          'eighth- or ninth-grade science textbook.',
      },
      {
        id: 'climate_question',
        timestamp: at(3082.079),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'climate', 'testimony'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'He answered "climate change was real" from the very graphs the Abeka book ' +
          'presented — "the only question that I got wrong on the assignment".',
      },
      {
        id: 'fart_in_stadium',
        timestamp: at(3112.8),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'climate'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The analogy he was taught: human emissions were "like a fart in a basketball ' +
          'game" against the controlled environment of the whole stadium.',
      },
      {
        id: 'god_in_control',
        timestamp: at(3181.76),
        significance: 0.95,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'climate'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"humans cannot change the environment because God is in control of the ' +
          'environment. To think otherwise is just hubris" — no observation could count ' +
          'as evidence, on principle.',
      },
      {
        id: 'daily_wire',
        timestamp: at(3188.079),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'climate', 'media'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"exactly what Ferris Wilks, the co-founder of the Daily Wire, believes" — whom ' +
          'he calls "literally an oil billionaire", reading the outlet as "manufacture ' +
          'consent for oil companies".',
      },
      {
        id: 'atlantis_start',
        timestamp: at(3234.8),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'atlantis'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Atlantis was real and they are covering it up" — submerged continents fit the ' +
          'belief in "a worldwide flood about 4,400 years ago".',
      },
      {
        id: 'make_up_stories',
        timestamp: at(3257.76),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['refutation', 'atlantis'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"humans can make up stories for all types of reasons. they don\'t have to be true" ' +
          '— the realization that would have undone the literal reading of Genesis and the flood.',
      },
      {
        id: 'atlantis_suppression',
        timestamp: at(3312.88),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conspiracy', 'atlantis', 'grand_conspiracy'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The scientific community "said all of this was a myth" only because "they were at ' +
          'least in the pocket of the satanic communist elite" — "Everything goes back to that."',
      },
      {
        id: 'closing_conversation',
        timestamp: at(3331.359),
        significance: 0.8,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['transition', 'closing'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Well, I hope this has been at least somewhat enjoyable" — the speaker throws ' +
          'the close over to his conversation with Alyssa Grenfell.',
      },
      {
        id: 'identity_differentiation',
        timestamp: at(3352.079),
        significance: 0.95,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'identity'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The theories "come down to this fundamental effort to differentiate themselves ' +
          'from other people" — "we are this, this is our identity, this is what we think ' +
          'and it\'s different from everyone else".',
      },
      {
        id: 'less_human',
        timestamp: at(3360.559),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'identity'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The same move asserts "everyone else is actually either less human than us or ' +
          'less learned than us, less holy than us".',
      },
      {
        id: 'neural_path',
        timestamp: at(3444.72),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'psychology'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Grenfell on leaving: "a well-worn neural path of how many times in your life have ' +
          'you judged someone" does not simply vanish when "you stop... sitting down in a pew".',
      },
      {
        id: 'mormon_brain',
        timestamp: at(3495.04),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'psychology'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"I still have Mormon brain a little bit and that\'s okay" — but "I have to work ' +
          'harder to understand why I am the way I am".',
      },
      {
        id: 'outro',
        timestamp: at(3511.28),
        significance: 0.8,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['outro', 'promotion'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"You guys should definitely go over to my friend Alyssa Grenfell\'s channel" — ' +
          'the closing promotion of her work and their fundamentalist-pipeline collab.',
      },
      {
        id: 'fundamentalist_pipeline',
        timestamp: at(3542.16),
        significance: 0.8,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['outro', 'promotion'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The collab topic: "the fundamentalist pipeline. How do people become ' +
          'fundamentalists and why?"',
      },
      {
        id: 'apostate_resources',
        timestamp: at(3576.64),
        significance: 0.8,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['outro', 'resources'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"if you are an apostate in need, there are resources linked in the description" ' +
          'to "help you find community and mental health support" — the last substantive cue.',
      },
    ],

    windows: { strategy: 'time_based' },
  },

  metadata: {
    canonicalName: 'Every Conspiracy Theory I Was Taught as a Fundamentalist Homeschooler',
    description:
      'A 59:49 testimony recounting thirteen conspiracy theories of a fundamentalist ' +
      'homeschool upbringing in 1990s/2000s Texas — satanic communism, the great ' +
      'replacement, public education, the demonic Catholic Church, the RFID mark of the ' +
      'beast, dinosaurs and evolution, cryptids, rock and roll, Pokémon, climate denial ' +
      'and Atlantis — and the closing argument that they all serve an identity of being ' +
      'special and persecuted.',
    creators: ['Drew (Genetically Modified Skeptic, speaker and publisher)'],
    released: new Date('2025-08-29T16:25:11Z'),
    cultural_significance: 0.45,
    significance:
      'A widely viewed (920,573 views at verification) first-person account of the ' +
      'conspiracy culture of American fundamentalism, useful for the measured clock and ' +
      'for its explicit account of how a single grand conspiracy structures otherwise ' +
      'unrelated beliefs. Recorded for that testimony, not as independent history.',
    tags: ['youtube', 'testimony', 'fundamentalism', 'conspiracy', 'homeschool', 'apostate'],
    platform: 'YouTube',
    externalId: 'LS6CNpSwpEs',
    externalIds: { youtubeVideoId: 'LS6CNpSwpEs' },
    durationSeconds: FUNDAMENTALIST_CONSPIRACIES_RUNTIME_SECONDS,
    contentType: 'video',
    metricsAsOf: '2026-11-19',

    phases: fundamentalistConspiraciesPhases.map((phase) => ({ ...phase })),

    interpretations: [
      {
        id: 'I-1',
        claim:
          'The great replacement, the RFID mark of the beast, the dinosaur and cryptid ' +
          'beliefs, the rock-and-roll origin story, climate denial and Atlantis all reduce ' +
          'to one controlling idea: a grand conspiracy of demon-possessed satanic communists ' +
          'at the highest levels, opposed to God and suppressing the truth.',
        statedAtSeconds: 265.759,
        standing:
          'The speaker\'s retrospective account of the worldview he was taught, explicitly ' +
          'stated at the end of the politics section and again in the Atlantis and evolution ' +
          'sections. Recorded as the work\'s interpretation, not as fact.',
      },
      {
        id: 'I-2',
        claim:
          'The great replacement slipped through a framework that otherwise condemned ' +
          'slavery, the KKK and racism as grave sins, because "white Christian" preserving ' +
          'Christianity did not register as white supremacy.',
        statedAtSeconds: 554.959,
        standing:
          'The speaker\'s explanation of a blind spot in his own upbringing; a claim about ' +
          'how the beliefs functioned, recorded at his standing.',
      },
      {
        id: 'I-3',
        claim:
          'The childhood terror at Pokémon and the later depression were effects of the ' +
          'repressive fundamentalist environment — demons were real within the framework, ' +
          'so ordinary experiences were read as attacks.',
        statedAtSeconds: 2960.64,
        standing:
          'The speaker\'s later psychological reading of his own experience, offered in the ' +
          'video itself. Not a clinical finding.',
      },
      {
        id: 'I-4',
        claim:
          'Fundamentalist and Mormon groups converge because their conspiracies and ' +
          'identity rules perform the same function: to mark the in-group as special and ' +
          'persecuted and everyone else as less human, less learned or less holy — a ' +
          '"well-worn neural path" that survives leaving the institution.',
        statedAtSeconds: 3352.079,
        standing:
          'The closing interpretation, developed jointly with Alyssa Grenfell. An ' +
          'interpretive claim about religious communities, recorded at the speakers\' standing.',
      },
    ],

    captionArtifacts: fundamentalistConspiraciesCaptionArtifacts,

    verification: {
      performed: '2026-11-19',
      instruments: [
        'yt-dlp 2025.10.14 (python 3.9, youtube:player_client=android_vr) — info.json with timestamp, duration, title, channel, counts and a single empty "Intro" chapter',
        'English caption track en-orig (json3): 1496 text events, 10114 words, first cue 0.240 s, last cue 3587.359 s, 100% coverage of the 3589 s runtime',
        'English caption track en (json3): byte-identical to en-orig — sha256 0cd88c2d9018016e2248daf8cf974ec86956b3088b3ce00f0f4944812668c74a',
        'read_captions.py --confidence: 1496 cues, 10114 words, 100.0% coverage, 25.0 cues/min, printed ceiling 0.90',
        'Video description: the ex-fundamentalist framing, the collab with Alyssa Grenfell and the Ground News sponsorship',
      ],
      measured: {
        title: 'Every Conspiracy Theory I Was Taught as a Fundamentalist Homeschooler',
        channel: 'Genetically Modified Skeptic',
        published: '2025-08-29T16:25:11Z',
        durationSeconds: FUNDAMENTALIST_CONSPIRACIES_RUNTIME_SECONDS,
        viewCountAtVerification: 920573,
        likeCountAtVerification: 34718,
        publishedChapterCount: 1,
        captionEvents: 1496,
        captionWords: 10114,
        firstSpokenCueSeconds: 0.24,
        lastSpokenCueSeconds: 3587.359,
      },
      scope: { start: 0, end: FUNDAMENTALIST_CONSPIRACIES_RUNTIME_SECONDS },
      confidence: 0.8,
      secondAttempt: {
        recommended: true,
        why:
          'The two requested English tracks are byte-identical: YouTube served one automatic ' +
          'rendering under both names. One rendering is not a cross-check, so confidence is ' +
          'the single-source cap of 0.80, not the 0.90 printed ceiling.',
        what:
          'Acquire a published transcript, or ASR the quoted names (Abeka, Mokele-mbembe, ' +
          'Grendel/Beowulf, Bohemian Rhapsody) with a named model and record which reading ' +
          'carries the trust. No manual English subtitles were listed for this video.',
        attempted:
          'Both en-orig and en were fetched as json3 and hashed to 0cd88c2d…; they are ' +
          'byte-identical. No second attempt was made because no independent rendering or ' +
          'published transcript was found.',
      },
      limits: [
        'The en-orig and en tracks are byte-identical; all quotations are a single rendering, and the ten repairs in metadata.captionArtifacts are unconfirmed reads from context.',
        'info.json publishes only one "Intro" chapter spanning the whole runtime; the fourteen segments are editorial, bounded by cue starts or the runtime, and are not a channel chapter list.',
        'The first spoken cue starts at 0.240 s and the last at 3587.359 s; the publication zero-point is metadata-derived and no claim is keyframed into the tail.',
        'The conspiracy theories are reported as what the speaker says he was taught. Their being asserted in the source is not verification of them; the named people, groups and works are outside works.',
        'The video is sponsored (Ground News near 620 s) and promotional for Alyssa Grenfell\'s channel; that promotion is part of the source, not an endorsement.',
        'View and like counts are point-in-time reads, not properties of the work.',
        'No audio or video was archived: no ticket named this source as volatile and it is not in the archive subset.',
      ],
    },

    uncertaintyNotes: [
      'Both requested caption tracks hash to the same value, so there is exactly one rendering. The ten captionArtifacts are single-source repairs, not a second reading.',
      'Proper names garbled by ASR (Americanists, Mokele-mbembe, Grendel/Beowulf, Bohemian Rhapsody, Abeka) are repaired from context and flagged single-source; "Bruce Aroni" is left verbatim because the LDS leader\'s name is uncertain in the audio.',
      'The "Ferris Wilks / Daily Wire / oil billionaire" attribution is recorded as the speaker\'s claim at his standing; the name and the claim were not independently verified.',
      'Hillary Clinton, Barack Obama, Karl Marx, the KKK, Charlie Kirk, Ken Hovind, the Duggars, the Abeka curriculum, Alyssa Grenfell, Ground News, the named cryptids and the cited scriptures are outside works; no id is invented for them.',
      'The views, likes and the speaker\'s ages and dates are point-in-time or first-person claims, not measurements made by this vault.',
      'Significance and cultural-significance values are editorial weights for retrieval, not measurements of influence.',
    ],
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.US_HISTORY],
    },
  },
} as unknown as Universe;
