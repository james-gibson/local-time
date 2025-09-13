// import { UniverseBuilder } from './core/universe-builder';
// Assuming the core types are in a file like this.
// If the path is different, please adjust the import.
// import { TimePrecision, UniverseType, RealityRelationType } from './core/types';
import { UniverseBuilder,  } from '../../../index';
/**
 * This file contains the universe definitions for the original Toy Story trilogy.
 * Each universe is created using the UniverseBuilder pattern to ensure consistency
 * and adherence to the Local Time Universe System protocol.
 */

// --- Toy Story (1995) ---

/**
 * Universe definition for Toy Story (1995).
 *
 * The first feature-length computer-animated film, Toy Story, revolutionized the
 * animation industry. This universe captures the 81-minute narrative of Woody,
 * a pull-string cowboy doll, and his rivalry with the new high-tech Buzz Lightyear
 * action figure. The temporal structure is based on the film's runtime, with
 * keyframes marking pivotal plot points and character development moments.
 *
 * Source: IMDb, Wikipedia【1】【2】
 */
export const toyStory1995Universe = new UniverseBuilder()
    .film('pixar', 'toy_story', 1995)
    .withRuntime(81)
    .withRealityRelation('pure_fiction', 1.0)
    .withCopyright(['The Walt Disney Company', 'Pixar Animation Studios'], 1995, 'active')
    .withCreators({
        director: ['John Lasseter'],
        writer: [
            'Joss Whedon',
            'Andrew Stanton',
            'Joel Cohen',
            'Alec Sokolow',
            'John Lasseter',
            'Pete Docter',
            'Joe Ranft',
        ],
    })
    .withCulturalSignificance(
        0.98,
        'Groundbreaking as the first feature-length computer-animated film, setting a new standard for animation and family entertainment.'
    )
    .addRuntimeKeyframe(5, 22, 'buzz_arrival', 0.9, ['character_introduction', 'inciting_incident'])
    .addRuntimeKeyframe(18, 45, 'window_incident', 0.95, ['conflict', 'turning_point', 'rivalry'])
    .addRuntimeKeyframe(35, 10, 'pizza_planet', 0.8, ['new_world', 'adventure'])
    .addRuntimeKeyframe(42, 5, 'captured_by_sid', 0.9, ['antagonist', 'danger', 'imprisonment'])
    .addRuntimeKeyframe(63, 15, 'sids_toys_revolt', 1.0, ['climax', 'teamwork', 'resolution'])
    .addRuntimeKeyframe(72, 30, 'falling_with_style', 1.0, ['climax', 'character_arc', 'friendship'])
    .addRuntimeKeyframe(77, 15, 'reunion_with_andy', 0.9, ['resolution', 'homecoming'])
    .build();

// --- Toy Story 2 (1999) ---

/**
 * Universe definition for Toy Story 2 (1999).
 *
 * A rare sequel that surpassed the original in the eyes of many critics, Toy Story 2
 * expands the world and explores themes of abandonment, purpose, and the finite
 * nature of a toy's life with its owner. This universe maps the 92-minute runtime,
 * focusing on Woody's kidnapping by a greedy toy collector and the daring rescue
 * mission launched by Buzz and the gang.
 *
 * Source: IMDb, Wikipedia【3】【4】
 */
export const toyStory1999Universe = new UniverseBuilder()
    .film('pixar', 'toy_story_2', 1999)
    .withRuntime(92)
    .withRealityRelation('pure_fiction', 1.0)
    .withCopyright(['The Walt Disney Company', 'Pixar Animation Studios'], 1999, 'active')
    .withCreators({
        director: ['John Lasseter', 'Lee Unkrich', 'Ash Brannon'],
        writer: [
            'Andrew Stanton',
            'Rita Hsiao',
            'Doug Chamberlin',
            'Chris Webb',
            'John Lasseter',
            'Pete Docter',
            'Ash Brannon',
        ],
    })
    .withCulturalSignificance(
        0.95,
        'Critically acclaimed sequel that deepened the franchise\'s emotional core and expanded its world-building.'
    )
    .addRuntimeKeyframe(10, 50, 'woody_stolen', 0.95, ['inciting_incident', 'kidnapping'])
    .addRuntimeKeyframe(21, 30, 'meet_the_roundup_gang', 0.9, ['character_introduction', 'lore_expansion'])
    .addRuntimeKeyframe(35, 15, 'rescue_mission_begins', 0.85, ['adventure', 'teamwork'])
    .addRuntimeKeyframe(48, 55, 'jessies_song', 1.0, ['emotional_core', 'backstory', 'montage'])
    .addRuntimeKeyframe(60, 20, 'als_toy_barn', 0.8, ['new_world', 'exploration'])
    .addRuntimeKeyframe(75, 40, 'airport_chase', 1.0, ['climax', 'action', 'rescue'])
    .addRuntimeKeyframe(86, 5, 'welcome_home', 0.9, ['resolution', 'new_family'])
    .build();

// --- Toy Story 3 (2010) ---

/**
 * Universe definition for Toy Story 3 (2010).
 *
 * A powerful and emotionally resonant conclusion to the original trilogy, this film
 * addresses the inevitable reality of growing up. The toys face their greatest challenge
 * when an older Andy prepares for college, leading them to a chaotic daycare center
 * ruled by the tyrannical Lotso Huggin' Bear. The 103-minute narrative is marked by
 * themes of mortality, letting go, and finding new purpose.
 *
 * Source: IMDb, Wikipedia【5】【6】
 */
export const toyStory2010Universe = new UniverseBuilder()
    .film('pixar', 'toy_story_3', 2010)
    .withRuntime(103)
    .withRealityRelation('pure_fiction', 1.0)
    .withCopyright(['The Walt Disney Company', 'Pixar Animation Studios'], 2010, 'active')
    .withCreators({
        director: ['Lee Unkrich'],
        writer: ['Michael Arndt', 'John Lasseter', 'Andrew Stanton', 'Lee Unkrich'],
    })
    .withCulturalSignificance(
        0.97,
        'A masterful conclusion to the trilogy, praised for its emotional depth, mature themes, and satisfying narrative closure. Won the Academy Award for Best Animated Feature.'
    )
    .addRuntimeKeyframe(12, 25, 'donated_to_sunnyside', 0.95, ['inciting_incident', 'new_world', 'abandonment'])
    .addRuntimeKeyframe(28, 10, 'meet_lotso', 0.9, ['antagonist_introduction', 'deception'])
    .addRuntimeKeyframe(45, 30, 'buzz_demo_mode', 0.85, ['conflict', 'character_change'])
    .addRuntimeKeyframe(70, 15, 'the_great_escape', 0.9, ['action', 'teamwork', 'climax_rising'])
    .addRuntimeKeyframe(86, 20, 'incinerator_scene', 1.0, ['climax', 'mortality', 'acceptance', 'unity'])
    .addRuntimeKeyframe(92, 45, 'andy_gives_toys_to_bonnie', 1.0, ['resolution', 'letting_go', 'new_beginning'])
    .addRuntimeKeyframe(98, 50, 'so_long_partner', 1.0, ['emotional_climax', 'farewell'])
    .build();

// --- Usage Example ---

/*
import { UniverseRegistry } from './core/universe-registry';
import { toyStory1995Universe, toyStory1999Universe, toyStory2010Universe } from './toy-story-universes';

// Example of how these universes might be registered and used.
// This code would typically live in an application setup file.

const registry = new UniverseRegistry();

registry.registerUniverse(toyStory1995Universe.universeId, toyStory1995Universe);
registry.registerUniverse(toyStory1999Universe.universeId, toyStory1999Universe);
registry.registerUniverse(toyStory2010Universe.universeId, toyStory2010Universe);

console.log('Registered Toy Story Trilogy Universes:', registry.listUniverseIds());

// You can now query the registry for specific moments.
const moment = registry.getTemporalPointer('pixar:toy_story_3:2010:runtime:86m20s');
console.log('Found moment:', moment?.keyframe?.id); // Outputs: 'incinerator_scene'
*/
