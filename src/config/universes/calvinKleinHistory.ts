import {TimePrecision, Universe, UniverseType} from '../../core';
import * as utils from '../../utils';

export const calvinKleinHistory: Universe = {
    universeId: "fashion:calvin_klein:founded",
    type: UniverseType.HISTORICAL_EVENT,
    epochs: {
        "founded": utils.createYearEpoch(1968, TimePrecision.DAY,"calvin_klein:founded")
    },
    identifiers: {
        primary: "fashion:calvin_klein:founded",
        aliases: ["calvin_klein", "ck_brand"]
    },
    realityRelation: {
        type: 'documentary',
        fictionalizationDegree: 0.0,
        realityAnchors: [
            {
                realEventId: "history:world:*",
                relationshipType:"experienced",
                confidence: 1,
                evidence:undefined
            }
        ]
    },
    attribution: {
        public_domain: true,
        sources: ["Fashion industry records", "Company history"],
        citations_required: false
    },
    layers: [
        {
            layerId: "company_history",
            type: 'primary',
            epochs: {
                corporate_period: {
                    epochId: "calvin_klein:corporate",
                    startTime: BigInt(Date.UTC(1968, 0, 1)) * 1000000n,
                    endTime: BigInt(Date.now()) * 1000000n,
                    precision: TimePrecision.YEAR,
                    description: "Calvin Klein company timeline"
                }
            }
        }
    ],
    temporalStructure: {
        segments: [
            {
                id: "founding",
                start: BigInt(Date.UTC(1968, 0, 1)) * 1000000n,
                end: BigInt(Date.UTC(1970, 0, 1)) * 1000000n,
                type: "phase"
            }
        ],
        keyframes: [
            {
                id: "company_founded",
                timestamp: BigInt(Date.UTC(1968, 0, 1)) * 1000000n,
                significance: 0.8,
                tags: ["fashion", "brand_founding", "underwear"]
            }
        ],
        windows: {
            strategy: 'time_based'
        }
    },
    metadata: {
        canonicalName: "Calvin Klein Brand History",
        creators: ["Calvin Klein"],
        released: new Date("1968-01-01"),
        cultural_significance: 0.7
    }
};