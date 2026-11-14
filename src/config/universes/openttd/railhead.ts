import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../core/types';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * Railhead — an RL environment where a language model plays OpenTTD from a shell
 * (`technology:railhead:2026`).
 *
 * PROVENANCE. The record of truth is the vault document
 * `kb/lore/lore/railhead.md`, which is enrolled in the local-time sync
 * (`local-time-sync: true`). This module is the committed projection of that doc:
 * `imported/` is git-ignored because the vault is private, and Railhead's facts
 * are public, so the universe is carried here where it can be registered by a
 * clean checkout. Regenerating the pipeline rewrites
 * `src/config/universes/imported/technology_railhead_2026.ts`; delete that copy if
 * you keep this one, because two definitions of one id is the duplication #74/#75
 * warns about (the registry would warn and skip the second).
 *
 * WHY `technology:` AND NOT `game:`. The universe is not the simulated transport
 * economy OpenTTD runs — that is `game:openttd:openttd:2004`, declared here as a
 * parent and as an `EXTENDS` reference. Railhead is real software built around
 * that game: an environment, a verifier and a task catalog.
 *
 * WHY `documentary`. Every keyframe is a commit, a tag, a published result or a
 * document in the upstream repository at the pinned commit. The game is the
 * fiction; the record is the real artefact. Gradient 0.
 *
 * THE ZERO POINT is the first commit (`2026-10-16T08:07:15Z`), not the Arena 2
 * start. The scaffold is when the project exists; the arena is what it did seven
 * hours later — `arena-2-opens` sits at T+02:05:45.
 *
 * SOURCES: the repository at `6158e15907f9b644d8afbe3fccd8e42e0917cfc0`
 * (2026-11-10), its tag objects and its commit history, retrieved 2026-11-14.
 * Commit timestamps are author dates, which is what the log records.
 *
 * LICENCE. The record describes MIT software (the harness) with GPL-2.0-only
 * parts (the engine patches and the GameScript bridge). The universe is a record
 * about that work, not a copy of it.
 */

const ns = (iso: string): bigint => dateToNanoseconds(new Date(iso));

const ZERO = '2026-10-16T08:07:15Z';

/** The commit every fact in this module was read from. */
export const RAILHEAD_PIN = '6158e15907f9b644d8afbe3fccd8e42e0917cfc0';

export const technologyRailhead2026Universe = {
  universeId: 'technology:railhead:2026',
  type: UniverseType.TECHNOLOGY,

  identifiers: {
    primary: 'technology:railhead:2026',
    aliases: ['railhead', 'rh', 'railhead env'],
  },

  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0,
    realityAnchors: [
      {
        realEventId: 'technology:railhead:2026',
        relationshipType: 'documents',
        confidence: 1,
        evidence: [
          `the commit history of rachittshah/railhead at ${RAILHEAD_PIN}`,
          'tag objects v0.1.0 and v0.1.1',
          'README.md and CHANGELOG.md at the pinned commit',
        ],
      },
    ],
  },

  attribution: {
    public_domain: false,
    copyright: {
      holders: ['Rachit Shah'],
      year: 2026,
      status: 'active',
    },
    citations_required: true,
    usage_restrictions: [
      'MIT for the harness and the Python package; GPL-2.0-only for the engine patches and the GameScript bridge (NOTICE and LICENSES/ upstream).',
    ],
    sources: [
      'https://github.com/rachittshah/railhead — README (arena terms, results, limits)',
      'https://github.com/rachittshah/railhead/blob/main/CHANGELOG.md — 0.1.2 unreleased; 0.1.1 published',
      'https://github.com/rachittshah/railhead/blob/main/docs/ARCHITECTURE.md — engine patches, layers',
      'https://github.com/rachittshah/railhead/blob/main/docs/VERIFICATION.md — threat model, open attacks',
      'https://github.com/rachittshah/railhead/blob/main/docs/TASKS.md — the catalog and its families',
      'https://github.com/rachittshah/railhead/blob/main/tests/unit/test_redteam.py — five strict xfail gaps',
      'https://github.com/rachittshah/railhead — commit history, author dates, retrieved 2026-11-14',
    ],
  },

  connections: {
    natural: {
      // The platform this environment drives. `SOFTWARE_ENGINEERING` is a
      // discipline container, not a universe: declaring it here would create a
      // containment edge that resolves to nothing.
      parentUniverses: ['game:openttd:openttd:2004'],
    },
    references: [
      {
        type: 'EXTENDS',
        targetUniverseId: 'game:openttd:openttd:2004',
        description:
          'Railhead patches a stock OpenTTD 15.3 dedicated server with three changes (gamespeed and reseed, 1 ms paused frames, a 32 KB GameScript JSON limit) and drives it through a GameScript bridge.',
        confidence: 1,
      },
      {
        type: 'THEMATICALLY_LINKED',
        targetUniverseId: 'technology:aaahogex:2022',
        description:
          'AAAHogEx is one of the eleven community script AIs used as a ceiling reference on the arena map: about £180M against £41.3M for Opus, and five of the eleven beat Opus in every seed.',
        confidence: 0.8,
      },
    ],
  },

  epochs: {},
  layers: [
    {
      layerId: 'primary',
      type: 'primary',
      epochs: {
        zero_reference: {
          epochId: 'zero_reference',
          startTime: ns(ZERO),
          precision: TimePrecision.SECOND,
          zeroPoint: ns(ZERO),
          zeroEvent:
            'The first commit — "Scaffold Railhead and write the design". The project exists before any model plays.',
          beforePrefix: 'T-',
          afterPrefix: 'T+',
          relativeFormat: 'HMS',
          zeroStatus: 'established',
        },
        scaffold: {
          epochId: 'scaffold',
          start: ns(ZERO),
          end: ns('2026-10-16T09:57:14Z'),
          precision: TimePrecision.SECOND,
          description:
            'Seven hours of scaffolding: the engine patches, the admin-port client, the player actions, the observation layer and the first task catalog, ending at the v0.1.0 tag.',
        },
        'arena-2': {
          epochId: 'arena-2',
          start: ns('2026-10-16T10:13:00Z'),
          end: ns('2026-10-17T13:30:03Z'),
          precision: TimePrecision.SECOND,
          description:
            'Sixteen companies on arena-dev-0100: eleven models, then five free ones, one game each, ten years and a 365-day run-off.',
        },
        hardening: {
          epochId: 'hardening',
          start: ns('2026-10-20T09:28:34Z'),
          end: ns('2026-11-10T13:27:06Z'),
          precision: TimePrecision.DAY,
          description:
            'The claims get tests: resume after a provider failure, verifier hardening, the threat table, licence files, one version source, and the Arena 2 timelapse.',
        },
        pinned: {
          epochId: 'pinned',
          start: ns('2026-11-10T13:27:06Z'),
          end: ns('2026-11-14T00:00:00Z'),
          precision: TimePrecision.DAY,
          description:
            'The commit this record pins. CHANGELOG.md at this commit says 0.1.2 is unreleased; v0.1.1 is the latest published tag.',
        },
      },
    },
  ],

  temporalStructure: {
    segments: [
      {
        id: 'scaffold',
        start: ns(ZERO),
        end: ns('2026-10-16T09:57:14Z'),
        type: 'phase',
        status: 'inactive',
        description: 'The interface is built before anything plays on it.',
      },
      {
        id: 'arena-2',
        start: ns('2026-10-16T10:13:00Z'),
        end: ns('2026-10-17T13:30:03Z'),
        type: 'phase',
        status: 'inactive',
        description: 'Sixteen companies, one map, eleven years of game time each.',
      },
      {
        id: 'hardening',
        start: ns('2026-10-20T09:28:34Z'),
        end: ns('2026-11-10T13:27:06Z'),
        type: 'phase',
        status: 'inactive',
        description: 'The claims get tests: resume, threats, licences, one version.',
      },
      {
        id: 'pinned',
        start: ns('2026-11-10T13:27:06Z'),
        end: ns('2026-11-14T00:00:00Z'),
        type: 'phase',
        status: 'active',
        description: 'The commit this record pins. 0.1.2 is in the working tree, unreleased.',
      },
    ],
    keyframes: [
      {
        id: 'scaffold',
        timestamp: ns(ZERO),
        significance: 1,
        certainty: 1,
        type: KeyframeType.FOUNDING,
        tags: ['origin', 'design', 'scaffold'],
        description:
          'The first commit writes the design and the package skeleton. No engine is patched yet; nothing has played.',
      },
      {
        id: 'packaging',
        timestamp: ns('2026-10-16T08:31:56Z'),
        significance: 0.6,
        certainty: 1,
        type: KeyframeType.MILESTONE,
        tags: ['packaging', 'ci', 'harbor'],
        description:
          'The Docker image, the CI workflow, the Harbor export and the Hugging Face dataset builder arrive in one push.',
      },
      {
        id: 'observation-layer',
        timestamp: ns('2026-10-16T08:48:33Z'),
        significance: 0.7,
        certainty: 1,
        type: KeyframeType.MILESTONE,
        tags: ['interface', 'observation'],
        description:
          'The observation layer and the rh text interface are complete — a model can see the world through a shell.',
      },
      {
        id: 'action-layer',
        timestamp: ns('2026-10-16T08:52:45Z'),
        significance: 0.8,
        certainty: 1,
        type: KeyframeType.MILESTONE,
        tags: ['interface', 'actions'],
        description:
          'The player action layer is complete — 42 verbs with GUI parity — so a model can build what a human can build.',
      },
      {
        id: 'catalog-v0-1',
        timestamp: ns('2026-10-16T09:56:58Z'),
        significance: 0.9,
        certainty: 1,
        type: KeyframeType.MILESTONE,
        tags: ['catalog', 'tasks', 'certification'],
        description:
          'The v0.1 task catalog — 1,540 tasks, each certified by a scripted oracle and a do-nothing log before it is kept.',
      },
      {
        id: 'v0-1-0',
        timestamp: ns('2026-10-16T09:57:14Z'),
        significance: 0.9,
        certainty: 1,
        type: KeyframeType.RELEASE,
        tags: ['release', 'version'],
        description: 'v0.1.0 is tagged, sixteen seconds after the catalog commit.',
      },
      {
        id: 'v0-1-1',
        timestamp: ns('2026-10-16T10:09:45Z'),
        significance: 0.7,
        certainty: 1,
        type: KeyframeType.RELEASE,
        tags: ['release', 'version', 'fix'],
        description:
          'v0.1.1 adds the task start states the image needs. It is the latest published tag.',
      },
      {
        id: 'arena-2-opens',
        timestamp: ns('2026-10-16T10:13:00Z'),
        significance: 1,
        certainty: 1,
        type: KeyframeType.LAUNCH,
        tags: ['arena', 'play'],
        description:
          'At 15:43 India time, eleven companies come into existence on arena-dev-0100: a 512 by 512 temperate map, January 1960, ten years and a 365-day run-off.',
      },
      {
        id: 'arena-2-results',
        timestamp: ns('2026-10-16T10:32:50Z'),
        significance: 0.95,
        certainty: 1,
        type: KeyframeType.PUBLICATION,
        tags: ['arena', 'results', 'publication'],
        description:
          'The README publishes the Arena 2 results: eleven models, ten years, replay-verified. Claude Opus 5.5 leads at £45,758,664.',
      },
      {
        id: 'dataset-published',
        timestamp: ns('2026-10-16T12:16:18Z'),
        significance: 0.8,
        certainty: 1,
        type: KeyframeType.RELEASE,
        tags: ['dataset', 'release', 'hugging-face'],
        description:
          'The Harbor datasets are published on Hugging Face — dev and ood, plus a train split.',
      },
      {
        id: 'free-models',
        timestamp: ns('2026-10-17T13:30:03Z'),
        significance: 0.7,
        certainty: 1,
        type: KeyframeType.PUBLICATION,
        tags: ['arena', 'free-tier', 'opencode-zen'],
        description:
          'Five free OpenCode Zen models play the same world, taking the arena to sixteen. One beats the scripted baseline; one finishes last at minus £425,249.',
      },
      {
        id: 'resume',
        timestamp: ns('2026-10-20T09:28:34Z'),
        significance: 0.6,
        certainty: 1,
        type: KeyframeType.MILESTONE,
        tags: ['supervisor', 'reliability'],
        description:
          'Arena players resume after a crash, a reboot or a usage limit. The supervisor classifies outage, quota and stall, and never restarts a model that stopped on its own.',
      },
      {
        id: 'optional-engine-knobs',
        timestamp: ns('2026-10-29T08:19:40Z'),
        significance: 0.4,
        certainty: 1,
        type: KeyframeType.MILESTONE,
        tags: ['engine', 'build'],
        description:
          'The engine build accepts CXX_FLAGS and EXTRA_PATCHES, so a variant engine gets its own tree. The default build and its checksums are unchanged.',
      },
      {
        id: 'release-0-1-2-surface',
        timestamp: ns('2026-11-10T06:35:24Z'),
        significance: 0.8,
        certainty: 1,
        type: KeyframeType.MILESTONE,
        tags: ['release', 'version', 'licence', 'docs'],
        description:
          'The 0.1.2 surface: one version source, the MIT and GPL-2.0 licence files and NOTICE, a quick start with tested links, verifier hardening and the threat table.',
      },
      {
        id: 'arena-2-timelapse',
        timestamp: ns('2026-11-10T06:48:16Z'),
        significance: 0.6,
        certainty: 1,
        type: KeyframeType.PUBLICATION,
        tags: ['arena', 'replay', 'video'],
        description:
          'The Arena 2 timelapse: eleven networks growing from 1960 to 1971, every frame from a replay.',
      },
      {
        id: 'pinned-commit',
        timestamp: ns('2026-11-10T13:27:06Z'),
        significance: 0.7,
        certainty: 1,
        type: KeyframeType.MILESTONE,
        tags: ['pin', 'record'],
        description:
          'The commit this record is read from: 6158e15, the merge of the 2026-11 stack. CHANGELOG.md at this commit says 0.1.2 is unreleased.',
      },
    ],
    windows: { strategy: 'time_based', avgWindowSize: BigInt(TimePrecision.DAY) },
  },

  metadata: {
    canonicalName: 'Railhead',
    creators: ['Rachit Shah'],
    released: new Date('2026-10-16T09:57:14Z'),
    cultural_significance: 0.3,
    cultural_description:
      'A 2026 research environment, not a cultural object. It matters as evidence about what a language model can do when handed a shell and an economy, and as a worked example of a reward function that refuses to trust the game it grades.',
    platform: 'OpenTTD 15.3, patched, dedicated server',
    language: 'Python 3.11+',
    pinnedCommit: RAILHEAD_PIN,
  },
} as unknown as Universe;
