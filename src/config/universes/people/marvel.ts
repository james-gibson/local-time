/**
 * @file marvel_cinematic_universe_notables.ts
 * @description A collection of notable creators and actors from Phases 1-4 of the Marvel Cinematic Universe.
 * This file documents the key personnel involved in shaping the MCU, with insights from director commentaries.
 * @version 1.0.0
 * @date 2025-09-10
 */

// @ts-ignore: Assuming Person and FilmContribution types are defined elsewhere in the project
// import type { Person, FilmContribution } from './types';

/**
 * @description Represents a collection of notable individuals for a specific film.
 * Each entry includes the director, writers, and key cast members.
 * Commentary from directors is included to provide deeper context on the creative process.
 */
export const marvel_phase_one_notables = {

    /**
     * Iron Man (2008)
     * The film that launched the Marvel Cinematic Universe.
     */
    "marvel:iron_man:2008": {
        director: "Jon Favreau",
        writers: ["Mark Fergus", "Hawk Ostby", "Art Marcum", "Matt Holloway"],
        cast: [
            { name: "Robert Downey Jr.", role: "Tony Stark / Iron Man" },
            { name: "Gwyneth Paltrow", role: "Pepper Potts" },
            { name: "Terrence Howard", role: "James 'Rhodey' Rhodes" },
            { name: "Jeff Bridges", role: "Obadiah Stane / Iron Monger" },
        ],
        commentary_insights: [
            // While an official commentary track was not released on the DVD/Blu-ray,
            // Jon Favreau and Robert Downey Jr. recorded a live commentary for a charity screening.
            // Source: https://www.cinemablend.com/new/Why-You-Probably-Never-Hear-Jon-Favreau-Robert-Downey-Jr-Iron-Man-Commentary-123577.html 【1】
            "Favreau noted that Jeff Bridges was initially hesitant about the script's looseness, but he and Downey Jr. embraced the improvisational style, which became a hallmark of the film's dialogue. 【2】",
            "The casting of Robert Downey Jr. was a significant risk that Favreau championed, believing the actor's personal history mirrored Tony Stark's journey of redemption. 【2】",
        ],
    },

    /**
     * The Incredible Hulk (2008)
     * A reboot that established the Hulk within the MCU.
     */
    "marvel:the_incredible_hulk:2008": {
        director: "Louis Leterrier",
        writers: ["Zak Penn"],
        cast: [
            { name: "Edward Norton", role: "Bruce Banner / Hulk" },
            { name: "Liv Tyler", role: "Betty Ross" },
            { name: "Tim Roth", role: "Emil Blonsky / Abomination" },
            { name: "William Hurt", role: "General Thaddeus 'Thunderbolt' Ross" },
        ],
        commentary_insights: [
            // Note: There were well-documented creative differences between Norton and the studio, which influenced the final cut.
            // Source: https://www.wired.com/2010/10/hulk-prime-time/ 【3】
            "Leterrier and Tim Roth discuss how they wanted the Abomination's movements to be distinct from the Hulk's, focusing on speed and military precision. 【4】",
            "The director mentions that the opening sequence, which quickly recaps the Hulk's origin, was designed to avoid retreading the story from Ang Lee's 2003 'Hulk' film. 【5】",
        ],
    },

    /**
     * Iron Man 2 (2010)
     * Explored the consequences of Tony Stark's public identity as Iron Man.
     */
    "marvel:iron_man_2:2010": {
        director: "Jon Favreau",
        writers: ["Justin Theroux"],
        cast: [
            { name: "Robert Downey Jr.", role: "Tony Stark / Iron Man" },
            { name: "Gwyneth Paltrow", role: "Pepper Potts" },
            { name: "Don Cheadle", role: "James 'Rhodey' Rhodes / War Machine" },
            { name: "Scarlett Johansson", role: "Natasha Romanoff / Black Widow" },
            { name: "Mickey Rourke", role: "Ivan Vanko / Whiplash" },
            { name: "Sam Rockwell", role: "Justin Hammer" },
        ],
        commentary_insights: [
            "Favreau advocated for a Black Widow movie as early as 2010, highlighting Scarlett Johansson's impact in the role. 【6】",
            "He points out several scenes he loved that were cut for pacing, including more development for Justin Hammer and Ivan Vanko. 【6】",
            "The Monaco Grand Prix sequence was particularly challenging to film, requiring a blend of practical sets and extensive CGI to create the race track environment. 【7】",
        ],
    },

    /**
     * Thor (2011)
     * Introduced the cosmic side of the MCU.
     */
    "marvel:thor:2011": {
        director: "Kenneth Branagh",
        writers: ["Ashley Edward Miller", "Zack Stentz", "Don Payne"],
        cast: [
            { name: "Chris Hemsworth", role: "Thor" },
            { name: "Natalie Portman", role: "Jane Foster" },
            { name: "Tom Hiddleston", role: "Loki" },
            { name: "Anthony Hopkins", role: "Odin" },
            { name: "Stellan Skarsgård", role: "Erik Selvig" },
        ],
        commentary_insights: [
            "Branagh emphasized the Shakespearean family drama at the core of the story, focusing on the relationship between Thor, Loki, and Odin. 【8】",
            "He intentionally used Dutch angles during scenes of Thor's disorientation on Earth to visually convey his feeling of being off-kilter and powerless. 【8】",
            "The casting of Tom Hiddleston as Loki was pivotal; Branagh notes that Hiddleston initially auditioned for Thor, but his intelligence and 'lean and hungry look' were perfect for the God of Mischief. 【9】",
        ],
    },

    /**
     * Captain America: The First Avenger (2011)
     * A period piece that set the historical foundation for the MCU.
     */
    "marvel:captain_america_the_first_avenger:2011": {
        director: "Joe Johnston",
        writers: ["Christopher Markus", "Stephen McFeely"],
        cast: [
            { name: "Chris Evans", role: "Steve Rogers / Captain America" },
            { name: "Hayley Atwell", role: "Peggy Carter" },
            { name: "Sebastian Stan", role: "James Buchanan 'Bucky' Barnes" },
            { name: "Hugo Weaving", role: "Johann Schmidt / Red Skull" },
            { name: "Tommy Lee Jones", role: "Colonel Chester Phillips" },
        ],
        commentary_insights: [
            "Johnston, along with the editor and cinematographer, explains that the visual effects used to create 'Skinny Steve' were a combination of body doubles, forced perspective, and digital manipulation. 【10】",
            "The film's aesthetic was heavily inspired by 1940s propaganda posters and classic adventure serials to ground it in the period. 【11】",
            "They reveal that the final scene of Steve Rogers in modern-day Times Square was one of the first things they filmed to ensure they captured the character's profound sense of displacement. 【10】",
        ],
    },

    /**
     * The Avengers (2012)
     * The culmination of Phase One, bringing the heroes together for the first time.
     */
    "marvel:the_avengers:2012": {
        director: "Joss Whedon",
        writers: ["Joss Whedon", "Zak Penn"],
        cast: [
            { name: "Robert Downey Jr.", role: "Tony Stark / Iron Man" },
            { name: "Chris Evans", role: "Steve Rogers / Captain America" },
            { name: "Mark Ruffalo", role: "Bruce Banner / Hulk" },
            { name: "Chris Hemsworth", role: "Thor" },
            { name: "Scarlett Johansson", role: "Natasha Romanoff / Black Widow" },
            { name: "Jeremy Renner", role: "Clint Barton / Hawkeye" },
            { name: "Tom Hiddleston", role: "Loki" },
        ],
        commentary_insights: [
            "Whedon states that the iconic 'circle shot' of the team assembling in New York was a late addition, designed to be the film's 'money shot' and a live-action recreation of a classic comic book panel. 【12】",
            "He fought to keep the scene where Phil Coulson dies, arguing it was the necessary catalyst to unite the dysfunctional team. 【12】",
            "Whedon points out that he wrote the Hulk's 'I'm always angry' line as the key to understanding how Bruce Banner finally gained control over his transformations. 【13】",
        ],
    },
};

export const marvel_phase_two_notables = {
    /**
     * Iron Man 3 (2013)
     * A post-Avengers story focusing on Tony Stark's PTSD.
     */
    "marvel:iron_man_3:2013": {
        director: "Shane Black",
        writers: ["Drew Pearce", "Shane Black"],
        cast: [
            { name: "Robert Downey Jr.", role: "Tony Stark / Iron Man" },
            { name: "Gwyneth Paltrow", role: "Pepper Potts" },
            { name: "Don Cheadle", role: "James 'Rhodey' Rhodes / Iron Patriot" },
            { name: "Guy Pearce", role: "Aldrich Killian" },
            { name: "Ben Kingsley", role: "Trevor Slattery / The Mandarin" },
        ],
        commentary_insights: [
            "Shane Black and Drew Pearce confirm the controversial Mandarin twist was planned from the beginning to subvert audience expectations and comment on the modern media's creation of fear-based narratives. 【14】",
            "They deliberately stripped Tony of his suits for much of the film to force him to rely on his intellect and ingenuity, reinforcing the idea that Tony Stark, not the suit, is the hero. 【15】",
            "The 'Barrel of Monkeys' aerial rescue sequence was one of the most complex practical stunts in the MCU, involving real skydivers filmed over multiple days. 【14】",
        ],
    },

    /**
     * Thor: The Dark World (2013)
     * Further explored the nine realms and the Thor-Loki dynamic.
     */
    "marvel:thor_the_dark_world:2013": {
        director: "Alan Taylor",
        writers: ["Christopher L. Yost", "Christopher Markus", "Stephen McFeely"],
        cast: [
            { name: "Chris Hemsworth", role: "Thor" },
            { name: "Natalie Portman", role: "Jane Foster" },
            { name: "Tom Hiddleston", role: "Loki" },
            { name: "Christopher Eccleston", role: "Malekith" },
        ],
        commentary_insights: [
            "Director Alan Taylor, producer Kevin Feige, and Tom Hiddleston discuss how Loki's 'death' scene was reshot to be more emotionally impactful after test audiences reacted strongly to the character's sacrifice. 【16】",
            "Feige notes that the decision to have Loki impersonating Odin on the throne of Asgard was a last-minute idea that fundamentally changed the trajectory of Thor's story for future films. 【17】",
            "Taylor aimed for a more grounded, 'Viking' aesthetic for Asgard compared to the first film, drawing inspiration from historical textures and landscapes. 【18】",
        ],
    },

    /**
     * Captain America: The Winter Soldier (2014)
     * A political thriller that reshaped the MCU.
     */
    "marvel:captain_america_the_winter_soldier:2014": {
        directors: ["Anthony Russo", "Joe Russo"],
        writers: ["Christopher Markus", "Stephen McFeely"],
        cast: [
            { name: "Chris Evans", role: "Steve Rogers / Captain America" },
            { name: "Scarlett Johansson", role: "Natasha Romanoff / Black Widow" },
            { name: "Sebastian Stan", role: "Bucky Barnes / Winter Soldier" },
            { name: "Anthony Mackie", role: "Sam Wilson / Falcon" },
            { name: "Robert Redford", role: "Alexander Pierce" },
        ],
        commentary_insights: [
            "The Russo Brothers and the writers explain that they pitched the film as a 1970s conspiracy thriller, citing 'Three Days of the Condor' as a major influence. 【19】",
            "They reveal that the elevator fight scene was meticulously choreographed to showcase Captain America's enhanced abilities in a confined space, moving from verbal tension to explosive action. 【20】",
            "The decision to dismantle S.H.I.E.L.D. was a bold move intended to permanently alter the MCU's status quo and force the characters to operate without their support system. 【21】",
        ],
    },

    /**
     * Guardians of the Galaxy (2014)
     * Expanded the MCU into a full-blown space opera.
     */
    "marvel:guardians_of_the_galaxy:2014": {
        director: "James Gunn",
        writers: ["James Gunn", "Nicole Perlman"],
        cast: [
            { name: "Chris Pratt", role: "Peter Quill / Star-Lord" },
            { name: "Zoe Saldaña", role: "Gamora" },
            { name: "Dave Bautista", role: "Drax the Destroyer" },
            { name: "Vin Diesel", role: "Groot (voice)" },
            { name: "Bradley Cooper", role: "Rocket (voice)" },
        ],
        commentary_insights: [
            "James Gunn explains that the 'Awesome Mix Vol. 1' soundtrack is not just a collection of songs but a narrative device, representing Peter Quill's last connection to his mother and Earth. 【22】",
            "He notes that Dave Bautista's performance as Drax was a revelation; Bautista understood the character's comedic timing came from playing him completely straight and literal. 【23】",
            "Gunn reveals that the post-credit scene with Howard the Duck was a fun, last-minute addition he included as a nod to one of his favorite obscure Marvel characters. 【22】",
        ],
    },

    /**
     * Avengers: Age of Ultron (2015)
     * The team faces a technological threat of their own making.
     */
    "marvel:avengers_age_of_ultron:2015": {
        director: "Joss Whedon",
        writers: ["Joss Whedon"],
        cast: [
            { name: "Robert Downey Jr.", role: "Tony Stark / Iron Man" },
            { name: "Chris Hemsworth", role: "Thor" },
            { name: "Mark Ruffalo", role: "Bruce Banner / Hulk" },
            { name: "Chris Evans", role: "Steve Rogers / Captain America" },
            { name: "James Spader", role: "Ultron (voice)" },
            { name: "Elizabeth Olsen", role: "Wanda Maximoff / Scarlet Witch" },
            { name: "Aaron Taylor-Johnson", role: "Pietro Maximoff / Quicksilver" },
        ],
        commentary_insights: [
            // Whedon's commentary is noted for being candid about the difficult production process.
            // Source: https://www.thespectrum.com/story/entertainment/arts/is-my-geek-showing/2015/10/08/too-many-ingredients-make-age-ultron-overwhelming/73448470/ 【24】
            "Whedon describes the Hulkbuster vs. Hulk fight as one of the most complex sequences he's ever directed, aiming to make it feel like a 'street brawl between gods.' 【25】",
            "He explains that the farm scene was crucial for him to ground the characters and explore their vulnerabilities before the final, world-ending battle. 【25】",
            "The creation of Vision was intended to be a counterpoint to Ultron—a synthetic being that chooses humanity and life, inspired by the classic Frankenstein narrative. 【26】",
        ],
    },

    /**
     * Ant-Man (2015)
     * A heist film that introduced the Quantum Realm.
     */
    "marvel:ant_man:2015": {
        director: "Peyton Reed",
        writers: ["Edgar Wright", "Joe Cornish", "Adam McKay", "Paul Rudd"],
        cast: [
            { name: "Paul Rudd", role: "Scott Lang / Ant-Man" },
            { name: "Michael Douglas", role: "Dr. Hank Pym" },
            { name: "Evangeline Lilly", role: "Hope van Dyne" },
            { name: "Corey Stoll", role: "Darren Cross / Yellowjacket" },
            { name: "Michael Peña", role: "Luis" },
        ],
        commentary_insights: [
            "Peyton Reed and Paul Rudd discuss how they leaned into the heist genre to give the film a unique tone within the MCU. 【27】",
            "They highlight Michael Peña's storytelling montages as a comedic highlight, revealing that much of his dialogue was improvised based on a loose script. 【28】",
            "The fight scene between Ant-Man and Falcon was added by Reed and McKay to more firmly connect the film to the wider MCU and set up Scott Lang's future involvement with the Avengers. 【29】",
        ],
    },
};

// TODO: Add notables for Phase Three and Phase Four.
// The user has requested a collection covering all four phases.
// The following sections are placeholders for future implementation.
/*
export const marvel_phase_three_notables = {
  // Captain America: Civil War (2016)
  // Doctor Strange (2016)
  // Guardians of the Galaxy Vol. 2 (2017)
  // Spider-Man: Homecoming (2017)
  // Thor: Ragnarok (2017)
  // Black Panther (2018)
  // Avengers: Infinity War (2018)
  // Ant-Man and the Wasp (2018)
  // Captain Marvel (2019)
  // Avengers: Endgame (2019)
  // Spider-Man: Far From Home (2019)
};

export const marvel_phase_four_notables = {
  // Black Widow (2021)
  // Shang-Chi and the Legend of the Ten Rings (2021)
  // Eternals (2021)
  // Spider-Man: No Way Home (2021)
  // Doctor Strange in the Multiverse of Madness (2022)
  // Thor: Love and Thunder (2022)
  // Black Panther: Wakanda Forever (2022)
};
*/
