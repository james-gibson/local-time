import {
  createJurisdictionCode,
  currentRegistrations,
  isJurisdictionCode,
  isRegisteredIn,
  registrationsIn,
  type OrganizationProfile,
} from '../organizations';
import { createEntityId, entityUniverseId, type UniverseEntity } from '../entities';
import { UniverseBuilder } from '../universe-builder';

/**
 * james-gibson/local-time#209 — jurisdiction is a fact, not an id segment.
 *
 * A corporation is formed in one jurisdiction and may be licensed, registered or
 * represented in many others. Any of those facts can be missing when the entity is first
 * recorded. So the id must not depend on them, and this profile is where they accrete.
 * These tests pin the grammar, the multiplicity, and the one property that matters most:
 * **adding a jurisdiction never changes an id.**
 */

describe('jurisdiction codes are ISO 3166, not free text', () => {
  test('country and subdivision forms are accepted', () => {
    for (const code of ['US', 'GB', 'US-WY', 'CA-ON', 'AU-NSW']) {
      expect(createJurisdictionCode(code)).toBe(code);
      expect(isJurisdictionCode(code)).toBe(true);
    }
  });

  test('input is normalised, so "us_wy" and " us-wy " are the same address', () => {
    expect(createJurisdictionCode(' us_wy ')).toBe('US-WY');
    expect(createJurisdictionCode('us-wy')).toBe('US-WY');
  });

  test('a place name is not a jurisdiction', () => {
    for (const value of ['wyoming', 'USA-WY', 'U', 'US WY', '', 'US-WYOMING']) {
      expect(isJurisdictionCode(value)).toBe(false);
      expect(() => createJurisdictionCode(value)).toThrow();
    }
  });
});

describe('one entity, many jurisdiction facts', () => {
  const WY = createJurisdictionCode('US-WY');
  const TX = createJurisdictionCode('US-TX');
  const CA = createJurisdictionCode('US-CA');

  const profile: OrganizationProfile = {
    incorporatedIn: WY,
    headquarters: WY,
    registrations: [
      { jurisdiction: WY, kind: 'incorporation', from: '2026-09', status: 'active' },
      { jurisdiction: TX, kind: 'foreign_registration', from: '2026-10', status: 'active' },
      { jurisdiction: CA, kind: 'license', from: '2026-10', to: '2026-11', status: 'lapsed' },
    ],
  };

  test('a grant may name the issuing body and its number, when the record has them', () => {
    const withPermit: OrganizationProfile = {
      registrations: [
        {
          jurisdiction: createJurisdictionCode('US'),
          kind: 'license',
          issuer: 'USPS',
          identifier: 'permit-3615',
          status: 'unknown',
        },
      ],
    };
    expect(withPermit.registrations?.[0].issuer).toBe('USPS');
    expect(withPermit.registrations?.[0].identifier).toBe('permit-3615');
  });

  test('the same jurisdiction can appear more than once', () => {
    expect(registrationsIn(profile, WY)).toHaveLength(1);
    expect(registrationsIn(profile, TX)).toHaveLength(1);
    expect(isRegisteredIn(profile, TX)).toBe(true);
    expect(isRegisteredIn(profile, CA)).toBe(true);
    expect(isRegisteredIn(profile, createJurisdictionCode('US-IL'))).toBe(false);
  });

  test('only active grants are current', () => {
    expect(currentRegistrations(profile).map((r) => r.jurisdiction)).toEqual([WY, TX]);
  });

  test('a profile can be empty, because entry may establish none of this', () => {
    const empty: OrganizationProfile = {};
    expect(currentRegistrations(empty)).toEqual([]);
    expect(isRegisteredIn(empty, WY)).toBe(false);
  });
});

describe('jurisdiction never enters the id', () => {
  const row = (organizationProfile?: OrganizationProfile): UniverseEntity => ({
    id: createEntityId('organization:acme_llc'),
    kind: 'organization',
    name: 'Acme LLC',
    span: 'founded',
    organizationProfile,
  });

  test('the id is the same whether or not any jurisdiction is known', () => {
    const bare = entityUniverseId(row());
    const later = entityUniverseId(
      row({
        incorporatedIn: createJurisdictionCode('US-WY'),
        registrations: [
          {
            jurisdiction: createJurisdictionCode('US-TX'),
            kind: 'foreign_registration',
            status: 'active',
          },
        ],
      }),
    );

    expect(bare).toBe('organization:acme_llc:founded');
    expect(later).toBe(bare);
  });

  test('a later licence cannot rename the entity or dangle a reference', () => {
    // This is the property the standard id exists for: the fact arriving after entry
    // changes the profile, never the address every other universe already points at.
    const before = entityUniverseId(row({ incorporatedIn: createJurisdictionCode('US-WY') }));
    const after = entityUniverseId(
      row({
        incorporatedIn: createJurisdictionCode('US-WY'),
        registrations: [
          {
            jurisdiction: createJurisdictionCode('US-WY'),
            kind: 'incorporation',
            from: '2020',
            status: 'active',
          },
          {
            jurisdiction: createJurisdictionCode('US-CA'),
            kind: 'license',
            from: '2024',
            status: 'active',
          },
        ],
      }),
    );
    expect(after).toBe(before);
  });
});

describe('the builder accumulates jurisdiction facts without dropping earlier ones', () => {
  test('incorporatedIn survives a later registration call', () => {
    const built = new UniverseBuilder()
      .film('film', 'jurisdiction_probe', 2024)
      .withRuntime(90)
      .withRealityRelation('pure_fiction', 1.0)
      .withCopyright(['Probe'], 2024)
      .withOrganizationProfile({ incorporatedIn: createJurisdictionCode('US-WY') })
      .withOrganizationProfile({
        registrations: [
          {
            jurisdiction: createJurisdictionCode('US-TX'),
            kind: 'foreign_registration',
            status: 'active',
          },
        ],
      })
      .build();

    expect(built.organizationProfile?.incorporatedIn).toBe('US-WY');
    expect(built.organizationProfile?.registrations).toHaveLength(1);
    expect(entityUniverseId({
      id: createEntityId('organization:acme_llc'),
      kind: 'organization',
      name: 'Acme LLC',
      span: 'founded',
      organizationProfile: built.organizationProfile,
    })).toBe('organization:acme_llc:founded');
  });
});
