import { allUniverses } from './index';
import { ConfigLoader } from '../config-loader';
import { UniverseRegistry } from '../universe-registry';
import { resolveFilmStudio } from './studios';
import { CommonUniverseIds } from '../../core/common-universe-ids';
import { isValidUniverseId } from '../../core/universe-ids';
import type { Universe } from '../../core/types';

/**
 * james-gibson/local-time#74 — containment: **one owner, many memberships**.
 *
 * `allUniverses` is a flat array, and the registry registered a universe under
 * its `universeId`. So a film that belongs to two collections (a studio's
 * releases *and* a director's filmography) could only be registered once, and
 * #73 resolved the collision by removing the duplicate and folding its
 * keyframes onto the survivor — losing the collection membership.
 *
 * The model is not actually flat: a universe has one *owner* and any number of
 * *containers* it is a member of. `UniverseRegistry` derives those edges from
 * the declared parents — the top-level `connections.natural.parentUniverses`
 * (hand-authored literals) and the builder's `metadata.connections`
 * `member_of` entries — and this suite pins the invariant.
 */

const universes = allUniverses as unknown as Universe[];
const ids = universes.map((universe) => String(universe.universeId));

/**
 * Every universe registered, as the pipeline does it. `allUniverses` should be
 * flat; flattening anyway means a nested collection (which `registerUniverse`
 * would otherwise see as a non-universe) cannot hide a duplicate.
 */
const registry = (() => {
  const instance = new UniverseRegistry(new ConfigLoader());
  for (const entry of allUniverses as unknown as unknown[]) {
    for (const universe of Array.isArray(entry) ? entry : [entry]) {
      const id = (universe as { universeId?: string })?.universeId;
      if (id) instance.registerUniverse(id, universe as never);
    }
  }
  return instance;
})();

describe('containment: one owner, many memberships (james-gibson/local-time#74)', () => {
  test('every id has exactly one owner — no duplicate universeId in allUniverses', () => {
    const counts = new Map<string, number>();
    for (const id of ids) counts.set(id, (counts.get(id) ?? 0) + 1);

    const duplicates = [...counts.entries()]
      .filter(([, count]) => count > 1)
      .map(([id]) => id);

    expect(duplicates).toEqual([]);
  });

  test('the model is not vacuous — universes really do have memberships', () => {
    const withMemberships = ids.filter((id) => registry.getMemberships(id).length > 0);
    expect(withMemberships.length).toBeGreaterThan(0);
  });

  test('every membership is a well-formed universe id', () => {
    const malformed = ids
      .flatMap((id) => registry.getMemberships(id).map((parent) => [id, String(parent)] as const))
      .filter(([, parent]) => !isValidUniverseId(parent));

    expect(malformed).toEqual([]);
  });

  test('a literal-declared membership is real (owner is separate from memberships)', () => {
    // idioms: idiocracy.ts declares HOLLYWOOD_SYSTEM / US_HISTORY / WORLD_HISTORY
    // in the top-level `connections.natural.parentUniverses` object.
    const idiocracy = '20th_century_fox:idiocracy:2006';
    expect(registry.getOwner(idiocracy)).toBeDefined();
    expect(registry.getMemberships(idiocracy)).toEqual(
      expect.arrayContaining([
        CommonUniverseIds.HOLLYWOOD_SYSTEM,
        CommonUniverseIds.US_HISTORY,
        CommonUniverseIds.WORLD_HISTORY,
      ]),
    );
  });

  test('a builder-declared membership is real too — the two vocabularies agree', () => {
    // `pixar/films.ts` declares containment with the builder
    // (`.addConnection({ type: 'member_of' })`), which lands in
    // `metadata.connections`. The registry folds it in alongside the literal form.
    expect(registry.getMemberships('pixar:toy_story:1995')).toEqual(
      expect.arrayContaining([
        CommonUniverseIds.PIXAR_STUDIO,
        CommonUniverseIds.TOY_STORY_FRANCHISE,
      ]),
    );
    expect(registry.contains(CommonUniverseIds.PIXAR_STUDIO, 'pixar:toy_story:1995')).toBe(true);
  });

  test('the #73 folds are memberships again, not second universes', () => {
    const fox = resolveFilmStudio('20th_century_fox')!.universeId;

    for (const id of ['20th_century_fox:titanic:1997', '20th_century_fox:avatar:2009']) {
      // It is a 20th Century Fox release ...
      expect(registry.getMemberships(id)).toContain(fox);
      expect(registry.contains(fox, id)).toBe(true);
      // ... and it is still owned by the James Cameron filmography. Creators are keyed by
      // person (#148), so the credit is a `CreatorRef` rather than a `director` name list.
      const creators = registry.getOwner(id)?.attribution.creators ?? [];
      expect(
        creators.some((c) => c.name === 'James Cameron' && c.roles.includes('director')),
      ).toBe(true);
    }
  });

  /**
   * The two private notes published as exemplars (james-gibson/local-time#153). They are
   * the owner's own data, and they attach in different ways on purpose: the podcast is
   * *contained* by the lab, the energy log is only *referenced* by it.
   *
   * The lab (`personal:lab:2026`) is generated from the KB, so on a checkout without the
   * git-ignored `imported/` tree it has no owner yet. That is fine and is the point of
   * pinning the *edge* rather than the owner: containment is declared by the child, and
   * `resolveDeclaredName` resolves an id whether or not its universe is registered.
   */
  test('the published private notes attach to the lab', () => {
    const lab = 'personal:lab:2026';
    const podcast = 'podcast:the_dammed_river:2025';
    const energyLog = 'home_energy_monitoring:user_redacted_202509:2026';

    // The podcast is contained: The Dammed River is a member of the lab.
    expect(registry.getMemberships(podcast).map(String)).toContain(lab);
    expect(registry.contains(lab, podcast)).toBe(true);

    // The energy log is referenced, not contained — it is the owner's artefact, and the
    // lab's side of the relationship is a `connections.references` edge, not containment.
    expect(registry.getMemberships(energyLog).map(String)).not.toContain(lab);
    expect(registry.contains(lab, energyLog)).toBe(false);
  });

  test('a container is not its own descendant — containment is acyclic', () => {
    for (const container of [
      CommonUniverseIds.HOLLYWOOD_SYSTEM,
      CommonUniverseIds.US_HISTORY,
      CommonUniverseIds.PIXAR_STUDIO,
    ]) {
      expect(registry.getDescendants(container)).not.toContain(container);
    }
  });

  test('a second registration of an id does not replace the owner', () => {
    const fresh = new UniverseRegistry(new ConfigLoader());
    const original = universes.find((u) => String(u.universeId) === 'history:costco:1983')!;
    const impostor = { ...(original as object) } as unknown as Universe;

    fresh.registerUniverse('history:costco:1983', original);
    const owner = fresh.getOwner('history:costco:1983');
    fresh.registerUniverse('history:costco:1983', impostor);

    expect(owner).toBeDefined();
    expect(fresh.getOwner('history:costco:1983')).toBe(owner);
  });
});
