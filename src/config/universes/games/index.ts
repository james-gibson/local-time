import { Universe } from '../../../core/types';
import { pokemonUniverses } from './pokemon';
import { diabloUniverses } from './diablo/diablo-series';

/**
 * The `games/` namespace barrel.
 *
 * A namespace is reached through one import, so the root barrel can spread
 * `...gamesUniverses` (never nest it — a nested array puts an array where a
 * universe belongs, james-gibson/local-time#68). `diablo/` is the first
 * sub-namespace collected here; `pokemon.ts` moves in with it so the namespace has
 * a single entry point.
 *
 * `monopoly.ts` is deliberately **absent**: its `toyStoryMonopolyNightUniverse` is
 * not reachable from `allUniverses` and never has been. Adding it to this barrel
 * without a decision about whether it *should* be registered would silently change
 * what the registry returns, so it is left out and filed as james-gibson/local-time#113
 * rather than fixed here.
 */
export const gamesUniverses: Universe[] = [...pokemonUniverses, ...diabloUniverses];

export { pokemonUniverses, diabloUniverses };
