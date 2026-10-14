# UniverseBuilder — the verified API

Source of truth: `src/core/universe-builder.ts`, `src/core/universe-ids.ts`,
`src/core/types.ts`. If this file and the source disagree, the source wins — read it.

`docs/universe-creation-guide.md` lists methods that do not exist (`book`, `series`,
`game`, `withMetadata`). This file lists the methods that do.

## Constructing a builder

```ts
new UniverseBuilder(id?: string, type?: UniverseType)
```

The bare constructor seeds a `FILM` universe with `realityRelation: { type: 'pure_fiction',
fictionalizationDegree: 1.0 }`, `attribution: { citations_required: true }`, and empty
`layers`. It does **not** set defaults; the convenience factories do.

| Factory | Type | Calls `withDefaults(...)` |
| --- | --- | --- |
| `createFilmBuilder(id?)` | `FILM` | `pure_fiction` / `1.0` / `scene_based` |
| `createHistoricalBuilder(id?)` | `HISTORICAL_EVENT` | `documentary` / `0.0` / `time_based` |
| `createMissionBuilder(id?)` | `MISSION` | none |
| `createBiographyBuilder(id?)` | `BIOGRAPHY` | none |

Prefer `new UniverseBuilder(...)` when you need `withWindowing` or `setRealityRelation` —
the factories' defaults overwrite both (see *Gotchas* in `SKILL.md`, james-gibson/local-time#99).

## Identity

| Method | Effect |
| --- | --- |
| `film(studio, title, year, subtitle?)` | Sets `universeId` via `createFilmUniverseId` — **validates, throws** on a bad id |
| `historical(event, startYear, endYear?)` | Sets `history:<slug>:<span>`; slugifies the event (`[^a-z0-9_:.]+` → `_`), **validates, throws** (james-gibson/local-time#70) |
| `historicalEvent(event, year)` | Alias for `historical(event, year)` |
| `mission(agency, mission, year)` | Sets `${agency}:${mission}:${year}` — **no validation** |
| `biography(person, birthYear, deathYear?)` | Sets `biography:<person>:<birth>-<death\|present>` — **no validation** |
| `media(type, title, year)` | Sets `${type}:<title lowercased/underscored>:${year}`, type `SERIES` — **no validation** |
| `withId(id)` | Overwrites `universeId` + `identifiers.primary` — **no validation** |
| `withAliases(aliases)` | Sets `identifiers.aliases` |
| `withIdentifiers(obj)` | Shallow-merges into `identifiers` |

`mission` / `biography` / `media` / `withId` accept a malformed id silently; the registry
drops such a universe with a warning. Pin the id and check it yourself with
`isValidUniverseId` (or a typed guard) when you use them.

## Temporal content

| Method | Effect |
| --- | --- |
| `withRuntime(minutes)` | Adds a `runtime`/`main` epoch of `minutes` using `TimePrecision.SECOND` (not ms) |
| `withDateRange(sy, sm, sd, ey, em, ed, precision)` | Adds a `main`/`timespan` epoch |
| `withDateEpoch(startISO, endISO, description, precision)` | Adds a `primary`/`date_epoch` epoch |
| `withZeroReference(y, m, d, h, min, s, event, before, after, durationHours)` | Adds a `zero_reference` primary layer with a `zero_ref` epoch |
| `withZeroReferenceEpoch(config)` | Same layer, caller-supplied epoch object |
| `addDateSegment(startISO, endISO, id, type, status?, jurisdiction?, description?)` | `status`/`jurisdiction`/`description` are **dropped** (#100) |
| `addSegment(id, start, end, type, description?)` | `description` is **dropped** (#100) |
| `addRuntimeSegment(startMin, startSec, endMin, endSec, id, type)` | Runtime-relative segment |
| `addLayer(layerId \| layer, type?, epochs?)` | Adds a `TemporalLayer` |
| `addEpoch(layerId, epochId, epoch)` **or** `addEpoch(startISO, endISO, epochId, significance?, tags?, options?)` | Adds/merges an epoch; the 3-arg form stamps `epochId` onto the epoch (local-time#19) |
| `addKeyframe(timestamp, id, significance, tags, options?)` or `(dateStr, id, …)` | Pushes a keyframe; `options` carries `description`, `certainty`, `dateRange`, `type`, `targetUniverseId`, `targetKeyframeId`, `targetKeyframeType` |
| `addDateKeyframe(dateStr, id, sig, tags, precision?)` or `(y,m,d,h,min,s,id,sig,tags,options?)` | Date-form keyframe |
| `addRuntimeKeyframe(minutes, seconds, id, significance, tags, description?)` | `seconds` is seconds **within** the minute; `description` is forwarded (#77) |
| `withWindowing(strategy, windowSize?)` | Sets `windows`; **does not** set the "was set" guard (#99) |
| `addConnection(connection)` | Appends to `metadata.connections` |

Every epoch needs an explicit `epochId`. `addEpoch`'s 3-arg form stamps it; a manual
literal that omits it makes the registry substitute the layer key and warn, silently
changing what every reference to that epoch means (#19).

## Reality relation and attribution

| Method | Effect |
| --- | --- |
| `withRealityRelation(type, degree, anchors?, description?)` | Sets `realityRelation`; **sets the "was set" guard** (survives factory defaults). `description` → `metadata.realityDescription` |
| `setRealityRelation(relation)` | Overwrites `realityRelation` wholesale; **does not** set the guard (#99) |
| `withAttribution(type, yearOrDescription?, status?)` | `type === 'public_domain'` sets `public_domain: true`; else a plain source/description |
| `withCopyright(holders, year, status='active')` | Sets `attribution.copyright` |
| `withPublicDomain(sources)` | Sets `public_domain: true` + `sources` |
| `withCreators({ director?, writer?, historical_advisors?, participant?, based_on?, host?, producer?, researcher? })` | `director`/`writer`/`historical_advisors` go in `attribution.creators`; the rest land in `metadata` |
| `setAttribution(attribution)` | Overwrites `attribution` wholesale |

## Metadata

| Method | Effect |
| --- | --- |
| `withDescription(text)` | `metadata.description` |
| `withEpisodeInfo(title, season, episode)` | `metadata.episodeTitle` / `season` / `episode` |
| `withReleaseDate(dateISO)` | `metadata.releaseDate = new Date(...)` |
| `withCulturalSignificance(n, description?)` | `metadata.cultural_significance`, `metadata.cultural_description` |
| `withTags(tags)` | `metadata.tags` |
| `withDefaults(realityRelationType, degree, windowsStrategy)` | Sets the defaults `build()` applies when the guards are unset |

There is **no** `withMetadata()`. To set arbitrary metadata, author a manual literal.

## `build()` — validation order

`build()` runs in this order. Each fault appends to one error list, so a build can report
several at once; the throw is a single `Error: Universe validation failed: …`.

1. Flatten `layers[*].epochs` onto `universe.epochs`.
2. Apply factory defaults — but only for `realityRelation` if `withRealityRelation` was
   never called, and for `windows` if `withWindowing` was never called.
3. `validate()`:
   1. **Attribution** — needs `public_domain` **or** `copyright.holders.length` **or**
      `sources.length`.
   2. **`fictionalizationDegree`** — must be a number in `[0, 1]`.
   3. **`cultural_significance`** — in `[0, 1]` when set.
   4. **Every keyframe `significance`** — in `[0, 1]` (both `layers[*].epochs[*].keyframes`
      and `temporalStructure.keyframes`).
   5. **Temporal content** — a `primary` layer, **or** `temporalStructure` segments/keyframes,
      **or** flattened epochs. `TECHNICAL_SPECIFICATION`, `TECHNICAL_LOG` and `ABSTRACT_CONCEPT`
      are exempt by type (`NON_TEMPORAL_TYPES`).
4. `extractMetadata()`.

The exact attribution error string:

```text
Attribution is required: set public_domain, copyright, or sources (at least one).
```

The temporal-content error string:

```text
At least one primary temporal layer is required: the universe has neither a primary layer nor any temporal structure content (segments or keyframes).
```

(Note: the check also passes when there are flattened epochs, which the message does not
mention.)

## `extractMetadata()` — what it derives

Never overwrites a value the caller set.

- `metadata.canonicalName` — from the id slug. Three-segment ids take `parts[1]`; longer ids
  take the segment before the trailing year. `_`/`.` become spaces, words title-cased.
- `metadata.released` — from the id's trailing 4-digit year (`Date(year, 0, 1)`), when the
  trailing segment starts with a year.
- `metadata.creators` — role lists in this order (`director`, `writer`, `producer`, `host`,
  `researcher`, `historical_advisors`, `participant`, `based_on`), then `copyright.holders`,
  de-duplicated.

## ID factories (`src/core/universe-ids.ts`)

| Factory | Shape | Validates? |
| --- | --- | --- |
| `createUniverseId(id)` | any declared pattern | yes |
| `createFilmUniverseId(studio, title, year)` | `<studio>:<title>:YYYY` | yes |
| `createFilmStudioUniverseId(slug, span)` | `film_studio:<slug>:<span>` | yes |
| `createSeriesUniverseId(network, title, year)` | `<network>:<title>:YYYY` | yes |
| `createBookUniverseId(publisher, title, year)` | `<publisher>:<title>:YYYY` | yes |
| `createFashionUniverseId(event, year)` | `fashion:<event>:YYYY` | yes |
| `createPersonalUniverseId(person, year)` | `personal:<person>:YYYY` | yes |
| `createLegalUniverseId(jurisdiction, category, law, year)` | `legal-<jur>:<cat>:<law>:YYYY` | yes |
| `createGameUniverseId(platform, title, year)` | `game:<platform>:<title>:YYYY` | yes |
| `createMissionUniverseId(agency, mission, year)` | `<agency>:<mission>:YYYY` | yes |
| `createBiographyUniverseId(person, birth, death?)` | `biography:<person>:YYYY-YYYY\|present` | yes |
| `createHistoricalUniverseId(event, year\|'*', timeRange?)` | `history:<event>:<span>` | yes |
| `createTechnologyUniverseId(name)` | `technology:<name>:*` | yes |
| `createSystemUniverseId(name, version)` | `system:<slug>[:<subsystem>]:<version>` | yes |
| `createCyberSecurityUniverseId(name, cve)` | `cybersecurity:<name>:<cve>` | yes |
| `createTechnicalUniverseId(cat, id, version?)` | `<cat>:<id>[:<version>]:<currentYear>` | **no — also non-deterministic** (#51) |

Guards: `isValidUniverseId` = any declared pattern; per-domain guards
`isFilmUniverseId`, `isHistoricalUniverseId`, … `isValidUniverseId` is broad because
`ANY_YEAR_TERMINATED` (`/^[a-z0-9_:]+:[a-z0-9_]+:\d{4}$/`) matches any year-terminated id,
including four-segment ones. It only constrains the suffix.

## Closed unions (from `types.ts`)

`TemporalSegment.type`:

```text
sequence | act | scene | phase | countdown | mission_phase | life_period | education
| career | public_service | legal_period | legislation_active | court_jurisdiction
```

`TemporalSegment.status` (optional): `active | inactive | suspended | overturned | amended`.

`WindowingStrategy.strategy`:

```text
scene_based | time_based | phase_based | countdown_based
```

There is **no** `point_in_time` member. The KB→TS importer aliases `point_in_time` →
`phase_based`.

`RealityRelation.type` (`KeyframeType` is separate — see `types.ts`):

```text
documentary | historical_fiction | inspired_by | pure_fiction | metafiction
| recreation | interpretation
```

Caveat: `RealityRelationTypeEnum` additionally defines `DOCUMENTS = 'documents'`, which the
`RealityRelation.type` interface union omits — yet several files (cast `as unknown as
Universe`) use `type: 'documents'` (`us-gov/hydrological.ts`, `global-politics/gaza.ts`). It
is accepted at runtime because the registry never validates `realityRelation.type`, but it is
**not** a member of the typed union. Prefer a value from the list above.

`RealityAnchor.relationshipType` is a **different, smaller** union:
`depicts | inspired_by | reinterprets | contradicts | reimagines | documents | experienced`.
`TemporalReference` anchors use `{ domainId, eventId, context }` — do not mix the two
anchor shapes.

`TemporalLayer.type`: `primary | meta | recreation | subjective`.

## Manual literal pattern

Use a manual literal when you need a field the builder cannot set (segment
`description`/`status`/`jurisdiction`, arbitrary `metadata`, an id the factories reject).
Cast through `as unknown as Universe` so KB-only or extra fields survive without excess-property
errors — this is what the importer emits.

```ts
import { Universe, UniverseType, TimePrecision, KeyframeType } from '../../../core/types';

export const exampleUniverse: Universe = {
  universeId: 'history:example_event:1999',
  type: UniverseType.HISTORICAL_EVENT,
  identifiers: { primary: 'history:example_event:1999' },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [],
  },
  attribution: { sources: ['https://example.org/source'], citations_required: true },
  epochs: {},
  layers: [
    {
      layerId: 'primary',
      type: 'primary',
      epochs: { main: { epochId: 'main', precision: TimePrecision.DAY } },
    },
  ],
  temporalStructure: {
    segments: [
      {
        id: 'example-period',
        start: BigInt(Date.UTC(1999, 0, 1)) * 1000000n,
        end: BigInt(Date.UTC(2000, 0, 1)) * 1000000n,
        type: 'legal_period',
        status: 'active',          // builder drops this
        jurisdiction: 'us',        // builder drops this
        description: 'Why it matters.', // builder drops this
      },
    ],
    keyframes: [
      {
        id: 'passage',
        timestamp: BigInt(Date.UTC(1999, 0, 1)) * 1000000n,
        significance: 0.8,
        tags: ['legislation'],
        type: KeyframeType.LEGISLATION,
        description: 'The act passed.',
        certainty: 0.6, // date approximate
        dateRange: {    // the literal shape is bigint `earliest`/`latest`
          earliest: BigInt(Date.UTC(1999, 0, 1)) * 1000000n,
          latest: BigInt(Date.UTC(1999, 11, 31)) * 1000000n,
        },
      },
    ],
    windows: { strategy: 'time_based' },
  },
  metadata: {
    canonicalName: 'Example Event',
    creators: [],
    released: new Date('1999-01-01'),
    cultural_significance: 0.4,
  },
} as unknown as Universe;
```

Timestamps are nanoseconds: `BigInt(Date.UTC(...)) * 1000000n`. A manual literal skips
`build()` entirely, so **nothing validates it** — the registry still runs its own checks and
will skip an invalid entry with a warning. Re-check anything a builder would have caught:
attribution present, `fictionalizationDegree` in band, `cultural_significance`/keyframe
significance in `[0, 1]`, every epoch carrying an `epochId`, temporal content present.

### Manual literal vs builder — traps

A literal is not a builder call. Fields that exist only as *parameters* on the fluent API
have no meaning when written into an object literal: the `as unknown as Universe` cast lets
them survive, but nothing reads them.

- **There is no `options` field.** `addKeyframe(id, ts, sig, tags, options)` takes `options`
  as its *fifth argument*; in a literal there is no such field. Put `description`,
  `certainty`, `dateRange` and `type` **directly on the keyframe**. `options: { type:
  'phase', dateRange: { start, end } }` in a literal does nothing — the date range and type
  are silently absent. (This is the shape a generated example produced in
  james-gibson/local-time#93.)
- **`dateRange` is `{ earliest: bigint, latest: bigint }`**, in nanoseconds — not
  `{ start, end }` and not ISO strings. See `TemporalKeyframe` in `types.ts`.
- **A keyframe `type` is a `KeyframeType`**, e.g. `PUBLICATION`, `FOUNDING`, `MERGER`,
  `RELEASE`, `LEGISLATION`, `AWARD` (the full list is `KeyframeType` in `types.ts`), **not**
  a `TemporalSegment.type`. There is no `phase` keyframe type.
- **`identifiers.primary` is not a lookup key.** The registry registers `universeId` and
  every `identifiers.aliases` entry; `primary` is inert. Keep it equal to `universeId`
  unless you deliberately record a different canonical identifier — some namespaces assert
  `identifiers.primary === universeId` in their tests
  (`src/config/universes/people/hillary-clinton.test.ts`).
- **`realityAnchors[].realEventId` should name a universe that exists.** The shape is
  advisory, so an unknown id is not rejected — it is just a dangling anchor. Do not copy
  older files that predate the shape: some use `realWorldEvent` instead of `realEventId`,
  and some omit `relationshipType` entirely (`us-gov/hydrological.ts` uses
  `id`/`description`). Those are wrong; the canonical `RealityAnchor` is
  `realEventId` / `relationshipType` / `confidence` / `evidence`.
- **Connections: two author paths, one containment edge.** A hand-authored universe declares
  containment in a **top-level** `connections: { natural: { parentUniverses: [...] },
  references: [...] }` object — now a first-class, optional `Universe.connections` field
  (`UniverseConnections`), no longer an untyped cast extra. A builder declares it with
  `addConnection({ type: 'member_of', targetUniverseId })`, which appends to
  **`metadata.connections`** as an *array*. `UniverseRegistry` folds **both** into
  `CommonUniverseIds` (`getMemberships` / `getParentChain` / `getChildren` /
  `getAllDescendants` / `contains`), so a universe can be a member of several containers
  without being registered twice (james-gibson/local-time#74). `metadata.connections` also
  carries non-containment references (`DISTRIBUTED_BY`, `references`), which are **not** edges.
