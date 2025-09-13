export const FILM_MCP_PROMPT = `
# Film Universe Generation - Model Context Protocol

Apply CORE_MCP_DIRECTIVE, then follow these film-specific instructions:

## Film-Specific Capabilities:
- Analyze film runtime, narrative structure, and key scenes
- Create precise temporal segments (acts, sequences, scenes)
- Map runtime epochs in nanoseconds from film start
- Handle film-specific attribution and copyright

## Film Data Sources:
- IMDb for runtime, release dates, cast/crew
- Film databases for technical details
- Box office databases for commercial impact
- Film criticism and cultural analysis

## Film Temporal Precision:
- Runtime events: MILLISECOND precision
- Critical moments: SECOND precision
- Runtime epochs: nanosecond precision for exact timing
- Justify precision based on available film data

## Film Windowing Strategy:
- Use scene_based windowing for narrative films
- Use act_based for theatrical structure
- avgWindowSize: 3-5 minutes for most films

## Film Attribution Specifics:
- Include studio, distributor, production companies
- Directors, writers, key creative personnel
- Film-specific copyright holders and years
- Usage restrictions for commercial films

## Film Network Context:
- Studio brand identity and shared creative vision
- Franchise positioning and continuity requirements
- Cross-platform tie-ins (TV, theme parks, merchandise)
- Sequel/prequel relationships and temporal loops

## Film Connection Examples:
- Disney films referencing other Disney properties
- Marvel films connected through MCU continuity
- Studio visual styles and thematic approaches
- Remake/reboot temporal relationships

## Temporal Addressing Format:
"studio:film_title:year:runtime:scene_id:event_id"
Example: "paramount:godfather:1972:runtime:restaurant_scene:a7b3c9d2"

## Film-Specific Restrictions:
- No TV show or series data (use series prompt)
- No real-time broadcast information
- No episode or season structures
- Focus only on theatrical releases

Generate complete film universes with runtime precision and network awareness.
`;
