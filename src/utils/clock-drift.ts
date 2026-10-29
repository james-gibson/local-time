import { TimePrecision } from '../core/types';

/**
 * Clock drift between two recordings of the same stretch of time.
 *
 * Two videos of one event are two clocks. A source clip played inside a response video
 * does not run at the responder's pace: the responder stops it to talk, and every stop
 * leaves a permanent offset between "1:19 into the clip" and "46:54 into the response".
 * Ten stops leave a drift of nearly six minutes, and the clip's own timestamps stop
 * being usable as the responder's timestamps long before the clip ends.
 *
 * This module makes that drift an object with arithmetic, so the two clocks can be
 * connected instead of cross-referenced by hand. The model is deliberately the simplest
 * one that is true of a paused playback:
 *
 *   derived = source + baseOffset + sum(duration of every pause that has started)
 *
 * A pause is a *point* on the source clock (playback stops at a frame, and resumes at
 * the same frame) and an *interval* on the derived clock (the responder keeps talking).
 * That asymmetry is the whole phenomenon: the source loses no time, the derived clock
 * gains it.
 *
 * What this deliberately is NOT: a general affine map. A `rate` field invites modelling
 * speed changes, and a speed change is not a pause — it would need a slope per segment
 * and would make `toSource` ambiguous wherever the derived clock is not strictly
 * increasing. Nothing in the corpus needs it yet; when it does, this is the file to
 * extend, and the algebra to extend is `DriftSegment`.
 *
 * Units are nanoseconds as `bigint`, the corpus convention (`TemporalEpoch.startTime`,
 * `TemporalKeyframe.timestamp`): the timestamps this maps between are those fields.
 *
 * See `src/config/universes/youtube/beck-responder-clocks.ts` for the worked instance:
 * a 11:03 clip played inside a 1:02:48 response, ten pauses, 333.39 s of drift.
 */
export interface ClockDrift {
  /** Universe id of the clock that is played. */
  sourceId: string;
  /** Universe id of the clock that plays it. */
  derivedId: string;
  /**
   * The offset that holds while the source is playing: where the source's zero lands on
   * the derived clock. Everything else is applied per pause.
   */
  baseOffset: bigint;
  /**
   * Stops, in ascending `at` order. A pause that has not started yet contributes nothing;
   * one that has contributes its whole duration.
   */
  pauses: readonly ClockDriftPause[];
  precision: TimePrecision;
  /**
   * How the numbers were obtained. A drift table is an *instrument reading*, not a
   * definition: two people aligning the same pair of videos by hand will differ by a
   * second or two, and the reader deserves to know which method produced these.
   */
  provenance?: string;
}

export interface ClockDriftPause {
  id: string;
  /** Position on the source clock at which playback stops, in source-runtime nanoseconds. */
  at: bigint;
  /** How long the source stands still, measured on the derived clock. */
  duration: bigint;
  /** What the derived clock was doing instead — an overlay, an ad, a channel switch. */
  cause: string;
  /**
   * Uncertainty on `at` and `duration` together. A pause recovered from two caption
   * tracks is good to about a second; a pause recovered from a cue sheet is exact.
   */
  tolerance?: bigint;
}

/** One stretch of the correspondence: either the source is moving, or it is stopped. */
export interface DriftSegment {
  id: string;
  kind: 'playback' | 'pause';
  sourceStart: bigint;
  sourceEnd: bigint;
  derivedStart: bigint;
  derivedEnd: bigint;
}

/** Offset applied to a source instant: `baseOffset` plus every pause already started. */
export function driftAt(drift: ClockDrift, sourceTime: bigint): bigint {
  let offset = drift.baseOffset;
  for (const pause of drift.pauses) {
    if (sourceTime > pause.at) offset += pause.duration;
  }
  return offset;
}

/**
 * Map an instant on the source clock to the derived clock.
 *
 * At exactly `pause.at` the result is the *first* instant of the pause: the source has
 * stopped, the derived clock has not yet spent the pause's duration. `toSource` of that
 * instant reports `insidePause: true`, which is the only self-consistent reading of a
 * point-valued source bound.
 */
export function toDerived(drift: ClockDrift, sourceTime: bigint): bigint {
  return sourceTime + driftAt(drift, sourceTime);
}

/**
 * Map an instant on the derived clock back to the source clock.
 *
 * An instant *inside* a pause has no distinct source instant — the source stood still
 * for all of it — so the result names the pause's source position and sets
 * `insidePause`. Callers that want a frame rather than a correspondence can treat that
 * as "the frame that was on screen", which is exactly what it is.
 */
export function toSource(
  drift: ClockDrift,
  derivedTime: bigint,
): { sourceTime: bigint; insidePause: boolean } {
  let consumed = drift.baseOffset;
  for (const pause of drift.pauses) {
    const pauseStart = pause.at + consumed;
    if (derivedTime < pauseStart) {
      return { sourceTime: derivedTime - consumed, insidePause: false };
    }
    if (derivedTime < pauseStart + pause.duration) {
      return { sourceTime: pause.at, insidePause: true };
    }
    consumed += pause.duration;
  }
  return { sourceTime: derivedTime - consumed, insidePause: false };
}

/** Total drift added by the pauses, i.e. the offset at any time after the last one. */
export function totalDrift(drift: ClockDrift): bigint {
  return drift.pauses.reduce((sum, pause) => sum + pause.duration, 0n);
}

/**
 * The correspondence as an ordered list of segments — the shape to persist, render, or
 * diff against a re-measurement. `sourceEnd` bounds the final playback segment; pass the
 * source's runtime so the list covers the whole recording rather than stopping at the
 * last pause.
 */
export function driftSegments(drift: ClockDrift, sourceEnd: bigint): DriftSegment[] {
  const segments: DriftSegment[] = [];
  let cursor = 0n;
  let offset = drift.baseOffset;

  for (const pause of drift.pauses) {
    if (pause.at > cursor) {
      segments.push({
        id: `${pause.id}:playback`,
        kind: 'playback',
        sourceStart: cursor,
        sourceEnd: pause.at,
        derivedStart: cursor + offset,
        derivedEnd: pause.at + offset,
      });
    }
    segments.push({
      id: `${pause.id}:pause`,
      kind: 'pause',
      sourceStart: pause.at,
      sourceEnd: pause.at,
      derivedStart: pause.at + offset,
      derivedEnd: pause.at + offset + pause.duration,
    });
    cursor = pause.at;
    offset += pause.duration;
  }

  if (sourceEnd > cursor) {
    segments.push({
      id: 'tail:playback',
      kind: 'playback',
      sourceStart: cursor,
      sourceEnd,
      derivedStart: cursor + offset,
      derivedEnd: sourceEnd + offset,
    });
  }

  return segments;
}

/**
 * Structural checks a drift table must pass before anyone trusts it with timestamps.
 *
 * Returns messages rather than throwing, so a definition module can assert them in a
 * test and a loader can report all faults at once. The checks are the ones whose absence
 * produces *plausible* wrong answers: an unsorted table silently misapplies pauses after
 * the out-of-order one, and a non-positive duration turns a stop into a rewind that
 * `toSource` will happily invert.
 */
export function validateClockDrift(drift: ClockDrift): string[] {
  const errors: string[] = [];

  if (drift.sourceId === drift.derivedId) {
    errors.push('Clock drift needs two clocks: sourceId and derivedId are the same.');
  }
  if (drift.pauses.length === 0) {
    errors.push(`Clock drift ${drift.sourceId} -> ${drift.derivedId} declares no pauses.`);
  }
  if (drift.baseOffset === undefined) {
    errors.push('Clock drift needs a baseOffset (where the source zero lands).');
  }

  let previous: ClockDriftPause | undefined;
  for (const pause of drift.pauses) {
    if (pause.at < 0n) {
      errors.push(`Pause "${pause.id}" starts before the source does (${pause.at}).`);
    }
    if (pause.duration <= 0n) {
      errors.push(`Pause "${pause.id}" has a non-positive duration (${pause.duration}).`);
    }
    if (!pause.cause) {
      errors.push(`Pause "${pause.id}" does not say what the derived clock was doing.`);
    }
    if (previous) {
      if (pause.at < previous.at) {
        errors.push(
          `Pauses are out of order: "${pause.id}" (${pause.at}) follows "${previous.id}" (${previous.at}).`,
        );
      } else if (pause.at === previous.at) {
        errors.push(`Pauses "${previous.id}" and "${pause.id}" stop at the same instant.`);
      }
    }
    previous = pause;
  }

  return errors;
}
