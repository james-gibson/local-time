# The presumption ledger — falsify what the ticket assumes

A ticket is not a fact about the codebase. It is a set of **presumptions** — claims about how
the system works — written by someone (or something) who may have been wrong, or may have been
right about a design that has since moved. The same is true of a plan, a scaffold, a guide, and
a prior agent's summary.

Prep's job is to **extract those presumptions and falsify them against the code graph** before
anyone writes code that depends on them. Synapse is the engine for exactly this: one
`symbol` / `regex` / `read_chunk` per claim, using ids you already warmed in prep. It is the
cheapest pre-research there is — the graph is already indexed, the answer is one addressed read.

> A presumption you **verify** is a fact you hand down.
> A presumption you **don't** is the defect you ship.

The cheapest possible moment to find a false presumption is *before the first file that depends
on it exists* — not after sixty do.

## The ledger

Record one row per presumption the ticket/plan makes. Keep it wherever the plan lives (Qdrant
memory), so it survives compaction and hands down.

| field | meaning |
| --- | --- |
| `id` | `P1`, `P2`, … |
| `claim` | the presumption, in one sentence — *"the builder can emit the containment edge"* |
| `source` | where it is asserted (ticket §/line, plan step, guide line) |
| `verify` | the one Synapse call that settles it (`read_chunk <id>` / `regex <pat>`) |
| `status` | `verified` / `refuted` / `stale` / `undecidable` |
| `evidence` | `chunk_id` / `path:line` that settles it |
| `if_false` | what breaks if the claim is wrong |
| `action` | `proceed` / `gate` / `file` |

- **`verified`** — the code does what the ticket says. Hand it down, move on.
- **`refuted`** — it does not. If anything in the plan depends on it, that is a **gate**.
- **`stale`** — it was true, and the design moved out from under it (a `#NN` that landed).
- **`undecidable`** — not answerable from the graph alone (an absent config, a policy call).
  Put it in the scaffold's `open` and move on; do not burn calls on it.

**Rule:** a `refuted` presumption whose dependents are already in the plan is a **gate, not a
footnote**. Stop, record it with its evidence, and get a decision before building the thing that
depends on it. A gate is not a delay — it is the whole point of having probed.

## Worked example — james-gibson/local-time#89

`process local-time/issues/89` (SCOTUS OT2013: a term container + two dockets + ~60 cases). Five
presumptions, extracted from the ticket and settled in five reads:

| id | claim (the ticket says) | verify | status | evidence | if false |
| --- | --- | --- | --- | --- | --- |
| P1 | cases are built with `UniverseBuilder` and ids pinned with `withId(...)`; containment is the top-level `connections.natural.parentUniverses` (§3.1/§3.2) | does the builder emit top-level `connections`? | **refuted** | builder writes `metadata.connections` (array); `Universe.connections` is typed `ReferenceConnection[]` (`types.ts:645`); the object form is cast in `as unknown as Universe` and read only by tests (`idiocracy.test.ts:17`) | the two instructions cannot both hold in a builder → the module must be a **literal** (`universe-scaffold.md`) |
| P2 | containment resolves with `CommonUniverseIds.contains()` / `getChildren()` / `getAllDescendants()`; AC#2 = `getAllDescendants(term)` returns the cases (§3.2, §11) | is that registry extensible from a universe module? | **refuted** | `initializeHierarchies()` is a `private static` block of **9 hard-coded roots** (`common-universe-ids.ts:87–166`); `addHierarchy` is private (`:168`); the query methods read **only** `this.hierarchies` (`:185–232`); universe objects are never consulted | declaring `parentUniverses` on 60 cases does **not** make them descendants → AC#2 needs a core edit to `common-universe-ids.ts`, which §8 registration does not mention |
| P3 | "do **not** rely on `TemporalLayer.subuniverses` — it exists but is not wired (#74)" | grep `subuniverses` | **verified** | no producers or consumers | (correct as written — good ticket hygiene) |
| P4 | the shadow overlay is `type: 'subjective'` with a `reality_correspondence` block (§3.3) | do those types exist? | **verified as types**, `undecidable` as mechanism | `type: 'primary' \| 'meta' \| 'recreation' \| 'subjective'` (`types.ts:429`); `reality_correspondence?` exists (`types.ts:432`) | the *shape* compiles; whether anything consumes it is a separate question — and the ticket itself defers the choice (§12) |
| P5 | "`npm run lint` has no config — not a gate (#71)" | — | **undecidable** | — | do not spend a call on lint |

**Read the asymmetry.** §12 *flags* the uncertainty the author knew about (P4 — "decide before
build"). P2 is *not* flagged, is asserted flatly in §3.2 and §11, and is **unsatisfiable
without touching core**. The presumption that bites is the one nobody marked as a presumption —
which is exactly why they must be extracted mechanically rather than noticed.

That is the deliverable of this step for #89: not a burnt call, but a **gate** — *"AC#2 requires
a SCOTUS entry in `CommonUniverseIds.initializeHierarchies`; `addHierarchy` is private; the
ticket does not say so — decide before 60 case files exist."* That is the presumption work.

## Where it plugs in

- **plan-store** — a step carries `presumptions: [P1, P2]`; a step whose presumption is
  `refuted` cannot be `done`, it is `blocked` (see `plan-store.md`).
- **universe-scaffold** — `undecidable` presumptions go in the scaffold's `open` list.
- **handoff** — hand the ledger down (`presumptions:` line) so the next agent does not re-derive
  it, and so a `refuted` row arrives as a stated constraint, not a surprise.
- **filing** — a `refuted` presumption that needs a core change is an issue or a comment on the
  ticket. A repo with a remote → GitHub; otherwise `OUTSTANDING.md`.

## Cost

One `read_chunk` per presumption, from ids you already cached. For #89 that is five reads — and
they buy the single fact (P2) that determines whether the work proceeds as written or needs a
core change first. Compare that against discovering P2 after ~60 case universes exist.

## Smell list — what to extract first

The presumptions most likely to be false, in order:

1. **"This mechanism exists / is extensible."** The ticket names an API — check it is public,
   populated, and will accept your new value. (P2.)
2. **"These two instructions are compatible."** A ticket that says *use the builder* **and**
   *set the top-level edge* may not be satisfying both. (P1.)
3. **"`#NN` is done."** Dependencies named in the header — verify they are *wired*, not merely
   designed. A `#NN` can be closed and still be a design document.
4. **"The guide is accurate."** `kagi.md` is verified; `docs/universe-creation-guide.md` lists
   methods that do not exist (`book`, `series`, `game`, `withMetadata`). Check the guide against
   the source before following it.
5. **"Registration is the last step."** It is a presumption that the id is valid and reachable —
   a universe present in `allUniverses` is **not** necessarily registered (#27/#67).
