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
- **Edges from declared compendia, not just from references.** The frontier has
  two sources. A shim (or registry entry) names an original — that is what
  inversion can see. A **declared** compendium's own `presupposes` edge names
  something too, and inversion cannot see it, because nothing in the referencing
  document mentions it. So **declaring one thing reveals the next hole**: declare
  the shell and its `presupposes: [technology:tty:1971]` puts the terminal on the
  frontier; declare the terminal and its `presupposes: [technology:teletype:1963]`
  puts the 1963 hardware there. Walk the traversal, do not guess the wildcard.
- **A `*` is not an id.** `namespace:name:year` has no wildcard slot. A family
  like `technology:tty:*` has to be *expanded* into members, and the model
  expresses the family with `parentUniverses` / `extends` — which are references
  with their own resolver (below).

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

## Where the traversal stops

The traversal must stop, and the interesting part is *on what*. Two questions get
confused; only one of them has a grounded figure.

| question | answered by | kind |
| --- | --- | --- |
| which missing node **matters** | the distances (`unknown tool +32`, honeypot contact `+16`, boundary violation `+16`) | **priority** |
| when to **stop** | structure: the charge graph, degree, the Byzantine minority | **terminus** |

`MATH.md` forbids reading the first as the second: the distances are *outputs* of
closed-form arithmetic ("nothing is searched or learned"), and three unreconciled
schemes overlap in range and vocabulary. So the stop is structural:

1. **Nothing in the charge graph requires it** — a presumed node has no charges and
   is therefore off the graph already. `plane gen` refusing a neutral compendium is
   the same refusal at the other end.
2. **No agent path reaches it** — *domain-only* (named by a declared compendium's
   `presupposes`) is a stop; *contacted* (named by a shim, i.e. something an agent
   can call) is not.
3. **`presumed ≤ ⌊(N−1)/3⌋`** — the Byzantine minority, the one standard figure in
   `MATH.md`. Below it the closure certifies itself; above it, no. A ceiling, not a
   target.

A degree-1, domain-only node that nothing charges is the floor. Stop there
deliberately, and make the report say so — a stop that is *visible* is different
from a gap nobody noticed.

## A permissive id space lets an agent be wrong first

`CONVENTIONS.md`: *"every universe-id is valid, and nothing here constrains what an
id means."* That freedom is the throughput, and it is also the exposure: an agent
can mint a **well-formed lie** — a valid id that resolves to nothing and collides
with nothing. `technology:find:1971` was exactly that; it sat in the frontier
looking correct until research made it `1974`.

Errors differ by class, and the class tells you what will catch them:

| class | caught by | example |
| --- | --- | --- |
| malformed | a structural check | `end: null` (`local-time#35`) |
| invented container | the parent resolver | `SHELLS`, `TERMINALS` |
| **well-formed but wrong** | **nothing structural — only research, or the math, later** | `find` 1971→1974, `sh` 1971→1977 |

The third is the reason the math matters and the reason it is slow: a well-formed
id pointing at the wrong thing is indistinguishable from a correct one to every
resolver, so the collision only surfaces once two ids for one thing reach the plane
and the charge graph or consensus disagrees. Front-load the cheap structural checks;
mark an overridden address as a hypothesis that moved; and keep presumed nodes off
the charge graph so a wrong id cannot pollute it while it is wrong.

## The class with no truth signal: valid but unranked

There is a class worse than all three above, and naming it correctly took a
correction.

A question like `technology:tty:*` is a **query** — a request for a set. Its members
are not true or false; they are *ranked*. A wrong member is not a lie. Getting this
right matters because the two failures have different detectors:

| axis | detector | catches |
| --- | --- | --- |
| **is it real?** | a truth check | fabrication. Cannot touch this case. |
| **is it the best answer?** | rank against demand | this case. Not satisfiable by facts, because every fact is true. |

The concrete instance: `pty` was committed as though the query had demanded it. It
is real, it is genuinely part of the terminal family, and it was a *valid* answer —
just not the demanded member, because the shim's behaviour turns on `isatty(1)` and
the line discipline, which is `tty`, not the pty a harness allocates one level out.

**An accurate answer to a question nobody asked is harder to catch than a
hallucination**, and that is the point worth carrying: nothing dangles, every gate
is green, and the answer is true. Even so, it is still an *orphan* — nothing
referenced it — and that is a structural fact, so the detector exists after all: ask
what demanded the declaration, not whether it is correct.

So: a universe may be declared for two reasons and no third — **something
references it** (a shim, or a declared compendium's `presupposes`), or **it is a
root with the reason stated**. A grounding report distinguishes the two and counts
**asserted** edges (ones a compendium wrote) separately from **referenced** ones
(a shim named it):

```
technology:sh:1977    <- shim:lezz-path-shim:2026
technology:tty:1971   <- technology:sh:1971, sh:1977  (2 asserted, not referenced)
```

### Deferred is not false, and deferral is not absence

Two corrections back, the move was to *delete* the orphan and call absence the
honest state. Wrong twice over.

**It was not false.** `rejected` would imply the subject was invented; the subject
is real and the *rank* was wrong. So the state is **deferred**: a rejection is about
truth, a deferral is about order, and only one of those describes what happened.

**And deletion cannot restore the undetermined state.** An id that was thought of,
evaluated and ranked is a *negative fact*; an id that never came up is a different
object:

> `CONVENTIONS.md`: **absence is not a zero value** — don't read "unknown" as `0`.
> The mirror: **a considered absence is not absence** — don't read "deferred" as
> "never considered".

Symmetric failure, same shape. So there are **three states, not two-plus-a-hole**:

| state | meaning | on the charge graph |
| --- | --- | --- |
| **declared** | a reference demanded it | yes, with charges |
| **presumed** | referenced, not yet declared | no — `charges: []` |
| **deferred** | a valid answer that is not the best answer | no, and not stubbed |

Deletion also destroys the **trail**: the deferred set *is* the blast radius of
whatever raised the id. Delete it and the artifact reads as though the query never
happened — laundering the failure by subtraction, the mirror of laundering it by
inventing a plausible edge. So deferrals carry `valid-answer-to`, `not-best-because`
and `revisit-if`, and they stay: a deferral is reversible, silence is not.

Note the limit, and state it rather than hide it: grounding catches the *orphan*
but not the *plausible assertion*. `tty` is reachable — the chain terminates at
`sh:1977`, which a shim references — yet the last two hops are edges the model
wrote in response to the wildcard. **Inventing one true-sounding edge launders
everything downstream of it.** Reachability alone would call that grounded.

The rule:

> **A declaration cites the reference that demanded it, or states that it is a
> root. There is no third category — and a `*` is a question, not a reference, so
> it is refused at the first token rather than resolved.**

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
5. **Resolve the parents — they are references too, with a stricter resolver.**
   Every declared `parentUniverses` entry must resolve to a **container**, and a
   container cannot be contributed by a universe module:
   `COMMON_UNIVERSE_IDS.initializeHierarchies()` is a private static block of
   hard-coded roots and `addHierarchy` is private. So inventing a container is the
   same error as inventing an address, one level up — and it surfaces as a failing
   test rather than a dangling edge:

   ```
   ● every declared parent in the tree resolves to a container
   + "technology:tty:1971 -> TERMINALS"   (TERMINALS does not exist)
   ```

   Use a real container (`SOFTWARE_ENGINEERING`, `WORLD_HISTORY`, …), or file the
   missing container as work — a family that keeps attracting compendia (shells,
   terminals) deserves a root, and adding one is a core change (local-time#158).

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
