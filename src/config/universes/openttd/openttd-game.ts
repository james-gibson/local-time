import { createGameUniverseId } from '../../../core/universe-ids';
import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../core/types';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * OpenTTD — the open-source transport simulation game (`game:openttd:openttd:2004`).
 *
 * The platform both OpenTTD universes in this namespace run on: Season 12 is a
 * community Let's Play of it, and the AI-vs-community video runs five copies of
 * AAAhogEX inside it.
 *
 * WHY `game:` AND NOT `technology:`. `UniverseType.GAME` exists precisely for
 * "a video game as a work: a base game, an expansion or a remaster", and the id
 * grammar is `game:<franchise>:<title>:<year>`. The franchise and the title are
 * both `openttd` — the game's own name — which is redundant but honest, and legal
 * under the declared GAME pattern.
 *
 * Reality Relation: `pure_fiction` at 1.0. The *project* is real, but the
 * universe being modelled is the authored game world — a simulated transport
 * economy — not the repository. That is the same convention the existing game
 * universes use (`games/pokemon.ts`), and it keeps the "is this a claim about
 * reality?" question answerable: no.
 *
 * Cultural Significance: 0.85 — a 20-year open-source project that has kept a
 * 1995 design alive, with a large modding and multiplayer community. Above the
 * domain band because the project is a landmark of open-source game preservation.
 *
 * Research Sources (retrieved 2026-10-19):
 * - https://github.com/OpenTTD/OpenTTD — README: "based upon the popular game
 *   Transport Tycoon Deluxe, written by Chris Sawyer", GPL v2, supported
 *   platforms; repository created 2018-04-06 (a mirror; the project predates it).
 * - https://www.openttd.org/about — "based upon the popular Microprose game
 *   'Transport Tycoon Deluxe', written by Chris Sawyer", GPL v2.
 * - https://en.wikipedia.org/wiki/OpenTTD — 0.1 released 2004-03-06.
 * - GitHub releases — latest stable 15.3, published 2026-04-04.
 */

const ns = (iso: string): bigint => dateToNanoseconds(new Date(iso));

/** OpenTTD 0.1, the first public release: 2004-03-06. */
const FIRST_RELEASE = ns('2004-03-06T00:00:00Z');

/** Latest stable at retrieval: 15.3, published 2026-04-04. */
const LATEST_STABLE = ns('2026-04-04T19:56:48Z');

export const openTTDGameUniverse = {
  universeId: createGameUniverseId('openttd', 'openttd', 2004),
  type: UniverseType.GAME,

  identifiers: {
    primary: 'game:openttd:openttd:2004',
    aliases: ['OpenTTD', 'Open TTD', 'open_ttd'],
  },

  realityRelation: {
    type: 'pure_fiction',
    fictionalizationDegree: 1.0,
    realityAnchors: [],
    disclaimer:
      'The game world is fictional. The project, its contributors, its source ' +
      'code and its releases are real and are recorded in attribution.sources.',
  },

  attribution: {
    public_domain: false,
    copyright: {
      // GPL v2: the copyright stays with the contributors; the licence is the
      // grant. Holders are recorded as the project, not as a rights-clearing body.
      holders: ['OpenTTD contributors'],
      year: 2004,
      status: 'active',
    },
    citations_required: false,
    usage_restrictions: [
      'GNU General Public License version 2.0 (with some third-party components under other licences; see the repository COPYING.md).',
    ],
    sources: [
      'https://github.com/OpenTTD/OpenTTD — README (GPL v2, lineage), repository metadata',
      'https://www.openttd.org/about — MicroProse / Chris Sawyer lineage, GPL v2, stable 15.3',
      'https://en.wikipedia.org/wiki/OpenTTD — 0.1 released 2004-03-06',
      'GitHub releases — 15.3 published 2026-04-04',
    ],
  },

  layers: [
    {
      layerId: 'primary',
      type: 'primary',
      epochs: {
        active: {
          epochId: 'game:openttd:openttd:release_window',
          startTime: FIRST_RELEASE,
          // No endTime: OpenTTD is still developed (15.3 at retrieval).
          precision: TimePrecision.DAY,
          description:
            'Open development and release window, from the 0.1 release on ' +
            '2004-03-06 to the present. The project predates its GitHub mirror ' +
            '(created 2018-04-06); the mirror is not the origin.',
        },
      },
    },
  ],

  temporalStructure: {
    segments: [],
    keyframes: [
      {
        id: 'openttd_0_1',
        timestamp: FIRST_RELEASE,
        significance: 1.0,
        tags: ['release', 'origin', 'version-0-1'],
        type: KeyframeType.RELEASE,
        certainty: 1.0,
        description:
          'OpenTTD 0.1 is released — the first public version of the ' +
          'open-source remake of Transport Tycoon Deluxe.',
      },
      {
        id: 'github_mirror_created',
        timestamp: ns('2018-04-06T18:06:22Z'),
        significance: 0.4,
        tags: ['repository', 'mirror', 'infrastructure'],
        certainty: 1.0,
        description:
          'The OpenTTD/OpenTTD GitHub mirror is created. Recorded because ' +
          'GitHub metadata dates the repository here, not because development ' +
          'began here.',
      },
      {
        id: 'openttd_15_3',
        timestamp: LATEST_STABLE,
        significance: 0.5,
        tags: ['release', 'stable', 'version-15-3'],
        type: KeyframeType.RELEASE,
        certainty: 1.0,
        description:
          'OpenTTD 15.3, the latest stable release at retrieval (2026-10-19).',
      },
    ],
    windows: { strategy: 'time_based' },
  },

  connections: {
    references: [
      {
        type: 'REMAKE_OF',
        targetUniverseId: 'game:transport_tycoon:deluxe:1995',
        confidence: 1.0,
        description:
          'OpenTTD is an open-source, reverse-engineered recreation of ' +
          'Transport Tycoon Deluxe, first released in 2004 and continuously ' +
          'expanded since.',
        evidence: [
          'Wikipedia (Transport Tycoon): "OpenTTD is an open source complete recreation of Transport Tycoon Deluxe, achieved by reverse engineering the original game with its first release in 2004."',
          'OpenTTD README: "based upon the popular game Transport Tycoon Deluxe, written by Chris Sawyer"',
          'openttd.org/about: "based upon the popular Microprose game \'Transport Tycoon Deluxe\', written by Chris Sawyer"',
        ],
      },
    ],
  },

  metadata: {
    canonicalName: 'OpenTTD',
    description:
      'An open-source business simulation game in which players build a ' +
      'transport empire by road, rail, water and air. It is an open-source ' +
      'remake and expansion of the 1995 Chris Sawyer game Transport Tycoon ' +
      'Deluxe (MicroProse), licensed under the GNU GPL v2.0.',
    creators: ['OpenTTD contributors'],
    released: new Date('2004-03-06T00:00:00Z'),
    cultural_significance: 0.85,

    gameFacts: {
      firstRelease: '2004-03-06',
      firstReleaseVersion: '0.1',
      latestStableAtRetrieval: '15.3',
      latestStableDate: '2026-04-04',
      license: 'GNU General Public License v2.0',
      implementationLanguage: 'C++',
      basedOn: {
        universeId: 'game:transport_tycoon:deluxe:1995',
        title: 'Transport Tycoon Deluxe',
        year: 1995,
        author: 'Chris Sawyer',
        publisher: 'MicroProse',
      },
      supportedPlatforms: ['Windows', 'macOS', 'Linux', 'Android', 'FreeBSD', 'Haiku', 'OS/2', 'Solaris'],
      externalLinks: {
        website: 'https://www.openttd.org/',
        repository: 'https://github.com/OpenTTD/OpenTTD',
        wiki: 'https://wiki.openttd.org/',
        steam: 'https://store.steampowered.com/app/1536610/OpenTTD/',
      },
      distributionNote: {
        text:
          'From 2026-03-13 the Steam and GOG listings are bundled with Atari\'s ' +
          'paid Transport Tycoon Deluxe port: existing owners keep OpenTTD, new ' +
          'buyers get it with TTD, and the download from openttd.org remains free.',
        source:
          'PCGamesN, 2026-03-13, quoting the OpenTTD GitHub announcement (see transport-tycoon-deluxe.ts)',
      },
      repositoryStatsAtRetrieval: {
        stars: 8_394,
        asOf: '2026-10-19',
        note: 'GitHub mirror only; the project predates it.',
      },
    },

    retrieval: {
      domain: 'transport simulation / open-source software',
      format: 'video game',
      subjects: ['OpenTTD', 'transport simulation', 'open source', 'game modding'],
      charge_source: 'realityRelation.type = pure_fiction -> the work is fiction, not a claim about events',
      weight_source: 'RealityGradient.level folded with cultural_significance (0.85)',
    },
  },
} as unknown as Universe;
