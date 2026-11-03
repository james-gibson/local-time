import type { Brand } from './universe-ids';

/**
 * Jurisdictions — where an organization is formed, headquartered, licensed or registered.
 *
 * ## Jurisdiction is a fact, never an id segment
 *
 * An organization is `organization:<slug>:<span>` (james-gibson/local-time#209). The
 * jurisdiction is deliberately **not** in that id, for two reasons:
 *
 * 1. **It is often unknown at entry.** A record can establish that a company exists,
 *    what it did and when, without establishing where it was formed. If the id required
 *    a jurisdiction, the recorder would have to invent one or leave the entity
 *    unaddressable — and inventing one is how a placeholder becomes a fact.
 * 2. **One entity can hold many grants.** A Wyoming LLC registered to do business in
 *    Texas, licensed in three more states and holding a federal permit has one identity
 *    and six jurisdiction-specific facts. Putting the jurisdiction in the id would make
 *    each new grant a rename, and every reference to the old id a dangling edge — the
 *    exact failure the standard id exists to prevent.
 *
 * So the id is the **central agreement**, and jurisdiction facts accrete onto it through
 * this profile. Adding `incorporatedIn` or a registration later changes no id and
 * dangles no reference. A name collision is disambiguated deliberately, in the slug, at
 * first entry (`organization:acme_llc_wyoming`), never by appending a jurisdiction.
 *
 * ## The codes are ISO 3166, not a local list
 *
 * `US` (country) and `US-WY` (country subdivision) are ISO 3166-1 alpha-2 and ISO
 * 3166-2. The set is deliberately **not enumerated here**: a hand-maintained list of
 * countries goes stale, which is what happened to `RESERVED_STUDIO_TOKENS`. Shape is
 * checked; membership is the standard's job.
 */
export type JurisdictionCode = Brand<string, 'JurisdictionCode'>;

/** ISO 3166-1 alpha-2, optionally with an ISO 3166-2 subdivision. */
const JURISDICTION_PATTERN = /^[A-Z]{2}(-[A-Z0-9]{1,3})?$/;

export function isJurisdictionCode(value: string): value is JurisdictionCode {
  return JURISDICTION_PATTERN.test(value);
}

/**
 * Normalise and brand a jurisdiction code: trim, upper-case, and treat `_` as the
 * subdivision separator. `'us_wy'`, `'US-WY'` and `' us-wy '` all become `US-WY`.
 *
 * Throws on anything that is not ISO 3166 shape, so a free-text place name cannot
 * masquerade as a jurisdiction.
 */
export function createJurisdictionCode(value: string): JurisdictionCode {
  const code = value.trim().toUpperCase().replace(/_/g, '-');
  if (!isJurisdictionCode(code)) {
    throw new Error(
      `Invalid jurisdiction code: "${value}". Use ISO 3166-1 alpha-2 ("US") ` +
        'or ISO 3166-2 ("US-WY").',
    );
  }
  return code;
}

/**
 * What a jurisdiction grants or records. The kind is separate from the jurisdiction
 * because the same jurisdiction can appear more than once: a company can be incorporated
 * there *and* hold a licence there.
 */
export type OrganizationRegistrationKind =
  /** The legal entity was formed here. */
  | 'incorporation'
  /** Registered to do business here while formed elsewhere. */
  | 'foreign_registration'
  /** A licence or charter granted by this jurisdiction. Includes permits. */
  | 'license'
  /** An agent appointed to receive service of process here. */
  | 'registered_agent';

export type OrganizationRegistrationStatus =
  | 'active'
  | 'resigned'
  | 'lapsed'
  | 'dissolved'
  /** The record establishes the grant but not whether it still stands. */
  | 'unknown';

/**
 * One jurisdiction-specific fact about an organization.
 *
 * Dates are ISO strings (`YYYY`, `YYYY-MM`, `YYYY-MM-DD`) because that is the precision
 * the record has: a filing reported as "early September" is `2026-09`, not a timestamp.
 * `from` / `to` are optional for the same reason — a fact can arrive without its date.
 */
export interface OrganizationRegistration {
  jurisdiction: JurisdictionCode;
  kind: OrganizationRegistrationKind;
  /**
   * The granting body inside the jurisdiction, when it is narrower than the state or
   * country — a state board, a federal agency (`USPS`), a registrar. Optional, because
   * the jurisdiction is often all the record has.
   */
  issuer?: string;
  /** The licence, filing or registration number, when the record gives one. */
  identifier?: string;
  from?: string;
  to?: string;
  status: OrganizationRegistrationStatus;
  /** Where this was established, when it is not the universe's own attribution. */
  source?: string;
}

/**
 * The jurisdiction facts an organization carries. Every field is optional: an entry made
 * before any of these were known is complete without them, and a later fact fills one in
 * without touching the id.
 */
export interface OrganizationProfile {
  /**
   * Where the legal entity was formed. Absent means **not established in this record**,
   * not "nowhere" — and definitely not "unknown, so pick a placeholder".
   */
  incorporatedIn?: JurisdictionCode;
  /** Where it operates from. A practical fact, not a legal one; may differ from formation. */
  headquarters?: JurisdictionCode;
  /** Every grant, in any jurisdiction and order. Absent means none is established. */
  registrations?: OrganizationRegistration[];
}

/** Every registration in one jurisdiction — incorporation, licence, agent, all of them. */
export function registrationsIn(
  profile: OrganizationProfile,
  jurisdiction: JurisdictionCode,
): OrganizationRegistration[] {
  return (profile.registrations ?? []).filter(
    (registration) => registration.jurisdiction === jurisdiction,
  );
}

/**
 * Whether the organization has any established grant in a jurisdiction.
 *
 * This is deliberately not "is licensed to operate": a registration is a recorded fact,
 * and the absence of one means the record is silent, not that the grant does not exist.
 */
export function isRegisteredIn(
  profile: OrganizationProfile,
  jurisdiction: JurisdictionCode,
): boolean {
  return registrationsIn(profile, jurisdiction).length > 0;
}

/** The registrations the record says still stand. */
export function currentRegistrations(
  profile: OrganizationProfile,
): OrganizationRegistration[] {
  return (profile.registrations ?? []).filter(
    (registration) => registration.status === 'active',
  );
}
