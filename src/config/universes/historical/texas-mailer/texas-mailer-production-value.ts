import { KeyframeType, TimePrecision, Universe, UniverseType } from '../../../../core/types';
import { CommonUniverseIds } from '../../../../core/common-universe-ids';
import { createHistoricalUniverseId } from '../../../../core/universe-ids';

/**
 * "Production Value" — three postulates about who specified the piece and what
 * the on-air description of it proves.
 *
 * THE QUOTE, CORRECTED.
 *   "So it's like candy in Texas. It's coming to every mailbox. So it had to cost
 *   a lot of money because it's, you know, it's a full color heavy paper mailer.
 *   I mean, this was not cheap." [^1]
 *   He said FULL COLOR and HEAVY PAPER. He did not say the ink was nice. He did
 *   not identify a printer. The transcript is unlabelled, so the remark is
 *   attributed to the program, not pinned to Beck personally.
 *
 * P1  A novice who picked the most expensive options would only have been saved
 *     from the UV-smearing mistake if the printer handled it.
 *     THE FIRST STEP IS THE LEAST LIKELY. A novice takes the default, and the
 *     default here is the CHEAPER option — aqueous is "the default finish...
 *     because of the economy it offers" [^14ee43]. Choosing the top of the ladder
 *     requires knowing the ladder exists. If a novice ended up on premium specs,
 *     one of three things happened: ADVISED (they asked), UPSOLD (they were sold),
 *     or DEFAULTED (no option conversation). Only the first is a rescue.
 *     THE RESCUE AND THE UPSELL ARE THE SAME CONVERSATION. The prepress person
 *     who warns you off UV is the person who quotes you the knockout. "The printer
 *     saved them" and "the printer monetised them" are indistinguishable from the
 *     outcome; they differ only in WHO RAISED THE SUBJECT.
 *     DECIDER: the quote line. A knockout charged separately, added later, reads
 *     as rescue. A knockout bundled reads as upsell. No knockout plus an applied
 *     label reads as nobody caught it.
 *
 * P1b A SECOND AXIS WHERE EXPENSIVE IS WRONG. "Full color heavy paper" names a
 *     spec with a postal consequence: tabbing for unenveloped automation mail is
 *     set by stock basis weight and fold edge [^dc4b1c], and heavier stock pushes
 *     per-piece weight toward a rate break. Same structure as the UV case, in a
 *     different axis, caught at a different stage by a different person. "Most
 *     expensive" is not one decision; it is at least two, with two chances to be
 *     saved.
 *     LIMIT: "heavy paper" is a lay description. It does not separate 100 lb matte
 *     text from 14 pt coated cover, and says nothing about aqueous vs UV. Beck's
 *     description cannot resolve the coating question. It is not a spec.
 *
 * P2  Beck hinted the paper was nice, the ink was nice, it wasn't junk mail,
 *     someone spent money on it.
 *     PARTLY TRUE, AND THE INFERENCE RUNS THE WRONG WAY. "Had to cost a lot" infers
 *     total spend from per-piece quality. But the visible part of a mailing is the
 *     cheap part: full-colour heavy stock is inexpensive per unit at volume. Beck
 *     supplied the real variable himself — "coming to every mailbox"
 *     [^d02ba2#3460]. So the reconstruction is LARGE QUANTITY x MODEST UNIT COST,
 *     not luxury spend; and the largest line is postage, which is invisible on the
 *     piece and which premium paper slightly raises.
 *     "NOT JUNK MAIL" IS A DESIGN CLAIM, NOT A SPEND CLAIM. Heavy stock and full
 *     colour exist to defeat the junk-mail reflex and get the piece read. Beck is
 *     reporting that the design worked on him — evidence the artifact performed
 *     its function, not evidence about its budget.
 *
 * CP  It sounded like an ad for the printer read by Glenn Beck.
 *     DETECTS A REGISTER, INFERS A CAUSE. The segment airs between reads for
 *     Welch's, Chirp, Relief Factor, LeafFilter, Preborn, Good Ranchers, ADF, My
 *     Patriot Supply and gopvotes.org [^1]; "not cheap," "full color,"
 *     "heavy paper" is literally the vocabulary of print advertising. The formal
 *     resemblance is real.
 *     BUT THE FUNCTION SERVES SOMEONE ELSE. "This was not cheap" plus "every
 *     mailbox" equals THEY HAVE MONEY — a claim about funding, coordination and
 *     threat, broadcast to a primed audience. Marziani's read is a single
 *     coordinated campaign by "a single entity or a single payer" [^5eb8c4#135];
 *     the on-air marvel is the public half of that argument, contributed free by
 *     the target. Conditionally the CP holds: if the printer is named, the clip
 *     becomes an unpaid testimonial. Until then it amplifies the OPERATION.
 *     THE IRONY: the man condemning the mailer was its most effective distributor.
 *
 * NEW FACTS (see metadata.newFacts) — SnailWorks named, the "students" addressing,
 * the six-week build, the forgery probe.
 *
 * Reality Relation: interpretation, fictionalizationDegree 0.25 — the quotes,
 * entities and dates are documentary; the three-path model, the register-versus-
 * function argument and the credences are the compiler's.
 *
 * LANDED WITH THE FAMILY (james-gibson/local-time#200). This is one of seven sibling
 * universes committed together: production_value, dominated_choice, preference_vector,
 * solo_limit, discovery_reach, ambiguity_tolerant_form and this one. The rest of the
 * #200 thread — payer_ledger, shell_hypothesis, operator_profile, stationarity_domicile,
 * five_postulates, automation_stack, residue_and_reach, beck_plane, proper_timelines,
 * kpi_and_signature, trace_and_vendor, api_and_price, expertise_axis, mcp_threshold —
 * is not landed, so edges to it are recorded in `metadata.threadSiblings` instead of
 * being declared as references: a target no module owns is a link the graph cannot
 * resolve, and a dangling edge looks like evidence of a module that does not exist.

 */

const UNIVERSE_ID = createHistoricalUniverseId('texas_mailer_production_value', '2026');

const PREF_ID = 'history:texas_mailer_preference_vector:2026';
const DOM_ID = 'history:texas_mailer_dominated_choice:2026';
const SOLO_ID = 'history:texas_mailer_solo_limit:2026';
const DISCOVERY_ID = 'history:texas_mailer_discovery_reach:2026';

const D = (y: number, m: number, d: number): bigint =>
  BigInt(Date.UTC(y, m - 1, d)) * 1_000_000n;

const LLC = D(2026, 9, 2);
const DROP = D(2026, 10, 14);
const DECISION = D(2026, 10, 26);

/** How a client ends up on premium specs. */
interface SpecPath {
  readonly id: string;
  readonly whoRaisedIt: 'client' | 'vendor' | 'nobody';
  readonly readsAs: string;
  readonly deciderDocument: string;
}

const SPEC_PATHS: readonly SpecPath[] = [
  {
    id: 'advised',
    whoRaisedIt: 'client',
    readsAs: 'Rescue. They asked and were told; expertise was bought at the counter.',
    deciderDocument: 'RFQ or email in which the client asks what stock or coating to use',
  },
  {
    id: 'upsold',
    whoRaisedIt: 'vendor',
    readsAs: 'The opposite of a rescue: the premium tier was volunteered, and the fix was billed.',
    deciderDocument: 'Quote sheet offering an upgrade the client did not request',
  },
  {
    id: 'defaulted',
    whoRaisedIt: 'nobody',
    readsAs: 'No option conversation occurred. The package was accepted as quoted.',
    deciderDocument: 'Single-line quote with no options listed',
  },
];

/** What the on-air description can and cannot establish. */
const OBSERVATIONS = [
  { claim: 'Full colour', establishes: 'Process, not stock or finish', resolvesCoating: false },
  { claim: 'Heavy paper', establishes: 'Basis weight above the lightest tier; possible weight-break exposure [^dc4b1c]', resolvesCoating: false },
  { claim: '"Not cheap"', establishes: 'Perceived expense, by a lay reader', resolvesCoating: false },
  { claim: '"Coming to every mailbox"', establishes: 'Quantity — the variable that actually drives total spend [^d02ba2#3460]', resolvesCoating: false },
  { claim: 'Ink quality', establishes: 'Nothing — he did not say it', resolvesCoating: false },
] as const;

export const texasMailerProductionValueUniverse = {
  universeId: UNIVERSE_ID,
  type: UniverseType.HISTORICAL_EVENT,

  identifiers: {
    primary: 'history:texas_mailer_production_value:2026',
    aliases: [
      'what did Glenn Beck actually say about the mailer',
      'did the printer save the client from UV smearing',
      'was the mailer expensive to produce',
      'did the segment advertise the printer',
      'who is SnailWorks',
    ],
  },

  realityRelation: {
    type: 'interpretation',
    fictionalizationDegree: 0.25,
    realityAnchors: [
      {
        realEventId: 'event:glenn_beck_program_2026_10_21',
        relationshipType: 'documents',
        confidence: 0.8,
        evidence: [
          'Full colour heavy paper mailer; "this was not cheap" [^1]',
          '"Coming to every mailbox" [^1]',
          'Guest Andy Ngo; segment aired 21 October 2026 [^1]',
          'Ad reads bracketing the segment [^1]',
        ],
      },
      {
        realEventId: 'event:texas_trans_mailers_2026_10',
        relationshipType: 'documents',
        confidence: 0.9,
        evidence: [
          'Mailer ID traced to SnailWorks per a USPS employee [^2]',
          'SnailWorks confirmed hired to track the mailers, would not say who paid [^4]',
          'Described as an administrative mail tracking company [^3]',
          'Wyoming LLC formed 2 September 2026 [^5eb8c4#148]',
          'Addressed to "students" of receiving households [^5eb8c4#156]',
          'Northwest Registered Agent resigning [^5eb8c4#160]',
          'Cease-and-desist sent to SnailWorks [^5eb8c4#164]',
          'West Texas DA forgery probe [^5]',
          'Single entity or single payer, per TENT counsel [^5eb8c4#135]',
        ],
      },
      {
        realEventId: 'spec:finishing_and_tabbing',
        relationshipType: 'documents',
        confidence: 0.85,
        evidence: [
          'Aqueous is the default finish for economy [^14ee43]',
          'UV spec chosen for its name becomes an expensive production problem [^577958]',
          'Tabbing standards keyed to basis weight and fold edge [^dc4b1c]',
        ],
      },
    ],
  },

  attribution: {
    public_domain: false,
    sources: ['The Glenn Beck Program transcript, 21 October 2026', 'Texas Tribune, Houston Chronicle, CBS News Texas, LGBTQ Nation reporting', 'USPS tabbing standards', 'Prior modules'],
    citations_required: true,
    usage_restrictions: [
      'The transcript is machine-generated and unlabelled by speaker. Attributing the remark to Beck personally is not supported; attribute it to the program.',
      'No spec has been read off the piece. The coating and stock remain unobserved.',
      'SnailWorks is a tracking intermediary; its involvement does not establish who printed the mailers.',
      'Credences are judgements, not frequencies.',
    ],
  },

  layers: [
    {
      layerId: 'specification',
      type: 'reconstruction',
      reality_correspondence: {
        to: 'analysis:spec_decision_path:2026',
        accuracy: 0.3,
        deviations: [
          'Three paths are modelled; real jobs mix them across axes — a client may request stock and be upsold coating in the same call.',
          'Assumes the vendor had a prepress function capable of catching the conflict; a broker reselling to a trade shop may never inspect the art.',
          'Treats "premium" as a coherent tier; a shop may price heavy stock below a lighter coated sheet.',
        ],
      },
      epochs: {
        production: {
          epochId: 'history:pv:production',
          startTime: LLC,
          endTime: DROP,
          precision: TimePrecision.DAY,
        },
      },
    },
    {
      layerId: 'broadcast_read',
      type: 'reconstruction',
      reality_correspondence: {
        to: 'analysis:on_air_description:2026',
        accuracy: 0.55,
        deviations: [
          'Treats a lay description as a data point about specs; it is a data point about perception.',
          'Assumes the speaker examined the piece closely; describing a mailer on air takes seconds.',
          'The audience-reception claim (that listeners heard funding) is inferred, not measured.',
        ],
      },
      epochs: {
        broadcast: {
          epochId: 'history:pv:broadcast',
          startTime: D(2026, 10, 21),
          endTime: DECISION,
          precision: TimePrecision.DAY,
        },
      },
    },
  ],

  temporalStructure: {
    segments: [
      { id: 'build', start: LLC, end: DROP, type: 'phase', status: 'active' },
      { id: 'arrival', start: DROP, end: D(2026, 10, 21), type: 'phase', status: 'active' },
      { id: 'amplification', start: D(2026, 10, 21), end: DECISION, type: 'phase', status: 'active' },
    ],
    keyframes: [
      {
        id: 'quote_is_narrower_than_the_postulate',
        timestamp: DECISION,
        significance: 0.9,
        certainty: 0.85,
        tags: ['quote', 'correction', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The actual words are "full color heavy paper mailer... this was not cheap" [^1]. No claim about ink was made, and no printer was named. The postulate\'s "paper was nice, ink was nice" is a plausible elaboration — the same typicality effect identified two rounds ago, now operating on the investigator\'s own recollection rather than on the artifact.',
      },
      {
        id: 'novice_would_not_pick_max',
        timestamp: DECISION,
        significance: 0.95,
        certainty: 0.8,
        tags: ['P1', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'A novice takes the default, and the default is the cheaper option [^14ee43]. Choosing the top of the ladder requires knowing the ladder exists. So P1\'s first step is its least likely one; ending on premium specs means ADVISED, UPSOLD or DEFAULTED, and only the first is a rescue.',
      },
      {
        id: 'rescue_and_upsell_are_one_conversation',
        timestamp: DECISION,
        significance: 1.0,
        certainty: 0.85,
        tags: ['P1', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The prepress person who warns you off UV is the person who quotes you the knockout. Warning and upselling are the same conversation with the same counterparty. "The printer saved them" and "the printer monetised them" produce identical artifacts; they differ only in who raised the subject. The quote line decides it, not the piece.',
      },
      {
        id: 'two_axes_of_wrong_expensive',
        timestamp: DECISION,
        significance: 0.85,
        certainty: 0.8,
        tags: ['P1b', 'postage', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'Coating and stock are separate axes with separate failure modes. Heavy stock interacts with tabbing thresholds set by basis weight [^dc4b1c] and pushes weight toward a rate break — the same "expensive is not correct" structure as the UV case, caught later, by a different person. Two chances to be saved is not one evidential situation.',
      },
      {
        id: 'per_piece_to_total_inversion',
        timestamp: DECISION,
        significance: 0.95,
        certainty: 0.85,
        tags: ['P2', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The visible part of a mailing is the cheap part. Full-colour heavy stock is cheap per unit at volume; the cost is in the quantity, which the speaker supplied himself — "coming to every mailbox" [^d02ba2#3460]. And the largest line, postage, is invisible on the piece and slightly increased by premium paper. The lay inference of expense is structurally misdirected.',
      },
      {
        id: 'not_junk_mail_is_a_design_claim',
        timestamp: DECISION,
        significance: 0.9,
        certainty: 0.8,
        tags: ['P2', 'function', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'Heavy stock and full colour exist to defeat the junk-mail reflex. The speaker reporting that the piece "was not cheap" is reporting that the design worked on him. That is evidence the artifact performed its persuasive function — not evidence about its budget. A compliment about effectiveness has been filed as a claim about spending.',
      },
      {
        id: 'register_is_not_cause',
        timestamp: DECISION,
        significance: 1.0,
        certainty: 0.8,
        tags: ['CP', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The counter-postulate correctly detects a register: the segment sits among ad reads for Welch\'s, Chirp, Relief Factor, LeafFilter, Preborn, Good Ranchers, ADF and My Patriot Supply [^1], and "not cheap / full color / heavy paper" is literally advertising vocabulary. But the function serves the operation, not the printer: "this was not cheap" plus "every mailbox" equals THEY HAVE MONEY, the public half of the single-payer argument [^5eb8c4#135], contributed free by the target.',
      },
      {
        id: 'snailworks_named',
        timestamp: DECISION,
        significance: 1.0,
        certainty: 0.8,
        tags: ['custodian', 'chain', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'A mailer ID on two of the pamphlets was traced to SnailWorks, a Maryland administrative mail-tracking firm [^2][^3], which confirmed it was hired to track the mailers but would not say who paid [^4]. The custodian this series has been recommending for four rounds now has a name, an admitted engagement, and a legal department already in receipt of a cease-and-desist [^5eb8c4#164].',
      },
      {
        id: 'addressing_premise_overturned',
        timestamp: DECISION,
        significance: 0.95,
        certainty: 0.6,
        tags: ['structure', 'correction', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The mailers were "addressed to \'students\' of the households that received them" [^5eb8c4#156]. If that means a generic salutation rather than a named recipient, the earlier structural floor — that named-household addressing ruled out EDDM and forced the permit/Mail.dat regime — does not hold as stated. Reported as a reporting ambiguity, not a settled fact; it is load-bearing for the whole series.',
      },
    ],
    windows: { strategy: 'phase_based' },
  },

  metadata: {
    canonicalName: 'Production Value: what the paper proves, and what the compliment serves',
    creators: ['Compiled analysis'],
    released: new Date('2026-10-26T00:00:00Z'),
    cultural_significance: 0.4,
    platform: 'Local Time universe system',
    externalId: 'texas_mailer_production_value_2026',
    contentType: 'postulate audit / broadcast evidentiary reading',
    specPaths: SPEC_PATHS,
    observations: OBSERVATIONS,
    newFacts: {
      snailWorks: 'Maryland administrative mail-tracking firm; mailer ID traced to it [^2]; admitted hired to track, declined to name the payer [^4]; received a cease-and-desist [^5eb8c4#164]',
      llcFormed: 'Wyoming, 2 September 2026 [^5eb8c4#148] — roughly six weeks before the drop',
      addressing: 'Reported as addressed to "students" of the receiving households [^5eb8c4#156]',
      registeredAgent: 'Northwest Registered Agent LLC formally resigning [^5eb8c4#160]',
      forgeryProbe: 'West Texas district attorney opened a forgery investigation [^5]',
      payer: 'TENT counsel: a single entity or a single payer [^5eb8c4#135]',
    },
    credences: {
      'beck_remark_as_recalled_paper_and_ink': 0.40,
      'segment_establishes_perceived_expense': 0.90,
      'perceived_expense_implies_above_market_unit_spend': 0.30,
      'novice_deliberately_chose_top_spec_tier': 0.15,
      'premium_specs_were_sold_not_requested': 0.40,
      'printer_intervened_to_prevent_addressing_failure': 0.50,
      'beck_praise_advertised_the_printer': 0.20,
      'beck_praise_amplified_perceived_funding': 0.65,
      'addressed_to_students_means_generic_salutation': 0.50,
    },
    deciderDocuments: [
      'Quote sheet: were stock and coating presented as options, and who raised them',
      'Invoice: knockout or spot coat as a separate charge, bundled, or absent',
      'The address panel: inkjet direct on coated stock, applied label, or knocked-out panel',
      'SnailWorks: the client of record, the job number, and the mail.dat it submitted [^4]',
      'Wyoming LLC filing and its formation date against the drop date [^5eb8c4#148]',
      'A sample piece: basis weight, coating, tabbing count, and the addressee field verbatim',
    ],
    ticketDeltas: [
      'dominated_choice: the "paid reconciliation" signal now needs a provenance check — requested, offered, or bundled',
      'preference_vector: add stock weight as a second premium axis with its own postal consequence',
      'solo_limit: the named-household premise is under challenge from the "students" addressing; re-derive the structural floor once the addressee field is read verbatim',
      'discovery_reach: SnailWorks replaces "the broker" as the named custodian; approach in writing, noting the cease-and-desist already served',
      'api_and_price: the "coming to every mailbox" claim is consistent with a saturation buy and inconsistent with a small named-list buy',
    ],
    uncertaintyNotes: [
      'The transcript is unlabelled by speaker and machine-generated. The remark is attributed to the program, not to Beck.',
      'No spec has been observed. Coating, stock and addressing method are all still unread.',
      'The "addressed to students" reading may describe the salutation inside a named-addressed piece; if so the structural floor stands. This is the largest open uncertainty in the series.',
      'SnailWorks is a tracking intermediary. Its involvement places a firm in the chain; it does not identify the printer, the payer, or the file source.',
      'The audience-reception claim — that listeners heard "they have money" — is inferred from the segment\'s framing, not measured.',
    ],
    threadSiblings: [
      {
        id: 'history:texas_mailer_mcp_threshold:2026',
        note: 'the integration-barrier module this one documents; not landed',
      },
      {
        id: 'history:texas_mailer_api_and_price:2026',
        note: 'the vendor-population module this one derives from; not landed',
      },
    ],
  },

  connections: {
    natural: {
      parentUniverses: [
        CommonUniverseIds.US_HISTORY,
      ],
    },
    references: [
      {
        type: 'CORRECTS',
        targetUniverseId: DOM_ID,
        confidence: 0.85,
        description:
          'Cost is treated as possible payload rather than overhead, which removes the premise ' +
          'that an expensive spec choice must be a mistake.',
      },
      {
        type: 'CORRECTS',
        targetUniverseId: PREF_ID,
        confidence: 0.85,
        description:
          'A visible premium is not evidence of an expert hand; a novice, an agent and an ' +
          'expert can all produce the same legible spend.',
      },
      {
        type: 'SUPERSEDES',
        targetUniverseId: SOLO_ID,
        confidence: 0.75,
        description:
          'The production-value reading replaces headcount as the account of what the paper ' +
          'proves.',
      },
      {
        type: 'SUPERSEDES',
        targetUniverseId: DISCOVERY_ID,
        confidence: 0.7,
        description:
          'What the segment establishes is reception of the mailer, not who paid for it.',
      },
    ],
  },
} as unknown as Universe;

/** All universes derived from james-gibson/local-time#200. */
export const texasMailerProductionValueUniverses: Universe[] = [texasMailerProductionValueUniverse];
