import {
  KeyframeType,
  TimePrecision,
  Universe,
  UniverseType,
} from '../../../../core/types';
import { CommonUniverseIds } from '../../../../core/common-universe-ids';
import { createHistoricalUniverseId } from '../../../../core/universe-ids';

/**
 * "The Shell Hypothesis, Tested" — a falsification harness for the proposition:
 *
 *   "If a business or a super PAC wanted to fund advertising, investing in a
 *    shell corporation is a good start."
 *
 * VERDICT ENCODED HERE: the proposition is true of the *speaker*, false of the
 * *funder*, and catastrophic if a super PAC is anywhere in the chain.
 *
 *   - super PAC + shell donor  -> statutory violation and full disclosure (the worst cell)
 *   - shell as spender         -> no filing obligation at all, if the speech is issue advocacy
 *   - shell as brand thief     -> the one choice that guarantees discovery
 *
 * The module's conclusion, at 2026-10-23: the operation's fatal error was not the
 * shell. It was naming the shell after a real nonprofit. An anonymous LLC running
 * unregulated issue advocacy can stay invisible indefinitely; the same LLC wearing
 * someone else's identity manufactures a plaintiff with standing and a DA with a
 * forgery theory. That is the only reason the structure is legible at all.
 *
 * Cultural Significance: 0.25 — analytic instrument, no independent weight.
 * Reality Relation: interpretation, fictionalizationDegree 0.7 — the legal frame is
 * documented; the hypothesis it tests is not asserted as fact.
 *
 * Hierarchical Context: US_HISTORY -> US_GOVERNMENT. derives_from the payer-ledger
 * and discovery-reach universes; reinterprets the payer motive model rather than
 * duplicating it. No contradiction edges — the earlier modules are revised, not
 * disputed, and a `contradicts` edge would imply litigation between analyses.
 */

const UNIVERSE_ID = createHistoricalUniverseId(
  'texas_mailer_shell_hypothesis',
  '2026',
);

const PAYER_LEDGER_ID = 'history:texas_mailer_payer_ledger:2026';
const DISCOVERY_ID = 'history:texas_mailer_discovery_reach:2026';
const MAILER_EVENT_ID = 'history:texas_trans_student_mailer_controversy:2026';

/* Clock: UTC midnight. m is 1-based. */
const D = (y: number, m: number, d: number): bigint =>
  BigInt(Date.UTC(y, m - 1, d)) * 1_000_000n;

const IFR = D(2025, 3, 26);       // FinCEN interim rule: domestic BOI suspended
const FINAL = D(2026, 8, 14);     // final rule effective; data deletion announced
const FORMATION = D(2026, 9, 2);
const DROP = D(2026, 10, 18);
const EXPOSURE = D(2026, 10, 20);
const PETITION = D(2026, 10, 22);

export const texasMailerShellHypothesisUniverse = {
  universeId: UNIVERSE_ID,
  type: UniverseType.HISTORICAL_EVENT,

  identifiers: {
    primary: 'history:texas_mailer_shell_hypothesis:2026',
    aliases: [
      'is a shell corporation a good way to fund political advertising',
      'shell LLC as speaker not conduit',
      'super PAC anonymity hypothesis',
    ],
  },

  realityRelation: {
    type: 'interpretation',
    fictionalizationDegree: 0.7,

    realityAnchors: [
      {
        realEventId: MAILER_EVENT_ID,
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'Wyoming LLC filed 2 Sept 2026, five weeks before the drop',
          'Filing names a registered-agent service in Sheridan',
          'No member or manager is publicly disclosed in the Wyoming record',
        ],
      },
      {
        realEventId: 'analysis:texas_mailer_payer_motive_model:2026',
        relationshipType: 'reinterprets',
        confidence: 0.65,
        evidence: [
          'H2 (deductible advertising) and H3 (laundered placement) demoted further',
          'New H5 added: shell-as-speaker under unregulated issue advocacy',
          'Prior on H4 raised only slightly — the false flag is still unexplained by finance',
        ],
      },
    ],
  },

  attribution: {
    public_domain: false,
    sources: [
      '52 U.S.C. §30122',
      'FEC guidance on super PAC receipts and IE disclosure',
      'Texas Election Code §253.094; TEC advertising rules',
      'FinCEN final rule 14 Aug 2026',
    ],
    citations_required: true,
    usage_restrictions: [
      'Not legal advice; the campaign-finance reading is a lay synthesis of primary sources.',
      'The hypothesis is tested, not endorsed. A surviving hypothesis is not a finding about any person.',
      'Do not use this module to assert that any super PAC, business, or committee was involved. No reporting connects one.',
      'The 19-day BOI/formation gap is a coincidence of dates, not evidence of design.',
    ],
  },

  layers: [
    {
      layerId: 'statutory_frame',
      type: 'primary',
      epochs: {
        boi_suspended: {
          epochId: 'history:shell_hyp:boi_ifr',
          startTime: IFR,
          endTime: FINAL,
          precision: TimePrecision.DAY,
          description:
            'Interim rule removes BOI reporting for domestic entities; only foreign registrants remain in scope.',
        },
        boi_permanently_closed: {
          epochId: 'history:shell_hyp:boi_final',
          startTime: FINAL,
          endTime: PETITION,
          precision: TimePrecision.DAY,
          description:
            'Final rule adopts the exemption permanently and deletes previously reported US-person data.',
        },
      },
    },

    {
      /* The hypothesis space: five vehicles, scored against the same objective. */
      layerId: 'vehicle_matrix',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:texas_mailer_shell_hypothesis:2026',
        accuracy: 0.5,
        deviations: [
          'Assumes a single funder with a single objective; a coalition or a pass-through would change every cell.',
          'Assumes the speech is issue advocacy; the express-advocacy branch is modelled but untested.',
          'Ignores state-level registration duties that a vendor might independently trigger.',
          'Treats "detectability" as legal exposure, not public discovery; the operation was in fact discovered in 48 hours.',
        ],
      },
      epochs: {
        hypothesis_span: {
          epochId: 'history:shell_hyp:hypotheses',
          startTime: IFR,
          endTime: PETITION,
          precision: TimePrecision.DAY,
          description: 'Vehicle choice was available across this whole window.',
        },
      },
    },

    {
      layerId: 'counterfactual_design',
      type: 'subjective',
      reality_correspondence: {
        to: 'analysis:texas_mailer_shell_hypothesis:2026',
        accuracy: 0.35,
        deviations: [
          'Specifies what a competent operator would have done instead — advice no one asked for.',
          'The better design is inferred, not observed; no document suggests it was considered.',
        ],
      },
      epochs: {
        design_span: {
          epochId: 'history:shell_hyp:design',
          startTime: FORMATION,
          endTime: DROP,
          precision: TimePrecision.DAY,
          description: 'Window in which the branding decision was necessarily made.',
        },
      },
    },
  ],

  temporalStructure: {
    segments: [
      { id: 'boi_suspended_frame', start: IFR, end: FINAL, type: 'legislation_active', status: 'active' },
      { id: 'boi_final_gap', start: FINAL, end: FORMATION, type: 'phase', status: 'active' },
      { id: 'formation', start: FORMATION, end: D(2026, 9, 20), type: 'phase', status: 'active' },
      { id: 'procurement', start: D(2026, 9, 20), end: DROP, type: 'phase', status: 'suspended' },
      { id: 'circulation', start: DROP, end: EXPOSURE, type: 'phase', status: 'active' },
      { id: 'exposure', start: EXPOSURE, end: PETITION, type: 'phase', status: 'active' },
      { id: 'proceedings', start: PETITION, end: D(2026, 11, 3), type: 'legal_period', status: 'inactive' },
    ],

    keyframes: [
      {
        id: 'boi_domestic_exemption_final',
        timestamp: FINAL,
        significance: 0.95,
        certainty: 1.0,
        tags: ['statute', 'fincen', 'anonymity', 'enables_hypothesis'],
        type: KeyframeType.LEGISLATION,
        description:
          'FinCEN final rule, effective 14 Aug 2026: domestic entities permanently exempt from beneficial-ownership reporting, previously reported US-person data to be deleted. Whatever else changed in 2026, the federal registry that would have named this LLC\'s owner is now empty by design.',
      },
      {
        id: 'wyoming_does_not_publish_members',
        timestamp: FORMATION,
        significance: 0.9,
        certainty: 0.9,
        tags: ['corporate', 'anonymity', 'state_law'],
        description:
          'Wyoming articles disclose a registered agent and a mailing address, not members or managers. With BOI gone, no public or federal record names a human being.',
      },
      {
        id: 'shell_filed_nineteen_days_after_rule',
        timestamp: FORMATION,
        significance: 0.5,
        certainty: 0.25,
        tags: ['timing', 'coincidence', 'caution'],
        description:
          'Nineteen days separate the final rule from the filing. Tagged LOW certainty on purpose: the interim rule had suspended domestic BOI since March 2025, so the information was old. Date proximity here is narrative temptation, not evidence.',
      },
      {
        id: 'vehicle_super_pac',
        timestamp: FORMATION,
        significance: 1.0,
        certainty: 0.95,
        tags: ['hypothesis', 'super_pac', 'worst_cell', 'disclosure'],
        type: KeyframeType.MILESTONE,
        description:
          'Super PAC accepting corporate money: legal and unlimited, and every donor above $200 who gave for independent expenditures is itemised. The vehicle is a public list. Adding a shell donor converts a disclosed gift into a §30122 violation, and the Committee must ask the LLC for its true source anyway. This cell is the hypothesis\'s collapse.',
      },
      {
        id: 'vehicle_shell_donor_to_pac',
        timestamp: FORMATION,
        significance: 0.95,
        certainty: 0.85,
        tags: ['hypothesis', 'straw_donor', 'unlawful'],
        type: KeyframeType.RULING,
        description:
          'A shell contributing to a committee is the straw-donor fact pattern by definition: name-of-another is prohibited for the giver, the permittor and the recipient alike. Costs more in exposure than it saves in anonymity, because the recipient is legally obliged to unmask it.',
      },
      {
        id: 'vehicle_c4',
        timestamp: FORMATION,
        significance: 0.85,
        certainty: 0.8,
        tags: ['hypothesis', '501c4', 'dark_money', 'partial'],
        description:
          'A 501(c)(4) is the genuine donor-anonymity vehicle — no public donor schedule, unlimited corporate receipts — but it must be primarily social welfare, and any independent expenditure over $250 is reported on Form 5, with donors who gave for that expenditure named. Anonymity covers the institution, not the activity.',
      },
      {
        id: 'vehicle_unregistered_llc_issue_advocacy',
        timestamp: FORMATION,
        significance: 1.0,
        certainty: 0.8,
        tags: ['hypothesis', 'issue_advocacy', 'no_filing', 'survives', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'The cell that survives: a for-profit LLC spending its own money on a guide that names no candidate. No committee registration, no Form 5 (no independent expenditure to report), no BOI report, no members published. The mailer\'s content — resources, hotlines, legal-aid pointers — carries no express advocacy, which is what keeps every disclosure trigger unfired.',
      },
      {
        id: 'vehicle_c3',
        timestamp: FORMATION,
        significance: 0.7,
        certainty: 0.9,
        tags: ['hypothesis', '501c3', 'prohibited'],
        description:
          'A 501(c)(3) is the one vehicle that is simply unavailable: campaign intervention is absolutely prohibited. The only charity in this story is a victim, not a vehicle — TENT says its name and materials were used without consent.',
      },
      {
        id: 'texas_corporate_expenditure',
        timestamp: FORMATION,
        significance: 0.9,
        certainty: 0.7,
        tags: ['legal', 'texas', 'corporate', 'express_advocacy'],
        type: KeyframeType.LEGISLATION,
        description:
          'Texas bars corporate political contributions not authorised by Chapter 253; the corporate expenditure prohibition was narrowed after Citizens United, as AO 527 records. So a corporation may spend independently — but the moment the piece becomes express advocacy it is political advertising, and Texas requires a disclosure statement on its face.',
      },
      {
        id: 'false_disclaimer',
        timestamp: DROP,
        significance: 1.0,
        certainty: 0.9,
        tags: ['analysis', 'key_finding', 'branding', 'self_defeating'],
        type: KeyframeType.PUBLICATION,
        description:
          'The mailer carries TENT\'s branding, links and event dates instead of a sponsor disclaimer. In disclosure terms a false attribution is worse than no attribution: it satisfies the form of a disclaimer while defrauding the reader, and it converts an unregulated anonymity play into misappropriation with a named victim — which is precisely what produced the Rule 202 petition and the forgery referral.',
      },
      {
        id: 'tax_dead_end',
        timestamp: FORMATION,
        significance: 0.8,
        certainty: 0.9,
        tags: ['analysis', 'tax', 'no_deduction'],
        description:
          'The shell cannot be a tax device either. Political advertising is not deductible under §162(e); an entity with no revenue gains nothing from a deduction except an NOL, which §461(l) caps (made permanent by P.L. 119-21). A shell is a poor taxpayer and a good letterhead — which is the whole distinction the hypothesis blurs.',
      },
      {
        id: 'hypothesis_verdict',
        timestamp: PETITION,
        significance: 0.95,
        certainty: 0.7,
        tags: ['analysis', 'conclusion', 'verdict'],
        description:
          'Verdict: the shell is a good start only if it is the spender. As a conduit to a super PAC it is the single worst structure available — disclosed by the recipient, unlawful under §30122, and no more anonymous than a cheque. What made this operation visible was not the shell but the stolen name.',
      },
    ],

    windows: { strategy: 'phase_based' },
  },

  metadata: {
    canonicalName: 'The Shell Hypothesis, Tested: shell corporations as vehicles for political advertising',
    creators: ['Compiled analysis; no author of record'],
    released: new Date('2026-10-26T00:00:00Z'),
    cultural_significance: 0.25,
    platform: 'Local Time universe system',
    externalId: 'texas_mailer_shell_hypothesis_2026',
    contentType: 'hypothesis test / vehicle comparison',
    hypothesisLedger: {
      H1_shell_as_conduit_to_super_pac: {
        claim: 'Route corporate money to a super PAC through an LLC.',
        status: 'FAILS',
        reason: 'Recipient must itemise donors over $200 and must obtain true-source information from LLC donors; concealment is itself the violation.',
      },
      H2_shell_as_spender_issue_advocacy: {
        claim: 'Unregistered LLC spends its own money on non-express advocacy.',
        status: 'SURVIVES',
        reason: 'No committee, no Form 5 absent an IE, no BOI report for a domestic entity, no published members in Wyoming.',
      },
      H3_shell_as_spender_express_advocacy: {
        claim: 'Same, but the piece advocates for or against a candidate.',
        status: 'FAILS ON FORM',
        reason: 'Texas requires a political advertising disclosure statement; a false sponsor line substitutes fraud for compliance.',
      },
      H4_c4_as_cover: {
        claim: 'Use a social welfare organization for donor anonymity.',
        status: 'PARTIAL',
        reason: 'Donors stay private, but IEs over $250 are reported with the donors behind them, and the primary-purpose test is a live constraint.',
      },
      H5_business_expensing_the_buy: {
        claim: 'A business funds it as advertising and deducts the cost.',
        status: 'FAILS',
        reason: '§162(e) bars deduction for political advertising; a shell with no revenue cannot use the loss, and §461(l) caps it anyway.',
      },
    },
    competitiveDesignNotes: [
      'A competent operator would not name the shell after the organisation it wishes to implicate. The name is the only artefact that created an adversary with standing.',
      'It would avoid co-opting verifiable branding, photographs, and event dates; each is a separate tort and each is independently checkable.',
      'It would not use a return address that does not resolve.',
      'It would not need a super PAC, a candidate, or an election — issue advocacy has no filing calendar at all.',
      'The one thing it would keep is the state: Wyoming discloses nothing and taxes nothing, so a Wyoming LLC costs roughly a hundred dollars and buys silence.',
    ],
    uncertaintyNotes: [
      'Express-advocacy characterisation is the pivot for the whole module and is a judgement call (0.7).',
      'Texas corporate-expenditure doctrine is stated with hedging; AO 527 is cited for the direction of travel, not for settled scope.',
      'No source in this module connects any super PAC, business, or committee to the mailing. The vehicle matrix is a comparison of legal forms, not a claim about who used them.',
      'The BOI-timing observation is deliberately down-weighted; do not promote it in a later revision without a document.',
      'Discovery of the operation in 48 hours falsifies any strong claim that this structure was "effective" — it was cheap, not safe.',
    ],
  },

  connections: {
    natural: {
      parentUniverses: [CommonUniverseIds.US_HISTORY, CommonUniverseIds.US_GOVERNMENT],
    },
    references: [
      {
        type: 'DERIVES_FROM',
        targetUniverseId: PAYER_LEDGER_ID,
        confidence: 1.0,
        description:
          'The money-trail reconstruction this hypothesis is tested against: the motive priors and the deliverable-artifact list are imported, then re-weighted.',
      },
      {
        type: 'DERIVES_FROM',
        targetUniverseId: DISCOVERY_ID,
        confidence: 1.0,
        description:
          'The reach channels are imported wholesale; this module asks which of them the shell hypothesis predicts would be empty.',
      },
    ],
  },
} as unknown as Universe;

/** All universes this draft owns. */
export const texasMailerShellHypothesisUniverses: Universe[] = [texasMailerShellHypothesisUniverse];
