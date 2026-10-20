import {TimePrecision, Universe, UniverseType, creatorRefs, temporalDomainLayer} from '../../core';

export const maryPoppinsUniverse: Universe = {
    universeId: "disney:mary_poppins:1964",
    type: UniverseType.FILM,
    epochs: undefined,
    identifiers: {
        primary: "disney:mary_poppins:1964",
        aliases: ["mary_poppins", "mp1964"],
        imdb: "tt0058331"
    },
    realityRelation: {
        type: 'pure_fiction',
        fictionalizationDegree: 1.0,
        realityAnchors: []
    },
    attribution: {
        copyright: {
            holders: ["Walt Disney Productions"],
            year: 1964,
            status: 'active'
        },
        creators: creatorRefs({
            director: ["Robert Stevenson"],
            writer: ["Bill Walsh", "Don DaGradi"]
        }),
        citations_required: true,
        usage_restrictions: ["Fair use for criticism and comment"],
        // The two calendar domains this work carries, each with the source that documents it
        // (#150). The design's own example (`example.ts.md:472-529`) invented April-May 1910
        // and 1963-06-01 -> 1964-08-27; a design record is not evidence, so these are the
        // documented spans instead.
        sources: [
            'Wikipedia, "Mary Poppins (film)": filmed May-September 1963 at Walt Disney Studios, '
                + 'Burbank; post-production and animation took about eleven months; story set in '
                + '1910, Edwardian London; released 27 August 1964.'
        ]
    },
    layers: [
        {
            layerId: "runtime",
            type: 'primary',
            epochs: {
                film: {
                    epochId: "mp:runtime",
                    startTime: 0n,
                    endTime: 139n * 60n * 1000000000n, // 139 minutes in nanoseconds
                    precision: TimePrecision.MILLISECOND,
                    description: "Film runtime from opening to closing credits"
                }
            }
        },
        // Story time: the plot spans roughly a week, but the sources date it only to the year.
        temporalDomainLayer(
            'narrative',
            '1910-01-01',
            '1911-01-01',
            TimePrecision.YEAR,
            "Story time: 1910, Edwardian London. The plot spans roughly a week; the year is the documented precision."
        ),
        // Real-world creation time: principal photography through the release. Month precision
        // because the sources give May-September 1963, not shooting days.
        temporalDomainLayer(
            'production',
            '1963-05-01',
            '1964-09-01',
            TimePrecision.MONTH,
            "Principal photography May-September 1963 in Burbank; post-production and animation ran about eleven months, to the 27 August 1964 release."
        )
    ],
    temporalStructure: {
        segments: [
            {
                id: "opening",
                start: 0n,
                end: 5n * 60n * 1000000000n,
                type: "sequence"
            },
            {
                id: "umbrella_flight",
                start: 87n * 60n * 1000000000n,
                end: 89n * 60n * 1000000000n,
                type: "scene"
            }
        ],
        keyframes: [
            {
                id: "umbrella_descent",
                // 87m15s, the position the design means (`example.ts.md:511` writes
                // `87n * 60n * 15n` — minutes * 60 * 15, which is 1305 minutes, 9.4x the
                // runtime). A #150 width check caught it; `temporal-domains.test.ts` pins
                // that every moment falls inside the runtime.
                timestamp: (87n * 60n + 15n) * 1000000000n,
                significance: 0.95,
                tags: ["iconic", "referenced", "magical_realism"]
            }
        ],
        windows: {
            strategy: 'scene_based',
            avgWindowSize: 3n * 60n * 1000000000n
        }
    },
    metadata: {
        canonicalName: "Mary Poppins",
        creators: ["Walt Disney", "P.L. Travers"],
        released: new Date("1964-08-27"),
        cultural_significance: 0.98
    }
};