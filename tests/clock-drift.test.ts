import { TimePrecision } from '../src/core/types';
import {
  ClockDrift,
  driftAt,
  driftSegments,
  toDerived,
  toSource,
  totalDrift,
  validateClockDrift,
} from '../src/utils/clock-drift';

const SEC = 1_000_000_000n;

/**
 * A minimal, hand-checkable drift: playback starts 100 s into the derived clock, and the
 * source is stopped twice — for 10 s at 20 s in, and for 30 s at 50 s in.
 */
const drift: ClockDrift = {
  sourceId: 'series:source:2026',
  derivedId: 'series:derived:2026',
  baseOffset: 100n * SEC,
  pauses: [
    { id: 'p1', at: 20n * SEC, duration: 10n * SEC, cause: 'overlay one' },
    { id: 'p2', at: 50n * SEC, duration: 30n * SEC, cause: 'overlay two' },
  ],
  precision: TimePrecision.SECOND,
};

describe('clock drift', () => {
  it('applies the base offset before anything has been paused', () => {
    expect(driftAt(drift, 0n)).toBe(100n * SEC);
    expect(toDerived(drift, 5n * SEC)).toBe(105n * SEC);
  });

  it('applies a pause only once the source has reached it', () => {
    expect(driftAt(drift, 20n * SEC)).toBe(100n * SEC);
    expect(driftAt(drift, 21n * SEC)).toBe(110n * SEC);
    expect(driftAt(drift, 49n * SEC)).toBe(110n * SEC);
    expect(driftAt(drift, 51n * SEC)).toBe(140n * SEC);
  });

  it('maps the source instant at a pause to the first instant of the stop', () => {
    const atStop = toDerived(drift, 20n * SEC);
    expect(atStop).toBe(120n * SEC);
    expect(toSource(drift, atStop)).toEqual({ sourceTime: 20n * SEC, insidePause: true });
  });

  it('reports an instant inside a pause as the frame that was on screen', () => {
    expect(toSource(drift, 125n * SEC)).toEqual({ sourceTime: 20n * SEC, insidePause: true });
    expect(toSource(drift, 131n * SEC)).toEqual({ sourceTime: 21n * SEC, insidePause: false });
  });

  it('round-trips every instant outside a pause exactly', () => {
    for (const seconds of [0, 1, 19, 21, 49, 51, 90, 3600]) {
      const source = BigInt(seconds) * SEC;
      const mapped = toDerived(drift, source);
      expect(toSource(drift, mapped)).toEqual({ sourceTime: source, insidePause: false });
    }
  });

  it('is monotone on the source clock, and monotone-or-flat on the derived clock', () => {
    let previous = -1n;
    for (let seconds = 0n; seconds <= 80n; seconds++) {
      const derived = toDerived(drift, seconds * SEC);
      expect(derived > previous).toBe(true);
      previous = derived;
    }
  });

  it('totals only the pauses, not the base offset', () => {
    expect(totalDrift(drift)).toBe(40n * SEC);
  });

  it('tiles the correspondence into playback and pause segments', () => {
    const segments = driftSegments(drift, 80n * SEC);
    expect(segments.map((segment) => segment.kind)).toEqual([
      'playback',
      'pause',
      'playback',
      'pause',
      'playback',
    ]);

    // Contiguous on both clocks: each segment starts where the previous one ended.
    for (let i = 1; i < segments.length; i++) {
      expect(segments[i].sourceStart).toBe(segments[i - 1].sourceEnd);
      expect(segments[i].derivedStart).toBe(segments[i - 1].derivedEnd);
    }
    expect(segments[0].sourceStart).toBe(0n);
    expect(segments[segments.length - 1].sourceEnd).toBe(80n * SEC);

    // Playback advances both clocks equally; a pause advances only the derived clock.
    for (const segment of segments) {
      const sourceSpan = segment.sourceEnd - segment.sourceStart;
      const derivedSpan = segment.derivedEnd - segment.derivedStart;
      if (segment.kind === 'playback') expect(derivedSpan).toBe(sourceSpan);
      else expect(sourceSpan).toBe(0n);
    }
  });

  it('accepts the well-formed drift', () => {
    expect(validateClockDrift(drift)).toEqual([]);
  });

  it('rejects the faults that produce plausible wrong answers', () => {
    const unsorted: ClockDrift = {
      ...drift,
      pauses: [drift.pauses[1], drift.pauses[0]],
    };
    expect(validateClockDrift(unsorted).join(' ')).toMatch(/out of order/);

    const duplicate: ClockDrift = {
      ...drift,
      pauses: [
        drift.pauses[0],
        { id: 'p2', at: 20n * SEC, duration: 10n * SEC, cause: 'same instant' },
      ],
    };
    expect(validateClockDrift(duplicate).join(' ')).toMatch(/same instant/);

    const rewind: ClockDrift = {
      ...drift,
      pauses: [{ id: 'p1', at: 20n * SEC, duration: 0n, cause: 'nothing' }],
    };
    expect(validateClockDrift(rewind).join(' ')).toMatch(/non-positive duration/);

    const unexplained: ClockDrift = {
      ...drift,
      pauses: [{ id: 'p1', at: 20n * SEC, duration: 10n * SEC, cause: '' }],
    };
    expect(validateClockDrift(unexplained).join(' ')).toMatch(/does not say/);

    const oneClock: ClockDrift = { ...drift, derivedId: drift.sourceId };
    expect(validateClockDrift(oneClock).join(' ')).toMatch(/two clocks/);

    const noPauses: ClockDrift = { ...drift, pauses: [] };
    expect(validateClockDrift(noPauses).join(' ')).toMatch(/no pauses/);
  });
});
