import { UniverseType } from '../../core/types.js';
import { FILM_MCP_PROMPT } from './film-prompt.js';
import { MISSION_MCP_PROMPT } from './mission-prompt.js';
import { HISTORICAL_EVENT_MCP_PROMPT } from './historical-prompt.js';
import { BOOK_MCP_PROMPT } from './book-prompt.js';
import { PERSONAL_EXPERIENCE_MCP_PROMPT } from './personal-prompt.js';
import { CONNECTION_MCP_PROMPT } from './connection-prompt.js';
import { NETWORK_MCP_PROMPT } from './network-prompt.js';

// Re-export MCP core functionality
export { UniverseMCPServer, createUniverseMCPServer } from '../mcp/server.js';
export { UniverseMCPClient, createUniverseMCPClient, type MCPTransport } from '../mcp/client.js';
export type { 
  MCPServer, 
  MCPCapabilities, 
  MCPTool, 
  MCPResource, 
  MCPPrompt,
  UniverseMCPTool,
  UniverseMCPResource,
  UniverseMCPContext
} from '../mcp/types.js';

export interface MCPPromptTemplate {
  universeType: UniverseType;
  prompt: string;
  capabilities: string[];
  dataSources: string[];
  restrictions: string[];
  default?: boolean;
}

export const MCP_PROMPT_TEMPLATES = {
  [UniverseType.FILM]: {
    universeType: UniverseType.FILM,
    prompt: FILM_MCP_PROMPT,
    capabilities: [
      'Film runtime analysis',
      'Narrative structure mapping',
      'Scene identification and timing',
      'Cultural significance assessment',
      'Copyright and attribution research'
    ],
    dataSources: [
      'IMDb',
      'Film databases',
      'Copyright registries',
      'Cultural analysis sources',
      'Box office databases'
    ],
    restrictions: [
      'No TV show or series data',
      'No real-time broadcast information',
      'No episode structures',
      'Focus only on theatrical releases'
    ]
  },

  [UniverseType.MISSION]: {
    universeType: UniverseType.MISSION,
    prompt: MISSION_MCP_PROMPT,
    capabilities: [
      'Zero-reference timeline creation',
      'Mission phase mapping',
      'Critical event identification',
      'Government attribution handling',
      'Technical timeline precision'
    ],
    dataSources: [
      'NASA archives',
      'Military records',
      'Government databases',
      'Mission transcripts',
      'Scientific expedition logs'
    ],
    restrictions: [
      'No fictional missions',
      'No classified information',
      'No speculative content',
      'Real historical missions only'
    ]
  },

  [UniverseType.HISTORICAL_EVENT]: {
    universeType: UniverseType.HISTORICAL_EVENT,
    prompt: HISTORICAL_EVENT_MCP_PROMPT,
    capabilities: [
      'Historical timeline verification',
      'Multi-source consensus building',
      'Historiographical analysis',
      'Primary source integration',
      'Academic accuracy standards'
    ],
    dataSources: [
      'Academic databases',
      'Government archives',
      'Museum collections',
      'Primary source documents',
      'Peer-reviewed research'
    ],
    restrictions: [
      'No fictional events',
      'No speculative history',
      'No personal experiences',
      'Verified historical facts only'
    ]
  },

  [UniverseType.BOOK]: {
    universeType: UniverseType.BOOK,
    prompt: BOOK_MCP_PROMPT,
    capabilities: [
      'Narrative structure analysis',
      'Reading time estimation',
      'Literary significance assessment',
      'Publication research',
      'Copyright verification'
    ],
    dataSources: [
      'Library catalogs',
      'ISBN databases',
      'Publisher records',
      'Literary criticism',
      'Academic analysis'
    ],
    restrictions: [
      'No film adaptations',
      'No audiobook timing',
      'No fan fiction',
      'Published works only'
    ]
  },

  [UniverseType.PERSONAL_EXPERIENCE]: {
    universeType: UniverseType.PERSONAL_EXPERIENCE,
    prompt: PERSONAL_EXPERIENCE_MCP_PROMPT,
    capabilities: [
      'Privacy-aware structure creation',
      'Subjective time handling',
      'Anonymization techniques',
      'Cultural sensitivity',
      'Trauma-informed approaches'
    ],
    dataSources: [
      'Anonymized interviews',
      'Historical context',
      'Cultural databases',
      'Psychological research',
      'Sociological studies'
    ],
    restrictions: [
      'No identifying information',
      'No unauthorized personal data',
      'No exploitative content',
      'Consent required for living individuals'
    ]
  },

  [UniverseType.SERIES]: {
    universeType: UniverseType.SERIES,
    prompt: `# TV Series Universe Generation - Model Context Protocol\n\nSpecialized for television series with episode structures, season arcs, and broadcast timelines.`,
    capabilities: ['Episode mapping', 'Season structure', 'Broadcast timeline', 'Series continuity'],
    dataSources: ['TV databases', 'Broadcast records', 'Streaming platforms'],
    restrictions: ['No single films', 'No books', 'Series content only']
  },

  [UniverseType.PATENT]: {
    universeType: UniverseType.PATENT,
    prompt: `# Patent Universe Generation - Model Context Protocol\n\nSpecialized for patent applications, filing timelines, and intellectual property development.`,
    capabilities: ['Patent timeline mapping', 'Filing process tracking', 'IP development phases'],
    dataSources: ['Patent offices', 'USPTO database', 'International patent databases'],
    restrictions: ['No trade secrets', 'Public patent data only', 'No pending applications']
  },

  [UniverseType.SIMULATION]: {
    universeType: UniverseType.SIMULATION,
    prompt: `# Simulation Universe Generation - Model Context Protocol\n\nSpecialized for simulations, models, and virtual environments with their own temporal logic.`,
    capabilities: ['Simulation timeline mapping', 'Virtual event tracking', 'Model state changes'],
    dataSources: ['Simulation logs', 'Model documentation', 'Virtual environment data'],
    restrictions: ['No real-world events', 'Simulation data only', 'Virtual timelines only']
  },

  [UniverseType.MEDICAL_PROCEDURE]: {
    universeType: UniverseType.MEDICAL_PROCEDURE,
    prompt: `# Medical Procedure Universe Generation - Model Context Protocol\n\nSpecialized for medical procedures with precise timing, phases, and patient privacy protection.`,
    capabilities: ['Procedure timeline mapping', 'Medical phase tracking', 'Privacy protection'],
    dataSources: ['Medical literature', 'Procedure protocols', 'Anonymized case studies'],
    restrictions: ['No patient identification', 'No confidential data', 'General procedures only']
  }
};

export function getMCPPrompt(universeType: UniverseType): MCPPromptTemplate {
  const result = (MCP_PROMPT_TEMPLATES as any)[universeType] as MCPPromptTemplate;

  if (!result) { throw new Error(`Could not locate \${universeType}: ${universeType}`); }

  return result;
}

// Special prompt templates for cross-universe analysis
export const SPECIAL_MCP_PROMPTS = {
  CONNECTION_DISCOVERY: {
    prompt: CONNECTION_MCP_PROMPT,
    capabilities: [
      'Cross-universe reference identification',
      'Brand relationship mapping',
      'Cultural influence chain analysis',
      'Temporal paradox detection',
      'Network coherence analysis'
    ],
    dataSources: [
      'Cross-reference databases',
      'Brand content catalogs',
      'Cultural analysis sources',
      'Fan community databases',
      'Academic intertextuality studies'
    ],
    restrictions: [
      'No fictional connections',
      'Evidence-based relationships only',
      'Respect copyright boundaries',
      'No speculative connections'
    ]
  },
  
  NETWORK_ANALYSIS: {
    prompt: NETWORK_MCP_PROMPT,
    capabilities: [
      'Brand universe collection',
      'Temporal era mapping',
      'Creative team relationship analysis',
      'Cross-platform strategy identification',
      'Franchise expansion pattern recognition'
    ],
    dataSources: [
      'Studio/publisher catalogs',
      'Business strategy documents',
      'Creative team databases',
      'Cultural movement studies',
      'Industry analysis reports'
    ],
    restrictions: [
      'No speculative networks',
      'Respect ownership boundaries',
      'Evidence-based relationships only',
      'No fictional brand connections'
    ]
  },

  TYPESCRIPT_CLASS_GENERATOR: {
    prompt: `# TypeScript Universe Class Generator - Model Context Protocol

You are a specialized TypeScript class generator for the Local Time Universe System. Your role is to generate complete, type-safe TypeScript universe definitions following the established patterns and documentation.

## Core Responsibilities

1. **Universe Structure Generation**: Create complete Universe objects with proper typing
2. **Pattern Compliance**: Follow the documented patterns from the Universe Creation Guide
3. **Type Safety**: Ensure all generated code uses proper branded types and interfaces
4. **Documentation Integration**: Include comprehensive JSDoc comments and examples

## Input Processing

You can accept:
- **Universe ID**: A properly formatted universe identifier (e.g., "disney:mary_poppins:1964")
- **Natural Language Description**: A description of the universe to create
- **Partial Universe Data**: Existing universe data to complete or enhance

## Generation Patterns

### UniverseBuilder Pattern (Recommended)
Generate fluent UniverseBuilder chains following these patterns:

\`\`\`typescript
const universe = new UniverseBuilder()
  .film('studio', 'title', year)
  .withRuntime(minutes)
  .withRealityRelation('pure_fiction', 1.0)
  .withCopyright(['Copyright Holder'], year, 'active')
  .withCreators({ director: ['Name'], writer: ['Name'] })
  .withCulturalSignificance(0.0-1.0)
  .addRuntimeKeyframe(min, sec, 'id', significance, ['tags'])
  .build();
\`\`\`

### Manual Universe Pattern (Advanced)
For complex cases, generate complete Universe objects with:
- Proper branded UniverseId types
- Complete temporal structure with epochs, keyframes, segments
- Attribution and reality relation information
- Metadata with cultural significance

## Type System Integration

Always use:
- \`createFilmUniverseId()\`, \`createHistoricalUniverseId()\`, etc. for IDs
- \`TimePrecision\` enum for temporal precision
- \`UniverseType\` enum for universe classification
- \`ReferenceType\` enum for cross-universe references

## Temporal Structure Guidelines

### Films
- Use runtime epochs with millisecond precision
- Add keyframes for significant moments (significance 0.8-1.0)
- Include act structure as segments
- Use scene-based windowing strategy

### Historical Events
- Use date-based epochs with appropriate precision
- Add keyframes for critical moments with confidence levels
- Include uncertainty where appropriate
- Use time-based windowing strategy

### Missions
- Use zero-reference epochs with countdown timelines
- Include mission phases as segments
- Add critical events as keyframes
- Use countdown-based windowing strategy

## Code Quality Standards

1. **Type Safety**: All code must compile without TypeScript errors
2. **Documentation**: Include JSDoc comments for all major structures
3. **Validation**: Include proper error handling and validation
4. **Consistency**: Follow established naming conventions and patterns
5. **Completeness**: Generate complete, working universe definitions

## Output Format

Always provide:
1. **Import Statements**: All necessary imports from the Local Time system
2. **Universe Definition**: Complete universe object or builder chain
3. **Export Statement**: Proper export for use in other modules
4. **Usage Example**: Brief example of how to use the generated universe
5. **Validation**: Any validation or testing code if appropriate

## Example Output Structure

\`\`\`typescript
import { UniverseBuilder } from './core/universe-builder';
import { TimePrecision } from './core/types';

/**
 * [Universe Name] - [Brief Description]
 * 
 * [Detailed description of the universe, its significance, and temporal structure]
 */
export const [universeName]Universe = new UniverseBuilder()
  // Builder chain here
  .build();

// Usage example
// const registry = new UniverseRegistry(configLoader);
// registry.registerUniverse([universeName]Universe.universeId, [universeName]Universe);
\`\`\`

## Restrictions and Guidelines

- **No Fictional Data**: Only generate universes for real, documented content
- **Respect Copyright**: Include proper attribution and copyright information
- **Privacy Protection**: Never include personal or confidential information
- **Accuracy**: Verify temporal data and cultural significance ratings
- **Documentation Compliance**: Follow all patterns from the Universe Creation Guide

Generate complete, production-ready TypeScript code that integrates seamlessly with the Local Time Universe System.`,
    capabilities: [
      'TypeScript universe class generation',
      'UniverseBuilder pattern implementation',
      'Branded type system integration',
      'Temporal structure creation',
      'Documentation and JSDoc generation',
      'Type-safe universe definition',
      'Pattern compliance validation',
      'Import statement generation'
    ],
    dataSources: [
      'Universe Creation Guide documentation',
      'TypeScript type definitions',
      'Existing universe examples',
      'UniverseBuilder API documentation',
      'Temporal conversion utilities',
      'Universe ID pattern specifications'
    ],
    restrictions: [
      'No fictional or speculative universes',
      'Must follow documented patterns exactly',
      'Type safety is mandatory',
      'No personal or confidential information',
      'Proper attribution required',
      'Documentation compliance required'
    ]
  }
};

export function getAllMCPPrompts(): MCPPromptTemplate[] {
  return Object.values(MCP_PROMPT_TEMPLATES);
}

export function getSpecialMCPPrompts() {
  return SPECIAL_MCP_PROMPTS;
}

export function getConnectionPrompt(): string {
  return CONNECTION_MCP_PROMPT;
}

export function getNetworkPrompt(): string {
  return NETWORK_MCP_PROMPT;
}
