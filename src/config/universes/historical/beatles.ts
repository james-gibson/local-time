import { UniverseBuilder, createHistoricalUniverseId,TimePrecision } from '../../../index';

/**
 * @universeName The Beatles (Historical)
 * @universeId history:the_beatles:1960-1970
 * @description This universe documents the historical timeline of the English rock band The Beatles, from their formation in 1960 to their breakup in 1970.
 * It captures key moments, including their formation, major releases, landmark performances, and the events leading to their dissolution.
 * The temporal structure is organized chronologically, marking the band's evolution and immense cultural impact.
 * As a historical entity, the facts are considered public domain.
 */
export const theBeatlesHistoricalUniverse = new UniverseBuilder()
    .historical('The Beatles', 1960, 1970)
    // The Beatles' history is a documented series of real events.
    .withRealityRelation('documentary', 0.0)
    // Historical facts about the band are in the public domain.
    .withAttribution('public_domain', 1970, 'active')
    // The Beatles are arguably the most influential band in the history of popular music.
    .withCulturalSignificance(1.0)
    // --- Segments defining major eras of the band's career ---
    .addDateSegment('1960-08-17', '1962-10-04', 'formation_and_hamburg', 'phase', undefined, undefined, 'The early years, honing their craft in Liverpool and Hamburg.')
    .addDateSegment('1962-10-05', '1966-08-28', 'beatlemania', 'phase', undefined, undefined, 'The period of intense global fame, touring, and early hits.')
    .addDateSegment('1966-08-29', '1969-08-19', 'studio_years', 'phase', undefined, undefined, 'The post-touring era focused on groundbreaking studio albums.')
    .addDateSegment('1969-08-20', '1970-05-08', 'breakup_and_final_releases', 'phase', undefined, undefined, 'The period of internal friction, final recordings, and dissolution.')

    // --- Keyframes for specific historical events ---

    // August 1960: The band, now known as "The Beatles", begins their residency in Hamburg, Germany, a formative period.【1】
    .addDateKeyframe('1960-08-17', 'hamburg_residency_begins', 0.8, ['formation', 'live_performance'], TimePrecision.DAY)
    // October 5, 1962: Release of their first single, "Love Me Do", in the UK, marking their official debut.【2】
    .addDateKeyframe('1962-10-05', 'love_me_do_release', 0.9, ['music_release', 'debut', 'single'], TimePrecision.DAY)
    // February 9, 1964: First appearance on The Ed Sullivan Show in the US, a watershed moment that launched the "British Invasion".【3】
    .addDateKeyframe('1964-02-09', 'ed_sullivan_debut', 1.0, ['television', 'usa_debut', 'beatlemania'], TimePrecision.DAY)
    // August 29, 1966: The Beatles perform their last official commercial concert at Candlestick Park, San Francisco.
    .addDateKeyframe('1966-08-29', 'final_concert_candlestick', 0.95, ['live_performance', 'end_of_touring'], TimePrecision.DAY)
    // June 1, 1967: Release of "Sgt. Pepper's Lonely Hearts Club Band", a landmark concept album that redefined pop music.【4】
    .addDateKeyframe('1967-06-01', 'sgt_pepper_release', 1.0, ['music_release', 'album', 'psychedelia', 'cultural_milestone'], TimePrecision.DAY)
    // August 27, 1967: Death of manager Brian Epstein, a critical turning point that destabilized the band's internal structure.【5】
    .addDateKeyframe('1967-08-27', 'brian_epstein_death', 0.9, ['turning_point', 'band_dynamics'], TimePrecision.DAY)
    // January 30, 1969: The famous impromptu rooftop concert at their Apple Corps headquarters in London, their final public performance.
    .addDateKeyframe('1969-01-30', 'rooftop_concert', 1.0, ['live_performance', 'final_performance', 'iconic_moment'], TimePrecision.DAY)
    // September 20, 1969: John Lennon privately announces to the band that he is leaving The Beatles.【6】
    .addDateKeyframe('1969-09-20', 'lennon_announces_leaving', 0.95, ['band_dynamics', 'breakup'], TimePrecision.DAY)
    // September 26, 1969: Release of "Abbey Road", the last album the band recorded together.【7】
    .addDateKeyframe('1969-09-26', 'abbey_road_release', 1.0, ['music_release', 'album', 'final_recording'], TimePrecision.DAY)
    // April 10, 1970: Paul McCartney publicly announces his departure from the band, confirming the breakup.【8】
    .addDateKeyframe('1970-04-10', 'mccartney_announces_breakup', 1.0, ['breakup', 'public_announcement'], TimePrecision.DAY)
    // May 8, 1970: Release of the album "Let It Be", the final studio album released by The Beatles.【9】
    .addDateKeyframe('1970-05-08', 'let_it_be_release', 0.9, ['music_release', 'album', 'posthumous_release'], TimePrecision.DAY)
    .build();

/**
 * ## Usage Example
 *
 * This example demonstrates how to register and access The Beatles' historical universe.
 *
 * ```typescript

 * import { UniverseRegistry } from &#x27;./core/universe-registry&#x27;;
 * import { theBeatlesHistoricalUniverse } from &#x27;./universes/historical/the-beatles-1960-1970&#x27;;
 *

 * // Assuming a UniverseRegistry instance is available
 * const registry = new UniverseRegistry();
 * registry.registerUniverse(theBeatlesHistoricalUniverse.universeId, theBeatlesHistoricalUniverse);
 *

 * // Retrieve the universe from the registry
 * const universe = registry.getUniverse(&#x27;history:the_beatles:1960-1970&#x27;);
 *

 * console.log(universe?.metadata.title); // Output: The Beatles
 *

 * // Find a specific keyframe
 * const edSullivanKeyframe = universe?.temporal.keyframes[&#x27;1964-02-09:ed_sullivan_debut&#x27;];
 * console.log(edSullivanKeyframe?.significance); // Output: 1.0
 * ```
 */
