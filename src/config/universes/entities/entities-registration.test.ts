import { TimePrecision, Universe, UniverseType } from '../../../core/types';
import {
  UNIVERSE_ID_PATTERNS,
  isOrganizationUniverseId,
  isPersonUniverseId,
  isValidUniverseId,
} from '../../../core/universe-ids';
import {
  createEntityId,
  entityUniverseId,
} from '../../../core/entities';
import { isJurisdictionCode } from '../../../core/organizations';
import { ConfigLoader } from '../../config-loader';
import { UniverseRegistry } from '../../universe-registry';
import { allUniverses } from '../index';
import { texasTtsuMailersUniverse } from '../historical/texas-ttsu-mailers';
import { ENTITY_SPECS, entityUniverses } from './entities';

/**
 * The `organization:` / `person:` universes and the entity table they promote from
 * (james-gibson/local-time#209).
 *
 * Membership is not registration, and a span in a spec is not a universe — so every claim
 * here is a lookup or a guard, not a read of the array (#27/#67/#98).
 */

const registry = new UniverseRegistry(new ConfigLoader());
const registered = new Set((allUniverses as unknown as Universe[]).map((u) => String(u.universeId)));

describe('the entity universes are declared, registered and resolvable', () => {
  test('the barrel is not empty and every spec produced a universe', () => {
    expect(ENTITY_SPECS.length).toBeGreaterThan(8);
    expect(entityUniverses).toHaveLength(ENTITY_SPECS.length);
    expect(new Set(entityUniverses.map((u) => String(u.universeId))).size)
      .toBe(entityUniverses.length);
  });

  test.each(entityUniverses.map((u) => [String(u.universeId), u] as const))(
    '%s is in allUniverses and survives a registry lookup',
    (id, universe) => {
      expect(registered.has(id)).toBe(true);
      expect(() => registry.registerUniverse(id, universe)).not.toThrow();
      expect(registry.getUniverse(id)).toBeDefined();
    },
  );

  test('each id matches exactly one declared domain — and it is not FILM', () => {
    for (const universe of entityUniverses) {
      const id = String(universe.universeId);
      const declared = Object.entries(UNIVERSE_ID_PATTERNS)
        .filter(([, pattern]) => pattern.test(id))
        .map(([name]) => name);
      expect(declared).toEqual([
        universe.type === UniverseType.ORGANIZATION ? 'ORGANIZATION' : 'PERSON',
      ]);
      expect(isValidUniverseId(id)).toBe(true);
    }
  });

  test('the type and the id namespace agree', () => {
    for (const universe of entityUniverses) {
      const id = String(universe.universeId);
      if (universe.type === UniverseType.ORGANIZATION) {
        expect(isOrganizationUniverseId(id)).toBe(true);
      } else {
        expect(universe.type).toBe(UniverseType.PERSON);
        expect(isPersonUniverseId(id)).toBe(true);
      }
    }
  });

  test('the entity id is an alias, not a second universe id', () => {
    for (const universe of entityUniverses) {
      const entityId = createEntityId(
        String(universe.universeId).replace(/:[^:]+$/, ''),
      );
      expect(universe.identifiers.aliases).toContain(entityId);
      expect(isValidUniverseId(entityId)).toBe(false);
      expect(registry.getUniverse(entityId)?.universeId).toBe(universe.universeId);
    }
  });
});

describe('every entity universe has the temporal layer local-time requires', () => {
  test('one primary layer, one existence epoch, with an id', () => {
    for (const universe of entityUniverses) {
      const layers = universe.layers ?? [];
      expect(layers.filter((layer) => layer.type === 'primary')).toHaveLength(1);
      const epochs = Object.values(layers[0].epochs);
      expect(epochs).toHaveLength(1);
      expect(epochs[0].epochId).toBeTruthy();
      expect(epochs[0].precision).toBeDefined();
      expect(epochs[0].description).toBeTruthy();
    }
  });

  test('an unknown founding/birth year leaves the epoch open, not fabricated', () => {
    const undated = entityUniverses.filter((universe) => {
      const span = String(universe.universeId).split(':')[2];
      return span === 'founded' || span === 'born';
    });
    expect(undated.length).toBeGreaterThan(0);

    for (const universe of undated) {
      const epoch = Object.values(universe.layers![0].epochs)[0];
      expect(epoch.startTime).toBeUndefined();
      expect(epoch.endTime).toBeDefined();
    }
  });

  test('a dated span is bounded to its years', () => {
    const llc = entityUniverses.find(
      (universe) => String(universe.universeId).endsWith('texas_transgender_student_union_llc:2026-present'),
    );
    expect(llc).toBeDefined();
    const epoch = Object.values(llc!.layers![0].epochs)[0];
    expect(epoch.precision).toBe(TimePrecision.MONTH);
    expect(epoch.startTime).toBe(BigInt(Date.parse('2026-09-01')) * 1_000_000n);
    expect(epoch.endTime).toBeGreaterThan(epoch.startTime!);
  });
});

describe('organization jurisdiction is a fact, not an id segment', () => {
  const organizations = entityUniverses.filter(
    (universe) => universe.type === UniverseType.ORGANIZATION,
  );

  test('every organization carries ISO 3166 codes, or nothing', () => {
    expect(organizations.length).toBeGreaterThan(0);
    for (const universe of organizations) {
      const profile = universe.organizationProfile;
      expect(profile).toBeDefined();
      if (profile?.incorporatedIn !== undefined) {
        expect(isJurisdictionCode(profile.incorporatedIn)).toBe(true);
      }
      if (profile?.headquarters !== undefined) {
        expect(isJurisdictionCode(profile.headquarters)).toBe(true);
      }
      for (const registration of profile?.registrations ?? []) {
        expect(isJurisdictionCode(registration.jurisdiction)).toBe(true);
      }
    }
  });

  test('a jurisdiction never appears in the id', () => {
    for (const universe of organizations) {
      expect(String(universe.universeId)).not.toMatch(/US-|US:|GB|CA-/);
    }
  });

  test('the Wyoming LLC is incorporated in Wyoming and its id says nothing about it', () => {
    const llc = organizations.find(
      (universe) => String(universe.universeId).endsWith('texas_transgender_student_union_llc:2026-present'),
    );
    expect(llc?.organizationProfile?.incorporatedIn).toBe('US-WY');
    expect(llc?.organizationProfile?.registrations?.[0]).toMatchObject({
      jurisdiction: 'US-WY',
      kind: 'incorporation',
      status: 'active',
    });
    expect(llc?.universeId).toBe(
      'organization:texas_transgender_student_union_llc:2026-present',
    );
  });
});

describe('the entity table resolves through the registry', () => {
  test('the #207 rows are addressable and the promoted ones resolve', () => {
    registry.registerUniverse(
      String((texasTtsuMailersUniverse as unknown as Universe).universeId),
      texasTtsuMailersUniverse as unknown as Universe,
    );

    expect(registry.getEntities()).toHaveLength(14);
    expect(registry.getEntities('person')).toHaveLength(6);
    expect(registry.getEntities('organization')).toHaveLength(8);

    const promoted = registry.getPromotedEntities();
    expect(promoted).toHaveLength(11);
    for (const { entity, universeId } of promoted) {
      expect(entityUniverseId(entity)).toBe(universeId);
      expect(registry.getUniverse(universeId)).toBeDefined();
    }

    const held = registry.getEntities().filter((entity) => entity.held);
    expect(held).toHaveLength(3);
    for (const entity of held) {
      expect(entityUniverseId(entity)).toBeUndefined();
    }
  });

  test('an entity row can be looked up by its addressable id', () => {
    const tent = registry.getEntity('organization:transgender_education_network_of_texas');
    expect(tent?.kind).toBe('organization');
    expect(tent?.span).toBe('founded');
    expect(registry.getEntity('person:nobody')).toBeUndefined();
  });
});
