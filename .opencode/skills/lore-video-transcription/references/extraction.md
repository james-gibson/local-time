# Getting the transcript out of a video

Measured 2026-10-26 on the first test case, `youtube:G5dFEqC46rw` (10:15, auto
captions only). Commands are the ones that actually ran, not an approximation.

## 1. Install `yt-dlp` without breaking the system Python

Homebrew's Python is externally managed (PEP 668), so a plain `pip install --user` is
refused. A throwaway venv is the short path and leaves nothing behind:

```sh
cd "$TMPDIR"
/opt/homebrew/bin/python3.14 -m venv ytenv
./ytenv/bin/pip install --quiet yt-dlp
./ytenv/bin/yt-dlp --version        # 2026.10.21
```

`brew install yt-dlp` works too but pulls more than the task needs. `ffmpeg` is **not**
required for captions or metadata; it is only needed if you are going to run your own ASR.

## 2. Take metadata and both caption tracks in one call

```sh
mkdir -p vid && cd vid
../ytenv/bin/yt-dlp \
  --skip-download \
  --write-auto-subs --sub-langs "en-orig,en-US" --sub-format json3 \
  --write-info-json \
  "https://youtu.be/G5dFEqC46rw"
```

What arrives:

| file | what it is |
| --- | --- |
| `*.info.json` | the extractor's whole record: `videoDetails`, `chapters`, `upload_date`, `timestamp`, `duration`, counts, description |
| `*.en-orig.json3` | the original-language auto track, word-group events with `tStartMs` / `dDurationMs` |
| `*.en-US.vtt` | the same engine's English track, re-rendered with punctuation — `--sub-format json3` is not available for this one |

Notes that cost time if you assume otherwise:

- `--write-auto-subs`, not `--write-subs`. `--write-subs` writes **nothing** here: the
  channel publishes no manual track, and the absence looks like a network failure.
- The `--list-subs` output is dominated by auto-translated languages. The ones that matter
  are `en-orig` (what was said) and `en-US` (the same audio, punctuated).
- The run warns `No supported JavaScript runtime could be found … Only deno is enabled by
  default`. Captions and metadata still extracted. Treat the warning as a limitation on
  *formats*, not a failure.
- There is no impersonation target on this machine; that warning is also harmless for
  captions.

## 3. Read the metadata, not the page

`info.json` is authoritative and already in UTC-epoch form:

```sh
./scripts/read_captions.py . --info
```

| field | meaning | trap |
| --- | --- | --- |
| `id` | the video id | — |
| `timestamp` | publication as epoch **seconds** | already UTC; `1683745208` = `2023-05-10T19:00:08Z` |
| `upload_date` | `YYYYMMDD` in **UTC** | the watch page shows `-07:00`; `12:00:08-07:00` is `19:00:08Z` |
| `duration` | `videoDetails.lengthSeconds` | the player response also carries a rounded `616` for a 615 s video — use `duration` |
| `chapters[]` | `start_time` / `end_time` / `title` in seconds | this is the segment map; do not re-parse the description |
| `view_count`, `like_count` | point-in-time | record `metricsAsOf`; never present as a property of the work |

The oEmbed endpoint is a useful second opinion for `title`, `author_name` and
`author_url`, and it needs no auth:

```sh
curl -s "https://www.youtube.com/oembed?url=https://youtu.be/G5dFEqC46rw&format=json"
```

## 4. Parse the track as events, not sentences

```sh
./scripts/read_captions.py .                  # mm:ss.s<TAB>line
./scripts/read_captions.py . --from 8:30 --to 8:50
./scripts/read_captions.py . --words          # counts, first/last cue
./scripts/read_captions.py . --gaps           # pauses > 3 s: music, B-roll, chapter seams
```

The json3 shape is one event per phrase fragment:

```json
{ "tStartMs": 23120, "dDurationMs": 1610,
  "segs": [{ "utf8": "told you that it wasn't random these" }] }
```

Three things to hold onto:

1. **An event is not a sentence.** `tStartMs` is where the engine began a *phrase*. Reflow
   events into paragraphs and read the paragraph's start, and the offset moves by seconds.
   Use the event that contains the words you are keyframing.
2. **Empty events are line breaks, not data.** 510 events, 255 with text, in the test case.
3. **`[Music]`, `[Applause]` and bare gaps are content markers.** They are how the track
   tells you a section is not speech — and they are how the last keyframe's position can be
   distinguished from the outro.

### The tail is the trap that matters

The test case's final events:

| `tStartMs` | `dDurationMs` | text |
| --- | --- | --- |
| 587.24 | 5.68 | `gravity but uh you see I never studied` |
| 589.92 | 3.00 | `law` |
| 595.90 | 18.36 | `[Music]` |

So: the last **spoken** line is at 589.92 s, the last **text event** is an outro music cue
at 595.90 s, and the last event **ends** at 614.259 s. A naive "last cue" — the maximum of
`tStartMs + dDurationMs` — reports 614.259 s as if it were speech and puts the end of the
essay 25 s too late. Take the runtime from `info.json` and the last word from the last
non-music event; state both.

## 5. Cross-check the two tracks

The two renderings are the same ASR engine with different post-processing, which is weaker
than two independent ASRs but still enough to localise errors. Compare word counts and
search both for the phrase you intend to quote:

```sh
./scripts/read_captions.py . --words      # en-orig: 255 events, 1,652 words
# en-US vtt: 1,630 words, punctuated, hyphenated
```

In the test case the two disagreed in exactly two places, and both disagreements were
findings rather than noise:

| en-orig | en-US | reading |
| --- | --- | --- |
| `that there's a problem audacious bacon powder` | `that there's a problem. "A dash of baking powder…"` | a quoted cartoon line; the en-US track recovers it **and marks it as a quotation** |
| `butt monkey is a TV Tropes term` | `butt-monkey is a TvTropes term` | spelling/hyphenation only; neither track has the essayist's own spelling |

Record both renderings as `captionArtifacts`. Do not silently adopt the nicer one: the
en-orig token is what a text search will find, and the disagreement is the measurement.

## 6. When there is only one track, or no track

- **One track only** — you still have offsets, but no cross-check. `certainty` on every
  keyframe drops (0.8), and `metadata.verification.limits` must say the transcript is
  single-source.
- **No captions at all** — do not invent offsets. Either run ASR yourself and record the
  model, or place keyframes at the publication instant and say in the epoch description that
  no timed transcript exists. A universe with no internal offsets is honest; a universe with
  guessed offsets is not.
- **Multi-speaker audio** — auto captions carry no speaker labels. A single-narrator essay
  is safe. Anything with dialogue needs a diarisation pass or per-line attribution left
  explicitly unresolved.

## 7. Keep the raw files out of the repo

Captions are copyrighted material and are not needed to compile the universe. Work in a
temp directory, commit only the measurement (`metadata.verification`) and short
quotations. `attribution.usage_restrictions` should say so in the module.
