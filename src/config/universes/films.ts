import {maryPoppinsUniverse} from './maryPoppinsUniverse';
import {savingPrivateRyanUniverse} from './savingPrivateRyanUniverse';
import {backToTheFutureUniverse} from './backToTheFutureUniverse';

import { starWarsUniverses } from "./films/star-wars"

export const filmUniverses = [
  // Spread, not nested. `starWarsUniverses` is an array, so this used to put an *array*
  // into `allUniverses[0]` instead of a universe. Found by an `allUniverses` invariant
  // test added for #45: `allUniverses.map(u => u.universeId)` yielded `undefined` for
  // element 0, which is not something a universe can be.
  ...starWarsUniverses,
  maryPoppinsUniverse,
  savingPrivateRyanUniverse,
  backToTheFutureUniverse
];

// MCP Integration for film universe generation
export { FILM_MCP_PROMPT } from '../mcp-prompts/film-prompt';
