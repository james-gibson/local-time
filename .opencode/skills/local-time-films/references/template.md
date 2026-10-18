# Film universe — templates

Fill these in. Placeholders are `<<…>>`. Every assertion in the test template
exists because some shipped film got it wrong.

## 1. The literal (the default for a film)

Reach for this when the film needs a `DISTRIBUTED_BY` edge, per-segment prose, an
explicit `epochId`, `usage_restrictions`, or metadata beyond `UniverseMetadata`.

File: `src/config/universes/films/<<kebab-title>>.ts`

```ts
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { Universe, UniverseType, TimePrecision } from '../../../core';
import { distributedByRef, resolveFilmStudio } from '../studios';

/**
 * <<Title>> (<<year>>) — <<Production cos.>> / <<Distributor>>.
 *
 * james-gibson/local-time#<<issue>>. <<One sentence: what this film is, and what
 * it is NOT (e.g. not the game, not the earlier trilogy).>>
 *
 * ## Id
 *
 * <<The ticket proposed <id>. Why the canonical id differs — measure it, do not
 * accept it. See the local-time-ids skill.>>
 *
 * ## Runtime keyframes
 *
 * Positions in nanoseconds from the first frame, not dates and not durations. The
 * act boundaries below are approximate; a runtime position is exact, an act
 * boundary is a judgement, and the tags carry the judgement.
 *
 * Research Sources:
 * - Wikipedia, "<<Title>>" — cast, crew, production companies, runtime, release dates.
 * - Box Office Mojo / The Numbers — <<gross / budget>>.
 * - Rotten Tomatoes / Metacritic — <<reception>>.
 *
 * Key Facts Verified:
 * - Runtime: <<N>> minutes
 * - Premiere: <<ISO>>; <<region>> release <<ISO>>
 *
 * Hierarchical Context: <<STUDIO>> -> HOLLYWOOD_SYSTEM -> US_HISTORY
 */

/** A runtime position in nanoseconds: minutes (and optional seconds) from the first frame. */
const runtime = (minutes: number, seconds = 0): bigint =>
  (BigInt(minutes) * 60n + BigInt(seconds)) * 1_000_000_000n;

const RUNTIME_MINUTES = <<N>>;
const <<STUDIO>> = resolveFilmStudio('<<token>>')!.universeId;

export const <<camel>>Universe: Universe = {
  universeId: '<<token>>:<<slug>>:<<year>>',
  type: UniverseType.FILM,
  identifiers: {
    primary: '<<token>>:<<slug>>:<<year>>',   // keep equal to universeId
    aliases: ['<<Title>>', '<<Title>> (<<year>>)'],
  },
  realityRelation: {
    // The work is real; its content is invented. 1.0 is that distinction, not a hedge.
    type: 'pure_fiction',
    fictionalizationDegree: 1.0,
    claimsHistoricalAccuracy: false,
    // Anchors ONLY to registered ids. If the referent has no universe, leave this
    // empty and say why — a dangling anchor is not a connection (#129).
    realityAnchors: [],
  },
  attribution: {
    public_domain: false,
    copyright: { holders: ['<<Holder>>'], year: <<year>>, status: 'active' },
    creators: {
      director: ['<<Director>>'],
      writer: ['<<Writer>>'],
      based_on: ['<<Source material, as credited>>'],
    },
    citations_required: true,
    usage_restrictions: [
      'Copyrighted. This record contains no dialogue, script, stills or footage and must not be used to reproduce protected material.',
    ],
    sources: ['<<source 1>>', '<<source 2>>', '<<source 3>>'],   // >= 3
  },
  layers: [
    {
      layerId: 'runtime',
      type: 'primary',
      epochs: {
        // Explicit epochId: a missing one is silently renamed to the layer key and
        // every reference to it changes meaning (#19).
        runtime: {
          epochId: '<<slug>>:runtime',
          startTime: 0n,
          endTime: runtime(RUNTIME_MINUTES),
          precision: TimePrecision.SECOND,
          description: 'Film runtime',
        },
      },
    },
  ],
  epochs: {},
  temporalStructure: {
    // Acts, in runtime nanoseconds. Gapless: each act ends where the next begins.
    segments: [
      { id: 'act_i',   start: runtime(0),         end: runtime(<<b1>>),            type: 'act', status: 'active', description: '<<…>>' },
      { id: 'act_ii',  start: runtime(<<b1>>),    end: runtime(<<b2>>),            type: 'act', status: 'active', description: '<<…>>' },
      { id: 'act_iii', start: runtime(<<b2>>),    end: runtime(RUNTIME_MINUTES),   type: 'act', status: 'active', description: '<<…>>' },
    ],
    keyframes: [
      { id: '<<id>>', timestamp: runtime(0),   significance: 0.7, tags: ['act_i', 'prologue'], description: '<<prose>>' },
      { id: '<<id>>', timestamp: runtime(<<m>>, <<s>>), significance: 0.9, tags: ['act_ii', 'turning_point'], description: '<<prose>>' },
      { id: '<<id>>', timestamp: runtime(<<m2>>), significance: 1.0, tags: ['act_iii', 'climax'], description: '<<prose>>' },
    ],
    windows: { strategy: 'scene_based', avgWindowSize: runtime(<<avg>>) },
  },
  metadata: {
    canonicalName: '<<Title>>',
    description: '<<One paragraph: what it is, who made it, how it was received.>>',
    creators: ['<<Director>>'],
    released: new Date('<<ISO release date>>'),
    cultural_significance: <<0–1>>,
    cultural_description: '<<Why this number. Name the evidence.>>',
    tags: ['film', '<<…>>'],
  },
  connections: {
    natural: { parentUniverses: [CommonUniverseIds.HOLLYWOOD_SYSTEM, <<STUDIO>>] },
    references: [distributedByRef('<<token>>', 'Distributed theatrically by <<Distributor>>.')],
  },
} as unknown as Universe;
```

## 2. The builder (only when nothing above is needed)

```ts
import { createFilmUniverseId } from '../../../core/universe-ids';
import { UniverseBuilder } from '../../../index';

export const <<camel>>Universe = new UniverseBuilder()
  .film('<<token>>', '<<slug>>', <<year>>)     // validates and throws on a bad id
  .withId(createFilmUniverseId('<<token>>', '<<slug>>', <<year>>))  // pin an explicit id
  .withRuntime(<<N>>)
  .withRealityRelation('pure_fiction', 1.0)    // this one IS tracked; setRealityRelation is not (#99)
  .withCopyright(['<<Holder>>'], <<year>>, 'active')
  .withCreators({ director: ['<<Director>>'], writer: ['<<Writer>>'] })
  .withAliases(['<<Title>>'])
  .withCulturalSignificance(<<0–1>>, '<<why>>')
  .addRuntimeKeyframe(<<m>>, <<s>>, '<<id>>', 0.9, ['act_ii'], '<<prose>>')  // description IS forwarded (#77)
  .addConnection({ type: 'member_of', targetUniverseId: CommonUniverseIds.HOLLYWOOD_SYSTEM })
  .addConnection({ type: 'member_of', targetUniverseId: resolveFilmStudio('<<token>>')!.universeId })
  .build();
```

Caveats: `withRuntime` adds a `runtime`/`main` epoch; the builder cannot set
`usage_restrictions`, `sources`, per-segment prose, or a typed `DISTRIBUTED_BY`
reference — use the literal if you want them (#100).

## 3. The test

File: `src/config/universes/films/<<kebab-title>>.test.ts`

```ts
import { Universe } from '../../../core/types';
import { createFilmUniverseId, isFilmUniverseId, isValidUniverseId } from '../../../core/universe-ids';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { ConfigLoader } from '../../config-loader';
import { UniverseRegistry } from '../../universe-registry';
import { RealityGradientAnalyzer } from '../../../utils/reality-gradient';
import { resolveFilmStudio } from '../studios';
import { allUniverses } from '../index';
import { <<camel>>Universe } from './<<kebab-title>>';

const RUNTIME_MINUTES = <<N>>;
const runtimeNs = (m: number, s = 0) => (BigInt(m) * 60n + BigInt(s)) * 1_000_000_000n;

const parentsOf = (u: Universe) => (u.connections?.natural?.parentUniverses ?? []) as string[];
const keyframes = (u: Universe) => (u.temporalStructure?.keyframes ?? []) as Array<{ id: string; timestamp: bigint }>;
const segments = (u: Universe) => (u.temporalStructure?.segments ?? []) as Array<{ id: string; start: bigint; end: bigint; type: string }>;

describe('<<Title>> (<<year>>) universe (james-gibson/local-time#<<issue>>)', () => {
  test('uses the canonical film id, proved with the domain guard', () => {
    const id = String(<<camel>>Universe.universeId);
    expect(isFilmUniverseId(id)).toBe(true);                 // the real claim
    expect(id).toBe(createFilmUniverseId('<<token>>', '<<slug>>', <<year>>));
    expect(isValidUniverseId(id)).toBe(true);                // necessary, never sufficient
  });

  test('is registered exactly once, and survives a real registry lookup', () => {
    const id = String(<<camel>>Universe.universeId);
    expect(allUniverses.filter((u) => (u as { universeId?: string }).universeId === id)).toHaveLength(1);
    const registry = new UniverseRegistry(new ConfigLoader());
    expect(() => registry.registerUniverse(id, <<camel>>Universe)).not.toThrow();
    expect(registry.getUniverse(id)).toBeDefined();
  });

  test('every epoch carries an explicit epochId (#19)', () => { /* see films/warcraft.test.ts */ });

  test('runtime keyframes are runtime positions, not durations (#112)', () => {
    const byId = new Map(keyframes(<<camel>>Universe).map((k) => [k.id, k.timestamp]));
    expect(byId.get('<<midpoint id>>')).toBe(runtimeNs(<<m>>, <<s>>));
  });

  test('the acts cover the runtime gaplessly', () => {
    const ordered = [...segments(<<camel>>Universe)].sort((a, b) => (a.start < b.start ? -1 : 1));
    expect(ordered[0].start).toBe(0n);
    expect(ordered[ordered.length - 1].end).toBe(runtimeNs(RUNTIME_MINUTES));
    for (let i = 1; i < ordered.length; i++) expect(ordered[i].start).toBe(ordered[i - 1].end);
    for (const s of ordered) expect(s.type).toBe('act');
  });

  test('names the studio and Hollywood as containers', () => {
    expect(parentsOf(<<camel>>Universe)).toContain(CommonUniverseIds.HOLLYWOOD_SYSTEM);
    expect(parentsOf(<<camel>>Universe)).toContain(resolveFilmStudio('<<token>>')!.universeId);
  });

  test('records the distributor as a typed DISTRIBUTED_BY edge', () => {
    expect(<<camel>>Universe.connections?.references).toContainEqual(
      expect.objectContaining({ type: 'DISTRIBUTED_BY', targetUniverseId: resolveFilmStudio('<<token>>')!.universeId }),
    );
  });

  test('every reality anchor resolves to a registered universe', () => {
    const registered = new Set(allUniverses.map((u) => (u as { universeId?: string }).universeId));
    for (const a of <<camel>>Universe.realityRelation.realityAnchors) expect(registered.has(a.realEventId)).toBe(true);
  });

  test('projects as fiction', () => {
    expect(RealityGradientAnalyzer.analyzeUniverse(<<camel>>Universe).level).toBeGreaterThanOrEqual(0.7);
  });
});
```

## 4. Wiring — both halves

`src/config/universes/films/index.ts` needs **both**, or the walk test fails:

```ts
import { <<camel>>Universe } from './<<kebab-title>>';
export * from './<<kebab-title>>';
// …
export const filmUniverses = [ /* … */ <<camel>>Universe, ];
```

Then prove it — see the `local-time-verify` skill.
