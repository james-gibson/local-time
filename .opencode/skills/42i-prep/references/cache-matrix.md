# Cache matrix — what to warm, per task

One row per task type; each cell is a concrete call. Do the whole row before the first edit.
The ids you collect here are what you hand down (see `handoff.md`).

Three things happen **before** any row below: load the **plan** (see `plan-store.md`), classify
the **shape** (see `SKILL.md` → *Step 1*), then run the **environment probe** (see
`environment-probe.md`). The probe is identical for every shape; only the content caches below
scale with it.

## The three targets

| Target | Write with | Read with | Survives compaction? |
| --- | --- | --- | --- |
| Qdrant `kb` collection | `<kb-root>/scripts/qdrant/qdrant-sync.sh` (or `local-time/scripts/sync-lore.sh` step 3) | `qdrant-kb` → `qdrant-find` (filters below) | yes (it is the index) |
| Qdrant memory | `qdrant` → `qdrant-store` | `qdrant` → `qdrant-find` | yes |
| Synapse graph | `synapse_indexer_control` / `synapse_manage_repos` | `synapse_*` (below) | yes (server-side) |

## Qdrant `kb` — the 42i payload

Per compendium, pull and keep:

| Payload key | Meaning |
| --- | --- |
| `universe_id` | the local-time id (`domain:name:year`) |
| `epoch_id` | which epoch the chunk belongs to (the zero-anchor name) |
| `zero_status` | `established` \| `presumed` \| `unestablished` — drives the 42i imaginary axis |
| `keyframe_types[]` | which temporal events the compendium records |
| `time_start` / `time_end` | earliest / latest keyframe (epoch seconds) |
| `plane_charge` | `+1` non-fiction, `-1` fiction — the sector label |
| `plane_universe_id` | the compendium the plane belongs to (plane is per-compendium) |
| `plane_presupposes[]` | direct dependency universe-ids (the charge-graph edges) |
| `plane_inverse_of` | the exact-inverse compendium, when declared |
| `plane_anchor`, `plane_key`, `plane_dim` | the anchor (default `42`), the vector name, the dimension |

Plus: the point id, and the two named vectors — `fast-<model>` (corpus) and `plane` (42i).

Useful `qdrant-kb` filters: `universe_id`, `epoch_id`, `zero_status`, `keyframe_types`,
`plane_charge`, `plane_universe_id`, `plane_presupposes`, `time_start` / `time_end`.

> The `plane` vector and payload are **written but not consumed** today (isotope#8): a
> `qdrant-find` returns corpus similarity, not 42i proximity. Cache the payload for
> reasoning; do not expect a plane-space ranking back.

## Synapse — the code side

Sequence (health → scope → addresse):

```text
synapse_indexer_control    (health)          # server up? indexing done?
synapse_manage_repos       (list)            # copy the exact repo_id, verbatim
synapse_search_codebase    (symbol|regex, repo_id, path)   # -> chunk_id[]
synapse_get_context        (edit, repo_id, path)           # pre-edit safety pack
synapse_explore_graph      (callers|callees, depth: 2)     # reachable set
synapse_codebase_insights  (dead_code)       # before any deletion
synapse_test_quality       (find_tests)      # the guard tests
```

Read a block whole with `synapse_inspect_files` (`read_chunk`, `chunk_id`) → `raw_source`.
A search hit is a **summary**; the `chunk_id` is the block.

> **Synapse is not grep.** A hit is *addressed*, not exhaustive: a summary, a signature, or
> an omission under budget (`_synapse.budget`). A thin or empty result is a pointer or a
> diagnostic, **never absence**. Read the `chunk_id`; recover with `regex`; don't fall back to
> `grep`. Full calibration: `SKILL.md` → *Synapse is not grep — set the expectation*.

## Per task type

### TypeScript refactor (any repo)

| Target | Warm |
| --- | --- |
| Synapse | `context:edit` on the files in scope; `explore_graph` on each symbol; `dead_code` if you delete; `find_tests` |
| Qdrant memory | the refactor plan + the `chunk_id` list + the "do not touch" set |
| Qdrant kb | only if the change touches universe semantics or plane fields |

Then batch: `synapse_modify_files` (`write_safely`) per file, review the preview, apply;
finish with `synapse_change_review` (`impact`).

### New universe — Path A (from the KB)

| Target | Warm |
| --- | --- |
| Qdrant kb | the compendium's full `plane_*` payload + point id (above) |
| Synapse | the `local-time-universe` registration surfaces: `allUniverses` barrel, the namespace barrel, the `*-registration.test.ts` |
| Qdrant memory | the `universe_id`, the epoch ids, the KB doc path |

### New universe — Path B (hand-authored TS)

| Target | Warm |
| --- | --- |
| Synapse | `references/builder-api.md` surface: `src/core/universe-builder.ts`, a sibling universe at the same depth, `src/config/universes/index.ts` |
| Synapse | `symbol: UniverseBuilder` / `regex` for the namespace barrel you will join |
| Qdrant memory | the chosen `universeId` + the sibling you copied |

### New universe — derived from an existing one (the lever)

Prefer this over a blank file: find the lever, cache its facts, then assemble. See
`universe-levers.md`.

| Target | Warm |
| --- | --- |
| The lever universe | `chunk_id` (→ `read_chunk`): its `universeId`, `identifiers`, `epochs`/zero, `keyframes[]`, and its `connections` block |
| `CommonUniverseIds` | `src/core/common-universe-ids.ts` — the lever id you attach to (`SILICON_VALLEY`, `VERSION_CONTROL`, `NASA_OPERATIONS`, …) |
| A twin | the **sibling that already derives from this lever** — copy its `connections.natural.parentUniverses` / `references[]` and change the keys |
| Qdrant kb | the lever's `plane_*` payload (charge, `plane_presupposes`, `zero_status`) so the child's derivation is consistent |
| Qdrant memory | the lever id, the child id, the keyframe(s) the child will reference (`targetUniverseId` / `targetKeyframeId`) |

### Plane / 42i / embedding work

| Target | Warm |
| --- | --- |
| Qdrant kb | every compendium's `plane_charge`, `zero_status`, `plane_presupposes`, `plane_inverse_of` — the whole graph, not one doc |
| Qdrant memory | the set of universe-ids in scope + the question ("which sector do these span?") |
| Synapse | `kb/scripts/qdrant/index_kb.py` (`apply_contract_weights`), and `isotope/plane/*` if you touch the model |

### KB-only edit (kb vault)

| Target | Warm |
| --- | --- |
| OpenKnowledge | the doc via `exec("cat <name>.md")`; the folder via `exec("ls -A <dir>")` |
| Qdrant kb | re-sync after the edit (`qdrant-sync.sh`) so the index matches |
| Qdrant memory | the doc path + what you changed |

## Refresh rules

- Refresh Qdrant **only** when the vault changed — the sync is incremental and skips
  unchanged docs by hash.
- Re-run Synapse indexing only for a new/changed repo root — **never** trust a re-register
  under the same `repo_id` to refresh (verify with a search).
- If `embeddings_partial: true`, stay on `symbol`/`regex`/`read_chunk`; skip `semantic`/`find`.
