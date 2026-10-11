import { UniverseBuilder, createFilmUniverseId } from '../../../index';
import { CommonUniverseIds } from '../../../core/common-universe-ids';

/**
 * Spaceballs (1987) - A Parody of Star Wars and Sci-Fi Tropes
 *
 * A satirical film by Mel Brooks that primarily parodies the original Star Wars trilogy.
 * The universe is structured around the film's runtime, with keyframes marking direct,
 * significant parodies of iconic Star Wars moments.
 *
 * Cultural Significance: 0.85 - Spaceballs is one of the most famous and beloved parody
 * films ever made. Its enduring quotes and direct, scene-for-scene satires have made it
 * a cultural touchstone for generations of Star Wars fans.
 *
 * Reality Relation: pure_fiction with 1.0 fictionalization
 *
 * Research Sources:
 * - IMDb, "Spaceballs (1987)"
 * - "Spaceballs: The Wiki" Fandom Site
 * - Screen Rant, "30 Best Quotes From Spaceballs"
 *
 * Hierarchical Context: HOLLYWOOD_SYSTEM -> US_HISTORY
 * Natural Connections Discovered:
 * - Parent Context: CommonUniverseIds.HOLLYWOOD_SYSTEM
 * - Temporal Reference: Directly parodies CommonUniverseIds.STAR_WARS_ORIGINAL_TRILOGY
 */
export const spaceballsUniverse = new UniverseBuilder()
    .film('mgm', 'Spaceballs', 1987)
    .withId(createFilmUniverseId('mgm', 'spaceballs', 1987))
    .withRuntime(96)
    .withReleaseDate('1987-06-24')
    .withCreators({
        director: ['Mel Brooks'],
        writer: ['Mel Brooks', 'Thomas Meehan', 'Ronny Graham'],
    })
    .withCulturalSignificance(0.85, 'A quintessential parody film that has become a cult classic, deeply ingrained in the culture of Star Wars fandom.')
    .withRealityRelation('pure_fiction', 1.0)
    .withCopyright(['Metro-Goldwyn-Mayer (MGM)'], 1987, 'active')
    .addConnection({
        targetUniverseId: "film:star_wars:*",
        type: 'parodies',
        confidence: 1.0,
        description: 'The entire film is a direct and intentional parody of the original Star Wars trilogy.',
        evidence: ['Direct visual gags (e.g., Spaceball One reveal)', 'Character archetypes (Lone Starr, Dark Helmet)', 'Plot structure mirroring A New Hope'],
    })
    .addRuntimeKeyframe(2, 15, 'opening_crawl_parody', 0.9, ['parody', 'opening_scene', 'star_wars_reference'])
    .addRuntimeKeyframe(4, 30, 'spaceball_one_reveal', 0.95, ['parody', 'visual_gag', 'star_destroyer'])
    .addRuntimeKeyframe(25, 10, 'the_schwartz', 1.0, ['parody', 'the_force', 'core_concept'])
    .addRuntimeKeyframe(58, 45, 'combing_the_desert', 0.8, ['parody', 'pun', 'visual_gag'])
    .build();

// NOTE: the Toy Story (1995) universe now lives in the canonical Pixar filmography
// (../pixar/films.ts), which also carries its Star Wars-homage references and
// runtime keyframes.

/**
 * Ready Player One (2018) - A Celebration of 80s and 90s Pop Culture
 *
 * Based on the novel by Ernest Cline, this film is set in a virtual reality world called
 * the OASIS, which is filled with countless references to pop culture, including numerous
 * explicit nods to the Star Wars universe.
 *
 * Cultural Significance: 0.88 - A major cultural event for fans of retro gaming and
 * 80s pop culture. The film's use of licensed characters and properties from dozens of
 * franchises, including Star Wars, created a unique cinematic crossover event.
 *
 * Reality Relation: pure_fiction with 1.0 fictionalization
 *
 * Research Sources:
 * - IMDb, "Ready Player One (2018)"
 * - Mashable, "Here are the 'Star Wars' Easter eggs to look for in 'Ready Player One'"
 * - Reddit, r/readyplayerone, "updated list of every reference"
 *
 * Hierarchical Context: AMBLIN_ENTERTAINMENT -> HOLLYWOOD_SYSTEM
 * Natural Connections Discovered:
 * - Parent Context: CommonUniverseIds.HOLLYWOOD_SYSTEM
 * - Temporal Reference: Explicitly references multiple Star Wars films and characters.
 */
export const readyPlayerOneUniverse = new UniverseBuilder()
    .film('warner_bros', 'Ready Player One', 2018)
    .withId(createFilmUniverseId('warner_bros', 'ready_player_one', 2018))
    .withRuntime(140)
    .withReleaseDate('2018-03-29')
    .withCreators({
        director: ['Steven Spielberg'],
        writer: ['Zak Penn', 'Ernest Cline'],
    })
    .withCulturalSignificance(0.88, 'A massive pop culture crossover film that heavily features Star Wars iconography as a central element of its virtual world.')
    .withRealityRelation('pure_fiction', 1.0)
    .withCopyright(['Warner Bros.', 'Amblin Entertainment', 'Village Roadshow Pictures'], 2018, 'active')
    .addConnection({
        targetUniverseId: "film:star_wars:*",
        type: 'references',
        confidence: 1.0,
        description: 'The OASIS virtual world is populated with Star Wars ships, characters, and locations.',
        evidence: ['Visual appearance of X-wings and TIE fighters', 'Character avatars dressed as stormtroopers', 'Dialogue referencing the Millennium Falcon'],
    })
    .addRuntimeKeyframe(1, 55, 'x_wing_in_garage', 0.8, ['visual_reference', 'star_wars_reference', 'easter_egg'])
    .addRuntimeKeyframe(8, 20, 'holocron_artifact', 0.9, ['visual_reference', 'star_wars_reference', 'plot_device'])
    .addRuntimeKeyframe(125, 40, 'final_battle_ships', 0.95, ['visual_reference', 'star_wars_reference', 'action_sequence'])
    .build();
