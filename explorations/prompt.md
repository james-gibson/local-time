<details><summary>Thinking</summary>

The user wants me to create a comprehensive prompt that captures the entire temporal reference system we've been discussing. This prompt should:

1. Explain the system architecture without assuming a programming language
2. Include all the rules and concepts we've discussed
3. Provide test cases using the Back to the Future example (which is perfect because it has multiple temporal layers)
4. Be self-contained since I won't be able to revise it

Key concepts to include:
- Distributed nodes with temporal data
- Domain-aware temporal IDs
- Universe as first-class temporal nodes
- Window-based organization
- Reality layers and relationships
- Attribution and copyright
- Cross-universe references
- Influence chains vs direct references

The Back to the Future example is excellent because it has:
- Multiple timelines (1985, 1955, 2015, alternate 1985)
- Cultural references that change (Chuck Berry, Calvin Klein)
- Reality layers (the movie's production, the narrative, the altered timelines)
- Metafictional elements (references within references)

I need to structure this clearly and comprehensively.

</details>

# Temporal Reference System Specification

## System Overview

Design and implement a distributed temporal reference system that treats any identifiable work (films, books, patents, historical events, personal experiences) as a "universe" - a first-class temporal node with its own epochs, precision, and windowing schemes. The system must handle cross-universe references, reality gradients, attribution requirements, and temporal influence chains across vastly different time scales.

## Core Concepts

### 1. Distributed Architecture
- Each node in the system can contain temporal data addressable by ID
- IDs follow the structure: ```<node-id>.<domain:temporal-event-id>```
- Nodes use domain-aware temporal IDs that encode both window and event information
- Clock drift is handled through configurable window sizes (default: 5 seconds for real-time systems)

### 2. Temporal Universes
A universe is any identifiable work or event that defines its own temporal coordinate system:
- **Universe Types**: film, series, book, patent, historical_event, personal_experience, simulation
- **Identifiers**: ISBN, DOI, patent numbers, film IDs, historical consensus IDs
- **Multiple Epochs**: Each universe can have runtime, narrative, and production epochs
- **Reality Relations**: Documents relationship to reality (documentary, historical_fiction, inspired_by, pure_fiction, etc.)
- **Fictionalization Degree**: 0.0 (pure documentation) to 1.0 (pure fiction)

### 3. Temporal Windows
- Windows can be fixed-duration or narrative-based (scenes, chapters, acts)
- Windows are shareable across universes with different precisions
- Year-level windows can contain day-level events
- Windows support aliases (e.g., "cal:1916", "wwi-peak", "modernist-period")

### 4. Reference Types
References between universes can be:
- **Direct**: depicts, documents, recreates, quotes
- **Influenced**: inspired_by, sublimated, allegorizes
- **Meta**: contradicts, reinterprets, parodies, homage
- **Reality-blending**: metafiction, alternate_history, mythologizes

### 5. Attribution Requirements
- Copyright status must be tracked
- Historical events are generally public domain
- Personal experiences have privacy levels
- References to copyrighted material need proper attribution
- Some reference types (recreates, depicts) may require permission

### 6. Temporal Precision Scales
From nanosecond to million-year precision:
- NANOSECOND = 1
- MICROSECOND = 1,000
- MILLISECOND = 1,000,000
- SECOND = 1,000,000,000
- YEAR = 31,536,000,000,000,000
- MILLION_YEARS = 31,536,000,000,000,000,000,000

## Implementation Requirements

### Universe Structure
Each universe must contain:
```
universe:
  - universeId: unique identifier
  - identifiers: primary and alternate IDs
  - realityRelation: relationship to reality
  - attribution: copyright and citation metadata
  - layers: different temporal views (production, narrative, etc.)
  - epochs: temporal boundaries for each layer
```

### Temporal Address Format
```
<node-id>.<domain:temporal-event-id>
Example: node-42.film:bttf:1985:runtime:enchantment_dance:a7b3c9d2
```

### Window Alignment
- Windows from different universes can overlap or contain each other
- Queries should find all universes active in a given window
- Semantic windows ("WWI", "Renaissance") span multiple calendar periods

### Query Capabilities
The system must support:
1. Finding all events in a temporal window across nodes
2. Tracing influence chains between universes
3. Querying by reality gradient (fiction vs. documentary)
4. Cross-domain temporal correlation
5. Attribution validation for references

## Test Cases

### Test Case 1: Back to the Future - Recursive Temporal References

The Back to the Future trilogy creates a complex web of temporal references:

#### Universe Definitions

**1. Primary Film Universe**
```
universe: film:bttf:1985
type: film
realityRelation:
  type: pure_fiction
  fictionalizationDegree: 1.0
layers:
  - runtime:
      start: 0
      end: 116 minutes
      precision: millisecond
  - narrative_1985:
      start: Oct 26, 1985
      end: Nov 5, 1985
      precision: minute
  - narrative_1955:
      start: Nov 5, 1955
      end: Nov 12, 1955
      precision: minute
```

**2. Chuck Berry Historical Universe**
```
universe: history:chuck_berry:career
type: historical_event
realityRelation:
  type: documentary
  fictionalizationDegree: 0.0
keyEvents:
  - johnny_b_goode_composed:
      timestamp: 1958
      precision: year
```

#### Reference Chain: The Johnny B. Goode Paradox

```
referenceChain: bttf_johnny_b_goode_paradox
nodes:
  1. film:bttf:1985:narrative_1955:enchantment_dance
     - Marty performs "Johnny B. Goode" in 1955
     
  2. history:chuck_berry:career:johnny_b_goode_composed
     - Chuck Berry writes the song in 1958
     
  3. film:bttf:1985:narrative_1955:marvin_calls_chuck
     - Marvin Berry calls Chuck during the performance
     
connections:
  - from: node1
    to: node2
    type: temporal_paradox
    direction: backward_influence
    note: "Marty plays a song 3 years before it's written"
    
  - from: node3
    to: node2
    type: causal_loop
    note: "Your cousin Marvin? Listen to this!"
```

This should create a circular reference where:
- The film references a real song (Chuck Berry's "Johnny B. Goode")
- The film suggests the song's creation was influenced by its own future performance
- This creates a metafictional temporal paradox that exists in multiple layers

#### Reference Chain: Calvin Klein Product Placement

```
referenceChain: bttf_calvin_klein_reference
nodes:
  1. film:bttf:1985:narrative_1985:marty_underwear
     - Marty wears Calvin Klein underwear
     
  2. film:bttf:1985:narrative_1955:lorraine_sees_underwear
     - Lorraine sees "Calvin Klein" on underwear
     
  3. history:fashion:calvin_klein:founded
     - Calvin Klein company founded in 1968
     
  4. film:bttf:1985:narrative_1955:marty_called_calvin
     - Marty is called "Calvin" throughout 1955
     
connections:
  - from: node1
    to: node2
    type: object_transport
    temporal_direction: backward
    
  - from: node2
    to: node4
    type: identity_confusion
    note: "1950s character misinterprets 1980s fashion"
    
  - from: node3
    to: node2
    type: anachronism
    note: "Brand doesn't exist yet in 1955"
```

### Test Case 2: Reality Layers - Sports Almanac

```
referenceChain: bttf2_sports_almanac
nodes:
  1. film:bttf2:1989:prop:grays_sports_almanac
     - Physical prop in movie production
     layers: [production, narrative_2015, narrative_alt1985]
     
  2. film:bttf2:1989:narrative:almanac_contents
     - Fictional sports results 1950-2000
     realityRelation: 
       type: fictional_documentation
       documenting: alternate_timeline_sports
       
  3. history:sports:actual_results:1950-2000
     - Real world sports results
     realityRelation:
       type: documentary
       
connections:
  - from: node1
    to: node2
    type: prop_represents_document
    layers: [production_to_narrative]
    
  - from: node2
    to: node3
    type: alternate_history
    note: "Almanac contains different results than reality"
    deviation_point: "Nov 12, 1955"
```

### Test Case 3: Meta-Reference - "Hey McFly!"

```
referenceChain: bttf_your_kids_gonna_love_it
nodes:
  1. film:bttf:1985:narrative_1985:marty_audition
     - Marty's band audition
     - Judge says "too loud"
     
  2. film:bttf:1985:narrative_1955:marty_performs
     - Marty performs at dance
     - Says "Your kids are gonna love it"
     
  3. film:bttf:1985:production:huey_lewis_cameo
     - Huey Lewis plays the judge
     - His song "Power of Love" is "too loud"
     
  4. history:music:rock_evolution:1955
     - Rock and roll emergence in 1950s
     
connections:
  - from: node1
    to: node3
    type: meta_casting
    note: "Singer judges his own song"
    
  - from: node2
    to: node4
    type: predictive_reference
    note: "Predicting rock's future from 1955"
    
  - from: node2
    to: node1
    type: temporal_irony
    note: "1950s 'too loud' becomes 1980s 'too loud'"
```

## Validation Criteria

The implementation should correctly:

1. **Handle Temporal Paradoxes**: The Johnny B. Goode reference should create a valid circular reference chain
2. **Layer Separation**: Calvin Klein references should maintain distinct production, narrative_1985, and narrative_1955 layers
3. **Attribution Tracking**: Real entities (Chuck Berry, Calvin Klein, Huey Lewis) should have proper attribution requirements
4. **Window Alignment**: Events in "1955" windows should be discoverable together across different universes
5. **Reality Gradients**: Should distinguish between:
   - Historical fact (Chuck Berry's career)
   - Fictional narrative (Marty's time travel)
   - Meta-references (Huey Lewis cameo)
   - Props vs. narrative objects (physical almanac vs. its contents)
6. **Query Support**: Should be able to answer:
   - "Find all anachronisms in BTTF"
   - "Find all temporal paradoxes created by time travel narratives"
   - "Find all references between 1955 and 1985 in any universe"
   - "Find all meta-casting references where actors play judges of themselves"

## Success Metrics

The system is correctly implemented if it can:
1. Represent all three test reference chains without data loss
2. Maintain temporal consistency within each universe
3. Support bi-directional reference traversal
4. Handle both precise timestamps and fuzzy temporal windows
5. Distinguish between different types of reality relations
6. Properly attribute copyrighted material while marking public domain content


