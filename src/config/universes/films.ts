import { Universe, UniverseType, TimePrecision } from '../../core/types.js';

export const maryPoppinsUniverse: Universe = {
  universeId: "disney:mary_poppins:1964",
  type: UniverseType.FILM,
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
    creators: {
      director: ["Robert Stevenson"],
      writer: ["Bill Walsh", "Don DaGradi"]
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
          epochId: "mp:runtime",
          startTime: 0n,
          endTime: 139n * 60n * 1000000000n, // 139 minutes in nanoseconds
          precision: TimePrecision.MILLISECOND,
          description: "Film runtime from opening to closing credits"
        }
      }
    }
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
        timestamp: 87n * 60n * 15n * 1000000000n,
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

export const savingPrivateRyanUniverse: Universe = {
  universeId: "film:saving_private_ryan:1998",
  type: UniverseType.FILM,
  identifiers: {
    primary: { type: 'film', value: 'tt0120815', year: 1998 },
    alternates: [
      { type: 'isbn', value: '978-0451226907' } // Novelization
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
    creators: {
      director: ["Steven Spielberg"],
      writer: ["Robert Rodat"],
      historical_advisors: ["Stephen E. Ambrose"]
    },
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
        to: "history:operation_overlord:1944:omaha_beach",
        accuracy: 0.8,
        deviations: ["Compressed timeline", "Composite characters"]
      }
    }
  ]
};

export const filmUniverses = [
  maryPoppinsUniverse,
  savingPrivateRyanUniverse
];

// MCP Integration for film universe generation
export { FILM_MCP_PROMPT } from '../mcp-prompts/film-prompt.js';
