import { TimePrecision, Universe, UniverseType } from '../../../core/types';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * "OpenTTD AI Battles" — the series container.
 *
 * The video's own description names the series and links its playlist:
 *
 *   "This Series: The 'OpenTTD AI Battles' series brings you action-packed and
 *    strategy-driven gameplay, where advanced AI competitors (and sometimes
 *    human players) go head-to-head on massive maps."
 *   Series Playlist: https://www.youtube.com/playlist?list=PLX9TPVcxrORPOPnGrla8brzmlaUt5OBJm
 *
 * So the series is a sourced entity, not something inferred from a single
 * episode. What is NOT sourced is its full episode list: only the one episode
 * modelled here has been verified, and `episodeUniverseIdsComplete: false`
 * records that rather than presenting a one-item list as exhaustive.
 *
 * ID: `series:master_hellish_openttd_ai_battles:2026`. The year is the
 * publication year of the one verified episode, not an asserted series launch.
 *
 * Reality Relation: `documentary` at 0.0 — the series format and its runs are
 * real. The AI companies inside each episode are simulations and are modelled in
 * each episode's own `recreation` layer.
 *
 * Cultural Significance: 0.60 — a domain-notable recurring experimental format
 * that publishes its save files, below the cross-domain 0.85 band.
 */

const ns = (iso: string): bigint => dateToNanoseconds(new Date(iso));

/** Earliest verified episode: 2026-10-16T15:08:21Z. Not a series launch date. */
const EARLIEST_VERIFIED_EPISODE = ns('2026-10-16T15:08:21Z');

export const aiBattlesSeriesUniverse = {
  universeId: 'series:master_hellish_openttd_ai_battles:2026',
  type: UniverseType.SERIES,

  identifiers: {
    primary: 'series:master_hellish_openttd_ai_battles:2026',
    aliases: ['OpenTTD AI Battles', 'AI Battles'],
  },

  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [],
  },

  attribution: {
    citations_required: true,
    sources: [
      'Video description of https://www.youtube.com/watch?v=Pd0q5Xit13U, retrieved 2026-10-19 — names the series and links its playlist',
      'Series playlist: https://www.youtube.com/playlist?list=PLX9TPVcxrORPOPnGrla8brzmlaUt5OBJm',
    ],
  },

  layers: [
    {
      layerId: 'series_run',
      type: 'primary',
      epochs: {
        active: {
          epochId: 'series:master_hellish_openttd_ai_battles:run',
          startTime: EARLIEST_VERIFIED_EPISODE,
          // No endTime: the playlist is live and the series is ongoing.
          precision: TimePrecision.YEAR,
          description:
            'Open run window. The start is the publication instant of the one ' +
            'episode verified here, NOT an asserted first-episode date.',
        },
      },
    },
  ],

  connections: {
    natural: {
      // One owner, many memberships (#74): the channel owns the series.
      parentUniverses: ['history:master_hellish_channel:*'],
    },
  },

  metadata: {
    canonicalName: 'OpenTTD AI Battles',
    description:
      'A recurring experimental series in which AI scripts are run against the ' +
      'community\'s maps and builds in OpenTTD, comparing algorithmic ' +
      'brute force against human adaptability. Episodes publish their save files ' +
      'so viewers can inspect or re-run the experiments.',
    creators: ['Master Hellish'],
    released: new Date('2026-10-16T15:08:21Z'),
    cultural_significance: 0.60,

    collection: {
      kind: 'series',
      parentChannel: 'history:master_hellish_channel:*',
      episodeUniverseIds: [
        'series:can_5_overpowered_ais_beat_our_community_openttd_map:2026',
      ],
      // Only the one verified episode is listed — this is not a complete index.
      episodeUniverseIdsComplete: false,
      format: [
        'AI scripts given a controlled map',
        'head-to-head against a human/community build',
        'metric comparison: profit, fleet size, efficiency',
        'public save-file release',
      ],
      thesis: 'brute force code versus human adaptability',
      externalLinks: {
        playlist: 'https://www.youtube.com/playlist?list=PLX9TPVcxrORPOPnGrla8brzmlaUt5OBJm',
      },
    },

    retrieval: {
      domain: 'transport simulation / video game commentary',
      format: 'series / collection',
      subjects: ['OpenTTD', 'artificial intelligence', 'agent design limits', 'AI versus human'],
      charge_source: 'realityRelation.type = documentary -> +1 (non-fiction tier)',
      weight_source: 'RealityGradient.level folded with cultural_significance (0.60)',
    },
  },
} as unknown as Universe;
