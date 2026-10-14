# The universe scaffold — a starting builder handed over in Qdrant

Creating a universe is ~90% the same **"what and where"** every time: which directory, which
file name, which import, which id factory, which builder chain, which barrel to touch, which
test to add. Agents burn turns re-deciding it — and re-deciding it *differently* each time,
which is the churn you feel at "what do I do, and where does it go?".

The fix is in prep: the **prep agent decides the what/where once**, emits a **compiling
skeleton** (the *starting builder*), and stores it in Qdrant. The working agent's only job is
the part that is genuinely new — the narrative and the keyframes. It starts *writing*, not
*deciding*.

> N universe creations should cost N narrative writes, not N re-derivations. Pre-decide the
> shape in prep, ship it as code, and the next agent opens the file already 80% built.

## What the scaffold record contains

```text
kind:      42i-scaffold
universe:  <universeId>                     (validated — isValidUniverseId)
factory:   <createXUniverseId(...) | the (idMethod, args) the builder takes>
mode:      builder | literal                (see "Which mode")
path:      src/config/universes/<ns>/<name>.universe.ts
code:      <the compiling skeleton, below>
lever:     [{ id: <parent>, via: 'connections.natural.parentUniverses' }]
register:                                                ← the always-forgotten step
  - src/config/universes/index.ts                        (add to allUniverses)
  - src/config/universes/<ns>/index.ts                   (namespace barrel)
  - src/config/universes/<ns>/<name>-registration.test.ts (new)
test:      <the guard assertion, e.g. id resolves + is in allUniverses>
open:      [ <ONLY the genuinely new decisions — usually just the keyframe list> ]
```

Everything except `open` is knowable before the work starts. That is the whole point.

## Which mode

| Mode | Use when | Validated? |
| --- | --- | --- |
| **builder** | default; plain universe, no lever | yes — `build()` checks it |
| **literal** | a **lever** (`connections.natural.parentUniverses`), a segment `status`/`jurisdiction`/`description`, arbitrary `metadata`, or a KB-generated file | no — nothing checks it |

**The trap that forces the choice:** the builder's `addConnection(...)` writes
`metadata.connections` (an *array*); the lever edge lives in the **top-level**
`connections.natural.parentUniverses` object, which the builder **cannot emit**. So **if the
scaffold has a lever, it is a literal.** (Worked cases: `rogers-commission.ts`,
`idiocracy.ts`, every `imported/*.ts`.)

## Template — builder mode

Faithful to `src/config/universes/historical/tulsa-massacre.ts` (import from the src barrel):

```ts
import { UniverseBuilder, TimePrecision } from '../../../index';

/**
 * @universe <namespace>:<slug>:<YYYY>
 * @description <one paragraph>
 * @temporal-strategy <how time is structured>
 * @reality-relation <type>, degree <0..1>
 * @significance <0..1> — <why>
 */
export const <name>Universe = new UniverseBuilder()
  .historical('<slug>', '<YYYY>')        // sets id + type; .film(...) / .mission(...) / .withId(...)
  .withDescription('<one line>')
  .withRealityRelation('documentary', 0.0)
  .withCopyright(['<holder>'], <YYYY>)   // OR .withPublicDomain([...]) — attribution is REQUIRED
  .withCulturalSignificance(<0..1>)
  .withTags([<tags>])
  .addEpoch('<iso>', '<iso>', '<epochId>', <sig>, [<tags>], { description: '…' })
  .addKeyframe('<iso>', '<id>', <sig>, [<tags>], {
    epochId: '<epochId>', description: '…', precision: TimePrecision.HOUR,
  })
  .build();
```

Rules that keep it compiling (full list: `local-time-universe/references/builder-api.md`):

- Attribution is mandatory — omit `withCopyright`/`withPublicDomain` and `build()` **throws**.
- Every epoch needs an explicit `epochId`; `addEpoch`'s 6-arg form stamps it, and a keyframe's
  `options.epochId` must match one.
- `addKeyframe(timestamp, id, significance, tags, options)` — the **5th arg is `options`**, a
  parameter, not a field.
- `withRealityRelation` sets the guard that survives factory defaults; `setRealityRelation`
  does not (#99). `withWindowing` has the same trap.
- Cultural and keyframe `significance` must be in `[0, 1]`.

## Template — literal mode (lever-derived, or fields the builder drops)

```ts
import { Universe, UniverseType, TimePrecision, KeyframeType } from '../../../core/types';

export const <name>Universe = {
  universeId: '<id>',
  type: UniverseType.<TYPE>,
  identifiers: { primary: '<id>', aliases: ['<Alias>'] },
  realityRelation: { type: 'documentary', fictionalizationDegree: 0.0, realityAnchors: [] },
  attribution: { sources: ['<url>'], citations_required: true },
  epochs: {},
  layers: [ /* primary layer, each epoch carrying its own epochId */ ],
  temporalStructure: {
    segments: [ /* … */ ],
    keyframes: [
      {
        id: '<id>',
        timestamp: BigInt(Date.UTC(<YYYY>, <M0>, <D>)) * 1000000n,   // nanoseconds
        significance: 0.9,
        tags: ['<tag>'],
        type: KeyframeType.<TYPE>,          // PUBLICATION / FOUNDING / RELEASE / …
        description: '…',
      },
    ],
    windows: { strategy: 'time_based' },
  },
  metadata: { canonicalName: '<Canonical Name>', creators: [], cultural_significance: 0.7 },
  connections: {                            // ← the lever; the builder cannot emit this
    natural: { parentUniverses: ['<lever id>'] },
    references: [],
  },
} as unknown as Universe;
```

Trap: a literal skips `build()`, so **nothing validates it**. `options` is not a field;
`dateRange` is `{ earliest, latest }` bigints, not `{ start, end }`; `type` is a `KeyframeType`,
not a segment type. (This is the class of fault a generated example shipped in
james-gibson/local-time#93 — see `builder-api.md` §*Manual literal vs builder — traps*.)

## Registration — name all three in the scaffold

The step that is always forgotten, so it must not be discovered at runtime:

1. Add the universe to `allUniverses` (`src/config/universes/index.ts`).
2. Add it to the namespace barrel (`src/config/universes/<ns>/index.ts`) if one exists.
3. Add `src/config/universes/<ns>/<name>-registration.test.ts`.

The scaffold lists all three with exact paths. The working agent never has to find them.

## Store it, then load it

Prep stores the scaffold in Qdrant, keyed by universe id and attached to the plan step:

```text
qdrant-store
information: "<the code>\n\nregister:\n  - <path>\n  - <path>\ntest: <assertion>\nopen: <list>"
metadata: { kind: "42i-scaffold", universe_id: "<id>", mode: "builder|literal",
            path: "<target path>", lever: ["<parent id>"], plan: "<plan name>", step: <n> }
```

The working agent loads it with one `qdrant-find` and has **the file content, its path, the
lever, and the registration checklist** in hand — no shape, no probe, no search, no decision.
It pastes the skeleton and fills `open`.

## How prep produces it

1. Pick the lever(s) first (see `universe-levers.md`) — the lever decides `parentUniverses`
   and therefore the **literal** mode.
2. Find the **twin** — the sibling that already derives from the same lever — and copy its shape.
3. Fill the scaffold: path, id factory, mode, code, lever, registration, test.
4. Leave `open` as the *only* unknown — normally just the keyframe list and the prose.
