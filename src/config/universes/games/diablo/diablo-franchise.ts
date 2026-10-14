import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../../core/types';
import { CommonUniverseIds } from '../../../../core/common-universe-ids';
import { DIABLO_SOURCES, diabloTimestamp } from './diablo-common';

/**
 * The Diablo franchise container — one connected story across Sanctuary.
 *
 * Modelled the way every other franchise umbrella in the repository is
 * (`TOY_STORY_FRANCHISE`, `CARS_FRANCHISE`): a HISTORICAL id carrying the run, not
 * a `game:` id. `createGameUniverseId` requires a four-digit release year, so a
 * 1996–2026 container cannot live in the `game:` namespace. The id is the shared
 * `CommonUniverseIds.DIABLO_FRANCHISE` lever so the four base games can declare
 * containment against it without a second definition of any child id.
 *
 * The container is fiction. Sanctuary, the Prime Evils and the Worldstone are not
 * real events; the only reality anchor is the studio that authored them.
 */

const FRANCHISE_EPOCH_START = diabloTimestamp(1997, 0, 1);
const FRANCHISE_EPOCH_END = diabloTimestamp(2026, 3, 28);

export const diabloFranchiseUniverse: Universe = {
  universeId: CommonUniverseIds.DIABLO_FRANCHISE,
  type: UniverseType.SERIES,
  epochs: undefined,
  identifiers: {
    primary: CommonUniverseIds.DIABLO_FRANCHISE,
    aliases: ['diablo_series', 'sanctuary_series', 'diablo_franchise'],
  },
  realityRelation: {
    type: 'pure_fiction',
    fictionalizationDegree: 1.0,
    realityAnchors: [
      {
        realEventId: 'corporate:blizzard_north_founded:1993',
        relationshipType: 'inspired_by',
        confidence: 0.9,
        evidence: [
          'Condor Games acquired by Blizzard Entertainment and renamed Blizzard North, 1993–94',
          'Blizzard North developed the first two Diablo games and closed in 2005',
        ],
      },
    ],
  },
  attribution: {
    public_domain: false,
    copyright: {
      holders: ['Blizzard Entertainment'],
      year: 1996,
      status: 'active',
    },
    creators: {
      director: ['David Brevik', 'Blizzard North'],
      writer: ['Blizzard Entertainment'],
    },
    sources: [...DIABLO_SOURCES],
    citations_required: true,
    usage_restrictions: [
      'Trademarks, character names and game assets © Blizzard Entertainment',
      'Fair use for criticism, commentary and knowledge indexing',
    ],
  },
  layers: [
    {
      layerId: 'primary_layer',
      type: 'primary',
      epochs: {
        franchise_era: {
          // Explicit epochId is mandatory: the registry otherwise substitutes the
          // layer key and silently changes what references to the epoch mean
          // (james-gibson/local-time#19).
          epochId: 'diablo_franchise:1996:2026',
          startTime: FRANCHISE_EPOCH_START,
          endTime: FRANCHISE_EPOCH_END,
          precision: TimePrecision.YEAR,
          description: 'Diablo franchise, Diablo (1996/97) through Lord of Hatred (2026)',
        },
      },
    },
  ],
  temporalStructure: {
    segments: [
      {
        id: 'franchise_run',
        start: FRANCHISE_EPOCH_START,
        end: FRANCHISE_EPOCH_END,
        type: 'phase',
        status: 'active',
        description: 'The four mainline games and their expansions, 1996–2026',
      },
    ],
    keyframes: [
      {
        id: 'diablo_i_release',
        timestamp: diabloTimestamp(1997, 0, 3),
        significance: 0.9,
        tags: ['release', 'franchise_start'],
        type: KeyframeType.RELEASE,
        certainty: 0.85,
        dateRange: {
          earliest: diabloTimestamp(1996, 11, 31),
          latest: diabloTimestamp(1997, 0, 31),
        },
      },
      {
        id: 'diablo_iv_release',
        timestamp: diabloTimestamp(2023, 5, 5),
        significance: 0.9,
        tags: ['release', 'revival'],
        type: KeyframeType.RELEASE,
        certainty: 0.9,
      },
      {
        id: 'diablo_iv_lord_of_hatred_release',
        timestamp: diabloTimestamp(2026, 3, 28),
        significance: 0.75,
        tags: ['release', 'expansion'],
        type: KeyframeType.RELEASE,
        certainty: 0.85,
        dateRange: {
          earliest: diabloTimestamp(2026, 3, 26),
          latest: diabloTimestamp(2026, 3, 28),
        },
      },
    ],
    windows: { strategy: 'phase_based' },
  },
  metadata: {
    canonicalName: 'Diablo',
    creators: ['Blizzard North', 'Blizzard Entertainment'],
    released: new Date(Date.UTC(1997, 0, 3)),
    cultural_significance: 0.95,
  },
};
