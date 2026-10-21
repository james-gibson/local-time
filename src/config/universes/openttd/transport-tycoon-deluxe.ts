import { createGameUniverseId } from '../../../core/universe-ids';
import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../core/types';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * Transport Tycoon Deluxe — Chris Sawyer / MicroProse (1995).
 *
 * `game:transport_tycoon:deluxe:1995`. The franchise is `transport_tycoon` and
 * the title is `deluxe`, the same franchise/title split the declared GAME
 * grammar uses (`game:pokemon:red_blue:1996`). The original Transport Tycoon is
 * a separate 1994 game and is described here as context, not modelled as a node:
 * it has not had its own source pass.
 *
 * This is the ancestor of OpenTTD: OpenTTD began as a reverse-engineered
 * recreation of TTD. The `REMAKE_OF` edge lives on the OpenTTD universe; this
 * one is the target.
 *
 * Reality Relation: `pure_fiction` at 1.0. The product and its development
 * history are real; the authored game world is not, which is what this
 * relation describes (same convention as `games/pokemon.ts`).
 *
 * Cultural Significance: 0.90 — a landmark business-simulation game, named the
 * 50th greatest strategy game ever by Rock Paper Shotgun (2015), and still the
 * basis of OpenTTD and of the Season 12 community run 30 years later.
 *
 * Research Sources (retrieved 2026-10-19):
 * - https://en.wikipedia.org/wiki/Transport_Tycoon — release (MS-DOS, November
 *   1994 original; Deluxe, November 1995, Windows 95-compatible), designer and
 *   programmer Chris Sawyer, publisher MicroProse, composer John Broomhall,
 *   Deluxe features, 1950-2050 timeline, Atari IP acquisition (November 2024),
 *   2026 Steam/GOG re-release, and the OpenTTD relationship.
 * - https://www.gog.com/en/game/transport_tycoon_deluxe — "Created by Chris
 *   Sawyer in 1995", developer Chris Sawyer Productions, genres
 *   Simulation/Economic/Sandbox, © Atari Interactive.
 * - https://www.pcgamesn.com/transport-tycoon/deluxe-steam-gog-openttd (2026-03-13)
 *   — Atari bought the rights in November 2024; the port launched on Steam and
 *   GOG at $10 / £8.50; OpenTTD on those stores is now bundled with it, while
 *   the direct download stays free.
 * - The repository record of OpenTTD (see `openttd-game.ts`) for the
 *   reverse-engineering lineage.
 *
 * Key Facts Verified:
 * - Release: November 1995 (month verified; no day asserted).
 * - Designed and programmed by Chris Sawyer; published by MicroProse.
 * - In-game timeline: 1950 -> 2050 (the 1994 original started in 1930).
 * - Four climates: Temperate, Sub-Tropical, Arctic, Toyland.
 * - IP acquired by Atari in November 2024; TTD ported to Steam/GOG in March 2026.
 */

const ns = (iso: string): bigint => dateToNanoseconds(new Date(iso));

/** November 1995 — the month is sourced; the day is not asserted. */
const RELEASE_MONTH = ns('1995-11-01T00:00:00Z');

/** Atari acquired the Transport Tycoon IP in November 2024 (GamesIndustry.biz). */
const IP_ACQUIRED = ns('2024-11-04T00:00:00Z');

/** The Atari port released on Steam and GOG, 2026-03-13 (PCGamesN). */
const STEAM_GOG_PORT = ns('2026-03-13T00:00:00Z');

export const transportTycoonDeluxeUniverse = {
  universeId: createGameUniverseId('transport_tycoon', 'deluxe', 1995),
  type: UniverseType.GAME,

  identifiers: {
    primary: 'game:transport_tycoon:deluxe:1995',
    // "Transport Tycoon" is deliberately NOT an alias: that is the 1994
    // original, and aliases are global lookup keys. Claiming it here would make
    // a future 1994 node ambiguous.
    aliases: ['Transport Tycoon Deluxe', 'TTD'],
  },

  realityRelation: {
    type: 'pure_fiction',
    fictionalizationDegree: 1.0,
    realityAnchors: [],
    disclaimer:
      'The game world is fictional. The game, its developers, its publisher ' +
      'and its releases are real and are recorded in attribution and gameFacts.',
  },

  attribution: {
    public_domain: false,
    copyright: {
      // The original publisher and rights holder. The IP moved to Atari in 2024
      // — recorded separately in gameFacts.rightsOwner so the two dates are not
      // conflated.
      holders: ['MicroProse Software'],
      year: 1995,
      status: 'active',
    },
    creators: {
      director: ['Chris Sawyer (designer, programmer)'],
    },
    citations_required: false,
    usage_restrictions: [
      'Proprietary. Re-published by Atari Interactive; © 2025 Atari Interactive, Inc.',
    ],
    sources: [
      'https://en.wikipedia.org/wiki/Transport_Tycoon — release, credits, Deluxe features, 1950-2050, Atari acquisition, 2026 re-release',
      'https://www.gog.com/en/game/transport_tycoon_deluxe — "Created by Chris Sawyer in 1995", developer and publisher listing',
      'https://www.pcgamesn.com/transport-tycoon/deluxe-steam-gog-openttd (2026-03-13) — Atari IP purchase, Steam/GOG port, OpenTTD bundling',
    ],
  },

  layers: [
    {
      layerId: 'primary',
      type: 'primary',
      epochs: {
        available: {
          epochId: 'game:transport_tycoon:deluxe:availability',
          startTime: RELEASE_MONTH,
          // No endTime: the game remains available (rereleased 2026).
          precision: TimePrecision.MONTH,
          description:
            'Availability window, from the original MS-DOS release in November ' +
            '1995 to the present. The month is sourced; the exact day is not ' +
            'asserted.',
        },
      },
    },
  ],

  temporalStructure: {
    segments: [],
    keyframes: [
      {
        id: 'ttd_release',
        timestamp: RELEASE_MONTH,
        significance: 1.0,
        tags: ['release', 'origin', 'ms-dos', 'microprose'],
        type: KeyframeType.RELEASE,
        certainty: 0.9,
        description:
          'Transport Tycoon Deluxe is released by MicroProse in November 1995 — ' +
          'an expanded version of the 1994 Transport Tycoon, with four climates, ' +
          'an in-game timeline moved to 1950-2050, maglev, one-way signals and ' +
          'IPX multiplayer.',
      },
      {
        id: 'atari_acquires_ip',
        timestamp: IP_ACQUIRED,
        significance: 0.6,
        tags: ['rights', 'acquisition', 'atari'],
        type: KeyframeType.ACQUISITION,
        certainty: 0.9,
        description:
          'Atari buys the Transport Tycoon intellectual property from Chris ' +
          'Sawyer, announcing a long-term plan to preserve and expand the game.',
      },
      {
        id: 'steam_gog_port',
        timestamp: STEAM_GOG_PORT,
        significance: 0.7,
        tags: ['release', 'port', 'steam', 'gog', 'atari'],
        type: KeyframeType.RELEASE,
        certainty: 0.8,
        // The port was reported as "out now" on 2026-03-13; the exact launch
        // day is not asserted, only that it happened in the days before.
        dateRange: {
          earliest: ns('2026-03-10T00:00:00Z'),
          latest: ns('2026-03-13T00:00:00Z'),
        },
        description:
          'Atari releases an updated port of Transport Tycoon Deluxe on Steam ' +
          'and GOG ($10 / £8.50), reported as out on 2026-03-13. OpenTTD is ' +
          'bundled with it on those stores from this point, while the direct ' +
          'download from the OpenTTD site stays free.',
      },
    ],
    windows: { strategy: 'time_based' },
  },

  metadata: {
    canonicalName: 'Transport Tycoon Deluxe',
    description:
      'A business simulation game in which the player builds a transport ' +
      'empire across road, rail, water and air from 1950 to 2050. Designed and ' +
      'programmed by Chris Sawyer and published by MicroProse in 1995, it ' +
      'expanded the 1994 Transport Tycoon with four climates, maglev, one-way ' +
      'signals, share trading and IPX multiplayer. OpenTTD is its open-source ' +
      'reverse-engineered recreation.',
    creators: ['Chris Sawyer'],
    released: new Date('1995-11-01T00:00:00Z'),
    cultural_significance: 0.90,

    gameFacts: {
      firstRelease: '1995-11',
      firstReleasePrecision: 'month',
      originalGame: { title: 'Transport Tycoon', year: 1994 },
      designer: 'Chris Sawyer',
      programmer: 'Chris Sawyer',
      producer: 'Steve Ramsden',
      artist: 'Simon Foster',
      composer: 'John Broomhall',
      publisher: 'MicroProse Software',
      developer: 'Chris Sawyer Productions (GOG listing)',
      genres: ['business simulation', 'economic', 'sandbox'],
      platforms: ['MS-DOS', 'Windows 95 (compatible)'],
      ingameStartYear: 1950,
      ingameEndYear: 2050,
      ingameStartYearNote:
        'The 1994 original started in 1930; Deluxe moved the start to 1950. ' +
        'OpenTTD and the Season 12 run use operator-set start years, so neither ' +
        'default should be read into them.',
      climates: ['Temperate', 'Sub-Tropical', 'Arctic', 'Toyland'],
      notableFeatures: [
        'maglev trains',
        'one-way (uni-directional) signals',
        'buying and selling company shares',
        'buying land for future use',
        'funding new industry',
        'refitting ships and planes',
        'renaming vehicles, stations and towns in-game',
        'IPX network play',
        'World Editor / scenario editor',
      ],
      vehicleNaming: {
        original: 'real-life model names',
        deluxe: 'fictional names, changed for trademark reasons',
      },
      rightsOwner: {
        holder: 'Atari SA',
        since: '2024-11',
        note: 'Acquired from Chris Sawyer; the 2026 Steam/GOG port is Atari Interactive.',
      },
      rerelease: {
        platforms: ['Steam', 'GOG'],
        date: '2026-03-13',
        price: '$10 / £8.50',
      },
      externalLinks: {
        gog: 'https://www.gog.com/en/game/transport_tycoon_deluxe',
        // The official transporttycoon.com site is referenced by Wikipedia; its
        // current operation was not verified, so no claim is made about it.
      },
      awards: [
        { source: 'Rock Paper Shotgun', year: 2015, title: '50th greatest strategy game' },
      ],
    },

    retrieval: {
      domain: 'transport simulation / business simulation',
      format: 'video game',
      subjects: ['Transport Tycoon', 'Chris Sawyer', 'MicroProse', 'transport simulation', 'game preservation'],
      charge_source: 'realityRelation.type = pure_fiction -> the work is fiction, not a claim about events',
      weight_source: 'RealityGradient.level folded with cultural_significance (0.90)',
    },
  },
} as unknown as Universe;
