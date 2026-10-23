import { CommonUniverseIds } from '../core/common-universe-ids';
import { Universe, UniverseReference } from '../core/types';
import { isValidUniverseId } from '../core/universe-ids';
import { RealityCategory, RealityGradientAnalyzer } from '../utils/reality-gradient';

/**
 * The universe graph: nodes and edges derived from the definitions.
 *
 * james-gibson/local-time#92, part one of two. `universe-pagerank.ts` walks this
 * graph; this module only builds it, and builds nothing at import time (#45).
 *
 * ## Why the graph is derived
 *
 * The guide's rule is that the same definition is the retrieval schema: there are
 * three projections of one source — registry, composition, retrieval — and a fact
 * that must be duplicated to be registered will also be double-embedded and skew
 * retrieval (#76). Ranking is the retrieval projection, so every node and edge
 * here comes from a field that already exists:
 *
 * | Source field | Edge kind | Weight | Sign |
 * | --- | --- | --- | --- |
 * | `connections.references[].type` (temporal kinds) | `cross_reference` | type weight | +1 |
 * | `connections.references[].type` (everything else) | `reference` | type weight | +1 |
 * | `connections.references[].type === 'CONTRADICTS'` | `refutation` | type weight | **−1** |
 * | `connections.natural.parentUniverses`, `metadata.connections` (`member_of`) | `containment` | `containmentWeight` (0.25) | +1 |
 * | `realityRelation.realityAnchors[]` | `anchor` | `confidence` | +1 |
 * | `TemporalLayer.reality_correspondence.to` (#75) | `cross_reference` | `accuracy` | +1 |
 * | keyframe `targetUniverseId` (only with `expandKeyframes`) | `cross_reference` | `certainty` | +1 |
 *
 * Nothing here is hand-set: mass is `metadata.cultural_significance`, the gradient
 * is `RealityGradientAnalyzer.analyzeUniverse`, and the weights are the
 * confidences the definitions already carry.
 *
 * ## Two corrections to the ticket's field survey
 *
 * - `TemporalReference.anchors[]` is not a field of `Universe`. `TemporalReference`
 *   is a standalone type (`src/core/types.ts`) with no producers on a universe, so
 *   there is no such edge to read. The cross-universe edges that *do* exist are
 *   `connections.references`, which is where every authored edge in the corpus
 *   lives, and `TemporalLayer.reality_correspondence` (#75). Temporal reference
 *   *types* (`IN_A_PRIOR_KEYFRAME`, `TEMPORAL_PARADOX`, …) are mapped to the
 *   `cross_reference` kind so the distinction the ticket wanted is preserved.
 * - `charge` is **±1**, not `RealityGradient.level`. The guide is explicit
 *   (#76, #90): the gradient `level` is the graded weight, and the plane charge is
 *   a binary ±1 tier derived from it — a fractional charge cannot enter the
 *   admissibility graph. So a node carries `level` (continuous, for weighting),
 *   `category` (the discrete plane key), and `charge` (+1 non-fiction / −1
 *   fiction). The raw float is never used as a charge.
 *
 * ## Dangling ids are reported, never averaged away
 *
 * A referenced id that is not in the input is the registration defect class
 * (#27, #67): it is present in the array and absent from every query, or it was
 * defined and silently discarded. Two cases are known in the corpus — ids in the
 * KB/lore set with no registry record (#69), and container ids declared by
 * `CommonUniverseIds` (`HOLLYWOOD_SYSTEM`, `US_HISTORY`, …) which are real
 * containers but have no `Universe` record. Both must surface in
 * `graph.dangling` and in `warnings`.
 *
 * A dangling endpoint is **not** a node: the graph must not invent a record that
 * nothing registered. Its edge is therefore excluded from the walk (there is no
 * node to walk to) and the exclusion is reported, not silent.
 *
 * ## What this graph is not
 *
 * Edges are relationships, not votes: `contradicts` is the opposite of a vote and
 * is carried as `sign: -1` for the affinity result, never folded into the walk
 * (`universe-pagerank.ts`, §5.3 of the ticket).
 *
 * Temporal co-occurrence edges are deliberately absent. `TemporalLayer.subuniverses`
 * was retired (#74), and `WindowAlias` / `temporalWindows` are unfilled (#82), so
 * there is nothing to read. Approximating them by date overlap would be inventing
 * an edge (#35).
 *
 * Research Sources (algorithm):
 * - Page, Brin, Motwani & Winograd, "The PageRank Citation Ranking: Bringing
 *   Order to the Web" (Stanford InfoLab, 1998) — formulation, damping,
 *   personalization.
 * - Brin & Page, "The Anatomy of a Large-Scale Hypertextual Web Search Engine"
 *   (WWW 1998) — practical convergence.
 * - Haveliwala, "Topic-Sensitive PageRank" (WWW 2002) — the personalization
 *   vector used for query-time ranking.
 * - Langville & Meyer, "Google's PageRank and Beyond" (Princeton, 2006) —
 *   convergence bounds and damping sensitivity.
 * - Bianchini, Gori & Scarselli, "Inside PageRank" (ACM TOIT, 2005) — dangling
 *   node handling.
 * - Boldi, Santini & Vigna, "PageRank as a Function of the Damping Factor"
 *   (WWW 2005) — why damping is an option, not a constant.
 * - Jeh & Widom, "SimRank: A Measure of Structural-Context Similarity" (KDD
 *   2002) — the obvious follow-on, and explicitly not what this module computes.
 */

export type NodeKind = 'universe' | 'epoch' | 'keyframe';
export type EdgeKind = 'reference' | 'refutation' | 'containment' | 'anchor' | 'cross_reference';

export interface UniverseGraphNode {
  /** Branded UniverseId (or `universeId#epochId` when expanded) — never a new id grammar. */
  id: string;
  kind: NodeKind;
  /** Seed mass: `metadata.cultural_significance`, clamped to [0, 1]. */
  mass: number;
  /** The graded weight: `RealityGradientAnalyzer.analyzeUniverse(u).level`, 0-1. */
  level: number;
  /** The plane charge, tiered from `level`/`category`: +1 non-fiction, −1 fiction. */
  charge: 1 | -1;
  /** The discrete plane key, so a caller never has to re-derive it from the float. */
  category: RealityCategory;
}

export interface UniverseGraphEdge {
  from: string;
  to: string;
  kind: EdgeKind;
  /** Derived: reference-type weight × confidence, or the containment weight. */
  weight: number;
  /** −1 only for `refutation` (`CONTRADICTS`); the walk uses `|weight|`. */
  sign: 1 | -1;
}

export interface UniverseGraph {
  nodes: ReadonlyMap<string, UniverseGraphNode>;
  edges: readonly UniverseGraphEdge[];
  /** Referenced but not in the input. Sorted, unique, and always warned about. */
  dangling: readonly string[];
  warnings: readonly string[];
}

export interface UniverseGraphOptions {
  /** Add epoch and keyframe nodes (default false). */
  expandKeyframes?: boolean;
  /** Emit containment edges (default true). */
  includeContainment?: boolean;
  /**
   * Weight of a containment edge (default 0.25). Containment is *partition, not
   * corpus* (#74): a large collection must not dominate by membership count alone,
   * so membership is always cheaper than an authored reference.
   */
  containmentWeight?: number;
}

/**
 * Reference-type weights.
 *
 * Derived from the vocabulary in `ReferenceType` and the uppercase types the
 * corpus authors. A type not listed falls back to `DEFAULT_REFERENCE_WEIGHT`, so
 * adding a new type never silently drops its edge — it just scores neutrally until
 * someone decides otherwise.
 */
const DEFAULT_REFERENCE_WEIGHT = 0.6;

const REFERENCE_TYPE_WEIGHTS: Readonly<Record<string, number>> = {
  // The target is the source material: the strongest authored claim.
  INSPIRED_BY: 1.0,
  BASED_ON: 1.0,
  DEPICTS: 1.0,
  DOCUMENTS: 1.0,
  ADAPTED_FROM: 1.0,
  // Derivative works and supersession: strong, but a step removed.
  REMAKE_OF: 0.8,
  PARODIES: 0.8,
  REINTERPRETS: 0.8,
  HOMAGE: 0.7,
  SUPERSEDES: 0.8,
  AMENDS: 0.8,
  REPEALS: 0.8,
  // Influence and response.
  INFLUENCED: 0.7,
  EXTENDS: 0.7,
  RESPONDS_TO: 0.7,
  CREATED_IN_RESPONSE_TO: 0.7,
  INSTANTIATES: 0.6,
  THEMATICALLY_LINKED: 0.4,
  // Corporate or incidental facts. True edges, but not creative influence, so a
  // filmography must not outrank a work because it has a long distributor chain.
  DISTRIBUTED_BY: 0.5,
  CONSOLIDATED_WITH: 0.5,
  CONTEMPORARY_OF: 0.5,
  PLAYED_WITH: 0.5,
  RUNS_ON: 0.6,
};

/**
 * Reference types that describe a *temporal* relation — the closest thing the
 * corpus has to the ticket's `cross_reference` edges.
 */
const TEMPORAL_REFERENCE_TYPES = new Set<string>([
  'IN_A_PRIOR_KEYFRAME',
  'TEMPORAL_PARADOX',
  'CAUSAL_LOOP',
  'ANACHRONISM',
  'OBJECT_TRANSPORT',
  'IDENTITY_CONFUSION',
  'PREDICTIVE_REFERENCE',
  'TEMPORAL_IRONY',
]);

const DEFAULT_CONTAINMENT_WEIGHT = 0.25;

const clamp01 = (value: number): number => (value < 0 ? 0 : value > 1 ? 1 : value);

const finiteOr = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback;

/**
 * Tier the gradient to the plane charge the guide requires (#76, #90).
 *
 * `+1` while the work is presented as a record of reality — pure record through
 * docudrama — and `−1` once it is fictional. The boundary is the category, not a
 * hand-tuned float, so the charge is reproducible and always agrees with the level.
 */
const chargeFor = (category: RealityCategory): 1 | -1 => {
  switch (category) {
    case RealityCategory.PURE_REALITY:
    case RealityCategory.DOCUMENTED_REALITY:
    case RealityCategory.INTERPRETED_REALITY:
    case RealityCategory.DRAMATIZED_REALITY:
      return 1;
    default:
      return -1;
  }
};

/** `universeId#epochId` / `universeId#keyframe:id`. `#` cannot occur in a universeId. */
export const epochNodeId = (universeId: string, epochId: string): string =>
  `${universeId}#${epochId}`;

export const keyframeNodeId = (universeId: string, keyframeId: string): string =>
  `${universeId}#keyframe:${keyframeId}`;

const normaliseReferenceType = (type: unknown): string =>
  typeof type === 'string' ? type.trim().toUpperCase() : '';

const referenceWeight = (type: string, reference: UniverseReference): number => {
  const base = REFERENCE_TYPE_WEIGHTS[type] ?? DEFAULT_REFERENCE_WEIGHT;
  const confidence = clamp01(finiteOr(reference.confidence, 1));
  return base * confidence;
};

/** Build the universe graph from definitions. Pure: no module-scope work, no I/O. */
export function buildUniverseGraph(
  universes: readonly Universe[],
  options: UniverseGraphOptions = {},
): UniverseGraph {
  const expandKeyframes = options.expandKeyframes ?? false;
  const includeContainment = options.includeContainment ?? true;
  const containmentWeight = clamp01(finiteOr(options.containmentWeight, DEFAULT_CONTAINMENT_WEIGHT));

  const nodes = new Map<string, UniverseGraphNode>();
  const edges: UniverseGraphEdge[] = [];
  const unreferenced = new Set<string>();
  const warnings: string[] = [];

  // ── 1. Universe nodes ────────────────────────────────────────────────────────
  for (const universe of universes) {
    const id = String(universe.universeId ?? '');
    if (!id) {
      throw new Error('buildUniverseGraph: a universe has no universeId; refusing to invent one.');
    }
    if (nodes.has(id)) {
      // #7.8: two nodes sharing an id silently merge their mass — and a duplicate
      // id has already forced one lossy fold in this repository (#73). Fail loudly.
      throw new Error(`buildUniverseGraph: duplicate universeId "${id}" in the input.`);
    }

    const gradient = RealityGradientAnalyzer.analyzeUniverse(universe);
    const level = clamp01(finiteOr(gradient.level, universe.realityRelation?.fictionalizationDegree ?? 1));
    const category = gradient.category ?? RealityCategory.PURE_FANTASY;
    if (!gradient.category) {
      warnings.push(`universe "${id}" has no gradient category; treated as ${category}.`);
    }

    nodes.set(id, {
      id,
      kind: 'universe',
      mass: clamp01(finiteOr(universe.metadata?.cultural_significance, 0)),
      level,
      charge: chargeFor(category),
      category,
    });
  }

  // ── 2. Expanded epoch / keyframe nodes ──────────────────────────────────────
  if (expandKeyframes) {
    for (const universe of universes) {
      const universeId = String(universe.universeId);
      const parent = nodes.get(universeId)!;

      const seenEpochs = new Set<string>();
      for (const layer of universe.layers ?? []) {
        for (const [key, epoch] of Object.entries(layer.epochs ?? {})) {
          const epochId = (epoch as { epochId?: string }).epochId;
          if (!epochId) {
            // #19: the registry substitutes the layer key, which silently changes
            // what every reference to the epoch means. Do not repeat that here.
            warnings.push(
              `universe "${universeId}" epoch "${key}" has no explicit epochId; epoch node skipped.`,
            );
            continue;
          }
          if (seenEpochs.has(epochId)) {
            warnings.push(`universe "${universeId}" repeats epochId "${epochId}"; node kept once.`);
            continue;
          }
          seenEpochs.add(epochId);

          const id = epochNodeId(universeId, epochId);
          nodes.set(id, {
            id,
            kind: 'epoch',
            // An epoch has no significance of its own; it inherits the weight and
            // charge of the universe it belongs to.
            mass: 0,
            level: parent.level,
            charge: parent.charge,
            category: parent.category,
          });
          edges.push({ from: universeId, to: id, kind: 'containment', weight: containmentWeight, sign: 1 });
        }
      }

      const seenKeyframes = new Set<string>();
      for (const keyframe of universe.temporalStructure?.keyframes ?? []) {
        if (seenKeyframes.has(keyframe.id)) {
          warnings.push(`universe "${universeId}" repeats keyframe id "${keyframe.id}"; node kept once.`);
          continue;
        }
        seenKeyframes.add(keyframe.id);

        const id = keyframeNodeId(universeId, keyframe.id);
        nodes.set(id, {
          id,
          kind: 'keyframe',
          // A moment's significance *is* its mass, and its certainty is the edge
          // weight — the tags are not the corpus (#77).
          mass: clamp01(finiteOr(keyframe.significance, 0)),
          level: parent.level,
          charge: parent.charge,
          category: parent.category,
        });
        edges.push({
          from: universeId,
          to: id,
          kind: 'containment',
          weight: containmentWeight * clamp01(finiteOr(keyframe.certainty, 1)),
          sign: 1,
        });

        // A keyframe may point at a moment in another universe (#3/#41).
        const target = (keyframe as { targetUniverseId?: string }).targetUniverseId;
        if (typeof target === 'string' && target.trim() !== '') {
          addTargetedEdge(edges, nodes, unreferenced, warnings, {
            from: id,
            to: target.trim(),
            kind: 'cross_reference',
            weight: clamp01(finiteOr(keyframe.certainty, 1)),
            sign: 1,
          });
        }
      }
    }
  }

  // ── 3. Authored edges ──────────────────────────────────────────────────────
  for (const universe of universes) {
    const from = String(universe.universeId);

    if (includeContainment) {
      for (const parent of declaredParents(universe, warnings)) {
        addTargetedEdge(edges, nodes, unreferenced, warnings, {
          from,
          to: parent,
          kind: 'containment',
          weight: containmentWeight,
          sign: 1,
        });
      }
    }

    for (const reference of universe.connections?.references ?? []) {
      const target = typeof reference?.targetUniverseId === 'string' ? reference.targetUniverseId.trim() : '';
      if (!target) {
        warnings.push(`universe "${from}" has a reference with no targetUniverseId; ignored.`);
        continue;
      }
      const type = normaliseReferenceType(reference.type);
      const sign: 1 | -1 = type === 'CONTRADICTS' ? -1 : 1;
      const kind: EdgeKind =
        sign === -1 ? 'refutation' : TEMPORAL_REFERENCE_TYPES.has(type) ? 'cross_reference' : 'reference';
      addTargetedEdge(edges, nodes, unreferenced, warnings, {
        from,
        to: target,
        kind,
        weight: referenceWeight(type, reference),
        sign,
      });
    }

    for (const anchor of universe.realityRelation?.realityAnchors ?? []) {
      const target = typeof anchor?.realEventId === 'string' ? anchor.realEventId.trim() : '';
      if (!target) {
        warnings.push(`universe "${from}" has a reality anchor with no realEventId; ignored.`);
        continue;
      }
      addTargetedEdge(edges, nodes, unreferenced, warnings, {
        from,
        to: target,
        kind: 'anchor',
        weight: clamp01(finiteOr(anchor.confidence, 0.5)),
        sign: 1,
      });
    }

    // Composition overlays (#75): a layer's `reality_correspondence.to` names the
    // universe it corresponds to. That is an edge in the definitions, and the
    // accuracy is its weight.
    for (const layer of universe.layers ?? []) {
      const correspondence = layer?.reality_correspondence;
      const target = typeof correspondence?.to === 'string' ? correspondence.to.trim() : '';
      if (!target) continue;
      addTargetedEdge(edges, nodes, unreferenced, warnings, {
        from,
        to: target,
        kind: 'cross_reference',
        weight: clamp01(finiteOr(correspondence?.accuracy, 1)),
        sign: 1,
      });
    }
  }

  // ── 4. Determinism ──────────────────────────────────────────────────────────
  //
  // The ranker accumulates floating point in list order, so the edge list must not
  // depend on input order. Sorting here makes the whole pipeline bit-identical
  // across runs and across insertion orders (ticket §5.2).
  const orderedEdges = edges.slice().sort(compareEdges);

  const dangling = [...unreferenced]
    .filter((id) => !nodes.has(id))
    .sort();

  for (const id of dangling) {
    warnings.push(
      `referenced id "${id}" is not a registered universe; its edges are excluded from the walk ` +
        'and it is not ranked. This is the defined-but-not-wired class of defect (#27, #67, #69).',
    );
  }

  return { nodes, edges: orderedEdges, dangling, warnings };
}

interface TargetedEdge {
  from: string;
  to: string;
  kind: EdgeKind;
  weight: number;
  sign: 1 | -1;
}

/**
 * Record an edge whose shadow may fall outside the node set.
 *
 * A target that is not a node cannot be walked to, so the edge is excluded from
 * the walk — but it is recorded as dangling and warned about, which is the whole
 * point of the check (ticket §5.4).
 */
function addTargetedEdge(
  edges: UniverseGraphEdge[],
  nodes: ReadonlyMap<string, UniverseGraphNode>,
  unreferenced: Set<string>,
  warnings: string[],
  edge: TargetedEdge,
): void {
  if (!isValidUniverseId(edge.to)) {
    warnings.push(
      `edge target "${edge.to}" is not a valid universe id; excluded from the graph.`,
    );
    // A malformed target is still a missing node as far as ranking is concerned.
    unreferenced.add(edge.to);
    return;
  }
  if (!Number.isFinite(edge.weight) || edge.weight <= 0) {
    warnings.push(`edge ${edge.from} -> ${edge.to} has no positive weight; excluded.`);
    return;
  }
  if (!nodes.has(edge.to)) {
    // There is no node to walk to. The edge is excluded and the id is reported as
    // dangling; the per-id warning is emitted once, after the build.
    unreferenced.add(edge.to);
    return;
  }
  edges.push(edge);
}

/** Every container a universe declares, from either author path (#74, #133). */
function declaredParents(universe: Universe, warnings: string[]): string[] {
  const declared: unknown[] = [];

  const connections = universe.connections;
  if (connections && typeof connections === 'object' && !Array.isArray(connections)) {
    declared.push(...(connections.natural?.parentUniverses ?? []));
  }

  // The builder's legacy `addConnection({ type: 'member_of' })` lands here; the
  // registry reads it too, so the graph must not miss the same edge.
  const metadataConnections = (universe.metadata as { connections?: unknown } | undefined)?.connections;
  for (const entry of Array.isArray(metadataConnections) ? metadataConnections : []) {
    const connection = entry as { type?: unknown; targetUniverseId?: unknown } | null;
    if (connection?.type === 'member_of' && typeof connection.targetUniverseId === 'string') {
      declared.push(connection.targetUniverseId);
    }
  }

  const resolved: string[] = [];
  for (const parent of declared) {
    if (typeof parent !== 'string' || parent.trim() === '') continue;
    // Mirror the registry: a symbolic container name resolves through
    // `CommonUniverseIds`, an id resolves to itself, and an unknown name is
    // reported rather than dropped (#133).
    const id = CommonUniverseIds.resolveDeclaredName(parent.trim());
    if (id) {
      resolved.push(String(id));
    } else {
      warnings.push(
        `universe "${String(universe.universeId)}" declares parent "${parent}", ` +
          'which is neither a universe id nor a known container name; excluded.',
      );
      resolved.push(parent.trim());
    }
  }
  return resolved;
}

function compareEdges(a: UniverseGraphEdge, b: UniverseGraphEdge): number {
  if (a.from !== b.from) return a.from < b.from ? -1 : 1;
  if (a.to !== b.to) return a.to < b.to ? -1 : 1;
  if (a.kind !== b.kind) return a.kind < b.kind ? -1 : 1;
  if (a.sign !== b.sign) return a.sign - b.sign;
  if (a.weight !== b.weight) return a.weight - b.weight;
  return 0;
}
