import {
    Universe,
    UniverseType,
    TimePrecision,
    createHistoricalUniverseId,
} from '../../../core';
import { CommonUniverseIds } from '../../../core/common-universe-ids';

/**
 * Ukraine: Path to Conflict (1991-2014)
 *
 * This universe documents the critical historical period for Ukraine, beginning with its declaration of
 * independence from the collapsing Soviet Union and culminating in the initial phase of armed conflict
 * with Russia. It covers the nation's struggle for sovereignty, its geopolitical balancing act between
 * Western and Russian spheres of influence, and the internal political turmoil that ultimately led to
 * the Revolution of Dignity, the annexation of Crimea, and the war in Donbas.
 *
 * Cultural Significance: 1.0 - This sequence of events represents a major geopolitical shift in post-Cold
 * War Europe, directly leading to the largest land war on the continent since World War II. Its impact on
 * international law, global alliances (like NATO), and energy security is profound and ongoing.
 *
 * Reality Relation: Documentary with 0.0 fictionalization. This universe is based entirely on documented
 * historical events.
 *
 * Research Sources:
 * - Council on Foreign Relations: "Conflict in Ukraine" (https://www.cfr.org/global-conflict-tracker/conflict/conflict-ukraine)
 * - Britannica Encyclopedia: "Ukraine crisis of 2013-14", "Orange Revolution"
 * - NATO Archives: "Charter on a Distinctive Partnership between NATO and Ukraine" (July 9, 1997)
 * - United Nations General Assembly Resolution 68/262: "Territorial integrity of Ukraine"
 * - Associated Press & Reuters archives (1991-2014)
 * - Wilson Center, Kennan Institute publications on Ukrainian history.
 *
 * Key Facts Verified:
 * - Ukraine Independence Declared: August 24, 1991. Referendum: December 1, 1991. 【1】【2】
 * - Orange Revolution: November 2004 - January 2005. 【3】【4】
 * - Euromaidan/Revolution of Dignity: November 21, 2013 - February 22, 2014. 【5】【6】
 * - Russian Annexation of Crimea: February 20 - March 18, 2014. 【7】【8】
 * - War in Donbas Start: April 6, 2014. 【9】
 *
 * Hierarchical Context: UKRAINE_HISTORY -> SOVIET_UNION_COLLAPSE -> COLD_WAR -> WORLD_HISTORY
 * Applicable Parent Universes: [CommonUniverseIds.COLD_WAR, CommonUniverseIds.WORLD_HISTORY]
 */
export const ukraineWarOriginsUniverse: Universe = {
    universeId: createHistoricalUniverseId(
        'ukraine',
        'path_to_conflict',
        '1991_2014'
    ),
    type: UniverseType.HISTORICAL_EVENT,
    epochs: undefined,
    identifiers: {
        primary: 'history:ukraine:path_to_conflict:1991-2014',
        aliases: [
            'Post-Soviet Ukraine History',
            'Origins of the Russo-Ukrainian War',
        ],
    },
    realityRelation: {
        type: 'documents',
        fictionalizationDegree: 0.0,
        realityAnchors: [
            {
                realWorldEvent: "Dissolution of the Soviet Union",
                confidence: 1.0,
                evidence: [
                    'Belovezha Accords (December 8, 1991)',
                    'Alma-Ata Protocol (December 21, 1991)',
                ],
            },
            {
                realWorldEvent: "NATO Enlargement",
                confidence: 1.0,
                evidence: [
                    'NATO summit records (1997, 1999, 2004)',
                    'Charter on a Distinctive Partnership with Ukraine (1997)',
                ],
            },
            {
                realWorldEvent: "Russo-Ukrainian War",
                confidence: 1.0,
                evidence: [
                    'UN General Assembly Resolution 68/262',
                    'OSCE Special Monitoring Mission to Ukraine reports',
                ],
            },
        ],
    },
    attribution: {
        public_domain: true,
        sources: [
            'Council on Foreign Relations',
            'Britannica',
            'NATO Archives',
            'United Nations',
        ],
        citations_required: true,
        usage_restrictions: [
            'Subject to historical interpretation; cross-reference with primary sources is advised.',
        ],
    },
    layers: [
        {
            layerId: 'primary_events',
            type: 'primary',
            epochs: {
                independence_era: {
                    epochId: 'era:ukraine:independence:1991-2004',
                    startTime: BigInt('682876800000'), // 1991-08-24T00:00:00Z
                    endTime: BigInt('1101081599000'), // 2004-11-21T23:59:59Z
                    precision: TimePrecision.DAY,
                    description:
                        "Period following Ukraine's declaration of independence, characterized by nation-building, economic struggles, and navigating relations with Russia and the West.",
                },
                revolutionary_period: {
                    epochId: 'era:ukraine:revolutions:2004-2014',
                    startTime: BigInt('1101081600000'), // 2004-11-22T00:00:00Z
                    endTime: BigInt('1391126399000'), // 2014-01-31T23:59:59Z
                    precision: TimePrecision.DAY,
                    description:
                        'A decade of intense political turmoil, including two major pro-Western revolutions (Orange and Euromaidan) that defined Ukraine\'s geopolitical orientation.',
                },
                conflict_begins: {
                    epochId: 'era:ukraine:conflict_begins:2014',
                    startTime: BigInt('1391126400000'), // 2014-02-01T00:00:00Z
                    endTime: BigInt('1419983999000'), // 2014-12-31T23:59:59Z
                    precision: TimePrecision.DAY,
                    description:
                        'The immediate aftermath of the Revolution of Dignity, leading to the Russian annexation of Crimea and the start of the war in Donbas.',
                },
            },
        },
    ],
    temporalStructure: {
        segments: [
            {
                segmentId: 'independence_and_early_statehood',
                startTime: BigInt('682876800000'), // 1991-08-24
                endTime: BigInt('1101081599000'), // 2004-11-21
                description:
                    'From independence to the eve of the Orange Revolution.',
            },
            {
                segmentId: 'political_upheaval_and_geopolitical_shift',
                startTime: BigInt('1101081600000'), // 2004-11-22
                endTime: BigInt('1396742400000'), // 2014-04-06
                description:
                    'From the Orange Revolution to the start of the Donbas war.',
            },
        ],
        keyframes: [
            {
                id: 'declaration_of_independence',
                timestamp: BigInt('682910400000'), // 1991-08-24T17:00:00Z (approximate time of Act)
                significance: 1.0,
                tags: ['sovereignty', 'nation-building', 'soviet_collapse'],
                certainty: 1.0,
                description:
                    "The Verkhovna Rada of the Ukrainian SSR declares Ukraine's independence from the Soviet Union, a pivotal moment confirmed by a national referendum in December 1991. 【10】",
            },
            {
                id: 'nato_charter_partnership',
                timestamp: BigInt('868430400000'), // 1997-07-09T00:00:00Z
                significance: 0.8,
                tags: ['nato', 'foreign_policy', 'geopolitics'],
                certainty: 1.0,
                description:
                    'Ukraine and NATO sign the Charter on a Distinctive Partnership, establishing a formal consultation mechanism and signaling Ukraine\'s Western foreign policy alignment. 【11】【12】',
            },
            {
                id: 'orange_revolution_begins',
                timestamp: BigInt('1101081600000'), // 2004-11-22T00:00:00Z
                significance: 0.95,
                tags: ['revolution', 'democracy', 'protest', 'election_fraud'],
                certainty: 1.0,
                description:
                    'Widespread protests begin against the fraudulent results of the 2004 presidential run-off election, ultimately leading to an annulment and a repeat vote. 【13】【14】',
            },
            {
                id: 'euromaidan_begins',
                timestamp: BigInt('1385000400000'), // 2013-11-21T00:00:00Z
                significance: 0.95,
                tags: ['protest', 'eu_integration', 'revolution'],
                certainty: 1.0,
                description:
                    'Protests erupt in Kyiv after President Viktor Yanukovych\'s government suspends preparations for signing an Association Agreement with the European Union. 【5】【15】',
            },
            {
                id: 'yanukovych_ousted',
                timestamp: BigInt('1393027200000'), // 2014-02-22T00:00:00Z
                significance: 1.0,
                tags: ['revolution_of_dignity', 'regime_change', 'geopolitics'],
                certainty: 1.0,
                description:
                    'Following deadly clashes, President Yanukovych flees Kyiv and is removed from office by the Ukrainian Parliament, marking the climax of the Revolution of Dignity. 【6】【9】',
            },
            {
                id: 'crimea_annexation_begins',
                timestamp: BigInt('1392854400000'), // 2014-02-20T00:00:00Z (Official Ukrainian date for start of occupation)
                significance: 1.0,
                tags: ['invasion', 'annexation', 'international_law'],
                certainty: 1.0,
                description:
                    'Unmarked Russian troops begin seizing control of the Crimean Peninsula, initiating the process of its annexation by the Russian Federation. 【9】【16】',
            },
            {
                id: 'donbas_war_begins',
                timestamp: BigInt('1396742400000'), // 2014-04-06T00:00:00Z
                significance: 1.0,
                tags: ['war', 'separatism', 'conflict'],
                certainty: 1.0,
                description:
                    'Pro-Russian separatist groups, supported by Russia, seize government buildings in Donetsk and Luhansk, sparking the armed conflict known as the War in Donbas. 【9】',
            },
        ],
        windows: {
            strategy: 'point_in_time',
        },
    },
    metadata: {
        canonicalName: 'Ukraine: Path to Conflict (1991-2014)',
        creators: ['Historical Actors of Ukraine, Russia, USA, and EU'],
        released: new Date('1991-08-24'),
        cultural_significance: 1.0,
        description:
            'A historical timeline detailing the key events from Ukrainian independence to the onset of the Russo-Ukrainian War in 2014.',
    },
} as unknown as Universe;
