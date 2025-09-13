import { Universe, UniverseType, TimePrecision } from '../../../core/types';
import * as utils from '../../../utils';

export const tolkienBiographyUniverse: Universe = {
  universeId: "biography:jrr_tolkien:1892-1973",
  type: UniverseType.BIOGRAPHY,
  epochs: {
      "born": utils.createYearEpoch(1892, TimePrecision.DAY,"jrr_tolkien:born"),
    },
  identifiers: {
    primary: "biography:jrr_tolkien:1892-1973",
    aliases: ["tolkien_life", "jrr_tolkien_biography"]
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: "history:world:*",
        relationshipType:"experienced",
        confidence: 1,
        evidence:undefined
      }
    ]
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

export const britneySpearsBiographyUniverse: Universe = {
  universeId: "biography:britney_spears:1981-present",
  type: UniverseType.BIOGRAPHY,
  epochs: undefined,
  identifiers: {
    primary: "biography:britney_spears:1981-present",
    aliases: ["britney_spears", "princess_of_pop"]
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: []
  },
  attribution: {
    public_domain: false,
    sources: ["Music industry records", "Award databases", "Public biographical sources"],
    citations_required: true
  },
  layers: [
    {
      layerId: "life_timeline",
      type: 'primary',
      epochs: {
        full_life: {
          epochId: "britney:life",
          startTime: BigInt(Date.UTC(1981, 11, 2)) * 1000000n, // Birth: Dec 2, 1981
          endTime: BigInt(Date.now()) * 1000000n, // Still alive
          precision: TimePrecision.DAY,
          description: "Britney Spears' complete lifespan"
        }
      }
    },
    {
      layerId: "career",
      type: 'primary',
      epochs: {
        music_career: {
          epochId: "britney:music_career",
          startTime: BigInt(Date.UTC(1998, 0, 1)) * 1000000n, // Career start ~1998
          endTime: BigInt(Date.now()) * 1000000n,
          precision: TimePrecision.DAY,
          description: "Britney Spears' music career"
        }
      }
    }
  ],
  temporalStructure: {
    segments: [
      {
        id: "childhood",
        start: BigInt(Date.UTC(1981, 11, 2)) * 1000000n,
        end: BigInt(Date.UTC(1999, 11, 2)) * 1000000n, // 18th birthday
        type: "life_period"
      },
      {
        id: "early_career",
        start: BigInt(Date.UTC(1998, 0, 1)) * 1000000n,
        end: BigInt(Date.UTC(2002, 0, 1)) * 1000000n,
        type: "career"
      },
      {
        id: "adulthood",
        start: BigInt(Date.UTC(1999, 11, 2)) * 1000000n, // 18th birthday
        end: BigInt(Date.UTC(2008, 1, 1)) * 1000000n, // Before conservatorship
        type: "life_period"
      },
      {
        id: "conservatorship_period",
        start: BigInt(Date.UTC(2008, 1, 1)) * 1000000n,
        end: BigInt(Date.UTC(2021, 10, 12)) * 1000000n,
        type: "legal_period",
        status: "inactive"
      },
      {
        id: "post_conservatorship",
        start: BigInt(Date.UTC(2021, 10, 12)) * 1000000n,
        end: BigInt(Date.now()) * 1000000n,
        type: "life_period"
      }
    ],
    keyframes: [
      {
        id: "birth",
        timestamp: BigInt(Date.UTC(1981, 11, 2)) * 1000000n,
        significance: 1.0,
        tags: ["birth", "biographical", "life_event"],
        certainty: 1.0
      },
      {
        id: "eighteenth_birthday",
        timestamp: BigInt(Date.UTC(1999, 11, 2)) * 1000000n,
        significance: 0.8,
        tags: ["birthday", "legal_age", "milestone"],
        certainty: 1.0
      },
      {
        id: "first_music_award",
        timestamp: BigInt(Date.UTC(1999, 8, 9)) * 1000000n, // MTV VMA Sept 9, 1999
        significance: 0.9,
        tags: ["award", "music", "career_milestone", "mtv_vma"],
        certainty: 1.0
      },
      {
        id: "baby_one_more_time_release",
        timestamp: BigInt(Date.UTC(1998, 9, 23)) * 1000000n, // Oct 23, 1998
        significance: 0.95,
        tags: ["debut_single", "career_start", "breakthrough"],
        certainty: 1.0
      },
      {
        id: "conservatorship_begins",
        timestamp: BigInt(Date.UTC(2008, 1, 1)) * 1000000n, // Feb 1, 2008
        significance: 0.9,
        tags: ["legal", "conservatorship", "personal_crisis"],
        certainty: 1.0
      },
      {
        id: "free_britney_meme_viral",
        timestamp: BigInt(Date.UTC(2019, 3, 15)) * 1000000n, // April 15, 2019 (approximate)
        significance: 0.85,
        tags: ["social_media", "fan_movement", "viral_meme", "free_britney"],
        certainty: 0.8
      },
      {
        id: "conservatorship_terminated",
        timestamp: BigInt(Date.UTC(2021, 10, 12)) * 1000000n, // Nov 12, 2021
        significance: 1.0,
        tags: ["legal", "freedom", "court_victory", "conservatorship_end"],
        certainty: 1.0
      }
    ],
    windows: {
      strategy: 'phase_based'
    }
  },
  metadata: {
    canonicalName: "Britney Spears Biography",
    creators: ["Britney Spears"],
    released: new Date("1981-12-02"),
    cultural_significance: 0.9
  }
};

export const biographicalUniverses = [
  tolkienBiographyUniverse,
  britneySpearsBiographyUniverse
];
