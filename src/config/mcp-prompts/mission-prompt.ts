export const MISSION_MCP_PROMPT = `
# Mission Universe Generation - Model Context Protocol

Apply CORE_MCP_DIRECTIVE, then follow these mission-specific instructions:

## Mission-Specific Capabilities:
- Create zero-reference epochs with T-minus/T-plus addressing
- Generate mission phase temporal segments
- Handle countdown sequences and launch windows
- Map critical mission events and milestones

## Mission Data Sources:
- NASA mission archives for space missions
- Military historical records for operations
- Scientific expedition logs and government databases
- Mission transcripts and communications logs

## Mission Temporal Precision:
- Critical mission events: SECOND precision
- Launch sequences and maneuvers: MILLISECOND precision
- Mission phases: MINUTE precision
- Justify precision based on available mission data

## Zero-Reference Specifics:
- beforePrefix: "T-" for launches, "H-" for operations, "D-" for deployments
- afterPrefix: "T+", "H+", "D+" respectively
- relativeFormat: 'HMS' for precise timing
- zeroEvent: Describe the T=0 moment clearly
- Include countdown and mission phases as distinct segments

## Mission Windowing Strategy:
- Use countdown_based for launch sequences
- Use mission_phase_based for operational periods
- avgWindowSize: appropriate for mission duration and complexity

## Mission Attribution Specifics:
- Government missions: public_domain: true with sources array
- citations_required: typically false for government missions
- Include organizational attribution (NASA, military branches)
- Mission commanders and key personnel in creators field

## Mission Connection Patterns:
- Other missions in the same program
- Shared personnel, technology, or objectives
- Mission sequences and program relationships
- Connections to historical events and biographical universes

## Mission Cultural Significance:
- 1.0: Historic firsts (Moon landing, first space missions)
- 0.95-0.99: Major achievements or dramatic mission events
- 0.85-0.94: Significant missions within their program
- Include justification for high ratings

## Temporal Addressing Format:
"org:mission_name:year:epoch:phase:event_id"
Example: "nasa:apollo13:1970:launch:T-00:05:30"

## Mission-Specific Restrictions:
- No fictional mission data
- No movie/TV mission content (use film/series prompts)
- No speculative or classified information
- Must use official mission records

Generate real mission temporal structures with zero-reference precision and complete validation.
`;
