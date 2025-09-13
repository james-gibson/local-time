// Import branded universe ID types
import type { UniverseId } from './universe-ids';

/**
 * Represents a specific address within a temporal universe system.
 * Used for precise navigation to events, moments, or windows within universes.
 * 
 * @example
 * ```typescript
 * const address: TemporalAddress = {
 *   domain: "film:mary_poppins:1964",
 *   temporalEventId: "umbrella_descent_87m15s",
 *   windowId: "magical_sequence"
 * };
 * ```
 * 
 * @validation
 * - domain must be a valid universe ID format
 * - temporalEventId should be unique within the domain
 * - windowId is optional but must exist if referenced
 */
export interface TemporalAddress {
  /** Optional node identifier for distributed systems */
  nodeId?: string;
  /** The universe domain this address points to (e.g., "film:mary_poppins:1964") */
  domain: string;
  /** Specific event or moment identifier within the domain */
  temporalEventId: string;
  /** Optional window identifier for grouped temporal segments */
  windowId?: string;
}


/**
 * Core interface representing a complete temporal universe.
 * A universe encapsulates all temporal information about a specific work, event, or experience.
 * 
 * This is the primary data structure for the Local Time System. Each universe represents
 * a distinct temporal domain with its own coordinate system, precision requirements,
 * and reality relationship.
 * 
 * @example Basic Film Universe
 * ```typescript
 * const filmUniverse: Universe = {
 *   universeId: "disney:mary_poppins:1964",
 *   type: UniverseType.FILM,
 *   identifiers: {
 *     primary: "disney:mary_poppins:1964",
 *     aliases: ["mary_poppins"],
 *     imdb: "tt0058331"
 *   },
 *   realityRelation: {
 *     type: 'pure_fiction',
 *     fictionalizationDegree: 1.0,
 *     realityAnchors: []
 *   },
 *   attribution: {
 *     copyright: {
 *       holders: ["Walt Disney Productions"],
 *       year: 1964,
 *       status: 'active'
 *     },
 *     citations_required: true
 *   },
 *   layers: [
 *     {
 *       layerId: "runtime",
 *       type: 'primary',
 *       epochs: {
 *         film: {
 *           epochId: "mp:runtime",
 *           startTime: 0n,
 *           endTime: 139n * 60n * 1000000000n, // 139 minutes
 *           precision: TimePrecision.MILLISECOND
 *         }
 *       }
 *     }
 *   ],
 *   epochs: {} // Auto-populated by registry
 * };
 * ```
 * 
 * @example Historical Event Universe
 * ```typescript
 * const historicalUniverse: Universe = {
 *   universeId: "history:jfk_assassination:1963",
 *   type: UniverseType.HISTORICAL_EVENT,
 *   realityRelation: {
 *     type: 'documentary',
 *     fictionalizationDegree: 0.0,
 *     realityAnchors: []
 *   },
 *   attribution: {
 *     public_domain: true,
 *     sources: ["Warren Commission Report", "National Archives"]
 *   },
 *   // ... other required fields
 * };
 * ```
 * 
 * @validation
 * - universeId must follow branded UniverseId format
 * - type must match the universe content and structure
 * - layers array must contain at least one primary layer
 * - epochs will be auto-populated by the registry
 * - realityRelation.fictionalizationDegree must be 0.0-1.0
 * - attribution must include either copyright info or public_domain flag
 */
export interface Universe {
  /** 
   * Unique identifier for this universe (e.g., "disney:mary_poppins:1964")
   * Must follow the branded UniverseId format for type safety
   */
  universeId: UniverseId | string;
  
  /** 
   * The type of universe (film, book, historical event, etc.)
   * Determines expected structure and validation rules
   */
  type: UniverseType;
  
  /** 
   * Various identifiers and aliases for this universe
   * Used for lookup, cross-referencing, and external system integration
   */
  identifiers: UniverseIdentifiers;
  
  /** 
   * How this universe relates to reality (fiction, documentary, etc.)
   * Critical for understanding reliability and nature of temporal information
   */
  realityRelation: RealityRelation;
  
  /** 
   * Copyright, creator, and usage information
   * Essential for legal compliance and proper attribution
   */
  attribution: Attribution;
  
  /** 
   * Temporal layers containing epochs and time periods
   * Primary structure for organizing temporal information
   */
  layers: TemporalLayer[];
  
  /** 
   * Named epochs for easy reference (automatically populated by registry)
   * Flattened view of all epochs across all layers for quick access
   */
  epochs: Record<string, TemporalEpoch> | undefined;
  
  /** 
   * Optional temporal windows for navigation
   * Used for windowing strategies and temporal queries
   */
  temporalWindows?: TemporalWindow[];
  
  /** 
   * Optional detailed temporal structure with segments and keyframes
   * Provides fine-grained temporal organization and significant moments
   */
  temporalStructure?: TemporalStructure | {
    segments: TemporalSegment[];
    keyframes: TemporalKeyframe[];
    windows: WindowingStrategy
  };
  
  /** 
   * Optional metadata about cultural significance, creators, etc.
   * Used for search, ranking, and cultural analysis
   */
  metadata?: Partial<UniverseMetadata>;
}

/**
 * Identifiers and aliases for universe lookup and cross-referencing.
 * Supports multiple identification schemes for different systems and use cases.
 * 
 * @example
 * ```typescript
 * const identifiers: UniverseIdentifiers = {
 *   primary: "disney:mary_poppins:1964",
 *   aliases: ["mary_poppins", "mp1964"],
 *   imdb: "tt0058331",
 *   isbn: "978-0152058692" // For book adaptations
 * };
 * ```
 * 
 * @validation
 * - primary must be a valid identifier (string or structured)
 * - aliases should be unique within the system
 * - external IDs (imdb, isbn, etc.) should follow their respective formats
 */
export interface UniverseIdentifiers {
  /** Primary identifier - can be string or structured identifier */
  primary: string | UniverseIdentifier;
  /** Alternative names and aliases for lookup */
  aliases?: string[];
  /** Alternative structured identifiers */
  alternates?: UniverseIdentifier[];
  /** IMDb identifier for films and TV shows */
  imdb?: string;
  /** ISBN for books and publications */
  isbn?: string;
  /** DOI for academic papers and research */
  doi?: string;
  /** Patent number for inventions and processes */
  patent?: string;
}

/**
 * Structured identifier types for different content categories.
 * Provides type-safe identification with additional metadata.
 * 
 * @example
 * ```typescript
 * const filmId: UniverseIdentifier = {
 *   type: 'film',
 *   value: 'mary_poppins',
 *   year: 1964
 * };
 * 
 * const patentId: UniverseIdentifier = {
 *   type: 'patent',
 *   value: 'US1234567',
 *   jurisdiction: 'United States'
 * };
 * ```
 */
export type UniverseIdentifier = 
  | { type: 'isbn'; value: string }
  | { type: 'doi'; value: string }
  | { type: 'patent'; value: string; jurisdiction?: string }
  | { type: 'film'; value: string; year: number }
  | { type: 'historical_event'; value: string; consensus?: number }
  | { type: 'personal_experience'; value: string; privacy?: 'public' | 'protected' };

/**
 * Describes how a universe relates to reality and historical accuracy.
 * Critical for understanding the reliability and nature of temporal information.
 * 
 * The fictionalizationDegree scale:
 * - 0.0 = Pure documentation (news footage, historical records, scientific data)
 * - 0.1 = Minimal dramatization (documentary with recreations)
 * - 0.3 = Mostly factual with dramatic elements (historical drama)
 * - 0.5 = Balanced fiction/reality (historical fiction with real events)
 * - 0.7 = Mostly fictional with real elements (fictional characters in real settings)
 * - 0.9 = Minimal reality basis (inspired by real events)
 * - 1.0 = Pure fiction (no real-world basis)
 * 
 * @example Documentary Universe
 * ```typescript
 * const documentaryRelation: RealityRelation = {
 *   type: 'documentary',
 *   fictionalizationDegree: 0.0,
 *   realityAnchors: [
 *     {
 *       realEventId: "history:apollo11:1969",
 *       relationshipType: 'documents',
 *       confidence: 1.0,
 *       evidence: ["NASA footage", "Mission transcripts"]
 *     }
 *   ]
 * };
 * ```
 * 
 * @example Historical Fiction
 * ```typescript
 * const historicalFictionRelation: RealityRelation = {
 *   type: 'historical_fiction',
 *   fictionalizationDegree: 0.7,
 *   claimsHistoricalAccuracy: true,
 *   historicalConsultants: ["Stephen E. Ambrose"],
 *   realityAnchors: [
 *     {
 *       realEventId: "history:dday:1944",
 *       relationshipType: 'depicts',
 *       confidence: 0.8,
 *       evidence: ["Military records", "Veteran interviews"]
 *     }
 *   ],
 *   disclaimer: "Some events and characters are fictional"
 * };
 * ```
 * 
 * @validation
 * - fictionalizationDegree must be between 0.0 and 1.0
 * - type should align with fictionalizationDegree (documentary = 0.0, pure_fiction = 1.0)
 * - realityAnchors should have valid realEventId references
 * - confidence values in anchors must be 0.0-1.0
 */
export interface RealityRelation {
  /** The primary relationship type to reality */
  type: 'documentary' | 'historical_fiction' | 'inspired_by' | 'pure_fiction' | 'metafiction' | 'recreation' | 'interpretation';
  
  /** Specific connections to real events or experiences */
  realityAnchors: RealityAnchor[];
  
  /** 
   * Degree of fictionalization from 0.0 to 1.0
   * - 0.0 = Pure documentation (news footage, historical records)
   * - 0.3 = Mostly factual with minor dramatization
   * - 0.7 = Historical fiction with fictional characters in real events
   * - 1.0 = Pure fiction with no real-world basis
   */
  fictionalizationDegree: number;
  
  /** Whether the work explicitly claims historical accuracy */
  claimsHistoricalAccuracy?: boolean;
  
  /** Historical consultants or advisors involved */
  historicalConsultants?: string[];
  
  /** Any disclaimers about historical accuracy */
  disclaimer?: string;
}

/**
 * Links a universe to specific real-world events or experiences.
 * Provides evidence-based connections with confidence ratings.
 * 
 * @example
 * ```typescript
 * const anchor: RealityAnchor = {
 *   realEventId: "history:wwii:battle_of_somme:1916",
 *   relationshipType: 'inspired_by',
 *   confidence: 0.8,
 *   evidence: [
 *     "Tolkien's military service records",
 *     "Letters to Christopher Tolkien",
 *     "Literary analysis by Tom Shippey"
 *   ]
 * };
 * ```
 * 
 * @validation
 * - realEventId should reference an existing universe or documented event
 * - confidence must be between 0.0 and 1.0
 * - evidence array should contain verifiable sources
 */
export interface RealityAnchor {
  /** Reference to the real event or experience */
  realEventId: string;
  
  /** Type of relationship between the universe and reality */
  relationshipType: 'depicts' | 'inspired_by' | 'reinterprets' | 'contradicts' | 'reimagines' | 'documents' | 'experienced';
  
  /** Confidence level in this connection (0.0-1.0) */
  confidence: number;
  
  /** Supporting evidence for this connection */
  evidence?: string[];
}

/**
 * Copyright, creator, and usage information for legal compliance.
 * Essential for proper attribution and understanding usage rights.
 * 
 * @example Copyrighted Work
 * ```typescript
 * const attribution: Attribution = {
 *   copyright: {
 *     holders: ["Walt Disney Productions", "Disney Enterprises"],
 *     year: 1964,
 *     status: 'active'
 *   },
 *   creators: {
 *     director: ["Robert Stevenson"],
 *     writer: ["Bill Walsh", "Don DaGradi"]
 *   },
 *   citations_required: true,
 *   usage_restrictions: [
 *     "Fair use for criticism and comment only",
 *     "No commercial use without permission"
 *   ]
 * };
 * ```
 * 
 * @example Public Domain Work
 * ```typescript
 * const publicAttribution: Attribution = {
 *   public_domain: true,
 *   sources: ["Library of Congress", "National Archives"],
 *   citations_required: false
 * };
 * ```
 * 
 * @validation
 * - Either copyright info or public_domain flag must be present
 * - copyright.status must be 'active', 'expired', or 'public_domain'
 * - citations_required should be true for active copyrights
 */
export interface Attribution {
  /** Copyright information if applicable */
  copyright?: {
    /** Copyright holders */
    holders: string[];
    /** Copyright year */
    year: number;
    /** Current copyright status */
    status: 'active' | 'expired' | 'public_domain' | 'invalid';
  };
  
  /** Creator information */
  creators?: {
    /** Directors for films/TV */
    director?: string[];
    /** Writers/authors */
    writer?: string[];
    /** Historical advisors for historical works */
    historical_advisors?: string[];
  };
  
  /** Whether citations are required when referencing */
  citations_required: boolean;
  
  /** Specific usage restrictions */
  usage_restrictions?: string[];
  
  /** Source materials for research */
  sources?: string[];
  
  /** Whether the work is in public domain */
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
  epochId?: string;
  startTime?: bigint;
  endTime?: bigint;
  start?: bigint;  // Alternative field name
  end?: bigint;    // Alternative field name
  precision: TimePrecision;
  description?: string;
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
  type: 'sequence' | 'act' | 'scene' | 'phase' | 'countdown' | 'mission_phase' | 
        'life_period' | 'education' | 'career' | 'public_service' | 'legal_period' | 
        'legislation_active' | 'court_jurisdiction';
  status?: 'active' | 'inactive' | 'suspended' | 'overturned' | 'amended';
  jurisdiction?: string;
  description?: string;
}

export interface TemporalKeyframe {
  id: string;
  timestamp: bigint;
  significance: number;
  tags: string[];
  certainty?: number; // 0.0-1.0 for uncertain dates
  dateRange?: {
    earliest: bigint;
    latest: bigint;
  };
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
  layers?: ChainLayer[];
}

export interface ChainLayer {
  layerId: string;
  type: 'historical' | 'personal' | 'creative' | 'cultural';
  transformationType: 'direct' | 'sublimated' | 'allegorized' | 'mythologized';
  confidence: number;
}

export interface ReferenceNode {
  universeId: UniverseId;
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
  TECHNOLOGY = 'TECHNOLOGY',
  FILM = 'film',
  SERIES = 'series',
  BOOK = 'book',
  PATENT = 'patent',
  HISTORICAL_EVENT = 'historical_event',
  PERSONAL_EXPERIENCE = 'personal_experience',
  SIMULATION = 'simulation',
  MISSION = 'mission',
  MEDICAL_PROCEDURE = 'medical_procedure',
  BIOGRAPHY = 'biography',
  LEGAL_TIMELINE = 'legal_timeline',
  INSTITUTIONAL_PERIOD = 'institutional_period',
  TECHNICAL_SPECIFICATION = 'technical_specification',
  TECHNICAL_LOG = 'technical_log'
}

export enum ReferenceType {
  // Direct references
  DEPICTS = 'depicts',                    // Claims to show real events
  DOCUMENTS = 'documents',                // Documentary evidence
  RECREATES = 'recreates',                // Theatrical recreation
  QUOTES = 'quotes',
  
  // Influenced references
  INSPIRED_BY = 'inspired_by',            // Loosely based on
  SUBLIMATED = 'sublimated',              // Transformed through psyche
  ALLEGORIZES = 'allegorizes',            // Symbolic representation
  
  // Meta references
  CONTRADICTS = 'contradicts',            // Challenges official version
  REINTERPRETS = 'reinterprets',          // New perspective
  PARODIES = 'parodies',                  // Comedic take
  HOMAGE = 'homage',                      // Respectful reference
  VISUAL_HOMAGE = 'visual_homage',
  SCENE_HOMAGE = 'scene_homage',
  DIALOGUE_REFERENCE = 'dialogue_reference',
  
  // Reality-blending
  METAFICTION = 'metafiction',            // Fiction about fiction
  ALTERNATE_HISTORY = 'alternate_history', // What if scenarios
  MYTHOLOGIZES = 'mythologizes',          // Turns real into myth
  
  // Temporal paradoxes
  TEMPORAL_PARADOX = 'temporal_paradox',
  CAUSAL_LOOP = 'causal_loop',
  ANACHRONISM = 'anachronism',
  OBJECT_TRANSPORT = 'object_transport',
  IDENTITY_CONFUSION = 'identity_confusion',
  PREDICTIVE_REFERENCE = 'predictive_reference',
  TEMPORAL_IRONY = 'temporal_irony',
  META_CASTING = 'meta_casting',
  
  // Zero-reference specific
  FULFILLS_PROMISE = 'fulfills_promise',
  
  // Experience types
  EXPERIENCED = 'experienced',
  INFLUENCED = 'influenced'
}

export interface RelativeTimeComponents {
  prefix: string;
  days?: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds?: number;
}

// Additional type aliases for compatibility
export type Keyframe = TemporalKeyframe;
export type Segment = TemporalSegment;
export type RealityRelationType = RealityRelation['type'];

// Usage restriction enum
export enum UsageRestriction {
  INTERNAL_ANALYSIS_ONLY = 'internal_analysis_only',
  NO_COMMERCIAL_USE = 'no_commercial_use',
  ANONYMIZATION_REQUIRED = 'anonymization_required'
}

// Copyright status enum
export enum CopyrightStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  PUBLIC_DOMAIN = 'public_domain',
  INVALID = 'invalid',
  PRIVATE = 'private'
}

// Function to create technical universe IDs
export function createTechnicalUniverseId(category: string, identifier: string, version?: string): UniverseId {
  const versionSuffix = version ? `:${version}` : '';
  const id = `${category}:${identifier}${versionSuffix}:${new Date().getFullYear()}`;
  return id as UniverseId;
}

// Re-export createHistoricalUniverseId from universe-ids for compatibility
export { createHistoricalUniverseId,createTechnologyUniverseId } from './universe-ids';


// Relationship types for connections
export enum RelationshipType {
  TEMPORAL_OVERLAP = 'temporal_overlap',
  CAUSAL_RELATIONSHIP = 'causal_relationship',
  THEMATIC_CONNECTION = 'thematic_connection',
  EXTENDS = 'extends',
  SUPPLEMENTS = 'supplements'
}

// Temporal overlap enum
export enum TemporalOverlap {
  OVERLAPS = 'overlaps',
  CONTAINS = 'contains',
  PRECEDES = 'precedes',
  FOLLOWS = 'follows'
}


// Connection relationship interface
export interface ConnectionRelationship {
  type: RelationshipType;
  strength: number;
  description: string;
}

export interface UniverseNetwork {
  networkId: string;
  universes: Set<UniverseId>;
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
  universes: UniverseId[];
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
  MONTH = 2_629_746_000_000_000,
  YEAR = 31_536_000_000_000_000,
  MILLION_YEARS = 31_536_000_000_000_000_000_000
}

// Reality relation type enum for easier usage
export enum RealityRelationTypeEnum {
  DOCUMENTARY = 'documentary',
  HISTORICAL_FICTION = 'historical_fiction',
  INSPIRED_BY = 'inspired_by',
  PURE_FICTION = 'pure_fiction',
  METAFICTION = 'metafiction',
  RECREATION = 'recreation',
  INTERPRETATION = 'interpretation',
  DOCUMENTS = 'documents'
}

// Export as both enum and type for compatibility
export const RealityRelationType = RealityRelationTypeEnum;
