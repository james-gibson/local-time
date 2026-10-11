import { Universe } from '../../../core/types';
import { UniverseBuilder } from '../../../core/universe-builder';
import { createFilmUniverseId } from '../../../core/universe-ids';
import { CommonUniverseIds } from '../../../core/common-universe-ids';

/**
 * Pixar Animation Studios Filmography (1995-2025)
 *
 * This universe collection documents the feature films released by Pixar Animation
 * Studios, from its debut with 'Toy Story' in 1995 through 'Elio' in 2025. Each film
 * is represented as a distinct universe, capturing its release timeline, cultural
 * significance, production history, and its connections to the rest of the Pixar canon.
 *
 * Hierarchical Context: PIXAR_STUDIO -> DISNEY_CORPORATE -> HOLLYWOOD_SYSTEM
 *
 * Research Sources:
 * - Wikipedia: "List of Pixar films" (film titles and release years)
 * - IMDb (runtime, director and writer information)
 * - Publicly available film encyclopedias, news articles, and production documentaries.
 *
 * See james-gibson/local-time#1 for the originating research task.
 */

/**
 * Qualitative metadata for a single Pixar feature film.
 *
 * The qualitative fields (`interFilmRelationships`, `culturalImpact`,
 * `productionBackstory`) are not part of the core `UniverseMetadata` shape; they are
 * preserved on `metadata` because the research task (#1) treats them as first-class.
 */
export interface PixarFilmMetadata {
  canonicalName: string;
  releaseYear: number;
  runtimeMinutes: number;
  creators: {
    director: string[];
    writer: string[];
  };
  interFilmRelationships: string;
  culturalImpact: string;
  productionBackstory: string;
  cultural_significance: number;
}

const PIXAR_COPYRIGHT_HOLDERS = ['The Walt Disney Company', 'Pixar Animation Studios'];

/**
 * Creates a complete Universe object for a Pixar feature film.
 *
 * `Toy Story` (1995) also carries the Star Wars-homage references and runtime
 * keyframes that previously lived in `../disney/star-wars.ts`.
 */
export const createPixarFilmUniverse = (id: string, data: PixarFilmMetadata): Universe => {
  const universeId = createFilmUniverseId('pixar', id, data.releaseYear);

  const builder = new UniverseBuilder()
    .film('pixar', data.canonicalName, data.releaseYear)
    .withId(universeId)
    .withAliases([data.canonicalName])
    .withRealityRelation('pure_fiction', 1.0)
    .withCopyright(PIXAR_COPYRIGHT_HOLDERS, data.releaseYear, 'active')
    .withCreators({
      director: data.creators.director,
      writer: data.creators.writer,
    })
    .withReleaseDate(`${data.releaseYear}-01-01`)
    .withCulturalSignificance(data.cultural_significance, data.culturalImpact)
    // Every film is contained by the studio universe.
    .addConnection({
      targetUniverseId: CommonUniverseIds.PIXAR_STUDIO,
      type: 'member_of',
      confidence: 1.0,
      description: 'Produced by Pixar Animation Studios.',
      evidence: ['Pixar Animation Studios filmography'],
    });

  if (id.includes('toy_story') || id === 'lightyear') {
    builder.addConnection({
      targetUniverseId: CommonUniverseIds.TOY_STORY_FRANCHISE,
      type: 'member_of',
      confidence: 1.0,
      description: 'Part of the Toy Story franchise.',
      evidence: ['Direct sequel or spin-off of Toy Story.'],
    });
  }

  if (id.includes('cars')) {
    builder.addConnection({
      targetUniverseId: CommonUniverseIds.CARS_FRANCHISE,
      type: 'member_of',
      confidence: 1.0,
      description: 'Part of the Cars franchise.',
      evidence: ['Direct sequel of Cars.'],
    });
  }

  // Toy Story carries the Star Wars homage analysis (moved here from
  // ../disney/star-wars.ts, which no longer defines a duplicate universe).
  if (id === 'toy_story') {
    builder
      .addConnection({
        targetUniverseId: 'film:star_wars_a_new_hope:*',
        type: 'references',
        confidence: 0.9,
        description: 'The film contains several homages to A New Hope, particularly in its sci-fi dialogue and themes.',
        evidence: ["Buzz Lightyear's dialogue", 'Tie-fighter sound effects', 'Thematic parallels'],
      })
      .addRuntimeKeyframe(23, 5, 'tie_fighter_sound', 0.8, ['audio_reference', 'star_wars_reference', 'sound_design'])
      .addRuntimeKeyframe(57, 18, 'strange_new_planet', 0.85, ['dialogue_reference', 'star_wars_reference', 'buzz_lightyear']);
  }

  // 'Elio' has no confirmed runtime yet (0), so no runtime epoch is modelled.
  if (data.runtimeMinutes > 0) {
    builder.withRuntime(data.runtimeMinutes);
  }

  const universe = builder.build();

  universe.metadata = {
    ...universe.metadata,
    canonicalName: data.canonicalName,
    creators: [...data.creators.director, ...data.creators.writer],
    released: new Date(Date.UTC(data.releaseYear, 0, 1)),
    cultural_significance: data.cultural_significance,
    // Rich qualitative fields preserved from the source research (issue #1).
    releaseYear: data.releaseYear,
    runtimeMinutes: data.runtimeMinutes,
    interFilmRelationships: data.interFilmRelationships,
    culturalImpact: data.culturalImpact,
    productionBackstory: data.productionBackstory,
    parentContext: CommonUniverseIds.PIXAR_STUDIO,
  } as any;

  return universe;
};

// --- Film Data ---

const filmData: Record<string, PixarFilmMetadata> = {
  toy_story: {
    canonicalName: 'Toy Story',
    releaseYear: 1995,
    runtimeMinutes: 81,
    creators: { director: ['John Lasseter'], writer: ['Joss Whedon', 'Andrew Stanton', 'Joel Cohen', 'Alec Sokolow'] },
    interFilmRelationships: "First film in the Toy Story franchise. Introduces recurring easter eggs like the Pizza Planet truck and A113. The character of Buzz Lightyear is the subject of the 2022 spin-off film 'Lightyear'.",
    culturalImpact: "The first feature-length film created entirely with CGI. Received a Special Achievement Academy Award. Its success fundamentally shifted the animation industry towards computer animation.",
    productionBackstory: "The project was famously saved from cancellation after a disastrous early screening known as the 'Black Friday reel.' The original concept for Woody was a much more cynical and unlikable character.",
    cultural_significance: 0.98,
  },
  a_bugs_life: {
    canonicalName: "A Bug's Life",
    releaseYear: 1998,
    runtimeMinutes: 95,
    creators: { director: ['John Lasseter', 'Andrew Stanton'], writer: ['Andrew Stanton', 'Don McEnery', 'Bob Shaw'] },
    interFilmRelationships: "Features the Pizza Planet truck easter egg. A character from this film appears in a post-credits scene of 'Toy Story 2'.",
    culturalImpact: "Praised for its technical advancements in depicting large crowds of characters and complex natural environments. Released around the same time as DreamWorks' similar film 'Antz', sparking a public rivalry.",
    productionBackstory: "Inspired by Aesop's fable 'The Ant and the Grasshopper.' The film's production was notably fast-paced to compete with the release of 'Antz'.",
    cultural_significance: 0.85,
  },
  toy_story_2: {
    canonicalName: 'Toy Story 2',
    releaseYear: 1999,
    runtimeMinutes: 92,
    creators: { director: ['John Lasseter', 'Lee Unkrich', 'Ash Brannon'], writer: ['Andrew Stanton', 'Rita Hsiao', 'Doug Chamberlin', 'Chris Webb'] },
    interFilmRelationships: "Direct sequel to 'Toy Story'. Introduces key characters like Jessie and Bullseye.",
    culturalImpact: "One of the rare sequels considered by critics to have surpassed the original. Won the Golden Globe for Best Motion Picture – Musical or Comedy.",
    productionBackstory: "The film was almost entirely deleted by an accidental command during production; it was saved because a technical director had a backup copy she had been keeping at home.",
    cultural_significance: 0.95,
  },
  monsters_inc: {
    canonicalName: 'Monsters, Inc.',
    releaseYear: 2001,
    runtimeMinutes: 92,
    creators: { director: ['Pete Docter', 'David Silverman', 'Lee Unkrich'], writer: ['Andrew Stanton', 'Dan Gerson'] },
    interFilmRelationships: "Prequel 'Monsters University' released in 2013. The character Boo is believed by fans to be the witch from 'Brave' due to a wood carving of Sulley in her workshop.",
    culturalImpact: "Won the Academy Award for Best Original Song for 'If I Didn't Have You'. Groundbreaking for its realistic rendering of fur and cloth.",
    productionBackstory: "The initial concept involved a 30-year-old man being haunted by monsters he drew as a child, a much darker premise than the final film.",
    cultural_significance: 0.94,
  },
  finding_nemo: {
    canonicalName: 'Finding Nemo',
    releaseYear: 2003,
    runtimeMinutes: 100,
    creators: { director: ['Andrew Stanton', 'Lee Unkrich'], writer: ['Andrew Stanton', 'Bob Peterson', 'David Reynolds'] },
    interFilmRelationships: "Sequel 'Finding Dory' released in 2016. A Buzz Lightyear toy can be seen in the dentist's office waiting room.",
    culturalImpact: "Won the Academy Award for Best Animated Feature. It became the highest-grossing animated film at the time. Led to a surge in the popularity of clownfish as pets, which ironically had negative ecological consequences.",
    productionBackstory: "The film's realistic depiction of the ocean required significant advancements in rendering water, light, and underwater particle effects.",
    cultural_significance: 0.96,
  },
  the_incredibles: {
    canonicalName: 'The Incredibles',
    releaseYear: 2004,
    runtimeMinutes: 115,
    creators: { director: ['Brad Bird'], writer: ['Brad Bird'] },
    interFilmRelationships: "Sequel 'Incredibles 2' released in 2018. Doc Hudson from 'Cars' is seen in the background during the final battle.",
    culturalImpact: "Won the Academy Award for Best Animated Feature. Praised for its mature themes, complex action sequences, and nuanced portrayal of a family dynamic. It was the first Pixar film to feature an all-human cast.",
    productionBackstory: "Director Brad Bird pushed the technical teams to their limits, particularly with creating realistic human characters, hair, and clothing.",
    cultural_significance: 0.97,
  },
  cars: {
    canonicalName: 'Cars',
    releaseYear: 2006,
    runtimeMinutes: 117,
    creators: { director: ['John Lasseter', 'Joe Ranft'], writer: ['Dan Fogelman', 'John Lasseter', 'Joe Ranft', 'Kiel Murray', 'Phil Lorin', 'Jorgen Klubien'] },
    interFilmRelationships: "First film in the Cars franchise, followed by two sequels and the 'Planes' spin-off series.",
    culturalImpact: "While receiving less critical acclaim than other Pixar films, it was a massive commercial success, particularly in merchandise sales, which have generated billions of dollars.",
    productionBackstory: "The film was a personal project for director John Lasseter, inspired by his love of cars and a cross-country road trip he took with his family.",
    cultural_significance: 0.88,
  },
  ratatouille: {
    canonicalName: 'Ratatouille',
    releaseYear: 2007,
    runtimeMinutes: 111,
    creators: { director: ['Brad Bird', 'Jan Pinkava'], writer: ['Brad Bird', 'Jan Pinkava', 'Jim Capobianco'] },
    interFilmRelationships: "The character Bomb Voyage from 'The Incredibles' appears as a mime in the background.",
    culturalImpact: "Won the Academy Award for Best Animated Feature. Celebrated for its sophisticated storytelling and its positive depiction of culinary arts and criticism.",
    productionBackstory: "Director Brad Bird took over the project midway through production, significantly overhauling the story and character designs.",
    cultural_significance: 0.93,
  },
  wall_e: {
    canonicalName: 'WALL-E',
    releaseYear: 2008,
    runtimeMinutes: 98,
    creators: { director: ['Andrew Stanton'], writer: ['Andrew Stanton', 'Jim Reardon'] },
    interFilmRelationships: "The film contains numerous references to classic sci-fi, including '2001: A Space Odyssey'. A Mike Wazowski antenna ball is among WALL-E's treasures.",
    culturalImpact: "Won the Academy Award for Best Animated Feature. Praised for its bold storytelling, with a nearly silent first act, and its powerful environmental message.",
    productionBackstory: "The character design for WALL-E was heavily inspired by a pair of binoculars and classic silent film stars like Buster Keaton and Charlie Chaplin.",
    cultural_significance: 0.98,
  },
  up: {
    canonicalName: 'Up',
    releaseYear: 2009,
    runtimeMinutes: 96,
    creators: { director: ['Pete Docter', 'Bob Peterson'], writer: ['Pete Docter', 'Bob Peterson', 'Tom McCarthy'] },
    interFilmRelationships: "The character Lotso from 'Toy Story 3' appears as a toy in a young girl's room.",
    culturalImpact: "Won two Academy Awards, including Best Animated Feature. It was the second animated film in history to be nominated for Best Picture. The opening 'Married Life' sequence is widely regarded as a masterpiece of emotional storytelling.",
    productionBackstory: "The film's setting was inspired by the tepuis (table-top mountains) of Venezuela. The production team traveled to the region for research.",
    cultural_significance: 0.99,
  },
  toy_story_3: {
    canonicalName: 'Toy Story 3',
    releaseYear: 2010,
    runtimeMinutes: 103,
    creators: { director: ['Lee Unkrich'], writer: ['Michael Arndt', 'John Lasseter', 'Andrew Stanton', 'Lee Unkrich'] },
    interFilmRelationships: "Third film in the franchise. Features a cameo from Totoro, a character from Studio Ghibli's 'My Neighbor Totoro'.",
    culturalImpact: "Won two Academy Awards, including Best Animated Feature. Nominated for Best Picture. Praised for its emotionally resonant conclusion to the original trilogy.",
    productionBackstory: "The climactic incinerator scene was seen as surprisingly dark and intense for a family film, but was lauded by critics for its emotional weight.",
    cultural_significance: 0.97,
  },
  cars_2: {
    canonicalName: 'Cars 2',
    releaseYear: 2011,
    runtimeMinutes: 106,
    creators: { director: ['John Lasseter', 'Bradford Lewis'], writer: ['Ben Queen', 'John Lasseter', 'Bradford Lewis', 'Dan Fogelman'] },
    interFilmRelationships: "Direct sequel to 'Cars'.",
    culturalImpact: "Considered one of Pixar's rare critical missteps, but was still a box office and merchandising success.",
    productionBackstory: "The film shifted focus from Lightning McQueen to Mater, a decision that was reportedly driven by John Lasseter and was a point of contention for some critics.",
    cultural_significance: 0.70,
  },
  brave: {
    canonicalName: 'Brave',
    releaseYear: 2012,
    runtimeMinutes: 93,
    creators: { director: ['Mark Andrews', 'Brenda Chapman', 'Steve Purcell'], writer: ['Mark Andrews', 'Steve Purcell', 'Brenda Chapman', 'Irene Mecchi'] },
    interFilmRelationships: "A wood carving of Sulley from 'Monsters, Inc.' appears in the witch's workshop, fueling a popular fan theory.",
    culturalImpact: "Won the Academy Award for Best Animated Feature. Notable for being Pixar's first film with a female protagonist and for its focus on a mother-daughter relationship.",
    productionBackstory: "The film had a troubled production, with original director Brenda Chapman being replaced by Mark Andrews over creative differences.",
    cultural_significance: 0.89,
  },
  monsters_university: {
    canonicalName: 'Monsters University',
    releaseYear: 2013,
    runtimeMinutes: 104,
    creators: { director: ['Dan Scanlon'], writer: ['Dan Scanlon', 'Daniel Gerson', 'Robert L. Baird'] },
    interFilmRelationships: "Prequel to 'Monsters, Inc.'.",
    culturalImpact: "Praised for its fun, lighthearted tone and expansion of the 'Monsters' world, though some critics found it lacked the emotional depth of the original.",
    productionBackstory: "The animation team developed new techniques for global illumination to create more realistic lighting across the large and complex university campus.",
    cultural_significance: 0.86,
  },
  inside_out: {
    canonicalName: 'Inside Out',
    releaseYear: 2015,
    runtimeMinutes: 95,
    creators: { director: ['Pete Docter', 'Ronnie Del Carmen'], writer: ['Pete Docter', 'Meg LeFauve', 'Josh Cooley'] },
    interFilmRelationships: "Sequel 'Inside Out 2' released in 2024. Some of Riley's memory orbs show scenes from 'Up'.",
    culturalImpact: "Won the Academy Award for Best Animated Feature. Widely praised for its inventive concept and for providing a visual language for children and adults to talk about emotions and mental health.",
    productionBackstory: "The film's concept was based on director Pete Docter's observations of his own daughter's changing personality as she grew up.",
    cultural_significance: 0.98,
  },
  the_good_dinosaur: {
    canonicalName: 'The Good Dinosaur',
    releaseYear: 2015,
    runtimeMinutes: 93,
    creators: { director: ['Peter Sohn'], writer: ['Meg LeFauve', 'Peter Sohn', 'Erik Benson', 'Kelsey Mann', 'Bob Peterson'] },
    interFilmRelationships: "Released in the same year as 'Inside Out', marking the first time Pixar released two films in one year.",
    culturalImpact: "Met with mixed reviews and underperformed at the box office, becoming Pixar's first box-office bomb. Praised for its photorealistic environments.",
    productionBackstory: "The film underwent a major story overhaul and change in director during production, leading to a delayed release.",
    cultural_significance: 0.72,
  },
  finding_dory: {
    canonicalName: 'Finding Dory',
    releaseYear: 2016,
    runtimeMinutes: 97,
    creators: { director: ['Andrew Stanton', 'Angus MacLane'], writer: ['Andrew Stanton', 'Victoria Strouse'] },
    interFilmRelationships: "Direct sequel to 'Finding Nemo'.",
    culturalImpact: "A massive box office success, grossing over $1 billion worldwide. Praised for its positive portrayal of a character with a disability.",
    productionBackstory: "The film's ending was reportedly changed after the filmmakers saw the documentary 'Blackfish', which was critical of marine parks.",
    cultural_significance: 0.91,
  },
  cars_3: {
    canonicalName: 'Cars 3',
    releaseYear: 2017,
    runtimeMinutes: 102,
    creators: { director: ['Brian Fee'], writer: ['Brian Fee', 'Ben Queen', 'Eyal Podell', 'Jonathon E. Stewart', 'Kiel Murray', 'Bob Peterson', 'Mike Rich'] },
    interFilmRelationships: "Third film in the Cars franchise.",
    culturalImpact: "Seen by critics as a return to form for the franchise, with a more mature story that echoed the themes of the original film.",
    productionBackstory: "The story focuses on themes of aging and mentorship, seen as a metaphor for the careers of athletes and even the animators themselves.",
    cultural_significance: 0.82,
  },
  coco: {
    canonicalName: 'Coco',
    releaseYear: 2017,
    runtimeMinutes: 105,
    creators: { director: ['Lee Unkrich', 'Adrian Molina'], writer: ['Adrian Molina', 'Matthew Aldrich', 'Lee Unkrich', 'Jason Katz'] },
    interFilmRelationships: "A Buzz Lightyear piñata is seen in the market.",
    culturalImpact: "Won two Academy Awards, including Best Animated Feature. Celebrated for its authentic and respectful portrayal of Mexican culture and the Día de Muertos holiday.",
    productionBackstory: "The production team spent years conducting research in Mexico to ensure cultural accuracy. The film was also a massive success in Mexico.",
    cultural_significance: 0.97,
  },
  incredibles_2: {
    canonicalName: 'Incredibles 2',
    releaseYear: 2018,
    runtimeMinutes: 118,
    creators: { director: ['Brad Bird'], writer: ['Brad Bird'] },
    interFilmRelationships: "Direct sequel to 'The Incredibles'.",
    culturalImpact: "A huge box office success, grossing over $1.2 billion. Praised for its action sequences and humor, though some felt it didn't innovate as much as the original.",
    productionBackstory: "The film was released 14 years after the original, a remarkably long gap for an animated sequel. Director Brad Bird returned for the sequel.",
    cultural_significance: 0.92,
  },
  toy_story_4: {
    canonicalName: 'Toy Story 4',
    releaseYear: 2019,
    runtimeMinutes: 100,
    creators: { director: ['Josh Cooley'], writer: ['Andrew Stanton', 'Stephany Folsom', 'John Lasseter', 'Josh Cooley'] },
    interFilmRelationships: "Fourth film in the franchise.",
    culturalImpact: "Won the Academy Award for Best Animated Feature. While some fans felt 'Toy Story 3' was a perfect ending, the fourth film was praised for its thoughtful exploration of purpose and letting go.",
    productionBackstory: "The creation of the character 'Forky' presented a unique animation challenge: how to animate a character who is poorly constructed and moves awkwardly.",
    cultural_significance: 0.93,
  },
  onward: {
    canonicalName: 'Onward',
    releaseYear: 2020,
    runtimeMinutes: 102,
    creators: { director: ['Dan Scanlon'], writer: ['Dan Scanlon', 'Jason Headley', 'Keith Bunin'] },
    interFilmRelationships: "The TripleDent Gum jingle from 'Inside Out' is heard on a car radio.",
    culturalImpact: "Its theatrical run was cut short by the COVID-19 pandemic, leading to an early release on digital platforms. Received positive reviews for its heartfelt story.",
    productionBackstory: "The story was inspired by director Dan Scanlon's own life; his father passed away when he was young, and he and his brother longed to know more about him.",
    cultural_significance: 0.85,
  },
  soul: {
    canonicalName: 'Soul',
    releaseYear: 2020,
    runtimeMinutes: 100,
    creators: { director: ['Pete Docter', 'Kemp Powers'], writer: ['Pete Docter', 'Mike Jones', 'Kemp Powers'] },
    interFilmRelationships: "The Pizza Planet truck is seen in the Hall of Everything.",
    culturalImpact: "Won two Academy Awards, including Best Animated Feature. Released directly to Disney+ in most countries due to the pandemic. Praised for its abstract concepts, jazz music, and mature themes about life's purpose.",
    productionBackstory: "It was the first Pixar film to feature an African-American protagonist. The filmmakers consulted with numerous cultural and music experts.",
    cultural_significance: 0.95,
  },
  luca: {
    canonicalName: 'Luca',
    releaseYear: 2021,
    runtimeMinutes: 95,
    creators: { director: ['Enrico Casarosa'], writer: ['Jesse Andrews', 'Mike Jones'] },
    interFilmRelationships: "A poster for the film '20,000 Leagues Under the Sea' is visible, a nod to a classic Disney film.",
    culturalImpact: "Released directly to Disney+ due to the pandemic. Praised for its charming, nostalgic feel and beautiful depiction of the Italian Riviera.",
    productionBackstory: "Director Enrico Casarosa based the film on his own childhood summers in Genoa, Italy.",
    cultural_significance: 0.87,
  },
  turning_red: {
    canonicalName: 'Turning Red',
    releaseYear: 2022,
    runtimeMinutes: 100,
    creators: { director: ['Domee Shi'], writer: ['Domee Shi', 'Julia Cho'] },
    interFilmRelationships: "A 'Lightyear' sticker is on Miriam's skateboard.",
    culturalImpact: "Released directly to Disney+ in most countries. Celebrated for its unique anime-influenced art style and its honest, humorous portrayal of female puberty.",
    productionBackstory: "The film is set in 2002 in Toronto, Canada, and is heavily inspired by director Domee Shi's own upbringing.",
    cultural_significance: 0.89,
  },
  lightyear: {
    canonicalName: 'Lightyear',
    releaseYear: 2022,
    runtimeMinutes: 105,
    creators: { director: ['Angus MacLane'], writer: ['Angus MacLane', 'Matthew Aldrich', 'Jason Headley'] },
    interFilmRelationships: "A spin-off of the 'Toy Story' franchise, framed as the sci-fi movie that Andy saw which made him want a Buzz Lightyear toy.",
    culturalImpact: "Underperformed at the box office and received mixed reviews, with some critics questioning the necessity of its premise.",
    productionBackstory: "The film caused controversy in several countries due to a scene depicting a same-sex kiss, leading to it being banned in those markets.",
    cultural_significance: 0.75,
  },
  elemental: {
    canonicalName: 'Elemental',
    releaseYear: 2023,
    runtimeMinutes: 101,
    creators: { director: ['Peter Sohn'], writer: ['John Hoberg', 'Kat Likkel', 'Brenda Hsueh'] },
    interFilmRelationships: "The film's setting, Element City, contains numerous visual puns and references to other Pixar films.",
    culturalImpact: "After a slow start, the film became a sleeper hit at the box office due to strong word-of-mouth. Praised for its stunning visuals and immigrant-story allegory.",
    productionBackstory: "The story was inspired by director Peter Sohn's experiences as the son of Korean immigrants in New York City.",
    cultural_significance: 0.84,
  },
  inside_out_2: {
    canonicalName: 'Inside Out 2',
    releaseYear: 2024,
    runtimeMinutes: 96,
    creators: { director: ['Kelsey Mann'], writer: ['Meg LeFauve', 'Dave Holstein'] },
    interFilmRelationships: "Direct sequel to 'Inside Out'.",
    culturalImpact: "Broke box office records for an animated film opening. Praised for expanding on the original's concepts by introducing new, more complex emotions related to adolescence.",
    productionBackstory: "The introduction of Anxiety as a primary character resonated strongly with audiences and was a major topic of discussion upon the film's release.",
    cultural_significance: 0.93,
  },
  elio: {
    canonicalName: 'Elio',
    releaseYear: 2025,
    runtimeMinutes: 0, // Unknown
    creators: { director: ['Adrian Molina'], writer: ['Adrian Molina'] },
    interFilmRelationships: "Upcoming film.",
    culturalImpact: "An original story about a boy who is accidentally transported across the galaxy and becomes Earth's ambassador.",
    productionBackstory: "The film's release was delayed from its original 2024 date.",
    cultural_significance: 0.5, // Speculative
  },
};

// --- Universe Export ---

/**
 * Every Pixar feature film from `Toy Story` (1995) through `Elio` (2025).
 */
export const pixarFilmUniverses: Universe[] = Object.keys(filmData).map((key) =>
  createPixarFilmUniverse(key, filmData[key]),
);
