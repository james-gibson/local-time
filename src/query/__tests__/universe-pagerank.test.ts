import { Universe, UniverseType } from '../../core/types';
import { allUniverses } from '../../config/universes';
import { buildUniverseGraph } from '../universe-graph';
import { PageRankResult, explainRank, rank, rankUniverses } from '../universe-pagerank';

/**
 * james-gibson/local-time#92 — the ranking half.
 *
 * The properties pinned here are the ones the ticket calls out as defects if
 * missed: convergence and the probability normalisation (§5.2, §7.3), bit-identical
 * determinism across runs and input orders (§5.2), dangling redistribution (§5.4),
 * a personalization vector that is not a no-op (§7.2), a convergence cap that
 * reports instead of throwing (§5.2), and provenance that adds up (§6).
 */

interface FixtureOptions {
  significance?: number;
  references?: Array<{ type: string; target: string; confidence?: number }>;
}

/** A minimal universe: enough fields for the gradient and the graph, nothing else. */
const universe = (id: string, options: FixtureOptions = {}): Universe => ({
  universeId: id,
  type: UniverseType.HISTORICAL_EVENT,
  identifiers: { primary: id },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0,
    realityAnchors: [],
  },
  attribution: { citations_required: true },
  layers: [],
  epochs: undefined,
  connections: {
    references: (options.references ?? []).map((reference) => ({
      type: reference.type,
      targetUniverseId: reference.target,
      ...(reference.confidence === undefined ? {} : { confidence: reference.confidence }),
    })),
  },
  metadata: {
    canonicalName: id,
    creators: [],
    released: new Date('2000-01-01'),
    cultural_significance: options.significance ?? 0.8,
  },
});

const scoreOf = (result: PageRankResult, id: string): number => result.scores.get(id) ?? 0;

const totalScore = (result: PageRankResult): number =>
  [...result.scores.values()].reduce((sum, value) => sum + value, 0);

const ranked = (result: PageRankResult): string[] =>
  [...result.scores.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id);

describe('rank: convergence and the probability normalisation (#92 §5.2)', () => {
  const chain = [
    universe('history:fixture_a:2000', {
      significance: 1,
      references: [
        { type: 'INSPIRED_BY', target: 'history:fixture_b:2000' },
        { type: 'DISTRIBUTED_BY', target: 'history:fixture_c:2000' },
      ],
    }),
    universe('history:fixture_b:2000', {
      significance: 0.5,
      references: [{ type: 'PARODIES', target: 'history:fixture_c:2000' }],
    }),
    universe('history:fixture_c:2000', { significance: 0.2 }),
  ];

  test('converges and returns a probability distribution', () => {
    const result = rank(buildUniverseGraph(chain));

    expect(result.converged).toBe(true);
    expect(result.iterations).toBeGreaterThan(0);
    expect(result.iterations).toBeLessThanOrEqual(100);
    expect(Math.abs(totalScore(result) - 1)).toBeLessThan(1e-9);
  });

  test('is bit-identical across runs and across input order', () => {
    const forward = rank(buildUniverseGraph(chain));
    const again = rank(buildUniverseGraph(chain));
    const reversed = rank(buildUniverseGraph([...chain].reverse()));

    for (const id of forward.scores.keys()) {
      expect(again.scores.get(id)).toBe(forward.scores.get(id));
      expect(reversed.scores.get(id)).toBe(forward.scores.get(id));
    }
  });

  test('a node with no out-edges still ranks — its mass is redistributed, not lost', () => {
    const result = rank(buildUniverseGraph(chain));

    // `fixture_c` is a leaf and carries the largest in-degree, so it must have
    // positive score; the sum staying at 1 is what proves nothing leaked.
    expect(scoreOf(result, 'history:fixture_c:2000')).toBeGreaterThan(0);
    expect(result.danglingMass).toBeGreaterThan(0);
    expect(result.danglingMass).toBeLessThan(1);
    expect(Math.abs(totalScore(result) - 1)).toBeLessThan(1e-9);
  });

  test('seed mass is the teleport prior: significance orders otherwise-identical nodes', () => {
    const result = rank(
      buildUniverseGraph([
        universe('history:fixture_heavy:2000', { significance: 1 }),
        universe('history:fixture_light:2000', { significance: 0.1 }),
      ]),
    );

    expect(scoreOf(result, 'history:fixture_heavy:2000')).toBeGreaterThan(
      scoreOf(result, 'history:fixture_light:2000'),
    );
  });

  test('the iteration cap reports non-convergence instead of throwing', () => {
    const result = rank(buildUniverseGraph(chain), { maxIterations: 1, tolerance: 1e-15 });

    expect(result.converged).toBe(false);
    expect(result.iterations).toBe(1);
    expect(Number.isFinite(result.l1Delta)).toBe(true);
    expect(result.warnings.some((warning) => warning.includes('did not converge'))).toBe(true);
  });

  test('an empty graph is an empty result, not a crash', () => {
    const result = rank(buildUniverseGraph([]));

    expect(result.scores.size).toBe(0);
    expect(result.converged).toBe(true);
    expect(result.warnings.some((warning) => warning.includes('no nodes'))).toBe(true);
  });
});

describe('rank: personalization is not a no-op (#92 §7.2)', () => {
  const hub = universe('history:fixture_hub:2000', {
    significance: 0.9,
    references: [
      { type: 'INSPIRED_BY', target: 'history:fixture_a:2000' },
      { type: 'INSPIRED_BY', target: 'history:fixture_b:2000' },
    ],
  });
  const leaves = [
    universe('history:fixture_a:2000', { significance: 0.5 }),
    universe('history:fixture_b:2000', { significance: 0.5 }),
  ];

  test('a symmetric pair ties by default and splits under a query vector', () => {
    const graph = buildUniverseGraph([hub, ...leaves]);
    const global = rank(graph);
    const personalized = rank(graph, {
      personalization: new Map([['history:fixture_b:2000', 1]]),
    });

    expect(scoreOf(global, 'history:fixture_a:2000')).toBeCloseTo(
      scoreOf(global, 'history:fixture_b:2000'),
      12,
    );
    expect(scoreOf(personalized, 'history:fixture_b:2000')).toBeGreaterThan(
      scoreOf(personalized, 'history:fixture_a:2000'),
    );
  });

  test('a query vector measurably reorders the real corpus top ten', () => {
    const target = 'columbia:the_karate_kid:1984';

    const global = rankUniverses(allUniverses as Universe[]);
    const personalized = rankUniverses(allUniverses as Universe[], {
      personalization: new Map([[target, 1]]),
    });

    expect(personalized.scores.has(target)).toBe(true);
    expect(ranked(global).slice(0, 10)).not.toEqual(ranked(personalized).slice(0, 10));
    expect(ranked(personalized).slice(0, 10)).toContain(target);
  });

  test('unknown or non-positive personalization entries are reported, not applied', () => {
    const result = rank(buildUniverseGraph([hub, ...leaves]), {
      personalization: new Map([
        ['history:fixture_not_in_graph:2000', 1],
        ['history:fixture_a:2000', -1],
      ]),
    });

    expect(
      result.warnings.some((warning) => warning.includes('not in the graph')),
    ).toBe(true);
    expect(
      result.warnings.some((warning) => warning.includes('not positive')),
    ).toBe(true);
    // Falling back to the derived prior still yields a distribution.
    expect(Math.abs(totalScore(result) - 1)).toBeLessThan(1e-9);
  });
});

describe('explainRank: a score shows its edges (#92 §6)', () => {
  // A carries all the mass and points at B, so B's teleport term is exactly zero
  // and its rank is entirely explained by incoming edges.
  const a = universe('history:explain_a:2000', {
    significance: 1,
    references: [{ type: 'INSPIRED_BY', target: 'history:explain_b:2000', confidence: 0.8 }],
  });
  const b = universe('history:explain_b:2000', { significance: 0 });

  test('contributions plus the teleport term reconstruct the rank', () => {
    const graph = buildUniverseGraph([a, b]);
    // Two nodes with one edge each contract by `d` per iteration, so 100
    // iterations is not enough for the 1e-10 default; the identity below is a
    // fixed-point property, so let it converge.
    const result = rank(graph, { maxIterations: 1000 });
    const explanation = explainRank(graph, result, 'history:explain_b:2000');

    expect(result.converged).toBe(true);

    const explained = explanation.contributions.reduce((sum, entry) => sum + entry.contribution, 0);

    expect(explanation.rank).toBe(result.scores.get('history:explain_b:2000'));
    expect(explanation.contributions).toHaveLength(1);
    expect(explanation.contributions[0]).toMatchObject({
      from: 'history:explain_a:2000',
      kind: 'reference',
      sign: 1,
      weight: 0.8,
    });
    // Every unit of B's score came from that edge: the teleport prior for B is 0.
    // The identity is a fixed-point property, so it holds to the convergence
    // tolerance (1e-10), not to machine precision.
    expect(explained).toBeCloseTo(explanation.rank, 9);
  });

  test('an unknown id explains nothing rather than throwing', () => {
    const graph = buildUniverseGraph([a, b]);
    expect(explainRank(graph, rank(graph), 'history:missing:2000')).toEqual({
      contributions: [],
      rank: 0,
    });
  });
});

describe('rankUniverses: the real corpus (#92 §10.1, §10.2)', () => {
  test('ranks the current corpus, converged and deterministic, in under a second', () => {
    const started = performance.now();
    const result = rankUniverses(allUniverses as Universe[]);
    const elapsed = performance.now() - started;

    expect(result.converged).toBe(true);
    expect(Math.abs(totalScore(result) - 1)).toBeLessThan(1e-6);
    expect(elapsed).toBeLessThan(1000);

    const again = rankUniverses(allUniverses as Universe[]);
    expect([...again.scores.entries()]).toEqual([...result.scores.entries()]);
  });

  test('reports the referenced-but-unregistered ids instead of a clean-looking score set', () => {
    // 41 at the time of writing: declared containers with no universe record
    // (HOLLYWOOD_SYSTEM, US_HISTORY, …), the private/imported ids, and the
    // malformed anchors. The number is not pinned — non-emptiness is.
    const result = rankUniverses(allUniverses as Universe[]);

    expect(result.dangling.length).toBeGreaterThan(0);
    expect(result.warnings.length).toBeGreaterThanOrEqual(result.dangling.length);
    for (const id of result.dangling) {
      expect(result.scores.has(id)).toBe(false);
    }
  });
});
