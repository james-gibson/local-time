export * from './gaza';
export * from './ukraine';

import { gazaConflict2023Universe } from './gaza';
import { ukraineWarOriginsUniverse } from './ukraine';

/**
 * Cross-border conflict and diplomacy.
 *
 * A namespace, not a container: the universes inside are historical events whose
 * membership is declared on the universe (`WORLD_HISTORY`, `COLD_WAR`), not by
 * the folder they live in. The barrel exists so `allUniverses` can spread one
 * symbol and the registration test has something to walk
 * (james-gibson/local-time#126).
 *
 * `us-politics/` is the sibling for domestic US authority; `nato-politics/` is
 * the third sub-notion and is created when its first universe lands, not as an
 * empty directory (the #112 §11.5 rule against invented containers).
 */
export const globalPoliticsUniverses = [
  gazaConflict2023Universe,
  ukraineWarOriginsUniverse,
];
