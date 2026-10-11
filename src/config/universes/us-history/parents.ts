import { UniverseId } from '../../../core/universe-ids';

/**
 * Parent / contextual universe IDs for the US-history collections.
 *
 * These mirror the relevant members of `CommonUniverseIds`
 * (src/core/common-universe-ids.ts). They are duplicated as literals here
 * because that module currently fails type-checking (local-time#11: several
 * constants are commented out but still referenced). Once #11 lands, replace
 * this shim with `import { CommonUniverseIds } from '../../../core/common-universe-ids'`
 * and use the constants directly.
 */
export const US_HISTORY = 'history:united_states:founded' as UniverseId;
export const US_GOVERNMENT = 'history:us_gov:founded' as UniverseId;
export const US_COPYRIGHT_LAW = 'legal-us_gov:copyright:law_evolution:1790' as UniverseId;
export const US_CONSTITUTION = 'legal-us_gov:constitution:constitutional_framework:1787' as UniverseId;
export const WORLD_HISTORY = 'history:world:*' as UniverseId;

/** Mirror of `CommonUniverseIds.getUSApplicableUniverses()`. */
export const US_APPLICABLE_UNIVERSES: UniverseId[] = [
  US_HISTORY,
  US_GOVERNMENT,
  US_COPYRIGHT_LAW,
  US_CONSTITUTION,
  WORLD_HISTORY,
];
