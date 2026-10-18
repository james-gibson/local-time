---
name: presumed-universes
description: Use when a universe edge points at a compendium that has no declaration — a `presupposes` / `cross-references` / `inverse-of` that names a `universe-id` nobody authored, a shim or registry entry whose original is missing, or a graph traversal that stops on an id with no document. Also use when deciding whether to declare a missing original, whether to stub it, or when a stubbed compendium risks being mistaken for a real one — "referenced but not defined", "undeclared universe", "presumed original", "dangling universe-id", "the JSON export looks like a declaration but nothing declares it". Do NOT use for ticket/plan claims that must be falsified against the code graph; that is the presumption ledger in 42i-prep.
---

# Presumed compendia — references with no declaration

A graph is allowed to reference a compendium that does not exist yet. What is not
allowed is for that reference to be **invisible**, because then the graph looks
complete and one query says "no dependents" while the truth is "dependents, but
they point at nothing".

**Presumed is the model's own state for this**, not a workaround: `zero-status`
already takes `established` / `presumed` / `unestablished`, and a presumed
compendium is the case where the value is known to be referenced and not yet
established.

## Disambiguate the two ledgers first

The word "presumption" is already load-bearing in this repo, for a different
thing. Keep them apart or both get weaker:

| | what is presumed | how it is settled | where |
| --- | --- | --- | --- |
| **claim presumption** | a *claim about the code* — "the builder can emit the containment edge" | one Synapse read; `verified` / `refuted` / `stale` / `undecidable` | `42i-prep/references/presumption-ledger.md` |
| **compendium presumption** | a *compendium's existence* — an edge names an id with no document | declare it, or leave it presumed on purpose | this skill |

A claim presumption is falsified against the code graph. A compendium presumption
is falsified by a **declaration** — the absent document is the falsifier. Do not
record the second in the first's ledger; a `read_chunk` cannot settle whether a
universe should exist.

## The rule that keeps it honest

**A presumed compendium has no plane, and therefore cannot enter the charge
graph.** From `CONVENTIONS.md`: *"absence is not a zero value"* — the unknown
rung is a compendium with *no plane*, not one valued at zero, and `plane gen`
refuses a neutral compendium (`charge graph is disconnected`). That refusal is
the feature.

So the generator emits the `plane:` block and says explicitly why it does not
apply, rather than omitting it (`CONVENTIONS.md`: the block "is not optional —
fill it or say explicitly why it does not apply"). **Never fill a plane to
silence a presumption.** A stub with charges is a lie with a shape.

## Where stubs come from: invert the reference

You do not have to research a presumed original from scratch, because whatever
referenced it already carries most of the skeleton: the `universe-id`, the
keyframe at stake, the replaced binary/surface, and the upstream link. Inverting
the reference yields the stub.

This is what `mcp-lab/universes/generate.py` does for the shim registry: each
shim declares what it replaces, and `--emit-presumed` writes a stub for every
referenced-but-undeclared id, carrying

- `status: presumed`, `confidence: 0`, `derived-from: [<referencing universe-ids>]`
- inbound edges inverted: `SUPERSEDES` → `SUPERSEDED_BY`, `PARODIES` → `INVERTED_BY`
- a keyframe tagged `awaiting-declaration`, with low `certainty`
- `plane:` present, empty, with the reason stated
- `local-time-sync: false`

The stub is not the document. It is the address plus the reason it is empty.

## The load-bearing field: `local-time-sync: false`

**This is what keeps a stub out of the JSON export.** `scripts/build-lore-json.js`
enrols a doc only when `local-time-sync` is exactly `true`:

```js
const isEnrolled = (fm) => {
  const v = fm[ENROL_KEY];
  return v === true || v === 'true' || v === 'yes';
};
```

A stub is skipped, so no `src/config/universes/imported/` module is produced from
it. **Flipping `local-time-sync` to `true` before the compendium is declared
exports a stub as though it were real** — and the exporter's `normalise()`
returns a fixed key set that does **not** include `status`, `confidence`,
`derived-from` or `plane`. The presumed marker is dropped on the way out, so the
JSON is indistinguishable from a declaration.

That is the same defect class as #27 / #67 / #98 — present but not reachable,
defined but not registered — inverted: **present but not declared, exported as
if it were.** Nothing throws. Sequence the flip last:

1. author the compendium (keyframes, segments, zero-point, `reality-gradient`)
2. fill `plane:`; drop `status: presumed` and `confidence: 0`
3. **then** `local-time-sync: true`
4. inbound edges already exist — no referencing doc needs editing

If the presumed status must survive to JSON, `build-lore-json.js` has to be
taught the keys first. Until then, treat the frontmatter as the source of truth
and the JSON as downstream, exactly as `CONVENTIONS.md` already says about
`plane:`.

## Finding them

- **The generator's report.** `python3 mcp-lab/universes/generate.py --check`
  prints `declared` / `presumed` per run, grouped by referencing shim. Cheapest
  check because it runs before anything is written.
- **Inbound edges to undeclared ids.** Any traversal that collects
  `presupposes`, `cross-references` and `inverse-of` targets, then subtracts the
  set of declared `universe-id`s, is the same report over the whole graph.
- **The smell.** An id that appears only on the right-hand side of edges. If an
  id is never a `universe-id:` of a document but is referenced by three, the
  reference count is the priority.

## When to leave it presumed

Presumed is a legitimate resting state, not a TODO that must clear. Leave it when
the original is outside this library (an upstream tool, another project's
universe), when only the address is needed for the graph to traverse, or when
declaring it would be invention rather than documentation. The stub already earns
its keep by closing the edge — that is the whole point of giving a presumed
original a universe of its own.

Declare it when the frontier is load-bearing: something derives from it, or the
presumption is about to be depended on. The claim ledger's rule carries over — a
presumption you do not settle is the defect you ship.

## Verifying a promotion

Declaring is not done when the markdown is written. Four gates, in order:

1. **Build** — `node scripts/build-lore-json.js <root>` reports `Emitted N, skipped
   M not enrolled`. `skipped` should exclude your doc, which is the enrolment flag
   doing its job.
2. **Import** — `node scripts/import-lore-json.js <root>/lore <out>`.
   **Segment bounds must resolve** to a declared keyframe address/id or an absolute
   ISO timestamp; `end: null` is refused outright (`local-time#35`). An open phase
   needs a **stated horizon**, not `null`.
3. **Register** — import is not registration.
   `universe-registry.ts` dynamically imports `universes/imported/index.js` and
   reads `importedUniverses`; `src/config/__tests__/generated-registration.test.ts`
   exists because a module can be exported by the barrel yet omitted from that
   array. Confirm with `getUniverse(<id>)` after `initialize()`.
4. **Correct the address if research says so.** The inverted address is a guess
   recovered from a reference. `find` was recovered as `technology:find:1971` and
   is `1974` (Version 5, Programmer's Workbench). Updating it means updating the
   referencing entries too, so the edges keep pointing at the right id.

`references/shim-inversion.md` has the worked run, including the exact importer
refusal and the corrected address.

## See also

- `local-time-universe` — the mirror defect: *defined but not registered*.
  This skill covers *referenced but not declared*.
- `42i-prep/references/presumption-ledger.md` — claim presumptions.
- `42i-prep/references/universe-scaffold.md` — where an `undecidable` goes.
- `kb/lore/CONVENTIONS.md` — the plane contract, the declaration-time rule, and
  *"absence is not a zero value"*.
- `mcp-lab/universes/README.md` — the generator that emits stubs by inversion.
