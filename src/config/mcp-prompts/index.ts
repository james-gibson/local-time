import { UniverseType } from '../../core/types.js';
import { FILM_MCP_PROMPT } from './film-prompt.js';
import { MISSION_MCP_PROMPT } from './mission-prompt.js';
import { HISTORICAL_EVENT_MCP_PROMPT } from './historical-prompt.js';
import { BOOK_MCP_PROMPT } from './book-prompt.js';
import { PERSONAL_EXPERIENCE_MCP_PROMPT } from './personal-prompt.js';
import { CONNECTION_MCP_PROMPT } from './connection-prompt.js';
import { NETWORK_MCP_PROMPT } from './network-prompt.js';

export interface MCPPromptTemplate {
  universeType: UniverseType;
  prompt: string;
  capabilities: string[];
  dataSources: string[];
  restrictions: string[];
}

export const MCP_PROMPT_TEMPLATES: Record<UniverseType, MCPPromptTemplate> = {
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
  return MCP_PROMPT_TEMPLATES[universeType];
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
