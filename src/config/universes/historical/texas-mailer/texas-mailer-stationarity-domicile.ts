import {
  KeyframeType,
  TimePrecision,
  Universe,
  UniverseType,
} from '../../../../core/types';
import { CommonUniverseIds } from '../../../../core/common-universe-ids';
import { createHistoricalUniverseId } from '../../../../core/universe-ids';

/**
 * "Stationarity and Domicile" — two corrections to the H4 analysis.
 *
 * CORRECTION 1 (accepted objection). The previous module refuted H4 on base rates:
 * activity of this type predates the 2026 rule, so the rule cannot be its cause.
 * That argument assumed a stationary propensity and is therefore invalid as stated.
 * A deterrent statute depresses the very base rate the argument measures, so the
 * absence of 2024-2025 precedent is equally consistent with the rule working.
 * H4-C below records the objection as VALID METHOD.
 *
 * CORRECTION 2 (the refutation that survives). H4 is refuted instead on DOSE.
 * Domestic beneficial-ownership reporting was enforceable for roughly 11 of the 32
 * months before the filing, was enjoined nationwide for much of the remainder, and
 * had already been suspended for 17 months when the LLC was formed. The final rule
 * changed nothing an operator could observe except the news. See dose_ledger.
 *
 * CORRECTION 3 (domicile). The hypothesis that Delaware offers better visibility
 * into corporate shielding inverts for LLCs: Delaware's certificate of formation has
 * no member field and its LLCs file no annual report. Delaware's visibility is
 * judicial (Chancery, §220), which requires a stockholder and a dispute. DExit is a
 * public-company movement and is not evidence about shell selection; it is evidence
 * about the operator's information channel.
 *
 * VERDICT: H4 remains REFUTED, but on new grounds. The non-stationarity objection is
 * upheld and the earlier justification is withdrawn rather than defended.
 *
 * Cultural Significance: 0.25 — methodological instrument.
 * Reality Relation: interpretation, fictionalizationDegree 0.4 — statutory record and
 * corporate-law reporting are documented; the dose weighting and the channel
 * inference are the compiler's.
 *
 * Research Sources:
 * - CTA effective date and NSBA injunction [^5][^6][^11]
 * - Top Cop Shop nationwide injunction [^16][^15]; appellate flip [^17][^18]
 * - Deadline reset to 21 Mar 2025 [^19]; IFR 26 Mar 2025 [^20][^7]
 * - Final rule 11/14 Aug 2026 [^12][^13][^3]
 * - Delaware LLC anonymity [^14][^21][^4][^8]; peer states [^1]
 * - DExit [^9][^22][^23][^10][^2]
 *
 * Hierarchical Context: US_HISTORY -> US_GOVERNMENT. Supersedes the H4 keyframe in
 * the operator-profile module, and says which keyframe; that analysis is revised
 * here, not contradicted — no `contradicts` edge, because an analysis correcting
 * itself is not litigation. The shell-hypothesis module it also cites is a
 * threadSibling: drafted in #200, still unlanded.
 */

const UNIVERSE_ID = createHistoricalUniverseId(
  'texas_mailer_stationarity_domicile',
  '2026',
);

const OPERATOR_PROFILE_ID = 'history:texas_mailer_operator_profile:2026';
const SHELL_HYP_ID = 'history:texas_mailer_shell_hypothesis:2026';
const DISCOVERY_ID = 'history:texas_mailer_discovery_reach:2026';

/* Clock: UTC midnight; m is 1-based. */
const D = (y: number, m: number, d: number): bigint =>
  BigInt(Date.UTC(y, m - 1, d)) * 1_000_000n;

const CTA_EFFECTIVE = D(2024, 1, 1);
const NSBA = D(2024, 3, 1);
const TOP_COP_SHOP = D(2024, 12, 3);
const FIFTH_CIRCUIT_FLIP = D(2024, 12, 23);
const FLIP_VACATED = D(2024, 12, 26);
const DEADLINE_RESET = D(2025, 3, 21);
const IFR = D(2025, 3, 26);
const FINAL_PUBLISHED = D(2026, 8, 14);
const FORMATION = D(2026, 9, 2);

export const texasMailerStationarityDomicileUniverse = {
  universeId: UNIVERSE_ID,
  type: UniverseType.HISTORICAL_EVENT,

  identifiers: {
    primary: 'history:texas_mailer_stationarity_domicile:2026',
    aliases: [
      'is the BOI rollback a plausible cause',
      'dose-response test of H4',
      'why not Delaware shell company',
    ],
  },

  realityRelation: {
    type: 'interpretation',
    fictionalizationDegree: 0.4,

    realityAnchors: [
      {
        realEventId: 'statute:corporate_transparency_act:2021',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'Effective 1 Jan 2024 [^5]',
          'Enjoined as to NSBA members 1 Mar 2024 [^6]',
          'Enjoined nationwide 3 Dec 2024 [^16]',
          'Domestic exemption by IFR 26 Mar 2025 [^20]',
          'Made permanent by final rule published 14 Aug 2026 [^13]',
        ],
      },
      {
        realEventId: OPERATOR_PROFILE_ID,
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'Revises that module\'s H4 keyframe: same verdict, different and weaker-to-attack grounds',
        ],
      },
      {
        realEventId: 'analysis:texas_mailer_dose_response:2026',
        relationshipType: 'reinterprets',
        confidence: 0.6,
        evidence: [
          'Dose weighting (11 enforceable months of 32) is the compiler\'s arithmetic, not an official figure',
          'Measurement of "enforceable" treats injunction coverage as binary, which it was not',
          'No evidence assembled on whether any operator was in fact deterred at any point',
        ],
      },
    ],
  },

  attribution: {
    public_domain: false,
    sources: [
      'FinCEN rulemakings 2024-2026 [^12][^20][^13]',
      'Litigation chronology [^6][^16][^17]',
      'Delaware LLC formation requirements [^14][^21]',
      'DExit reporting [^9][^22]',
    ],
    citations_required: true,
    usage_restrictions: [
      'This module withdraws an argument. Do not cite the earlier base-rate justification for H4; it is superseded here.',
      'Dose arithmetic is approximate and treats a messy litigation record as a binary timeline.',
      'No claim is made that the operator read any news coverage; the information-lag reading is inference.',
      'Delaware and Wyoming are compared only on LLC owner disclosure; the comparison is not a ranking of the states generally.',
    ],
  },

  layers: [
    {
      layerId: 'statutory_record',
      type: 'primary',
      epochs: {
        boi_live: {
          epochId: 'history:stationarity:live',
          startTime: CTA_EFFECTIVE,
          endTime: NSBA,
          precision: TimePrecision.DAY,
          description: 'Two months of general applicability before the first injunction.',
        },
        boi_litigated: {
          epochId: 'history:stationarity:litigated',
          startTime: NSBA,
          endTime: IFR,
          precision: TimePrecision.DAY,
          description:
            'Twelve months of oscillation: plaintiff-only carve-out, nationwide stay, appellate flip, brief revival.',
        },
        boi_suspended: {
          epochId: 'history:stationarity:suspended',
          startTime: IFR,
          endTime: FINAL_PUBLISHED,
          precision: TimePrecision.DAY,
          description:
            'Seventeen months with no domestic obligation — the window that decides the question.',
        },
        boi_permanently_over: {
          epochId: 'history:stationarity:over',
          startTime: FINAL_PUBLISHED,
          endTime: FORMATION,
          precision: TimePrecision.DAY,
          description: 'Nineteen days of confirmatory news, no operational change.',
        },
      },
    },

    {
      layerId: 'dose_ledger',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:texas_mailer_dose_response:2026',
        accuracy: 0.6,
        deviations: [
          'Treats injunction coverage as binary; in reality the obligation was live for most filers throughout 2024.',
          'Ignores that many 2024 formations complied voluntarily, which means the "treatment" did reach some actors.',
          'Assumes the deterrent acts on the decision to form, not on the decision to mail; the latter is unmeasured.',
          'Cannot observe any counterfactual: no register of suppressed operations exists, by definition.',
        ],
      },
      epochs: {
        dose_span: {
          epochId: 'history:stationarity:dose',
          startTime: CTA_EFFECTIVE,
          endTime: FORMATION,
          precision: TimePrecision.DAY,
          description: 'Thirty-two months over which dose is computed.',
        },
      },
    },

    {
      layerId: 'domicile_matrix',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:llc_owner_disclosure_by_state:2026',
        accuracy: 0.9,
        deviations: [
          'Covers owner disclosure only; says nothing about creditor protection, franchise tax burden, or case law.',
          'Corporation rules differ from LLC rules and are not modelled, though Delaware corporations must report directors for franchise tax purposes.',
        ],
      },
      epochs: {
        matrix_vintage: {
          epochId: 'history:stationarity:domicile',
          startTime: D(2026, 1, 1),
          endTime: FORMATION,
          precision: TimePrecision.YEAR,
          description: 'Rules as they stood at the formation decision.',
        },
      },
    },

    {
      layerId: 'hypothesis_space',
      type: 'subjective',
      reality_correspondence: {
        to: 'analysis:texas_mailer_operator_profile:2026',
        accuracy: 0.35,
        deviations: [
          'H7 (domicile as information channel) is inferred from market structure, not from any evidence about this operator.',
          'The non-stationarity objection is accepted as method but not as a rescue; the split is a judgement, not a computation.',
        ],
      },
      epochs: {
        revision_span: {
          epochId: 'history:stationarity:revision',
          startTime: FINAL_PUBLISHED,
          endTime: FORMATION,
          precision: TimePrecision.DAY,
          description: 'The nineteen days whose interpretation is at issue.',
        },
      },
    },
  ],

  temporalStructure: {
    segments: [
      { id: 'cta_general', start: CTA_EFFECTIVE, end: NSBA, type: 'legislation_active', status: 'active' },
      { id: 'cta_litigated', start: NSBA, end: TOP_COP_SHOP, type: 'legislation_active', status: 'active' },
      { id: 'nationwide_stay', start: TOP_COP_SHOP, end: FLIP_VACATED, type: 'legislation_active', status: 'suspended' },
      { id: 'oscillation', start: FLIP_VACATED, end: IFR, type: 'legislation_active', status: 'suspended' },
      { id: 'domestic_exempt', start: IFR, end: FINAL_PUBLISHED, type: 'legislation_active', status: 'active' },
      { id: 'final_rule_gap', start: FINAL_PUBLISHED, end: FORMATION, type: 'phase', status: 'active' },
      { id: 'formation', start: FORMATION, end: D(2026, 10, 18), type: 'phase', status: 'active' },
      { id: 'after_drop', start: D(2026, 10, 18), end: D(2026, 11, 3), type: 'legal_period', status: 'inactive' },
    ],

    keyframes: [
      /* ---------- the record that makes the dose argument possible ---------- */
      {
        id: 'nsba_plaintiff_only',
        timestamp: NSBA,
        significance: 0.85,
        certainty: 0.95,
        tags: ['statute', 'litigation', 'dose', 'carve_out'],
        type: KeyframeType.RULING,
        description:
          'N.D. Ala. holds the CTA unconstitutional and enjoins it as to the plaintiffs and NSBA members as of 1 Mar 2024 — a carve-out, not a suspension [^6][^11]. For everyone else the obligation continued, which is why 2024 is not a clean treatment period in either direction.',
      },
      {
        id: 'top_cop_shop_nationwide',
        timestamp: TOP_COP_SHOP,
        significance: 0.9,
        certainty: 0.95,
        tags: ['statute', 'litigation', 'dose', 'injunction'],
        type: KeyframeType.RULING,
        description:
          'Nationwide preliminary injunction; FinCEN suspends enforcement [^16][^15]. From here the rule binds nobody in practice, whatever the statute says.',
      },
      {
        id: 'appellate_flip_flop',
        timestamp: FIFTH_CIRCUIT_FLIP,
        significance: 0.7,
        certainty: 0.8,
        tags: ['statute', 'litigation', 'dose', 'oscillation'],
        type: KeyframeType.RULING,
        description:
          'Stay lifted 23 Dec, vacated 26 Dec, revived and again paused into 2025 [^17][^18]. Three days of enforceability in the middle of a holiday — the clearest illustration that the supposed deterrent barely existed as an operative rule.',
      },
      {
        id: 'deadline_reset',
        timestamp: DEADLINE_RESET,
        significance: 0.75,
        certainty: 0.9,
        tags: ['statute', 'deadline', 'dose'],
        description:
          'Compliance deadline set at 21 Mar 2025 for most companies [^19] — five days before the IFR removed the obligation entirely [^20]. The last serious enforcement date and the repeal are effectively the same week.',
      },
      {
        id: 'ifr_domestic_exemption',
        timestamp: IFR,
        significance: 1.0,
        certainty: 0.95,
        tags: ['statute', 'ifr', 'dose', 'key_finding'],
        type: KeyframeType.LEGISLATION,
        description:
          'Interim final rule published 26 Mar 2025 exempts domestic reporting companies and US-person beneficial owners, narrowing the CTA to foreign registrants [^20][^7]. This, not August 2026, is the date on which the obligation disappeared.',
      },
      {
        id: 'final_rule_confirms',
        timestamp: FINAL_PUBLISHED,
        significance: 1.0,
        certainty: 0.95,
        tags: ['statute', 'final_rule', 'no_operational_delta', 'key_finding'],
        type: KeyframeType.LEGISLATION,
        description:
          'Final rule issued 11 Aug 2026, published 14 Aug, effective on publication; adopts the IFR exemptions permanently and directs deletion of previously reported US-person data [^12][^13][^3]. Its entire operational content is durability: it removed no burden that had existed the previous month.',
      },
      {
        id: 'dose_arithmetic',
        timestamp: FORMATION,
        significance: 1.0,
        certainty: 0.7,
        tags: ['analysis', 'dose', 'key_finding', 'refutes_h4'],
        type: KeyframeType.MILESTONE,
        description:
          'Of the 32 months from CTA effectiveness to formation, roughly 11 had a generally applicable, enforceable obligation, 12 oscillated, and 17 had none. The final rule\'s marginal effect on capability was zero. A nineteen-day gap cannot be a capability response to a statute that changed nothing observable except the news — which leaves information lag, not causation, as the surviving reading.',
      },
      {
        id: 'discriminating_prediction',
        timestamp: FORMATION,
        significance: 0.9,
        certainty: 0.65,
        tags: ['analysis', 'falsifier', 'prediction', 'dose'],
        description:
          'A deterrence model predicts resurgence after March 2025, when relief arrived; a headline model predicts a bump after August 2026, when the news arrived. The observed timing fits the second. Any future cluster of similar filings in autumn 2026 — rather than spring 2025 — would further favour the information reading.',
      },

      /* ---------- the objection, recorded rather than dismissed ---------- */
      {
        id: 'h4c_nonstationarity_objection',
        timestamp: FORMATION,
        significance: 0.95,
        certainty: 0.85,
        tags: ['analysis', 'H4C', 'accepted', 'method'],
        type: KeyframeType.MILESTONE,
        description:
          'H4-C: if the 2024-25 reporting regime deterred this conduct, the observed base rate for that period is depressed by the treatment, and the absence of precedent is evidence for the rule\'s effect rather than against it. The objection is valid and the earlier base-rate refutation is withdrawn. Note what it does not do: it rescues the counterfactual, not the timing, because the treatment had ended 17 months before the event.',
      },

      /* ---------- domicile ---------- */
      {
        id: 'delaware_llc_is_anonymous',
        timestamp: FORMATION,
        significance: 0.95,
        certainty: 0.9,
        tags: ['domicile', 'delaware', 'disclosure', 'correction'],
        type: KeyframeType.LEGISLATION,
        description:
          'Delaware\'s certificate of formation requires only a name and a registered agent; there is no member or manager field and the Division does not collect owner data [^14][^21]. Delaware LLCs file no annual report, only a flat $300 tax [^8], and the public search returns name, file number, date and agent [^4]. For LLCs, Delaware is a privacy jurisdiction, not a visibility one [^1].',
      },
      {
        id: 'delaware_visibility_is_judicial',
        timestamp: FORMATION,
        significance: 0.85,
        certainty: 0.8,
        tags: ['domicile', 'delaware', 'chancery', 'correction'],
        type: KeyframeType.MILESTONE,
        description:
          'What Delaware actually sells is adjudication: a specialised Chancery docket and statutory books-and-records access. Both require a stockholder and a controversy. A single-member shell with no stockholders and no counterparty cannot use either, so the visibility advantage is unavailable to exactly the actor it was proposed to deter.',
      },
      {
        id: 'dexit_is_a_public_company_movement',
        timestamp: D(2026, 3, 31),
        significance: 0.8,
        certainty: 0.9,
        tags: ['domicile', 'dexit', 'irrelevance', 'channel'],
        description:
          'DExit runs on fiduciary doctrine and controlling-shareholder litigation: 18 proposed departures in 2025, 13 to Nevada, 2 to Texas [^9]; pace unbroken after SB 21 [^22]; ExxonMobil to Texas announced March 2026 [^23]; aggregate market cap past $2.5T with Texas near 40% and Nevada near 35% [^10]. None of that reasoning applies to a zero-revenue shell — which is the tell: the movement is not about anonymity at all.',
      },
      {
        id: 'domicile_as_information_channel',
        timestamp: FORMATION,
        significance: 0.9,
        certainty: 0.55,
        tags: ['analysis', 'H7', 'channel', 'channel_tell'],
        type: KeyframeType.MILESTONE,
        description:
          'H7: jurisdiction choice reveals how the operator shopped. Delaware and Nevada are recommended by counsel to companies with shareholders; Wyoming and New Mexico are sold by registered-agent marketing to anyone with a search bar, at a few hundred dollars. Selecting Wyoming is consistent with an operator who searched rather than consulted — which is the same profile as the nineteen-day news lag, and the same profile as stealing recognisable assets from an organisation they did not know.',
      },
      {
        id: 'texas_discloses_which_is_why_not',
        timestamp: FORMATION,
        significance: 0.85,
        certainty: 0.85,
        tags: ['domicile', 'texas', 'disclosure'],
        type: KeyframeType.LEGISLATION,
        description:
          'The one jurisdiction that would have named a human being is the one not used: Texas certificates list members and every entity files an annual Public Information Report naming members, managers and officers [^4a2d90][^d1bf53][^4170c2]. The avoidance of Texas is the strongest single piece of evidence for concealment intent, and it is stronger than the preference for Wyoming.',
      },
      {
        id: 'revision_verdict',
        timestamp: FORMATION,
        significance: 0.95,
        certainty: 0.7,
        tags: ['analysis', 'conclusion', 'revision'],
        description:
          'Final position: H4 refuted on dose, not on base rates. H4-C upheld as method and recorded as an unresolved residual — a small deterrent effect cannot be excluded. The domicile objection is corrected: Delaware offers no visibility advantage to an LLC, and the DExit movement is irrelevant except as a marker of the operator\'s information channel.',
      },
    ],

    windows: { strategy: 'phase_based' },
  },

  metadata: {
    canonicalName: 'Stationarity and Domicile: correcting the H4 refutation and the Delaware premise',
    creators: ['Compiled analysis; no author of record'],
    released: new Date('2026-10-26T00:00:00Z'),
    cultural_significance: 0.25,
    platform: 'Local Time universe system',
    externalId: 'texas_mailer_stationarity_domicile_2026',
    contentType: 'methodological revision / jurisdiction comparison',
    hypothesisLedger: {
      'H4_causal_boi_trigger': {
        status: 'REFUTED (revised grounds)',
        formerGrounds: 'Stationary base rate — WITHDRAWN as invalid',
        currentGrounds: 'Dose: 11 enforceable months of 32; 17 months of zero obligation before formation; final rule had no operational delta',
        residual: 'A small deterrent effect on 2024-25 conduct cannot be excluded',
      },
      'H4C_nonstationarity_objection': {
        status: 'UPHELD AS METHOD',
        effect: 'Invalidates the base-rate refutation; does not restore the causal claim',
        why: 'The treatment ended 17 months before the event, so the counterfactual cannot explain the timing',
      },
      'H7_domicile_as_channel': {
        status: 'OPEN, WEAKLY SUPPORTED',
        basis: 'Wyoming/New Mexico are mass-market products; Delaware and Nevada are counsel-recommended',
        falsifier: 'Evidence of retained counsel, or a filing agent with a corporate practice, would sink it',
      },
    },
    doseLedger: {
      'months_from_CTA_to_formation': 32,
      'months_generally_enforceable': 11,
      'months_oscillating_or_enjoined': 12,
      'months_no_domestic_obligation': 17,
      'marginal_effect_of_final_rule_on_capability': 'zero',
      'marginal_effect_of_final_rule_on_information': 'high — the only channel left',
    },
    jurisdictionMatrix: {
      Texas: 'Members on certificate; annual PIR names members/managers/officers [^4a2d90][^d1bf53]',
      Delaware: 'No member field; no annual report; flat $300 tax; agent public [^14][^8]',
      Wyoming: 'No member names; agent public [^1]',
      'New Mexico': 'No member names [^1]',
      Nevada: 'Alternative domicile promoted by 2025 amendments [^9]',
    },
    threadSiblings: [
      {
        id: SHELL_HYP_ID,
        note:
          'the shell-hypothesis module the BOI chronology is carried from; drafted in #200, ' +
          'still unlanded. Carried in the anchor, not as an edge.',
      },
    ],
    uncertaintyNotes: [
      'Dose arithmetic treats a messy litigation record as a binary timeline; the true exposure was partial throughout 2024.',
      'The H4-C residual is genuine and should not be closed by assertion in a later revision.',
      'H7 is inference from market structure at 0.55 and should never be promoted above the operator profile\'s own 0.6 ceiling.',
      'Delaware corporations differ from Delaware LLCs on director reporting; only the LLC case is modelled.',
      'No evidence exists that any operator altered conduct in response to any BOI development, in either direction.',
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
        confidence: 1.0,
        description:
          'The H4 analysis this module revises. Same verdict, different and weaker-to-attack ' +
          'grounds: dose rather than base rates.',
      },
      {
        type: 'SUPERSEDES',
        targetUniverseId: OPERATOR_PROFILE_ID,
        targetKeyframeId: 'boi_window_was_brief',
        confidence: 0.95,
        description:
          'Withdraws the base-rate refutation carried by that keyframe. The non-stationarity ' +
          'objection is accepted as method; H4 survives refuted on dose instead.',
        evidence: [
          'Domestic reporting was enforceable for roughly 11 of the 32 months before formation',
          'It had been suspended for 17 months when the LLC was formed',
        ],
      },
      {
        type: 'DOCUMENTS',
        targetUniverseId: DISCOVERY_ID,
        confidence: 0.8,
        description:
          'The residual-BOI-entity test is a Wyoming records search, which is the channel ' +
          'that module prices.',
      },
    ],
  },
} as unknown as Universe;

/** All universes this draft owns. */
export const texasMailerStationarityDomicileUniverses: Universe[] = [texasMailerStationarityDomicileUniverse];
