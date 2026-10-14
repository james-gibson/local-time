import { UniverseType } from '../../../core/types';
import { isValidUniverseId } from '../../../core/universe-ids';
import { ConfigLoader } from '../../config-loader';
import { UniverseRegistry } from '../../universe-registry';
import { pixarFilmUniverses } from './films';

describe('Pixar filmography universes (james-gibson/local-time#1)', () => {
  test('contains every Pixar feature film from 1995 to 2025', () => {
    expect(pixarFilmUniverses).toHaveLength(29);
  });

  test('uses valid, unique universe IDs', () => {
    const ids = pixarFilmUniverses.map((u) => u.universeId as string);
    for (const id of ids) {
      expect(isValidUniverseId(id)).toBe(true);
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('anchors films to their canonical ID, type and runtime', () => {
    const toyStory = pixarFilmUniverses.find((u) => u.universeId === 'pixar:toy_story:1995');
    expect(toyStory).toBeDefined();
    expect(toyStory!.type).toBe(UniverseType.FILM);
    expect(toyStory!.epochs?.main?.endTime).toBe(BigInt(81 * 60 * 1_000_000_000));

    const nemo = pixarFilmUniverses.find((u) => u.universeId === 'pixar:finding_nemo:2003');
    expect(nemo).toBeDefined();
    expect(nemo!.epochs?.main?.endTime).toBe(BigInt(100 * 60 * 1_000_000_000));

    // 'Elio' has no confirmed runtime, so no runtime epoch is modelled.
    const elio = pixarFilmUniverses.find((u) => u.universeId === 'pixar:elio:2025') as any;
    expect(elio).toBeDefined();
    expect(elio.epochs?.main).toBeUndefined();
    expect(elio.metadata.runtimeMinutes).toBe(0);
  });

  test('records parent-studio and franchise membership connections', () => {
    const cars2 = pixarFilmUniverses.find((u) => u.universeId === 'pixar:cars_2:2011') as any;
    const carsTargets = cars2.metadata.connections.map((c: any) => c.targetUniverseId);
    expect(carsTargets).toContain('history:cars_franchise:2006');
    expect(carsTargets).toContain('history:pixar:1986');

    const toyStory4 = pixarFilmUniverses.find((u) => u.universeId === 'pixar:toy_story_4:2019') as any;
    const ts4Targets = toyStory4.metadata.connections.map((c: any) => c.targetUniverseId);
    expect(ts4Targets).toContain('history:toy_story_franchise:1995');

    // A non-franchise film still belongs to the studio universe.
    const luca = pixarFilmUniverses.find((u) => u.universeId === 'pixar:luca:2021') as any;
    const lucaTargets = luca.metadata.connections.map((c: any) => c.targetUniverseId);
    expect(lucaTargets).toEqual(['history:pixar:1986']);
  });

  test('preserves the Toy Story Star Wars-homage analysis', () => {
    const toyStory = pixarFilmUniverses.find((u) => u.universeId === 'pixar:toy_story:1995') as any;
    const targets = toyStory.metadata.connections.map((c: any) => c.targetUniverseId);
    expect(targets).toContain('film:star_wars_a_new_hope:*');

    const keyframeIds = toyStory.temporalStructure.keyframes.map((k: any) => k.id);
    // The Star Wars-homage moments this test exists for ...
    expect(keyframeIds).toContain('tie_fighter_sound');
    expect(keyframeIds).toContain('strange_new_planet');
    // ... plus the plot keyframes folded in from the former `films/toy-story.ts`
    // duplicate (james-gibson/local-time#67).
    expect(keyframeIds).toContain('buzz_arrival');
    expect(keyframeIds).toContain('reunion_with_andy');
  });

  test('registers every film universe without throwing', () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    for (const universe of pixarFilmUniverses) {
      expect(() =>
        registry.registerUniverse(universe.universeId as string, universe),
      ).not.toThrow();
    }
  });
});
