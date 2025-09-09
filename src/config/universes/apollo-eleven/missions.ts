import { Universe, UniverseType, TimePrecision } from '../../../core/types';

export const apollo11Universe: Universe = {
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

export const missionUniverses = [
  apollo11Universe
];
