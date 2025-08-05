import { Universe, UniverseType, TimePrecision } from '../../core/types.js';
import { filmUniverses } from './films.js';
import { missionUniverses } from './missions.js';
import { universeNetworks } from './networks.js';

// Add historical universes for BTTF test cases
export const chuckBerryUniverse: Universe = {
  universeId: "history:chuck_berry:career",
  type: UniverseType.HISTORICAL_EVENT,
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

export const calvinKleinHistory: Universe = {
  universeId: "history:fashion:calvin_klein:founded",
  type: UniverseType.HISTORICAL_EVENT,
  identifiers: {
    primary: "history:fashion:calvin_klein:founded",
    aliases: ["calvin_klein", "ck_brand"]
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: []
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

export const allUniverses = [
  ...filmUniverses,
  ...missionUniverses,
  chuckBerryUniverse,
  calvinKleinHistory
];

export const allNetworks = [
  ...universeNetworks
];

export { filmUniverses, missionUniverses, universeNetworks };
