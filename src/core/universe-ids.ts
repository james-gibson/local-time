// import {
//   createFromMerge, createSourceString,decodeSourceString,
//   RUNTIME_GENESIS_FART,
//
//     main,
// } from './sparklefart-ids';
/**
 * Branded types for Universe IDs to prevent magic string issues
 * and provide type safety for universe identification
 */
// import KSUID from 'ksuid';
// import {KSUIDConverter} from '../utils/ksuid-converter';
export type Brand<K, T extends string> = K & { readonly [P in T]: T};
// Base branded type for universe IDs
export type UniverseId = Brand<string & { __brand: 'UniverseId'},'UniverseId'>;
/** A reversed, base64 encoded UniverseId, representing the direct parent or parents. */
export type SourceString = Brand<UniverseId, 'SourceString'>;

/** A time-ordered UUIDv7 used to identify the specific event or "trace". */
export type UuidV7String = Brand<string, 'UuidV7String'>;

/** A KSUID string, providing the primary sort key for UniverseIds. */
export type KsuidString = Brand<string, 'KsuidString'>;

/** An identifier for the event, which can be another entity's source or a new UUID. */
export type TraceId = SourceString | UuidV7String;

/** The parsed components of a Universe ID. */
// export type ParsedUniverseId = {
//   source: SourceString;
//   trace: TraceId;
//   ksuid: KsuidString;
// };
// Specific branded types for different universe categories
export type SparkleFartUniverseId = Brand<SourceString, 'SparkleFartUniverseId'>;
export type FilmUniverseId = UniverseId & { readonly __filmBrand: true };
export type SeriesUniverseId = UniverseId & { readonly __seriesBrand: true };
export type BookUniverseId = UniverseId & { readonly __bookBrand: true };
export type FashionUniverseId = UniverseId & { readonly __fashionBrand: true };
export type HistoricalUniverseId = UniverseId & { readonly __historicalBrand: true };
export type PersonalUniverseId = UniverseId & { readonly __personalBrand: true };
export type MissionUniverseId = UniverseId & { readonly __missionBrand: true };
export type LegalUniverseId = UniverseId & { readonly __legalBrand: true };
export type BiographyUniverseId = UniverseId & { readonly __biographyBrand: true };
export type GameUniverseId = UniverseId & { readonly __gameBrand: true };
export type CyberSecurityUniverseId = UniverseId & { readonly __cyberSecurityBrand: true };

/**
 * A technology universe: `technology:<slug>:<span>`.
 *
 * Renamed from `TechnicalUniverseId` in local-time#21. The old name said "technical"
 * while the ids said "technology", and the pattern that backed it said `technical:`
 * again — three names for one thing, two of them unused, and the disagreement is what
 * broke `createTechnologyUniverseId`. Aligning the type with `UniverseType.TECHNOLOGY`
 * and the `technology:` domain removes the ambiguity.
 */
export type TechnologyUniverseId = UniverseId & { readonly __technologyBrand: true };

/**
 * @deprecated Use {@link TechnologyUniverseId}. Retained so existing importers still
 * resolve; the `technical:` prefix it once described is not used by any universe.
 */
export type TechnicalUniverseId = TechnologyUniverseId;

/** A specification of the system itself — an ID schema, a typology, a rule set. */
export type SystemUniverseId = UniverseId & { readonly __systemBrand: true };

/**
 * The operating span of a film-studio universe.
 *
 * A studio is an institution like any other, so it borrows the HISTORICAL
 * vocabulary: `founded`, a founding year, `YYYY-YYYY` for a studio that stopped
 * operating, `YYYY-present` for one that has not, or `*` for an unbounded one.
 * See james-gibson/local-time#44.
 */
export type FilmStudioSpan =
  | 'founded'
  | '*'
  | `${number}`
  | `${number}-${number}`
  | `${number}-present`;

/**
 * A film distributor as an institution in its own right: `film_studio:<slug>:<span>`.
 *
 * The grammar is encoded *in the type*, so the format is a compile-time fact
 * rather than a runtime regex comment. The runtime guard is deliberately stricter
 * than the type — it also enforces the character classes and rejects the studio
 * segments other namespaces reserve — which is what makes the narrowing sound.
 *
 * A studio is a legal entity with a founding, renames, acquisitions, absorptions
 * and a shutdown, so a film's distributor is a fact *as of its release*, never a
 * permanent fact about the film. See james-gibson/local-time#44.
 */
export type FilmStudioUniverseId = UniverseId &
  `film_studio:${string}:${FilmStudioSpan}`;

/** The `<slug>` segment of a `film_studio:` ID, extracted from its type. */
export type FilmStudioSlugOf<T extends string> =
  T extends `film_studio:${infer S}:${string}` ? S : never;

/** The `<span>` segment of a `film_studio:` ID, extracted from its type. */
export type FilmStudioSpanOf<T extends string> =
  T extends `film_studio:${string}:${infer P}` ? P : never;


// Union type for all specific universe ID types
export type TypedUniverseId = 
  | FilmUniverseId 
  | SeriesUniverseId 
  | BookUniverseId
  | FashionUniverseId
  | HistoricalUniverseId 
  | PersonalUniverseId 
  | MissionUniverseId 
  | LegalUniverseId 
  | BiographyUniverseId
  | SparkleFartUniverseId
  | CyberSecurityUniverseId
  | TechnologyUniverseId
  | TechnicalUniverseId
  | FilmStudioUniverseId
  | SystemUniverseId
  | GameUniverseId;

/**
 * The generic studio token for a film whose distributor is not a registered
 * studio universe — or does not need to be resolved to one.
 *
 * This is the only "unknown studio" the vocabulary allows. A film ID names
 * either this token or a token that resolves to a `film_studio:` universe; the
 * set of registered studios lives in `src/config/universes/studios`, which
 * `src/core` cannot import (config depends on core, never the reverse). See
 * james-gibson/local-time#44.
 */
export const GENERIC_FILM_STUDIO_TOKEN = 'film';

/**
 * Studio segments claimed by another universe namespace.
 *
 * A film ID must not open with one of these, and `src/core` *does* know them:
 * they are how `isFilmUniverseId` tells a film universe apart from a mission, a
 * game, a biography or a series. That is shape, not membership — knowing the
 * namespace vocabulary says nothing about which real studios are registered.
 * The studios themselves are data in `src/config/universes/studios`.
 * See james-gibson/local-time#44.
 *
 * ## This list must track the declared namespaces
 *
 * It is a second, hand-maintained copy of the namespace vocabulary, and it silently
 * drifted twice after #44 landed:
 *
 * - `system` was missing when PR #47 added the `system:` namespace.
 * - `technology` was missing when PR #49 gave `technology:` a declared pattern.
 * - `technical` was still listed after PR #49 deleted that namespace outright, so the
 *   list reserved a prefix that matched nothing while missing the two that became real.
 *
 * `createFilmUniverseId('system', 'x', 2000)` returned `system:x:2000`, which `isFilmUniverseId`
 * accepted *and* `isSystemUniverseId` accepted. No film studio is named "System" or
 * "Technology", so nothing noticed.
 *
 * A test now derives the namespace vocabulary from `UNIVERSE_ID_PATTERNS` and asserts this
 * list covers it, so adding a namespace without reserving it fails the build.
 */
const RESERVED_STUDIO_TOKENS = [
  'amazon',
  'anime',
  'biography',
  'book',
  'cybersecurity',
  'disney_plus',
  'esa',
  'fashion',
  'film_studio',
  'game',
  'hbo',
  'history',
  'legal',
  'literature',
  'military',
  'nasa',
  'netflix',
  'personal',
  'publisher',
  'series',
  'spacex',
  'system',
  'technology',
  'tv',
  'us_gov',
] as const;

/** Longest first, so `film_studio` is preferred to `film`. */
const RESERVED_STUDIO_ALTERNATION = [...RESERVED_STUDIO_TOKENS]
  .sort((a, b) => b.length - a.length)
  .join('|');

/**
 * Universe ID validation patterns
 *
 * Validation is split between *shape* and *membership*:
 *
 * - `src/core` can check shape, but not membership, because it cannot import
 *   `src/config` where the studio registry lives. So `FILM` accepts any
 *   well-formed studio token that is not a reserved namespace prefix, and
 *   `FILM_STUDIO` accepts any well-formed studio universe.
 * - Membership — is this token actually a registered studio? — is checked by
 *   `isRegisteredFilmStudio` / `isRegisteredFilmUniverseId` in
 *   `src/config/universes/studios`.
 *
 * The consequence is deliberate: `isFilmUniverseId` alone guarantees an ID is
 * well-formed *and* is not some other kind of universe, not that its studio
 * exists. Callers that care about the studio must use the config-layer check.
 * See james-gibson/local-time#44.
 */
export const UNIVERSE_ID_PATTERNS = {
  FILM: new RegExp(
    `^(?!${RESERVED_STUDIO_ALTERNATION}:)[a-z0-9_]+:[a-z0-9_]+:\\d{4}$`,
  ),
  FILM_STUDIO: /^film_studio:[a-z0-9_]+:(\*|founded|\d{4}|\d{4}-\d{4}|\d{4}-present)$/,
  SERIES: /^(series|tv|netflix|hbo|disney_plus|amazon):[a-z0-9_]+:\d{4}$/,
  BOOK: /^(book|literature|publisher):[a-z0-9_]+:\d{4}$/,
  FASHION: /^fashion:[a-z0-9_]+:(career|founded|\d{4}|\d{4}-\d{4}|\d{4}-present)$/,
  HISTORICAL: /^history:[a-z0-9_\\.]+:(\*|career|founded|\d{4}|\d{4}-\d{4}|\d{4}-present)$/,
  PERSONAL: /^personal:[a-z0-9_]+:\d{4}$/,
  MISSION: /^(nasa|esa|spacex|military):[a-z0-9_]+:\d{4}$/,
  LEGAL: /^legal-[a-z0-9_]+:[a-z0-9_]+:[a-z0-9_]+:(\*|career|founded|\d{4}|\d{4}-\d{4}|\d{4}-present)$/,
  // COUNTRY: /^usa:[a-z0-9_]+:\d{4}-(\d{4}|present)$/,
  BIOGRAPHY: /^biography:[a-z0-9_]+:\d{4}-(\d{4}|present)$/,
  GAME: /^(game|anime)[a-z0-9_]?:[a-z0-9_]+:[a-z0-9_]+:\d{4}$/,
  CYBERSECURITY: /^cybersecurity:.*$/,
  
  /**
   * Technology universes: `technology:<slug>:<span>`.
   *
   * This was `TECHNICAL: /^technical:.*:(\*)$/` — wrong on all three counts, which is
   * what made `createTechnologyUniverseId` throw unconditionally (local-time#21):
   *
   * - The factory emitted `technology:${name}:*`, which a `technical:` prefix can
   *   never match, so the function had no reachable success path.
   * - **Not one `technical:` id exists in the codebase.** `technology:` is what the
   *   data actually uses — `technology:sccs:1972`, `technology:git:2005`,
   *   `technology:electric_telegraph:1837`, `technology:transistor:1947`,
   *   `technology:world_wide_web:1989`. Those validated only via `ANY_YEAR_TERMINATED`
   *   catch-all, never as a declared domain.
   * - The wildcard-only span rejected every real technology id, all of which carry a
   *   year.
   *
   * The span vocabulary now matches `FASHION` / `HISTORICAL` / `FILM_STUDIO`: a
   * wildcard for "span not fixed", a year, a year range, or a range ending `present`.
   */
  TECHNOLOGY: /^technology:[a-z0-9_]+:(\*|\d{4}|\d{4}-\d{4}|\d{4}-present)$/,

  /**
   * Specifications of the system itself — ID schemas, typologies, rule sets.
   *
   * The `<span>` is a version (`v1`, `v2`) rather than a date, because a schema is
   * versioned, not dated: `system:ids:static_id_schema:v2` supersedes `…:v1`
   * without the old one ceasing to have existed. A year is also accepted, for the
   * rare case where a spec is anchored to when it was written down.
   *
   * The slug is allowed a second segment (`ids:static_id_schema`) so a spec can
   * namescape under a subsystem without inventing a new domain. Two levels is the
   * cap; deeper is a sign the thing belongs in its own namespace.
   */
  SYSTEM: /^system:[a-z0-9_]+(?::[a-z0-9_]+)?:(\*|v\d+|\d{4}|\d{4}-\d{4})$/,

  SPARKLE_FART: /^8J\+mhPCfkqgu.*$/,

  /**
   * The permissive escape hatch, renamed from `FALLBACK` in #50.
   *
   * The old name implied a shape it does not enforce. The first character class includes
   * the colon, so this is **not** a three-segment pattern — it matches any id whose final
   * segment is a four-digit year and whose other segments contain no disallowed character:
   *
   *   a:b:1999                  -> true
   *   a:b:c:1999                -> true
   *   this:is:not:a:real:id:1999 -> true
   *
   * `ANY_YEAR_TERMINATED` says what it actually does: it constrains the *suffix*, and
   * nothing else. `isValidUniverseId` is `Object.values(UNIVERSE_ID_PATTERNS).some(...)`,
   * so this pattern is a universal pass-through and the validator it feeds has almost no
   * discriminating power left. That is a known cost, not a bug:
   *
   *   - `hearing:rogers_commission:1986` validates as **FILM**, because FILM's pattern is
   *     the same generic three-segment shape. #57 hit this: the id for a congressional
   *     hearing would have been accepted as a film.
   *   - four-segment ids built by the three-argument `createTechnicalUniverseId` are
   *     accepted although no declared pattern covers them (#51).
   *
   * Tightening this to a real three-segment shape is the better fix and is still open; it
   * needs an inventory of every id that currently validates only here. Until then the
   * permissive behaviour is deliberately unchanged — **the rename must not alter which ids
   * pass**, and `universe-id-fallback.test.ts` pins that.
   */
  ANY_YEAR_TERMINATED: /^[a-z0-9_:]+:[a-z0-9_]+:\d{4}$/
} as const;

/**
 * Type guards for universe ID validation
 */
export function isValidUniverseId(id: string): id is UniverseId {
  // return true; //so so wrong
  return Object.values(UNIVERSE_ID_PATTERNS).some(pattern => pattern.test(id));
}
//
// export function isSparkleFartUniverseId(id: string): id is SparkleFartUniverseId {
//   return UNIVERSE_ID_PATTERNS.SPARKLE_FART.test(id);
// }
//
// export function isFashionUniverseId(id: string): id is FashionUniverseId {
//   return UNIVERSE_ID_PATTERNS.FASHION.test(id);
// }
export function isFilmUniverseId(id: string): id is FilmUniverseId {
  return UNIVERSE_ID_PATTERNS.FILM.test(id);
}

export function isFilmStudioUniverseId(id: string): id is FilmStudioUniverseId {
  return UNIVERSE_ID_PATTERNS.FILM_STUDIO.test(id);
}

export function isSeriesUniverseId(id: string): id is SeriesUniverseId {
  return UNIVERSE_ID_PATTERNS.SERIES.test(id);
}

export function isBookUniverseId(id: string): id is BookUniverseId {
  return UNIVERSE_ID_PATTERNS.BOOK.test(id);
}

export function isFashionUniverseId(id: string): id is FashionUniverseId {
  return UNIVERSE_ID_PATTERNS.FASHION.test(id);
}

export function isHistoricalUniverseId(id: string): id is HistoricalUniverseId {
  return UNIVERSE_ID_PATTERNS.HISTORICAL.test(id);
}

export function isPersonalUniverseId(id: string): id is PersonalUniverseId {
  return UNIVERSE_ID_PATTERNS.PERSONAL.test(id);
}

export function isMissionUniverseId(id: string): id is MissionUniverseId {
  return UNIVERSE_ID_PATTERNS.MISSION.test(id);
}

export function isLegalUniverseId(id: string): id is LegalUniverseId {
  return UNIVERSE_ID_PATTERNS.LEGAL.test(id);
}
export function isTechnologyUniverseId(id: string): id is TechnologyUniverseId {
  return UNIVERSE_ID_PATTERNS.TECHNOLOGY.test(id);
}

/**
 * @deprecated Use {@link isTechnologyUniverseId}. This guard used to test
 * `technical:` ids, which no universe in the repository carries.
 */
export function isTechnicalUniverseId(id: string): id is TechnicalUniverseId {
  return isTechnologyUniverseId(id);
}

export function isSystemUniverseId(id: string): id is SystemUniverseId {
  return UNIVERSE_ID_PATTERNS.SYSTEM.test(id);
}

/**
 * A `system:` universe ID: `system:<slug>[:<subsystem>]:<version>`.
 *
 * The span is a *version*, not a date — see {@link UNIVERSE_ID_PATTERNS.SYSTEM}.
 * `name` may carry one colon (`ids:static_id_schema`) to nest under a subsystem;
 * spaces and hyphens in either part are normalised to underscores.
 */
export function createSystemUniverseId(name: string, version: string | number): SystemUniverseId {
  // `toIdFragment` collapses every non-`[a-z0-9_]` char, so the subsystem colon has
  // to survive normalisation — split first, normalise each segment, rejoin.
  const segments = name.split(':').map(toIdFragment);
  if (segments.length > 2 || segments.some((s) => s === '')) {
    throw new Error(
      `system: name must be <slug> or <slug>:<subsystem>, got ${JSON.stringify(name)}`,
    );
  }
  const id = `system:${segments.join(':')}:${String(version).trim().toLowerCase()}`;
  if (!isSystemUniverseId(id)) {
    throw new Error(`Invalid system universe ID format: ${id}`);
  }
  return id as SystemUniverseId;
}

export function isSparkleFartUniverseId(id: string): id is SparkleFartUniverseId {
  return UNIVERSE_ID_PATTERNS.SPARKLE_FART.test(id);
}

export function isBiographyUniverseId(id: string): id is BiographyUniverseId {
  return UNIVERSE_ID_PATTERNS.BIOGRAPHY.test(id);
}

export function isGameUniverseId(id: string): id is GameUniverseId {
  return UNIVERSE_ID_PATTERNS.GAME.test(id);
}

export function isCyberSecurityUniverseId(id: string): id is CyberSecurityUniverseId {
  return UNIVERSE_ID_PATTERNS.CYBERSECURITY.test(id);
}

/**
 * Factory functions for creating typed universe IDs
 */
export function createUniverseId(id: string): UniverseId {
  if (!isValidUniverseId(id)) {
    throw new Error(`Invalid universe ID format: ${id}`);
  }
  return id as UniverseId;
}

//
export function createSparkleFartUniverseId(source: string, traceId: string): SparkleFartUniverseId {
  const id = `8J+mhPCfkqgu${source}:${traceId}`;
  if (!isSparkleFartUniverseId(id)) {
    throw new Error(`Invalid sparkle fart universe ID format: ${id}`);
  }
  return id as SparkleFartUniverseId;
}

/**
 * Reduce a studio or title fragment to the shape a universe ID requires: lower
 * case, words joined by underscores, and nothing else. This is what turns
 * `Saturn_International` into `saturn_international` and
 * `Piranha II: The Spawning` into `piranha_ii_the_spawning` (local-time#26).
 */
function toIdFragment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s\-.]+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * A film universe ID. Shape only: `src/core` cannot see the studio registry, so
 * a token this accepts is well-formed, not necessarily a *registered* studio.
 * Use `isRegisteredFilmStudio` (config layer) when the studio must exist.
 * See james-gibson/local-time#44.
 */
export function createFilmUniverseId(studio: string, title: string, year: number): FilmUniverseId {
  const id = `${toIdFragment(studio)}:${toIdFragment(title)}:${year}`;
  if (!isFilmUniverseId(id)) {
    // console.error('the system didnt like that id');
    // return `film:${id}` as FilmUniverseId;
    throw new Error(`Invalid film universe ID format: ${id}`);
  }
  return id as FilmUniverseId;
}

/**
 * A film-studio universe ID: `film_studio:<slug>:<span>`.
 *
 * `<span>` is a `FilmStudioSpan`, so a malformed span is a **compile-time**
 * error rather than a runtime throw. The span is lower-cased but never slugged —
 * `1918-present` must survive its hyphen.
 */
export function createFilmStudioUniverseId(
  slug: string,
  span: FilmStudioSpan | number,
): FilmStudioUniverseId {
  const id = `film_studio:${toIdFragment(slug)}:${String(span).trim().toLowerCase()}`;
  if (!isFilmStudioUniverseId(id)) {
    throw new Error(`Invalid film studio universe ID format: ${id}`);
  }
  return id as FilmStudioUniverseId;
}

/**
 * Parse a `film_studio:` ID back into its segments — typed, so no caller has to
 * re-derive the grammar with `split`/`replace`.
 *
 * This only accepts an already-narrowed ID, which is what makes it safe: the
 * caller must have passed `isFilmStudioUniverseId` first, so the string surgery
 * lives here once instead of at every call site. See james-gibson/local-time#44.
 */
export function parseFilmStudioUniverseId(
  id: FilmStudioUniverseId,
): { slug: string; span: FilmStudioSpan } {
  const [, slug, span] = id.split(':');
  if (slug === undefined || span === undefined) {
    throw new Error(`Not a film-studio universe ID: ${id}`);
  }
  // Sound: `FilmStudioUniverseId` encodes `film_studio:<slug>:<span>` in its
  // type, so the third segment is already a `FilmStudioSpan`. `split` widens to
  // `string`, hence the assertion — this is the one place the cast is justified.
  return { slug, span: span as FilmStudioSpan };
}
export function createCyberSecurityUniverseId(name: string, cve: string): CyberSecurityUniverseId {
  const id = `cybersecurity:${name}:${cve}`;
  if (!isCyberSecurityUniverseId(id)) {
    throw new Error(`Invalid cybersecurity universe ID format: ${id}`);
  }
  return id as CyberSecurityUniverseId;
}

/**
 * Lowercase a free-text name into a single id segment: strip anything that is not a
 * letter or digit, collapse separators to underscores, trim the edges.
 *
 * `'Electric Telegraph'` → `'electric_telegraph'`.
 *
 * Deliberately *not* named `toIdFragment`: PR #44 adds that helper alongside the film
 * studio work, and giving this one the same name would collide on merge.
 */
function normaliseIdSegment(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s\-.]+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '');
}

/**
 * A technology universe id: `technology:<name>:*`.
 *
 * `name` is normalised through {@link normaliseIdSegment} first, so
 * `'Electric Telegraph'` becomes `electric_telegraph`.
 *
 * The `*` span means "not pinned to a dated window" — a technology such as the
 * electric telegraph is not an event, so `createTechnologyUniverseId('electric_telegraph')`
 * yields `technology:electric_telegraph:*` where the dated record
 * `technology:electric_telegraph:1837` names the invention. Both validate.
 *
 * Before local-time#21 this function could not return: it built a `technology:` id and
 * then validated it against a `technical:` pattern, so it threw for every possible
 * argument. There were no callers, which is why it went unnoticed — the bug was latent,
 * not exercised.
 *
 * Note the name collision this sat next to: `createTechnicalUniverseId` in
 * `core/ids/id-creators.ts` and again in `core/types.ts` is a *different*, three-argument
 * function with a different id shape. See the linked issue.
 */
export function createTechnologyUniverseId(name: string): TechnologyUniverseId {
  const id = `technology:${normaliseIdSegment(name)}:*`;
  if (!isTechnologyUniverseId(id)) {
    throw new Error(`Invalid technology universe ID format: ${id}`);
  }
  return id as TechnologyUniverseId;
}

/**
 * A qualified, versioned, dated id: `<category>:<identifier>[:<version>]:<currentYear>`.
 *
 * **Not to be confused with {@link createTechnologyUniverseId}**, one line above. The
 * names differ by four characters and mean unrelated things:
 *
 * - `createTechnologyUniverseId(name)` — a *technology universe*, `technology:<name>:*`.
 * - `createTechnicalUniverseId(category, identifier, version?)` — a generic namespaced
 *   identifier, e.g. `system:secure_ledger:authentication_v1:2026`. Not a technology at
 *   all; "technical" here means "machine-facing", and `category` is free-form
 *   (`system`, `log`, …).
 *
 * This function was previously defined **twice, byte-identically**, in
 * `core/ids/id-creators.ts` and `core/types.ts` (local-time#51). Two copies meant the
 * identity depended on the import path: `config/universes/james/solar.ts` imported the
 * `id-creators` one, `config/universes/cybersecurity/access-control.ts` the `types` one,
 * and neither could see the other's. The single definition lives here, and both modules
 * re-export it, so every import path resolves to the same function.
 *
 * Two things this still does that are worth knowing:
 *
 * - **It stamps `new Date().getFullYear()`**, so the id is not deterministic across
 *   years. That behaviour is preserved deliberately — changing it would alter the ids of
 *   five live universes — but it makes the function untestable against a fixed expected
 *   value. Not yet fixed; tracked in #51.
 * - **It does not validate.** Unlike the other factories in this file it returns
 *   `id as UniverseId` without checking against any pattern, so a four-segment id like
 *   `system:secure_ledger:authentication_v1:2026` is returned unchecked.
 */
export function createTechnicalUniverseId(
  category: string,
  identifier: string,
  version?: string,
): UniverseId {
  const versionSuffix = version ? `:${version}` : '';
  const id = `${category}:${identifier}${versionSuffix}:${new Date().getFullYear()}`;
  return id as UniverseId;
}

export function createSeriesUniverseId(network: string, title: string, year: number): SeriesUniverseId {
  const id = `${network}:${title}:${year}`;
  if (!isSeriesUniverseId(id)) {
    throw new Error(`Invalid series universe ID format: ${id}`);
  }
  return id as SeriesUniverseId;
}

export function createBookUniverseId(publisher: string, title: string, year: number): BookUniverseId {
  const id = `${publisher}:${title}:${year}`;
  if (!isBookUniverseId(id)) {
    throw new Error(`Invalid book universe ID format: ${id}`);
  }
  return id as BookUniverseId;
}

export function createFashionUniverseId(event: string, year: number): FashionUniverseId {
  const id = `fashion:${event}:${year}`;
  if (!isFashionUniverseId(id)) {
    throw new Error(`Invalid fashion universe ID format: ${id}`);
  }
  return id as FashionUniverseId;
}

export function createPersonalUniverseId(person: string, year: number): PersonalUniverseId {
  const id = `personal:${person}:${year}`;
  if (!isPersonalUniverseId(id)) {
    throw new Error(`Invalid personal universe ID format: ${id}`);
  }
  return id as PersonalUniverseId;
}

export function createLegalUniverseId(jurisdiction: string, category:string, law: string, year: number): LegalUniverseId {
  const id = `legal-${jurisdiction}:${category}:${law}:${year}`;
  if (!isLegalUniverseId(id)) {
    throw new Error(`Invalid legal universe ID format: ${id}`);
  }
  return id as LegalUniverseId;
}

export function createGameUniverseId(platform: string, title: string, year: number): GameUniverseId {
  const id = `game:${platform}:${title}:${year}`;
  if (!isGameUniverseId(id)) {
    throw new Error(`Invalid game universe ID format: ${id}`);
  }
  return id as GameUniverseId;
}
export function createHistoricalUniverseId(event: string, year: number | string | '*', timeRange?: string): HistoricalUniverseId {
  const id = timeRange ? `history:${event}:${timeRange}` : `history:${event}:${year}`;
  if (!isHistoricalUniverseId(id)) {
    throw new Error(`Invalid historical universe ID format: ${id}`);
  }
  return id as HistoricalUniverseId;
}
export function createHistoricalEventOwnerId(_id:HistoricalUniverseId, event: string, yearRange: string): HistoricalUniverseId {
  const id = `${_id}_${event}:${yearRange}`;
  if (!isHistoricalUniverseId(id)) {
    throw new Error(`Invalid historical universe ID format: ${id}`);
  }
  return id as HistoricalUniverseId;
}
export function createMissionUniverseId(agency: string, mission: string, year: number): MissionUniverseId {
  const id = `${agency}:${mission}:${year}`;
  if (!isMissionUniverseId(id)) {
    throw new Error(`Invalid mission universe ID format: ${id}`);
  }
  return id as MissionUniverseId;
}

export function createBiographyUniverseId(person: string, birthYear: number, deathYear?: number): BiographyUniverseId {
  const endYear = deathYear ? deathYear.toString() : 'present';
  const id = `biography:${person}:${birthYear}-${endYear}`;
  if (!isBiographyUniverseId(id)) {
    throw new Error(`Invalid biography universe ID format: ${id}`);
  }
  return id as BiographyUniverseId;
}

/**
 * Utility functions for working with universe IDs
 */
export function parseUniverseId(id: UniverseId): {
  category: string;
  identifier: string;
  timestamp: string
  // year?: number;
  // studio?: string;
} {
  const parts = (id as unknown as string).split(':');
  
  return {
    category: parts[0],
    identifier: parts[1],
    timestamp: parts[2],
    // year: parts[2] ? parseInt(parts[2]) : undefined,
    // studio: parts[0]
  };
}

export function getUniverseCategory(id: UniverseId): string {
  return parseUniverseId(id).category;
}

/**
 * Well-known universe IDs as constants to prevent typos
 */
export const WELL_KNOWN_UNIVERSES = {
  // Films
  MARY_POPPINS: createFilmUniverseId('disney', 'mary_poppins', 1964),
  BACK_TO_THE_FUTURE: createFilmUniverseId('film', 'bttf', 1985),
  // STAR_WARS_ANH: createFilmUniverseId('film', 'star_wars:a_new_hope', 1977),
  
  // Historical Events
  JFK_ASSASSINATION: createHistoricalUniverseId('jfk_assassination', 1963),
  JFK_MOON_SPEECH: createHistoricalUniverseId('jfk_moon_speech', 1961),
  
  // Missions
  APOLLO_11: createMissionUniverseId('nasa', 'apollo11', 1969),
  
  // Biographies
  TOLKIEN: createBiographyUniverseId('jrr_tolkien', 1892, 1973),
  BRITNEY_SPEARS: createBiographyUniverseId('britney_spears', 1981),
} as const;

/**
 * Type-safe universe ID sets for networks
 */
export type DisneyUniverseId = 
  | typeof WELL_KNOWN_UNIVERSES.MARY_POPPINS
  | FilmUniverseId; // Allow other Disney films

export type NASAUniverseId = 
  | typeof WELL_KNOWN_UNIVERSES.APOLLO_11
  | MissionUniverseId; // Allow other NASA missions

/**
 * Reference validation - ensures referenced universes exist or are properly formatted
 */
export function validateUniverseReference(id: string): {
  isValid: boolean;
  category?: string;
  shouldGenerate?: boolean;
  error?: string;
} {
  if (!isValidUniverseId(id)) {
    return {
      isValid: false,
      error: `Invalid universe ID format: ${id}`
    };
  }
  
  const category = getUniverseCategory(id as UniverseId);
  
  return {
    isValid: true,
    category,
    shouldGenerate: false // Could be enhanced to check if universe exists in registry
  };
}
