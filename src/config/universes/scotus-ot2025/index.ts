import { Universe } from '../../../core/types';
import {
  scotusOctoberTerm2025Universe,
  scotusOt2025MeritsDocketUniverse,
  scotusOt2025ShadowDocketUniverse,
} from './term';
import { scotusOt2025MeritsCases } from './merits';
import { scotusOt2025ShadowApplications } from './shadow';

/**
 * Every universe of the SCOTUS October Term 2025 subtree (james-gibson/local-time#88):
 * the term container, its two docket collections, the merits cases and the shadow
 * applications. Spread into `allUniverses` as an array (never nested) — see §8.
 * Named `scotus2025Universes` (not the bare `scotusUniverses`) so it is symmetric
 * with the OT2013 subtree's `scotus2013Universes` and cannot collide with a future term.
 */
export const scotus2025Universes: Universe[] = [
  scotusOctoberTerm2025Universe,
  scotusOt2025MeritsDocketUniverse,
  scotusOt2025ShadowDocketUniverse,
  ...scotusOt2025MeritsCases,
  ...scotusOt2025ShadowApplications,
];

export * from './term';
export * from './merits';
export * from './shadow';
export { SCOTUS_TERM_ID, SCOTUS_MERITS_DOCKET_ID, SCOTUS_SHADOW_DOCKET_ID } from './shared';
