# The plan store — a gated, durable plan in Qdrant memory

Prep should not start from a blank page. Most tasks are the *next iteration* of something
already begun: three PRs to open, four files to edit, one migration across repos. If that plan
lives only in the prompt, it dies at compaction and the next agent relearns it from scratch —
the single most wasteful thing an agent does.

Put the plan in **Qdrant memory** as an ordered list of **gated steps**, and every agent that
follows loads it instead of re-deriving it.

> Load the plan first. Create it if absent. Advance it as you go. It is the cheapest thing in
> this skill to maintain, and the one that most often saves a whole iteration.

## What a plan is

A short list of **steps**, each with a **gate** — the observable condition that says the step
is done. *Gated outcomes*, not vibes: a step is not done because it felt done, but because its
gate holds (a PR number exists, a test passes, a file reads back). The plan also carries the
`shape`, the `env` probe, and the `next` move — so loading it answers most of the prep.

```text
kind:        42i-plan
name:        skill-prs-2026-10-14
goal:        get both agent skills and the KB change into reviewable PRs
shape:       multi-edit

steps:
  - n: 1
    do:       open a PR for the local-time-universe skill in james-gibson/local-time
    gate:     PR open, base=main, purely additive (3 new files)
    status:   done                        # pending | in-progress | done | blocked
    evidence: https://github.com/james-gibson/local-time/pull/104    # ceabaae
  - n: 2
    do:       open a PR for the 42i-prep skill in james-gibson/local-time
    gate:     PR open, base=main, purely additive (6 new files)
    status:   done
    evidence: https://github.com/james-gibson/local-time/pull/105    # f505035
  - n: 3
    do:       open a PR for the kb zero-reference + OUTSTANDING changes
    gate:     PR open in <owner/repo>, only the skill + ledger files committed
    status:   blocked
    blocked_by:    kb/lore has NO remote; 53 in-flight files belong to the user
    unblocks_when: a remote exists for the kb vault

env:         cwd=…  repo=…  remote=…  branch=…  node=…  repo_id=…  kb_root=…
next:        step 3 — blocked; ask the user for a remote before touching kb/lore
done-when:   all three PRs are open (or step 3 explicitly waived)
```

This is exactly the shape of "this task is opening three PRs and they shall be in repos…". The
repos, the branches, the PR numbers, and the one blocked step all survive the session.

## Load it (the first thing in prep)

Before the shape, before the probe — ask Qdrant whether this task already has a plan:

```text
qdrant-find   "<task description>"                 # or filter metadata.kind = "42i-plan"
```

If a plan comes back, **adopt it**: its `env:` answers the environment questions, its
`steps[].evidence` are the block ids and PR numbers, and its `next:` is your first move. Do
**not** re-derive any of it. If nothing comes back, you are the first iteration — classify the
shape, run the probe, and **write the plan** before you start step 1.

## Advance it

After each step, update the one field that changed (`status`, `evidence`) and re-store. That is
the whole discipline: a two-line `qdrant-store`, and the next agent starts at `step n+1` with
every prior gate already verified. When a step blocks, record `blocked_by` / `unblocks_when`
rather than silently dropping it — a blocked step that is *written down* is not forgotten.

## Why this kills anxiety

In-flight work is the biggest unknown an agent faces: *what was already tried, what is already
open, what is blocked.* A gated plan in Qdrant turns all of it from a question into a record.
The agent does not relearn; it resumes. And because every step carries a gate, "done" is never
a matter of opinion — which is precisely the thing agents get anxious about.

## Relationship to the handoff

The plan and the handoff are the same object at two moments:

- **Plan** — the durable, cross-iteration list of gated steps (lives in Qdrant).
- **Handoff** — the plan, plus the ids and the `env`, at the instant you stop.

So a handoff's `next: step 1 — …` *is* the plan's first `pending` step. Write one, get both. If
you keep the plan current, the handoff is almost free — and vice versa.
