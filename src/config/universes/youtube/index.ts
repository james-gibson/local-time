import { Universe } from '../../../core/types';
import {
  beckMailClipUniverse,
  timWhitakerResponseUniverse,
} from './beck-responder-clocks';
import { beckPamphletTranscriptUniverse } from './beck-pamphlet-transcript';

/**
 * The `youtube/` namespace barrel.
 *
 * One pair of works that share a clock — a clip, the response video that plays it, and
 * the drift between their runtimes — plus the transcription record for the passage the
 * response replays. The drift is not a universe either: it is the *relation* between the
 * two clocks, so it lives with them (see `beck-responder-clocks.ts` and
 * `src/utils/clock-drift.ts`), and the transcript hangs off the pair because every line
 * of it is addressed on one or both of those clocks.
 *
 * Spread into `allUniverses` — never nest it (#45, #68). There must be no `youtube.ts`
 * file alongside this directory (#67: a file wins over a directory and silently excludes
 * the whole subtree).
 */
export const youtubeUniverses: Universe[] = [
  beckMailClipUniverse,
  timWhitakerResponseUniverse,
  beckPamphletTranscriptUniverse,
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

export {
  beckPamphletTranscriptUniverse,
  beckAuditedPassage,
  beckAddressReadings,
  beckSpeakerAttribution,
  beckLaughterMarks,
  beckCaptionArtifacts,
  beckSecondaryFinding,
  deriveResponseSeconds,
} from './beck-pamphlet-transcript';

export type {
  TranscriptSpeaker,
  TranscriptUtterance,
  AddressReading,
} from './beck-pamphlet-transcript';
