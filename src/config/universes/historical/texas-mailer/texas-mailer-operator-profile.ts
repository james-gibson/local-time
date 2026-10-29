import {
  KeyframeType,
  TimePrecision,
  Universe,
  UniverseType,
} from '../../../../core/types';
import { CommonUniverseIds } from '../../../../core/common-universe-ids';
import { createHistoricalUniverseId } from '../../../../core/universe-ids';

/**
 * "The Operator Profile" — four discriminating hypotheses about who paid for the
 * October 2026 Texas mailers, each stated as a test with a stated falsifier.
 *
 * VERDICTS ENCODED HERE:
 *   H2 (no consultant would buy this)  -> CONFIRMED. The piece has no response
 *        mechanism, so it is unevaluable as persuasion; it clears no direct-mail
 *        benchmark by construction.
 *   H3 (advocacy groups source better, use in-state) -> HALF CONFIRMED, corrected.
 *        In-state Texas filing *names the owner* (certificate + annual PIR), so the
 *        Wyoming entity is diagnostic of concealment intent, not of amateurism.
 *        The asset theft is the stronger tell: only an outsider steals recognisable
 *        photographs from an organisation it does not know.
 *   H4 (if unrelated to the data-retention change, this predates it) -> REFUTED as
 *        causal, CONFIRMED as base rate. The genre predates the rule by years; and
 *        the *capability* predates it too, because domestic BOI existed only
 *        2024-01 to 2025-03. The Aug 2026 rule restored a status quo ante.
 *   H6 (new, survives) -> THE PROP HYPOTHESIS. The mailer was never a mailer; it was
 *        set dressing for photographs. Its success metric is screenshots, not
 *        mailboxes, and under that metric the design is near-optimal.
 *
 * WHAT DISCRIMINATES H6 FROM H4: recipient composition. A prop operation wants
 * recipients who will photograph — officials, clergy, school board members, known
 * posters. A persuasion or harassment operation wants a broad household sweep.
 * The list cannot be inspected, so this module ends undecided between them.
 *
 * Cultural Significance: 0.30 — analytic instrument, no independent weight.
 * Reality Relation: interpretation, fictionalizationDegree 0.75 — legal and
 * statistical frames documented; the profile is not a finding about any person.
 *
 * Research Sources:
 * - Direct-mail benchmarks: ANA/DMA via [^3][^15]; nonprofit house-file
 *   and acquisition rates [^21][^16]; CPA distribution [^2]
 * - Texas entity disclosure: certificate + PIR requirements [^4][^11][^5]
 * - Wyoming agent concentration, ~300,000 companies at one address [^14]
 * - Base rates: Florida ghost-candidate mailers [^6][^12][^10];
 *   Bennett / Dallas Express mailer spending [^7][^8][^1];
 *   false-flag as standing tactic [^17]
 * - Case facts carried forward: [^18][^19][^20][^9]
 * - BOI timing carried forward from the shell module [^c069a4][^e5d12e]
 *
 * Hierarchical Context: US_HISTORY -> US_GOVERNMENT. Derives from the payer-ledger
 * universe; the shell-hypothesis module it also builds on was drafted in #200 and is
 * still unlanded, so it is a threadSibling and an anchor rather than an edge. No
 * `contradicts` edges: earlier modules are revised, not contested.
 */

const UNIVERSE_ID = createHistoricalUniverseId(
  'texas_mailer_operator_profile',
  '2026',
);

const SHELL_HYP_ID = 'history:texas_mailer_shell_hypothesis:2026';
const PAYER_LEDGER_ID = 'history:texas_mailer_payer_ledger:2026';
const DISCOVERY_ID = 'history:texas_mailer_discovery_reach:2026';

/* Clock: UTC midnight; m is 1-based. */
const D = (y: number, m: number, d: number): bigint =>
  BigInt(Date.UTC(y, m - 1, d)) * 1_000_000n;

const BOI_START = D(2024, 1, 1);      // domestic BOI reporting begins
const BOI_SUSPENDED = D(2025, 3, 26); // interim rule: domestic entities out of scope
const BOI_FINAL = D(2026, 8, 14);     // permanent exemption + data deletion
const FORMATION = D(2026, 9, 2);
const DROP = D(2026, 10, 18);
const EXPOSURE = D(2026, 10, 20);
const PETITION = D(2026, 10, 22);

export const texasMailerOperatorProfileUniverse = {
  universeId: UNIVERSE_ID,
  type: UniverseType.HISTORICAL_EVENT,

  identifiers: {
    primary: 'history:texas_mailer_operator_profile:2026',
    aliases: [
      'who would actually pay for this mailer',
      'prop mailer hypothesis',
      'operator profile from design errors',
    ],
  },

  realityRelation: {
    type: 'interpretation',
    fictionalizationDegree: 0.75,

    realityAnchors: [
      {
        realEventId: 'history:texas_trans_student_mailer_controversy:2026',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'Mailer design: no candidate, no ask, no sponsor disclaimer, TENT branding [^20][^13]',
          'TENT denies involvement and alleges unauthorised use of its materials [^19]',
          'Wyoming LLC formed 2 Sept 2026; ~300,000 companies at one Sheridan address [^14]',
          'Both conservatives and liberals describe it as a false flag by their opponents [^18]',
        ],
      },
      {
        realEventId: 'analysis:texas_mailer_operator_profile:2026',
        relationshipType: 'reinterprets',
        confidence: 0.55,
        evidence: [
          'Profile inferred from design errors, not from testimony or documents',
          'H6 survives; H4 rejected causally; H2 and H3 partly confirmed',
          'Design-error inference is weak when the designer wanted to be caught being careless',
        ],
      },
      {
        realEventId: SHELL_HYP_ID,
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: ['Same vehicle analysis; this module asks who, not how'],
      },
      {
        realEventId: DISCOVERY_ID,
        relationshipType: 'documents',
        confidence: 0.9,
        evidence: [
          'Recipient composition is the discriminating variable and is only obtainable through the data-vendor channel modelled there',
        ],
      },
    ],
  },

  attribution: {
    public_domain: false,
    sources: [
      'ANA/DMA response benchmarks via [^3][^15]',
      'Nonprofit direct-mail rates [^21]; CPA distribution [^2]',
      'Texas PIR and certificate disclosure [^11][^5][^4]',
      'Florida ghost-candidate precedent [^6][^10]',
    ],
    citations_required: true,
    usage_restrictions: [
      'The profile is not an identification. No named party is implicated by this module.',
      'Response-rate benchmarks are commercial and fundraising offers; applying them to a CTA-less political mailer is an analogy, flagged as such.',
      'Cost-per-piece figures are planning ranges, not observed invoices.',
      'H6 is unfalsifiable without the recipient list; do not present it as the answer.',
    ],
  },

  layers: [
    {
      layerId: 'documented_design',
      type: 'primary',
      epochs: {
        design_window: {
          epochId: 'history:operator_profile:design',
          startTime: FORMATION,
          endTime: DROP,
          precision: TimePrecision.DAY,
          description:
            'Six weeks in which every design decision in the mailer was fixed: name, assets, list, absence of disclaimer.',
        },
        exposure_window: {
          epochId: 'history:operator_profile:exposure',
          startTime: DROP,
          endTime: PETITION,
          precision: TimePrecision.DAY,
          description: 'Four days from mailbox to petition.',
        },
      },
    },

    {
      layerId: 'benchmark_frame',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:direct_mail_benchmarks:2026',
        accuracy: 1.0,
        deviations: [
          'No deviation in the figures; the deviation is in their applicability — none of these benchmarks describes a mailer with no response mechanism.',
        ],
      },
      epochs: {
        benchmark_vintage: {
          epochId: 'history:operator_profile:benchmarks',
          startTime: D(2024, 1, 1),
          endTime: PETITION,
          precision: TimePrecision.DAY,
          description: 'ANA/DMA 2024 report and 2026 derivatives.',
        },
      },
    },

    {
      layerId: 'base_rate_frame',
      type: 'recreation',
      reality_correspondence: {
        to: 'analysis:anonymous_mailer_base_rate:2026',
        accuracy: 0.9,
        deviations: [
          'Precedents are drawn from reported cases; unprosecuted and unreported instances are invisible, so the measured base rate is a floor.',
        ],
      },
      epochs: {
        precedent_span: {
          epochId: 'history:operator_profile:precedents',
          startTime: D(2020, 1, 1),
          endTime: BOI_FINAL,
          precision: TimePrecision.YEAR,
          description:
            'Window over which comparable anonymity-funded mailer operations are documented, ending at the rule the correlation invokes.',
        },
      },
    },

    {
      layerId: 'profile_hypotheses',
      type: 'subjective',
      reality_correspondence: {
        to: 'analysis:texas_mailer_operator_profile:2026',
        accuracy: 0.35,
        deviations: [
          'Assumes the design errors were unintentional; a deliberate false flag would commit them on purpose.',
          'Assumes a single operator; a vendor acting for a client would produce a different error signature.',
          'Cannot distinguish insider-outsider from coastal-outsider; "not a Texas advocacy group" is the limit of the inference.',
        ],
      },
      epochs: {
        profile_span: {
          epochId: 'history:operator_profile:hypotheses',
          startTime: FORMATION,
          endTime: PETITION,
          precision: TimePrecision.DAY,
          description: 'Profile held across the operational and exposure windows.',
        },
      },
    },
  ],

  temporalStructure: {
    segments: [
      {
        // The base-rate epoch opens here in the layer below, and two keyframes sit inside
        // it. A segment partition that started at the BOI period would leave both before
        // the timeline it is supposed to explain.
        id: 'base_rate_precedents',
        start: D(2020, 1, 1),
        end: BOI_START,
        type: 'phase',
        status: 'active',
      },
      { id: 'boi_era_open', start: BOI_START, end: BOI_SUSPENDED, type: 'legislation_active', status: 'active' },
      { id: 'boi_suspended_gap', start: BOI_SUSPENDED, end: BOI_FINAL, type: 'legislation_active', status: 'active' },
      { id: 'rule_to_formation', start: BOI_FINAL, end: FORMATION, type: 'phase', status: 'active' },
      { id: 'design', start: FORMATION, end: D(2026, 9, 20), type: 'phase', status: 'active' },
      { id: 'procurement', start: D(2026, 9, 20), end: DROP, type: 'phase', status: 'suspended' },
      { id: 'circulation', start: DROP, end: EXPOSURE, type: 'phase', status: 'active' },
      { id: 'exposure', start: EXPOSURE, end: PETITION, type: 'phase', status: 'active' },
      { id: 'aftermath', start: PETITION, end: D(2026, 11, 3), type: 'legal_period', status: 'inactive' },
    ],

    keyframes: [
      /* ---------- H4: the base-rate test ---------- */
      {
        id: 'boi_window_was_brief',
        timestamp: BOI_START,
        significance: 1.0,
        certainty: 0.85,
        tags: ['analysis', 'H4', 'base_rate', 'key_finding', 'refutes_h4'],
        type: KeyframeType.LEGISLATION,
        description:
          'Domestic beneficial-ownership reporting ran from 1 Jan 2024 until the March 2025 interim rule suspended it for domestic entities — roughly fourteen months out of the last decade. Before 2024 a Wyoming LLC owed no federal ownership filing; the August 2026 final rule restored that earlier norm rather than creating a new capability [^c069a4][^e5d12e]. A 19-day gap therefore cannot mark a change in what was possible.',
      },
      {
        id: 'precedent_florida',
        timestamp: D(2020, 11, 3),
        significance: 0.95,
        certainty: 0.9,
        tags: ['analysis', 'H4', 'precedent', 'conduit'],
        description:
          'Florida 2020: committees paid for ghost-candidate mailers, with $100,000 moved into a dark-money nonprofit an operative controlled [^6][^10]; the funding nonprofit was itself controlled by consultants [^12]. Anonymous mailer money routed through layered entities, six years before the rule.',
      },
      {
        id: 'precedent_texas',
        timestamp: D(2021, 4, 1),
        significance: 0.85,
        certainty: 0.8,
        tags: ['analysis', 'H4', 'precedent', 'texas'],
        description:
          'Texas 2021: thousands spent on mailers backing a Highland Park school-board candidate [^7]; a nonprofit media outlet receiving $3.4M in donations [^8] later seeded an astroturf network [^1]. The vehicle of choice was a nonprofit, not an anonymous LLC — the disclosed form, because concealment did not depend on corporate form.',
      },
      {
        id: 'base_rate_is_a_floor',
        timestamp: BOI_FINAL,
        significance: 0.7,
        certainty: 0.8,
        tags: ['analysis', 'method', 'H4'],
        description:
          'Reported precedents undercount. Undetected operations leave no record, so every base-rate statement here is a floor — which cuts against H4 twice over: the true prior is higher, so the observed coincidence is less surprising.',
      },

      /* ---------- H2: the benchmark test ---------- */
      {
        id: 'no_response_mechanism',
        timestamp: DROP,
        significance: 1.0,
        certainty: 0.9,
        tags: ['analysis', 'H2', 'key_finding', 'unevaluable'],
        type: KeyframeType.MILESTONE,
        description:
          'The piece carries no candidate, no ask, no QR code, no URL of its own, no donation line, no sponsor disclaimer [^13][^20]. Without a response mechanism its response rate is undefined: it cannot be A/B tested, its ROI cannot be computed, and no consultant would sign a deliverable that cannot be evaluated. H2 confirmed on its own terms.',
      },
      {
        id: 'benchmark_cpa',
        timestamp: DROP,
        significance: 0.85,
        certainty: 0.8,
        tags: ['analysis', 'H2', 'benchmark', 'quantified'],
        description:
          'Direct mail only clears its benchmarks on tight lists: 66% of marketers hold acquisition under $150 [^2], prospect response averages 4.9% [^3], nonprofit acquisition 0.5-1.5% [^21]. At a planning cost near $1/piece and a near-random household list, cost per relevant household is orders of magnitude above any persuasion threshold.',
      },
      {
        id: 'list_is_category_not_person',
        timestamp: DROP,
        significance: 0.9,
        certainty: 0.85,
        tags: ['analysis', 'H2', 'H6', 'list'],
        description:
          'Addressed "Students Of The [Family] Family" — a household-level overlay, not a modelled audience. The relevant population is a low-single-digit share of households, so the mailing is efficient only if the objective is coverage of *screenshotters*, not conversion of parents.',
      },

      /* ---------- H3: the sourcing and jurisdiction tests ---------- */
      {
        id: 'texas_llc_names_owner',
        timestamp: FORMATION,
        significance: 0.95,
        certainty: 0.9,
        tags: ['analysis', 'H3', 'disclosure', 'correction'],
        type: KeyframeType.LEGISLATION,
        description:
          'Correction to H3: a Texas certificate of formation lists members publicly [^4], and every Texas entity files an annual Public Information Report naming each officer, director, member or manager [^11][^5]. An in-state LLC is a disclosure instrument. Legitimate advocacy groups use it because disclosure is not their problem; a concealment-motivated payer cannot.',
      },
      {
        id: 'asset_theft_is_an_outsider_error',
        timestamp: D(2026, 10, 10),
        significance: 0.95,
        certainty: 0.85,
        tags: ['analysis', 'H3', 'key_finding', 'outsider'],
        type: KeyframeType.MILESTONE,
        description:
          'TENT says its name, branding and photographs were used without consent [^19]. Stealing recognisable assets is the one error that guarantees detection by the victim, and no Texas advocacy group would make it: they would know the organisation, its staff, and which images circulate. The counterfeiter was outside the local network.',
      },
      {
        id: 'commodity_anonymity',
        timestamp: FORMATION,
        significance: 0.8,
        certainty: 0.9,
        tags: ['analysis', 'H3', 'tradecraft', 'commodity'],
        description:
          'Roughly 300,000 companies sit behind one Sheridan address [^14]: anonymity bought off the shelf, from a form, at a few hundred dollars. Neither bespoke tradecraft nor naive improvisation — the default choice of anyone who searches "anonymous LLC."',
      },

      /* ---------- H6: the survivor ---------- */
      {
        id: 'the_prop_hypothesis',
        timestamp: EXPOSURE,
        significance: 1.0,
        certainty: 0.55,
        tags: ['analysis', 'H6', 'survives', 'key_finding'],
        type: KeyframeType.MILESTONE,
        description:
          'H6: the mailer was set dressing. Every design choice that is irrational for persuasion is optimal for photography — a real organisation\'s branding so outrage has a target, a high-contrast name, no disclaimer to date-stamp the piece, wide household coverage so screenshots surface quickly. Within five days it produced national syndication and official comment. Judged by the metric its design implies, it was cheap and effective; judged by the metric H2 assumes, it was waste.',
      },
      {
        id: 'both_sides_claim_it',
        timestamp: EXPOSURE,
        significance: 0.75,
        certainty: 0.85,
        tags: ['analysis', 'H6', 'deniability'],
        description:
          'Conservatives and liberals each called it a false flag by the other [^18]. Ambiguity that survives four days of national coverage is the product a deniability play buys; a persuasion buy would want the ambiguity resolved.',
      },
      {
        id: 'undecided_recipient_test',
        timestamp: PETITION,
        significance: 0.9,
        certainty: 0.4,
        tags: ['analysis', 'H6', 'H4', 'falsifier', 'open'],
        description:
          'The discriminating test and the module\'s open end: if recipients cluster on officials, clergy, school-board members and known posters, H6 holds and H4 (harassment/persuasion) fails. If recipients are a broad modelled sweep of households with children, the reverse. Only the data-vendor channel in the discovery module can answer it, and that channel is unidentified.',
      },
      {
        id: 'profile_verdict',
        timestamp: PETITION,
        significance: 0.95,
        certainty: 0.6,
        tags: ['analysis', 'conclusion', 'profile'],
        description:
          'Convergent profile: an outsider to Texas advocacy, with concealment intent, buying commodity anonymity, optimising for screenshots. Consistent with a political operative running a false flag, or a lone amateur; inconsistent with an advocacy group, a consultancy running a persuasion buy, and a laundering vehicle — the last because the operation manufactured a DA and a civil petition, which is the opposite of what a financial concealment exercise wants.',
      },
    ],

    windows: { strategy: 'phase_based' },
  },

  metadata: {
    canonicalName: 'The Operator Profile: four hypotheses about the 2026 Texas mailer payer, tested',
    creators: ['Compiled analysis; no author of record'],
    released: new Date('2026-10-26T00:00:00Z'),
    cultural_significance: 0.3,
    platform: 'Local Time universe system',
    externalId: 'texas_mailer_operator_profile_2026',
    contentType: 'hypothesis test / base-rate analysis',
    hypothesisLedger: {
      H2_no_consultant_would_buy_this: {
        status: 'CONFIRMED',
        basis: 'No response mechanism; undefined response rate; near-random list against a low-prevalence audience.',
        residual: 'True only if the objective is persuasion. Under a screenshot objective the buy is efficient.',
      },
      H3_advocacy_groups_source_better_and_file_in_state: {
        status: 'HALF CONFIRMED, CORRECTED',
        basis: 'Asset theft is an outsider error; but in-state filing *discloses* the owner, so Wyoming is a concealment tell, not an amateur tell.',
        residual: 'Does not distinguish amateur from professional operator.',
      },
      H4_activity_predates_the_retention_change: {
        status: 'REFUTED (causal) / CONFIRMED (base rate)',
        basis: 'Precedents 2020-2021; and domestic BOI existed only 14 months, so the Aug 2026 rule restored the pre-2024 norm.',
        residual: 'The correlation survives only as evidence of the operator\'s information lag, not the law\'s effect.',
      },
      H6_the_prop_hypothesis: {
        status: 'SURVIVES',
        basis: 'Design is optimal for screenshots and irrational for mailboxes; national syndication within five days.',
        falsifier: 'Recipient composition — a broad household sweep would sink it in favour of harassment or persuasion.',
      },
    },
    baseRatePrecedents: [
      'FL 2020 ghost candidates: committee mailers via a dark-money nonprofit; $100k into an operative-controlled nonprofit [^6][^10]',
      'FL 2020-22: consulting firm Matrix controlled the funding nonprofit [^12]',
      'TX 2021: thousands on Highland Park school-board mailers [^7]',
      'TX 2024: $3.4M in donations to a nonprofit media outlet feeding an astroturf network [^8][^1]',
      'False flag as a standing election tactic, catalogued independently of any single cycle [^17]',
    ],
    benchmarkFigures: {
      'direct mail, all industries': '4.4% response [^15]',
      'prospect lists': '4.9% response [^3]',
      'nonprofit house file': '5-9% [^21]',
      'nonprofit acquisition': '0.5-1.5% [^21]',
      'CPA under $150': '66% of marketers [^2]',
      'this mailer': 'no response mechanism — rate undefined',
    },
    threadSiblings: [
      {
        id: SHELL_HYP_ID,
        note:
          'the vehicle analysis this module derives its population from; drafted in #200, ' +
          'still unlanded. Anchored in realityRelation, not referenced.',
      },
    ],
    uncertaintyNotes: [
      'Commercial and fundraising benchmarks are applied by analogy to a political mailer; the analogy favours H2 and is not proof.',
      'Cost-per-piece ranges are planning estimates, not invoices.',
      'Base rates from reported cases are floors; undetected operations are invisible.',
      'H6 is unfalsifiable without the recipient list and should not be promoted to a conclusion in a later revision.',
      'The profile stops at "not a Texas advocacy group"; it does not narrow to an individual, a firm, or a party.',
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
          'Same payer question, one level up: the ledger models the paperwork, this module ' +
          'asks who would generate it.',
      },
      {
        type: 'DOCUMENTS',
        targetUniverseId: DISCOVERY_ID,
        confidence: 0.9,
        description:
          'Recipient composition is the discriminating variable, and only the data-vendor ' +
          'channel modelled there can obtain it.',
      },
    ],
  },
} as unknown as Universe;

/** All universes this draft owns. */
export const texasMailerOperatorProfileUniverses: Universe[] = [texasMailerOperatorProfileUniverse];
