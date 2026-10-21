import { createUniverseId } from '../../../core/universe-ids';
import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../core/types';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * AAAhogEx — the OpenTTD AI script (`technology:aaahogex:2022`).
 *
 * This is the agent at the centre of the AI-vs-community video: five instances
 * of it are run against the Season 12 Part 2 (Y2000) canvas. The file records
 * the *software*, which is a real, verifiable work — not the in-game companies
 * it produces, which stay in the video's recreation layer.
 *
 * ID: `technology:aaahogex:2022`. The slug is the AI's declared name lowercased
 * (`GetName()` returns "AAAhogEx"); the year is the first public record of the
 * project (the GitHub repository, 2022-01-04), not a guessed founding date.
 * `createTechnologyUniverseId` cannot express a dated id (it only emits
 * `technology:<name>:*`), so the id is routed through `createUniverseId`.
 *
 * Reality Relation: `documentary` at 0.0. The project, its author, its releases
 * and its declared capabilities are real. What the script *does inside a game*
 * is simulated and is described by whichever universe runs it.
 *
 * Cultural Significance: 0.45 — a well-regarded OpenTTD AI (34 GitHub stars,
 * 12 tagged releases) that is notable within the game's AI-scripting community
 * but not a cross-domain work.
 *
 * Research Sources (retrieved 2026-10-19):
 * - https://github.com/rei-artist/AAAHogEx — repository created 2022-01-04,
 *   GPL-3.0, Squirrel, "Openttd AI".
 * - info.nut in that repository — `GetAuthor()` "Rei Ishibashi",
 *   `GetName()` "AAAhogEx", `GetShortName()` "HOGE", `GetVersion()` 115,
 *   `GetDate()` "2026-03-18", `GetAPIVersion()` "14", and the declared feature
 *   description (trains, trams, cars, trucks, ships, airplanes; major-mod
 *   compatibility).
 * - GitHub releases — v1 published 2022-01-30; v85, the last tagged GitHub
 *   release, published 2024-06-16 (12 releases total).
 */

const ns = (iso: string): bigint => dateToNanoseconds(new Date(iso));

/** The repository is the earliest public record of the project. */
const PROJECT_PUBLIC = ns('2022-01-04T11:12:11Z');

/** First tagged release: v1, 2022-01-30. */
const FIRST_RELEASE = ns('2022-01-30T04:18:31Z');

/** Last tagged GitHub release: v85, 2024-06-16. Development continues in-tree. */
const LAST_TAGGED_RELEASE = ns('2024-06-16T12:56:47Z');

/** The in-tree version recorded by info.nut at retrieval: 115, dated 2026-03-18. */
const CURRENT_VERSION = ns('2026-03-18T00:00:00Z');

export const aaahogexUniverse = {
  universeId: createUniverseId('technology:aaahogex:2022'),
  type: UniverseType.TECHNOLOGY,

  identifiers: {
    primary: 'technology:aaahogex:2022',
    aliases: ['AAAhogEx', 'AAAHogEx', 'HogeAI', 'HOGE', 'AAAHogEx AI'],
  },

  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: 'technology:aaahogex:2022',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'GitHub repository rei-artist/AAAHogEx (created 2022-01-04)',
          'info.nut declares GetName() "AAAhogEx", GetAuthor() "Rei Ishibashi", GetVersion() 115',
          'Release v1 published 2022-01-30',
        ],
      },
    ],
  },

  attribution: {
    public_domain: false,
    copyright: {
      holders: ['Rei Ishibashi'],
      year: 2022,
      status: 'active',
    },
    citations_required: false,
    usage_restrictions: [
      'GNU General Public License v3.0. Redistribution and derivative AIs must preserve the licence terms.',
    ],
    sources: [
      'https://github.com/rei-artist/AAAHogEx — repository metadata and README ("HogeAI / Openttd AAAHogEx AI")',
      'info.nut in the repository — author, name, version, date, AI API version, declared capabilities',
      'GitHub releases — v1 (2022-01-30) through v85 (2024-06-16)',
    ],
  },

  layers: [
    {
      layerId: 'development',
      type: 'primary',
      epochs: {
        active: {
          epochId: 'technology:aaahogex:development',
          startTime: PROJECT_PUBLIC,
          // No endTime: the script is still maintained (version 115, 2026-03-18).
          precision: TimePrecision.DAY,
          description:
            'Public development window. Start is the GitHub repository creation ' +
            '(2022-01-04), the earliest public record; the script may predate it, ' +
            'and no earlier public artefact was found.',
        },
      },
    },
  ],

  temporalStructure: {
    segments: [],
    keyframes: [
      {
        id: 'project_public',
        timestamp: PROJECT_PUBLIC,
        significance: 0.7,
        tags: ['origin', 'repository', 'publication'],
        type: KeyframeType.LAUNCH,
        certainty: 1.0,
        description:
          'The AAAhogEx repository is created — the earliest public record of ' +
          'the project.',
      },
      {
        id: 'release_v1',
        timestamp: FIRST_RELEASE,
        significance: 0.9,
        tags: ['release', 'v1', 'first-release'],
        type: KeyframeType.RELEASE,
        certainty: 1.0,
        description: 'Release v1: the first tagged release of AAAhogEx.',
      },
      {
        id: 'release_v85',
        timestamp: LAST_TAGGED_RELEASE,
        significance: 0.5,
        tags: ['release', 'v85', 'last-tagged-release'],
        type: KeyframeType.RELEASE,
        certainty: 1.0,
        description:
          'Release v85, the last release tagged on GitHub (2024-06-16). ' +
          'Versioning continues in-tree; the absence of later tags is not the ' +
          'end of development.',
      },
      {
        id: 'version_115',
        timestamp: CURRENT_VERSION,
        significance: 0.6,
        tags: ['version', 'v115', 'current'],
        type: KeyframeType.MILESTONE,
        certainty: 0.9,
        description:
          'info.nut records version 115 dated 2026-03-18 — the version current ' +
          'at retrieval. No GitHub release accompanies it.',
      },
    ],
    windows: { strategy: 'time_based' },
  },

  connections: {
    references: [
      {
        type: 'RUNS_ON',
        targetUniverseId: 'game:openttd:openttd:2004',
        confidence: 1.0,
        description:
          'AAAhogEx is an OpenTTD AI: a Squirrel script loaded by the game ' +
          'through its AI API (declared API version 14).',
        evidence: [
          'info.nut extends AIInfo and returns GetAPIVersion() "14"',
          'Repository description: "Openttd AI"',
        ],
      },
    ],
  },

  metadata: {
    canonicalName: 'AAAhogEx',
    description:
      'An aggressive, highly profitable OpenTTD AI script by Rei Ishibashi. It ' +
      'supports trains, trams, cars, trucks, ships and airplanes, is compatible ' +
      'with most major mods, and is instantiated five times in the AI-vs-' +
      'community experiment against the Season 12 map.',
    creators: ['Rei Ishibashi'],
    released: new Date('2022-01-30T04:18:31Z'),
    cultural_significance: 0.45,

    technologyFacts: {
      kind: 'OpenTTD AI script',
      implementationLanguage: 'Squirrel',
      internalClassName: 'HogeAI',
      shortName: 'HOGE',
      license: 'GPL-3.0',
      currentVersion: 115,
      currentVersionDate: '2026-03-18',
      openTtdAiApiVersion: '14',
      supportedModes: ['trains', 'trams', 'cars', 'trucks', 'ships', 'airplanes'],
      declaredModCompatibility: 'most major mods',
      releaseCountOnGitHub: 12,
      firstRelease: { version: 'v1', date: '2022-01-30' },
      lastTaggedRelease: { version: 'v85', date: '2024-06-16' },
      externalLinks: {
        repository: 'https://github.com/rei-artist/AAAHogEx',
        // The script's own description points readers at its setup guide, but
        // does not give the URL in info.nut, so no guide link is asserted here.
      },
      repositoryStatsAtRetrieval: {
        stars: 34,
        asOf: '2026-10-19',
      },
    },

    retrieval: {
      domain: 'transport simulation / game AI',
      format: 'software / AI script',
      subjects: ['OpenTTD', 'artificial intelligence', 'agent design', 'game modding'],
      charge_source: 'realityRelation.type = documentary -> +1 (non-fiction tier)',
      weight_source: 'RealityGradient.level folded with cultural_significance (0.45)',
    },
  },
} as unknown as Universe;
