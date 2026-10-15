# The environment probe — the "skill-reset"

Every task depends on facts that are **not known by default**. The agent discovers them
mid-flight, one at a time, each discovery a small stall — and the stalls *are* the anxiety.
This reference is the fix: enumerate the facts once, answer them with cheap local calls, and
cache the answers so no step ever has to stop and wonder.

**Discovery is the cache.** The probe is not overhead; it is the bulk of the prep. Run it at
session (re)entry, after any reset, and before the first write.

## The facts, and the calls that settle them

| Fact | Ask | Command | Answers look like |
| --- | --- | --- | --- |
| **cwd** | where am I? | `pwd -P` | an absolute path |
| **repo root** | what's the git toplevel? | `git -C <dir> rev-parse --show-toplevel` | an absolute path, or "not-a-repo" |
| **code root** | is the code a vendored submodule? | `git -C <dir> submodule status`; `ls <repo>/code` | a submodule path (e.g. `code/OpenTTD/`) — the Synapse `path` prefix |
| **remote** | is there a GitHub? | `git -C <dir> remote get-url origin` | `owner/repo`, or `NO-REMOTE` |
| **branch / worktree** | what am I on? | `git -C <dir> branch --show-current` | a branch name (or empty = detached) |
| **node** | is the pipeline runnable? | `command -v node` | a path, or **empty (nvm not sourced)** |
| **home / user** | path authority | `whoami; echo "$HOME"` | the real values to resolve paths against |
| **Synapse `repo_id`** | what does the graph call this? | `synapse_manage_repos` (`list`) | a slug, **verbatim** |
| **index state** | can I search? | `synapse_indexer_control` (`health`) | `quick_pass_ready`, `embeddings_partial`, `is_provisional` |
| **KB root** | where is the vault? | the dir holding `lore/` (default `../../kb`) | an absolute path |
| **Qdrant creds** | can I sync/query? | `QDRANT_URL` / `QDRANT_API_KEY`, else `~/.config/opencode/opencode.json` | present / absent (exit 78 = absent) |
| **OK project?** | how do I edit `.md`? | `ls -d .ok` at the vault root | `.ok/` present → OK tools; absent → native |

## The probe, as one batch

Independent calls — issue them together, not one by one. Nothing here is a network round
trip; the whole batch is milliseconds of local work.

```sh
# one shell call, parallel-friendly: resolve paths in the SAME call you use them
pwd -P; whoami; echo "$HOME"
for d in . local-time kb ../kb; do
  printf '%s: ' "$d"
  git -C "$d" rev-parse --show-toplevel 2>/dev/null || printf 'not-a-repo '
  git -C "$d" remote get-url origin 2>/dev/null || printf 'NO-REMOTE\n'
done
command -v node || echo 'node NOT-ON-PATH'
```

```text
# in the same turn, alongside the shell batch:
synapse_manage_repos      (list)     # repo_id verbatim
synapse_indexer_control   (health)   # quick_pass_ready / embeddings_partial
```

**Path hazard (verified in this workspace).** Absolute-path resolution is non-deterministic;
**never generate a path from memory.** Resolve it from an authoritative source *in the same
tool call*: `pwd -P`, `git -C … rev-parse --show-toplevel`, `whoami`/`$HOME`. A path that
worked can silently stop working; a path that fails is not proof the target is absent. After
a write, verify by reading the target back from the cwd you just wrote to.

**OK cwd hazard.** OpenKnowledge's cwd is *sticky* and session-dependent. Always pass `cwd`
to every `exec` / `edit` / `write`; a bare relative path can resolve against a different
project and write to the wrong file.

## Probe depth by task shape

The environment probe is **always** run. The *content* caches scale with the shape
(see `cache-matrix.md`):

| Shape | Environment probe | Content caches |
| --- | --- | --- |
| research | full | the specific blocks the question needs |
| one-edit | full | that block + file + guard test |
| multi-edit | full | reachable set + all guard tests |
| refactor | full | full graph + dead-code + tests |
| universe-create | full **+ OK vault root + registration files** | KB payload + registration surfaces |
| plane / 42i | full **+ Qdrant creds + KB root** | the whole charge graph |

## Cache the probe

Two consumers, two writes:

1. **Qdrant memory** — so it survives compaction:

   ```text
   qdrant-store
   information: "42i-prep env — <task>"
   metadata: { kind: "42i-prep-env", cwd: "<abs>", repo: "<abs>",
               remote: "<owner/repo|NO-REMOTE>", branch: "<name>",
               node: "<abs|NOT-ON-PATH>", kb_root: "<abs>",
               repo_id: "<slug>", embeddings_partial: <bool> }
   ```

2. **The handoff `env:` block** — so the *next* agent starts with the answers (see
   `handoff.md`). This is the whole point: the next agent must never re-derive `cwd`,
   `repo_id` or `node`.

## Why this is "resetting the skill"

A skill that runs without a probe starts from assumptions — and an assumption that turns out
false mid-task is exactly what makes an agent stop, re-plan, and hedge. The probe resets the
skill to **known ground**: every fact it will need is either in hand or in the cache. When
the ground is known, there is nothing to be anxious about.
