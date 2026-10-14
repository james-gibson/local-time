import { allUniverses } from '../index';
import { ConfigLoader } from '../../config-loader';
import { UniverseRegistry } from '../../universe-registry';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { isValidUniverseId, UniverseId } from '../../../core/universe-ids';
import { RealityGradientAnalyzer } from '../../../utils/reality-gradient';
import { Universe } from '../../../core/types';
import {
  SCOTUS_TERM_ID,
  SCOTUS_MERITS_DOCKET_ID,
  SCOTUS_SHADOW_DOCKET_ID,
  scotus2013Universes,
} from './index';
import { scotusOt2013MeritsCases } from './merits';
import { scotusOt2013ShadowApplications } from './shadow';

/**
 * james-gibson/local-time#89 acceptance.
 *
 * #27/#67's invariant applies: a universe present in `allUniverses` is not
 * necessarily registered, because `loadBuiltInUniverses` skips an invalid id with
 * a warning. So this asserts both — present in `allUniverses` *and* retrievable
 * from a fresh registry — plus the containment the ticket makes an acceptance
 * criterion (§11 AC#2): `getAllDescendants(term)` must return the merits cases
 * *and* the shadow applications, and the two tracks must be distinguishable.
 *
 * The prep for this ticket (42i-prep) had flagged AC#2 as a gate: `CommonUniverseIds`
 * was closed and `getAllDescendants` read only hard-coded roots, so declaring
 * `connections.natural.parentUniverses` did not publish an edge. That gate is now
 * cleared — #74/#106 made `registerUniverseLinks` public and `UniverseRegistry`
 * derives the edges on `registerUniverse`.
 */

const idOf = (universe: { universeId: string | unknown }): string => String(universe.universeId);
const asId = (value: string): UniverseId => value as unknown as UniverseId;

describe('SCOTUS October Term 2013 universes (james-gibson/local-time#89)', () => {
  test('exposes the expected collection sizes (not vacuous)', () => {
    // 78 argued + 8 without argument + 2 order summary reversals.
    expect(scotusOt2013MeritsCases).toHaveLength(88);
    expect(scotusOt2013ShadowApplications).toHaveLength(5);
    expect(scotus2013Universes).toHaveLength(3 + 88 + 5); // term + 2 dockets + cases + applications
  });

  test('uses valid, unique universe IDs', () => {
    const ids = scotus2013Universes.map(idOf);
    for (const id of ids) {
      expect(isValidUniverseId(id)).toBe(true);
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('every SCOTUS universe is spread into allUniverses', () => {
    const registered = new Set(allUniverses.map(idOf));
    const missing = scotus2013Universes.map(idOf).filter((id) => !registered.has(id));
    expect(missing).toEqual([]);
  });

  test('every SCOTUS universe survives a real registry lookup', () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    const failures: string[] = [];
    for (const universe of scotus2013Universes) {
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

  test('the pinned example IDs from the ticket §3.1 exist verbatim', () => {
    const ids = new Set(scotus2013Universes.map(idOf));
    for (const id of [
      'history:scotus_october_term_2013:2013',
      'history:scotus_ot2013_case_burwell_v_hobby_lobby:2013',
      'history:scotus_ot2013_case_nlrb_v_noel_canning:2013',
      'history:scotus_ot2013_case_riley_v_california:2013',
      'history:scotus_ot2013_case_mccutcheon_v_fec:2013',
      'history:scotus_ot2013_shadow_13a1284_wheaton_college_v_burwell:2013',
      'history:scotus_ot2013_shadow_14a336_husted_v_ohio_naacp:2013',
      'history:scotus_ot2013_shadow_herbert_v_kitchen:2013',
    ]) {
      expect(ids.has(id)).toBe(true);
    }
  });

  describe('containment (AC#2)', () => {
    // Registering the subtree is what publishes the declared
    // connections.natural.parentUniverses to CommonUniverseIds (#106).
    const registry = new UniverseRegistry(new ConfigLoader());
    for (const universe of scotus2013Universes) {
      registry.registerUniverse(idOf(universe), universe as never);
    }

    test('getAllDescendants(term) returns every merits case and shadow application', () => {
      const descendants = CommonUniverseIds.getAllDescendants(SCOTUS_TERM_ID);
      for (const universe of [...scotusOt2013MeritsCases, ...scotusOt2013ShadowApplications]) {
        expect(descendants.has(asId(idOf(universe)))).toBe(true);
      }
    });

    test('the two tracks are distinguishable by their docket collection', () => {
      const meritsChildren = CommonUniverseIds.getChildren(SCOTUS_MERITS_DOCKET_ID);
      const shadowChildren = CommonUniverseIds.getChildren(SCOTUS_SHADOW_DOCKET_ID);

      const meritsId = idOf(scotusOt2013MeritsCases[0]);
      const shadowId = idOf(scotusOt2013ShadowApplications[0]);

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

    test('the term is contained by the US government/history levers', () => {
      const parents = CommonUniverseIds.getParents(SCOTUS_TERM_ID);
      expect(parents).toContain(CommonUniverseIds.US_GOVERNMENT);
      expect(parents).toContain(CommonUniverseIds.US_HISTORY);
    });
  });

  describe('composition overlay and one-owner rule', () => {
    const term = scotus2013Universes.find((u) => idOf(u) === SCOTUS_TERM_ID) as unknown as {
      layers: Array<{ type: string; reality_correspondence?: { to: string; deviations: string[] } }>;
    };

    test('the term carries a subjective overlay with recorded collisions (§3.3)', () => {
      const overlay = term.layers.find((layer) => layer.type === 'subjective');
      expect(overlay).toBeDefined();
      expect(overlay!.reality_correspondence?.to).toBe(SCOTUS_TERM_ID);
      expect(overlay!.reality_correspondence!.deviations.length).toBeGreaterThan(0);
      // The marquee dual-track matter is recorded, not resolved away.
      expect(overlay!.reality_correspondence!.deviations.join(' ')).toMatch(/Hobby Lobby/);
    });

    test('summary reversals are defined once, on their merits entry, not as shadow applications', () => {
      const allIds = scotus2013Universes.map(idOf);
      for (const slug of ['stanton_v_sims', 'hinton_v_alabama', 'tolan_v_cotton', 'martinez_v_illinois', 'williams_v_johnson']) {
        expect(allIds).toContain(`history:scotus_ot2013_case_${slug}:2013`);
      }
      const shadowIds = scotusOt2013ShadowApplications.map(idOf);
      expect(shadowIds.some((id) => id.includes('stanton') || id.includes('hinton') || id.includes('tolan'))).toBe(false);
    });

    test('the contraceptive-mandate matter is not double-defined', () => {
      const allIds = scotus2013Universes.map(idOf);
      // Merits owners exist...
      expect(allIds).toContain('history:scotus_ot2013_case_burwell_v_hobby_lobby:2013');
      expect(allIds).toContain('history:scotus_ot2013_case_conestoga_wood_specialties_v_burwell:2013');
      // ...and the shadow track is a *separate* application, not a second copy of the merits id.
      expect(allIds).toContain('history:scotus_ot2013_shadow_13a1284_wheaton_college_v_burwell:2013');
      expect(new Set(allIds).size).toBe(allIds.length);
    });

    test('the retroactive shadow-docket label is recorded (§1, §5)', () => {
      const shadow = scotus2013Universes.find((u) => idOf(u) === SCOTUS_SHADOW_DOCKET_ID) as unknown as {
        metadata: { shadowDocketTermCoined?: number };
      };
      expect(shadow.metadata.shadowDocketTermCoined).toBe(2015);
    });
  });

  describe('temporal, attribution and projection invariants', () => {
    test('the term segment runs 2013-10-07 to 2014-10-05 from the closed union', () => {
      const universe = scotus2013Universes.find((u) => idOf(u) === SCOTUS_TERM_ID)! as unknown as Universe;
      const segment = universe.temporalStructure!.segments[0];
      expect(segment.type).toBe('legal_period');
      const day = (ns: bigint) => new Date(Number(ns / 1_000_000n)).toISOString().slice(0, 10);
      expect(day(segment.start)).toBe('2013-10-07');
      expect(day(segment.end)).toBe('2014-10-05');
    });

    test('every window strategy is from the closed union and avgWindowSize is bigint', () => {
      const allowed = new Set(['scene_based', 'time_based', 'phase_based', 'countdown_based']);
      for (const universe of scotus2013Universes) {
        const windows = (universe as unknown as Universe).temporalStructure?.windows;
        if (!windows) continue;
        expect(allowed.has(windows.strategy)).toBe(true);
        if (windows.avgWindowSize !== undefined) {
          expect(typeof windows.avgWindowSize).toBe('bigint');
        }
      }
    });

    test('reality anchors use the RealityAnchor shape, not TemporalAnchor', () => {
      const allowed = ['depicts', 'inspired_by', 'reinterprets', 'contradicts', 'reimagines', 'documents', 'experienced'];
      for (const universe of scotus2013Universes) {
        for (const anchor of universe.realityRelation.realityAnchors) {
          expect(typeof anchor.realEventId).toBe('string');
          expect(allowed).toContain(anchor.relationshipType);
          expect(typeof anchor.confidence).toBe('number');
          expect(anchor).not.toHaveProperty('domainId');
        }
      }
    });

    test('attribution is public domain with usage_restrictions present', () => {
      for (const universe of scotus2013Universes) {
        expect(universe.attribution.public_domain).toBe(true);
        expect(Array.isArray(universe.attribution.usage_restrictions)).toBe(true);
      }
    });

    test('every universe projects as documented reality (derived, not hand-set)', () => {
      const offenders = scotus2013Universes
        .map((u) => ({ id: u.universeId as string, level: RealityGradientAnalyzer.analyzeUniverse(u).level }))
        .filter(({ level }) => level > 0.05);
      expect(offenders).toEqual([]);
    });
  });
});
