import { TimePrecision, Universe, UniverseType } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * Hillary Rodham Clinton — `personal:hillary_clinton:1947`.
 *
 * james-gibson/local-time#8.
 *
 * A documentary record of her public life: First Lady of Arkansas and of the United
 * States, U.S. Senator for New York, the 67th Secretary of State, and the first woman
 * nominated for president by a major U.S. party.
 *
 * ## Where the data came from
 *
 * Every keyframe, date and certainty below was ported **mechanically** from the lore KB
 * record `characters/hillary-clinton.md`, which was itself built against two sources
 * ingested into that repository rather than against an unnamed summary:
 *
 * - `external-sources/wikipedia-hillary-clinton.md`
 * - `external-sources/wikipedia-impeachment-of-bill-clinton.md`
 *
 * That record was written after checking the issue's own CSV and finding it unreliable, so
 * the `certainty` values carry provenance rather than a blanket claim:
 *
 * - **0.95 / 0.9** — read from an ingested, dated source.
 * - **0.85** — conventional date for a month-precision event (the 1995 Beijing conference).
 * - **0.6** — the *event* is sourced but the exact day is a placeholder inside a recorded
 *   `dateRange` (the 1994 health-care defeat), or the day came from the issue's CSV while
 *   the event itself is corroborated (2000-11-07, 2012-09-11).
 * - **0.5** — rests on local-time#8's own CSV, which names no source. Six keyframes.
 *
 * ## Two things this record deliberately does not claim
 *
 * - **The 2013 resignation date.** `resignation-as-secretary-of-state-effective` is
 *   2013-02-01, when John Kerry was sworn in and the resignation took effect. It is *not*
 *   "the end of Obama's first term", which ended 2013-01-20. The issue's CSV gave the right
 *   date with the wrong reason.
 * - **Nothing about her name at every moment.** `first-lady-of-arkansas` records the start
 *   of that office in 1979; she continued to use "Hillary Rodham" until her husband's 1982
 *   campaign. The timeline tracks the office, not a claim about her name throughout.
 *
 * ## On `address`
 *
 * The KB record carries a `birth:T+NNNNN days` address per keyframe. `TemporalKeyframe` has
 * **no `address` field**, and no keyframe anywhere in this repository carries one, so those
 * addresses stay KB-side. That is the prerequisite for #55, not something this record can
 * resolve.
 */

const ns = (iso: string): bigint => dateToNanoseconds(new Date(iso));

export const hillaryClintonUniverse: Universe = {
  universeId: 'personal:hillary_clinton:1947',
  type: UniverseType.BIOGRAPHY,
  identifiers: {
    primary: 'personal:hillary_clinton:1947',
    aliases: ['Hillary Clinton', 'Hillary Rodham Clinton', 'Hillary Diane Rodham', 'Hillary Rodham'],
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: 'personal:hillary_clinton:1947',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'Wikipedia — Hillary Clinton, ingested at external-sources/wikipedia-hillary-clinton.md in the lore KB',
          'Wikipedia — Impeachment of Bill Clinton, ingested at external-sources/wikipedia-impeachment-of-bill-clinton.md in the lore KB',
        ],
      },
    ],
  },
  attribution: {
    public_domain: true,
    copyright: { holders: [], year: 2026, status: 'active' },
    citations_required: true,
    usage_restrictions: [
      'Factual claims about a living person. No copyrighted text is reproduced; both sources are CC BY-SA 4.0 extracts linked from the lore KB rather than copied.',
    ],
    sources: [
      'Wikipedia — Hillary Clinton',
      'Wikipedia — Impeachment of Bill Clinton',
      'Local Time Issue #8 (secondary, names no source)',
    ],
  },
  layers: [
    {
      layerId: 'primary',
      type: 'primary',
      epochs: {
        life: {
          epochId: 'hrc:life',
          startTime: ns('1947-10-26T00:00:00Z'),
          endTime: ns('2026-10-12T00:00:00Z'),
          precision: TimePrecision.DAY,
          description: 'Hillary Rodham Clinton, 1947 to present',
        },
      },
    },
  ],
  temporalStructure: {
    segments: [
      {
        id: 'arkansas-and-family',
        start: ns('1947-10-26T00:00:00Z'),
        end: ns('1993-01-20T00:00:00Z'),
        type: 'phase',
        status: 'ended',
        description:
          'Childhood in Illinois, legal training at Yale, the move to Arkansas in 1974, marriage, two stretches as First Lady of Arkansas, and the Whitewater and cattle-futures controversies.',
      },
      {
        id: 'first-lady-of-the-united-states',
        start: ns('1993-01-20T00:00:00Z'),
        end: ns('2001-01-20T00:00:00Z'),
        type: 'phase',
        status: 'ended',
        description:
          "Health-care reform and its 1994 defeat, children's legislation, international travel and the Beijing women's-rights speech, and public defence of Bill Clinton through the impeachment.",
      },
      {
        id: 'us-senate-new-york',
        start: ns('2001-01-03T00:00:00Z'),
        end: ns('2009-01-21T00:00:00Z'),
        type: 'phase',
        status: 'ended',
        description:
          'Two terms as U.S. Senator from New York, including the first-lady/senator overlap, the 2008 primary campaign, and post-9/11 New York funding.',
      },
      {
        id: 'secretary-of-state',
        start: ns('2009-01-21T00:00:00Z'),
        end: ns('2013-02-01T00:00:00Z'),
        type: 'phase',
        status: 'ended',
        description:
          'The 67th Secretary of State: the Arab Spring and the 2011 Libya intervention, the pivot to Asia, the Iran sanctions campaign that led to the 2015 JCPOA, and Benghazi.',
      },
      {
        id: 'post-office',
        start: ns('2013-02-01T00:00:00Z'),
        end: ns('2026-10-12T00:00:00Z'),
        type: 'phase',
        status: 'active',
        description:
          "The 2016 nomination and loss, the email controversy, memoirs, Onward Together, the Institute for Women, Peace and Security at Georgetown, the chancellorship of Queen's University Belfast from 2020, and Columbia from 2023.",
      },
    ],
    keyframes: [
      {
        id: 'born',
        timestamp: BigInt(Date.UTC(1947, 9, 26)) * 1000000n,
        significance: 0.9,
        tags: ['zero-point', 'birth', 'chicago', 'illinois'],
        certainty: 0.95,
      },
      {
        id: 'marries-bill-clinton',
        timestamp: BigInt(Date.UTC(1975, 9, 11)) * 1000000n,
        significance: 0.7,
        tags: ['marriage', 'family', 'arkansas'],
        certainty: 0.95,
      },
      {
        id: 'first-lady-of-arkansas',
        timestamp: BigInt(Date.UTC(1979, 0, 9)) * 1000000n,
        significance: 0.5,
        tags: ['first-lady', 'arkansas', 'education-reform', 'rose-law'],
        certainty: 0.95,
      },
      {
        id: 'chelsea-born',
        timestamp: BigInt(Date.UTC(1980, 1, 27)) * 1000000n,
        significance: 0.4,
        tags: ['family', 'chelsea-clinton'],
        certainty: 0.9,
      },
      {
        id: 'becomes-first-lady-of-the-united-states',
        timestamp: BigInt(Date.UTC(1993, 0, 20)) * 1000000n,
        significance: 0.9,
        tags: ['first-lady', 'white-house', 'health-care', 'policy'],
        certainty: 0.95,
      },
      {
        id: 'health-care-plan-abandoned',
        timestamp: BigInt(Date.UTC(1994, 8, 30)) * 1000000n,
        significance: 0.8,
        tags: ['health-care', 'policy-defeat', 'first-lady'],
        certainty: 0.6,
        dateRange: {
          earliest: BigInt(Date.UTC(1994, 8, 1)) * 1000000n,
          latest: BigInt(Date.UTC(1994, 8, 30)) * 1000000n,
        },
      },
      {
        id: 'beijing-womens-rights-speech',
        timestamp: BigInt(Date.UTC(1995, 8, 15)) * 1000000n,
        significance: 0.8,
        tags: ['diplomacy', 'womens-rights', 'beijing', 'first-lady'],
        certainty: 0.85,
        dateRange: {
          earliest: BigInt(Date.UTC(1995, 8, 1)) * 1000000n,
          latest: BigInt(Date.UTC(1995, 8, 30)) * 1000000n,
        },
      },
      {
        id: 'husband-impeached-by-house',
        timestamp: BigInt(Date.UTC(1998, 11, 19)) * 1000000n,
        significance: 0.9,
        tags: ['impeachment', 'lewinsky', 'crisis', 'first-lady'],
        certainty: 0.95,
      },
      {
        id: 'articles-referred-to-senate',
        timestamp: BigInt(Date.UTC(1999, 0, 7)) * 1000000n,
        significance: 0.7,
        tags: ['impeachment', 'senate-trial'],
        certainty: 0.95,
      },
      {
        id: 'senate-acquits-bill-clinton',
        timestamp: BigInt(Date.UTC(1999, 1, 12)) * 1000000n,
        significance: 0.9,
        tags: ['impeachment', 'acquittal', 'rehnquist'],
        certainty: 0.95,
      },
      {
        id: 'elected-us-senate',
        timestamp: BigInt(Date.UTC(2000, 10, 7)) * 1000000n,
        significance: 0.95,
        tags: ['election', 'new-york', 'first-lady', 'senate'],
        certainty: 0.6,
      },
      {
        id: 'sworn-us-senate',
        timestamp: BigInt(Date.UTC(2001, 0, 3)) * 1000000n,
        significance: 0.95,
        tags: ['senate', 'swearing-in', 'first-lady', 'precedent'],
        certainty: 0.95,
      },
      {
        id: 'announces-2008-candidacy',
        timestamp: BigInt(Date.UTC(2007, 0, 20)) * 1000000n,
        significance: 0.8,
        tags: ['election-2008', 'candidacy', 'campaign'],
        certainty: 0.5,
      },
      {
        id: 'suspends-2008-campaign',
        timestamp: BigInt(Date.UTC(2008, 5, 7)) * 1000000n,
        significance: 0.8,
        tags: ['election-2008', 'campaign', 'endorsement'],
        certainty: 0.5,
      },
      {
        id: 'sworn-secretary-of-state',
        timestamp: BigInt(Date.UTC(2009, 0, 21)) * 1000000n,
        significance: 0.95,
        tags: ['secretary-of-state', 'obama-administration', 'foreign-policy'],
        certainty: 0.95,
      },
      {
        id: 'benghazi-attack',
        timestamp: BigInt(Date.UTC(2012, 8, 11)) * 1000000n,
        significance: 0.95,
        tags: ['benghazi', 'foreign-policy', 'controversy', 'libya'],
        certainty: 0.6,
      },
      {
        id: 'resignation-as-secretary-of-state-effective',
        timestamp: BigInt(Date.UTC(2013, 1, 1)) * 1000000n,
        significance: 0.7,
        tags: ['secretary-of-state', 'transition', 'kerry'],
        certainty: 0.95,
      },
      {
        id: 'email-controversy-begins',
        timestamp: BigInt(Date.UTC(2015, 2, 10)) * 1000000n,
        significance: 0.85,
        tags: ['email', 'controversy', 'fbi-investigation', 'election-2016'],
        certainty: 0.5,
      },
      {
        id: 'announces-2016-candidacy',
        timestamp: BigInt(Date.UTC(2015, 3, 12)) * 1000000n,
        significance: 0.8,
        tags: ['election-2016', 'candidacy', 'campaign'],
        certainty: 0.5,
      },
      {
        id: 'first-female-major-party-nominee',
        timestamp: BigInt(Date.UTC(2016, 6, 26)) * 1000000n,
        significance: 0.95,
        tags: ['election-2016', 'nomination', 'precedent', 'first'],
        certainty: 0.5,
      },
      {
        id: 'loses-2016-election',
        timestamp: BigInt(Date.UTC(2016, 10, 8)) * 1000000n,
        significance: 0.9,
        tags: ['election-2016', 'electoral-college', 'popular-vote'],
        certainty: 0.5,
      },
    ],
    windows: { strategy: 'phase_based' },
  },
  metadata: {
    canonicalName: 'Hillary Rodham Clinton',
    description:
      'American politician, lawyer and diplomat: First Lady of Arkansas and of the United States, U.S. Senator for New York, 67th Secretary of State, and the first woman nominated for president by a major U.S. party.',
    creators: ['Hillary Rodham Clinton'],
    released: new Date('1947-10-26T00:00:00Z'),
    cultural_significance: 0.9,
    cultural_significance_justification:
      'The first and so far only wife of a U.S. president to hold elected office, and the only person to serve as First Lady and a sitting U.S. senator at once.',
    tags: ['person', 'politics', 'us-government', '20th-century', '21st-century'],
    birthDate: '1947-10-26',
    birthPlace: 'Chicago, Illinois, US',
    offices: [
      'First Lady of Arkansas (1979-1981, 1983-1992)',
      'First Lady of the United States (1993-2001)',
      'U.S. Senator for New York (2001-2009)',
      '67th Secretary of State (2009-2013)',
    ],
    /** Provenance of the certainty spread, so a later reader can re-derive it. */
    certaintyProvenance: {
      '0.95': 'read from an ingested, dated source',
      '0.9': 'same, single corroborating source',
      '0.85': 'conventional date for a month-precision event',
      '0.6': 'event sourced but exact day is a placeholder inside dateRange, or day from the issue CSV',
      '0.5': 'rests on local-time#8 CSV, which names no source',
    },
    sourceIssue: 8,
  },
  connections: {
    natural: {
      parentUniverses: [
        CommonUniverseIds.US_GOVERNMENT,
        CommonUniverseIds.US_HISTORY,
        CommonUniverseIds.WORLD_HISTORY,
      ],
    },
    references: [],
  },
} as unknown as Universe;

/** All universes derived from james-gibson/local-time#8. */
export const hillaryClintonUniverses: Universe[] = [hillaryClintonUniverse];
