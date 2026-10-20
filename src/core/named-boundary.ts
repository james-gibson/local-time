import { TemporalEpoch, TimePrecision } from './types';

/**
 * A **common named epoch** — a dividing event that many universes locate
 * themselves against: *pre/post Enron*, *pre/post 9/11*.
 *
 * The boundary is one instant with one id. The two periods are **derived** from
 * it, not re-declared by each universe, so two universes cannot disagree about
 * when "post-9/11" began. They are deliberately **half-open**:
 *
 * - `before` has an `endTime` and no `startTime` — it claims only where the
 *   period ended;
 * - `after` has a `startTime` and no `endTime` — it claims only where it began.
 *
 * That shape is the point. A period derived from a single boundary cannot pick a
 * second, invented boundary at the other end (the beginning of history, or "now")
 * and call it part of the definition.
 *
 * `source` records the frame the instant was read from — the universe and
 * keyframe that *are* the boundary — so a test can assert the derivation still
 * points at a real event rather than a number someone typed twice.
 */
export interface NamedBoundary {
  /** Prefix for the derived epoch ids: `<idPrefix>:pre`, `<idPrefix>:post`. */
  idPrefix: string;
  /** Human-readable name used in the derived descriptions. */
  label: string;
  /** The dividing instant, in the corpus unit (bigint nanoseconds). */
  instant: bigint;
  /** The accuracy of the boundary claim. */
  precision: TimePrecision;
  /** The frame this instant was read from. */
  source?: {
    universeId: string;
    keyframeId: string;
  };
}

/** A derived epoch always has an id; `TemporalEpoch` makes it optional. */
export type NamedBoundaryEpoch = TemporalEpoch & { epochId: string };

/**
 * Derive the `pre`/`post` pair for a boundary.
 *
 * The ids are the labels: callers add the returned epochs under their
 * `epochId`, and tests can find them by name without knowing the date.
 */
export function beforeAfter(boundary: NamedBoundary): {
  before: NamedBoundaryEpoch;
  after: NamedBoundaryEpoch;
} {
  const where = boundary.source
    ? ` (${boundary.source.universeId}#${boundary.source.keyframeId})`
    : '';

  return {
    before: {
      epochId: `${boundary.idPrefix}:pre`,
      endTime: boundary.instant,
      precision: boundary.precision,
      description: `The period before ${boundary.label}${where}. Half-open: the boundary is its only claim.`,
    },
    after: {
      epochId: `${boundary.idPrefix}:post`,
      startTime: boundary.instant,
      precision: boundary.precision,
      description: `The period after ${boundary.label}${where}. Half-open: the boundary is its only claim.`,
    },
  };
}
