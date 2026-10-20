# ADR 0002 — Politics is a namespace family, not one folder

- **Status:** Accepted
- **Date:** 2026-10-20
- **Related:** [#126](https://github.com/james-gibson/local-time/issues/126),
  [#102](https://github.com/james-gibson/local-time/issues/102),
  [#112](https://github.com/james-gibson/local-time/issues/112) §11.5

## Context

`src/config/universes/global-politics/` held four sourced modules and no barrel.
Nothing imported the directory, so the modules were never evaluated — and three
of them threw on import (`history:gaza:2023_2025`, `history:ukraine:1991_2014`,
`history:us_gov:aumf_2001_usage:2001-present`). The fourth, the post-9/11
skyscraper timeline, is not politics at all.

#126 asked a product question: keep the namespace or delete it. The answer is
keep — the content is substantial and sourced — but "keep" is not "keep one
folder".

## Decision

1. **Politics is a family of namespaces**, not a single bucket:
   - `global-politics/` — cross-border conflict and diplomacy (Gaza, Ukraine);
   - `us-politics/` — domestic US political and legal authority (the 2001 AUMF);
   - `nato-politics/` — alliance politics, created when its **first universe
     lands**, not as an empty directory.
2. **Membership is declared on the universe, never by the folder.** A module's
   directory is authoring organisation only. `connections.natural.parentUniverses`
   (and the `CommonUniverseIds` containers it resolves to) is the model; moving a
   file between namespaces changes no containment edge.
3. **Content that is not political leaves the family.** The post-9/11 skyscraper
   timeline moved to `historical/`, where its siblings are other sourced US
   history.
4. **Each namespace gets a barrel and a `*-registration.test.ts`** that walks the
   barrel, asserts every id is in `allUniverses`, and asserts each one survives a
   real registry lookup. This is the #27/#67/#98 guard; it is the reason the
   imports cannot silently stop happening again.
5. **No empty namespace is created.** The same rule as the games franchise
   container in #112 §11.5: an id or directory with no member is a dangling
   anchor. `nato-politics/` is named here so the intent is recorded; it appears
   when a universe does.

## Consequences

- The intended namespaced ids (`history:gaza:israel_hamas_war:2023-2025`) now
  validate as *declared* `history:` ids: `HISTORICAL` already allows one optional
  middle segment (`history:<domain>:<subject>:<span>`, the same cap `SYSTEM`
  uses). Previously the range form could only have passed through the permissive
  catch-all, which cannot represent a range at all — so the ids the modules
  intended were unrepresentable and the modules threw instead.
- Three modules were rewritten through `UniverseBuilder`. They had shipped with
  milliseconds in nanosecond fields, `segmentId`/`startTime`/`endTime` segment
  shapes, non-canonical reality anchors, and invalid enum values. Because they
  were never imported, nothing validated them; `build()` now does.
- A new politics sub-notion no longer needs a design decision — only a universe
  that belongs to it.
