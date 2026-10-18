import { allUniverses } from '../../index';
import { ConfigLoader } from '../../../config-loader';
import { UniverseRegistry } from '../../../universe-registry';
import { CommonUniverseIds } from '../../../../core/common-universe-ids';
import { isValidUniverseId } from '../../../../core/universe-ids';
import { RealityGradientAnalyzer } from '../../../../utils/reality-gradient';
import { Universe } from '../../../../core/types';
import { diabloUniverses } from './diablo-series';

/**
 * james-gibson/local-time#112 — the Diablo namespace registration guard.
 *
 * Mirrors `films/films-registration.test.ts`. The lesson it encodes (#27, #67,
 * #98) is that a universe can be defined, built and validated at module scope and
 * then silently discarded, because `loadBuiltInUniverses` warns-and-skips a
 * malformed id and a spread into `allUniverses` is not proof of a *lookup*.
 *
 * The namespace also matters here: #112 §11.2 proposed a `games:` (plural) id
 * prefix that does not exist. These ids are the declared `game:` vocabulary
 * (`game:<franchise>:<title>:<year>`) plus one HISTORICAL franchise container.
 */

const diabloIds = diabloUniverses.map((u) => u.universeId as string);

const universesIn = (u: Universe): Array<{ epoch: { epochId?: string }; label: string }> =>
  (u.layers ?? []).flatMap((layer) =>
    Object.entries(layer.epochs ?? {}).map(([key, epoch]) => ({
      epoch: epoch as { epochId?: string },
      label: `${u.universeId}#${layer.layerId}.${key}`,
    })),
  );

describe('the Diablo namespace is registered', () => {
  test('the namespace has twelve universes', () => {
    // Four base games, six expansions, one remaster, one franchise container.
    expect(diabloUniverses).toHaveLength(12);
  });

  test('every Diablo id is present in allUniverses exactly once', () => {
    const counts = new Map<string, number>();
    for (const universe of allUniverses) {
      const id = (universe as { universeId?: string }).universeId;
      if (typeof id === 'string') counts.set(id, (counts.get(id) ?? 0) + 1);
    }
    const missing = diabloIds.filter((id) => (counts.get(id) ?? 0) === 0);
    const duplicated = diabloIds.filter((id) => (counts.get(id) ?? 0) > 1);
    expect(missing).toEqual([]);
    expect(duplicated).toEqual([]);
  });

  test('every Diablo id is a valid UniverseId', () => {
    const invalid = diabloIds.filter((id) => !isValidUniverseId(id));
    expect(invalid).toEqual([]);
  });

  /**
   * The half a spread into `allUniverses` does not prove: an invalid id is present
   * in the array and absent from every query (#27, the Ed Sheeran failure).
   */
  test('every Diablo universe survives a real registry lookup', () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    const failures: string[] = [];
    for (const universe of diabloUniverses) {
      const id = universe.universeId;
      try {
        registry.registerUniverse(id, universe as never);
        if (!registry.getUniverse(id)) failures.push(id);
      } catch (error) {
        failures.push(`${id}: ${(error as Error).message}`);
      }
    }
    expect(failures).toEqual([]);
  });

  test('every epoch carries an explicit, non-empty epochId', () => {
    // A missing epochId is silently replaced by the layer key, which changes what
    // every reference to that epoch means (james-gibson/local-time#19).
    const offenders = diabloUniverses
      .flatMap(universesIn)
      .filter(({ epoch }) => !epoch.epochId || epoch.epochId.trim() === '')
      .map(({ label }) => label);
    expect(offenders).toEqual([]);
  });

  test('reality anchors use the RealityAnchor shape', () => {
    const allowed = ['depicts', 'inspired_by', 'reinterprets', 'contradicts', 'reimagines', 'documents', 'experienced'];
    const offenders: string[] = [];
    for (const universe of diabloUniverses) {
      for (const anchor of universe.realityRelation.realityAnchors) {
        const ok =
          typeof (anchor as { realEventId?: unknown }).realEventId === 'string' &&
          allowed.includes((anchor as { relationshipType?: string }).relationshipType ?? '') &&
          typeof (anchor as { confidence?: unknown }).confidence === 'number';
        if (!ok) offenders.push(`${universe.universeId}: ${JSON.stringify(anchor)}`);
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe('the Diablo containment model', () => {
  const byId = new Map(diabloUniverses.map((u) => [u.universeId as string, u]));
  const parentsOf = (universe: Universe): string[] =>
    (universe.connections?.natural?.parentUniverses ?? []) as string[];

  const baseGameIds = [
    'game:diablo:diablo_i:1996',
    'game:diablo:diablo_ii:2000',
    'game:diablo:diablo_iii:2012',
    'game:diablo:diablo_iv:2023',
  ];

  test('the franchise container is the shared CommonUniverseIds lever', () => {
    const container = byId.get(CommonUniverseIds.DIABLO_FRANCHISE);
    expect(container).toBeDefined();
    for (const id of baseGameIds) {
      expect(parentsOf(byId.get(id)!)).toContain(CommonUniverseIds.DIABLO_FRANCHISE);
    }
  });

  test('each expansion is contained by its base game', () => {
    const expected: Array<[string, string]> = [
      ['game:diablo:hellfire:1997', 'game:diablo:diablo_i:1996'],
      ['game:diablo:lord_of_destruction:2001', 'game:diablo:diablo_ii:2000'],
      ['game:diablo:diablo_ii_resurrected:2021', 'game:diablo:diablo_ii:2000'],
      ['game:diablo:reaper_of_souls:2014', 'game:diablo:diablo_iii:2012'],
      ['game:diablo:rise_of_the_necromancer:2017', 'game:diablo:diablo_iii:2012'],
      ['game:diablo:vessel_of_hatred:2024', 'game:diablo:diablo_iv:2023'],
      ['game:diablo:lord_of_hatred:2026', 'game:diablo:diablo_iv:2023'],
    ];
    for (const [child, parent] of expected) {
      expect(byId.get(child)).toBeDefined();
      expect(parentsOf(byId.get(child)!)).toContain(parent);
    }
  });

  test('one owner per id — every Diablo id is unique', () => {
    expect(new Set(diabloIds).size).toBe(diabloIds.length);
  });

  test('Diablo II: Resurrected is a recreation layer over Diablo II', () => {
    const resurrected = byId.get('game:diablo:diablo_ii_resurrected:2021')!;
    const recreation = (resurrected.layers ?? []).find((l) => l.type === 'recreation');
    expect(recreation).toBeDefined();
    expect(recreation!.reality_correspondence?.to).toBe('game:diablo:diablo_ii:2000');
    expect(recreation!.reality_correspondence?.deviations.length).toBeGreaterThan(0);
  });

  test('the container segment covers the full franchise span', () => {
    const container = byId.get(CommonUniverseIds.DIABLO_FRANCHISE)!;
    const segment = container.temporalStructure?.segments?.[0];
    expect(segment).toBeDefined();
    const epoch = Object.values(container.layers[0].epochs)[0];
    const epochStart = (epoch as { startTime?: bigint }).startTime!;
    const epochEnd = (epoch as { endTime?: bigint }).endTime!;
    expect(segment!.start <= epochStart).toBe(true);
    expect(segment!.end >= epochEnd).toBe(true);
    // 1997-01-01 .. 2026-04-28
    expect(segment!.start).toBe(BigInt(Date.UTC(1997, 0, 1)) * 1_000_000n);
    expect(segment!.end).toBe(BigInt(Date.UTC(2026, 3, 28)) * 1_000_000n);
  });
});

describe('the Diablo projection', () => {
  test('every Diablo universe projects as fiction', () => {
    // pure_fiction / 1.0, so `plane_charge = -1`. Anchors dilute the gradient
    // (RealityGradientAnalyzer reduces `level` by `avgConfidence * 0.3`), so the
    // threshold is "clearly fiction", not exactly 1.0.
    const offenders = diabloUniverses
      .map((u) => ({ id: u.universeId as string, level: RealityGradientAnalyzer.analyzeUniverse(u).level }))
      .filter(({ level }) => level < 0.7);
    expect(offenders).toEqual([]);
  });
});
