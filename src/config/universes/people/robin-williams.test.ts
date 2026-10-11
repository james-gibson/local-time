import { UniverseType } from '../../../core/types';
import { isValidUniverseId } from '../../../core/universe-ids';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { ConfigLoader } from '../../config-loader';
import { UniverseRegistry } from '../../universe-registry';
import { robinWilliamsFilmography } from './robin-williams';

const connectionsOf = (u: unknown): Array<{ targetUniverseId: string; type: string }> =>
  ((u as any).metadata?.connections ?? []) as Array<{ targetUniverseId: string; type: string }>;

describe('Robin Williams filmography universes (james-gibson/local-time#2)', () => {
  const ids = robinWilliamsFilmography.map((u) => u.universeId as string);

  test('contains the six selected films (1987–1997)', () => {
    expect(robinWilliamsFilmography).toHaveLength(6);
    expect(ids).toEqual([
      'touchstone_pictures:good_morning_vietnam:1987',
      'touchstone_pictures:dead_poets_society:1989',
      'disney:aladdin:1992',
      '20th_century_fox:mrs_doubtfire:1993',
      'united_artists:the_birdcage:1996',
      'miramax:good_will_hunting:1997',
    ]);
  });

  test('uses valid, unique universe IDs', () => {
    for (const id of ids) {
      expect(isValidUniverseId(id)).toBe(true);
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('anchors every film to the FILM type and a runtime epoch', () => {
    for (const universe of robinWilliamsFilmography) {
      expect(universe.type).toBe(UniverseType.FILM);
    }

    const aladdin = robinWilliamsFilmography.find((u) => u.universeId === 'disney:aladdin:1992')!;
    expect(aladdin.epochs?.main?.endTime).toBe(BigInt(90 * 60 * 1_000_000_000));
    expect((aladdin.metadata as any).runtimeMinutes).toBe(90);
  });

  test('preserves the qualitative research fields from the source CSV', () => {
    const deadPoets = robinWilliamsFilmography.find(
      (u) => u.universeId === 'touchstone_pictures:dead_poets_society:1989',
    ) as any;
    expect(deadPoets.metadata.filmRelationships).toMatch(/Good Will Hunting/);
    expect(deadPoets.metadata.culturalImpact).toMatch(/O Captain/);
    expect(deadPoets.metadata.productionBackstory).toMatch(/desks/);
    expect(deadPoets.metadata.comicInsights).toMatch(/high-status/);
    expect(deadPoets.metadata.cultural_significance).toBe(0.94);

    // Robin Williams is always a participant, never the director or writer.
    expect(deadPoets.metadata.creators).toContain('Robin Williams');
  });

  test('connects every film to the Hollywood studio system', () => {
    for (const universe of robinWilliamsFilmography) {
      const targets = connectionsOf(universe).map((c) => c.targetUniverseId);
      expect(targets).toContain(CommonUniverseIds.HOLLYWOOD_SYSTEM);
    }
  });

  test('records the thematic links between films', () => {
    const goodMorningVietnam = robinWilliamsFilmography.find(
      (u) => u.universeId === 'touchstone_pictures:good_morning_vietnam:1987',
    )!;
    const gmvTargets = connectionsOf(goodMorningVietnam).map((c) => c.targetUniverseId);
    expect(gmvTargets).toContain('touchstone_pictures:dead_poets_society:1989');
    expect(gmvTargets).toContain('miramax:good_will_hunting:1997');

    const mrsDoubtfire = robinWilliamsFilmography.find(
      (u) => u.universeId === '20th_century_fox:mrs_doubtfire:1993',
    )!;
    const mdfTargets = connectionsOf(mrsDoubtfire).map((c) => c.targetUniverseId);
    expect(mdfTargets).toContain('united_artists:the_birdcage:1996');

    // Cross-film links use the thematic vocabulary, not the studio membership link.
    const thematic = connectionsOf(goodMorningVietnam).filter(
      (c) => c.type === 'thematically_linked',
    );
    expect(thematic.length).toBeGreaterThan(0);
  });

  test('registers — and keeps — every film universe', () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    for (const universe of robinWilliamsFilmography) {
      const id = universe.universeId as string;
      expect(() => registry.registerUniverse(id, universe)).not.toThrow();
      // Guards james-gibson/local-time#19: an epoch without `epochId` is silently dropped.
      expect(registry.getUniverse(id)).toBeDefined();
    }
  });
});
