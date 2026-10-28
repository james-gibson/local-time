import { Universe } from '../../../core/types';
import {
  beckMailClipUniverse,
  timWhitakerResponseUniverse,
} from './beck-responder-clocks';
import { beckPamphletTranscriptUniverse } from './beck-pamphlet-transcript';
import { beckPamphletReadingUniverse } from './beck-pamphlet-reading';
import { texasPaulTtsuMailersUniverse } from './texas-paul-ttsu-mailers';
import { beckDoublespeakUniverse } from './beck-doublespeak';
import { dreyTheranosUniverse } from './drey-theranos';
import { cartoonPhysicsUniverse } from './cartoon-physics';

/**
 * The `youtube/` namespace barrel.
 *
 * One pair of works that share a clock — a clip, the response video that plays it, and
 * the drift between their runtimes — plus the transcription record for the passage the
 * response replays, a reading-order map of the pamphlet that passage reads aloud, the
 * doublespeak cut of that passage, one publication-anchored video
 * essay whose keyframes are absolute instants inside its own runtime, and one essay whose
 * five chapters and nineteen keyframes are measured offsets from its auto-caption track.
 * The drift is not a universe either: it is the *relation* between the two clocks, so it
 * lives with them (see `beck-responder-clocks.ts` and `src/utils/clock-drift.ts`), and the
 * transcript hangs off the pair because every line of it is addressed on one or both of
 * those clocks.
 *
 * Spread into `allUniverses` — never nest it (#45, #68). There must be no `youtube.ts`
 * file alongside this directory (#67: a file wins over a directory and silently excludes
 * the whole subtree).
 */
export const youtubeUniverses: Universe[] = [
  beckMailClipUniverse,
  timWhitakerResponseUniverse,
  beckPamphletTranscriptUniverse,
  beckPamphletReadingUniverse,
  beckDoublespeakUniverse,
  dreyTheranosUniverse,
  texasPaulTtsuMailersUniverse,
  cartoonPhysicsUniverse,
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

export { beckDoublespeakUniverse, beckDoublespeakUniverses } from './beck-doublespeak';

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

export {
  beckPamphletReadingUniverse,
  beckPamphletReadingUniverses,
  beckReadingBlocks,
  beckReadingSegments,
  beckReadingKeyframes,
  beckReadingCaptionArtifacts,
  beckReadingCorrections,
  beckReadingClaimInventory,
  BECK_PAMPHLET_READING_UNIVERSE_ID,
  BECK_READING_CLIP_ID,
  BECK_READING_DOCUMENT_ID,
  BECK_READING_EXCERPT_ID,
  BECK_READING_PARENT_ID,
} from './beck-pamphlet-reading';

export type {
  ReadingBlock,
  ReadingSegment,
  ReadingVoice,
  PrintedSlot,
} from './beck-pamphlet-reading';

export {
  dreyTheranosUniverse,
  dreyTheranosPeople,
  DREY_THERANOS_UNIVERSE_ID,
  DREY_THERANOS_PUBLISHED,
  DREY_THERANOS_RUNTIME_SECONDS,
  THESIS_CLAIM_CERTAINTY,
  thesisSignificance,
} from './drey-theranos';

export type { NamedSubject } from './drey-theranos';

export {
  texasPaulTtsuMailersUniverse,
  texasPaulTtsuMailersUniverses,
} from './texas-paul-ttsu-mailers';

export {
  cartoonPhysicsUniverse,
  cartoonPhysicsChapters,
  cartoonPhysicsCaptionArtifacts,
  cartoonPhysicsPresumedAnchors,
  CARTOON_PHYSICS_UNIVERSE_ID,
  CARTOON_PHYSICS_PUBLISHED,
  CARTOON_PHYSICS_RUNTIME_SECONDS,
} from './cartoon-physics';
