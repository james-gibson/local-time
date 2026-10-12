import { TimePrecision, Universe, UniverseType } from '../../../core/types';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * Conspiracy theories centred on Hillary Clinton — `history:hillary_clinton_conspiracy_theories:1993-2016`.
 *
 * Part 2 of james-gibson/local-time#8, and the answer to the open question recorded in
 * #47: Conspiracy Theory (Q4982301) had no equivalent in the built system, because it is
 * a real documented phenomenon whose *claims* are not real.
 *
 * ## Read this before using the data
 *
 * **Nothing in this universe asserts that any of these claims are true.** It records that
 * the claims were made, when they were first documented, and how they spread. Every
 * keyframe describes the *proposition*, never the *fact*. The corresponding refutations
 * live in `clinton-conspiracy-rebuttals.ts`, and each rebuttal keyframe points back here
 * through `targetUniverseId` / `targetKeyframeId`.
 *
 * The two-universe split is deliberate. A single universe holding both claim and rebuttal
 * would let a reader render an unsubstantiated claim as though it were a finding. Keeping
 * them apart means the theories can be loaded without the rebuttals only by a caller who
 * already knows the difference, and the rebuttals can be loaded — or cited — alone.
 *
 * ## Relationship corrections to the issue's proposal
 *
 * #8's comments proposed seven keyframes. All seven are kept, as agreed, but two of the
 * relationships in the proposed data were inverted and are corrected here rather than
 * dropped. `metadata.theories[].relationshipToClinton` is a required field on every entry
 * so a consumer can filter on it:
 *
 * | theory | proposed as | actually |
 * |---|---|---|
 * | `vast-right-wing-conspiracy` | a theory *about* her | `phrased_by` — Chris Lehane, a **Democratic** strategist, wrote the 1995 memo; she used the phrase on *Today* in Jan 1998 to describe her husband's accusers. She is the claimant, not the target. |
 * | `pizzagate-and-frazzledrip` | a theory *about* her | `peripheral` — originated 2016-10-30 from a claim about Huma Abedin's emails, then pivoted to Comet Ping Pong; by Wikipedia's account it later shifted "less emphasis on Clinton". Its Clinton-specific offshoot, Frazzledrip, is recorded as a distinct theory. |
 *
 * ## Date corrections
 *
 * The issue's timestamps were in **seconds**; this repository uses nanoseconds. Every date
 * below was also re-derived from a named source rather than carried over:
 *
 * - `clinton-body-count` — the issue's 1994-01-01 is a year placeholder. Anchored instead
 *   to the **Congressional Record, 12 August 1994**, where Rep. Andrew Jacobs Jr. put the
 *   "suspicious deaths" list on the record. That is a primary source with an exact date;
 *   *The Clinton Chronicles* (1994, Larry Nichols, promoted by Rev. Jerry Falwell) is the
 *   origin film, and the list's compiler was Linda Thompson.
 * - `health-and-concealment` — the underlying clot was **2012**, from a fall, recorded in her
 *   Secretary of State hospitalization. September 2016 is when the fainting spell at the
 *   9/11 commemoration re-ignited it. Collapsing those two is the error this keyframe exists
 *   to prevent.
 * - `pizzagate-and-frazzledrip` — the issue's 2016-10-31 is one day late. Genesis is
 *   **2016-10-30**.
 */

const ns = (iso: string): bigint => dateToNanoseconds(new Date(iso));

export const hillaryClintonConspiracyTheoriesUniverse: Universe = {
  universeId: 'history:hillary_clinton_conspiracy_theories:1993-2016',
  type: UniverseType.INSTITUTIONAL_PERIOD,
  identifiers: {
    primary: 'history:hillary_clinton_conspiracy_theories:1993-2016',
    aliases: [
      'clinton conspiracy theories',
      'hillary clinton misinformation',
      'clinton conspiracy phenomena',
    ],
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
          'Congressional Record, Vol. 140 No. 112 (12 August 1994) — Rep. Andrew Jacobs Jr. on the "suspicious deaths" list',
          'CNN, "A Chronology: Key Moments In The Clinton-Lewinsky Saga" — 27 January 1998 broadcast interview',
          'The New York Times, "Dissecting the #PizzaGate Conspiracy Theories" (10 December 2016)',
          'Washington Post, "Hillary Clinton\'s health just became a real issue in the presidential campaign" (11 September 2016)',
          'House Select Committee on Benghazi report — "There was no \'stand down\' order issued to U.S. military personnel in Tripoli"',
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
      'This universe documents the existence and spread of unsubstantiated claims. It does not endorse, repeat as fact, or license the reuse of any claim recorded here. Consumers rendering these records must display metadata.safetyPolicy alongside the theories.',
      'Several of the claims name real private individuals (including restaurant staff and a named campaign aide). Do not surface those names as suspects.',
    ],
    sources: [
      'Congressional Record (1994)',
      'CNN Clinton-Lewinsky timeline (1998)',
      'The New York Times "Dissecting the #PizzaGate Conspiracy Theories" (2016)',
      'Wikipedia — Pizzagate conspiracy theory; Clinton body count conspiracy theory; Vast right-wing conspiracy',
      'Local Time Issue #8 (secondary, names no source; dates re-derived here)',
    ],
  },
  layers: [
    {
      layerId: 'primary',
      type: 'primary',
      epochs: {
        phenomenon: {
          epochId: 'hcc:phenomenon',
          startTime: ns('1993-07-04T00:00:00Z'),
          endTime: ns('2016-12-05T00:00:00Z'),
          precision: TimePrecision.DAY,
          description: 'Documented appearance and spread of conspiracy theories centred on Hillary Clinton',
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
        description:
          'Suspicion attaching to the Clintons through Vince Foster\'s death and Whitewater, crystallising in 1994 around the alleged Clinton Body Count.',
      },
      {
        id: 'lewinsky-and-vrwc',
        start: ns('1998-01-01T00:00:00Z'),
        end: ns('2007-01-01T00:00:00Z'),
        type: 'phase',
        status: 'ended',
        description:
          'The impeachment years. The phrase "vast right-wing conspiracy" enters the record here — coined by her side of the argument, not against her.',
      },
      {
        id: 'campaign-years',
        start: ns('2007-01-01T00:00:00Z'),
        end: ns('2012-01-01T00:00:00Z'),
        type: 'phase',
        status: 'ended',
        description:
          'Revival of the older allegations across the 2008 primary and 2012 re-election campaigns.',
      },
      {
        id: 'late-campaign-and-2016',
        start: ns('2012-01-01T00:00:00Z'),
        end: ns('2016-12-05T00:00:00Z'),
        type: 'phase',
        status: 'ended',
        description:
          'Benghazi, the 2016 health narrative, and in October 2016 the Pizzagate eruption and its Frazzledrip offshoot, which became a QAnon predecessor.',
      },
    ],
    keyframes: [
      {
        id: 'vince-foster-suspicion',
        timestamp: ns('1993-07-04T00:00:00Z'),
        significance: 0.8,
        tags: ['whitewater', 'vince-foster', 'speculation-phase'],
        certainty: 0.85,
      },
      {
        id: 'clinton-body-count',
        timestamp: ns('1994-08-12T00:00:00Z'),
        significance: 0.85,
        tags: ['body-count', 'clinton-chronicles', 'documented'],
        certainty: 0.95,
      },
      {
        id: 'vast-right-wing-conspiracy',
        timestamp: ns('1998-01-27T00:00:00Z'),
        significance: 0.85,
        tags: ['vrwc', 'lewinsky', 'relationship-correction'],
        certainty: 0.95,
      },
      {
        id: 'campaign-era-allegations',
        timestamp: ns('2008-01-20T00:00:00Z'),
        significance: 0.5,
        tags: ['election-2008', 'election-2012', 'period-marker'],
        certainty: 0.4,
        dateRange: {
          earliest: ns('2007-01-20T00:00:00Z'),
          latest: ns('2009-01-21T00:00:00Z'),
        },
      },
      {
        id: 'benghazi-stand-down',
        timestamp: ns('2012-09-11T00:00:00Z'),
        significance: 0.9,
        tags: ['benghazi', 'libya', 'foreign-policy'],
        certainty: 0.95,
      },
      {
        id: 'health-and-concealment',
        timestamp: ns('2016-09-11T00:00:00Z'),
        significance: 0.7,
        tags: ['health', 'election-2016', 'date-correction'],
        certainty: 0.9,
      },
      {
        id: 'pizzagate-and-frazzledrip',
        timestamp: ns('2016-10-30T00:00:00Z'),
        significance: 0.85,
        tags: ['pizzagate', 'frazzledrip', 'election-2016', 'relationship-correction'],
        certainty: 0.95,
      },
    ],
    windows: { strategy: 'phase_based' },
  },
  metadata: {
    canonicalName: 'Conspiracy theories centred on Hillary Clinton',
    description:
      'The documented appearance and spread of conspiracy theories whose subject is Hillary Clinton. Records propositions as propositions; carries no claim that any of them is true.',
    cultural_significance: 0.85,
    cultural_significance_justification:
      'Pizzagate, which this universe records, moved from message board to armed incursion within five weeks — a documented instance of misinformation producing physical harm.',
    tags: ['conspiracy-theory', 'misinformation', 'politics', 'us-politics'],
    sourceIssue: 8,

    /**
     * Required policy block. A consumer that renders any theory from this universe must
     * surface this text with it. The split into a rebuttals universe is only meaningful if
     * the disclaimer travels with the theories.
     */
    safetyPolicy: {
      claimsStatus: 'unsubstantiated',
      instruction:
        'These are records of claims, not of facts. Never present the contents of any theory as an assertion about a real person.',
      rebuttalsUniverseId: 'history:hillary_clinton_conspiracy_rebuttals:1993-2017',
      mitigation: 'Each rebuttal keyframe in the rebuttals universe names the theory keyframe it refutes via targetKeyframeId.',
    },

    /**
     * `relationshipToClinton` is required on every entry. `target` means the central
     * assertion is about her; `phrased_by` means she is the one asserting; `peripheral`
     * means she is involved but is not the subject.
     */
    theories: [
      {
        keyframeId: 'vince-foster-suspicion',
        name: 'Whitewater / Vince Foster suspicion',
        relationshipToClinton: 'target',
        claimSummary:
          'Claims that the Clintons were responsible for the death of deputy counsel Vince Foster, and that Whitewater concealed criminality.',
        firstDocumented: '1993-07-04',
        provenance:
          'Foster\'s death date is well documented. The allegations around it are a documented phenomenon; the period before the 1994 record below is inferred rather than sourced, hence certainty 0.85 rather than higher.',
      },
      {
        keyframeId: 'clinton-body-count',
        name: 'Clinton Body Count',
        relationshipToClinton: 'target',
        claimSummary:
          'A list of people connected to the Clintons who died, presented as evidence of a pattern of murder by Bill Clinton.',
        firstDocumented: '1994',
        provenance:
          'Wikipedia: circulating since at least 1994; *The Clinton Chronicles* (Citizens for Honest Government) spread it among conservative activists, and Rep. Andrew Jacobs Jr. condemned it in the Congressional Record on 1994-08-12, recording that compiler Linda Thompson "admitted she had no direct evidence" of Clinton killing anyone.',
        downstream:
          'Revived in 2016 by Rush Limbaugh and others; per EBSCO, shared by Donald Trump in May 2025.',
      },
      {
        keyframeId: 'vast-right-wing-conspiracy',
        name: 'Vast right-wing conspiracy',
        relationshipToClinton: 'phrased_by',
        claimSummary:
          'The claim that her husband\'s accusers were acting as a coordinated conspiracy. NOTE: this is a claim Clinton made, not a claim made about her.',
        firstDocumented: '1995',
        provenance:
          'Chris Lehane — a Democratic political strategist — authored the 1995 memo; Wikipedia\'s own article has a "Popularization" section covering that memo and the *Today Show* interview of 1998-01-27. She is the claimant in this record.',
      },
      {
        keyframeId: 'campaign-era-allegations',
        name: 'Revival of the Arkansas-era allegations',
        relationshipToClinton: 'target',
        claimSummary:
          'Recirculation of the body-count and Whitewater material during successive campaign cycles.',
        firstDocumented: '2007',
        provenance:
          'NO SINGLE SOURCE LOCATED. This keyframe is a period marker for a recurring pattern, not a claim that any specific story emerged on a specific day. That is why it carries certainty 0.4 and a dateRange. It should not be read as an emergence date.',
      },
      {
        keyframeId: 'benghazi-stand-down',
        name: 'Benghazi "stand-down order"',
        relationshipToClinton: 'target',
        claimSummary:
          'That a stand-down order held back military assets from the 2012 attack on the U.S. diplomatic mission in Benghazi, under her authority as Secretary of State.',
        firstDocumented: '2012-09-11',
        provenance:
          'The attack occurred 2012-09-11. The stand-down claim was pressed by Republican lawmakers and refuted by nine military officers testifying before Congress and by the House Select Committee on Benghazi.',
      },
      {
        keyframeId: 'health-and-concealment',
        name: '2016 health and concealment narrative',
        relationshipToClinton: 'target',
        claimSummary:
          'That Clinton concealed a serious or terminal illness, and in particular that she hid the 2012 subdural haematoma found after a fall.',
        firstDocumented: '2016-09-11',
        provenance:
          'DATE CORRECTION. The clot between brain and skull was diagnosed in **September 2012**, during her Secretary of State hospitalization, following a fall (BBC, PBS, CBS, contemporaneous). September 2016 is when she fainted at the 9/11 commemoration, sustained a concussion, and the 2012 diagnosis resurfaced as a campaign issue (Washington Post, 2016-09-11). The two events are four years apart.',
      },
      {
        keyframeId: 'pizzagate-and-frazzledrip',
        name: 'Pizzagate (and the Frazzledrip offshoot)',
        relationshipToClinton: 'peripheral',
        claimSummary:
          'That an NYPD search of Huma Abedin\'s emails uncovered a child sex ring with Clinton at its centre, later pivoted to Comet Ping Pong in Washington, D.C.',
        firstDocumented: '2016-10-30',
        provenance:
          'Genesis 2016-10-30: a white-supremacist Twitter account falsely claimed an NYPD discovery; the tweet is archived. Name and venue entered via *Your News Wire* citing a 4chan post, then pro-Trump sites. RELATIONSHIP CORRECTION: the theory was about Abedin\'s emails, and per Wikipedia later shifted "less emphasis on Clinton and more on an alleged worldwide elite".',
        distinctOffshoot: {
          name: 'Frazzledrip',
          claimSummary:
            'That Clinton personally participated in the ritual murder of a child. Unlike Pizzagate proper, this offshoot is directly about her.',
          provenance:
            'Recorded separately precisely because it is the variant that is genuinely Clinton-targeted. Leaving it inside the Pizzagate entry would preserve the category error #8 introduced.',
        },
        consequences:
          'On 2016-12-04 Edgar Welch fired a rifle into Comet Ping Pong; Welch pleaded guilty and was sentenced to four years on 2017-06-22. The MPD characterisation of the motive is rebuttal language and is recorded in the rebuttals universe only - see rebuttal-pizzagate-investigation.',
      },
    ],
  },
  connections: {
    natural: {
      parentUniverses: ['personal:hillary_clinton:1947', 'history:hillary_clinton_conspiracy_rebuttals:1993-2017'],
    },
    references: [],
  },
} as unknown as Universe;

/** All universes derived from the #8 conspiracy-theory work. */
export const hillaryClintonConspiracyTheoriesUniverses: Universe[] = [
  hillaryClintonConspiracyTheoriesUniverse,
];
