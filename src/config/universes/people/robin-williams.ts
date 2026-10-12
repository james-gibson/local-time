import { Universe, TimePrecision, KeyframeType } from '../../../core/types';
import { UniverseBuilder } from '../../../core/universe-builder';
import { CommonUniverseIds } from '../../../core/common-universe-ids';

/**
 * Robin Williams — A Select Filmography (1987–1997)
 *
 * Documents a selection of seminal films from the career of actor and comedian
 * Robin Williams. Each film is modelled as its own Universe (type FILM), carrying
 * its release timeline, cultural impact, production backstory, and specific
 * insights into Williams' comedic and dramatic craft.
 *
 * Hierarchical Context: every film is a member of `CommonUniverseIds.HOLLYWOOD_SYSTEM`
 * (`history:hollywood:1913`). The collection traces the character archetypes — the
 * manic improviser and the inspirational mentor — that thread his leading roles.
 *
 * Research Sources:
 * - Data compiled from public film databases (IMDb), encyclopedic sources
 *   (Wikipedia), and reputable entertainment news archives.
 * - Confidence is high: titles and release years are factual; the qualitative
 *   fields (relationships, impact, backstory, comic insight) are drawn from
 *   well-documented public records and critical reviews.
 *
 * See james-gibson/local-time#2 for the originating research task.
 *
 * Deviation from the originating sketch: the source data does not name a
 * distributor, and `isFilmUniverseId` only admits a fixed studio allow-list, so
 * each film declares its well-documented U.S. distributor as the ID's `studio`
 * segment. IDs are validated with `isValidUniverseId` (the generic form), not the
 * narrower `isFilmUniverseId`.
 */

/**
 * A within-collection cross reference from one Williams film to another.
 */
export interface RobinWilliamsFilmRelation {
  /** Full universe ID of the related film, e.g. `miramax:good_will_hunting:1997`. */
  targetUniverseId: string;
  /** Relationship kind. */
  type: 'thematically_linked' | 'references';
  confidence: number;
  description: string;
  evidence: string[];
}

/**
 * Qualitative metadata for a single Robin Williams feature film.
 *
 * The prose fields (`filmRelationships`, `culturalImpact`, `productionBackstory`,
 * `comicInsights`) are not part of the core `UniverseMetadata` shape; they are
 * preserved on `metadata` because the research task (#2) treats them as
 * first-class.
 */
export interface RobinWilliamsFilmMetadata {
  /** Slug used as the `title` segment of the universe ID. */
  slug: string;
  canonicalName: string;
  /** Lowercase U.S. distributor slug used as the ID's `studio` segment. */
  studio: string;
  releaseYear: number;
  runtimeMinutes: number;
  copyrightHolders: string[];
  creators: {
    director: string[];
    writer: string[];
  };
  filmRelationships: string;
  culturalImpact: string;
  productionBackstory: string;
  comicInsights: string;
  cultural_significance: number;
  /** Within-collection cross references; the `member_of` studio link is added automatically. */
  relations?: RobinWilliamsFilmRelation[];
  /**
   * Every way this film became available, in order.
   *
   * A film does not have one release date — it has a premiere, a wide release,
   * a home-video date, a LaserDisc, a DVD, a stream. Modelling only "the
   * release" makes a reference to it permanently ambiguous, which is what
   * motivated `KeyframeType` (local-time#3). Each entry becomes a keyframe
   * typed `RELEASE`, distinguished by `id`, so a reference can name the
   * specific one it means.
   */
  releases?: Array<{
    id: string;
    date: string;
    significance: number;
    tags?: string[];
    /** What distinguishes this release, e.g. "two theaters: El Capitan and City Cinemas". */
    note?: string;
  }>;
}

/**
 * Creates a complete Universe object for a Robin Williams film.
 *
 * The runtime epoch carries an explicit `epochId`: `UniverseRegistry.registerUniverse`
 * silently drops any universe whose layer epoch has no `epochId`, so omitting it
 * would leave these universes unregistered (see james-gibson/local-time#19).
 */
export const createRobinWilliamsFilmUniverse = (
  data: RobinWilliamsFilmMetadata,
): Universe => {
  const universeId = `${data.studio}:${data.slug}:${data.releaseYear}`;
  const runtimeNanoseconds = BigInt(data.runtimeMinutes) * BigInt(60) * BigInt(1_000_000_000);

  const builder = new UniverseBuilder()
    .film(data.studio, data.slug, data.releaseYear)
    .withId(universeId)
    .withAliases([data.canonicalName])
    .withRealityRelation('pure_fiction', 1.0)
    .withCopyright(data.copyrightHolders, data.releaseYear, 'active')
    .withCreators({
      director: data.creators.director,
      writer: data.creators.writer,
      participant: ['Robin Williams'],
    })
    .withReleaseDate(`${data.releaseYear}-01-01`)
    .withCulturalSignificance(data.cultural_significance, data.culturalImpact)
    .addEpoch('runtime', 'main', {
      epochId: 'runtime',
      startTime: 0n,
      endTime: runtimeNanoseconds,
      precision: TimePrecision.SECOND,
      description: `${data.runtimeMinutes} minute theatrical runtime`,
    })
    // Every film is contained by the Hollywood studio system.
    .addConnection({
      targetUniverseId: CommonUniverseIds.HOLLYWOOD_SYSTEM,
      type: 'member_of',
      confidence: 1.0,
      description: 'Released within the Hollywood studio system.',
      evidence: ['Theatrical release by a Hollywood distributor.'],
    });

  for (const relation of data.relations ?? []) {
    builder.addConnection({
      targetUniverseId: relation.targetUniverseId,
      type: relation.type,
      confidence: relation.confidence,
      description: relation.description,
      evidence: relation.evidence,
    });
  }

  // Every way the film became available. A film has several releases, not one —
  // see the `releases` field on RobinWilliamsFilmMetadata. Each is typed RELEASE
  // and distinguished by id, so a reference can name the specific one it means.
  for (const release of data.releases ?? []) {
    builder.addDateKeyframe(release.date, release.id, release.significance, [
      'release',
      ...(release.tags ?? []),
    ], { type: KeyframeType.RELEASE });
  }

  const universe = builder.build();

  universe.metadata = {
    ...universe.metadata,
    canonicalName: data.canonicalName,
    creators: [...data.creators.director, ...data.creators.writer, 'Robin Williams'],
    released: new Date(Date.UTC(data.releaseYear, 0, 1)),
    cultural_significance: data.cultural_significance,
    // Rich qualitative fields preserved from the source research (issue #2).
    releaseYear: data.releaseYear,
    runtimeMinutes: data.runtimeMinutes,
    studio: data.studio,
    filmRelationships: data.filmRelationships,
    culturalImpact: data.culturalImpact,
    productionBackstory: data.productionBackstory,
    comicInsights: data.comicInsights,
    parentContext: CommonUniverseIds.HOLLYWOOD_SYSTEM,
  } as any;

  return universe;
};

// --- Film universes referenced by the thematic links below ---

const GOOD_MORNING_VIETNAM = 'touchstone_pictures:good_morning_vietnam:1987';
const DEAD_POETS_SOCIETY = 'touchstone_pictures:dead_poets_society:1989';
const MRS_DOUBTFIRE = '20th_century_fox:mrs_doubtfire:1993';
const THE_BIRDCAGE = 'united_artists:the_birdcage:1996';
const GOOD_WILL_HUNTING = 'miramax:good_will_hunting:1997';

// --- Film Data ---

const filmData: RobinWilliamsFilmMetadata[] = [
  {
    slug: 'good_morning_vietnam',
    canonicalName: 'Good Morning, Vietnam',
    studio: 'touchstone_pictures',
    releaseYear: 1987,
    runtimeMinutes: 121,
    copyrightHolders: ['Touchstone Pictures', 'Silver Screen Partners III'],
    creators: { director: ['Barry Levinson'], writer: ['Mitch Markowitz'] },
    filmRelationships:
      "Showcased Williams' ability to blend manic comedy with serious drama, a pattern seen later in films like 'Dead Poets Society' and 'Good Will Hunting'. It was his first Academy Award nomination for Best Actor.",
    culturalImpact:
      "The film was a major critical and commercial success, solidifying Williams' status as a leading man. His portrayal of Adrian Cronauer became an iconic representation of the anti-authoritarian spirit during the Vietnam War era.",
    productionBackstory:
      "Director Barry Levinson allowed Williams to improvise all of Cronauer's radio broadcasts. Williams would reportedly do a different monologue for every single take, meaning the crew was often hearing the material for the first time during filming.",
    comicInsights:
      "This film is a masterclass in character-based improvisation. Williams isn't just telling jokes; he's using comedy as the character's weapon and coping mechanism. Notice how the energy shifts between his on-air persona and his off-air interactions.",
    cultural_significance: 0.92,
    relations: [
      {
        targetUniverseId: DEAD_POETS_SOCIETY,
        type: 'thematically_linked',
        confidence: 0.9,
        description:
          "The blend of manic comedy and serious drama carried into the mentor role of Dead Poets Society.",
        evidence: ['Manic comedy fused with drama', "Williams' first Best Actor nomination"],
      },
      {
        targetUniverseId: GOOD_WILL_HUNTING,
        type: 'thematically_linked',
        confidence: 0.9,
        description:
          'The comedy-to-drama register established here culminates in the dramatic mentor role of Good Will Hunting.',
        evidence: ['Career-wide dramatic-range analysis', 'Recurring mentor archetype'],
      },
    ],
  },
  {
    slug: 'dead_poets_society',
    canonicalName: 'Dead Poets Society',
    studio: 'touchstone_pictures',
    releaseYear: 1989,
    runtimeMinutes: 128,
    copyrightHolders: ['Touchstone Pictures', 'Silver Screen Partners IV'],
    creators: { director: ['Peter Weir'], writer: ['Tom Schulman'] },
    filmRelationships:
      "Continued his exploration of inspirational, mentor-like figures, a role he would revisit in 'Good Will Hunting'. It marked a significant step in his career towards more dramatic roles.",
    culturalImpact:
      "The phrase 'O Captain! My Captain!' became a cultural touchstone, and the film is credited with inspiring countless students and teachers. It championed non-conformity and the importance of the arts.",
    productionBackstory:
      "The emotional final scene where the students stand on their desks was difficult for the young actors. Williams, staying in character as John Keating, helped them through it by telling jokes between takes to lighten the mood, then immediately switching back to the scene's gravitas.",
    comicInsights:
      "A key lesson here is the power of a 'high-status' character who uses comedy to connect, not to dominate. Williams' Keating uses humor to disarm his students and make complex ideas accessible. His performance is restrained, showing that a comic doesn't always need to be the loudest person in the room.",
    cultural_significance: 0.94,
    relations: [
      {
        targetUniverseId: GOOD_WILL_HUNTING,
        type: 'references',
        confidence: 0.9,
        description:
          'The inspirational mentor archetype (John Keating) recurs as Sean Maguire in Good Will Hunting.',
        evidence: ['Mentor-figure archetype', "Williams' move toward dramatic roles"],
      },
    ],
  },
  {
    slug: 'aladdin',
    canonicalName: 'Aladdin',
    studio: 'disney',
    releaseYear: 1992,
    runtimeMinutes: 90,
    copyrightHolders: ['Walt Disney Pictures'],
    creators: {
      director: ['Ron Clements', 'John Musker'],
      writer: ['Ron Clements', 'John Musker', 'Ted Elliott', 'Terry Rossio'],
    },
    filmRelationships:
      "This role is thematically linked to his many performances where he acts as a magical friend or helper ('Jack', 'Bicentennial Man'). It was a major voice-acting role that defined a new era for animated films.",
    culturalImpact:
      "Williams' performance is widely credited with revolutionizing the role of celebrity voice actors in animation. Studios began seeking major stars to build animated films around, a trend that continues today.",
    productionBackstory:
      'Williams recorded approximately 30 hours of improvised material for the role. He famously had a falling out with Disney after they used his voice and the Genie character in marketing materials against his explicit wishes, though they later reconciled.',
    comicInsights:
      "The Genie is pure, unrestrained improvisation. Williams' ability to rapidly cycle through impressions, characters, and anachronistic references became the character's signature. For a comic, this is a study in free association and finding comedic game from a single premise ('what if a genie knew 20th-century pop culture?').",
    cultural_significance: 0.96,
    releases: [
      {
        id: 'us-premiere',
        date: '1992-11-11',
        significance: 0.8,
        tags: ['premiere', 'two-theaters'],
        note: 'Two theaters only: the El Capitan in Los Angeles and the City Cinemas 1-2-3 in New York.',
      },
      {
        id: 'us-wide-release',
        date: '1992-11-25',
        significance: 1.0,
        tags: ['wide-release', 'theatrical'],
        note: 'Expanded to 1,131 theaters; the release the marketing campaign was visible at, and the one the Disney dispute is anchored to.',
      },
      {
        id: 'us-vhs',
        date: '1993-09-29',
        significance: 0.95,
        tags: ['home-video', 'walt-disney-classics'],
        note: 'First VHS release, in the Walt Disney Classics line; not officially advertised until 1993-10-01.',
      },
      {
        id: 'us-laserdisc',
        date: '1994-09-21',
        significance: 0.5,
        tags: ['laserdisc', 'thx'],
        note: 'THX-certified widescreen LaserDisc.',
      },
      {
        id: 'us-dvd-platinum',
        date: '2004-10-05',
        significance: 0.7,
        tags: ['dvd', 'platinum-edition'],
        note: 'Platinum Edition: re-released on VHS and released on DVD for the first time.',
      },
      {
        id: 'digital-hd',
        date: '2015-09-29',
        significance: 0.5,
        tags: ['digital-hd'],
      },
    ],
  },
  {
    slug: 'mrs_doubtfire',
    canonicalName: 'Mrs. Doubtfire',
    studio: '20th_century_fox',
    releaseYear: 1993,
    runtimeMinutes: 125,
    copyrightHolders: ['20th Century Fox'],
    creators: {
      director: ['Chris Columbus'],
      writer: ['Randi Mayem Singer', 'Leslie Dixon'],
    },
    filmRelationships:
      "This film showcases his talent for physical comedy and character transformation, similar to his work in 'Popeye' and 'The Birdcage'. It became one of his most beloved family-friendly roles.",
    culturalImpact:
      'The film was a massive box office success and became an enduring classic for 90s kids. It tackled the subject of divorce in a way that was both hilarious and heartfelt, making it accessible to families.',
    productionBackstory:
      'The makeup process took over four hours each day. Williams would sometimes walk around San Francisco in full Mrs. Doubtfire costume to test its believability. He reportedly once went into an adult bookstore in character to see the reaction.',
    comicInsights:
      "This role is a prime example of 'commitment to the bit.' Williams fully inhabits the physical and vocal persona of Mrs. Doubtfire. Budding comics can learn from the specificity of his character work — it's not just a man in a dress; it's a fully realized, albeit eccentric, elderly woman.",
    cultural_significance: 0.90,
    relations: [
      {
        targetUniverseId: THE_BIRDCAGE,
        type: 'thematically_linked',
        confidence: 0.85,
        description:
          'The character-transformation physical comedy continued in the cross-dressing role of The Birdcage.',
        evidence: ['Physical comedy and character transformation', 'Comparison noted in the source research'],
      },
    ],
  },
  {
    slug: 'the_birdcage',
    canonicalName: 'The Birdcage',
    studio: 'united_artists',
    releaseYear: 1996,
    runtimeMinutes: 117,
    copyrightHolders: ['United Artists', 'MGM/UA'],
    creators: { director: ['Mike Nichols'], writer: ['Elaine May'] },
    filmRelationships:
      'Paired him with Nathan Lane, creating one of the most memorable comedic duos of the 90s. It continued his trend of starring in films with strong ensemble casts and social commentary.',
    culturalImpact:
      'The film was a mainstream breakthrough for LGBTQ+ representation in cinema. It was praised for its humor and heart, presenting a gay couple as a loving, stable family unit at a time when this was rare in Hollywood.',
    productionBackstory:
      "Director Mike Nichols encouraged improvisation between Williams and Lane to build their chemistry. Many of the film's funniest moments, including the 'shrimp' scene, were born from on-set ad-libs that were then incorporated into the script.",
    comicInsights:
      "This film demonstrates the art of being a comedic 'straight man' (or, in this case, the less flamboyant partner). Williams' performance grounds the film, allowing Nathan Lane's more theatrical character to shine. It's a lesson in sharing the comedic spotlight and reacting authentically to your scene partner.",
    cultural_significance: 0.88,
  },
  {
    slug: 'good_will_hunting',
    canonicalName: 'Good Will Hunting',
    studio: 'miramax',
    releaseYear: 1997,
    runtimeMinutes: 126,
    copyrightHolders: ['Miramax Films'],
    creators: { director: ['Gus Van Sant'], writer: ['Matt Damon', 'Ben Affleck'] },
    filmRelationships:
      "Represents the pinnacle of his dramatic, mentor-figure roles, earning him an Academy Award for Best Supporting Actor. It shares thematic DNA with 'Dead Poets Society' and 'Awakenings' — films about unlocking human potential.",
    culturalImpact:
      'The film was a cultural phenomenon, launching the careers of Matt Damon and Ben Affleck. The park bench scene became instantly iconic and is one of the most quoted and parodied scenes of the decade.',
    productionBackstory:
      "The line 'It's not your fault' was improvised by Williams. When Sean Maguire (Williams) keeps repeating it and Will Hunting (Damon) breaks down and cries, Damon's reaction was reportedly genuine and unexpected, as Williams' delivery was so powerful.",
    comicInsights:
      'This performance is a masterclass in emotional honesty. The comedy is subtle, used to build rapport and trust with the patient. The lesson for a comic is that the skills used to read an audience and connect with them are the same skills needed for powerful dramatic acting. It is about empathy and timing.',
    cultural_significance: 0.96,
    relations: [
      {
        targetUniverseId: DEAD_POETS_SOCIETY,
        type: 'references',
        confidence: 0.9,
        description:
          'Shares thematic DNA with Dead Poets Society — films about unlocking human potential.',
        evidence: ["Source research: 'shares thematic DNA with Dead Poets Society'", 'Mentor unlocking a pupil'],
      },
    ],
  },
];

/**
 * The complete selection: six feature films spanning 1987–1997.
 */
export const robinWilliamsFilmography: Universe[] = filmData.map(
  createRobinWilliamsFilmUniverse,
);
