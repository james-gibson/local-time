import {maryPoppinsUniverse} from './maryPoppinsUniverse';
import {savingPrivateRyanUniverse} from './savingPrivateRyanUniverse';
import {backToTheFutureUniverse} from './backToTheFutureUniverse';

import { starWarsUniverses } from "./films/star-wars"

export const filmUniverses = [
  starWarsUniverses,
  maryPoppinsUniverse,
  savingPrivateRyanUniverse,
  backToTheFutureUniverse
];

// MCP Integration for film universe generation
export { FILM_MCP_PROMPT } from '../mcp-prompts/film-prompt';
