# Prep for james-gibson/local-time#203 — "Theranos Isn't About Elizabeth Holmes."

**Status:** prepared and implemented.
**Branch:** `feat/issue-203-drey-theranos` (from `origin/main` @ `7bf0175`, 2026-10-25).
**Ticket:** https://github.com/james-gibson/local-time/issues/203
**Guide:** [`kagi.md`](../../kagi.md), checked 2026-10-25.

**Decisions taken (2026-10-25):** `metadata.people` roster added with a test;
`fictionalizationDegree` 0.0; container parents `US_HISTORY` + `US_GOVERNMENT`; thesis
significance derived from the claims it rests on and capped at
`THESIS_CLAIM_CERTAINTY` (0.55), never hand-set. Files:
`src/config/universes/youtube/drey-theranos.ts`, `src/config/universes/youtube/index.ts`,
`tests/youtube/drey-theranos.test.ts`.

This document exists because the ticket was written against an assumed shape of the
repo, and a fair amount of that shape does not exist. Everything below was checked
against the working tree at `7bf0175`; file:line references are to that commit.

---

## 1. What is already verified

| Fact | Source | Result |
| --- | --- | --- |
| The work exists | YouTube oEmbed | title "Theranos isn't about Elizabeth Holmes.", author "The Drey Dossier" |
| Video id | `https://www.youtube.com/watch?v=PgWNQH4FWNI` | resolves |
| Substack mirror | `https://thedreydossier.substack.com/p/theranos-isnt-about-elizabeth-holmes` | HTTP 200 |
| Publication | YouTube `uploadDate` / `publishDate` | `2026-10-24T14:32:58-07:00` = **2026-10-24T21:32:58Z** |
| Runtime | YouTube `lengthSeconds` | **2795 s = 46:35** |

**Runtime correction.** The ticket uses 46:31 (the terminal transcript cue). That is
when the last caption *starts*, not the end of the video. Platform metadata says
2795 s. The epoch must be 2795 s long (the openttd video universe does exactly this,
`openttd/master-hellish-ai-vs-community.ts:293`), and the last segment must end at
2795 s, or the "gap-free 0:00→runtime" acceptance test cannot pass.

---

## 2. Blocking corrections — ticket vs. codebase

Each row is something that does not compile, does not register, or silently does
nothing if implemented as written.

### C-1 — There is no `doc` namespace, and no `src/config/universes/doc/`

`UNIVERSE_ID_PATTERNS` (`src/core/universe-ids.ts:235`) declares `film`, `film_studio`,
`series`, `book`, `fashion`, `history`, `personal`, `mission`, `legal`, `biography`,
`game`, `cybersecurity`, `us`, `technology`, `system` — and a permissive catch-all
`ANY_YEAR_TERMINATED` (`:347`). There is no `doc:` pattern, and no `doc/` directory
under `src/config/universes/`.

`doc:the_drey_dossier:theranos_isnt_about_elizabeth_holmes:2026` *would* pass
`isValidUniverseId` — but only through the catch-all, i.e. the #57 trap the file
explicitly documents at `:332-346`. It also has no `create*UniverseId` helper.

**Do instead:** put the module in the existing `youtube/` namespace
(`src/config/universes/youtube/`), which already holds two YouTube works and is
already spread into `allUniverses` (`src/config/universes/index.ts:71,147`). Use a
`series:` id, as those two do:

```ts
const UNIVERSE_ID = 'series:theranos_isnt_about_elizabeth_holmes:2026';
```

`createSeriesUniverseId('series', 'theranos_isnt_about_elizabeth_holmes', 2026)`
produces the same string and validates it (`src/core/universe-ids.ts:690`).

No new barrel module is needed; add one import + one entry to
`youtube/index.ts` (`youtubeUniverses`), nothing else.

### C-2 — `UniverseType` has no documentary member

`src/core/types.ts:823-853` lists `TECHNOLOGY, FILM, SERIES, BOOK, GAME, PATENT,
HISTORICAL_EVENT, PERSONAL_EXPERIENCE, SIMULATION, MISSION, MEDICAL_PROCEDURE,
BIOGRAPHY, LEGAL_TIMELINE, INSTITUTIONAL_PERIOD, TECHNICAL_SPECIFICATION,
TECHNICAL_LOG, ABSTRACT_CONCEPT`. Both existing YouTube works use
`UniverseType.SERIES` (`youtube/beck-responder-clocks.ts:310,449`).

**Do instead:** `type: UniverseType.SERIES`; keep the non-fiction claim in
`realityRelation.type: 'documentary'` (a valid member of `RealityRelation.type`,
`src/core/types.ts:349`). That is exactly the separation the corpus already makes.

### C-3 — 19 of the ticket's `KeyframeType` values do not exist

`src/core/types.ts:607-651` contains only: `FOUNDING, INCORPORATION, DISSOLUTION,
SHUTDOWN, MERGER, ACQUISITION, SPIN_OFF, RELEASE, PUBLICATION, LAUNCH, CONTRACT,
BREACH, AMENDMENT, LEGISLATION, RULING, REGULATION, ELECTION, ANNOUNCEMENT,
PUBLIC_STATEMENT, APOLOGY, CASTING, AWARD, NOMINATION, MARKET_EVENT, MILESTONE,
ZERO_POINT`.

`TESTIMONY`, `FINANCIAL`, `CORPORATE`, `TRANSFER`, `DOCUMENT`, `THESIS`,
`DISCLOSURE`, `COURT_ORDER`, `VERDICT`, `SENTENCING`, `PERSONNEL`, `TERMINATION`,
`INVESTMENT`, `ATTACK`, `POLICY`, `PLAN`, `DEPLOYMENT`, `SETTLEMENT`, `PATENT` are
all absent. The field is typed `KeyframeType`, so the module will not compile.

Proposed mapping for all 34 keyframes is in §4 — a mapping, not a request to widen
the enum. Widening is a separate, corpus-wide decision.

### C-4 — The two-epoch model cannot hold runtime keyframes

The ticket proposes `thesis_arc` (2026-10-24 → 2026-10-24, `DAY`) plus
`narrative_span` (1972 → 2026, `DAY`), and then puts every keyframe at a runtime
offset. Runtime keyframes are timestamps, not offsets: the established pattern is

```ts
const VIDEO_PUBLISHED = dateToNanoseconds(new Date('2026-10-24T21:32:58Z'));
const at = (m: number, s = 0) => VIDEO_PUBLISHED + BigInt(m * 60 + s) * 1_000_000_000n;
```

with a single epoch `[VIDEO_PUBLISHED, VIDEO_PUBLISHED + 2795 s]`
(`openttd/master-hellish-ai-vs-community.ts:77-78, 287-301`). A `DAY`-precision epoch
whose start equals its end is 0 ns long and contains none of those timestamps.

`addRuntimeKeyframe(minutes, seconds, …)` still exists
(`src/core/universe-builder.ts:741`) and emits `minutes*60 + seconds` **since zero** —
right for a zero-reference clock (the Beck pair), wrong for a publication-anchored
work. This universe is publication-anchored.

**Do instead:**

- one `primary` layer, one `publication` epoch of exactly 2795 s, `SECOND` precision,
  explicit `epochId` (#19);
- keyframes at `at(mm, ss)`;
- drop `narrative_span` unless date keyframes are actually added. The ticket contains
  none: its 1972–2026 history is *argued*, not *placed*. The 54-year span belongs in
  `realityAnchors` + the module header, not in an empty epoch.

### C-5 — `metadata.people` is not a thing

`UniverseMetadata` (`src/core/types.ts:722-727`) is
`{ canonicalName, creators: string[], released: Date, cultural_significance }`.
A repo-wide search for `people:` in `src/config/universes` returns one comment. There
is no `metadata.people`, no roster type, and no consumer.

Named people are modelled two ways in this corpus:

- `attribution.creators` — `CreatorRef[]` built by `creatorRefs(...)`
  (`src/core/creators.ts:72`), roles limited to `CreatorRole`
  (`src/core/types.ts:412-421`: director, writer, producer, host, researcher,
  historical_advisor, participant, actor, composer);
- keyframe `tags` for who appears in a moment.

The ticket's 21 people are **subjects of the argument**, not credits. Filing all 21 as
`Creators` would misuse `participant`; filing them nowhere loses the roster.

**Do instead (pick one, and say which in the PR):**

1. *Recommended:* add `metadata.people` as an explicitly documented, typed extension
   — `{ name: string; role: string; firstMentionSeconds: number }[]` — and assert it in
   the module test. `metadata` is `Partial<UniverseMetadata>` and literals already
   carry extensions (`metadata.chapters`, `metadata.externalIds`,
   `metadata.retrieval` in the openttd universe), so this is consistent, but it is a
   new convention and should be written down.
2. Keep only the credited maker (`The Drey Dossier`, roles `writer`/`producer`/
   `researcher`) in `attribution.creators`, and encode each named person as a tag on
   their first-mention keyframe.

### C-6 — `Attribution` is the wrong shape in §10

Actual (`src/core/types.ts:515-544`):

```ts
attribution: {
  copyright: { holders: string[]; year: number; status: 'active' | 'expired' | 'public_domain' | 'invalid' },
  creators?: CreatorRef[],
  citations_required: boolean,
  usage_restrictions?: string[],
  sources?: string[],
  public_domain?: boolean,
}
```

The ticket's `copyright_holder`, `copyright_year` and top-level `public_domain` do not
exist. Compiles only if written in the real shape.

### C-7 — The registration test in §13 already exists repo-wide

`src/config/__tests__/defined-vs-registered.test.ts` walks **every** module under
`src/config/universes`, imports it, and asserts every exported `universeId` is in
`allUniverses` *and* survives a real `UniverseRegistry` lookup (#27/#67/#153). A
namespace-local `doc-registration.test.ts` would duplicate it and, worse, give the
impression the new namespace is guarded when the guard is global.

**Do instead:** just spread the module into `youtubeUniverses`; add a *content* test
(temporal invariants, people roster, claim certainties) at
`tests/youtube/drey-theranos.test.ts`, mirroring `tests/youtube/beck-responder-clocks.test.ts`.

### C-8 — The three `parentUniverses` in §11 do not exist

`entertainment:youtube_video_essay`, `history:theranos`,
`us_government:biodefense_policy` are none of them registered ids or
`CommonUniverseIds` containers. Memberships are `UniverseId`s, are folded into
`CommonUniverseIds` by the registry (`src/config/universes/containment.test.ts`,
`src/config/universe-registry.ts:208`), and are required to be well-formed.

**Do instead:** use containers that exist:

```ts
connections: {
  natural: {
    parentUniverses: [
      CommonUniverseIds.US_HISTORY,     // history:united_states:founded
      CommonUniverseIds.US_GOVERNMENT,  // history:us_gov:founded
    ],
  },
}
```

Both are declared containers, not registered works, which the audit explicitly
accepts (`src/config/__tests__/generated-registration.test.ts:95-100`). `HOLLYWOOD_SYSTEM`
is available too but is about the studio system, not a YouTube essay — don't force it.
If a `history:theranos:2003-2018` universe is wanted, that is a second PR and a
second owner.

### C-9 — `graph.dangling` (#92) is not the mechanism here

The repo's dangling-parent audit is `generated-registration.test.ts`, and it only
covers the git-ignored `imported/` tree. Hand-written universes are not audited for
dangling parents. Referencing #92 in the ticket suggests the lore pipeline, not this
repo.

### C-10 — "36 keyframes" and "10 documents" are wrong; "21 people" is right

From the ticket's own tables: **34** keyframe rows (§4.3), **21** people (§5 — the
acceptance criterion is correct; an earlier draft of this note miscounted the table
header as a row), **13** documents (§6), **12** segments (§4.2). §12 says "36 keyframe
id + description" and §14 says "all 10 signatories". Fix the numbers in the
acceptance criteria or the test will encode a phantasy.

### C-11 — The thesis-keyframe significance contradicts C-12

C-12 says the thesis "must not inherit keyframe significance ≥ 0.9". Two keyframes
tagged `THESIS` carry 0.9 (`where_did_the_blood_go`, `ellison_fear_database_pattern`).
Either lower them (0.6 / 0.65 is defensible: the strongest documented claim in the
work is the patent chain, not the continuity thesis) or drop the rule. Recommended:
lower, and keep the rule — it is the difference between "documentary" and
"argument".

### C-12 — `fictionalizationDegree: 0.05` vs. `0.0`

Existing documentaries use `0.0` (openttd, Beck). The repo's own scale says 0.0 =
pure documentation. The ticket justifies 0.05 with "rhetorical staging and one
inference presented as near-certain". That is a real property, but the corpus records
it in `reality_correspondence.deviations` / claim certainty, not in this number.
Recommended: `0.0`, with the staging recorded as deviations; keep 0.05 only if the PR
says why this work differs from every other documentary in the corpus.

### C-13 — `plane_charge` / `RealityGradientAnalyzer`

`RealityGradientAnalyzer` exists (`src/utils/reality-gradient.ts`) and is used from
tests; there is no `plane_charge` field to set and nothing to hand-compute. Leave
`metadata.cultural_significance: 0.75` and let the gradient be derived in the test.

### C-14 — Gates

`package.json` scripts: `typecheck` = `tsc --noEmit` + test + scripts configs; `test` =
jest; `lint` = eslint. Node on this machine is `~/.nvm/versions/node/v24.21.0`
(the package accepts ^20.19 || ^22.13 || >=24). Run `npm run typecheck` and the
targeted jest files; `lint` is known to be noisy (#71), as the ticket says.

---

## 3. Proposed module shape

`src/config/universes/youtube/drey-theranos.ts`:

```ts
const VIDEO_PUBLISHED = dateToNanoseconds(new Date('2026-10-24T21:32:58Z'));
const RUNTIME_SECONDS = 2795;                       // 46:35, YouTube lengthSeconds
const at = (m: number, s = 0) => VIDEO_PUBLISHED + BigInt(m * 60 + s) * 1_000_000_000n;

export const theranosIsnAboutElizabethHolmesUniverse = {
  universeId: 'series:theranos_isnt_about_elizabeth_holmes:2026',
  type: UniverseType.SERIES,
  identifiers: { primary: '…', aliases: ['Theranos Isn\'t About Elizabeth Holmes.', 'youtube:PgWNQH4FWNI'] },
  realityRelation: { type: 'documentary', fictionalizationDegree: 0.0, realityAnchors: [/* §2 C-8 note */] },
  attribution: { copyright: { holders: ['The Drey Dossier'], year: 2026, status: 'active' }, creators: creatorRefs({ writer: ['…'], producer: ['…'], researcher: ['…'] }), citations_required: true, public_domain: false, usage_restrictions: [...], sources: [...] },
  layers: [{
    layerId: 'primary_layer',
    type: 'primary',
    epochs: { publication: { epochId: `${ID}:publication`, startTime: VIDEO_PUBLISHED, endTime: VIDEO_PUBLISHED + 2795n * 1_000_000_000n, precision: TimePrecision.SECOND } },
  }],
  temporalStructure: {
    segments: [ /* 12, contiguous, last ends at 2795 s */ ],
    keyframes: [ /* 34, at(mm, ss), type from §4, certainty where the ticket gave one */ ],
    windows: { strategy: 'scene_based' },
  },
  connections: { natural: { parentUniverses: [CommonUniverseIds.US_HISTORY, CommonUniverseIds.US_GOVERNMENT] } },
  metadata: {
    canonicalName: 'Theranos Isn\'t About Elizabeth Holmes.',
    creators: ['The Drey Dossier'],
    released: new Date('2026-10-24T21:32:58Z'),
    cultural_significance: 0.75,
    description: '…',                       // one paragraph, thesis attributed as interpretation
    externalIds: { youtubeVideoId: 'PgWNQH4FWNI' },
    chapters: [...],                        // only if the description supplies them
    people: [...],                          // §2 C-5, if option 1
    retrieval: { domain, format: 'video essay', subjects, charge_source, weight_source },
  },
};
```

**Annotation note.** Leave the literal unannotated, as every openttd video universe
does. `satisfies Universe` (or `: Universe`) is checked, and `Universe` requires
`identifiers`, `realityRelation`, `attribution`, `layers` **and** `epochs`; `epochs`
is also populated by the registry at load (`src/config/universe-registry.ts:152`).
A fresh object literal with a `metadata.people` extension also fails excess-property
checking under `satisfies`. Unannotated, the module stays assignable to `Universe`
in `allUniverses` and the extensions survive. (Verified: a two-field
`satisfies Universe` probe fails on exactly those missing members.)

Do **not** add a `subjective` thesis overlay yet: its
`reality_correspondence.to` would point at `history:theranos`, which is not
registered, and #112 §11.5's rule is that a dangling anchor is worse than an absent
one (`james/gibson/solar.ts:106-110`). Record the thesis deviations in the module
header + `metadata.description` and open a follow-up for the Theranos historical
universe.

---

## 4. Proposed `KeyframeType` mapping (34 rows)

| Runtime | id | Ticket type | Proposed | Note |
| --- | --- | --- | --- | --- |
| 0:29 | `ellison_cancer_vaccine_clip` | TESTIMONY | `PUBLIC_STATEMENT` | on-camera statement |
| 1:27 | `stargate_announcement_identified` | ANNOUNCEMENT | `ANNOUNCEMENT` | 1:1 |
| 2:26 | `fortress_loan_collateral` | FINANCIAL | `CONTRACT` | loan secured on patents |
| 2:46 | `softbank_buys_fortress` | ACQUISITION | `ACQUISITION` | 1:1 |
| 3:14 | `labrador_diagnostics_formed` | CORPORATE | `INCORPORATION` | 1:1 |
| 3:23 | `golden_diagnostics_transfer` | TRANSFER | `ACQUISITION` | patent assignment |
| 3:52 | `gothing_double_signing` | DOCUMENT | `CONTRACT` | the signed instrument |
| 4:16 | `mubadala_mgx_link` | CORPORATE | `INCORPORATION` | MGX co-founded |
| 6:19 | `where_did_the_blood_go` | THESIS | `MILESTONE` | `thesis` tag; sig → 0.6 (§2 C-11) |
| 9:12 | `murdoch_125m_disclosure` | DISCLOSURE | `PUBLICATION` | disclosed in the book |
| 11:38 | `six_meetings_endnote` | DOCUMENT | `MILESTONE` | endnote record |
| 13:04 | `encrypted_database_order` | COURT_ORDER | `RULING` | 1:1 |
| 14:23 | `holmes_verdict` | VERDICT | `RULING` | 1:1 |
| 14:34 | `restitution_452m` | SENTENCING | `RULING` | 1:1 |
| 16:44 | `theranos_board_roster` | PERSONNEL | `MILESTONE` | roster, not an event |
| 17:46 | `stargate_name_origin` | DISCLOSURE | `MILESTONE` | programme origin |
| 19:06 | `pat_price_sessions` | TESTIMONY | `MILESTONE` | session record |
| 21:36 | `ellison_cia_database` | CONTRACT | `CONTRACT` | 1:1 |
| 22:19 | `perry_controls_psychic_funding` | PERSONNEL | `MILESTONE` | appointment |
| 23:04 | `baxter_effect_biomonitoring` | DOCUMENT | `MILESTONE` | purchase list |
| 24:30 | `human_subjects_finding` | DOCUMENT | `RULING` | agency determination |
| 25:40 | `stargate_program_closed` | TERMINATION | `SHUTDOWN` | 1:1 |
| 26:21 | `lederberg_introduced` | PERSONNEL | `MILESTONE` | introduction |
| 27:39 | `lederberg_papers_online` | DOCUMENT | `PUBLICATION` | NLM posting |
| 29:43 | `quark_biotech_bridge` | INVESTMENT | `ACQUISITION` | SBI owns it by 2013 |
| 31:00 | `anthrax_letters` | ATTACK | `MILESTONE` | no ATTACK member exists |
| 33:14 | `biowatch_announced` | POLICY | `ANNOUNCEMENT` | programme launch |
| 34:36 | `ellison_fear_database_pattern` | THESIS | `MILESTONE` | `thesis` tag; sig → 0.6 (§2 C-11) |
| 35:28 | `first_patent_filed` | PATENT | `MILESTONE` | no PATENT member exists |
| 37:57 | `health_shield_patent` | PATENT | `PUBLICATION` | granted |
| 39:24 | `bagram_plan_shelved` | PLAN | `MILESTONE` | plan never executed |
| 40:23 | `walgreens_deployment` | DEPLOYMENT | `LAUNCH` | 1:1 |
| 41:24 | `oracle_cerner_oracle_health` | ACQUISITION | `ACQUISITION` | 1:1 |
| 42:15 | `patient_settlements` | SETTLEMENT | `RULING` | AG/court outcome |

`CONTRACT`, `MILESTONE`, `RULING` and `PUBLICATION` carry most of the weight. If that
feels like flattening, the right follow-up is an enum extension (e.g. `PATENT`,
`LEGAL_RULING`) argued on its own issue — not a silent reuse of `MILESTONE` in a
hundred-tag universe.

---

## 5. Rewritten acceptance criteria

- [ ] `isValidUniverseId(id)` passes; the id is unique in `allUniverses`; it is
      reachable from a fresh `new UniverseRegistry(new ConfigLoader())` — covered by
      `defined-vs-registered.test.ts`, no new barrel walk.
- [ ] `publication` epoch carries an explicit `epochId`, is exactly 2795 s long, and
      every keyframe timestamp falls inside it.
- [ ] 12 segments are contiguous 0 → 2795 s, no gaps, no overlaps (last end = 2795).
- [ ] `windows.strategy: 'scene_based'`, no `avgWindowSize`.
- [ ] 34 keyframes: `id`, `timestamp`, `significance`, `tags`, `type` (from §4),
      one-sentence `description`; `certainty` on every claim drawn from §8 of the
      ticket.
- [ ] Both `thesis`-tagged keyframes have significance < 0.9.
- [ ] `realityAnchors` use the `RealityAnchor` shape with ≥1 `evidence` string each;
      targets that are not registered carry `hydration: 'presumed'` and appear in
      `metadata.presumed` claiming no charge.
- [ ] C-13 (Ellison on the board, certainty 0.4) is not asserted in
      `metadata.description`; if recorded, it is `contradicts` with its evidence.
- [ ] C-14 ("first full day" vs "second day") is recorded verbatim in a deviations
      list, not silently normalised.
- [ ] 21 named people are carried by `metadata.people` (`name`, `role`,
      `firstMentionSeconds`).
- [ ] 13 documents in §6 exist as keyframes with signatory tags
      (`signed:andrea_gothing`, etc.).
- [ ] Attribution: holders, year, `citations_required: true`, non-empty
      `usage_restrictions`, ≥3 independent sources (video + mirror = one work).
- [ ] `npm run typecheck` clean; `npx jest tests/youtube
      src/config/__tests__/defined-vs-registered.test.ts` green.

---

## 6. Open questions, with a default

1. **Judicial name.** Not in the video; `U.S. v. Holmes` was N.D. Cal. 18-cr-258,
   Judge Edward Davila — verify before embedding, and if unverified, tag the keyframe
   `signatory:unnamed` rather than guessing.
2. **YouTube chapters.** The upload has a description chapter list (not checked in
   this pass). If present, prefer the platform's cuts over the analysis cuts for
   segment boundaries — they are the author's own partition.
3. **Embedded footage rights.** Default: link-only, no clip stills; the White House
   pool material is public domain but the Oracle archival and broadcast clips are not.
4. **`history:theranos` universe.** Deferred. Until it exists, no `parentUniverses`
   entry and no subjective overlay pointing at it.
5. **Enum extension (`PATENT`, `DOCUMENT`).** Deferred; §4 maps onto what exists.
6. **Two `Universe` interfaces.** `src/core/types.ts:109` and `src/temporal-system.ts:31`
   both export one, and both are imported (`src/zero-reference-queries.ts:1` uses the
   second). This module follows `core/types`, like openttd. Whether the second is a
   legacy surface to retire is a separate question, not this issue's.

---

## 7. Commands

```sh
export PATH="$HOME/.nvm/versions/node/v24.21.0/bin:$PATH"
npm run typecheck
npx jest tests/youtube src/config/__tests__/defined-vs-registered.test.ts
```
