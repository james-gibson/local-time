

## Types

```typescript
export interface UniverseConfig {
    version: string;
    universes: Universe[];
    networks?: UniverseNetwork[];
}

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
    epochs: Record<string, TemporalEpoch> | undefined;
    temporalWindows?: TemporalWindow[];
    temporalStructure?: TemporalStructure;
    metadata?: UniverseMetadata;
}

export interface UniverseIdentifiers {
    primary: string | UniverseIdentifier;
    aliases?: string[];
    alternates?: UniverseIdentifier[];
    imdb?: string;
    isbn?: string;
    doi?: string;
    patent?: string;
}

export type UniverseIdentifier =
    | { type: 'isbn'; value: string }
    | { type: 'doi'; value: string }
    | { type: 'patent'; value: string; jurisdiction?: string }
    | { type: 'film'; value: string; year: number }
    | { type: 'historical_event'; value: string; consensus?: number }
    | { type: 'personal_experience'; value: string; privacy?: 'public' | 'protected' };

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
    relationshipType: 'depicts' | 'inspired_by' | 'reinterprets' | 'contradicts' | 'reimagines' | 'documents' | 'experienced';
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
    MEDICAL_PROCEDURE = 'medical_procedure',
    BIOGRAPHY = 'biography',
    LEGAL_TIMELINE = 'legal_timeline',
    INSTITUTIONAL_PERIOD = 'institutional_period'
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

```


## Usages

```typescript
import { Universe, UniverseType, TimePrecision } from '../../../core/types';

export const copyrightActUniverse: Universe = {
  universeId: "legal:us:copyright_act:1976",
  type: UniverseType.LEGAL_TIMELINE,
  epochs: undefined,
  identifiers: {
    primary: "legal:us:copyright_act:1976",
    aliases: ["copyright_act_1976", "us_copyright_law"]
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: []
  },
  attribution: {
    public_domain: true,
    sources: ["US Congress", "Legal databases", "Federal Register"],
    citations_required: false
  },
  layers: [
    {
      layerId: "legislation_timeline",
      type: 'primary',
      epochs: {
        active_period: {
          epochId: "copyright_act:active",
          startTime: BigInt(Date.UTC(1978, 0, 1)) * 1000000n, // Effective date
          endTime: BigInt(Date.now()) * 1000000n, // Still active
          precision: TimePrecision.DAY,
          description: "Copyright Act of 1976 active period"
        }
      }
    }
  ],
  temporalStructure: {
    segments: [
      {
        id: "pre_enactment",
        start: BigInt(Date.UTC(1976, 9, 19)) * 1000000n, // Signed into law
        end: BigInt(Date.UTC(1978, 0, 1)) * 1000000n,    // Effective date
        type: "legal_period",
        status: "inactive"
      },
      {
        id: "original_act",
        start: BigInt(Date.UTC(1978, 0, 1)) * 1000000n,
        end: BigInt(Date.UTC(1998, 10, 27)) * 1000000n, // Before Sonny Bono Act
        type: "legislation_active",
        status: "active",
        jurisdiction: "United States"
      },
      {
        id: "post_sonny_bono",
        start: BigInt(Date.UTC(1998, 10, 27)) * 1000000n, // Sonny Bono Act
        end: BigInt(Date.now()) * 1000000n,
        type: "legislation_active",
        status: "amended",
        jurisdiction: "United States"
      }
    ],
    keyframes: [
      {
        id: "signed_into_law",
        timestamp: BigInt(Date.UTC(1976, 9, 19)) * 1000000n,
        significance: 1.0,
        tags: ["enactment", "legislation", "copyright"],
        certainty: 1.0
      },
      {
        id: "effective_date",
        timestamp: BigInt(Date.UTC(1978, 0, 1)) * 1000000n,
        significance: 0.9,
        tags: ["effective", "implementation", "copyright"],
        certainty: 1.0
      },
      {
        id: "sonny_bono_amendment",
        timestamp: BigInt(Date.UTC(1998, 10, 27)) * 1000000n,
        significance: 0.8,
        tags: ["amendment", "term_extension", "copyright"],
        certainty: 1.0
      }
    ],
    windows: {
      strategy: 'phase_based'
    }
  },
  metadata: {
    canonicalName: "US Copyright Act of 1976",
    creators: ["US Congress"],
    released: new Date("1976-10-19"),
    cultural_significance: 0.9
  }
};

export const roeVWadeUniverse: Universe = {
  universeId: "legal:us:roe_v_wade:1973-2022",
  epochs: undefined,
  type: UniverseType.LEGAL_TIMELINE,
  identifiers: {
    primary: "legal:us:roe_v_wade:1973-2022",
    aliases: ["roe_v_wade", "abortion_rights_precedent"]
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: []
  },
  attribution: {
    public_domain: true,
    sources: ["Supreme Court Records", "Legal databases"],
    citations_required: false
  },
  layers: [
    {
      layerId: "precedent_timeline",
      type: 'primary',
      epochs: {
        active_precedent: {
          epochId: "roe:precedent",
          startTime: BigInt(Date.UTC(1973, 0, 22)) * 1000000n, // Decision date
          endTime: BigInt(Date.UTC(2022, 5, 24)) * 1000000n,   // Overturned
          precision: TimePrecision.DAY,
          description: "Roe v. Wade as binding precedent"
        }
      }
    }
  ],
  temporalStructure: {
    segments: [
      {
        id: "active_precedent",
        start: BigInt(Date.UTC(1973, 0, 22)) * 1000000n,
        end: BigInt(Date.UTC(2022, 5, 24)) * 1000000n,
        type: "court_jurisdiction",
        status: "active",
        jurisdiction: "United States"
      },
      {
        id: "overturned_period",
        start: BigInt(Date.UTC(2022, 5, 24)) * 1000000n,
        end: BigInt(Date.now()) * 1000000n,
        type: "court_jurisdiction",
        status: "overturned",
        jurisdiction: "United States"
      }
    ],
    keyframes: [
      {
        id: "decision_rendered",
        timestamp: BigInt(Date.UTC(1973, 0, 22)) * 1000000n,
        significance: 1.0,
        tags: ["supreme_court", "precedent", "constitutional_law"],
        certainty: 1.0
      },
      {
        id: "dobbs_decision",
        timestamp: BigInt(Date.UTC(2022, 5, 24)) * 1000000n,
        significance: 1.0,
        tags: ["supreme_court", "overturned", "constitutional_law"],
        certainty: 1.0
      }
    ],
    windows: {
      strategy: 'phase_based'
    }
  },
  metadata: {
    canonicalName: "Roe v. Wade Legal Timeline",
    creators: ["US Supreme Court"],
    released: new Date("1973-01-22"),
    cultural_significance: 1.0
  }
};

export const legalUniverses = [
  copyrightActUniverse,
  roeVWadeUniverse
];

```


## Challenges

- Because of timescales involved we need to store large datetime stamps that may span very large epochs. However if 
  our date creation functions returned the correct timestamp we would transition from `BigInt(Date.UTC(1970,0,0)) * 
  1000000n` to something like `new localtime.utc(1970,0,0)`
- Universe id's are not plain strings, they have inherent meaning. Therefore our default set of universe id's should 
  actually be typesafe
    ```typescript
       universes: new Set([
         "disney:mary_poppins:1964"
         // Additional universes would be added here as they're created
         // "disney:lion_king:1994",
         // "disney:frozen:2013",
         // "disney_channel:high_school_musical:2006",
         // "disney_plus:mandalorian:2019"
       ]),
    ```
- Storage of event metadata will become cumbersome and probably require a sqlite db (via prisma) for rapid querying. 
What does that prisma schema look like?
-  If a user query requests a syntactically correct universe definition how does the model know what the definition 
   is? It exists in the typescript but there is no prompt instructing a model how to craft a universe object
  - Expanding on a previous challenge if a user prompts the model to create an entry for the movie Frozen 
    `"disney:frozen:2013"`and the model has domain specific instructions for capturing a movie (scenes, credits, 
    runtime) but there is no common definition of what a universe is
- Once we have typesafe universe ids (which sometimes may still be strings but that's our unknown case) we should 
  also have a predictable method for prompts to reference future (uncreated) entries.
  - Example: In back to the future movie there is a scene where johny b good is referenced but the model doesnt need 
    to expand past it's research scope and so we shouldnt generate (but we might reference) real life events of that 
    person (award shows, military or political service)
  - Example: Ronald Reagan's future occupation as president of the united states has no bearing on any work he did 
    as an actor. Yet on the flip side his presidential success probably had something to do with his success as an 
    actor. So an `acting` universe probably wouldn't mention the `presidential` universe while it would in reverse.
    - Hint: specific challenge here is the model should reference these cross universe events but not always 
      generate the metadata. Because of this disparate disconnect we should know the structure of these id's to 
      prevent future data corruption
    - Example: Presidential research might be impacted by early career so our research should note this and our 
      system should be smart enough to know that when it discovered reference to an acting universe it previously 
      knew nothing about can use the identifier left as a static marker such that if it wishes to expand it's 
      datastore it simply need expand that universe (which might be a public open source reference that they need 
      to install)
- These types are lacking detailed comments indicating what or how they should be used. This means that general 
  usage of these types will be limited to llm's and those users with code generation tooling.
  - Hint: If a Partial<Universe> could be provided by an inexperienced user (a pseudocode of sorts) as say a gist 
    the system could look at it and return the same universe but in plain english ("in the beginning..." "captains 
    log: stardate ...." )
- Until we have proper metadata storage how should we organize these files?
  - Tip: assume we want to appeal to broad fan fictions across multiple subjects so our examples are going to be wild.
  - Tip: our wild examples will need unit testing, "can ash engage in a pokemon battle before he collects his first 
    pokemon?" (obviously the answer should be no, but in effect it's a `canBattle` test that verifies our metadata 
    loads correctly)
- Interconnections between universes is the point of this small library, making those easy to reference would help a lot
  - Right now we lean on a lot of magic strings
- Its currently unclear what the difference between a network and a universe is or how and when to create one or the 
  other
  - Creating common overlaps should be simple, if it's non-fiction we know it probably has a unix epoch (assuming 
    the timescale allows us to use that one)
  - Hint: If i knew nothing about JFK except his moon speech my metadata should allow me to quickly cross reference 
    into a universe that knows all about the assassination conspiracy theory