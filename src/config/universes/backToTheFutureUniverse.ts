import {createUniverseId, TimePrecision, Universe, UniverseType} from '../../core';

export const backToTheFutureUniverse: Universe = {
    universeId: createUniverseId("film:bttf:1985"),
    type: UniverseType.FILM,
    epochs: undefined,
    identifiers: {
        primary: {type: 'film', value: 'tt0088763', year: 1985},
        aliases: ["back_to_the_future", "bttf"]
    },
    realityRelation: {
        type: 'pure_fiction',
        fictionalizationDegree: 1.0,
        realityAnchors: []
    },
    attribution: {
        copyright: {
            holders: ["Universal Pictures"],
            year: 1985,
            status: 'active'
        },
        creators: {
            director: ["Robert Zemeckis"],
            writer: ["Robert Zemeckis", "Bob Gale"]
        },
        citations_required: true,
        usage_restrictions: ["Fair use for criticism and comment"]
    },
    layers: [
        {
            layerId: "runtime",
            type: 'primary',
            epochs: {
                film: {
                    epochId: "bttf:runtime",
                    startTime: 0n,
                    endTime: 116n * 60n * 1000000000n, // 116 minutes
                    precision: TimePrecision.MILLISECOND,
                    description: "Film runtime"
                }
            }
        },
        {
            layerId: "narrative_1985",
            type: 'primary',
            epochs: {
                present: {
                    start: BigInt(Date.UTC(1985, 9, 26)) * 1000000n, // Oct 26, 1985
                    end: BigInt(Date.UTC(1985, 10, 5)) * 1000000n,   // Nov 5, 1985
                    precision: TimePrecision.MINUTE,
                    description: "1985 timeline events"
                }
            }
        },
        {
            layerId: "narrative_1955",
            type: 'primary',
            epochs: {
                past: {
                    start: BigInt(Date.UTC(1955, 10, 5)) * 1000000n,  // Nov 5, 1955
                    end: BigInt(Date.UTC(1955, 10, 12)) * 1000000n,   // Nov 12, 1955
                    precision: TimePrecision.MINUTE,
                    description: "1955 timeline events"
                }
            }
        }
    ],
    temporalStructure: {
        segments: [
            {
                id: "enchantment_dance",
                start: 85n * 60n * 1000000000n, // Around 85 minutes into film
                end: 90n * 60n * 1000000000n,
                type: "sequence"
            }
        ],
        keyframes: [
            {
                id: "johnny_b_goode_performance",
                timestamp: 87n * 60n * 1000000000n,
                significance: 0.9,
                tags: ["temporal_paradox", "cultural_reference", "music"]
            },
            {
                id: "calvin_klein_underwear",
                timestamp: 45n * 60n * 1000000000n,
                significance: 0.8,
                tags: ["anachronism", "product_placement", "identity_confusion"]
            }
        ],
        windows: {
            strategy: 'scene_based'
        }
    },
    metadata: {
        canonicalName: "Back to the Future",
        creators: ["Robert Zemeckis", "Bob Gale"],
        released: new Date("1985-07-03"),
        cultural_significance: 0.95
    }
};