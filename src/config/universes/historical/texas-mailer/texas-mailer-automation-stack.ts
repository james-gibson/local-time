import {
  KeyframeType,
  TimePrecision,
  Universe,
  UniverseType,
} from '../../../../core/types';
import { CommonUniverseIds } from '../../../../core/common-universe-ids';
import { createHistoricalUniverseId } from '../../../../core/universe-ids';

/**
 * "Automation Stack" — third-round postulate test.
 *
 * P6  (prompt-assembled pipeline)      -> PARTIALLY CONFIRMED, 7 of 8 workstreams.
 *       The single non-automatable step (borrowed permit) is the single step that
 *       produced a named third party. Automation therefore improves, not worsens,
 *       the discovery outlook: it predicts few human seams, and they are the ones
 *       already targeted.
 * P6a (the prompt should appear)        -> REFUTED as stated, REPLACED by a real
 *       channel: the print production file's metadata block.
 * P7  (holidays/debugging -> extra time -> crypto) -> REFUTED. Deadline exogenous;
 *       overrun converts to reduced scope, not delay. Gas ~$0.002 anyway, and no
 *       counterparty in this chain accepts ETH.
 * P8  (years-old reddit/4chan post)    -> UNFALSIFIABLE as stated. Downgraded to a
 *       vocabulary test; adjacent prior art exists, no blueprint found.
 *
 * Cultural Significance: 0.25 — methodological instrument.
 * Reality Relation: interpretation, fictionalizationDegree 0.45 — the pipeline
 * decomposition and the gas figure are documented; the scoring is the compiler's.
 *
 * Hierarchical Context: US_HISTORY -> US_GOVERNMENT. derives_from five_postulates and
 * operator_profile. Supersedes the operator-profile statement that the campaign
 * implied a production apparatus; it implies a prompt and one printer.
 */

const UNIVERSE_ID = createHistoricalUniverseId(
  'texas_mailer_automation_stack',
  '2026',
);

const FIVE_POSTULATES_ID = 'history:texas_mailer_five_postulates:2026';
const OPERATOR_PROFILE_ID = 'history:texas_mailer_operator_profile:2026';
const DISCOVERY_ID = 'history:texas_mailer_discovery_reach:2026';

/* Clock: UTC midnight; m is 1-based. */
const D = (y: number, m: number, d: number): bigint =>
  BigInt(Date.UTC(y, m - 1, d)) * 1_000_000n;

const INDIGENOUS_PEOPLES_DAY = D(2026, 10, 12);
const FORMATION = D(2026, 9, 2);
const PERMIT_CLEARED = D(2026, 10, 16);
const DROP = D(2026, 10, 18);
const EARLY_VOTING = D(2026, 10, 19);
const EXPOSURE = D(2026, 10, 20);
const PETITION = D(2026, 10, 22);
const AGENT_RESIGNS = D(2026, 10, 22);
const DECISION_DATE = D(2026, 10, 26);

export const texasMailerAutomationStackUniverse = {
  universeId: UNIVERSE_ID,
  type: UniverseType.HISTORICAL_EVENT,

  identifiers: {
    primary: 'history:texas_mailer_automation_stack:2026',
    aliases: [
      'could a prompt have assembled this campaign',
      'where does the prompt appear in the record',
      'why gas fees are irrelevant to a mailer',
      'is there prior art on this tactic',
    ],
  },

  realityRelation: {
    type: 'interpretation',
    fictionalizationDegree: 0.45,

    realityAnchors: [
      {
        realEventId: 'history:texas_trans_student_mailer_controversy:2026',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'LLC formed 2 Sept 2026 at a Sheridan agent address',
          'No website, social presence or online footprint',
          'Photographs and branding taken from TENT',
          'Borrowed permit held by an Illinois printer',
        ],
      },
      {
        realEventId: 'analysis:mail_production_pipeline:2026',
        relationshipType: 'reinterprets',
        confidence: 0.6,
        evidence: [
          'Eight-workstream decomposition is the compiler\'s construct, not an industry standard',
          'Scoring assumes commercial print-and-mail APIs, which the record does not prove were used',
          'Volume of "millions" is from reporting, not from a postage statement',
        ],
      },
    ],
  },

  attribution: {
    public_domain: false,
    sources: [
      'Case reporting on the mailer controversy',
      'Network fee data (25 Oct 2026)',
      'Prior-art sweep',
    ],
    citations_required: true,
    usage_restrictions: [
      'Do not cite the pipeline table as evidence that any tool was used; it is a feasibility score.',
      'Do not cite P8 as established either way. It is marked unfalsifiable and carries no weight.',
      'The gas figure dates to 25 Oct 2026 and is quoted to show irrelevance, not to price anything.',
    ],
  },

  layers: [
    {
      layerId: 'pipeline_ledger',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:mail_production_pipeline:2026',
        accuracy: 0.5,
        deviations: [
          'Scores feasibility, not practice: a workstream marked automatable may still have been done by hand.',
          'Assumes commercial APIs; a small lettershop doing all eight steps would collapse the decomposition.',
          'Ignores that list brokers routinely refuse political/issue mail without an identified sponsor, which may raise the friction on workstream five above the score given.',
        ],
      },
      epochs: {
        assembly_window: {
          epochId: 'history:automation:assembly',
          startTime: FORMATION,
          endTime: PERMIT_CLEARED,
          precision: TimePrecision.DAY,
          description:
            'Six weeks containing one federal holiday (7 Sept) and one that most of the industry observes (12 Oct).',
        },
      },
    },

    {
      layerId: 'forensic_surface',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:print_artifact_forensics:2026',
        accuracy: 0.8,
        deviations: [
          'Metadata survival depends entirely on the file format and the printer\'s workflow; a flattened PDF-to-plate path may strip most of it.',
          'No production file has been obtained, so the channels are enumerated rather than tested.',
          'Assumes the layout was produced digitally; a scanned or re-typeset original would defeat most of this layer.',
        ],
      },
      epochs: {
        artifact_vintage: {
          epochId: 'history:automation:artifact',
          startTime: PERMIT_CLEARED,
          endTime: DECISION_DATE,
          precision: TimePrecision.DAY,
          description: 'Window in which the production file exists and is still recoverable.',
        },
      },
    },

    {
      layerId: 'postulate_space',
      type: 'subjective',
      reality_correspondence: {
        to: 'analysis:texas_mailer_postulate_test_round3:2026',
        accuracy: 0.35,
        deviations: [
          'P8 is recorded as unfalsifiable rather than tested; that is a judgement, not a finding.',
          'P7\'s refutation assumes the drop date was fixed by early voting, which is inference from timing.',
          'The absence of a prompt in the record is not evidence that no prompt existed.',
        ],
      },
      epochs: {
        test_span: {
          epochId: 'history:automation:test',
          startTime: EXPOSURE,
          endTime: DECISION_DATE,
          precision: TimePrecision.DAY,
          description: 'Post-circulation test window.',
        },
      },
    },
  ],

  temporalStructure: {
    segments: [
      { id: 'assembly', start: FORMATION, end: PERMIT_CLEARED, type: 'phase', status: 'active' },
      { id: 'drop', start: DROP, end: EARLY_VOTING, type: 'phase', status: 'active' },
      { id: 'circulation', start: EARLY_VOTING, end: EXPOSURE, type: 'phase', status: 'active' },
      { id: 'exposure', start: EXPOSURE, end: AGENT_RESIGNS, type: 'phase', status: 'active' },
      { id: 'after_petition', start: PETITION, end: DECISION_DATE, type: 'legal_period', status: 'active' },
    ],

    keyframes: [
      {
        id: 'p6_seven_of_eight_automatable',
        timestamp: D(2026, 9, 15),
        significance: 0.95,
        certainty: 0.75,
        tags: ['P6', 'automation', 'feasibility', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'Formation, naming, copy, layout, asset sourcing, list selection and print are all achievable with a web form, a card and a print-and-mail API. Only postage requires another party\'s consent, because using a permit imprint means the permit holder agrees to it. Seven of eight workstreams therefore clear the automation bar.',
      },
      {
        id: 'p6_the_one_human_seam',
        timestamp: PERMIT_CLEARED,
        significance: 1.0,
        certainty: 0.85,
        tags: ['P6', 'automation', 'permit', 'key_finding', 'discovery'],
        type: KeyframeType.MILESTONE,
        description:
          'The single non-automatable step is the single step that produced a named, contactable third party: a printer in Illinois whose permit was used and who disclaims involvement. Automation predicts exactly one such seam. One exists. This is the postulate\'s strongest support and its most useful consequence — the pipeline was short, not broad, so the number of people who could identify the mailer is small.',
      },
      {
        id: 'p6_automation_implies_unproofread',
        timestamp: DROP,
        significance: 0.9,
        certainty: 0.7,
        tags: ['P6', 'error_budget', 'design_tell'],
        description:
          'Automation implies no human proofreader, and the errors are of that type rather than of drafting: the piece points readers at the victim\'s own website and uses a commercial mailbox rental as a return address. Those are not stylistic failures a copywriter makes; they are a missing review step. Design coherence is high while consequence-checking is absent — the signature of a single-pass generation.',
      },
      {
        id: 'p6_quality_is_not_evidence_of_staff',
        timestamp: EXPOSURE,
        significance: 0.8,
        certainty: 0.75,
        tags: ['P6', 'quality', 'counter_argument'],
        description:
          'Recipients described the pieces as unusually high quality at a volume in the millions. This is often read as evidence of a professional shop; it is equally consistent with a good template and an industrial print API, and the two cannot be separated from the artifact alone. Quality is therefore not diagnostic of staffing, in either direction.',
      },
      {
        id: 'p6a_prompt_is_not_an_event',
        timestamp: DECISION_DATE,
        significance: 0.95,
        certainty: 0.9,
        tags: ['P6a', 'epistemics', 'refuted', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'A prompt is an account-scoped private record, not an event in the world. It does not appear in the chronology unless a fragment was pasted into something filed. The half-postulate is therefore refuted as stated: the absence of a prompt in the events is guaranteed by the nature of prompts, and carries no information about whether one existed.',
      },
      {
        id: 'p6a_replacement_channel_metadata',
        timestamp: DECISION_DATE,
        significance: 1.0,
        certainty: 0.8,
        tags: ['P6a', 'forensics', 'discovery', 'key_finding', 'replacement'],
        type: KeyframeType.MILESTONE,
        description:
          'The replacement that does work: the print production file carries a metadata block — producing application, creator and producer strings, XMP history, layer and object names, font subsets, and any embedded image provenance. This survives the path from layout to printer in many workflows and is held by the printer and lettershop, not by the manager. It is the closest thing to the prompt that can be subpoenaed, and no channel currently targets it.',
      },
      {
        id: 'p6a_typographic_residue',
        timestamp: DECISION_DATE,
        significance: 0.7,
        certainty: 0.5,
        tags: ['P6a', 'forensics', 'residue'],
        description:
          'Secondary surface: typographic and compositional residue — dash conventions, spelling variants, text-block orphans, list-numbering habits, and the wording of the resource entries. Weak individually, but it is the only evidence class that speaks to *how the text was produced* rather than what it said.',
      },
      {
        id: 'p6a_victim_assets_are_the_real_trace',
        timestamp: EXPOSURE,
        significance: 0.85,
        certainty: 0.85,
        tags: ['P6a', 'provenance', 'scrape'],
        description:
          'The strongest provenance trace is not generative at all: the photographs and branding came from TENT. If images were taken from the victim\'s site, the scrape is the artefact and the file names may survive inside the print file. Asset theft is a worse operational decision than any content choice, and it is also the most legible.',
      },
      {
        id: 'p7_deadline_is_exogenous',
        timestamp: DROP,
        significance: 0.9,
        certainty: 0.85,
        tags: ['P7', 'schedule', 'refuted', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The drop landed as early voting opened. With an exogenous deadline, schedule overrun cannot become delay past the deadline — it converts into reduced scope. The observed scope is minimal and uniform: one design, one piece, one drop. "Extra time" is therefore the wrong model; the calendar was a constraint, not a slack variable.',
      },
      {
        id: 'p7_holidays_were_available',
        timestamp: INDIGENOUS_PEOPLES_DAY,
        significance: 0.6,
        certainty: 0.8,
        tags: ['P7', 'holidays', 'schedule'],
        description:
          'The assembly window ran 2 Sept to mid-Oct and contained Labor Day (7 Sept) and Indigenous Peoples\' Day (12 Oct), both of which slow print and lettershop throughput. Six weeks with two interruptions is tight for a conventional shop and routine for an automated one — the calendar quietly favours the automation reading.',
      },
      {
        id: 'p7_gas_is_free_and_irrelevant',
        timestamp: DECISION_DATE,
        significance: 1.0,
        certainty: 0.95,
        tags: ['P7', 'crypto', 'refuted', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'Network cost cannot be a motive: standard Ethereum fees were about 0.04 gwei on 25 Oct 2026, roughly $0.002 for a transfer. And gas cannot be a mechanism either, because no counterparty in this chain accepts ETH — registered agents, list brokers, printers, lettershops and USPS all settle in card or ACH. The crypto postulate fails at the counterparty, not at the fee.',
      },
      {
        id: 'p7_crypto_surviving_niche',
        timestamp: DECISION_DATE,
        significance: 0.8,
        certainty: 0.45,
        tags: ['P7', 'crypto', 'consultant', 'survives'],
        description:
          'What survives: the manager\'s fee, and grey-market data, are the only payments with a person rather than an institution on the other side. That is where a wallet could appear — and a wallet is a better lead than an invoice, because it is a public ledger with an immutable timestamp. It is a tracing question, not a gas question.',
      },
      {
        id: 'p8_unfalsifiable',
        timestamp: DECISION_DATE,
        significance: 0.9,
        certainty: 0.9,
        tags: ['P8', 'epistemics', 'downgraded', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'As stated the postulate cannot be refuted: "someone somewhere posted this years ago" is compatible with every possible search result. It is recorded as unfalsifiable and given no evidential weight, rather than answered. This is the third postulate in the series to need conversion rather than adjudication.',
      },
      {
        id: 'p8_prior_art_sweep_result',
        timestamp: DECISION_DATE,
        significance: 0.75,
        certainty: 0.7,
        tags: ['P8', 'prior_art', 'search'],
        description:
          'Sweep result: mail-prank posting from Oct 2025; Jan 2026 coverage of AI-generated fake political mailers; a local "beware of false flag" thread from 20 Oct 2026, i.e. after the fact. No blueprint. The nearest public naming of the tactic post-dates the operation, which is the opposite of what the postulate predicts.',
      },
      {
        id: 'p8_no_novelty_required',
        timestamp: DECISION_DATE,
        significance: 0.95,
        certainty: 0.8,
        tags: ['P8', 'base_rate', 'key_finding', 'inversion'],
        type: KeyframeType.MILESTONE,
        description:
          'The inversion that dissolves the postulate: every component is mass-market. Wyoming holds roughly 900,000 active entities on a population of 590,000; the agent involved is associated with over 300,000 LLCs. Nothing here required a discovered technique, so no blueprint needed to exist. The testable residue is vocabulary, not concept: whether the copy borrows a specific idiom. Its register is institutional, not imageboard.',
      },
      {
        id: 'automation_round_verdict',
        timestamp: DECISION_DATE,
        significance: 0.95,
        certainty: 0.7,
        tags: ['analysis', 'conclusion'],
        type: KeyframeType.MILESTONE,
        description:
          'Final: P6 partially confirmed at seven of eight workstreams, and its one human seam is already identified. P6a refuted as stated and replaced by the print-file metadata channel. P7 refuted — exogenous deadline, negligible gas, no crypto-capable counterparty — with a surviving niche at the consultant payment. P8 downgraded to unfalsifiable, with no blueprint found and no blueprint required.',
      },
    ],

    windows: { strategy: 'phase_based' },
  },

  metadata: {
    canonicalName: 'Automation Stack: prompt-assembled production, metadata forensics, and the irrelevance of gas',
    creators: ['Compiled analysis; no author of record'],
    released: new Date('2026-10-26T00:00:00Z'),
    cultural_significance: 0.25,
    platform: 'Local Time universe system',
    externalId: 'texas_mailer_automation_stack_2026',
    contentType: 'pipeline feasibility / forensic surface enumeration',
    postulateLedger: {
      P6_prompt_assembled_pipeline: {
        status: 'PARTIALLY CONFIRMED — 7 of 8',
        basis: 'Formation through print clear the bar; postage requires a permit holder\'s consent',
        consequence: 'Pipeline was short, not broad — few people can identify the mailer',
        residual: 'Feasibility is not practice; no tool is proven to have been used',
      },
      P6a_prompt_appears_in_events: {
        status: 'REFUTED AS STATED',
        why: 'A prompt is account-scoped; it has no event unless pasted into something filed',
        replacement: 'Print production file metadata — producer strings, XMP, layer names, font subsets',
      },
      P7_time_pressure_pushed_work_to_crypto: {
        status: 'REFUTED',
        why: 'Exogenous deadline converts overrun to reduced scope; gas ~$0.002; no crypto-capable counterparty',
        survivingNiche: 'Consultant fee or grey-market data — a wallet, not a gas calculation',
      },
      P8_prior_art_on_reddit_or_4chan: {
        status: 'UNFALSIFIABLE — NO WEIGHT',
        sweep: 'Adjacent prior art only; nearest naming post-dates the event',
        convertedTest: 'Vocabulary and idiom, not concept',
      },
    },
    pipelineScores: {
      'entity formation': 'automatable — 1.0',
      'naming and brand': 'automatable — 1.0',
      'copy and layout': 'automatable — 0.95',
      'asset sourcing': 'automatable — 1.0',
      'list acquisition': 'partial — 0.6',
      'print': 'automatable — 0.95',
      'postage': 'requires consent — 0.0',
      'payment rail': 'bottleneck — 0.5',
    },
    forensicsChecklist: [
      'PDF producer/creator strings and XMP modification history',
      'Layer, object and swatch naming conventions',
      'Embedded font subsets and licensing stamps',
      'Embedded image hashes — match against TENT site assets',
      'Imposition and versioning artefacts showing single-pass vs iterated proofs',
      'List file properties: record count, select criteria, suppression flags',
    ],
    ticketDeltas: [
      'discovery_reach: add print-file metadata request to the printer and lettershop; highest-value unclaimed channel',
      'discovery_reach: deprioritise crypto/wallet tracing to consultant and data-vendor payments only',
      'operator_profile: restate apparatus as "one prompt, one printer" — supersedes any multi-vendor production assumption',
      'five_postulates: close P8 as untestable; record no blueprint and no requirement for one',
    ],
    uncertaintyNotes: [
      'Pipeline scores are feasibility judgements and do not prove any tool was used.',
      'Metadata survival through a commercial print workflow is not guaranteed and has not been tested here.',
      'The exogenous-deadline reading is inferred from timing, not from any recovered schedule.',
      'P8 is recorded as unfalsifiable; do not let it re-enter the ledger as an open lead.',
      'Gas figures are a single-day snapshot quoted to establish irrelevance.',
    ],
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.US_HISTORY, CommonUniverseIds.US_GOVERNMENT],
    },
    references: [
      {
        type: 'DERIVES_FROM',
        targetUniverseId: FIVE_POSTULATES_ID,
        confidence: 1.0,
        description: 'Succeeds the P5 management finding and narrows it to a production mechanism.',
      },
      {
        type: 'DERIVES_FROM',
        targetUniverseId: OPERATOR_PROFILE_ID,
        confidence: 1.0,
        description: 'Restates the production apparatus as a prompt and one printer.',
      },
      {
        type: 'DOCUMENTS',
        targetUniverseId: DISCOVERY_ID,
        confidence: 0.9,
        description: 'The reach channels the metadata and wallet-tracing corrections target.',
      },
    ],
  },
} as unknown as Universe;

/** All universes this draft owns. */
export const texasMailerAutomationStackUniverses: Universe[] = [texasMailerAutomationStackUniverse];
