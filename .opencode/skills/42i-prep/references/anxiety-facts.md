# Agent anxiety — symptoms, and the facts that refute them

**Agent anxiety** is the failure mode where an agent anticipates that a *local* service will
be slow and changes its behaviour to avoid a latency it has not observed. It is not caution
about correctness; it is caution about the wrong thing. The tell is that the agent gets
**less effective** (more calls, smaller batches, redundant reads) precisely to avoid a cost
that is not there.

The name is the first tool: naming it usually breaks it, because the premise was never
measured.

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

## The counter-scripts

When you feel the pull to slow down, do the opposite of the symptom:

- **Classify the shape.** "One edit" and "refactor" are different tasks; naming the shape
  tells you how much to read before you write, and stops the oscillation.
- **Probe once.** Run the environment probe up front; cache `cwd`/`repo_id`/`node`. An agent
  that already knows these never stalls to find them.
- **Batch.** One `write_safely` per file, reviewed, applied. Not one per field.
- **Read by id.** `read_chunk(<chunk_id>)`, `qdrant-find(point=<id>)`. If you have the id, a
  search is a regression.
- **Read the tool honestly.** Synapse returns *addressed chunks*, not grep lines. A thin
  result is a pointer; take the `chunk_id`. Never fall back to `grep`.
- **Trust the hash.** `index_kb.py` will not re-embed unchanged docs. Don't pre-verify what
  the manifest already guards.
- **Parallelise independent calls.** Probe + repo list + a symbol search do not depend on each
  other; issue them together.
- **Say it.** "This is agent anxiety." Then make the call you were avoiding — it will come
  back in milliseconds or seconds, not minutes.

## Why this is in a *prep* skill

The preparation is the structural cure. An agent stalls when it might have to *search* for
something mid-task, or *discover* a fact it needs, and does not know the cost. Once the task
shape is stated, the environment is probed, and the blocks are cached and addressed, the
unknown is gone: every next step is a known-id read on known ground, and there is nothing
left to be anxious about. Do the prep, and the anxiety has no object.
