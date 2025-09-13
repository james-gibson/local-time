import { UniverseBuilder, createFilmUniverseId } from '../../../index';
import { CommonUniverseIds } from '../../../core/common-universe-ids';

/**
 * Die Hard (1988)
 *
 * This universe documents the 1988 action film 'Die Hard', a landmark of the genre that redefined the modern action hero. The film follows off-duty NYPD officer John McClane as he single-handedly fights a group of sophisticated thieves who have taken a Los Angeles skyscraper hostage during a Christmas party.
 *
 * 'Die Hard' is notable for its contained setting (Nakatomi Plaza), its tightly-paced narrative that unfolds over a single night, and its portrayal of a vulnerable, witty, and relatable protagonist. This was a significant departure from the invincible, muscle-bound heroes that dominated 1980s action cinema. The film's structure and premise were so influential that they spawned an entire subgenre of "Die Hard on a..." action films.
 *
 * Cultural Significance: 0.98 - A genre-defining film that revolutionized the action movie. Its influence is seen in countless subsequent films, and its protagonist, John McClane, became an archetype for a new kind of action hero. The film's status as a "Christmas movie" is a recurring cultural debate. Justification for the high rating is based on its profound and lasting impact on cinematic language and character archetypes within its genre.
 * Reality Relation: Pure Fiction with 1.0 fictionalization.
 *
 * Research Sources:
 * - IMDb, "Die Hard (1988)".
 * - Wikipedia, "Die Hard".
 * - American Film Institute (AFI) Catalog, "Die Hard".
 * - "How 'Die Hard' Rewrote the Action Movie" - The Ringer.
 *
 * Key Facts Verified:
 * - Release Date: July 15, 1988
 * - Director: John McTiernan
 * - Writers: Jeb Stuart and Steven E. de Souza
 * - Based on: "Nothing Lasts Forever" by Roderick Thorp
 *
 * Hierarchical Context: 20TH_CENTURY_FOX -> HOLLYWOOD_SYSTEM -> US_CULTURE
 * Natural Connections Discovered:
 * - Parent Context: CommonUniverseIds.HOLLYWOOD_SYSTEM (as a major studio production)
 * - Progenitor: Created the "Die Hard on a..." subgenre (e.g., 'Speed' - Die Hard on a bus, 'Air Force One' - Die Hard on a plane).
 * - Franchise Starter: The first film in the 'Die Hard' franchise.
 */
export const dieHard1988Universe = new UniverseBuilder()
    .film('20th_century_fox', 'die_hard', 1988)
    .withId(createFilmUniverseId('20th_century_fox', 'die_hard', 1988))
    .withRuntime(132)
    .withAliases(['Nakatomi Plaza Incident'])
    .withRealityRelation('pure_fiction', 1.0)
    .withCopyright(
        ['20th Century Fox', 'Gordon Company', 'Silver Pictures'],
        1988,
        'active'
    )
    .withCreators({
        director: ['John McTiernan'],
        writer: ['Jeb Stuart', 'Steven E. de Souza'],
        based_on: ['"Nothing Lasts Forever" by Roderick Thorp'],
    })
    .withCulturalSignificance(
        0.98,
        'Revolutionized the action genre by introducing a vulnerable, everyman hero and creating the "contained thriller" template.'
    )
    .addRuntimeKeyframe(
        15,
        20,
        'takeover',
        0.9,
        ['inciting_incident', 'hostage_situation', 'gruber_introduction'],
        'Hans Gruber and his team seize control of Nakatomi Plaza.'
    )
    .addRuntimeKeyframe(
        38,
        45,
        'first_kill_and_message',
        1.0,
        ['iconic_moment', 'turning_point', 'catchphrase_origin'],
        'McClane eliminates the first terrorist and sends the body down in the elevator with the message, "Now I have a machine gun. Ho-ho-ho."'
    )
    .addRuntimeKeyframe(
        54,
        10,
        'al_powell_arrives',
        0.85,
        ['character_introduction', 'ally', 'outside_contact'],
        'Sgt. Al Powell arrives to investigate the distress call, becoming McClane\'s sole link to the outside world.'
    )
    .addRuntimeKeyframe(
        105,
        30,
        'rooftop_explosion',
        0.95,
        ['action_set_piece', 'escape', 'iconic_visual'],
        'McClane escapes the C4 explosion on the roof by jumping off with a fire hose.'
    )
    .addRuntimeKeyframe(
        122,
        5,
        'gruber_falls',
        1.0,
        ['climax', 'villain_defeat', 'iconic_moment', 'catchphrase'],
        'McClane outsmarts Hans Gruber, who falls to his death from the tower, after delivering his signature line, "Yippee-ki-yay, motherfucker."'
    )
    .build();
