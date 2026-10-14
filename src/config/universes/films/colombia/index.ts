import {
  acrossTheUniverseCulturalEventsUniverse,
  acrossTheUniverse2007Universe,
} from './across-the-universe';

export * from './across-the-universe';

/**
 * The Columbia Pictures universes.
 *
 * `colombia/` was never re-exported by `../index`, so these two were unreachable in
 * addition to the subtree `films.ts` shadowed (james-gibson/local-time#67).
 */
export const colombiaFilmUniverses = [
  acrossTheUniverseCulturalEventsUniverse,
  acrossTheUniverse2007Universe,
];
