import {
    Universe,
    UniverseType,
    TimePrecision,
    createHistoricalUniverseId,
} from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';

/**
 * Gaza: Israel-Hamas War (2023-2025)
 *
 * This universe documents the major events of the war in Gaza that began on October 7, 2023, following a large-scale attack by Hamas on southern Israel. It covers the initial attack, the subsequent Israeli military response, the ensuing humanitarian crisis, and the complex international diplomatic reactions. The universe highlights the critical role of Al Jazeera's on-the-ground reporting in shaping global understanding of the conflict.
 *
 * Cultural Significance: 1.0 - This conflict represents one of the most significant geopolitical events of the early 21st century, triggering a severe humanitarian crisis, widespread international protests, and legal challenges in international courts. It has profoundly impacted Israeli-Palestinian relations and reshaped diplomatic alignments in the Middle East and globally.
 *
 * Reality Relation: Documentary with 0.0 fictionalization. This universe is based entirely on documented historical events.
 *
 * Research Sources:
 * - Al Jazeera Media Network: Continuous live coverage, special reports, and field journalism from Gaza. 【1】
 * - United Nations (OCHA, UNRWA, OHCHR): Situation reports, press briefings, and resolutions. 【2】
 * - Council on Foreign Relations: "Conflict in Ukraine" (for comparative context on international response).
 * - Reuters & Associated Press: News archives and timelines of the conflict. 【3】
 * - Human Rights Watch & Amnesty International: Reports on human rights conditions and potential war crimes. 【4】
 * - Official statements from the governments of Israel, the Palestinian Authority, the United States, the European Union, and the Arab League. 【5】
 *
 * Key Facts Verified:
 * - Conflict Start Date: October 7, 2023.
 * - Israeli Ground Invasion of Gaza Begins: October 27, 2023.
 * - Humanitarian Crisis: Widespread famine and displacement reported by UN agencies by early 2024. 【6】
 * - Al Jazeera's Role: The network's offices were targeted, and several of its journalists were killed while reporting, making its coverage a central part of the story. 【7】
 *
 *
 * Hierarchical Context: ISRAELI_PALESTINIAN_CONFLICT -> MIDDLE_EAST_HISTORY -> WORLD_HISTORY
 * Applicable Parent Universes: [CommonUniverseIds.WORLD_HISTORY]
 */
export const gazaConflict2023Universe: Universe = {
    universeId: createHistoricalUniverseId(
        'gaza',
        'israel_hamas_war',
        '2023_2025'
    ),
    type: UniverseType.HISTORICAL_EVENT,
    epochs: undefined,
    identifiers: {
        primary: 'history:gaza:israel_hamas_war:2023-2025',
        aliases: ['Gaza War 2023', 'Operation Al-Aqsa Flood', 'Operation Iron Swords'],
    },
    realityRelation: {
        type: 'documents',
        fictionalizationDegree: 0.0,
        realityAnchors: [
            {
                realWorldEvent: 'October 7 Hamas-led attack on Israel',
                confidence: 1.0,
                evidence: [
                    'Official statements from the Israeli government',
                    'Verified video footage and eyewitness accounts',
                    'Reporting from international news agencies',
                ],
            },
            {
                realWorldEvent: 'Israeli military operations in Gaza',
                confidence: 1.0,
                evidence: [
                    'IDF Spokesperson\'s Unit announcements',
                    'Satellite imagery analysis of Gaza',
                    'On-the-ground reporting from Al Jazeera and other news outlets',
                ],
            },
            {
                realWorldEvent: 'Gaza humanitarian crisis',
                confidence: 1.0,
                evidence: [
                    'UN Office for the Coordination of Humanitarian Affairs (OCHA) reports',
                    'World Food Programme (WFP) famine warnings',
                    'Statements from international NGOs operating in Gaza',
                ],
            },
        ],
    },
    attribution: {
        public_domain: true,
        sources: [
            'Al Jazeera Media Network',
            'United Nations',
            'Reuters',
            'Associated Press',
            'Amnesty International',
        ],
        citations_required: true,
        usage_restrictions: [
            'The situation is ongoing and subject to intense information warfare. Casualty figures from different sources vary and are contested. Cross-reference with primary sources is essential.',
        ],
    },
    layers: [
        {
            layerId: 'primary_conflict_phase',
            type: 'primary',
            epochs: {
                initial_assault_and_response: {
                    epochId: 'era:gaza:initial_assault:2023',
                    startTime: BigInt('1696636800000'), // 2023-10-07T00:00:00Z
                    endTime: BigInt('1698364799000'), // 2023-10-26T23:59:59Z
                    precision: TimePrecision.DAY,
                    description:
                        'Begins with the Hamas-led attack on Israel and covers the initial phase of Israeli airstrikes on Gaza before the ground invasion.',
                },
                ground_invasion_and_humanitarian_crisis: {
                    epochId: 'era:gaza:ground_invasion:2023-2025',
                    startTime: BigInt('1698364800000'), // 2023-10-27T00:00:00Z
                    endTime: BigInt('1757548799000'), // 2025-12-31T23:59:59Z (ongoing)
                    precision: TimePrecision.DAY,
                    description:
                        'Covers the period of intense Israeli ground operations, the systematic destruction of infrastructure, mass displacement, and the severe humanitarian crisis, including famine.',
                },
            },
        },
    ],
    temporalStructure: {
        segments: [
            {
                segmentId: 'initial_conflict_and_escalation',
                startTime: BigInt('1696636800000'), // 2023-10-07
                endTime: BigInt('1703980799000'), // 2023-12-31
                description:
                    'From the initial Hamas attack through the first months of intense Israeli bombardment and ground operations.',
            },
            {
                segmentId: 'protracted_war_and_diplomacy',
                startTime: BigInt('1704067200000'), // 2024-01-01
                endTime: BigInt('1757548799000'), // 2025-12-31 (ongoing)
                description:
                    'Characterized by ongoing military operations, a deepening humanitarian catastrophe, and persistent but largely unsuccessful international diplomatic efforts for a sustained ceasefire.',
            },
        ],
        keyframes: [
            {
                id: 'hamas_attack_on_israel',
                timestamp: BigInt('1696649400000'), // 2023-10-07T03:30:00Z
                significance: 1.0,
                tags: ['attack', 'casus_belli', 'israel', 'hamas'],
                certainty: 1.0,
                description:
                    'Hamas launches a large-scale, coordinated surprise attack on southern Israel from the Gaza Strip, killing hundreds and taking numerous hostages, initiating the war.',
            },
            {
                id: 'israel_declares_war_begins_airstrikes',
                timestamp: BigInt('1696723200000'), // 2023-10-08T00:00:00Z
                significance: 1.0,
                tags: ['declaration_of_war', 'airstrikes', 'retaliation'],
                certainty: 1.0,
                description:
                    'Israel formally declares war on Hamas and commences an intense bombing campaign across the Gaza Strip. US President Biden issues a statement affirming "rock-solid and unwavering" support for Israel.',
            },
            {
                id: 'israeli_ground_invasion_begins',
                timestamp: BigInt('1698451200000'), // 2023-10-28T00:00:00Z
                significance: 0.95,
                tags: ['invasion', 'ground_offensive', 'escalation'],
                certainty: 1.0,
                description:
                    'The Israel Defense Forces (IDF) launch a large-scale ground invasion into the northern Gaza Strip, marking a new phase of the conflict.',
            },
            {
                id: 'un_warns_of_famine',
                timestamp: BigInt('1709251200000'), // 2024-03-01T00:00:00Z
                significance: 0.9,
                tags: ['humanitarian_crisis', 'famine', 'united_nations', 'aid_blockade'],
                certainty: 1.0,
                description:
                    'UN agencies and humanitarian organizations formally warn of widespread famine in northern Gaza due to the ongoing conflict and restrictions on aid delivery. UN Secretary-General António Guterres states, "The level of death and destruction is shocking." 【8】',
            },
            {
                id: 'joint_statement_for_ceasefire',
                timestamp: BigInt('1753166400000'), // 2025-07-21T00:00:00Z
                significance: 0.8,
                tags: ['diplomacy', 'ceasefire', 'international_pressure'],
                certainty: 1.0,
                description:
                    'A coalition of 28 countries, including many Western nations, issues a joint statement demanding an immediate end to the war in Gaza, reflecting growing international pressure on Israel. 【9】【10】',
            },
            {
                id: 'arab_league_condemns_hamas',
                timestamp: BigInt('1753924800000'), // 2025-07-30T00:00:00Z
                significance: 0.85,
                tags: ['diplomacy', 'arab_league', 'hamas', 'two_state_solution'],
                certainty: 1.0,
                description:
                    'In a significant diplomatic shift, the Arab League issues a declaration condemning the October 7 attacks by Hamas and calling for the group to disarm as part of a two-state solution. 【11】【12】',
            },
            {
                id: 'israel_begins_gaza_city_operation',
                timestamp: BigInt('1756804800000'), // 2025-09-01T00:00:00Z
                significance: 0.9,
                tags: ['gaza_city', 'escalation', 'displacement'],
                certainty: 1.0,
                description:
                    'Israel announces a major new operation in Gaza City, ordering mass evacuations and intensifying airstrikes, leading to widespread condemnation. Amnesty International calls it a move that will have "catastrophic and irreversible consequences." 【4】',
            },
            {
                id: 'eu_proposes_sanctions',
                timestamp: BigInt('1757548800000'), // 2025-09-10T00:00:00Z
                significance: 0.85,
                tags: ['eu', 'sanctions', 'diplomacy', 'international_pressure'],
                certainty: 1.0,
                description:
                    'European Commission President Ursula von der Leyen announces plans to seek sanctions and a partial trade suspension against Israel over the war, signaling a major shift in EU policy. 【13】',
            },
        ],
        windows: {
            strategy: 'point_in_time',
        },
    },
    metadata: {
        canonicalName: 'Gaza: Israel-Hamas War (2023-2025)',
        creators: ['Historical Actors of Israel, Hamas, Palestinian Authority, USA, EU, UN, and Arab Nations'],
        released: new Date('2023-10-07'),
        cultural_significance: 1.0,
        description:
            'A historical timeline of the Israel-Hamas War starting in October 2023, detailing military operations, the humanitarian impact, and key international statements. Special focus is given to the on-the-ground reporting by Al Jazeera.',
    },
} as unknown as Universe;
