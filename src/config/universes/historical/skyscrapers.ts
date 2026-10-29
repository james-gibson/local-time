import { Universe } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { createHistoricalBuilder } from '../../../core/universe-builder';
import { POST_NINE_ELEVEN, PRE_NINE_ELEVEN } from '../common-epochs';

/**
 * Post-9/11 Evolution of Skyscraper Design and Cinematic Portrayal
 *
 * This universe documents the dual impact of the September 11, 2001 attacks on two distinct but related domains: the physical design of skyscrapers and their symbolic portrayal in popular culture, particularly in action films.
 *
 * Before 9/11, movies like 'Die Hard' (1988) used skyscrapers as dramatic, self-contained settings for action and heroism—vertical playgrounds where threats were ultimately surmountable. After 9/11, the imagery of collapsing towers became a cultural trauma, fundamentally changing this dynamic.
 *
 * In architecture, the attacks triggered a revolution in building safety. Codes were rewritten to mandate stronger structural cores, wider emergency stairwells, better fireproofing, and sophisticated evacuation systems. The focus shifted from merely meeting code to designing for resilience against catastrophic events.
 *
 * In cinema, the immediate aftermath saw a retreat from depicting urban destruction. The World Trade Center towers were digitally removed from films and TV shows. When skyscrapers returned to the screen, they were often treated with more gravity—either as symbols of vulnerability or as fortresses of post-9/11 security. The carefree "vertical playground" trope of the 'Die Hard' era was largely replaced by a more somber and realistic understanding of what these structures represent.
 *
 * Cultural Significance: 0.88 - This shift reflects a major turning point in public consciousness, where a fictional trope was irrevocably altered by a real-world tragedy, leading to tangible changes in engineering, architecture, and storytelling.
 * Reality Relation: Documentary with 0.0 fictionalization.
 *
 * Research Sources:
 * - The 9/11 Commission Report (for context on the event's impact).
 * - National Institute of Standards and Technology (NIST) Reports on WTC collapse.
 * - International Code Council (ICC) publications on post-9/11 building code changes.
 * - "How 9/11 changed cinema" - The Conversation.
 * - "9/11 led to 'a renaissance of tall building design'" - Dezeen.
 *
 * Key Facts Verified:
 * - Immediate Changes: ICC implemented code supplements within months of the attacks, which were later integrated into the 2003 International Building Code.
 * - Design Philosophy Shift: Move towards performance-based design, focusing on how a building behaves under extreme stress rather than just prescriptive rules.
 * - Cinematic Moratorium: Films like 'Spider-Man' (2002) had promotional material featuring the Twin Towers removed.
 *
 * Hierarchical Context: US_HISTORY -> US_CULTURE -> HOLLYWOOD_SYSTEM
 *
 * ## Why it is not under `global-politics/` (james-gibson/local-time#126)
 *
 * The file happened to live in that directory, but the universe is US cultural
 * and architectural history, not politics. It moves to `historical/` with the
 * other sourced US-history universes.
 *
 * ## Repaired while wiring the namespace (#126, #102)
 *
 * Timestamps were milliseconds in nanosecond fields, segments used
 * `segmentId`/`startTime`/`endTime` (and a `tags` field the type does not have),
 * the reality anchors were non-canonical, and `copyright.status` /
 * `windows.avgWindowSize` held values the types reject. It is now assembled by
 * the builder, so `build()` validates it.
 */
const FIVE_YEARS_NS = 5n * 365n * 24n * 60n * 60n * 1_000_000_000n;

const skyscrapers = createHistoricalBuilder()
    .historical('us_culture:post_911_skyscraper_shift', 2001, 'present')
    .withAliases(['The Die Hard Effect Post-9/11', 'Post-9/11 Architectural Security'])
    .withCanonicalName('Post-9/11 Shift in Skyscraper Design and Cinematic Portrayal')
    .withDescription(
        'Documents the paradigm shift in high-rise building safety and the cultural representation of skyscrapers in media following the 9/11 attacks.',
    )
    .withReleased('2001-09-12T00:00:00.000Z')
    .withCulturalSignificance(0.88)
    // No reality anchors: all three this universe used to name were documents, not
    // universes — ICC's 2003 code, NIST's 2005 WTC investigation, and the post-9/11
    // cinematic moratorium, which this universe records itself in the
    // `immediate_aftermath` segment below. An anchor is an event *universe* id, so
    // none of them could resolve (local-time#184). They are cited in
    // `attribution.sources` instead.
    .withRealityRelation('documentary', 0.0, [])
    .withCopyright(['Various architectural firms, engineering bodies, and film studios'], 2001, 'active')
    .withSources([
        'ICC, 2003 International Building Code (and the 2002 code supplements it consolidated)',
        'NIST NCSTAR 1 — Final Report on the Collapse of the World Trade Center Towers (2005)',
        'AIA',
        'Variety and The Hollywood Reporter coverage of the post-9/11 cinematic moratorium (2001-2002)',
        "'Spider-Man' (2002) original teaser trailer and poster, withdrawn after the attacks",
        'Various academic and media publications',
    ])
    .withUsageRestrictions([
        'Architectural designs are proprietary. Cinematic clips are subject to copyright.',
    ])
    .addParent(CommonUniverseIds.US_HISTORY)
    .addParent(CommonUniverseIds.HOLLYWOOD_SYSTEM)
    // The subject of the universe is the before/after of one event, so both
    // halves are the shared named epochs rather than a local re-declaration.
    .addEpoch('primary', PRE_NINE_ELEVEN.epochId, { ...PRE_NINE_ELEVEN })
    .addEpoch('primary', POST_NINE_ELEVEN.epochId, { ...POST_NINE_ELEVEN })
    .addDateSegment(
        '2001-09-11',
        '2003-12-31',
        'immediate_aftermath',
        'phase',
        'active',
        undefined,
        'A period of immediate reaction, including cinematic censorship and the rapid development of new building safety guidelines.',
    )
    .addDateSegment(
        '2004-01-01',
        '2011-12-31',
        'implementation_and_new_narratives',
        'phase',
        'active',
        undefined,
        'New building codes are widely adopted. Cinema begins to re-engage with themes of terrorism and urban destruction, but with a somber, post-9/11 perspective (e.g., "The Dark Knight," "Cloverfield").',
    )
    .addDateSegment(
        '2012-01-01',
        '2025-09-10',
        'modern_era',
        'phase',
        'active',
        undefined,
        'Post-9/11 design principles are standard for all new supertall skyscrapers. Cinematic destruction is common again, but often framed within the context of superhero fantasy, distancing it from realistic terrorism.',
    )
    .addDateKeyframe('2002-04-01T00:00:00Z', 'icc_adopts_wtc_proposals', 0.95, ['regulation', 'building_code', 'safety'], {
        certainty: 0.9,
        description:
            'The International Code Council formally adopts proposals based on early WTC collapse findings, marking the first major regulatory change in skyscraper design.',
    })
    .addDateKeyframe('2005-12-29T00:00:00Z', 'one_wtc_design_unveiled', 0.9, ['architecture', 'symbolism', 'resilience_design'], {
        certainty: 1.0,
        description:
            'The final design for One World Trade Center is unveiled, showcasing post-9/11 principles like a robust concrete core, blast-resistant base, and advanced life-safety systems.',
    })
    .addDateKeyframe('2008-07-18T00:00:00Z', 'the_dark_knight_release', 0.85, ['cinema', 'cultural_shift', 'post_911_themes'], {
        certainty: 1.0,
        description:
            'The release of "The Dark Knight," a film that explores post-9/11 anxieties about urban terrorism, surveillance, and chaotic violence, setting a new tone for the blockbuster genre.',
    })
    .withWindowing('phase_based', FIVE_YEARS_NS)
    .build();

// `metadata.creators` has no builder setter (collectives are not credited
// people); see the residue table in the `local-time-universe` skill.
skyscrapers.metadata = {
    ...skyscrapers.metadata,
    creators: ['International Code Council', 'NIST', 'Various Architects and Filmmakers'],
};

export const post911SkyscraperShiftUniverse: Universe = skyscrapers;
