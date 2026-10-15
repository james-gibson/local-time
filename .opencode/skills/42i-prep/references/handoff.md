# Handoff — know the shape, pass the ids, dispatch the discovery

A handoff is what makes a long task safe to interrupt. It does three things, in order:

1. **States the task shape** — so the next agent knows how much to batch before thinking.
2. **Passes the ids and the already-discovered answers** — so it never re-finds what you found.
3. **Names the next step explicitly** — so the first move is a known-id read, not a search.

The rule in one line:

> **Hand over the shape, the ids, and the env — never the task to re-find them.**

## The id vocabulary

| Id | Comes from | Read it with |
| --- | --- | --- |
| `chunk_id` | `synapse_search_codebase` / `synapse_get_context` | `synapse_inspect_files` (`read_chunk`) → `raw_source` |
| Qdrant point id | `qdrant-kb` / `qdrant` `qdrant-find` | `qdrant-find` (by id / filter) |
| `universe_id` | the universe, the KB doc, `plane_universe_id` | `synapse_search_codebase` (`symbol`), registry lookup |
| `epoch_id`, `zero_status` | the KB `plane:` block, the Qdrant payload | `qdrant-find` |
| keyframe id | the universe / the KB doc | `read_chunk` on the module |
| env facts | the environment probe | the handoff `env:` block (below) |

Two address spaces, never crossed: **Synapse addresses code** (`.ts`, `.py`, `.cpp`, `.h`, …)
— for a vendored submodule the `repo_id` is the **wrapper** and every `path` carries the
submodule prefix (`code/<name>/`) — and **OpenKnowledge addresses in-scope markdown**
(`.md`/`.mdx` under an OK project). Identifier note: for C++ (and any large symbol) look a
symbol up with `regex`, **not** `symbol` — see `SKILL.md` → *Gotchas*.

## Template — the standard handoff

```text
42i-prep handoff
shape:       <research | one-edit | multi-edit | refactor | universe-create | plane>
goal:        <one line — what "done" is>

env:         cwd=<abs>   repo=<path>   remote=<owner/repo | NO-REMOTE>
             branch=<name>   node=<abs | NOT-ON-PATH>   kb_root=<abs>
             repo_id=<synapse repo_id, verbatim>   embeddings_partial=<true|false>

synapse blocks (read by id; do NOT search for them):
  chunk_id=<id>   <symbol> @ <path>:<line>
  chunk_id=<id>   <symbol> @ <path>:<line>

qdrant kb (the 42i payload already fetched):
  point=<id>  universe_id=<id>  epoch_id=<id>
  zero_status=<established|presumed|unestablished>  plane_charge=<+1|-1>
  plane_presupposes=[<ids>]  time_start=<…>  time_end=<…>

memory:      qdrant point=<id>  (the plan + decisions; qdrant-find it first)

constraints: <id validity / closed unions / the registration step /
             files that MUST NOT be touched>

next:        step 1 — read_chunk <id>        (exactly this; not a search)
             step 2 — <edit | qdrant-find | …> <id>
             step 3 — <verify> against <chunk_id>
done-when:   <the observable condition that closes the task>
```

## Per-shape handoffs

The `shape:` line changes what a good handoff leads with.

| Shape | Leads with | `next` looks like |
| --- | --- | --- |
| research | the question + the blocks that answer it | `read_chunk <id>`; `qdrant-find <filter>`; **write nothing** |
| one-edit | the one block, its file, its guard test | `read_chunk <block>` → patch → run `<test>` |
| multi-edit | the reachable set + every guard test | `read_chunk` each in turn → batch per file → run tests |
| refactor | the graph, dead-code verdicts, tests | context → batch edits → `change_review` (`impact`) |
| universe-create | KB payload + registration surfaces + a sibling | author → **register** → `*-registration.test.ts` |
| plane / 42i | the whole charge graph for the set | `qdrant-find` the set → reason on `plane_*` |

## Template — resume after compaction

Write the handoff into Qdrant memory **before** the context is summarised:

```text
qdrant-store
information: "42i-prep resume — <task>"
metadata: { kind: "42i-prep", shape: "<shape>", repo_id: "<id>",
            env: { cwd: "<abs>", branch: "<name>", node: "<abs>", kb_root: "<abs>" },
            chunk_ids: ["<id>", …], qdrant_points: ["<id>", …],
            universe_ids: ["<id>", …], decision: "<one line>",
            next: "<the literal next call>" }
```

On resume, `qdrant-find` the task name **first**; treat the returned ids and `env` as
authoritative and go straight to `read_chunk` / `qdrant-find`. Do not reconstruct the plan by
search.

## Template — cross-repo

Universe work spans three repos; address each in its own space:

```text
KB (ok vault, kb/lore):     doc=<lore/foo.md>        # exec("cat lore/foo.md")
TS (local-time):            chunk_id=<id>            # src/config/universes/...
model (isotope):            chunk_id=<id>            # plane/, cmd/plane/
42i index (Qdrant kb):      point=<id>               # the plane_* payload
```

## Disposable work — the scout pattern

> **A handoff can dispatch throwaway work whose only product is an answer.**

When the next agent will need a fact you do not have yet, do not leave it as a question in
the handoff — spawn a **scout**: a subagent (`subagent` tool) charged with *discovering one
thing*, whose own task is then discarded and whose **output becomes a line in the handoff**.

Scout-worthy questions (all pure discovery, no writes):

- *Which remote does this repo have?* → fills `remote=` (and decides GitHub-issue vs markdown).
- *Is this `universeId` valid, and what does it resolve to?* → fills `universe_id=`.
- *Where is the guard test for this module?* → fills a `chunk_id` line.
- *What is the exact `repo_id` and is it `quick_pass_ready`?* → fills `env:`.
- *Does a sibling universe already do this, and at what path?* → fills a `chunk_id` line.
- *Is the `plane:` payload present for these compendia?* → fills the `qdrant kb:` block.

Rules for scouts:

1. **One question each.** A scout that discovers three things is three scouts (run them in
   parallel).
2. **Read-only.** A scout never edits; its product is a fact, not a change.
3. **Fold the answer into the handoff, then discard the scout.** Do not carry the scout's
   transcript forward — carry the `env:`/`chunk_id` line it produced.
4. **The working agent starts at `next: step 1`, with zero discovery left to do.** That is the
   success condition: the scout met the unknown so the worker never does.

This is the raw form of the whole idea: *discovery is the cache, and disposable agents are how
you fill it before the expensive agent arrives.*

## Rules

1. **Shape before prose.** State the shape; it bounds how much the next agent should batch.
2. **Ids and env before narrative.** If a fact has an id or a probed value, give that. Prose
   summaries drift; ids and `cwd`s do not.
3. **Name the next step as a call.** `next: step 1 — read_chunk <id>`, not "continue the
   work". The first move must be unambiguous.
4. **State the constraint set.** Pre-empt the known traps: `universeId` validity, the
   registration step, closed unions, files under someone else's edit.
5. **Prefer `read_chunk` to a search.** A search returns a summary and may omit hits under
   budget; `read_chunk` returns the block whole.
6. **Keep the handoff in the cache, not just the prompt.** The prompt dies at compaction; the
   Qdrant memory note does not.
7. **The durable form of this handoff is the gated plan.** Store the steps as a `42i-plan` with
   `status` + `evidence` per step (`plan-store.md`); then this handoff's `next:` is simply the
   plan's first `pending` step, and the next agent resumes instead of relearning.
