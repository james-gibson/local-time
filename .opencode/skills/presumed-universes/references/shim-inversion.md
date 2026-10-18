# Worked example — inverting a shim registry into presumed originals

`mcp-lab/universes/` holds a registry of tool **shims**: a primed `grep`, decoys
for `grep` / `rg` / `find` / `sed`, and the PATH shim that delivers them. Each
declares what it replaces:

```yaml
- id: grep-primed
  kind: primed
  replaces-universe-id: technology:grep:1973
  replaces-keyframe: posix_grep_specification
  upstream: https://pubs.opengroup.org/onlinepubs/9699919799/utilities/grep.html
  replaces-binary: /usr/bin/grep
```

Five originals are referenced and none is declared. Before the inversion that was
reported as five *missing* references. After it, as five *presumed* universes:

```
shims:    6  (2 primed, 4 decoy)
declared: 6
presumed: 5  (referenced, no declaration — stubs emitted)
  technology:find:1971     <- find-decoy
  technology:grep:1973     <- grep-decoy, grep-primed
  technology:ripgrep:2016  <- rg-decoy
  technology:sed:1974      <- sed-decoy
  technology:sh:1971       <- lezz-path-shim
```

## What inversion actually recovers

From the `grep-primed` and `grep-decoy` entries alone, the stub for
`technology:grep:1973` gets:

| field | recovered from |
| --- | --- |
| `universe-id` | `replaces-universe-id` (verbatim) |
| keyframe id | `replaces-keyframe` — named by both shims, so it is corroborated |
| `identifiers.aliases` | `replaces-binary` (`/usr/bin/grep`) |
| `attribution.sources` | `upstream` (the POSIX spec) |
| inbound edges | the shims themselves, inverted |
| `derived-from` | `shim:grep-primed:2026`, `shim:grep-decoy:2026` |
| zero-point year | the trailing year in the id (`1973`) |

and it explicitly does **not** get: keyframes beyond the one named, segments, a
zero-point day, a `reality-gradient`, charges, a tensor, or `parentUniverses`.

The inversion is asymmetric on purpose — it recovers the *address and the stake*,
never the *content*. A stub that also invented content would be the invention the
skill warns against.

## The two edge types invert differently

```yaml
cross-references:
  - universe-id: "shim:grep-primed:2026"
    type: "SUPERSEDED_BY"
    confidence: 1      # a faithful replacement is a strong claim about identity
  - universe-id: "shim:grep-decoy:2026"
    type: "INVERTED_BY"
    confidence: 0.6    # a decoy claims inversion, not identity
```

`SUPERSEDES` reverses to `SUPERSEDED_BY` at full confidence: a primed shim asserts
it *is* the same tool. `PARODIES` reverses to `INVERTED_BY` at lower confidence: a
decoy asserts the original's output is what it subverts, which is a claim about
the original's keyframe rather than about the original's identity.

## The refusal that matters

The stub's plane is present, empty, and explains itself:

```yaml
plane:
  charges: []
  encoder: { real: null, imaginary: "presumed" }
  presupposes: []
  tensor: []
  inverse-of: null
  note: "Presumed, so no charges: a compendium with no plane cannot enter the
         charge graph (CONVENTIONS.md, 'absence is not a zero value'). Fill this
         block when the compendium is declared; do not fill it to silence the
         presumption."
```

An empty `charges` here is not an oversight and not a zero — it is the state, and
`plane gen` refusing a neutral compendium is the check working.

## Reproduce

```sh
python3 mcp-lab/universes/generate.py           # writes 6 shims + 5 stubs
python3 mcp-lab/universes/generate.py --check   # report only
python3 mcp-lab/universes/generate.py --no-presumed
```

## Tested against the real pipeline

Three candidates were promoted from presumed to declared — `grep`
(`technology:grep:1973`), `sed` (`technology:sed:1974`) and `find`
(`technology:find:1974`) — and run end to end through this repo's own toolchain.

```sh
# 1. KB markdown -> lore JSON   (mcp-lab is the staging KB root; kb/ is not a git repo)
node scripts/build-lore-json.js /Users/dev/projects/mcp-lab
#    Emitted 3, skipped 0 not enrolled

# 2. lore JSON -> local-time TypeScript
node scripts/import-lore-json.js /Users/dev/projects/mcp-lab/lore src/config/universes/imported
#    grep.json -> technology_grep_1973.ts
#    sed.json  -> technology_sed_1974.ts
#    find.json -> technology_find_1974.ts

# 3. the barrel registration guard
npm run test:scripts          # 13/13
npx jest src/config/__tests__ # 22/22, incl. generated-registration.test.ts

# 4. are they actually registered?
new UniverseRegistry(new ConfigLoader()); await r.initialize();
r.getUniverse('technology:grep:1973')   # REGISTERED
r.getUniverse('technology:sed:1974')    # REGISTERED
r.getUniverse('technology:find:1974')   # REGISTERED
```

Four things this surfaced that the stubs alone did not:

1. **`end: null` is refused.** The importer rejects a segment bound that resolves
   to neither a declared keyframe address/id nor an absolute ISO timestamp:

   > `segment "standardised_and_reimplemented" (end): (missing) matches no declared
   > keyframe address/id and is not an absolute ISO timestamp … Do NOT compute T±
   > offsets from the zero point: the addresses are ordinal labels, not a clock.
   > Refusing to emit segments that would silently collapse (james-gibson/local-time#35).`

   An open phase therefore needs a **stated horizon** (`2026-01-01T00:00:00Z`),
   not `null`. The generator now emits `HORIZON` everywhere it used to emit
   `None` — in the shim docs and the stubs as well as the originals.
2. **The enrolment flag is verified, not assumed.** With `local-time-sync: false`
   the vault run reported *26 emitted, 9 skipped not enrolled*; with the three
   candidates flipped to `true` the staging run reported *3 emitted, 0 skipped*.
   That is the toggle the whole skill turns on.
3. **One address was wrong.** The inversion recovered `technology:find:1971` from
   the shim registry, and the research corrected it to `1974` — find is Version 5
   (Programmer's Workbench), per Wikipedia and the OpenBSD/man7 `find(1)` HISTORY
   sections. The shim entries were updated to point at the corrected id. **The
   inversion recovers an address, and an address can be wrong**; only the
   declaration settles it.
4. **Registration is a second gate.** Import is not registration —
   `universe-registry.ts` dynamically imports `universes/imported/index.js` and
   reads `importedUniverses`, and `generated-registration.test.ts` exists because
   a module can be re-exported by the barrel yet omitted from that array. Passing
   the import is necessary and not sufficient.

Note `src/config/universes/imported/` is **git-ignored** ("the compendia live
under the kb's private `lore/` root and this repo is public"), so none of step 2's
output is committed here. The candidates are staged in `mcp-lab/lore/`; promotion
into `kb/lore` is a separate step through that project's own tools.

## Settling a wildcard: `technology:tty:*`

Asked to settle `technology:tty:*`, the answer turned out to be *do not guess the
wildcard — walk the traversal*. Two things fell out of it.

**The frontier has a source inversion cannot see.** `lezz-path-shim` replaces
"PATH assembly in `~/.zshrc`", and it referenced `technology:sh:1971`. Settling the
shell meant declaring it — and a declared compendium's own `presupposes` edge is a
reference too:

```
technology:sh:1977  presupposes: [technology:sh:1971, technology:tty:1971]
technology:tty:1971 presupposes: [technology:teletype:1963]
```

Declaring the shell put the terminal on the frontier; declaring the terminal put
the 1963 hardware there. No shim names any of them, so inversion alone would never
have produced them. The generator now builds the frontier from **shim references ∪
declared originals' `presupposes`** − declared:

```
presumed:  2
  technology:ripgrep:2016     <- shim:rg-decoy:2026
  technology:teletype:1963    <- technology:tty:1971
```

**The PATH referent was wrong, the same way `find`'s year was.** `PATH` as an
environment variable is a **Bourne shell** feature (1977), not a Thompson shell one
(1971) — the Thompson shell had no search path at all. So `lezz-path-shim` now
points at `technology:sh:1977`, and both shells are declared with a `SUPERSEDES`
edge between them. Two of the three declared corrections so far have been *wrong
addresses recovered by inversion*; that is the expected failure rate for a guess.

**And the containers were invented.** Declaring `tty`/`pty`/`sh` with
`parentUniverses: [TERMINALS]` / `[SHELLS]` failed:

```
● every declared parent in the tree resolves to a container
+ "technology:tty:1971 -> TERMINALS"
```

`SHELLS` and `TERMINALS` do not exist, and a container cannot come from a universe
module — `initializeHierarchies()` is a private static block of hard-coded roots
and `addHierarchy` is private. So an invented *container* is an invented *address*
one level up, caught by a test instead of a dangling edge. Fixed by using real
containers (`SOFTWARE_ENGINEERING`, `WORLD_HISTORY`) and filing the missing roots
as work (james-gibson/local-time#158).

**And one universe was invented outright.** `technology:pty:1983` was declared with
**zero inbound references** — nothing referenced it; it existed because the
wildcard made terminals salient. Every gate passed on it: build, import, 22/22
jest, registered. `generate.py` now reports grounding so the next orphan is
visible:

```
grounding: 6 of 6 originals referenced by something in the graph
  technology:sh:1977    <- shim:lezz-path-shim:2026
  technology:sh:1971    <- technology:sh:1977           (1 asserted, not referenced)
  technology:tty:1971   <- technology:sh:1971, sh:1977  (2 asserted, not referenced)
```

The counts matter more than the pass/fail. `tty` *is* reachable — the chain
terminates at a shim reference — but the last two hops are edges the model wrote
answering the wildcard, not references. Grounding catches the orphan and reports
the assertion depth; it cannot catch a plausible assertion. That is the limit, and
it is why the rule is about *why* a thing was declared rather than about whether it
resolves: **a declaration cites the reference that demanded it, or states that it is
a root — and a `*` is a question, not a reference.**

**The orphan was not deleted.** The first move was to remove `pty` and call absence
the honest state; that is wrong. Deleting a considered id collapses a *determined*
absence into an *undetermined* one — the mirror of `CONVENTIONS.md`'s "absence is
not a zero value". `pty` is now **rejected**: retained, with `demand: none`,
`provenance` (it came from the wildcard), `rejected-because`, and `revisit-if`.
Three states, not two-plus-a-hole (declared / presumed / rejected), and the rejected
entry is also the record of how far the star propagated — delete it and the artifact
reads as though the star never happened.
