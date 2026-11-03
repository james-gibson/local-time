import {
  createOrganizationUniverseId,
  createPersonUniverseId,
  toIdFragment,
  type Brand,
  type OrganizationSpan,
  type OrganizationUniverseId,
  type PersonSpan,
  type PersonUniverseId,
} from './universe-ids';
import type { OrganizationProfile } from './organizations';

/**
 * Entities — organizations and people — are *addressable* before they are universes.
 *
 * A universe is a stretch of time with a work or an event in it. An organization or a
 * person is neither: it is a thing that events name, that other entities own or employ,
 * and that a record can mention long before it can date. So an entity has two states:
 *
 * 1. **A row in an entity table** — `organization:<slug>` / `person:<slug>`. Addressable,
 *    referenceable, and deliberately *not* a universe id: it has no span, so
 *    `isValidUniverseId` rejects it and it can never be mistaken for a registered universe.
 * 2. **A universe** — the same entity with a span: `organization:<slug>:<founded|…>` /
 *    `person:<slug>:<born|…>`, carrying the temporal layer every local-time universe has.
 *
 * `entityUniverseId()` is the single conversion. It returns `undefined` when the entity
 * has no span — which is what `held` and undated rows are — rather than inventing a year.
 *
 * See james-gibson/local-time#209 (the model) and #207 (the rows that were waiting).
 */

/** The two kinds of entity the vocabulary admits. */
export type EntityKind = 'organization' | 'person';

/**
 * A branded entity id — `organization:<slug>` or `person:<slug>`.
 *
 * Branded separately from `UniverseId` because it is a different promise: a `UniverseId`
 * resolves in the registry, an `EntityId` resolves in the entity table. The id shapes are
 * disjoint by arity (`<ns>:<slug>` is two segments; every declared universe pattern ends in
 * a year or a span), which is what keeps the two namespaces from colliding.
 */
export type EntityId = Brand<string, 'EntityId'>;

export type OrganizationEntityId = EntityId & `organization:${string}`;
export type PersonEntityId = EntityId & `person:${string}`;

/** The slug segment of an entity id, without its kind prefix. */
export type EntitySlugOf<T extends string> =
  T extends `${EntityKind}:${infer S}` ? S : never;

/**
 * The entity id patterns.
 *
 * Deliberately *not* exported through `UNIVERSE_ID_PATTERNS`: an entity id is not a
 * universe id, and adding these to the universe table would let `isValidUniverseId`
 * accept a spanless id that the registry can never resolve.
 */
export const ENTITY_ID_PATTERNS = {
  ORGANIZATION: /^organization:[a-z0-9_]+$/,
  PERSON: /^person:[a-z0-9_]+$/,
} as const;

export function isOrganizationEntityId(id: string): id is OrganizationEntityId {
  return ENTITY_ID_PATTERNS.ORGANIZATION.test(id);
}

export function isPersonEntityId(id: string): id is PersonEntityId {
  return ENTITY_ID_PATTERNS.PERSON.test(id);
}

export function isEntityId(id: string): id is EntityId {
  return isOrganizationEntityId(id) || isPersonEntityId(id);
}

/**
 * Brand an already-assembled entity id, validating it first.
 *
 * The counterpart of `createUniverseId`: it does not slug, it proves. Use it when the id
 * is the record's pinned address (as the `#207` table is) rather than a name to convert.
 */
export function createEntityId(id: string): EntityId {
  if (!isEntityId(id)) {
    throw new Error(`Invalid entity ID format: ${id}`);
  }
  return id;
}

export function entityIdKind(id: EntityId): EntityKind {
  return id.startsWith('organization:') ? 'organization' : 'person';
}

export function entitySlugOf(id: EntityId): string {
  return id.slice(id.indexOf(':') + 1);
}

/**
 * Mint an entity id from a human name. The slugifier is the id grammar's own
 * (`toIdFragment`), so `"Transgender Education Network of Texas"` becomes
 * `organization:transgender_education_network_of_texas` — the same lossy conversion every
 * other id factory uses. Pin the value in a test when the name matters.
 */
export function createOrganizationEntityId(name: string): OrganizationEntityId {
  const id = `organization:${toIdFragment(name)}`;
  if (!isOrganizationEntityId(id)) {
    throw new Error(`Invalid organization entity ID format: ${id}`);
  }
  return id;
}

export function createPersonEntityId(name: string): PersonEntityId {
  const id = `person:${toIdFragment(name)}`;
  if (!isPersonEntityId(id)) {
    throw new Error(`Invalid person entity ID format: ${id}`);
  }
  return id;
}

/** The span vocabulary an entity of a given kind may carry. */
export type EntitySpanOf<K extends EntityKind> = K extends 'organization'
  ? OrganizationSpan
  : PersonSpan;

/**
 * One row in an entity table.
 *
 * `id` is the addressable identity and never changes. `span` is what promotes the row:
 * when it is present, `entityUniverseId()` mints the corresponding `organization:` /
 * `person:` universe id. When it is absent the row stays a mention — which is how a
 * `held` claim, or a person the record names without dating, is represented honestly.
 *
 * There is deliberately no `registered` flag. `#207` needed one because the universe did
 * not exist yet; now the presence of `span` *is* the promotion, and there is only one
 * place the answer can come from.
 */
export interface UniverseEntity<K extends EntityKind = EntityKind> {
  /** `organization:<slug>` or `person:<slug>`. */
  id: EntityId;
  kind: K;
  /** The display name, or the name the record gives. */
  name: string;
  /** What this record says the entity did — a claim about the row, not about existence. */
  role?: string;
  /** Confidence in the role, 0–1. Existence is not graded here. */
  certainty?: number;
  /** A single-source claim held out of the record until corroborated. */
  held?: boolean;
  /** The existence span. Present ⇒ the entity is promoted to a universe. */
  span?: EntitySpanOf<K>;
  /**
   * Jurisdiction facts, when the entity is an organization and this record establishes
   * any. A row carries them only while the entity has no universe; once promoted, the
   * universe's `organizationProfile` is the canonical home. Absent is the normal entry
   * state — jurisdiction is often unknown at entry, and nothing about the id depends on
   * it (james-gibson/local-time#209).
   */
  organizationProfile?: OrganizationProfile;
}

/**
 * The universe id an entity row promotes to, or `undefined` when the row has no span.
 *
 * This is the only conversion. A caller that wants a universe must not assemble the id by
 * hand: the factory validates the span, so `organization:tent:founded` is expressible and
 * `organization:tent:whenever` throws.
 */
export function entityUniverseId(
  entity: UniverseEntity,
): OrganizationUniverseId | PersonUniverseId | undefined {
  if (entity.span === undefined) return undefined;
  const slug = entitySlugOf(entity.id);
  return entity.kind === 'organization'
    ? createOrganizationUniverseId(slug, entity.span as OrganizationSpan)
    : createPersonUniverseId(slug, entity.span as PersonSpan);
}

/**
 * Whether an entity row is promoted. Reads the span, not a stored flag — there is no
 * second source of truth to drift.
 */
export function isPromoted(entity: UniverseEntity): boolean {
  return entity.span !== undefined;
}
