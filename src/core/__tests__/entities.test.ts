import {
  ENTITY_ID_PATTERNS,
  createEntityId,
  createOrganizationEntityId,
  createPersonEntityId,
  entityIdKind,
  entitySlugOf,
  entityUniverseId,
  isEntityId,
  isOrganizationEntityId,
  isPersonEntityId,
  type UniverseEntity,
} from '../entities';
import {
  UNIVERSE_ID_PATTERNS,
  createOrganizationUniverseId,
  createPersonUniverseId,
  isOrganizationUniverseId,
  isPersonUniverseId,
  isValidUniverseId,
  isFilmUniverseId,
} from '../universe-ids';
import { UniverseBuilder } from '../universe-builder';

/**
 * james-gibson/local-time#209 — organizations and people are entities first.
 *
 * Three things are being pinned here, and each of them is a place the model could go
 * wrong silently:
 *
 * 1. **The two namespaces cannot collide.** An entity id is two segments; every declared
 *    universe pattern ends in a year or a span. So `organization:tent` is addressable but
 *    is not a universe id, and `organization:tent:founded` is a universe id but not an
 *    entity id.
 * 2. **A span is the promotion.** `entityUniverseId` returns `undefined` without one, and
 *    the `founded` / `born` tokens are real: a promoted row with no established year has
 *    no fabricated start.
 * 3. **The new namespaces are not films.** FILM is the generic three-segment pattern; a
 *    new namespace that is not reserved reads as a film, which is the #57/#50 trap.
 */

describe('entity ids are addressable and distinct from universe ids', () => {
  test('the patterns accept exactly the two kinds', () => {
    expect(isOrganizationEntityId('organization:tent')).toBe(true);
    expect(isPersonEntityId('person:jon_bonck')).toBe(true);
    expect(isEntityId('organization:tent')).toBe(true);
    expect(isEntityId('person:jon_bonck')).toBe(true);
  });

  test('a span makes it a universe id, not an entity id', () => {
    expect(isEntityId('organization:tent:founded')).toBe(false);
    expect(isEntityId('person:jon_bonck:born')).toBe(false);
    expect(ENTITY_ID_PATTERNS.ORGANIZATION.test('organization:tent:founded')).toBe(false);
  });

  test('an unspanned entity id is not a valid universe id', () => {
    // The whole point of the two namespaces: `metadata.entities` rows can never be
    // mistaken for a registered universe, however they are typed.
    for (const id of [
      'organization:tent',
      'person:jon_bonck',
      'organization:three_z_printing',
    ]) {
      expect(isValidUniverseId(id)).toBe(false);
    }
  });

  test('a promoted entity id is a valid universe id', () => {
    for (const id of [
      'organization:tent:founded',
      'organization:texas_transgender_student_union_llc:2026-present',
      'person:jon_bonck:born',
      'person:jeff_lech:1973-present',
    ]) {
      expect(isValidUniverseId(id)).toBe(true);
    }
  });

  test('the kind and slug come out of the id', () => {
    expect(entityIdKind(createEntityId('organization:tent'))).toBe('organization');
    expect(entityIdKind(createEntityId('person:jon_bonck'))).toBe('person');
    expect(entitySlugOf(createEntityId('person:jon_bonck'))).toBe('jon_bonck');
  });

  test('the id factories normalise a name and validate their own output', () => {
    expect(createOrganizationEntityId('Transgender Education Network of Texas'))
      .toBe('organization:transgender_education_network_of_texas');
    expect(createPersonEntityId('Jon Bonck')).toBe('person:jon_bonck');
    expect(() => createEntityId('organization:TENT')).toThrow();
    expect(() => createEntityId('organization:tent:founded')).toThrow();
  });
});

describe('organization universes: organization:<slug>:<span>', () => {
  test('the factory emits a declared id', () => {
    expect(createOrganizationUniverseId('tent', 'founded')).toBe('organization:tent:founded');
    expect(createOrganizationUniverseId('Texas Transgender Student Union LLC', '2026-present'))
      .toBe('organization:texas_transgender_student_union_llc:2026-present');
    expect(createOrganizationUniverseId('nrc', 1866)).toBe('organization:nrc:1866');
  });

  test('the domain guard, not the catch-all, is the claim', () => {
    const id = createOrganizationUniverseId('tent', 'founded');
    expect(isOrganizationUniverseId(id)).toBe(true);
    expect(isValidUniverseId(id)).toBe(true);
    const declared = Object.entries(UNIVERSE_ID_PATTERNS)
      .filter(([, pattern]) => pattern.test(id))
      .map(([name]) => name);
    expect(declared).toEqual(['ORGANIZATION']);
  });

  test('an undated organization is representable without inventing a year', () => {
    expect(isOrganizationUniverseId('organization:tent:founded')).toBe(true);
    expect(isOrganizationUniverseId('organization:tent:*')).toBe(true);
    expect(isOrganizationUniverseId('organization:tent')).toBe(false);
    expect(isOrganizationUniverseId('organization:tent:whenever')).toBe(false);
    expect(() => createOrganizationUniverseId('tent', 'whenever' as never)).toThrow();
  });
});

describe('person universes: person:<slug>:<span>', () => {
  test('the factory emits a declared id', () => {
    expect(createPersonUniverseId('jon_bonck', 'born')).toBe('person:jon_bonck:born');
    expect(createPersonUniverseId('jeff_leach', '1973-present')).toBe('person:jeff_leach:1973-present');
  });

  test('the domain guard, not the catch-all, is the claim', () => {
    const id = createPersonUniverseId('jon_bonck', 'born');
    expect(isPersonUniverseId(id)).toBe(true);
    expect(isValidUniverseId(id)).toBe(true);
    const declared = Object.entries(UNIVERSE_ID_PATTERNS)
      .filter(([, pattern]) => pattern.test(id))
      .map(([name]) => name);
    expect(declared).toEqual(['PERSON']);
  });

  test('a person is not a biography, and neither is a film', () => {
    // `biography:` is a work about a person; `person:` is the person. Both are people
    // for a CreatorRef, but only one is the entity.
    expect(isPersonUniverseId('biography:jrr_tolkien:1892-1973')).toBe(false);
    expect(isPersonUniverseId('person:jon_bonck:born')).toBe(true);
    expect(isFilmUniverseId('person:jon_bonck:born')).toBe(false);
    expect(isFilmUniverseId('organization:tent:founded')).toBe(false);
  });

  test('a person with no established birth year is representable', () => {
    expect(isPersonUniverseId('person:ayden_runnels:born')).toBe(true);
    expect(isPersonUniverseId('person:ayden_runnels')).toBe(false);
    // The `biography:` shape still requires a year — it is a work about a life, and a
    // work with no span is not a biography.
    expect(isValidUniverseId('biography:ayden_runnels:born')).toBe(false);
  });
});

describe('entityUniverseId is the only promotion', () => {
  const row = (over: Partial<UniverseEntity>): UniverseEntity => ({
    id: createEntityId('person:jon_bonck'),
    kind: 'person',
    name: 'Jon Bonck',
    ...over,
  });

  test('no span means no universe', () => {
    expect(entityUniverseId(row({}))).toBeUndefined();
    expect(entityUniverseId(row({ held: true }))).toBeUndefined();
  });

  test('a span mints the matching universe id', () => {
    expect(entityUniverseId(row({ span: 'born' }))).toBe('person:jon_bonck:born');

    const organization = row({
      id: createEntityId('organization:texas_transgender_student_union_llc'),
      kind: 'organization',
      name: 'TTSU LLC',
      span: '2026-present',
    });
    expect(entityUniverseId(organization))
      .toBe('organization:texas_transgender_student_union_llc:2026-present');
  });

  test('the minted id passes its domain guard', () => {
    expect(isPersonUniverseId(String(entityUniverseId(row({ span: 'born' }))))).toBe(true);
  });

  test('the builder carries entity rows, so a built universe can name them too', () => {
    const built = new UniverseBuilder()
      .film('film', 'entity_builder_probe', 2024)
      .withRuntime(90)
      .withRealityRelation('pure_fiction', 1.0)
      .withCopyright(['Probe'], 2024)
      .withEntities([row({ span: 'born' })])
      .withEntities([
        row({
          id: createEntityId('organization:example'),
          kind: 'organization',
          name: 'Example Org',
          span: 'founded',
        }),
      ])
      .build();

    expect(built.entities).toHaveLength(2);
    expect(entityUniverseId(built.entities![0])).toBe('person:jon_bonck:born');
    expect(entityUniverseId(built.entities![1])).toBe('organization:example:founded');
  });
});
