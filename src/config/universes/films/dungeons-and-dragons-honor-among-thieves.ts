import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { Universe, UniverseType, TimePrecision } from '../../../core';
import { distributedByRef, resolveFilmStudio } from '../studios';

/**
 * Dungeons & Dragons: Honor Among Thieves (2023) — Paramount Pictures.
 *
 * james-gibson/local-time#116. A real, released work whose fictionality is
 * recorded in `realityRelation`, never hidden. It is a *separate* universe from
 * the 2000–2012 D&D film trilogy, which it is not connected to, and from the
 * tabletop game it adapts (a different namespace; the anchor to the game is
 * deferred, see below).
 *
 * ## Id
 *
 * The title carries a colon and an ampersand, and the ticket's proposed
 * `film:paramount:…` id has **four** segments — no declared pattern accepts that
 * shape, so it passes only via the `ANY_YEAR_TERMINATED` catch-all (#50) and the
 * permissive `isValidUniverseId`. (`film` is also the *generic* studio token,
 * "no studio named", not a namespace.) The film vocabulary is
 * `<studio-token>:<title>:<year>`, and the distributor is Paramount, a
 * registered studio token.
 *
 * The id is **pinned explicitly** rather than derived from the title, because
 * `toIdFragment` strips the `&` and would emit `dungeons_dragons_…` — losing the
 * "and" that makes the slug readable. The pinned slug is
 * `dungeons_and_dragons_honor_among_thieves`, so the id is
 * `paramount:dungeons_and_dragons_honor_among_thieves:2023`.
 *
 * ## The deferred game anchor
 *
 * The film reinterprets a real game — *Dungeons & Dragons*, first published in
 * 1974 — so a `reinterprets` anchor is the right model. It is **not** asserted
 * here because no D&D game universe is registered, and an anchor to an id
 * nothing owns is a dangling reference rather than a connection (the #129
 * lesson). The first-publication year, too, is the reason the ticket flagged the
 * anchor as needing verification: the anchor is deferred until both the game
 * universe and its year exist in the registry.
 *
 * ## Runtime keyframes
 *
 * A film's keyframes are *runtime positions* (nanoseconds since the first
 * frame), not calendar dates. The three act boundaries below are the ticket's
 * proposed positions and are approximate — a runtime position is exact, an act
 * boundary is a judgement, and the tags carry the judgement.
 *
 * Research Sources:
 * - Wikipedia, "Dungeons & Dragons: Honor Among Thieves" — cast, crew,
 *   production companies, runtime, premiere and release dates, reception.
 * - Box Office Mojo / The Numbers — $208.2M worldwide ($93.3M domestic /
 *   $114.9M international) against a $150M budget.
 * - Rotten Tomatoes / Metacritic — 91% (7.4/10) / 72; CinemaScore A−.
 *
 * Key Facts Verified:
 * - Runtime: 134 minutes
 * - Premiere: 10 March 2023 (SXSW); US release 31 March 2023
 * - Setting: the Forgotten Realms; no continuity link to the 2000–2012 trilogy
 *
 * Hierarchical Context: PARAMOUNT_PICTURES -> HOLLYWOOD_SYSTEM -> US_HISTORY
 */

/** A runtime position in nanoseconds: minutes (and optional seconds) from the first frame. */
const runtime = (minutes: number, seconds = 0): bigint =>
  (BigInt(minutes) * 60n + BigInt(seconds)) * 1_000_000_000n;

const RUNTIME_MINUTES = 134;
const PARAMOUNT = resolveFilmStudio('paramount')!.universeId;

export const dungeonsAndDragonsHonorAmongThievesUniverse: Universe = {
  universeId: 'paramount:dungeons_and_dragons_honor_among_thieves:2023',
  type: UniverseType.FILM,
  identifiers: {
    primary: 'paramount:dungeons_and_dragons_honor_among_thieves:2023',
    aliases: [
      'Dungeons & Dragons: Honor Among Thieves',
      'D&D: Honor Among Thieves',
      'Honor Among Thieves',
    ],
  },
  realityRelation: {
    // Fantasy: the Forgotten Realms are invented. The work is real; its content is
    // not. `fictionalizationDegree: 1.0` is that distinction, not a hedge.
    type: 'pure_fiction',
    fictionalizationDegree: 1.0,
    claimsHistoricalAccuracy: false,
    // No anchor yet — see "The deferred game anchor" above. The real referent
    // (the 1974 game) has no universe, so the edge is deferred, not asserted.
    realityAnchors: [],
  },
  attribution: {
    public_domain: false,
    copyright: {
      holders: ['Paramount Pictures', 'Hasbro', 'Entertainment One'],
      year: 2023,
      status: 'active',
    },
    creators: {
      director: ['Jonathan Goldstein', 'John Francis Daley'],
      writer: ['Jonathan Goldstein', 'John Francis Daley', 'Michael Gilio'],
      // Not people: the credited source material and story credit. Kept apart so
      // the "Based on" credit is not flattened into the screenwriters.
      based_on: ['Dungeons & Dragons by Hasbro'],
    },
    citations_required: true,
    usage_restrictions: [
      'Copyrighted. This record contains no dialogue, script, stills or footage and must not be used to reproduce protected material.',
      'Use as the *film adaptation*; for the tabletop game use the (future) D&D game universes, not this record.',
    ],
    sources: [
      'Wikipedia, "Dungeons & Dragons: Honor Among Thieves" — cast, crew, production companies, runtime, release dates, reception',
      'Box Office Mojo / The Numbers — $208.2M worldwide against a $150M budget',
      'Rotten Tomatoes / Metacritic — 91% (7.4/10) / 72; CinemaScore A−; PostTrak 90%',
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
          epochId: 'dungeons_and_dragons_honor_among_thieves:runtime',
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
        end: runtime(67),
        type: 'act',
        status: 'active',
        description:
          'The escape from Revel\'s End prison, and the crew\'s reassembly around a heist.',
      },
      {
        id: 'act_ii',
        start: runtime(67),
        end: runtime(132),
        type: 'act',
        status: 'active',
        description:
          'The heist turns: the party learns who betrayed them, and the plan is rebuilt around that.',
      },
      {
        id: 'act_iii',
        start: runtime(132),
        end: runtime(RUNTIME_MINUTES),
        type: 'act',
        status: 'active',
        description: 'The Forge of Spells confrontation and the resolution.',
      },
    ],
    keyframes: [
      {
        id: 'escape_from_revels_end',
        timestamp: runtime(0),
        significance: 0.7,
        tags: ['act_i', 'cold_open', 'prison_break'],
        description:
          'The cold open: Edgin and Holga break out of Revel\'s End, establishing the party and the loss that drives the heist.',
      },
      {
        id: 'cemetery_interrogation_midpoint',
        timestamp: runtime(67),
        significance: 0.85,
        tags: ['act_ii', 'turning_point', 'betrayal'],
        description:
          'The midpoint: the dead are questioned in the cemetery, and the party learns Forge betrayed them — the plan turns from theft to rescue.',
      },
      {
        id: 'forgelight_climax_resolution',
        timestamp: runtime(132),
        significance: 1.0,
        tags: ['act_iii', 'climax', 'resolution'],
        description:
          'The climax at the Forge of Spells, where the party uses the plan\'s central trick to defeat Sofina and free the city.',
      },
    ],
    windows: { strategy: 'scene_based', avgWindowSize: runtime(11) },
  },
  metadata: {
    canonicalName: 'Dungeons & Dragons: Honor Among Thieves',
    description:
      "Paramount and Hasbro's fantasy heist film set in the Forgotten Realms, directed by Jonathan Goldstein and John Francis Daley. A critical and audience success — 91% on Rotten Tomatoes and an A− CinemaScore — and a commercial underperformer against its $150M budget.",
    creators: ['Jonathan Goldstein', 'John Francis Daley'],
    released: new Date('2023-03-31T00:00:00Z'),
    cultural_significance: 0.78,
    cultural_description:
      'The defining modern screen adaptation of Dungeons & Dragons: widely praised where the 2000–2012 films were not, and a template for adapting a game by dramatising the *table experience* rather than the lore. A commercial underperformer ($208.2M against a $150M budget) despite the reception.',
    tags: ['film', 'fantasy', 'video_game_adaptation', 'tabletop', 'heist', 'forgotten_realms'],
  },
  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.HOLLYWOOD_SYSTEM, PARAMOUNT],
    },
    references: [
      distributedByRef(
        'paramount',
        'Distributed theatrically by Paramount Pictures (Entertainment One in the UK and Canada).',
      ),
    ],
  },
} as unknown as Universe;
