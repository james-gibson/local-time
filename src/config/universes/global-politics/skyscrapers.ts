import {
    Universe,
    UniverseType,
    TimePrecision,
    createHistoricalUniverseId,
} from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';

/**
 * Post-9/11 Evolution of Skyscraper Design and Cinematic Portrayal
 *
 * This universe documents the dual impact of the September 11, 2001 attacks on two distinct but related domains: the physical design of skyscrapers and their symbolic portrayal in popular culture, particularly in action films.
 *
 * Before 9/11, movies like 'Die Hard' (1988) used skyscrapers as dramatic, self-contained settings for action and heroism—vertical playgrounds where threats were ultimately surmountable. After 9/11, the imagery of collapsing towers became a cultural trauma, fundamentally changing this dynamic.
 *
 * In architecture, the attacks triggered a revolution in building safety. Codes were rewritten to mandate stronger structural cores, wider emergency stairwells, better fireproofing, and sophisticated evacuation systems. 【1】 The focus shifted from merely meeting code to designing for resilience against catastrophic events. 【2】【3】
 *
 * In cinema, the immediate aftermath saw a retreat from depicting urban destruction. The World Trade Center towers were digitally removed from films and TV shows. 【4】 When skyscrapers returned to the screen, they were often treated with more gravity—either as symbols of vulnerability or as fortresses of post-9/11 security. The carefree "vertical playground" trope of the 'Die Hard' era was largely replaced by a more somber and realistic understanding of what these structures represent. 【4】
 *
 * Cultural Significance: 0.88 - This shift reflects a major turning point in public consciousness, where a fictional trope was irrevocably altered by a real-world tragedy, leading to tangible changes in engineering, architecture, and storytelling.
 * Reality Relation: Documentary with 0.0 fictionalization.
 *
 * Research Sources:
 * - The 9/11 Commission Report (for context on the event's impact).
 * - National Institute of Standards and Technology (NIST) Reports on WTC collapse. 【5】
 * - International Code Council (ICC) publications on post-9/11 building code changes. 【6】
 * - "How 9/11 changed cinema" - The Conversation. 【4】
 * - "9/11 led to 'a renaissance of tall building design'" - Dezeen. 【7】
 *
 * Key Facts Verified:
 * - Immediate Changes: ICC implemented code supplements within months of the attacks, which were later integrated into the 2003 International Building Code. 【3】
 * - Design Philosophy Shift: Move towards performance-based design, focusing on how a building behaves under extreme stress rather than just prescriptive rules. 【8】
 * - Cinematic Moratorium: Films like 'Spider-Man' (2002) had promotional material featuring the Twin Towers removed.
 *
 * Hierarchical Context: US_HISTORY -> US_CULTURE -> HOLLYWOOD_SYSTEM
 * Natural Connections Discovered:
 * - Direct consequence of the 'September 11, 2001 Attacks' universe.
 * - Influences the design principles within the 'ARCHITECTURE_AND_ENGINEERING' universe.
 * - Culturally linked to the 'DIE_HARD_1988' universe as a point of thematic contrast.
 */
export const post911SkyscraperShiftUniverse: Universe = {
    universeId: createHistoricalUniverseId(
        'us_culture',
        'post_911_skyscraper_shift',
        '2001-present'
    ),
    type: UniverseType.HISTORICAL_EVENT,
    epochs: undefined,
    identifiers: {
        primary: 'us_culture:phenomenon:post_911_skyscraper_shift',
        aliases: ['The Die Hard Effect Post-9/11', 'Post-9/11 Architectural Security'],
    },
    realityRelation: {
        type: 'documents',
        fictionalizationDegree: 0.0,
        realityAnchors: [
            {
                anchorId: 'icc_code_changes',
                realWorldEntity: 'International Building Code (2003 and subsequent editions)',
                description:
                    'Codification of enhanced safety measures for high-rise buildings, including impact resistance, improved egress, and redundant fire suppression systems.',
                confidence: 1.0,
                evidence: ['ICC press releases and code supplements from 2002-2003'],
            },
            {
                anchorId: 'nist_recommendations',
                realWorldEntity: 'NIST NCSTAR 1 Report Recommendations',
                description:
                    'The official set of recommendations for improving building safety that directly influenced new codes and standards.',
                confidence: 1.0,
                evidence: ['Final NIST report on the WTC collapse'],
            },
            {
                anchorId: 'cinematic_censorship_2001',
                realWorldEntity: 'Film and Television Industry Practices',
                description:
                    'Documented instances of studios digitally removing or altering scenes featuring the World Trade Center in the months following the attacks.',
                confidence: 0.95,
                evidence: ["News reports from Variety, The Hollywood Reporter (2001-2002)", "'Spider-Man' (2002) original teaser trailer"],
            },
        ],
    },
    attribution: {
        public_domain: false,
        copyright: {
            holders: ['Various architectural firms, engineering bodies, and film studios'],
            year: 2001,
            status: 'active_and_ongoing',
        },
        sources: ['ICC', 'NIST', 'AIA', 'Various academic and media publications'],
        citations_required: true,
        usage_restrictions: [
            'Architectural designs are proprietary. Cinematic clips are subject to copyright.',
        ],
    },
    layers: [],
    temporalStructure: {
        segments: [
            {
                segmentId: 'immediate_aftermath',
                startTime: BigInt('999997703000'), // 2001-09-11 (immediately after collapse)
                endTime: BigInt('1072846800000'), // 2003-12-31
                description:
                    'A period of immediate reaction, including cinematic censorship and the rapid development of new building safety guidelines.',
                tags: ['reaction', 'censorship', 'code_development'],
            },
            {
                segmentId: 'implementation_and_new_narratives',
                startTime: BigInt('1072933200000'), // 2004-01-01
                endTime: BigInt('1325307600000'), // 2011-12-31
                description:
                    'New building codes are widely adopted. Cinema begins to re-engage with themes of terrorism and urban destruction, but with a somber, post-9/11 perspective (e.g., "The Dark Knight," "Cloverfield").',
                tags: ['implementation', 'new_tropes', 'resilience'],
            },
            {
                segmentId: 'modern_era',
                startTime: BigInt('1325384400000'), // 2012-01-01
                endTime: BigInt('1757230800000'), // 2025-09-10 (current date)
                description:
                    'Post-9/11 design principles are standard for all new supertall skyscrapers. Cinematic destruction is common again, but often framed within the context of superhero fantasy, distancing it from realistic terrorism.',
                tags: ['normalization', 'supertall_era', 'fantasy_destruction'],
            },
        ],
        keyframes: [
            {
                id: 'icc_adopts_wtc_proposals',
                timestamp: BigInt('1017637200000'), // 2002-04-01 (approximate date of proposal adoption)
                significance: 0.95,
                description:
                    'The International Code Council formally adopts proposals based on early WTC collapse findings, marking the first major regulatory change in skyscraper design.',
                tags: ['regulation', 'building_code', 'safety'],
                certainty: 0.9,
            },
            {
                id: 'one_wtc_design_unveiled',
                timestamp: BigInt('1135832400000'), // 2005-12-29
                significance: 0.9,
                description:
                    'The final design for One World Trade Center is unveiled, showcasing post-9/11 principles like a robust concrete core, blast-resistant base, and advanced life-safety systems.',
                tags: ['architecture', 'symbolism', 'resilience_design'],
                certainty: 1.0,
            },
            {
                id: 'the_dark_knight_release',
                timestamp: BigInt('1216353600000'), // 2008-07-18
                significance: 0.85,
                description:
                    'The release of "The Dark Knight," a film that explores post-9/11 anxieties about urban terrorism, surveillance, and chaotic violence, setting a new tone for the blockbuster genre.',
                tags: ['cinema', 'cultural_shift', 'post_911_themes'],
                certainty: 1.0,
            },
        ],
        windows: {
            strategy: 'phase_based',
            avgWindowSize: 'P5Y', // Phases of change occurred roughly every 5 years
        },
    },
    metadata: {
        canonicalName: 'Post-9/11 Shift in Skyscraper Design and Cinematic Portrayal',
        creators: ['International Code Council', 'NIST', 'Various Architects and Filmmakers'],
        released: new Date('2001-09-12T00:00:00.000Z'),
        cultural_significance: 0.88,
        description:
            'Documents the paradigm shift in high-rise building safety and the cultural representation of skyscrapers in media following the 9/11 attacks.',
    },
} as unknown as Universe;
