---
name: local-time-ids
description: Use before you write, accept or type any `universeId` in local-time — when a ticket or plan proposes an id, when choosing a film/studio token, when adding a `realityAnchor` / `parentUniverses` / `references` entry, or when a universe "isn't showing up" because its id was silently dropped. Covers the id patterns and reserved namespaces, why `isValidUniverseId` is NOT a proof, the factory-vs-guard rule, slugging lossiness, and how to prove that an id you *reference* actually resolves.
---

# universeId — measure it, do not accept it

An id is the one field every other feature keys off. It is also the field most
often **wrong in the source material**: a ticket proposes one, a plan copies it, a
generated snippet invents one. Nothing throws. The registry warns and skips, so a
bad id looks like a universe that was never written.

The rule this skill exists to enforce:

> **`isValidUniverseId` is not a proof of anything.** Prove an id with the
> *domain* guard or the *factory* for the kind of thing you are writing, and prove
> that every id you *reference* resolves to a registered universe.

## 1. Why `isValidUniverseId` is not a proof

```ts
isValidUniverseId = (id) => Object.values(UNIVERSE_ID_PATTERNS).some((re) => re.test(id))
```

The last pattern in that table is `ANY_YEAR_TERMINATED =
/^[a-z0-9_:]+:[a-z0-9_]+:\d{4}$/` — the colon is inside the first character
class, so it is **arity-blind**. It accepts `a:b:1999`, `a:b:c:1999`,
`a:b:c:d:e:f:1999`, and `this:is:not:a:real:id:at:all:1999` (james-gibson/local-time#50,
pinned in `src/core/__tests__/universe-id-fallback.test.ts`).

So a four-segment id passes `isValidUniverseId` while matching **no declared
domain**. Measured, 2026-10:

```text
film:legendary:warcraft:2016   matches: ['ANY_YEAR_TERMINATED']   isValidUniverseId: true
```

That is the exact shape two film tickets shipped. It is not a film id.

The mirror-image trap: `isValidUniverseId` also says `true` for an id in a
*declared but wrong* domain, because FILM's pattern is the generic three-segment
shape. `hearing:rogers_commission:1986` validates as a **film** — which is why the
real id is `history:rogers_commission:1986` (#57).

## 2. The proof procedure — run this before you write the module

1. **Name the domain.** "A 2016 film distributed by Universal" → `FILM`. Not
   "a universe for a film" → `FILM`. The domain picks the pattern.
2. **Call the factory.** `createFilmUniverseId('universal', 'warcraft', 2016)`
   → throws if the shape is wrong. Do not hand-assemble the string.
3. **Assert the domain guard.** `isFilmUniverseId(id) === true` — *not*
   `isValidUniverseId`. The guard is the claim; the validator is a suggestion.
4. **Assert no other domain claims it.** Print every pattern that matches and read
   the list (see the probe below). One match is the goal.
5. **Assert the id *references* resolve** (§4) — for anchors, parents and
   `references`, which are the half that nothing validates at all.

The probe, as a throwaway `*.tmp.ts` at the repo root (run with `npx tsx`; `node`
is often not on `PATH`, see the `local-time-verify` skill):

```ts
import { UNIVERSE_ID_PATTERNS, isFilmUniverseId, isValidUniverseId, createFilmUniverseId }
  from './src/core/universe-ids';
import { resolveFilmStudio } from './src/config/universes/studios';

const id = createFilmUniverseId('universal', 'warcraft', 2016);   // 2. factory (throws)
console.log('guard   ', isFilmUniverseId(id));                    // 3. the real claim
console.log('valid   ', isValidUniverseId(id));                   // necessary, never sufficient
console.log('matched ', Object.entries(UNIVERSE_ID_PATTERNS)      // 4. exactly one
  .filter(([, re]) => re.test(id)).map(([n]) => n));
console.log('studio  ', resolveFilmStudio('universal'));          // 5. the container exists
```

Then **delete the probe** and put the same assertions in a committed test, so the
claim is guarded rather than asserted once.

## 3. Slugging is lossy — a title is not an id

`toIdFragment` (used by `createFilmUniverseId` and friends):

```text
trim -> lowercase -> [\s\-.]+ -> '_' -> [^a-z0-9_] -> '' -> collapse '_' -> trim '_'
```

So `Dungeons & Dragons: Honor Among Thieves` becomes
`dungeons_dragons_honor_among_thieves` — the `&` and `:` are **deleted**, and the
"and" goes with them. A readable slug has to be pinned:

```ts
// the id is NOT a verbatim factory call on the title
export const u = { universeId: 'paramount:dungeons_and_dragons_honor_among_thieves:2023' }
// prove it in the test:
expect(u.universeId).toBe(createFilmUniverseId('paramount', 'dungeons_and_dragons_honor_among_thieves', 2023));
```

`UniverseBuilder.historical()` has its **own** slugifier — `[^a-z0-9_:.]+ -> '_'`,
which *keeps* `:` and `.` (so a namespaced event survives) — and it validates and
throws (#70). The two slugifiers differ; read the one you are using.

## 4. An id you *reference* must resolve

Nothing validates these. Each is a dangling edge if the target does not exist:

| Field | Resolution |
| --- | --- |
| `realityRelation.realityAnchors[].realEventId` | a registered `universeId` |
| `connections.natural.parentUniverses[]` | a registered `universeId` **or** a `CommonUniverseIds` symbolic name |
| `connections.references[].targetUniverseId` | a registered `universeId` |
| `metadata.connections[].targetUniverseId` (builder `addConnection`) | same, for containment types |

`UniverseRegistry.declaredParentUniverses` resolves parents through
`CommonUniverseIds.resolveDeclaredName` and **warns and drops** an unresolvable one
(#133) — so a wrong parent is a `console.warn`, not an exception, and easy to miss.

Prove resolvability by set membership, not by reading:

```ts
const registered = new Set(allUniverses.map((u) => u.universeId as string));
expect(registered.has(anchor.realEventId)).toBe(true);
```

**The `world_wide_web` case.** A ticket anchored PageRank to
`history:world_wide_web:1989`. That id is well-formed *and* in the `history:`
namespace — and it does not exist. The registered universe is
`technology:world_wide_web:1989`. A plausible id in the wrong namespace is the
most expensive kind of wrong, because it passes every shape check. Search for the
*thing*, then read the id off the universe that owns it:

```
synapse_search_codebase (regex) "world_wide_web"  ->  read the universe
```

**When the referent does not exist at all**, do not invent an id for it: that is
how a dangling edge becomes permanent. Defer the edge, and record the source
material in `attribution.sources` / `metadata` instead (james-gibson/local-time#129).

## 5. `identifiers.primary` is inert

The registry registers `universeId` and every `identifiers.aliases` entry.
`identifiers.primary` is never a lookup key, so a `primary` that disagrees with
`universeId` is a silent second id grammar. Keep them equal unless you
deliberately record a different canonical identifier; some namespaces assert the
equality (#102 BUG-4).

## 6. Reference

- `references/patterns.md` — every pattern verbatim, the reserved namespace
  tokens, the slugifiers, and which tests already guard this.
- The hub skill [`local-time-universe`](../local-time-universe/SKILL.md) —
  registration, the builder API, and the closed unions. Its
  `references/builder-api.md` has the factory table (which factories validate and
  which do not).
- `local-time-verify` — how to run the proof, and the traps that make a local run
  lie.
