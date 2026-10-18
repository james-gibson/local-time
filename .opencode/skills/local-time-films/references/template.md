# Film universe — templates

Fill these in. Placeholders are `<<…>>`.

## 1. The spec (the default, and usually the whole file)

The universe itself is one call. What is left to write is the data and the prose —
the cultural-significance judgement and its justification are the actual work here,
not the scaffolding.

File: `src/config/universes/films/<<kebab-title>>.ts`

```ts
import { FilmSpec, createFilmUniverse } from './film-universe';

/**
 * <<Title>> (<<year>>) — <<Production cos.>> / <<Distributor>>.
 *
 * james-gibson/local-time#<<issue>>. <<One sentence: what this film is, and what it
 * is NOT (not the game, not the earlier trilogy).>>
 *
 * ## Id
 * <<Why this id. If the ticket proposed one, say what is wrong with it and how you
 * measured that — see the local-time-ids skill. The studio token below is stated
 * once and the id, the film_studio container and the DISTRIBUTED_BY reference are
 * all derived from it.>>
 *
 * ## Runtime keyframes
 * Positions in nanoseconds from the first frame, not dates and not durations. The act
 * cuts are approximate; a runtime position is exact, an act boundary is a judgement,
 * and the tags carry the judgement.
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
const SPEC: FilmSpec = {
  studio: '<<token>>',            // must resolve: resolveFilmStudio('<<token>>')
  slug: '<<slug>>',               // pinned for a punctuated title (toIdFragment deletes & and :)
  year: <<year>>,
  title: '<<Title>>',             // the human name — metadata.canonicalName comes from here
  aliases: ['<<Title>>', '<<Title>> (<<year>>)'],
  runtimeMinutes: <<N>>,

  realityRelation: {
    // The work is real; its content is invented. 1.0 is that distinction, not a hedge.
    type: 'pure_fiction',
    fictionalizationDegree: 1.0,
    // ONLY registered universe ids. If the referent has no universe, leave this empty
    // and say why above — a dangling anchor is not a connection (#129).
    anchors: [],
  },
  copyright: {
    holders: ['<<Holder>>'],
    year: <<year>>,
    status: 'active',             // 'active' | 'expired' | 'public_domain' | 'invalid'
  },
  creators: {
    director: ['<<Director>>'],
    writer: ['<<Writer>>'],
    based_on: ['<<Source material, as credited>>'],   // a work, not a person
  },
  sources: ['<<source 1>>', '<<source 2>>', '<<source 3>>'],   // >= 3
  usageRestrictions: [
    'Copyrighted. This record contains no dialogue, script, stills or footage and must not be used to reproduce protected material.',
  ],
  released: '<<ISO release date>>',   // the typed metadata.released, not the id's year
  culturalSignificance: <<0–1>>,
  culturalNote: '<<Why that number. Name the evidence, not the adjective.>>',
  description: '<<One paragraph: what it is, who made it, how it was received.>>',
  tags: ['film', '<<…>>'],

  // Cut points, in order. Each act ends where the next begins — the factory pairs them,
  // so the partition cannot drift. The LAST act must end exactly at runtimeMinutes.
  acts: [
    { id: 'act_i',   endsAtMinute: <<b1>>, description: '<<…>>' },
    { id: 'act_ii',  endsAtMinute: <<b2>>, description: '<<…>>' },
    { id: 'act_iii', endsAtMinute: <<N>>,  description: '<<…>>' },
  ],

  // Runtime positions. `second` is within the minute: (61, 30) is 61m30s.
  moments: [
    { id: '<<id>>', minute: 0,          significance: 0.7, tags: ['act_i', 'prologue'],        description: '<<prose>>' },
    { id: '<<id>>', minute: <<m>>, second: <<s>>, significance: 0.9, tags: ['act_ii', 'turning_point'], description: '<<prose>>' },
    { id: '<<id>>', minute: <<m2>>,     significance: 1.0, tags: ['act_iii', 'climax'],       description: '<<prose>>' },
  ],

  // containers: [...]           // only EXTRA parents; HOLLYWOOD_SYSTEM and the studio are derived
  // averageWindowMinutes: 10,   // defaults to runtime / 12
};

export const <<camel>>Universe = createFilmUniverse(SPEC);
```

The factory throws on the spec errors that would otherwise be silent data defects: an
unregistered studio token, a film with no acts, cuts that are not strictly increasing,
and a last act that does not end at the runtime.

## 2. Wiring — both halves, or the walk test fails

`src/config/universes/films/index.ts`:

```ts
import { <<camel>>Universe } from './<<kebab-title>>';
export * from './<<kebab-title>>';
// …
export const filmUniverses = [ /* … */ <<camel>>Universe, ];
```

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
const segments = (u: Universe) =>
  (u.temporalStructure?.segments ?? []) as Array<{ id: string; start: bigint; end: bigint; type: string; description?: string }>;
const moments = (u: Universe) =>
  (u.temporalStructure?.keyframes ?? []) as Array<{ id: string; timestamp: bigint; description?: string }>;

describe('<<Title>> (<<year>>) universe (james-gibson/local-time#<<issue>>)', () => {
  test('proves the id with the domain guard, not the permissive one', () => {
    const id = String(<<camel>>Universe.universeId);
    expect(isFilmUniverseId(id)).toBe(true);                  // the real claim
    expect(id).toBe(createFilmUniverseId('<<token>>', '<<slug>>', <<year>>));
    expect(isValidUniverseId(id)).toBe(true);                 // necessary, never sufficient
  });

  test('is registered exactly once, and survives a real registry lookup', () => {
    const id = String(<<camel>>Universe.universeId);
    expect(allUniverses.filter((u) => (u as { universeId?: string }).universeId === id)).toHaveLength(1);
    const registry = new UniverseRegistry(new ConfigLoader());
    expect(() => registry.registerUniverse(id, <<camel>>Universe)).not.toThrow();
    expect(registry.getUniverse(id)).toBeDefined();
  });

  test('every epoch carries an explicit epochId (#19)', () => {
    const offenders: string[] = [];
    for (const layer of <<camel>>Universe.layers) {
      for (const [key, epoch] of Object.entries(layer.epochs)) {
        const epochId = (epoch as { epochId?: string }).epochId;
        if (!epochId || epochId.trim() === '') offenders.push(`${layer.layerId}.${key}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  test('runtime keyframes are positions, not durations (#112)', () => {
    const byId = new Map(moments(<<camel>>Universe).map((k) => [k.id, k.timestamp]));
    expect(byId.get('<<midpoint id>>')).toBe(runtimeNs(<<m>>, <<s>>));
  });

  test('the acts are gapless and cover the runtime, and keep their prose (#100)', () => {
    const acts = segments(<<camel>>Universe);
    expect(acts[0].start).toBe(0n);
    expect(acts[acts.length - 1].end).toBe(runtimeNs(RUNTIME_MINUTES));
    for (let i = 1; i < acts.length; i++) expect(acts[i].start).toBe(acts[i - 1].end);
    for (const act of acts) {
      expect(act.type).toBe('act');
      expect(typeof act.description).toBe('string');
    }
  });

  test('names the studio and Hollywood as containers, and the same studio as distributor', () => {
    const studio = resolveFilmStudio('<<token>>')!;
    expect(parentsOf(<<camel>>Universe)).toContain(CommonUniverseIds.HOLLYWOOD_SYSTEM);
    expect(parentsOf(<<camel>>Universe)).toContain(studio.universeId);
    expect(<<camel>>Universe.connections?.references).toContainEqual(
      expect.objectContaining({ type: 'DISTRIBUTED_BY', targetUniverseId: studio.universeId }),
    );
  });

  test('carries the provenance and metadata the spec declares', () => {
    // These are the fields the shim owns — a regression there would be silent otherwise.
    expect(<<camel>>Universe.metadata?.canonicalName).toBe('<<Title>>');
    expect(<<camel>>Universe.metadata?.released).toEqual(new Date('<<ISO>>'));
    expect(<<camel>>Universe.attribution.sources).toHaveLength(3);
  });

  test('every reality anchor resolves to a registered universe', () => {
    const registered = new Set(allUniverses.map((u) => (u as { universeId?: string }).universeId));
    for (const a of <<camel>>Universe.realityRelation.realityAnchors) {
      expect(registered.has(a.realEventId)).toBe(true);
    }
  });

  test('projects as fiction', () => {
    expect(RealityGradientAnalyzer.analyzeUniverse(<<camel>>Universe).level).toBeGreaterThanOrEqual(0.7);
  });
});
```

## 4. The historical note, for a reader who finds an older file

Films added before #115/#116 are hand-authored literals
(`films/20th/idiocracy.ts`, `films/apollo13-film.ts`, `films/die-hard.ts`). They are
not wrong, and they are not a pattern to copy: each one repeats the containment,
distributor, epoch and act arithmetic that `createFilmUniverse` now derives, and each
one is a place where an out-of-union value can hide behind `as unknown as Universe`
(#143 — three already do).

When you touch one, its *content* is a spec waiting to be read out:
`createFilmUniverse({ studio, slug, title, runtimeMinutes, acts, moments, … })`.
