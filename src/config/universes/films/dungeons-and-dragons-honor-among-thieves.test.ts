import { Universe } from '../../../core/types';
import {
  createFilmUniverseId,
  isFilmUniverseId,
  isValidUniverseId,
} from '../../../core/universe-ids';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { ConfigLoader } from '../../config-loader';
import { UniverseRegistry } from '../../universe-registry';
import { RealityGradientAnalyzer } from '../../../utils/reality-gradient';
import { resolveFilmStudio } from '../studios';
import { allUniverses } from '../index';
import { dungeonsAndDragonsHonorAmongThievesUniverse } from './dungeons-and-dragons-honor-among-thieves';

/**
 * Dungeons & Dragons: Honor Among Thieves (2023) — james-gibson/local-time#116.
 *
 * Mirrors `films/20th/idiocracy.test.ts`: the id is the canonical film shape
 * (the title carries a colon and an ampersand, so the fragment is worth pinning),
 * the universe survives a real registry lookup (#27), its runtime keyframes are
 * runtime positions and not durations (#112), and it projects as fiction.
 */

const RUNTIME_MINUTES = 134;
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

describe('Dungeons & Dragons: Honor Among Thieves (2023) universe (james-gibson/local-time#116)', () => {
  test('uses a pinned, valid film id — the punctuation cannot produce one', () => {
    // The ticket's `film:paramount:…:2023` is four segments, so it passes only via
    // the ANY_YEAR_TERMINATED catch-all (#50) — assert the *domain* guard, not the
    // permissive one.
    expect(isFilmUniverseId(String(dungeonsAndDragonsHonorAmongThievesUniverse.universeId))).toBe(
      true,
    );
    // The raw title does *not* produce this id: `toIdFragment` strips the `&`, so
    // deriving the id from `Dungeons & Dragons: Honor Among Thieves` gives
    // `dungeons_dragons_honor_among_thieves`. The readable slug is pinned
    // explicitly, which is why the id is not a verbatim factory call on the title.
    expect(dungeonsAndDragonsHonorAmongThievesUniverse.universeId).toBe(
      createFilmUniverseId(
        'paramount',
        'dungeons_and_dragons_honor_among_thieves',
        2023,
      ),
    );
    expect(dungeonsAndDragonsHonorAmongThievesUniverse.universeId).toBe(
      'paramount:dungeons_and_dragons_honor_among_thieves:2023',
    );
    expect(
      isValidUniverseId(dungeonsAndDragonsHonorAmongThievesUniverse.universeId as string),
    ).toBe(true);
  });

  test('is registered in allUniverses exactly once', () => {
    const id = dungeonsAndDragonsHonorAmongThievesUniverse.universeId as string;
    const count = allUniverses.filter(
      (u) => (u as { universeId?: string }).universeId === id,
    ).length;
    expect(count).toBe(1);
  });

  test('survives a real registry lookup', () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    const id = dungeonsAndDragonsHonorAmongThievesUniverse.universeId as string;
    expect(() =>
      registry.registerUniverse(id, dungeonsAndDragonsHonorAmongThievesUniverse),
    ).not.toThrow();
    expect(registry.getUniverse(id)).toBeDefined();
  });

  test('every epoch carries an explicit epochId (#19)', () => {
    const offenders: string[] = [];
    for (const layer of dungeonsAndDragonsHonorAmongThievesUniverse.layers) {
      for (const [key, epoch] of Object.entries(layer.epochs)) {
        const epochId = (epoch as { epochId?: string }).epochId;
        if (!epochId || epochId.trim() === '') offenders.push(`${layer.layerId}.${key}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  test('runtime keyframes are runtime positions, not durations (#112)', () => {
    const byId = new Map(keyframes(dungeonsAndDragonsHonorAmongThievesUniverse).map((k) => [k.id, k.timestamp]));
    // 67m00s, read as minutes and seconds — not 67:00 on a clock.
    expect(byId.get('cemetery_interrogation_midpoint')).toBe(runtimeNs(67));
    expect(byId.get('forgelight_climax_resolution')).toBe(runtimeNs(132));
    expect(byId.get('cemetery_interrogation_midpoint')).toBe(4_020n * 1_000_000_000n);
  });

  test('the acts cover the runtime gaplessly', () => {
    const ordered = [...segments(dungeonsAndDragonsHonorAmongThievesUniverse)].sort((a, b) =>
      a.start < b.start ? -1 : a.start > b.start ? 1 : 0,
    );
    expect(ordered[0].start).toBe(0n);
    expect(ordered[ordered.length - 1].end).toBe(runtimeNs(RUNTIME_MINUTES));
    for (let i = 1; i < ordered.length; i += 1) {
      expect(ordered[i].start).toBe(ordered[i - 1].end);
    }
    for (const segment of ordered) expect(segment.type).toBe('act');
  });

  test('names Paramount and Hollywood as its containers', () => {
    const parents = parentsOf(dungeonsAndDragonsHonorAmongThievesUniverse);
    expect(parents).toContain(CommonUniverseIds.HOLLYWOOD_SYSTEM);
    expect(parents).toContain(resolveFilmStudio('paramount')!.universeId);
  });

  test('records the distributor as a typed DISTRIBUTED_BY edge', () => {
    expect(dungeonsAndDragonsHonorAmongThievesUniverse.connections?.references).toContainEqual(
      expect.objectContaining({
        type: 'DISTRIBUTED_BY',
        targetUniverseId: resolveFilmStudio('paramount')!.universeId,
      }),
    );
  });

  test('asserts no reality anchor — the game universe does not exist yet', () => {
    // The 1974 game it adapts has no universe, so the `reinterprets` anchor is
    // deferred rather than pointed at an id nothing owns (the #129 lesson).
    expect(dungeonsAndDragonsHonorAmongThievesUniverse.realityRelation.realityAnchors).toEqual([]);
    expect(dungeonsAndDragonsHonorAmongThievesUniverse.realityRelation.type).toBe('pure_fiction');
  });

  /**
   * The universe is now assembled by `createFilmUniverse(spec)` rather than hand-authored, so
   * these are the fields the shim owns: what a hand-written literal used to carry, and a spec
   * could silently lose.
   */
  test('carries the provenance and metadata the spec declares', () => {
    const u = dungeonsAndDragonsHonorAmongThievesUniverse;
    expect(u.metadata?.canonicalName).toBe('Dungeons & Dragons: Honor Among Thieves');
    expect(u.metadata?.released).toEqual(new Date('2023-03-31'));
    expect(u.metadata?.cultural_significance).toBe(0.78);
    expect(u.attribution.sources).toHaveLength(3);
    expect(u.attribution.usage_restrictions).toHaveLength(2);
    expect((u.metadata as { based_on?: string[] }).based_on).toEqual(['Dungeons & Dragons by Hasbro']);
    expect(u.temporalStructure?.windows.strategy).toBe('scene_based');
  });

  test('acts keep their prose (#100) and partition the runtime', () => {
    const u = dungeonsAndDragonsHonorAmongThievesUniverse;
    const acts = (u.temporalStructure?.segments ?? []) as Array<{
      id: string;
      start: bigint;
      end: bigint;
      description?: string;
    }>;
    expect(acts.every((a) => typeof a.description === 'string' && a.description.length > 0)).toBe(
      true,
    );
  });

  test('projects as fiction', () => {
    const gradient = RealityGradientAnalyzer.analyzeUniverse(
      dungeonsAndDragonsHonorAmongThievesUniverse,
    );
    expect(gradient.level).toBeGreaterThanOrEqual(0.7);
  });
});
