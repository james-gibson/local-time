export interface TemporalAddress {
  nodeId?: string;
  domain: string;
  temporalEventId: string;
  windowId?: string;
}

export interface Universe {
  universeId: string;
  type: UniverseType;
  identifiers: UniverseIdentifiers;
  realityRelation: RealityRelation;
  attribution: Attribution;
  layers: TemporalLayer[];
  temporalWindows?: TemporalWindow[];
  temporalStructure: TemporalStructure;
  metadata: UniverseMetadata;
}

export interface UniverseIdentifiers {
  primary: string;
  aliases?: string[];
  imdb?: string;
  isbn?: string;
  doi?: string;
  patent?: string;
}

export interface RealityRelation {
  type: 'documentary' | 'historical_fiction' | 'inspired_by' | 'pure_fiction' | 'metafiction' | 'recreation' | 'interpretation';
  realityAnchors: RealityAnchor[];
  fictionalizationDegree: number; // 0 = pure documentation, 1 = pure fiction
  claimsHistoricalAccuracy?: boolean;
  historicalConsultants?: string[];
  disclaimer?: string;
}

export interface RealityAnchor {
  realEventId: string;
  relationshipType: 'depicts' | 'inspired_by' | 'reinterprets' | 'contradicts' | 'reimagines' | 'documents';
  confidence: number;
  evidence?: string[];
}

export interface Attribution {
  copyright?: {
    holders: string[];
    year: number;
    status: 'active' | 'expired' | 'public_domain';
  };
  creators?: {
    director?: string[];
    writer?: string[];
    historical_advisors?: string[];
  };
  citations_required: boolean;
  usage_restrictions?: string[];
  sources?: string[];
  public_domain?: boolean;
}

export interface TemporalLayer {
  layerId: string;
  type: 'primary' | 'meta' | 'recreation' | 'subjective';
  epochs: Record<string, TemporalEpoch | ZeroReferenceEpoch>;
  contains?: string[];
  reality_correspondence?: {
    to: string;
    accuracy: number;
    deviations: string[];
  };
  subuniverses?: string[];
}

export interface TemporalEpoch {
  epochId: string;
  startTime: bigint;
  endTime: bigint;
  precision: TimePrecision;
  description: string;
}

export interface TemporalStructure {
  segments: TemporalSegment[];
  keyframes: TemporalKeyframe[];
  windows: WindowingStrategy;
}

export interface TemporalSegment {
  id: string;
  start: bigint;
  end: bigint;
  type: 'sequence' | 'act' | 'scene' | 'phase' | 'countdown' | 'mission_phase';
}

export interface TemporalKeyframe {
  id: string;
  timestamp: bigint;
  significance: number;
  tags: string[];
}

export interface WindowingStrategy {
  strategy: 'scene_based' | 'time_based' | 'phase_based' | 'countdown_based';
  avgWindowSize?: bigint;
}

export interface UniverseMetadata {
  canonicalName: string;
  creators: string[];
  released: Date;
  cultural_significance: number;
}

export interface TemporalWindow {
  windowId: string;
  startTime: bigint;
  endTime: bigint;
  precision: TimePrecision;
  aliases: WindowAlias[];
  metadata?: Record<string, unknown>;
  type?: 'fixed' | 'narrative_segment' | 'dynamic';
}

export interface WindowAlias {
  format: 'year' | 'month' | 'day' | 'named_period' | 'custom';
  value: string;
  universeContext?: string;
}

export interface ZeroReferenceEpoch extends TemporalEpoch {
  zeroPoint: bigint;
  zeroEvent: string;
  beforePrefix: string;
  afterPrefix: string;
  relativeFormat: 'HMS' | 'seconds' | 'minutes' | 'hours' | 'days';
}

export interface TemporalReference {
  referenceId: string;
  type: ReferenceType;
  description: string;
  anchors: TemporalAnchor[];
  metadata: ReferenceMetadata;
  strength?: number;
}

export interface TemporalAnchor {
  domainId: string;
  eventId: string;
  context: AnchorContext;
}

export interface AnchorContext {
  runtime_position?: number;
  narrative_time?: string;
  scene_description?: string;
  significance?: string;
}

export interface ReferenceMetadata {
  cultural_context?: string[];
  confidence?: number;
  direction?: 'forward' | 'backward' | 'bidirectional';
}

export interface ReferenceChain {
  chainId: string;
  nodes: ReferenceNode[];
  connections: ReferenceConnection[];
  metadata?: ChainMetadata;
}

export interface ReferenceNode {
  universeId: string;
  type: 'historical_event' | 'personal_experience' | 'creative_work';
  elements: string[];
  privacy?: string;
}

export interface ReferenceConnection {
  from: string;
  to: string;
  type: ReferenceType;
  documented: boolean;
  influence_type?: string;
  specific_mappings?: SpecificMapping[];
}

export interface SpecificMapping {
  source_element: string;
  target_element: string;
  transformation: string;
  tolkien_acknowledged?: boolean;
}

export interface ChainMetadata {
  type?: string;
}

export enum UniverseType {
  FILM = 'film',
  SERIES = 'series',
  BOOK = 'book',
  PATENT = 'patent',
  HISTORICAL_EVENT = 'historical_event',
  PERSONAL_EXPERIENCE = 'personal_experience',
  SIMULATION = 'simulation',
  MISSION = 'mission',
  MEDICAL_PROCEDURE = 'medical_procedure'
}

export enum ReferenceType {
  // Direct references
  DEPICTS = 'depicts',
  DOCUMENTS = 'documents',
  RECREATES = 'recreates',
  QUOTES = 'quotes',
  
  // Influenced references
  INSPIRED_BY = 'inspired_by',
  SUBLIMATED = 'sublimated',
  ALLEGORIZES = 'allegorizes',
  
  // Meta references
  CONTRADICTS = 'contradicts',
  REINTERPRETS = 'reinterprets',
  PARODIES = 'parodies',
  HOMAGE = 'homage',
  VISUAL_HOMAGE = 'visual_homage',
  
  // Reality-blending
  METAFICTION = 'metafiction',
  ALTERNATE_HISTORY = 'alternate_history',
  MYTHOLOGIZES = 'mythologizes',
  
  // Temporal paradoxes
  TEMPORAL_PARADOX = 'temporal_paradox',
  CAUSAL_LOOP = 'causal_loop',
  ANACHRONISM = 'anachronism',
  
  // Zero-reference specific
  FULFILLS_PROMISE = 'fulfills_promise',
  
  // Experience types
  EXPERIENCED = 'experienced',
  INFLUENCED = 'influenced'
}

export interface RelativeTimeComponents {
  prefix: string;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds?: number;
}

export interface UniverseNetwork {
  networkId: string;
  universes: Set<string>;
  sharedEpochs?: {
    corporate?: TemporalEpoch;
    cultural?: TemporalEpoch;
  };
  eras: NetworkEra[];
}

export interface NetworkEra {
  eraId: string;
  name: string;
  start: bigint;
  end: bigint;
  universes: string[];
}

export interface WindowAlignment {
  sourceWindow: string;
  targetWindow: string;
  overlap: {
    percentage: number;
    duration: bigint;
  };
  semanticAlignment: boolean;
  precisionMismatch?: boolean;
}

export interface TemporalReferenceGraph {
  nodes: Map<string, TemporalNode>;
  edges: TemporalEdge[];
}

export interface TemporalNode {
  id: string;
  type: 'event' | 'concept' | 'work';
  domains: string[];
}

export interface TemporalEdge {
  from: string;
  to: string;
  type: ReferenceType;
  strength: number;
  bidirectional: boolean;
}

export enum TimePrecision {
  NANOSECOND = 1,
  MICROSECOND = 1_000,
  MILLISECOND = 1_000_000,
  SECOND = 1_000_000_000,
  MINUTE = 60_000_000_000,
  HOUR = 3_600_000_000_000,
  DAY = 86_400_000_000_000,
  YEAR = 31_536_000_000_000_000,
  MILLION_YEARS = 31_536_000_000_000_000_000_000
}
