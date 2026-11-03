# ADR 0004 — Entities are addressable before they are universes

- **Status:** Accepted
- **Date:** 2026-11-02
- **Related:** [#209](https://github.com/james-gibson/local-time/issues/209),
  [#207](https://github.com/james-gibson/local-time/issues/207),
  [#148](https://github.com/james-gibson/local-time/issues/148),
  [#74](https://github.com/james-gibson/local-time/issues/74),
  [#90](https://github.com/james-gibson/local-time/issues/90)

## Context

`#207` (the 2026 Texas student-union mailers) inventoried fourteen organizations and
people. The ticket could not land them: `UniverseType` had no `ORGANIZATION` or
`PERSON`, and `universe-ids.ts` had no creator for either. Rather than invent a type
under an `as unknown as Universe` cast, `#207` demoted the rows to `metadata.entities`,
kept the proposed ids verbatim, and marked every one `registered: false`. That was a
holding pattern, and `#209` owns the question.

The ticket offered two models and asked which was honest:

1. `organization` / `person` are `UniverseType`s.
2. Entities are a separate addressable table that universes reference.

The considerations that decide it:

- **A span, not a year.** An organization is `organization:<slug>:<founded|YYYY|…>`
  and a person is `person:<slug>:<born|YYYY|…>`. But six of the seven person rows in
  `#207` are reporters named in coverage, with no birth year. A model that requires a
  year cannot represent them without inventing one — the exact failure the ticket was
  written to stop.
- **`biography:` already exists.** It is a *work about* a person, with its own
  `realityRelation`. A `person:` universe is the person. Two different things were
  sharing one word.
- **Temporal layers are mandatory.** `UniverseBuilder.build()` refuses any temporal
  universe with no primary layer or temporal content. A person or an organization has
  an existence span, so this is not a reason to exclude them — it is a reason to give
  them a span, including the honest "start unknown" tokens.
- **Charge.** A `documentary` entity derives `+1`. If every mention becomes a
  universe, every event that names it gains an edge and the charge graph can
  double-count the same reality (#90). The plane question is downstream, but the
  vocabulary should not force the double count.
- **Containment.** An organization is a container (members, subsidiaries) *and* a
  child (of a jurisdiction). `#74` made containment one-owner/many-memberships, and
  that answer applies unchanged — but only if the entity has one address to own.

## Decision

**Both, with a boundary.**

1. **An entity is addressable first.** `organization:<slug>` and `person:<slug>` are
   branded `EntityId`s — not `UniverseId`s. They have no span, so
   `isValidUniverseId` rejects them and they can never be mistaken for a registered
   universe. A universe keeps the entities it names in a typed `entities` field.

2. **A span promotes an entity to a universe.** `entityUniverseId()` is the only
   conversion. It returns `undefined` without a span and otherwise mints
   `organization:<slug>:<span>` / `person:<slug>:<span>`. There is no `registered`
   flag: the presence of a span **is** the promotion, and there is one source of truth.

3. **The span vocabulary has honest unknowns.** `founded` and `born` mean "the entity
   exists; this record does not establish the year". The epoch is open at the start —
   the builder and the registry already allow it — and no year is fabricated. `*` means
   genuinely unbounded. A known year, `YYYY-YYYY` or `YYYY-present` bounds the epoch.

4. **The two kinds are `UniverseType`s.** A promoted entity is a real universe with a
   primary temporal layer, registered like any other. `ORGANIZATION` and `PERSON` are
   the two new members; `PERSON` is not `BIOGRAPHY`, and the old union of "person
   idioms" is renamed `PersonReferenceId` so one word no longer names two things.

5. **`held` rows stay mentions.** A single-source allegation is not promoted by
   writing it down: the three held `#207` rows keep a row, carry `held: true`, and
   have no span, so they cannot be registered as facts.

6. **The id namespaces cannot collide.** Every declared universe id ends in a year or
   a span; entity ids are two segments. `organization` and `person` are added to
   `RESERVED_STUDIO_TOKENS`, because FILM is the generic three-segment pattern and a
   new namespace that is not reserved reads as a film (#50, #57).

### Jurisdiction is a fact, not an id segment

A corporation is formed in one jurisdiction and may be headquartered, licensed,
registered or represented in many others. None of those facts need be known when the
entity is first recorded. So the id stays `organization:<slug>:<span>` and the facts
live in an optional `organizationProfile`:

```ts
// entry time — the legal entity, nothing about where
organization:acme_llc:2020-present

// later — the same id, now with two jurisdiction facts
organizationProfile: {
  incorporatedIn: 'US-WY',
  registrations: [
    { jurisdiction: 'US-WY', kind: 'incorporation', from: '2020-03', status: 'active' },
    { jurisdiction: 'US-TX', kind: 'foreign_registration', from: '2021-06', status: 'active' },
  ],
}
```

Two failure modes are being avoided:

- **A required jurisdiction invents one.** If the id demanded `organization:<jurisdiction>:…`,
  an entry that did not know the formation state would have to guess, and the guess
  becomes the address everyone else cites.
- **A jurisdiction in the id renames on every new grant.** A Wyoming LLC registering in
  Texas would move from one id to another, dangling every reference — the opposite of
  what a standard id is for.

Codes are ISO 3166-1 alpha-2 (`US`, `GB`) and ISO 3166-2 (`US-WY`), normalised and
shape-checked but not enumerated, so the vocabulary does not go stale the way
`RESERVED_STUDIO_TOKENS` did. A registration may also carry the issuing body and its
number (`issuer`, `identifier`) — a state board, a USPS permit — because those arrive
with the grant rather than with the entity. A genuine name collision is disambiguated
deliberately in the slug at first entry, never by appending a jurisdiction.

## Consequences

- `#207`'s fourteen rows move from `metadata.entities` (behind an
  `as unknown as Universe` cast) into the typed `entities` field. Eleven carry a span
  and are registered under `src/config/universes/entities/`; three held rows do not.
- The registry folds every universe's `entities` into one table:
  `getEntity`, `getEntities(kind)`, `getPromotedEntities()`. An entity named by two
  records has one address, and a disagreement is reported rather than merged.
- A person can now be referenced by `person:<slug>:<span>` as well as by
  `biography:` / `personal:`. `CreatorRef.personId` accepts all three
  (`PersonReferenceId`); `isPersonUniverseId` now means the `person:` namespace and
  `isPersonReferenceId` means the union.
- Promotion is reversible in the model, not by editing a flag: removing a span
  demotes the row, and the universe module is deleted with it.
- `organizationProfile` holds formation, headquarters and per-jurisdiction grants. A
  fact that arrives after entry changes the profile, never the id, so no reference
  dangles. The model can represent a company formed in one jurisdiction and licensed in
  any number of others without a second address.
- **Not decided here:** whether an entity universe's charge duplicates an event's
  edge (#90). The vocabulary no longer forces the double count; the plane work is
  still open.
