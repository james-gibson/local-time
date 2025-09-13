// Add historical universes for BTTF test cases
import {TimePrecision, Universe, UniverseType} from '../../core';
import * as utils from '../../utils';

export const chuckBerryUniverse: Universe = {
    universeId: "history:chuck_berry:career",
    type: UniverseType.HISTORICAL_EVENT,
    epochs: {
        "launched": utils.createYearEpoch(1955, TimePrecision.YEAR,"chuck_berry:career")
    },
    identifiers: {
        primary: "history:chuck_berry:career",
        aliases: ["chuck_berry", "johnny_b_goode_composer"]
    },
    realityRelation: {
        type: 'documentary',
        fictionalizationDegree: 0.0,
        realityAnchors: []
    },
    attribution: {
        public_domain: true,
        sources: ["Music history records", "Biography sources"],
        citations_required: false
    },
    layers: [
        {
            layerId: "career",
            type: 'primary',
            epochs: {
                active_period: {
                    epochId: "chuck_berry:career",
                    startTime: BigInt(Date.UTC(1955, 0, 1)) * 1000000n,
                    endTime: BigInt(Date.UTC(2017, 2, 18)) * 1000000n, // Death date
                    precision: TimePrecision.YEAR,
                    description: "Chuck Berry's musical career"
                }
            }
        }
    ],
    temporalStructure: {
        segments: [
            {
                id: "early_career",
                start: BigInt(Date.UTC(1955, 0, 1)) * 1000000n,
                end: BigInt(Date.UTC(1965, 0, 1)) * 1000000n,
                type: "phase"
            }
        ],
        keyframes: [
            {
                id: "johnny_b_goode_composed",
                timestamp: BigInt(Date.UTC(1958, 0, 1)) * 1000000n,
                significance: 0.9,
                tags: ["composition", "rock_and_roll", "cultural_impact"]
            }
        ],
        windows: {
            strategy: 'time_based'
        }
    },
    metadata: {
        canonicalName: "Chuck Berry Career",
        creators: ["Chuck Berry"],
        released: new Date("1955-01-01"),
        cultural_significance: 0.95
    }
};