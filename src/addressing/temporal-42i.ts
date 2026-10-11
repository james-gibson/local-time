import { ZeroReferenceEpoch } from '../core/types';

/**
 * The 42i temporal lift.
 *
 * A relative address such as `founding:T+09:00:00` is a *label*, not a quantity.
 * The label is only equal to elapsed time when the timeline is literal. When it
 * is not — when the nominal "hour" is a fiction, or when there is no zeroth at
 * all — the gap between what the label says and what actually elapsed is not an
 * error to be corrected. It is information, and the only place to put it is a
 * second axis.
 *
 * The lift maps a keyframe to a point in the complex plane:
 *
 *   re      = timestamp − zeroPoint        anchored elapsed time (null if no zeroth)
 *   im      = nominal(address) − re        the part of the label that is not real
 *   tension = |im| / max(|re|, |im|, 1)    0 = literal, →1 = purely nominal
 *
 * and the epoch as a whole to a single number, the dilatation:
 *
 *   dilatation = realSpan / nominalSpan    ≈1 when the addresses mean what they say
 *
 * Nothing here is authoritative. The lift never rewrites an address; it reports
 * how far the address sits from anchored ground truth (an isotopical distance),
 * so two timelines from different precision regimes can be compared *honestly*
 * instead of silently. When one of them has no zeroth they are not commensurable
 * at all, and {@link Temporal42i.compare} says so rather than producing a number.
 *
 * @remarks
 * This mirrors the derivation performed offline by the lore pipeline
 * (`build-lore-json.js`) so that consumers of the library can reproduce it
 * without re-implementing it. It is deliberately pure: no I/O, no registry.
 */
export class Temporal42i {
  /**
   * Parse a nominal offset out of an epoch-relative address.
   *
   * Accepts the two shapes the KB actually uses:
   *   - `…:T+HH:MM:SS` (and an optional `.mmm`) — a precise label.
   *   - `…:T+<n>day(s)ish` / `…:T+<n>d` — a fuzzy label; the trailing `ish` is
   *     load-bearing and marks the offset as approximate.
   *
   * Returns `null` when the address carries no parseable offset (rather than
   * guessing zero), so callers can tell "no offset" from "offset of zero".
   */
  static parseNominalOffset(address: string): { ms: number; approximate: boolean } | null {
    if (!address) {
      return null;
    }

    const hms = address.match(/([+-])(\d{2,}):(\d{2}):(\d{2})(?:\.(\d{3}))?\s*$/);
    if (hms) {
      const sign = hms[1] === '-' ? -1 : 1;
      const ms =
        (Number(hms[2]) * 3600 + Number(hms[3]) * 60 + Number(hms[4])) * 1000 +
        Number(hms[5] ?? '0');
      return { ms: sign * ms, approximate: false };
    }

    const days = address.match(/([+-])(\d+(?:\.\d+)?)\s*(?:d|day|days)(ish)?\s*$/i);
    if (days) {
      const sign = days[1] === '-' ? -1 : 1;
      return {
        ms: sign * Math.round(Number(days[2]) * 86_400_000),
        approximate: Boolean(days[3]),
      };
    }

    return null;
  }

  /**
   * Adapt a {@link ZeroReferenceEpoch} into an anchor, resolving its status.
   *
   * A library epoch carries a `zeroPoint` but not a status; the status is a lore
   * concern. When absent, an epoch with a point is treated as `presumed` (a date
   * someone asserted but nobody anchored) and one without is `unestablished`.
   */
  static anchorFromEpoch(
    epoch: ZeroReferenceEpoch & { zeroStatus?: ZeroStatus },
    zeroStatus?: ZeroStatus
  ): ZeroAnchor42i {
    const status: ZeroStatus =
      zeroStatus ??
      epoch.zeroStatus ??
      (epoch.zeroPoint != null ? 'presumed' : 'unestablished');

    return {
      epochId: epoch.epochId,
      zeroEvent: epoch.zeroEvent,
      zeroStatus: status,
      zeroPoint: status === 'unestablished' ? null : epoch.zeroPoint,
    };
  }

  /**
   * Lift a single keyframe into the complex plane.
   *
   * With no zeroth the point has no real axis at all. With a zeroth but no
   * timestamp, the label is all there is: by default it stays imaginary (a label
   * is not elapsed time), but pass `literal: true` — as the `if-realized` branch
   * of {@link Temporal42i.decompose} does — to let the label stand in for elapsed
   * time. That switch is the whole point: the same address means two different
   * things depending on whether the epoch is literal.
   */
  static lift(
    input: Keyframe42iInput,
    anchor: ZeroAnchor42i,
    options: { literal?: boolean } = {}
  ): LiftedKeyframe42i {
    const nominal = input.address ? Temporal42i.parseNominalOffset(input.address) : null;
    const nominalMs = nominal ? nominal.ms : 0;
    const nominalNs = BigInt(nominalMs) * NS_PER_MS;
    const zeroPoint = anchor.zeroStatus === 'unestablished' ? null : anchor.zeroPoint;
    const { timestamp } = input;

    const imaginary = (): LiftedKeyframe42i => ({
      id: input.id ?? 'keyframe',
      address: input.address,
      zeroStatus: anchor.zeroStatus,
      nominalMs,
      realMs: null,
      re: null,
      im: nominalNs,
      tension: nominalMs === 0 ? 0 : 1,
      approximate: nominal ? nominal.approximate : false,
    });

    if (zeroPoint === null) {
      return imaginary();
    }

    if (timestamp === undefined) {
      if (!options.literal) {
        return imaginary();
      }
      return {
        id: input.id ?? 'keyframe',
        address: input.address,
        zeroStatus: anchor.zeroStatus,
        nominalMs,
        realMs: nominalMs,
        re: nominalNs,
        im: 0n,
        tension: 0,
        approximate: nominal ? nominal.approximate : false,
      };
    }

    const realNs = timestamp - zeroPoint;
    const imNs = nominalNs - realNs;
    const realMs = nsToMs(realNs);
    const imMs = nsToMs(imNs);

    return {
      id: input.id ?? 'keyframe',
      address: input.address,
      zeroStatus: anchor.zeroStatus,
      nominalMs,
      realMs,
      re: realNs,
      im: imNs,
      tension: Math.abs(imMs) / Math.max(Math.abs(realMs), Math.abs(imMs), 1),
      approximate: nominal ? nominal.approximate : false,
    };
  }

  /** Lift a set of keyframes against the same anchor. */
  static liftAll(
    inputs: Keyframe42iInput[],
    anchor: ZeroAnchor42i,
    options: { literal?: boolean } = {}
  ): LiftedKeyframe42i[] {
    return inputs.map((input) => Temporal42i.lift(input, anchor, options));
  }

  /**
   * Summarise a lifted epoch as a single condition.
   *
   * `dilatation` is the ratio of real span to nominal span: ≈1 for a literal
   * timeline, large for a nominal one whose labels have drifted away from the
   * clock. It is `null` when there is nothing to divide — no anchored points, or
   * no nominal span.
   */
  static condition(lifted: LiftedKeyframe42i[]): EpochCondition42i {
    if (lifted.length === 0) {
      return { nominalSpanMs: null, realSpanMs: null, dilatation: null, meanTension: null };
    }

    const nominalMs = lifted.map((k) => k.nominalMs);
    const nominalSpanMs = Math.max(...nominalMs) - Math.min(...nominalMs);

    const realMs = lifted
      .map((k) => k.realMs)
      .filter((ms): ms is number => ms !== null);
    const realSpanMs = realMs.length > 0 ? Math.max(...realMs) - Math.min(...realMs) : null;

    return {
      nominalSpanMs,
      realSpanMs,
      dilatation:
        realSpanMs !== null && nominalSpanMs > 0 ? realSpanMs / nominalSpanMs : null,
      meanTension: lifted.reduce((sum, k) => sum + k.tension, 0) / lifted.length,
    };
  }

  /**
   * Decompose a declaration into its branches — the choose-your-own-adventure
   * view of a timeline.
   *
   * An address only resolves to one point while its zeroth holds. When the
   * zeroth is `unestablished` — "starting when pork wings are real" — the
   * timeline forks: the as-declared path stays imaginary, and, if you can also
   * say *when* the zeroth would be realized, a counterfactual `if-realized` path
   * drops onto the real axis. Pass `realizedZeroPoint` to walk that second path.
   *
   * A keyframe without a real timestamp (e.g. the release date is unknown) is an
   * imaginary branch even under an established zeroth, because its only content
   * is its label.
   */
  static decompose(
    anchor: ZeroAnchor42i,
    inputs: Keyframe42iInput[],
    options: { realizedZeroPoint?: bigint; realizedStatus?: ZeroStatus } = {}
  ): TimelineBranch42i[] {
    const epoch = anchor.epochId ?? 'epoch';
    const branches: TimelineBranch42i[] = [];

    const declared = Temporal42i.liftAll(inputs, anchor);
    const anchored = declared.filter((k) => k.re !== null);
    const imaginary = declared.filter((k) => k.re === null);

    if (anchored.length > 0) {
      branches.push({
        label: `${epoch}:as-declared`,
        zeroStatus: anchor.zeroStatus,
        zeroPoint: anchor.zeroPoint,
        keyframes: anchored,
        condition: Temporal42i.condition(anchored),
      });
    }

    if (imaginary.length > 0) {
      branches.push({
        label: `${epoch}:imaginary`,
        zeroStatus: 'unestablished',
        zeroPoint: null,
        keyframes: imaginary,
        condition: Temporal42i.condition(imaginary),
      });
    }

    if (
      anchor.zeroStatus === 'unestablished' &&
      options.realizedZeroPoint !== undefined
    ) {
      const realized: ZeroAnchor42i = {
        ...anchor,
        zeroStatus: options.realizedStatus ?? 'presumed',
        zeroPoint: options.realizedZeroPoint,
      };
      const keyframes = Temporal42i.liftAll(inputs, realized, { literal: true });
      branches.push({
        label: `${epoch}:if-realized`,
        zeroStatus: realized.zeroStatus,
        zeroPoint: realized.zeroPoint,
        keyframes,
        condition: Temporal42i.condition(keyframes),
      });
    }

    return branches;
  }

  /**
   * Compare two lifted points.
   *
   * Two anchored points subtract into a number. As soon as one of them has no
   * real axis, the subtraction is meaningless and this returns a `branch`
   * verdict instead of inventing a distance — the honest answer to "how far
   * apart are the day pigs fly and a rocket launch?" is "they are not on the
   * same number line."
   */
  static compare(a: Point42i, b: Point42i): Comparison42i {
    if (a.re === null || b.re === null) {
      return {
        kind: 'branch',
        reason:
          'an unestablished zeroth has no real axis, so the two points are not commensurable',
        left: a.zeroStatus ?? 'unestablished',
        right: b.zeroStatus ?? 'unestablished',
      };
    }

    const dReMs = nsToMs(a.re - b.re);
    const dImMs = nsToMs(a.im - b.im);
    const distanceMs = Math.hypot(dReMs, dImMs);
    const scale = Math.max(
      1,
      Math.hypot(nsToMs(a.re), nsToMs(a.im)),
      Math.hypot(nsToMs(b.re), nsToMs(b.im))
    );

    return { kind: 'commensurable', distanceMs, tension: distanceMs / scale };
  }
}

/** How firmly a zeroth is held. `unestablished` means there is nothing to anchor to. */
export type ZeroStatus = 'established' | 'presumed' | 'unestablished';

/** An anchored (or deliberately unanchored) zeroth for the lift. */
export interface ZeroAnchor42i {
  epochId?: string;
  /** Human description of the zero event, e.g. "pork wings are real". */
  zeroEvent?: string;
  zeroStatus: ZeroStatus;
  /** Nanoseconds from the Unix epoch. `null` when there is no zeroth. */
  zeroPoint: bigint | null;
}

/** A keyframe as the lift consumes it: a label, a timestamp, or both. */
export interface Keyframe42iInput {
  id?: string;
  /** Epoch-relative label, e.g. `founding:T+09:00:00`, `pork-wings:T+1dayish`. */
  address?: string;
  /** Absolute time in nanoseconds from the Unix epoch. */
  timestamp?: bigint;
}

/** The phase of a point: all {@link Temporal42i.compare} needs, plus an optional status. */
export interface Point42i {
  re: bigint | null;
  im: bigint;
  zeroStatus?: ZeroStatus;
}

/** A point lifted into the 42i complex plane. */
export interface Phasor42i extends Point42i {
  /** Real axis: anchored elapsed time in nanoseconds, or `null` without a zeroth. */
  re: bigint | null;
  /** Imaginary axis: the part of the label that is not anchored, in nanoseconds. */
  im: bigint;
  /** 0 = the label is literal time; →1 = the label carries no literal time. */
  tension: number;
}

/** A lifted keyframe, keeping the label and real value it came from. */
export interface LiftedKeyframe42i extends Phasor42i {
  id: string;
  address?: string;
  zeroStatus: ZeroStatus;
  nominalMs: number;
  realMs: number | null;
  /** True when the label itself was approximate (e.g. a trailing `ish`). */
  approximate: boolean;
}

/** The epoch-level condition: how far the labels have drifted from the clock. */
export interface EpochCondition42i {
  nominalSpanMs: number | null;
  realSpanMs: number | null;
  /** Real milliseconds per nominal millisecond; ≈1 for a literal timeline. */
  dilatation: number | null;
  meanTension: number | null;
}

/** One path through the timeline decomposition. */
export interface TimelineBranch42i {
  label: string;
  zeroStatus: ZeroStatus;
  zeroPoint: bigint | null;
  keyframes: LiftedKeyframe42i[];
  condition: EpochCondition42i;
}

/** The verdict of comparing two lifted points. */
export type Comparison42i =
  | { kind: 'commensurable'; distanceMs: number; tension: number }
  | { kind: 'branch'; reason: string; left: ZeroStatus; right: ZeroStatus };

const NS_PER_MS = 1_000_000n;

function nsToMs(ns: bigint): number {
  return Number(ns / NS_PER_MS);
}
