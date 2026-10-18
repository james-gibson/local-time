---
name: local-time-universe
description: Use when adding, creating, editing or registering a universe in the local-time library — authoring a UniverseBuilder module under src/config/universes/, wiring a universe into allUniverses, adding a *-registration.test.ts, or running the KB lore sync pipeline (./scripts/sync-lore.sh) that emits src/config/universes/imported/. Also use when a universe "isn't showing up", "builds but can't be found", or is missing from a registry query. Covers the real builder API, id factories, closed unions and what build() validates.
---

# Adding a universe to local-time

A universe is only real once it is **registered**. The recurring defect
(james-gibson/local-time#27, #67, #98) is a universe that is defined, built and validated
at module scope and then **silently discarded** because nothing reaches it from
`allUniverses`. Nothing throws, so nothing points at it.

Three properties define "done":

1. **Registered** — reachable from `allUniverses` in `src/config/universes/index.ts`, and
   retrievable from a `new UniverseRegistry(new ConfigLoader())` **after
   `await registry.initialize()`**. The constructor loads nothing; `initialize()` is what
   imports the built-ins (`config/built-in-universes` → `allUniverses`).
2. **Combined, not duplicated** — one `universeId` has one definition; a second membership
   is a `parentUniverses` edge, never a second copy (#74, #75).
3. **Projectable** — the fields are the retrieval schema (corpus, weights, charge), so
   keep them real rather than decorative (#76).

And it must be **real content**: a real event or a real work. "Fiction is modelled,
not hidden" is the second half of the rule, not an exception to the first — a
fictional film is real content *because it is a real work*, and its fictionality lives
in `realityRelation`. An invented work has no existence to model, however fictional
its characters. `games/monopoly.ts` is the worked example: deleted (#113, #142) because
it invented a Pixar short with no author, venue or publication. A real, published fan
work would be recordable; this was not one. See `kagi.md` § Automatic Context
Discovery. Deleting the universe does not delete the connection: `42i` is the
working-hypothesis anchor (`0+42i`) against `42` (`42+0i`), and a compendium is a
*feature* — Given its zero/`presupposes`/anchors, When its keyframes, Then its claims —
so a fiction claim about a real work stays declarable (charge -1, `presupposes` the
work, positive `tensor.w` — *possible*), not as a universe, with the receipt absent.
Keep the constraint **scoped to its container**: "no fictional character in real
attribution" bounds `attribution.creators`, not the fiction plane — and 42i's inverse
is keyframe-scoped for the same reason. The point of that context is the next
calculation: "has Woody ever produced a film?" answers *no* in the real sector and
*yes, in the fan work* in the fiction sector; a fictional name in the real credit block
turns the same query into a false real-world fact. An event that belongs to an existing
work's own timeline is a keyframe on that work, not a universe of its own.

## Pick a path

| Path | When | Starts in |
| --- | --- | --- |
| **A. From the KB** | The universe is (or should be) a document in the `kb` vault | the KB — declare it, then run the pipeline |
| **B. Hand-authored TS** | No KB document, or the structure needs types the KB frontmatter cannot carry | a module under `src/config/universes/` |

Both paths end at the **same registration step**. Neither registers itself.

- Path A detail: `references/pipeline.md`.
- Path B detail: `references/builder-api.md`.

## Registration — the step that is always forgotten

`src/config/universe-registry.ts` loads the built-ins (via
`src/config/built-in-universes.ts`, which imports `allUniverses` from
`src/config/universes/index.ts`). Every universe you add must be reachable from that array,
directly or via a spread collection.

- **Spread collections, do not nest them.** `...filmUniverses`, not `filmUniverses`. A
  nested array puts an array where a universe belongs and `universeId` comes back
  `undefined` (#68).
- **`universeId` must be unique across `allUniverses`.** Two definitions of one id is the
  duplication #74/#75 warns about — model membership instead.
- **One module per path.** Never ship both `foo.ts` and `foo/index.ts`. A file wins over a
  directory, so `import ... from './foo'` silently ignores the whole directory — that is
  #67, where 28 universes never loaded.
- **Being in `allUniverses` is not enough.** `loadBuiltInUniverses` wraps each
  `registerUniverse` in `try/catch`, warns and skips invalid entries. A malformed id is
  present in the array and absent from every query. Validate the id *and* test a real
  lookup.
- **Add the invariant test.** For a new namespace, add a `*-registration.test.ts` that
  walks the namespace barrel, asserts every id is in `allUniverses`, and asserts each one
  registers into a fresh `new UniverseRegistry(new ConfigLoader())` and comes back from
  `getUniverse` — the half a spread into `allUniverses` does not prove, because a malformed
  id is dropped by the registry with a warning. Copy the shape of
  `src/config/universes/films/films-registration.test.ts`; the `people/` namespace has the
  same guard.
- **Module-scope `.build()` is a deliberate trade-off.** A validation failure throws during
  `import`, which takes the whole `allUniverses` barrel down and fails unrelated suites at
  once (#45). Keep a module's data valid, or build lazily.

## Path A — from the KB

1. In the KB, declare the universe per the `zero-reference` skill: a `universe-id`,
   `local-time-sync: true`, the `plane:` block and the temporal anchors.
2. From this repo root, run the pipeline:

   ```sh
   SKIP_QDRANT=1 NODE_BIN="$(command -v node)" ./scripts/sync-lore.sh
   ```

   It writes `src/config/universes/imported/<id>.ts` plus an `index.ts` barrel.
3. **No wiring needed.** `imported/` is git-ignored (the compendia are private), but
   `UniverseRegistry` loads that barrel at runtime when it is present — the synced
   universe is registered through the normal path, with no edit to committed files
   (#98). `src/config/__tests__/generated-registration.test.ts` guards the wiring.

The pipeline's own hard error — every segment bound must resolve to a declared keyframe or
an absolute ISO timestamp, or the run exits without emitting anything — is covered in
`references/pipeline.md`.

## Path B — a hand-authored module

1. Choose the namespace directory under `src/config/universes/` (for example `films/`,
   `historical/`, `us-gov/`). One module per path.
2. Author the universe with `UniverseBuilder` (preferred) — including its containment and
   reference edges (`addParent` / `addReference`), segment prose, sources and usage
   restrictions. Fall back to a manual `Universe` literal cast `as unknown as Universe` only
   for the residue the builder still cannot express; the list is in
   `references/builder-api.md` → *What still needs a literal*.
3. Export it, or an array collection that contains it.
4. Import and **spread** the export from `src/config/universes/index.ts` into
   `allUniverses` (and `allNetworks` for a network).
5. Add the `*-registration.test.ts`.

Imports are relative, and the `../` count is *(directory levels under
`src/config/universes/`) + 2*:

```text
src/config/universes/[name].ts          -> ../../core/types
src/config/universes/[cat]/[name].ts    -> ../../../core/types
src/config/universes/[a]/[b]/[name].ts  -> ../../../../core/types
```

Check a sibling file at the same depth rather than counting.

## Builder reality check

`docs/universe-creation-guide.md` documents methods that **do not exist**. Trust the source
(`src/core/universe-builder.ts`) or `references/builder-api.md`.

| In the guide | Reality |
| --- | --- |
| `.book(author, title, year)` | does not exist — author `BOOK` manually |
| `.series(network, title, year)` | does not exist — use `.media(type, title, year)` or manual |
| `.game(publisher, title, year)` | does not exist — author `GAME` manually |
| `.withMetadata(metadata)` | does not exist — set `metadata` on a manual literal |

`.mission()`, `.biography()` and `.media()` assemble an id **without validating it** — pin
the id with `.withId(...)` or check it with `isValidUniverseId`. `.film()` and
`.historical()` validate and throw on a bad id.

`build()` validates in a fixed order and throws one error listing every fault:

1. attribution — needs `public_domain` **or** `copyright.holders` **or** `sources`
2. `fictionalizationDegree` in `[0, 1]`
3. `cultural_significance` in `[0, 1]` (when set)
4. every keyframe `significance` in `[0, 1]`
5. temporal content — a `primary` layer, **or** segments/keyframes, **or** flattened
   epochs. `TECHNICAL_SPECIFICATION`, `TECHNICAL_LOG` and `ABSTRACT_CONCEPT` are exempt.

The guide quotes the wrong message ("Either copyright information or public domain flag…").
The real one is:

```text
Attribution is required: set public_domain, copyright, or sources (at least one).
```

## Complex universes are factories or compositions

Large hand-authored literals are usually not really "one universe". Before you write a long
one, check which of these you are looking at — the shape to reach for is different:

- **A factory.** `src/config/universes/us-history/usStatehoodHistory.universe.ts` produces 50
  state universes from one `createStateUniverse(data)` function. The repeated parts (the
  `legal_period` segment, the `admission`/`secession`/`readmission` keyframes, the
  `parentUniverses: [US_HISTORY, US_GOVERNMENT]` edge) are its parameters. If you are about to
  write the same block a third time, write a factory function instead.
- **A composition.** One universe reached several ways — a film seen by a studio collection
  *and* by a filmography — is one id, not two. `films/index.ts` documents why the
  alternatives were *folded* instead (duplicate ids under #67) and calls that "a workaround,
  not the model". See #74.

The vocabulary to express composition exists, and **containment** is now wired (#74):

| Primitive | State today |
| --- | --- |
| `connections.natural.parentUniverses` | the literal containment edge — the one that is actually populated |
| `addConnection({ type: 'member_of', … })` | the builder containment edge — lands in `metadata.connections` |
| `UniverseRegistry.getOwner` / `getMemberships` / `contains` | the read surface; the registry folds *both* edges into `CommonUniverseIds` |
| `TemporalLayer.subuniverses` | **retired** — it had zero producers (#74) |
| `TemporalLayer.reality_correspondence` | used once, `savingPrivateRyanUniverse.ts` (#75) |
| `UniverseNetwork.sharedEpochs` / `eras` | declared; every member set is empty |
| `TemporalKeyframe.targetUniverseId` | the only cross-universe keyframe link (#3) |

`allUniverses` is **flat with unique ids** — one owner per id — but a universe may be a *member*
of any number of containers. The registry derives those membership edges from the declared
parents (literal or builder), so `contains` / `getParentChain` / `getChildren` /
`getAllDescendants` answer membership without the id ever being registered twice. The
designed-vs-in-code ledger is `explorations/README.md`; the unfinished work is #75 (composition)
and #82 (shared windows).

**The cheapest universe is a derived one.** Before authoring anything, look for a **lever**: an
existing universe that already holds the facts — a shared context from `CommonUniverseIds`
(`SILICON_VALLEY`, `VERSION_CONTROL`, `NASA_OPERATIONS`, `HOLLYWOOD_SYSTEM`, …), the event the
new one dramatises, or the system it replaces. Attach it with
`connections.natural.parentUniverses`, point at its keyframes with
`references[].targetUniverseId`, and find the **sibling that already derives from the same
lever** to copy its `connections` block from. One compendium spawns the next — PageRank →
Google, BitKeeper → Git *and* Mercurial, `nasa:challenger:1986` → the Rogers Commission. The
full pattern (the lever registry, what to precache, and real worked examples) is in the
`42i-prep` skill: [references/universe-levers.md](../42i-prep/references/universe-levers.md).

## Gotchas verified against the current source

- **Convenience-builder defaults no longer clobber explicit calls.** (Fixed for #99.)
  `withWindowing` and `setRealityRelation` now set their guard flags, so a factory default is
  applied only when the caller never set the field. Factory defaults, still:
  `createFilmBuilder` → `pure_fiction` / `1.0` / `scene_based`; `createHistoricalBuilder` →
  `documentary` / `0.0` / `time_based`. Before the fix `setRealityRelation` silently flipped a
  universe to the factory's type — usually the opposite of what was asked.
- **Segment `status`, `jurisdiction` and `description` are kept.** (Fixed for #100.)
  `addSegment(id, start, end, type, description?, status?, jurisdiction?)` and
  `addDateSegment(startISO, endISO, id, type, status?, jurisdiction?, description?)` both write
  all three; a field is written only when supplied, so a bare segment keeps the exact shape it
  had. Fourteen call sites had been passing descriptions that never arrived — nine segments
  across `copyright.ts`, `beatles.ts`, `ed-sheeran.ts` and `pixar-acquisition.ts` were silent
  empties until this landed.
- **`addRuntimeKeyframe(minutes, seconds, ...)`** — `seconds` is seconds *within* the
  minute: `(5, 30)` is 5m30s, not 5m30s-after-5m.
- **`withRuntime(minutes)` uses `TimePrecision.SECOND`**, not milliseconds as the guide
  claims.
- **Every epoch needs an explicit `epochId`.** The registry substitutes the layer key and
  warns, which silently changes what every reference to that epoch means (#19).
- **Closed unions.** `TemporalSegment.type`, `windows.strategy`
  (`scene_based | time_based | phase_based | countdown_based` — there is no
  `point_in_time`) and `realityRelation.type` are closed. Enumerated in
  `references/builder-api.md`.
- **Two different "anchor" shapes.** `realityRelation.realityAnchors` uses `RealityAnchor`
  (`realEventId` / `relationshipType` / `confidence` / `evidence`). `TemporalReference`
  anchors use `{ domainId, eventId, context }`. Do not mix them. `realEventId` should name a
  universe that exists — the shape is advisory, so a wrong id is a dangling anchor, not an
  error. Some older files predate the shape (`realWorldEvent`, or `id`/`description` with no
  `relationshipType`, e.g. `us-gov/hydrological.ts`); do not copy them.
- **Assemble; do not hand-author.** `addParent` writes the first-class
  `connections.natural.parentUniverses`, `addReference` writes `connections.references`
  (a typed `DISTRIBUTED_BY`/`PARODIES`/`IN_A_PRIOR_KEYFRAME` edge), and `withSources` /
  `withUsageRestrictions` / `withReleased` set the attribution and metadata fields that used
  to be reachable only from a literal. A film — or any universe — can now be built end to end
  with no `as unknown as Universe` cast; the proof is
  `src/core/__tests__/universe-builder-assembly.test.ts`. Reach for a literal only for what is
  still genuinely unreachable (see the builder-api's *What still needs a literal*).
- **A manual literal is not a builder call.** Fluent parameters are not fields. There is no
  `options` field on a keyframe — set `description`/`certainty`/`dateRange`/`type` directly,
  with `dateRange` as `{ earliest: bigint, latest: bigint }`. A keyframe `type` is a
  `KeyframeType` (not a `TemporalSegment.type`). See `references/builder-api.md` →
  *Manual literal vs builder — traps*.
- **`identifiers.primary` is not a lookup key.** The registry registers `universeId` and
  `identifiers.aliases` only. Keep `primary` equal to `universeId` unless you deliberately
  record a different canonical id — some namespaces assert that equality in their tests.

## Where else to look

- `local-time-ids` (this repo, `.opencode/skills/local-time-ids/`) — **measure the id
  before you write the module.** Why `isValidUniverseId` is not a proof, the reserved
  namespaces, the two slugifiers, and how to prove that an id you *reference* resolves.
- `local-time-films` (this repo) — the film-specific half: the studio token, containment
  and `DISTRIBUTED_BY`, runtime keyframes as positions, gapless acts, and the film-ticket
  presumption ledger.
- `local-time-verify` (this repo) — the gates, and the traps that make a local run lie
  (a symlinked `node_modules`, a single-suite pass, a `BigInt` jest message).
- `references/builder-api.md` — the full, verified builder method list, id factories,
  closed unions and `build()` internals.
- `42i-prep`'s [`references/universe-scaffold.md`](../42i-prep/references/universe-scaffold.md)
  — the ready-to-fill **starting builder**: builder- and literal-mode templates, the
  registration checklist, and how prep stores it in Qdrant so you can start mid-file.
- `references/pipeline.md` — the KB → TypeScript pipeline end to end.
- `kagi.md` — the generator prompt; a fuller checklist, but two of its gotchas (#70, #77)
  are fixed in source (james-gibson/local-time#101).
- `docs/universe-creation-guide.md` — the tutorial; its method list is partly fictional (see
  above) and it omits registration entirely.
- The `zero-reference` skill in the `kb` vault — the KB side of Path A.
- The [`42i-prep`](../42i-prep/SKILL.md) skill (this repo, `.opencode/skills/42i-prep/`) — run
  it **before** you start: it warms the Qdrant `kb` plane payload and the Synapse `chunk_id`s,
  and hands the block ids down so you read by id instead of re-searching. Its "agent anxiety
  management" section is the antidote to serialising edits or avoiding a local-service call.
