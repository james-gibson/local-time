import { Temporal42i, ZeroAnchor42i } from '../temporal-42i';

/**
 * Parity harness against isotope's `fortytwointegration_test.go`
 * (github.com/james-gibson/isotope) — the reference implementation of the 42i
 * plane.
 *
 * isotope is a *trust* protocol. Some of its machinery therefore has no temporal
 * analogue and is deliberately NOT mirrored by `Temporal42i`:
 *
 *   - the capability rung ladder (0..220, "Absolute Zero" .. "Certification")
 *   - the boundary bands ("ok" / "warning" / "critical" / "demoted")
 *   - the qualitative direction labels ("unpredictable-behavior", ...)
 *
 * What IS shared is the geometry: a point is `42 + d·i`, the imaginary axis
 * carries the distance from anchored ground truth, and the modulus is minimal
 * exactly at ground truth. Those invariants are asserted below.
 *
 * The reference functions are verbatim ports and their expectations are copied
 * from the Go test tables, so a change in isotope surfaces here.
 */

// ── Reference model, ported from isotope/fortytwointegration.go ─────────────

interface RungThreshold {
  rung: number;
  name: string;
  maxDistance: number;
}

const DEFAULT_RUNG_THRESHOLDS: RungThreshold[] = [
  { rung: 0, name: 'Absolute Zero', maxDistance: 0 },
  { rung: 1, name: 'Read-Only', maxDistance: 20 },
  { rung: 2, name: 'Harness Tools', maxDistance: 60 },
  { rung: 3, name: 'Mock Secrets', maxDistance: 100 },
  { rung: 4, name: 'Higher Authority', maxDistance: 140 },
  { rung: 5, name: 'Delegation', maxDistance: 180 },
  { rung: 6, name: 'Certification', maxDistance: 220 },
];

const rungForDistance = (
  distance: number,
  thresholds: RungThreshold[] = DEFAULT_RUNG_THRESHOLDS
): number => {
  for (const threshold of thresholds) {
    if (distance <= threshold.maxDistance) {
      return threshold.rung;
    }
  }
  return 0; // exceeds all thresholds — isotope falls back to the ground state
};

const boundaryStatus = (distance: number, threshold: number): string => {
  const distanceToThreshold = threshold - distance;
  if (distanceToThreshold < 0) return 'demoted';
  if (distanceToThreshold < 20 && distance > 0) return 'critical';
  if (distanceToThreshold < 40 && distance > 0) return 'warning';
  return 'ok';
};

/** isotope's `Position.Magnitude` for a given imaginary displacement. */
const seedMagnitude = (imaginary: number): number => Math.hypot(42, imaginary);

const NS_PER_MS = 1_000_000n;
const ms = (value: number | bigint): bigint => BigInt(value) * NS_PER_MS;

describe('isotope parity — Temporal42i against fortytwointegration_test.go', () => {
  describe('the reference model reads as documented', () => {
    test('RungForDistance is first-fit low-to-high, falling back to rung 0 above the top', () => {
      const table: Array<[number, number]> = [
        [0, 0],
        [1, 1],
        [20, 1],
        [21, 2],
        [60, 2],
        [61, 3],
        [100, 3],
        [101, 4],
        [140, 4],
        [141, 5],
        [180, 5],
        [181, 6],
        [220, 6],
        [221, 0],
        [1000, 0],
      ];
      for (const [distance, expected] of table) {
        expect([distance, rungForDistance(distance)]).toEqual([distance, expected]);
      }
    });

    test('BoundaryStatus bands match the Go table', () => {
      const table: Array<[number, number, string]> = [
        [0, 0, 'ok'],
        [0, 20, 'ok'],
        [0, 100, 'ok'],
        [10, 100, 'ok'],
        [50, 100, 'ok'],
        [65, 100, 'warning'],
        [61, 100, 'warning'],
        [81, 100, 'critical'],
        [99, 100, 'critical'],
        [18, 20, 'critical'],
        [25, 20, 'demoted'],
        [101, 100, 'demoted'],
        [1, 0, 'demoted'],
        [221, 220, 'demoted'],
      ];
      for (const [distance, threshold, expected] of table) {
        expect([distance, threshold, boundaryStatus(distance, threshold)]).toEqual([
          distance,
          threshold,
          expected,
        ]);
      }
    });

    test('the origin is 42 + 0i and magnitude is minimal there', () => {
      expect(seedMagnitude(0)).toBe(42);
      expect(seedMagnitude(16)).toBeCloseTo(44.94, 1); // TestPositionCalculation
      expect(seedMagnitude(16)).toBeGreaterThan(seedMagnitude(0));
    });
  });

  describe('Temporal42i keeps the geometry', () => {
    const seed: ZeroAnchor42i = { epochId: 'seed', zeroStatus: 'established', zeroPoint: 0n };

    test('ground truth lies on the real axis: no imaginary part, no tension, minimal modulus', () => {
      const keyframe = Temporal42i.lift(
        { id: 'ground-truth', address: 'seed:T+00:00:16', timestamp: ms(16_000) },
        seed
      );
      expect(keyframe.im).toBe(0n);
      expect(keyframe.tension).toBe(0);
      expect(keyframe.magnitude).toBe(16_000);
      expect(keyframe.magnitude).toBe(Math.abs(keyframe.realMs as number));
    });

    test('drift is imaginary and raises the modulus, exactly as displacement does for 42i', () => {
      const keyframe = Temporal42i.lift(
        { id: 'drift', address: 'seed:T+00:00:30', timestamp: ms(16_000) },
        seed
      );
      expect(keyframe.im).not.toBe(0n);
      expect(keyframe.magnitude).toBeGreaterThan(Math.abs(keyframe.realMs as number));
      expect(keyframe.tension).toBeGreaterThan(0);
      expect(keyframe.tension).toBeLessThanOrEqual(1);
    });

    test('with no zeroth the point is purely imaginary — isotope has no analogue, its seed is fixed', () => {
      const unanchored: ZeroAnchor42i = {
        epochId: 'seed',
        zeroStatus: 'unestablished',
        zeroPoint: null,
      };
      const keyframe = Temporal42i.lift(
        { id: 'no-zeroth', address: 'seed:T+00:00:30', timestamp: ms(16_000) },
        unanchored
      );
      expect(keyframe.re).toBeNull();
      expect(keyframe.magnitude).toBe(30_000);
      expect(keyframe.tension).toBe(1);
    });
  });

  describe('deliberate divergences', () => {
    test('the trust ladder does not transplant: isotope accumulates and resets, tension saturates', () => {
      // isotope's distance is unbounded — and above the top rung it resets to 0…
      expect(rungForDistance(221)).toBe(0);
      expect(boundaryStatus(221, 220)).toBe('demoted');

      // …whereas Temporal42i's tension is bounded to [0, 1] and never resets.
      const seed: ZeroAnchor42i = { epochId: 'seed', zeroStatus: 'established', zeroPoint: 0n };
      const keyframe = Temporal42i.lift(
        { id: 'saturated', address: 'seed:T+99:00:00', timestamp: ms(1) },
        seed
      );
      expect(keyframe.tension).toBeLessThanOrEqual(1);
      expect(keyframe.tension).toBeGreaterThan(0.99);
    });
  });
});
