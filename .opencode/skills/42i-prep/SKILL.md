---
name: 42i-prep
description: Use before a multi-step refactor, before creating or adding a universe in local-time (or processing one of its implementation tickets), or before any KB/plane work. 42i prep loads any durable gated plan for the task from Qdrant memory, classifies the task shape (research, one edit, ten, refactor, universe-create, ticket), probes the unknown facts (cwd, git remote, branch, node, Synapse repo_id, KB root), and warms three caches: the Qdrant `kb` plane/42i vector, Qdrant memory, and the Synapse code graph. For a universe it hands over a ready-to-fill scaffold so the agent starts writing, not deciding; for a ticket it falsifies the ticket's presumptions first. It records the block/chunk ids and hands them down so downstream agents read by id; Synapse returns addressed chunks, not grep output. Also load when an agent serialises edits, re-reads its own output, misreads a thin result as "not found", or stalls expecting a local server to be slow — the failure mode this skill calls agent anxiety.
---

# 42i prep — warm the caches, then work

**42i prep** is a short, deliberate pre-flight: before a multi-step refactor or a universe
creation, fetch every block the task will touch *once*, put it where its consumer will look
for it, keep its id, and hand those ids **down with the work**.

The thing this prevents has a name. **Agent anxiety** is the failure mode where the agent
invents a latency reason to proceed timidly — one edit at a time, re-reading data it already
holds, re-running a search instead of reading a known block by id — because it expects a
local server (Synapse, Qdrant, the OpenKnowledge/Hocuspocus server, the embedding model) to
be slow. The cure is structural, not reassurance: if the data is already hot and addressed,
there is nothing to fear and nothing to re-derive. [references/anxiety-facts.md](references/anxiety-facts.md)
holds the measured latencies that prove it.

## When to run it

Any of these is a trigger:

- A refactor touching `local-time/src/core/` or `local-time/src/config/universes/`, or any
  change spanning more than two or three files.
- Creating or adding a universe — run this **alongside** the `local-time-universe` skill.
- **Processing an implementation ticket** — `process <repo>/issues/<N>`. That string is the
  **GitHub issue** `<N>` in `<repo>` (`<repo>/issues/` is not a path and does not exist), and a
  ticket is a set of **presumptions** — so the prep is to falsify them (Step 1).
- A KB edit that will flow through `local-time/scripts/sync-lore.sh`.
- Plane / 42i / embedding work.
- Any task you expect to outlive one context compaction.

A single-file, single-lookup question can skip the *content* prep. The probe should always
cost less than the re-searching it removes.

## Step 0 — load the plan (if one exists)

Before shape and probe, ask Qdrant whether this task already has a **gated plan** from a prior
iteration:

```text
qdrant-find   "<task description>"        # or filter metadata.kind = "42i-plan"
```

If one comes back, **adopt it** — its `env:` answers the probe, its `steps[].evidence` are the
block ids and PR numbers, its `next:` is your first move. Do **not** re-derive any of it. If
nothing comes back, you are the first iteration: do the steps below, then **write the plan**
("this task is opening three PRs, in `james-gibson/local-time` and `…`") so the next agent
resumes instead of relearning. Gated outcomes — a step is done only when its gate holds. Schema,
load/advance discipline, and why it kills anxiety: [references/plan-store.md](references/plan-store.md).

## Step 1 — know the task shape

Anxiety thrives on an unclassified task: *"I don't know how big this is"* **is** the fear.
Classify first — the shape sets the prep budget and the handoff.

| Shape | Looks like | Prep budget |
| --- | --- | --- |
| **research** | read-only; no writes | probe + cache the answers; edit nothing |
| **one-edit** | a single file or function | that block + its file + the one guard test |
| **multi-edit** | a handful of files, one intent | the reachable set (callers/callees) + every guard test |
| **refactor** | structural, many files, or `src/core/` | full graph, dead-code, tests, `change_review` at the end |
| **universe-create** | a new universe (KB or TS) | KB payload + registration surfaces + a sibling to copy |
| **universe-derive** | a new universe **from an existing one** | the **lever** universe's full fact set (see below) |
| **ticket** | `process <repo>/issues/<N>` — an implementation ticket | the ticket's **presumptions**, falsified (see below) |
| **plane / 42i** | embedding / plane work | the whole charge graph, not one compendium |

Say the shape out loud before you start. If you cannot classify it, you are in **research** —
and research is a legitimate answer; the failure is doing more *writes* than the shape calls
for, or fewer *reads* than it needs.

### New universes are derived — grab the lever first

A `universe-create` that starts from a blank file is the slow path. Most new universes are
**derived from ones that already exist**: PageRank spawns Google; BitKeeper spawns Git and
Mercurial; a mission spawns the film about it; a disaster spawns the report. Those existing
universes are **levers**, and the prep is to **precache the lever** — its `chunk_id`, its
keyframes, its `plane_*` payload, its id factory, and the **sibling that already derives from
it** (your template). Then the new universe is *assembly*, not research, and the agent moves
fast. The lever registry is `CommonUniverseIds`; the attach points are
`connections.natural.parentUniverses` and `connections.references[]`. Full pattern and real
worked examples: [references/universe-levers.md](references/universe-levers.md).

**Then ship a starting builder.** Universe creation repeats the same decisions every time —
which file, which import, which id factory, which barrel, which test — and agents churn
re-deciding them. So prep **pre-decides the what/where and stores a compiling skeleton**
(the scaffold) in Qdrant, keyed by universe id. The working agent loads it and starts writing
the narrative, not deciding the shape. Rule of thumb: the scaffold is a **`literal`** when it
carries authored prose, a segment `status`/`jurisdiction`/`description`, arbitrary `metadata`,
or a KB-generated body — none of which the builder validates — and a **`builder`** otherwise.
A lever no longer decides it: the builder can express a containment edge with
`addConnection({ type: 'member_of', targetUniverseId })` (#74). Both templates, plus the
store/load schema:
[references/universe-scaffold.md](references/universe-scaffold.md).

### A ticket is a presumption set — falsify it before you build

A ticket (`process <repo>/issues/<N>`) is not a fact about the codebase; it is a set of
**presumptions** — claims about how the system works — written by someone who may have been
wrong, or right about a design that has since moved. The prep is to **extract them and settle
each against the code graph** — one Synapse `read_chunk` per claim, from ids you already
cached — *before* anything depends on them. A verified presumption is a fact you hand down; an
unverified one is the defect you ship.

A **`refuted`** presumption with dependents already in the plan is a **gate, not a footnote**:
stop, record it with its evidence, and get a decision before building the thing that depends on
it. Worked example — issue #89's containment presumption fails, so its acceptance criterion
needs a core edit the ticket never mentions:
[references/presumption-ledger.md](references/presumption-ledger.md).

## Step 2 — the environment probe (the "skill-reset")

Every task depends on facts that are **not known by default** and have to be discovered: the
cwd, which repo and remote you are in, the branch, *where `node` is*, the Synapse `repo_id`,
the KB root, the index/embedding state. Discovery is the expensive, anxiety-inducing part —
so the prep is: **do the discovery once, cache the answers, hand them down.** That cache is
the bulk of what this skill exists to build.

Run the probe as one parallel batch of cheap local calls (full checklist and formulas:
[references/environment-probe.md](references/environment-probe.md)). It settles:

- **cwd** — `pwd -P`. OpenKnowledge's cwd is *sticky*; always pass `cwd` to OK tools.
- **repo + remote** — `git -C <dir> remote get-url origin`. `NO-REMOTE` is an answer, not a
  failure: it decides GitHub-issue vs markdown-`OUTSTANDING.md` for any follow-up.
- **branch / worktree** — `git -C <dir> branch --show-current`. Never `cd`; pass paths.
- **node** — `command -v node`. It is often **not on PATH** (nvm), and the pipeline needs it.
- **Synapse `repo_id`** — `synapse_manage_repos (list)`; copy the slug verbatim.
- **KB root** — the vault holding `lore/`; `sync-lore.sh` defaults it to `../../kb`.
- **index state** — `synapse_indexer_control (health)`: `embeddings_partial` decides whether
  `semantic`/`find` are usable at all.

Cache these like any other block (Qdrant memory) and put them at the top of the handoff. An
agent that starts with `cwd`, `repo_id` and `node` already answered never stops to wonder —
and *that* is the anxiety cure. See [references/environment-probe.md](references/environment-probe.md).

## The three caches

| Cache | Surface | Holds | Answers |
| --- | --- | --- | --- |
| Qdrant `kb` collection | `qdrant-kb` (`qdrant-find`); refresh via `<kb-root>/scripts/qdrant/qdrant-sync.sh` | the **42i space itself** — the named `plane` vector plus the `plane_*` payload | what compendia exist, and their charge / zero-status / presupposes / time-bounds |
| Qdrant memory | `qdrant` (`qdrant-store` / `qdrant-find`) | freeform notes: the plan, the ids, the decisions | surviving compaction; the task's own hot state |
| Synapse code graph | `synapse_*` | addressed code blocks — `chunk_id`s, edit context, call graph | reading and editing code **by id** instead of re-searching |

### Cache 1 — Qdrant `kb` (the 42i space)

Refresh first if the vault changed, then read the compendium(s) in scope. From `local-time/`,
one run does all three steps (KB → JSON → TS → Qdrant):

```sh
# `node` is often not on PATH — set NODE_BIN to the nvm node, or source nvm first
NODE_BIN="$(command -v node)" ./scripts/sync-lore.sh
```

To refresh only the Qdrant index, run the KB's own entry point:
`<kb-root>/scripts/qdrant/qdrant-sync.sh`, where `<kb-root>` is the `kb` vault (default
`../../kb` from `local-time/`).

Pull and keep these payload keys per compendium (they are the raw material of any 42i
question):

- `universe_id`, `epoch_id`, `zero_status` (`established` | `presumed` | `unestablished`)
- `keyframe_types[]`, `time_start`, `time_end`
- `plane_charge` (`+1` non-fiction / `-1` fiction), `plane_universe_id`
- `plane_presupposes[]`, `plane_inverse_of`, `plane_anchor`, `plane_key`, `plane_dim`

plus the point id and the two named vectors: `fast-<model>` (corpus similarity) and `plane`
(42i). **Do not promise a 42i *ranking* from `qdrant-find`** — see *Gotchas*.

### Cache 2 — Qdrant memory (the task's hot state)

`qdrant-store` the **plan, not the corpus**:

- the goal, and the `repo_id`(s) involved;
- the ids you collected (universe ids, epoch ids, `chunk_id`s, Qdrant point ids);
- the decision — what you will change and what you deliberately will not;
- the handoff block from [references/handoff.md](references/handoff.md).

`qdrant-find` it back after any compaction instead of reconstructing from scratch. This is
what makes "batch edits across a long task" safe.

### Cache 3 — Synapse (addressed code blocks)

1. `synapse_indexer_control` (`health`) — is the server up, and is the repo ready?
2. `synapse_manage_repos` (`list`) — copy the exact `repo_id` (verbatim, slug included).
3. `synapse_search_codebase` (`symbol` / `regex`) — collect the `chunk_id`s. Use **`regex`**
   for C++ and any large class: `symbol` misses part-split symbols (`Name__partN`) by base name
   (*Gotchas*).
   *While `embeddings_partial: true`, do not use `semantic`/`find` — they return zero rows.*
4. `synapse_get_context` (`edit`) — the pre-edit safety pack for files you will touch.
5. `synapse_explore_graph` (`callers`/`callees`, depth 2) — the reachable set.
6. `synapse_codebase_insights` (`dead_code`) — **before** deleting anything.
7. `synapse_test_quality` (`find_tests`) — the tests that guard the change.
8. **Falsify the ticket's presumptions** — one `read_chunk` each, from the ids above; the code
   graph is the pre-research engine ([references/presumption-ledger.md](references/presumption-ledger.md)).

Keep every `chunk_id`. A `chunk_id` is how you (and any subagent) read the block **whole**
later — `synapse_inspect_files` (`read_chunk`) returns `raw_source`. A search result is only
a summary; the id is the block.

## Synapse is not grep — set the expectation

This is the most common way an agent talks itself out of using Synapse. It expects grep —
exhaustive matching lines — reads a Synapse result as *"it didn't find it"*, and gives up on
a tool that actually **did** find it. Synapse returns **addressed chunks**, and you read the
whole one by id.

- A hit is a **summary**: a `chunk_id` plus, often, only a `--- Matches ---` snippet. Under
  budget pressure it degrades to a **signature** or is **omitted** entirely
  (`_synapse.budget`: `sig_only`, `omitted`; `full_source` is normally `0`).
- The full block is **one call away**: take the `chunk_id` and `read_chunk` it. Do not judge
  completeness from the summary.
- **Zero hits is a diagnostic, not a verdict.** Walk the ladder before concluding absence:
  wrong `repo_id` → not `quick_pass_ready` → `embeddings_partial` (so `semantic`/`find` return
  nothing) → offline/excluded path. Recover with **`regex`**, then `read_chunk`.
- **Never fall back to `grep`.** That is the thing this replaces. If Synapse truly cannot see
  it, the ladder above tells you why.

So: a thin or empty result is a **pointer or a diagnostic, never "not found."**

## Pass the block ids down

This is the point of the whole exercise. A handoff is not a summary — it **knows the task
shape** and states the next step **specifically and explicitly**. Hand over the ids *and the
answers you already discovered*, never the task to re-find them, and open with the shape so
the next agent inherits the plan rather than the ambiguity:

```text
42i-prep handoff
shape:       <research | one-edit | multi-edit | refactor | universe-create | universe-derive | ticket | plane>
goal:        <one line — what "done" is>

env:         cwd=<abs>   repo=<path>   remote=<owner/repo | NO-REMOTE>
             branch=<name>   node=<abs | NOT-ON-PATH>   kb_root=<abs>
             repo_id=<synapse repo_id, verbatim>   embeddings_partial=<true|false>

synapse:     chunk_id=<id>  (<symbol> @ path:line)
             chunk_id=<id>  ...
qdrant kb:   point=<id>  universe_id=<id>  epoch_id=<id>
             plane_charge=+1  zero_status=established  presupposes=[<ids>]
memory:      qdrant point=<id>  (the cached plan + decisions)
presumptions: P1=<status>  P2=<status>  (<N> refuted ⇒ gate — the ticket ledger)

constraints: <id validity / closed unions / the registration step / do-not-touch files>
next:        step 1 — read_chunk <id>        (exactly this; not a search)
             step 2 — <edit | qdrant-find | …> <id>
             step 3 — <verify> against <chunk_id>
done-when:   <the observable condition that closes the task>
```

Full protocol, per-shape variants, and the **disposable scout** pattern:
[references/handoff.md](references/handoff.md). Two rules carry most of the value:

- **The `shape:` line is mandatory.** `shape: multi-edit` tells the next agent how much to
  batch before it has to think; without it, it re-litigates scope on every step.
- **A handoff can dispatch disposable work.** If the next agent will need a fact you do not
  have yet (which remote? is the id valid? where is the guard test?), spawn a **throwaway
  scout** — a subagent whose *output is the answer*, whose own work is discarded, and whose
  findings go straight into the `env:` / `synapse:` lines above. The scout pays the discovery
  cost once so the working agent never meets it. This is the raw form of the whole idea:
  *discovery is the cache, and disposable agents are how you fill it.*

## Agent anxiety management

Name it, then do the opposite of it.

**Symptoms** — the agent:

- splits one batch into many single edits "to be safe";
- re-reads files whose `chunk_id` it already has;
- re-runs a search for a symbol it already resolved, instead of `read_chunk`;
- **misreads a thin Synapse result (or a zero-hit) as "not found" and reaches for `grep`**;
- **stalls on facts it could have probed once** — where is `node`, which repo am I in, what is
  the `repo_id` — instead of running the probe;
- **cannot say the task shape**, so it oscillates between too-small and too-large steps;
- **trusts the ticket** — starts writing against a mechanism that is named in the ticket but is
  designed, not wired, and finds out sixty files later;
- declines to spawn parallel calls because "the server might be slow";
- fronts the plan with hedges about latency it has not observed.

**Counter-measures** (the facts live in [references/anxiety-facts.md](references/anxiety-facts.md)):

- **Classify the shape.** `shape: one-edit` vs `refactor` is the difference between one
  `read_chunk` and a full graph walk. Say it before you move.
- **Probe once, up front.** A batch of cheap local calls answers the unknowns (`env:`); an
  agent that already knows `cwd`/`repo_id`/`node` has nothing to stall on.
- **Read the tool honestly.** Synapse returns addressed chunks, not grep lines. Take the
  `chunk_id`; `read_chunk` it. A thin result is a pointer.
- **Batch.** One write round-trip per file, not per field. The local services are incremental
  and idempotent — a no-op `qdrant-sync.sh` is ~4 s and never loads the model.
- **Trust the cache keys.** `index_kb.py` skips unchanged docs by hash; don't re-verify what a
  hash already guards.
- **Read by id.** `read_chunk(<chunk_id>)`, `qdrant-find(point=<id>)`. A known block is one
  cheap call, never a search.
- **Falsify the ticket's presumptions.** A ticket is a claim set, not a fact. One `read_chunk`
  per presumption settles it — and a `refuted` one is a gate, not a footnote
  ([references/presumption-ledger.md](references/presumption-ledger.md)).
- **Say the name.** "This is agent anxiety" — naming the pattern is usually enough to break
  it, because the premise (a slow server, an unknown environment) was never observed.

## Gotchas

- **The `plane` vector is write-only today.** `qdrant-find` queries the fastembed vector
  only; the `plane` vector and its payload are written on every sync and no consumer ranks
  in plane space yet (isotope#8). Corpus similarity ≠ 42i proximity — say so.
- **`plane sort` is weight-invariant.** It reads charges and the probe, never the tensor, so
  the reality-gradient orders the *corpus*, not the *planes* (kb/lore `OUTSTANDING.md`).
- **`encoder.real` currently stores the raw gradient, not the tier** — reading it literally
  gives a degenerate encoder (`|c| ≈ 1`, `phase ≈ 0`).
- **`index_kb.py`'s manifest is keyed on the collection name alone.** Running it against a
  scratch vault clobbers the production manifest's bookkeeping.
- **Synapse does not re-index on re-registration under the same `repo_id`.** Verify with a
  search; do not trust a `complete`/`idle` status during a rebuild.
- **`symbol` misses every part-split symbol — including large C++ classes.** Synapse chunks a
  big symbol into `<Name>__partN`; the base name is never stored as a queryable symbol, so
  `symbol: "<Name>"` returns `count 0` (`empty_recoverable`). For C++ there is **no
  `js:canonical:` alias** to fall back on, and a part can be named only `__partN` (base
  dropped). Look it up with **`regex "<Name>"` → `chunk_id` → `read_chunk`** — Synapse's own
  `_synapse.suggested_retry` says the same. (TS alias fix:
  `kb/public/proposals/0001-resolve-part-split-symbols.md`.)
- **A non-TS `repo_id` is often a wrapper around a vendored submodule.** `OpenTTD` roots at the
  tool repo `gibsunas/openttd`, but the source is `code/OpenTTD/` — scope every `path` with the
  prefix, and keep the **wrapper** remote distinct from the **upstream** (`OpenTTD/OpenTTD`)
  that public source URLs cite.
- **`read_files` `ranges` are `"start-end"` strings.** Pass `ranges: ["140-175"]`; an array of
  two-element arrays is rejected.
- **OpenKnowledge's cwd is sticky.** Always pass `cwd` to `exec`/`edit`/`write`; a bare
  relative path can resolve against a different project.

## References

- [references/plan-store.md](references/plan-store.md) — the **gated plan** in Qdrant memory: a
  durable, cross-iteration step list so the next agent resumes instead of relearning.
- [references/environment-probe.md](references/environment-probe.md) — the "skill-reset"
  checklist: every fact to discover up front (cwd, repo, remote, branch, node, `repo_id`, KB
  root, index state) and the exact commands that answer it.
- [references/universe-levers.md](references/universe-levers.md) — **derive, don't invent**:
  how a new universe attaches to an existing one (the lever registry, `parentUniverses`,
  `references[]`), what to precache, and the real worked examples.
- [references/universe-scaffold.md](references/universe-scaffold.md) — the **starting builder**:
  the compiling skeleton (builder- and literal-mode templates), the registration checklist, and
  how to store/load it in Qdrant so the next agent starts writing instead of deciding.
- [references/presumption-ledger.md](references/presumption-ledger.md) — **falsify the ticket**:
  extract what a ticket/plan/guide *assumes* about the codebase, settle each with one Synapse
  read, and treat a `refuted` one as a gate — worked through issue #89.
- [references/cache-matrix.md](references/cache-matrix.md) — the exact cache targets, key by
  key, per task type.
- [references/handoff.md](references/handoff.md) — the id-handoff protocol, per-shape
  templates, and the disposable scout pattern.
- [references/anxiety-facts.md](references/anxiety-facts.md) — symptoms, and the measured
  latency and tool-behaviour facts that refute them.
- The [`local-time-universe`](../local-time-universe/SKILL.md) skill — what to do *after* prep
  when the task is a new universe.
- The `zero-reference` skill (kb vault) — the KB side of the pipeline.
