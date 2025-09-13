import { UniverseBuilder,  } from '../../../index';
// Assuming the existence of enums and types from the core system.
// When implementing, ensure these paths are correct.
// import { TimePrecision, UniverseType, RealityRelationType } from '../../../temporal-system';

/**
 * # Marvel Cinematic Universe - The Infinity Saga & The Start of Phase Four
 *
 * This file contains the universe definitions for the films and series that constitute
 * Phases 1, 2, and 3 (The Infinity Saga) of the Marvel Cinematic Universe, plus the
 * first entry of Phase 4, WandaVision.
 *
 * Each universe is defined with its temporal properties, creative attribution, and
 * documented cross-universe references (easter eggs) that connect the properties
 * into a cohesive narrative network.
 */

// --- Phase One: The Avengers Assembled ---

import {createFilmUniverseId} from '../../../core/universe-ids';

/**
 * ## Iron Man (2008)
 * The film that launched the Marvel Cinematic Universe. It established the tone,
 * introduced core character Tony Stark, and pioneered the post-credit scene as a
 * tool for universe-building.
 *
 * ### Notable Easter Eggs & Connections:
 * - **Captain America's Shield**: A prototype of the shield is visible on Tony Stark's workbench. 【1】
 * - **The Ten Rings**: The terrorist organization that captures Stark is a direct reference to the Mandarin's organization from the comics.
 * - **S.H.I.E.L.D.**: Agent Phil Coulson's presence introduces the Strategic Homeland Intervention, Enforcement and Logistics Division.
 * - **Post-Credit Scene**: Nick Fury (Samuel L. Jackson) appears to discuss the "Avenger Initiative," the first explicit step toward a shared universe. 【2】
 */
export const ironMan2008Universe = new UniverseBuilder()
    .film('marvel_studios', 'Iron Man', 2008)
    .withId(createFilmUniverseId('marvel_studios', 'iron_man', 2008))
    .withRuntime(126)
    .withRealityRelation('historical_fiction', 0.9)
    .withCopyright(['Marvel Studios', 'The Walt Disney Company'], 2008, 'active')
    .withCreators({ director: ['Jon Favreau'], writer: ['Mark Fergus', 'Hawk Ostby', 'Art Marcum', 'Matt Holloway'] })
    .withCulturalSignificance(0.95)
    .build();

/**
 * ## The Incredible Hulk (2008)
 * Reintroduced Bruce Banner to audiences, focusing on his struggle as a fugitive.
 * While tonally different from later MCU entries, it firmly established Hulk's
 * place in the universe.
 *
 * ### Notable Easter Eggs & Connections:
 * - **Super Soldier Program**: The program that created the Hulk is explicitly linked to the one that created Captain America.
 * - **Stark Industries**: The company's logo is seen on the sonic cannons used by General Ross.
 * - **Post-Credit Scene**: Tony Stark approaches General Thaddeus "Thunderbolt" Ross, directly connecting this film to `Iron Man` and confirming they are "putting a team together."
 */
export const incredibleHulk2008Universe = new UniverseBuilder()
    .film('marvel_studios', 'The Incredible Hulk', 2008)
    .withId(createFilmUniverseId('marvel_studios', 'incredible_hulk', 2008))
    .withRuntime(112)
    .withRealityRelation('historical_fiction', 0.9)
    .withCopyright(['Marvel Studios', 'The Walt Disney Company'], 2008, 'active')
    .withCreators({ director: ['Louis Leterrier'], writer: ['Zak Penn'] })
    .withCulturalSignificance(0.70)
    .build();

/**
 * ## Iron Man 2 (2010)
 * Explored the consequences of Tony Stark's public identity and introduced key
 * characters like Black Widow and War Machine. It heavily expanded the S.H.I.E.L.D. mythology.
 *
 * ### Notable Easter Eggs & Connections:
 * - **Wakanda**: A map in S.H.I.E.L.D. headquarters shows a location marker over the African nation of Wakanda.
 * - **Captain America's Shield**: Agent Coulson once again finds a prototype of the shield, which Tony uses to level his particle accelerator.
 * - **Post-Credit Scene**: Agent Coulson arrives in New Mexico, reporting the discovery of a large hammer in a crater—Mjolnir, Thor's hammer. 【3】
 */
export const ironMan2_2010Universe = new UniverseBuilder()
    .film('marvel_studios', 'Iron Man 2', 2010)
    .withId(createFilmUniverseId('marvel_studios', 'iron_man_2', 2010))
    .withRuntime(124)
    .withRealityRelation('historical_fiction', 0.9)
    .withCopyright(['Marvel Studios', 'The Walt Disney Company'], 2010, 'active')
    .withCreators({ director: ['Jon Favreau'], writer: ['Justin Theroux'] })
    .withCulturalSignificance(0.80)
    .build();

/**
 * ## Thor (2011)
 * Expanded the MCU into the cosmic realm, introducing Asgard, the Nine Realms,
 * and the concept of beings perceived as gods.
 *
 * ### Notable Easter Eggs & Connections:
 * - **Hawkeye**: Clint Barton (Jeremy Renner) makes his first appearance as a S.H.I.E.L.D. archer.
 * - **The Infinity Gauntlet**: A replica of the Infinity Gauntlet is seen in Odin's Vault. (Later retconned by Hela in `Thor: Ragnarok` as a fake).
 * - **Donald Blake**: The name on the fake ID given to Thor is a nod to his human alter-ego in the comics.
 * - **Post-Credit Scene**: Dr. Erik Selvig meets Nick Fury, who reveals the Tesseract (the Space Stone).
 */
export const thor2011Universe = new UniverseBuilder()
    .film('marvel_studios', 'Thor', 2011)
    .withId(createFilmUniverseId('marvel_studios', 'thor', 2011))
    .withRuntime(115)
    .withRealityRelation('science_fantasy', 0.95)
    .withCopyright(['Marvel Studios', 'The Walt Disney Company'], 2011, 'active')
    .withCreators({ director: ['Kenneth Branagh'], writer: ['Ashley Edward Miller', 'Zack Stentz', 'Don Payne'] })
    .withCulturalSignificance(0.85)
    .build();

/**
 * ## Captain America: The First Avenger (2011)
 * A period piece set in World War II, this film provided the historical backbone
 * for the MCU, introducing the Super Soldier Serum, Hydra, and the Tesseract.
 *
 * ### Notable Easter Eggs & Connections:
 * - **The Tesseract**: The Cosmic Cube is revealed as the source of Hydra's power and is the first Infinity Stone to be central to a film's plot.
 * - **The Human Torch**: At the Stark Expo, an android in a red suit is seen in a display case, a nod to the original Human Torch from the comics and Chris Evans' prior role as the Human Torch in the `Fantastic Four` films.
 * - **Post-Credit Scene**: A teaser trailer for `The Avengers` is shown, uniting the heroes established in Phase One.
 */
export const captainAmericaFirstAvenger2011Universe = new UniverseBuilder()
    .film('marvel_studios', 'Captain America: The First Avenger', 2011)
    .withId(createFilmUniverseId('marvel_studios', 'captain_america_the_first_avenger', 2011))
    .withRuntime(124)
    .withRealityRelation('historical_fiction', 0.8)
    .withCopyright(['Marvel Studios', 'The Walt Disney Company'], 2011, 'active')
    .withCreators({ director: ['Joe Johnston'], writer: ['Christopher Markus', 'Stephen McFeely'] })
    .withCulturalSignificance(0.88)
    .build();

/**
 * ## The Avengers (2012)
 * The culmination of Phase One, this film brought the heroes together to fight a
 * common threat, proving the viability of a large-scale cinematic universe.
 *
 * ### Notable Easter Eggs & Connections:
 * - **Thanos**: The mid-credit scene reveals the alien threat was orchestrated by Thanos, the Mad Titan, setting up the overarching villain of the Infinity Saga. 【2】
 * - **Shawarma**: The post-credit scene, showing the exhausted team eating shawarma, became an iconic, character-driven moment that defined the MCU's blend of action and humor.
 */
export const avengers2012Universe = new UniverseBuilder()
    .film('marvel_studios', 'The Avengers', 2012)
    .withId(createFilmUniverseId('marvel_studios', 'the_avengers', 2012))
    .withRuntime(143)
    .withRealityRelation('science_fantasy', 0.9)
    .withCopyright(['Marvel Studios', 'The Walt Disney Company'], 2012, 'active')
    .withCreators({ director: ['Joss Whedon'], writer: ['Joss Whedon'] })
    .withCulturalSignificance(0.98)
    .build();


// --- Phase Two: The Aftermath ---

/**
 * ## Iron Man 3 (2013)
 * Dealt with Tony Stark's PTSD after the events of `The Avengers` and explored
 * themes of identity and media manipulation.
 *
 * ### Notable Easter Eggs & Connections:
 * - **Severed Hand Homage**: This film begins a Phase Two running gag where a character gets a hand or arm severed, as an homage to `Star Wars: The Empire Strikes Back`. Here, Aldrich Killian loses a hand. 【4】
 * - **Post-Credit Scene**: Tony Stark is revealed to be telling his story to Bruce Banner, who has fallen asleep.
 */
export const ironMan3_2013Universe = new UniverseBuilder()
    .film('marvel_studios', 'Iron Man 3', 2013)
    .withId(createFilmUniverseId('marvel_studios', 'iron_man_3', 2013))
    .withRuntime(130)
    .withRealityRelation('historical_fiction', 0.9)
    .withCopyright(['Marvel Studios', 'The Walt Disney Company'], 2013, 'active')
    .withCreators({ director: ['Shane Black'], writer: ['Drew Pearce', 'Shane Black'] })
    .withCulturalSignificance(0.82)
    .build();

/**
 * ## Thor: The Dark World (2013)
 * Further developed the cosmic side of the MCU and introduced the Aether, later
 * revealed to be the Reality Stone.
 *
 * ### Notable Easter Eggs & Connections:
 * - **The Collector**: The mid-credit scene introduces Taneleer Tivan, The Collector, who is given the Aether for safekeeping. He remarks, "One down, five to go," referencing the Infinity Stones.
 * - **Captain America Cameo**: Loki briefly transforms into Captain America to mock Thor.
 * - **Severed Hand Homage**: Thor's hand is seemingly cut off by Loki in an illusion. 【4】
 */
export const thorDarkWorld2013Universe = new UniverseBuilder()
    .film('marvel_studios', 'Thor: The Dark World', 2013)
    .withId(createFilmUniverseId('marvel_studios', 'thor_the_dark_world', 2013))
    .withRuntime(112)
    .withRealityRelation('science_fantasy', 0.95)
    .withCopyright(['Marvel Studios', 'The Walt Disney Company'], 2013, 'active')
    .withCreators({ director: ['Alan Taylor'], writer: ['Christopher L. Yost', 'Christopher Markus', 'Stephen McFeely'] })
    .withCulturalSignificance(0.65)
    .build();

/**
 * ## Captain America: The Winter Soldier (2014)
 * A political thriller that fundamentally changed the MCU by revealing that Hydra
 * had infiltrated S.H.I.E.L.D. from its inception.
 *
 * ### Notable Easter Eggs & Connections:
 * - **Stephen Strange**: Agent Jasper Sitwell names Stephen Strange as one of Hydra's future targets, foreshadowing the Sorcerer Supreme.
 * - **Mid-Credit Scene**: Baron von Strucker is shown to be in possession of Loki's scepter, and we get our first look at "the twins," Wanda and Pietro Maximoff (Scarlet Witch and Quicksilver).
 */
export const captainAmericaWinterSoldier2014Universe = new UniverseBuilder()
    .film('marvel_studios', 'Captain America: The Winter Soldier', 2014)
    .withId(createFilmUniverseId('marvel_studios', 'captain_america_the_winter_soldier', 2014))
    .withRuntime(136)
    .withRealityRelation('historical_fiction', 0.85)
    .withCopyright(['Marvel Studios', 'The Walt Disney Company'], 2014, 'active')
    .withCreators({ director: ['Anthony Russo', 'Joe Russo'], writer: ['Christopher Markus', 'Stephen McFeely'] })
    .withCulturalSignificance(0.96)
    .build();

/**
 * ## Guardians of the Galaxy (2014)
 * A massive gamble that paid off, introducing a new team of cosmic heroes and
 * a comedic, music-filled tone. It also explained the origin of the Infinity Stones.
 *
 * ### Notable Easter Eggs & Connections:
 * - **The Collector's Museum**: Filled with references, including a Dark Elf, a Chitauri, Cosmo the Spacedog, and Howard the Duck.
 * - **The Power Stone**: The Orb is revealed to be the Power Stone.
 * - **Severed Hand Homage**: Groot's arm is cut off by Gamora. 【4】
 */
export const guardiansOfTheGalaxy2014Universe = new UniverseBuilder()
    .film('marvel_studios', 'Guardians of the Galaxy', 2014)
    .withId(createFilmUniverseId('marvel_studios', 'guardians_of_the_galaxy', 2014))
    .withRuntime(121)
    .withRealityRelation('science_fantasy', 0.98)
    .withCopyright(['Marvel Studios', 'The Walt Disney Company'], 2014, 'active')
    .withCreators({ director: ['James Gunn'], writer: ['James Gunn', 'Nicole Perlman'] })
    .withCulturalSignificance(0.94)
    .build();

/**
 * ## Avengers: Age of Ultron (2015)
 * The second Avengers film introduced Vision and Scarlet Witch to the team and
 * explored the darker side of Tony Stark's desire to protect the world.
 *
 * ### Notable Easter Eggs & Connections:
 * - **Wakanda & Ulysses Klaue**: The team tracks stolen vibranium to the African nation of Wakanda, introducing arms dealer Ulysses Klaue.
 * - **The Mind Stone**: The gem in Loki's scepter is revealed to be the Mind Stone, which gives Vision life.
 * - **Mid-Credit Scene**: A frustrated Thanos dons the Infinity Gauntlet and says, "Fine. I'll do it myself."
 * - **Severed Hand Homage**: Ultron cuts off Ulysses Klaue's arm. 【4】
 */
export const avengersAgeOfUltron2015Universe = new UniverseBuilder()
    .film('marvel_studios', 'Avengers: Age of Ultron', 2015)
    .withId(createFilmUniverseId('marvel_studios', 'avengers_age_of_ultron', 2015))
    .withRuntime(141)
    .withRealityRelation('science_fantasy', 0.9)
    .withCopyright(['Marvel Studios', 'The Walt Disney Company'], 2015, 'active')
    .withCreators({ director: ['Joss Whedon'], writer: ['Joss Whedon'] })
    .withCulturalSignificance(0.90)
    .build();

/**
 * ## Ant-Man (2015)
 * A smaller-scale heist film that introduced the Quantum Realm, a concept that
 * would become critical to the future of the MCU.
 *
 * ### Notable Easter Eggs & Connections:
 * - **The Falcon**: Ant-Man's infiltration of the new Avengers Compound leads to a fight with Sam Wilson/Falcon.
 * - **Spider-Man Reference**: Luis mentions a "guy who crawls on walls," an early reference to Spider-Man's existence before his official introduction.
 * - **Mid-Credit Scene**: Hank Pym shows Hope van Dyne a prototype Wasp suit.
 */
export const antMan2015Universe = new UniverseBuilder()
    .film('marvel_studios', 'Ant-Man', 2015)
    .withId(createFilmUniverseId('marvel_studios', 'ant_man', 2015))
    .withRuntime(117)
    .withRealityRelation('historical_fiction', 0.88)
    .withCopyright(['Marvel Studios', 'The Walt Disney Company'], 2015, 'active')
    .withCreators({ director: ['Peyton Reed'], writer: ['Edgar Wright', 'Joe Cornish', 'Adam McKay', 'Paul Rudd'] })
    .withCulturalSignificance(0.85)
    .build();


// --- Phase Three: A House Divided & The Infinity War ---

/**
 * ## Captain America: Civil War (2016)
 * An "Avengers 2.5" that pitted hero against hero over the Sokovia Accords,
 * leading to a schism in the team.
 *
 * ### Notable Easter Eggs & Connections:
 * - **Spider-Man & Black Panther**: The film serves as the official introduction of both Tom Holland's Spider-Man and Chadwick Boseman's Black Panther to the MCU.
 * - **Post-Credit Scene**: Bucky Barnes is put into cryo-sleep in Wakanda, and Peter Parker discovers the spider-signal in his new web-shooters.
 */
export const captainAmericaCivilWar2016Universe = new UniverseBuilder()
    .film('marvel_studios', 'Captain America: Civil War', 2016)
    .withId(createFilmUniverseId('marvel_studios', 'captain_america_civil_war', 2016))
    .withRuntime(147)
    .withRealityRelation('historical_fiction', 0.85)
    .withCopyright(['Marvel Studios', 'The Walt Disney Company'], 2016, 'active')
    .withCreators({ director: ['Anthony Russo', 'Joe Russo'], writer: ['Christopher Markus', 'Stephen McFeely'] })
    .withCulturalSignificance(0.97)
    .build();

/**
 * ## Doctor Strange (2016)
 * Introduced the mystical and magical side of the MCU, along with concepts like
 * the multiverse and the Time Stone.
 *
 * ### Notable Easter Eggs & Connections:
 * - **The Eye of Agamotto**: The amulet is revealed to contain the Time Stone.
 * - **Mid-Credit Scene**: Doctor Strange meets with Thor, discussing Loki and Odin, directly leading into `Thor: Ragnarok`.
 */
export const doctorStrange2016Universe = new UniverseBuilder()
    .film('marvel_studios', 'Doctor Strange', 2016)
    .withId(createFilmUniverseId('marvel_studios', 'doctor_strange', 2016))
    .withRuntime(115)
    .withRealityRelation('science_fantasy', 0.92)
    .withCopyright(['Marvel Studios', 'The Walt Disney Company'], 2016, 'active')
    .withCreators({ director: ['Scott Derrickson'], writer: ['Jon Spaihts', 'Scott Derrickson', 'C. Robert Cargill'] })
    .withCulturalSignificance(0.89)
    .build();

/**
 * ## Guardians of the Galaxy Vol. 2 (2017)
 * A deeper, more emotional story focused on Peter Quill's parentage and the
 * theme of found family.
 *
 * ### Notable Easter Eggs & Connections:
 * - **Adam Warlock**: A mid-credit scene shows the Sovereign creating a being named "Adam," teasing the arrival of Adam Warlock.
 * - **Original Guardians**: One of several credit scenes shows the reunion of the original Guardians of the Galaxy from the comics, including characters played by Sylvester Stallone and Michelle Yeoh.
 */
export const guardiansOfTheGalaxyVol2_2017Universe = new UniverseBuilder()
    .film('marvel_studios', 'Guardians of the Galaxy Vol. 2', 2017)
    .withId(createFilmUniverseId('marvel_studios', 'guardians_of_the_galaxy_vol_2', 2017))
    .withRuntime(136)
    .withRealityRelation('science_fantasy', 0.98)
    .withCopyright(['Marvel Studios', 'The Walt Disney Company'], 2017, 'active')
    .withCreators({ director: ['James Gunn'], writer: ['James Gunn'] })
    .withCulturalSignificance(0.91)
    .build();

/**
 * ## Spider-Man: Homecoming (2017)
 * Integrated Spider-Man fully into the MCU, focusing on his high-school life
 * and mentorship under Tony Stark.
 *
 * ### Notable Easter Eggs & Connections:
 * - **Damage Control**: The Vulture's origin is tied to the aftermath of the Battle of New York, where his salvage company is put out of business by the Department of Damage Control, a joint venture between Stark Industries and the U.S. government.
 * - **The Prowler**: Aaron Davis (Donald Glover) mentions his nephew, a direct reference to Miles Morales.
 */
export const spiderManHomecoming2017Universe = new UniverseBuilder()
    .film('marvel_studios', 'Spider-Man: Homecoming', 2017)
    .withId(createFilmUniverseId('marvel_studios', 'spider_man_homecoming', 2017))
    .withRuntime(133)
    .withRealityRelation('historical_fiction', 0.88)
    .withCopyright(['Marvel Studios', 'Sony Pictures'], 2017, 'active')
    .withCreators({ director: ['Jon Watts'], writer: ['Jonathan Goldstein', 'John Francis Daley', 'Jon Watts', 'Christopher Ford', 'Chris McKenna', 'Erik Sommers'] })
    .withCulturalSignificance(0.93)
    .build();

/**
 * ## Thor: Ragnarok (2017)
 * A vibrant, comedic reinvention of the Thor character that saw him team up with
 * the Hulk on the planet Sakaar.
 *
 * ### Notable Easter Eggs & Connections:
 * - **Grandmaster's Tower**: The tower on Sakaar is decorated with giant sculptures of the heads of past champions, including Beta Ray Bill, Man-Thing, and Bi-Beast from Marvel comics.
 * - **Post-Credit Scene**: The Asgardian refugee ship is intercepted by a massive vessel: Thanos's ship, the Sanctuary II, leading directly into `Avengers: Infinity War`.
 */
export const thorRagnarok2017Universe = new UniverseBuilder()
    .film('marvel_studios', 'Thor: Ragnarok', 2017)
    .withId(createFilmUniverseId('marvel_studios', 'thor_ragnarok', 2017))
    .withRuntime(130)
    .withRealityRelation('science_fantasy', 0.95)
    .withCopyright(['Marvel Studios', 'The Walt Disney Company'], 2017, 'active')
    .withCreators({ director: ['Taika Waititi'], writer: ['Eric Pearson', 'Craig Kyle', 'Christopher L. Yost'] })
    .withCulturalSignificance(0.95)
    .build();

/**
 * ## Black Panther (2018)
 * A cultural phenomenon that explored the technologically advanced, isolationist
 * nation of Wakanda.
 *
 * ### Notable Easter Eggs & Connections:
 * - **Post-Credit Scene**: Bucky Barnes, now free of his Hydra brainwashing, is shown recovering in a Wakandan village, where children call him the "White Wolf."
 */
export const blackPanther2018Universe = new UniverseBuilder()
    .film('marvel_studios', 'Black Panther', 2018)
    .withId(createFilmUniverseId('marvel_studios', 'black_panther', 2018))
    .withRuntime(134)
    .withRealityRelation('historical_fiction', 0.8)
    .withCopyright(['Marvel Studios', 'The Walt Disney Company'], 2018, 'active')
    .withCreators({ director: ['Ryan Coogler'], writer: ['Ryan Coogler', 'Joe Robert Cole'] })
    .withCulturalSignificance(0.99)
    .build();

/**
 * ## Avengers: Infinity War (2018)
 * The first part of the Infinity Saga's finale. Thanos arrives on Earth to
 * collect the remaining Infinity Stones, leading to a devastating conclusion.
 *
 * ### Notable Easter Eggs & Connections:
 * - **Red Skull**: The guardian of the Soul Stone on Vormir is revealed to be the Red Skull, transported there by the Tesseract at the end of `The First Avenger`.
 * - **Post-Credit Scene**: As Nick Fury and Maria Hill turn to dust from "The Snap," Fury manages to send a distress signal on a pager to Captain Marvel.
 */
export const avengersInfinityWar2018Universe = new UniverseBuilder()
    .film('marvel_studios', 'Avengers: Infinity War', 2018)
    .withId(createFilmUniverseId('marvel_studios', 'avengers_infinity_war', 2018))
    .withRuntime(149)
    .withRealityRelation('science_fantasy', 0.95)
    .withCopyright(['Marvel Studios', 'The Walt Disney Company'], 2018, 'active')
    .withCreators({ director: ['Anthony Russo', 'Joe Russo'], writer: ['Christopher Markus', 'Stephen McFeely'] })
    .withCulturalSignificance(0.99)
    .build();

/**
 * ## Ant-Man and the Wasp (2018)
 * A lighter film set just before `Infinity War`, it focuses on the rescue of
 * Janet van Dyne from the Quantum Realm.
 *
 * ### Notable Easter Eggs & Connections:
 * - **Mid-Credit Scene**: Scott Lang enters the Quantum Realm to gather healing particles. While he is inside, Hank, Janet, and Hope are all turned to dust by Thanos's snap, trapping Scott.
 */
export const antManAndTheWasp2018Universe = new UniverseBuilder()
    .film('marvel_studios', 'Ant-Man and the Wasp', 2018)
    .withId(createFilmUniverseId('marvel_studios', 'ant_man_and_the_wasp', 2018))
    .withRuntime(118)
    .withRealityRelation('historical_fiction', 0.88)
    .withCopyright(['Marvel Studios', 'The Walt Disney Company'], 2018, 'active')
    .withCreators({ director: ['Peyton Reed'], writer: ['Chris McKenna', 'Erik Sommers', 'Paul Rudd', 'Andrew Barrer', 'Gabriel Ferrari'] })
    .withCulturalSignificance(0.86)
    .build();

/**
 * ## Captain Marvel (2019)
 * A 1990s-set prequel that tells the origin story of Carol Danvers and explains
 * the backstory of Nick Fury and S.H.I.E.L.D.
 *
 * ### Notable Easter Eggs & Connections:
 * - **Project P.E.G.A.S.U.S.**: The project that housed the Tesseract is a major part of the plot.
 * - **Nick Fury's Eye**: The film reveals that Fury lost his eye to a scratch from the Flerken, Goose, not in a heroic battle as previously hinted.
 * - **Mid-Credit Scene**: Set in the present day, the surviving Avengers are analyzing Fury's pager when Captain Marvel appears behind them.
 */
export const captainMarvel2019Universe = new UniverseBuilder()
    .film('marvel_studios', 'Captain Marvel', 2019)
    .withId(createFilmUniverseId('marvel_studios', 'captain_marvel', 2019))
    .withRuntime(123)
    .withRealityRelation('historical_fiction', 0.8)
    .withCopyright(['Marvel Studios', 'The Walt Disney Company'], 2019, 'active')
    .withCreators({ director: ['Anna Boden', 'Ryan Fleck'], writer: ['Anna Boden', 'Ryan Fleck', 'Geneva Robertson-Dworet'] })
    .withCulturalSignificance(0.90)
    .build();

/**
 * ## Avengers: Endgame (2019)
 * The epic conclusion to the Infinity Saga. The remaining Avengers embark on a
 * "Time Heist" to retrieve the Infinity Stones from the past and undo Thanos's snap.
 *
 * ### Notable Easter Eggs & Connections:
 * - **"On your left."**: Sam Wilson's first words to Captain America during the final battle are a callback to their first meeting in `The Winter Soldier`.
 * - **Howard the Duck**: Makes a brief cameo during the final battle, emerging from a portal.
 * - **Captain America Wields Mjolnir**: Captain America is finally proven "worthy" and wields Thor's hammer against Thanos.
 */
export const avengersEndgame2019Universe = new UniverseBuilder()
    .film('marvel_studios', 'Avengers: Endgame', 2019)
    .withId(createFilmUniverseId('marvel_studios', 'avengers_endgame', 2019))
    .withRuntime(181)
    .withRealityRelation('science_fantasy', 0.95)
    .withCopyright(['Marvel Studios', 'The Walt Disney Company'], 2019, 'active')
    .withCreators({ director: ['Anthony Russo', 'Joe Russo'], writer: ['Christopher Markus', 'Stephen McFeely'] })
    .withCulturalSignificance(1.0)
    .build();

/**
 * ## Spider-Man: Far From Home (2019)
 * The epilogue to the Infinity Saga, dealing with the aftermath of "The Blip"
 * and Peter Parker's grief over Tony Stark's death.
 *
 * ### Notable Easter Eggs & Connections:
 * - **J. Jonah Jameson**: The mid-credit scene features the return of J.K. Simmons as J. Jonah Jameson, who publicly reveals Spider-Man's identity.
 * - **Skrulls**: The post-credit scene reveals that Nick Fury and Maria Hill were Skrulls (Talos and Soren from `Captain Marvel`) the entire time, while the real Fury is on a spaceship.
 */
export const spiderManFarFromHome2019Universe = new UniverseBuilder()
    .film('marvel_studios', 'Spider-Man: Far From Home', 2019)
    .withId(createFilmUniverseId('marvel_studios', 'spider_man_far_from_home', 2019))
    .withRuntime(129)
    .withRealityRelation('historical_fiction', 0.88)
    .withCopyright(['Marvel Studios', 'Sony Pictures'], 2019, 'active')
    .withCreators({ director: ['Jon Watts'], writer: ['Chris McKenna', 'Erik Sommers'] })
    .withCulturalSignificance(0.92)
    .build();


// --- Phase Four: The Multiverse Saga Begins ---

/**
 * ## WandaVision (2021)
 * The first MCU series on Disney+, this show explores Wanda Maximoff's grief
 * following the events of `Endgame` through the lens of classic American sitcoms.
 * It introduced S.W.O.R.D. and set up key multiverse concepts.
 *
 * ### Notable Easter Eggs & Connections:
 * - **Commercials**: Each episode features a commercial that is a metaphorical reference to a traumatic event in Wanda's past (Stark Industries toaster, Hydra watch, Lagos paper towels).
 * - **Agatha Harkness**: Wanda's nosy neighbor "Agnes" is revealed to be the powerful witch Agatha Harkness from the comics.
 * - **The Darkhold**: The evil spellbook Agatha possesses is The Darkhold, a powerful magical artifact with a history in other Marvel media.
 * - **Mid-Credit Scene**: Monica Rambeau is recruited by a Skrull, setting up `The Marvels`.
 * - **Post-Credit Scene**: Wanda is seen in isolation, studying The Darkhold, when she hears the voices of her lost children, leading into `Doctor Strange in the Multiverse of Madness`.
 */
export const wandaVision2021Universe = new UniverseBuilder()
    // TypeScript Comment: The UniverseBuilder primarily supports films. This definition adapts it for a miniseries.
    // The runtime represents the total runtime of all 9 episodes. Segments could be used to define individual episodes.
    .film('marvel_studios', 'WandaVision', 2021)
    .withId(createFilmUniverseId('marvel_studios', 'wandavision', 2021))
    .withRuntime(350) // Approximate total runtime
    .withRealityRelation('science_fantasy', 0.95)
    .withCopyright(['Marvel Studios', 'The Walt Disney Company'], 2021, 'active')
    .withCreators({ director: ['Matt Shakman'], writer: ['Jac Schaeffer'] })
    .withCulturalSignificance(0.94)
    .build();


// --- Usage Example ---

/**
 * Example of how to register these universes in the Local Time Universe System.
 *
 * import { UniverseRegistry } from './core/universe-registry';
 *
 * const registry = new UniverseRegistry();
 *
 * // Registering a Phase One film
 * registry.registerUniverse(ironMan2008Universe.universeId, ironMan2008Universe);
 *
 * // Registering a Phase Four series
 * registry.registerUniverse(wandaVision2021Universe.universeId, wandaVision2021Universe);
 *
 * // Now the registry can be used to query temporal data and connections for these universes.
 */
