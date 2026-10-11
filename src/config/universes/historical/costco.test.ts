import { Universe, UniverseType } from '../../../core/types';
import { isValidUniverseId } from '../../../core/universe-ids';
import { ConfigLoader } from '../../config-loader';
import { UniverseRegistry } from '../../universe-registry';
import { costcoUniverse, costcoUniverses } from './costco';

const parentUniverses = (u: Universe): string[] =>
  ((u as any).connections?.natural?.parentUniverses ?? []) as string[];

const keyframeIds = (u: Universe): string[] =>
  ((u.temporalStructure as any).keyframes ?? []).map((k: any) => k.id as string);

const segmentIds = (u: Universe): string[] =>
  ((u.temporalStructure as any).segments ?? []).map((s: any) => s.id as string);

describe('Costco universe (james-gibson/local-time#41)', () => {
  test('exposes a single company universe with the canonical id', () => {
    expect(costcoUniverses).toHaveLength(1);
    expect(costcoUniverse.universeId).toBe('history:costco:1983');
  });

  test('uses a valid historical universe id', () => {
    expect(isValidUniverseId(costcoUniverse.universeId as string)).toBe(true);
  });

  test('is a documentary institutional period, not fiction', () => {
    expect(costcoUniverse.type).toBe(UniverseType.INSTITUTIONAL_PERIOD);
    expect(costcoUniverse.realityRelation.type).toBe('documentary');
    expect(costcoUniverse.realityRelation.fictionalizationDegree).toBe(0.0);
  });

  test('anchors its zero-point at the founding of the first warehouse club', () => {
    expect(keyframeIds(costcoUniverse)).toContain('founded');
    const founding = ((costcoUniverse.temporalStructure as any).keyframes as any[]).find(
      (k) => k.id === 'founded',
    );
    expect(founding.tags).toContain('zero-point');
  });

  test('records the company era as two phases', () => {
    expect(segmentIds(costcoUniverse)).toEqual([
      'warehouse-club-formation',
      'scale-and-private-label',
    ]);
  });

  test('names the context universes the company sits inside', () => {
    const parents = parentUniverses(costcoUniverse);
    for (const id of [
      'history:global_economic_systems:*',
      'history:united_states:founded',
      'history:world:*',
    ]) {
      expect(parents).toContain(id);
    }
  });

  test('registers the universe without throwing', () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    const id = costcoUniverse.universeId as string;
    expect(() => registry.registerUniverse(id, costcoUniverse)).not.toThrow();
    expect(registry.getUniverse(id)).toBeDefined();
  });
});
