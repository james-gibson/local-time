import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { Universe, UniverseType, TimePrecision } from '../../../core';
import { distributedByRef, resolveFilmStudio } from '../studios';

/**
 * Warcraft (2016) — Legendary Pictures / Universal Pictures.
 *
 * james-gibson/local-time#115. The film half of the Warcraft cross-reference: a
 * real, released work whose fictionality is recorded in `realityRelation`, never
 * hidden. It is *not* the game: the games are a separate namespace and would be
 * linked here as a `reinterprets` anchor once a Warcraft game universe exists.
 *
 * ## Id
 *
 * The ticket proposed `film:legendary:warcraft:2016`. Two things are wrong with
 * it, and both are measurable rather than stylistic:
 *
 * - It has **four** segments, and no declared pattern accepts that shape — only
 *   the `ANY_YEAR_TERMINATED` catch-all (#50). `isValidUniverseId` therefore
 *   returns `true` for it, which is exactly why the permissive validator is not
 *   the guard to trust: assert the *domain* guard (`isFilmUniverseId`) instead.
 * - `film` is the **generic studio token** (`GENERIC_FILM_STUDIO_TOKEN`), meaning
 *   "no studio named" — not a namespace prefix, and not a distributor. Even as the
 *   three-segment `film:warcraft:2016` it would have dropped the distributor.
 *
 * The film vocabulary is `<studio-token>:<title>:<year>`, and the distributor is
 * Universal, which *is* a registered studio token — so the id names it:
 * `universal:warcraft:2016`.
 *
 * ## The unsourced "Christopher Pike" premise (ticket §4)
 *
 * The request stated the film stars "Christopher Pike". No source supports it:
 * the billed cast contains no such performer, and the only "Christopher Pike" in
 * the same reference set is an unrelated young-adult author. The claim is
 * therefore *not* recorded anywhere in this universe — it is recorded here, in
 * the file, as a data-quality note, so the next reader does not re-import it.
 *
 * ## Runtime keyframes
 *
 * A film's keyframes are *runtime positions* (nanoseconds since the first frame),
 * not calendar dates — the film is watched from 0, exactly like Die Hard
 * (`films/die-hard.ts`). The three act boundaries below are the ticket's
 * proposed positions; they are approximate and carry no `certainty` assertion
 * (a runtime position is exact by construction, an act boundary is a judgement,
 * and the distinction is the tags' job, not the timestamp's).
 *
 * Research Sources:
 * - Wikipedia, "Warcraft (film)" — cast, crew, production companies, runtime,
 *   release dates, box office.
 * - Box Office Mojo / The Numbers — $439.1M worldwide against a $160M budget.
 * - Rotten Tomatoes / Metacritic — 29% / 32; CinemaScore B+.
 *
 * Key Facts Verified:
 * - Runtime: 123 minutes
 * - Premiere: 24 May 2016 (Paris); US release 10 June 2016
 * - At release, the highest-grossing film based on a video game
 *
 * Hierarchical Context: UNIVERSAL_PICTURES -> HOLLYWOOD_SYSTEM -> US_HISTORY
 */

/** A runtime position in nanoseconds: minutes (and optional seconds) from the first frame. */
const runtime = (minutes: number, seconds = 0): bigint =>
  (BigInt(minutes) * 60n + BigInt(seconds)) * 1_000_000_000n;

const RUNTIME_MINUTES = 123;
const UNIVERSAL = resolveFilmStudio('universal')!.universeId;

export const warcraftFilmUniverse: Universe = {
  universeId: 'universal:warcraft:2016',
  type: UniverseType.FILM,
  identifiers: {
    primary: 'universal:warcraft:2016',
    aliases: ['Warcraft', 'Warcraft (2016)', 'Warcraft: The Beginning'],
  },
  realityRelation: {
    // Fantasy: the world of Azeroth is invented. The work is real; its content is
    // not. `fictionalizationDegree: 1.0` is that distinction, not a hedge.
    type: 'pure_fiction',
    fictionalizationDegree: 1.0,
    claimsHistoricalAccuracy: false,
    // No anchor yet. The real referent — the 1994 game the film adapts — has no
    // universe, and an anchor to an id nothing registers is a dangling
    // reference, not a connection (the #129 lesson). The edge is deferred, not
    // asserted, and `attribution.sources` records the source material instead.
    realityAnchors: [],
  },
  attribution: {
    public_domain: false,
    copyright: {
      holders: ['Universal Pictures', 'Legendary Pictures', 'Blizzard Entertainment'],
      year: 2016,
      status: 'active',
    },
    creators: {
      director: ['Duncan Jones'],
      writer: ['Charles Leavitt', 'Duncan Jones'],
      // Not a person: the credited source is a work. Recorded so the "Based on"
      // credit is not flattened into the screenwriters.
      based_on: ['Warcraft by Blizzard Entertainment'],
    },
    citations_required: true,
    usage_restrictions: [
      'Copyrighted. This record contains no dialogue, script, stills or footage and must not be used to reproduce protected material.',
      'Use as the *film adaptation*; for the games themselves use the (future) Warcraft game universes, not this record.',
    ],
    sources: [
      'Wikipedia, "Warcraft (film)" — cast, crew, production companies, runtime, release dates, box office',
      'Box Office Mojo / The Numbers — $439.1M worldwide against a $160M budget',
      'Rotten Tomatoes / Metacritic — 29% / 32; CinemaScore B+',
    ],
  },
  layers: [
    {
      layerId: 'runtime',
      type: 'primary',
      epochs: {
        // Explicit epochId: a missing one is silently renamed to the layer key by
        // the registry, which changes what every reference to it means (#19).
        runtime: {
          epochId: 'warcraft:runtime',
          startTime: 0n,
          endTime: runtime(RUNTIME_MINUTES),
          precision: TimePrecision.SECOND,
          description: 'Film runtime',
        },
      },
    },
  ],
  epochs: {},
  temporalStructure: {
    // Acts, in runtime nanoseconds. Gapless and non-overlapping: each act ends
    // where the next begins.
    segments: [
      {
        id: 'act_i',
        start: runtime(0),
        end: runtime(61, 30),
        type: 'act',
        status: 'active',
        description: 'Azeroth at peace; the Dark Portal opens and the orcs enter the world.',
      },
      {
        id: 'act_ii',
        start: runtime(61, 30),
        end: runtime(120),
        type: 'act',
        status: 'active',
        description: 'The alliance forms and the two sides seek a way to close the portal.',
      },
      {
        id: 'act_iii',
        start: runtime(120),
        end: runtime(RUNTIME_MINUTES),
        type: 'act',
        status: 'active',
        description: 'The portal confrontation and the cost of closing it.',
      },
    ],
    keyframes: [
      {
        id: 'stormwind_opens',
        timestamp: runtime(0),
        significance: 0.7,
        tags: ['act_i', 'prologue', 'dark_portal'],
        description:
          'The film opens on the orc homeworld of Draenor as the Horde, led by Gul\'dan, opens the Dark Portal to Azeroth.',
      },
      {
        id: 'dark_portal_midpoint',
        timestamp: runtime(61, 30),
        significance: 0.9,
        tags: ['act_ii', 'turning_point', 'alliance'],
        description:
          'The midpoint turn: the humans and the dissident orcs under Durotan move from conflict toward a common enemy.',
      },
      {
        id: 'climax_resolution',
        timestamp: runtime(120),
        significance: 1.0,
        tags: ['act_iii', 'climax', 'resolution'],
        description:
          'The climax at the Dark Portal: Khadgar and Lothar close it at the cost of a kingdom, and the surviving orcs stay on Azeroth.',
      },
    ],
    windows: { strategy: 'scene_based', avgWindowSize: runtime(10) },
  },
  metadata: {
    canonicalName: 'Warcraft',
    description:
      "Universal's adaptation of Blizzard Entertainment's Warcraft, directed by Duncan Jones. At release the highest-grossing film based on a video game, on the strength of its overseas market, but critically divisive.",
    creators: ['Duncan Jones'],
    released: new Date('2016-06-10T00:00:00Z'),
    cultural_significance: 0.8,
    cultural_description:
      'Highest-grossing video-game film at release and the first major-budget attempt to film the Warcraft universe; commercially notable, critically divisive (29% RT).',
    tags: ['film', 'fantasy', 'video_game_adaptation', 'video_game_film', 'high_fantasy'],
  },
  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.HOLLYWOOD_SYSTEM, UNIVERSAL],
    },
    references: [
      distributedByRef(
        'universal',
        'Distributed theatrically worldwide by Universal Pictures.',
      ),
    ],
  },
} as unknown as Universe;
