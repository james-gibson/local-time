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
 * `monopoly.ts` is deliberately **absent**, and deleted rather than merely left
 * out of this barrel. The test in `kagi.md` (§ Automatic Context Discovery) is
 * existence, not fictionality:
 *
 *   "Real content" means real events **and real works**. A fictional film is real
 *   content — a real work — and its fictionality is recorded in `realityRelation`,
 *   never hidden. Do not invent universes for content that does not exist.
 *
 * The deleted `toyStoryMonopolyNightUniverse` described a "fictional short that
 * could exist between the films" — no author, venue or publication — and attributed
 * it to Pixar with Disney/Pixar as copyright holders. The defect was that invented
 * existence and real-world attribution, not the fictional characters: a real,
 * published fan work is a real work and would be recordable. This was not one.
 * See james-gibson/local-time#113 and #142.
 *
 * Deleting the universe does not delete the connection. "The toys played Monopoly
 * and Woody held a real job in it" is not documented, but it is documentable: at the
 * 42i plane layer it is a *possible* claim (the required compendium — Toy Story — is
 * present, and the claim is anchored in it), so it takes a positive `tensor.w` in an
 * `out == 0` block, with charge -1 and `presupposes: [pixar:toy_story:1995]`. It is
 * not *unknown* (nothing required is missing) and not *really wrong* (no inverse
 * compendium is present). A universe is the wrong container for it; a fiction-plane
 * compendium is the right one. See `isotope/docs/lore-plane-mapping.md` §6.
 *
 * The constraint is scoped: "no fictional character in real attribution" bounds
 * `attribution.creators`, not the fiction plane or the connection. 42i's inverse is
 * keyframe-scoped for the same reason — a defeat is never a general negation.
 */
export const gamesUniverses: Universe[] = [...pokemonUniverses, ...diabloUniverses];

export { pokemonUniverses, diabloUniverses };
