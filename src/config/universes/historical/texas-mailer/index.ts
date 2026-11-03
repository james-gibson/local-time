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

/**
 * The 2026 Texas mailer analysis family — james-gibson/local-time#200.
 *
 * Fourteen `history:` universes landed as one set because each one's edges point at
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
 * What the family does *not* contain is the rest of the #200 thread (residue_and_reach,
 * beck_plane, trace_and_vendor, api_and_price, expertise_axis, mcp_threshold). None of
 * those is committed, so each module that would have referenced one records it in
 * `metadata.threadSiblings` instead — a reference to an id no module owns is not a link
 * the registry can resolve, and it would read as evidence of a module that is not there.
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
