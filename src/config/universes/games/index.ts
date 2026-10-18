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
 * `monopoly.ts` was deleted while resolving james-gibson/local-time#113. Its
 * `toyStoryMonopolyNightUniverse` was never reachable from `allUniverses`, and it
 * should not have been: it asserted a Pixar short that does not exist, with
 * fictional characters as its credited creators and Disney/Pixar as its
 * copyright holders. This library records *real works* and their reality
 * relation; an invented work is not a universe, and registering one would put a
 * false claim about a real company into the graph. The alternative in #113 —
 * register it — was rejected on that basis.
 */
export const gamesUniverses: Universe[] = [...pokemonUniverses, ...diabloUniverses];

export { pokemonUniverses, diabloUniverses };
