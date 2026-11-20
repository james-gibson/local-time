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
import { digitalCoupUniverse } from './digital-coup';
import { whiteBoomersUniverse } from './white-boomers';
import { manipulatorMathUniverse } from './manipulator-math';
import { talaricoNationalismUniverse } from './talarico-christian-nationalism';
import { soloBillionDollarUniverse } from './solo-billion-dollar-company';
import { fundamentalistConspiraciesUniverse } from './fundamentalist-conspiracies';
import { startYourOwnBusinessUniverse } from './start-your-own-business';
import { anchorWatchSeriesUniverse } from './anchor-watch';
import { anchorWatchHegseth20261026Universe } from './anchor-watch-2026-10-26';

/**
 * The `youtube/` namespace barrel.
 *
 * One pair of works that share a clock — a clip, the response video that plays it, and
 * the drift between their runtimes — plus the transcription record for the passage the
 * response replays, a reading-order map of the pamphlet that passage reads aloud, the
 * doublespeak cut of that passage, one publication-anchored video
 * essay whose keyframes are absolute instants inside its own runtime, and seven more works
 * whose chapters and keyframes are measured offsets on their own clocks: a ten-chapter TED
 * talk, an interview clip with eight editorial phases, a market-manipulation explainer
 * with six published chapters and a two-track cross-check, a sermon with eight editorial
 * phases whose only caption rendering is byte-identical under both requested track names,
 * a solopreneurship episode with ten published chapters whose two requested tracks are
 * again byte-identical, a fundamentalist-upbringing testimony with fourteen editorial
 * phases whose single rendering is likewise byte-identical, and a 79-minute developer-to-owner
 * playbook whose 25 published chapters and 94 cue-aligned beats ride the same single rendering.
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
  digitalCoupUniverse,
  whiteBoomersUniverse,
  manipulatorMathUniverse,
  talaricoNationalismUniverse,
  soloBillionDollarUniverse,
  fundamentalistConspiraciesUniverse,
  startYourOwnBusinessUniverse,
  anchorWatchSeriesUniverse,
  anchorWatchHegseth20261026Universe,
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

export {
  digitalCoupUniverse,
  digitalCoupChapters,
  digitalCoupCaptionArtifacts,
  DIGITAL_COUP_UNIVERSE_ID,
  DIGITAL_COUP_PUBLISHED,
  DIGITAL_COUP_RUNTIME_SECONDS,
} from './digital-coup';

export {
  whiteBoomersUniverse,
  whiteBoomersPhases,
  whiteBoomersCaptionArtifacts,
  WHITE_BOOMERS_UNIVERSE_ID,
  WHITE_BOOMERS_PUBLISHED,
  WHITE_BOOMERS_RUNTIME_SECONDS,
} from './white-boomers';

export {
  manipulatorMathUniverse,
  manipulatorMathChapters,
  manipulatorMathCaptionArtifacts,
  MANIPULATOR_MATH_UNIVERSE_ID,
  MANIPULATOR_MATH_PUBLISHED,
  MANIPULATOR_MATH_RUNTIME_SECONDS,
} from './manipulator-math';

export {
  talaricoNationalismUniverse,
  talaricoNationalismPhases,
  talaricoNationalismCaptionArtifacts,
  TALARICO_NATIONALISM_UNIVERSE_ID,
  TALARICO_NATIONALISM_PUBLISHED,
  TALARICO_NATIONALISM_RUNTIME_SECONDS,
} from './talarico-christian-nationalism';

export {
  soloBillionDollarUniverse,
  soloBillionDollarChapters,
  soloBillionDollarCaptionArtifacts,
  SOLO_BILLION_DOLLAR_UNIVERSE_ID,
  SOLO_BILLION_DOLLAR_PUBLISHED,
  SOLO_BILLION_DOLLAR_RUNTIME_SECONDS,
} from './solo-billion-dollar-company';

export {
  fundamentalistConspiraciesUniverse,
  fundamentalistConspiraciesPhases,
  fundamentalistConspiraciesCaptionArtifacts,
  FUNDAMENTALIST_CONSPIRACIES_UNIVERSE_ID,
  FUNDAMENTALIST_CONSPIRACIES_PUBLISHED,
  FUNDAMENTALIST_CONSPIRACIES_RUNTIME_SECONDS,
} from './fundamentalist-conspiracies';

export {
  startYourOwnBusinessUniverse,
  startYourOwnBusinessChapters,
  startYourOwnBusinessCaptionArtifacts,
  START_YOUR_OWN_BUSINESS_UNIVERSE_ID,
  START_YOUR_OWN_BUSINESS_PUBLISHED,
  START_YOUR_OWN_BUSINESS_RUNTIME_SECONDS,
} from './start-your-own-business';

export {
  anchorWatchSeriesUniverse,
  ANCHOR_WATCH_SERIES_ID,
} from './anchor-watch';

export {
  anchorWatchHegseth20261026Universe,
  anchorWatchPresumedAnchors,
  anchorWatchRealityAnchors,
  anchorWatchReferences,
  anchorWatchDiscussionPoints,
  anchorWatchSegments,
  anchorWatchKeyframes,
  ANCHOR_WATCH_EPISODE_ID,
  AIR_START_UTC_NS,
  RUNTIME_SECONDS,
} from './anchor-watch-2026-10-26';

export type { PresumedAnchor } from './anchor-watch-2026-10-26';
