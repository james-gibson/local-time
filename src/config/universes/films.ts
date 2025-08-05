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

export const filmUniverses = [
  maryPoppinsUniverse
];

// MCP Integration for film universe generation
export { FILM_MCP_PROMPT } from '../mcp-prompts/film-prompt.js';
