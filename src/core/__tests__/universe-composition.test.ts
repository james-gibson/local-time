import { KeyframeType, TimePrecision, UniverseType, type Universe } from '../types';
import { isValidUniverseId } from '../universe-ids';
import {
  composeUniverse,
  composeUniverseId,
  defaultLayer,
  groundTruth,
  viewOf,
  type CompositionOverlay,
} from '../universe-composition';

/** Decimal years → nanoseconds, the same arithmetic the fixture universes use. */
const ns = (year: number): bigint => BigInt(Math.round((year - 1970) * 365.2425 * 86400 * 1e9));

/** A serialiser that survives the BigInt timestamps, for before/after comparisons. */
const snapshot = (value: unknown): string =>
  JSON.stringify(value, (_key, item) => (typeof item === 'bigint' ? item.toString() : item));

const BASE = '20th_century_fox:titanic:1997';
const PREMISE = 'history:y2k_theatre_shutdown:2000';
const ALT = 'history:alt_exhibition:2001';

const base: Universe = {
  universeId: BASE,
  type: UniverseType.FILM,
  identifiers: { primary: BASE, aliases: ['Titanic'] },
  realityRelation: { type: 'documentary', fictionalizationDegree: 0.1, realityAnchors: [] },
  attribution: {
    copyright: { holders: ['20th Century Fox'], year: 1997, status: 'active' },
    citations_required: true,
    sources: ['studio release record'],
  },
  layers: [
    {
      layerId: 'runtime',
      type: 'primary',
      epochs: {
        film: {
          epochId: 'titanic:runtime',
          startTime: 0n,
          endTime: 194n * 60n * 1_000_000_000n,
          precision: TimePrecision.MINUTE,
        },
      },
    },
    {
      layerId: 'narrative',
      type: 'primary',
      epochs: {
        voyage: {
          epochId: 'titanic:voyage',
          startTime: ns(1912),
          endTime: ns(1912),
          precision: TimePrecision.DAY,
        },
      },
    },
  ],
  epochs: undefined,
  temporalStructure: {
    segments: [{ id: 'act-1', start: 0n, end: 60n * 60n * 1_000_000_000n, type: 'act' }],
    keyframes: [
      {
        id: 'us-premiere',
        timestamp: ns(1997),
        significance: 0.8,
        tags: ['release'],
        type: KeyframeType.RELEASE,
      },
      { id: 'us-wide-release', timestamp: ns(1997), significance: 0.9, tags: ['release'] },
    ],
    windows: { strategy: 'scene_based' },
  },
  metadata: {
    canonicalName: 'Titanic',
    creators: ['James Cameron'],
    released: new Date('1997-12-19'),
    cultural_significance: 0.9,
  },
};

const premise: Universe = {
  universeId: PREMISE,
  type: UniverseType.HISTORICAL_EVENT,
  identifiers: { primary: PREMISE },
  realityRelation: { type: 'pure_fiction', fictionalizationDegree: 1, realityAnchors: [] },
  attribution: { public_domain: true, citations_required: false },
  layers: [
    {
      layerId: 'premise',
      type: 'primary',
      epochs: {
        shutdown: {
          epochId: 'titanic:voyage',
          startTime: ns(2000),
          endTime: ns(2000),
          precision: TimePrecision.DAY,
        },
      },
    },
  ],
  epochs: undefined,
  temporalStructure: {
    segments: [{ id: 'act-1', start: 0n, end: 10n * 60n * 1_000_000_000n, type: 'scene' }],
    keyframes: [
      { id: 'us-wide-release', timestamp: ns(2000), significance: 1, tags: ['shutdown'] },
      { id: 'projection_shutdown', timestamp: ns(2000), significance: 1, tags: ['shutdown'] },
    ],
    windows: { strategy: 'time_based' },
  },
  metadata: {
    canonicalName: 'Y2K theatre shutdown',
    creators: ['test fixture'],
    released: new Date('2000-01-01'),
    cultural_significance: 0,
  },
};

const alt: Universe = {
  universeId: ALT,
  type: UniverseType.HISTORICAL_EVENT,
  identifiers: { primary: ALT },
  realityRelation: { type: 'pure_fiction', fictionalizationDegree: 1, realityAnchors: [] },
  attribution: { public_domain: true, citations_required: false },
  layers: [{ layerId: 'alt', type: 'primary', epochs: {} }],
  epochs: undefined,
  temporalStructure: {
    segments: [],
    keyframes: [{ id: 'us-wide-release', timestamp: ns(2001), significance: 1, tags: ['alt'] }],
    windows: { strategy: 'time_based' },
  },
  metadata: {
    canonicalName: 'Alternative exhibition',
    creators: ['test fixture'],
    released: new Date('2001-01-01'),
    cultural_significance: 0,
  },
};

const keyframe = (universe: Universe, id: string) =>
  (universe.temporalStructure?.keyframes ?? []).find((entry) => entry.id === id);

describe('the derived id is computed, not declared (#75)', () => {
  test('is a valid system id and is deterministic', () => {
    const declaration = {
      universeId: PREMISE,
      layerType: 'recreation' as const,
      accuracy: 0.5,
      overrides: [],
    };
    const first = composeUniverseId(BASE, [declaration]);
    const second = composeUniverseId(BASE, [declaration]);
    expect(first).toBe(second);
    expect(isValidUniverseId(first)).toBe(true);
    expect(String(first)).toMatch(/^system:composed_[0-9a-f]{16}:v1$/);
  });

  test('changes when the declaration changes, not just the sources', () => {
    const low = composeUniverseId(BASE, [
      { universeId: PREMISE, layerType: 'recreation', accuracy: 0.2, overrides: [] },
    ]);
    const high = composeUniverseId(BASE, [
      { universeId: PREMISE, layerType: 'recreation', accuracy: 0.9, overrides: [] },
    ]);
    expect(low).not.toBe(high);
  });

  test('composeUniverse uses that id as its primary identifier', () => {
    const composed = composeUniverse(base, [{ universe: premise }]);
    expect(composed.universeId).toBe(composed.identifiers.primary);
    expect(isValidUniverseId(String(composed.universeId))).toBe(true);
  });

  test('the same composition twice is byte-identical', () => {
    const first = composeUniverse(base, [{ universe: premise }]);
    const second = composeUniverse(base, [{ universe: premise }]);
    expect(snapshot(first)).toBe(snapshot(second));
  });

  test('neither input is mutated', () => {
    const beforeBase = snapshot(base);
    const beforeOverlay = snapshot(premise);
    composeUniverse(base, [{ universe: premise }]);
    expect(snapshot(base)).toBe(beforeBase);
    expect(snapshot(premise)).toBe(beforeOverlay);
  });
});

describe('the base is retained and the overlay is a layer (#75, #76)', () => {
  const composed = composeUniverse(base, [
    { universe: premise, deviations: ['the premise declares no exhibition after 2000'] },
  ]);

  test('every base layer survives, unchanged in id and type', () => {
    const ids = composed.layers.map((layer) => layer.layerId);
    expect(ids).toEqual(expect.arrayContaining(['runtime', 'narrative']));
    expect(composed.layers.find((layer) => layer.layerId === 'runtime')?.type).toBe('primary');
  });

  test('the overlay contributes a layer that names its source', () => {
    const contributed = composed.layers.find((layer) =>
      layer.layerId.includes('y2k_theatre_shutdown'),
    );
    expect(contributed).toBeDefined();
    expect(contributed?.type).toBe('recreation');
    expect(contributed?.reality_correspondence?.to).toBe(PREMISE);
    expect(contributed?.reality_correspondence?.deviations).toContain(
      'the premise declares no exhibition after 2000',
    );
  });

  test('ground truth is the base object itself — no clone, no merge', () => {
    expect(groundTruth(composed)).toBe(base);
    expect(keyframe(groundTruth(composed), 'us-wide-release')?.timestamp).toBe(ns(1997));
    expect(groundTruth(base)).toBe(base);
  });

  test('viewOf selects the composed view or the ground truth', () => {
    expect(viewOf(composed)).toBe(composed);
    expect(viewOf(composed, 'ground-truth')).toBe(base);
  });
});

describe('collisions are recorded, not resolved away (#75)', () => {
  const composed = composeUniverse(base, [{ universe: premise }]);

  test('the overlay wins the composed keyframe and the loser is kept verbatim', () => {
    const shown = keyframe(composed, 'us-wide-release');
    expect(shown?.timestamp).toBe(ns(2000));
    const collision = composed.composition.collisions.find(
      (entry) => entry.kind === 'keyframe' && entry.id === 'us-wide-release',
    );
    expect(collision?.winner.universeId).toBe(PREMISE);
    expect(collision?.loser.universeId).toBe(BASE);
    expect(collision?.reason).toBe('layer-type');
    expect((collision?.losingValue as { timestamp: bigint }).timestamp).toBe(ns(1997));
  });

  test('the deviation is written on the winning overlay layer', () => {
    const contributed = composed.layers.find((layer) => layer.reality_correspondence?.to === PREMISE);
    expect(
      contributed?.reality_correspondence?.deviations.some((line) =>
        line.includes('us-wide-release'),
      ),
    ).toBe(true);
    expect(contributed?.reality_correspondence?.deviations.some((line) => line.includes(BASE))).toBe(
      true,
    );
  });

  test('segments and epochs collide by id too, without leaving the layer', () => {
    const segment = composed.composition.collisions.find(
      (entry) => entry.kind === 'segment' && entry.id === 'act-1',
    );
    expect(segment?.winner.universeId).toBe(PREMISE);

    const epoch = composed.composition.collisions.find(
      (entry) => entry.kind === 'epoch' && entry.id === 'titanic:voyage',
    );
    expect(epoch?.winner.universeId).toBe(PREMISE);
    // The losing epoch is still in the base layer — flattening is not deletion.
    const baseVoyage = composed.layers
      .find((layer) => layer.layerId === 'narrative')
      ?.epochs.voyage as { startTime?: bigint };
    expect(baseVoyage.startTime).toBe(ns(1912));
    expect(composed.epochs?.['titanic:voyage'].startTime).toBe(ns(2000));
  });

  test('non-colliding assertions from both sides are present', () => {
    const ids = (composed.temporalStructure?.keyframes ?? []).map((entry) => entry.id);
    expect(ids).toEqual(expect.arrayContaining(['us-premiere', 'us-wide-release', 'projection_shutdown']));
  });
});

describe('the precedence order is total (#75)', () => {
  test('an explicit override beats a higher layer type', () => {
    const composed = composeUniverse(base, [
      { universe: premise, layerType: 'recreation' },
      { universe: alt, layerType: 'meta', overrides: ['us-wide-release'] },
    ]);
    const override = composed.composition.collisions.find(
      (entry) =>
        entry.kind === 'keyframe' && entry.id === 'us-wide-release' && entry.reason === 'override',
    );
    expect(keyframe(composed, 'us-wide-release')?.timestamp).toBe(ns(2001));
    expect(override?.winner.universeId).toBe(ALT);
    expect(override?.loser.universeId).toBe(PREMISE);
  });

  test('higher accuracy wins at the same layer type, even when declared first', () => {
    const composed = composeUniverse(base, [
      { universe: premise, accuracy: 0.9 },
      { universe: alt, accuracy: 0.2 },
    ]);
    const winner = composed.composition.collisions.find(
      (entry) => entry.kind === 'keyframe' && entry.id === 'us-wide-release' && entry.reason === 'accuracy',
    );
    expect(winner?.winner.universeId).toBe(PREMISE);
    expect(keyframe(composed, 'us-wide-release')?.timestamp).toBe(ns(2000));
  });

  test('declaration order breaks a full tie: the later overlay wins', () => {
    const composed = composeUniverse(base, [
      { universe: premise, accuracy: 0.5 },
      { universe: alt, accuracy: 0.5 },
    ]);
    const last = composed.composition.collisions
      .filter((entry) => entry.kind === 'keyframe' && entry.id === 'us-wide-release')
      .at(-1);
    expect(last?.winner.universeId).toBe(ALT);
    expect(last?.reason).toBe('declaration-order');
  });

  test('a fiction overlay over a documentary base is recorded, never silent', () => {
    const composed = composeUniverse(base, [{ universe: premise }]);
    expect(composed.composition.collisions.length).toBeGreaterThan(0);
    expect(composed.composition.precedence).toEqual([
      'override',
      'layer-type',
      'accuracy',
      'declaration-order',
    ]);
    expect(composed.composition.base).toBe(BASE);
    expect(composed.composition.overlays.map((entry) => entry.universeId)).toEqual([PREMISE]);
  });

  test('the default layer is the highest epistemic rank present', () => {
    const composed = composeUniverse(base, [{ universe: premise }]);
    // The base has two primaries; either is a valid default, but never an overlay.
    expect(defaultLayer(base)?.type).toBe('primary');
    expect(defaultLayer(composed)?.type).toBe('recreation');
    expect(defaultLayer(composed)?.reality_correspondence?.to).toBe(PREMISE);
  });
});

describe('invalid compositions fail loudly', () => {
  test('a universe cannot be composed with itself', () => {
    expect(() => composeUniverse(base, [{ universe: base }])).toThrow(/cannot be composed with itself/);
  });

  test('one declaration per overlay', () => {
    expect(() =>
      composeUniverse(base, [{ universe: premise }, { universe: premise }]),
    ).toThrow(/declared twice/);
  });

  test('accuracy is checked, not clamped', () => {
    expect(() => composeUniverse(base, [{ universe: premise, accuracy: 1.5 }])).toThrow(/accuracy/);
    expect(() => composeUniverse(base, [{ universe: premise, accuracy: -0.1 }])).toThrow(/accuracy/);
  });

  test('an overlay cannot be primary', () => {
    const bad = { universe: premise, layerType: 'primary' } as unknown as CompositionOverlay;
    expect(() => composeUniverse(base, [bad])).toThrow(/layerType/);
  });
});
