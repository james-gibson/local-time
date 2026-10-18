import { Universe } from '../../../core/types';
import {
  scotusOctoberTerm2013Universe,
  scotusOt2013OfficialDocketUniverse,
  scotusOt2013ShadowDocketUniverse,
} from './term';
import { scotusOt2013MeritsCases } from './merits';
import { scotusOt2013ShadowApplications } from './shadow';

/**
 * Every universe of the SCOTUS October Term 2013 subtree
 * (james-gibson/local-time#89): the term container, its two docket collections,
 * the merits cases and the shadow applications. Spread into `allUniverses` as an
 * array (never nested) — see §8.
 */
export const scotus2013Universes: Universe[] = [
  scotusOctoberTerm2013Universe,
  scotusOt2013OfficialDocketUniverse,
  scotusOt2013ShadowDocketUniverse,
  ...scotusOt2013MeritsCases,
  ...scotusOt2013ShadowApplications,
];

export * from './term';
export * from './merits';
export * from './shadow';
export { SCOTUS_TERM_ID, SCOTUS_MERITS_DOCKET_ID, SCOTUS_SHADOW_DOCKET_ID } from './shared';
