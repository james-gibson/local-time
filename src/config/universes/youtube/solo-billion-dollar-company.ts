import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * Making $$$ with Sam Altman's Solopreneurship Thesis with GPT5 — Greg Isenberg, 2025
 * (2025-08-07T18:15:08Z).
 *
 * A 24:33 solo podcast episode that takes Sam Altman's prediction of a one-person
 * billion-dollar company seriously and works out what it would take. Its argument:
 * AI-first companies replace people-managing-people with a founder managing agents;
 * the new path starts with an audience, builds a community, and automates; five
 * mega-trends (services becoming software, instant distribution, stood-on-shoulders
 * tooling, trust in small brands, high-precision ads) make it possible; code,
 * audience and capital leverage are the core skills; the org chart is the founder
 * atop LLM-managed agent teams; usage- and outcome-based pricing are the fastest
 * route; and only digital, light-regulation, network-effect businesses qualify.
 * The verdict: technically yes, the first solo unicorn likely 2026–2028, but
 * extremely rare today.
 *
 * THE WORK IS THE UNIT. Every keyframe is addressed on the video's own clock at
 * publication + offset, and every offset is an exact start of a text cue in the
 * English caption track. The ten segments are the channel's own published
 * chapters from `info.json`, gapless and verbatim.
 *
 * ONE RENDERING, NOT TWO. Both requested English tracks (en-orig and en) were
 * fetched and are byte-identical (sha256 6038c961…), so confidence is the
 * single-source cap 0.80 and `verification.secondAttempt.recommended` is true.
 * Conspicuous ASR errors are kept in `metadata.captionArtifacts` with
 * `enUs: null` — repairs from context, not an invented second reading.
 *
 * Sam Altman, OpenAI, Naval, the cited podcasts and people, and the products
 * named (IdeaBrowser, Intercom/Finn, Slack, Figma, Grammarly) are works and
 * people in their own right. They are left as prose in the keyframes and in
 * `metadata.uncertaintyNotes`; no id is invented for them.
 *
 * ID: `series:making_money_with_sam_altmans_solopreneurship_thesis:2025`, produced
 * by `createSeriesUniverseId`; `series:` because `UniverseType` has no video
 * member. Guarded by `isSeriesUniverseId` in the test, not merely by
 * `isValidUniverseId`.
 *
 * Sources: the video's own public metadata, published chapter list and English
 * caption track (`youtube:c1NYw35eIjk`), read 2026-11-19 — see
 * `metadata.verification`.
 */

export const SOLO_BILLION_DOLLAR_UNIVERSE_ID =
  'series:making_money_with_sam_altmans_solopreneurship_thesis:2025';

/** Publication instant: 2025-08-07T18:15:08Z, from `info.json` `timestamp`. */
export const SOLO_BILLION_DOLLAR_PUBLISHED = dateToNanoseconds(
  new Date('2025-08-07T18:15:08Z'),
);

/** YouTube `videoDetails.lengthSeconds`. 1473 s = 24:33. */
export const SOLO_BILLION_DOLLAR_RUNTIME_SECONDS = 1473;

/** A runtime offset on the video's own clock: publication instant + seconds. */
const at = (seconds: number): bigint =>
  SOLO_BILLION_DOLLAR_PUBLISHED + BigInt(Math.round(seconds * 1000)) * 1_000_000n;

/** The channel's published chapter list, from `info.json` `chapters[]`. */
export const soloBillionDollarChapters = [
  { id: 'intro', title: 'Intro', startSeconds: 0, endSeconds: 73 },
  { id: 'sam_altman_prediction', title: "Sam Altman's $1B Solo Founder Prediction", startSeconds: 73, endSeconds: 105 },
  { id: 'new_path_to_company', title: 'The new path to building a company', startSeconds: 105, endSeconds: 398 },
  { id: 'five_mega_trends', title: '5 mega trends enabling solo billion-dollar companies', startSeconds: 398, endSeconds: 605 },
  { id: 'how_to_get_started', title: 'How to get started as a solopreneur', startSeconds: 605, endSeconds: 733 },
  { id: 'org_structure_agents', title: 'Organizational structure with AI agents', startSeconds: 733, endSeconds: 1032 },
  { id: 'agent_framework', title: 'AI Agent Framework', startSeconds: 1032, endSeconds: 1087 },
  { id: 'pricing_framework', title: 'AI Pricing Framework', startSeconds: 1087, endSeconds: 1186 },
  { id: 'what_can_be_billion', title: 'What can be $1B Solo Business', startSeconds: 1186, endSeconds: 1306 },
  { id: 'conclusion', title: 'Conclusion on feasibility and timeline', startSeconds: 1306, endSeconds: 1473 },
] as const;

/** Single-source ASR repairs — both requested tracks were byte-identical. */
export const soloBillionDollarCaptionArtifacts = [
  {
    atSeconds: 2.08,
    enOrig: 'a oneperson soloreneur billiondoll',
    enUs: null,
    reading: 'a one-person solopreneur, billion-dollar',
    note: 'Compounded ASR tokens for the title phrase; the following cue begins "company over the next few years".',
  },
  {
    atSeconds: 70.799,
    enOrig: 'going to see 10erson companies with',
    enUs: null,
    reading: 'going to see 10-person companies with',
    note: 'Altman\'s "10-person" is fused into "10erson"; the surrounding quotation is clear.',
  },
  {
    atSeconds: 307.84,
    enOrig: 'ideabouser.com.',
    enUs: null,
    reading: 'IdeaBrowser.com.',
    note: 'The speaker\'s own product name is garbled; he links it again in the description.',
  },
  {
    atSeconds: 532.399,
    enOrig: 'and integrate with open AAI you can go',
    enUs: null,
    reading: 'and integrate with OpenAI; you can go',
    note: 'The company name is split into nonsense tokens.',
  },
  {
    atSeconds: 536.8,
    enOrig: 'You can go and use superbase. You can go',
    enUs: null,
    reading: 'You can go and use Supabase. You can go',
    note: 'The developer-tools company is lowercased and mis-transcribed.',
  },
  {
    atSeconds: 538.48,
    enOrig: 'and use netlifi. You can go and use all',
    enUs: null,
    reading: 'and use Netlify. You can go and use all',
    note: 'The developer-tools company is mis-transcribed; both names are clear from the comparison.',
  },
  {
    atSeconds: 609.6,
    enOrig: 'think it was Naval who who talked about',
    enUs: null,
    reading: 'think it was Naval who talked about',
    note: 'A stutter is preserved in the automatic track; the proper noun is correct.',
  },
  {
    atSeconds: 743.519,
    enOrig: 'from is a guy named Marada',
    enUs: null,
    reading: 'from is a guy named Marada',
    note: 'The handle is uncertain in the audio; recorded verbatim rather than guessed.',
  },
  {
    atSeconds: 1137.36,
    enOrig: 'example, uh Finn, I think, is like a a',
    enUs: null,
    reading: 'example, Fin, I think, is an',
    note: 'The Intercom product Fin is rendered as "Finn"; the company is clear from the next cue.',
  },
];

export const soloBillionDollarUniverse = {
  universeId: SOLO_BILLION_DOLLAR_UNIVERSE_ID,
  type: UniverseType.SERIES,

  identifiers: {
    primary: SOLO_BILLION_DOLLAR_UNIVERSE_ID,
    aliases: [
      "Making $$$ with Sam Altman's Solopreneurship Thesis with GPT5",
      'Greg Isenberg solo billion-dollar company episode',
      'youtube:c1NYw35eIjk',
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
      holders: ['Greg Isenberg (speaker and publisher)'],
      year: 2025,
      status: 'active',
    },
    sources: [
      'YouTube c1NYw35eIjk — public metadata (info.json: timestamp, duration, title, channel, counts, ten published chapters), read 2026-11-19',
      'Video description — the episode framing, the IdeaBrowser promotion and the podcast attribution',
      'English caption track en-orig (json3): 625 text events, 4442 words, first cue 0.480 s, last cue 1470.400 s',
      'English caption track en (json3): byte-identical to en-orig — sha256 6038c961…; one rendering, not a cross-check',
    ],
    citations_required: true,
    usage_restrictions: [
      'Do not reproduce the audio or video. This module stores metadata, offsets and short quotations only.',
      'The episode is promotional as well as explanatory: it repeatedly directs listeners to IdeaBrowser.com and the Startup Ideas Podcast. That promotion is part of the source, not an independent endorsement by this vault.',
      'Altman\'s prediction, the leverage framework attributed to Naval, and the cited people, podcasts and products are outside works at the standing of the speaker.',
    ],
  },

  layers: [
    {
      layerId: 'primary_layer',
      type: 'primary',
      epochs: {
        runtime: {
          epochId: `${SOLO_BILLION_DOLLAR_UNIVERSE_ID}:runtime`,
          startTime: SOLO_BILLION_DOLLAR_PUBLISHED,
          endTime: at(SOLO_BILLION_DOLLAR_RUNTIME_SECONDS),
          precision: TimePrecision.SECOND,
          description:
            'The 1473 s runtime from the measured upload instant. Ten gapless chapter ' +
            'segments come from the published chapter list. Every keyframe offset is a ' +
            'cue start in the caption rendering; the last text cue begins at 1470.400 s.',
        },
      },
    },
  ],

  epochs: {},

  temporalStructure: {
    segments: soloBillionDollarChapters.map((chapter) => ({
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
          'Upload instant from the video\'s own metadata: 2025-08-07T18:15:08Z. ' +
          'Runtime 1473 s with ten published chapters; 307,790 views at verification.',
      },
      {
        id: 'sam_altman_quote',
        timestamp: at(68.799),
        significance: 0.95,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'prediction'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The quoted prediction under examination: "we\'re going to see 10-person ' +
          'companies with billion-dollar valuations pretty soon".',
      },
      {
        id: 'betting_pool',
        timestamp: at(75.68),
        significance: 0.8,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['context', 'prediction'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'A "betting pool for the first year there was a one-person billion-dollar ' +
          'company" among the speaker\'s tech-CEO friends — an anecdote, not evidence.',
      },
      {
        id: 'used_to_sound_insane',
        timestamp: at(87.759),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'framing'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"That quote used to sound insane. Today it sounds like it\'s possible. ' +
          'It sounds like it could be next quarter, and I\'m going to explain why."',
      },
      {
        id: 'ai_first_company',
        timestamp: at(96.32),
        significance: 0.95,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'ai_first'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The defining contrast: an "AI first company" has "a founder that manages ' +
          'a bunch of agents that do tasks", where a traditional company is "people ' +
          'managing people".',
      },
      {
        id: 'ten_thousand_gpus',
        timestamp: at(174.319),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['prediction', 'compute'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'A second Altman line: "the future of startups could just be one person and ' +
          '10,000 GPUs" — compute standing in for the missing team.',
      },
      {
        id: 'old_way',
        timestamp: at(186.319),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['contrast', 'old_path'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The old path: "come up with an idea, write it on a napkin, then go and fund ' +
          'raise... hire people, build the product, launch... and then you\'d scale it" — ' +
          'slow and gated by wealth and geography.',
      },
      {
        id: 'new_path_audience',
        timestamp: at(229.28),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['new_path', 'audience'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The first step of the new path: "you start with an audience — a Twitter ' +
          'account, an Instagram, a TikTok" and then "vibe code something for that ' +
          'audience".',
      },
      {
        id: 'community_over_audience',
        timestamp: at(242.64),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['new_path', 'community'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"You build more of a community than an audience" — a private community or ' +
          'IRL events of "hardcore people who love your brand".',
      },
      {
        id: 'automate_and_repeat',
        timestamp: at(258.959),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['new_path', 'automation'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"You use AI agents for automating a lot of the work and then you go and ' +
          'repeat" — the loop that closes the new path.',
      },
      {
        id: 'ideabrowser_origin',
        timestamp: at(291.199),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['example', 'self'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The speaker\'s own example: IdeaBrowser "started off by me just tweeting ' +
          'startup ideas"; people liked them, so he vibe-coded the product.',
      },
      {
        id: 'three_person_team',
        timestamp: at(317.36),
        significance: 0.8,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['example', 'self'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"The IdeaBrowser team is three people including myself" — explicitly ' +
          '"not a one-person billion-dollar company", offered as a demonstration of ' +
          'the path, not its endpoint.',
      },
      {
        id: 'era_of_the_idea_guy',
        timestamp: at(346.0),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['prediction', 'framing'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Sam Altman, the co-founder of OpenAI, just said that it is the era of the ' +
          'idea guy, and he is not wrong."',
      },
      {
        id: 'leverage_eras',
        timestamp: at(421.12),
        significance: 0.8,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['context', 'history'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Each era — "1990s computer revolution, 2000s cloud revolution, mobile and ' +
          'SaaS in the 2010s" — brought more leverage: quicker launches, bigger ' +
          'outcomes from smaller teams.',
      },
      {
        id: 'five_mega_trends',
        timestamp: at(460.319),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'trends'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"I narrowed it down to these five mega trends" explaining why a billion-' +
          'dollar one-person business is now possible.',
      },
      {
        id: 'services_become_software',
        timestamp: at(465.759),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['trend', 'agents'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Trend one: "for the first time ever services are becoming software" — AI ' +
          'agents can fulfil the service, from social-media management to copywriting.',
      },
      {
        id: 'instant_distribution',
        timestamp: at(512.8),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['trend', 'distribution'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Trend two: "there\'s instant distribution" — build a following on X or ' +
          'Instagram, or "partner with existing creators".',
      },
      {
        id: 'shoulders_of_giants',
        timestamp: at(528.399),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['trend', 'tooling'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Trend three: "built on top of the shoulders of giants" — integrate OpenAI, ' +
          'Shopify, Supabase, Netlify and "access billions of dollars of R&D with a ' +
          'flick of a button".',
      },
      {
        id: 'trust_in_small_brands',
        timestamp: at(553.76),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['trend', 'brand'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Trend four: "a new trust in small brands" — "people want indie hackers and ' +
          'indie startups to win", illustrated with Pieter Levels.',
      },
      {
        id: 'high_precision_ads',
        timestamp: at(578.08),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['trend', 'advertising'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Trend five: "high precision ad platforms for the first time ever" — Meta, ' +
          'Google, TikTok and increasingly X, so "with the right offer you can access ' +
          'people and they\'ll buy your service".',
      },
      {
        id: 'three_leverages',
        timestamp: at(605.68),
        significance: 0.95,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'leverage'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The core skills: "code leverage, audience leverage and capital leverage" — ' +
          'the three forms of leverage, attributed to Naval, to refine as much as ' +
          'possible.',
      },
      {
        id: 'start_as_freelancer',
        timestamp: at(663.839),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['practice', 'getting_started'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"If I were just getting started, this is what I would do: I would start as ' +
          'a freelancer in something" — e.g. a product designer of mobile apps.',
      },
      {
        id: 'productized_service',
        timestamp: at(679.04),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['practice', 'getting_started'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Create a productized service around it": "for $5,000, I will design your ' +
          'mobile app, five screens or less".',
      },
      {
        id: 'microsass',
        timestamp: at(687.279),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['practice', 'microsass'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Then you get an idea for a micro-SaaS": one feature you can sell as ' +
          'software, "and then you have AI agents fulfill the actual outcome".',
      },
      {
        id: 'audience_commitment',
        timestamp: at(727.44),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['practice', 'audience'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"You\'re committing to the game of building an audience" in a micro-niche, ' +
          'posting every day, with AI agents able to help.',
      },
      {
        id: 'org_chart',
        timestamp: at(779.2),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['org_design', 'agents'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The org chart: "you\'re the solo founder, and then you have these LLMs that ' +
          'basically manage these agents".',
      },
      {
        id: 'agent_types',
        timestamp: at(786.32),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['org_design', 'agents'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The agent teams: engineering (code generation, testing, QA, DevOps), ' +
          'design (UI/UX, brand assets), marketing (content, SEO, SEM, social), sales ' +
          '(lead qualification, outreach, demo booking), support and data analyst.',
      },
      {
        id: 'human_in_loop_start',
        timestamp: at(818.48),
        significance: 0.8,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['org_design', 'human_in_loop'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"You might have people do some of this in the beginning" — UI/UX or design ' +
          'outsourced to a person or small agency, "but over time... all fulfilled by ' +
          'superintelligence".',
      },
      {
        id: 'agent_team_roles',
        timestamp: at(856.48),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['org_design', 'agents'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'A concrete five-agent team — "a researcher, a creator, an analyst, an ' +
          'operator and [a] strategist" — feeding a central database.',
      },
      {
        id: 'productivity_247',
        timestamp: at(874.56),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['org_design', 'productivity'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"You basically have this productivity gain that you gain from having these ' +
          'agents work for you 24/7."',
      },
      {
        id: 'overautomate_risk',
        timestamp: at(910.959),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['risk', 'quality'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The failure mode: "you overautomate something and it loses the human touch ' +
          'and then your business goes down... it might cap out at 100k or 300k"; bad ' +
          'documentation, garbage output, poor quality control and no customer contact.',
      },
      {
        id: 'dialed_in',
        timestamp: at(944.32),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'quality'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The winner has "all these things... extremely dialed — all the rules, all ' +
          'the references... the output as good if not better than a human being", with ' +
          'continuous context and rules fed to the agents.',
      },
      {
        id: 'growth_curve',
        timestamp: at(1044.48),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['timeline', 'growth'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'A Mark Lou solopreneur anecdote (1K MRR in four months, 4K in one) leads to ' +
          'the shape: "the curve might be slow and then suddenly all at once".',
      },
      {
        id: 'value_repetition_matrix',
        timestamp: at(1053.52),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['framework', 'agents'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'A 2×2 matrix for agent opportunities: y-axis value, x-axis repetition — ' +
          'the customer wanting the task done "multiple times a day".',
      },
      {
        id: 'sweet_spot',
        timestamp: at(1084.72),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['framework', 'agents'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"If it\'s high repetition and it\'s high value, then that\'s where the gold ' +
          'mine is" — the sweet spot for an agent business.',
      },
      {
        id: 'pricing_archetypes',
        timestamp: at(1119.28),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['framework', 'pricing'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The pricing question, from a Lenny\'s Podcast episode: usage-based, ' +
          'outcome-based, seat-based or a hybrid base fee plus consumption.',
      },
      {
        id: 'usage_outcome_pricing',
        timestamp: at(1166.72),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['framework', 'pricing'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"The more interesting ones are going to be something like usage-based and ' +
          'outcome-based" — seat-based "is going to be less and less common".',
      },
      {
        id: 'fastest_to_billion',
        timestamp: at(1193.6),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['framework', 'pricing'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Usage-based pricing and outcome-based pricing is the most... fastest way ' +
          'to a billion" — a new model made far easier by AI.',
      },
      {
        id: 'not_every_business',
        timestamp: at(1202.799),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['qualification', 'limits'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Not every business can be built like a one-person billion-dollar founder ' +
          'business. So let\'s talk about the ones that can and the ones that can\'t."',
      },
      {
        id: 'digital_product_yes',
        timestamp: at(1212.08),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['qualification', 'digital'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"If it\'s a digital product, yes, it can. If it\'s not a digital product, ' +
          'then you\'re going to need human labor" and it stops being a one-person ' +
          'business.',
      },
      {
        id: 'complex_b2b_needs_sales',
        timestamp: at(1228.88),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['qualification', 'sales'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'B2B SaaS or a consumer app could do it, but "a complex B2B app or B2B SaaS, ' +
          'you\'re going to need a sales team" — healthcare, defense, education, ' +
          'Fortune 500.',
      },
      {
        id: 'regulatory',
        timestamp: at(1287.039),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['qualification', 'regulation'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"If there\'s heavy regulatory requirements, you\'re going to need compliance" ' +
          '— fintech and healthcare; "if there\'s light or none, you\'re Gucci".',
      },
      {
        id: 'network_effects',
        timestamp: at(1302.48),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['qualification', 'network_effects'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"You\'re going to want to start a one-person business with network effects." ' +
          'Without them "it\'s going to be possible, but... extremely hard".',
      },
      {
        id: 'conclusion_technically_yes',
        timestamp: at(1322.48),
        significance: 0.95,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conclusion', 'verdict'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Is the $1 billion solo founder possible? Here\'s where I netted out: ' +
          'technically, yes. AI provides the leverage."',
      },
      {
        id: 'first_solo_unicorn',
        timestamp: at(1334.96),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conclusion', 'prediction'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"The first solo unicorn is probably coming in 2026 to 2028" with the right ' +
          'product, marketing, timing and person.',
      },
      {
        id: 'ten_person_sooner',
        timestamp: at(1341.12),
        significance: 0.85,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conclusion', 'prediction'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"The 10-person billion-dollar company is probably coming sooner than that" ' +
          '— "probably being built right now".',
      },
      {
        id: 'extremely_rare',
        timestamp: at(1370.08),
        significance: 0.9,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['conclusion', 'verdict'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Right now it\'s quite, extremely, extremely, extremely rare, but the fact ' +
          'that it\'s even possible is absolutely cool" and "fires me up".',
      },
      {
        id: 'create_something_cool',
        timestamp: at(1432.08),
        significance: 0.8,
        certainty: 0.8,
        precision: TimePrecision.SECOND,
        tags: ['closing', 'call_to_action'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Create something cool" — the closing call, followed by the IdeaBrowser ' +
          'and Startup Ideas Podcast promotion and "Happy building".',
      },
    ],

    windows: { strategy: 'time_based' },
  },

  metadata: {
    canonicalName: "Making $$$ with Sam Altman's Solopreneurship Thesis with GPT5",
    description:
      'A 24:33 solo podcast episode examining Sam Altman\'s prediction of a one-person ' +
      'billion-dollar company: the AI-first org chart of a founder managing agent teams, ' +
      'the audience-to-community-to-automation path, five enabling mega-trends, the three ' +
      'leverages, pricing and business-type qualifications, and a verdict of technically ' +
      'possible but extremely rare.',
    creators: ['Greg Isenberg (speaker and publisher)'],
    released: new Date('2025-08-07T18:15:08Z'),
    cultural_significance: 0.35,
    significance:
      'A widely viewed entrepreneur explainer (307,790 views at verification) that gives ' +
      'a concrete, structured account of the one-person-billion-dollar-company thesis: ' +
      'its mechanisms, its org design, its pricing models and its limits. Recorded for ' +
      'that argument and its clock.',
    tags: ['youtube', 'podcast', 'entrepreneurship', 'ai-agents', 'solopreneur', 'saas'],
    platform: 'YouTube',
    externalId: 'c1NYw35eIjk',
    externalIds: { youtubeVideoId: 'c1NYw35eIjk' },
    durationSeconds: SOLO_BILLION_DOLLAR_RUNTIME_SECONDS,
    contentType: 'video',
    metricsAsOf: '2026-11-19',

    chapters: soloBillionDollarChapters.map((chapter) => ({ ...chapter })),

    interpretations: [
      {
        id: 'I-1',
        claim:
          'An AI-first company is a founder managing agents, replacing the people-' +
          'managing-people hierarchy of a traditional company; this is the structural ' +
          'reason a one-person company could reach a billion-dollar valuation.',
        statedAtSeconds: 96.32,
        standing:
          'The speaker\'s reading of Altman\'s prediction and of how AI-first companies ' +
          'are organised. Recorded as the work\'s interpretation.',
      },
      {
        id: 'I-2',
        claim:
          'Five mega-trends make the thesis possible now: services becoming software, ' +
          'instant distribution, stood-on-shoulders tooling, trust in small brands and ' +
          'high-precision ad platforms.',
        statedAtSeconds: 460.319,
        standing:
          'A taxonomy offered by the speaker about the current business environment; ' +
          'no external measurement is marshalled here.',
      },
      {
        id: 'I-3',
        claim:
          'The practical path is audience → community → automation, built on code, ' +
          'audience and capital leverage, with usage- and outcome-based pricing as the ' +
          'fastest monetisation.',
        statedAtSeconds: 605.68,
        standing:
          'Prescriptive advice from the speaker, illustrated with his own IdeaBrowser ' +
          'example and third-party anecdotes; a recommendation, not a measured result.',
      },
      {
        id: 'I-4',
        claim:
          'Only digital, lightly regulated businesses with network effects and AI-' +
          'handleable core value can plausibly be one-person billion-dollar companies; ' +
          'the first is likely 2026–2028, but such a company is currently extremely rare.',
        statedAtSeconds: 1322.48,
        standing:
          'The episode\'s hedged conclusion — "technically yes" — with explicit ' +
          'qualifications and a timeline prediction. Recorded at the standing of the ' +
          'speaker.',
      },
    ],

    captionArtifacts: soloBillionDollarCaptionArtifacts,

    verification: {
      performed: '2026-11-19',
      instruments: [
        'yt-dlp 2025.10.14 (python 3.9, youtube:player_client=android_vr) — info.json with timestamp, duration, title, channel, counts and ten published chapters',
        'English caption track en-orig (json3): 625 text events, 4442 words, first cue 0.480 s, last cue 1470.400 s, 100% coverage of the 1473 s runtime',
        'English caption track en (json3): byte-identical to en-orig — sha256 6038c9617d9a88469580d30d906448c542c9586c69b92ccf19a654e0cf3f7be6',
        'read_captions.py --confidence with explicit --info-json: 625 cues, 4442 words, 100.0% coverage, 25.5 cues/min, printed ceiling 0.90',
        'Video description: IdeaBrowser promotion, Startup Ideas Podcast attribution and the free-episode framing',
      ],
      measured: {
        title: "Making $$$ with Sam Altman's Solopreneurship Thesis with GPT5",
        channel: 'Greg Isenberg',
        published: '2025-08-07T18:15:08Z',
        durationSeconds: SOLO_BILLION_DOLLAR_RUNTIME_SECONDS,
        viewCountAtVerification: 307790,
        likeCountAtVerification: 8426,
        publishedChapterCount: 10,
        captionEvents: 625,
        captionWords: 4442,
        firstSpokenCueSeconds: 0.48,
        lastSpokenCueSeconds: 1470.4,
      },
      scope: { start: 0, end: SOLO_BILLION_DOLLAR_RUNTIME_SECONDS },
      confidence: 0.8,
      secondAttempt: {
        recommended: true,
        why:
          'The two requested English tracks are byte-identical: YouTube served one automatic ' +
          'rendering under both names. One rendering is not a cross-check, so confidence is ' +
          'the single-source cap of 0.80, not the 0.90 printed ceiling.',
        what:
          'Acquire a published transcript of the episode, or ASR the quoted product and ' +
          'people names with a named model and record which reading carries the trust. ' +
          'No manual English subtitles were listed for this video.',
        attempted:
          'Both en-orig and en were fetched as json3 and hashed to 6038c961…; they are ' +
          'byte-identical. No second attempt was made because no independent rendering or ' +
          'published transcript was found.',
      },
      limits: [
        'The en-orig and en tracks are byte-identical; all quotations are a single rendering, and the repairs in metadata.captionArtifacts are unconfirmed reads from context.',
        'The last text cue starts at 1470.400 s; the epoch runs to 1473 s and no claim is keyframed into the tail.',
        'Altman\'s prediction and the leverage taxonomy attributed to Naval are reported at the standing of the speaker; neither was independently verified.',
        'The episode is promotional: it repeatedly directs listeners to IdeaBrowser.com and the Startup Ideas Podcast. That promotion is part of the source, not an endorsement.',
        'The 2026–2028 timeline and the "being built right now" claims are predictions, not measurements.',
        'No audio or video was archived: no ticket named this source as volatile and it is not in the archive subset.',
        'View and like counts are point-in-time reads, not properties of the work.',
      ],
    },

    uncertaintyNotes: [
      'Both requested caption tracks hash to the same value, so there is exactly one rendering. The nine captionArtifacts are single-source repairs, not a second reading.',
      'Proper names garbled by ASR (Altman, OpenAI, Supabase, Netlify, Fin) are repaired from context in captionArtifacts and flagged single-source; the "Marada" handle is left verbatim because it is uncertain in the audio.',
      'The betting-pool anecdote, the Mark Lou MRR figures and the IdeaBrowser team size are the speaker\'s claims, recorded as context rather than verified data.',
      'Sam Altman, OpenAI, Naval, Lenny\'s Podcast, Pieter Levels, the named products and the other cited people are outside works; no id is invented for them.',
      'The predictions about 2026–2028, the ten-person company and network effects are the speaker\'s forecasts, recorded as interpretation I-4.',
      'Significance and cultural-significance values are editorial weights for retrieval, not measurements of influence.',
    ],
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.GLOBAL_ECONOMY],
    },
  },
} as unknown as Universe;
