import { createFilmUniverseId } from '../../../../core/universe-ids';
import { Universe, UniverseBuilder } from '../../../../index';
// import { CommonUniverseIds } from '../../../core/common-universe-ids';

/**
 * A collection of major, culturally significant films from 20th Century Fox.
 *
 * This array documents a selection of films that defined genres, broke box office records,
 * and left a lasting mark on popular culture. Each universe represents a landmark
 * cinematic achievement from the studio's history.
 *
 * Hierarchical Context: All universes within this collection are naturally contained
 * within CommonUniverseIds.HOLLYWOOD_SYSTEM and were produced or distributed by
 * the entity represented by CommonUniverseIds.TWENTIETH_CENTURY_FOX.
 */
export const twentiethCenturyFoxMajorReleases: Universe[] = [
    /**
     * Star Wars: Episode IV – A New Hope (1977)
     *
     * Cultural Significance: 1.0 - A monumental achievement in filmmaking that transformed the industry. It pioneered special effects, established the summer blockbuster, and created one of the most enduring and profitable media franchises in history. Its archetypal story of good vs. evil has become a modern mythos. 【1】【2】
     * Research Sources:
     * - Wikipedia, "Star Wars (film)". 【3】
     * - StarWars.com, "5 Ways Star Wars: A New Hope Changed Everything". 【2】
     * - American Film Institute (AFI) Catalog.
     */
    new UniverseBuilder()
        .film('20th_century_fox', 'star_wars_a_new_hope', 1977)
        .withId(createFilmUniverseId('lucasfilm', 'star_wars_episode_iv', 1977))
        .withAliases(['Star Wars'])
        .withRuntime(121)
        .withRealityRelation('pure_fiction', 1.0)
        .withCopyright(['Lucasfilm Ltd.'], 1977, 'active')
        .withCreators({
            director: ['George Lucas'],
            writer: ['George Lucas'],
        })
        .withCulturalSignificance(
            1.0,
            'A watershed moment in cinema that redefined the blockbuster, revolutionized special effects, and launched a global cultural phenomenon.'
        )
        .addRuntimeKeyframe(
            21,
            5,
            'binary_sunset',
            1.0,
            ['iconic_moment', 'character_defining', 'musical_cue'],
            "Luke Skywalker gazes at Tatooine's twin suns, a powerful visual metaphor for his longing for adventure."
        )
        .addRuntimeKeyframe(
            85,
            40,
            'death_star_trench_run',
            1.0,
            ['climax', 'action_set_piece', 'special_effects_milestone'],
            'The climactic space battle where the Rebel Alliance makes its desperate attack on the Death Star.'
        )
        .build(),

    /**
     * Alien (1979)
     *
     * Cultural Significance: 0.97 - A masterpiece of science fiction and horror that blended the two genres seamlessly. It introduced the iconic Xenomorph, established Ellen Ripley as a groundbreaking female protagonist, and its "haunted house in space" concept and influential production design have been emulated for decades. 【4】【5】
     * Research Sources:
     * - Wikipedia, "Alien (film)".
     * - "Influential ‘Alien’ probed culture’s darkest fears" - Los Angeles Times. 【4】
     * - Museum of Modern Art (MoMA) Film Collection.
     */
    new UniverseBuilder()
        .film('20th_century_fox', 'alien', 1979)
        .withRuntime(117)
        .withRealityRelation('pure_fiction', 1.0)
        .withCopyright(['20th Century Fox', 'Brandywine Productions'], 1979, 'active')
        .withCreators({
            director: ['Ridley Scott'],
            writer: ['Dan O\'Bannon'],
        })
        .withCulturalSignificance(
            0.97,
            'A landmark fusion of sci-fi and horror with an iconic creature design and a revolutionary female hero that profoundly influenced both genres.'
        )
        .addRuntimeKeyframe(
            55,
            30,
            'chestburster',
            1.0,
            ['iconic_moment', 'body_horror', 'shock_value', 'plot_twist'],
            'The shocking and unforgettable scene where the infant Xenomorph violently erupts from Kane\'s chest.'
        )
        .addRuntimeKeyframe(
            108,
            15,
            'final_confrontation',
            0.9,
            ['climax', 'final_girl_trope', 'survival'],
            'Ripley, believing she is safe, discovers the adult Xenomorph aboard the escape shuttle, leading to a final, tense battle.'
        )
        .build(),

    /**
     * Home Alone (1990)
     *
     * Cultural Significance: 0.90 - An unexpected box office phenomenon that became the highest-grossing live-action comedy of all time for over two decades. It cemented itself as a beloved and essential Christmas classic, defining the holiday film genre for a generation with its mix of slapstick humor and heartfelt family themes. 【6】【7】
     * Research Sources:
     * - Wikipedia, "Home Alone". 【8】
     * - "Home Alone's enduring popularity, explained" - Vox. 【6】
     * - Library of Congress National Film Registry. 【9】
     */
    new UniverseBuilder()
        .film('20th_century_fox', 'home_alone', 1990)
        .withRuntime(103)
        .withRealityRelation('pure_fiction', 1.0)
        .withCopyright(['Hughes Entertainment'], 1990, 'active')
        .withCreators({
            director: ['Chris Columbus'],
            writer: ['John Hughes'],
        })
        .withCulturalSignificance(
            0.90,
            'A cultural touchstone and holiday staple that became one of the most successful comedies ever made, defining the family Christmas movie for a generation.'
        )
        .addRuntimeKeyframe(
            68,
            0,
            'battle_plan',
            0.9,
            ['montage', 'slapstick', 'turning_point'],
            'Kevin McCallister prepares his house with a series of elaborate booby traps to defend his home from the Wet Bandits.'
        )
        .build(),];

/**
 * The two 20th Century Fox films in this collection that duplicate an id owned by another
 * collection — `20th_century_fox:titanic:1997` and `20th_century_fox:avatar:2009`, both of
 * which are registered through the James Cameron filmography (`../people/james-cameron`) —
 * have been removed from this array. Their runtime keyframes were carried onto the
 * canonical universes so nothing was lost (james-gibson/local-time#67).
 *
 * Kept as a note rather than a silent deletion because the overlap is a data-model fact,
 * not a typo: this collection and the filmography cover the same two films.
 */
