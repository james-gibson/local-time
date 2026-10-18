>Disclaimer: This project is me learning how to paint with a llm. If it's helpful let me know!
>
> The Disclaimers Disclaimer: I've tried to take my time sourcing the reference material underlying the metadata in this project. Truth be told, mistakes can and likely will slip in as I go however. This project uses declarative identifiers as internal symbol names of universes and events, the intent is even if a refactor or bug broke this project the intention anything built on it wasn't lost. In that spirit, be prepared to pin to a specific SHA if you did run into a problem. File an issue and we shall get it sorted, ideally
>
> The Disclaimers Disclaimers note: If a reference correction removes an id you used, it's a good idea to locally create that id again with the builder patterns such all reference time logic continues to work. If it wasn't supposed to be removed see the answer above

# Local Time System - README

## Overview

The Local Time System is a comprehensive TypeScript library for managing temporal universes, cross-universe references, and temporal relationships. It provides a sophisticated framework for tracking time across fictional and real works, with support for zero-reference addressing, temporal paradoxes, and complex reference chains.

## Documentation

This README is the front door. The deeper material:

**Guides and decisions**

- **[Universe creation guide](docs/universe-creation-guide.md)** — the builder patterns, and how to write a universe definition.
- **[Troubleshooting](docs/troubleshooting.md)**.
- **[ADR 0001 — timestamp and storage representation for SQLite](docs/adr/0001-sqlite-timestamp-storage.md)** — the first architecture decision record.

**Design rationale**

- **[Design rationale index](explorations/README.md)** — the pre-implementation design transcripts, mapped to what is implemented and what is not. In particular it records the constructs that are designed and typed but **never populated** (`reality_correspondence`, shared window aliases) and the issues that track them: [#74](https://github.com/james-gibson/local-time/issues/74) containment, [#75](https://github.com/james-gibson/local-time/issues/75) composition, [#76](https://github.com/james-gibson/local-time/issues/76) embedding projection, [#82](https://github.com/james-gibson/local-time/issues/82) shared windows.
- **[Universe generator prompt](kagi.md)** — the instructions a model follows when generating a universe definition, including the registration invariants.
- **[Exploration transcripts](explorations/)** — `prompt.md`, `types.md`, `proposal.md`, `multi.md`, `example.ts.md`.

**Elsewhere**

- **[Generated documentation site](docs/site/)** — Hugo/Doks, rebuilt on local sync from the docs project.
- **[Open issues](https://github.com/james-gibson/local-time/issues)** — the live work.

## Features

### ✅ Core Features (Complete)
- **Branded Universe IDs**: Type-safe universe identification with validation
- **Temporal Conversion Utilities**: Easy date-to-nanosecond conversion and epoch creation
- **Universe Builder Pattern**: Fluent API for creating universes with validation
- **Comprehensive Type System**: Extensive TypeScript types with JSDoc documentation
- **Zero-Reference Addressing**: T-minus/T-plus style temporal addressing for missions
- **Cross-Universe References**: Track influences, homages, and temporal paradoxes
- **Universe Networks**: Group related universes (Disney, Marvel, NASA, etc.)
- **MCP Integration**: AI-powered universe generation prompts
- **Query System**: Find universes by temporal windows and relationships

### ✅ Universe Examples (Complete)
- **Films**: Mary Poppins, Star Wars, Back to the Future
- **Games**: Pokemon Red/Blue with battle validation
- **Historical Events**: JFK assassination, Apollo 11 mission
- **Biographical**: J.R.R. Tolkien, Britney Spears
- **Legal Timelines**: US legal precedents and legislation
- **Mission Timelines**: NASA missions with zero-reference epochs

### ✅ Advanced Features (Complete)
- **Temporal Paradox Detection**: Back to the Future Johnny B. Goode example
- **Influence Chain Analysis**: WWI → Tolkien → Middle-earth transformation
- **Reality Gradient Analysis**: Measure fictionalization degrees
- **Attribution Engine**: Copyright and fair use analysis
- **Biographical Queries**: Age-based event validation
- **Window Search**: Find temporal overlaps across universes

## Installation

```bash
npm install @local-time/temporal-system
```

## Quick Start

### Creating a Film Universe

```typescript
import { UniverseBuilder } from '@local-time/temporal-system';

const universe = new UniverseBuilder()
  .film('disney', 'mary_poppins', 1964)
  .withRuntime(139) // minutes
  .withRealityRelation('pure_fiction', 1.0)
  .withCopyright(['Walt Disney Productions'], 1964, 'active')
  .withCulturalSignificance(0.98)
  .addRuntimeKeyframe(87, 15, 'umbrella_descent', 0.95, ['iconic', 'magical'])
  .build();
```

### Creating a Historical Event Universe

```typescript
const universe = new UniverseBuilder()
  .historicalEvent('jfk_assassination', 1963)
  .withDateRange(1963, 11, 22, 1963, 11, 22, TimePrecision.SECOND)
  .withRealityRelation('documentary', 0.0)
  .withPublicDomain(['Warren Commission Report'])
  .addDateKeyframe(1963, 11, 22, 12, 30, 0, 'first_shot', 1.0, ['assassination'])
  .build();
```

### Querying Universes

```typescript
import { LocalTime } from '@local-time/temporal-system';

const localTime = new LocalTime();
await localTime.initialize();

// Find universes in 1964
const windowSearch = localTime.getWindowSearch();
const universes = await windowSearch.findUniversesInWindow('cal:1964');

// Get specific universe
const registry = localTime.getRegistry();
const maryPoppins = registry.getUniverse('disney:mary_poppins:1964');
```

## Project Status

### Phase 1: Foundation & Type Safety ✅ COMPLETE
- [x] **Typesafe Universe IDs**: Comprehensive branded types with validation patterns
- [x] **Temporal Utilities**: Full conversion utilities with date helpers and epoch creation
- [x] **Type Consolidation**: All types properly organized in `src/core/types.ts`

### Phase 2: Documentation & Developer Experience ✅ COMPLETE
- [x] **Type Documentation**: Extensive JSDoc with examples and validation rules
- [x] **Universe Creation Helpers**: Complete builder pattern with fluent API
- [x] **Usage Guides**: Comprehensive documentation with troubleshooting

### Phase 3: Advanced Functionality ✅ COMPLETE
- [x] **Universe Builder Pattern**: Sophisticated fluent API with validation
- [x] **Enhanced Query Capabilities**: WindowSearch with temporal overlap detection
- [x] **Validation System**: Builder validation with comprehensive error checking

### Phase 4: Testing & Examples ✅ COMPLETE
- [x] **Comprehensive Test Suite**: Pokemon battle validation, temporal paradox tests
- [x] **Advanced Example Universes**: Rich examples across all domains
- [x] **Integration Tests**: Cross-universe reference validation

### Phase 5: Database Integration 🔄 IN PROGRESS
- [x] **Prisma Schema**: Complete normalized schema for universe storage
- [x] **Database Seeding**: Comprehensive seed script with all universe examples
- [ ] **Repository Pattern**: Database abstraction layer (planned)
- [ ] **Migration Tools**: In-memory to database migration utilities (planned)

### Phase 6: Performance & Optimization 📋 PLANNED
- [ ] **Query Caching**: Result caching for expensive operations
- [ ] **Lazy Loading**: On-demand universe loading for large datasets
- [ ] **Performance Monitoring**: Query performance tracking

## Architecture

### Core Components

```
src/
├── core/                    # Core types and builders
│   ├── types.ts            # Comprehensive type definitions
│   ├── universe-ids.ts     # Branded ID types and validation
│   └── universe-builder.ts # Fluent API for universe creation
├── utils/                   # Utility functions
│   ├── temporal-conversion.ts # Date/time conversion utilities
│   ├── reference-helpers.ts   # Cross-universe reference tools
│   └── attribution-engine.ts # Copyright and fair use analysis
├── config/                  # Universe definitions and configuration
│   ├── universe-registry.ts # In-memory universe storage
│   └── universes/          # Universe definition files
├── query/                   # Query and search functionality
│   └── window-search.ts    # Temporal window queries
└── addressing/              # Zero-reference addressing
    └── zero-reference-addressing.ts # T-minus/T-plus addressing
```

### Database Schema

The system uses Prisma with SQLite (development) or PostgreSQL (production):

- **universes**: Core universe metadata
- **temporal_layers**: Temporal organization layers
- **temporal_epochs**: Time periods within layers
- **temporal_structures**: Detailed temporal organization
- **universe_networks**: Related universe groupings
- **temporal_references**: Cross-universe connections

## Universe Types Supported

- **FILM**: Movies, documentaries, short films
- **SERIES**: TV shows, web series, episodic content
- **BOOK**: Novels, non-fiction, academic works
- **HISTORICAL_EVENT**: Real historical occurrences
- **BIOGRAPHY**: Life stories and personal timelines
- **MISSION**: Space missions, military operations
- **LEGAL_TIMELINE**: Laws, court decisions, precedents
- **SIMULATION**: Games, virtual environments

## Advanced Features

### Zero-Reference Addressing
```typescript
// T-minus/T-plus addressing for missions
const address = "nasa:apollo11:1969:launch:T-00:05:30"; // T-5:30 before liftoff
```

### Temporal Paradoxes
```typescript
// Back to the Future: Johnny B. Goode paradox
const reference = {
  type: ReferenceType.TEMPORAL_PARADOX,
  description: "Marty performs song before Chuck Berry writes it"
};
```

### Influence Chains
```typescript
// WWI → Tolkien → Middle-earth transformation chain
const chain = createTolkienInfluenceChain();
// Traces: Historical trauma → Personal experience → Creative sublimation
```

### Reality Gradients
```typescript
// Measure fictionalization degree
const gradient = RealityGradientAnalyzer.analyzeUniverse(universe);
// 0.0 = pure documentary, 1.0 = pure fiction
```

## Development

### Setup
```bash
git clone <repository>
cd local-time-system
npm install
npm run build
```

### Testing
```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
npm run validate         # Validate universe definitions
```

### Database
```bash
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:seed          # Seed with universe examples
npm run db:studio        # Open Prisma Studio
```

## Examples

### Pokemon Battle Validation
```typescript
// Validates: "Can Ash battle before receiving first Pokemon?"
const canBattle = canEventOccur(
  pokemonUniverse,
  'battle_action',
  beforeStarterTimestamp
); // Returns false
```

### Cultural Significance Analysis
```typescript
// Rate cultural impact (0.0-1.0 scale)
const significance = {
  "Star Wars": 0.99,        // Defining cultural moment
  "Mary Poppins": 0.95,     // Highly influential
  "Pokemon": 0.90           // Major cultural impact
};
```

### Cross-Universe References
```typescript
// Mary Poppins → Guardians of the Galaxy visual homage
const reference = {
  type: ReferenceType.VISUAL_HOMAGE,
  description: "Yondu's umbrella descent references Mary Poppins",
  anchors: [
    { domainId: "disney:mary_poppins:1964", eventId: "umbrella_descent" },
    { domainId: "marvel:guardians2:2017", eventId: "yondu_descent" }
  ]
};
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add comprehensive tests
4. Update documentation
5. Submit a pull request

### Adding New Universes

Use the Universe Builder for type safety and validation:

```typescript
const newUniverse = new UniverseBuilder()
  .film('studio', 'title', year)
  .withRealityRelation('pure_fiction', 1.0)
  .withCopyright(['Studio'], year)
  .build();
```


## Roadmap

### Immediate (Q1 2024)
- [ ] Complete database repository pattern
- [ ] Performance optimization for large datasets
- [ ] Enhanced validation CLI tools

### Short-term (Q2 2024)
- [ ] MCP-powered universe generation tools
- [ ] Advanced analytics and influence mapping
- [ ] Web-based universe explorer

### Long-term (Q3-Q4 2024)
- [ ] Multi-user collaboration features
- [ ] Real-time universe synchronization
- [ ] Machine learning for reference detection

---

**Current Status**: Production-ready core system with comprehensive examples and documentation. Database integration in progress. Ready for community contributions and real-world usage.
