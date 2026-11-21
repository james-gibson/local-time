import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../core/types';
import { createHistoricalUniverseId } from '../../../core/universe-ids';

/**
 * The United States — the domain spine (james-gibson/local-time#122).
 *
 * WHY THIS EXISTS. `CommonUniverseIds.US_HISTORY` is `history:united_states:founded`, and
 * that id is referenced as a parent by 93 universes; until now no universe owned it, so
 * every containment edge pointed at a container that could not be retrieved. This module
 * makes the container real and gives it the milestones the corpus keeps looking up, so a
 * later module references a keyframe here instead of re-deriving the date or inventing a
 * second id for the same event (`us:constitution:1787` already exists; do not clone it).
 *
 * THE `us:` DOMAIN IS DECLARED, AND THIS IS NOT ITS ROOT ID. #122's question — is `us:` a
 * domain — was answered yes by #149: `US: /^us:[a-z0-9_]+(?::[a-z0-9_]+)?:\d{4}$/`, with
 * `us` reserved so FILM stops accepting `us:constitution:1787`. That namespace holds
 * *numbered series members* (`us:amendment:<n>:<year>`, `us:constitution:1787`), which is
 * what its year-terminated shape is for. The country's own timeline predates that
 * decision and its id is already load-bearing, so the domain root stands where the corpus
 * put it — `history:united_states:founded` — and `us:united_states:1776` is carried as an
 * alias, so a `us:`-addressed lookup resolves here rather than missing.
 *
 * THE KEYFRAMES ARE THE LOOKUP TABLE. Each is a dated national milestone with a stable id
 * and an address, at the resolution the record actually has (a day). Where the corpus owns
 * a universe for the thing itself — the constitutional amendments — the keyframe names it
 * in `metadata.crosswalks`, because a keyframe here is a position on the country's clock,
 * not a second owner of the amendment (#74).
 *
 * Reality Relation: `documentary` at 0.0. These are commonly recorded dates, not readings;
 * the limits are in `metadata.limits`, and certainty is 0.95 rather than 1.0 because the
 * record holds no archival citation for them.
 */

export const UNITED_STATES_UNIVERSE_ID = 'history:united_states:founded';

/** One instant, at day resolution. */
const D = (y: number, m: number, d: number): bigint =>
  BigInt(Date.UTC(y, m - 1, d)) * 1_000_000n;

/** One entry in the milestone table, so the epoch/segments/keyframes cannot drift. */
interface Milestone {
  id: string;
  at: bigint;
  type: KeyframeType;
  significance: number;
  tags: string[];
  description: string;
}

const MILESTONES: readonly Milestone[] = [
  {
    id: 'declaration_of_independence',
    at: D(1776, 7, 4),
    type: KeyframeType.RELEASE,
    significance: 1.0,
    tags: ['founding', 'declaration'],
    description:
      'The Declaration of Independence is adopted by the Continental Congress. The date the ' +
      'epoch and the canonical `us:` year-terminated ids are anchored to.',
  },
  {
    id: 'constitution_signed',
    at: D(1787, 9, 17),
    type: KeyframeType.PUBLICATION,
    significance: 1.0,
    tags: ['founding', 'constitution'],
    description:
      'The Constitution is signed at Philadelphia and sent to the states. `us:constitution:1787` ' +
      'owns the instrument; this keyframe owns the date.',
  },
  {
    id: 'bill_of_rights_ratified',
    at: D(1791, 12, 15),
    type: KeyframeType.AMENDMENT,
    significance: 0.95,
    tags: ['founding', 'rights', 'amendment'],
    description:
      'The first ten amendments are ratified. `us:bill_of_rights:1791` owns the instrument.',
  },
  {
    id: 'louisiana_purchase',
    at: D(1803, 4, 30),
    type: KeyframeType.MILESTONE,
    significance: 0.8,
    tags: ['expansion', 'territory'],
    description:
      'The Louisiana Purchase doubles the territory claimed by the United States. The first ' +
      'territorial acquisition after the founding, and the one later acquisitions are sized against.',
  },
  {
    id: 'fort_sumter',
    at: D(1861, 4, 12),
    type: KeyframeType.MILESTONE,
    significance: 1.0,
    tags: ['civil_war', 'secession'],
    description:
      'The bombardment of Fort Sumter opens the Civil War. `history:us_statehood:1787` (the ' +
      'statehood sequence) is the companion timeline for admission order.',
  },
  {
    id: 'emancipation_proclamation',
    at: D(1863, 1, 1),
    type: KeyframeType.PUBLICATION,
    significance: 0.95,
    tags: ['civil_war', 'emancipation'],
    description:
      'The Emancipation Proclamation takes effect in the states in rebellion. A war measure, ' +
      'not the abolition of slavery — that is the Thirteenth Amendment.',
  },
  {
    id: 'thirteenth_amendment',
    at: D(1865, 12, 6),
    type: KeyframeType.AMENDMENT,
    significance: 0.95,
    tags: ['reconstruction', 'amendment', 'slavery'],
    description: 'Abolition ratified. `us:amendment:13:1865` owns the amendment.',
  },
  {
    id: 'fourteenth_amendment',
    at: D(1868, 7, 9),
    type: KeyframeType.AMENDMENT,
    significance: 0.95,
    tags: ['reconstruction', 'amendment', 'citizenship'],
    description:
      'Citizenship, due process and equal protection ratified. `us:amendment:14:1868` owns it.',
  },
  {
    id: 'fifteenth_amendment',
    at: D(1870, 2, 3),
    type: KeyframeType.AMENDMENT,
    significance: 0.9,
    tags: ['reconstruction', 'amendment', 'suffrage'],
    description: 'Voting rights regardless of race ratified. `us:amendment:15:1870` owns it.',
  },
  {
    id: 'nineteenth_amendment',
    at: D(1920, 8, 18),
    type: KeyframeType.AMENDMENT,
    significance: 0.9,
    tags: ['suffrage', 'amendment'],
    description: 'Women\'s suffrage ratified. `us:amendment:19:1920` owns it.',
  },
  {
    id: 'civil_rights_act',
    at: D(1964, 7, 2),
    type: KeyframeType.LEGISLATION,
    significance: 0.95,
    tags: ['civil_rights', 'statute'],
    description:
      'The Civil Rights Act is signed: public-accommodation and employment discrimination, ' +
      'and the enforcement machinery the later statutes build on.',
  },
  {
    id: 'voting_rights_act',
    at: D(1965, 8, 6),
    type: KeyframeType.LEGISLATION,
    significance: 0.9,
    tags: ['civil_rights', 'suffrage', 'statute'],
    description:
      'The Voting Rights Act is signed, with the preclearance regime that the 2013 and later ' +
      'cases litigate.',
  },
];

const SEGMENTS = [
  {
    id: 'founding_and_expansion',
    start: D(1776, 7, 4),
    end: D(1860, 12, 20),
    description: 'Independence, the Constitution, the Bill of Rights, and territorial expansion.',
  },
  {
    id: 'civil_war_and_reconstruction',
    start: D(1860, 12, 20),
    end: D(1877, 4, 24),
    description: 'Secession, war, emancipation, and the Reconstruction amendments.',
  },
  {
    id: 'industrial_and_progressive',
    start: D(1877, 4, 24),
    end: D(1964, 7, 2),
    description: 'Reconstruction\'s end through the Civil Rights Act.',
  },
  {
    id: 'civil_rights_to_present',
    start: D(1964, 7, 2),
    end: D(2026, 11, 21),
    description: 'The civil-rights statutes and the record\'s horizon.',
  },
] as const;

export const unitedStatesUniverse: Universe = {
  universeId: createHistoricalUniverseId('united_states', 'founded'),
  type: UniverseType.HISTORICAL_EVENT,

  identifiers: {
    primary: UNITED_STATES_UNIVERSE_ID,
    aliases: [
      'US_HISTORY',
      'us:united_states:1776',
      'United States',
      'United States history',
    ],
  },

  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [],
  },

  attribution: {
    public_domain: false,
    citations_required: true,
    sources: [
      'Commonly recorded dates of U.S. national milestones; this record holds no archival citation for them',
      'The corpus universes that own the instruments named in `metadata.crosswalks` (the constitutional amendments, the Bill of Rights)',
    ],
    usage_restrictions: [
      'A milestone spine, not a history. Twelve dated events are here; everything else is not.',
      'Dates are day-resolution and 0.95 certainty: they are the conventional ones, not a finding.',
    ],
  },

  layers: [
    {
      layerId: 'national',
      type: 'primary',
      epochs: {
        united_states: {
          epochId: 'united_states:1776_present',
          startTime: D(1776, 7, 4),
          endTime: D(2026, 11, 21),
          precision: TimePrecision.DAY,
          description:
            'Adoption of the Declaration to the record date. Open-ended in reference, closed here ' +
            'at the date the module was written.',
        },
      },
    },
  ],

  epochs: {},

  temporalStructure: {
    segments: SEGMENTS.map((segment) => ({
      id: segment.id,
      start: segment.start,
      end: segment.end,
      type: 'phase' as const,
      status: 'active' as const,
      description: segment.description,
    })),

    keyframes: MILESTONES.map((milestone) => ({
      id: milestone.id,
      timestamp: milestone.at,
      significance: milestone.significance,
      certainty: 0.95,
      precision: TimePrecision.DAY,
      tags: milestone.tags,
      type: milestone.type,
      description: milestone.description,
    })),

    windows: { strategy: 'phase_based' },
  },

  metadata: {
    canonicalName: 'The United States (1776–)',
    description:
      'The country\'s milestone spine: independence, the founding instruments, the Civil War and ' +
      'Reconstruction amendments, suffrage, and the civil-rights statutes. The container 93 ' +
      'universes already name as their parent, now registered and addressable.',
    cultural_significance: 1.0,
    platform: 'local-time corpus',
    contentType: 'historical period',
    domain: 'us',

    /**
     * Keyframe → owning universe, for the instruments the corpus already models. A keyframe
     * here is a position on the national clock; the universe owns the thing.
     */
    crosswalks: {
      constitution_signed: 'us:constitution:1787',
      bill_of_rights_ratified: 'us:bill_of_rights:1791',
      thirteenth_amendment: 'us:amendment:13:1865',
      fourteenth_amendment: 'us:amendment:14:1868',
      fifteenth_amendment: 'us:amendment:15:1870',
      nineteenth_amendment: 'us:amendment:19:1920',
    },

    /** The lookup table, in the order a reader wants it. */
    milestones: MILESTONES.map((milestone) => ({
      id: milestone.id,
      date: new Date(Number(milestone.at / 1_000_000n)).toISOString().slice(0, 10),
    })),

    limits: [
      'Twelve milestones. Colonial history, the Articles of Confederation, the Civil War\'s ' +
        'battles, Reconstruction\'s rollback, and everything after 1965 are outside it.',
      'Certainty is 0.95 throughout: conventional dates, no archival citation.',
      '`history:us_statehood:1787` (50 references) and `history:us_gov:founded` (42) are ' +
        'separate containers and remain unregistered; this module does not absorb them.',
    ],
  },
} as unknown as Universe;

/** One universe; the array keeps the barrel shape uniform. */
export const unitedStatesUniverses: Universe[] = [unitedStatesUniverse];
