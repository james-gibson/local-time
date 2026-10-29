import { createUniverseId } from '../../core/universe-ids';
import { TimePrecision, Universe, UniverseType, creatorRefs } from '../../core';
import * as utils from '../../utils';

export const savingPrivateRyanUniverse: Universe = {
    temporalStructure: undefined,
    universeId: createUniverseId("film:saving_private_ryan:1998"),
    type: UniverseType.FILM,
    epochs: { "primary":utils.createYearEpoch(1944, TimePrecision.YEAR,"history:operation_overlord:1944")},
    identifiers: {
        primary: {type: 'film', value: 'tt0120815', year: 1998},
        alternates: [
            {type: 'isbn', value: '978-0451226907'} // Novelization
        ]
    },

    realityRelation: {
        type: 'historical_fiction',
        fictionalizationDegree: 0.7, // Fictional characters, real event
        claimsHistoricalAccuracy: true,
        historicalConsultants: ["Stephen E. Ambrose", "Dale Dye"],

        realityAnchors: [
            {
                realEventId: "history:operation_overlord:1944",
                relationshipType: 'depicts',
                confidence: 0.9,
                evidence: ["Military records", "Consultant verification"]
            },
            {
                realEventId: "history:niland_brothers:1944",
                relationshipType: 'inspired_by',
                confidence: 0.8,
                evidence: ["Spielberg interviews", "Historical parallels"]
            }
        ]
    },

    attribution: {
        copyright: {
            holders: ["DreamWorks Pictures", "Paramount Pictures"],
            year: 1998,
            status: 'active'
        },
        creators: creatorRefs({
            director: ["Steven Spielberg"],
            writer: ["Robert Rodat"],
            historical_advisors: ["Stephen E. Ambrose"]
        }),
        citations_required: true,
        usage_restrictions: ["Fair use for criticism and comment"]
    },

    layers: [
        {
            layerId: "production",
            type: 'meta',
            epochs: {
                filming: {
                    start: BigInt(Date.UTC(1997, 5, 27)) * 1000000n,
                    end: BigInt(Date.UTC(1997, 8, 13)) * 1000000n,
                    precision: TimePrecision.DAY
                }
            },
            contains: ["outtakes", "bloopers", "behind_scenes"]
        },
        {
            layerId: "narrative",
            type: 'primary',
            epochs: {
                story: {
                    start: BigInt(Date.UTC(1944, 5, 6)) * 1000000n, // D-Day
                    end: BigInt(Date.UTC(1944, 5, 13)) * 1000000n,
                    precision: TimePrecision.HOUR
                }
            }
        },
        {
            layerId: "fictional_dday",
            type: 'recreation',
            epochs: {
                depicted_event: {
                    start: BigInt(Date.UTC(1944, 5, 6, 6, 30)) * 1000000n,
                    end: BigInt(Date.UTC(1944, 5, 6, 12, 0)) * 1000000n,
                    precision: TimePrecision.MINUTE
                }
            },
            reality_correspondence: {
                // A layer corresponds to a *universe*, not to a place or a sub-event.
                // `history:operation_overlord:1944:omaha_beach` named the Omaha Beach
                // sector, so no pattern matched and no resolver could ever find it
                // (local-time#184). The D-Day landing is recorded as the
                // `d_day_normandy_landings` keyframe of the U.S. military-operations
                // universe, which is the registered record this layer corresponds to.
                to: "history:us_gov_military_operations:1870-1989",
                accuracy: 0.8,
                deviations: [
                    "Compressed timeline",
                    "Composite characters",
                    "Depicts the Omaha Beach sector of the Normandy landings, not the whole operation"
                ]
            }
        }
    ]
};