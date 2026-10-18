---
name: local-time-films
description: Use when adding or editing a film universe in local-time under src/config/universes/films/ (or pixar/, 20th/, studios/) — writing a FilmSpec and calling createFilmUniverse, resolving a studio token, placing runtime keyframes, or working a ticket that proposes a film id such as film:<studio>:<title>:<year>. Also use when a film "builds but isn't in the registry", when runtime keyframes read as durations, or when act segments do not cover the runtime.
---

# A film universe in local-time

Read the hub skill [`local-time-universe`](../local-time-universe/SKILL.md) for
registration, the builder API and the closed unions. This skill is the film half.

## Assemble a film — do not hand-author one

**Adding a film means adding a `FilmSpec`.** The structure lives once, in
`src/config/universes/films/film-universe.ts`:

```ts
export const warcraftFilmUniverse = createFilmUniverse({
  studio: 'universal', slug: 'warcraft', year: 2016, title: 'Warcraft',
  runtimeMinutes: 123,
  acts: [{ id: 'act_i', endsAtMinute: 61, endsAtSecond: 30, description: '…' }, …],
  moments: [{ id: '…', minute: 61, second: 30, significance: 0.9, tags: […], description: '…' }],
  // …sources, copyright, culturalSignificance + its justification, released
});
```

An earlier revision of this skill said "a film is a hand-authored literal, and here is
the template". That was the *current* state of the corpus, not the best shape for a
film, and it repeated a workaround as if it were advice. A film is **data** — a
runtime, some cut points, some moments, a distributor, some sources. Writing it as a
200-line object literal cast `as unknown as Universe` meant:

- nothing validated it (a literal skips `build()`), and
- the cast silently hid values the unions reject — three universes in this corpus
  shipped an out-of-union `realityRelation.type`, segment `status` and anchor
  `relationshipType` that way (#143).

The library is moving toward assembly from shims and smaller parts. A film spec is the
smallest part a film decomposes into.

## What the factory derives — so you cannot get it wrong

| Derived | From | The bug it makes impossible |
| --- | --- | --- |
| the id, the `film_studio:` container, the `DISTRIBUTED_BY` reference | one `spec.studio` token | the four disagreeing (a hand-written literal lists each by hand) |
| the **gapless act partition** | the cut points in `spec.acts` | `end === next.start` drifting by a day, which the ticket spans did every time |
| the runtime epoch's end | `spec.runtimeMinutes` | the last act disagreeing with the runtime |
| `metadata.canonicalName` | `spec.title` | the slug-derived name mangling punctuation — `Dungeons & Dragons: Honor Among Thieves` → `Dungeons And Dragons Honor Among Thieves` |
| `metadata.released` | `spec.released` | `build()` otherwise deriving `Date(idYear, 0, 1)` and losing month and day |

The factory **throws** — loudly, before anything is registered — on an unregistered
studio token, a film with no acts, cuts that are not strictly increasing, and a last
act that does not end at the runtime.

## The prep ledger — what a film ticket still gets wrong

A ticket is a set of presumptions; settle each against the code graph before writing.

| # | Measure | How | The failure it prevents |
| --- | --- | --- | --- |
| 1 | The **studio token** | `resolveFilmStudio(token)` must return an entry | an unregistered token names no distributor — `createFilmUniverse` throws, and `film` (the generic token) resolves but means *"no studio named"* |
| 2 | The **runtime** | minutes, from the source | 123 vs 134 changing every cut point and the epoch |
| 3 | The **cut points** | runtime positions, from the ticket; treat as approximate | reading `(61, 30)` as a duration or a clock time |
| 4 | The **referents** | does the anchored universe exist? | a dangling anchor (the #129 lesson) |
| 5 | The **sources** | ≥ 3, in the header comment *and* `sources` | an unattributable universe |
| 6 | The **slug** | punctuated titles never round-trip | `toIdFragment` deleting the `&` (see `local-time-ids`) |

## Runtime keyframes are runtime *positions*

A film's keyframes are nanoseconds from the first frame — the film is watched from
zero. A `FilmMoment` is `{ minute, second }`, and `second` is *within* the minute, so
`(61, 30)` is 61m30s — not a duration, and not a clock time (#112). A film therefore
has **two time axes**, and they must not be mixed:

- the **runtime** holds the acts and the moments;
- `spec.released` is the real-world release date.

Do not put a dated keyframe in a runtime timeline: the two axes are not comparable,
and every relative query on that universe would be nonsense.

## Gate 0 — a film universe is a *released work*

Fiction is recorded in `realityRelation`; it is never hidden. The converse holds too,
and is easier to get wrong:

> **Do not create a universe for a work that does not exist.** A "fictional short
> that could exist between the films" is not a universe — it is an invented work, and
> registering it asserts a false fact about a real company, with fictional characters
> in the creator field and a real studio in the copyright field.

That is why `games/monopoly.ts` was **deleted** rather than registered (#113). If what
you have is an in-universe *event*, it is a `FilmMoment` on the work that contains it,
not a universe of its own.

## Anchors

`spec.realityRelation.anchors` takes `RealityAnchor`
(`realEventId` / `relationshipType` / `confidence` / `evidence`) — **not**
`TemporalReference`'s `{ domainId, eventId, context }`. Do not mix them.

Anchor only to a universe that **is registered**. A film that adapts a game, a novel
or a real event usually wants a `reinterprets` or `depicts` anchor — but if the
referent has no universe, an anchor id nothing owns is a *dangling reference*, not a
connection (the #129 lesson). Leave `anchors: []`, say why in the file, and record the
source material in `creators.based_on` and `sources` until the referent exists. Assert
the choice in the test, either way, so a later reader does not "fix" it by inventing
an id.

## Registration and the test

Wire **both halves** in `films/index.ts` — `export *` from the barrel *and* the
`filmUniverses` spread — then assert, at minimum:

1. the id equals `createFilmUniverseId(studio, slug, year)` and `isFilmUniverseId` (the
   *domain* guard) is true — not merely `isValidUniverseId`, which is a near-universal
   pass-through (`local-time-ids`);
2. the id is in `allUniverses` exactly once, **and** registers into a real registry —
   `new UniverseRegistry(new ConfigLoader())` + `registerUniverse` + `getUniverse`
   (#27: a spread is not a lookup);
3. every epoch has a non-empty `epochId` (#19);
4. the runtime keyframes are positions, not durations;
5. the act partition is gapless and covers `[0, runtime]`;
6. `parentUniverses` contains `HOLLYWOOD_SYSTEM` **and** the resolved studio id, and
   the `DISTRIBUTED_BY` reference names the same studio;
7. `canonicalName` is the human title, `released` is the exact date, and the sources,
   usage restrictions and act prose are present — the fields the spec declares, which
   a regression in the shim would otherwise drop silently;
8. `RealityGradientAnalyzer.analyzeUniverse(u).level >= 0.7` for `pure_fiction` / 1.0.

Items 5 and 6 are already structural in the shim; they are asserted anyway, because a
test is what keeps them structural.

## When you still need a literal

Assembly does not cover everything, and the residue should be an explicit list rather
than folklore: see the hub's
[`references/builder-api.md`](../local-time-universe/references/builder-api.md) →
*What still needs a literal*. As of #103/#115/#116 the film case needs none of it.

If you do write a literal, remember it skips `build()` and that
`as unknown as Universe` hides out-of-union values (#143) — check every closed union
by hand.

## The film-ticket presumption ledger

Tickets for film universes are generated from a template, and the same claims come
back wrong. Treat each as a presumption to falsify:

| The ticket says | The usual reality |
| --- | --- |
| `film:<studio>:<title>:<year>` | four segments; passes only the catch-all (#50). `film` is also the *generic* token, not the studio |
| "the film stars <name>" | unsourced; check it against a cast list. Excluded from the universe and recorded as a *note*, never as fact |
| "`addRuntimeKeyframe`'s `description` is discarded (#77)" | forward-dated: `description` is accepted and forwarded |
| "anchor to `game:…` / `history:…`" | the referent frequently does not exist, and a plausible id in the *wrong namespace* is the most expensive kind of wrong |
| "verify the timestamp before merge" | a real blocking item — a runtime position is a judgement, not a fact you can look up |
| "no matching entertainment parent; add one" | usually false: the studio universe already exists (`resolveFilmStudio`), and the shim wires it |

## Reference

- `references/template.md` — the `FilmSpec` template, the test template, and the wiring.
- `local-time-ids` — prove the id and every id you reference.
- `local-time-verify` — prove the change, and the traps that make a local run lie.
- The hub's `references/builder-api.md` — factories, closed unions, `build()` order.
