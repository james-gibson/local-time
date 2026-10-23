# ADR 0002 — Pin `js-yaml` 4 under istanbul's config loader

- **Status:** Accepted
- **Date:** 2026-10-19
- **Related:** [#145 (dependabot/57)][145], [GHSA-hp3w-g68c-fv3c][ghsa]

## Context

Dependabot alert 57 reported `sprintf-js` (`<= 1.1.3`, no patched version) on the
default branch. The advisory is a denial of service through unbounded precision
specifiers, and `sprintf-js`'s last release was 2023-09-11.

The alert queue is not the dependency state: it is bounded by the `^` ranges in
`package.json` and never opens a major bump. Enumerating the tree instead
(`npm audit --package-lock-only` at `main`) found **35 advisories — 29 high, 6
moderate** — because `jest@29.7.0` was pinned inside its own major while the
`braces` / `micromatch` / `expect` families moved on.

`sprintf-js` turned out to be the residue, not the headline. Its path in the tree
was:

```
sprintf-js@1.0.3
└── argparse@1.0.10
    └── js-yaml@3.15.2          (declared by @istanbuljs/load-nyc-config@1.1.0)
        └── @istanbuljs/load-nyc-config@1.1.0
            └── babel-plugin-istanbul@8.0.2
                └── @jest/transform / babel-jest   (jest@30.5.2)
```

Two measured facts decided the fix:

1. **The vulnerable code is unreachable from library use.** `js-yaml`'s `lib/`
   never requires `argparse`; only `bin/js-yaml.js` does, and nothing in this repo
   (or in jest's coverage path) executes that binary. The advisory is therefore
   dev-only and not exploitable here — but `npm audit` scores the installed tree,
   not the call graph, so leaving it in place cannot satisfy the issue's
   definition of done.
2. **The one call site is version-agnostic.** `@istanbuljs/load-nyc-config@1.1.0`
   reads a YAML nycrc with `require('js-yaml').load(...)`. `.load` exists in
   js-yaml 3 *and* 4, and is safe-by-default in both, so the dependency can move
   a major without touching code.

`@istanbuljs/load-nyc-config` has had no release since 2020 and still declares
`js-yaml: ^3.13.1`; `babel-plugin-istanbul` still depends on it. There is no
upstream version to upgrade to, and no patched `sprintf-js` to move to.

## Decision

Upgrade `jest` 29 → 30 (with `@types/jest` 30 and `ts-jest` 29.4.15, whose peer
range already admits jest 30), let `npm audit fix` take `ajv` to 6.14.0, and
remove the remaining chain with a scoped override in `package.json`:

```json
"overrides": {
  "@istanbuljs/load-nyc-config": {
    "js-yaml": "^4.3.2"
  }
}
```

The override is scoped to the one package that declares `js-yaml` 3; js-yaml 4
then dedupes with the copies eslint already resolves, `argparse` resolves to
2.0.1, and `sprintf-js` leaves the tree.

## Consequences

- `npm audit --package-lock-only` reports **0 vulnerabilities**, and
  `gh api repos/james-gibson/local-time/dependabot/alerts?state=open` returns
  `[]`. No alert needs dismissing.
- `js-yaml` resolves to a single 4.3.2 across the tree. The `.nycrc.yml` branch
  was exercised directly (not inferred) — a YAML nycrc parses through
  `loadNycConfig` under 4.3.2 — and `npm run test:coverage` still instruments.
- The override overrides a declared range, so it is a standing lie in the
  dependency graph: if a future `load-nyc-config` release keeps the `^3` range and
  starts using a 3-only API (`safeLoad`, `dump` options), npm will not warn, and
  coverage configuration loading would break at runtime rather than at install.
  That is acceptable because the surface is one `.load` call and the tree is
  dev-only, but it is the reason this decision is written down.
- **Remove the override** when `@istanbuljs/load-nyc-config` ships a release that
  declares `js-yaml: ^4`, or when `babel-plugin-istanbul` drops it. Check with
  `npm view @istanbuljs/load-nyc-config dependencies.js-yaml`.
- `eslint@8.57.1` remains deprecated and out of support; it is not implicated in
  any open advisory once `ajv` is at 6.14.0, and moving to the flat config is a
  separate change. *(Since this ADR was written, #166 moved the tree to ESLint 10
  and `eslint.config.js`; the observation above is the state at the time.)*

[145]: https://github.com/james-gibson/local-time/issues/145
[ghsa]: https://github.com/advisories/GHSA-hp3w-g68c-fv3c
