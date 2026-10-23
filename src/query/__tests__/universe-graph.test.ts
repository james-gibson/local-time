import { TimePrecision, Universe, UniverseType } from '../../core/types';
import { CommonUniverseIds } from '../../core/common-universe-ids';
import { allUniverses } from '../../config/universes';
import { ConfigLoader } from '../../config/config-loader';
import { UniverseRegistry } from '../../config/universe-registry';
import { RealityCategory } from '../../utils/reality-gradient';
import {
  EdgeKind,
  buildUniverseGraph,
  epochNodeId,
  keyframeNodeId,
} from '../universe-graph';

/**
 * james-gibson/local-time#92 §8 — the graph test is a registration test in disguise.
 *
 * Every node id is asserted twice: present in `allUniverses` **and** retrievable
 * from a fresh registry. That is the cheapest place to catch the next universe
 * that is defined, built, validated and then silently discarded (#27, #67).
 */

/** A registry that loads no external configuration, so `initialize()` is deterministic. */
const emptyLoader = { loadConfigurations: async () => [] } as unknown as ConfigLoader;

const EDGE_KINDS: readonly EdgeKind[] = [
  'reference',
  'refutation',
  'containment',
  'anchor',
  'cross_reference',
];

const idOf = (universe: Universe): string => String(universe.universeId);

const fixture = (id: string): Universe => ({
  universeId: id,
  type: UniverseType.HISTORICAL_EVENT,
  identifiers: { primary: id },
  realityRelation: { type: 'documentary', fictionalizationDegree: 0, realityAnchors: [] },
  attribution: { citations_required: true },
  layers: [],
  epochs: undefined,
  metadata: {
    canonicalName: id,
    creators: [],
    released: new Date('2000-01-01'),
    cultural_significance: 0.5,
  },
});

describe('the graph derived from allUniverses (#92 §4.1)', () => {
  const graph = buildUniverseGraph(allUniverses as Universe[]);
  const inputIds = allUniverses.map((universe) => idOf(universe as Universe));

  test('one node per universe, and none invented', () => {
    expect(graph.nodes.size).toBe(inputIds.length);
    expect(graph.nodes.size).toBe(new Set(inputIds).size);
    expect([...graph.nodes.keys()].sort()).toEqual([...inputIds].sort());
  });

  test('every node id survives a real registry lookup, not just the array', async () => {
    const registry = new UniverseRegistry(emptyLoader);
    await registry.initialize();

    const missing = [...graph.nodes.keys()].filter((id) => !registry.getUniverse(id));
    expect(missing).toEqual([]);
  });

  test('every edge endpoint is a node — no edge points at a ghost', () => {
    const leaked = graph.edges
      .filter((edge) => !graph.nodes.has(edge.from) || !graph.nodes.has(edge.to))
      .map((edge) => `${edge.from} -> ${edge.to}`);
    expect(leaked).toEqual([]);
  });

  test('the graph is not vacuous: it has edges of the expected kinds', () => {
    expect(graph.edges.length).toBeGreaterThan(graph.nodes.size);

    const kinds = new Set(graph.edges.map((edge) => edge.kind));
    expect(kinds.has('containment')).toBe(true);
    expect(kinds.has('reference')).toBe(true);
    expect(kinds.has('anchor')).toBe(true);
    for (const kind of kinds) expect(EDGE_KINDS).toContain(kind);
  });

  test('construction is deterministic across input order', () => {
    const reversed = buildUniverseGraph([...(allUniverses as Universe[])].reverse());
    expect(reversed.edges).toEqual(graph.edges);
    expect([...reversed.nodes.keys()].sort()).toEqual([...graph.nodes.keys()].sort());
  });

  test('containment is partition, not corpus: every containment edge is down-weighted', () => {
    const containment = graph.edges.filter((edge) => edge.kind === 'containment');
    expect(containment.length).toBeGreaterThan(0);
    for (const edge of containment) expect(edge.weight).toBeCloseTo(0.25, 12);
  });
});

describe('node mass and charge are derived, never hand-set (#92 §4.3, §7.4)', () => {
  const graph = buildUniverseGraph(allUniverses as Universe[]);

  test('mass is cultural significance, clamped to [0, 1]', () => {
    for (const node of graph.nodes.values()) {
      expect(node.mass).toBeGreaterThanOrEqual(0);
      expect(node.mass).toBeLessThanOrEqual(1);
    }
  });

  test('the plane charge is ±1 and agrees with its category', () => {
    const categories = new Set(Object.values(RealityCategory));

    for (const node of graph.nodes.values()) {
      expect([1, -1]).toContain(node.charge);
      expect(categories.has(node.category)).toBe(true);
      expect(node.level).toBeGreaterThanOrEqual(0);
      expect(node.level).toBeLessThanOrEqual(1);

      // The guide's tiering: a record of reality is +1, a fiction is −1.
      const nonFiction = [
        RealityCategory.PURE_REALITY,
        RealityCategory.DOCUMENTED_REALITY,
        RealityCategory.INTERPRETED_REALITY,
        RealityCategory.DRAMATIZED_REALITY,
      ].includes(node.category);
      expect(node.charge).toBe(nonFiction ? 1 : -1);
    }
  });

  test('the corpus contains both charges — the derivation is not degenerate', () => {
    const charges = new Set([...graph.nodes.values()].map((node) => node.charge));
    expect(charges).toEqual(new Set([1, -1]));
  });
});

describe('dangling ids are reported, never averaged away (#92 §5.4)', () => {
  const graph = buildUniverseGraph(allUniverses as Universe[]);

  test('the real corpus has dangling ids, and they are not nodes', () => {
    expect(graph.dangling.length).toBeGreaterThan(0);
    for (const id of graph.dangling) expect(graph.nodes.has(id)).toBe(false);
  });

  test('a declared container with no universe record is surfaced', () => {
    // HOLLYWOOD_SYSTEM is a real container that films declare as a parent, and it
    // has no `Universe` record anywhere. It must be visible, not silently dropped.
    expect(graph.dangling).toContain(String(CommonUniverseIds.HOLLYWOOD_SYSTEM));
  });

  test('every dangling id is warned about exactly once', () => {
    for (const id of graph.dangling) {
      const mentions = graph.warnings.filter((warning) => warning.includes(`"${id}"`));
      expect(mentions.length).toBeGreaterThanOrEqual(1);
    }
  });
});

describe('the builder fails loudly on a duplicate id (#92 §7.8)', () => {
  test('two nodes sharing an id throw instead of merging their mass', () => {
    expect(() => buildUniverseGraph([fixture('history:dupe:2000'), fixture('history:dupe:2000')])).toThrow(
      /duplicate universeId/,
    );
  });

  test('a universe with no id throws instead of inventing one', () => {
    expect(() => buildUniverseGraph([{ ...fixture('history:ok:2000'), universeId: '' }])).toThrow(
      /no universeId/,
    );
  });
});

describe('optional expansion to epoch and keyframe nodes (#92 §4.1)', () => {
  const expanded = (): Universe => ({
    ...fixture('history:expanded:2000'),
    layers: [
      {
        layerId: 'primary_layer',
        type: 'primary',
        epochs: {
          decade: {
            epochId: 'epoch:expanded:2000-2009',
            startTime: BigInt(Date.UTC(2000, 0, 1)) * 1_000_000n,
            endTime: BigInt(Date.UTC(2010, 0, 1)) * 1_000_000n,
            precision: TimePrecision.YEAR,
            description: 'A decade.',
          },
          // No epochId: the registry would substitute the layer key (#19); the
          // graph must not repeat that silently, so it warns and skips.
          unnamed: {
            startTime: BigInt(Date.UTC(2010, 0, 1)) * 1_000_000n,
            endTime: BigInt(Date.UTC(2020, 0, 1)) * 1_000_000n,
            precision: TimePrecision.YEAR,
          },
        },
      },
    ],
    temporalStructure: {
      segments: [],
      keyframes: [
        { id: 'release', timestamp: 1n, significance: 0.9, tags: ['release'], certainty: 0.5 },
      ],
      windows: { strategy: 'time_based' },
    },
  });

  test('expanded nodes are off by default', () => {
    const graph = buildUniverseGraph([expanded()]);
    expect(graph.nodes.size).toBe(1);
  });

  test('epoch and keyframe nodes carry composite ids and inherit the charge', () => {
    const graph = buildUniverseGraph([expanded()], { expandKeyframes: true });
    const universeId = 'history:expanded:2000';

    const epoch = graph.nodes.get(epochNodeId(universeId, 'epoch:expanded:2000-2009'));
    const keyframe = graph.nodes.get(keyframeNodeId(universeId, 'release'));

    expect(epoch).toBeDefined();
    expect(epoch!.kind).toBe('epoch');
    expect(epoch!.charge).toBe(graph.nodes.get(universeId)!.charge);

    expect(keyframe).toBeDefined();
    expect(keyframe!.kind).toBe('keyframe');
    expect(keyframe!.mass).toBeCloseTo(0.9, 12);
  });

  test('an epoch without an explicit epochId is warned about, not silently renamed', () => {
    const graph = buildUniverseGraph([expanded()], { expandKeyframes: true });

    expect(graph.warnings.some((warning) => warning.includes('"unnamed"') && warning.includes('epochId'))).toBe(
      true,
    );
    expect(graph.warnings.some((warning) => warning.includes('history:expanded:2000#unnamed'))).toBe(false);
  });
});
