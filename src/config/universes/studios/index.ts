import {
  FilmStudioUniverseId,
  UniverseId,
  GENERIC_FILM_STUDIO_TOKEN,
  parseFilmStudioUniverseId,
} from '../../../core';
import { FILM_STUDIO_SPECS, filmStudioUniverses, studioIdFor } from './studios';

/**
 * The film-studio registry: the config-layer half of the split in
 * `src/core/universe-ids.ts`.
 *
 * `src/core` can validate that a film ID is *well-formed*, but not that its
 * studio exists, because config depends on core and never the reverse. The set
 * of studios that exist is data — the `film_studio:` universes in `./studios` —
 * so it lives here.
 *
 * See james-gibson/local-time#44.
 */

export interface FilmStudioRegistryEntry {
  /** The `film_studio:` universe a film-ID token resolves to. */
  universeId: FilmStudioUniverseId;
  slug: string;
  displayName: string;
  /** Years the studio operated, as `1918-present` or `1919-1981`. */
  years: string;
}

const registry = new Map<string, FilmStudioRegistryEntry>();
const bySlug = new Map<string, FilmStudioRegistryEntry>();

for (const spec of FILM_STUDIO_SPECS) {
  // The one place the ID grammar is assembled, and then immediately parsed back
  // through the typed accessor so no call site re-derives it with `split`/`replace`.
  const id = studioIdFor(spec.slug);
  const { span } = parseFilmStudioUniverseId(id);

  const entry: FilmStudioRegistryEntry = {
    universeId: id,
    slug: spec.slug,
    displayName: spec.displayName,
    years: span,
  };

  bySlug.set(spec.slug, entry);
  for (const token of spec.tokens) {
    // A token must resolve to exactly one studio. Two specs claiming the same
    // token would silently overwrite each other, so fail loudly instead.
    if (registry.has(token)) {
      const clash = registry.get(token)!;
      throw new Error(
        `Film studio token '${token}' is claimed by both '${clash.slug}' and '${spec.slug}'. ` +
          'A token must resolve to exactly one studio universe.',
      );
    }
    registry.set(token, entry);
  }
}

/** Every studio token that resolves to a `film_studio:` universe. */
export const FILM_STUDIO_TOKENS: readonly string[] = Object.freeze(
  [...registry.keys()].sort(),
);

/** The registry itself, keyed by film-ID token. */
export const FILM_STUDIO_REGISTRY: ReadonlyMap<string, FilmStudioRegistryEntry> = registry;

/**
 * The token a film universe ID uses when it has no studio to name. It is the
 * only "unknown studio" — a film ID is either this or a registered studio.
 */
export const DEFAULT_FILM_STUDIO_TOKEN = GENERIC_FILM_STUDIO_TOKEN;

/** Is `token` a studio that resolves to a `film_studio:` universe? */
export function isRegisteredFilmStudio(token: string): boolean {
  return registry.has(token);
}

/** The studio `token` names, or `undefined` for the generic token and unknowns. */
export function resolveFilmStudio(token: string): FilmStudioRegistryEntry | undefined {
  return registry.get(token);
}

/**
 * The studio a lineage edge names. Lineage is between *studios*, so it is keyed
 * by slug rather than by the film-ID token.
 */
export function resolveStudioBySlug(slug: string): FilmStudioRegistryEntry | undefined {
  return bySlug.get(slug);
}

/** Is `id` a `film_studio:` universe that is actually registered? */
export function isRegisteredFilmUniverseId(id: string): boolean {
  return [...registry.values()].some((entry) => entry.universeId === id);
}

/** The studio token that prepends a film universe ID. */
export function filmStudioTokenOf(filmUniverseId: string): string {
  return filmUniverseId.split(':')[0];
}

/**
 * The studio that distributed a film, resolved as of the film's own release.
 *
 * This is the whole point of the studio universes: the distributor is a fact
 * about when the film was released, so it is resolved from the film's ID rather
 * than looked up on a current roster.
 */
export function distributorOf(
  filmUniverseId: string,
): FilmStudioRegistryEntry | undefined {
  return resolveFilmStudio(filmStudioTokenOf(filmUniverseId));
}

/** Every studio universe, for registration. */
export { filmStudioUniverses };
export { FILM_STUDIO_SPECS };

/** A `UniverseId` for every studio universe, for use in parent lists. */
export const filmStudioUniverseIds: readonly UniverseId[] = filmStudioUniverses.map(
  (universe) => universe.universeId as UniverseId,
);

/**
 * A `DISTRIBUTED_BY` reference from a film universe to the studio that
 * distributed it.
 *
 * The film carries this reference for as long as its record exists. The
 * studio's later renames, acquisitions, absorptions and closures are keyframes
 * in the *studio's* universe — never edits here — because a film's distributor
 * is a fact as of its release. See james-gibson/local-time#44.
 */
export function distributedByRef(
  studioToken: string,
  note: string,
): {
  type: 'DISTRIBUTED_BY';
  targetUniverseId: FilmStudioUniverseId;
  description: string;
} {
  const entry = resolveFilmStudio(studioToken);
  if (!entry) {
    throw new Error(
      `'${studioToken}' is not a registered film studio. Add it to FILM_STUDIO_SPECS, ` +
        'or use DEFAULT_FILM_STUDIO_TOKEN for a film with no studio to name.',
    );
  }
  return {
    type: 'DISTRIBUTED_BY',
    targetUniverseId: entry.universeId,
    description:
      `${note} The distributor is recorded as of this film's release; the studio's ` +
      'later renames, acquisitions and closures are keyframes in its own universe.',
  };
}
