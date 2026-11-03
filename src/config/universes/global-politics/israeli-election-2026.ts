import { KeyframeType, Universe } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { createHistoricalBuilder } from '../../../core/universe-builder';
import { createHistoricalUniverseId } from '../../../core/universe-ids';
import { IRAN_WAR_2026_ID } from './iran-war';

/**
 * 2026 Israeli Legislative Election (`history:israeli_legislative_election:2026`).
 *
 * Documents the elections to the 26th Knesset held on 27 October 2026 during the
 * 2026 Iran war, including the eve-of-election Channel 12 report of a confrontation
 * between Prime Minister Benjamin Netanyahu and IDF Chief of Staff Eyal Zamir over
 * Iran-related military action, together with the official denials issued by both
 * the Prime Minister's Office and the Defense Minister.
 *
 * Landed as part of `james-gibson/local-time#212` Phase 2 so the 2026-10-26
 * *Anchor Watch* episode resolves its election anchor and reference edge.
 */

export const ISRAELI_ELECTION_2026_ID = createHistoricalUniverseId(
  'israeli_legislative_election',
  2026,
);

const israeliElection = createHistoricalBuilder()
  .historical('israeli_legislative_election', 2026)
  .withAliases(['Elections to the 26th Knesset', '2026 Israeli Election'])
  .withCanonicalName('2026 Israeli Legislative Election (26th Knesset)')
  .withDescription(
    'Timeline of the 27 October 2026 elections to the 26th Knesset in Israel, held during the 2026 Iran war, including the eve-of-election Channel 12 report of a confrontation between Prime Minister Benjamin Netanyahu and IDF Chief of Staff Eyal Zamir and the official denials.',
  )
  .withReleased('2026-10-27')
  .withCulturalSignificance(0.85)
  .withRealityRelation('documentary', 0.0, [
    {
      realEventId: IRAN_WAR_2026_ID,
      relationshipType: 'documents',
      confidence: 0.95,
      evidence: [
        'Election held during the 2026 Iran war',
        'Channel 12 report on Iran-related military action order, 25–26 Oct 2026',
      ],
    },
  ])
  .withPublicDomain([
    'Central Elections Committee for the 26th Knesset (gov.il)',
    'Reuters',
    'The Times of Israel',
    'Israel Hayom',
  ])
  .withUsageRestrictions([
    'Eve-of-election civil-military rift reports are contested by official denials from the Prime Minister\'s Office and Defense Minister; record both the report and the denials.',
  ])
  .addParent(CommonUniverseIds.WORLD_HISTORY)
  .addReference({
    type: 'DOCUMENTS',
    targetUniverseId: IRAN_WAR_2026_ID,
    description:
      'Held amid the 2026 Iran war, with civil-military tensions over Iran-related operations reported on the eve of polling.',
  })
  .addReference({
    type: 'DERIVES_FROM',
    targetUniverseId: 'history:gaza:israel_hamas_war:2023-2025',
    description: 'Political realignment and coalition pressures following the 2023–2025 conflict.',
  })
  .addEpoch(
    '2026-10-01T00:00:00Z',
    '2026-10-26T23:59:59Z',
    'wartime_campaign_and_eve_of_poll',
    undefined,
    undefined,
    {
      description:
        'Final campaign stretch for the 26th Knesset and the eve-of-election civil-military controversy.',
    },
  )
  .addEpoch(
    '2026-10-27T00:00:00Z',
    '2026-10-27T23:59:59Z',
    'polling_day_26th_knesset',
    undefined,
    undefined,
    {
      description: 'Election day for the 26th Knesset across Israel on 27 October 2026.',
    },
  )
  .addDateSegment(
    '2026-10-01',
    '2026-10-26',
    'eve_of_election_period',
    'phase',
    'active',
    undefined,
    'Final campaign window leading into the 25–26 October civil-military rift reports.',
  )
  .addDateSegment(
    '2026-10-27',
    '2026-10-27',
    'knesset_election_day',
    'phase',
    'active',
    undefined,
    '27 October 2026 polling for the 26th Knesset.',
  )
  .addDateKeyframe(
    '2026-10-25T18:00:00Z',
    'channel_12_zamir_netanyahu_confrontation_report',
    0.8,
    ['idf', 'netanyahu', 'zamir', 'iran_war'],
    {
      type: KeyframeType.PUBLICATION,
      certainty: 0.85,
      description:
        'Israeli Channel 12 and The Times of Israel report an "unprecedented confrontation" in which IDF Chief of Staff Eyal Zamir resisted an Iran-related military action ordered by Prime Minister Benjamin Netanyahu.',
    },
  )
  .addDateKeyframe(
    '2026-10-26T10:00:00Z',
    'pmo_and_defense_minister_deny_rift',
    0.75,
    ['denial', 'netanyahu', 'defense_minister', 'idf'],
    {
      type: KeyframeType.PUBLIC_STATEMENT,
      certainty: 0.9,
      description:
        'Both Prime Minister Netanyahu and the Defense Minister issue official denials of a rift between the political leadership and the IDF Chief of Staff on the eve of the election.',
    },
  )
  .addDateKeyframe(
    '2026-10-27T04:00:00Z',
    'knesset_26_polls_open',
    0.9,
    ['election', 'knesset', 'israel'],
    {
      type: KeyframeType.MILESTONE,
      certainty: 0.95,
      description:
        'Polling opens across Israel for the elections to the 26th Knesset, proceeding as scheduled on 27 October 2026.',
    },
  )
  .withWindowing('phase_based')
  .build();

israeliElection.metadata = {
  ...israeliElection.metadata,
  creators: ['Central Elections Committee for the 26th Knesset and Israeli Political Actors'],
};

export const israeliLegislativeElection2026Universe: Universe = israeliElection;
