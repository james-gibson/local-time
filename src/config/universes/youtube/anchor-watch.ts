import { TimePrecision, UniverseType } from '../../../core/types';
import { createSeriesUniverseId } from '../../../core/universe-ids';

/**
 * Anchor Watch with Bobby Jones — the program (2026 season).
 *
 * A weekly Lincoln Square political program, hosted by retired Navy Commander Bobby
 * Jones, streamed live at 8 PM ET. This universe is the *container* the episodes are
 * members of (#74), not an episode itself: the show's 2026 run is year-anchored, and
 * each episode declares `parentUniverses: ['series:anchor_watch:2026']`.
 *
 * This is the "series" id the episode needs a parent for — the ticket's
 * `series:anchor_watch:<title>:2026` was a four-segment id that only the catch-all
 * would accept (#57), so the hierarchy is expressed with more ids and containment
 * edges instead of more id segments (james-gibson/local-time#212).
 *
 * Sources: the program page and episode posts on lincolnsquare.media; the co-host
 * byline "Bobby Jones and Sam Osterhout"; Lincoln Square Productions as publisher.
 */

export const ANCHOR_WATCH_SERIES_ID = createSeriesUniverseId('series', 'anchor_watch', 2026);

export const anchorWatchSeriesUniverse = {
  universeId: ANCHOR_WATCH_SERIES_ID,
  type: UniverseType.SERIES,

  identifiers: {
    primary: ANCHOR_WATCH_SERIES_ID,
    aliases: ['Anchor Watch with Bobby Jones', 'Anchor Watch (2026)'],
  },

  realityRelation: {
    type: 'documentary' as const,
    fictionalizationDegree: 0.0,
    realityAnchors: [],
  },

  attribution: {
    copyright: { holders: ['Lincoln Square Productions'], year: 2026, status: 'active' as const },
    citations_required: true,
    public_domain: false,
    sources: [
      'lincolnsquare.media — Anchor Watch with Bobby Jones, program page',
      'Episode posts carrying the byline "Bobby Jones and Sam Osterhout"',
    ],
  },

  layers: [
    {
      layerId: 'primary',
      type: 'primary' as const,
      epochs: {
        season_2026: {
          epochId: 'anchor_watch:2026:season',
          startTime: BigInt(Date.UTC(2026, 0, 1)) * 1_000_000n,
          endTime: BigInt(Date.UTC(2026, 11, 31)) * 1_000_000n,
          precision: TimePrecision.YEAR,
          description: 'Anchor Watch with Bobby Jones, 2026 season.',
        },
      },
    },
  ],
  epochs: {
    season_2026: {
      epochId: 'anchor_watch:2026:season',
      startTime: BigInt(Date.UTC(2026, 0, 1)) * 1_000_000n,
      endTime: BigInt(Date.UTC(2026, 11, 31)) * 1_000_000n,
      precision: TimePrecision.YEAR,
      description: 'Anchor Watch with Bobby Jones, 2026 season.',
    },
  },

  metadata: {
    canonicalName: 'Anchor Watch with Bobby Jones',
    creators: ['Bobby Jones', 'Sam Osterhout'],
    released: new Date('2026-10-26T00:00:00Z'),
    cultural_significance: 0.3,
  },
};
