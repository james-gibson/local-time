import { Keyframe42iInput, Temporal42i, ZeroAnchor42i } from '../temporal-42i';

const ms = (value: number): bigint => BigInt(value) * 1_000_000n;
const NS_PER_DAY = 86_400_000n * 1_000_000n;

/**
 * Cross-conferring 42i with repealing amendments.
 *
 * The amendments are anchored to constitutional ratification (1788-06-21).
 * A ratified amendment has a real date, so it sits on the real axis with no
 * tension. A *never-passed* amendment has no ratification date — only a label —
 * so it is an imaginary branch with no real axis at all.
 *
 * That is exactly what makes a repeal coherent: only a real, ratified amendment
 * can be repealed. You cannot repeal something that never passed, because there
 * is no real point to terminate.
 */
describe('42i × repealing amendments (Prohibition as the worked case)', () => {
  const RATIFICATION = ms(Date.UTC(1788, 5, 21));

  const ratification: ZeroAnchor42i = {
    epochId: 'ratification',
    zeroEvent: 'Constitution ratified by the ninth state',
    zeroStatus: 'established',
    zeroPoint: RATIFICATION,
  };

  const daysAfter = (timestamp: bigint): number =>
    Number((timestamp - RATIFICATION) / NS_PER_DAY);

  const amendment = (
    id: string,
    date: [number, number, number],
  ): Keyframe42iInput => {
    const timestamp = ms(Date.UTC(date[0], date[1], date[2]));
    return { id, address: `ratification:T+${daysAfter(timestamp)}days`, timestamp };
  };

  // The 18th passed (so it has a real axis), and the 21st repealed it later.
  const eighteenth = amendment('18th:prohibition', [1919, 0, 16]);
  const twentyFirst = amendment('21st:repeal', [1933, 11, 5]);

  // A never-passed amendment: a label with no ratification date.
  const neverPassed: Keyframe42iInput = {
    id: 'never-passed',
    address: 'ratification:T+95000days',
  };

  test('a ratified amendment resolves on the real axis — it passed, so it can be repealed', () => {
    const branches = Temporal42i.decompose(ratification, [eighteenth, twentyFirst]);
    expect(branches.map((b) => b.label)).toEqual(['ratification:as-declared']);

    const [eighteenthLifted, twentyFirstLifted] = branches[0].keyframes;
    expect(eighteenthLifted.re).not.toBeNull();
    expect(twentyFirstLifted.re).not.toBeNull();
    expect(eighteenthLifted.tension).toBe(0);
    expect(twentyFirstLifted.tension).toBe(0);

    // The repeal is strictly later than the thing it repeals.
    expect(twentyFirstLifted.re! > eighteenthLifted.re!).toBe(true);
  });

  test('a never-passed amendment has no real axis — so a repeal has nothing to end', () => {
    const branches = Temporal42i.decompose(ratification, [neverPassed]);
    expect(branches.map((b) => b.label)).toEqual(['ratification:imaginary']);

    const [lifted] = branches[0].keyframes;
    expect(lifted.re).toBeNull();
    expect(lifted.realMs).toBeNull();
    expect(lifted.tension).toBe(1);

    // If it never passed, there is no real point for a repeal to terminate.
    expect(branches.some((b) => b.keyframes.some((k) => k.re !== null))).toBe(false);
  });

  test('the passed and never-passed worlds are not on the same number line', () => {
    const [passed] = Temporal42i.liftAll([eighteenth], ratification);
    const [imaginary] = Temporal42i.liftAll([neverPassed], ratification);

    // One has no real axis, so they cannot be subtracted into a distance.
    expect(Temporal42i.compare(passed, imaginary)).toMatchObject({ kind: 'branch' });
  });
});
