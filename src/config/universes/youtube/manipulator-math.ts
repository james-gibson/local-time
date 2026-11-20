import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * The Manipulator's Sneaky Math to Beat Chaos — braintruffle, 2025 (2025-04-24T14:25:42Z).
 *
 * A 31:25 educational video that builds a toy market simulator and uses it to
 * demonstrate trade-based manipulation. Its argument: a fair market of random
 * buyers and sellers is not predictable, so the only way to win reliably is to
 * take control of the price rather than predict it; self-trading at overlapping
 * buy and sell orders gives a manipulator monopoly power over pricing; the
 * resulting pump-and-dump works because traders anchor on recent prices; and
 * the whole cycle can be hidden in the noise of ordinary activity, though
 * order-curve irregularities leave a statistical trace.
 *
 * THE WORK IS THE UNIT. Every keyframe is addressed on the video's own clock at
 * publication + offset, and every offset is an exact start of a text cue in the
 * automatic English track. The six segments are the channel's own published
 * chapters, not editorial phases — this video has a real chapter list.
 *
 * TWO TRACKS, ONE REAL CROSS-CHECK. `en-orig` (768 events, 4844 words) is the
 * automatic rendering; `en` (591 events, 4809 words) is a human-authored and
 * corrected transcript with punctuation and quoted terms. Their sha256 hashes
 * differ and their readings diverge in useful ways (`a not to their work` vs
 * `a nod to their work`, `brainuffle` vs `braintruffle`). Confidence is the
 * script's 0.90 ceiling; no second ASR attempt is needed.
 *
 * THE FOREX CASE, THE FCA AND THE BANKS it cites are works and institutions in
 * their own right. They are left as prose in the keyframes and in
 * `metadata.uncertaintyNotes`; no id is invented for them, and the video's
 * claims about them are recorded at the standing of the speaker.
 *
 * ID: `series:the_manipulators_sneaky_math_to_beat_chaos:2025`, produced by
 * `createSeriesUniverseId`; `series:` because `UniverseType` has no video
 * member. Guarded by `isSeriesUniverseId` in the test, not merely by
 * `isValidUniverseId`.
 *
 * Sources: the video's own public metadata, published chapter list and English
 * caption tracks (`youtube:-jF9gW2r_bk`), read 2026-11-19 — see
 * `metadata.verification`.
 */

export const MANIPULATOR_MATH_UNIVERSE_ID =
  'series:the_manipulators_sneaky_math_to_beat_chaos:2025';

/** Publication instant: 2025-04-24T14:25:42Z, from `info.json` `timestamp`. */
export const MANIPULATOR_MATH_PUBLISHED = dateToNanoseconds(
  new Date('2025-04-24T14:25:42Z'),
);

/** YouTube `videoDetails.lengthSeconds`. 1885 s = 31:25. */
export const MANIPULATOR_MATH_RUNTIME_SECONDS = 1885;

/** A runtime offset on the video's own clock: publication instant + seconds. */
const at = (seconds: number): bigint =>
  MANIPULATOR_MATH_PUBLISHED + BigInt(Math.round(seconds * 1000)) * 1_000_000n;

/** The channel's published chapter list, from `info.json` `chapters[]`. */
export const manipulatorMathChapters = [
  { id: 'forex_case', title: 'FOREX Case', startSeconds: 0, endSeconds: 145 },
  { id: 'market_simulator', title: 'Market Simulator', startSeconds: 145, endSeconds: 507 },
  { id: 'random_dynamics', title: 'Random Dynamics', startSeconds: 507, endSeconds: 939 },
  { id: 'self_trading_price_setting', title: 'Self-Trading & Price-Setting', startSeconds: 939, endSeconds: 1228 },
  { id: 'manipulation_cycle', title: 'Manipulation Cycle', startSeconds: 1228, endSeconds: 1462 },
  { id: 'hidden_in_plain_sight', title: 'Hidden in Plain Sight', startSeconds: 1462, endSeconds: 1885 },
] as const;

/** Divergences between the automatic and the human-authored English tracks. */
export const manipulatorMathCaptionArtifacts = [
  {
    atSeconds: 595.519,
    enOrig: 'what is known as a Gaussian random walk with an expected price change of zero',
    enUs: 'what\'s known as a "Gaussian random walk,"',
    reading: 'Gaussian random walk',
    note: 'The human track quotes and punctuates the term; the automatic track paraphrases it.',
  },
  {
    atSeconds: 1037.679,
    enOrig: 'sell the same number of shares right back to ourselves. This practice is called self-trading',
    enUs: 'right back, to ourselves. This practice is called self-trading.',
    reading: 'self-trading',
    note: 'Both name the term, but only the human track punctuates the definition as a sentence.',
  },
  {
    atSeconds: 1160.14,
    enOrig: 'This is called monopoly power in the stock market',
    enUs: 'This is called monopoly power in a stock market',
    reading: 'monopoly power',
    note: 'A single article differs. The term itself is stable across both tracks.',
  },
  {
    atSeconds: 1333.6,
    enOrig: 'classical pump and dump scheme',
    enUs: 'classic "pump-and-dump" scheme',
    reading: 'classic "pump-and-dump" scheme',
    note: 'The human track hyphenates and quotes the established term; the automatic track does not.',
  },
  {
    atSeconds: 1437.919,
    enOrig: 'still easy to spot and exchangers could simply ignore these orders',
    enUs: 'still easy to spot. And exchanges could simply ignore these orders',
    reading: 'exchanges',
    note: 'The automatic track invents "exchangers"; the human track reads the institution correctly.',
  },
  {
    atSeconds: 1503.52,
    enOrig: 'we can exemplarely standardize the curves to fit a 0 to 100% volume range',
    enUs: 'we can exemplarily standardize the curves',
    reading: 'exemplarily standardize',
    note: 'The automatic track garbles the adverb; the human track recovers it.',
  },
  {
    atSeconds: 1569.84,
    enOrig: 'you can loosely think of a market as having a money temperature',
    enUs: 'you can loosely think of a market as having a \'money temperature,\'',
    reading: "'money temperature'",
    note: 'The human track quotes the coined term, marking it as the speaker\'s metaphor.',
  },
  {
    atSeconds: 1797.279,
    enOrig: 'this video is a not to their work',
    enUs: 'this video is a nod to their work',
    reading: 'a nod to their work',
    note: 'A true homophone error in the automatic track, corrected by the human track.',
  },
  {
    atSeconds: 1869.52,
    enOrig: 'visit brilliant.org/brainuffle',
    enUs: 'brilliant.org/braintruffle/',
    reading: 'brilliant.org/braintruffle/',
    note: 'The sponsor path is garbled in the automatic track; the human track agrees with the channel handle.',
  },
];

export const manipulatorMathUniverse = {
  universeId: MANIPULATOR_MATH_UNIVERSE_ID,
  type: UniverseType.SERIES,

  identifiers: {
    primary: MANIPULATOR_MATH_UNIVERSE_ID,
    aliases: [
      'The Manipulator\'s Sneaky Math to Beat Chaos',
      'braintruffle market manipulation explainer',
      'youtube:-jF9gW2r_bk',
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
      holders: ['braintruffle (video publisher)', 'Torsten (speaker, per the description)'],
      year: 2025,
      status: 'active',
    },
    sources: [
      'YouTube -jF9gW2r_bk — public metadata (info.json: timestamp, duration, title, channel, counts, six published chapters), read 2026-11-19',
      'Video description — published timetable, sponsor disclosure, FCA references and the educational/not-financial-advice disclaimer',
      'Automatic English caption track en-orig (json3): 768 text events, 4844 words, 100% coverage of the 1885 s runtime',
      'Human-authored English track en (json3): 591 text events, 4809 words — independent wording cross-check',
    ],
    citations_required: true,
    usage_restrictions: [
      'Do not reproduce the audio or video. This module stores metadata, offsets and short quotations only.',
      'The video is educational and explicitly not financial advice; its claims about markets are the speaker\'s, recorded as interpretations.',
      'The video is sponsored by Brilliant; the closing sponsor segment is not part of the argument.',
    ],
  },

  layers: [
    {
      layerId: 'primary_layer',
      type: 'primary',
      epochs: {
        runtime: {
          epochId: `${MANIPULATOR_MATH_UNIVERSE_ID}:runtime`,
          startTime: MANIPULATOR_MATH_PUBLISHED,
          endTime: at(MANIPULATOR_MATH_RUNTIME_SECONDS),
          precision: TimePrecision.SECOND,
          description:
            'The 1885 s runtime from the measured upload instant. Six gapless chapter ' +
            'segments come from the published chapter list. Every keyframe offset is a ' +
            'cue start in the automatic track; the last text cue begins at 1882.720 s.',
        },
      },
    },
  ],

  epochs: {},

  temporalStructure: {
    segments: manipulatorMathChapters.map((chapter) => ({
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
          'Upload instant from the video\'s own metadata: 2025-04-24T14:25:42Z. ' +
          'Runtime 1885 s with six published chapters; 834,201 views at verification.',
      },
      {
        id: 'thesis_trade_based_manipulation',
        timestamp: at(1.199),
        significance: 0.95,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'simulation'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Opens with the market simulator the video will build and says it is used ' +
          '"to see and understand trade-based manipulation in action".',
      },
      {
        id: 'no_blatant_lies',
        timestamp: at(11.759),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'definition'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Unlike fake news, this manipulation "exploits specific trading patterns ' +
          'seeming legal at first glance as it involves no blatant lies".',
      },
      {
        id: 'forex_too_big_to_manipulate',
        timestamp: at(23.519),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['forex', 'case', 'scale'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The foreign exchange market, "the largest financial market in the world", ' +
          'was "traditionally believed to be too big to manipulate, which turned out to ' +
          'be a costly mistake".',
      },
      {
        id: 'forex_case_2013',
        timestamp: at(35.76),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['forex', 'case', 'historical_claim'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The historical anchor of the video: "Discovered in 2013, a handful of ' +
          'traders orchestrated what became known as the Forex case, siphoning away ' +
          'hundreds of millions for years." Cited at the standing of the speaker.',
      },
      {
        id: 'forensic_tools',
        timestamp: at(46.96),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['method', 'detection'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The counterclaim that "with some math and financial forensic tools, we can ' +
          'spot the manipulators" — the promise the rest of the video develops.',
      },
      {
        id: 'random_trader',
        timestamp: at(66.799),
        significance: 0.8,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['simulation', 'randomness'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The protagonist trades randomly, "buy[ing] and sell[ing] randomly", ' +
          'standing in for an ordinary participant in a fair market.',
      },
      {
        id: 'new_players',
        timestamp: at(82.4),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['simulation', 'manipulator'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The inciting event: "out of nowhere, some new players show up" and are ' +
          '"consistently beating the odds" in a market driven by randomness.',
      },
      {
        id: 'blend_in',
        timestamp: at(112.0),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'detection'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The manipulators "blend in almost perfectly" and the market "still looks ' +
          'mostly random" — the detection problem stated in one clause.',
      },
      {
        id: 'measure_and_expose',
        timestamp: at(119.28),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'method'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The stated aim of the work: "a way to measure and expose this manipulation".',
      },
      {
        id: 'auction_pricing_setup',
        timestamp: at(148.08),
        significance: 0.8,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['simulation', 'mechanism'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The price movement shown earlier "comes from a real simulation I built"; ' +
          'buyers and sellers arrive with order prices drawn from a distribution.',
      },
      {
        id: 'probability_distribution',
        timestamp: at(187.28),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['simulation', 'mechanism'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Buy orders are "coming from a probability distribution"; the same is done ' +
          'for sell orders, making random order prices the model of a fair market.',
      },
      {
        id: 'fair_market',
        timestamp: at(194.72),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['simulation', 'fairness'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The randomness is "a great proxy to mirror a fair market, one where ' +
          'everyone has an equal chance" and no one knows what will happen.',
      },
      {
        id: 'maximize_satisfaction',
        timestamp: at(235.44),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['mechanism', 'pricing'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The price rule: "maximize total satisfaction", with the ideal price in ' +
          'the overlap of the buy and sell order curves.',
      },
      {
        id: 'auction_pricing',
        timestamp: at(283.6),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['mechanism', 'pricing', 'terminology'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Names the rule: "This method is called auction pricing", used in real ' +
          'markets to match overnight orders to a single opening price.',
      },
      {
        id: 'simulation_loop',
        timestamp: at(354.4),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['simulation', 'mechanism'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Today\'s market price becomes the starting point for tomorrow\'s price ' +
          'distribution, and the cycle continues" — the loop that makes the clock.',
      },
      {
        id: 'unpredictable_by_construction',
        timestamp: at(369.12),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'randomness'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Because each distribution is centred on the previous day\'s price, ' +
          '"the market moves randomly, making it impossible to predict in a useful way".',
      },
      {
        id: 'future_news_baked_in',
        timestamp: at(453.919),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['expectations', 'pricing'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'In a market with news, "expectations about all future news also get baked ' +
          'into the price immediately".',
      },
      {
        id: 'no_information_to_traders',
        timestamp: at(466.479),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['simulation', 'randomness'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'To make the market "really hard to manipulate", traders are fed no ' +
          'additional information and "ignore all news and rumors about the future".',
      },
      {
        id: 'patterns_that_look_like_order',
        timestamp: at(512.24),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['method', 'randomness'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Running 500-day simulations, "it\'s surprisingly easy to spot patterns ' +
          'that look like order" although "in this scenario, it\'s all random".',
      },
      {
        id: 'gaussian_random_walk',
        timestamp: at(593.2),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['model', 'random_walk', 'terminology'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The first market, where traders have unlimited wealth, "follow[s] what is ' +
          'known as a Gaussian random walk with an expected price change of zero". ' +
          'Prices can drift to arbitrarily high or low values.',
      },
      {
        id: 'wealth_asymmetry',
        timestamp: at(675.2),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['model', 'wealth', 'asymmetry'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Buying is limited by money while selling is not: "This introduces an ' +
          'asymmetry" that nudges prices back toward a centre as they drift out.',
      },
      {
        id: 'soft_limits',
        timestamp: at(739.68),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['model', 'mechanism'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The trading rules "effectively create practical soft limits on price ' +
          'movements, at least when no one is talking about it" — publicly known ' +
          'limits are exploited and disappear.',
      },
      {
        id: 'channels_emerge',
        timestamp: at(770.48),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['model', 'emergence'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'No instruction to form channels is given: "this pattern emerges naturally ' +
          'as a result of the market rules and the trader order behavior".',
      },
      {
        id: 'volume_and_volatility',
        timestamp: at(802.32),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['practical', 'volume'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'More traded shares make prices less volatile; "when you see a massive ' +
          'price jump, it doesn\'t necessarily signify major news" — it could be ' +
          'fewer people trading.',
      },
      {
        id: 'only_variable_is_you',
        timestamp: at(899.36),
        significance: 0.95,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'pivot'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The pivot of the argument: since predicting others is impossible, ' +
          '"the only variable that can shape the future to your advantage is you".',
      },
      {
        id: 'control_not_prediction',
        timestamp: at(906.079),
        significance: 0.95,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'control'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"Winning isn\'t about predicting the market anymore. It\'s about taking ' +
          'control" — dictating prices and shaping how others perceive trends.',
      },
      {
        id: 'nudge_the_price',
        timestamp: at(942.0),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['mechanism', 'manipulation'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The first demonstration: place a large buy order above the market and ' +
          '"the market price takes a step up".',
      },
      {
        id: 'cost_of_impact',
        timestamp: at(983.6),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['mechanism', 'cost'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The catch: the shares "actually have to" be bought, so moving the price ' +
          "comes \"at the full cost\" — and is generally illegal when intended to mislead.",
      },
      {
        id: 'self_trading',
        timestamp: at(1035.679),
        significance: 0.95,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['mechanism', 'self_trading', 'terminology'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'To break even, "the trick is to sell the same number of shares right back ' +
          'to ourselves" — publicly, through the exchange, so it looks legitimate. ' +
          'The human track names it "self-trading".',
      },
      {
        id: 'perception_and_liquidity',
        timestamp: at(1063.2),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['mechanism', 'perception'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"The point is perception": faked volume creates the illusion of a liquid ' +
          'market, though in the simulation random traders ignore the signal.',
      },
      {
        id: 'price_setters',
        timestamp: at(1099.28),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'price_setting'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Ordinary traders are "price takers"; "to manipulate the market, we have to ' +
          'think like price setters".',
      },
      {
        id: 'tipping_point',
        timestamp: at(1131.84),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['mechanism', 'price_setting'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'When overlapping buy and sell orders are placed, "we reach a tipping ' +
          'point" where self-orders enforce the intersection of the curves and ' +
          'give control of the price.',
      },
      {
        id: 'monopoly_power',
        timestamp: at(1159.24),
        significance: 0.95,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'monopoly', 'terminology'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"This is called monopoly power in the stock market, where buying the whole ' +
          'market lets you dictate prices" — analogous to a product monopoly.',
      },
      {
        id: 'warning_sign',
        timestamp: at(1197.2),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['practical', 'detection'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The practical tell offered to the protagonist: "one unusually large buy ' +
          'and sell order at nearly the same price".',
      },
      {
        id: 'cycle_accumulate',
        timestamp: at(1251.84),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['manipulation_cycle', 'phase'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Phase one of the complete cycle: "buying as many shares as possible ' +
          'without drawing too much attention" and building the position quietly.',
      },
      {
        id: 'cycle_inflate',
        timestamp: at(1270.4),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['manipulation_cycle', 'phase'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Phase two: "using self-trading where you partly buy and sell shares to ' +
          'yourself to gain control and notch the price upward".',
      },
      {
        id: 'cycle_sell',
        timestamp: at(1304.88),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['manipulation_cycle', 'phase'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Phase three: "once the price has been inflated enough, it\'s time to sell" ' +
          'quietly, cashing in without disrupting the market.',
      },
      {
        id: 'pump_and_dump',
        timestamp: at(1333.6),
        significance: 0.95,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'pump_and_dump', 'terminology'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The cycle turned $1m into $1.7m by taking "a significant slice from the ' +
          'other random traders": "a form of the classical pump and dump scheme", ' +
          'here entirely trade-based.',
      },
      {
        id: 'profit_from_anchoring',
        timestamp: at(1393.84),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['mechanism', 'anchoring'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The single driving assumption: "tomorrow\'s price is likely to be close ' +
          'to today\'s price". Without that reliance on recent prices, the scheme ' +
          'would not work.',
      },
      {
        id: 'human_factor',
        timestamp: at(1432.08),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['interpretation', 'rationality'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Even fundamental valuation "only works if everyone does it"; markets are ' +
          '"driven by participants outbidding one another fully aware that they are ' +
          'trading at irrational prices" — "the human factor".',
      },
      {
        id: 'scatter_orders',
        timestamp: at(1462.88),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['concealment', 'self_trading'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          '"It\'s not a crowd of people moving the market. It\'s one person pulling ' +
          'the strings behind the scenes": coordinated self-trades are scattered ' +
          'across the market to look like harmless activity.',
      },
      {
        id: 'quantify_manipulation',
        timestamp: at(1493.52),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['detection', 'method'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The detection turn: "first, we need to learn how to quantify it" by ' +
          'identifying irregularities in the shape of the order curves.',
      },
      {
        id: 'reference_band',
        timestamp: at(1519.76),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['detection', 'method'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Standardised curves and many clean simulations "create a band of order ' +
          'curves helping quantify what counts as unusual behavior".',
      },
      {
        id: 'money_temperature',
        timestamp: at(1569.84),
        significance: 0.8,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['analogy', 'statistical_mechanics'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'An aside: markets and an ideal gas both have conserved quantities and ' +
          'settle into equilibrium distributions, so one can "loosely think of a ' +
          'market as having a money temperature".',
      },
      {
        id: 'genuine_vs_manipulated_jump',
        timestamp: at(1588.48),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['detection', 'sentiment'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Three price jumps are compared: genuine positive news moves a "sentiment ' +
          'curve", a low-volume jump leaves it flat, and self-trading mimics news ' +
          'while leaving a detectable trace.',
      },
      {
        id: 'not_proof',
        timestamp: at(1649.919),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['epistemics', 'detection'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The explicit caveat: "this graph isn\'t proof of manipulation. Patterns ' +
          'like these occur naturally." Only repeated suspicious behaviour from ' +
          'the same traders triggers investigation.',
      },
      {
        id: 'perfect_disguise',
        timestamp: at(1689.6),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['concealment', 'detection'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'A crafted manipulator price distribution can make the final order curve ' +
          '"look completely normal. It\'s just shifted" — a whole market faked at ' +
          'a different price and volume level.',
      },
      {
        id: 'undetectable_from_shape',
        timestamp: at(1717.76),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['concealment', 'limits'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'At a high enough cost, and if the original distribution is guessed ' +
          'correctly, "this kind of manipulation can be undetectable, at least from ' +
          'the order curve shapes alone".',
      },
      {
        id: 'paired_with_real_news',
        timestamp: at(1726.399),
        significance: 0.9,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['concealment', 'information'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Hardest case: manipulation paired with reliable positive information, ' +
          'where several markets "align with the truth to some degree" and only one ' +
          'is manipulation-free.',
      },
      {
        id: 'losing_game',
        timestamp: at(1761.039),
        significance: 0.95,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['thesis', 'conclusion'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'The closing claim: when "someone gains monopoly power over the market, ' +
          'the market can\'t function as it\'s supposed to" and becomes "a losing ' +
          'game for everyone else".',
      },
      {
        id: 'oversight_note',
        timestamp: at(1788.24),
        significance: 0.85,
        certainty: 0.9,
        precision: TimePrecision.SECOND,
        tags: ['conclusion', 'oversight'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'Big regulated markets are "monitored by oversight teams equipped with far ' +
          'more advanced financial forensic tools"; the video is "a nod to their work".',
      },
    ],

    windows: { strategy: 'time_based' },
  },

  metadata: {
    canonicalName: 'The Manipulator\'s Sneaky Math to Beat Chaos',
    description:
      'A 31:25 educational video that builds a toy market simulator and uses it to ' +
      'demonstrate trade-based manipulation: a fair random market cannot be predicted, ' +
      'so a manipulator takes control of price through self-trading and overlapping ' +
      'orders, reaps a pump-and-dump profit by exploiting anchoring on recent prices, ' +
      'and hides the cycle in ordinary noise while order-curve irregularities leave a ' +
      'statistical trace.',
    creators: ['braintruffle (publisher)', 'Torsten (speaker, per the description)'],
    released: new Date('2025-04-24T14:25:42Z'),
    cultural_significance: 0.4,
    significance:
      'A widely viewed explainer (834,201 views at verification) that gives a ' +
      'mechanistic, simulation-backed account of self-trading, price-setting and ' +
      'order-curve detection. Recorded for that argument and its clock.',
    tags: ['youtube', 'finance', 'market-manipulation', 'simulation', 'forex', 'statistics'],
    platform: 'YouTube',
    externalId: '-jF9gW2r_bk',
    externalIds: { youtubeVideoId: '-jF9gW2r_bk' },
    durationSeconds: MANIPULATOR_MATH_RUNTIME_SECONDS,
    contentType: 'video',
    metricsAsOf: '2026-11-19',

    chapters: manipulatorMathChapters.map((chapter) => ({ ...chapter })),

    interpretations: [
      {
        id: 'I-1',
        claim:
          'A fair market of random buyers and sellers cannot be predictively beaten; ' +
          'the only reliable edge is to take control of the price rather than forecast it.',
        statedAtSeconds: 899.36,
        standing:
          'The pivot of the video, argued from the simulator rather than measured ' +
          'against real markets. Recorded as the work\'s interpretation.',
      },
      {
        id: 'I-2',
        claim:
          'Self-trading with overlapping buy and sell orders gives monopoly power over ' +
          'pricing, enabling a trade-based pump-and-dump without false news.',
        statedAtSeconds: 1159.24,
        standing:
          'Demonstrated in the toy model and compared to classic pump-and-dump. ' +
          'A claim about the model as much as about real markets.',
      },
      {
        id: 'I-3',
        claim:
          'The scheme works because traders anchor on recent prices and trade at ' +
          'irrationally high prices aware that others will outbid them.',
        statedAtSeconds: 1393.84,
        standing:
          'A behavioural explanation offered by the speaker; no external behavioural ' +
          'data is marshalled here.',
      },
      {
        id: 'I-4',
        claim:
          'Manipulation leaves statistical irregularities in order-curve shapes, so ' +
          'repeated suspicious behaviour can be detected, though a sufficiently ' +
          'careful manipulation is undetectable from shape alone.',
        statedAtSeconds: 1649.919,
        standing:
          'The detection claim is explicitly hedged — a pattern is not proof — and ' +
          'its limit is stated by the speaker.',
      },
    ],

    captionArtifacts: manipulatorMathCaptionArtifacts,

    verification: {
      performed: '2026-11-19',
      instruments: [
        'yt-dlp 2025.10.14 (python 3.9, youtube:player_client=android_vr) — info.json with timestamp, duration, title, channel, counts and six published chapters',
        'Automatic English track en-orig (json3): 768 text events, 4844 words, first cue 0.640 s, last cue 1882.720 s',
        'Human-authored English track en (json3): 591 text events, 4809 words, sha256 e8b849cb… — an independent wording check, not a copy',
        'read_captions.py --confidence: 768 cues, 4844 words, 100.0% coverage, 24.4 cues/min, printed ceiling 0.90',
        'Video description: published timetable matching the six chapters, sponsor disclosure, FCA references and financial-advice disclaimer',
      ],
      measured: {
        title: 'The Manipulator\'s Sneaky Math to Beat Chaos',
        channel: 'braintruffle',
        handle: '@braintruffle',
        published: '2025-04-24T14:25:42Z',
        durationSeconds: MANIPULATOR_MATH_RUNTIME_SECONDS,
        viewCountAtVerification: 834201,
        likeCountAtVerification: 26126,
        publishedChapterCount: 6,
        captionEventsAutomatic: 768,
        captionEventsManual: 591,
        lastSpokenCueSeconds: 1882.72,
      },
      scope: { start: 0, end: MANIPULATOR_MATH_RUNTIME_SECONDS },
      confidence: 0.9,
      secondAttempt: {
        recommended: false,
        why:
          'Two genuinely distinct English tracks were acquired: an automatic rendering ' +
          'and a human-authored, corrected transcript. The printed 0.90 ceiling stands.',
        what: 'No second attempt needed; disputes are recorded as captionArtifacts.',
        attempted: 'Both tracks were fetched as json3 and hashed; they differ and were compared.',
      },
      limits: [
        'The six segments are the channel\'s published chapters, verbatim from info.json; no editorial phase was invented.',
        'The last text cue starts at 1882.720 s; the epoch runs to 1885 s and no claim is keyframed into the tail.',
        'The FOREX case, the FCA, the five banks and the cited publications are outside works; their claims are the speaker\'s and are not independently verified here.',
        'The closing 45 s are a Brilliant sponsorship and are keyframed only as the sponsor disclosure, not as part of the argument.',
        'No audio or video was archived: no ticket named this source as volatile and it is not in the archive subset.',
        'View and like counts are point-in-time reads, not properties of the work.',
        'The model results are about a toy simulator; the video\'s educational and not-financial-advice disclaimer is part of the source.',
      ],
    },

    uncertaintyNotes: [
      'The published timetable in the description and the info.json chapter list agree on all six boundaries; the chapter list is used.',
      'The Forex case is cited by year and description only. No universe id is invented for it, the traders, the FCA or the banks.',
      'The 2013 discovery and the "hundreds of millions" figure are the speaker\'s characterisation of the case, not findings of this vault.',
      '"Money temperature" is the speaker\'s loose analogy to ideal-gas equilibrium, not a physical claim made by this record.',
      'The human track names the speaker Torsten in the description sign-off; that is a published attribution, not a reconstruction.',
      'Significance and cultural-significance values are editorial weights for retrieval, not measurements of influence.',
      'The I-4 detection claim (a pattern is not proof; a careful manipulation is ' +
      'undetectable from shape alone) is the same verification posture as le.critic\'s ' +
      'postulate that a verdict is a spectrum, not a flag: a baseline prices evasion ' +
      'rather than proving detection (le_critic:fm_carrier_run:2026, ' +
      'https://james-gibson.github.io/le.critic/). This compares postures only — it is ' +
      'not evidence that order-curve statistics detect real manipulation. Cross-linked in ' +
      'kb/lore as claims/detection-is-a-spectrum-not-a-flag and ' +
      'claims/statistical-signatures-of-manipulation.',
    ],
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.GLOBAL_ECONOMY],
    },
  },
} as unknown as Universe;
