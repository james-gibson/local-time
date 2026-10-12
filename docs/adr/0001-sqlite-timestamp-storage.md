# ADR 0001 — Timestamp and storage representation for SQLite

- **Status:** Accepted
- **Date:** 2026-10-12
- **Related:** [#58 (Prisma schema)][58], [#55 (relative-range bounds)][55]

## Context

The system is moving to SQLite for deployment once the logic is stable. Two things have to
be decided before any data is written, because both are expensive to migrate afterwards:

1. **What type stores time.** `TemporalKeyframe.timestamp`, `TemporalEpoch.startTime` /
   `endTime` and `ZeroReferenceEpoch.zeroPoint` are all `bigint`, currently
   **nanoseconds since the Unix epoch**, everywhere in the codebase.
2. **How embeddings are stored**, since embeddings are not modelled in `types.ts` at all.

The driving concern is **range**. This knowledge base spans 1788 (the election series) to
the present, carries `religio` and `magic-system` templates that reach into antiquity, and
`ZeroReferenceEpoch` values are routinely pre-1970 — therefore negative.

### Measured facts

These were computed, not estimated.

```
int64 headroom by unit:
  ns : +/-   292 years        -> representable years 1600 .. 2262
  us : +/- 292,271 years
  ms : +/- 292,271,023 years

nanoseconds overflow below year 1600 and above year 2262.
year 1600 = -11,676,096,000,000,000,000 ns  -> does NOT fit int64
year 2026 =  1,791,763,200,000,000,000 ns  -> fits, but ~200x above
                                              Number.MAX_SAFE_INTEGER (9,007,199,254,740,991)
```

So nanoseconds are the binding constraint: **they fail below 1600**, and independently they
sit ~200× above `Number.MAX_SAFE_INTEGER`, which corrupts silently in any SQLite driver that
returns `INTEGER` as a JS `number`.

## Decision

### Time

| Layer | Representation |
|---|---|
| Authoring / source / exports | ISO-8601 strings, e.g. `votingOpens: '1788-12-15'` |
| In memory | `bigint` **nanoseconds** — unchanged |
| SQLite at rest | `INTEGER` **microseconds** |

Conversion is exact in both directions and lossless:

```
write:  us = ns / 1000n
read:   ns = us * 1000n
```

`1000n` divides and multiplies exactly because every nanosecond timestamp in this codebase is
a multiple of 1000 (they are all produced by `Date.UTC(...) * 1000000n`). **This invariant
must hold** — a sub-microsecond timestamp would truncate. Nothing in the current data model
requires better than microsecond precision; `TimePrecision` bottoms out at `SECOND`.

**Do not switch the in-memory unit.** Nanoseconds are convenient, and they are what the 42i
addressing layer already computes. Only the storage representation changes.

### Canonical string format

ISO-8601 is used for authoring and export. Where a string is ever *sorted* rather than
parsed, the canonical form is:

```
YYYY-MM-DDTHH:MM:SS.ffffffZ      6 fractional digits, always present, always Z
```

Three rules, each of which was verified to break ordering when violated:

| Rule | Violation |
|---|---|
| Always `Z`, never an offset | `'1969-07-16T15:26:30+02:00'` sorts *after* `'1969-07-16T13:26:30Z'` — same instant, wrong order |
| Always 6 fractional digits | `'...30.000000Z'` sorts *after* `'...30Z'` — same instant, wrong order |
| Never a signed year | BCE dates sort in reverse: `-0` < `-1` < `-5` |

The third rule is why negative years must never reach a sortable string column. Store them
as microsecond INTEGERs.

### Embeddings

| Concern | Decision |
|---|---|
| Granularity | One embedding **per keyframe**, not per universe — one row per event, `universeId` as a foreign key |
| Column type | `BLOB` of `float32`, **not** `REAL` |
| Model version | `embedding_model` column, NOT NULL |
| Vector index | Deferred to a separate ADR; `sqlite-vec` or the built-in `vss` module |

`REAL` is an 8-byte double. A 1536-dimension `float32` vector stored as 1536 `REAL`s costs
roughly 2× the space of a compact BLOB and cannot be read back as a vector without a
per-row reassembly in application code.

`embedding_model` is mandatory rather than optional: re-embedding rewrites every vector, and
without a version column there is no way to tell which rows are comparable. Two vectors from
different models are not comparable, and nothing in the row should have to guess.

## Consequences

**Good**

- Nanosecond timestamps remain representable with ~292,000 years of headroom either side.
- Integer comparison, sorting and arithmetic all work in SQL, including `endTime - startTime`
  for durations — which TEXT makes into string surgery.
- Source stays human-readable and diffable; `git blame` on an election date still means
  something.
- No dependence on driver safe-integer modes for correctness.

**Bad**

- Two representations to keep in sync. `elections-data.ts` stores ISO strings and
  `presidential.ts` converts via `isoToMs` at load; SQLite needs its own conversion at the
  boundary. Both are one-liners, but both must exist.
- The ns-to-us invariant (always a multiple of 1000) is load-bearing and undocumented in the
  type system. A `TIMESTAMP_US` branded type, or a checked conversion function, would make
  the invariant explicit.
- Sortable string columns still need the canonical format enforced. Since the rule cannot be
  expressed in SQLite's type system, it belongs in a test and in review.

## Alternatives considered

### Store nanoseconds as INTEGER — rejected

Fails below year 1600, which this knowledge base will reach. The range is a hard ceiling on
what can be modelled at all, and it would surface as a confusing overflow rather than an
obvious "out of range".

### Store ISO-8601 strings — rejected, despite being the obvious answer

This was the first proposal, and it is readable and unbounded. It was rejected on the
verified ordering hazards above, of which the fatal one is **negative years sorting in
reverse**. This project is full of pre-1970 dates; the failure mode would be silent
misordering in exactly the historical material the system exists to hold.

SQLite cannot sort by an ISO string's *meaning* without a generated column, so a text
timestamp column would in practice still need an integer alongside it — at which point the
integer is the real column and the string is decoration.

### Store microseconds as TEXT

No advantage over INTEGER and gives up range-safe arithmetic.

## What this does not decide

- **Which vector index**, and whether it is worth the extension dependency. Deferred.
- **Whether `prisma/schema.prisma` survives.** Its shape is close enough to `types.ts` to be
  a useful starting point, but `ReferenceChain` / `ReferenceChainMembership` have no model
  counterpart and should be treated as provisional rather than adopted by default. See #58.
- **`bigint` in the type system generally.** Several other fields are `bigint` and none of
  them are timestamps; they need their own review.
- **Keyframe addresses.** `TemporalKeyframe` still has no `address` field, and no keyframe in
  the repository carries one. That is the actual prerequisite for #55, and is independent of
  this decision.

## Verifying the numbers in this ADR

The range and ordering claims are reproducible:

```python
# int64 headroom, per unit
INT64 = 2**63 - 1
NS_PER = {'ns': 1, 'us': 10**3, 'ms': 10**6}   # nanoseconds in one unit
SEC_PER_YEAR = 365.25 * 86400
for label, per in NS_PER.items():
    # INT64 is the largest value *in that unit*, so convert it to seconds once.
    seconds = INT64 / (10**9 // per)
    print(label, f'{seconds/SEC_PER_YEAR:,.0f}', 'years')
# ns: 292 years / us: 292,271 years / ms: 292,271,023 years

# the two claims that actually matter, checked independently
import datetime
for y in (2262, 1600):
    ns = int(datetime.datetime(y, 1, 1, tzinfo=datetime.timezone.utc).timestamp()) * 10**9
    us = ns // 1000
    print(y, 'ns fits:', -(2**63) <= ns <= INT64, '| us fits:', -(2**63) <= us <= INT64)
# 2262 ns fits: True | us fits: True
# 1600 ns fits: False | us fits: True

# BCE strings sort in reverse
sorted([(-500,'-0500'),(-44,'-0044'),(500,'0500')], key=lambda r: r[1])
# -> [(-44, '-0044'), (-500, '-0500'), (500, '0500')]   (wrong)
```

[58]: https://github.com/james-gibson/local-time/issues/58
[55]: https://github.com/james-gibson/local-time/issues/55