import { createFilmUniverseId } from '../../core/universe-ids';
import { CommonUniverseIds } from '../../core/common-universe-ids';
import { TimePrecision, Universe, UniverseType, creatorRefs } from '../../core';
import { distributedByRef, resolveFilmStudio } from './studios';
import type { TropeFilmMetadata } from './tropes/types';

/**
 * Back to the Future (1985), Universal Pictures — james-gibson/local-time#182.
 *
 * ## The id names the studio, not the generic token
 *
 * It shipped as `film:bttf:1985`, where `film` is the *generic* studio token
 * (`GENERIC_FILM_STUDIO_TOKEN`, "no studio named") and `bttf` is the title — so
 * the record claimed no distributor at all. That is why `resolveFilmStudio('bttf')`
 * returned `undefined`, the universe had no studio parent, and no `DISTRIBUTED_BY`
 * edge recorded that Universal released it. The film vocabulary is
 * `<studio-token>:<title>:<year>`, and Universal's registered token is `universal`.
 *
 * ## Why the literal, and not `createFilmUniverse` (#115)
 *
 * The film has two story calendars — the 1985 present and the 1955 past — and a
 * named scene segment inside the runtime. `FilmSpec` carries one `narrative` domain
 * and partitions the runtime into acts, so routing this record through the factory
 * would drop a calendar or rename a segment other records cite. It stays a literal,
 * but derives everything that must agree with the studio registry
 * (`resolveFilmStudio`, `distributedByRef`) instead of restating it.
 */
export const backToTheFutureUniverse: Universe = {
    universeId: createFilmUniverseId('universal', 'back_to_the_future', 1985),
    type: UniverseType.FILM,
    epochs: undefined,
    identifiers: {
        primary: {type: 'film', value: 'tt0088763', year: 1985},
        aliases: ["back_to_the_future", "bttf"]
    },
    // Containment, declared by the member (james-gibson/local-time#74).
    //
    // The 1980s tropes collection (#130) names this film as the anchor for
    // `modified_vehicle_time_machine`. That is an edge the child declares: the
    // universeId is owned here, and `config/universes/tropes` must never restate
    // it. Keeping the edge next to the owner is what lets one id be in the film
    // namespace *and* in the trope collection without duplicating the record.
    //
    // Hollywood and the studio are the two parents `createFilmUniverse` would
    // derive from the one studio token; because this record is a literal, they are
    // named here. The studio id comes from the registry, never typed.
    connections: {
        natural: {
            parentUniverses: [
                CommonUniverseIds.EIGHTIES_MOVIE_TROPES,
                CommonUniverseIds.HOLLYWOOD_SYSTEM,
                resolveFilmStudio('universal')!.universeId,
            ],
        },
        references: [
            distributedByRef('universal', 'Distributed theatrically by Universal Pictures.'),
        ],
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
        creators: creatorRefs({
            director: ["Robert Zemeckis"],
            writer: ["Robert Zemeckis", "Bob Gale"]
        }),
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
                    // #182: every epoch carries its own id. The registry used to fall
                    // back to the layer key ("present"), which silently changed what any
                    // reference to the 1985 calendar meant (#19).
                    epochId: "bttf:narrative_1985",
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
                    epochId: "bttf:narrative_1955",
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
        cultural_significance: 0.95,
        // The trope this film anchors (#130). Declared here, on the owner, and
        // cross-checked against the collection's registry by
        // `tropes/tropes-registration.test.ts`.
        tropes: ['modified_vehicle_time_machine'],
    } as TropeFilmMetadata
};
