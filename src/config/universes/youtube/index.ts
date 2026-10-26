import { Universe } from '../../../core/types';
import {
  beckMailClipUniverse,
  timWhitakerResponseUniverse,
} from './beck-responder-clocks';

/**
 * The `youtube/` namespace barrel.
 *
 * One pair of works that share a clock: a clip, the response video that plays it, and
 * the drift between their runtimes. The drift is not a universe — it is the *relation*
 * between these two — so it lives with them (see `beck-responder-clocks.ts` and
 * `src/utils/clock-drift.ts`).
 *
 * Spread into `allUniverses` — never nest it (#45, #68). There must be no `youtube.ts`
 * file alongside this directory (#67: a file wins over a directory and silently excludes
 * the whole subtree).
 */
export const youtubeUniverses: Universe[] = [
  beckMailClipUniverse,
  timWhitakerResponseUniverse,
];

export {
  beckMailClipUniverse,
  timWhitakerResponseUniverse,
  beckResponderAlignedEvents,
  beckResponderDrift,
  clipRuntimeOf,
  responseRuntimeOf,
  CLIP_PUBLICATION_INSTANT,
  RESPONSE_PUBLICATION_INSTANT,
  CLIP_RUNTIME_NS,
  RESPONSE_RUNTIME_NS,
} from './beck-responder-clocks';

export type { AlignedEvent } from './beck-responder-clocks';
