---
name: local-time-verify
description: Use before claiming a change to local-time is done, and whenever a local check and CI disagree — running the typecheck/test/lint gates, working in a git worktree or with a symlinked node_modules, interpreting a jest failure whose diff contains BigInt, or deciding whether "the file I touched passes" is enough. Covers what a green local run does and does not prove.
---

# Proving a local-time change

A local-time change is done when the gates pass **on the change**, not when the
one file you edited looks right. This skill is the list of gates, and the traps
that make a local run lie about them.

## The gates, in order

```sh
# node is often NOT on PATH (nvm); `nvm use` reads the repo's .nvmrc
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use

npm run typecheck            # tsc --noEmit && tsc -p tsconfig.test.json
npm run lint                 # eslint src (flat config: eslint.config.js)
npx jest                     # the FULL suite — see below
npm run test:scripts         # node --test scripts/__tests__/*.test.js
```

Then CI, which is authoritative:

```sh
gh pr checks <pr> --watch
```

`.github/workflows/ci.yml` runs exactly `lint`, `typecheck`, `build`, `test` and
`test:scripts` on Node 26, the same major `.nvmrc` pins. **If CI and your laptop
disagree, CI is right** — read the next section before you file anything.

## Trap 1 — a symlinked `node_modules` makes lint lie about *another* checkout

Measured, 2026-10 (james-gibson/local-time#144, filed and retracted):

A git worktree was set up with `ln -s ../local-time/node_modules node_modules`.
`npm run lint` then reported five `no-var-requires` errors in `src/index.ts` and a
test file — while CI, running the same command, was green.

The cause: the symlink resolved plugins from the **older** checkout, which had
`@typescript-eslint` **v6**. At the time `main`'s `.eslintrc.cjs` scoped its
override to the **v8** rule name (that file is now `eslint.config.js`, #166, but
the rule name it scopes is the same):

```js
{ files: ['src/index.ts', '…id-factory-consolidation.test.ts'],
  rules: { '@typescript-eslint/no-require-imports': 'off' } }   // v8 name
```

On v6 the same rule is still called `no-var-requires`, so the override quietly
did not apply. Nothing about the code was wrong.

**Rules of thumb**

- A worktree must have its **own** install (`npm ci`), or you must not trust
  `lint`. `tsc` and `jest` were unaffected here, but do not assume that generally.
- To diagnose a version mismatch:
  `npx eslint --print-config src/index.ts | grep -A3 no-require-imports`, and
  `node -p "require('@typescript-eslint/eslint-plugin/package.json').version"`.
- **Before filing a tooling issue, reproduce it against a clean install or CI.**
  A check that fails on your machine and passes in CI is a fact about your machine.

## Trap 2 — "the suite for the file I touched passes" is not a result

`allUniverses` is one import graph, and several modules **build at module scope and
throw** on invalid data (the #45 trade-off documented in the hub skill). A throw
during `import` takes the whole barrel down, so an unrelated suite fails, and a
suite that *does* pass tells you nothing about the barrel.

Always run the full `npx jest`. There is no `--onlyChanged` shortcut that is safe
here.

## Trap 3 — a jest failure whose diff contains `BigInt`

```text
TypeError: Do not know how to serialize a BigInt
    at messageParent (jest-worker/build/workers/messageParent.js:29:19)
```

This is not a source error — it is jest-worker failing to serialise the **diff of a
failed assertion** that contains a `bigint`. The failing test is real; the message
is just unreadable. Re-run that file in-band to see it:

```sh
npx jest src/config/universes/historical/pagerank-history.test.ts --runInBand
```

Timestamps in this repo are `bigint`, so this will happen the first time a segment
or keyframe assertion fails.

## Trap 4 — membership is not registration

Being in `allUniverses` is a **spread**, not a lookup. `loadBuiltInUniverses`
wraps each registration in `try/catch`, warns and skips invalid entries, so a
universe can be in the array and absent from every query (#27, #67, #98).

Prove the lookup, not the array:

```ts
const registry = new UniverseRegistry(new ConfigLoader());
expect(() => registry.registerUniverse(id, u)).not.toThrow();
expect(registry.getUniverse(id)).toBeDefined();
```

(The constructor loads nothing until `initialize()`; `registerUniverse` on a fresh
registry is the direct check.)

## Trap 5 — the second tsconfig

`tsc --noEmit` does **not** cover the test files. `npm run typecheck` runs both
configs; running only the first will let a broken test file through. `npm run
build` is a separate gate again (it builds `dist/`).

## Turn every claim into an assertion

The defects that survive review are the ones that were *written* as prose and never
*measured*. Each of these was a sentence in a ticket or comment, and each is one
line of test:

| Claim | Assertion |
| --- | --- |
| "this is a film id" | `isFilmUniverseId(id) === true` — not `isValidUniverseId` |
| "the acts cover the runtime" | `end === next.start` for every pair |
| "the keyframe is at 61m30s" | `timestamp === 3690n * 1_000_000_000n` |
| "every epoch has an id" | no epoch with an empty `epochId` |
| "the anchor exists" | the id is in `allUniverses` |
| "the universe is retrievable" | `registry.getUniverse(id)` is defined |

If a claim cannot be asserted, say so in the file and mark it deferred — do not
leave it reading like a verified fact.

## Working in a worktree (the setup that avoids all of this)

```sh
git worktree add ../local-time-wt/<name> -b <branch> origin/main
cd ../local-time-wt/<name>
npm ci                     # NOT a symlink
```

Base off `origin/main`, not off whatever branch the main checkout happens to be
on. A primary checkout often carries someone's uncommitted work; leave it alone and
do not commit it by accident (`git add <paths>`, never `git commit -a`).

## Synapse scoping

`local-time` is not a registered Synapse repo. Its code is indexed under
`repo_id: "personal"` (the workspace root), so every search needs
`path: "local-time/src/…"` or you will get hits from sibling projects.

## What green does not prove

- that a *later* reader will understand why — that is the file's comment's job;
- that the id is the one another universe already uses — prove resolvability;
- that the data is *real* — a fabricated work passes every gate in this file
  (see the `local-time-films` skill, Gate 0);
- anything about a branch you did not push — CI runs on the PR, not on your disk.
