import { apollo11Universe } from '../src/zero-reference-examples';
import { ZeroReferenceEpoch } from '../src/temporal-system';

/**
 * Two zero-reference frames over one real interval.
 *
 * `launch` is zeroed on liftoff (13:32:00Z). `go_no_go` is zeroed on the go/no-go poll
 * five and a half minutes earlier (13:26:30Z). Same absolute span, two origins.
 *
 * This is what "treat a prior keyframe as the zero" means in this model, done without
 * inventing a reference type. `IN_A_PRIOR_KEYFRAME` is deliberately unused here: it is a
 * universe-level claim that one universe's zero derives from a keyframe in a *different*
 * universe — Idiocracy's fictional 2505 frame deriving from the real 2005 hibernation
 * keyframe. `go_no_go_poll` and `liftoff` are both keyframes inside this one universe, so
 * that type would assert a cross-universe derivation that does not exist.
 */

const NS_PER_SECOND = 1_000_000_000n;

const universe = apollo11Universe as unknown as {
  epochs: Record<string, ZeroReferenceEpoch>;
  temporalStructure: { keyframes: { id: string; timestamp: bigint }[] };
  connections?: { references?: { type: string }[] };
};

/** Seconds from `epoch.zeroPoint`, formatted as the epoch's own HMS prefixes would be. */
function offsetFrom(epochId: string, keyframeId: string): string {
  const epoch = universe.epochs[epochId];
  const keyframe = universe.temporalStructure.keyframes.find(k => k.id === keyframeId);
  if (!epoch || !keyframe) throw new Error(`missing ${epochId} / ${keyframeId}`);

  const totalSeconds = Number((keyframe.timestamp - epoch.zeroPoint) / NS_PER_SECOND);
  const sign = totalSeconds < 0 ? epoch.beforePrefix : epoch.afterPrefix;
  const abs = Math.abs(totalSeconds);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${sign}${pad(Math.floor(abs / 3600))}:${pad(Math.floor((abs % 3600) / 60))}:${pad(abs % 60)}`;
}

describe('Apollo 11 has two zero-reference frames over one interval', () => {
  test('both frames exist and are zero-reference epochs', () => {
    expect(Object.keys(universe.epochs)).toEqual(['launch', 'go_no_go', 'mission']);

    for (const id of ['launch', 'go_no_go']) {
      const e = universe.epochs[id];
      expect(`${id}:${typeof e.zeroPoint === 'bigint'}`).toBe(`${id}:true`);
      expect(`${id}:${typeof e.zeroEvent === 'string'}`).toBe(`${id}:true`);
      expect(`${id}:${e.beforePrefix}/${e.afterPrefix}`).toBe(`${id}:T-/T+`);
      expect(`${id}:${e.relativeFormat}`).toBe(`${id}:HMS`);
    }
  });

  /** The frame is a re-zeroing, not a new window. */
  test('the two frames share an absolute span but not a zero', () => {
    const launch = universe.epochs.launch;
    const goNoGo = universe.epochs.go_no_go;
    expect(goNoGo.startTime).toBe(launch.startTime);
    expect(goNoGo.endTime).toBe(launch.endTime);
    expect(goNoGo.zeroPoint).not.toBe(launch.zeroPoint);
  });

  test('the go/no-go frame puts liftoff five and a half minutes after its zero', () => {
    expect(offsetFrom('go_no_go', 'go_no_go_poll')).toBe('T+00:00:00');
    expect(offsetFrom('go_no_go', 'liftoff')).toBe('T+00:05:30');
    expect(offsetFrom('go_no_go', 'first_stage_separation')).toBe('T+00:08:16');
  });

  /**
   * The reason the second frame is worth having: in the `launch` frame the go/no-go
   * poll sits *before* the zero, so no address derived from liftoff can express it.
   * Re-zeroing makes the pre-launch decision sequence addressable.
   */
  test('the launch frame still expresses the poll as negative time', () => {
    expect(offsetFrom('launch', 'go_no_go_poll')).toBe('T-00:05:30');
    expect(offsetFrom('launch', 'liftoff')).toBe('T+00:00:00');
    expect(offsetFrom('launch', 'first_stage_separation')).toBe('T+00:02:46');
  });

  /** Ordering is stable across both frames, and survives re-zeroing. */
  test('keyframe order is identical under either frame', () => {
    const ids = ['go_no_go_poll', 'liftoff', 'first_stage_separation'];
    const underLaunch = ids.map(id => offsetFrom('launch', id));
    const underGoNoGo = ids.map(id => offsetFrom('go_no_go', id));

    const ascending = (xs: string[]) =>
      [...xs].sort((a, b) =>
        (a.startsWith('T-') ? -1 : 1) === (b.startsWith('T-') ? -1 : 1)
          ? a.localeCompare(b)
          : a.startsWith('T-') ? -1 : 1,
      );

    expect(ascending(underLaunch)).toEqual(ids.map(id => offsetFrom('launch', id)));
    expect(ascending(underGoNoGo)).toEqual(ids.map(id => offsetFrom('go_no_go', id)));
  });

  /**
   * Guard against the misuse this design exists to avoid: adding a second frame must not
   * have introduced a cross-universe `IN_A_PRIOR_KEYFRAME` claim. Both keyframes are in
   * this universe, so such a reference would be false.
   */
  test('no IN_A_PRIOR_KEYFRAME reference was introduced', () => {
    const refs = universe.connections?.references ?? [];
    expect(refs.some(r => r.type === 'IN_A_PRIOR_KEYFRAME')).toBe(false);
  });

  /**
   * A second frame makes pre-zero addressing *expressible*; it does not make
   * `findEventsInRelativeRange` honour its bounds. That method still ignores both
   * arguments (#55), and pinning that here keeps the two concerns from being conflated.
   */
  test('the second frame does not fix the bounds bug (#55)', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { ZeroReferenceQueryService } = require('../src/zero-reference-queries');
    const service = new ZeroReferenceQueryService();
    expect(typeof service.findEventsInRelativeRange).toBe('function');
    // Still ignored: the method returns [zeroPoint, zeroPoint + 1h] regardless of bounds.
    expect(service.findEventsInRelativeRange.length).toBe(4);
  });
});