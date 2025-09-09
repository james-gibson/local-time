import { Universe, UniverseType, TimePrecision } from '../../../core/types';

export const starWarsANewHopeUniverse: Universe = {
  universeId: "film:star_wars:a_new_hope:1977",
  type: UniverseType.FILM,
  epochs: undefined,
  identifiers: {
    primary: "film:star_wars:a_new_hope:1977",
    aliases: ["star_wars", "episode_iv", "a_new_hope"],
    imdb: "tt0076759"
  },
  realityRelation: {
    type: 'pure_fiction',
    fictionalizationDegree: 1.0,
    realityAnchors: []
  },
  attribution: {
    copyright: {
      holders: ["Lucasfilm Ltd.", "20th Century Fox"],
      year: 1977,
      status: 'active'
    },
    creators: {
      director: ["George Lucas"],
      writer: ["George Lucas"]
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
          epochId: "sw:runtime",
          startTime: 0n,
          endTime: 121n * 60n * 1000000000n, // 121 minutes in nanoseconds
          precision: TimePrecision.MILLISECOND,
          description: "Film runtime from opening crawl to closing credits"
        }
      }
    },
    {
      layerId: "narrative_timeline",
      type: 'primary',
      epochs: {
        galactic_civil_war: {
          epochId: "sw:galactic_civil_war",
          startTime: 0n, // 0 ABY (After Battle of Yavin)
          endTime: 1n * BigInt(TimePrecision.YEAR),
          precision: TimePrecision.DAY,
          description: "Events of A New Hope in galactic timeline"
        }
      }
    }
  ],
  temporalStructure: {
    segments: [
      {
        id: "opening_crawl",
        start: 0n,
        end: 90n * 1000000000n, // 90 seconds
        type: "sequence"
      },
      {
        id: "princess_leia_capture",
        start: 90n * 1000000000n,
        end: 8n * 60n * 1000000000n, // ~8 minutes
        type: "sequence"
      },
      {
        id: "luke_introduction",
        start: 15n * 60n * 1000000000n,
        end: 25n * 60n * 1000000000n,
        type: "sequence"
      },
      {
        id: "death_star_battle",
        start: 105n * 60n * 1000000000n,
        end: 121n * 60n * 1000000000n,
        type: "sequence"
      }
    ],
    keyframes: [
      {
        id: "opening_crawl_start",
        timestamp: 0n,
        significance: 0.9,
        tags: ["opening", "exposition", "iconic"]
      },
      {
        id: "princess_leia_message",
        timestamp: 6n * 60n * 1000000000n,
        significance: 0.95,
        tags: ["help_me_obi_wan", "iconic_line", "plot_catalyst"]
      },
      {
        id: "luke_sees_message",
        timestamp: 20n * 60n * 1000000000n,
        significance: 0.9,
        tags: ["hero_call", "r2d2", "message"]
      },
      {
        id: "death_star_destroyed",
        timestamp: 118n * 60n * 1000000000n,
        significance: 1.0,
        tags: ["climax", "victory", "force", "death_star_destruction"]
      }
    ],
    windows: {
      strategy: 'scene_based',
      avgWindowSize: 5n * 60n * 1000000000n // 5 minute windows
    }
  },
  metadata: {
    canonicalName: "Star Wars: Episode IV - A New Hope",
    creators: ["George Lucas"],
    released: new Date("1977-05-25"),
    cultural_significance: 1.0
  }
};

export const starWarsUniverses = [
  starWarsANewHopeUniverse
];
