import { Universe } from '../core/types';
import { EdgeKind, UniverseGraph, buildUniverseGraph } from './universe-graph';

/**
 * PageRank over the universe graph.
 *
 * james-gibson/local-time#92, part two of two. `universe-graph.ts` derives the
 * nodes and edges; this module walks them.
 *
 * ## The formulation
 *
 * A damped random walk, iterated by the power method:
 *
 *     PR(u) = (1 − d)·p(u) + d·( Σ_{v → u} |w(v,u)|/out(v)·PR(v) + leaked·p(u) )
 *
 * where `p` is the teleport prior and `leaked` is the mass sitting on nodes with
 * no out-edges. Redistributing `leaked` through `p` is what keeps `Σ PR = 1`
 * (Bianchini, Gori & Scarselli, "Inside PageRank", ACM TOIT 2005).
 *
 * ## Three properties of this graph that break the textbook form
 *
 * 1. **`contradicts` is not a vote.** A signed transition matrix is not
 *    stochastic, so the walk is built on `|w|` and the sign is accumulated into a
 *    separate `affinity`. A claim and its refutation stay retrievable as a pair
 *    instead of being netted into one number.
 * 2. **Mass is derived, not uniform.** `cultural_significance` is the seed mass,
 *    and the seed is the teleport prior (ticket §2, §7.10). Passing
 *    `personalization` replaces the prior with a query vector — the two are the
 *    same slot by design, so a query-time walk is the same code path.
 * 3. **Dangling nodes are the normal case.** Most universes are leaves. Their
 *    mass is redistributed through `p`, never dropped, so the output remains a
 *    probability distribution.
 *
 * ## Determinism
 *
 * Nodes are iterated in sorted id order and edges arrive pre-sorted from the
 * graph builder, so floating-point accumulation order is fixed. The result is
 * bit-identical across runs and across input orderings (ticket §5.2). No
 * `Math.random`, no map-iteration order in any accumulation loop.
 *
 * On `maxIterations` without convergence the last iterate is returned with
 * `converged: false` and the achieved `l1Delta`. It never throws: a ranking is a
 * query, and a slow convergence is data about the graph, not an error.
 *
 * ## What this is not
 *
 * The weight is *not* a plane charge and the charge is *not* a weight (#76, #90):
 * the walk uses positive weights derived from declarations, while `charge`
 * (tiered ±1) and `level` (continuous) ride along on the nodes for the retrieval
 * layer to use explicitly. Nor is this `plane sort`, which is weight-invariant.
 *
 * Research Sources: see the module header of `./universe-graph.ts` — the same
 * seven references, with the dangling-node and damping-sensitivity results
 * applying to this half.
 */

export interface PageRankOptions {
  /** Damping factor, 0 ≤ d < 1. Default 0.85. Exposed: scores are sensitive to it. */
  damping?: number;
  /**
   * Teleport prior. Default: the node mass (`cultural_significance`), normalised.
   * Supply a query-derived map for personalized ranking; ids not in the graph are
   * reported and ignored, and an empty/zero vector falls back to the default.
   */
  personalization?: ReadonlyMap<string, number>;
  /** Iteration cap. Default 100. Reaching it is reported, never thrown. */
  maxIterations?: number;
  /** L1 convergence tolerance. Default 1e-10. */
  tolerance?: number;
}

export interface PageRankResult {
  /** The stationary walk. Sums to 1 within `tolerance`. */
  scores: ReadonlyMap<string, number>;
  /** The signed sum of the walk's edge contributions. May be negative. */
  affinity: ReadonlyMap<string, number>;
  iterations: number;
  converged: boolean;
  /** L1 distance between the last two iterates. */
  l1Delta: number;
  /** The damping actually used after clamping; `explainRank` reads it from here. */
  damping: number;
  /** Score mass that sat on out-degree-0 nodes in the final iterate. */
  danglingMass: number;
  warnings: readonly string[];
  /**
   * `graph.dangling` passed through, so the convenience `rankUniverses` caller can
   * see which referenced ids are not registered. Additive to the ticket's
   * interface: `danglingMass` says *how much*, this says *which* (#27, #69, #81).
   */
  dangling: readonly string[];
}

export interface RankExplanation {
  contributions: Array<{
    from: string;
    kind: EdgeKind;
    sign: 1 | -1;
    weight: number;
    contribution: number;
  }>;
  rank: number;
}

const DEFAULT_DAMPING = 0.85;
const DEFAULT_MAX_ITERATIONS = 100;
const DEFAULT_TOLERANCE = 1e-10;

interface Transition {
  to: number;
  weight: number;
  sign: 1 | -1;
  kind: EdgeKind;
  from: string;
  toId: string;
}

const clampDamping = (value: unknown): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return DEFAULT_DAMPING;
  // `d = 1` makes the walk non-convergent on a bipartite graph and `d > 1` is not
  // a probability; both are clamped rather than producing Infinity.
  return Math.min(0.999, Math.max(0, value));
};

const positiveInt = (value: unknown, fallback: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  const floored = Math.floor(value);
  return floored >= 1 ? floored : fallback;
};

const positiveNumber = (value: unknown, fallback: number): number => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return fallback;
  return value;
};

/** L1 norm of the difference between two dense vectors. */
const l1Distance = (a: Float64Array, b: Float64Array): number => {
  let total = 0;
  for (let i = 0; i < a.length; i++) total += Math.abs(a[i] - b[i]);
  return total;
};

const sum = (values: Float64Array): number => {
  let total = 0;
  for (let i = 0; i < values.length; i++) total += values[i];
  return total;
};

/**
 * Rank the graph.
 *
 * Pure and synchronous. Call it at query time; nothing is cached or global.
 */
export function rank(graph: UniverseGraph, options: PageRankOptions = {}): PageRankResult {
  const warnings: string[] = [];
  const damping = clampDamping(options.damping);
  const maxIterations = positiveInt(options.maxIterations, DEFAULT_MAX_ITERATIONS);
  const tolerance = positiveNumber(options.tolerance, DEFAULT_TOLERANCE);

  // Sorted, stable iteration order (ticket §5.2).
  const ids = [...graph.nodes.keys()].sort();
  const count = ids.length;

  if (count === 0) {
    return {
      scores: new Map(),
      affinity: new Map(),
      iterations: 0,
      converged: true,
      l1Delta: 0,
      damping,
      danglingMass: 0,
      warnings: [...graph.warnings, 'graph has no nodes; nothing to rank.'],
      dangling: graph.dangling,
    };
  }

  const indexOf = new Map<string, number>();
  ids.forEach((id, i) => indexOf.set(id, i));

  // ── Teleport prior ─────────────────────────────────────────────────────────
  const mass = new Float64Array(count);
  ids.forEach((id, i) => {
    const node = graph.nodes.get(id)!;
    mass[i] = Number.isFinite(node.mass) ? Math.max(0, node.mass) : 0;
  });

  const prior = new Float64Array(count);
  const supplied = options.personalization;

  if (supplied && supplied.size > 0) {
    for (const [id, value] of supplied) {
      const i = indexOf.get(id);
      if (i === undefined) {
        warnings.push(`personalization id "${id}" is not in the graph; ignored.`);
        continue;
      }
      if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
        warnings.push(`personalization value for "${id}" is not positive; ignored.`);
        continue;
      }
      prior[i] = value;
    }
    const total = sum(prior);
    if (total > 0) {
      for (let i = 0; i < count; i++) prior[i] /= total;
    } else {
      warnings.push(
        'personalization vector is empty or non-positive; falling back to the derived mass prior.',
      );
    }
  }

  if (sum(prior) === 0) {
    const totalMass = sum(mass);
    if (totalMass > 0) {
      for (let i = 0; i < count; i++) prior[i] = mass[i] / totalMass;
    } else {
      // No significance anywhere: the only honest prior left is uniform.
      warnings.push('no node carries seed mass; using a uniform teleport vector.');
      prior.fill(1 / count);
    }
  }

  // ── Transitions (|w| for the walk; sign for affinity) ───────────────────────
  const transitions: Transition[][] = Array.from({ length: count }, () => []);
  const outWeight = new Float64Array(count);

  for (const edge of graph.edges) {
    const from = indexOf.get(edge.from);
    const to = indexOf.get(edge.to);
    if (from === undefined || to === undefined) {
      // The graph builder only emits edges whose endpoints are nodes. If this
      // fires, a caller hand-built a graph — report it rather than crash.
      warnings.push(`edge ${edge.from} -> ${edge.to} has an endpoint outside the graph; skipped.`);
      continue;
    }
    const weight = Math.abs(edge.weight);
    if (!Number.isFinite(weight) || weight <= 0) continue;
    transitions[from].push({
      to,
      weight,
      sign: edge.sign,
      kind: edge.kind,
      from: edge.from,
      toId: edge.to,
    });
    outWeight[from] += weight;
  }

  // ── Power iteration ────────────────────────────────────────────────────────
  let scores = Float64Array.from(prior);
  let iterations = 0;
  let l1Delta = Number.POSITIVE_INFINITY;
  let converged = false;

  for (let iteration = 1; iteration <= maxIterations; iteration++) {
    iterations = iteration;
    const next = new Float64Array(count);

    // Teleport.
    const teleport = 1 - damping;
    for (let i = 0; i < count; i++) next[i] = teleport * prior[i];

    // Walk, accumulating leaked mass from out-degree-0 nodes.
    let leaked = 0;
    for (let i = 0; i < count; i++) {
      const contribution = scores[i];
      if (contribution === 0) continue;
      const total = outWeight[i];
      if (total === 0) {
        leaked += contribution;
        continue;
      }
      const share = (damping * contribution) / total;
      for (const edge of transitions[i]) {
        next[edge.to] += share * edge.weight;
      }
    }

    // Dangling redistribution through the teleport prior keeps Σ PR = 1.
    if (leaked > 0) {
      const redistributed = damping * leaked;
      for (let i = 0; i < count; i++) next[i] += redistributed * prior[i];
    }

    l1Delta = l1Distance(next, scores);
    scores = next;

    if (l1Delta < tolerance) {
      converged = true;
      break;
    }
  }

  if (!converged) {
    warnings.push(
      `rank did not converge in ${iterations} iterations (l1Delta ${l1Delta.toExponential(2)}); ` +
        'returning the last iterate.',
    );
  }

  // ── Affinity: the signed sum of the same contributions ─────────────────────
  //
  // This is where a `contradicts` edge is allowed to be negative. The pair stays
  // visible: both nodes have positive `scores`, and the refuted node's affinity
  // says what the incoming edge cost it.
  const affinity = new Float64Array(count);
  for (let i = 0; i < count; i++) {
    const total = outWeight[i];
    if (total === 0) continue;
    const share = (damping * scores[i]) / total;
    for (const edge of transitions[i]) {
      affinity[edge.to] += edge.sign * share * edge.weight;
    }
  }

  let danglingMass = 0;
  for (let i = 0; i < count; i++) if (outWeight[i] === 0) danglingMass += scores[i];

  const scoreMap = new Map<string, number>();
  const affinityMap = new Map<string, number>();
  ids.forEach((id, i) => {
    scoreMap.set(id, scores[i]);
    affinityMap.set(id, affinity[i]);
  });

  return {
    scores: scoreMap,
    affinity: affinityMap,
    iterations,
    converged,
    l1Delta,
    damping,
    danglingMass,
    warnings: [...graph.warnings, ...warnings],
    dangling: graph.dangling,
  };
}

/** Build the graph from definitions and rank it in one call. */
export function rankUniverses(
  universes: readonly Universe[],
  options: PageRankOptions = {},
): PageRankResult {
  return rank(buildUniverseGraph(universes), options);
}

/**
 * Provenance: which edges produced this node's score.
 *
 * A ranking that cannot show its provenance is a merge wearing a costume — the
 * same failure as a composition that cannot show where it diverges. `rank` here
 * includes the teleport term `(1 − d)·p(u)`, which is not an edge, so the
 * contributions sum to `rank − teleport` rather than to `rank` exactly.
 */
export function explainRank(
  graph: UniverseGraph,
  result: PageRankResult,
  id: string,
): RankExplanation {
  const rankValue = result.scores.get(id) ?? 0;
  if (!graph.nodes.has(id)) return { contributions: [], rank: rankValue };

  const damping = result.damping;
  // Recompute the out-weight of each source from the graph. `rank()` uses the
  // same edges, and the graph is immutable, so the shares agree bit for bit.
  const outWeight = new Map<string, number>();
  for (const edge of graph.edges) {
    outWeight.set(edge.from, (outWeight.get(edge.from) ?? 0) + Math.abs(edge.weight));
  }

  const contributions = graph.edges
    .filter((edge) => edge.to === id && graph.nodes.has(edge.from))
    .map((edge) => {
      const total = outWeight.get(edge.from) ?? 0;
      const sourceScore = result.scores.get(edge.from) ?? 0;
      const share = total > 0 ? (damping * sourceScore) / total : 0;
      return {
        from: edge.from,
        kind: edge.kind,
        sign: edge.sign,
        weight: edge.weight,
        contribution: edge.sign * share * Math.abs(edge.weight),
      } satisfies RankExplanation['contributions'][number];
    })
    .sort((a, b) => {
      const byMagnitude = Math.abs(b.contribution) - Math.abs(a.contribution);
      if (byMagnitude !== 0) return byMagnitude;
      return a.from < b.from ? -1 : a.from > b.from ? 1 : 0;
    });

  return { contributions, rank: rankValue };
}
