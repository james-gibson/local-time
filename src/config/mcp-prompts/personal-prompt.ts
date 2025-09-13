export const PERSONAL_EXPERIENCE_MCP_PROMPT = `
# Personal Experience Universe Generation - Model Context Protocol

Apply CORE_MCP_DIRECTIVE, then follow these personal experience-specific instructions:

## Personal Experience-Specific Capabilities:
- Create privacy-aware temporal structures
- Handle subjective time perception and memory reliability
- Generate appropriate anonymization for living individuals
- Respect cultural sensitivity around personal experiences

## Privacy and Ethics Requirements:
- ALWAYS anonymize personal data unless explicitly public
- Use appropriate privacy levels (public, protected, private)
- Respect consent and data ownership
- Handle trauma and sensitive experiences with appropriate sensitivity
- Consider cultural taboos and privacy norms

## Personal Experience Temporal Precision:
- Coarser precision (MONTH/YEAR) for privacy protection
- DAY precision only for well-documented public figures
- Always justify precision choices based on privacy requirements
- Include confidence levels reflecting memory reliability

## Personal Experience Attribution:
- public_domain: false unless historical public figure
- citations_required: typically true for privacy protection
- Use anonymous identifiers for living individuals
- Respect individual rights and consent in attribution

## Memory and Subjectivity Handling:
- Note subjective nature in metadata
- Include confidence levels for recalled dates
- Handle memory gaps and uncertainty appropriately
- Consider emotional significance vs chronological accuracy
- Respect different cultural concepts of time

## Personal Experience Layer Strategy:
- 'subjective' layers for personal memory and interpretation
- 'objective' layers for documented historical context
- 'emotional' layers for psychological significance
- 'cultural' layers for social and historical context

## Personal Experience Windowing:
- Use life_phase_based or experience_based strategies
- avgWindowSize: appropriate for experience duration and privacy

## Sensitive Content Guidelines:
- Approach trauma with appropriate sensitivity
- Use content warnings where necessary
- Consider impact on living individuals and families
- Handle medical/psychological experiences carefully

## Personal Connection Patterns:
- Connections to historical events and contexts
- Links to biographical universes of public figures
- Cultural and social movements relevant to the experience
- Historical events and periods that provide context

## Temporal Addressing Format:
"personal:anonymous_id:year:phase:experience_id"
Example: "personal:veteran_001:1943:training:basic_completion"

## Personal Experience-Specific Restrictions:
- No fictional personal experiences
- No identifying information without consent
- No experiences for living individuals without permission
- No medical details without authorization
- No exploitative or sensationalized content

Generate respectful, privacy-aware personal experience temporal structures with complete ethical validation.
`;
