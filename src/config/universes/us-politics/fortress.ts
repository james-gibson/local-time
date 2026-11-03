import { KeyframeType, Universe } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { createHistoricalBuilder } from '../../../core/universe-builder';
import { createHistoricalUniverseId } from '../../../core/universe-ids';
import { IRAN_WAR_2026_ID } from '../global-politics/iran-war';

/**
 * FORTRESS America Initiative (`history:fortress:2026`).
 *
 * Documents the Department of War's FORTRESS America program established on
 * 30 September 2026 by Secretary Pete Hegseth for the defense of the American
 * homeland, requiring major US-based military installations to sustain 90 days
 * of off-grid energy, water, and cyber resilience, alongside the push to codify
 * the "Department of War" statutory designation in the FY27 NDAA following
 * Executive Order 14347.
 *
 * Landed as part of `james-gibson/local-time#212` Phase 2. The 2026-10-26
 * *Anchor Watch* episode (`series:bobby_jones_erupts_over_hegseth:2026`) reads
 * FORTRESS as an admission that overseas US bases can be isolated and that the
 * US is no longer a superpower; because the directive's actual scope is domestic
 * homeland installations operating off-grid, the episode carries a `contradicts`
 * anchor and `CONTRADICTS` reference to this universe (D19, guide #208).
 */

export const FORTRESS_PROGRAM_2026_ID = createHistoricalUniverseId('fortress', 2026);

const fortress = createHistoricalBuilder()
  .historical('fortress', 2026)
  .withAliases([
    'FORTRESS America',
    'Pentagon 90-Day Installation Self-Sufficiency Initiative',
    'program:fortress:2026',
  ])
  .withCanonicalName('FORTRESS America Initiative (Department of War, 2026)')
  .withDescription(
    'Timeline of the FORTRESS America program established on 30 September 2026 alongside Executive Order 14347 and the Pentagon\'s push to codify the "Department of War" designation, requiring major US-based military installations to sustain 90 days of off-grid energy, water, and cyber resilience.',
  )
  .withReleased('2026-09-30')
  .withCulturalSignificance(0.75)
  .withRealityRelation('documentary', 0.0, [
    {
      realEventId: IRAN_WAR_2026_ID,
      relationshipType: 'documents',
      confidence: 0.9,
      evidence: [
        'Homeland installation resilience directive issued during the 2026 Iran war',
        'DoD Directive: Establishment of FORTRESS America (30 Sep 2026)',
      ],
    },
  ])
  .withPublicDomain([
    'U.S. Department of Defense / Department of War directive (30 Sep 2026)',
    'Executive Order 14347',
    'Air & Space Forces Magazine',
    'Snopes / Newsweek fact checks (Oct 2026)',
  ])
  .withUsageRestrictions([
    'FORTRESS applies to domestic US homeland installations operating off-grid for 90 days; commentary interpreting it as an admission that overseas US bases are abandoned contradicts the directive\'s scope.',
  ])
  .addParent(CommonUniverseIds.US_GOVERNMENT)
  .addParent(CommonUniverseIds.US_MILITARY)
  .addReference({
    type: 'DOCUMENTS',
    targetUniverseId: IRAN_WAR_2026_ID,
    description:
      'Issued during the 2026 Iran war to harden domestic installations against grid and supply disruption.',
  })
  .addEpoch(
    '2026-09-01T00:00:00Z',
    '2026-10-31T23:59:59Z',
    'department_of_war_and_fortress_rollout',
    undefined,
    undefined,
    {
      description:
        'Executive Order 14347, establishment of FORTRESS America on 30 September 2026, and the FY27 NDAA codification push.',
    },
  )
  .addDateSegment(
    '2026-09-01',
    '2026-10-31',
    'directive_and_initial_implementation',
    'legislation_active',
    'active',
    'United States',
    'Establishment of FORTRESS America and legislative push to codify the Department of War designation.',
  )
  .addDateKeyframe(
    '2026-09-30T12:00:00Z',
    'fortress_america_established',
    0.9,
    ['fortress', 'homeland_defense', 'off_grid', 'readiness'],
    {
      type: KeyframeType.PUBLICATION,
      certainty: 0.95,
      description:
        'Secretary Pete Hegseth establishes FORTRESS America as a Department of War program for the defense of the American homeland, mandating 90-day off-grid self-sufficiency in energy and water for major US-based installations.',
    },
  )
  .addDateKeyframe(
    '2026-10-15T12:00:00Z',
    'fy27_ndaa_department_of_war_codification_push',
    0.8,
    ['department_of_war', 'ndaa', 'legislation', 'congress'],
    {
      type: KeyframeType.LEGISLATION,
      certainty: 0.9,
      description:
        'Following Executive Order 14347, the Pentagon presses Congress to codify the "Department of War" statutory name in the FY27 National Defense Authorization Act.',
    },
  )
  .addDateKeyframe(
    '2026-10-22T12:00:00Z',
    'eisenhower_wwii_globe_damaged',
    0.55,
    ['pentagon', 'eisenhower_globe', 'hegseth'],
    {
      type: KeyframeType.MILESTONE,
      certainty: 0.85,
      description:
        'The Washington Post and NBC News report that staffers moving a historic WWII-era Eisenhower globe for Secretary Hegseth\'s office dropped and damaged it.',
    },
  )
  .withWindowing('phase_based')
  .build();

fortress.metadata = {
  ...fortress.metadata,
  creators: ['United States Department of Defense (Department of War)'],
};

export const fortressProgram2026Universe: Universe = fortress;
