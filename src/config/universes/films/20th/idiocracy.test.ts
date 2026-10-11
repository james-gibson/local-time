import { Universe, UniverseType } from '../../../../core/types';
import { isValidUniverseId } from '../../../../core/universe-ids';
import { ConfigLoader } from '../../../config-loader';
import { UniverseRegistry } from '../../../universe-registry';
import { idiocracyUniverse, idiocracyUniverses } from './idiocracy';

const anchors = (u: Universe): Array<{ realEventId: string }> =>
  (u.realityRelation.realityAnchors ?? []) as Array<{ realEventId: string }>;

const references = (u: Universe): Array<{ type: string; targetUniverseId: string; targetKeyframeId?: string }> =>
  ((u as any).connections?.references ?? []) as Array<{
    type: string;
    targetUniverseId: string;
    targetKeyframeId?: string;
  }>;

const parentUniverses = (u: Universe): string[] =>
  ((u as any).connections?.natural?.parentUniverses ?? []) as string[];

const keyframeIds = (u: Universe): string[] =>
  ((u.temporalStructure as any).keyframes ?? []).map((k: any) => k.id as string);

const segmentIds = (u: Universe): string[] =>
  ((u.temporalStructure as any).segments ?? []).map((s: any) => s.id as string);

describe('Idiocracy universe (james-gibson/local-time#41)', () => {
  test('exposes a single film universe with the canonical id', () => {
    expect(idiocracyUniverses).toHaveLength(1);
    expect(idiocracyUniverse.universeId).toBe('20th_century_fox:idiocracy:2006');
  });

  test('uses a valid film universe id', () => {
    expect(isValidUniverseId(idiocracyUniverse.universeId as string)).toBe(true);
  });

  test('is an interpretation of the real line, not pure fiction', () => {
    expect(idiocracyUniverse.type).toBe(UniverseType.FILM);
    expect(idiocracyUniverse.realityRelation.type).toBe('interpretation');
    expect(idiocracyUniverse.realityRelation.fictionalizationDegree).toBe(0.85);
  });

  test('anchors the real referents the fiction is built on', () => {
    const ids = anchors(idiocracyUniverse).map((a) => a.realEventId);
    expect(ids).toContain('history:costco:1983');
    expect(ids).toContain('history:us_gov:founded');
  });

  test('anchors its zero inside a prior keyframe rather than fabricating one', () => {
    expect(references(idiocracyUniverse)).toContainEqual(
      expect.objectContaining({
        type: 'IN_A_PRIOR_KEYFRAME',
        targetUniverseId: '20th_century_fox:idiocracy:2006',
        targetKeyframeId: 'hibernation-experiment',
      }),
    );
  });

  test('records the Costco parody as a typed reference, not a bare mention', () => {
    expect(references(idiocracyUniverse)).toContainEqual(
      expect.objectContaining({
        type: 'PARODIES',
        targetUniverseId: 'history:costco:1983',
      }),
    );
  });

  test('carries the story-world keyframes in order', () => {
    expect(keyframeIds(idiocracyUniverse)).toEqual([
      'hibernation-experiment',
      'awakening',
      'costco-law-degree',
      'brawndo-irrigation',
    ]);
  });

  test('models the policy direction as a regime of phases', () => {
    expect(segmentIds(idiocracyUniverse)).toEqual([
      'real-era-prologue',
      'the-drift',
      'awakening',
      'corrective-rule',
    ]);
  });

  test('names the context universes the film sits inside', () => {
    const parents = parentUniverses(idiocracyUniverse);
    for (const id of ['history:hollywood:1913', 'history:united_states:founded', 'history:world:*']) {
      expect(parents).toContain(id);
    }
  });

  test('registers the universe without throwing', () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    const id = idiocracyUniverse.universeId as string;
    expect(() => registry.registerUniverse(id, idiocracyUniverse)).not.toThrow();
    expect(registry.getUniverse(id)).toBeDefined();
  });
});
