import {
    Universe,
    UniverseType,
    TimePrecision,
    createHistoricalUniverseId,
} from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import * as utils from '../../../utils';

/**
 * United States Zero Interest-Rate Policy (ZIRP) Era
 *
 * This universe documents the period of the Zero Interest-Rate Policy (ZIRP) in the United States, an unprecedented monetary strategy enacted by the Federal Reserve in response to the 2008 Global Financial Crisis. For nearly a decade, the core interest rate was held near zero, making money incredibly cheap to borrow. 【1】
 *
 * For someone born after 9/11, this period is the invisible economic backdrop of their formative years. It created a unique environment where:
 * - **"Growth at all costs" became the mantra:** Tech companies, from startups to giants, could secure massive funding with little expectation of near-term profitability. This fueled the app economy, the gig economy, and the rapid expansion of services that are now ubiquitous. 【2】
 * - **Asset prices inflated:** With borrowing costs near zero, money flowed into stocks, real estate, and alternative assets like venture capital, driving up their values significantly.
 * - **The nature of risk changed:** Traditional savings accounts yielded almost nothing, pushing investors toward riskier assets to seek returns.
 *
 * The end of ZIRP, marked by the Federal Reserve's rate hikes starting in late 2015 and accelerating dramatically in 2022, represented a seismic shift. The "free money" era was over. This led to a painful market correction, widespread tech layoffs, and a new economic reality where profitability and efficiency suddenly mattered more than speculative growth. 【3】
 *
 * Cultural Significance: 0.92 - A defining economic policy of the post-2008 era that fundamentally reshaped corporate strategy, investment behavior, and technological development for over a decade. Its conclusion triggered significant economic and social disruption.
 * Reality Relation: Documentary with 0.0 fictionalization. This universe documents established macroeconomic policy and its effects.
 *
 * Research Sources:
 * - Federal Reserve Economic Data (FRED), St. Louis Fed. Federal Funds Effective Rate (Series: FEDFUNDS). 【4】
 * - Wikipedia, "History of Federal Open Market Committee actions".
 * - Investopedia, "What Is Zero Interest-Rate Policy (ZIRP)?". 【1】
 * - The Pragmatic Engineer, "The end of 0% interest rates: what it means for software engineering". 【2】
 *
 * Key Facts Verified:
 * - ZIRP Start: The Federal Funds Rate target was lowered to a range of 0-0.25% on December 16, 2008. 【5】
 * - ZIRP End (First Liftoff): The first rate hike occurred on December 16, 2015, raising the target range to 0.25-0.50%.
 * - Major Rate Hikes: A series of aggressive rate hikes began in March 2022 to combat post-COVID inflation.
 *
 * Hierarchical Context: US_ECONOMY -> US_GOVERNMENT -> US_HISTORY -> WORLD_HISTORY
 * Natural Connections Discovered:
 * - Parent Context: CommonUniverseIds.US_GOVERNMENT (contains the Federal Reserve)
 * - Related Policy: Quantitative Easing (QE), which was often implemented alongside ZIRP. 【6】
 */
export const zirpUsEconomyUniverse: Universe = {
    universeId: createHistoricalUniverseId('us_economy', 'zirp_era', '2008-2022'),
    type: UniverseType.HISTORICAL_EVENT,
    epochs: {
        "launched": utils.createYearEpoch(2008, TimePrecision.YEAR,"fed_policy_decision_2008")
    },
    identifiers: {
        primary: 'us_economy:policy:zirp_2008-2022',
        aliases: ['Zero Interest-Rate Policy Era', 'The Era of Free Money'],
    },
    realityRelation: {
        type: 'documents',
        fictionalizationDegree: 0.0,
        realityAnchors: [
            {
                anchorId: 'fed_policy_decision_2008',
                realWorldEntity: 'Federal Open Market Committee (FOMC) Meeting Minutes',
                description: 'Official decision to lower the federal funds rate to 0-0.25%.',
                confidence: 1.0,
                evidence: ['FOMC Press Release, December 16, 2008'],
            },
            {
                anchorId: 'fed_policy_decision_2015',
                realWorldEntity: 'Federal Open Market Committee (FOMC) Meeting Minutes',
                description: 'Official decision to raise the federal funds rate, ending the ZIRP period.',
                confidence: 1.0,
                evidence: ['FOMC Press Release, December 16, 2015'],
            },
            {
                anchorId: 'fed_policy_decision_2022',
                realWorldEntity: 'Federal Open Market Committee (FOMC) Meeting Minutes',
                description: 'Beginning of aggressive rate hikes to combat inflation.',
                confidence: 1.0,
                evidence: ['FOMC Press Releases from March 2022 onwards'],
            },
        ],
    },
    attribution: {
        public_domain: true,
        sources: ['Federal Reserve', 'US Treasury', 'Bureau of Labor Statistics'],
        citations_required: true,
        usage_restrictions: [
            'Economic data should be cited with its original source (e.g., FRED).',
        ],
    },
    layers: [],
    temporalStructure: {
        segments: [
            {
                segmentId: 'zirp_implementation',
                startTime: BigInt('1229403600000'), // 2008-12-16T05:00:00.000Z
                endTime: BigInt('1450242000000'), // 2015-12-16T05:00:00.000Z
                description: 'The primary ZIRP period where the Fed Funds Rate was held between 0-0.25%.',
                tags: ['monetary_policy', 'economic_stimulus', 'post_gfc'],
            },
            {
                segmentId: 'slow_normalization',
                startTime: BigInt('1450242000001'), // Immediately after first hike
                endTime: BigInt('1584244800000'), // 2020-03-15T04:00:00.000Z (Rates cut back to zero due to COVID-19)
                description: 'A period of slow, incremental interest rate hikes and policy normalization.',
                tags: ['monetary_policy', 'normalization', 'rate_hikes'],
            },
            {
                segmentId: 'end_of_era',
                startTime: BigInt('1647316800000'), // 2022-03-15T04:00:00.000Z (First major post-COVID hike)
                endTime: BigInt('1689048000000'), // 2023-07-11T04:00:00.000Z (Approximate peak of the hiking cycle)
                description: 'The definitive end of the cheap money era, characterized by rapid and aggressive rate hikes to combat high inflation.',
                tags: ['monetary_policy', 'inflation_fighting', 'market_correction', 'tech_layoffs'],
            },
        ],
        keyframes: [
            {
                id: 'zirp_begins',
                timestamp: BigInt('1229403600000'), // 2008-12-16T05:00:00.000Z
                significance: 1.0,
                description: 'The FOMC lowers the target for the federal funds rate to a range of 0 to 0.25 percent in response to the Global Financial Crisis.',
                tags: ['policy_change', 'economic_crisis', 'federal_reserve'],
                certainty: 1.0,
            },
            {
                id: 'zirp_ends',
                timestamp: BigInt('1450242000000'), // 2015-12-16T05:00:00.000Z
                significance: 0.95,
                description: 'The FOMC raises the target range for the federal funds rate to 0.25 to 0.50 percent, the first rate hike in nearly a decade, signaling the end of ZIRP.',
                tags: ['policy_change', 'liftoff', 'economic_recovery'],
                certainty: 1.0,
            },
            {
                id: 'aggressive_hikes_begin',
                timestamp: BigInt('1647316800000'), // 2022-03-15T04:00:00.000Z
                significance: 0.98,
                description: 'The FOMC begins a series of aggressive interest rate hikes to combat the highest inflation in 40 years, definitively ending the era of cheap money.',
                tags: ['inflation', 'policy_shift', 'market_shock'],
                certainty: 1.0,
            },
        ],
        windows: {
            strategy: 'phase_based',
            avgWindowSize: 'P4Y', // Average phase duration is roughly 4 years
        },
    },
    metadata: {
        canonicalName: 'US Zero Interest-Rate Policy Era',
        creators: ['Federal Reserve', 'US Government'],
        released: new Date('2008-12-16T00:00:00.000Z'),
        cultural_significance: 0.92,
        description: 'A multi-year period of near-zero interest rates designed to stimulate the US economy after the 2008 financial crisis.',
    },
} as unknown as Universe;
