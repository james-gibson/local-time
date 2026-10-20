import type { CreatorAssignments, CreatorRef, CreatorRole } from './types';

/**
 * Creator credits, keyed by person (#148).
 *
 * `Attribution.creators` used to be role-keyed `string[]`:
 *
 *     creators: { director: ['Duncan Jones'], writer: ['Charles Leavitt', 'Duncan Jones'] }
 *
 * That shape cannot say "this is the same person" except by spelling, and it cannot say
 * "this person is a universe". It is now one `CreatorRef` per person, with the roles as a
 * list, so a director who also wrote the film is one entry:
 *
 *     creators: [
 *       { name: 'Duncan Jones', roles: ['director', 'writer'] },
 *       { name: 'Charles Leavitt', roles: ['writer'] },
 *     ]
 *
 * Authoring stays role-keyed (`CreatorAssignments`), because that is how a credit roll
 * reads. `creatorRefs()` is the single conversion, used by the builder and by the literal
 * universes that cannot go through it.
 */

/**
 * The order roles are recorded in. Iterating in this order makes the person order — and
 * therefore the derived `metadata.creators` name list — identical to the old role-keyed
 * de-duplication, so retrieval text does not move.
 */
export const CREATOR_ROLE_ORDER: readonly CreatorRole[] = [
  'director',
  'writer',
  'producer',
  'host',
  'researcher',
  'historical_advisor',
  'participant',
  'actor',
  'composer',
];

/**
 * `based_on` is deliberately absent: it names a source *work*, not a person, and
 * `withCreators` routes it to `metadata.based_on`.
 */
const ASSIGNMENTS: ReadonlyArray<[keyof Omit<CreatorAssignments, 'based_on'>, CreatorRole]> = [
  ['director', 'director'],
  ['writer', 'writer'],
  ['producer', 'producer'],
  ['host', 'host'],
  ['researcher', 'researcher'],
  ['historical_advisors', 'historical_advisor'],
  ['participant', 'participant'],
  ['actor', 'actor'],
  ['composer', 'composer'],
];

/**
 * Trim and collapse internal whitespace, so `'Duncan  Jones'` and `'Duncan Jones'` are the
 * same person. Case is left alone: `'duncan jones'` and `'Duncan Jones'` may be a credit
 * typo or two people, and lowercasing the display name would destroy the label.
 */
export function normaliseCreatorName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}

/**
 * Convert role-keyed credits into one `CreatorRef` per person.
 *
 * A person credited under two roles gets one entry with both roles. When the same person is
 * named twice and only one credit carries a `personId`, the id is kept.
 */
export function creatorRefs(assignments: CreatorAssignments): CreatorRef[] {
  const refs: CreatorRef[] = [];
  const byName = new Map<string, CreatorRef>();

  for (const [key, role] of ASSIGNMENTS) {
    for (const credit of assignments[key] ?? []) {
      const name = normaliseCreatorName(typeof credit === 'string' ? credit : credit.name);
      if (!name) continue;

      const personId = typeof credit === 'string' ? undefined : credit.personId;
      let ref = byName.get(name);
      if (!ref) {
        ref = { name, roles: [] };
        if (personId) ref.personId = personId;
        byName.set(name, ref);
        refs.push(ref);
      } else if (personId && !ref.personId) {
        ref.personId = personId;
      }

      if (!ref.roles.includes(role)) ref.roles.push(role);
    }
  }

  return refs;
}

/** The display names of `refs`, in order — the `metadata.creators` projection. */
export function creatorNames(refs: readonly CreatorRef[] | undefined): string[] {
  return (refs ?? []).map((ref) => ref.name);
}

/**
 * Merge `incoming` refs into `existing` by person, so `withCreators` can be called more
 * than once (the old builder merged per role). Order is `existing` first, then new people.
 */
export function mergeCreatorRefs(
  existing: readonly CreatorRef[] | undefined,
  incoming: readonly CreatorRef[],
): CreatorRef[] {
  const merged: CreatorRef[] = (existing ?? []).map((ref) => ({ ...ref, roles: [...ref.roles] }));
  const byName = new Map(merged.map((ref) => [normaliseCreatorName(ref.name), ref]));

  for (const ref of incoming) {
    const name = normaliseCreatorName(ref.name);
    const found = byName.get(name);
    if (!found) {
      const copy = { ...ref, roles: [...ref.roles] };
      merged.push(copy);
      byName.set(name, copy);
      continue;
    }
    if (ref.personId && !found.personId) found.personId = ref.personId;
    for (const role of ref.roles) {
      if (!found.roles.includes(role)) found.roles.push(role);
    }
  }

  return merged;
}

/** The people credited in `role`, in recorded order. */
export function creatorsInRole(
  refs: readonly CreatorRef[] | undefined,
  role: CreatorRole,
): CreatorRef[] {
  return (refs ?? []).filter((ref) => ref.roles.includes(role));
}
