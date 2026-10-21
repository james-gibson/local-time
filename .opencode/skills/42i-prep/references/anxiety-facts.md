# Agent anxiety — symptoms, and the facts that refute them

**Agent anxiety** is the failure mode where an agent anticipates that a *local* service will
be slow and changes its behaviour to avoid a latency it has not observed. It is not caution
about correctness; it is caution about the wrong thing. The tell is that the agent gets
**less effective** (more calls, smaller batches, redundant reads) precisely to avoid a cost
that is not there.

The name is the first tool: naming it usually breaks it, because the premise was never
measured.

**Its sibling** is *grinding a filtered view one item at a time*: treating a queue someone else
built — Dependabot PRs, a bot's issue list, the first page of results — as if it were the whole
set, and paying per item for a set that one query enumerates. Same root error: acting on an
unmeasured premise (here, "this queue is the work") instead of the source of truth.

## Symptoms

- Splitting one batch of edits into many single edits "to be safe".
- Re-reading a file whose `chunk_id` it already holds.
- Re-running a search for a symbol it already resolved, instead of `read_chunk`.
- **Reading a Synapse summary as incomplete — "it didn't find it" — and reaching for `grep`.**
- **Treating a zero-hit as proof of absence** instead of walking the diagnostic ladder.
- **Stalling on facts it could probe once** — where is `node`, which repo am I in, what is the
  `repo_id` — instead of running the environment probe.
- **Being unable to state the task shape**, so it oscillates between tiny and huge steps.
- Refusing to issue parallel tool calls because "the server might be slow".
- Hedging the plan ("this may take a while", "the index may be rebuilding") without evidence.
- Serialising `write_safely` calls for the same file.
- Avoiding a refresh that is incremental and cheap, then working from stale data.
- **Grinding a set one item at a time** — 32 PRs merged serially, re-waiting on CI after each —
  when a single query (`npm audit`, the Dependabot alerts API, a registry lookup, one
  `synapse_search_codebase`) enumerates the whole set at once.
- **Reading a filtered queue as the whole set.** "No open Dependabot PRs" is not "no outdated
  deps": the bot's queue is bounded by the `^` ranges in `package.json` and **structurally
  cannot** show the major-version work. The queue is a *view*; the audit is the *state*.
- **Fixing N findings that share one root cause**, one at a time, instead of making the single
  move that resolves all N (bisect, don't grind).
- **Trusting the ticket** — implementing a mechanism it names without checking that the mechanism
  exists, is public, and will accept the new value.

## The facts

Each symptom has a measured refutation. None of these services is a network round trip; they
are local, and the expensive parts are cached or skipped.

| Claim the anxiety makes | The fact |
| --- | --- |
| "A Qdrant refresh will be slow." | `qdrant-sync.sh` is **incremental and idempotent**: unchanged docs are skipped, a no-op run costs **~4 s** (uv + client startup) and **never loads the embedding model**. Overlapping runs are harmless. |
| "I'll trigger a re-embed." | `index_kb.py` skips unchanged docs by manifest + `plane_hash` / `body_hash`. The model runs **only** where the contract or the body actually changed. |
| "Synapse reads are expensive." | Synapse is a **local graph server**. `symbol`, `regex`, `read_chunk`, `explore_graph` are cheap. Only the embedding-backed `semantic` / `find` are expensive — and they are **off** while `embeddings_partial: true`, so use symbol/regex anyway. |
| "Synapse didn't find it." | Synapse returns **addressed chunks, not grep lines**. A hit is a summary (`chunk_id` + snippet); under budget it degrades to a signature or is omitted (`_synapse.budget`: `sig_only`, `omitted`). A thin or empty result is a **pointer or a diagnostic, not absence** — take the `chunk_id` → `read_chunk`; recover with `regex`; never fall back to `grep`. |
| "I don't know where `node` is / which repo I'm in." | These are **discoverable once**: `command -v node`, `git -C <dir> remote get-url origin`, `synapse_manage_repos (list)`. Probe them up front and cache them in the handoff `env:` block — then no step ever stops to wonder. Discovery *is* the cache. |
| "Reading a block will be slow." | `read_chunk` is one addressed call. A *search* is the slow, lossy option, and it may elide hits under budget. Reading by id is the fast path. |
| "OpenKnowledge is a server, it'll lag." | OK `exec` read-only (`cat`, `ls`, `grep`) is cheap; watched docs bypass the round trip. |
| "I should not add more calls." | Prepping removes calls: one `read_chunk` replaces a search that returns a summary; one batched edit replaces three serialised ones. |
| "The ticket says it works this way." | A ticket is a **claim set**, not a fact. Worked case: `common-universe-ids.ts` builds its containment registry in a **`private static`** block of 9 hard-coded roots and never reads universe objects — so a ticket that says "resolve containment with `getAllDescendants()`" (local-time#89, AC#2) **cannot be satisfied** by declaring `parentUniverses`; it needs a core edit. One `read_chunk` settles it. A `refuted` presumption is a **gate**, not a footnote. |
| "I'll work the queue one item at a time." | The queue is a **view produced by a bot's own policy** — not the set. `npm audit --package-lock-only` and `GET /repos/{owner}/{repo}/dependabot/alerts?state=open` return the **entire** outstanding set in **one call**. Enumerate first, then decide: 32 serial PR merges (~90 min of CI waits) collapsed to one audit call. |
| "The queue is empty, so we're done." | An empty Dependabot queue **≠** a clean repo. Dependabot PRs are bounded by the `^` ranges in `package.json`, so a **major** bump is never opened. Post-drain state: **49 vulnerabilities (2 low, 9 moderate, 38 high)**. Ask the source of truth — the audit, not the queue. |
| "Each finding needs its own fix." | When N findings share one root cause they are **one** change. 38 of those 49 highs were the single **jest 29 → 30** tree (`jest*`, `babel-jest`, `expect`, `@jest/*`, `braces`, `micromatch`, `js-yaml`, `sprintf-js`, `argparse`, `@istanbuljs/*`). One deliberate major upgrade + a bisect of the failing tests beats N per-package merges. |

## The counter-scripts

When you feel the pull to slow down, do the opposite of the symptom:

- **Classify the shape.** "One edit" and "refactor" are different tasks; naming the shape
  tells you how much to read before you write, and stops the oscillation.
- **Load the plan.** If a `42i-plan` exists for this task, its steps, env, and next move are
  already written down — resume instead of relearning.
- **Probe once.** Run the environment probe up front; cache `cwd`/`repo_id`/`node`. An agent
  that already knows these never stalls to find them.
- **Batch.** One `write_safely` per file, reviewed, applied. Not one per field.
- **Read by id.** `read_chunk(<chunk_id>)`, `qdrant-find(point=<id>)`. If you have the id, a
  search is a regression.
- **Read the tool honestly.** Synapse returns *addressed chunks*, not grep lines. A thin
  result is a pointer; take the `chunk_id`. Never fall back to `grep`.
- **Trust the hash.** `index_kb.py` will not re-embed unchanged docs. Don't pre-verify what
  the manifest already guards.
- **Falsify the ticket.** A ticket is a claim set. Extract its presumptions and settle each with
  one `read_chunk` — the code graph is cheap pre-research. A `refuted` one stops the step that
  depends on it.
- **Parallelise independent calls.** Probe + repo list + a symbol search do not depend on each
  other; issue them together.
- **Enumerate before you iterate.** For any "process all N of X", find the single call that lists
  the *whole* set — `npm audit --package-lock-only`, `GET /repos/{owner}/{repo}/dependabot/alerts?state=open`,
  a registry query, one `synapse_search_codebase`. A per-item queue is a view through someone
  else's filter (semver `^`, a budget, "what the bot chose to open"), and it hides exactly the
  work that exceeds the filter. 32 serial PR merges (~90 min of CI waits) became one audit call.
- **Distrust an empty queue.** Absence from a queue is absence *from that queue*. Post-drain the
  Dependabot queue was empty and the repo still had **49 vulnerabilities (38 high)**. Check the
  underlying state, not the bot's view.
- **Collapse to the root cause; bisect, don't grind.** When many items fail or move together they
  are one change: 38 of those 49 highs were the single **jest 29 → 30** tree. Stop itemising —
  find the shared cause and make one deliberate move.
- **Say it.** "This is agent anxiety." Then make the call you were avoiding — it will come
  back in milliseconds or seconds, not minutes.

## Why this is in a *prep* skill

The preparation is the structural cure. An agent stalls when it might have to *search* for
something mid-task, or *discover* a fact it needs, and does not know the cost. Once the task
shape is stated, the environment is probed, and the blocks are cached and addressed, the
unknown is gone: every next step is a known-id read on known ground, and there is nothing
left to be anxious about. Do the prep, and the anxiety has no object.
