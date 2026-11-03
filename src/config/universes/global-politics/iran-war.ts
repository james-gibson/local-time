import { KeyframeType, Universe } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { createHistoricalBuilder } from '../../../core/universe-builder';
import { createHistoricalUniverseId } from '../../../core/universe-ids';

/**
 * 2026 Iran War (`history:iran_war:2026`).
 *
 * Documents the 2026 armed conflict initiated on 28 February 2026 by the United
 * States and Israel against Iran, the closure of the Strait of Hormuz, regional
 * strikes on Gulf bases and oil infrastructure, the signing of the Mecca Joint
 * Defence Agreement on 7 August 2026, and the Bahrain ordered-departure policy.
 *
 * Landed as part of `james-gibson/local-time#212` Phase 2 so that the 2026-10-26
 * *Anchor Watch* episode (`series:bobby_jones_erupts_over_hegseth:2026`) can
 * resolve its `history:iran_war:2026` reality anchor and reference edge to a
 * registered universe rather than a presumed placeholder.
 */

export const IRAN_WAR_2026_ID = createHistoricalUniverseId('iran_war', 2026);

const iranWar = createHistoricalBuilder()
  .historical('iran_war', 2026)
  .withAliases(['2026 US–Israel–Iran War', '2026 Strait of Hormuz Campaign'])
  .withCanonicalName('2026 Iran War')
  .withDescription(
    'Timeline of the 2026 conflict initiated on 28 February 2026 by the United States and Israel against Iran, including the closure of the Strait of Hormuz, Gulf base strikes, the Mecca Joint Defence Agreement, and the East–West pipeline halts.',
  )
  .withReleased('2026-02-28')
  .withCulturalSignificance(0.95)
  .withRealityRelation('documentary', 0.0, [
    {
      realEventId: 'history:gaza:israel_hamas_war:2023-2025',
      relationshipType: 'documents',
      confidence: 0.9,
      evidence: [
        'Regional escalation following the 2023–2025 Gaza conflict',
        'Congressional Research Service R45281: The Strait of Hormuz',
      ],
    },
  ])
  .withPublicDomain([
    'Congressional Research Service (R45281)',
    'U.S. Department of Defense / CENTCOM releases',
    'Reuters',
    'Associated Press',
  ])
  .withUsageRestrictions([
    'Active conflict; base-loss counts such as retired Gen. McCaffrey\'s "15 Gulf bases" estimate are attributed assessments rather than official Pentagon determinations.',
  ])
  .addParent(CommonUniverseIds.WORLD_HISTORY)
  .addParent(CommonUniverseIds.US_MILITARY)
  .addReference({
    type: 'DERIVES_FROM',
    targetUniverseId: 'history:gaza:israel_hamas_war:2023-2025',
    description: 'Regional escalation following the 2023–2025 Israel–Hamas conflict.',
  })
  .addEpoch(
    '2026-02-28T00:00:00Z',
    '2026-08-06T23:59:59Z',
    'opening_campaign_and_hormuz_closure',
    undefined,
    undefined,
    {
      description:
        'Initiation of US and Israeli operations on 28 February 2026, closure of the Strait of Hormuz, and Iranian missile strikes against US installations in the Persian Gulf.',
    },
  )
  .addEpoch(
    '2026-08-07T00:00:00Z',
    '2026-11-30T23:59:59Z',
    'regional_realignment_and_infrastructure_war',
    undefined,
    undefined,
    {
      description:
        'Signing of the Mecca Joint Defence Agreement, DoD Bahrain ordered-departure policy, Saudi East–West pipeline shutdowns, and Houthi strikes on Riyadh and oil infrastructure.',
    },
  )
  .addDateSegment(
    '2026-02-28',
    '2026-08-06',
    'initial_strikes_and_strait_closure',
    'phase',
    'active',
    undefined,
    'From the 28 February 2026 opening strikes and Strait of Hormuz closure to the eve of the Mecca Joint Defence Agreement.',
  )
  .addDateSegment(
    '2026-08-07',
    '2026-11-30',
    'gulf_infrastructure_and_posture_phase',
    'phase',
    'active',
    undefined,
    'From the Mecca Joint Defence Agreement through the East–West pipeline halts and the 30 November Bahrain family-housing cutoff.',
  )
  .addDateKeyframe(
    '2026-02-28T00:00:00Z',
    'war_initiated_and_hormuz_closed',
    1.0,
    ['war', 'iran', 'strait_of_hormuz', 'casus_belli'],
    {
      type: KeyframeType.MILESTONE,
      certainty: 0.95,
      description:
        'US and Israeli forces initiate military operations against Iran on 28 February 2026; the Strait of Hormuz closes to normal commercial transit (CRS R45281).',
    },
  )
  .addDateKeyframe(
    '2026-04-06T00:00:00Z',
    'irgc_never_pre_war_conditions',
    0.75,
    ['strait_of_hormuz', 'iran', 'irgc'],
    {
      type: KeyframeType.PUBLIC_STATEMENT,
      certainty: 0.9,
      description:
        'IRGC Navy and Iranian Parliamentary Speaker Mohammad Bagher Ghalibaf state that the Strait of Hormuz "will never return to pre-war conditions".',
    },
  )
  .addDateKeyframe(
    '2026-08-07T12:00:00Z',
    'mecca_joint_defence_agreement',
    0.85,
    ['diplomacy', 'saudi_arabia', 'turkey', 'pakistan', 'mecca_accord'],
    {
      type: KeyframeType.MILESTONE,
      certainty: 0.95,
      description:
        'Saudi Arabia, Turkey, and Pakistan sign the Mecca Joint Defence Agreement (Mecca Defence Alliance) in Mecca amid regional turmoil.',
    },
  )
  .addDateKeyframe(
    '2026-09-01T00:00:00Z',
    'bahrain_ordered_departure_termination_memo',
    0.75,
    ['bahrain', 'evacuation', 'us_bases', 'families'],
    {
      type: KeyframeType.PUBLICATION,
      certainty: 0.9,
      description:
        'DoD issues the "Termination of Ordered Departure – Bahrain" directive setting 30 November 2026 as the cutoff for evacuation safe-haven housing payments; DoD watchdog reports hundreds of buildings damaged at US bases in the region.',
    },
  )
  .addDateKeyframe(
    '2026-09-11T00:00:00Z',
    'east_west_pipeline_precautionary_shutdown',
    0.8,
    ['pipeline', 'saudi_arabia', 'oil', 'infrastructure'],
    {
      type: KeyframeType.MILESTONE,
      certainty: 0.85,
      description:
        'Saudi Arabia shuts the East–West Crude Oil Pipeline as a precaution after drone attacks, halting it again on 5 October 2026 following a fresh strike.',
    },
  )
  .addDateKeyframe(
    '2026-10-23T16:00:00Z',
    'brent_settles_115_81',
    0.65,
    ['oil', 'brent', 'wti', 'economy'],
    {
      type: KeyframeType.MILESTONE,
      certainty: 0.95,
      description:
        'Brent crude settles at $115.81/bbl on 23 October 2026 ($115.22–$115.41 on 26 October; WTI ~$101–$103/bbl) amid Strait of Hormuz closure and Saudi infrastructure risk.',
    },
  )
  .addDateKeyframe(
    '2026-10-26T08:00:00Z',
    'houthi_riyadh_and_pumping_station_claims',
    0.8,
    ['houthis', 'riyadh', 'pipeline', 'readiness'],
    {
      type: KeyframeType.PUBLIC_STATEMENT,
      certainty: 0.85,
      description:
        'Houthi forces claim strikes on Riyadh airport and East–West oil pumping stations (unconfirmed by Saudi authorities); CNN reports US forces hold a 96-hour strike-readiness posture awaiting presidential authorization.',
    },
  )
  .addDateKeyframe(
    '2026-11-30T00:00:00Z',
    'bahrain_family_housing_funding_cutoff',
    0.7,
    ['bahrain', 'families', 'deadline'],
    {
      type: KeyframeType.MILESTONE,
      certainty: 0.85,
      description:
        'Scheduled termination date for DoD safe-haven housing allowances for military families evacuated from Bahrain.',
    },
  )
  .withWindowing('phase_based')
  .build();

iranWar.metadata = {
  ...iranWar.metadata,
  creators: ['Historical Actors of the United States, Israel, Iran, and Gulf States'],
};

export const iranWar2026Universe: Universe = iranWar;
