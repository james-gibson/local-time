import { Universe, UniverseNetwork, UniverseType, TimePrecision, ReferenceType } from '../core/types.js';

// Example universes for demonstration and testing
const maryPoppinsUniverse: Universe = {
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

const apollo11Universe: Universe = {
  universeId: "nasa:apollo11:1969",
  type: UniverseType.MISSION,
  identifiers: {
    primary: "nasa:apollo11:1969",
    aliases: ["apollo11", "moon_landing"]
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: []
  },
  attribution: {
    public_domain: true,
    sources: ["NASA Mission Records", "Flight transcripts"],
    citations_required: false
  },
  layers: [
    {
      layerId: "mission",
      type: 'primary',
      epochs: {
        launch: {
          epochId: "apollo11:launch",
          startTime: BigInt(Date.UTC(1969, 6, 16, 13, 32, 0)) * 1000000n,
          endTime: BigInt(Date.UTC(1969, 6, 16, 13, 32, 0)) * 1000000n,
          precision: TimePrecision.SECOND,
          description: "Apollo 11 Launch",
          zeroPoint: BigInt(Date.UTC(1969, 6, 16, 13, 32, 0)) * 1000000n,
          zeroEvent: "Liftoff",
          beforePrefix: "T-",
          afterPrefix: "T+",
          relativeFormat: 'HMS'
        }
      }
    }
  ],
  temporalStructure: {
    segments: [
      {
        id: "countdown",
        start: -600n * 1000000000n, // T-10 minutes
        end: 0n,
        type: "countdown"
      },
      {
        id: "ascent",
        start: 0n,
        end: 690n * 1000000000n, // T+11:30
        type: "mission_phase"
      }
    ],
    keyframes: [
      {
        id: "liftoff",
        timestamp: 0n,
        significance: 1.0,
        tags: ["historic", "space", "moon_mission"]
      }
    ],
    windows: {
      strategy: 'countdown_based'
    }
  },
  metadata: {
    canonicalName: "Apollo 11 Mission",
    creators: ["NASA"],
    released: new Date("1969-07-16"),
    cultural_significance: 1.0
  }
};

const disneyNetwork: UniverseNetwork = {
  networkId: "disney",
  universes: new Set([
    "disney:mary_poppins:1964"
  ]),
  eras: [
    {
      eraId: "golden_age",
      name: "Golden Age",
      start: BigInt(Date.UTC(1937, 0, 1)) * 1000000n,
      end: BigInt(Date.UTC(1942, 0, 1)) * 1000000n,
      universes: []
    },
    {
      eraId: "renaissance",
      name: "Disney Renaissance",
      start: BigInt(Date.UTC(1989, 0, 1)) * 1000000n,
      end: BigInt(Date.UTC(1999, 0, 1)) * 1000000n,
      universes: []
    }
  ]
};

export default {
  universes: [
    maryPoppinsUniverse,
    apollo11Universe
  ],
  networks: [
    disneyNetwork
  ]
};
