---
name: lore-video-transcription
description: "Turn a video — a YouTube URL, a video essay, a lecture, a clip — into a local-time universe whose keyframes are measured offsets on the video's own clock, and, when the video is a source rather than the work, into a lore doc that enrols in the sync. Use when asked to transcribe a video, add a YouTube video or essay to local-time or lore, build a universe from a transcript, place keyframes inside a video's runtime, quote what a video says at a timestamp, or decide whether a video's record belongs in the vault or in the library. Covers caption acquisition with yt-dlp, the two-track cross-check, the publication-instant epoch, chapter-derived segments, the presumed-anchor ledger for the works a video analyses, and the caption artifacts that make a transcript look more exact than it is."
---
# Video → universe

A video is a clock. Its publication instant is zero, its runtime is the extent, and every
claim in it has an offset. Transcription is the act of putting claims on that clock — not
of producing prose that resembles the audio.

The work is the unit. A 10-minute essay gets a universe whose keyframes are what it says at
`T+mm:ss`; the *history it talks about* is a different universe, referenced and not
restated. Two videos that share audio get two clocks and a drift record, not one merged
timeline (`youtube/beck-responder-clocks.ts`).

## Contract

**In:** a video URL (or an already-downloaded caption track) and, optionally, a target
destination.

**Out:** three things.

1. A measured metadata block — publication instant, runtime, chapters, instrument list,
   and the limits of what the measurement proves.
2. A universe authored in the destination chosen in Step 0, with keyframes at offsets the
   transcript supports.
3. A test that pins the clock: gapless segments, keyframes inside the epoch, and the
   specific claims the record makes in prose.

**Hard rules.**

- **No offset without a cue.** If the transcript has no timings, the keyframe sits at the
  publication instant and the epoch says so. A plausible-looking `T+03:12` that came from a
  paragraph start is worse than no timestamp.
- **A quote is a rendering, not a transcript.** Say which track it came from. Where the two
  tracks disagree, keep both (`metadata.captionArtifacts`).
- **The essay's argument is an interpretation, not a finding.** `realityRelation.type` is
  `interpretation`, `fictionalizationDegree` is 0, and the claims live in
  `metadata.interpretations` at their own standing.
- **Do not re-transcribe when the source already did.** A ticket transcript or a published
  description is a source with a name; quote it as such and drop `certainty`.
- **Captions never enter the repo.** Only measurements and short quotations do.

## Step 0 — choose the destination before fetching anything

| | Path B — authored module | Path A — enrolled lore doc |
| --- | --- | --- |
| **when** | the video **is the work**: an essay, a clip, a response, a lecture whose claims you want addressable | the video is **evidence for a compendium** that already belongs in the vault, and you want a prose record of it |
| **where** | `src/config/universes/<namespace>/<slug>.ts` (+ barrel, + `tests/<namespace>/`) | `<kb>/lore/<slug>.md` with `local-time-sync: true` |
| **how it reaches the registry** | you spread it into the namespace barrel | `scripts/sync-lore.sh` → `src/config/universes/imported/` |
| **keyframes** | absolute instants: publication + offset | zero-reference addresses (`T+00:03:12`) resolved by the importer |
| **authority** | you measured it | the frontmatter is the source of truth; the JSON is downstream |
| **worked example** | `youtube/cartoon-physics.ts`, `youtube/drey-theranos.ts` | `lore/local-time.md` → `imported/personal_local_time_2026.ts` |

**Default to Path B when you were asked to "transcribe a video".** A video's universe is
derived from its audio, not from the vault, so enrolling it would produce a generated twin
of a module you already wrote — the exact duplication the Beck doc refused
(`lore/youtube-beck-responder-drift.md`, `local-time-sync: false`). Path A is for a
compendium whose evidence happens to be a video.

For Path A, the markdown is **not** yours to edit with a file tool: load the
`open-knowledge` skill and use the OK MCP tools. The rest of this skill (measurement,
offsets, artifacts) applies unchanged; only Step 4's shape differs.

## Step 1 — measure the work

```sh
cd "$TMPDIR"
/opt/homebrew/bin/python3.14 -m venv ytenv && ./ytenv/bin/pip install --quiet yt-dlp
mkdir -p vid && cd vid
../ytenv/bin/yt-dlp --skip-download \
  --write-auto-subs --sub-langs "en-orig,en-US" --sub-format json3 \
  --write-info-json "https://youtu.be/<id>"
```

`references/extraction.md` has the full field map, the PEP 668 workaround, and what each
warning means. The three values that go straight into the module:

- `info.json` → `timestamp` (epoch **seconds**) is the publication instant, already UTC.
  The watch page shows the channel's local offset; `upload_date` is **UTC**.
- `info.json` → `duration` is `videoDetails.lengthSeconds`. The player response may carry a
  rounded value (615 vs 616 on the test case). Use `duration`.
- `info.json` → `chapters[]` is the segment map, in seconds. Do not re-parse the
  description.

## Step 2 — take the transcript twice

```sh
./scripts/read_captions.py . --info      # metadata + chapters
./scripts/read_captions.py .             # mm:ss.s<TAB>line
./scripts/read_captions.py . --words     # event/word counts, first and last cue
./scripts/read_captions.py . --gaps      # pauses > 3 s: music, B-roll, chapter seams
```

The bundle's `scripts/read_captions.py` is the parser this skill was written against. It is
stdlib-only, and it prints *cue starts*, which is what a keyframe offset must use.

Read the two tracks against each other. They are the same engine with different
post-processing — weaker than two ASRs, strong enough to localise an error, and the
disagreements are usually findings:

| disagreement | what it means |
| --- | --- |
| nonsense vs a sensible phrase | an ASR error at that cue; adopt the sensible one **and** keep both |
| quotation marks appear in one track | the narrator is quoting a clip; the other track has no voice marker at all |
| hyphenation / capitalisation | neither track has the author's spelling; state which form the record uses |

## Step 3 — place the offsets

1. **Take the cue that contains the words you are keyframing**, not the paragraph or the
   chapter it sits in. A chapter boundary is a segment edge, not a keyframe.
2. **Chapters become segments**, gapless, first start = publication instant, last end =
   runtime. Export the chapter list as data and derive both the segments and the metadata
   copy from it, so the two cannot drift.
3. **The tail is not the end.** The last event may be an outro `[Music]` cue with a long
   duration; the last *spoken* line is earlier. Record the runtime, the last spoken cue and
   the track tail separately.
4. **`certainty` is the resolution of the offset**, not doubt about the content. Auto
   captions resolve to about a third of a second: 0.9. Metadata-derived instants: 1.0.
   Single-track transcripts: 0.8.
5. **Keyframes must strictly increase** and sit inside `[start, end)`. If two claims share
   a cue, they share a keyframe.

## Step 4 — author the universe

Path B shape, from `youtube/cartoon-physics.ts` (the worked example):

| field | what it carries |
| --- | --- |
| `universeId` | `series:<slug>:<year>`, produced by `createSeriesUniverseId`; `series:` because `UniverseType` has no video-essay member |
| `type` | `UniverseType.SERIES` |
| `realityRelation` | `interpretation` at `0.0`, anchors = the works it analyses |
| `layers[0].epochs.runtime` | `startTime` = publication, `endTime` = publication + runtime, `TimePrecision.SECOND` |
| `temporalStructure.segments` | chapters, `type: 'phase'`, gapless |
| `temporalStructure.keyframes` | one per claim, `timestamp` = publication + offset, `KeyframeType.PUBLIC_STATEMENT` for claims and `RELEASE` for the upload |
| `metadata.verification` | `performed`, `instruments`, `measured`, `limits` — the measurement's honesty budget |
| `metadata.captionArtifacts` | where the tracks disagree, with both renderings |
| `metadata.interpretations` | the essay's argument, its `statedAtSeconds`, and its standing |
| `metadata.presumed` | ledger of the undeclared works, mirroring the anchors |
| `connections.natural.parentUniverses` | one or more `CommonUniverseIds` containers |

**Presumed anchors.** A video names works, people and sites the corpus has not declared.
Keep the references visible: `hydration: 'presumed'` on each anchor, the same ids in
`metadata.presumed` with `contributesCharge: false`, and a test asserting each is still
unregistered. The day one is authored, the suite fails and you flip the marker. See the
`presumed-universes` skill for why an undeclared compendium must not enter the charge graph.

**Do not invent an id to hold a reference.** Use the namespace the thing would own
(`series:` for a work, `history:` for an event, `channel:` for a channel) and the year as a
naming anchor. If you cannot defend the year, you cannot defend the id — drop the anchor and
say in `uncertaintyNotes` that the reference was left out.

Path A shape is the frontmatter contract: `title`, `description`, `type`,
`universe-id`, `reality-gradient`, `identifiers`, `attribution`, `reality-anchors`,
`zero-reference` (epoch + addresses + keyframes + segments), `cross-references`, and
`local-time-sync: true`. The `plane:` block is filled at declaration time or explicitly
declined — see `CONVENTIONS.md` in the vault and the `zero-reference` skill.

## Step 5 — register and guard

1. Spread the universe into its namespace barrel — for YouTube, `youtubeUniverses` in
   `src/config/universes/youtube/index.ts`. A module that nothing imports is built,
   validated and silently discarded (#27, #67, #98).
2. Write `tests/<namespace>/<slug>.test.ts`. The repo-wide
   `src/config/__tests__/defined-vs-registered.test.ts` proves registration; your test
   proves the record is *coherent*: id via the factory **and** the domain guard, one epoch,
   gapless segments, strictly increasing in-epoch keyframes, at least one keyframe per
   chapter, the thesis present as a keyframe, presumed ids still unregistered, and the
   artifact positions.
3. Do not add a `youtube.ts` beside the `youtube/` directory: a file wins over a directory
   and silently excludes the subtree (#67).

## Step 6 — prove it

```sh
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm use
npm run typecheck && npm run lint && npx jest && npm run test:scripts
```

The `local-time-verify` skill lists the traps that make a local run lie. Run the **full**
suite, not the one new file; the registration guards only see the whole tree.

## The traps, in one place

| trap | what it does | what to do |
| --- | --- | --- |
| `--write-subs` | writes nothing when only auto captions exist; looks like a network failure | `--write-auto-subs` |
| `approxDurationMs` / player `lengthSeconds` | rounded (616 for 615 s) | take `info.json`'s `duration` |
| `uploadDate` offset | page shows `-07:00`; `upload_date` is UTC | convert once, record `...Z` |
| last event `tStartMs + dDurationMs` | an 18 s `[Music]` cue presents as the last spoken line | record last *spoken* cue and track tail separately |
| reflowed paragraph start | moves a keyframe by seconds | keyframe the cue that contains the words |
| `[Music]` / `[Applause]` | are content, not noise | keep them; they mark non-speech sections |
| two auto tracks | differ in punctuation and in what they recover | cross-check, record both, never silently pick |
| quoted cartoon dialogue | neither track marks the voice switch reliably | mark quotes as renderings; do not attribute them to the narrator |
| a work with no declaration | an anchor that looks verified | `hydration: 'presumed'` + ledger + failing-when-hydrated test |
| enrolling a video's own module | a generated twin of the same ids | `local-time-sync: false`; author the module |

## Where else to look

- `src/config/universes/youtube/` — five records: two clocks and a drift
  (`beck-responder-clocks.ts`), the transcript of the passage they share
  (`beck-pamphlet-transcript.ts`), the doublespeak cut (`beck-doublespeak.ts`), a
  publication-anchored essay (`drey-theranos.ts`), and this skill's own test case
  (`cartoon-physics.ts`).
- `references/extraction.md` — commands, metadata field map, track comparison, tail trap.
- `scripts/read_captions.py` — the parser, and the only tool this skill needs.
- `local-time-universe` (hub) — registration, builder API, the lore pipeline.
- `local-time-ids` — prove the id with a factory and a domain guard before writing it.
- `local-time-verify` — the gates, and why a single-file pass is not a proof.
- `presumed-universes` — why an undeclared compendium carries no plane and no charge.
- `42i-prep` — run it before a universe creation; it hands over a scaffold and the cached
  `chunk_id`s.
- The `zero-reference` skill in the `kb` vault — Path A's frontmatter contract.
- `kagi.md` — the universe-generator prompt, for fields this skill does not cover.
