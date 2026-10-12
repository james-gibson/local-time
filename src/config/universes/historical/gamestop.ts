import { Universe, UniverseType } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * GameStop short squeeze — "Gamestonk" (January–February 2021).
 *
 * james-gibson/local-time#4.
 *
 * A documentary record of the retail-driven short squeeze in GameStop (GME)
 * stock, coordinated largely on the subreddit r/WallStreetBets. Retail buying
 * pushed the share price up more than 1,600% in January 2021, inflicted billions
 * of dollars of losses on short-selling hedge funds, and ended — for a period —
 * when several brokerages restricted buying of GME and other "meme stocks".
 *
 * The issue supplied three research tables; they map onto this universe as:
 * - "Key Events and Timeline"  -> `temporalStructure` (segments + keyframes). All
 *   three columns of that table are carried: `Date` -> keyframe `timestamp`,
 *   `Event` -> keyframe `description`, and `Significance` -> keyframe
 *   `metadata.significance_note`. The numeric `significance` field is a separate,
 *   coarser thing: it ranks the keyframe, the note says why it mattered.
 * - "Reasons for Popularity"   -> `metadata.culturalDrivers`.
 * - "Points of Controversy"    -> `metadata.controversies`.
 *
 * Relationship to other universes (connection reference vocabulary; stored under
 * `connections`, which is not yet a first-class `Universe` field — hence the cast):
 * - `CONTEMPORARY_OF` the zero interest-rate era (cheap money pushed retail
 *   capital into speculative assets).
 * - `INFLUENCED` by the internet/social-platform build-out (coordination needed
 *   Reddit, Twitter and commission-free brokerage apps).
 *
 * Cultural Significance: 0.92 — the first mass-market collision of internet meme
 * culture and equity markets, and the event that put "meme stock", "diamond
 * hands" and "the retail investor" into ordinary vocabulary. It triggered
 * hearings, an SEC staff report, and a durable debate about market plumbing.
 *
 * Reality Relation: documents, 0.0 fictionalization (a real, extensively
 * recorded market event).
 *
 * Research Sources:
 * - U.S. Securities and Exchange Commission, "Staff Report on Equity and Options
 *   Market Structure Conditions in Early 2021" (October 2021).
 * - U.S. House Committee on Financial Services, "Game Stopped? Who Wins and
 *   Loses When Short Sellers, Social Media, and Retail Investors Collide"
 *   (hearing, February 18, 2021).
 * - Contemporaneous market data and news reporting (January–February 2021).
 *
 * Hierarchical Context: GLOBAL_ECONOMY -> US_HISTORY -> WORLD_HISTORY
 */

/** ISO-8601 -> nanoseconds since the Unix epoch, via the shared conversion helper. */
const fromIso = (iso: string): bigint => dateToNanoseconds(new Date(iso));

/** A reason the meme drew retail participation (issue research table 2). */
interface CulturalDriver {
  reason: string;
  description: string;
  keywords: string[];
}

/** A point of controversy the event raised (issue research table 3). */
interface ControversyPoint {
  controversy: string;
  details: string;
  keyQuestions: string[];
}

/**
 * Context universes that apply to the event: the macro economy it played out in,
 * the financial district that hosted it, the internet that enabled the
 * coordination, and the national/world history it sits inside.
 */
const GAMESTOP_CONTEXT = [
  CommonUniverseIds.GLOBAL_ECONOMY,
  CommonUniverseIds.NEW_YORK_FINANCE,
  CommonUniverseIds.INTERNET_DEVELOPMENT,
  CommonUniverseIds.US_HISTORY,
  CommonUniverseIds.WORLD_HISTORY,
];

export const gamestopSqueezeUniverse: Universe = {
  universeId: 'history:gamestop_squeeze:2021',
  type: UniverseType.HISTORICAL_EVENT,
  identifiers: {
    primary: 'history:gamestop_squeeze:2021',
    aliases: ['Gamestonk', 'GME short squeeze', 'GameStop short squeeze', 'WallStreetBets GameStop'],
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: 'history:gamestop_squeeze:2021',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'SEC Staff Report on Equity and Options Market Structure Conditions in Early 2021 (October 2021)',
          'U.S. House Financial Services Committee hearing, February 18, 2021',
          'Contemporaneous market data and news reporting (January–February 2021)',
        ],
      },
    ],
  },
  attribution: {
    public_domain: true,
    sources: ['SEC', 'U.S. House Financial Services Committee', 'Public news archives'],
    citations_required: true,
    usage_restrictions: [
      'Market data should be cited with its original source (exchange / SEC filings).',
    ],
  },
  layers: [{ layerId: 'primary', type: 'primary', epochs: {} }],
  epochs: {},
  temporalStructure: {
    segments: [
      {
        id: 'catalyst',
        start: fromIso('2021-01-11T00:00:00Z'),
        end: fromIso('2021-01-21T23:59:59Z'),
        type: 'phase',
        description:
          'Ryan Cohen and other new board members are announced; retail interest builds on r/WallStreetBets.',
      },
      {
        id: 'squeeze',
        start: fromIso('2021-01-22T00:00:00Z'),
        end: fromIso('2021-01-27T23:59:59Z'),
        type: 'phase',
        description:
          'The short squeeze proper: the price gaps up, draws mainstream attention, and short sellers capitulate.',
      },
      {
        id: 'intervention',
        start: fromIso('2021-01-28T00:00:00Z'),
        end: fromIso('2021-02-05T23:59:59Z'),
        type: 'phase',
        description:
          'Brokerages restrict buying, the price falls sharply, and regulators issue their first statements.',
      },
      {
        id: 'aftermath',
        start: fromIso('2021-02-18T00:00:00Z'),
        end: fromIso('2021-02-19T23:59:59Z'),
        type: 'phase',
        description:
          'The House Financial Services Committee holds a hearing; the episode passes into regulation and lawmaking.',
      },
    ],
    keyframes: [
      {
        id: 'board_announcement',
        timestamp: fromIso('2021-01-11T00:00:00Z'),
        significance: 0.8,
        tags: ['catalyst', 'corporate_action'],
        certainty: 1.0,
        description:
          'GameStop announces new board members, including Chewy co-founder Ryan Cohen.',
        metadata: {
          significance_note:
            'Seen as a positive catalyst by retail investors, leading to an initial surge in the stock price.',
        },
      },
      {
        id: 'initial_surge',
        timestamp: fromIso('2021-01-22T00:00:00Z'),
        significance: 0.9,
        tags: ['wallstreetbets', 'market_event', 'volatility'],
        certainty: 1.0,
        description:
          "GameStop's stock rises over 50%, driven by users on the subreddit r/WallStreetBets.",
        metadata: {
          significance_note:
            'Marked the beginning of the major surge and brought mainstream attention to the stock.',
        },
      },
      {
        id: 'musk_tweet',
        timestamp: fromIso('2021-01-26T00:00:00Z'),
        significance: 0.85,
        tags: ['social_media', 'amplification'],
        certainty: 1.0,
        description:
          "Elon Musk tweets 'Gamestonk!!' with a link to r/WallStreetBets, amplifying the hype.",
        metadata: {
          significance_note:
            "Musk's tweet further amplified the hype and brought more attention to the situation, contributing to the stock's continued rise.",
        },
      },
      {
        id: 'melvin_closes_position',
        timestamp: fromIso('2021-01-27T00:00:00Z'),
        significance: 1.0,
        tags: ['hedge_fund', 'short_squeeze', 'victory'],
        certainty: 1.0,
        description:
          'Hedge fund Melvin Capital closes out its short position after massive losses.',
        metadata: {
          significance_note:
            "Seen as a major victory for retail investors on r/WallStreetBets and fuelled the 'us vs. them' narrative.",
        },
      },
      {
        id: 'trading_restrictions',
        timestamp: fromIso('2021-01-28T00:00:00Z'),
        significance: 1.0,
        tags: ['controversy', 'market_intervention'],
        certainty: 1.0,
        description:
          "Robinhood and other brokerages restrict the buying of GameStop and other 'meme stocks'.",
        metadata: {
          significance_note:
            'This move sparked widespread outrage and accusations of market manipulation, leading to a drop in the stock price and calls for investigations.',
        },
      },
      {
        id: 'sec_statement',
        timestamp: fromIso('2021-01-29T00:00:00Z'),
        significance: 0.7,
        tags: ['regulation', 'regulator_response'],
        certainty: 1.0,
        description:
          'The SEC issues a statement on market volatility, acknowledging the situation.',
        metadata: {
          significance_note:
            'This indicated that regulators were taking notice of the unprecedented market activity.',
        },
      },
      {
        id: 'house_hearing',
        timestamp: fromIso('2021-02-18T00:00:00Z'),
        significance: 0.95,
        tags: ['government', 'regulation', 'aftermath'],
        certainty: 1.0,
        description:
          'The U.S. House Financial Services Committee holds a hearing; Robinhood, Melvin Capital and Reddit testify.',
        metadata: {
          significance_note:
            'Key figures from Robinhood, Melvin Capital and Reddit testified, bringing the issue to the forefront of political discussion.',
        },
      },
    ],
    windows: { strategy: 'phase_based' },
  },
  metadata: {
    canonicalName: 'GameStop Short Squeeze (Gamestonk)',
    description:
      'The January 2021 retail-driven short squeeze in GameStop (GME) stock, coordinated on r/WallStreetBets, and its regulatory aftermath.',
    creators: ['Retail investors coordinating on r/WallStreetBets'],
    released: new Date('2021-01-11T00:00:00Z'),
    cultural_significance: 0.92,
    tags: [
      'finance',
      'markets',
      'meme_culture',
      'social_media',
      'wallstreetbets',
      'retail_investing',
      '2020s',
    ],
    keyPlayers: [
      'r/WallStreetBets',
      'Melvin Capital',
      'Citadel Securities',
      'Robinhood',
      'Keith Gill',
      'Ryan Cohen',
      'Elon Musk',
    ],
    significance:
      'The first mass-market collision of internet meme culture and equity markets, surfacing the "retail investor" as a force and triggering hearings and an SEC staff report.',
    // Issue research table 2 — why the trade drew so much participation.
    culturalDrivers: [
      {
        reason: 'Anti-Establishment Sentiment',
        description:
          "Many retail investors were motivated by a desire to 'stick it to' Wall Street hedge funds that were shorting GameStop stock. It was framed as a David vs. Goliath battle.",
        keywords: ['Hold the line', 'Apes together strong', 'Diamond hands'],
      },
      {
        reason: 'Meme Culture',
        description:
          "The situation was heavily fueled by memes and a sense of community on r/WallStreetBets. The 'stonks' meme became a symbol of the movement.",
        keywords: ['Stonks', 'Tendies', 'To the moon'],
      },
      {
        reason: 'Potential for High Returns',
        description:
          "The rapid and extreme increase in GameStop's stock price created a FOMO (fear of missing out) effect, attracting investors hoping for quick and substantial profits.",
        keywords: ['Short squeeze', 'Gamma squeeze', 'Rocket ship'],
      },
      {
        reason: 'Accessibility of Trading',
        description:
          'Commission-free trading apps like Robinhood made it easy for a new generation of retail investors to participate in the stock market.',
        keywords: ['Retail investors', 'Robinhood', 'Democratization of finance'],
      },
      {
        reason: 'Community and Entertainment',
        description:
          "For many, participating in the 'Gamestonk' phenomenon was as much about being part of a community and an entertaining event as it was about making money.",
        keywords: ['r/WallStreetBets', 'WSB', 'Meme stock'],
      },
    ] as CulturalDriver[],
    // Issue research table 3 — the controversies the episode raised.
    controversies: [
      {
        controversy: 'Market Manipulation',
        details:
          "Accusations were made that the coordinated buying by retail investors on Reddit constituted a 'pump and dump' scheme. Others argued it was simply a collective action by individual investors.",
        keyQuestions: [
          'Is coordinated buying by retail investors illegal market manipulation?',
        ],
      },
      {
        controversy: 'Trading Halts',
        details:
          'Brokerage firms like Robinhood restricted the buying of GameStop stock, citing clearinghouse collateral requirements. This led to accusations that they were protecting hedge funds at the expense of retail investors.',
        keyQuestions: [
          'Were the trading halts necessary for market stability, or did they unfairly disadvantage retail investors?',
        ],
      },
      {
        controversy: 'Volatility and Risk',
        details:
          "The extreme volatility of GameStop's stock price raised concerns about the potential for significant financial losses for inexperienced investors who bought in at the peak.",
        keyQuestions: [
          'What is the responsibility of trading platforms to protect investors from highly volatile and risky assets?',
        ],
      },
      {
        controversy: 'Hedge Fund Practices',
        details:
          'The event brought scrutiny to the practice of short selling and the risks it can pose to firms that are heavily shorted.',
        keyQuestions: [
          'Should there be more regulation around short selling and the disclosure of short positions?',
        ],
      },
      {
        controversy: 'Regulatory Scrutiny',
        details:
          "The 'Gamestonk' saga prompted calls for increased regulation of the stock market, including a review of the role of social media in influencing trading and the structure of market plumbing.",
        keyQuestions: [
          'Do current financial regulations adequately address the new dynamics of retail investing and social media-driven trading?',
        ],
      },
    ] as ControversyPoint[],
  },
  connections: {
    natural: { parentUniverses: GAMESTOP_CONTEXT },
    references: [
      {
        type: 'CONTEMPORARY_OF',
        targetUniverseId: 'history:us_economy:2008-2022',
        description:
          'Played out inside the zero interest-rate era, when cheap money pushed retail capital toward speculative assets.',
      },
      {
        type: 'INFLUENCED',
        targetUniverseId: CommonUniverseIds.INTERNET_DEVELOPMENT,
        description:
          'Retail coordination depended on social platforms (Reddit, Twitter) and commission-free brokerage apps.',
      },
    ],
  },
} as unknown as Universe;

/** All universes derived from james-gibson/local-time#4. */
export const gamestopUniverses: Universe[] = [gamestopSqueezeUniverse];
