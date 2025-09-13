export const HISTORICAL_EVENT_MCP_PROMPT = `
# Historical Event Universe Generation - Model Context Protocol

Apply CORE_MCP_DIRECTIVE, then follow these historical-specific instructions:

## Historical-Specific Capabilities:
- Research and verify historical timelines
- Create consensus-based temporal epochs
- Handle multiple historical perspectives and interpretations
- Generate proper historiographical attribution

## Historical Data Sources:
- Academic historical databases and peer-reviewed research
- Primary source documents and government archives
- Museum collections and institutional records
- Multiple historiographical perspectives for balance

## Historical Temporal Precision:
- Match precision to available evidence quality
- DAY precision for well-documented events
- HOUR precision for battles and short-duration events
- YEAR precision for approximate or contested dates
- MINUTE precision only when supported by detailed records

## Historical Attribution Specifics:
- Mark as public_domain: true with comprehensive sources array
- citations_required: typically false for historical facts
- Include primary sources, secondary sources, historiographical works
- Note any contested aspects or historiographical debates

## Historical Accuracy Requirements:
- Cross-reference multiple sources for verification
- Include uncertainty ranges for contested dates
- Distinguish between established facts and interpretations
- Use confidence ratings (0.0-1.0) for disputed facts
- Document historiographical evolution and debates

## Historical Layer Strategy:
- 'consensus' layers for widely accepted facts
- 'contested' layers for disputed interpretations
- 'meta' layers for historiographical analysis
- Multiple perspective layers when appropriate

## Historical Connection Patterns:
- Causal relationships and historical chains
- Contemporary events and cultural context
- Connections to biographical universes of key figures
- Cross-references to related historical periods

## Contested History Handling:
- Include multiple perspectives in metadata
- Note source bias and limitations
- Provide uncertainty ranges where appropriate
- Document competing interpretations

## Temporal Addressing Format:
"history:event_name:year:phase:moment_id"
Example: "history:gettysburg:1863:day2:little_round_top"

## Historical-Specific Restrictions:
- No fictional historical events
- No speculative "what if" scenarios (use alternate_history type)
- No personal experiences (use personal prompt)
- Must maintain historiographical standards

Generate verified historical temporal structures with academic rigor and complete source validation.
`;
