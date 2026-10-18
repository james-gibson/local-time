import { maryPoppinsUniverse } from '../maryPoppinsUniverse';
import { savingPrivateRyanUniverse } from '../savingPrivateRyanUniverse';
import { backToTheFutureUniverse } from '../backToTheFutureUniverse';
import { marvelFilmUniverses } from './marvel';
import { dieHard1988Universe } from './die-hard';
import { starWarsUniverses } from './star-wars';
import { twentiethCenturyFoxMajorReleases } from './20th';
import { colombiaFilmUniverses } from './colombia';
import { warcraftFilmUniverse } from './warcraft';
import { dungeonsAndDragonsHonorAmongThievesUniverse } from './dungeons-and-dragons-honor-among-thieves';

export * from './20th';
export * from './marvel';
export * from './die-hard';
export * from './star-wars';
export * from './colombia';
export * from './warcraft';
export * from './dungeons-and-dragons-honor-among-thieves';

/**
 * # The film namespace
 *
 * `./films` used to be *two* modules — `films.ts` and `films/index.ts` — and TypeScript
 * resolves a file before a directory of the same name, so `import { filmUniverses } from
 * './films'` loaded `films.ts` and this subtree never executed. 28 universes were defined
 * and unreachable (james-gibson/local-time#67). This is now the single module.
 *
 * Two former members of the subtree are deliberately absent, because their ids are owned
 * by another collection and registering them here would put duplicate ids in
 * `allUniverses`:
 *
 * - the three `pixar:toy_story*` universes — registered by `../../pixar`; their plot
 *   keyframes were folded onto those universes, and `./toy-story.ts` was removed;
 * - `20th_century_fox:titanic:1997` and `…:avatar:2009` — registered by the James Cameron
 *   filmography (`../../people/james-cameron`); their runtime keyframes were folded onto
 *   those universes and the duplicates removed from `./20th/releases`.
 *
 * Both are *views* of one universe, not competing universes: the same film seen by a
 * studio collection and by a filmography. `allUniverses` cannot express that because it is
 * flat with a unique id. The vocabulary to do it already exists — the
 * `connections.natural.parentUniverses` declarations, `CommonUniverseIds.contains`, and
 * the unused `TemporalLayer.subuniverses` field — so folding the keyframes is a
 * workaround, not the model. See james-gibson/local-time#74.
 */
export const filmUniverses = [
  ...starWarsUniverses,
  maryPoppinsUniverse,
  savingPrivateRyanUniverse,
  backToTheFutureUniverse,
  ...marvelFilmUniverses,
  dieHard1988Universe,
  ...twentiethCenturyFoxMajorReleases,
  ...colombiaFilmUniverses,
  warcraftFilmUniverse,
  dungeonsAndDragonsHonorAmongThievesUniverse,
];

// MCP Integration for film universe generation
export { FILM_MCP_PROMPT } from '../../mcp-prompts/film-prompt';
