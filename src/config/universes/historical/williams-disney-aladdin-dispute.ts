import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { Universe, UniverseType, UniverseId, ReferenceType, KeyframeType } from '../../../core';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * The Robin Williams / Walt Disney Company contract dispute over Aladdin — `history:williams_disney_aladdin_dispute:1991`.
 *
 * james-gibson/local-time#3.
 *
 * The event the issue asks to be modelled is a *contract dispute*, not a film: Williams
 * took SAG-scale pay for *Aladdin* on condition his name and image not carry the
 * marketing, Disney's campaign made the Genie the face of the film, and Williams refused
 * to return for the direct-to-video sequel *The Return of Jafar* (1994). He came back for
 * *Aladdin and the King of Thieves* (1996) after a public apology.
 *
 * This universe is the historical spine that the film universes hang off — its nine
 * keyframes are the dispute's events, and `disney:aladdin:1992` (already modelled in
 * `people/robin-williams.ts`) is the work that was made under the disputed terms.
 *
 * **Provenance warning — read before trusting a keyframe.** The issue's own data table
 * cites one Reddit post, one Quora answer, and one entertainment-news site. The broad
 * shape of the dispute (scale salary, a marketing clause, a breach, a recast, an apology)
 * is well corroborated and widely reported. Several *specifics* are not: which studio
 * executive did what, the exact figure, and the claim that Disney overpaid for office
 * space to obstruct *FernGully*'s production — that last one rests on the Reddit source
 * and is modelled at `certainty: 0.3` with a date range. `certainty` on each keyframe
 * encodes evidence quality, not importance. Do not raise a `certainty` without a better
 * source than the ones listed here.
 *
 * The zero-point is the 1991 contract, at year precision: the exact signing date is not
 * public, so the epoch derives as `presumed` rather than being asserted.
 */

/** ISO-8601 -> nanoseconds since the Unix epoch, via the shared conversion helper. */
const ns = (iso: string): bigint => dateToNanoseconds(new Date(iso));

export const williamsDisneyAladdinDisputeUniverse: Universe = {
  universeId: 'history:williams_disney_aladdin_dispute:1991',
  type: UniverseType.HISTORICAL_EVENT,
  identifiers: {
    primary: 'history:williams_disney_aladdin_dispute:1991',
    aliases: [
      'The Aladdin contract dispute',
      'Williams–Disney Aladdin feud',
      'The Genie marketing dispute',
    ],
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: 'history:williams_disney_aladdin_dispute:1991',
        relationshipType: 'documents',
        confidence: 0.8,
        evidence: [
          'james-gibson/local-time#3 — issue data table and researcher notes',
          'Broad corroboration in retrospective entertainment reporting',
          'No primary-source contract text is available; the salary and marketing terms are as reported, not as executed',
        ],
      },
    ],
  },
  attribution: {
    copyright: {
      holders: [],
      year: 1991,
      status: 'public-domain',
    },
    citations_required: true,
    usage_restrictions: [
      'Figures and quoted terms are as reported by the issue sources; verify against a primary source before publishing.',
    ],
    sources: [
      'james-gibson/local-time#3 — Aladdin 2 (research prompt, CSV data table, narrative)',
      'Los Angeles Times retrospective reporting (as cited in #3)',
      'Reddit /r/videos post, "FernGully was almost destroyed…" (as cited in #3) — lowest-quality source',
      'Quora answer on the Return of Jafar recasting (as cited in #3)',
      'InsideTheMagic, "Robin Williams Refused To Work With Disney After Aladdin Feud" (2024) (as cited in #3)',
    ],
  },
  layers: [
    {
      layerId: 'primary',
      type: 'primary',
      epochs: {
        dispute: {
          epochId: 'williams_disney_aladdin_dispute:dispute',
          startTime: ns('1991-01-01T00:00:00Z'),
          endTime: ns('1996-12-31T23:59:59Z'),
          description:
            'From the 1991 contract through the 1996 reconciliation; the first film is made under the disputed terms.',
        },
      },
    },
  ],
  epochs: {},
  temporalStructure: {
    segments: [
      {
        id: 'engagement-and-terms',
        start: ns('1991-01-01T00:00:00Z'),
        end: ns('1992-11-25T00:00:00Z'),
        type: 'phase',
        description:
          'Williams takes the role on SAG scale with a marketing clause; release and the alleged breach.',
      },
      {
        id: 'rupture',
        start: ns('1992-11-25T00:00:00Z'),
        end: ns('1995-01-01T00:00:00Z'),
        type: 'phase',
        description:
          'The feud becomes public, the sequel is recast, and Katzenberg leaves Disney.',
      },
      {
        id: 'reconciliation',
        start: ns('1995-01-01T00:00:00Z'),
        end: ns('1996-12-31T23:59:59Z'),
        type: 'phase',
        description: 'A public apology under new leadership, and the return for the third film.',
      },
    ],
    keyframes: [
      {
        id: 'salary-agreement',
        type: KeyframeType.CONTRACT,
        timestamp: ns('1991-01-01T00:00:00Z'),
        significance: 0.9,
        tags: ['contract', 'salary', 'zero-point-era'],
        certainty: 0.9,
        dateRange: {
          earliest: ns('1991-01-01T00:00:00Z'),
          latest: ns('1991-12-31T23:59:59Z'),
        },
      },
      {
        id: 'marketing-stipulation',
        type: KeyframeType.CONTRACT,
        timestamp: ns('1991-06-01T00:00:00Z'),
        significance: 1,
        tags: ['contract', 'marketing', 'the-clause-the-dispute-turns-on'],
        certainty: 0.75,
        dateRange: {
          earliest: ns('1991-01-01T00:00:00Z'),
          latest: ns('1992-01-01T00:00:00Z'),
        },
      },
      {
        id: 'ferngully-competition',
        type: KeyframeType.MARKET_EVENT,
        timestamp: ns('1991-06-01T00:00:00Z'),
        significance: 0.5,
        tags: ['fern gully', '20th-century-fox', 'alleged', 'disputed'],
        certainty: 0.3,
        dateRange: {
          earliest: ns('1991-01-01T00:00:00Z'),
          latest: ns('1992-04-01T00:00:00Z'),
        },
      },
      {
        id: 'marketing-breach',
        type: KeyframeType.BREACH,
        timestamp: ns('1992-11-25T00:00:00Z'),
        significance: 1,
        tags: ['breach', 'marketing', 'genie'],
        certainty: 0.8,
      },
      {
        id: 'aladdin-release',
        type: KeyframeType.RELEASE,
        timestamp: ns('1992-11-25T00:00:00Z'),
        significance: 0.95,
        tags: ['release', 'the-work-itself'],
        certainty: 1,
        // Name-level reference with deferred resolution. `disney:aladdin:1992`
        // records no release keyframe at all — `withReleaseDate` sets metadata
        // only — so this names one that is *supposed* to exist rather than one
        // that does. That is deliberate: a universe-level reference would say
        // "the dispute involves Aladdin", which is true but stops being
        // informative the moment Aladdin records more than one release.
        targetUniverseId: 'disney:aladdin:1992' as UniverseId,
        targetKeyframeId: 'us-wide-release',
        targetKeyframeType: KeyframeType.RELEASE,
      },
      {
        id: 'public-refusal',
        type: KeyframeType.PUBLIC_STATEMENT,
        timestamp: ns('1993-01-01T00:00:00Z'),
        significance: 0.85,
        tags: ['public-statement', 'rupture'],
        certainty: 0.8,
        dateRange: {
          earliest: ns('1993-01-01T00:00:00Z'),
          latest: ns('1994-01-01T00:00:00Z'),
        },
      },
      {
        id: 'genie-recast',
        type: KeyframeType.CASTING,
        timestamp: ns('1994-05-20T00:00:00Z'),
        significance: 0.9,
        tags: ['casting', 'return-of-jafar', 'dan-castellaneta'],
        certainty: 0.9,
      },
      {
        id: 'katzenberg-departure',
        type: KeyframeType.MILESTONE,
        timestamp: ns('1994-08-01T00:00:00Z'),
        significance: 0.6,
        tags: ['corporate', 'disney', 'leadership'],
        certainty: 0.7,
        dateRange: {
          earliest: ns('1994-01-01T00:00:00Z'),
          latest: ns('1995-01-01T00:00:00Z'),
        },
      },
      {
        id: 'roth-apology',
        type: KeyframeType.APOLOGY,
        timestamp: ns('1995-01-01T00:00:00Z'),
        significance: 0.9,
        tags: ['apology', 'reconciliation'],
        certainty: 0.75,
        dateRange: {
          earliest: ns('1995-01-01T00:00:00Z'),
          latest: ns('1995-12-31T23:59:59Z'),
        },
      },
      {
        id: 'williams-returns',
        type: KeyframeType.CONTRACT,
        timestamp: ns('1996-05-20T00:00:00Z'),
        significance: 0.85,
        tags: ['resolution', 'king-of-thieves', 'return'],
        certainty: 0.85,
      },
    ],
    windows: { strategy: 'phase_based' },
  },
  metadata: {
    canonicalName:
      'The Robin Williams / Disney contract dispute over Aladdin (1991–1996)',
    description:
      'A five-year contract dispute: Robin Williams voiced the Genie for SAG-scale pay on a marketing clause, Disney\'s campaign made the Genie the face of Aladdin, and Williams refused the direct-to-video sequel before a public apology brought him back for the third film.',
    cultural_significance: 0.6,
    tags: [
      'contract-dispute',
      'hollywood',
      'robin-williams',
      'disney',
      'aladdin',
      '1990s',
      'labour',
    ],
    significance:
      'A widely cited case in how a studio uses a performer\'s likeness in marketing, and a rare public instance of a star winning the point and coming back on better terms.',
  },
  connections: {
    natural: {
      parentUniverses: [
        CommonUniverseIds.HOLLYWOOD_SYSTEM,
        CommonUniverseIds.US_HISTORY,
        CommonUniverseIds.WORLD_HISTORY,
      ],
    },
    references: [
      {
        type: 'IN_A_PRIOR_KEYFRAME',
        targetUniverseId: 'disney:aladdin:1992',
        description:
          'Frame-level: the dispute derives its frame from Aladdin — the work made under the disputed terms. The *event-level* reference to Aladdin\'s release lives on the `aladdin-release` keyframe below, because that is the occurrence that disambiguates.',
      },
    ],
  },
} as unknown as Universe;

/** All universes derived from james-gibson/local-time#3. */
export const aladdinDisputeUniverses: Universe[] = [williamsDisneyAladdinDisputeUniverse];
