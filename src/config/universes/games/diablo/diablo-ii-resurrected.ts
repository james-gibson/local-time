import { KeyframeType, RealityAnchor, TimePrecision, Universe, UniverseType } from '../../../../core/types';
import { createGameUniverseId } from '../../../../core/universe-ids';
import { creatorRefs } from '../../../../core/creators';
import { DIABLO_SOURCES, diabloTimestamp } from './diablo-common';
import { DIABLO_II_ID } from './diablo-ii';

/**
 * Diablo II: Resurrected (2021) — the archetypal overlay case
 * (james-gibson/local-time#112 §8).
 *
 * A remaster is not a second definition of Diablo II; it is a *recreation layer*
 * over it. The universe is authored as a manual literal because it needs a second
 * `TemporalLayer` of `type: 'recreation'` carrying `reality_correspondence` — a
 * shape `UniverseBuilder` cannot produce. Both "as remastered" (this universe) and
 * the 2000 original (`game:diablo:diablo_ii:2000`) stay retrievable, and the
 * containment edge records that the remaster is *of* Diablo II.
 *
 * ## Reality relation: fiction, not "recreation, 0.0"
 *
 * #112 §4 proposes `recreation` / `fictionalizationDegree: 0.0` for this universe,
 * but that would grade a remaster of a work of fiction as non-fiction and project
 * `plane_charge = +1` — contradicting §9, which expects every Diablo game to be
 * fiction. Sanctuary is still not real; the *recreation* relationship is expressed
 * on the layer (`type: 'recreation'` + `reality_correspondence`), where it belongs.
 * The universe itself is `pure_fiction` / 1.0.
 */

const RESURRECTED_ID = createGameUniverseId('diablo', 'diablo_ii_resurrected', 2021);

const resurrectionAnchor: RealityAnchor = {
  realEventId: DIABLO_II_ID,
  relationshipType: 'reinterprets',
  confidence: 0.95,
  evidence: [
    'Faithful remaster of Diablo II and Lord of Destruction, released 2021',
    'Blizzard Entertainment; rebuilt 3D art over the original design',
  ],
};

export const diabloIIResurrectedUniverse: Universe = {
  universeId: RESURRECTED_ID,
  type: UniverseType.GAME,
  epochs: undefined,
  identifiers: {
    primary: RESURRECTED_ID,
    aliases: ['diablo_ii_resurrected', 'd2r', 'resurrected'],
  },
  realityRelation: {
    type: 'pure_fiction',
    fictionalizationDegree: 1.0,
    realityAnchors: [resurrectionAnchor],
  },
  attribution: {
    public_domain: false,
    copyright: {
      holders: ['Blizzard Entertainment'],
      year: 2021,
      status: 'active',
    },
    creators: creatorRefs({ director: ['Blizzard Entertainment'], writer: ['Blizzard Entertainment'] }),
    sources: [...DIABLO_SOURCES],
    citations_required: true,
    usage_restrictions: [
      'Trademarks, character names and game assets © Blizzard Entertainment',
      'Fair use for criticism, commentary and knowledge indexing',
    ],
  },
  connections: {
    natural: { parentUniverses: [DIABLO_II_ID] },
  },
  layers: [
    {
      layerId: 'release_timeline',
      type: 'primary',
      epochs: {
        release_era: {
          epochId: 'diablo:diablo_ii_resurrected',
          startTime: BigInt(Date.UTC(2021, 0, 1)) * 1_000_000n,
          endTime: BigInt(Date.UTC(2021, 11, 31, 23, 59, 59)) * 1_000_000n,
          precision: TimePrecision.YEAR,
          description: 'Diablo II: Resurrected release era (2021)',
        },
      },
    },
    {
      layerId: 'diablo_ii_recreation',
      type: 'recreation',
      // The remaster renders the 2000 original; the deviations are what changed.
      reality_correspondence: {
        to: DIABLO_II_ID,
        accuracy: 0.95,
        deviations: [
          '3D remade art',
          'controller support',
          'shared stash',
          'cross-progression',
        ],
      },
      epochs: {
        remastered_campaign: {
          epochId: 'diablo:diablo_ii_resurrected:campaign',
          startTime: BigInt(Date.UTC(2021, 0, 1)) * 1_000_000n,
          endTime: BigInt(Date.UTC(2021, 11, 31, 23, 59, 59)) * 1_000_000n,
          precision: TimePrecision.YEAR,
          description: 'Remastered Diablo II campaign as rendered in Resurrected',
        },
      },
    },
  ],
  temporalStructure: {
    segments: [
      {
        id: 'diablo_ii_resurrected_release_window',
        start: diabloTimestamp(2021, 8, 23) - 7n * 86_400_000_000_000n,
        end: diabloTimestamp(2021, 8, 23) + 7n * 86_400_000_000_000n,
        type: 'phase',
        status: 'active',
        description: 'Launch window for Diablo II: Resurrected (2021)',
      },
    ],
    keyframes: [
      {
        id: 'diablo_ii_resurrected_release',
        timestamp: diabloTimestamp(2021, 8, 23),
        significance: 0.75,
        tags: ['release', 'remaster', 'blizzard'],
        type: KeyframeType.RELEASE,
        certainty: 0.75,
        // The source states 2021 without an exact day.
        dateRange: {
          earliest: diabloTimestamp(2021, 0, 1),
          latest: diabloTimestamp(2021, 11, 31),
        },
      },
    ],
    windows: { strategy: 'phase_based' },
  },
  metadata: {
    canonicalName: 'Diablo II: Resurrected',
    creators: ['Blizzard Entertainment'],
    released: new Date(Date.UTC(2021, 8, 23)),
    cultural_significance: 0.75,
  },
};
