import { TimePrecision, Universe, UniverseType } from '../../core/types';
import { buildUniverseGraph } from '../universe-graph';
import { rank } from '../universe-pagerank';

/**
 * james-gibson/local-time#92 §5.4, §8 — dangling and malformed targets.
 *
 * An edge endpoint that is not a node cannot be walked to. The rule this suite
 * pins is that it is *reported*: it lands in `graph.dangling`, it is warned
 * about, and the build still succeeds. Dropping it silently is the registration
 * defect class (#27, #67, #69) — a reference that is present in the definitions
 * and invisible in every query.
 */

const REGISTERED = 'history:dangling_fixture:2000';
const UNREGISTERED = 'history:dangling_missing:1999';
const MISSING_PARENT = 'history:dangling_parent:1999';
const MALFORMED = 'not_a_universe_id';

const base = (overrides: Partial<Universe> = {}): Universe => ({
  universeId: REGISTERED,
  type: UniverseType.HISTORICAL_EVENT,
  identifiers: { primary: REGISTERED },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0,
    realityAnchors: [{ realEventId: UNREGISTERED, relationshipType: 'documents', confidence: 0.9 }],
  },
  attribution: { citations_required: true },
  layers: [],
  epochs: undefined,
  connections: {
    natural: { parentUniverses: [MISSING_PARENT, 'NOT_A_CONTAINER'] as never },
    references: [
      { type: 'INSPIRED_BY', targetUniverseId: UNREGISTERED, confidence: 1 },
      { type: 'PARODIES', targetUniverseId: MALFORMED },
    ],
  },
  metadata: {
    canonicalName: REGISTERED,
    creators: [],
    released: new Date('2000-01-01'),
    cultural_significance: 0.5,
  },
  ...overrides,
});

describe('referenced-but-unregistered targets (#92 §5.4)', () => {
  test('they land in dangling, with a warning, and the build does not throw', () => {
    const graph = buildUniverseGraph([base()]);

    expect(graph.dangling).toContain(UNREGISTERED);
    expect(graph.dangling).toContain(MISSING_PARENT);
    expect(graph.warnings.some((warning) => warning.includes(UNREGISTERED))).toBe(true);
    expect(graph.warnings.some((warning) => warning.includes('is not a registered universe'))).toBe(true);
  });

  test('a malformed target is reported too, not dropped', () => {
    const graph = buildUniverseGraph([base()]);

    expect(graph.dangling).toContain(MALFORMED);
    expect(
      graph.warnings.some(
        (warning) => warning.includes(MALFORMED) && warning.includes('not a valid universe id'),
      ),
    ).toBe(true);
  });

  test('an unknown declared parent name is reported rather than resolved silently', () => {
    const graph = buildUniverseGraph([base()]);

    expect(graph.dangling).toContain('NOT_A_CONTAINER');
    expect(
      graph.warnings.some(
        (warning) => warning.includes('NOT_A_CONTAINER') && warning.includes('known container name'),
      ),
    ).toBe(true);
  });

  test('no edge in the graph points at a dangling id', () => {
    const graph = buildUniverseGraph([base()]);

    for (const edge of graph.edges) {
      expect(graph.nodes.has(edge.from)).toBe(true);
      expect(graph.nodes.has(edge.to)).toBe(true);
    }
    expect(graph.edges).toEqual([]);
  });

  test('dangling is sorted and unique', () => {
    const graph = buildUniverseGraph([base()]);

    expect(graph.dangling).toEqual([...new Set(graph.dangling)].sort());
  });

  test('ranking still returns a distribution, and passes the gaps through', () => {
    const graph = buildUniverseGraph([base()]);
    const result = rank(graph);

    expect(result.scores.size).toBe(1);
    expect(result.scores.get(REGISTERED)).toBeCloseTo(1, 12);
    expect(result.dangling).toEqual(graph.dangling);
  });
});

describe('a dangling link does not remove the registered node', () => {
  test('a second registered universe is still ranked when one target is missing', () => {
    const graph = buildUniverseGraph([
      base(),
      base({ universeId: 'history:dangling_fixture_b:2000', realityRelation: { type: 'documentary', fictionalizationDegree: 0, realityAnchors: [] }, connections: undefined }),
    ]);

    expect(graph.nodes.size).toBe(2);
    expect(graph.nodes.has('history:dangling_fixture_b:2000')).toBe(true);
    expect(graph.dangling).toContain(UNREGISTERED);
  });
});

describe('expanded keyframes can dangle too', () => {
  test('a keyframe target outside the graph is reported and excluded', () => {
    const universe = base({
      temporalStructure: {
        segments: [],
        keyframes: [
          {
            id: 'points_elsewhere',
            timestamp: 1n,
            significance: 0.8,
            tags: ['reference'],
            targetUniverseId: UNREGISTERED as never,
          },
        ],
        windows: { strategy: 'time_based' },
      },
      layers: [
        {
          layerId: 'primary_layer',
          type: 'primary',
          epochs: {
            decade: {
              epochId: 'epoch:dangling:2000-2009',
              startTime: BigInt(Date.UTC(2000, 0, 1)) * 1_000_000n,
              endTime: BigInt(Date.UTC(2010, 0, 1)) * 1_000_000n,
              precision: TimePrecision.YEAR,
            },
          },
        },
      ],
    });

    const graph = buildUniverseGraph([universe], { expandKeyframes: true });

    expect(graph.dangling).toContain(UNREGISTERED);
    const keyframeEdges = graph.edges.filter((edge) => edge.from.includes('#keyframe:'));
    expect(keyframeEdges.some((edge) => edge.to === UNREGISTERED)).toBe(false);
  });
});
