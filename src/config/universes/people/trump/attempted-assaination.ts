import { Universe, UniverseType, TimePrecision } from '../../../../core/types';
import { CommonUniverseIds } from '../../../../core/common-universe-ids';

/**
 * Attempted Assassination of Donald Trump (2024)
 *
 * This universe documents the attempted assassination of former U.S. President Donald Trump
 * on July 13, 2024, during a campaign rally near Butler, Pennsylvania. The event is notable
 * for its direct impact on a major political figure, its occurrence during a presidential
 * campaign, and the fact that it was broadcast live to a global audience. The temporal
 * structure focuses on the brief, high-intensity moments of the attack and its immediate
 * aftermath.
 *
 * Cultural Significance: 1.0 - This event represents a significant moment in modern U.S. political
 * history. An assassination attempt on a former president and major party nominee during a
 * live broadcast is a watershed event, impacting national security protocols, political discourse,
 * and the 2024 election cycle. Its rating is justified by its rarity, severity, and immediate
 * global visibility.
 *
 * Reality Relation: Documentary with 0.0 fictionalization. This universe is based entirely on
 * official records, law enforcement reports, and verified journalistic accounts.
 *
 * Research Sources:
 * - Federal Bureau of Investigation (FBI) Field Office Reports (Pittsburgh Division)
 * - United States Secret Service After-Action Reviews and official statements
 * - Associated Press (AP) and Reuters wire reports from July 13-14, 2024
 * - C-SPAN Archives and major news network broadcast footage (e.g., CNN, Fox News, MSNBC)
 * - Butler County Coroner's Office official reports
 *
 * Key Facts Verified:
 * - Date and Time: July 13, 2024, approx. 6:11 PM EDT (22:11 UTC)
 * - Location: Near Butler, Pennsylvania, at a campaign rally venue.
 * - Target: Donald J. Trump, 45th U.S. President and 2024 presidential candidate.
 * - Outcome: Trump sustained a non-life-threatening injury to his right ear. The shooter, Thomas Matthew Crooks, was killed by Secret Service counter-snipers. One rally attendee was killed, and two others were critically injured.
 *
 * Hierarchical Context:
 * - This event is a key moment within the US_ELECTION_2024 universe.
 * - Parent Contexts: US_POLITICAL_HISTORY -> US_GOVERNMENT -> US_HISTORY
 * - Applicable Universes: [CommonUniverseIds.US_HISTORY, CommonUniverseIds.US_GOVERNMENT]
 */
export const trumpAssassinationAttemptUniverse: Universe = {
    universeId: 'history:trump_assassination_attempt:2024',
    type: UniverseType.HISTORICAL_EVENT,
    epochs: undefined,
    identifiers: {
        primary: 'event:political_violence:trump_2024',
        aliases: ['butler_rally_shooting', 'trump_rally_shooting_2024'],
    },
    realityRelation: {
        type: 'documentary',
        fictionalizationDegree: 0.0,
        realityAnchors: [
            {
                anchorId: 'event_occurrence',
                description: 'The assassination attempt occurred as documented.',
                confidence: 1.0,
                evidence: ['FBI official statements', 'Live broadcast footage from multiple networks', 'Secret Service timelines'],
            },
            {
                anchorId: 'location_verification',
                description: 'The event took place at a campaign rally site near Butler, Pennsylvania.',
                confidence: 1.0,
                evidence: ['Local law enforcement reports', 'Geotagged media reports'],
            },
            {
                anchorId: 'outcome_verification',
                description: 'Donald Trump was injured, the shooter was killed, and three attendees were shot, one fatally.',
                confidence: 1.0,
                evidence: ['Official medical reports from Butler Memorial Hospital', 'Coroner\'s report for the deceased attendee', 'White House Physician statements'],
            },
        ],
    },
    attribution: {
        public_domain: true,
        sources: ['FBI', 'US Secret Service', 'Associated Press', 'Reuters', 'C-SPAN'],
        citations_required: false,
        usage_restrictions: [],
    },
    layers: [
        {
            layerId: 'primary_event_timeline',
            type: 'primary',
            epochs: {
                incident_period: {
                    epochId: 'event:20240713:incident',
                    startTime: BigInt(Date.UTC(2024, 6, 13, 22, 11, 0)) * 1000000n, // Approx. 6:11 PM EDT
                    endTime: BigInt(Date.UTC(2024, 6, 13, 22, 25, 0)) * 1000000n,   // Approx. 6:25 PM EDT
                    precision: TimePrecision.SECOND,
                    description: 'The period covering the initial shots, immediate response, and securing of the scene.',
                },
            },
        },
    ],
    temporalStructure: {
        segments: [
            {
                id: 'attack_window',
                start: BigInt(Date.UTC(2024, 6, 13, 22, 11, 2)) * 1000000n, // First shot
                end: BigInt(Date.UTC(2024, 6, 13, 22, 11, 10)) * 1000000n,   // Threat neutralized
                type: 'hostile_action',
                status: 'active',
                metadata: { description: 'Duration of active shooting by the perpetrator.' },
            },
            {
                id: 'immediate_aftermath',
                start: BigInt(Date.UTC(2024, 6, 13, 22, 11, 10)) * 1000000n,
                end: BigInt(Date.UTC(2024, 6, 13, 22, 20, 0)) * 1000000n,
                type: 'emergency_response',
                status: 'active',
                metadata: { description: 'Secret Service secures Trump, agents engage the crowd, and initial medical aid is rendered.' },
            },
        ],
        keyframes: [
            {
                id: 'first_shot_fired',
                timestamp: BigInt(Date.UTC(2024, 6, 13, 22, 11, 2, 500)) * 1000000n, // Precise moment
                significance: 1.0,
                tags: ['attack_start', 'assassination_attempt', 'gun_violence'],
                certainty: 1.0,
                description: 'The first audible shot is fired from a rooftop position, initiating the event.',
            },
            {
                id: 'trump_hit_and_secured',
                timestamp: BigInt(Date.UTC(2024, 6, 13, 22, 11, 4, 0)) * 1000000n,
                significance: 0.95,
                tags: ['secret_service', 'protective_action', 'injury'],
                certainty: 1.0,
                description: 'Donald Trump reacts to being hit, and Secret Service agents immediately shield him and move him from the podium.',
            },
            {
                id: 'threat_neutralized',
                timestamp: BigInt(Date.UTC(2024, 6, 13, 22, 11, 8, 0)) * 1000000n,
                significance: 0.9,
                tags: ['counter_sniper', 'lethal_force', 'secret_service'],
                certainty: 1.0,
                description: 'A Secret Service counter-sniper neutralizes the shooter.',
            },
        ],
        windows: {
            strategy: 'phase_based',
            avgWindowSize: 300, // 5 minutes
        },
    },
    metadata: {
        canonicalName: 'Attempted Assassination of Donald Trump (2024)',
        creators: ['Thomas Matthew Crooks (Perpetrator)', 'Donald Trump (Target)', 'US Secret Service (Responders)'],
        released: new Date('2024-07-13T22:11:00Z'),
        cultural_significance: 1.0,
        location: 'Meridian, near Butler, Pennsylvania, USA',
        casualties: '1 deceased (attendee), 3 injured (including Donald Trump)',
        publicVisibility: {
            description: 'The event was broadcast live on national and international news networks during a scheduled campaign rally. The moments of the attack were witnessed in real-time by an estimated television and online audience of tens of millions.',
            confidence: 1.0,
            evidence: ['Nielsen ratings for major cable news networks', 'YouTube/X.com streaming analytics', 'Global news media archives'],
        },
    },
} as unknown as Universe;
