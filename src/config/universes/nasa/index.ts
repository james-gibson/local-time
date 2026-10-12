export { challengerUniverse } from './challenger';
export { apollo13Universe } from './apollo13';
export { nasaNetwork } from './networks';

import { Universe } from '../../../core/types';
import { challengerUniverse } from './challenger';
import { apollo13Universe } from './apollo13';

/** All universes in the `nasa` network. */
export const nasaUniverses: Universe[] = [challengerUniverse, apollo13Universe];
