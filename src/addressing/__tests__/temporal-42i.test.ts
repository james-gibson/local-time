import { TimePrecision, ZeroReferenceEpoch } from '../../core/types';
import { Keyframe42iInput, Temporal42i, ZeroAnchor42i } from '../temporal-42i';

const NS_PER_MS = 1_000_000n;
const ms = (value: number | bigint): bigint => BigInt(value) * NS_PER_MS;
const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;

describe('Temporal42i — the 42i temporal lift', () => {
  describe('the day pigs fly (a choose-your-own-adventure)', () => {
    // "It will happen the day pigs fly."
    // Decomposed: IT happens T+1dayish, starting when pork wings are real.
    const porkWings: ZeroAnchor42i = {
      epochId: 'pork-wings',
      zeroEvent: 'pork wings are real',
      zeroStatus: 'unestablished',
      zeroPoint: null,
    };
    const it: Keyframe42iInput[] = [
      { id: 'IT', address: 'pork-wings:T+1dayish' },
      { id: 'pork-wings-are-real', address: 'pork-wings:T+00:00:00' },
    ];

    test('parses the label, and the "ish" is load-bearing', () => {
      expect(Temporal42i.parseNominalOffset('pork-wings:T+1dayish')).toEqual({
        ms: DAY_MS,
        approximate: true,
      });
      expect(Temporal42i.parseNominalOffset('pork-wings:T+1 day')).toEqual({
        ms: DAY_MS,
        approximate: false,
      });
      // A bare number is not an address; refuse rather than guess zero.
      expect(Temporal42i.parseNominalOffset('pork-wings:T+1')).toBeNull();
    });

    test('with no zeroth, IT has no real axis — only an imaginary one', () => {
      const [lifted] = Temporal42i.liftAll(it, porkWings);
      expect(lifted.re).toBeNull();
      expect(lifted.realMs).toBeNull();
      expect(lifted.nominalMs).toBe(DAY_MS);
      expect(lifted.im).toBe(ms(DAY_MS));
      expect(lifted.tension).toBe(1);
      expect(lifted.approximate).toBe(true);
    });

    test('the adventure has exactly one path, and it is imaginary', () => {
      const branches = Temporal42i.decompose(porkWings, it);
      expect(branches.map((b) => b.label)).toEqual(['pork-wings:imaginary']);
      expect(branches[0].zeroStatus).toBe('unestablished');
      expect(branches[0].condition.realSpanMs).toBeNull();
      expect(branches[0].condition.dilatation).toBeNull();
    });

    test('but you may choose the other path: if pork wings become real', () => {
      const branches = Temporal42i.decompose(porkWings, it, {
        realizedZeroPoint: ms(Date.UTC(2026, 9, 11)),
      });
      expect(branches.map((b) => b.label)).toEqual([
        'pork-wings:imaginary',
        'pork-wings:if-realized',
      ]);

      const ifRealized = branches[1];
      expect(ifRealized.zeroStatus).toBe('presumed');
      expect(ifRealized.keyframes[0].re).toBe(ms(DAY_MS));
      expect(ifRealized.keyframes[0].tension).toBe(0);
      // In the realized branch the labels mean what they say.
      expect(ifRealized.condition.dilatation).toBe(1);
    });

    test('and IT cannot share a number line with a real countdown', () => {
      const launch: ZeroAnchor42i = {
        epochId: 'launch',
        zeroEvent: 'liftoff',
        zeroStatus: 'established',
        zeroPoint: 0n,
      };
      const liftoff = Temporal42i.lift(
        { id: 'liftoff', address: 'launch:T+00:00:00', timestamp: 0n },
        launch
      );
      const [pigsFly] = Temporal42i.liftAll(it, porkWings);
      const verdict = Temporal42i.compare(pigsFly, liftoff);
      expect(verdict.kind).toBe('branch');
      expect(verdict).toMatchObject({ left: 'unestablished', right: 'established' });
    });
  });

  describe('literal versus nominal epochs', () => {
    test('a literal (NASA) timeline sits on the real axis with no tension', () => {
      const launch: ZeroAnchor42i = {
        epochId: 'launch',
        zeroStatus: 'established',
        zeroPoint: 0n,
      };
      const keyframes = Temporal42i.liftAll(
        [
          { id: 'poll', address: 'launch:T-05:30:00', timestamp: -ms(5.5 * HOUR_MS) },
          { id: 'liftoff', address: 'launch:T+00:00:00', timestamp: 0n },
        ],
        launch
      );
      expect(keyframes.every((k) => k.tension === 0)).toBe(true);
      expect(keyframes[0].re).toBe(-ms(5.5 * HOUR_MS));
      expect(Temporal42i.condition(keyframes).dilatation).toBe(1);
    });

    test('a nominal epoch rotates the same labels off the real axis', () => {
      // The standard-oil case: "T+41:00:00" is 41 nominal hours, but 41 real years.
      const oil: ZeroAnchor42i = {
        epochId: 'founding',
        zeroStatus: 'established',
        zeroPoint: ms(Date.UTC(1870, 1, 1, 12)),
      };
      const keyframes = Temporal42i.liftAll(
        [
          {
            id: 'trust',
            address: 'founding:T+00:03:00',
            timestamp: ms(Date.UTC(1879, 0, 2, 12)),
          },
          {
            id: 'breakup',
            address: 'founding:T+41:00:00',
            timestamp: ms(Date.UTC(1911, 4, 15, 12)),
          },
        ],
        oil
      );
      expect(keyframes[0].tension).toBeGreaterThan(0.99);
      expect(keyframes[1].tension).toBeGreaterThan(0.99);
      expect(Temporal42i.condition(keyframes).dilatation).toBeGreaterThan(1000);
    });

    test('two anchored points subtract into a distance', () => {
      const a = { re: 0n, im: 0n };
      const b = { re: ms(3000), im: 0n };
      expect(Temporal42i.compare(a, b)).toEqual({
        kind: 'commensurable',
        distanceMs: 3000,
        tension: 1,
      });
    });
  });

  describe('anchorFromEpoch', () => {
    const epoch: ZeroReferenceEpoch = {
      epochId: 'founding',
      precision: TimePrecision.DAY,
      zeroPoint: ms(Date.UTC(1870, 1, 1, 12)),
      zeroEvent: 'articles of incorporation',
      beforePrefix: 'T-',
      afterPrefix: 'T+',
      relativeFormat: 'HMS',
    };

    test('an epoch with a zero point is presumed when no status is given', () => {
      const anchor = Temporal42i.anchorFromEpoch(epoch);
      expect(anchor.zeroStatus).toBe('presumed');
      expect(anchor.zeroPoint).toBe(epoch.zeroPoint);
    });

    test('an explicit unestablished status discards the point', () => {
      const anchor = Temporal42i.anchorFromEpoch(epoch, 'unestablished');
      expect(anchor.zeroStatus).toBe('unestablished');
      expect(anchor.zeroPoint).toBeNull();
    });
  });
});
