import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * James Talarico Delivers Sermon Against Christian Nationalism — 2024
 * (published 2024-03-28T01:28:40Z; delivered 2023-10-22).
 *
 * An 18:47 sermon recorded at the speaker's home church. Its argument: there is
 * "a cancer on our religion" that must be confessed and excised; Christian
 * nationalism is the worship of power in the name of Christ and a betrayal of
 * Jesus; it was not the faith of the early church but a domestication of it
 * under Constantine; the greatest commandment, the Good Samaritan and the
 * invert-the-power kingdom make religious supremacy antithetical to the gospel;
 * the opposing force is shared power and love, not domination; and healthy
 * religion plus communal practice are the antidote.
 *
 * THE WORK IS THE UNIT. Every keyframe is addressed on the video's own clock at
 * publication + offset, and every offset is an exact start of a text cue in the
 * English caption track. The zero-point is the upload instant, not the
 * 2023-10-22 delivery date the description records; that earlier event is kept
 * as prose in `metadata.uncertaintyNotes`, not invented as a second epoch.
 *
 * NO PUBLISHED CHAPTERS. `info.json` has an empty `chapters[]`. The eight
 * segments below are editorial phases of the argument; their bounds are cue
 * starts or the runtime, and they are gapless. They are not presented as
 * chapters the channel published.
 *
 * ONE RENDERING, NOT TWO. Both requested English tracks (en-orig and en) were
 * fetched and are byte-identical (sha256 652509db…). One rendering is not a
 * cross-check, so confidence is the single-source cap 0.80 and
 * `verification.secondAttempt.recommended` is true. Conspicuous ASR errors are
 * kept in `metadata.captionArtifacts` with `enUs: null` — repairs from context,
 * not an invented second reading.
 *
 * ID: `series:james_talarico_christian_nationalism_sermon:2024`, produced by
 * `createSeriesUniverseId`; `series:` because `UniverseType` has no video
 * member. Guarded by `isSeriesUniverseId` in the test, not merely by
 * `isValidUniverseId`.
 *
 * Sources: the video's own public metadata, description and English caption
 * rendering (`youtube:Blph_2RSBno`), read 2026-11-19 — see
 * `metadata.verification`.
 */

export const TALARICO_NATIONALISM_UNIVERSE_ID =
  'series:james_talarico_christian_nationalism_sermon:2024';

/** Publication instant: 2024-03-28T01:28:40Z, from `info.json` `timestamp` (epoch seconds). */
export const TALARICO_NATIONALISM_PUBLISHED = dateToNanoseconds(
  new Date('2024-03-28T01:28:40Z'),
);

/** YouTube `videoDetails.lengthSeconds`. 1127 s = 18:47. */
export const TALARICO_NATIONALISM_RUNTIME_SECONDS = 1127;

/** A runtime offset on the video's own clock: publication instant + seconds. */
const at = (seconds: number): bigint =>
  TALARICO_NATIONALISM_PUBLISHED + BigInt(Math.round(seconds * 1000)) * 1_000_000n;

/** Editorial phases of the argument, bounded by cue starts or the runtime. */
export const talaricoNationalismPhases = [
  { id: 'witness_and_confession', title: 'Witness and confession', startSeconds: 0, endSeconds: 110.24 },
  { id: 'definition_and_indictment', title: 'Definition and indictment', startSeconds: 110.24, endSeconds: 191.08 },
  { id: 'the_political_threat', title: 'The political threat', startSeconds: 191.08, endSeconds: 234.36 },
  { id: 'constantine_and_domestication', title: 'Constantine and domestication', startSeconds: 234.36, endSeconds: 345.199 },
  { id: 'priorities_and_the_open_table', title: 'Priorities and the open table', startSeconds: 345.199, endSeconds: 455.919 },
  { id: 'commandment_and_god_is_love', title: 'The commandment and God is love', startSeconds: 455.919, endSeconds: 550.92 },
  { id: 'kingdom_inverts_power', title: 'The kingdom inverts power', startSeconds: 550.92, endSeconds: 832.399 },
  { id: 'grace_family_and_practice', title: 'Grace, family and practice', startSeconds: 832.399, endSeconds: 1127 },
] as const;

/** Single-source ASR repairs — both requested tracks were byte-identical. */
export const talaricoNationalismCaptionArtifacts = [
  {
    atSeconds: 87.759,
    enOrig: 'sometimes I hesitate for or telling someone I\'m a Christian',
    enUs: null,
    reading: 'sometimes I hesitate for fear of telling someone I\'m a Christian',
    note: 'The preposition phrase is garbled; "for fear of telling" is the recoverable reading.',
  },
  {
    atSeconds: 99.96,
    enOrig: 'is Christian nationalism and exercise it from our churches',
    enUs: null,
    reading: 'is Christian nationalism and excise it from our churches',
    note: 'The metaphor is surgical ("a cancer on our religion"), so "excise" is intended.',
  },
  {
    atSeconds: 176.68,
    enOrig: 'gun toing gay bashing science denying',
    enUs: null,
    reading: 'gun-toting, gay-bashing, science-denying',
    note: 'Hyphenation of the parallel adjectives is lost in the automatic track.',
  },
  {
    atSeconds: 208.159,
    enOrig: 'on the US Supreme Court overturned Road',
    enUs: null,
    reading: 'on the US Supreme Court overturned Roe',
    note: 'The proper noun is mis-transcribed; the next cue reads "versus Wade".',
  },
  {
    atSeconds: 330.319,
    enOrig: 'vience a religion of forgiveness became',
    enUs: null,
    reading: 'violence; a religion of forgiveness became',
    note: 'A dropped first syllable; the parallel clauses in the previous cues make it plain.',
  },
  {
    atSeconds: 520.519,
    enOrig: 'sacred the Islamic Mystic roomie said',
    enUs: null,
    reading: 'sacred the Islamic mystic Rumi said',
    note: 'The 13th-century poet\'s name is mis-transcribed.',
  },
  {
    atSeconds: 732.76,
    enOrig: 'Dorothy Sola there is only one',
    enUs: null,
    reading: 'Dorothy Sölle, "there is only one"',
    note: 'The German liberation theologian\'s name is rendered as a nonsense phrase.',
  },
  {
    atSeconds: 817.399,
    enOrig: 'mountain the grass abends the',
    enUs: null,
    reading: 'mountain, the grass bends the',
    note: 'An inserted "ab" in "bends", parallel to "water wears down the rock".',
  },
  {
    atSeconds: 1009.44,
    enOrig: 'hinduism\'s aema provides an alternative',
    enUs: null,
    reading: 'Hinduism\'s ahimsa provides an alternative',
    note: 'The Sanskrit term for nonviolence is mis-transcribed.',
  },
  {
    atSeconds: 1101.36,
    enOrig: 'opportunity to in the words of tikn Han',
    enUs: null,
    reading: 'opportunity to, in the words of Thich Nhat Hanh',
    note: 'The Vietnamese monk\'s name is mangled; the following cues read "dwell in the ultimate".',
  },
];

export const talaricoNationalismUniverse = {
  universeId: TALARICO_NATIONALISM_UNIVERSE_ID,
  type: UniverseType.SERIES,

  identifiers: {
    primary: TALARICO_NATIONALISM_UNIVERSE_ID,
    aliases: [
      'James Talarico Delivers Sermon Against Christian Nationalism',
      'Talarico Christian nationalism sermon',
      'youtube:Blph_2RSBno',
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
      holders: ['James Talarico (speaker and publisher)'],
      year: 2024,
      status: 'active',
    },
    sources: [
      'YouTube Blph_2RSBno — public metadata (info.json: timestamp, duration, title, channel, counts, empty chapters[]), read 2026-11-19',
      'Video description — the 2023-10-22 delivery date, the home-church setting and the speaker attribution',
      'English caption track en-orig (json3): 378 text events, 2099 words, first cue 22.880 s, last cue 1125.480 s',
      'English caption track en (json3): byte-identical to en-orig — sha256 652509db…; one rendering, not a cross-check',
    ],
    citations_required: true,
    usage_restrictions: [
      'Do not reproduce the audio or video. This module stores metadata, offsets and short quotations only.',
      'This is a religious and political sermon. Its historical and theological claims are the speaker\'s, recorded as interpretations, not findings of this vault.',
      'Claims about named people, courts, legislation and institutions (Constantine, Roe v. Wade, the FCA-like counts, billionaires, the Texas school system) are outside works at the standing of the speaker.',
    ],
  },

  layers: [
    {
      layerId: 'primary_layer',
      type: 'primary',
      epochs: {
        runtime: {
          epochId: `${TALARICO_NATIONALISM_UNIVERSE_ID}:runtime`,
          startTime: TALARICO_NATIONALISM_PUBLISHED,
          endTime: at(TALARICO_NATIONALISM_RUNTIME_SECONDS),
          precision: TimePrecision.SECOND,
          description:
            'The 1127 s runtime from the measured upload instant. No chapters are published; ' +
            'the eight editorial phases and every keyframe offset come from cue starts in the ' +
            'caption rendering. The last text cue begins at 1125.480 s.',
        },
      },
    },
  ],

  epochs: {},

  temporalStructure: {
    segments: talaricoNationalismPhases.map((phase) => ({
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
          'Upload instant from the video\'s own metadata: 2024-03-28T01:28:40Z. ' +
          'Runtime 1127 s with no published chapters; 2,480,366 views at verification. ' +
          'The sermon itself was delivered on 2023-10-22, per the description.',
      },
      {
        id: 'granddad_baptist_preacher',
        timestamp: at(67.88),
        significance: 0.8,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['witness', 'family'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Establishes the speaker\'s standing to preach: "my granddad was a Baptist preacher", ' +
          'a member of this church since age two, now in seminary.',
      },
      {
        id: 'faith_means_more',
        timestamp: at(80.04),
        significance: 0.8,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['witness', 'faith'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"My faith means more to me than anything" — the personal ground from which the ' +
          'critique of Christian nationalism is made.',
      },
      {
        id: 'hesitation_to_say_Christian',
        timestamp: at(87.759),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['witness', 'thesis'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Sometimes I hesitate for [fear of] telling someone I\'m a Christian" — the ' +
          'estrangement the sermon names at the outset.',
      },
      {
        id: 'cancer_on_our_religion',
        timestamp: at(92.159),
        significance: 0.95,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'definition'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The controlling metaphor: "there is a cancer on our religion until we confess ' +
          'the sin that is Christian nationalism and [excise] it from our churches".',
      },
      {
        id: 'confess_the_sin',
        timestamp: at(96.52),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'confession'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The prescribed response is confession and excision, not merely denunciation — ' +
          '"until we confess the sin that is Christian nationalism".',
      },
      {
        id: 'nothing_Christian_about_it',
        timestamp: at(110.24),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['definition'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"There is nothing Christian about Christian nationalism" — the definitional ' +
          'claim that opens the indictment.',
      },
      {
        id: 'worship_of_power',
        timestamp: at(114.84),
        significance: 0.95,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['definition', 'power'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The core definition: it is "the worship of power — social power, economic power, ' +
          'political power — in the name of Christ".',
      },
      {
        id: 'betrayal_of_Jesus',
        timestamp: at(126.759),
        significance: 0.95,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['definition', 'theology'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"It is a betrayal of Jesus of Nazareth, who told us we would know them by their ' +
          'fruits." The moral warrant for the whole critique.',
      },
      {
        id: 'universal_vs_sectarian',
        timestamp: at(150.64),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['definition', 'contrast'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The parallel contrast: Jesus "started a universal movement based on mutual love"; ' +
          'Christian nationalism is "a sectarian movement based on mutual hate".',
      },
      {
        id: 'co_opted_the_son_of_god',
        timestamp: at(168.8),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['indictment'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"They have co-opted the Son of God" and turned "this humble rabbi into a ' +
          'gun-toting, gay-bashing, science-denying, money-loving, fear-mongering fascist".',
      },
      {
        id: 'gun_toting_fascist',
        timestamp: at(176.68),
        significance: 0.8,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['indictment', 'rhetoric'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The catalogue of invented attributes — "gun toing gay bashing science denying / ' +
          'money loving fear-mongering fascist" — kept as the speaker\'s rhetoric.',
      },
      {
        id: 'incumbent_to_confront',
        timestamp: at(183.799),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'call_to_action'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"It is incumbent upon all Christians to confront it and denounce it."',
      },
      {
        id: 'on_the_rise',
        timestamp: at(191.08),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['political_threat', 'claim'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Christian nationalism is on the rise" — the turn from definition to ' +
          'contemporary political evidence.',
      },
      {
        id: 'stormed_the_capital',
        timestamp: at(196.08),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['political_threat', 'historical_claim'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Cites "two years ago Christian nationalists stormed the US Capitol, killing ' +
          'police officers while carrying crosses and signs reading \'Jesus saves\'". ' +
          'Recorded at the standing of the speaker.',
      },
      {
        id: 'overturned_Roe',
        timestamp: at(208.159),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['political_threat', 'historical_claim'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The Supreme Court "overturned Roe versus Wade", allowing states to outlaw ' +
          'abortion even in cases of rape and incest. An outside institution and case.',
      },
      {
        id: 'billionaires_schools',
        timestamp: at(222.319),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['political_threat', 'claim'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Two Christian nationalist billionaires are trying to replace public schools ' +
          'in Texas with private Christian schooling." Unnamed people and institutions.',
      },
      {
        id: 'closer_than_we_think',
        timestamp: at(229.2),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['political_threat', 'thesis'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"We are closer than we think to a Christian theocracy" — the conclusion of the ' +
          'political-threat sequence and the pivot to the historical question.',
      },
      {
        id: 'first_followers_the_way',
        timestamp: at(234.36),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['history', 'early_church'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"The first followers of Jesus didn\'t call themselves Christians; they called ' +
          'themselves the way" — the historical claim that opens the Constantine argument.',
      },
      {
        id: 'revolutionary_early_church',
        timestamp: at(250.959),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['history', 'early_church'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"The early church was a revolutionary community built on radical love, a ' +
          'peculiar people who shared all their possessions".',
      },
      {
        id: 'shared_all_possessions',
        timestamp: at(257.919),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['history', 'early_church'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'They "refused to participate in the economy, the military or the culture" and ' +
          'were "persecuted for turning the world upside down".',
      },
      {
        id: 'Constantine',
        timestamp: at(279.8),
        significance: 0.95,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['history', 'Constantine', 'historical_claim'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Three hundred years after Jesus was executed by the Roman Empire, Emperor ' +
          'Constantine made Christianity the official state religion of that very same ' +
          'Empire." An outside historical claim, at the standing of the speaker.',
      },
      {
        id: 'first_Christian_nationalist',
        timestamp: at(285.52),
        significance: 0.95,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['history', 'thesis'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Constantine was the first Christian nationalist" — the hinge of the whole ' +
          'historical argument.',
      },
      {
        id: 'domesticated_religion',
        timestamp: at(292.72),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['history', 'domestication'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Ever since, the powers that be have been taming Christianity, domesticating it, ' +
          'diluting it into something more palatable — pro-war, pro-wealth, pro-white-supremacy."',
      },
      {
        id: 'tranquilized_weaponized',
        timestamp: at(312.199),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['history', 'domestication'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The original "countercultural movement became a tranquilized, privatized, ' +
          'weaponized religion — the official sponsor of Western civilization".',
      },
      {
        id: 'religion_of_sharing_to_greed',
        timestamp: at(320.56),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['history', 'contrast'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The transformations: "a religion of sharing became a religion of greed; a ' +
          'religion of peace became a religion of violence; a religion of forgiveness ' +
          'became a religion of judgment".',
      },
      {
        id: 'obsess_over_private_parts',
        timestamp: at(345.199),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['priorities', 'critique'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Today Christian nationalists obsess over people\'s private parts while the ' +
          'planet burns" — the inversion of priorities.',
      },
      {
        id: 'eight_men_own',
        timestamp: at(351.44),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['priorities', 'claim'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Eight men own as much wealth as 3.6 billion people" while "Christian ' +
          'nationalists are boycotting Barbie". A point-in-time factual claim.',
      },
      {
        id: 'bible_doesnt_mention',
        timestamp: at(361.56),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['priorities', 'scripture'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"The Bible doesn\'t mention abortion or gay marriage, but it goes on and on ' +
          'about forgiving debt, liberating the poor and healing the sick." A theological ' +
          'claim about a separate work.',
      },
      {
        id: 'not_a_Christian_nation',
        timestamp: at(374.639),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['priorities', 'claim'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Christian nationalists like to say this is a Christian nation. Not only is ' +
          'that historically inaccurate, not only is that theologically blasphemous, but ' +
          'it\'s also just not true."',
      },
      {
        id: 'forgive_student_debt',
        timestamp: at(387.0),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['priorities', 'counterfactual'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"If this was truly a Christian nation, we would forgive student debt" — the ' +
          'first of a run of counterfactuals testing the claim.',
      },
      {
        id: 'love_lgbtq_neighbors',
        timestamp: at(397.12),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['priorities', 'counterfactual'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"If this was truly a Christian nation, we would love all of our LGBTQ ' +
          'neighbors" and ensure every child is "housed, fed, clothed, educated and insured".',
      },
      {
        id: 'open_table',
        timestamp: at(415.879),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['theology', 'inclusion'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"The table of fellowship is open to everybody, including our Buddhist, Hindu, ' +
          'Jewish, Muslim, Sikh and atheist neighbors" — and so it would never be made a ' +
          'Christian nation.',
      },
      {
        id: 'multi_racial_democracy',
        timestamp: at(435.24),
        significance: 0.95,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'democracy'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"The closest thing we have to the kingdom of heaven is a multi-racial, ' +
          'multicultural democracy where power is truly shared among all people."',
      },
      {
        id: 'threat_to_gospel',
        timestamp: at(448.16),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'conclusion'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Christian nationalism is not only a threat to the American experiment in ' +
          'democracy, it\'s also a threat to the gospel of Jesus Christ" — the double ' +
          'threat that closes the first half.',
      },
      {
        id: 'two_commandments',
        timestamp: at(458.879),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['theology', 'scripture'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Asked for the greatest commandment, "he cheats and gives two, that he says ' +
          'are related" — love of God and love of neighbour.',
      },
      {
        id: 'love_God_love_neighbor',
        timestamp: at(468.159),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['theology', 'scripture'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"The first is to love God; the second, he said, is like it: love thy neighbor ' +
          'as thyself." The likeness is that recognising the divine image in oneself ' +
          'compels recognising it in the neighbour.',
      },
      {
        id: 'good_Samaritan',
        timestamp: at(489.72),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['theology', 'scripture'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'In the Good Samaritan, "Jesus specifically defines neighbor as someone different ' +
          'from us, racially, economically, politically, religiously".',
      },
      {
        id: 'God_loves_diversity',
        timestamp: at(503.44),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['theology', 'inclusion'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"God loves diversity. God loves variety." The diversity of peoples and ' +
          'traditions is offered as evidence, not an accident.',
      },
      {
        id: 'many_pathways',
        timestamp: at(516.159),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['theology', 'religious_pluralism'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"There are so many pathways to the sacred" — citing the Islamic mystic Rumi.',
      },
      {
        id: 'every_religion_has_love',
        timestamp: at(523.68),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['theology', 'religious_pluralism'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Every religion has love, but love has no religion. God is so much bigger than ' +
          'our human categories."',
      },
      {
        id: 'God_is_a_verb',
        timestamp: at(536.2),
        significance: 0.95,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['theology', 'thesis'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"God is not a noun at all. God is a verb. God is not a being; God is being ' +
          'itself. God is love." The theological pivot into the kingdom argument.',
      },
      {
        id: 'religious_supremacy',
        timestamp: at(573.64),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['theology', 'thesis'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Religious supremacy is antithetical to the gospel of Jesus Christ" — the ' +
          'direct theological verdict on Christian nationalism.',
      },
      {
        id: 'not_establish_a_nation',
        timestamp: at(583.64),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['theology', 'kingdom'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Jesus didn\'t come to establish a Christian nation. He came to reveal ' +
          'ultimate reality, which he called the kingdom of God."',
      },
      {
        id: 'sits_at_a_table',
        timestamp: at(596.88),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['theology', 'kingdom', 'contrast'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Instead of a throne, Jesus sits at a table; instead of a warhorse, he rides ' +
          'a donkey; instead of a sword, he picks up a cross."',
      },
      {
        id: 'inverts_power',
        timestamp: at(613.56),
        significance: 0.95,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'power'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"The kingdom of God inverts the power dynamics of all the kingdoms in the ' +
          'world: true strength is vulnerability, true status is equality, true wealth ' +
          'is sharing."',
      },
      {
        id: 'mustard_seed_faith',
        timestamp: at(641.68),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['theology', 'faith'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Have the faith of a mustard seed, trusting that by living and dying for ' +
          'love we give birth to a better world" — not by force but by faith.',
      },
      {
        id: 'idols_power',
        timestamp: at(668.44),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['theology', 'idolatry'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The things people trust besides God are "idols — money, status, and the most ' +
          'dangerous idol of all, power", which Jesus rejected when offered the kingdoms ' +
          'of the world.',
      },
      {
        id: 'shared_power_or_domination',
        timestamp: at(737.639),
        significance: 0.95,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'power'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Citing Dorothy Sölle: "there is only one legitimation of power, and that is to ' +
          'share it with others. Power that is not shared, not transformed into love, is ' +
          'pure domination and oppression."',
      },
      {
        id: 'opposite_of_faith_is_control',
        timestamp: at(763.839),
        significance: 0.95,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'faith'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"The opposite of faith is not doubt — doubt is a healthy part of any faith — ' +
          'the opposite of faith is control." The diagnostic claim of the sermon.',
      },
      {
        id: 'trust_domination',
        timestamp: at(793.36),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'power'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Christian nationalists trust domination because they think domination is what ' +
          'works, but Jesus revealed that the true power of the universe is not domination ' +
          'but love."',
      },
      {
        id: 'soft_overcomes_hard',
        timestamp: at(808.04),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'daoism'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'In Daoism "the soft overcomes the hard": water wears down rock, wind takes out ' +
          'mountains, grass bends concrete, "the meek inherit the earth".',
      },
      {
        id: 'love_always_wins',
        timestamp: at(828.519),
        significance: 0.95,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'conclusion'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Violence may win in the short run, but in the end love always wins" — the ' +
          'closing claim of the power argument.',
      },
      {
        id: 'kingdom_in_plain_sight',
        timestamp: at(835.519),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['theology', 'kingdom'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"The kingdom of God is in our midst, hiding in plain sight. Heaven is already ' +
          'here, inside of us, above us, all around us."',
      },
      {
        id: 'grandpa_talarico',
        timestamp: at(851.36),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['witness', 'family'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'On his father\'s side, "grandpa Talarico never went to church, but he was one ' +
          'of the most generous, compassionate, moral people I\'ve ever met."',
      },
      {
        id: 'great_outdoors',
        timestamp: at(886.8),
        significance: 0.8,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['nature', 'theology'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'His grandfather called the Texas hill-country walks "the best chance to see ' +
          'God" — the turn to the natural world as evidence.',
      },
      {
        id: 'sharing_superpower',
        timestamp: at(894.639),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['nature', 'science'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Biologists say everything in nature is connected; anthropologists say "our ' +
          'ability to share and cooperate is humanity\'s superpower".',
      },
      {
        id: 'universe_aware_of_itself',
        timestamp: at(936.399),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['nature', 'theology'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"We are the universe becoming aware of itself, as children of God, children ' +
          'of the cosmos. We are loved unconditionally, indiscriminately, infinitely."',
      },
      {
        id: 'loved_unconditionally',
        timestamp: at(945.8),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['theology', 'grace'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"No achievement can add to it, no mistake can take from it, no amount of ' +
          'church-going or church-missing can change it" — "truly deserving of the title ' +
          'good news".',
      },
      {
        id: 'made_by_love',
        timestamp: at(972.44),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['theology', 'grace'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Made by love, with love, to love — I call that love God. You may use a ' +
          'different word, and that\'s okay: there are a thousand ways to kneel and kiss ' +
          'the ground."',
      },
      {
        id: 'cure_with_healthy_religion',
        timestamp: at(990.399),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['antidote', 'religious_pluralism'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"We can cure the disease of Christian nationalism; we can protect against the ' +
          'virus of religious extremism with healthy religion."',
      },
      {
        id: 'ahimsa_meditation_sabbath',
        timestamp: at(1009.44),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['antidote', 'religious_pluralism'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The great traditions as antidotes: "Hinduism\'s ahimsa ... Buddhist meditation ' +
          '... Judaism\'s Sabbath ... native American traditions" against violence, ' +
          'attention-abuse, capitalism and ecological extraction.',
      },
      {
        id: 'faith_communities',
        timestamp: at(1044.799),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['antidote', 'practice'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"That\'s why we need faith communities like this one", with "stories and ' +
          'traditions and practices that heal our soul and transform our mind".',
      },
      {
        id: 'tuning_our_hearts',
        timestamp: at(1068.919),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['practice', 'liturgy'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The weekly liturgy — "we say the prayers, sing the hymns, sprinkle the water, ' +
          'eat the bread, drink the wine" — is "tuning our hearts".',
      },
      {
        id: 'gym_for_the_heart',
        timestamp: at(1087.799),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['practice', 'formation'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Compassion takes practice; "things like love, peace and hope require strength ' +
          'training — a gym for the heart".',
      },
      {
        id: 'invitation_to_reflection',
        timestamp: at(1118.559),
        significance: 0.8,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['closing', 'liturgy'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"I invite you now to your own reflection on these words" — the last text cue ' +
          'before the 1125.480 s cue and the 1127 s runtime end.',
      },
    ],

    windows: { strategy: 'time_based' },
  },

  metadata: {
    canonicalName: 'James Talarico Delivers Sermon Against Christian Nationalism',
    description:
      'An 18:47 sermon at the speaker\'s home church arguing that Christian nationalism ' +
      'is a worship of power and a betrayal of Jesus, a domestication of the early church ' +
      'under Constantine, and antithetical to the love-centred, power-inverting kingdom; ' +
      'healthy religion and communal practice are offered as the antidote.',
    creators: ['James Talarico (speaker and publisher)'],
    released: new Date('2024-03-28T01:28:40Z'),
    cultural_significance: 0.5,
    significance:
      'A widely viewed sermon (2,480,366 views at verification) that gives a ' +
      'theologically argued account of Christian nationalism — its definition, its ' +
      'Constantinian history, its contradiction of the greatest commandment, and a ' +
      'pluralistic antidote. Recorded for that argument and its clock.',
    tags: ['youtube', 'sermon', 'christian-nationalism', 'religion', 'democracy', 'theology'],
    platform: 'YouTube',
    externalId: 'Blph_2RSBno',
    externalIds: { youtubeVideoId: 'Blph_2RSBno' },
    durationSeconds: TALARICO_NATIONALISM_RUNTIME_SECONDS,
    contentType: 'video',
    metricsAsOf: '2026-11-19',

    phases: talaricoNationalismPhases.map((phase) => ({ ...phase })),

    interpretations: [
      {
        id: 'I-1',
        claim:
          'Christian nationalism is the worship of social, economic and political power in ' +
          'the name of Christ and a betrayal of Jesus — "a cancer on our religion" to be ' +
          'confessed and excised.',
        statedAtSeconds: 92.159,
        standing:
          'The speaker\'s theological definition and controlling metaphor. Recorded as the ' +
          'work\'s interpretation, not as an independent finding about the religion.',
      },
      {
        id: 'I-2',
        claim:
          'The faith of the early church was revolutionary and communal; Constantine made ' +
          'Christianity a state religion and "the first Christian nationalist", after which ' +
          'it was tamed into a pro-war, pro-wealth, pro-white-supremacy religion.',
        statedAtSeconds: 285.52,
        standing:
          'A historical claim made in the sermon about the early church, Constantine and ' +
          'later institutions. Those are outside works; no id is invented for them.',
      },
      {
        id: 'I-3',
        claim:
          'Religious supremacy is antithetical to the gospel: the greatest commandment, ' +
          'the Good Samaritan and the kingdom that gives a table instead of a throne make ' +
          'a multi-racial, multi-faith democracy the closest analogue to the kingdom of God.',
        statedAtSeconds: 435.24,
        standing:
          'A theological argument from scripture and the speaker\'s pluralistic reading, ' +
          'recorded at the standing of the sermon.',
      },
      {
        id: 'I-4',
        claim:
          'Power is legitimate only when shared and transformed into love; unshared power ' +
          'is domination, and the opposite of faith is control. Love, not domination, is ' +
          'the true power of the universe.',
        statedAtSeconds: 763.839,
        standing:
          'The central ethical thesis, argued from the temptation in the wilderness, ' +
          'the disciples\' question, Dorothy Sölle and Daoism. All cited works remain prose.',
      },
      {
        id: 'I-5',
        claim:
          'Healthy religion and communal spiritual practice — the great traditions, ' +
          'faith communities, liturgy and the formation of compassion — are the antidote ' +
          'to Christian nationalism and religious extremism.',
        statedAtSeconds: 990.399,
        standing:
          'The pastoral conclusion of the sermon; a prescription at the standing of the ' +
          'speaker, not a measured result.',
      },
    ],

    captionArtifacts: talaricoNationalismCaptionArtifacts,

    verification: {
      performed: '2026-11-19',
      instruments: [
        'yt-dlp 2025.10.14 (python 3.9, youtube:player_client=android_vr) — info.json with timestamp, duration, title, channel, counts and empty chapters[]',
        'English caption track en-orig (json3): 378 text events, 2099 words, first cue 22.880 s, last cue 1125.480 s',
        'English caption track en (json3): byte-identical to en-orig — sha256 652509dbea3bf0cc4f375f7f123f903aaf0283663becdb935ba79fd531f8cbd6',
        'read_captions.py — 378 cues, 2099 words, across the full 1127 s runtime',
        'Video description: delivered 2023-10-22 at the speaker\'s home church; published 2024-03-28',
      ],
      measured: {
        title: 'James Talarico Delivers Sermon Against Christian Nationalism',
        channel: 'James Talarico',
        published: '2024-03-28T01:28:40Z',
        delivered: '2023-10-22',
        durationSeconds: TALARICO_NATIONALISM_RUNTIME_SECONDS,
        viewCountAtVerification: 2480366,
        likeCountAtVerification: 116665,
        publishedChapterCount: 0,
        captionEvents: 378,
        captionWords: 2099,
        firstSpokenCueSeconds: 22.88,
        lastSpokenCueSeconds: 1125.48,
      },
      scope: { start: 0, end: TALARICO_NATIONALISM_RUNTIME_SECONDS },
      confidence: 0.8,
      secondAttempt: {
        recommended: true,
        why:
          'The two requested English tracks are byte-identical: YouTube served one automatic ' +
          'rendering under both names. One rendering is not a cross-check, so confidence is ' +
          'the single-source cap of 0.80, not the 0.90 printed ceiling.',
        what:
          'Acquire a published transcript of the 2023-10-22 sermon, or ASR the quoted spans ' +
          'with a named model and record which reading carries the trust. No manual English ' +
          'subtitles were listed for this video.',
        attempted:
          'Both en-orig and en were fetched as json3 and hashed to 652509db…; they are ' +
          'byte-identical. No second attempt was made because no independent rendering or ' +
          'published transcript was found.',
      },
      limits: [
        'The en-orig and en tracks are byte-identical; all quotations are a single rendering, and the repairs in metadata.captionArtifacts are unconfirmed reads from context.',
        'The first spoken cue begins at 22.880 s and the last at 1125.480 s; the epoch runs from 0 to 1127 s and no claim is keyframed from the silent head beyond the zero-point.',
        'The video was published on 2024-03-28 but the sermon was delivered on 2023-10-22. The clock is pinned to the upload instant; the delivery date is recorded as prose, not a separate epoch.',
        'The eight segments are editorial phases, not published chapters: info.json carries an empty chapters[].',
        'Constantine, the early church, Roe v. Wade, the Supreme Court, the two billionaires, the Texas school system, Rumi, Dorothy Sölle, Thich Nhat Hanh and the cited traditions and scriptures are outside works; their claims are the speaker\'s and are not independently verified here.',
        'No audio or video was archived: no ticket named this source as volatile and it is not in the archive subset.',
        'View and like counts are point-in-time reads, not properties of the work.',
      ],
    },

    uncertaintyNotes: [
      'The description gives the 2023-10-22 delivery date; info.json timestamp 1711589320 gives the 2024-03-28T01:28:40Z upload. Both are recorded; only the upload instant anchors the clock.',
      'Both requested caption tracks hash to the same value, so there is exactly one rendering. The ten captionArtifacts are single-source repairs, not a second reading.',
      'Proper names garbled by ASR (Roe, Rumi, Dorothy Sölle, ahimsa, Thich Nhat Hanh, Talarico) are repaired from context in captionArtifacts and flagged single-source.',
      'All historical, scriptural and political claims — the Constantine narrative, the "eight men" wealth figure, the counterfactuals about a Christian nation — are the speaker\'s characterisations, not findings of this vault.',
      'The multi-faith antidote and the "kingdom of heaven as democracy" line are theological positions of the sermon, recorded as interpretations I-3 and I-5.',
      'Significance and cultural-significance values are editorial weights for retrieval, not measurements of influence.',
    ],
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.US_GOVERNANCE],
    },
  },
} as unknown as Universe;
