// Add Tolkien's WWI experience and Middle-earth for multilayer reference testing
import {TimePrecision, Universe, UniverseType} from '../../core';

export const tolkienWWIExperience: Universe = {
    universeId: "personal:tolkien:wwi_experience:1916",
    type: UniverseType.PERSONAL_EXPERIENCE,
    epochs: {},
    identifiers: {
        primary: "personal:tolkien:wwi_experience:1916",
        aliases: ["tolkien_war", "jrr_tolkien_wwi"]
    },
    realityRelation: {
        type: 'documentary',
        fictionalizationDegree: 0.0,
        realityAnchors: [
            {
                realEventId: "history:wwi:battle_of_somme:1916",
                relationshipType: 'experienced',
                confidence: 1.0,
                evidence: ["Military records", "Biographical sources"]
            }
        ]
    },
    attribution: {
        public_domain: true,
        sources: ["Tolkien biographies", "Military records", "Personal letters"],
        citations_required: false
    },
    layers: [
        {
            layerId: "service_period",
            type: 'primary',
            epochs: {
                military_service: {
                    epochId: "tolkien:wwi_service",
                    startTime: BigInt(Date.UTC(1916, 0, 1)) * 1000000n,
                    endTime: BigInt(Date.UTC(1916, 11, 31)) * 1000000n,
                    precision: TimePrecision.YEAR,
                    description: "Tolkien's WWI military service period"
                }
            }
        }
    ],
    temporalStructure: {
        segments: [
            {
                id: "training",
                start: BigInt(Date.UTC(1916, 0, 1)) * 1000000n,
                end: BigInt(Date.UTC(1916, 5, 1)) * 1000000n,
                type: "phase"
            },
            {
                id: "somme_deployment",
                start: BigInt(Date.UTC(1916, 5, 27)) * 1000000n,
                end: BigInt(Date.UTC(1916, 9, 27)) * 1000000n,
                type: "phase"
            }
        ],
        keyframes: [
            {
                id: "arrives_somme",
                timestamp: BigInt(Date.UTC(1916, 5, 27)) * 1000000n,
                significance: 0.9,
                tags: ["deployment", "trauma", "formative_experience"]
            },
            {
                id: "trench_fever",
                timestamp: BigInt(Date.UTC(1916, 9, 27)) * 1000000n,
                significance: 0.8,
                tags: ["illness", "evacuation", "survival"]
            }
        ],
        windows: {
            strategy: 'time_based'
        }
    },
    metadata: {
        canonicalName: "Tolkien's WWI Experience",
        creators: ["J.R.R. Tolkien"],
        released: new Date("1916-01-01"),
        cultural_significance: 0.85
    }
};