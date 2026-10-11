export * from './versionControlSystems.universe';

import { Universe } from '../../../core/types';
import {
  sccsUniverse,
  rcsUniverse,
  cvsUniverse,
  subversionUniverse,
  bitKeeperUniverse,
  gitUniverse,
  mercurialUniverse,
} from './versionControlSystems.universe';

/**
 * All universes derived from james-gibson/local-time#7 — the major version
 * control systems, in chronological order of introduction.
 */
export const versionControlUniverses: Universe[] = [
  sccsUniverse,
  rcsUniverse,
  cvsUniverse,
  subversionUniverse,
  bitKeeperUniverse,
  gitUniverse,
  mercurialUniverse,
];
