import { Universe, UniverseType, TimePrecision } from '../../core/types.js';

export const tolkienBiographyUniverse: Universe = {
  universeId: "biography:jrr_tolkien:1892-1973",
  type: UniverseType.BIOGRAPHY,
  identifiers: {
    primary: "biography:jrr_tolkien:1892-1973",
    aliases: ["tolkien_life", "jrr_tolkien_biography"]
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: []
  },
  attribution: {
    public_domain: true,
    sources: ["Biographical records", "Academic sources", "Personal letters"],
    citations_required: false
  },
  layers: [
    {
      layerId: "life_timeline",
      type: 'primary',
      epochs: {
        full_life: {
          epochId: "tolkien:life",
          startTime: BigInt(Date.UTC(1892, 0, 3)) * 1000000n, // Birth
          endTime: BigInt(Date.UTC(1973, 8, 2)) * 1000000n,   // Death
          precision: TimePrecision.DAY,
          description: "J.R.R. Tolkien's complete lifespan"
        }
      }
    },
    {
      layerId: "education",
      type: 'primary',
      epochs: {
        oxford_undergraduate: {
          epochId: "tolkien:oxford_undergrad",
          startTime: BigInt(Date.UTC(1911, 9, 1)) * 1000000n, // October 1911
          endTime: BigInt(Date.UTC(1915, 5, 1)) * 1000000n,   // May 1915
          precision: TimePrecision.DAY,
          description: "Oxford undergraduate studies"
        }
      }
    },
    {
      layerId: "military_service",
      type: 'primary',
      epochs: {
        wwi_service: {
          epochId: "tolkien:wwi_service",
          startTime: BigInt(Date.UTC(1916, 6, 1)) * 1000000n,
          endTime: BigInt(Date.UTC(1920, 0, 1)) * 1000000n,
          precision: TimePrecision.DAY,
          description: "World War I military service"
        }
      }
    },
    {
      layerId: "academic_career",
      type: 'primary',
      epochs: {
        oxford_professor: {
          epochId: "tolkien:oxford_professor",
          startTime: BigInt(Date.UTC(1925, 0, 1)) * 1000000n,
          endTime: BigInt(Date.UTC(1959, 0, 1)) * 1000000n,
          precision: TimePrecision.YEAR,
          description: "Professor at Oxford University"
        }
      }
    }
  ],
  temporalStructure: {
    segments: [
      {
        id: "childhood",
        start: BigInt(Date.UTC(1892, 0, 3)) * 1000000n,
        end: BigInt(Date.UTC(1911, 0, 1)) * 1000000n,
        type: "life_period"
      },
      {
        id: "education_period",
        start: BigInt(Date.UTC(1911, 9, 1)) * 1000000n,
        end: BigInt(Date.UTC(1915, 5, 1)) * 1000000n,
        type: "education"
      },
      {
        id: "military_service_period",
        start: BigInt(Date.UTC(1916, 6, 1)) * 1000000n,
        end: BigInt(Date.UTC(1920, 0, 1)) * 1000000n,
        type: "public_service"
      },
      {
        id: "academic_career_period",
        start: BigInt(Date.UTC(1925, 0, 1)) * 1000000n,
        end: BigInt(Date.UTC(1959, 0, 1)) * 1000000n,
        type: "career"
      }
    ],
    keyframes: [
      {
        id: "birth",
        timestamp: BigInt(Date.UTC(1892, 0, 3)) * 1000000n,
        significance: 1.0,
        tags: ["birth", "biographical", "life_event"],
        certainty: 1.0
      },
      {
        id: "oxford_graduation",
        timestamp: BigInt(Date.UTC(1915, 5, 1)) * 1000000n,
        significance: 0.8,
        tags: ["education", "graduation", "oxford"],
        certainty: 0.95
      },
      {
        id: "battle_of_somme",
        timestamp: BigInt(Date.UTC(1916, 6, 1)) * 1000000n,
        significance: 0.9,
        tags: ["military", "wwi", "formative_experience"],
        certainty: 1.0
      },
      {
        id: "death",
        timestamp: BigInt(Date.UTC(1973, 8, 2)) * 1000000n,
        significance: 1.0,
        tags: ["death", "biographical", "life_event"],
        certainty: 1.0
      }
    ],
    windows: {
      strategy: 'phase_based'
    }
  },
  metadata: {
    canonicalName: "J.R.R. Tolkien Biography",
    creators: ["J.R.R. Tolkien"],
    released: new Date("1892-01-03"),
    cultural_significance: 0.95
  }
};

export const biographicalUniverses = [
  tolkienBiographyUniverse
];
