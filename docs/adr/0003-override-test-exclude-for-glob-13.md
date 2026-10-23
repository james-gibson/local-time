# ADR 0003 — Pin `test-exclude` 8 so istanbul's coverage path gets `glob` 13

- **Status:** Accepted
- **Date:** 2026-10-23
- **Related:** [#189][189], ADR [0002](0002-pin-js-yaml-4-under-istanbul.md) (the
  same override technique, for `js-yaml`)

## Context

Every `npm ci` printed:

```
npm warn deprecated glob@10.5.0: Old versions of glob are not supported, and contain widely
publicized security vulnerabilities, which have been fixed in the current version.
```

`glob@10.5.0` was in the tree at exactly one path:

```
glob@10.5.0
└── test-exclude@7.0.2          (declared by babel-plugin-istanbul@8.0.2)
    └── babel-plugin-istanbul@8.0.2
        └── @jest/transform     (jest@30.5.2 / ts-jest@29.4.15)
```

`npm audit` is quiet about it — there is no advisory, only the deprecation — so
neither Dependabot nor `npm audit` would ever have opened the bump. This is the
same shape as #166: an EOL marker that no queue tracks.

Two fixes were available, and the choice between them is the decision:

1. **Override `glob` to `^13`.** `glob@13` still exports a synchronous `sync`
   (measured: `glob.sync` is a function, as it was on 10), so `test-exclude@7`'s
   call site would not throw. But that call site was written against `glob@10`
   and passes options in 10's dialect (`posix: true` among them). Keeping a
   caller on a leaf major it was never written for buys a warning-free install
   by guessing that no option changed meaning.
2. **Override `test-exclude` to `^8`.** The one package that owns the `glob`
   call moves to the version written for `glob@13`, and `glob` 13 arrives
   because `test-exclude@8` declares it (`^13.0.6`), not because this repo
   forced it.

Chosen: **(2)**. It fixes the declaration instead of the leaf, so there is no
version skew between caller and callee to reason about.

Three facts made it safe enough to do in one line:

- **The API is unchanged.** `test-exclude@8.0.0` exposes the same instance
  methods as `7.0.2` — `handleNegation`, `shouldInstrument`, `globSync`, `glob`
  (measured on both). It is still CommonJS, so `babel-plugin-istanbul`'s
  `require` keeps working; it is not an ESM-only major.
- **It fits the repo's engine range.** `test-exclude@8` declares
  `node: 20 || >=22`, inside the `^20.19.0 || ^22.13.0 || >=24` the repo now
  declares (#166).
- **Its one consumer accepts the range.** `babel-plugin-istanbul@8.0.2` declares
  `test-exclude: ^7.0.1`, so this is a **standing override of a declared
  range** — the same category of lie as the `js-yaml` one in ADR 0002. It is
  recorded here for that reason.

## Consequences

- `glob` resolves to a single `13.0.6` across the whole tree — the same version
  `@jest/core` already used — and `npm ci` no longer prints the deprecation.
- Coverage instrumentation is the only code that runs through this path, so it
  is the thing that has to be proven, not assumed: `npm run test:coverage`
  reports real per-file percentages and the same 829 passed / 14 skipped, and a
  direct probe of the overridden package (`shouldInstrument` on a source file
  vs a `node_modules` path, `globSync` returning the same 232 files lint sees)
  behaves identically to `7.0.2`.
- **Remove the override** when `babel-plugin-istanbul` ships a release that
  declares `test-exclude: ^8` — check with
  `npm view babel-plugin-istanbul dependencies.test-exclude`. Until then, npm
  will not warn about the skew, which is exactly why this is written down.

[189]: https://github.com/james-gibson/local-time/issues/189
