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

## Gate 0 — real content: a *real work*, fictional or not

`kagi.md` (§ Automatic Context Discovery) draws the line:

> "Real content" means real events **and real works**. A fictional film is real
> content — a real work — and its fictionality is recorded in `realityRelation`,
> never hidden. Do not invent universes for content that does not exist, and never
> assert a fictional or unsourced claim as fact.

So the test is **existence**, not fictionality. A fictional film is a real work and
is modelled with its fiction recorded; a published fan work is also a real work (it
has an author and a venue) and may be recorded the same way. A "fictional short that
could exist between the films" is none of those — it is not a work at all.

That is why `games/monopoly.ts` was **deleted** (#113, #142): it invented a 2005 Pixar
short with no author, venue or publication, and attributed it to a real studio. The
defect was the fabricated existence and attribution, not the fictional characters.

Deleting the universe does not delete the connection. `kagi.md` and 42i answer
different questions: `kagi.md` decides what is **real content** (a universe); 42i
decides what is **representable**. `42i` is the working-hypothesis anchor (`0+42i`),
against `42` (`42+0i`), the proven-consensus anchor — and the two are never mixed in
one run.

A compendium is a **feature**, which is Gherkin in the domain's own vocabulary:
*Given* its zero, `presupposes` and anchors, *When* its keyframes, *Then* its claims.
The answer is the combination of the declared feature and the observed receipt, and
it is the 42i value; the rung is the bucket it falls into. A declared feature with no
receipt is a **working hypothesis** — representable and evaluable, not a fact you
assert and not an absence you delete. That is what "documentable" means here:

- charge -1, `presupposes` the work, positive `tensor.w` in an `out == 0` block: the
  claim is *possible* (the required compendium is present and the claim is anchored in
  it);
- not *unknown* (nothing required is missing) and not *really wrong* (no inverse
  compendium present);
- the feature is declared; the receipt — a published fan work — does not exist, so
  nothing is documented yet.

See `kb/scripts/lab/SPLASH.md` (*Decomposition by feature*) and
`isotope/docs/lore-plane-mapping.md` §6.

The constraint is **scoped to the container**, not to the claim. "A fictional
character must not appear in the real attribution block" constrains
`attribution.creators`; it says nothing about the fiction plane, where Woody can be
a director. 42i encodes the same discipline: an inverse is a negative `tensor.w`
against a *specific defeated keyframe*, never a general negation of the compendium —
the Ford's Theatre fire defeats one Lincoln keyframe, not "Lincoln was assassinated".
Drop the scope and the rule swallows the claim it was meant to bound: the fiction gets
deleted, or it gets promoted to real attribution.

The reason to keep the context explicit is the **next calculation**. With Woody out
of the real credit block and the claim in the fiction plane, "has Woody ever produced
a film?" answers *no* in the real sector and *yes, in this fan work* in the fiction
sector. Put him in `attribution.creators` and the same query answers *yes* — a false
real-world fact produced by a field that looked like metadata. Attribution and
metadata are not bookkeeping; they are what makes the next agent's query correct.

If an event belongs to an existing work's own timeline, it is a `FilmMoment` on that
work, not a universe of its own.

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
