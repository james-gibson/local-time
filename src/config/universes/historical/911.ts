import {
    Universe,
    UniverseType,
    TimePrecision,
    createHistoricalUniverseId,
} from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';

/**
 * The September 11, 2001 Attacks
 *
 * This universe documents the coordinated terrorist attacks by al-Qaeda against the United States on the morning of September 11, 2001. The attacks resulted in 2,977 fatalities, over 25,000 injuries, and substantial long-term health consequences, in addition to at least $10 billion in infrastructure and property damage. It was the single deadliest terrorist attack in human history.
 *
 * The temporal structure focuses on the critical two-hour period during which the attacks unfolded, from the first impact at the World Trade Center to the collapse of the North Tower. This event fundamentally reshaped American foreign policy, domestic security, and air travel, and its repercussions continue to influence global politics.
 *
 * Cultural Significance: 1.0 - A watershed moment in modern world history. The attacks triggered the multi-decade Global War on Terrorism, led to the creation of the Department of Homeland Security, and profoundly altered the geopolitical landscape of the 21st century. Its impact on the global psyche, security policies, and international relations is immeasurable.
 * Reality Relation: Documentary with 0.0 fictionalization. This universe documents a real, extensively recorded historical event.
 *
 * Research Sources:
 * - The 9/11 Commission Report (Final Report of the National Commission on Terrorist Attacks Upon the United States, official U.S. government report).
 * - National Institute of Standards and Technology (NIST) Reports on the collapse of the World Trade Center towers (NCSTAR 1).
 * - National September 11 Memorial & Museum Archives.
 * - Federal Aviation Administration (FAA) and North American Aerospace Defense Command (NORAD) records from September 11, 2001.
 *
 * Key Facts Verified (All times are EDT - UTC-4):
 * - 8:46:40 AM: American Airlines Flight 11 impacts the North Tower of the World Trade Center.
 * - 9:03:02 AM: United Airlines Flight 175 impacts the South Tower of the World Trade Center.
 * - 9:37:46 AM: American Airlines Flight 77 impacts the Pentagon.
 * - 9:59:00 AM: The South Tower collapses.
 * - 10:03:11 AM: United Airlines Flight 93 crashes in Shanksville, Pennsylvania.
 * - 10:28:22 AM: The North Tower collapses.
 *
 * Hierarchical Context: US_GOVERNMENT -> US_HISTORY -> WORLD_HISTORY
 * Natural Connections Discovered:
 * - This event is the direct catalyst for the 'Global War on Terrorism' universe.
 * - It directly involves entities within the US_GOVERNMENT, US_MILITARY, and global intelligence communities.
 */
export const september11AttacksUniverse: Universe = {
    universeId: createHistoricalUniverseId('us', 'september_11_attacks', '2001'),
    type: UniverseType.HISTORICAL_EVENT,
    epochs: undefined,
    identifiers: {
        primary: 'us_history:attack:september_11_2001',
        aliases: ['9/11', 'September 11th Attacks'],
    },
    realityRelation: {
        type: 'documents',
        fictionalizationDegree: 0.0,
        realityAnchors: [
            {
                anchorId: '911_commission_report',
                realWorldEntity: 'The 9/11 Commission Report',
                description:
                    'The definitive official government report detailing the circumstances and events of the attacks.',
                confidence: 1.0,
                evidence: ['Official publication by the U.S. Government Printing Office'],
            },
            {
                anchorId: 'nist_wtc_collapse_report',
                realWorldEntity: 'NIST NCSTAR 1 Report',
                description:
                    'The comprehensive scientific and engineering analysis of the collapse of the World Trade Center towers.',
                confidence: 1.0,
                evidence: ['Official publication by the National Institute of Standards and Technology'],
            },
            {
                anchorId: 'flight_recorders',
                realWorldEntity: 'Cockpit Voice and Flight Data Recorders',
                description:
                    'Data recovered from the four crashed aircraft providing timelines and audio evidence.',
                confidence: 1.0,
                evidence: ['NTSB transcripts and data analysis'],
            },
            {
                anchorId: 'faa_norad_records',
                realWorldEntity: 'FAA and NORAD Records',
                description: 'Air traffic control communications and military response logs from the day of the attacks.',
                confidence: 1.0,
                evidence: ['9/11 Commission Report appendices'],
            },
        ],
    },
    attribution: {
        public_domain: true,
        sources: ['9/11 Commission', 'NIST', 'National Archives', 'FAA'],
        citations_required: true,
        usage_restrictions: [
            'Use of imagery and personal accounts is subject to sensitivities and should be handled with respect for the victims.',
        ],
    },
    layers: [],
    temporalStructure: {
        segments: [
            {
                segmentId: 'attacks_unfold',
                startTime: BigInt('999991600000'), // 2001-09-11 08:46:40 EDT
                endTime: BigInt('999997702000'), // 2001-09-11 10:28:22 EDT
                description: 'The core period of the attacks, from the first impact to the collapse of the second tower.',
                tags: ['terrorism', 'mass_casualty_event', 'national_emergency'],
            },
        ],
        keyframes: [
            {
                id: 'north_tower_impact',
                timestamp: BigInt('999991600000'), // 08:46:40 EDT
                significance: 1.0,
                description: 'American Airlines Flight 11 strikes the North Tower of the World Trade Center between floors 93 and 99.',
                tags: ['wtc', 'flight_11', 'attack_begins'],
                certainty: 1.0,
            },
            {
                id: 'south_tower_impact',
                timestamp: BigInt('999992582000'), // 09:03:02 EDT
                significance: 1.0,
                description: 'United Airlines Flight 175 strikes the South Tower of the World Trade Center between floors 77 and 85, confirming a coordinated attack.',
                tags: ['wtc', 'flight_175', 'second_impact'],
                certainty: 1.0,
            },
            {
                id: 'pentagon_impact',
                timestamp: BigInt('999994666000'), // 09:37:46 EDT
                significance: 0.95,
                description: 'American Airlines Flight 77 crashes into the western facade of the Pentagon.',
                tags: ['pentagon', 'flight_77', 'attack_on_military_hq'],
                certainty: 1.0,
            },
            {
                id: 'south_tower_collapse',
                timestamp: BigInt('999995940000'), // 09:59:00 EDT
                significance: 1.0,
                description: 'The South Tower of the World Trade Center collapses after burning for 56 minutes.',
                tags: ['wtc', 'structural_failure', 'collapse'],
                certainty: 1.0,
            },
            {
                id: 'flight_93_crash',
                timestamp: BigInt('999996191000'), // 10:03:11 EDT
                significance: 0.98,
                description: 'United Airlines Flight 93, following a passenger revolt against the hijackers, crashes into a field in Shanksville, Pennsylvania.',
                tags: ['flight_93', 'passenger_revolt', 'shanksville'],
                certainty: 1.0,
            },
            {
                id: 'north_tower_collapse',
                timestamp: BigInt('999997702000'), // 10:28:22 EDT
                significance: 1.0,
                description: 'The North Tower of the World Trade Center collapses after burning for 102 minutes.',
                tags: ['wtc', 'structural_failure', 'collapse'],
                certainty: 1.0,
            },
        ],
        windows: {
            strategy: 'point_in_time',
        },
    },
    metadata: {
        canonicalName: 'September 11, 2001 Attacks',
        creators: ['al-Qaeda'],
        released: new Date('2001-09-11T12:46:40.000Z'),
        cultural_significance: 1.0,
        description: 'A series of four coordinated terrorist attacks by the Islamic terrorist group al-Qaeda against the United States on September 11, 2001.',
    },
} as unknown as Universe;
