# Universe Creation Guide

This guide provides step-by-step instructions for creating Universe objects in the Local Time System using the fluent UniverseBuilder API.

## Quick Start with UniverseBuilder

The **recommended approach** is to use the `UniverseBuilder` class, which provides a fluent API with validation and type safety.

### 1. Film Universe

Create a film universe with runtime and keyframes:

```typescript
import { UniverseBuilder } from './core/universe-builder';

const maryPoppinsUniverse = new UniverseBuilder()
  .film('disney', 'mary_poppins', 1964)
  .withRuntime(139) // minutes
  .withRealityRelation('pure_fiction', 1.0)
  .withCopyright(['Walt Disney Productions'], 1964, 'active')
  .withCreators({ 
    director: ['Robert Stevenson'],
    writer: ['Bill Walsh', 'Don DaGradi']
  })
  .withCulturalSignificance(0.95)
  .addRuntimeKeyframe(87, 15, 'umbrella_descent', 0.95, ['iconic', 'magical'])
  .addRuntimeSegment(0, 0, 5, 0, 'opening_sequence', 'sequence')
  .build();
```

### 2. Historical Event Universe

Create a historical event with date-based timeline:

```typescript
const jfkAssassinationUniverse = new UniverseBuilder()
  .historicalEvent('jfk_assassination', 1963)
  .withDateRange(1963, 11, 22, 1963, 11, 22, TimePrecision.SECOND)
  .withRealityRelation('documentary', 0.0)
  .withPublicDomain(['Warren Commission Report', 'National Archives'])
  .withCulturalSignificance(1.0)
  .addDateKeyframe(1963, 11, 22, 12, 30, 0, 'first_shot', 1.0, ['assassination'])
  .build();
```

### 3. Mission Universe

Create a space mission with zero-reference timeline:

```typescript
const apollo11Universe = new UniverseBuilder()
  .mission('nasa', 'apollo_11', 1969)
  .withZeroReference(
    1969, 7, 16, 13, 32, 0, // Launch time
    'launch',
    'T-', 'T+',
    240 // 10-day mission window
  )
  .withRealityRelation('documentary', 0.0)
  .withPublicDomain(['NASA Archives'])
  .withCulturalSignificance(1.0)
  .build();
```

### 4. Biography Universe

Create a biographical timeline:

```typescript
const churchillUniverse = new UniverseBuilder()
  .biography('winston_churchill', 1874, 1965)
  .withDateRange(1874, 11, 30, 1965, 1, 24, TimePrecision.DAY)
  .withRealityRelation('documentary', 0.0)
  .withPublicDomain(['Historical Records'])
  .withCulturalSignificance(0.98)
  .addDateSegment(1940, 5, 10, 0, 1945, 7, 26, 23, 'wartime_pm', 'public_service')
  .build();
```

### 5. Book Universe

Create a literary work:

```typescript
const hobbitUniverse = new UniverseBuilder()
  .book('j_r_r_tolkien', 'the_hobbit', 1937)
  .withRealityRelation('pure_fiction', 1.0)
  .withCopyright(['J.R.R. Tolkien Estate'], 1937, 'active')
  .withCreators({ writer: ['J.R.R. Tolkien'] })
  .withCulturalSignificance(0.92)
  .build();
```

## Builder Method Reference

### Universe Type Methods

- `.film(studio, title, year)` - Create film universe
- `.historicalEvent(event, year)` - Create historical event
- `.mission(agency, mission, year)` - Create mission universe
- `.biography(person, birthYear, deathYear?)` - Create biography
- `.book(author, title, year)` - Create book universe
- `.series(network, title, year)` - Create TV series
- `.game(publisher, title, year)` - Create game universe

### Configuration Methods

- `.withRealityRelation(type, degree, anchors?)` - Set reality relationship
- `.withCopyright(holders, year, status?)` - Set copyright info
- `.withPublicDomain(sources)` - Mark as public domain
- `.withCreators(creators)` - Set creator information
- `.withCulturalSignificance(0.0-1.0)` - Set cultural impact
- `.withMetadata(metadata)` - Add additional metadata

### Temporal Methods

- `.withRuntime(minutes, precision?)` - Add film runtime epoch
- `.withDateRange(start..., end..., precision?)` - Add date-based epoch
- `.withZeroReference(zero..., event, prefixes, duration)` - Add mission timeline
- `.withWindowing(strategy, avgSize?)` - Set windowing strategy

### Content Methods

- `.addRuntimeKeyframe(min, sec, id, significance, tags)` - Add film moment
- `.addDateKeyframe(date..., id, significance, tags)` - Add historical moment
- `.addRuntimeSegment(start..., end..., id, type?)` - Add film sequence
- `.addDateSegment(start..., end..., id, type?)` - Add time period

## Convenience Builders

For common patterns, use the specialized builders:

```typescript
import { 
  createFilmBuilder, 
  createHistoricalBuilder, 
  createMissionBuilder,
  createBiographyBuilder 
} from './core/universe-builder';

// Film with defaults (pure_fiction, scene_based windowing)
const filmUniverse = createFilmBuilder()
  .film('disney', 'mary_poppins', 1964)
  .withRuntime(139)
  .build();

// Historical with defaults (documentary, time_based windowing)
const historicalUniverse = createHistoricalBuilder()
  .historicalEvent('moon_landing', 1969)
  .withDateRange(1969, 7, 20, 1969, 7, 21, TimePrecision.SECOND)
  .build();
```

## Advanced Examples

### Complex Film with Multiple Segments

```typescript
const starWarsUniverse = new UniverseBuilder()
  .film('lucasfilm', 'star_wars', 1977)
  .withRuntime(121)
  .withRealityRelation('pure_fiction', 1.0)
  .withCopyright(['Lucasfilm Ltd.'], 1977, 'active')
  .withCreators({ 
    director: ['George Lucas'],
    writer: ['George Lucas']
  })
  .withCulturalSignificance(1.0)
  .withIdentifiers({
    imdb: 'tt0076759',
    aliases: ['a_new_hope', 'episode_iv']
  })
  // Act structure
  .addRuntimeSegment(0, 0, 30, 0, 'act_1', 'act')
  .addRuntimeSegment(30, 0, 90, 0, 'act_2', 'act')
  .addRuntimeSegment(90, 0, 121, 0, 'act_3', 'act')
  // Key moments
  .addRuntimeKeyframe(15, 30, 'princess_leia_message', 0.9, ['iconic', 'plot'])
  .addRuntimeKeyframe(52, 45, 'obi_wan_death', 0.95, ['emotional', 'sacrifice'])
  .addRuntimeKeyframe(115, 20, 'death_star_destruction', 1.0, ['climax', 'victory'])
  .build();
```

### Historical Event with Uncertainty

```typescript
const battleOfHastingsUniverse = new UniverseBuilder()
  .historicalEvent('battle_of_hastings', 1066)
  .withDateRange(1066, 10, 14, 1066, 10, 14, TimePrecision.HOUR)
  .withRealityRelation('documentary', 0.1) // Some interpretation
  .withPublicDomain(['Bayeux Tapestry', 'Anglo-Saxon Chronicle'])
  .withCulturalSignificance(0.95)
  // Uncertain timing of key events
  .addDateKeyframe(1066, 10, 14, 9, 0, 0, 'battle_begins', 0.8, ['battle'], 0.7)
  .addDateKeyframe(1066, 10, 14, 15, 0, 0, 'harold_death', 1.0, ['death', 'turning_point'], 0.6)
  .build();
```

### Mission with Countdown Timeline

```typescript
const apollo13Universe = new UniverseBuilder()
  .mission('nasa', 'apollo_13', 1970)
  .withZeroReference(
    1970, 4, 11, 19, 13, 0, // Launch time
    'launch',
    'T-', 'T+',
    168, // 7-day mission
    TimePrecision.SECOND
  )
  .withRealityRelation('documentary', 0.0)
  .withPublicDomain(['NASA Mission Transcripts'])
  .withCulturalSignificance(0.98)
  // Mission phases
  .addDateSegment(1970, 4, 11, 19, 1970, 4, 13, 21, 'oxygen_tank_explosion', 'mission_phase')
  .addDateSegment(1970, 4, 13, 21, 1970, 4, 17, 18, 'survival_mode', 'mission_phase')
  .build();
```

## Best Practices

### Builder Validation

The UniverseBuilder automatically validates your universe:

```typescript
try {
  const universe = new UniverseBuilder()
    .film('disney', 'mary_poppins', 1964)
    .withCulturalSignificance(1.5) // Invalid: > 1.0
    .build();
} catch (error) {
  console.error(error.message); // "Cultural significance must be between 0.0 and 1.0"
}
```

### Temporal Precision Guidelines

Choose appropriate precision for your content:

- **Films/TV**: `TimePrecision.MILLISECOND` (default for `.withRuntime()`)
- **Historical events**: `TimePrecision.SECOND` or `TimePrecision.MINUTE`
- **Biographical periods**: `TimePrecision.DAY` or `TimePrecision.YEAR`
- **Geological time**: `TimePrecision.MILLION_YEARS`

### Cultural Significance Scale

Rate cultural significance appropriately:

- **1.0**: Defining cultural moments (Moon Landing, Star Wars)
- **0.9**: Highly influential works (major films, historical events)
- **0.8**: Significant cultural impact (popular entertainment)
- **0.7**: Notable cultural presence (cult classics)
- **0.5**: Moderate impact (mainstream content)
- **0.3**: Limited impact (niche content)
- **0.1**: Minimal impact (personal significance)

### Method Chaining Best Practices

```typescript
// Good: Logical grouping and order
const universe = new UniverseBuilder()
  // 1. Universe type and identity
  .film('disney', 'mary_poppins', 1964)
  
  // 2. Reality and attribution
  .withRealityRelation('pure_fiction', 1.0)
  .withCopyright(['Walt Disney Productions'], 1964)
  .withCreators({ director: ['Robert Stevenson'] })
  
  // 3. Temporal structure
  .withRuntime(139)
  .withWindowing('scene_based')
  
  // 4. Content details
  .addRuntimeKeyframe(87, 15, 'umbrella_descent', 0.95, ['iconic'])
  .withCulturalSignificance(0.95)
  
  .build();
```

## Manual Universe Creation (Advanced)

For complex scenarios or when you need full control, you can still create universes manually:

### Low-Level Universe Creation

```typescript
import { 
  Universe, 
  UniverseType, 
  TimePrecision 
} from './core/types';
import { 
  createFilmUniverseId 
} from './core/universe-ids';
import { 
  createEpoch, 
  createKeyframe 
} from './utils/temporal-conversion';

export const manualUniverse: Universe = {
  universeId: createFilmUniverseId('disney', 'mary_poppins', 1964),
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
          endTime: 139n * 60n * 1000000000n, // 139 minutes
          precision: TimePrecision.MILLISECOND,
          description: "Film runtime from opening to credits"
        }
      }
    }
  ],
  
  epochs: {}, // Auto-populated by registry
  
  temporalStructure: {
    segments: [],
    keyframes: [
      createKeyframe(
        0, 0, 87, 15, 0, // 87 minutes 15 seconds into film
        'umbrella_descent',
        0.95,
        ['iconic', 'magical', 'referenced']
      )
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
    cultural_significance: 0.95
  }
};
```

### Manual Temporal Utilities

When creating universes manually, use these utilities:

```typescript
import { 
  dateToNanoseconds, 
  createEpoch, 
  createKeyframe, 
  createSegment 
} from './utils/temporal-conversion';

// Convert dates to nanosecond timestamps
const timestamp = dateToNanoseconds(1969, 7, 20, 20, 17, 40);

// Create temporal epochs
const epoch = createEpoch(
  1969, 7, 16,  // Start date
  1969, 7, 24,  // End date
  TimePrecision.SECOND,
  "apollo_11:mission",
  "Apollo 11 mission duration"
);

// Create keyframes and segments
const keyframe = createKeyframe(
  1969, 7, 20, 20, 17, 40,
  'moon_landing',
  1.0,
  ['historic', 'first', 'achievement']
);
```

## Troubleshooting

### Builder Validation Errors

The builder provides detailed error messages:

```typescript
// Common validation errors and fixes:

// 1. Missing attribution
const universe1 = new UniverseBuilder()
  .film('disney', 'mary_poppins', 1964)
  // Missing: .withCopyright() or .withPublicDomain()
  .build(); // Error: "Either copyright information or public domain flag must be set"

// 2. Invalid significance values
const universe2 = new UniverseBuilder()
  .film('disney', 'mary_poppins', 1964)
  .withCulturalSignificance(1.5) // Error: "Cultural significance must be between 0.0 and 1.0"
  .build();

// 3. Invalid keyframe significance
const universe3 = new UniverseBuilder()
  .film('disney', 'mary_poppins', 1964)
  .addRuntimeKeyframe(87, 15, 'scene', 2.0, ['tag']) // Error: significance > 1.0
  .build();
```

### Manual Validation

For manual universe creation:

```typescript
import { validateUniverseReference } from './core/universe-ids';

const validation = validateUniverseReference("disney:mary_poppins:1964");
if (!validation.isValid) {
  console.error(validation.error);
}
```

## Migration from Manual to Builder

Convert existing manual universe definitions:

```typescript
// Before (manual)
const oldUniverse: Universe = {
  universeId: createFilmUniverseId('disney', 'mary_poppins', 1964),
  type: UniverseType.FILM,
  // ... many manual fields
};

// After (builder)
const newUniverse = new UniverseBuilder()
  .film('disney', 'mary_poppins', 1964)
  .withRuntime(139)
  .withRealityRelation('pure_fiction', 1.0)
  .withCopyright(['Walt Disney Productions'], 1964)
  .withCulturalSignificance(0.95)
  .build();
```

## Universe Networks

Universe Networks group related universes that share temporal, thematic, or cultural connections. Networks enable cross-universe temporal queries and provide shared context for related content.

### Understanding Network Types

Networks can be organized by various criteria:

- **Corporate Networks**: All universes from a single studio/publisher (Disney, Marvel, etc.)
- **Franchise Networks**: Related works in a series (Star Wars, Lord of the Rings)
- **Historical Networks**: Events from the same time period or region
- **Thematic Networks**: Works sharing common themes or influences
- **Cultural Networks**: Works from the same cultural movement or era

### Creating Networks

#### Basic Network Creation

```typescript
import { UniverseNetwork, NetworkEra } from './core/types';
import { createUniverseId } from './core/universe-ids';

const disneyNetwork: UniverseNetwork = {
  networkId: 'disney_animated_classics',
  universes: new Set([
    createUniverseId('disney:snow_white:1937'),
    createUniverseId('disney:pinocchio:1940'),
    createUniverseId('disney:mary_poppins:1964'),
    createUniverseId('disney:the_lion_king:1994')
  ]),
  sharedEpochs: {
    corporate: {
      epochId: 'disney_golden_age',
      startTime: dateToNanoseconds(1937, 12, 21), // Snow White release
      endTime: dateToNanoseconds(1967, 10, 18),   // Jungle Book release
      precision: TimePrecision.DAY,
      description: 'Disney Golden Age of Animation'
    }
  },
  eras: [
    {
      eraId: 'golden_age',
      name: 'Golden Age (1937-1942)',
      start: dateToNanoseconds(1937, 12, 21),
      end: dateToNanoseconds(1942, 8, 13),
      universes: [
        createUniverseId('disney:snow_white:1937'),
        createUniverseId('disney:pinocchio:1940'),
        createUniverseId('disney:fantasia:1940'),
        createUniverseId('disney:bambi:1942')
      ]
    },
    {
      eraId: 'silver_age',
      name: 'Silver Age (1950-1967)',
      start: dateToNanoseconds(1950, 2, 15),
      end: dateToNanoseconds(1967, 10, 18),
      universes: [
        createUniverseId('disney:cinderella:1950'),
        createUniverseId('disney:mary_poppins:1964'),
        createUniverseId('disney:jungle_book:1967')
      ]
    }
  ]
};
```

#### Network Builder Pattern

For complex networks, consider creating a builder:

```typescript
class NetworkBuilder {
  private network: Partial<UniverseNetwork> = {};
  private universes: Set<UniverseId> = new Set();
  private eras: NetworkEra[] = [];

  constructor(networkId: string) {
    this.network.networkId = networkId;
    this.network.universes = this.universes;
  }

  addUniverse(universeId: UniverseId): NetworkBuilder {
    this.universes.add(universeId);
    return this;
  }

  addUniverses(universeIds: UniverseId[]): NetworkBuilder {
    universeIds.forEach(id => this.universes.add(id));
    return this;
  }

  withCorporateEpoch(
    startYear: number, startMonth: number, startDay: number,
    endYear: number, endMonth: number, endDay: number,
    description: string
  ): NetworkBuilder {
    this.network.sharedEpochs = {
      corporate: createEpoch(
        startYear, startMonth, startDay,
        endYear, endMonth, endDay,
        TimePrecision.DAY,
        `${this.network.networkId}:corporate`,
        description
      )
    };
    return this;
  }

  addEra(
    eraId: string,
    name: string,
    startYear: number, startMonth: number, startDay: number,
    endYear: number, endMonth: number, endDay: number,
    universeIds: UniverseId[]
  ): NetworkBuilder {
    this.eras.push({
      eraId,
      name,
      start: dateToNanoseconds(startYear, startMonth, startDay),
      end: dateToNanoseconds(endYear, endMonth, endDay),
      universes: universeIds
    });
    return this;
  }

  build(): UniverseNetwork {
    this.network.eras = this.eras;
    return this.network as UniverseNetwork;
  }
}

// Usage
const marvelNetwork = new NetworkBuilder('marvel_cinematic_universe')
  .addUniverses([
    createUniverseId('marvel:iron_man:2008'),
    createUniverseId('marvel:thor:2011'),
    createUniverseId('marvel:avengers:2012')
  ])
  .withCorporateEpoch(2008, 5, 2, 2019, 4, 26, 'MCU Infinity Saga')
  .addEra('phase_1', 'Phase One', 2008, 5, 2, 2012, 5, 4, [
    createUniverseId('marvel:iron_man:2008'),
    createUniverseId('marvel:thor:2011'),
    createUniverseId('marvel:avengers:2012')
  ])
  .build();
```

### Referencing Networks

#### Network Membership

Add universes to networks during creation:

```typescript
const universe = new UniverseBuilder()
  .film('disney', 'the_lion_king', 1994)
  .withRuntime(88)
  .withRealityRelation('pure_fiction', 1.0)
  .withCopyright(['Walt Disney Pictures'], 1994)
  .withCulturalSignificance(0.95)
  .build();

// Add to network after creation
disneyNetwork.universes.add(universe.universeId);
```

#### Cross-Network References

Reference universes across different networks:

```typescript
import { ReferenceType } from './core/types';

// Create reference between networks
const crossNetworkReference = {
  from: 'disney:mary_poppins:1964',
  to: 'history:suffrage_movement:1903',
  type: ReferenceType.INSPIRED_BY,
  documented: true,
  influence_type: 'historical_context',
  specific_mappings: [
    {
      source_element: 'mrs_banks_suffragette',
      target_element: 'womens_suffrage_activism',
      transformation: 'comedic_portrayal',
      tolkien_acknowledged: false
    }
  ]
};
```

### Updating Networks

#### Adding New Universes

```typescript
function addUniverseToNetwork(
  network: UniverseNetwork, 
  universeId: UniverseId,
  eraId?: string
): UniverseNetwork {
  // Add to main network
  network.universes.add(universeId);
  
  // Add to specific era if specified
  if (eraId) {
    const era = network.eras.find(e => e.eraId === eraId);
    if (era) {
      era.universes.push(universeId);
    }
  }
  
  return network;
}

// Usage
addUniverseToNetwork(
  disneyNetwork, 
  createUniverseId('disney:frozen:2013'),
  'renaissance_era'
);
```

#### Updating Network Eras

```typescript
function updateNetworkEra(
  network: UniverseNetwork,
  eraId: string,
  updates: Partial<NetworkEra>
): UniverseNetwork {
  const eraIndex = network.eras.findIndex(e => e.eraId === eraId);
  if (eraIndex !== -1) {
    network.eras[eraIndex] = {
      ...network.eras[eraIndex],
      ...updates
    };
  }
  return network;
}

// Extend an era's timeline
updateNetworkEra(disneyNetwork, 'renaissance_era', {
  end: dateToNanoseconds(2010, 12, 25), // Extend to include Tangled
  universes: [
    ...disneyNetwork.eras.find(e => e.eraId === 'renaissance_era')?.universes || [],
    createUniverseId('disney:tangled:2010')
  ]
});
```

#### Network Versioning

```typescript
interface NetworkVersion {
  version: string;
  timestamp: Date;
  changes: NetworkChange[];
  network: UniverseNetwork;
}

interface NetworkChange {
  type: 'add_universe' | 'remove_universe' | 'update_era' | 'add_era';
  universeId?: UniverseId;
  eraId?: string;
  description: string;
}

function createNetworkVersion(
  network: UniverseNetwork,
  version: string,
  changes: NetworkChange[]
): NetworkVersion {
  return {
    version,
    timestamp: new Date(),
    changes,
    network: JSON.parse(JSON.stringify(network)) // Deep clone
  };
}
```

### Expanding Networks

#### Network Hierarchies

Create parent-child network relationships:

```typescript
interface NetworkHierarchy {
  parentNetwork: UniverseNetwork;
  childNetworks: UniverseNetwork[];
  relationships: NetworkRelationship[];
}

interface NetworkRelationship {
  parentId: string;
  childId: string;
  relationshipType: 'subsidiary' | 'franchise' | 'thematic' | 'temporal';
  strength: number; // 0.0-1.0
}

const disneyHierarchy: NetworkHierarchy = {
  parentNetwork: {
    networkId: 'disney_all',
    universes: new Set(), // Populated from children
    eras: []
  },
  childNetworks: [
    disneyAnimatedNetwork,
    disneyLiveActionNetwork,
    pixarNetwork,
    marvelNetwork // If owned by Disney
  ],
  relationships: [
    {
      parentId: 'disney_all',
      childId: 'disney_animated_classics',
      relationshipType: 'subsidiary',
      strength: 1.0
    },
    {
      parentId: 'disney_all',
      childId: 'pixar_films',
      relationshipType: 'subsidiary',
      strength: 0.8 // Acquired later
    }
  ]
};
```

#### Network Intersections

Find overlapping universes between networks:

```typescript
function findNetworkIntersections(
  network1: UniverseNetwork,
  network2: UniverseNetwork
): {
  sharedUniverses: UniverseId[];
  network1Only: UniverseId[];
  network2Only: UniverseId[];
} {
  const set1 = new Set(network1.universes);
  const set2 = new Set(network2.universes);
  
  const sharedUniverses = Array.from(set1).filter(id => set2.has(id));
  const network1Only = Array.from(set1).filter(id => !set2.has(id));
  const network2Only = Array.from(set2).filter(id => !set1.has(id));
  
  return { sharedUniverses, network1Only, network2Only };
}

// Find crossover between Disney and historical networks
const intersection = findNetworkIntersections(
  disneyNetwork,
  historicalEventsNetwork
);
```

#### Dynamic Network Expansion

```typescript
class NetworkExpander {
  static expandByTheme(
    baseNetwork: UniverseNetwork,
    theme: string,
    universeRegistry: Map<UniverseId, Universe>
  ): UniverseNetwork {
    const expandedNetwork = { ...baseNetwork };
    
    // Find universes with matching themes
    for (const [id, universe] of universeRegistry) {
      if (universe.temporalStructure?.keyframes.some(kf => 
        kf.tags.includes(theme)
      )) {
        expandedNetwork.universes.add(id);
      }
    }
    
    return expandedNetwork;
  }
  
  static expandByTimeRange(
    baseNetwork: UniverseNetwork,
    startTime: bigint,
    endTime: bigint,
    universeRegistry: Map<UniverseId, Universe>
  ): UniverseNetwork {
    const expandedNetwork = { ...baseNetwork };
    
    // Find universes within time range
    for (const [id, universe] of universeRegistry) {
      const hasOverlap = universe.layers.some(layer =>
        Object.values(layer.epochs).some(epoch => {
          const epochStart = epoch.startTime || epoch.start || 0n;
          const epochEnd = epoch.endTime || epoch.end || 0n;
          return epochStart <= endTime && epochEnd >= startTime;
        })
      );
      
      if (hasOverlap) {
        expandedNetwork.universes.add(id);
      }
    }
    
    return expandedNetwork;
  }
  
  static expandByCreator(
    baseNetwork: UniverseNetwork,
    creator: string,
    universeRegistry: Map<UniverseId, Universe>
  ): UniverseNetwork {
    const expandedNetwork = { ...baseNetwork };
    
    // Find universes by the same creator
    for (const [id, universe] of universeRegistry) {
      const hasCreator = universe.metadata?.creators.includes(creator) ||
        universe.attribution?.creators?.director?.includes(creator) ||
        universe.attribution?.creators?.writer?.includes(creator);
      
      if (hasCreator) {
        expandedNetwork.universes.add(id);
      }
    }
    
    return expandedNetwork;
  }
}

// Usage
const thematicNetwork = NetworkExpander.expandByTheme(
  baseNetwork,
  'coming_of_age',
  universeRegistry
);

const contemporaryNetwork = NetworkExpander.expandByTimeRange(
  baseNetwork,
  dateToNanoseconds(1960, 1, 1),
  dateToNanoseconds(1970, 1, 1),
  universeRegistry
);
```

### Network Queries and Analysis

#### Network Statistics

```typescript
interface NetworkStats {
  totalUniverses: number;
  averageCulturalSignificance: number;
  timeSpan: {
    earliest: bigint;
    latest: bigint;
    duration: bigint;
  };
  eraDistribution: Map<string, number>;
  creatorFrequency: Map<string, number>;
}

function analyzeNetwork(
  network: UniverseNetwork,
  universeRegistry: Map<UniverseId, Universe>
): NetworkStats {
  const universes = Array.from(network.universes)
    .map(id => universeRegistry.get(id))
    .filter(Boolean) as Universe[];
  
  const culturalSignificances = universes
    .map(u => u.metadata?.cultural_significance || 0)
    .filter(s => s > 0);
  
  const timestamps = universes.flatMap(u =>
    u.layers.flatMap(layer =>
      Object.values(layer.epochs).flatMap(epoch => [
        epoch.startTime || epoch.start || 0n,
        epoch.endTime || epoch.end || 0n
      ])
    )
  ).filter(t => t > 0n);
  
  const creators = universes.flatMap(u => u.metadata?.creators || []);
  
  return {
    totalUniverses: universes.length,
    averageCulturalSignificance: culturalSignificances.reduce((a, b) => a + b, 0) / culturalSignificances.length,
    timeSpan: {
      earliest: timestamps.length > 0 ? timestamps.reduce((a, b) => a < b ? a : b) : 0n,
      latest: timestamps.length > 0 ? timestamps.reduce((a, b) => a > b ? a : b) : 0n,
      duration: timestamps.length > 0 ? 
        timestamps.reduce((a, b) => a > b ? a : b) - timestamps.reduce((a, b) => a < b ? a : b) : 0n
    },
    eraDistribution: new Map(
      network.eras.map(era => [era.name, era.universes.length])
    ),
    creatorFrequency: creators.reduce((map, creator) => {
      map.set(creator, (map.get(creator) || 0) + 1);
      return map;
    }, new Map<string, number>())
  };
}
```

#### Cross-Network Temporal Queries

```typescript
function queryAcrossNetworks(
  networks: UniverseNetwork[],
  timeRange: { start: bigint; end: bigint },
  universeRegistry: Map<UniverseId, Universe>
): {
  matchingUniverses: Universe[];
  networkDistribution: Map<string, number>;
} {
  const matchingUniverses: Universe[] = [];
  const networkDistribution = new Map<string, number>();
  
  for (const network of networks) {
    let networkMatches = 0;
    
    for (const universeId of network.universes) {
      const universe = universeRegistry.get(universeId);
      if (!universe) continue;
      
      const hasOverlap = universe.layers.some(layer =>
        Object.values(layer.epochs).some(epoch => {
          const epochStart = epoch.startTime || epoch.start || 0n;
          const epochEnd = epoch.endTime || epoch.end || 0n;
          return epochStart <= timeRange.end && epochEnd >= timeRange.start;
        })
      );
      
      if (hasOverlap) {
        matchingUniverses.push(universe);
        networkMatches++;
      }
    }
    
    if (networkMatches > 0) {
      networkDistribution.set(network.networkId, networkMatches);
    }
  }
  
  return { matchingUniverses, networkDistribution };
}
```

### Network Configuration Files

Store networks in configuration files for easy management:

```jsonc
// networks/disney-animated.json
{
  "version": "1.0",
  "network": {
    "networkId": "disney_animated_classics",
    "universes": [
      "disney:snow_white:1937",
      "disney:pinocchio:1940",
      "disney:mary_poppins:1964"
    ],
    "sharedEpochs": {
      "corporate": {
        "epochId": "disney_golden_age",
        "startTime": "1937-12-21T00:00:00Z",
        "endTime": "1967-10-18T00:00:00Z",
        "precision": "DAY",
        "description": "Disney Golden Age of Animation"
      }
    },
    "eras": [
      {
        "eraId": "golden_age",
        "name": "Golden Age (1937-1942)",
        "start": "1937-12-21T00:00:00Z",
        "end": "1942-08-13T00:00:00Z",
        "universes": [
          "disney:snow_white:1937",
          "disney:pinocchio:1940"
        ]
      }
    ]
  }
}
```

## Next Steps

1. **Start with the Builder**: Use `UniverseBuilder` for all new universes
2. **Register your universe**: Add to `UniverseRegistry`
3. **Create references**: Link to other universes with temporal references
4. **Join networks**: Add your universe to appropriate `UniverseNetwork`s
5. **Expand networks**: Use network expansion strategies to discover related content
6. **Analyze networks**: Generate statistics and insights from network data
7. **Test and validate**: Use integration tests to verify temporal queries and network relationships
