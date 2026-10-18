---
name: local-time-films
description: Use when adding or editing a film universe in local-time under src/config/universes/films/ (or pixar/, 20th/, studios/) — resolving a studio token, declaring a film a member of HOLLYWOOD_SYSTEM and its film_studio container, recording a DISTRIBUTED_BY edge, placing runtime keyframes, or working a ticket that proposes a film id such as film:<studio>:<title>:<year>. Also use when a film "builds but isn't in the registry", when runtime keyframes read as durations, or when act segments do not cover the runtime.
---

# A film universe in local-time

Read the hub skill [`local-time-universe`](../local-time-universe/SKILL.md) for
registration, the builder API and the closed unions. This skill is the film half:
the decisions that are specific to a *released film*, the ones a ticket gets wrong.

Everything below is anchored in the two films shipped in james-gibson/local-time#115
(`universal:warcraft:2016`) and #116
(`paramount:dungeons_and_dragons_honor_among_thieves:2023`); the template is those
files, verified by `tsc`, `jest`, `eslint` and CI.

## Gate 0 — a film universe is a *released work*

Fiction is recorded in `realityRelation`; it is never hidden. The converse also
holds and is easier to get wrong:

> **Do not create a universe for a work that does not exist.** A "fictional short
> that could exist between the films" is not a universe — it is an invented work,
> and registering it asserts a false fact about a real company (with fictional
> characters in the creator field and a real studio in the copyright field).

That is why `games/monopoly.ts` was **deleted** rather than registered in #113. If
what you have is an in-universe *event*, it is a keyframe on the work that contains
it, not a universe of its own.

## The prep ledger — measure these six before writing a line

A film ticket is a set of presumptions. Settle each against the code graph first.

| # | Measure | How | The failure it prevents |
| --- | --- | --- | --- |
| 1 | The **id** | `local-time-ids` — factory + the *domain* guard | a 4-segment `film:<studio>:<title>:<year>` passes `isValidUniverseId` and is not a film id |
| 2 | The **studio token** | `resolveFilmStudio(token)` must return an entry | an unregistered token silently names no distributor |
| 3 | The **runtime** | minutes, from the source | 123 vs 134 changing every act boundary |
| 4 | The **keyframe positions** | runtime ns, from the ticket; treat as approximate | reading `(61, 30)` as a duration or a clock time |
| 5 | The **real referents** | does the anchored universe exist? | a dangling anchor (the #129 lesson) |
| 6 | The **sources** | ≥ 3, in the header comment *and* `attribution.sources` | an unattributable universe |

Steps 1, 5 and 6 are where tickets are usually wrong. Do not skip step 5 because
the anchor "reads fine" — `history:world_wide_web:1989` reads perfectly and does
not exist (the registered id is `technology:world_wide_web:1989`).

## The id, in one line

`<studio-token>:<slug>:<year>`, built with `createFilmUniverseId(token, slug, year)`.
The **token must be the registered distributor**, not the word `film`:

- `resolveFilmStudio('universal')!` → `film_studio:universal_pictures:1912-present`
- `film` is `GENERIC_FILM_STUDIO_TOKEN` — *"no studio named"*. It is a valid film
  id and the wrong choice whenever the distributor is known.
- A punctuated title never round-trips through `toIdFragment`: pin the slug and
  assert the factory output equals it.

## Two authoring shapes — pick deliberately

| | **Literal** | **Builder** |
| --- | --- | --- |
| Use when | you need `connections.references` (a `DISTRIBUTED_BY` edge), per-segment `description`/`status`, an explicit `epochId`, `usage_restrictions`, arbitrary `metadata` | the film is a plain runtime structure and nothing else |
| Validated by | **nothing** — a literal skips `build()` | `build()`, in a fixed order |
| Cast | `as unknown as Universe` | none |
| Example | `films/20th/idiocracy.ts`, `films/apollo13-film.ts`, the two #115/#116 films | `films/die-hard.ts` |

**The cast hides out-of-union values.** `as unknown as Universe` lets a literal
compile with a value no union accepts, and nothing at runtime checks it — three
files drifted that way (`realityRelation.type: 'fictionalized'`, a segment
`status: 'ended'`, an anchor `relationshipType: 'parodies'`; filed as #143). So when
you write a literal, check **every** closed-union field against the union by hand:
`realityRelation.type`, `TemporalSegment.type`, `TemporalSegment.status`,
`WindowingStrategy.strategy`, `TemporalLayer.type`, `KeyframeType`,
`RealityAnchor.relationshipType`. The full lists are in the hub skill's
`references/builder-api.md`.

## Runtime keyframes are runtime *positions*

A film's keyframes are nanoseconds from the first frame — the film is watched from
zero. `addRuntimeKeyframe(minutes, seconds, …)` is **(minutes, seconds-within-the-minute)**:
`(61, 30)` is 61m30s, i.e. `3_690n * 1_000_000_000n` (#112). It is not a duration
and not a clock time, and the same rule applies in a literal:

```ts
const runtime = (minutes: number, seconds = 0): bigint =>
  (BigInt(minutes) * 60n + BigInt(seconds)) * 1_000_000_000n;
```

A film therefore has **two time axes** and they must not be mixed:

- the **runtime** epoch (`0 → runtime_ns`, `TimePrecision.SECOND`) holds the
  keyframes and the act segments;
- `metadata.released` is the real-world release `Date` (US theatrical).

Do not put a dated keyframe in a runtime-ns timeline: the two axes are not
comparable, and every relative query on that universe would be nonsense.

## Acts must be gapless — and it is arithmetic, so prove it

Segments partition the runtime: `end === next.start`, exactly, and
`first.start === 0n`, `last.end === runtimeNs`. Ticket spans routinely miss by a day
(or a second) because they are written as inclusive calendar ranges. Assert it:

```ts
for (let i = 1; i < ordered.length; i++) expect(ordered[i].start).toBe(ordered[i - 1].end);
```

## Containment and the distributor

A film is a member of two containers, and carries one reference:

```ts
connections: {
  natural: { parentUniverses: [CommonUniverseIds.HOLLYWOOD_SYSTEM, UNIVERSAL] },
  references: [distributedByRef('universal', 'Distributed theatrically worldwide by Universal Pictures.')],
}
```

- `parentUniverses` is the containment edge the registry folds into
  `CommonUniverseIds` (#74) — `HOLLYWOOD_SYSTEM` plus the **registered studio
  universe** from `resolveFilmStudio`.
- `distributedByRef(token, note)` produces the `DISTRIBUTED_BY` reference
  (note: `type` is the enum **name**, `'DISTRIBUTED_BY'`, not `'distributed_by'`).
  The distributor is a fact *as of the film's release*; a later rename or
  acquisition is a keyframe in the **studio's** universe, never an edit here (#44).
- A builder declares containment with
  `addConnection({ type: 'member_of', targetUniverseId })` — same edge, different
  author path.

## Attribution and metadata minimum

The hub skill's `build()` rules apply to a builder; a literal gets nothing. For a
film, ship all of:

```ts
attribution: {
  public_domain: false,
  copyright: { holders: ['Paramount Pictures', 'Hasbro', 'Entertainment One'], year: 2023, status: 'active' },
  creators: { director: [...], writer: [...], based_on: ['Dungeons & Dragons by Hasbro'] },
  citations_required: true,
  usage_restrictions: ['Copyrighted. This record contains no dialogue, script, stills or footage…'],
  sources: ['…', '…', '…'],   // ≥ 3
},
metadata: { canonicalName, description, creators, released: new Date('2023-03-31'), cultural_significance, tags },
```

`withCopyright` sets only `copyright` + `citations_required` — it cannot express
`usage_restrictions` or `sources`. If you need those, use a literal.

`cultural_significance` must be *justified* in the header comment and reflected in
`metadata.cultural_description`. A box-office disappointment with strong reviews is
a different number from a genre-defining hit; say which you are measuring.

## Registration and the test

Add the film to the `films/` barrel (`export *` **and** the `filmUniverses` spread —
the walk test enumerates both, so a missing spread fails), then write the guard.
Assert, at minimum:

1. the id equals the factory output, and `isFilmUniverseId` (the domain guard) is true;
2. the id is in `allUniverses` exactly once, and **registered in a real registry** —
   `new UniverseRegistry(new ConfigLoader())` + `registerUniverse` + `getUniverse`
   (#27: a spread is not a lookup);
3. every epoch has a non-empty explicit `epochId` (#19);
4. the runtime keyframes are positions not durations;
5. the act segments are gapless and cover `[0, runtimeNs]`;
6. `parentUniverses` contains `HOLLYWOOD_SYSTEM` and the resolved studio id, and the
   `DISTRIBUTED_BY` reference matches `distributedByRef`;
7. **every anchor resolves** to a `universeId` in `allUniverses`;
8. `RealityGradientAnalyzer.analyzeUniverse(u).level >= 0.7` for `pure_fiction`/1.0
   (a film is fiction, so it should project as fiction).

If an anchor cannot resolve, assert the opposite — that `realityAnchors` is empty —
and record why in the file, so a later reader does not "fix" it by inventing an id.

## The film-ticket presumption ledger

Tickets for film universes are generated from a template, and the same claims come
back wrong. Treat each as a presumption to falsify:

| The ticket says | The usual reality |
| --- | --- |
| `film:<studio>:<title>:<year>` | four segments; passes only the catch-all (#50). Also `film` is the generic token, not the studio |
| "the film stars <name>" | unsourced; check it against a cast list. Excluded from the universe and recorded as a *note*, never as fact |
| "`addRuntimeKeyframe`'s `description` is discarded (#77)" | forward-dated: `description` is accepted and forwarded now |
| "anchor to `game:…`/`history:…`" | the referent frequently does not exist; a wrong-namespace id is the most expensive kind of wrong |
| "verify the timestamp before merge" | a real blocking item — a runtime position is a judgement, not a fact you can look up |
| "no matching entertainment parent; add one" | usually false: the studio universe already exists. `resolveFilmStudio` before you invent a container |

## Reference

- `references/template.md` — the literal template, the builder alternative, and the
  test template, ready to fill.
- `local-time-ids` — prove the id and every id you reference.
- `local-time-verify` — prove the change, and the traps that make a local run lie.
- The hub's `references/builder-api.md` — factories, closed unions, `build()` order.
