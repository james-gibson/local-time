import { Universe } from '../../../core/types';
import { createFilmUniverseId, isValidUniverseId } from '../../../core/universe-ids';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { ConfigLoader } from '../../config-loader';
import { UniverseRegistry } from '../../universe-registry';
import { RealityGradientAnalyzer } from '../../../utils/reality-gradient';
import { resolveFilmStudio } from '../studios';
import { allUniverses } from '../index';
import { warcraftFilmUniverse } from './warcraft';

/**
 * Warcraft (2016) — james-gibson/local-time#115.
 *
 * Mirrors `films/20th/idiocracy.test.ts`: the id is the canonical film shape,
 * the universe survives a real registry lookup (a spread into `allUniverses` is
 * not proof of a lookup, #27), its runtime keyframes are runtime positions and
 * not durations (#112), and it projects as fiction.
 */

const RAW = 123;
const runtimeNs = (minutes: number, seconds = 0): bigint =>
  (BigInt(minutes) * 60n + BigInt(seconds)) * 1_000_000_000n;

const parentsOf = (u: Universe): string[] =>
  (u.connections?.natural?.parentUniverses ?? []) as string[];

const keyframes = (u: Universe): Array<{ id: string; timestamp: bigint }> =>
  (u.temporalStructure?.keyframes ?? []) as Array<{ id: string; timestamp: bigint }>;

const segments = (u: Universe): Array<{ id: string; start: bigint; end: bigint; type: string }> =>
  (u.temporalStructure?.segments ?? []) as Array<{
    id: string;
    start: bigint;
    end: bigint;
    type: string;
  }>;

describe('Warcraft (2016) universe (james-gibson/local-time#115)', () => {
  test('uses the canonical film id — <studio-token>:<slug>:<year>', () => {
    // The ticket proposed `film:legendary:warcraft:2016`, which is not the film
    // vocabulary: `film` is a reserved namespace prefix and the shape has four
    // segments. The distributor's registered token is `universal`.
    expect(warcraftFilmUniverse.universeId).toBe(
      createFilmUniverseId('universal', 'warcraft', 2016),
    );
    expect(warcraftFilmUniverse.universeId).toBe('universal:warcraft:2016');
    expect(isValidUniverseId(warcraftFilmUniverse.universeId as string)).toBe(true);
  });

  test('is registered in allUniverses exactly once', () => {
    const id = warcraftFilmUniverse.universeId as string;
    const count = allUniverses.filter(
      (u) => (u as { universeId?: string }).universeId === id,
    ).length;
    expect(count).toBe(1);
  });

  test('survives a real registry lookup', () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    const id = warcraftFilmUniverse.universeId as string;
    expect(() => registry.registerUniverse(id, warcraftFilmUniverse)).not.toThrow();
    expect(registry.getUniverse(id)).toBeDefined();
  });

  test('every epoch carries an explicit epochId (#19)', () => {
    const offenders: string[] = [];
    for (const layer of warcraftFilmUniverse.layers) {
      for (const [key, epoch] of Object.entries(layer.epochs)) {
        const epochId = (epoch as { epochId?: string }).epochId;
        if (!epochId || epochId.trim() === '') offenders.push(`${layer.layerId}.${key}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  test('runtime keyframes are runtime positions, not durations (#112)', () => {
    const byId = new Map(keyframes(warcraftFilmUniverse).map((k) => [k.id, k.timestamp]));
    expect(byId.get('dark_portal_midpoint')).toBe(runtimeNs(61, 30));
    expect(byId.get('climax_resolution')).toBe(runtimeNs(120));
    // (61, 30) is 61 minutes *and 30 seconds*, i.e. 3690s — not 61.30 minutes.
    expect(byId.get('dark_portal_midpoint')).toBe(3_690n * 1_000_000_000n);
  });

  test('the acts cover the runtime gaplessly', () => {
    const ordered = [...segments(warcraftFilmUniverse)].sort((a, b) =>
      a.start < b.start ? -1 : a.start > b.start ? 1 : 0,
    );
    expect(ordered[0].start).toBe(0n);
    expect(ordered[ordered.length - 1].end).toBe(runtimeNs(RAW));
    for (let i = 1; i < ordered.length; i += 1) {
      expect(ordered[i].start).toBe(ordered[i - 1].end);
    }
    for (const segment of ordered) expect(segment.type).toBe('act');
  });

  test('names Universal and Hollywood as its containers', () => {
    const parents = parentsOf(warcraftFilmUniverse);
    expect(parents).toContain(CommonUniverseIds.HOLLYWOOD_SYSTEM);
    expect(parents).toContain(resolveFilmStudio('universal')!.universeId);
  });

  test('records the distributor as a typed DISTRIBUTED_BY edge', () => {
    expect(warcraftFilmUniverse.connections?.references).toContainEqual(
      expect.objectContaining({
        type: 'DISTRIBUTED_BY',
        targetUniverseId: resolveFilmStudio('universal')!.universeId,
      }),
    );
  });

  test('asserts no reality anchor — the game universe does not exist yet', () => {
    // An anchor to an id nothing owns is a dangling reference, not a connection
    // (the #129 lesson). The real referent is the source material, recorded in
    // `attribution.creators.based_on`, until a Warcraft game universe lands.
    expect(warcraftFilmUniverse.realityRelation.realityAnchors).toEqual([]);
    expect(warcraftFilmUniverse.realityRelation.type).toBe('pure_fiction');
  });

  test('projects as fiction', () => {
    const gradient = RealityGradientAnalyzer.analyzeUniverse(warcraftFilmUniverse);
    expect(gradient.level).toBeGreaterThanOrEqual(0.7);
  });
});
