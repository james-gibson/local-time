import { allUniverses } from '../index';
import { ConfigLoader } from '../../config-loader';
import { UniverseRegistry } from '../../universe-registry';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { isValidUniverseId, UniverseId } from '../../../core/universe-ids';
import {
  SCOTUS_TERM_ID,
  SCOTUS_MERITS_DOCKET_ID,
  SCOTUS_SHADOW_DOCKET_ID,
  scotusUniverses,
} from './index';
import { scotusOt2025MeritsCases } from './merits';
import { scotusOt2025ShadowApplications } from './shadow';

/**
 * james-gibson/local-time#88 acceptance.
 *
 * #27/#67's invariant applies: a universe present in `allUniverses` is not
 * necessarily registered, because `loadBuiltInUniverses` skips an invalid id with
 * a warning. So this asserts both — present in `allUniverses`, *and* retrievable
 * from a fresh registry — plus the containment the ticket makes an acceptance
 * criterion (§11 AC#2): `getAllDescendants(term)` must return the merits cases
 * *and* the shadow applications, and the two tracks must be distinguishable.
 */

const idOf = (universe: { universeId: string | unknown }): string => String(universe.universeId);
const asId = (value: string): UniverseId => value as unknown as UniverseId;

describe('SCOTUS October Term 2025 universes (james-gibson/local-time#88)', () => {
  test('exposes the expected collection sizes (not vacuous)', () => {
    expect(scotusOt2025MeritsCases).toHaveLength(59); // 58 argued + 1 dismissed
    expect(scotusOt2025ShadowApplications).toHaveLength(26);
    expect(scotusUniverses).toHaveLength(3 + 59 + 26); // term + 2 dockets + cases + applications
  });

  test('uses valid, unique universe IDs', () => {
    const ids = scotusUniverses.map(idOf);
    for (const id of ids) {
      expect(isValidUniverseId(id)).toBe(true);
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('every SCOTUS universe is spread into allUniverses', () => {
    const registered = new Set(allUniverses.map(idOf));
    const missing = scotusUniverses.map(idOf).filter((id) => !registered.has(id));
    expect(missing).toEqual([]);
  });

  test('every SCOTUS universe survives a real registry lookup', () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    const failures: string[] = [];
    for (const universe of scotusUniverses) {
      const id = idOf(universe);
      try {
        registry.registerUniverse(id, universe as never);
        if (!registry.getUniverse(id)) failures.push(id);
      } catch (error) {
        failures.push(`${id}: ${(error as Error).message}`);
      }
    }
    expect(failures).toEqual([]);
  });

  describe('containment (AC#2)', () => {
    // Registering the subtree is what publishes the declared
    // connections.natural.parentUniverses to CommonUniverseIds (#106).
    const registry = new UniverseRegistry(new ConfigLoader());
    for (const universe of scotusUniverses) {
      registry.registerUniverse(idOf(universe), universe as never);
    }

    test('getAllDescendants(term) returns every merits case and shadow application', () => {
      const descendants = CommonUniverseIds.getAllDescendants(SCOTUS_TERM_ID);
      for (const universe of [...scotusOt2025MeritsCases, ...scotusOt2025ShadowApplications]) {
        expect(descendants.has(asId(idOf(universe)))).toBe(true);
      }
    });

    test('the two tracks are distinguishable by their docket collection', () => {
      const meritsChildren = CommonUniverseIds.getChildren(SCOTUS_MERITS_DOCKET_ID);
      const shadowChildren = CommonUniverseIds.getChildren(SCOTUS_SHADOW_DOCKET_ID);

      const meritsId = idOf(scotusOt2025MeritsCases[0]);
      const shadowId = idOf(scotusOt2025ShadowApplications[0]);

      expect(meritsChildren.has(asId(meritsId))).toBe(true);
      expect(shadowChildren.has(asId(meritsId))).toBe(false);
      expect(shadowChildren.has(asId(shadowId))).toBe(true);
      expect(meritsChildren.has(asId(shadowId))).toBe(false);
    });

    test('both dockets are descendants of the term', () => {
      const descendants = CommonUniverseIds.getAllDescendants(SCOTUS_TERM_ID);
      expect(descendants.has(SCOTUS_MERITS_DOCKET_ID)).toBe(true);
      expect(descendants.has(SCOTUS_SHADOW_DOCKET_ID)).toBe(true);
    });
  });

  describe('composition overlay and one-owner rule', () => {
    test('the term carries a subjective overlay with recorded collisions (§3.3)', () => {
      const term = scotusUniverses.find((u) => idOf(u) === SCOTUS_TERM_ID) as unknown as {
        layers: Array<{ type: string; reality_correspondence?: { to: string; deviations: string[] } }>;
      };
      const overlay = term.layers.find((layer) => layer.type === 'subjective');
      expect(overlay).toBeDefined();
      expect(overlay!.reality_correspondence?.to).toBe(SCOTUS_TERM_ID);
      expect(overlay!.reality_correspondence!.deviations.length).toBeGreaterThan(0);
    });

    test('Trump v. Slaughter is defined once (merits), never as a shadow application', () => {
      const allIds = scotusUniverses.map(idOf);
      expect(allIds).toContain('history:scotus_ot2025_case_trump_v_slaughter:2025');
      const shadowIds = scotusOt2025ShadowApplications.map(idOf);
      expect(shadowIds.some((id) => id.includes('trump_v_slaughter'))).toBe(false);
    });

    test('captions with punctuation are pinned, not slugged into an invalid id', () => {
      // The ticket's canonical example ids (§3.1).
      const ids = new Set(scotusUniverses.map(idOf));
      expect(ids.has('history:scotus_ot2025_case_berk_v_choy:2025')).toBe(true);
      expect(ids.has('history:scotus_ot2025_case_learning_resources_v_trump:2025')).toBe(true);
      expect(ids.has('history:scotus_ot2025_case_trump_v_barbara:2025')).toBe(true);
    });
  });
});
