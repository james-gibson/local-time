import {
  KeyframeType,
  TimePrecision,
  Universe,
  UniverseType,
} from '../../../../core/types';
import { CommonUniverseIds } from '../../../../core/common-universe-ids';
import { createHistoricalUniverseId } from '../../../../core/universe-ids';

/**
 * "Beck on the Plane" — rewrite of the broadcast section using 42i inversions.
 *
 * REPLACES the earlier treatment of the 21 Oct 2026 Glenn Beck segment as
 * evidence for the prop hypothesis. That framing read the segment's real tier
 * (what it asserted) and found it thin, because the segment asserts almost
 * nothing. The rewrite reads the imaginary component, per PLANE.md: each claim is
 * complex — real tier + i·(42i distance) — the distance is derived from
 * zero-status, and "is this value still trusted" means project the sample and read
 * the departure [^2].
 *
 * FINDINGS:
 *   B1  The segment's real tier is scrupulous; the payload is entirely in the
 *       departure. Fact-checking lands on the real tier and therefore cannot reach
 *       the accusation. This explains the shape of the coverage, not its content.
 *   B2  Beck states the false-flag hypothesis on air at 01:35:38 — "I don't know
 *       if it's Democrats doing a double switcheroo" [^1] — five
 *       days before this analysis reached a structurally identical hypothesis,
 *       with the same structure and the opposite polarity.
 *   B3  The list carried minor children's names, not household names: the mailer
 *       was addressed to "students of the Glen Beck family" [^1].
 *       This is a data-vendor constraint, and it reverses the P2 ranking: the data
 *       line is the HARDEST line, because child-name files are the most regulated
 *       class in the chain.
 *   B4  The disclaimer-then-mapping pattern recurs within the same hour in the
 *       Bubba/1932 segment [^d02ba2#570]: a refusal to map, immediately preceded
 *       by a complete mapping. House style, not slip.
 *
 * Cultural Significance: 0.3 — the segment is the event that made the mailer national.
 * Reality Relation: interpretation, fictionalizationDegree 0.55 — transcript is
 * verbatim; every 42i distance is compiler-assigned; extending PLANE.md from
 * service-level measurement to rhetoric is an analogy, recorded as a deviation.
 *
 * Hierarchical Context: US_HISTORY -> US_MEDIA. derives_from five_postulates and
 * automation_stack; supersedes the prior broadcast section of the operator-profile
 * module and the open-web reading of P6a.
 */

const UNIVERSE_ID = createHistoricalUniverseId(
  'texas_mailer_beck_plane',
  '2026',
);

const OPERATOR_PROFILE_ID = 'history:texas_mailer_operator_profile:2026';
const FIVE_POSTULATES_ID = 'history:texas_mailer_five_postulates:2026';
const AUTOMATION_ID = 'history:texas_mailer_automation_stack:2026';

/* Clock: UTC midnight, plus offsets along the linear axis. m is 1-based. */
const D = (y: number, m: number, d: number): bigint =>
  BigInt(Date.UTC(y, m - 1, d)) * 1_000_000n;

const AIR_DATE = D(2026, 10, 21);

/** Linear-axis position within the broadcast, in ms. */
const AT = (min: number, sec = 0): bigint =>
  AIR_DATE + BigInt((min * 60 + sec) * 1000) * 1_000_000n;

const COLD_OPEN = AT(2, 39);
const SEGMENT_START = AT(91, 22);
const SHERIDAN = AT(95, 15);
const DOUBLE_SWITCHEROO = AT(95, 38);
const SEARCHLIGHT = AT(95, 55);
const HOUSEHOLD = AT(96, 7);
const OPENED_IT = AT(96, 23);
const DEAD_LINK = AT(97, 24);
const STRANGER_DANGER = AT(99, 4);
const FALSE_FLAG_DISCLAIMER_IN_1932 = AT(33, 25);
const EPISODE_PUBLISHED = AT(0, 0);

/** A plane sample: real tier in [0,1], 42i departure in [0,1]. */
interface PlaneSample {
  readonly real: number;
  readonly departure: number;
  readonly zeroStatus: 'established' | 'not_established';
}

const s = (real: number, departure: number, established = false): PlaneSample => ({
  real,
  departure,
  zeroStatus: established ? 'established' : 'not_established',
});

export const texasMailerBeckPlaneUniverse = {
  universeId: UNIVERSE_ID,
  type: UniverseType.HISTORICAL_EVENT,

  identifiers: {
    primary: 'history:texas_mailer_beck_plane:2026',
    aliases: [
      'what did Glenn Beck say about the mailers',
      'double switcheroo',
      '42i reading of the broadcast segment',
      'why fact-checking the segment fails',
    ],
  },

  realityRelation: {
    type: 'interpretation',
    fictionalizationDegree: 0.55,

    realityAnchors: [
      {
        realEventId: 'broadcast:glenn_beck_program:2026',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'Episode published 21 Oct 2026, titled "Millions of Texans Receive Transgender Pamphlets Targeted at KIDS?!" [^d02ba2#35]',
          'Mailer segment runs from about 01:31:22 [^d02ba2#3414]',
          'Host reports a copy addressed to children in his own household [^1]',
          'Guest segment with Andy Ngo concerns the Zizians, not the mailer [^d02ba2#39]',
        ],
      },
      {
        realEventId: 'analysis:local_time_plane:2026',
        relationshipType: 'reinterprets',
        confidence: 0.7,
        evidence: [
          'Value is complex: real tier + i·(42i distance) [^2]',
          'Imaginary part derived from zero-status: established → 0, otherwise backfilled [^2]',
          'Same value at a different linear position is a different verdict [^2]',
          'Anchor is 42 (proven consensus) or 42i (working hypothesis) [^2]',
        ],
      },
      {
        realEventId: OPERATOR_PROFILE_ID,
        relationshipType: 'reinterprets',
        confidence: 1.0,
        evidence: ['Supersedes the earlier broadcast section; same event, different measurement'],
      },
    ],
  },

  attribution: {
    public_domain: false,
    sources: [
      'Program transcript [^1]',
      'Plane specification [^2]',
    ],
    citations_required: true,
    usage_restrictions: [
      'PLANE.md measures service-level trust in a lab federation. Applying it to rhetoric is an analogy and is marked as a deviation, not a derivation.',
      'Every 42i value here is compiler-assigned, not measured. Do not present the numbers as findings.',
      'Quotations are verbatim from an automated transcript and may contain transcription errors; check against audio before publication.',
      'No claim is made about the host\'s beliefs. The analysis concerns the formal structure of the utterances, not their sincerity.',
    ],
  },

  layers: [
    {
      layerId: 'broadcast_transcript',
      type: 'primary',
      epochs: {
        segment: {
          epochId: 'history:beck:segment',
          startTime: SEGMENT_START,
          endTime: AT(101, 30),
          precision: TimePrecision.SECOND,
          description: 'Mailer discussion within the 21 Oct programme.',
        },
      },
    },

    {
      layerId: 'doublespeak_plane',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:beck_42i_projection:2026',
        accuracy: 0.4,
        deviations: [
          'PLANE.md is a service-level trust model; its nominal axis is a promised interval, and this layer maps that slot to a speech act\'s literal assertion. That mapping is the compiler\'s invention.',
          'Real tier and departure are assigned by judgement on a 0-1 scale; no instrument produces them.',
          'The analogy assumes an utterance has a single nominal claim, which is false for sarcasm by construction.',
          'Dialogue is attributed to the host as spoken; some lines are producer or co-host interjections in the transcript and cannot always be separated.',
        ],
      },
      epochs: {
        measurement: {
          epochId: 'history:beck:measurement',
          startTime: EPISODE_PUBLISHED,
          endTime: AT(101, 30),
          precision: TimePrecision.SECOND,
          description:
            'Samples taken along the linear axis at their spoken positions; the ordering is the freq/phase axis the plane sorts on.',
        },
      },
    },

    {
      layerId: 'information_ledger',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:coverage_information_gain:2026',
        accuracy: 0.6,
        deviations: [
          'Counts facts added to the record rather than airtime or audience, which are unavailable.',
          'Treats "the host received one" as a fact about list composition, which is an inference from a single household.',
        ],
      },
      epochs: {
        coverage: {
          epochId: 'history:beck:coverage',
          startTime: EPISODE_PUBLISHED,
          endTime: D(2026, 10, 26),
          precision: TimePrecision.DAY,
        },
      },
    },
  ],

  temporalStructure: {
    segments: [
      { id: 'cold_open', start: COLD_OPEN, end: AT(3, 43), type: 'phase', status: 'active' },
      { id: 'mailer_tease', start: AT(42, 41), end: AT(43, 17), type: 'phase', status: 'active' },
      { id: 'mailer_segment', start: SEGMENT_START, end: AT(101, 30), type: 'phase', status: 'active' },
      { id: 'post_broadcast', start: AT(101, 30), end: D(2026, 10, 26), type: 'phase', status: 'active' },
    ],

    keyframes: [
      /* ---------- the frame ---------- */
      {
        id: 'b_frame_is_a_question_mark',
        timestamp: EPISODE_PUBLISHED,
        significance: 0.9,
        certainty: 0.9,
        tags: ['B1', 'framing', 'zero_status'],
        type: KeyframeType.MILESTONE,
        description:
          'The title asserts and hedges in one breath: "Targeted at KIDS?!" [^d02ba2#35]. Under the plane reading this is not indecision but a low-cost structure — the assertion travels in syndication and the question mark stays behind as the defence. zero-status: not_established, so the departure is backfilled.',
        plane: s(0.2, 0.9),
      },
      {
        id: 'b_cold_open_ventriloquism',
        timestamp: COLD_OPEN,
        significance: 0.85,
        certainty: 0.85,
        tags: ['B1', 'ventriloquism'],
        type: KeyframeType.MILESTONE,
        description:
          'The flyer is performed rather than quoted — "Talk to me, the creepy adult that you don\'t know" [^1]. What follows is treated as the artifact\'s voice, which supplies language the artifact does not contain. The departure is the substitution, and it happens before any fact is stated.',
        plane: s(0.3, 0.95),
      },

      /* ---------- the finding ---------- */
      {
        id: 'b_double_switcheroo',
        timestamp: DOUBLE_SWITCHEROO,
        significance: 1.0,
        certainty: 0.95,
        tags: ['B2', 'H6', 'false_flag', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The single most consequential sentence in the coverage: "I don\'t know who is behind it. I don\'t know if it\'s Republicans. I don\'t know if it\'s Democrats doing a double switcheroo." [^1]. Real tier: true, he does not know. Departure: the false-flag hypothesis, named with a partisan sign attached. This is H6 — that the artifact was made for its coverage rather than its effect — arriving on national air five days ahead of this analysis, with identical structure and inverted polarity.',
        plane: s(0.95, 0.85),
      },
      {
        id: 'b_searchlight_delegation',
        timestamp: SEARCHLIGHT,
        significance: 0.9,
        certainty: 0.85,
        tags: ['B2', 'delegation', 'attribution'],
        type: KeyframeType.MILESTONE,
        description:
          'Immediately after the disclaimer, the accusation is outsourced: "We need a giant searchlight… Data Republican. You\'re needed." [^1]. The host does not make the claim; he summons a partisan data operator to make it, which preserves the real tier while moving the departure into someone else\'s mouth. This is the mechanism by which the segment stays literally accurate.',
        plane: s(0.55, 0.9),
      },
      {
        id: 'b_sheridan_as_finding',
        timestamp: SHERIDAN,
        significance: 0.85,
        certainty: 0.85,
        tags: ['B1', 'evaluation_as_fact'],
        type: KeyframeType.MILESTONE,
        description:
          '"Only the finest organizations hide in Sheridan, Wyoming and claim to be Texan" [^d02ba2#3596] — an evaluation delivered in the register of a discovered fact, forty seconds after "I don\'t really know what is going on here" [^1]. The departure converts ignorance into a verdict without asserting anything checkable.',
        plane: s(0.5, 0.8),
      },

      /* ---------- the list finding ---------- */
      {
        id: 'b_child_name_list',
        timestamp: HOUSEHOLD,
        significance: 1.0,
        certainty: 0.85,
        tags: ['B3', 'data', 'list', 'key_finding', 'reverses_P2'],
        type: KeyframeType.MILESTONE,
        description:
          'The mailer reached the host\'s household addressed to his children — "students of the Glen Beck family" [^1] — and he says he opened mail addressed to them [^1]. One household is not a sample, but the address format is the finding: the file carried minors\' names rather than household or occupant level. That identifies the vendor class, narrows it sharply, and reverses the earlier P2 ranking — child-name consumer files are the most regulated product in the chain, not the softest.',
        plane: s(0.9, 0.15),
      },
      {
        id: 'b_the_opened_letter',
        timestamp: OPENED_IT,
        significance: 0.8,
        certainty: 0.85,
        tags: ['B1', 'confession_as_licence', 'doublespeak'],
        type: KeyframeType.MILESTONE,
        description:
          '"I would never open my child\'s mail… if I broke the law, which I guess I did, I opened it up" [^1]. A scruple, performed and then violated in the same breath, and the violation is what licenses the broadcast of the contents. The departure is not hypocrisy but function: the confession supplies the permission.',
        plane: s(0.4, 0.9),
      },
      {
        id: 'b_dead_hyperlink',
        timestamp: DEAD_LINK,
        significance: 0.6,
        certainty: 0.8,
        tags: ['B1', 'category_error'],
        type: KeyframeType.MILESTONE,
        description:
          '"I keep clicking on it and it won\'t go" [^1] — a printed page treated as a failed link. Harmless in itself and useful as calibration: it shows the segment\'s departures are not uniformly strategic. Some are simply category errors, and the plane reading must not assign intent to all of them.',
        plane: s(0.7, 0.35),
      },
      {
        id: 'b_stranger_danger',
        timestamp: STRANGER_DANGER,
        significance: 0.9,
        certainty: 0.85,
        tags: ['B1', 'attribution_theft', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          '"Adults who want to talk to you about your private parts" [^1], and "stranger danger, doesn\'t apply here" [^1]. The flyer contains no such language. The departure is an attributed quotation that was never uttered, attacked as though it had been — which is the segment\'s characteristic move and the reason no correction can land.',
        plane: s(0.25, 1.0),
      },

      /* ---------- house style ---------- */
      {
        id: 'b_disclaimer_then_mapping',
        timestamp: FALSE_FLAG_DISCLAIMER_IN_1932,
        significance: 0.85,
        certainty: 0.85,
        tags: ['B4', 'house_style', 'recurrence'],
        type: KeyframeType.MILESTONE,
        description:
          'The same structure appears forty minutes earlier: "I\'m not telling you, you know, who\'s playing what in today\'s version of that. You can argue that on your own time" [^d02ba2#570] — immediately after a fully specified 1932 mapping. Refusal-to-map followed by a map is house style within this hour, which is why the mailer segment\'s identical structure should be read as form rather than as a slip or a signal.',
        plane: s(0.5, 0.9),
      },
      {
        id: 'b_information_gain_near_zero',
        timestamp: D(2026, 10, 26),
        significance: 0.9,
        certainty: 0.8,
        tags: ['B1', 'coverage', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'Facts about the payer added by the segment: none that were not already public — the UPS-store return address, the Sheridan registration, and the TENT denial all trace to CBS reporting [^1]. What the segment added was not information but a verdict-shaped departure. This is the cleanest evidence for the prop hypothesis: the coverage market converted the artifact into a conclusion while adding no facts, which is exactly the return the artifact was built to produce.',
        plane: s(0.85, 0.7),
      },
      {
        id: 'beck_plane_verdict',
        timestamp: D(2026, 10, 26),
        significance: 0.95,
        certainty: 0.8,
        tags: ['analysis', 'conclusion'],
        description:
          'Verdict: the segment is accurate in its real tier and load-bearing in its departure, so ordinary fact-checking cannot reach the part that matters. It states the false-flag hypothesis on air, five days early, with a partisan sign. It supplies the one hard fact in the file about the mailing list — that it carried children\'s names. And it demonstrates the prop hypothesis rather than arguing it, by converting an artifact into a verdict at zero information gain.',
      },
    ],

    windows: { strategy: 'phase_based' },
  },

  metadata: {
    canonicalName: 'Beck on the Plane: a 42i reading of the 21 October broadcast segment',
    creators: ['Compiled analysis; transcript verbatim'],
    released: new Date('2026-10-26T00:00:00Z'),
    cultural_significance: 0.3,
    platform: 'Local Time universe system',
    externalId: 'texas_mailer_beck_plane_2026',
    contentType: 'rhetorical measurement / coverage analysis',
    doublspeakLedger: {
      'B1_real_tier_scrupulous': {
        status: 'CONFIRMED',
        mechanism: 'Assertions are hedged or true; the payload sits in the departure',
        consequence: 'Fact-checking, defamation and correction all operate on the real tier and therefore cannot reach it',
      },
      'B2_false_flag_stated_on_air': {
        status: 'CONFIRMED — key finding',
        quote: '"I don\'t know if it\'s Democrats doing a double switcheroo" [^1]',
        relation: 'Same hypothesis as H6, five days earlier, opposite polarity, payer unspecified in ours and signed in his',
      },
      'B3_child_name_file': {
        status: 'CONFIRMED — reverses P2',
        quote: 'Addressed to "students of the Glen Beck family" [^1]',
        effect: 'List carried minors\' names; the data line is the most regulated, not the softest',
      },
      'B4_disclaimer_then_mapping': {
        status: 'CONFIRMED — house style',
        evidence: 'Same structure at 01:33:25 in the 1932 segment [^d02ba2#570]',
      },
    },
    planeSamples: {
      'episode_title': { real: 0.2, departure: 0.9 },
      'cold_open_ventriloquism': { real: 0.3, departure: 0.95 },
      'double_switcheroo': { real: 0.95, departure: 0.85 },
      'searchlight_delegation': { real: 0.55, departure: 0.9 },
      'sheridan_verdict': { real: 0.5, departure: 0.8 },
      'child_name_list': { real: 0.9, departure: 0.15 },
      'opened_letter': { real: 0.4, departure: 0.9 },
      'dead_hyperlink': { real: 0.7, departure: 0.35 },
      'stranger_danger': { real: 0.25, departure: 1.0 },
      'disclaimer_then_mapping': { real: 0.5, departure: 0.9 },
      'information_gain': { real: 0.85, departure: 0.7 },
    },
    ticketDeltas: [
      'operator_profile: replace the broadcast section with this module; the earlier reading measured the real tier and therefore under-read the segment',
      'five_postulates: P2 re-ranked — data is the HARDEST line, because the list carried minors\' names',
      'discovery_reach: add list-vendor identification by file characteristic (child-name level, age-graded, Texas select) rather than by price band',
      'automation_stack: P6a-REV2 alignment test restated in plane terms — hold nominal fixed, compare departures across variants',
      'coverage module: record that the segment added no facts about the payer and added a verdict',
    ],
    uncertaintyNotes: [
      'PLANE.md is a trust model for a lab federation; using it on rhetoric is analogy and should never be cited as physics.',
      'All 42i values are assigned by judgement and are not reproducible measurements.',
      'The transcript is automated and contains errors; verbatim quotation should be checked against audio before publication.',
      'One household is not a sample: the child-name inference rests on a single address format.',
      'No claim is made about sincerity. The plane measures structure, not belief, and a sincere speaker produces the same readings.',
    ],
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.US_HISTORY, CommonUniverseIds.US_GOVERNMENT],
    },
    references: [
      {
        type: 'DERIVES_FROM',
        targetUniverseId: OPERATOR_PROFILE_ID,
        description:
          'The operator reading the plane geometry is fitted to.',
      },
      {
        type: 'DERIVES_FROM',
        targetUniverseId: FIVE_POSTULATES_ID,
        description:
          'The postulate set whose claims are placed on the plane.',
      },
      {
        type: 'DOCUMENTS',
        targetUniverseId: AUTOMATION_ID,
        description:
          'The production reading the plane measures.',
      },
    ],
  },
} as unknown as Universe;

/** All universes this module owns. */
export const texasMailerBeckPlaneUniverses: Universe[] = [
  texasMailerBeckPlaneUniverse,
];
