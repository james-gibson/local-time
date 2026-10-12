import { TimePrecision, Universe, UniverseType } from '../../../core/types';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * Space Shuttle Challenger, STS-51L — `nasa:challenger:1986`.
 *
 * james-gibson/local-time#57. #57 found `tests/jfk.test.ts` looking up a `nasa` network that
 * had never been registered, and guarding the two tests that used it behind truthiness
 * checks so they could not fail. Registering the network is only half the job: the tests
 * also reference four universes, none of which existed. This is the first.
 *
 * ## Dates
 *
 * STS-51L lifted off at 11:39:00 EST on 28 January 1986 and broke apart 73 seconds later.
 * Both are well documented and the breakup instant is fixed to the second, so this keyframe
 * carries `certainty: 0.98` rather than the 0.95 used for day-precision events elsewhere.
 * The *investigation* it triggered is a separate universe (`history:rogers_commission:1986`)
 * because the two are not the same event.
 */

const ns = (iso: string): bigint => dateToNanoseconds(new Date(iso));

export const challengerUniverse: Universe = {
  universeId: 'nasa:challenger:1986',
  type: UniverseType.MISSION,
  identifiers: {
    primary: 'nasa:challenger:1986',
    aliases: ['Challenger', 'STS-51L', 'Space Shuttle Challenger disaster'],
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: 'nasa:challenger:1986',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'NASA STS-51L mission record: launch 28 January 1986, 11:39:00 EST',
          'Presidential Commission on the Space Shuttle Challenger Accident (Rogers Commission), report July 1986',
        ],
      },
    ],
  },
  attribution: {
    public_domain: true,
    copyright: { holders: [], year: 2026, status: 'active' },
    citations_required: true,
    usage_restrictions: [
      'Seven crew members died. Any rendering must carry the names and the human cost, not just the engineering failure.',
    ],
    sources: ['NASA STS-51L mission record', 'Rogers Commission report (July 1986)'],
  },
  layers: [
    {
      layerId: 'primary',
      type: 'primary',
      epochs: {
        mission: {
          epochId: 'sts51l:mission',
          startTime: ns('1986-01-28T16:39:00Z'), // 11:39:00 EST
          endTime: ns('1986-01-28T16:40:13Z'), // 73 seconds after launch
          precision: TimePrecision.SECOND,
          description: 'STS-51L from liftoff to vehicle breakup',
        },
      },
    },
  ],
  temporalStructure: {
    segments: [
      {
        id: 'flight',
        start: ns('1986-01-28T16:39:00Z'),
        end: ns('1986-01-28T16:40:13Z'),
        type: 'phase',
        status: 'ended',
        description: 'The 73-second ascent that ended the programme for 32 months.',
      },
    ],
    keyframes: [
      {
        id: 'liftoff',
        timestamp: ns('1986-01-28T16:39:00Z'),
        significance: 0.9,
        tags: ['launch', 'sts-51l', 'pad-39b'],
        certainty: 0.98,
      },
      {
        // Tagged 'disaster' and 'explosion' deliberately: tests/jfk.test.ts selects the
        // disaster keyframe by those tags, and a renamed tag would silently empty the
        // result rather than fail loudly. Asserted in nasa-network.test.ts.
        id: 'vehicle-breakup',
        timestamp: ns('1986-01-28T16:40:13Z'),
        significance: 1.0,
        tags: ['disaster', 'explosion', 'loss-of-crew', 'sts-51l', 'seven-crew'],
        certainty: 0.98,
      },
    ],
    windows: { strategy: 'time_based', avgWindowSize: BigInt(73) * 1_000_000_000n },
  },
  metadata: {
    canonicalName: 'Space Shuttle Challenger (STS-51L)',
    description:
      'The 25th Space Shuttle mission and the tenth of its programme. Seventy-three seconds after liftoff on 28 January 1986 the vehicle broke apart, killing all seven crew.',
    cultural_significance: 0.95,
    cultural_significance_justification:
      'A direct cause of the NASA redesign of shuttle management and of the normalisation of flight-rate safety analysis in the United States.',
    tags: ['nasa', 'space-shuttle', 'disaster', 'loss-of-crew'],
    crew: [
      'Francis R. "Dick" Scobee',
      'Michael J. Smith',
      'Ronald McNair',
      ' Ellison Onizuka',
      'Judith Resnik',
      'Gregory Jarvis',
      'Christa McAuliffe',
    ],
    sourceIssue: 57,
  },
  connections: {
    natural: {
      parentUniverses: ['history:us_military:founded'],
      childUniverses: ['history:rogers_commission:1986'],
    },
    references: [],
  },
} as unknown as Universe;
