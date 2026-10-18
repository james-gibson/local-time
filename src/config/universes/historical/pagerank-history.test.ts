import { Universe, UniverseType } from '../../../core/types';
import { isValidUniverseId } from '../../../core/universe-ids';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { ConfigLoader } from '../../config-loader';
import { UniverseRegistry } from '../../universe-registry';
import { RealityGradientAnalyzer } from '../../../utils/reality-gradient';
import { allUniverses } from '../index';
import { pagerankHistoryUniverse } from './pagerank-history';

/**
 * History of PageRank — james-gibson/local-time#93.
 *
 * The universe is a hand-authored literal, so the guards here are the ones the
 * builder would otherwise provide: a real registry lookup (a spread into
 * `allUniverses` is not proof of a lookup, #27), an explicit `epochId` on every
 * epoch (#19), gapless segments, keyframes inside their epoch bounds, an anchor
 * that resolves to a *registered* universe (the #129 lesson), and a projection
 * that reads as documentary rather than fiction.
 */

const ordered = <T extends { start?: bigint; end?: bigint }>(items: T[]): T[] =>
  [...items].sort((a, b) => ((a.start ?? 0n) < (b.start ?? 0n) ? -1 : 1));

const structure = pagerankHistoryUniverse.temporalStructure!;
const segments = structure.segments as Array<{
  id: string;
  start: bigint;
  end: bigint;
  type: string;
}>;
const keyframes = structure.keyframes as Array<{ id: string; timestamp: bigint }>;

const epochs = (universe: Universe) =>
  universe.layers.flatMap((layer) =>
    Object.entries(layer.epochs).map(([key, epoch]) => ({
      label: `${layer.layerId}.${key}`,
      epochId: (epoch as { epochId?: string }).epochId,
      start: (epoch as { startTime?: bigint }).startTime,
      end: (epoch as { endTime?: bigint }).endTime,
    })),
  );

const registeredIds = new Set(
  allUniverses.map((u) => (u as { universeId?: string }).universeId),
);

describe('History of PageRank universe (james-gibson/local-time#93)', () => {
  test('uses a valid HISTORICAL id, and the primary identifier is that id', () => {
    expect(pagerankHistoryUniverse.universeId).toBe('history:pagerank:1996');
    expect(isValidUniverseId(pagerankHistoryUniverse.universeId as string)).toBe(true);
    expect(pagerankHistoryUniverse.type).toBe(UniverseType.HISTORICAL_EVENT);
    // A `identifiers.primary` that disagrees with `universeId` is a defect
    // (james-gibson/local-time#102 BUG-4).
    expect(pagerankHistoryUniverse.identifiers.primary).toBe(pagerankHistoryUniverse.universeId);
  });

  test('is registered in allUniverses exactly once', () => {
    const id = pagerankHistoryUniverse.universeId as string;
    const count = allUniverses.filter(
      (u) => (u as { universeId?: string }).universeId === id,
    ).length;
    expect(count).toBe(1);
  });

  test('survives a real registry lookup', () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    const id = pagerankHistoryUniverse.universeId as string;
    expect(() => registry.registerUniverse(id, pagerankHistoryUniverse)).not.toThrow();
    expect(registry.getUniverse(id)).toBeDefined();
  });

  test('every epoch carries an explicit epochId (#19)', () => {
    const offenders = epochs(pagerankHistoryUniverse)
      .filter(({ epochId }) => !epochId || epochId.trim() === '')
      .map(({ label }) => label);
    expect(offenders).toEqual([]);
  });

  test('segments are gapless and use only valid segment types', () => {
    const valid = new Set([
      'sequence',
      'act',
      'scene',
      'phase',
      'countdown',
      'mission_phase',
      'life_period',
      'education',
      'career',
      'public_service',
      'legal_period',
      'legislation_active',
      'court_jurisdiction',
    ]);
    const sorted = ordered(segments);
    for (let i = 1; i < sorted.length; i += 1) {
      expect(sorted[i].start).toBe(sorted[i - 1].end);
    }
    expect(sorted[0].start).toBe(BigInt(Date.UTC(1996, 0, 1)) * 1_000_000n);
    for (const segment of sorted) expect(valid.has(segment.type)).toBe(true);
  });

  test('every keyframe falls inside an epoch', () => {
    const bounds = epochs(pagerankHistoryUniverse);
    for (const keyframe of keyframes) {
      const containing = bounds.filter(
        ({ start, end }) =>
          start !== undefined &&
          end !== undefined &&
          keyframe.timestamp >= start &&
          keyframe.timestamp <= end,
      );
      expect(`${keyframe.id}: ${containing.length > 0 ? 'inside' : 'OUTSIDE'}`).toBe(
        `${keyframe.id}: inside`,
      );
    }
  });

  test('anchors only a universe that is actually registered', () => {
    const anchorIds = pagerankHistoryUniverse.realityRelation.realityAnchors.map(
      (anchor) => anchor.realEventId,
    );
    // The ticket's three anchors included one malformed id (`history:world_wide_web:1989`)
    // and two ids nothing owns. Only the Web anchor is asserted.
    expect(anchorIds).toEqual(['technology:world_wide_web:1989']);
    for (const id of anchorIds) {
      expect(`${id}: ${registeredIds.has(id) ? 'registered' : 'DANGLING'}`).toBe(
        `${id}: registered`,
      );
    }
  });

  test('is contained by the software-engineering and world-history containers', () => {
    const parents = (pagerankHistoryUniverse.connections?.natural?.parentUniverses ??
      []) as string[];
    expect(parents).toContain(CommonUniverseIds.SOFTWARE_ENGINEERING);
    expect(parents).toContain(CommonUniverseIds.WORLD_HISTORY);
    for (const parent of parents) expect(isValidUniverseId(parent)).toBe(true);
  });

  test('projects as a documentary, not fiction', () => {
    expect(pagerankHistoryUniverse.realityRelation.type).toBe('documentary');
    expect(pagerankHistoryUniverse.realityRelation.fictionalizationDegree).toBe(0.0);
    const gradient = RealityGradientAnalyzer.analyzeUniverse(pagerankHistoryUniverse);
    expect(gradient.level).toBeLessThanOrEqual(0.1);
  });
});
