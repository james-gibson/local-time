import { CommonUniverseIds } from '../../../../core/common-universe-ids';
import { createGameUniverseId } from '../../../../core/universe-ids';
import { createDiabloGameUniverse, diabloTimestamp } from './diablo-common';

/**
 * Diablo III (2012), Reaper of Souls (2014) and Rise of the Necromancer (2017).
 *
 * All three dates are stated cleanly by the source (Diablo III worldwide on
 * May 15, 2012; Reaper of Souls on PC/Mac March 25, 2014; Rise of the Necromancer
 * June 27, 2017), so their keyframes carry `certainty` close to 1 rather than a
 * contested `dateRange`. Reaper of Souls' console ports were undated, which is
 * reflected in the `pc_mac` tag rather than a second keyframe.
 */

/** Reaper of Souls and Rise of the Necromancer are children of this universe. */
export const DIABLO_III_ID = createGameUniverseId('diablo', 'diablo_iii', 2012);

/** Diablo III (2012). `game:diablo:diablo_iii:2012`. */
export const diabloIIIUniverse = createDiabloGameUniverse({
  id: DIABLO_III_ID,
  canonicalName: 'Diablo III',
  slug: 'diablo_iii',
  aliases: ['diablo_3', 'd3'],
  year: 2012,
  releaseTimestamp: diabloTimestamp(2012, 4, 15),
  certainty: 0.98,
  tags: ['arpg', 'blizzard', 'worldwide_release'],
  significance: 0.85,
  culturalSignificance: 0.85,
  culturalNote: 'Long-awaited third mainline entry; worldwide simultaneous release.',
  creators: { director: ['Jay Wilson'], writer: ['Blizzard Entertainment'] },
  copyrightHolders: ['Blizzard Entertainment'],
  parentUniverses: [CommonUniverseIds.DIABLO_FRANCHISE],
});

/** Diablo III: Reaper of Souls (2014) — expansion to Diablo III. */
export const diabloIIIReaperOfSoulsUniverse = createDiabloGameUniverse({
  id: createGameUniverseId('diablo', 'reaper_of_souls', 2014),
  canonicalName: 'Diablo III: Reaper of Souls',
  slug: 'diablo_iii_reaper_of_souls',
  aliases: ['reaper_of_souls', 'ros'],
  year: 2014,
  releaseTimestamp: diabloTimestamp(2014, 2, 25),
  certainty: 0.95,
  tags: ['arpg', 'expansion', 'pc_mac'],
  significance: 0.85,
  culturalSignificance: 0.85,
  culturalNote: 'Expansion that added Act V, the Crusader and Adventure Mode.',
  creators: { director: ['Blizzard Entertainment'], writer: ['Blizzard Entertainment'] },
  copyrightHolders: ['Blizzard Entertainment'],
  parentUniverses: [DIABLO_III_ID],
});

/** Diablo III: Rise of the Necromancer (2017) — content pack for Diablo III. */
export const diabloIIIRiseOfTheNecromancerUniverse = createDiabloGameUniverse({
  id: createGameUniverseId('diablo', 'rise_of_the_necromancer', 2017),
  canonicalName: 'Diablo III: Rise of the Necromancer',
  slug: 'diablo_iii_rise_of_the_necromancer',
  aliases: ['rise_of_the_necromancer', 'necromancer_pack'],
  year: 2017,
  releaseTimestamp: diabloTimestamp(2017, 5, 27),
  certainty: 0.98,
  tags: ['arpg', 'content_pack', 'necromancer'],
  significance: 0.75,
  culturalSignificance: 0.75,
  culturalNote: 'Character pack reintroducing the Necromancer class to Diablo III.',
  creators: { director: ['Blizzard Entertainment'], writer: ['Blizzard Entertainment'] },
  copyrightHolders: ['Blizzard Entertainment'],
  parentUniverses: [DIABLO_III_ID],
});
