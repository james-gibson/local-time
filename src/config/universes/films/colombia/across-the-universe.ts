import { UniverseBuilder,createFilmUniverseId, TimePrecision } from '../../../../index';



/**
 * Cultural Events Depicted in "Across the Universe" (2007)
 *
 * This universe documents the major American cultural and historical events of the 1960s as depicted, referenced, or allegorized in Julie Taymor's film "Across the Universe."
 * The film uses the music of The Beatles to frame its narrative, touching on themes of counter-culture, the Vietnam War, civil rights, and psychedelic exploration.
 * The timeline is structured around these cultural touchstones, noting the tone (serious or light-hearted) of their cinematic representation.
 *
 * Cultural Significance: 0.8 - The film serves as a significant modern artistic interpretation of the 1960s, introducing the era's cultural conflicts and aesthetics to a new generation through the universally recognized lens of The Beatles' music.
 * Reality Relation: documentary with 0.0 fictionalization. This universe documents the real-world events that the film depicts, not the film's fictional plot.
 *
 * Research Sources:
 * - "Across the Universe" (2007), directed by Julie Taymor.
 * - IMDb and Wikipedia entries for the film's plot summary and thematic analysis. 【1】【2】
 * - Historical records of the Vietnam War, the 1967 Detroit Riot, and the Columbia University protests of 1968.
 *
 * Hierarchical Context: This universe is a depiction of events within the US_HISTORY universe, specifically during the VIETNAM_WAR and CIVIL_RIGHTS_MOVEMENT periods.
 * Natural Connections Discovered:
 * - Parent Context: CommonUniverseIds.US_HISTORY (contains all depicted events).
 * - Temporal Overlap: Connects directly to the `theBeatlesHistoricalUniverse` as the band's music provides the film's entire soundtrack and narrative structure.
 */
export const acrossTheUniverseCulturalEventsUniverse = new UniverseBuilder()
    .historical('Cultural Events in Across the Universe', 1963, 1970)
    .withRealityRelation('documentary', 0.0)
    .withAttribution('public_domain', 1970, 'active')
    .withCulturalSignificance(0.8, 'Serves as a significant modern artistic interpretation of the 1960s, introducing the era\'s cultural conflicts to a new generation through the lens of The Beatles\' music.')
    // --- Segments defining the cultural shifts depicted in the film ---
    .addSegment('early_60s_optimism', BigInt(Date.UTC(1963, 0, 1)) * 1000000n, BigInt(Date.UTC(1965, 11, 31)) * 1000000n, 'phase')
    .addSegment('counter_culture_and_psychedelia', BigInt(Date.UTC(1966, 0, 1)) * 1000000n, BigInt(Date.UTC(1967, 11, 31)) * 1000000n, 'phase')
    .addSegment('political_radicalism_and_turmoil', BigInt(Date.UTC(1968, 0, 1)) * 1000000n, BigInt(Date.UTC(1970, 11, 31)) * 1000000n, 'phase')

    // --- Keyframes for specific cultural and historical events ---

    // The film portrays the bohemian lifestyle of Greenwich Village, a hub for artists, musicians, and writers. This is shown in a light-hearted, romanticized tone.
    .addDateKeyframe('1966-06-01', 'greenwich_village_bohemianism', 0.7, ['counter_culture', 'artistic_movement', 'new_york', 'tone_light_hearted'], TimePrecision.MONTH)
    // The military draft for the Vietnam War is a central conflict. The "I Want You (She's So Heavy)" sequence depicts the induction process with a serious, surreal, and menacing tone. 【3】
    .addDateKeyframe('1967-01-01', 'vietnam_war_draft', 0.95, ['vietnam_war', 'military', 'conflict', 'tone_serious'], TimePrecision.YEAR)
    // The film features large-scale anti-war protests, reflecting the growing opposition to the Vietnam War. These scenes are depicted with a serious and chaotic tone. 【2】
    .addDateKeyframe('1967-10-21', 'anti_war_protests', 0.9, ['vietnam_war', 'protest', 'activism', 'tone_serious'], TimePrecision.DAY)
    // The psychedelic movement is explored through the "I Am the Walrus" and "Being for the Benefit of Mr. Kite!" sequences, presented in a fantastical, light-hearted, and visually inventive tone. 【4】
    .addDateKeyframe('1967-07-01', 'psychedelic_exploration', 0.8, ['counter_culture', 'psychedelia', 'summer_of_love', 'tone_light_hearted'], TimePrecision.MONTH)
    // The 1967 Detroit Riot is visually referenced during the "Come Together" sequence, representing the intense urban and racial unrest of the era in a serious tone.
    .addDateKeyframe('1967-07-23', 'detroit_riot_allegory', 0.85, ['civil_rights', 'urban_unrest', 'racial_tension', 'tone_serious'], TimePrecision.DAY)
    // The student protests at Columbia University in 1968 are a major plot point, showing the clash between student activists and authority. This is depicted with a serious, politically charged tone.
    .addDateKeyframe('1968-04-23', 'columbia_university_protests', 0.9, ['student_movement', 'activism', 'protest', 'tone_serious'], TimePrecision.DAY)
    .build();


/**
 * @universeName Across the Universe (2007)
 * @universeId columbia:across_the_universe:2007
 * @description This universe captures the temporal structure of the 2007 film "Across the Universe," a musical drama directed by Julie Taymor.
 * The film's narrative is structured around 33 compositions by The Beatles and follows a group of young people in the tumultuous 1960s.
 * The timeline is marked by key musical numbers that serve as narrative and emotional anchors, visualizing the metaphors within the music.
 * The cultural significance is rooted in its unique reinterpretation of the Beatles' songbook and its ambitious visual storytelling.
 */
export const acrossTheUniverse2007Universe = new UniverseBuilder()
    // Source: IMDb, Wikipedia for film metadata.
    .film('columbia', 'Across the Universe', 2007)
    // Runtime: 133 minutes
    .withRuntime(133)
    // The film is a fictional narrative set against the backdrop of real historical events of the 1960s (e.g., Vietnam War, counter-culture movements).
    // The high fictionalization degree reflects the surreal, metaphorical, and musical interpretation of the era.
    .withRealityRelation('historical_fiction', 0.8)
    // Copyright holders for the film.
    .withCopyright(['Columbia Pictures', 'Revolution Studios'], 2007, 'active')
    // Key creative personnel.
    .withCreators({
        director: ['Julie Taymor'],
        writer: ['Dick Clement', 'Ian La Frenais'],
    })
    // The film is a significant cult classic, praised for its visual style and musical arrangements,
    // contributing to the legacy and interpretation of The Beatles' music for a new generation.
    .withCulturalSignificance(0.75)
    // --- ACT I: Introduction and Assembly ---
    .addRuntimeKeyframe(1, 15, 'jude_intro_liverpool', 0.8, ['character_intro', 'musical_number', 'girl'])
    .addRuntimeKeyframe(5, 40, 'lucy_intro_prom', 0.8, ['character_intro', 'musical_number', 'it_wont_be_long'])
    .addRuntimeKeyframe(12, 25, 'meeting_max_princeton', 0.9, ['character_meet', 'musical_number', 'with_a_little_help_from_my_friends'])
    .addRuntimeKeyframe(25, 10, 'greenwich_village_arrival', 0.9, ['setting', 'bohemian_life', 'musical_number', 'hold_me_tight'])
    // --- ACT II: Conflict and Psychedelia ---
    .addRuntimeKeyframe(45, 30, 'dr_robert_bus_trip', 1.0, ['psychedelia', 'turning_point', 'musical_number', 'i_am_the_walrus'])
    .addRuntimeKeyframe(58, 5, 'max_drafted', 0.95, ['plot_point', 'vietnam_war', 'conflict'])
    .addRuntimeKeyframe(62, 50, 'anti_war_protest', 1.0, ['historical_event', 'conflict', 'musical_number', 'i_want_you_shes_so_heavy'])
    .addRuntimeKeyframe(75, 20, 'strawberry_fields', 1.0, ['surrealism', 'jude_art', 'emotional_climax', 'musical_number', 'strawberry_fields_forever'])
    .addRuntimeKeyframe(88, 15, 'jude_deported', 0.9, ['plot_point', 'separation'])
    // --- ACT III: Resolution and Reunion ---
    .addRuntimeKeyframe(115, 0, 'max_returns_wounded', 0.85, ['resolution', 'vietnam_war_aftermath'])
    .addRuntimeKeyframe(120, 45, 'rooftop_concert_reunion', 1.0, ['climax', 'reunion', 'musical_number', 'dont_let_me_down', 'all_you_need_is_love'])
    .build();

/**
 * ## Usage Example
 *
 * This example demonstrates how to register and access the "Across the Universe" universe definition.
 *
 * ```typescript

 * import { UniverseRegistry } from &#x27;./core/universe-registry&#x27;;
 * import { acrossTheUniverse2007Universe } from &#x27;./universes/films/across-the-universe-2007&#x27;;
 *

 * // Assuming a UniverseRegistry instance is available
 * const registry = new UniverseRegistry();
 * registry.registerUniverse(acrossTheUniverse2007Universe.universeId, acrossTheUniverse2007Universe);
 *

 * // Retrieve the universe from the registry
 * const universe = registry.getUniverse(&#x27;columbia:across_the_universe:2007&#x27;);
 *

 * console.log(universe?.metadata.title); // Output: Across the Universe
 * console.log(universe?.temporal.epochs.runtime.duration); // Output: 7980000 (in milliseconds)
 * ```
 */
