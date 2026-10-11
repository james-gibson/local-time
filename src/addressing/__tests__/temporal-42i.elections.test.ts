import { Keyframe42iInput, Temporal42i, ZeroAnchor42i } from '../temporal-42i';

const NS_PER_DAY = 86_400_000n * 1_000_000n;
const ms = (value: number | bigint): bigint => BigInt(value) * 1_000_000n;

/**
 * Issue #6 — U.S. presidential elections are constitutionally gated.
 *
 * The election cycle has no independent zeroth. It is anchored to the
 * ratification of the Constitution (New Hampshire, the ninth state,
 * 1788-06-21), which is why every election is a positive offset from it. If the
 * Constitution had never been ratified the zeroth would be `unestablished`:
 * every election would sit on the imaginary axis with no real axis at all —
 * no elections.
 */
describe('U.S. elections are gated on constitutional ratification (issue #6)', () => {
  const RATIFICATION = ms(Date.UTC(1788, 5, 21));

  const ratification: ZeroAnchor42i = {
    epochId: 'ratification',
    zeroEvent: 'Constitution ratified by the ninth state',
    zeroStatus: 'established',
    zeroPoint: RATIFICATION,
  };

  const neverRatified: ZeroAnchor42i = {
    ...ratification,
    zeroStatus: 'unestablished',
    zeroPoint: null,
  };

  /** Whole days from ratification to an election day. */
  const daysAfter = (timestamp: bigint): number =>
    Number((timestamp - RATIFICATION) / NS_PER_DAY);

  const election = (year: number, date: [number, number, number]): Keyframe42iInput => {
    const timestamp = ms(Date.UTC(date[0], date[1], date[2]));
    return { id: String(year), address: `ratification:T+${daysAfter(timestamp)}days`, timestamp };
  };

  const elections: Keyframe42iInput[] = [
    election(1789, [1789, 0, 10]),
    election(1860, [1860, 10, 6]),
    election(2000, [2000, 10, 7]),
    election(2024, [2024, 10, 5]),
  ];

  test('with the Constitution ratified, every election resolves on the real axis', () => {
    const branches = Temporal42i.decompose(ratification, elections);
    expect(branches.map((b) => b.label)).toEqual(['ratification:as-declared']);

    for (const keyframe of branches[0].keyframes) {
      expect(keyframe.re).not.toBeNull();
      expect(keyframe.realMs).not.toBeNull();
      // Day-exact addresses: the labels mean what they say.
      expect(keyframe.tension).toBe(0);
    }
    expect(branches[0].condition.dilatation).toBe(1);
  });

  test('if the Constitution were never ratified, there are no elections', () => {
    const branches = Temporal42i.decompose(neverRatified, elections);
    expect(branches.map((b) => b.label)).toEqual(['ratification:imaginary']);

    for (const keyframe of branches[0].keyframes) {
      expect(keyframe.re).toBeNull();
      expect(keyframe.realMs).toBeNull();
      expect(keyframe.tension).toBe(1);
    }
    expect(branches[0].condition.realSpanMs).toBeNull();
    expect(branches[0].condition.dilatation).toBeNull();
  });

  test('the ratified and never-ratified worlds are not on the same number line', () => {
    const [ratified2024] = Temporal42i.liftAll([elections[3]], ratification);
    const [imaginary2024] = Temporal42i.liftAll([elections[3]], neverRatified);

    expect(Temporal42i.compare(ratified2024, imaginary2024)).toMatchObject({
      kind: 'branch',
      left: 'established',
      right: 'unestablished',
    });
  });

  test('the offset is real elapsed time, not a nominal year count', () => {
    const [election2024] = Temporal42i.liftAll([elections[3]], ratification);
    const years = (election2024.realMs as number) / (365.25 * 86_400_000);
    expect(years).toBeGreaterThan(236);
    expect(years).toBeLessThan(237);
  });
});
