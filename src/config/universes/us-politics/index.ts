export * from './aumf';

import { aumf2001UsageUniverse } from './aumf';

/**
 * Domestic US political and legal authority.
 *
 * The counterpart to `global-politics/`: the AUMF is a US statute about when
 * force may be used abroad, so it belongs to the American war-powers story
 * rather than to the conflicts it authorises. Memberships are declared on the
 * universe (`US_GOVERNMENT`, `US_MILITARY`), not by the directory
 * (james-gibson/local-time#126).
 */
export const usPoliticsUniverses = [aumf2001UsageUniverse];
