import { Universe, UniverseType, TimePrecision } from '../../../core/types';

export const pokemonRedBlueUniverse: Universe = {
  universeId: "game:pokemon:red_blue:1996",
  type: UniverseType.SIMULATION,
  epochs: undefined,
  identifiers: {
    primary: "game:pokemon:red_blue:1996",
    aliases: ["pokemon_red", "pokemon_blue", "gen1_pokemon"]
  },
  realityRelation: {
    type: 'pure_fiction',
    fictionalizationDegree: 1.0,
    realityAnchors: []
  },
  attribution: {
    copyright: {
      holders: ["Nintendo", "Game Freak", "Creatures Inc."],
      year: 1996,
      status: 'active'
    },
    creators: {
      director: ["Satoshi Tajiri"],
      writer: ["Satoshi Tajiri", "Ken Sugimori"]
    },
    citations_required: true,
    usage_restrictions: ["Fair use for criticism and comment"]
  },
  layers: [
    {
      layerId: "gameplay_progression",
      type: 'primary',
      epochs: {
        full_game: {
          epochId: "pokemon:gameplay",
          startTime: 0n, // Game start
          endTime: 100n * BigInt(TimePrecision.HOUR), // ~100 hours typical completion
          precision: TimePrecision.MINUTE,
          description: "Complete Pokemon Red/Blue gameplay progression"
        }
      }
    },
    {
      layerId: "story_progression",
      type: 'primary',
      epochs: {
        journey: {
          epochId: "pokemon:story",
          startTime: 0n,
          endTime: 50n * BigInt(TimePrecision.HOUR), // Story completion time
          precision: TimePrecision.MINUTE,
          description: "Pokemon trainer journey narrative"
        }
      }
    }
  ],
  temporalStructure: {
    segments: [
      {
        id: "pallet_town_start",
        start: 0n,
        end: 30n * BigInt(TimePrecision.MINUTE),
        type: "sequence"
      },
      {
        id: "first_pokemon_received",
        start: 15n * BigInt(TimePrecision.MINUTE),
        end: 20n * BigInt(TimePrecision.MINUTE),
        type: "sequence"
      },
      {
        id: "first_wild_encounter",
        start: 25n * BigInt(TimePrecision.MINUTE),
        end: 30n * BigInt(TimePrecision.MINUTE),
        type: "sequence"
      },
      {
        id: "first_trainer_battle",
        start: 45n * BigInt(TimePrecision.MINUTE),
        end: 50n * BigInt(TimePrecision.MINUTE),
        type: "sequence"
      }
    ],
    keyframes: [
      {
        id: "game_start",
        timestamp: 0n,
        significance: 1.0,
        tags: ["game_start", "tutorial", "character_creation"]
      },
      {
        id: "starter_pokemon_choice",
        timestamp: 15n * BigInt(TimePrecision.MINUTE),
        significance: 0.95,
        tags: ["starter_pokemon", "first_pokemon", "choice", "bulbasaur_charmander_squirtle"]
      },
      {
        id: "first_pokemon_caught",
        timestamp: 25n * BigInt(TimePrecision.MINUTE),
        significance: 0.9,
        tags: ["first_catch", "wild_pokemon", "pokeball", "team_building"]
      },
      {
        id: "rival_first_battle",
        timestamp: 45n * BigInt(TimePrecision.MINUTE),
        significance: 0.85,
        tags: ["rival_battle", "first_trainer_battle", "tutorial_battle"]
      }
    ],
    windows: {
      strategy: 'phase_based',
      avgWindowSize: 30n * BigInt(TimePrecision.MINUTE)
    }
  },
  metadata: {
    canonicalName: "Pokemon Red/Blue",
    creators: ["Satoshi Tajiri", "Game Freak"],
    released: new Date("1996-02-27"),
    cultural_significance: 0.98
  }
};

export const pokemonAnimeUniverse: Universe = {
  universeId: "anime:pokemon:indigo_league:1997",
  type: UniverseType.SERIES,
  epochs: undefined,
  identifiers: {
    primary: "anime:pokemon:indigo_league:1997",
    aliases: ["pokemon_anime", "ash_ketchum_journey", "indigo_league"]
  },
  realityRelation: {
    type: 'pure_fiction',
    fictionalizationDegree: 1.0,
    realityAnchors: []
  },
  attribution: {
    copyright: {
      holders: ["Nintendo", "OLM", "TV Tokyo"],
      year: 1997,
      status: 'active'
    },
    creators: {
      director: ["Kunihiko Yuyama"],
      writer: ["Takeshi Shudo"]
    },
    citations_required: true,
    usage_restrictions: ["Fair use for criticism and comment"]
  },
  layers: [
    {
      layerId: "ash_journey",
      type: 'primary',
      epochs: {
        indigo_league: {
          epochId: "ash:indigo_league",
          startTime: 0n,
          endTime: 82n * 25n * BigInt(TimePrecision.MINUTE), // 82 episodes * ~25 minutes
          precision: TimePrecision.MINUTE,
          description: "Ash's Indigo League journey"
        }
      }
    }
  ],
  temporalStructure: {
    segments: [
      {
        id: "journey_begins",
        start: 0n,
        end: 25n * BigInt(TimePrecision.MINUTE), // Episode 1
        type: "sequence"
      },
      {
        id: "pikachu_first_meeting",
        start: 5n * BigInt(TimePrecision.MINUTE),
        end: 10n * BigInt(TimePrecision.MINUTE),
        type: "scene"
      },
      {
        id: "first_pokemon_battle_attempt",
        start: 15n * BigInt(TimePrecision.MINUTE),
        end: 20n * BigInt(TimePrecision.MINUTE),
        type: "scene"
      },
      {
        id: "first_pokemon_caught",
        start: 3n * 25n * BigInt(TimePrecision.MINUTE), // Episode 3
        end: 3n * 25n * BigInt(TimePrecision.MINUTE) + 5n * BigInt(TimePrecision.MINUTE),
        type: "scene"
      }
    ],
    keyframes: [
      {
        id: "ash_gets_pikachu",
        timestamp: 5n * BigInt(TimePrecision.MINUTE),
        significance: 1.0,
        tags: ["first_pokemon", "pikachu", "starter", "partnership_begins"]
      },
      {
        id: "ash_first_battle_attempt",
        timestamp: 15n * BigInt(TimePrecision.MINUTE),
        significance: 0.8,
        tags: ["first_battle_attempt", "pikachu_refuses", "no_pokemon_caught_yet"]
      },
      {
        id: "ash_catches_caterpie",
        timestamp: 3n * 25n * BigInt(TimePrecision.MINUTE),
        significance: 0.9,
        tags: ["first_catch", "caterpie", "first_wild_pokemon", "team_building"]
      }
    ],
    windows: {
      strategy: 'scene_based',
      avgWindowSize: 25n * BigInt(TimePrecision.MINUTE)
    }
  },
  metadata: {
    canonicalName: "Pokemon Indigo League",
    creators: ["Satoshi Tajiri", "OLM Studios"],
    released: new Date("1997-04-01"),
    cultural_significance: 0.95
  }
};

export const pokemonUniverses = [
  pokemonRedBlueUniverse,
  pokemonAnimeUniverse
];
