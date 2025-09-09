import { Universe, UniverseType, TimePrecision } from '../../core/types';
import { filmUniverses } from './films';
import { missionUniverses } from './apollo-eleven/missions';
import { universeNetworks } from './disney/networks';
import { biographicalUniverses } from './people/biographical';
import { legalUniverses } from './us-gov/legal';
import { pokemonUniverses } from './games/pokemon';
import { starWarsUniverses } from './films/star-wars';
import { historicalUniverses } from './historical/jfk';
import { allCybersecurityUniverses } from './cybersecurity';

// Add historical universes for BTTF test cases
export const chuckBerryUniverse: Universe = {
  universeId: "history:chuck_berry:career",
  type: UniverseType.HISTORICAL_EVENT,
  epochs: {},
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
  universeId: "fashion:calvin_klein:founded",
  type: UniverseType.HISTORICAL_EVENT,
  epochs: undefined,
  identifiers: {
    primary: "fashion:calvin_klein:founded",
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

// Add Tolkien's WWI experience and Middle-earth for multilayer reference testing
export const tolkienWWIExperience: Universe = {
  universeId: "personal:tolkien:wwi_experience:1916",
  type: UniverseType.PERSONAL_EXPERIENCE,
  epochs: {},
  identifiers: {
    primary: "personal:tolkien:wwi_experience:1916",
    aliases: ["tolkien_war", "jrr_tolkien_wwi"]
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: "history:wwi:battle_of_somme:1916",
        relationshipType: 'experienced',
        confidence: 1.0,
        evidence: ["Military records", "Biographical sources"]
      }
    ]
  },
  attribution: {
    public_domain: true,
    sources: ["Tolkien biographies", "Military records", "Personal letters"],
    citations_required: false
  },
  layers: [
    {
      layerId: "service_period",
      type: 'primary',
      epochs: {
        military_service: {
          epochId: "tolkien:wwi_service",
          startTime: BigInt(Date.UTC(1916, 0, 1)) * 1000000n,
          endTime: BigInt(Date.UTC(1916, 11, 31)) * 1000000n,
          precision: TimePrecision.YEAR,
          description: "Tolkien's WWI military service period"
        }
      }
    }
  ],
  temporalStructure: {
    segments: [
      {
        id: "training",
        start: BigInt(Date.UTC(1916, 0, 1)) * 1000000n,
        end: BigInt(Date.UTC(1916, 5, 1)) * 1000000n,
        type: "phase"
      },
      {
        id: "somme_deployment",
        start: BigInt(Date.UTC(1916, 5, 27)) * 1000000n,
        end: BigInt(Date.UTC(1916, 9, 27)) * 1000000n,
        type: "phase"
      }
    ],
    keyframes: [
      {
        id: "arrives_somme",
        timestamp: BigInt(Date.UTC(1916, 5, 27)) * 1000000n,
        significance: 0.9,
        tags: ["deployment", "trauma", "formative_experience"]
      },
      {
        id: "trench_fever",
        timestamp: BigInt(Date.UTC(1916, 9, 27)) * 1000000n,
        significance: 0.8,
        tags: ["illness", "evacuation", "survival"]
      }
    ],
    windows: {
      strategy: 'time_based'
    }
  },
  metadata: {
    canonicalName: "Tolkien's WWI Experience",
    creators: ["J.R.R. Tolkien"],
    released: new Date("1916-01-01"),
    cultural_significance: 0.85
  }
};

export const middleEarthUniverse: Universe = {
  universeId: "literature:tolkien:lotr:1954",
  type: UniverseType.BOOK,
  epochs: {},
  identifiers: {
    primary: { type: 'isbn', value: '978-0544003415' },
    aliases: ["lord_of_the_rings", "lotr", "middle_earth"]
  },
  realityRelation: {
    type: 'inspired_by',
    fictionalizationDegree: 0.9,
    realityAnchors: [
      {
        realEventId: "personal:tolkien:wwi_experience:1916",
        relationshipType: 'inspired_by',
        confidence: 0.8,
        evidence: ["Tolkien letters", "Literary analysis", "Biographical studies"]
      },
      {
        realEventId: "geography:england:countryside",
        relationshipType: 'inspired_by',
        confidence: 0.9,
        evidence: ["Tolkien statements", "Geographic analysis"]
      }
    ]
  },
  attribution: {
    copyright: {
      holders: ["The Tolkien Estate"],
      year: 1954,
      status: 'active'
    },
    creators: {
      writer: ["J.R.R. Tolkien"]
    },
    citations_required: true,
    usage_restrictions: ["Fair use for criticism and comment"]
  },
  layers: [
    {
      layerId: "narrative_timeline",
      type: 'primary',
      epochs: {
        third_age: {
          epochId: "middle_earth:third_age",
          startTime: 0n, // Relative to Third Age calendar
          endTime: 3021n * BigInt(TimePrecision.YEAR),
          precision: TimePrecision.YEAR,
          description: "Third Age of Middle-earth"
        }
      }
    },
    {
      layerId: "war_of_the_ring",
      type: 'primary',
      epochs: {
        war_period: {
          epochId: "middle_earth:war_of_ring",
          startTime: 3018n * BigInt(TimePrecision.YEAR),
          endTime: 3019n * BigInt(TimePrecision.YEAR),
          precision: TimePrecision.DAY,
          description: "War of the Ring period"
        }
      }
    }
  ],
  temporalStructure: {
    segments: [
      {
        id: "dead_marshes",
        start: 3019n * BigInt(TimePrecision.YEAR) + 62n * BigInt(TimePrecision.DAY),
        end: 3019n * BigInt(TimePrecision.YEAR) + 63n * BigInt(TimePrecision.DAY),
        type: "scene"
      },
      {
        id: "isengard_destruction",
        start: 3019n * BigInt(TimePrecision.YEAR) + 59n * BigInt(TimePrecision.DAY),
        end: 3019n * BigInt(TimePrecision.YEAR) + 60n * BigInt(TimePrecision.DAY),
        type: "scene"
      }
    ],
    keyframes: [
      {
        id: "dead_marshes_passage",
        timestamp: 3019n * BigInt(TimePrecision.YEAR) + 62n * BigInt(TimePrecision.DAY),
        significance: 0.9,
        tags: ["war_trauma", "death", "mechanized_warfare_echo"]
      },
      {
        id: "saruman_industrialization",
        timestamp: 3019n * BigInt(TimePrecision.YEAR) + 59n * BigInt(TimePrecision.DAY),
        significance: 0.85,
        tags: ["industrialization", "environmental_destruction", "mechanized_warfare"]
      }
    ],
    windows: {
      strategy: 'scene_based'
    }
  },
  metadata: {
    canonicalName: "The Lord of the Rings",
    creators: ["J.R.R. Tolkien"],
    released: new Date("1954-07-29"),
    cultural_significance: 0.99
  }
};

export const allUniverses = [
  ...filmUniverses,
  ...missionUniverses,
  ...biographicalUniverses,
  ...legalUniverses,
  ...pokemonUniverses,
  ...starWarsUniverses,
  ...historicalUniverses,
  ...allCybersecurityUniverses,
  chuckBerryUniverse,
  calvinKleinHistory,
  tolkienWWIExperience,
  middleEarthUniverse
];

export const allNetworks = [
  ...universeNetworks
];

export { 
  filmUniverses, 
  missionUniverses, 
  universeNetworks, 
  biographicalUniverses, 
  legalUniverses,
  pokemonUniverses,
  starWarsUniverses,
  historicalUniverses,
  allCybersecurityUniverses
};
