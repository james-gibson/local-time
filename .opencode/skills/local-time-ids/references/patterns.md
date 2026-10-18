# The id grammar, and how to read it

**Source of truth:** `src/core/universe-ids.ts` — `UNIVERSE_ID_PATTERNS`,
`RESERVED_STUDIO_TOKENS`, `GENERIC_FILM_STUDIO_TOKEN`, the factories, the guards,
`toIdFragment`. If this file and the source disagree, the source wins.

This reference deliberately does **not** reproduce the pattern table. Copying it is
how `RESERVED_STUDIO_TOKENS` drifted twice: it is a hand-maintained duplicate of the
namespace vocabulary that missed `system` (when #47 added it) and `technology`
(when #49 gave it a pattern), while still listing `technical` after that namespace
was deleted. Nothing caught it, because no film studio is named "System". Read the
table; do not copy it.

## The shape families

| Family | Namespaces | Arity | Trailing segment |
| --- | --- | --- | --- |
| Film | any token not reserved (see below) | 3 | 4-digit year |
| Film studio | `film_studio` | 3 | `*` \| `founded` \| `YYYY` \| `YYYY-YYYY` \| `YYYY-present` |
| Film-studio *container* | `film_studio` | 3 | same span vocabulary |
| Series | `series` \| `tv` \| `netflix` \| `hbo` \| `disney_plus` \| `amazon` | 3 | 4-digit year |
| Book | `book` \| `literature` \| `publisher` | 3 | 4-digit year |
| Fashion | `fashion` | 3 | `career` \| `founded` \| year \| range |
| Historical | `history` | 3 | `*` \| `career` \| `founded` \| year \| range |
| Personal | `personal` | 3 | 4-digit year |
| Mission | `nasa` \| `esa` \| `spacex` \| `military` | 3 | 4-digit year |
| Legal | `legal-<jurisdiction>` | **4** | `*` \| `career` \| `founded` \| year \| range |
| Biography | `biography` | 3 | `YYYY-YYYY` \| `YYYY-present` |
| Game | `game` / `games` / `anime` / `animes` | **4** | 4-digit year |
| Cybersecurity | `cybersecurity` | anything | anything (`.*`) |
| Technology | `technology` | 3 | `*` \| year \| range |
| System | `system` | 3 or 4 | `*` \| `v<N>` \| year \| range |

Notes that cost someone real time:

- **GAME is four segments**, and the namespace alternation carries one optional
  trailing character — so `game:` *and* `games:` both open it (verified: `gamess:`
  does not). That is why #112's proposed `games:<franchise>:<container>:<span>`
  was dropped while `game:<franchise>:<title>:<year>` works.
- **LEGAL is four segments** and is the one namespace that is not a bare `legal:`
  prefix — it is `legal-<jurisdiction>:`.
- **SYSTEM is the only pattern with an optional middle segment**, which is how it
  happens to cover the four-segment `system:<a>:<b>:<span>` shape (#51). Do not
  read that as licence to invent arity.

## The reserved-namespace mechanism, and why `film` is not reserved

`RESERVED_STUDIO_TOKENS` is a **negative lookahead** on the FILM pattern:

```ts
FILM: new RegExp(`^(?!${RESERVED_STUDIO_ALTERNATION}:)[a-z0-9_]+:[a-z0-9_]+:\\d{4}$`)
```

So the FILM pattern is generic — *any* three-segment `<token>:<slug>:<year>` that
does not open with a reserved namespace. Consequences worth internalising:

- `isFilmUniverseId('hearing:rogers_commission:1986')` is **true**. An undeclared
  three-segment namespace reads as a film (#57, #50).
- `film` is **not** in the reserved list. It is `GENERIC_FILM_STUDIO_TOKEN` — the
  token meaning *"no studio named"*. `isFilmUniverseId('film:some_movie:2000')` is
  **true** (pinned in `src/core/__tests__/film-reserved-namespace.test.ts`).
- `film_studio` **is** reserved, so `film_studio:disney:1990` is not a film id.
- Composition and membership do **not** go in the id. A franchise container is its
  own universe with a `history:`/span id (`CommonUniverseIds.DIABLO_FRANCHISE` =
  `history:diablo_franchise:1996-2026`), and containment is a
  `parentUniverses` edge (#74).

## The two slugifiers — they are not the same

`toIdFragment` (used by `createFilmUniverseId` and the other id factories that
assemble from parts — **not** by `createUniverseId`, which only re-validates a
string you hand it):

```ts
value.trim().toLowerCase()
  .replace(/[\s\-.]+/g, '_')     // whitespace, dot, dash -> _
  .replace(/[^a-z0-9_]/g, '')    // everything else is DELETED
  .replace(/_+/g, '_').replace(/^_+|_+$/g, '');
```

`createUniverseId(id)` is the one factory that is **not** a shape check: it brands
whatever `isValidUniverseId` accepts — including a four-segment id that matches
only the catch-all. It is a branding helper, not a proof.

`UniverseBuilder.historical()` uses its own, which **keeps `:` and `.`** so a
namespaced event survives (#70):

```ts
event.trim().toLowerCase()
  .replace(/[^a-z0-9_:.]+/g, '_')   // runs of anything else -> _
  .replace(/^_+|_+$/g, '');
```

The practical consequence: `&` and `:` are **deleted** by the first and preserved
by the second, so a title never round-trips. Pin the id and assert the factory
output equals it.

## The permissive last word

```ts
ANY_YEAR_TERMINATED: /^[a-z0-9_:]+:[a-z0-9_]+:\d{4}$/
```

(read it verbatim from the source; it is quoted here only to make the point.) The
colon inside the first class means **arity-blind**. `isValidUniverseId` is
`Object.values(UNIVERSE_ID_PATTERNS).some(...)`, so this one pattern makes the
validator a near-universal pass-through for anything ending in a four-digit year.

`src/core/__tests__/universe-id-fallback.test.ts` pins exactly which ids pass
*only* through it, and asserts no other pattern is a second catch-all. Run it
before and after any change to the table.

## Guards, and which tests already exist

| Guard | For |
| --- | --- |
| `isValidUniverseId` | **never use as a proof** — "any pattern, including the catch-all" |
| `isFilmUniverseId`, `isFilmStudioUniverseId`, `isSeriesUniverseId`, `isBookUniverseId`, `isFashionUniverseId`, `isHistoricalUniverseId`, `isPersonalUniverseId`, `isMissionUniverseId`, `isLegalUniverseId`, `isTechnologyUniverseId`, `isSystemUniverseId`, `isBiographyUniverseId`, `isGameUniverseId`, `isCyberSecurityUniverseId` | the domain guard — the real claim |
| `isTechnicalUniverseId` | **deprecated** — it now delegates to `isTechnologyUniverseId`; the `technical:` namespace it tested does not exist |
| `resolveFilmStudio`, `isRegisteredFilmStudio`, `isRegisteredFilmUniverseId`, `distributorOf` (in `src/config/universes/studios`) | *membership* — does the studio actually exist (the #44 split: core checks shape, config checks membership) |

Existing mechanical guards — read them before adding a pattern:

- `src/core/__tests__/film-reserved-namespace.test.ts` — derives the namespace
  vocabulary from `UNIVERSE_ID_PATTERNS` and asserts FILM refuses every prefix, in
  both directions (reserved prefixes rejected, real studios still accepted). **Add
  a namespace without reserving it and this fails.**
- `src/core/__tests__/universe-id-fallback.test.ts` — pins which ids pass only via
  the catch-all, and that nothing else is a catch-all.
- `src/core/__tests__/technology-universe-id.test.ts` — the `technology:` span
  vocabulary (#21, #49).
