export * from './aumf';
export * from './fortress';

import { aumf2001UsageUniverse } from './aumf';
import { fortressProgram2026Universe } from './fortress';

/**
 * Domestic US political and legal authority.
 *
 * The counterpart to `global-politics/`: the AUMF is a US statute about when
 * force may be used abroad, and FORTRESS is a domestic military-installation
 * resilience program, so both belong to the American governance and defense
 * story rather than to the foreign conflicts they intersect. Memberships are
 * declared on the universe (`US_GOVERNMENT`, `US_MILITARY`), not by the
 * directory (james-gibson/local-time#126, #212).
 */
export const usPoliticsUniverses = [
  aumf2001UsageUniverse,
  fortressProgram2026Universe,
];
