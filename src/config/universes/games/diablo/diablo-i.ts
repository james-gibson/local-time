import { CommonUniverseIds } from '../../../../core/common-universe-ids';
import { createGameUniverseId } from '../../../../core/universe-ids';
import { createDiabloGameUniverse, diabloTimestamp } from './diablo-common';

/** The Diablo I id, reused by Hellfire's containment edge. */
const DIABLO_I_ID = createGameUniverseId('diablo', 'diablo_i', 1996);

/**
 * Diablo (1996/97) and its third-party expansion Hellfire (1997).
 *
 * ## Date conflict (james-gibson/local-time#112 §3)
 *
 * The source is internally inconsistent about the first game: the series timeline
 * places it in 1996, the lead paragraph says **January 3, 1997**, and the
 * development section says January 1997. Per the guide a contested milestone is
 * never a single asserted timestamp, so the keyframe keeps a `timestamp` (Jan 3,
 * 1997, the most specific claim) *and* a `dateRange` spanning Dec 1996 – Jan 1997
 * with `certainty < 1.0`.
 *
 * ## Hellfire is a distinct work (james-gibson/local-time#112 §8)
 *
 * Hellfire was developed by Synergistic Software and published by Sierra On-Line,
 * *not* Blizzard, so it gets its own id rather than being folded into Diablo. The
 * authorship split is recorded in its `attribution` and in a `reinterprets` anchor
 * to the base game, so the non-Blizzard provenance is never flattened.
 */

/** Diablo (1996). `game:diablo:diablo_i:1996`. */
export const diabloIUniverse = createDiabloGameUniverse({
  id: DIABLO_I_ID,
  canonicalName: 'Diablo',
  slug: 'diablo_i',
  aliases: ['diablo_1', 'diablo_1996'],
  year: 1996,
  releaseTimestamp: diabloTimestamp(1997, 0, 3),
  certainty: 0.85,
  dateRange: {
    earliest: diabloTimestamp(1996, 11, 31),
    latest: diabloTimestamp(1997, 0, 31),
  },
  tags: ['arpg', 'blizzard_north', 'genre_founding'],
  significance: 0.9,
  culturalSignificance: 0.9,
  culturalNote: 'Genre-founding dungeon crawler; established the action-RPG loop.',
  creators: { director: ['David Brevik'], writer: ['Blizzard North'] },
  copyrightHolders: ['Blizzard Entertainment'],
  parentUniverses: [CommonUniverseIds.DIABLO_FRANCHISE],
  realityAnchors: [
    {
      realEventId: 'corporate:blizzard_north_founded:1993',
      relationshipType: 'inspired_by',
      confidence: 0.85,
      evidence: [
        'Condor Games acquired by Blizzard Entertainment and renamed Blizzard North, 1993–94',
        'Blizzard North developed Diablo I and II before closing in 2005',
      ],
    },
  ],
});

/** Diablo: Hellfire (1997) — third-party expansion to Diablo I. */
export const diabloHellfireUniverse = createDiabloGameUniverse({
  id: createGameUniverseId('diablo', 'hellfire', 1997),
  canonicalName: 'Diablo: Hellfire',
  slug: 'diablo_hellfire',
  aliases: ['hellfire', 'diablo_hellfire_expansion'],
  year: 1997,
  releaseTimestamp: diabloTimestamp(1997, 10, 24),
  certainty: 0.75,
  dateRange: {
    earliest: diabloTimestamp(1997, 0, 1),
    latest: diabloTimestamp(1997, 11, 31),
  },
  tags: ['arpg', 'expansion', 'third_party'],
  significance: 0.7,
  culturalSignificance: 0.7,
  culturalNote:
    'Non-Blizzard expansion developed by Synergistic Software and published by Sierra On-Line.',
  creators: { director: ['Synergistic Software'], writer: ['Synergistic Software'] },
  copyrightHolders: ['Blizzard Entertainment', 'Sierra On-Line'],
  parentUniverses: [DIABLO_I_ID],
  realityAnchors: [
    {
      realEventId: 'game:diablo:diablo_i:1996',
      relationshipType: 'reinterprets',
      confidence: 0.9,
      evidence: [
        'Third-party expansion to Diablo I, developed by Synergistic Software',
        'Published by Sierra On-Line, not Blizzard Entertainment',
      ],
    },
  ],
});
