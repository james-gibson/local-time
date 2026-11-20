import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * This Is What a Digital Coup Looks Like — Carole Cadwalladr, TED2025 (2025).
 *
 * A 17:42 talk whose argument is that the concentration of data in a handful of global
 * platforms is a democratic coup already in progress; that naming it is a precondition
 * for resisting it; that the legal and online abuse aimed at journalists is a replicable
 * playbook; and that privacy, solidarity and refusal ("digital disobedience") are the
 * available countermeasures. The talk is advocacy. Its claims are recorded as the
 * work's interpretations at their own standing, never as findings about the world.
 *
 * THE WORK IS THE UNIT. Every keyframe is addressed on the video's own clock at
 * publication + offset. Offsets are cue starts from the automatic English caption
 * track; the human-authored English track is a separate rendering used to check the
 * wording, and every disagreement is kept in `metadata.captionArtifacts`.
 *
 * TIME BASE. `info.json` timestamp is 1744249364 s = 2025-04-10T01:42:44Z (UTC). The
 * description says the talk was recorded at TED2025 on 2025-04-08; that is the recording
 * date, not the upload instant. `duration` (videoDetails.lengthSeconds) is 1062 s. The
 * auto track's last text cue starts at 1045.959 s and ends at 1050.199 s; the manual
 * track's last cue starts at 1048.011 s and ends at 1054.951 s. The epoch runs to the
 * runtime, while the last addressed claim is well before it.
 *
 * ID: `series:this_is_what_a_digital_coup_looks_like:2025`, produced by
 * `createSeriesUniverseId`; `series:` because `UniverseType` has no video-talk member.
 * Guarded by `isSeriesUniverseId` in the test, not merely by `isValidUniverseId`.
 *
 * CONTAINMENT. One owner, two memberships: the talk is placed under Silicon Valley
 * (the systems it names) and the US government (the democratic order it describes).
 * No id is invented for the people, companies and events it mentions: their years and
 * owners cannot be defended from the measurement alone, so they stay as prose and the
 * uncertainty is recorded below.
 *
 * Sources: the video's own public metadata and both English caption tracks
 * (`youtube:TZOoT8AbkNE`), read 2026-11-19 — see `metadata.verification`.
 */

export const DIGITAL_COUP_UNIVERSE_ID =
  'series:this_is_what_a_digital_coup_looks_like:2025';

/** Publication instant: 2025-04-10T01:42:44Z, from `info.json` `timestamp` (epoch seconds). */
export const DIGITAL_COUP_PUBLISHED = dateToNanoseconds(
  new Date('2025-04-10T01:42:44Z'),
);

/** YouTube `videoDetails.lengthSeconds`. 1062 s = 17:42. */
export const DIGITAL_COUP_RUNTIME_SECONDS = 1062;

/** A runtime offset on the video's own clock: publication instant + seconds. */
const at = (seconds: number): bigint =>
  DIGITAL_COUP_PUBLISHED + BigInt(Math.round(seconds * 1000)) * 1_000_000n;

/**
 * The ten chapters the channel publishes, in order and gapless.
 * Read from `info.json` `chapters[]`, not from the description text, and exported so
 * the segments, the metadata copy and the test all read one list.
 */
export const digitalCoupChapters = [
  { id: 'personal_cost', title: 'The personal cost of warning', startSeconds: 0, endSeconds: 115 },
  { id: 'naming_the_coup', title: 'Naming the democratic coup', startSeconds: 115, endSeconds: 179 },
  { id: 'broligarchy', title: 'Understanding the broligarchy', startSeconds: 179, endSeconds: 249 },
  { id: 'surveillance', title: 'The surveillance business model', startSeconds: 249, endSeconds: 357 },
  { id: 'ai_information', title: 'AI and information collapse', startSeconds: 357, endSeconds: 433 },
  { id: 'legal_warfare', title: 'Legal warfare and harassment', startSeconds: 433, endSeconds: 560 },
  { id: 'solidarity', title: 'Fighting back through solidarity', startSeconds: 560, endSeconds: 635 },
  { id: 'digital_disobedience', title: 'Digital disobedience and privacy', startSeconds: 635, endSeconds: 751 },
  { id: 'reclaiming_ai', title: 'Reclaiming the future from AI', startSeconds: 751, endSeconds: 868 },
  { id: 'call_to_power', title: 'A call to reclaim our power', startSeconds: 868, endSeconds: 1062 },
] as const;

/**
 * Where the two English renderings disagree. `enOrig` is the automatic track (json3),
 * `enUs` here is the *human-authored* `en` track (json3). A reading is adopted only
 * where the manual track or the published description supports it; the automatic
 * token is kept because that is what a text search over captions would find.
 */
export const digitalCoupCaptionArtifacts = [
  {
    atSeconds: 215.72,
    enOrig: "It's brolyarchy.",
    enUs: "It's broligarchy.",
    reading: 'broligarchy',
    note:
      'The automatic track drops the initial b. The manual track and the video description ' +
      'both spell it "broligarchy"; the description glosses it as powerful tech executives ' +
      'using global platforms for geopolitical power.',
  },
  {
    atSeconds: 218.382,
    enOrig: '',
    enUs: '[Tech bros + oligarchy = broligarchy]',
    reading: 'editorial gloss in the human-authored captions; not spoken',
    note:
      'The manual track inserts a bracketed equation that has no counterpart in the audio ' +
      'or the automatic track. Recorded so nobody mistakes a captioner\'s gloss for a claim.',
  },
  {
    atSeconds: 352.68,
    enOrig: 'Germany and Instagram is the stary.',
    enUs: 'and Instagram is the Stasi.',
    reading: 'Instagram is the Stasi',
    note:
      'The automatic track mis-recognises the East German secret police. The manual track ' +
      'resolves it; the surrounding lines about Stasi files make the reading unambiguous.',
  },
  {
    atSeconds: 496.24,
    enOrig: "know it's Cardinal Risheler. If you give",
    enUs: "it's Cardinal Richelieu,",
    reading: 'Cardinal Richelieu',
    note:
      'A quoted aphorism. Only the manual track recovers the name and marks the switch ' +
      'of voice; the automatic track renders it phonetically.',
  },
  {
    atSeconds: 757.6,
    enOrig: 'been through this before. Alexe Nalli,',
    enUs: 'Alexei Navalny,',
    reading: 'Alexei Navalny',
    note: 'A proper noun in the automatic track is garbled; the manual track supplies the name.',
  },
  {
    atSeconds: 841.04,
    enOrig: 'going to turn to Sam Alman who is coming',
    enUs: 'is that I am going to turn to Sam Altman,',
    reading: 'Sam Altman',
    note:
      'The manual track resolves the name, and names him again at 934.230 s alongside ' +
      'Zuckerberg and Musk. The automatic track spells it "Alman" both times.',
  },
  {
    atSeconds: 964.56,
    enOrig: 'is Mikar Kodakovski. He was an oligarch',
    enUs: 'This is Mikhail Khodorkovsky.',
    reading: 'Mikhail Khodorkovsky',
    note: 'A proper noun recovered by the manual track; the automatic track is unusable.',
  },
];

export const digitalCoupUniverse = {
  universeId: DIGITAL_COUP_UNIVERSE_ID,
  type: UniverseType.SERIES,

  identifiers: {
    primary: DIGITAL_COUP_UNIVERSE_ID,
    aliases: [
      'This Is What a Digital Coup Looks Like | Carole Cadwalladr | TED',
      'Carole Cadwalladr TED2025 digital coup talk',
      'youtube:TZOoT8AbkNE',
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
      holders: ['TED (video publisher)', 'Carole Cadwalladr (speaker)'],
      year: 2025,
      status: 'active',
    },
    sources: [
      'YouTube TZOoT8AbkNE — public metadata (info.json: timestamp, duration, chapters, title, channel, counts), read 2026-11-19',
      'Video description — a published second source for the speaker name, the "broligarchy" spelling and the TED2025 recording date',
      'Automatic English caption track en-orig (json3): 331 text events, 2074 words, 98.5% coverage of the runtime',
      'Human-authored English subtitle track en (json3): 304 text events, 2082 words — independent wording check',
    ],
    citations_required: true,
    usage_restrictions: [
      'Do not reproduce the audio or video. This module stores metadata, offsets and short quotations only.',
      'Quotations are caption renderings. Where the two tracks disagree, both are kept in metadata.captionArtifacts.',
      'The talk is advocacy: its claims are recorded as the work\'s interpretations, not as findings about the world.',
    ],
  },

  layers: [
    {
      layerId: 'primary_layer',
      type: 'primary',
      epochs: {
        runtime: {
          epochId: `${DIGITAL_COUP_UNIVERSE_ID}:runtime`,
          startTime: DIGITAL_COUP_PUBLISHED,
          endTime: at(DIGITAL_COUP_RUNTIME_SECONDS),
          precision: TimePrecision.SECOND,
          description:
            'The 1062 s runtime from the measured upload instant. Offsets are automatic ' +
            'caption cue starts; the last text cue begins at 1045.959 s and ends at 1050.199 s ' +
            '(the manual track ends at 1054.951 s). The epoch and last segment run to the runtime.',
        },
      },
    },
  ],

  epochs: {},

  temporalStructure: {
    segments: digitalCoupChapters.map((chapter) => ({
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
          'Upload instant from the video\'s own metadata: 2025-04-10T01:42:44Z. ' +
          'Runtime 1062 s, ten published chapters. The description dates the recording to ' +
          'TED2025 on 2025-04-08 — two days before publication.',
      },
      {
        id: 'the_warning_had_a_cost',
        timestamp: at(42.079),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['personal_cost', 'legal_battle', 'context'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The 2019 TED talk "led to a three-year legal battle" ending in London\'s High ' +
          'Court: "My career, my reputation, my finances, even my home was on the line."',
      },
      {
        id: 'democracy_warning',
        timestamp: at(63.559),
        significance: 1.0,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'technology', 'warning'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Restates the earlier warning: she "didn\'t think democracy was going to survive ' +
          'the technology that you\'re building, however incredible it is".',
      },
      {
        id: 'warning_coming_true',
        timestamp: at(79.36),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'confirmation'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Pretty much everything that I was warning about is now coming true." The ' +
          'claim is the speaker\'s; the record does not adopt it as a finding.',
      },
      {
        id: 'start_with_naming',
        timestamp: at(140.2),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['method', 'naming'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'States the method of the talk: fighting back "has to start with naming it".',
      },
      {
        id: 'it_is_a_coup',
        timestamp: at(143.239),
        significance: 1.0,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'naming', 'coup'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The central naming claim: "It\'s a coup." She argues that "we can\'t fight it ' +
          'if we can\'t see it, and we can\'t see it if we don\'t name it".',
      },
      {
        id: 'international_order_collapsing',
        timestamp: at(168.76),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['geopolitics', 'naming'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"We are watching the collapse of the international order in real time" — ' +
          'offered as evidence that the Russian and American presidents now speak the same words.',
      },
      {
        id: 'putins_playbook',
        timestamp: at(198.28),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['oligarchy', 'playbook', 'analogy'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The analogy for the alignment of Silicon Valley and state power: a business ' +
          'elite makes "untold riches" in exchange for "absolute loyalty" to Putin.',
      },
      {
        id: 'broligarchy_named',
        timestamp: at(215.72),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['broligarchy', 'terminology', 'platforms'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Names the new form of power as the "broligarchy" — global platforms, not merely ' +
          'a national oligarchy. The manual track and the video description confirm the spelling.',
      },
      {
        id: 'data_is_the_prize',
        timestamp: at(251.239),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['data', 'surveillance', 'thesis'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"It\'s always the data. It\'s the crack cocaine of Silicon Valley." The claim ' +
          'that control of data, not rhetoric, is the objective of the alignment.',
      },
      {
        id: 'treasury_data_access',
        timestamp: at(258.959),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['data', 'us_treasury', 'example'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The first concrete example: Elon Musk\'s "cyber troops" going into the US ' +
          'Treasury to get access to data, "feeding AIs that are choosing who to sack".',
      },
      {
        id: 'cambridge_analyticas_scale',
        timestamp: at(278.32),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['cambridge_analytica', 'scale', 'example'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The baseline for comparison: the Cambridge Analytica story harvested 87 million ' +
          "people's Facebook data; the present access is called \"chicken feed\" by comparison.",
      },
      {
        id: 'surveillance_business_model',
        timestamp: at(327.36),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['surveillance', 'business_model', 'thesis'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"The entire business model of Silicon Valley is surveillance": data is harvested ' +
          'to sell things back to the people it describes. The architecture is compared to ' +
          'East German files; the manual track reads "Instagram is the Stasi".',
      },
      {
        id: 'politics_downstream_from_culture',
        timestamp: at(359.039),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['culture', 'bannon', 'argument'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Politics is downstream from culture", attributed to Steve Bannon, used to argue ' +
          'that power is now exercised through what appears on a phone rather than through office.',
      },
      {
        id: 'culture_is_ai_now',
        timestamp: at(392.479),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['ai', 'culture'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Culture is AI now" — the update to the Bannon formula that carries the rest ' +
          'of the argument about information.',
      },
      {
        id: 'total_information_collapse',
        timestamp: at(403.28),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['ai', 'information', 'thesis'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The claimed first AI apocalypse is already underway: "It\'s total information ' +
          'collapse" — a change to what can be known, not a future robot scenario.',
      },
      {
        id: 'politics_is_technology',
        timestamp: at(412.199),
        significance: 1.0,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'technology', 'audience'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The one takeaway she asks the audience to keep: "politics is technology now", ' +
          'and therefore the engineers in the room "can\'t look away".',
      },
      {
        id: 'playbook_replicated',
        timestamp: at(445.36),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['playbook', 'lawfare', 'press'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"What happened to me is a playbook and it\'s now coming for all sorts of other ' +
          'people", linked to Trump calling the press the enemies of the people.',
      },
      {
        id: 'law_as_a_weapon',
        timestamp: at(477.44),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['slapp', 'lawfare', 'definition'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Names the mechanism: a SLAPP, strategic litigation against public participation — ' +
          '"using law as a weapon to shut people up, not just journalists".',
      },
      {
        id: 'forensic_data_harvesting',
        timestamp: at(510.0),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['data', 'litigation', 'example'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The litigation\'s data side: forensic searches of her phone and laptop yielded ' +
          '40,000 pieces of data — messages, emails, voice memos and personal life.',
      },
      {
        id: 'digital_witch_burning',
        timestamp: at(551.0),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['harassment', 'misogyny'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The online campaign is described as "a digital witch burning", with her ' +
          '"most unforgivable crime" being "reporting while female".',
      },
      {
        id: 'thirty_thousand_supporters',
        timestamp: at(576.36),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['solidarity', 'counterexample'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The counterexample to powerlessness: "30,000 people rose up to support me" ' +
          'and contributed "almost a million pounds" to a legal defence fund.',
      },
      {
        id: 'we_are_the_cavalry',
        timestamp: at(633.2),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['solidarity', 'call_to_action'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The argument for supporting others under legal attack: "We have to have each ' +
          "other's backs right now because we are the cavalry now\".",
      },
      {
        id: 'history_is_the_chance',
        timestamp: at(671.72),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['archives', 'history'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'A practical defence: "History is our best chance of getting out of this", with ' +
          'an appeal to fund the Wayback Machine as the internet is deleted.',
      },
      {
        id: 'do_not_obey_in_advance',
        timestamp: at(678.079),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['resistance', 'timothy_snyder'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Quotes Timothy Snyder\'s "do not obey in advance" and extends it from ' +
          'authoritarianism to "techno authoritarianism".',
      },
      {
        id: 'digitally_disobey',
        timestamp: at(687.6),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['resistance', 'privacy', 'practical'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"We have to learn how to digitally disobey": refuse cookies, avoid giving a real ' +
          'name, use Signal — and, in the talk\'s examples, refuse the Yemen and Atlantic ' +
          'group-chat stories as norms that will later look unthinkable.',
      },
      {
        id: 'privacy_is_power',
        timestamp: at(729.56),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['privacy', 'thesis', 'agency'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Privacy is power. And we have more of it than we think." The epiphany that ' +
          'the moments of greatest powerlessness were moments of greatest impact.',
      },
      {
        id: 'beautiful_internet_of_the_future',
        timestamp: at(769.12),
        significance: 0.8,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['navalny', 'vision', 'movement'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Borrows Alexei Navalny\'s "beautiful Russia of the future" and proposes a ' +
          '"beautiful internet of the future free from corporate capture and data tracking".',
      },
      {
        id: 'chatgpt_ted_talk',
        timestamp: at(821.399),
        significance: 0.8,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['ai', 'copyright', 'example'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Shows ChatGPT writing a TED talk "in the style of Carole Cadwalladr" — the ' +
          'manual track names her; the automatic track renders the name phonetically.',
      },
      {
        id: 'no_consent',
        timestamp: at(851.519),
        significance: 0.95,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['copyright', 'consent', 'data_rights'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"ChatGPT has been trained on my IP, my labor, my personal data and I did not ' +
          'consent" — addressed to Sam Altman as a TED speaker.',
      },
      {
        id: 'data_rights_are_human_rights',
        timestamp: at(912.92),
        significance: 0.95,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['data_rights', 'thesis', 'copyright'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The formulation the talk leaves with the audience: what happened to journalism ' +
          '"is more than theft. It\'s a violation. Data rights are human rights."',
      },
      {
        id: 'you_are_not_gods',
        timestamp: at(937.16),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['accountability', 'oligarchy'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Direct address to Sam Altman, Mark Zuckerberg and Elon Musk: "You are not gods. ' +
          'You are men and you are careless." The manual track confirms all three names.',
      },
      {
        id: 'tyrant_destroys_the_laws',
        timestamp: at(964.56),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['oligarchy', 'history', 'example'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The historical counter-example: Mikhail Khodorkovsky was an oligarch until he ' +
          'was imprisoned in Siberia, offered as the fate of those who ally with a tyrant ' +
          'who destroys the laws that made their businesses possible.',
      },
      {
        id: 'reclaiming_my_story',
        timestamp: at(1007.72),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['agency', 'closing'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"I chose to come back to TED because I\'m reclaiming my story, my words."',
      },
      {
        id: 'we_are_not_powerless',
        timestamp: at(1027.079),
        significance: 1.0,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'closing', 'solidarity'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The closing claim: "We are not powerless" — because the 30,000 supporters ' +
          "proved it, and \"we know who we are and we know what we stand for\".",
      },
    ],

    windows: { strategy: 'time_based' },
  },

  metadata: {
    canonicalName: 'This Is What a Digital Coup Looks Like',
    description:
      'A 17:42 TED2025 talk by investigative journalist Carole Cadwalladr arguing that ' +
      'the concentration of personal data in global platforms is a democratic coup, that ' +
      'it must be named before it can be fought, that SLAPP litigation and online abuse ' +
      'are a replicable playbook, and that solidarity, archives and digital disobedience ' +
      'are the available responses. The arguments are the speaker\'s and are recorded as ' +
      'interpretations at their own standing.',
    creators: ['Carole Cadwalladr (speaker)', 'TED (publisher)'],
    released: new Date('2025-04-10T01:42:44Z'),
    cultural_significance: 0.6,
    significance:
      'A widely viewed TED2025 talk (1.79 million views at verification) that gave the term ' +
      '"broligarchy" a public platform and joined data rights, legal warfare and AI ' +
      'copyright into one argument. Recorded for that argument and its measured clock.',
    tags: ['youtube', 'ted', 'talk', 'broligarchy', 'surveillance', 'data-rights'],
    platform: 'YouTube',
    externalId: 'TZOoT8AbkNE',
    externalIds: { youtubeVideoId: 'TZOoT8AbkNE' },
    durationSeconds: DIGITAL_COUP_RUNTIME_SECONDS,
    contentType: 'video talk',
    metricsAsOf: '2026-11-19',

    /** The chapter list as published, so the segments can be checked against it. */
    chapters: digitalCoupChapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      startSeconds: chapter.startSeconds,
      endSeconds: chapter.endSeconds,
    })),

    /**
     * The talk's argument at its own standing. These are readings and advocacy, not
     * findings: the support offered is example and analogy, not survey or measurement.
     */
    interpretations: [
      {
        id: 'I-1',
        claim:
          'The alignment of global platforms and state power is a coup, and naming it is ' +
          'the precondition for resisting it.',
        statedAtSeconds: 143.239,
        standing:
          'The central claim of the talk. Supported by analogy (Putin\'s playbook) and by ' +
          'the speaker\'s account of her own case; recorded as the work\'s argument.',
      },
      {
        id: 'I-2',
        claim:
          'Data is the objective of that alignment: the business model of Silicon Valley ' +
          'is surveillance, and politics is now technology.',
        statedAtSeconds: 412.199,
        standing:
          'Argued from the Treasury data access, Cambridge Analytica and the history of ' +
          'East German files. No measurement of the claimed power is offered here.',
      },
      {
        id: 'I-3',
        claim:
          'SLAPP litigation and online harassment are a replicable playbook against ' +
          'journalists, and solidarity is an effective countermeasure.',
        statedAtSeconds: 477.44,
        standing:
          'Drawn from the speaker\'s own case and the 30,000 supporters who funded her ' +
          'defence. Recorded as her interpretation, not as a general finding about litigation.',
      },
      {
        id: 'I-4',
        claim:
          'Privacy is power and data rights are human rights: refusal and copyright are ' +
          'available forms of digital disobedience.',
        statedAtSeconds: 912.92,
        standing:
          'The talk\'s closing call to action. Normative, not empirical; carried here at ' +
          'the standing of the work that makes it.',
      },
    ],

    captionArtifacts: digitalCoupCaptionArtifacts,

    verification: {
      performed: '2026-11-19',
      instruments: [
        'yt-dlp 2025.10.14 (python 3.9, youtube:player_client=android_vr) — info.json with timestamp, duration, chapters and counts',
        'YouTube automatic caption track en-orig (json3): 331 text events, 2074 words, first cue 4.2 s, last cue 1045.959 s',
        'YouTube human-authored subtitle track en (json3): 304 text events, 2082 words, last cue 1048.011 s',
        'read_captions.py --confidence: 331 cues, 2074 words, 98.5% coverage, 18.7 cues/min, ceiling 0.90',
        'Video description: published second source for the speaker name, the "broligarchy" spelling and the 2025-04-08 recording date',
      ],
      measured: {
        title: 'This Is What a Digital Coup Looks Like | Carole Cadwalladr | TED',
        channel: 'TED',
        handle: '@TED',
        published: '2025-04-10T01:42:44Z',
        recordedAt: '2025-04-08 (per the video description)',
        durationSeconds: DIGITAL_COUP_RUNTIME_SECONDS,
        viewCountAtVerification: 1793414,
        likeCountAtVerification: 74384,
        chapterCount: 10,
        automaticCaptionEvents: 331,
        manualCaptionEvents: 304,
        lastSpokenCueSeconds: 1045.959,
      },
      scope: { start: 0, end: DIGITAL_COUP_RUNTIME_SECONDS },
      confidence: 0.9,
      secondAttempt: {
        recommended: false,
        why:
          'A human-authored English track was acquired and compared cue by cue with the ' +
          'automatic rendering; every proper noun quoted in a keyframe is confirmed by it ' +
          'or by the published description, so the single-source cap does not apply.',
        what:
          'Already done: --list-subs showed a manual en track; it was fetched as json3 ' +
          'and its disagreements recorded in metadata.captionArtifacts. A further ASR pass ' +
          'would only be needed if a quoted span remained garbled in both tracks.',
        attempted:
          'Manual en track fetched 2026-11-19; it corrected broligarchy, Stasi, Richelieu, ' +
          'Navalny, Altman and Khodorkovsky and added one bracketed editorial gloss.',
      },
      limits: [
        'The en-orig track is YouTube\'s automatic recognition of the spoken English; the en track is the human-authored English subtitle track. The 17 other languages and 157 automatic translations listed by --list-subs were not used.',
        'Cue starts differ by roughly 0.1-1 s between tracks. Offsets are automatic-track cue starts; the manual track is used for wording, and a disagreement is a finding, not an error to hide.',
        'The manual track contains a bracketed editorial gloss at 218.382 s with no spoken counterpart; it is not treated as a claim.',
        'The last text cue starts at 1045.959 s and ends at 1050.199 s in the automatic track (manual tail 1054.951 s); the file ends at 1062 s. No claim is keyframed after the last spoken cue.',
        'View and like counts are point-in-time reads, not properties of the work.',
        'The talk is advocacy. Its claims about coups, surveillance, litigation and AI are recorded as interpretations and are not verified against external sources here.',
      ],
    },

    uncertaintyNotes: [
      'One principal speaker, so there is no diarisation problem; the one quoted voice switch (Cardinal Richelieu) is marked only in the manual track.',
      'The people, companies, events and sites named in the talk are left as prose. No id is invented for them because neither a defensible year nor an owning namespace can be established from the measurement alone; the two declared containers carry what can be defended.',
      'The upload instant is UTC from info.json; the 2025-04-08 recording date in the description is a different event and is recorded separately.',
      'Significance values are editorial weights for retrieval, not measurements of influence.',
    ],
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.SILICON_VALLEY, CommonUniverseIds.US_GOVERNMENT],
    },
  },
} as unknown as Universe;
