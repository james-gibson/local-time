import { CommonUniverseIds } from '../../../../core/common-universe-ids';
import { createGameUniverseId } from '../../../../core/universe-ids';
import { createDiabloGameUniverse, diabloTimestamp } from './diablo-common';

/**
 * Diablo II (2000) and Lord of Destruction (2001).
 *
 * The source gives "June 2000" for Diablo II without an exact day, so the
 * keyframe carries a June window and `certainty < 1.0`. Lord of Destruction's
 * June 29, 2001 date is clean, so it is near-certain.
 *
 * Diablo II is the 0.95-significance work of the franchise: it defined the loot
 * loop and endgame that the genre still copies, and both Lord of Destruction and
 * the 2021 remaster exist as direct descendants.
 */

/** Lord of Destruction is a child of this universe, so its id is exported. */
export const DIABLO_II_ID = createGameUniverseId('diablo', 'diablo_ii', 2000);

/** Diablo II (2000). `game:diablo:diablo_ii:2000`. */
export const diabloIIUniverse = createDiabloGameUniverse({
  id: DIABLO_II_ID,
  canonicalName: 'Diablo II',
  slug: 'diablo_ii',
  aliases: ['diablo_2', 'd2'],
  year: 2000,
  releaseTimestamp: diabloTimestamp(2000, 5, 29),
  certainty: 0.9,
  dateRange: {
    earliest: diabloTimestamp(2000, 5, 1),
    latest: diabloTimestamp(2000, 5, 30),
  },
  tags: ['arpg', 'blizzard_north', 'loot_loop', 'genre_defining'],
  significance: 0.95,
  culturalSignificance: 0.95,
  culturalNote:
    'Definitive ARPG loot-loop and endgame template; source of Lord of Destruction and the 2021 remaster.',
  creators: { director: ['David Brevik'], writer: ['Blizzard North'] },
  copyrightHolders: ['Blizzard Entertainment'],
  parentUniverses: [CommonUniverseIds.DIABLO_FRANCHISE],
});

/** Diablo II: Lord of Destruction (2001) — expansion to Diablo II. */
export const diabloIILordOfDestructionUniverse = createDiabloGameUniverse({
  id: createGameUniverseId('diablo', 'lord_of_destruction', 2001),
  canonicalName: 'Diablo II: Lord of Destruction',
  slug: 'diablo_ii_lord_of_destruction',
  aliases: ['lord_of_destruction', 'lod'],
  year: 2001,
  releaseTimestamp: diabloTimestamp(2001, 5, 29),
  certainty: 0.98,
  tags: ['arpg', 'expansion', 'blizzard_north'],
  significance: 0.85,
  culturalSignificance: 0.85,
  culturalNote: 'Expansion that added Act V, the Assassin and the Druid and extended the endgame.',
  creators: { director: ['Blizzard North'], writer: ['Blizzard North'] },
  copyrightHolders: ['Blizzard Entertainment'],
  parentUniverses: [DIABLO_II_ID],
});
