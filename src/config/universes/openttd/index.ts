import { Universe } from '../../../core/types';
import { aaahogexUniverse } from './aaahogex-ai';
import { aiBattlesSeriesUniverse } from './ai-battles-series';
import { masterHellishAiVsCommunityUniverse } from './master-hellish-ai-vs-community';
import { masterHellishChannelUniverse } from './master-hellish-channel';
import { openTTDGameUniverse } from './openttd-game';
import { season12ConnectTheWorldUniverse } from './season-12-connect-the-world';
import { transportTycoonDeluxeUniverse } from './transport-tycoon-deluxe';

/**
 * The `openttd/` namespace barrel.
 *
 * OpenTTD works and the real entities they run on: Transport Tycoon Deluxe (the
 * 1995 game OpenTTD recreates), the OpenTTD game itself, the AAAhogEx AI script,
 * the Master Hellish channel container, its "OpenTTD AI Battles" series, the
 * Season 12 "Connect The World" community Let's Play, and the AI-vs-community
 * video essay.
 *
 * Spread into `allUniverses` — never nest it (#45, #68). There must be no
 * `openttd.ts` file alongside this directory (#67: a file wins over a directory
 * and silently excludes the whole subtree).
 */
export const openttdUniverses: Universe[] = [
  // The platform lineage: the 1995 game, the open-source recreation, and the AI.
  transportTycoonDeluxeUniverse,
  openTTDGameUniverse,
  aaahogexUniverse,
  // The channel and its works.
  masterHellishChannelUniverse,
  aiBattlesSeriesUniverse,
  season12ConnectTheWorldUniverse,
  masterHellishAiVsCommunityUniverse,
];

export {
  aaahogexUniverse,
  aiBattlesSeriesUniverse,
  masterHellishAiVsCommunityUniverse,
  masterHellishChannelUniverse,
  openTTDGameUniverse,
  season12ConnectTheWorldUniverse,
  transportTycoonDeluxeUniverse,
};
