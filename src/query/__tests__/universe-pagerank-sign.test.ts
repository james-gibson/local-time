import { Universe, UniverseType } from '../../core/types';
import { buildUniverseGraph } from '../universe-graph';
import { explainRank, rank } from '../universe-pagerank';

/**
 * james-gibson/local-time#92 §5.3, §7.1 — `contradicts` is not a vote.
 *
 * A signed transition matrix is not stochastic, so signed edges cannot enter the
 * walk. The resolution pinned here: the walk runs on magnitude (so both nodes keep
 * positive scores and the result is still a distribution), while the sign is
 * accumulated into a separate `affinity`. The pair stays retrievable as a pair —
 * a claim and its refutation must surface together, with provenance.
 */

const universe = (
  id: string,
  references: Array<{ type: string; target: string }>,
  significance = 0.8,
): Universe => ({
  universeId: id,
  type: UniverseType.HISTORICAL_EVENT,
  identifiers: { primary: id },
  realityRelation: { type: 'documentary', fictionalizationDegree: 0, realityAnchors: [] },
  attribution: { citations_required: true },
  layers: [],
  epochs: undefined,
  connections: {
    references: references.map((reference) => ({
      type: reference.type,
      targetUniverseId: reference.target,
    })),
  },
  metadata: {
    canonicalName: id,
    creators: [],
    released: new Date('2000-01-01'),
    cultural_significance: significance,
  },
});

const A = 'history:refutation_a:2000';
const B = 'history:refutation_b:2000';

describe('a contradicts pair (#92 §5.3)', () => {
  const graph = buildUniverseGraph([
    universe(A, [{ type: 'CONTRADICTS', target: B }]),
    universe(B, [{ type: 'CONTRADICTS', target: A }]),
  ]);
  const result = rank(graph);

  test('the edge is a refutation with sign −1, not a reference', () => {
    const refutation = graph.edges.find((edge) => edge.from === A && edge.to === B);

    expect(refutation).toBeDefined();
    expect(refutation!.kind).toBe('refutation');
    expect(refutation!.sign).toBe(-1);
    expect(refutation!.weight).toBeGreaterThan(0);
  });

  test('both nodes keep a positive score — the walk uses magnitude', () => {
    expect(result.scores.get(A)).toBeGreaterThan(0);
    expect(result.scores.get(B)).toBeGreaterThan(0);
    // A signed matrix would not be stochastic; this one still is.
    const total = [...result.scores.values()].reduce((sum, value) => sum + value, 0);
    expect(Math.abs(total - 1)).toBeLessThan(1e-9);
  });

  test('the affinity is negative on both sides of a mutual refutation', () => {
    expect(result.affinity.get(A)).toBeLessThan(0);
    expect(result.affinity.get(B)).toBeLessThan(0);

    // Equal weights and equal significance make the walk symmetric, so the two
    // refutation costs must be equal — the sign is the only asymmetry.
    expect(result.affinity.get(A)).toBeCloseTo(result.affinity.get(B)!, 12);
  });

  test('the pair is retrievable as a pair, with opposite provenance', () => {
    const explanationA = explainRank(graph, result, A);
    const explanationB = explainRank(graph, result, B);

    expect(explanationA.contributions).toHaveLength(1);
    expect(explanationA.contributions[0]).toMatchObject({ from: B, sign: -1, kind: 'refutation' });
    expect(explanationB.contributions).toHaveLength(1);
    expect(explanationB.contributions[0]).toMatchObject({ from: A, sign: -1, kind: 'refutation' });

    // Neither score has been netted into the other: they are separate claims.
    expect(explanationA.rank).toBe(result.scores.get(A));
    expect(explanationB.rank).toBe(result.scores.get(B));
  });

  test('a one-sided refutation costs the refuted node only', () => {
    const oneSided = rank(
      buildUniverseGraph([
        universe(A, [{ type: 'CONTRADICTS', target: B }]),
        universe(B, []),
      ]),
    );

    expect(oneSided.scores.get(A)).toBeGreaterThan(0);
    expect(oneSided.scores.get(B)).toBeGreaterThan(0);
    // B's only inbound edge is a refutation, so its affinity is negative; A has
    // no inbound edge, so A is untouched.
    expect(oneSided.affinity.get(B)!).toBeLessThan(0);
    expect(oneSided.affinity.get(A)).toBe(0);
  });
});
