import {TimePrecision, Universe, UniverseType} from '../../core';

export const middleEarthUniverse: Universe = {
    universeId: "literature:tolkien:lotr:1954",
    type: UniverseType.BOOK,
    epochs: {},
    identifiers: {
        primary: {type: 'isbn', value: '978-0544003415'},
        aliases: ["lord_of_the_rings", "lotr", "middle_earth"]
    },
    realityRelation: {
        type: 'inspired_by',
        fictionalizationDegree: 0.9,
        realityAnchors: [
            {
                realEventId: "personal:tolkien:wwi_experience:1916",
                relationshipType: 'inspired_by',
                confidence: 0.8,
                evidence: ["Tolkien letters", "Literary analysis", "Biographical studies"]
            },
            {
                realEventId: "geography:england:countryside",
                relationshipType: 'inspired_by',
                confidence: 0.9,
                evidence: ["Tolkien statements", "Geographic analysis"]
            }
        ]
    },
    attribution: {
        copyright: {
            holders: ["The Tolkien Estate"],
            year: 1954,
            status: 'active'
        },
        creators: {
            writer: ["J.R.R. Tolkien"]
        },
        citations_required: true,
        usage_restrictions: ["Fair use for criticism and comment"]
    },
    layers: [
        {
            layerId: "narrative_timeline",
            type: 'primary',
            epochs: {
                third_age: {
                    epochId: "middle_earth:third_age",
                    startTime: 0n, // Relative to Third Age calendar
                    endTime: 3021n * BigInt(TimePrecision.YEAR),
                    precision: TimePrecision.YEAR,
                    description: "Third Age of Middle-earth"
                }
            }
        },
        {
            layerId: "war_of_the_ring",
            type: 'primary',
            epochs: {
                war_period: {
                    epochId: "middle_earth:war_of_ring",
                    startTime: 3018n * BigInt(TimePrecision.YEAR),
                    endTime: 3019n * BigInt(TimePrecision.YEAR),
                    precision: TimePrecision.DAY,
                    description: "War of the Ring period"
                }
            }
        }
    ],
    temporalStructure: {
        segments: [
            {
                id: "dead_marshes",
                start: 3019n * BigInt(TimePrecision.YEAR) + 62n * BigInt(TimePrecision.DAY),
                end: 3019n * BigInt(TimePrecision.YEAR) + 63n * BigInt(TimePrecision.DAY),
                type: "scene"
            },
            {
                id: "isengard_destruction",
                start: 3019n * BigInt(TimePrecision.YEAR) + 59n * BigInt(TimePrecision.DAY),
                end: 3019n * BigInt(TimePrecision.YEAR) + 60n * BigInt(TimePrecision.DAY),
                type: "scene"
            }
        ],
        keyframes: [
            {
                id: "dead_marshes_passage",
                timestamp: 3019n * BigInt(TimePrecision.YEAR) + 62n * BigInt(TimePrecision.DAY),
                significance: 0.9,
                tags: ["war_trauma", "death", "mechanized_warfare_echo"]
            },
            {
                id: "saruman_industrialization",
                timestamp: 3019n * BigInt(TimePrecision.YEAR) + 59n * BigInt(TimePrecision.DAY),
                significance: 0.85,
                tags: ["industrialization", "environmental_destruction", "mechanized_warfare"]
            }
        ],
        windows: {
            strategy: 'scene_based'
        }
    },
    metadata: {
        canonicalName: "The Lord of the Rings",
        creators: ["J.R.R. Tolkien"],
        released: new Date("1954-07-29"),
        cultural_significance: 0.99
    }
};