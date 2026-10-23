import { Universe } from '../../../core/types';
import { eightiesMovieTropesUniverse } from './eighties-movie-tropes';
import { eightiesTropeFilmUniverses } from './eighties-trope-films';

export * from './types';
export * from './eighties-movie-tropes';
export * from './eighties-trope-films';

/**
 * The tropes namespace.
 *
 * `universes/index.ts` spreads this array — never nests it — into
 * `allUniverses`: a nested array puts an array where a universe belongs and
 * `universeId` comes back `undefined` (james-gibson/local-time#45, #68).
 *
 * There is deliberately no `tropes.ts` beside this directory. A file shadows a
 * same-named directory, so the whole subtree would never load (#67), which is
 * how 28 film universes were defined and unreachable.
 *
 * Membership is not expressed here: the container is first, and each film
 * declares the container in `connections.natural.parentUniverses`, so this is a
 * *list of owners*, not a list of children (#74).
 */
export const tropesUniverses: Universe[] = [
  eightiesMovieTropesUniverse,
  ...eightiesTropeFilmUniverses,
];
