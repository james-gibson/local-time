import { TimePrecision, Universe, UniverseType } from '../../../core/types';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * Factual rebuttals to `history:hillary_clinton_conspiracy_theories:1993-2016`.
 *
 * Part 2 of james-gibson/local-time#8, companion to `clinton-conspiracy-theories.ts`.
 *
 * ## Why this is a separate universe
 *
 * Every keyframe here is a *published refutation* with a named source, and every one
 * points at the theory keyframe it answers through `targetUniverseId` /
 * `targetKeyframeId`. Splitting them means:
 *
 * - the theories universe never has to carry a claim and its refutation side by side,
 *   so a reader cannot mistake one for the other;
 * - this universe can be cited or loaded on its own — a rebuttal is true regardless of
 *   whether you accept that the claim existed.
 *
 * The link is enforced in both directions by the test suite: every theory keyframe is
 * matched by exactly one rebuttal, and any rebuttal whose `targetKeyframeId` does not
 * exist fails the build.
 */

const ns = (iso: string): bigint => dateToNanoseconds(new Date(iso));

export const hillaryClintonConspiracyRebuttalsUniverse: Universe = {
  universeId: 'history:hillary_clinton_conspiracy_rebuttals:1993-2017',
  type: UniverseType.HISTORICAL_EVENT,
  identifiers: {
    primary: 'history:hillary_clinton_conspiracy_rebuttals:1993-2017',
    aliases: ['clinton conspiracy rebuttals', 'clinton conspiracy fact checks'],
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: 'history:hillary_clinton_conspiracy_theories:1993-2016',
        relationshipType: 'contradicts',
        confidence: 1.0,
        evidence: [
          'Congressional Record, Vol. 140 No. 112 (12 August 1994) — primary source',
          'House Select Committee on Benghazi, final report',
          'The New York Times, "Dissecting the #PizzaGate Conspiracy Theories" (10 December 2016)',
          'Metropolitan Police Department of the District of Columbia press release (5 December 2016)',
        ],
      },
    ],
  },
  attribution: {
    public_domain: true,
    copyright: { holders: [], year: 2026, status: 'active' },
    citations_required: true,
    usage_restrictions: [
      'Cite the named source, not this universe. Every keyframe names the publication or body it summarises.',
    ],
    sources: [
      'Congressional Record (1994)',
      'House Select Committee on Benghazi report',
      'The New York Times (2016)',
      'Washington Post (2016)',
      'BBC / PBS NewsHour / CBS (2012, contemporaneous hospital reporting)',
    ],
  },
  layers: [
    {
      layerId: 'primary',
      type: 'primary',
      epochs: {
        refutations: {
          epochId: 'hcr:refutations',
          startTime: ns('1993-07-04T00:00:00Z'),
          endTime: ns('2017-06-22T00:00:00Z'),
          precision: TimePrecision.DAY,
          description: 'Published refutations of conspiracy theories centred on Hillary Clinton',
        },
      },
    },
  ],
  temporalStructure: {
    segments: [
      {
        id: 'arkansas-and-whitewater',
        start: ns('1993-07-04T00:00:00Z'),
        end: ns('1998-01-01T00:00:00Z'),
        type: 'phase',
        status: 'ended',
        description: 'Official investigations and the first congressional rebuttal on the record.',
      },
      {
        id: 'late-campaign-and-2016',
        start: ns('2012-09-01T00:00:00Z'),
        end: ns('2017-06-22T00:00:00Z'),
        type: 'phase',
        status: 'ended',
        description:
          'Benghazi committee findings, contemporaneous hospital reporting on the 2012 diagnosis, and the December 2016 Pizzagate investigations and prosecution.',
      },
    ],
    keyframes: [
      {
        id: 'rebuttal-foster-death-investigation',
        timestamp: ns('1993-07-04T00:00:00Z'),
        significance: 0.7,
        tags: ['vince-foster', 'whitewater', 'official-investigation'],
        certainty: 0.85,
        targetUniverseId: 'history:hillary_clinton_conspiracy_theories:1993-2016',
        targetKeyframeId: 'vince-foster-suspicion',
      },
      {
        id: 'rebuttal-congressional-record-1994',
        timestamp: ns('1994-08-12T00:00:00Z'),
        significance: 0.85,
        tags: ['body-count', 'primary-source'],
        certainty: 0.95,
        targetUniverseId: 'history:hillary_clinton_conspiracy_theories:1993-2016',
        targetKeyframeId: 'clinton-body-count',
      },
      {
        id: 'rebuttal-vrwc-provenance',
        // Dated 1995 to the memo's authorship, not to her 1998 popularisation — so this
        // rebuttal legitimately PREDATES the theory keyframe it corrects. The 2019 Lehane
        // acknowledgement is corroboration of the correction, not the event being dated.
        timestamp: ns('1995-01-01T00:00:00Z'),
        significance: 0.8,
        tags: ['vrwc', 'provenance-correction'],
        certainty: 0.9,
        targetUniverseId: 'history:hillary_clinton_conspiracy_theories:1993-2016',
        targetKeyframeId: 'vast-right-wing-conspiracy',
      },
      {
        id: 'rebuttal-campaign-era-gap',
        timestamp: ns('2008-01-20T00:00:00Z'),
        significance: 0.2,
        tags: ['campaign-period', 'no-specific-refutation'],
        certainty: 0.3,
        targetUniverseId: 'history:hillary_clinton_conspiracy_theories:1993-2016',
        targetKeyframeId: 'campaign-era-allegations',
      },
      {
        id: 'rebuttal-health-medical-record',
        timestamp: ns('2012-09-16T00:00:00Z'),
        significance: 0.8,
        tags: ['health', 'medical-record', 'date-correction'],
        certainty: 0.9,
        targetUniverseId: 'history:hillary_clinton_conspiracy_theories:1993-2016',
        targetKeyframeId: 'health-and-concealment',
      },
      {
        id: 'rebuttal-benghazi-committee',
        timestamp: ns('2014-01-01T00:00:00Z'),
        significance: 0.9,
        tags: ['benghazi', 'congressional-committee'],
        certainty: 0.95,
        targetUniverseId: 'history:hillary_clinton_conspiracy_theories:1993-2016',
        targetKeyframeId: 'benghazi-stand-down',
      },
      {
        id: 'rebuttal-pizzagate-investigation',
        timestamp: ns('2016-12-10T00:00:00Z'),
        significance: 0.9,
        tags: ['pizzagate', 'investigation', 'prosecution'],
        certainty: 0.95,
        targetUniverseId: 'history:hillary_clinton_conspiracy_theories:1993-2016',
        targetKeyframeId: 'pizzagate-and-frazzledrip',
      },
    ],
    windows: { strategy: 'phase_based' },
  },
  metadata: {
    canonicalName: 'Rebuttals to conspiracy theories centred on Hillary Clinton',
    description:
      'Published refutations of the claims recorded in the companion theories universe, each tied to the theory keyframe it answers.',
    cultural_significance: 0.8,
    tags: ['fact-check', 'misinformation', 'politics', 'us-politics'],
    sourceIssue: 8,
    rebutsUniverseId: 'history:hillary_clinton_conspiracy_theories:1993-2016',

    rebuttals: [
      {
        keyframeId: 'rebuttal-foster-death-investigation',
        refutesKeyframeId: 'vince-foster-suspicion',
        finding:
          'The death of Vince Foster was investigated as a suicide, not treated as a homicide or covered up.',
        source: 'Arkansas State Police death investigation, 1993-1994',
        certainty: 0.85,
        provenance:
          'The investigation and its suicide conclusion are well established; the exact date of the ruling is not pinned here, so the keyframe uses the date of Foster\'s death and certainty 0.85 rather than claiming a refutation date it cannot source.',
      },
      {
        keyframeId: 'rebuttal-congressional-record-1994',
        refutesKeyframeId: 'clinton-body-count',
        finding:
          'The list\'s own compiler, Linda Thompson, an Indianapolis lawyer, told the Congressional Record that she had "no direct evidence" of Clinton killing anyone.',
        source: 'Congressional Record, Vol. 140 No. 112, 12 August 1994, E40 — Rep. Andrew Jacobs Jr.',
        certainty: 0.95,
        provenance:
          'Primary source, exact date, quoted directly. This is the strongest rebuttal in the universe and the one #8 should be held to.',
      },
      {
        keyframeId: 'rebuttal-vrwc-provenance',
        refutesKeyframeId: 'vast-right-wing-conspiracy',
        finding:
          'Not a refutation but a provenance correction: the phrase originated with Clinton\'s own side. Chris Lehane, a Democratic strategist, wrote the 1995 memo, and Clinton used the phrase in January 1998 to describe her husband\'s accusers.',
        source:
          'Chris Lehane, "Yeah, I wrote the Vast Right-Wing Conspiracy Memo" (2019), acknowledging authorship of the 1995 memo; Wikipedia — Vast right-wing conspiracy, "Popularization"',
        certainty: 0.9,
        dateNote:
          'Keyframe dated 1995-01-01, the memo. The exact date of the memo is not sourced, so this is a year-resolution date at certainty 0.9; the theory keyframe it corrects is 1998-01-27, her Today Show interview.',
        provenance:
          'Recorded as a rebuttal because it is the correction that matters: #8 filed this as a theory *about* Clinton, and the evidence runs the other way. Lehane\'s own later acknowledgement of authorship is what settles it.',
      },
      {
        keyframeId: 'rebuttal-campaign-era-gap',
        refutesKeyframeId: 'campaign-era-allegations',
        finding: null,
        source: null,
        certainty: 0.3,
        provenance:
          'NO REFUTATION RECORDED, AND NONE SHOULD BE INVENTED. The corresponding theory keyframe is a period marker with no sourced claim — it says a pattern recurred, not that any specific assertion emerged. There is nothing specific to refute. This entry exists so the one-to-one pairing with the theories universe holds, and so the absence is visible rather than looking like an oversight.',
      },
      {
        keyframeId: 'rebuttal-benghazi-committee',
        refutesKeyframeId: 'benghazi-stand-down',
        finding:
          'The committee found there was no "stand down" order issued to U.S. military personnel in Tripoli who sought to join the fight, and that the evidence showed the State Department had in fact been denied a request for additional security resources.',
        source: 'House Select Committee on Benghazi, final report; testimony of nine military officers',
        certainty: 0.95,
        provenance:
          'The finding is quoted directly in the report and corroborated across CBS News and the committee\'s own reporting.',
      },
      {
        keyframeId: 'rebuttal-health-medical-record',
        refutesKeyframeId: 'health-and-concealment',
        finding:
          'The subdural haematoma was diagnosed in September 2012, four years before the 2016 campaign, following a fall; her doctors stated publicly that she had not suffered a stroke or neurological damage and was recovering.',
        source: 'BBC News, PBS NewsHour and CBS, contemporaneous reporting on the September 2012 hospitalisation',
        certainty: 0.9,
        provenance:
          'DATE CORRECTION, and the substance of the rebuttal. The concealment narrative depends on the 2012 diagnosis being a 2016 secret; it was publicised at the time.',
      },
      {
        keyframeId: 'rebuttal-pizzagate-investigation',
        refutesKeyframeId: 'pizzagate-and-frazzledrip',
        finding:
          'Comet Ping Pong has no basement and the photograph used to claim otherwise came from another facility; the "J\'❤ L\'Enfant" shirt was a misidentification; the McCann sketches were two drawings of the same suspect described as aged 20-40, while Tony Podesta was 64 and John Podesta 58 in 2007; the logo coincidences also appear in AOL, Time Warner and MSN. MPD called the motive of the 4 December shooting a "fictitious conspiracy theory".',
        source:
          'The New York Times, "Dissecting the #PizzaGate Conspiracy Theories" (10 December 2016); PolitiFact (4 and 6 December 2016); Snopes; MPD press release (5 December 2016)',
        certainty: 0.95,
        provenance:
          'Point-by-point itemisation with named publications. The criminal consequence — Welch\'s guilty plea and four-year sentence on 22 June 2017 — is also recorded here rather than in the theories universe, because it is a fact about the world, not a fact about the claim.',
      },
    ],
  },
  connections: {
    natural: {
      parentUniverses: [
        'personal:hillary_clinton:1947',
        'history:hillary_clinton_conspiracy_theories:1993-2016',
      ],
    },
    references: [],
  },
} as unknown as Universe;

/** All universes derived from the #8 conspiracy-theory work. */
export const hillaryClintonConspiracyRebuttalsUniverses: Universe[] = [
  hillaryClintonConspiracyRebuttalsUniverse,
];
