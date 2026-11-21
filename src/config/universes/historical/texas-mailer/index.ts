import { Universe } from '../../../../core/types';
import { texasMailerDiscoveryReachUniverses } from './texas-mailer-discovery-reach';
import { texasMailerSoloLimitUniverses } from './texas-mailer-solo-limit';
import { texasMailerPreferenceVectorUniverses } from './texas-mailer-preference-vector';
import { texasMailerDominatedChoiceUniverses } from './texas-mailer-dominated-choice';
import { texasMailerProductionValueUniverses } from './texas-mailer-production-value';
import { texasMailerAmbiguityTolerantFormUniverses } from './texas-mailer-ambiguity-tolerant-form';
import { texasMailerPayerLedgerUniverses } from './texas-mailer-payer-ledger';
import { texasMailerOperatorProfileUniverses } from './texas-mailer-operator-profile';
import { texasMailerStationarityDomicileUniverses } from './texas-mailer-stationarity-domicile';
import { texasMailerFivePostulatesUniverses } from './texas-mailer-five-postulates';
import { texasMailerShellHypothesisUniverses } from './texas-mailer-shell-hypothesis';
import { texasMailerAutomationStackUniverses } from './texas-mailer-automation-stack';
import { texasMailerProperTimelinesUniverses } from './texas-mailer-proper-timelines';
import { texasMailerKpiAndSignatureUniverses } from './texas-mailer-kpi-and-signature';
import { texasMailerResidueAndReachUniverses } from './texas-mailer-residue-and-reach';
import { texasMailerBeckPlaneUniverses } from './texas-mailer-beck-plane';
import { texasMailerTraceAndVendorUniverses } from './texas-mailer-trace-and-vendor';
import { texasMailerApiAndPriceUniverses } from './texas-mailer-api-and-price';
import { texasMailerExpertiseAxisUniverses } from './texas-mailer-expertise-axis';
import { texasMailerMcpThresholdUniverses } from './texas-mailer-mcp-threshold';

/**
 * The 2026 Texas mailer analysis family — james-gibson/local-time#200.
 *
 * Twenty `history:` universes landed as one set because each one's edges point at
 * another's ids: production_value corrects dominated_choice and preference_vector;
 * ambiguity_tolerant_form corrects both production_value and dominated_choice;
 * solo_limit and discovery_reach are superseded by the modules downstream of them. Land
 * half of the family and the other half's `corrects`/`supersedes` edges have nowhere to
 * land.
 *
 * The second tranche (#221) lands payer_ledger, operator_profile,
 * stationarity_domicile and five_postulates — the payer question and its method paper.
 * The third tranche lands shell_hypothesis, automation_stack, proper_timelines and
 * kpi_and_signature — the vehicle analysis, the production reading, the paired-timeline
 * method, and the postulate audit. Each references the ten above; the ten landed first
 * are what makes the later modules' `derives_from`/`corrects` edges resolvable rather
 * than withheld.
 *
 * The seventh sibling, `series:beck_pamphlet_doublespeak:2026`, is a `series:` work and
 * lives in the `youtube/` namespace with the two works it is cut from; it is registered
 * by `youtubeUniverses`, not here, so it is not spread twice (#45, #68).
 *
 * The last tranche lands the six modules the thread weighted most heavily and left
 * unwritten — residue_and_reach, beck_plane, trace_and_vendor, api_and_price,
 * expertise_axis, mcp_threshold — which closes the set at twenty. They arrive as real
 * edges rather than notes: every `threadSiblings` entry the earlier fourteen carried is
 * now a `references` edge to a module that exists, which is the whole reason the family
 * waits for a tranche instead of landing a module at a time.
 */
export const texasMailerUniverses: Universe[] = [
  ...texasMailerDiscoveryReachUniverses,
  ...texasMailerSoloLimitUniverses,
  ...texasMailerPreferenceVectorUniverses,
  ...texasMailerDominatedChoiceUniverses,
  ...texasMailerProductionValueUniverses,
  ...texasMailerAmbiguityTolerantFormUniverses,
  ...texasMailerPayerLedgerUniverses,
  ...texasMailerOperatorProfileUniverses,
  ...texasMailerStationarityDomicileUniverses,
  ...texasMailerFivePostulatesUniverses,
  ...texasMailerShellHypothesisUniverses,
  ...texasMailerAutomationStackUniverses,
  ...texasMailerProperTimelinesUniverses,
  ...texasMailerKpiAndSignatureUniverses,
  ...texasMailerResidueAndReachUniverses,
  ...texasMailerBeckPlaneUniverses,
  ...texasMailerTraceAndVendorUniverses,
  ...texasMailerApiAndPriceUniverses,
  ...texasMailerExpertiseAxisUniverses,
  ...texasMailerMcpThresholdUniverses,
];

export {
  texasMailerDiscoveryReachUniverse,
  texasMailerDiscoveryReachUniverses,
} from './texas-mailer-discovery-reach';
export {
  texasMailerSoloLimitUniverse,
  texasMailerSoloLimitUniverses,
} from './texas-mailer-solo-limit';
export {
  texasMailerPreferenceVectorUniverse,
  texasMailerPreferenceVectorUniverses,
} from './texas-mailer-preference-vector';
export {
  texasMailerDominatedChoiceUniverse,
  texasMailerDominatedChoiceUniverses,
} from './texas-mailer-dominated-choice';
export {
  texasMailerProductionValueUniverse,
  texasMailerProductionValueUniverses,
} from './texas-mailer-production-value';
export {
  texasMailerAmbiguityTolerantFormUniverse,
  texasMailerAmbiguityTolerantFormUniverses,
} from './texas-mailer-ambiguity-tolerant-form';

export {
  texasMailerPayerLedgerUniverse,
  texasMailerPayerLedgerUniverses,
} from './texas-mailer-payer-ledger';
export {
  texasMailerOperatorProfileUniverse,
  texasMailerOperatorProfileUniverses,
} from './texas-mailer-operator-profile';
export {
  texasMailerStationarityDomicileUniverse,
  texasMailerStationarityDomicileUniverses,
} from './texas-mailer-stationarity-domicile';
export {
  texasMailerFivePostulatesUniverse,
  texasMailerFivePostulatesUniverses,
} from './texas-mailer-five-postulates';
export {
  texasMailerShellHypothesisUniverse,
  texasMailerShellHypothesisUniverses,
} from './texas-mailer-shell-hypothesis';
export {
  texasMailerAutomationStackUniverse,
  texasMailerAutomationStackUniverses,
} from './texas-mailer-automation-stack';
export {
  texasMailerProperTimelinesUniverse,
  texasMailerProperTimelinesUniverses,
} from './texas-mailer-proper-timelines';
export {
  texasMailerKpiAndSignatureUniverse,
  texasMailerKpiAndSignatureUniverses,
} from './texas-mailer-kpi-and-signature';

export {
  texasMailerResidueAndReachUniverse,
  texasMailerResidueAndReachUniverses,
} from './texas-mailer-residue-and-reach';
export {
  texasMailerBeckPlaneUniverse,
  texasMailerBeckPlaneUniverses,
} from './texas-mailer-beck-plane';
export {
  texasMailerTraceAndVendorUniverse,
  texasMailerTraceAndVendorUniverses,
} from './texas-mailer-trace-and-vendor';
export {
  texasMailerApiAndPriceUniverse,
  texasMailerApiAndPriceUniverses,
} from './texas-mailer-api-and-price';
export {
  texasMailerExpertiseAxisUniverse,
  texasMailerExpertiseAxisUniverses,
} from './texas-mailer-expertise-axis';
export {
  texasMailerMcpThresholdUniverse,
  texasMailerMcpThresholdUniverses,
} from './texas-mailer-mcp-threshold';
