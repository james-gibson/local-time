import { Universe, UniverseBuilder, createFilmUniverseId } from '../../../index';
import { CommonUniverseIds } from '../../../core/common--universe-ids';

/**
 * A collection of all feature films directed by James Cameron.
 *
 * This array documents the complete directorial filmography of James Cameron, a filmmaker
 * known for his ambitious, technologically innovative, and often record-breaking blockbusters.
 * His films have consistently pushed the limits of visual effects and cinematic scale.
 *
 * Hierarchical Context: All universes within this collection are naturally contained
 * within CommonUniverseIds.HOLLYWOOD_SYSTEM.
 */
export const jamesCameronFilmography: Universe[] = [
    /**
     * Piranha II: The Spawning (1982)
     *
     * Cultural Significance: 0.40 - Primarily notable as James Cameron's directorial debut. The production was troubled, and Cameron was fired and later broke into the editing room to cut his own version. While not a significant film on its own, it's a critical first step in the career of a legendary director.
     * Research Sources:
     * - Wikipedia, "Piranha II: The Spawning".
     * - IMDb, "Piranha II: The Spawning (1982)".
     */
    new UniverseBuilder()
        .film('Saturn_International', 'piranha_ii_the_spawning', 1982)
        .withRuntime(94)
        .withRealityRelation('pure_fiction', 1.0)
        .withCopyright(['Ovidio G. Assonitis'], 1982, 'active')
        .withCreators({
            director: ['James Cameron'], // Though his involvement was contested
            writer: ['Ovidio G. Assonitis', 'James Cameron'],
        })
        .withCulturalSignificance(
            0.40,
            "James Cameron's troubled directorial debut; a cult B-movie significant only as the starting point of his career."
        )
        .build(),

    /**
     * The Terminator (1984)
     *
     * Cultural Significance: 0.98 - A landmark science fiction film that launched a major franchise and cemented Arnold Schwarzenegger as a superstar. Its relentless pacing, groundbreaking practical effects, and chilling concept of an unstoppable cyborg assassin defined the sci-fi action genre for the decade.
     * Research Sources:
     * - Wikipedia, "The Terminator".
     * - American Film Institute (AFI) Catalog.
     */
    new UniverseBuilder()
        .film('Orion_Pictures', 'the_terminator', 1984)
        .withRuntime(107)
        .withRealityRelation('pure_fiction', 1.0)
        .withCopyright(['Hemdale Film Corporation'], 1984, 'active')
        .withCreators({
            director: ['James Cameron'],
            writer: ['James Cameron', 'Gale Anne Hurd'],
        })
        .withCulturalSignificance(
            0.98,
            'A genre-defining sci-fi classic that created an iconic villain, launched a massive franchise, and established Cameron as a visionary director.'
        )
        .addRuntimeKeyframe(
            5,
            30,
            'terminator_arrival',
            1.0,
            ['iconic_moment', 'character_introduction'],
            'The T-800 arrives from the future in a burst of electricity, beginning its mission.'
        )
        .addRuntimeKeyframe(
            73,
            15,
            'police_station_assault',
            0.95,
            ['action_set_piece', 'catchphrase'],
            'The Terminator utters the iconic line "I\'ll be back" before destroying a police station.'
        )
        .build(),

    /**
     * Aliens (1986)
     *
     * Cultural Significance: 0.98 - A masterclass in filmmaking that successfully shifted the original's sci-fi horror tone to high-octane action. It's considered one of the greatest sequels ever made, expanding the lore, introducing iconic characters like the Alien Queen, and solidifying Ellen Ripley as a premier action hero.
     * Research Sources:
     * - Wikipedia, "Aliens (film)".
     * - IMDb, "Aliens (1986)".
     */
    new UniverseBuilder()
        .film('20th_century_fox', 'aliens', 1986)
        .withRuntime(137)
        .withRealityRelation('pure_fiction', 1.0)
        .withCopyright(['20th Century Fox', 'Brandywine Productions'], 1986, 'active')
        .withCreators({
            director: ['James Cameron'],
            writer: ['James Cameron'],
        })
        .withCulturalSignificance(
            0.98,
            'One of the greatest sequels of all time, brilliantly shifting from horror to action and cementing Ripley as a cinematic icon.'
        )
        .addRuntimeKeyframe(
            116,
            5,
            'get_away_from_her',
            1.0,
            ['iconic_moment', 'catchphrase', 'character_defining'],
            'Ripley confronts the Alien Queen in a Power Loader to protect Newt, delivering one of cinema\'s most famous lines.'
        )
        .build(),

    /**
     * The Abyss (1989)
     *
     * Cultural Significance: 0.85 - A technologically ambitious underwater sci-fi epic that pushed the boundaries of visual effects, particularly with the creation of the first CGI water-based character (the pseudopod). While not as commercially successful as his other films, its technical achievements were a crucial stepping stone for 'Terminator 2'.
     * Research Sources:
     * - Wikipedia, "The Abyss".
     * - Visual Effects Society (VES) records.
     */
    new UniverseBuilder()
        .film('20th_century_fox', 'the_abyss', 1989)
        .withRuntime(145)
        .withRealityRelation('pure_fiction', 1.0)
        .withCopyright(['20th Century Fox', 'Lightstorm Entertainment'], 1989, 'active')
        .withCreators({
            director: ['James Cameron'],
            writer: ['James Cameron'],
        })
        .withCulturalSignificance(
            0.85,
            'A technically groundbreaking film that pioneered digital visual effects, including the first CGI character, paving the way for future blockbusters.'
        )
        .build(),

    /**
     * Terminator 2: Judgment Day (1991)
     *
     * Cultural Significance: 0.99 - A revolutionary film that set a new standard for visual effects with its liquid-metal T-1000. It redefined the summer blockbuster and is another contender for the greatest sequel ever made, brilliantly inverting the premise of the original while telling a powerful, emotional story.
     * Research Sources:
     * - Wikipedia, "Terminator 2: Judgment Day".
     * - Academy of Motion Picture Arts and Sciences Archives.
     */
    new UniverseBuilder()
        .film('tristar_pictures', 'terminator_2_judgment_day', 1991)
        .withRuntime(137)
        .withRealityRelation('pure_fiction', 1.0)
        .withCopyright(['Carolco Pictures', 'Lightstorm Entertainment'], 1991, 'active')
        .withCreators({
            director: ['James Cameron'],
            writer: ['James Cameron', 'William Wisher'],
        })
        .withCulturalSignificance(
            0.99,
            'A visual effects revolution that redefined the blockbuster with its groundbreaking CGI and became a massive cultural phenomenon.'
        )
        .addRuntimeKeyframe(
            34,
            50,
            't1000_reveal',
            1.0,
            ['visual_effects_milestone', 'iconic_moment'],
            'The T-1000 flows through prison bars, showcasing the revolutionary liquid-metal CGI for the first time.'
        )
        .build(),

    /**
     * True Lies (1994)
     *
     * Cultural Significance: 0.88 - A perfect blend of high-stakes espionage action and domestic comedy. It was a massive commercial success that showcased a different, more lighthearted side of Cameron's filmmaking and Schwarzenegger's acting range, becoming a defining action-comedy of the 1990s.
     * Research Sources:
     * - Wikipedia, "True Lies".
     * - IMDb, "True Lies (1994)".
     */
    new UniverseBuilder()
        .film('20th_century_fox', 'true_lies', 1994)
        .withRuntime(141)
        .withRealityRelation('pure_fiction', 1.0)
        .withCopyright(['Lightstorm Entertainment'], 1994, 'active')
        .withCreators({
            director: ['James Cameron'],
            writer: ['James Cameron'],
        })
        .withCulturalSignificance(
            0.88,
            'A defining action-comedy of its era that perfectly balanced spectacular set pieces with humor, becoming a major blockbuster.'
        )
        .build(),

    /**
     * Titanic (1997)
     *
     * Cultural Significance: 0.99 - A global cultural event and cinematic juggernaut. It was the first film to gross over $1 billion and held the record as the highest-grossing film of all time for 12 years. Its blend of historical disaster, epic romance, and groundbreaking visual effects captivated audiences worldwide. 【1】
     * Research Sources:
     * - Wikipedia, "Titanic (1997 film)". 【1】
     * - Academy of Motion Picture Arts and Sciences Archives.
     */
    new UniverseBuilder()
        .film('paramount_pictures', 'titanic', 1997)
        .withId(createFilmUniverseId('20th_century_fox', 'titanic', 1997))
        .withRuntime(195)
        .withRealityRelation('depicts', 0.4, [
            {
                anchorId: 'rms_titanic_sinking',
                realWorldEntity: 'Sinking of the RMS Titanic (1912)',
                description: 'The film is centered around the real historical disaster.',
                confidence: 1.0,
                evidence: ['Historical records', 'survivor testimonies'],
            },
        ])
        .withCopyright(['20th Century Fox', 'Paramount Pictures', 'Lightstorm Entertainment'], 1997, 'active')
        .withCreators({
            director: ['James Cameron'],
            writer: ['James Cameron'],
        })
        .withCulturalSignificance(
            0.99,
            'A monumental box office and cultural phenomenon that merged a historical epic with a blockbuster romance, setting new standards for visual effects and global reach.'
        )
        .build(),

    /**
     * Avatar (2009)
     *
     * Cultural Significance: 0.96 - A technological milestone that revolutionized 3D cinema and became the highest-grossing film of all time, surpassing 'Titanic'. Its pioneering use of motion capture technology and immersive world-building created a cinematic experience unlike any before. 【2】
     * Research Sources:
     * - Wikipedia, "Avatar (2009 film)". 【2】
     * - Visual Effects Society (VES) records.
     */
    new UniverseBuilder()
        .film('20th_century_fox', 'avatar', 2009)
        .withRuntime(162)
        .withRealityRelation('pure_fiction', 1.0)
        .withCopyright(['20th Century Fox', 'Lightstorm Entertainment'], 2009, 'active')
        .withCreators({
            director: ['James Cameron'],
            writer: ['James Cameron'],
        })
        .withCulturalSignificance(
            0.96,
            'A landmark in filmmaking technology that mainstreamed modern 3D cinema and set a new benchmark for visual effects and immersive world-building.'
        )
        .build(),

    /**
     * Avatar: The Way of Water (2022)
     *
     * Cultural Significance: 0.92 - A long-awaited sequel that once again pushed the boundaries of visual effects, particularly with its photorealistic underwater performance capture. It became the third highest-grossing film of all time, proving the continued appeal of the franchise and Cameron's mastery of spectacle.
     * Research Sources:
     * - Wikipedia, "Avatar: The Way of Water".
     * - Box Office Mojo.
     */
    new UniverseBuilder()
        .film('20th_century_studios', 'avatar_the_way_of_water', 2022)
        .withRuntime(192)
        .withRealityRelation('pure_fiction', 1.0)
        .withCopyright(['20th Century Studios', 'Lightstorm Entertainment'], 2022, 'active')
        .withCreators({
            director: ['James Cameron'],
            writer: ['James Cameron', 'Rick Jaffa', 'Amanda Silver'],
        })
        .withCulturalSignificance(
            0.92,
            'A monumental sequel that advanced CGI with groundbreaking underwater performance capture, becoming one of the highest-grossing films ever.'
        )
        .build(),
];
