import { Universe, UniverseType } from '../../../core/types';
import { isValidUniverseId } from '../../../core/universe-ids';
import { ConfigLoader } from '../../config-loader';
import { UniverseRegistry } from '../../universe-registry';
import {
  sccsUniverse,
  rcsUniverse,
  cvsUniverse,
  subversionUniverse,
  bitKeeperUniverse,
  gitUniverse,
  mercurialUniverse,
} from './versionControlSystems.universe';
import { versionControlUniverses } from './index';

const architecture = (u: Universe): string => (u.metadata as any).vcsArchitecture;

const references = (u: Universe): Array<{ type: string; targetUniverseId: string }> =>
  ((u as any).connections?.references ?? []) as Array<{ type: string; targetUniverseId: string }>;

const keyframeIds = (u: Universe): string[] =>
  ((u.temporalStructure as any).keyframes ?? []).map((k: any) => k.id as string);

describe('Version control system universes (james-gibson/local-time#7)', () => {
  test('exposes the seven researched systems in chronological order', () => {
    expect(versionControlUniverses).toHaveLength(7);
    expect(versionControlUniverses.map((u) => u.universeId)).toEqual([
      'technology:sccs:1972',
      'technology:rcs:1982',
      'technology:cvs:1986',
      'technology:subversion:2000',
      'technology:bitkeeper:2000',
      'technology:git:2005',
      'technology:mercurial:2005',
    ]);
  });

  test('uses valid, unique technology universe IDs', () => {
    const ids = versionControlUniverses.map((u) => u.universeId as string);
    for (const id of ids) {
      expect(isValidUniverseId(id)).toBe(true);
      expect(id.startsWith('technology:')).toBe(true);
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('marks every system as a documentary TECHNOLOGY universe', () => {
    for (const u of versionControlUniverses) {
      expect(u.type).toBe(UniverseType.TECHNOLOGY);
      expect(u.realityRelation.type).toBe('documentary');
      expect(u.realityRelation.fictionalizationDegree).toBe(0.0);
      expect(['centralized', 'distributed']).toContain(architecture(u));
    }
  });

  test('splits the timeline into four centralized and three distributed systems', () => {
    expect(versionControlUniverses.filter((u) => architecture(u) === 'centralized').map((u) => u.universeId)).toEqual([
      'technology:sccs:1972',
      'technology:rcs:1982',
      'technology:cvs:1986',
      'technology:subversion:2000',
    ]);
    expect(versionControlUniverses.filter((u) => architecture(u) === 'distributed').map((u) => u.universeId)).toEqual([
      'technology:bitkeeper:2000',
      'technology:git:2005',
      'technology:mercurial:2005',
    ]);
  });

  test('models the centralized inheritance chain from SCCS to Subversion', () => {
    expect(references(rcsUniverse)).toContainEqual(
      expect.objectContaining({ type: 'INSPIRED_BY', targetUniverseId: 'technology:sccs:1972' }),
    );
    expect(references(cvsUniverse)).toContainEqual(
      expect.objectContaining({ type: 'EXTENDS', targetUniverseId: 'technology:rcs:1982' }),
    );
    expect(references(subversionUniverse)).toContainEqual(
      expect.objectContaining({ type: 'SUPERSEDES', targetUniverseId: 'technology:cvs:1986' }),
    );
  });

  test('models the distributed fork: Git and Mercurial both respond to BitKeeper', () => {
    for (const u of [gitUniverse, mercurialUniverse]) {
      expect(references(u)).toContainEqual(
        expect.objectContaining({ type: 'CREATED_IN_RESPONSE_TO', targetUniverseId: 'technology:bitkeeper:2000' }),
      );
      expect(references(u).some((r) => r.type === 'CONTEMPORARY_OF')).toBe(true);
    }
    expect(references(bitKeeperUniverse).some((r) => r.type === 'CONTEMPORARY_OF')).toBe(true);
  });

  test('records authentic milestone dates for Git', () => {
    expect(keyframeIds(gitUniverse)).toEqual([
      'initial_commit',
      'maintainership_to_hamano',
      'git_1_0',
    ]);
  });

  test('records the 1.0 release milestones for Subversion and Mercurial', () => {
    expect(keyframeIds(subversionUniverse)).toContain('subversion_1_0');
    expect(keyframeIds(mercurialUniverse)).toContain('mercurial_1_0');
  });

  test('registers every version-control universe without throwing', () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    for (const universe of versionControlUniverses) {
      const id = universe.universeId as string;
      expect(() => registry.registerUniverse(id, universe)).not.toThrow();
      expect(registry.getUniverse(id)).toBeDefined();
    }
  });
});
