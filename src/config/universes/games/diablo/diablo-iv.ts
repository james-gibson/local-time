import { CommonUniverseIds } from '../../../../core/common-universe-ids';
import { createGameUniverseId } from '../../../../core/universe-ids';
import { createDiabloGameUniverse, diabloTimestamp } from './diablo-common';

/**
 * Diablo IV (2023), Vessel of Hatred (2024) and Lord of Hatred (2026).
 *
 * ## Contested dates (james-gibson/local-time#112 §3)
 *
 * - **Diablo IV** — June 5, 2023, but the early-access / full-launch boundary is
 *   ambiguous, so `certainty` is held below 1.
 * - **Vessel of Hatred** — widely cited as October 8, 2024 in other sources; the
 *   source here says October 7, so a two-day `dateRange` carries the disagreement.
 * - **Lord of Hatred** — the source self-conflicts (body says April 26, 2026;
 *   infobox says April 28, 2026). Steam and the Xbox news post both point at
 *   April 27–28, so the keyframe resolves toward the later date with a range of
 *   April 26–28 and `certainty: 0.85`.
 */

/** Vessel of Hatred and Lord of Hatred are children of this universe. */
export const DIABLO_IV_ID = createGameUniverseId('diablo', 'diablo_iv', 2023);

/** Diablo IV (2023). `game:diablo:diablo_iv:2023`. */
export const diabloIVUniverse = createDiabloGameUniverse({
  id: DIABLO_IV_ID,
  canonicalName: 'Diablo IV',
  slug: 'diablo_iv',
  aliases: ['diablo_4', 'd4'],
  year: 2023,
  releaseTimestamp: diabloTimestamp(2023, 5, 5),
  certainty: 0.9,
  tags: ['arpg', 'blizzard', 'live_service', 'open_world'],
  significance: 0.9,
  culturalSignificance: 0.9,
  culturalNote: 'Genre-reviving fourth mainline entry; open-world live-service ARPG.',
  creators: { director: ['Joe Shely'], writer: ['Blizzard Entertainment'] },
  copyrightHolders: ['Blizzard Entertainment'],
  parentUniverses: [CommonUniverseIds.DIABLO_FRANCHISE],
});

/** Diablo IV: Vessel of Hatred (2024) — expansion to Diablo IV. */
export const diabloIVVesselOfHatredUniverse = createDiabloGameUniverse({
  id: createGameUniverseId('diablo', 'vessel_of_hatred', 2024),
  canonicalName: 'Diablo IV: Vessel of Hatred',
  slug: 'diablo_iv_vessel_of_hatred',
  aliases: ['vessel_of_hatred', 'voh'],
  year: 2024,
  releaseTimestamp: diabloTimestamp(2024, 9, 7),
  certainty: 0.85,
  dateRange: {
    earliest: diabloTimestamp(2024, 9, 7),
    latest: diabloTimestamp(2024, 9, 8),
  },
  tags: ['arpg', 'expansion', 'live_service'],
  significance: 0.8,
  culturalSignificance: 0.8,
  culturalNote: 'First Diablo IV expansion; added the Nahantu region and the Spiritborn class.',
  creators: { director: ['Blizzard Entertainment'], writer: ['Blizzard Entertainment'] },
  copyrightHolders: ['Blizzard Entertainment'],
  parentUniverses: [DIABLO_IV_ID],
});

/** Diablo IV: Lord of Hatred (2026) — expansion to Diablo IV. */
export const diabloIVLordOfHatredUniverse = createDiabloGameUniverse({
  id: createGameUniverseId('diablo', 'lord_of_hatred', 2026),
  canonicalName: 'Diablo IV: Lord of Hatred',
  slug: 'diablo_iv_lord_of_hatred',
  aliases: ['lord_of_hatred', 'loh'],
  year: 2026,
  releaseTimestamp: diabloTimestamp(2026, 3, 28),
  certainty: 0.85,
  dateRange: {
    earliest: diabloTimestamp(2026, 3, 26),
    latest: diabloTimestamp(2026, 3, 28),
  },
  tags: ['arpg', 'expansion', 'live_service'],
  significance: 0.75,
  culturalSignificance: 0.75,
  culturalNote: 'Second Diablo IV expansion; source self-conflicts on its exact date.',
  creators: { director: ['Blizzard Entertainment'], writer: ['Blizzard Entertainment'] },
  copyrightHolders: ['Blizzard Entertainment'],
  parentUniverses: [DIABLO_IV_ID],
});
