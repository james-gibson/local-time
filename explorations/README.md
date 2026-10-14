# Explorations — index and provenance

These five files are the **pre-implementation design transcripts** (2026-10-10) for the Local Time
Universe System. They are the rationale behind much of `src/core/types.ts`, and several open
issues were first posed here.

They are kept because the codebase implements a large fraction of them and then stops. Without
this index, the un-implemented remainder reads as new ideas rather than unfinished work — three
issues filed during the #27/#67/#70/#73 cycle (#74, #75, #76) were re-derivations of designs
written down here.

**Citation convention:** `explorations/<file>.md:<line>` or `:<start-end>`.

## The files

| File | What it is |
|---|---|
| `prompt.md` | The specification prompt: architecture, ID/address formats, window alignment, reference types, attribution, precision scales, and the Back to the Future test cases. |
| `types.md` | The type definitions as originally written, plus two `legal:` usages, plus a **Challenges** list (`:559-616`) that is the origin of several open issues. |
| `proposal.md` | Window alignment across universe types: shareable windows, `WindowAlias`, semantic window relationships, hierarchy. |
| `multi.md` | Multi-domain temporal references: one reference anchored in several domains at once. |
| `example.ts.md` | Layered reality and recursive references; works as first-class temporal nodes; addressing; networks. |

## Constructs: designed → in code → tracked

| Construct | Designed at | In code today | Issue |
|---|---|---|---|
| `Universe`, layers, epochs | `types.md:19-30` | `src/core/types.ts` | — |
| `UniverseIdentifiers` (primary/aliases/alternates/imdb/isbn/doi/patent) | `types.md:32-40` | `src/core/types.ts` | — |
| `UniverseIdentifier` union (film/historical_event/personal_experience + `privacy`) | `types.md:42-48`, `example.ts.md:49-55` | `UniverseIdentifier` declared; `privacy` not modelled | — |
| `RealityRelation` / `RealityAnchor` / `fictionalizationDegree` | `types.md:50-64`, `example.ts.md:57-77` | `src/core/types.ts`; `RealityGradientAnalyzer` | — |
| `Attribution` incl. `historical_advisors` | `types.md:66-81` | `src/core/types.ts` | — |
| `TemporalLayer.type` (`primary \| meta \| recreation \| subjective`) | `types.md:83-85` | `src/core/types.ts` | — |
| `TemporalLayer.contains` | `types.md:87` | declared, unused | — |
| `TemporalLayer.reality_correspondence` | `types.md:88-92`, `example.ts.md:152-167` | used **once**, `savingPrivateRyanUniverse.ts:88` | **#75** |
| `TemporalLayer.subuniverses` | `types.md:93`, `example.ts.md:198-217` | declared, **zero** uses | **#74** |
| `TemporalStructure` / `Segment` / `Keyframe` / `WindowingStrategy` | `types.md:106-138` | `src/core/types.ts` | — |
| `TemporalWindow` / `WindowAlias` | `types.md:147-161`, `proposal.md:15-59` | declared; `window-search.ts` reads `universe.temporalWindows` but **no universe fills it**; `WindowAlias` unused | **#82** |
| `ZeroReferenceEpoch` | `types.md:163-169` | `src/core/types.ts`; `zero-reference-*` | #35, #38, #39 |
| `TemporalReference` / `TemporalAnchor` / `AnchorContext` / `ReferenceMetadata` | `types.md:171-197`, `multi.md:35-64` | `src/core/types.ts`; used in `us-gov/hydrological.ts`, `cybersecurity/access-control.ts`; MCP prompts instruct it | — |
| `ReferenceChain` / `ChainLayer` / `ReferenceNode` / `ReferenceConnection` | `types.md:199-228`, `example.ts.md:223-277` | declared; only `utils/reference-helpers.ts:84` `createTolkienInfluenceChain()`, itself unused | — |
| `SpecificMapping` (incl. `tolkien_acknowledged`) | `types.md:230-235`, `example.ts.md:260-273` | declared, **zero** uses | #82 (noted) |
| `UniverseType` enum | `types.md:241-254` | `src/core/types.ts`, extended (`TECHNOLOGY`, `TECHNICAL_*`, `ABSTRACT_CONCEPT`) | — |
| `ReferenceType` enum | `types.md:256-298`, `example.ts.md:282-303` | `src/core/types.ts`, extended (`FULFILLS_PROMISE`, frame-derived) | — |
| `UniverseNetwork` / `NetworkEra` | `types.md:309-325`, `example.ts.md:663-716` | `UniverseNetwork` implemented; **`NetworkEra` unused** | — |
| `WindowAlignment` | `types.md:327-336`, `proposal.md:141-201` | declared **twice**: `src/core/types.ts` and `src/zero-reference-queries.ts:24` (different shapes) | #82 |
| `TemporalReferenceGraph` / `TemporalNode` / `TemporalEdge` | `types.md:338-355`, `multi.md:307-328` | not implemented | #82 (noted) |
| `TimePrecision` | `types.md:357-367` | `src/core/types.ts` | — |
| `TemporalAddress` (structured) | `types.md:12-17` | not implemented as such; addressing is a string | #38 |
| Works as temporal nodes (runtime / narrative / production epochs) | `example.ts.md:426-530` | partial: layers + epochs; `robin-williams.ts` models a runtime epoch | — |
| Address formats — **two, conflicting** | `prompt.md:95-99` (dot) vs `example.ts.md:536` (colon) | `src/addressing/zero-reference-addressing.ts` (colon, fixed-count slice) | **#38** |
| Semantic window relations (`WindowRelationship`) | `proposal.md:204-232` | not implemented | #82 |
| Window hierarchy (`WindowHierarchy`, `cal:1916` → months/quarters/named periods) | `proposal.md:264-285` | not implemented | #82 |

## Challenges (`types.md:559-616`) → tracked

The Challenges list is the clearest statement of intent in the corpus. Each item, and where it
stands:

| Challenge | Designed at | Today |
|---|---|---|
| Timestamps should read as `new localtime.utc(1970,0,0)`, not `BigInt(Date.UTC(...)) * 1000000n` | `:561-563` | not built; raw bigint-nanosecond construction throughout. Range limits documented in `docs/adr/0001-sqlite-timestamp-storage.md` |
| "Universe id's are not plain strings, they have inherent meaning … should actually be typesafe" | `:564-575` | branded types exist; **validation is a pass-through** → **#50**, **#70**, **#51** |
| "Storage of event metadata … will probably require a sqlite db (via prisma)" | `:576-577` | `prisma/schema.prisma` exists and is unused → **#58** |
| No prompt tells a model how to craft a universe object | `:578-582` | `kagi.md` (merged #78); `src/config/mcp-prompts/` |
| Predictable references to future (uncreated) entries; "the structure of these id's to prevent future data corruption" | `:583-598` | `TemporalKeyframe.targetUniverseId` deferred resolution (#3); depends on stable ids → **#51** |
| Types lack comments; a `Partial<Universe>` should be explainable in plain English | `:599-603` | largely addressed |
| File organisation for "wild" fan-fic examples, with tests like "can Ash battle before catching his first Pokémon?" | `:604-608` | `src/config/universes/<namespace>/` + `*-registration.test.ts` |
| "We lean on a lot of magic strings" | `:609-610` | id factories + `CommonUniverseIds`; collisions remain → **#51** |
| "It's currently unclear what the difference between a network and a universe is" | `:611-616` | `UniverseNetwork` vs `Universe` still uncontrasted in docs |

## The queries the design was built to answer

These are the success criteria (`prompt.md:312-321`, `example.ts.md:718-749`, `proposal.md:224-231`,
`multi.md:338-343`) and they are what the retrieval work (#76) and window alignment (#82) exist to
serve:

- "Find all 1916 references across every universe" — `proposal.md:224-231`
- "Find all personal experiences from 1916 that overlap the Battle of the Somme" — `proposal.md:237-250`
- "Find all war films that claim historical accuracy *but* have documented deviations" — `example.ts.md:310-318`
- "Find scenes at the 87% mark of their runtimes" — `example.ts.md:730-738`
- "Find all anachronisms / temporal paradoxes in BTTF" — `prompt.md:306-310`
- "Trace the influence of Star Wars through movie references" — `multi.md:342`

## Dormant constructs (one list, so "unused" is legible)

`subuniverses` (#74) · `reality_correspondence` (#75) · `WindowAlias` + `Universe.temporalWindows`
(#82) · `WindowRelationship` / `WindowHierarchy` (#82) · `SpecificMapping` · `NetworkEra` ·
`TemporalReferenceGraph` / `TemporalNode` / `TemporalEdge` · the duplicate `WindowAlignment`
declaration · `TemporalAddress`

## A note on the pattern

Almost every dormant construct is **declared and typed but never populated**. That is the same
failure mode as #27/#67 in the registry: the shape ships, the data does not follow, and nothing
fails. A construct with no producer should either get one or be deleted — this index exists so the
next reader can tell which is which.
