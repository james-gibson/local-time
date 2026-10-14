# The KB → TypeScript pipeline

`scripts/sync-lore.sh` turns enrolled KB lore docs into TypeScript `Universe` modules. It
is three steps chained; steps 1 and 2 are what matter here. The KB side of the contract —
which frontmatter keys exist and what they mean — is the `zero-reference` skill in the `kb`
vault (`references/local-time-sync.md`). This file is the local-time side: the commands,
what lands on disk, and what you still have to do by hand.

## Running it

From the local-time repo root:

```sh
SKIP_QDRANT=1 NODE_BIN="$(command -v node)" ./scripts/sync-lore.sh [KB-root] [output-dir]
```

- `KB-root` defaults to `../../kb`; the docs are walked under `<KB-root>/lore`.
- `output-dir` defaults to `./src/config/universes/imported`.
- `NODE_BIN` — the node binary. This machine has no `node` on `PATH` under nvm; use
  `NODE_BIN="$(command -v node)"` after sourcing nvm, or the absolute path.
- `SKIP_QDRANT=1` skips step 3. Without it, step 3 runs `qdrant-sync.sh` if the KB has an
  executable one; missing credentials exit 78 and are tolerated, any other failure aborts.

The steps, in order:

| # | Script | Reads | Writes |
| --- | --- | --- | --- |
| 1 | `scripts/build-lore-json.js <KB-root>` | `<KB-root>/lore/**/*.md` | `<doc>.json` beside each enrolled `.md` |
| 2 | `scripts/import-lore-json.js <KB-root>/lore <output-dir>` | `<KB-root>/lore/**/*.json` | `<output-dir>/<id>.ts` + `<output-dir>/index.ts` |
| 3 | `<KB-root>/scripts/qdrant/qdrant-sync.sh` | the KB vault | the Qdrant `kb` collection |

Step 1 only emits JSON for docs whose frontmatter sets `local-time-sync: true` (also accepts
`"true"` / `"yes"`). Docs without it acquire nothing. Step 2 only converts JSON whose
`local-time-sync` is `true`; a stale or hand-made JSON is skipped, not converted.

## What step 1 carries across

`build-lore-json.js` reads a fixed set of frontmatter keys and drops everything else at this
boundary. The keys and their JSON field names are tabulated in the `zero-reference` skill's
`references/local-time-sync.md`. Two consequences worth repeating:

- **`plane:` does not cross into local-time's TypeScript.** `build-lore-json.js` never reads
  it, so a KB `plane:` block has no representation on the generated universe objects. It is
  **not inert, though, and planes are not "KB-only"**: step 3 of the *same* `sync-lore.sh`
  (`$KB_ROOT/scripts/qdrant/qdrant-sync.sh` → `index_kb.py`) reads the `plane:` block and
  builds the Qdrant **`plane` vector** — `charges`, `encoder.{real,imaginary}`,
  `presupposes`, `tensor`, `inverse-of`, anchor 42. Planes cross to **Qdrant**, not to
  `allUniverses`.
- **`point_in_time` is a window strategy alias** handled in step 2, not step 1.

Step 1 also derives the 42i lift (per-keyframe `tension`, epoch `dilatation`) and the
zero-point/`zeroStatus` — derived views, recomputable, never authoritative.

## What step 2 emits

`import-lore-json.js`:

- Maps KB `type` through `TYPE_MAP`:

  ```text
  historical-event -> HISTORICAL_EVENT   book -> BOOK
  legal-timeline   -> LEGAL_TIMELINE     simulation -> SIMULATION
  biography        -> BIOGRAPHY          technology -> TECHNOLOGY
  mission          -> MISSION            institution / institutional-period -> INSTITUTIONAL_PERIOD
  film             -> FILM
  ```

  Anything not in the map becomes `HISTORICAL_EVENT`.

- Resolves `realityRelation.type`: a declared `reality-relation` wins; otherwise the
  `reality-gradient` is banded:

  ```text
  <= 0.20 documentary | <= 0.50 historical_fiction | <= 0.75 inspired_by | else pure_fiction
  ```

- Aliases the window strategy `point_in_time` → `phase_based` (a point in time is a
  degenerate phase, #79). An unknown strategy warns and defaults to `phase_based`.

- Emits each module as a plain object **cast `as unknown as Universe`**, imports from
  `../../../core/types`, timestamps as `BigInt(Date.UTC(...)) * 1000000n`, and keeps the
  lore body as a block comment so the prose survives (#96).

- Writes an `index.ts` barrel: one `export { <id>Universe } from './<id>';` per module. The
  module name is the universe id with non-alphanumerics replaced by `_`; the export name is
  that camel-cased with a `Universe` suffix (`toIdentifier`).

## The hard error

Every segment `start` and `end` must resolve to a declared keyframe `address`/`id` or an
absolute ISO timestamp. Any unresolved bound makes the importer print every offender and
**exit 1**, emitting nothing (james-gibson/local-time#35). Do not compute a bound from the
zero point — the addresses are ordinal labels, not a clock. Declare a keyframe at each
epoch-relative bound instead.

## Silent coercions to watch

- **Unknown segment `type` → `phase`**, with no warning (contrast the window-strategy
  warning). Check against the closed union first.
- The importer *does* emit segment `status`, `jurisdiction` and `description` (lines 219-221
  of `import-lore-json.js`) — unlike `UniverseBuilder.addDateSegment`/`addSegment`, which
  drop them (james-gibson/local-time#100). So a pipeline-generated module can carry segment
  fields a builder-authored one cannot.
- An `unestablished` zero emits **no** zero epoch; the importer never fabricates a zeroth.

## After the pipeline — registration is still on you

The pipeline does not make the universe live.

- `imported/` is **git-ignored** (`.gitignore`), so the modules are local-only.
- `src/config/universes/index.ts` does **not** import `./imported` and its barrel is not
  spread into `allUniverses`. A synced universe is therefore built and then discarded
  (james-gibson/local-time#98 — the #27/#67 defect class).

To make it queryable:

1. Import the generated module(s) in `src/config/universes/index.ts`.
2. Spread them into `allUniverses` (spread a collection, never nest it — #68).
3. Extend a registration test to cover them, or add one, per `SKILL.md` →
   *Registration*.

Because `imported/` is git-ignored, think before wiring it into committed files: an import
of `./imported` breaks a fresh checkout, where the directory does not exist. The durable
route is to move a synced universe out of `imported/` into a committed namespace module
(hand-author it, or copy the generated literal), then register that.

## Verifying a sync

- Step 1 logs `Emitted N, skipped M not enrolled` and lists the skipped files. If your doc
  is in the skipped list, its `local-time-sync` flag is missing or not `true`.
- Step 2 logs one line per emitted module and `index.ts -> N export(s)`. If your id is absent
  from the output, check the `Not enrolled` line: it also catches an enrolled doc with no
  `universe-id`.
- A module on disk is **not** proof of registration. Confirm with a real lookup. Note the
  constructor loads nothing — `initialize()` is what imports the built-ins:

  ```ts
  const registry = new UniverseRegistry(new ConfigLoader());
  await registry.initialize();               // imports allUniverses via built-in-universes
  registry.getUniverse('your:universe:1999'); // undefined means not registered
  ```

  and run the namespace's `*-registration.test.ts` (`SKILL.md` → *Registration*).
