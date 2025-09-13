export const CORE_MCP_DIRECTIVE = `
# Core Universe Generation Directives

## Universe ID System
- Use branded type creation functions: createFilmUniverseId(), createHistoricalUniverseId(), etc.
- Always validate IDs match expected patterns for the universe type
- Include proper TypeScript imports for ID creation functions
- Example patterns: createFilmUniverseId('studio', 'title', year)

## Temporal Structure Standards
- ALWAYS include complete segments covering entire timeline
- Keyframe significance must be justified (0.8+ for major moments, 1.0 for defining moments)
- Segments should not have gaps or overlaps without explicit justification
- Include avgWindowSize when using time_based or phase_based strategies
- Windowing strategy must match universe type and content structure

## Attribution Requirements
- Use full copyright structure with holders, year, and status
- Mark government/historical content as public_domain: true with proper sources array
- Include citations_required boolean based on content type
- Include usage_restrictions array for copyrighted content
- Always include complete creator information

## Reality Relation Requirements
- Always include realityAnchors array, even if empty
- Use confidence levels (0.0-1.0) for all reality anchors
- Include evidence array for each anchor
- Match fictionalizationDegree to actual content (0.0 for pure documentary, 1.0 for pure fiction)
- Use proper relationship types: 'depicts', 'inspired_by', 'documents', etc.

## Cultural Significance Calibration
- 1.0: Defining cultural moments (Moon landing, major wars, cultural watersheds)
- 0.95-0.99: Highly influential works that changed their medium or field
- 0.85-0.94: Significant cultural impact within their domain
- 0.70-0.84: Notable works with lasting influence
- 0.50-0.69: Moderate cultural footprint
- Include justification for ratings above 0.9

## Connection Discovery Mandate
- ACTIVELY search for connections during universe creation
- Check for shared creative teams, studios, or production relationships
- Identify thematic similarities, visual references, or cross-universe homages
- Look for explicit references, easter eggs, or callbacks
- Create TemporalReference objects for discovered connections
- Include confidence ratings and evidence for all connections

## Metadata Requirements
- Include all relevant creators and key personnel
- Add genre, themes, or category tags for discoverability
- Include release/event dates with appropriate precision
- Add brief description explaining the universe's significance
- Include any relevant awards, recognition, or historical importance

## Output Validation
- Verify all timestamps are within epoch boundaries
- Check that keyframe significance ratings are justified
- Ensure universe IDs follow branded type patterns
- Validate that temporal segments don't have unexplained gaps
- Include error handling for edge cases
- Provide fallback strategies for incomplete information

## Temporal Precision Guidelines
- Match precision to available evidence and content requirements
- Always justify precision choices in metadata
- Use appropriate precision for the universe type and temporal scope

## Layer Strategy Guidelines
- Use multiple layers when content has different temporal perspectives
- Each layer should have clear purpose and proper epoch definitions
- Add 'meta' layers for behind-the-scenes or production information when relevant

## Do Not
- Create fictional or speculative content without clear marking
- Generate incomplete temporal structures
- Miss obvious connections within brand families or creative networks
- Ignore established patterns and conventions
- Include personal or confidential information without authorization
`;
