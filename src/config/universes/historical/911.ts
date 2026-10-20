import { TimePrecision, Universe } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { createHistoricalBuilder } from '../../../core/universe-builder';
import { NamedBoundary, NamedBoundaryEpoch, beforeAfter } from '../../../core/named-boundary';

/**
 * The September 11, 2001 Attacks
 *
 * This universe documents the coordinated terrorist attacks by al-Qaeda against the United States on the morning of September 11, 2001. The attacks resulted in 2,977 fatalities, over 25,000 injuries, and substantial long-term health consequences, in addition to at least $10 billion in infrastructure and property damage. It was the single deadliest terrorist attack in human history.
 *
 * The temporal structure focuses on the critical two-hour period during which the attacks unfolded, from the first impact at the World Trade Center to the collapse of the North Tower. This event fundamentally reshaped American foreign policy, domestic security, and air travel, and its repercussions continue to influence global politics.
 *
 * Cultural Significance: 1.0 - A watershed moment in modern world history. The attacks triggered the multi-decade Global War on Terrorism, led to the creation of the Department of Homeland Security, and profoundly altered the geopolitical landscape of the 21st century.
 *
 * Reality Relation: Documentary with 0.0 fictionalization.
 *
 * Research Sources:
 * - The 9/11 Commission Report (Final Report of the National Commission on Terrorist Attacks Upon the United States).
 * - National Institute of Standards and Technology (NIST) Reports on the collapse of the World Trade Center towers (NCSTAR 1).
 * - National September 11 Memorial & Museum Archives.
 * - Federal Aviation Administration (FAA) and North American Aerospace Defense Command (NORAD) records from September 11, 2001.
 *
 * Key Facts Verified (All times are EDT, UTC-4):
 * - 8:46:40 AM: American Airlines Flight 11 impacts the North Tower of the World Trade Center.
 * - 9:03:02 AM: United Airlines Flight 175 impacts the South Tower.
 * - 9:37:46 AM: American Airlines Flight 77 impacts the Pentagon.
 * - 9:59:00 AM: The South Tower collapses.
 * - 10:03:11 AM: United Airlines Flight 93 crashes in Shanksville, Pennsylvania.
 * - 10:28:22 AM: The North Tower collapses.
 *
 * Hierarchical Context: US_GOVERNMENT -> US_HISTORY -> WORLD_HISTORY
 *
 * ## The named boundary (pre/post 9/11)
 *
 * The first impact is the instant the common epoch divides on. It is declared
 * once here — `FIRST_IMPACT` — used by the `north_tower_impact` keyframe, and
 * re-exported as a `NamedBoundary`, so every "post-9/11" frame in the corpus
 * derives from the same id and instant. See `src/core/named-boundary.ts` and
 * `src/config/universes/common-epochs.ts`.
 *
 * ## Repaired with the boundary (#175)
 *
 * The module shipped with `createHistoricalUniverseId('us',
 * 'september_11_attacks', '2001')` — which builds `history:us:2001`, not the id
 * its `identifiers.primary` claimed; timestamps were milliseconds in nanosecond
 * fields; and segments used `segmentId`/`startTime`/`endTime` plus a `tags` field
 * the type does not have. It now builds through the builder, so `build()`
 * validates it, and the id is `history:us:september_11_attacks:2001`.
 */

const at = (iso: string): bigint => BigInt(new Date(iso).getTime()) * 1_000_000n;

/** 12:46:40Z — 08:46:40 EDT, American Airlines Flight 11 strikes the North Tower. */
const FIRST_IMPACT = at('2001-09-11T12:46:40Z');

export const NINE_ELEVEN_BOUNDARY: NamedBoundary = {
  idPrefix: 'period:nine_eleven',
  label: 'the September 11 attacks',
  instant: FIRST_IMPACT,
  precision: TimePrecision.SECOND,
  source: {
    universeId: 'history:us:september_11_attacks:2001',
    keyframeId: 'north_tower_impact',
  },
};

export const {
  before: PRE_NINE_ELEVEN,
  after: POST_NINE_ELEVEN,
}: { before: NamedBoundaryEpoch; after: NamedBoundaryEpoch } = beforeAfter(NINE_ELEVEN_BOUNDARY);

const september11 = createHistoricalBuilder()
    .historical('us:september_11_attacks', 2001)
    .withAliases(['9/11', 'September 11th Attacks'])
    .withCanonicalName('September 11, 2001 Attacks')
    .withDescription(
        'A series of four coordinated terrorist attacks by al-Qaeda against the United States on September 11, 2001.',
    )
    .withReleased('2001-09-11T12:46:40Z')
    .withCulturalSignificance(1.0)
    .withRealityRelation('documentary', 0.0, [
        {
            realEventId: 'history:us:september_11_attacks:2001',
            relationshipType: 'documents',
            confidence: 1.0,
            evidence: ['The 9/11 Commission Report', 'NIST NCSTAR 1'],
        },
        {
            realEventId: 'nist_wtc_investigation_2005',
            relationshipType: 'documents',
            confidence: 1.0,
            evidence: ['NIST NCSTAR 1, the WTC collapse investigation'],
        },
        {
            realEventId: 'flight_recorders_2001',
            relationshipType: 'documents',
            confidence: 1.0,
            evidence: ['NTSB transcripts of the four cockpit voice and flight data recorders'],
        },
    ])
    .withPublicDomain(['9/11 Commission', 'NIST', 'National Archives', 'FAA'])
    .withUsageRestrictions([
        'Use of imagery and personal accounts is subject to sensitivities and should be handled with respect for the victims.',
    ])
    .addParent(CommonUniverseIds.US_HISTORY)
    .addParent(CommonUniverseIds.WORLD_HISTORY)
    .addDateSegment(
        '2001-09-11T12:46:40Z',
        '2001-09-11T14:28:22Z',
        'attacks_unfold',
        'phase',
        'inactive',
        'United States',
        'The core period of the attacks, from the first impact to the collapse of the North Tower.',
    )
    .addDateKeyframe('2001-09-11T12:46:40Z', 'north_tower_impact', 1.0, ['wtc', 'flight_11', 'attack_begins'], {
        certainty: 1.0,
        precision: TimePrecision.SECOND,
        description:
            'American Airlines Flight 11 strikes the North Tower of the World Trade Center between floors 93 and 99.',
    })
    .addDateKeyframe('2001-09-11T13:03:02Z', 'south_tower_impact', 1.0, ['wtc', 'flight_175', 'second_impact'], {
        certainty: 1.0,
        precision: TimePrecision.SECOND,
        description:
            'United Airlines Flight 175 strikes the South Tower of the World Trade Center between floors 77 and 85, confirming a coordinated attack.',
    })
    .addDateKeyframe('2001-09-11T13:37:46Z', 'pentagon_impact', 0.95, ['pentagon', 'flight_77', 'attack_on_military_hq'], {
        certainty: 1.0,
        precision: TimePrecision.SECOND,
        description: 'American Airlines Flight 77 crashes into the western facade of the Pentagon.',
    })
    .addDateKeyframe('2001-09-11T13:59:00Z', 'south_tower_collapse', 1.0, ['wtc', 'structural_failure', 'collapse'], {
        certainty: 1.0,
        precision: TimePrecision.SECOND,
        description: 'The South Tower of the World Trade Center collapses after burning for 56 minutes.',
    })
    .addDateKeyframe('2001-09-11T14:03:11Z', 'flight_93_crash', 0.98, ['flight_93', 'passenger_revolt', 'shanksville'], {
        certainty: 1.0,
        precision: TimePrecision.SECOND,
        description:
            'United Airlines Flight 93, following a passenger revolt against the hijackers, crashes into a field in Shanksville, Pennsylvania.',
    })
    .addDateKeyframe('2001-09-11T14:28:22Z', 'north_tower_collapse', 1.0, ['wtc', 'structural_failure', 'collapse'], {
        certainty: 1.0,
        precision: TimePrecision.SECOND,
        description: 'The North Tower of the World Trade Center collapses after burning for 102 minutes.',
    })
    .withWindowing('phase_based')
    .build();

// `metadata.creators` has no builder setter (al-Qaeda is not a credited person).
september11.metadata = { ...september11.metadata, creators: ['al-Qaeda'] };

export const september11AttacksUniverse: Universe = september11;
