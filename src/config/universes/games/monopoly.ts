import { UniverseBuilder,TimePrecision } from '../../../index';

/**
 * Universe definition for 'Monopoly Night', a fictional event within the Toy Story universe.
 *
 * This universe documents a speculative, in-character game of Monopoly played by
 * Andy's toys. It is structured as a 90-minute narrative event, capturing the
 * personalities and interactions of the characters through the lens of a classic
 * board game. The timeline maps the progression of the game from optimistic start
 * to its chaotic, character-driven conclusion. This is treated as a fictional "short"
 * that could exist between the major films.
 */
export const toyStoryMonopolyNightUniverse = new UniverseBuilder()
    // Using 'fictional_short' to denote a non-canon, speculative event.
    .film('pixar', 'toy_story_fictional_short', 2005, 'monopoly_night')
    .withRuntime(90) // A 90-minute game session.
    .withRealityRelation('pure_fiction', 1.0)
    .withCopyright(
        ['The Walt Disney Company', 'Pixar Animation Studios'],
        2005,
        'active'
    )
    .withCreators({
        // The participants of the game are the "creators" of this event.
        participant: ['Woody', 'Buzz Lightyear', 'Hamm', 'Mr. Potato Head', 'Rex'],
    })
    .withCulturalSignificance(
        0.1,
        'A fictional narrative exercise exploring character dynamics within the Toy Story universe.'
    )
    // The game begins, with everyone starting with their initial cash.
    .addRuntimeKeyframe(2, 15, 'game_setup_and_start', 0.8, ['game_start', 'exposition'])
    // Hamm, the piggy bank, quickly acquires the first set of properties.
    .addRuntimeKeyframe(15, 30, 'hamm_acquires_light_blues', 0.85, [
        'transaction',
        'strategy',
        'character_moment',
        'hamm',
    ])
    // Mr. Potato Head gets angry after landing on an opponent's property for the first time.
    .addRuntimeKeyframe(25, 10, 'potato_head_pays_rent', 0.9, [
        'conflict',
        'character_moment',
        'mr_potato_head',
    ])
    // Buzz attempts a complex, multi-property trade with Woody, citing strategic logic.
    .addRuntimeKeyframe(40, 50, 'buzz_proposes_trade', 0.9, [
        'negotiation',
        'strategy',
        'buzz_lightyear',
        'woody',
    ])
    // Rex, with his characteristic anxiety, lands on Boardwalk with a hotel.
    .addRuntimeKeyframe(65, 20, 'rex_bankrupted_by_boardwalk', 1.0, [
        'climax',
        'character_moment',
        'game_over_rex',
        'rex',
    ])
    // Mr. Potato Head loses his temper dramatically, scattering his own pieces.
    .addRuntimeKeyframe(75, 5, 'potato_head_rage_quits', 1.0, [
        'climax',
        'conflict',
        'game_over_potato_head',
        'mr_potato_head',
    ])
    // The final showdown between the remaining players.
    .addRuntimeKeyframe(88, 0, 'hamm_wins_by_attrition', 0.95, [
        'resolution',
        'game_winner',
        'hamm',
    ])
    .build();

// --- Usage Example ---

/*
import { UniverseRegistry } from './core/universe-registry';
import { toyStoryMonopolyNightUniverse } from './toy-story-monopoly-universe';

// Example of how this universe might be registered and used.
const registry = new UniverseRegistry();

registry.registerUniverse(toyStoryMonopolyNightUniverse.universeId, toyStoryMonopolyNightUniverse);

console.log('Registered Fictional Event:', registry.getUniverse(toyStoryMonopolyNightUniverse.universeId)?.universeId.toString());

// You can now query the registry for specific moments in the game.
const dramaticMoment = registry.getTemporalPointer('pixar:toy_story_fictional_short:2005:monopoly_night:runtime:65m20s');
console.log('Found key moment:', dramaticMoment?.keyframe?.id); // Outputs: 'rex_bankrupted_by_boardwalk'
*/
