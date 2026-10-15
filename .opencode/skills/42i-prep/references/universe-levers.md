# Universes as levers — derive, don't invent

A new universe is almost never authored from nothing. It is **derived** from universes that
already exist and already hold the facts: the event it dramatises, the industry it sits in,
the system it replaces. Those existing universes are **levers** — grab one, and the new
universe assembles instead of being invented.

This is the cheapest possible prep. An agent that has precached the lever's facts does not
research, does not re-derive dates, and does not guess at ids. It *points* at what is already
true. That is why the lever belongs in a prep skill: **cache the lever, and the new universe
is fast.**

> The shape to look for: **one compendium spawns the next.** PageRank → Google. BitKeeper →
> Git *and* Mercurial. A mission → the film about it. A disaster → the report that
> investigated it. The parent already carries the keyframes; the child references them.

## Where levers live

| Lever kind | Where it is | Example |
| --- | --- | --- |
| **Context universe** | `CommonUniverseIds` (`src/core/common-universe-ids.ts`) | `SILICON_VALLEY`, `VERSION_CONTROL`, `HOLLYWOOD_SYSTEM`, `US_HISTORY`, `NASA_OPERATIONS`, `APOLLO_PROGRAM`, `SPACE_RACE`, `INTERNET_DEVELOPMENT`, `SOFTWARE_ENGINEERING` |
| **Event / mission universe** | an existing universe id | `nasa:challenger:1986`, `nasa:apollo13:1970` |
| **Adjacent compendium** | a sibling universe in the same domain | `technology:bitkeeper:2000` (lever for `technology:git:2005`) |
| **A local const** | top of the family's module | `VCS_CONTEXT` in `version-control/versionControlSystems.universe.ts` |
| **The registry's shared set** | `CommonUniverseIds.contains` / `hierarchies` | the whole Qdrant `plane_universe_id` graph |

`CommonUniverseIds` **is** the lever catalogue. Reach for it first: a new technology universe
almost always has a `SILICON_VALLEY` / `SOFTWARE_ENGINEERING` / `INTERNET_DEVELOPMENT` parent.

## How the lever attaches

Two mechanisms, both stored under `connections` (still cast, not yet a first-class `Universe`
field — the loader reads it):

**1. Whole-universe derivation — `connections.natural.parentUniverses`:**

```ts
connections: {
  natural: { parentUniverses: ['nasa:challenger:1986'] },   // rogers-commission.ts
  references: [],
},
// or several levers at once:
natural: {
  parentUniverses: [
    CommonUniverseIds.HOLLYWOOD_SYSTEM,
    CommonUniverseIds.US_HISTORY,
    CommonUniverseIds.WORLD_HISTORY,
  ],
},                                                          // idiocracy.ts
```

**2. Keyframe-level derivation — `connections.references[]`:**

```ts
references: [{
  type: 'IN_A_PRIOR_KEYFRAME',
  targetUniverseId: '20th_century_fox:idiocracy:2006',
  targetKeyframeId: 'hibernation-experiment',
  description: "The universe's zero sits inside the frame opened by the real-era
                experiment, so its position is derived rather than fabricated.",
}],
```

This is the point of the lever: the child universe's *zero point* is **derived** from the
parent's keyframe, not fabricated. The `42i` position (and hence the plane charge) follows.

Vocabulary for `references[].type` (`src/core/types.ts`): `DOCUMENTS`, `INSPIRED_BY`,
`PARODIES`, `IN_A_PRIOR_KEYFRAME`, `EXTENDS`, `SUPERSEDES`, `CREATED_IN_RESPONSE_TO`,
`CONTEMPORARY_OF`.

## Precache the lever (the prep)

Before authoring, fetch the lever's facts and cache them — then author by reference:

```text
lever <id>  (<path>.universe.ts)
  chunk_id              synapse_inspect_files(read_chunk) → raw_source
  universeId, type, identifiers.primary + aliases
  keyframes[]           id, timestamp, significance   ← the ones the child will reference
  epochs{} / zero       the lever's zero point
  id factory            create*UniverseId(...) shape the child should reuse
  plane_* (Qdrant kb)   plane_charge, plane_universe_id, plane_presupposes, zero_status
  twin                  the sibling that ALREADY derives from this lever — copy its
                        `connections` block verbatim and change the keys
```

That last row is the shortcut: **a universe that already derives from your lever is a
template.** `rogers-commission.ts` is the template for any "report ← event" universe;
`version-control/versionControlSystems.universe.ts` is the template for the whole VCS family.

## Worked examples (all real, in this repo)

- **One lever → seven children.** `VCS_CONTEXT` in
  `src/config/universes/version-control/versionControlSystems.universe.ts` is the parent of
  `technology:sccs:1972`, `:rcs:1982`, `:cvs:1986`, `:subversion:2000`, `:bitkeeper:2000`,
  `:git:2005`, `:mercurial:2005` — each `natural: { parentUniverses: VCS_CONTEXT }`. The
  lever holds the shared narrative; each child holds its own keyframes.
- **Report ← disaster.** `src/config/universes/us-gov/rogers-commission.ts` →
  `parentUniverses: ['nasa:challenger:1986']`.
- **Film ← mission.** `src/config/universes/films/apollo13-film.ts` →
  `parentUniverses: ['nasa:apollo13:1970']`.
- **Film ← three contexts + a keyframe reference.** `src/config/universes/films/20th/idiocracy.ts`
  → `HOLLYWOOD_SYSTEM` + `US_HISTORY` + `WORLD_HISTORY`, plus an `IN_A_PRIOR_KEYFRAME`
  reference into the 20th Century Fox universe.
- **The archetype (not yet built): PageRank → Google.** The PageRank compendium is the
  lever: a new `Google`/`Alphabet` universe attaches `parentUniverses: [SILICON_VALLEY,
  INTERNET_DEVELOPMENT]` and references PageRank's publication keyframe with
  `CREATED_IN_RESPONSE_TO` / `IN_A_PRIOR_KEYFRAME`, instead of re-deriving 1996–1998.
  *If PageRank does not exist yet, that is the research task — build the lever, then the
  child is cheap.*

## Rules

1. **Derive before you invent.** Ask "which existing universe already holds these facts?"
   before writing a keyframe by hand.
2. **One owner, many memberships.** The lever owns the ids and the shared keyframes; children
   **point** at them (`targetUniverseId`). Never duplicate a keyframe to "own" it locally.
3. **`parentUniverses` means derivation, not association.** Use it for "this universe's zero
   sits inside that one", not for loose thematic links.
4. **Prefer `CommonUniverseIds` to a string literal.** A lever id is a shared contract; a
   literal drifts (see the id-validation gotchas in the `local-time-universe` skill).
5. **The child's zero is derived.** If a reference links a parent keyframe, the child's
   zero/`42i` position follows from it — don't compute it independently.
6. **Copy the twin.** Find the sibling that already derives from your lever and start from
   its `connections` block; it encodes the vocabulary the registry expects.
