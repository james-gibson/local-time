import { KeyframeType, Universe } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { createHistoricalBuilder } from '../../../core/universe-builder';
import { createHistoricalUniverseId } from '../../../core/universe-ids';

/**
 * Russia–Ukraine War (`history:russia_ukraine_war:2022`).
 *
 * Documents the full-scale Russian invasion of Ukraine launched on 24 February
 * 2022, following the 1991–2014 path to conflict (`history:ukraine:path_to_conflict:1991-2014`),
 * through the overnight 24–25 October 2026 153-drone barrage and the scheduled
 * November 2026 Abu Dhabi trilateral talks.
 *
 * Landed as part of `james-gibson/local-time#212` Phase 2 so the 2026-10-26
 * *Anchor Watch* episode resolves its `history:russia_ukraine_war:2022` anchor
 * and reference edge.
 */

export const RUSSIA_UKRAINE_WAR_2022_ID = createHistoricalUniverseId(
  'russia_ukraine_war',
  2022,
);

const russiaUkraineWar = createHistoricalBuilder()
  .historical('russia_ukraine_war', 2022)
  .withAliases([
    'Russian Invasion of Ukraine (2022)',
    'Russo-Ukrainian War Full-Scale Phase',
  ])
  .withCanonicalName('Russia–Ukraine War (2022–2026)')
  .withDescription(
    'Timeline of the full-scale Russian invasion of Ukraine beginning 24 February 2022, following the 1991–2014 path to conflict, through the overnight 24–25 October 2026 153-drone barrage and the November 2026 Abu Dhabi trilateral talks.',
  )
  .withReleased('2022-02-24')
  .withCulturalSignificance(1.0)
  .withRealityRelation('documentary', 0.0, [
    {
      realEventId: 'history:ukraine:path_to_conflict:1991-2014',
      relationshipType: 'documents',
      confidence: 1.0,
      evidence: [
        'Full-scale escalation of the Russo-Ukrainian conflict begun in 2014',
        'UN General Assembly Resolution ES-11/1 (2 March 2022)',
      ],
    },
  ])
  .withPublicDomain([
    'United Nations General Assembly',
    'Ukrainian Air Force official bulletins',
    'Ukrinform',
    'Reuters',
  ])
  .withUsageRestrictions([
    'Overnight casualty figures vary across initial regional reports and wire summaries; cite primary air-defense bulletins alongside wire counts.',
  ])
  .addParent(CommonUniverseIds.WORLD_HISTORY)
  .addReference({
    type: 'DERIVES_FROM',
    targetUniverseId: 'history:ukraine:path_to_conflict:1991-2014',
    description: 'Follows the 1991–2014 post-Soviet and Donbas onset timeline.',
  })
  .addEpoch(
    '2022-02-24T00:00:00Z',
    '2025-12-31T23:59:59Z',
    'full_scale_invasion_onset',
    undefined,
    undefined,
    {
      description:
        'Full-scale invasion launched 24 February 2022 and multi-year territorial and air-defense attrition.',
    },
  )
  .addEpoch(
    '2026-01-01T00:00:00Z',
    '2026-11-30T23:59:59Z',
    'autumn_2026_drone_campaign_and_diplomacy',
    undefined,
    undefined,
    {
      description:
        'Autumn 2026 long-range drone barrages and scheduled November 2026 Abu Dhabi trilateral negotiations.',
    },
  )
  .addDateSegment(
    '2022-02-24',
    '2025-12-31',
    'invasion_and_attrition_phase',
    'phase',
    'active',
    undefined,
    'From the 24 February 2022 full-scale invasion through the 2022–2025 attrition campaigns.',
  )
  .addDateSegment(
    '2026-01-01',
    '2026-11-30',
    'october_2026_air_campaign_and_talks',
    'phase',
    'active',
    undefined,
    '2026 long-range drone strikes and the November 2026 Abu Dhabi diplomatic track.',
  )
  .addDateKeyframe(
    '2022-02-24T03:00:00Z',
    'full_scale_invasion_begins',
    1.0,
    ['invasion', 'ukraine', 'russia', 'war'],
    {
      type: KeyframeType.MILESTONE,
      certainty: 1.0,
      description:
        'Russian forces launch a full-scale invasion of Ukraine across multiple axes on 24 February 2022.',
    },
  )
  .addDateKeyframe(
    '2026-10-25T05:00:00Z',
    'october_24_25_153_drone_barrage',
    0.8,
    ['ukraine', 'drones', 'air_defense', '24-25_oct'],
    {
      type: KeyframeType.MILESTONE,
      certainty: 0.95,
      description:
        'Russia launches 153 Shahed and decoy drones overnight on 24–25 October 2026; Ukrainian Air Force reports 119 neutralized, hits recorded at 15 locations, and wire reporting records one civilian killed in Kharkiv.',
    },
  )
  .addDateKeyframe(
    '2026-11-10T09:00:00Z',
    'abu_dhabi_trilateral_talks_scheduled',
    0.8,
    ['diplomacy', 'abu_dhabi', 'trilateral', 'witkoff', 'kushner'],
    {
      type: KeyframeType.MILESTONE,
      certainty: 0.85,
      description:
        'Scheduled Russia–US–Ukraine trilateral talks in Abu Dhabi (10–11 November 2026), with US envoys Steve Witkoff and Jared Kushner expected to lead the US delegation (Reuters/Axios).',
    },
  )
  .withWindowing('phase_based')
  .build();

russiaUkraineWar.metadata = {
  ...russiaUkraineWar.metadata,
  creators: ['Historical Actors of Ukraine, Russia, USA, and EU'],
};

export const russiaUkraineWar2022Universe: Universe = russiaUkraineWar;
