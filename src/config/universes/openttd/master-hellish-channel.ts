import { TimePrecision, Universe, UniverseType } from '../../../core/types';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * Master Hellish — the YouTube channel (container universe).
 *
 * A container, not a narrative: it owns the channel's works and series, and it is
 * the membership parent of the OpenTTD Season 12 and AI Battles universes. It has
 * no runtime axis of its own.
 *
 * ID: `history:master_hellish_channel:*`.
 *
 * The `*` span is deliberate. The channel's launch date is not recorded here and
 * the previous draft's "2024-01-01" was an invented lower bound. `*` means
 * "unbounded / not fixed", which is the honest claim, and the HISTORICAL
 * namespace is where the repo already keeps real institutions with open or
 * uncertain spans (`history:costco:1983`, `history:rogers_commission:1986`).
 *
 * Reality Relation: `documentary` at 0.0. The channel is a real publishing
 * entity; each work it contains carries its own relation.
 *
 * Cultural Significance: 0.75 — a long-running, domain-notable transport-sim
 * channel. The video itself says "over 30 years of tycoon experience", and the
 * channel publishes its community saves.
 *
 * Research Sources (verified 2026-10-19):
 * - YouTube oEmbed endpoint for https://www.youtube.com/@MasterHellish —
 *   `author_name: "Master Hellish"`, `author_url` the channel URL.
 * - masterhellish.net — community hub, schedule, downloads.
 */

const ns = (iso: string): bigint => dateToNanoseconds(new Date(iso));

/**
 * Lower bound for the *recorded* works, not the channel's launch. The earliest
 * work this container holds is the Season 12 Starting Scenario, published
 * 2025-10-16 (verified on masterhellish.net/downloads).
 */
const EARLIEST_RECORDED_WORK = ns('2025-10-16T00:00:00Z');

export const masterHellishChannelUniverse = {
  universeId: 'history:master_hellish_channel:*',
  type: UniverseType.INSTITUTIONAL_PERIOD,

  identifiers: {
    primary: 'history:master_hellish_channel:*',
    aliases: ['Master Hellish', '@MasterHellish', 'Master Hellish channel'],
  },

  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    // No anchor: there is no separate universe for the channel itself, and a
    // self-anchor would assert a correspondence rather than record one.
    realityAnchors: [],
  },

  attribution: {
    citations_required: true,
    sources: [
      'YouTube oEmbed endpoint for https://www.youtube.com/@MasterHellish (author_name "Master Hellish"), retrieved 2026-10-19',
      'masterhellish.net — community hub, schedule and downloads',
    ],
  },

  layers: [
    {
      layerId: 'publishing',
      type: 'primary',
      epochs: {
        active: {
          epochId: 'history:master_hellish_channel:publishing:open',
          startTime: EARLIEST_RECORDED_WORK,
          // No endTime: the channel is ongoing as of 2026-10-19.
          precision: TimePrecision.YEAR,
          description:
            'Open publishing window for the channel. The start is the earliest ' +
            'work recorded here (the Season 12 Starting Scenario, 2025-10-16) — ' +
            'a lower bound, NOT the channel launch date, which is not recorded.',
        },
      },
    },
  ],

  metadata: {
    canonicalName: 'Master Hellish',
    description:
      'A long-running YouTube channel producing transport-tycoon and simulation ' +
      'content, including the OpenTTD Season 12 community Let\'s Play and the ' +
      '"OpenTTD AI Battles" series. Publishes its community save files.',
    creators: ['Master Hellish'],
    cultural_significance: 0.75,

    collection: {
      kind: 'channel',
      memberUniverseIds: [
        'series:master_hellish_openttd_ai_battles:2026',
        'series:openttd_season_12_connect_the_world:2025',
      ],
      externalIds: { youtubeHandle: '@MasterHellish' },
      externalLinks: {
        channel: 'https://www.youtube.com/@MasterHellish',
        streams: 'https://www.youtube.com/@MasterHellish/streams',
        hub: 'https://masterhellish.net',
      },
    },

    retrieval: {
      domain: 'video game commentary / simulation',
      format: 'channel / collection',
      subjects: ['OpenTTD', 'transport simulation', 'Let\'s Play', 'community'],
      charge_source: 'realityRelation.type = documentary -> +1 (non-fiction tier)',
      weight_source: 'RealityGradient.level folded with cultural_significance (0.75)',
    },
  },
} as unknown as Universe;
