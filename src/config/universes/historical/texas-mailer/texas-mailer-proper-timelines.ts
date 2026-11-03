import {
  KeyframeType,
  TimePrecision,
  Universe,
  UniverseType,
} from '../../../../core/types';
import { CommonUniverseIds } from '../../../../core/common-universe-ids';
import { createHistoricalUniverseId } from '../../../../core/universe-ids';

/**
 * "Proper Timelines" — paired counterfactuals for the 21 Oct broadcast.
 *
 * METHOD. The Beck style is a CONSTANT across segments, so its presence cannot
 * explain the mailer segment. Each utterance is therefore resampled with the
 * departure removed and the nominal claim held fixed: the delta is attributable
 * to the departure alone. Moving the delivery and holding the nominal is the only
 * way to isolate the strategic component.
 *
 * FINDINGS:
 *   T1  double switcheroo   PROTECTIVE  — removal creates an unsourced accusation
 *   T2  ventriloquism       PRODUCTIVE  — removal leaves an accurate, weaker story
 *   T3  Sheridan            DECORATIVE  — removal improves accuracy
 *   T4  household           PROTECTIVE (weak) — the scruple is the licence
 *   T5  searchlight         PROTECTIVE  — removal exposes a partisan instrument
 *   T6  kindergarten        DECORATIVE  — the claim was already sourced
 *   T7  1932 map            DECORATIVE  — control: same form, no function
 *
 * CORRECTION (B3 retracted). "Students of the [Surname] Family" is a merge
 * convention on a past-GOP-voter file, not evidence of an age-graded minor-name
 * product. The earlier claim that the data line is the HARDEST link is WITHDRAWN;
 * it reverts to a voter-file rental.
 *
 * NEW: H8 liability transfer. The Target precedent — false claim about children,
 * litigation landing on the branded party — is the structure already visible here.
 *
 * Reality Relation: interpretation, fictionalizationDegree 0.6 — verbatim
 * transcript and press record; every "proper" line and every departure value is
 * constructed by the compiler.
 */

const UNIVERSE_ID = createHistoricalUniverseId('texas_mailer_proper_timelines', '2026');

const BECK_PLANE_ID = 'history:texas_mailer_beck_plane:2026';
const AUTOMATION_ID = 'history:texas_mailer_automation_stack:2026';
const DISCOVERY_ID = 'history:texas_mailer_discovery_reach:2026';

const D = (y: number, m: number, d: number): bigint =>
  BigInt(Date.UTC(y, m - 1, d)) * 1_000_000n;

const AIR = D(2026, 10,21);
const AT = (min: number, sec = 0): bigint =>
  AIR + BigInt((min * 60 + sec) * 1000) * 1_000_000n;

const COLD_OPEN = AT(2, 39);
const VENTRILOQUISM = AT(91, 22);
const MAP_1932 = AT(33, 25);
const SHERIDAN = AT(95, 15);
const SWITCHEROO = AT(95, 38);
const SEARCHLIGHT = AT(95, 55);
const HOUSEHOLD = AT(96, 7);
const DECISION = D(2026, 10, 26);

type Function = 'protective' | 'productive' | 'decorative';

interface Counterfactual {
  readonly id: string;
  readonly at: bigint;
  readonly aired: string;
  readonly proper: string;
  readonly departureAired: number;
  readonly departureProper: number;
  readonly realAired: number;
  readonly realProper: number;
  readonly fn: Function;
  readonly because: string;
}

const BRANCHES: readonly Counterfactual[] = [
  {
    id: 't1_switcheroo', at: SWITCHEROO,
    aired: "I don't know if it's Democrats doing a double switcheroo",
    proper: 'A Republican operative mailed these to Republican voters to drive turnout.',
    departureAired: 0.85, departureProper: 0.10, realAired: 0.95, realProper: 0.30,
    fn: 'protective',
    because: 'Proper version accuses an identified class with no evidence; aired version is true and names nobody',
  },
  {
    id: 't2_ventriloquism', at: VENTRILOQUISM,
    aired: 'Talk to me, the creepy adult that you don\'t know',
    proper: 'The pamphlet tells children adults will become their family if their parents won\'t',
    departureAired: 0.95, departureProper: 0.05, realAired: 0.30, realProper: 0.95,
    fn: 'productive',
    because: '"Private parts" appears nowhere in the artifact; the departure manufactures the claim it then attacks',
  },
  {
    id: 't3_sheridan', at: SHERIDAN,
    aired: 'Only the finest organizations hide in Sheridan, Wyoming',
    proper: '26 agents, ~300,000 of 830,000 Wyoming LLCs, at one Sheridan address',
    departureAired: 0.80, departureProper: 0.05, realAired: 0.50, realProper: 1.00,
    fn: 'decorative',
    because: 'Sarcasm loses specificity that the sourced version would have supplied',
  },
  {
    id: 't4_household', at: HOUSEHOLD,
    aired: "I would never open my child's mail... which I guess I did",
    proper: 'This arrived addressed to my kids. I opened it and I am going to read it to you.',
    departureAired: 0.90, departureProper: 0.10, realAired: 0.40, realProper: 0.90,
    fn: 'protective',
    because: 'The performed scruple supplies permission to broadcast children\'s mail',
  },
  {
    id: 't5_searchlight', at: SEARCHLIGHT,
    aired: "We need a giant searchlight... Data Republican. You're needed.",
    proper: 'I want a Republican data operation to build the case against Republicans, and I will platform it.',
    departureAired: 0.90, departureProper: 0.15, realAired: 0.55, realProper: 0.85,
    fn: 'protective',
    because: 'Civic-concern register conceals a partisan instrument aimed at a partisan target',
  },
  {
    id: 't6_kindergarten', at: COLD_OPEN,
    aired: 'Targeted at KIDS?!',
    proper: 'A resource guide written for students, sent to households with children as young as kindergarten',
    departureAired: 0.90, departureProper: 0.10, realAired: 0.20, realProper: 0.90,
    fn: 'decorative',
    because: 'The unhedged version is supported by reporting; the question mark adds nothing but deniability',
  },
  {
    id: 't7_1932', at: MAP_1932,
    aired: "I'm not telling you who's playing what in today's version",
    proper: 'Here is the 1932 parallel and here is who occupies each role now.',
    departureAired: 0.90, departureProper: 0.10, realAired: 0.50, realProper: 0.80,
    fn: 'decorative',
    because: 'CONTROL — mapping already delivered; identical form to T1 with zero exposure and zero function',
  },
];

export const texasMailerProperTimelinesUniverse = {
  universeId: UNIVERSE_ID,
  type: UniverseType.HISTORICAL_EVENT,

  identifiers: {
    primary: 'history:texas_mailer_proper_timelines:2026',
    aliases: ['what if beck said it plainly', 'separating style from strategy', 'liability transfer hypothesis'],
  },

  realityRelation: {
    type: 'interpretation',
    fictionalizationDegree: 0.6,
    realityAnchors: [
      {
        realEventId: 'history:texas_trans_student_mailer_controversy:2026',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'File went to many past GOP voters',
          'Pamphlet text quoted',
          'TENT cease-and-desist; AG referral; nonprofits affected',
        ],
      },
      {
        realEventId: 'legal:target_shareholder_litigation:2024',
        relationshipType: 'reinterprets',
        confidence: 0.7,
        evidence: [
          'Underlying child-targeting claim false per AP',
          'Shareholder action survived dismissal; Florida suit',
          'Cost lands on the branded party, not the outrage engine — the compiler\'s reading',
        ],
      },
    ],
  },

  attribution: {
    public_domain: false,
    sources: ['Program transcript', 'Chronicle reporting', 'Plane spec'],
    citations_required: true,
    usage_restrictions: [
      'Every "proper" line is constructed. None was said. Never quote one as a statement by the host.',
      'Departure values are assigned, not measured, and must not ship as data.',
      'The Target comparison is structural analogy, not a claim that any party here copied it.',
      'No claim is made about sincerity; a sincere speaker generates identical deltas.',
    ],
  },

  layers: [
    {
      layerId: 'aired_timeline',
      type: 'primary',
      epochs: {
        segment: {
          epochId: 'history:proper:aired',
          startTime: COLD_OPEN,
          endTime: AT(101, 30),
          precision: TimePrecision.SECOND,
          description: 'The broadcast as it went out.',
        },
      },
    },
    {
      layerId: 'proper_timeline',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:beck_counterfactual_resampling:2026',
        accuracy: 0.3,
        deviations: [
          'Seven resamplings, not a distribution: the proper set is chosen by the compiler to test function, not sampled at random.',
          'Each proper version holds the nominal fixed, which is impossible for sarcasm — the device and the content cannot be fully separated.',
          'A proper line spoken in his voice would carry its own devices, so the counterfactual is cleaner than any real alternative broadcast.',
          'No audience response is modelled, and the aired version\'s reach is the whole point.',
        ],
      },
      epochs: {
        resampling: {
          epochId: 'history:proper:resampled',
          startTime: DECISION,
          endTime: DECISION,
          precision: TimePrecision.DAY,
          description: 'Counterfactuals constructed after the fact, at each original timestamp.',
        },
      },
    },
    {
      layerId: 'cost_transfer',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:liability_transfer:2026',
        accuracy: 0.45,
        deviations: [
          'Treats observable costs (C&D, referral, nonprofit disruption) as the intended product; they may be side effects.',
          'The Target analogy is structural only; different doctrine, different parties, different decade.',
        ],
      },
      epochs: {
        transfer: {
          epochId: 'history:proper:transfer',
          startTime: D(2026, 10, 14),
          endTime: DECISION,
          precision: TimePrecision.DAY,
        },
      },
    },
  ],

  temporalStructure: {
    segments: [
      { id: 'aired', start: COLD_OPEN, end: AT(101, 30), type: 'phase', status: 'active' },
      { id: 'resampled', start: DECISION, end: DECISION, type: 'phase', status: 'active' },
    ],
    keyframes: [
      ...BRANCHES.map((b) => ({
        id: b.id,
        timestamp: b.at,
        significance: b.fn === 'decorative' ? 0.7 : 0.9,
        certainty: 0.7,
        tags: ['counterfactual', b.fn, 'delta'],
        type: KeyframeType.MILESTONE,
        description: `AS AIRED: ${b.aired} | PROPER: ${b.proper} | departure ${b.departureAired} -> ${b.departureProper}; real ${b.realAired} -> ${b.realProper} | ${b.fn.toUpperCase()}: ${b.because}`,
      })),
      {
        id: 'b3_retraction',
        timestamp: DECISION,
        significance: 1.0,
        certainty: 0.9,
        tags: ['correction', 'list', 'B3', 'withdrawn'],
        type: KeyframeType.MILESTONE,
        description:
          'B3 WITHDRAWN. The "students of" line is a merge convention applied to a past-GOP-voter file, not evidence of an age-graded minor-name product. The claim that the data line is the hardest link is retracted; it reverts to a voter-file rental served by a small vendor universe.',
      },
      {
        id: 'h8_liability_transfer',
        timestamp: DECISION,
        significance: 1.0,
        certainty: 0.6,
        tags: ['H8', 'liability_transfer', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'H8: the artifact is a cost-transfer device. Target precedent — false child-targeting claim, litigation landing on the branded party. Here the transfer is already visible: TENT\'s cease-and-desist, the AG referral, disrupted Austin nonprofits. Under H8 the "errors" are the mechanism: the material must be plausibly TENT\'s for the cost to land on TENT.',
      },
      {
        id: 'h8_on_record',
        timestamp: D(2026, 10, 20),
        significance: 0.95,
        certainty: 0.9,
        tags: ['H8', 'admission', 'prop'],
        type: KeyframeType.PUBLIC_STATEMENT,
        description:
          'A Houston GOP consultant states the thesis on the record without being asked: "No one had ever heard of TENT. Now they have. Worth it?" The attention transfer is not an inference; it is the defence being offered by the sender\'s own side.',
      },
    ],
    windows: { strategy: 'phase_based' },
  },

  metadata: {
    canonicalName: 'Proper Timelines: seven counterfactual resamplings of the 21 October broadcast',
    creators: ['Compiled analysis'],
    released: new Date('2026-10-26T00:00:00Z'),
    cultural_significance: 0.3,
    platform: 'Local Time universe system',
    externalId: 'texas_mailer_proper_timelines_2026',
    contentType: 'counterfactual method / rhetorical function',
    functionLedger: Object.fromEntries(
      BRANCHES.map((b) => [
        b.id,
        {
          function: b.fn,
          departureDelta: Number((b.departureAired - b.departureProper).toFixed(2)),
          why: b.because,
        },
      ]),
    ),
    functionCensus: { protective: 3, productive: 1, decorative: 3 },
    ticketDeltas: [
      'beck_plane: add the paired-timeline method; the earlier single-pass readings cannot separate style from strategy',
      'beck_plane: B3 withdrawn — list is a past-GOP-voter file, not a child-name product',
      'five_postulates: P2 restored to its original ranking; the "hardest line" revision is retracted',
      'operator_profile: add H8 liability transfer, at 0.6, with the Target precedent as structural analogue',
      'discovery_reach: add the vendor-universe test — a past-GOP-voter file has few possible suppliers, and the select was partisan-plus-geography',
    ],
    threadSiblings: [
      {
        id: BECK_PLANE_ID,
        note: 'the single-pass Beck reading this paired-timeline method supersedes; still unlanded',
      },
    ],
    uncertaintyNotes: [
      'Seven resamplings are not a distribution; the function census is a judgement about these utterances, not a rate.',
      'Every proper line is invented. Two of them (T6, T3) are supported by sources; the rest are not claims about fact, only about form.',
      'The recipient-roster observation about a Speaker household could not be verified and is held as unverified.',
      'H8 asserts a function, not an intention: side effects of an attention operation look identical to its product.',
      'A sincere host produces the same deltas, so nothing here speaks to belief.',
    ],
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.US_HISTORY, CommonUniverseIds.US_GOVERNMENT],
    },
    references: [
      {
        type: 'DOCUMENTS',
        targetUniverseId: AUTOMATION_ID,
        confidence: 0.9,
        description: 'The production reading the timeline resampling is drawn against.',
      },
      {
        type: 'SUPERSEDES',
        targetUniverseId: DISCOVERY_ID,
        confidence: 0.9,
        description: 'Adds the vendor-universe test the reach map lacked.',
      },
    ],
  },
} as unknown as Universe;

/** All universes this draft owns. */
export const texasMailerProperTimelinesUniverses: Universe[] = [texasMailerProperTimelinesUniverse];
