import { existsSync } from 'fs';
import { join } from 'path';
import { allUniverses } from '../index';
import { ConfigLoader } from '../../config-loader';
import { UniverseRegistry } from '../../universe-registry';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { isFilmUniverseId, isValidUniverseId } from '../../../core/universe-ids';
import { Universe, UniverseType } from '../../../core/types';
import { RealityGradientAnalyzer } from '../../../utils/reality-gradient';
import { TROPES, TROPES_BY_ID, eightiesMovieTropesUniverse } from './eighties-movie-tropes';
import { eightiesTropeFilmUniverses } from './eighties-trope-films';
import { tropesUniverses } from './index';
import { TropeCollectionMetadata, TropeFilmMetadata } from './types';

/**
 * james-gibson/local-time#130 — the 1980s tropes collection.
 *
 * Mirrors `films/films-registration.test.ts`, and adds the invariants that are
 * specific to a *collection*: an anchor that resolves, a membership that is
 * declared on the child, and a trope registry that two sides agree on.
 *
 * The failure this guards against is the one the guide calls out three times
 * (#27, #67, #98): a universe defined, built and validated at module scope and
 * then silently discarded. A spread into `allUniverses` is not proof of a
 * lookup, so every id is registered into a real registry here.
 */

const CONTAINER = CommonUniverseIds.EIGHTIES_MOVIE_TROPES;

/** A registry with no external configuration, so `initialize()` is deterministic. */
const emptyLoader = { loadConfigurations: async () => [] } as unknown as ConfigLoader;

const idOf = (universe: Universe): string => String(universe.universeId);

const idsIn = (universes: readonly Universe[]): string[] => universes.map(idOf);

const byId = new Map(allUniverses.map((u) => [idOf(u as Universe), u as Universe]));

/** The container plus the films this namespace owns. */
const tropeIds = idsIn(tropesUniverses);
const filmIds = idsIn(eightiesTropeFilmUniverses);

const containerMetadata = eightiesMovieTropesUniverse.metadata as TropeCollectionMetadata;

/** Runtime keyframe ids on a film universe. */
const runtimeKeyframeIds = (universe: Universe): string[] =>
  (universe.temporalStructure?.keyframes ?? []).map((keyframe) => keyframe.id);

describe('the 1980s tropes collection is registered (#130)', () => {
  test('the namespace is not vacuous — one container and six films', () => {
    expect(tropesUniverses).toHaveLength(7);
    expect(tropeIds).toContain(CONTAINER);
    expect(filmIds).toHaveLength(6);
  });

  test('every id is valid, and every film id is a valid *film* id', () => {
    // `isValidUniverseId` is nearly a pass-through (#50), so the domain guard is
    // asserted too. The container is `history:` by design, the films are `film:`.
    const invalid = tropeIds.filter((id) => !isValidUniverseId(id));
    expect(invalid).toEqual([]);

    const notFilms = filmIds.filter((id) => !isFilmUniverseId(id));
    expect(notFilms).toEqual([]);

    expect(isValidUniverseId(CONTAINER)).toBe(true);
    expect(isFilmUniverseId(CONTAINER)).toBe(false);
  });

  test('every id is present in allUniverses exactly once', () => {
    const counts = new Map<string, number>();
    for (const universe of allUniverses) {
      const id = (universe as { universeId?: string }).universeId;
      if (typeof id === 'string') counts.set(id, (counts.get(id) ?? 0) + 1);
    }

    expect(tropeIds.filter((id) => (counts.get(id) ?? 0) === 0)).toEqual([]);
    expect(tropeIds.filter((id) => (counts.get(id) ?? 0) > 1)).toEqual([]);
  });

  test('no universeId is defined twice anywhere — one owner per id (#74)', () => {
    const ids = idsIn(allUniverses as Universe[]);
    expect(ids.length).toBe(new Set(ids).size);
  });

  test('the container is a container, not a work', () => {
    expect(eightiesMovieTropesUniverse.type).not.toBe(UniverseType.FILM);
    // A film universe would put the taxonomy in the same class as the things it
    // categorises, and would have to claim a runtime it does not have.
    expect(eightiesMovieTropesUniverse.temporalStructure?.keyframes ?? []).not.toHaveLength(0);
  });

  test('every universe survives a real registry lookup, not just the array', async () => {
    const registry = new UniverseRegistry(emptyLoader);
    await registry.initialize();

    const missing = tropeIds.filter((id) => !registry.getUniverse(id));
    expect(missing).toEqual([]);
  });

  test('there is no tropes.ts beside tropes/index.ts (#67 shadow pair)', () => {
    // A file beats a same-named directory in the resolver, so the pair would make
    // the whole subtree unreachable. This is a filesystem assertion precisely
    // because the compiler cannot see it.
    expect(existsSync(join(__dirname, '..', 'tropes.ts'))).toBe(false);
  });
});

describe('trope anchors resolve and cannot drift (#130)', () => {
  test('the registry holds the seven tropes', () => {
    expect(TROPES).toHaveLength(7);
    expect(TROPES_BY_ID.size).toBe(7);
    expect(containerMetadata.tropes).toBe(TROPES);
    // Ids are the join key on both sides, so they must be unique.
    expect(new Set(TROPES.map((t) => t.tropeId)).size).toBe(7);
  });

  test('every anchorFilmId is a registered universe', () => {
    const dangling = TROPES.filter((trope) => !byId.has(trope.anchorFilmId)).map(
      (trope) => `${trope.tropeId} -> ${trope.anchorFilmId}`,
    );
    expect(dangling).toEqual([]);
  });

  test('anchorReleased agrees with the anchor film, and dates its container keyframe', () => {
    const problems: string[] = [];
    const keyframes = eightiesMovieTropesUniverse.temporalStructure?.keyframes ?? [];

    for (const trope of TROPES) {
      const film = byId.get(trope.anchorFilmId)!;
      const filmReleased = film.metadata?.released;
      const releasedIso = filmReleased instanceof Date ? filmReleased.toISOString().slice(0, 10) : null;

      if (releasedIso !== trope.anchorReleased) {
        problems.push(
          `${trope.tropeId}: registry says ${trope.anchorReleased}, film metadata.released says ${releasedIso}`,
        );
      }

      const keyframe = keyframes.find((k) => k.id === trope.anchorKeyframeId);
      if (!keyframe) {
        problems.push(`${trope.tropeId}: no container keyframe "${trope.anchorKeyframeId}"`);
        continue;
      }
      const expected = BigInt(new Date(trope.anchorReleased).getTime()) * 1_000_000n;
      if (keyframe.timestamp !== expected) {
        problems.push(`${trope.tropeId}: keyframe is not dated to its release`);
      }
      if (!keyframe.tags.includes('trope')) {
        problems.push(`${trope.tropeId}: keyframe is not tagged as a trope`);
      }
    }

    expect(problems).toEqual([]);
  });

  test('the anchor keyframe count matches the trope count — no invented extra dates', () => {
    // One keyframe per trope, and nothing else: the container's timeline *is* the
    // canonising releases. An 8th keyframe would be a date no trope accounts for.
    const keyframes = eightiesMovieTropesUniverse.temporalStructure?.keyframes ?? [];
    expect(keyframes).toHaveLength(TROPES.length);
  });

  test('every trope rated above 0.9 carries its justification (#Cultural Significance)', () => {
    const unjustified = TROPES.filter(
      (trope) => trope.culturalSignificance > 0.9 && trope.culturalNote.trim().length < 40,
    ).map((trope) => trope.tropeId);
    expect(unjustified).toEqual([]);
  });
});

describe('trope membership is declared on the film, never as a second universe (#74)', () => {
  test('every trope film is a member of the collection, and the container contains it', async () => {
    const registry = new UniverseRegistry(emptyLoader);
    await registry.initialize();

    for (const id of filmIds) {
      expect(registry.getMemberships(id).map(String)).toContain(CONTAINER);
      expect(registry.contains(CONTAINER, id)).toBe(true);
    }

    const children = registry.getChildren(CONTAINER).map(String);
    for (const id of filmIds) expect(children).toContain(id);
  });

  test('the container is not its own descendant — containment is acyclic', async () => {
    const registry = new UniverseRegistry(emptyLoader);
    await registry.initialize();

    expect(registry.getDescendants(CONTAINER).map(String)).not.toContain(CONTAINER);
  });

  test('Back to the Future is a member, not a member of this namespace', async () => {
    const bttf = 'film:bttf:1985';
    const registry = new UniverseRegistry(emptyLoader);
    await registry.initialize();

    // Owned by the film namespace ...
    expect(registry.getOwner(bttf)).toBeDefined();
    expect(registry.getOwner(bttf)?.universeId).toBe(bttf);
    // ... and a member of the collection.
    expect(registry.getMemberships(bttf).map(String)).toContain(CONTAINER);
    expect(registry.contains(CONTAINER, bttf)).toBe(true);

    // The collection must not register it a second time.
    expect(tropeIds).not.toContain(bttf);
  });

  test('the two sides agree: films declare exactly the tropes the registry names them for', () => {
    const declaredByFilm = new Map<string, string[]>();
    for (const universe of [...eightiesTropeFilmUniverses, byId.get('film:bttf:1985')!]) {
      const metadata = universe.metadata as TropeFilmMetadata;
      declaredByFilm.set(idOf(universe), [...metadata.tropes]);
    }

    // Registry -> film.
    const missingFromFilm: string[] = [];
    for (const trope of TROPES) {
      const members = [trope.anchorFilmId, ...(trope.alsoExhibitedBy ?? [])];
      for (const member of members) {
        if (!declaredByFilm.get(member)?.includes(trope.tropeId)) {
          missingFromFilm.push(`${member} does not declare "${trope.tropeId}"`);
        }
      }
    }
    expect(missingFromFilm).toEqual([]);

    // Film -> registry (so a film cannot claim a trope nobody defines or names it for).
    const unknown: string[] = [];
    for (const [film, tropes] of declaredByFilm) {
      for (const tropeId of tropes) {
        const trope = TROPES_BY_ID.get(tropeId);
        if (!trope) {
          unknown.push(`${film} declares unknown trope "${tropeId}"`);
        } else if (
          trope.anchorFilmId !== film &&
          !(trope.alsoExhibitedBy ?? []).includes(film)
        ) {
          unknown.push(`${film} declares "${tropeId}", which names neither it as anchor nor as exhibition`);
        }
      }
    }
    expect(unknown).toEqual([]);
  });

  test('every exemplar pointer names a real film and a real runtime keyframe', () => {
    const problems: string[] = [];
    for (const trope of TROPES) {
      for (const exemplar of trope.exemplars ?? []) {
        const film = byId.get(exemplar.universeId);
        if (!film) {
          problems.push(`${trope.tropeId}: exemplar universe ${exemplar.universeId} is not registered`);
          continue;
        }
        if (!isFilmUniverseId(exemplar.universeId)) {
          problems.push(`${trope.tropeId}: exemplar universe is not a film`);
        }
        if (!runtimeKeyframeIds(film).includes(exemplar.runtimeKeyframeId)) {
          problems.push(
            `${trope.tropeId}: ${exemplar.universeId} has no runtime keyframe "${exemplar.runtimeKeyframeId}"`,
          );
        }
        if (typeof exemplar.verified !== 'boolean') {
          problems.push(`${trope.tropeId}: exemplar "${exemplar.runtimeKeyframeId}" has no verified flag`);
        }
      }
    }
    expect(problems).toEqual([]);
  });

  test('an unverified exemplar is tagged as approximate, so the estimate is visible', () => {
    // The tag is the only place the reader is told the minute is an estimate; a
    // false `verified` without it would be indistinguishable from a sourced time.
    const films = new Map([...eightiesTropeFilmUniverses, byId.get('film:bttf:1985')!].map((u) => [idOf(u), u]));
    const problems: string[] = [];

    for (const trope of TROPES) {
      for (const exemplar of trope.exemplars ?? []) {
        if (exemplar.verified) continue;
        const keyframe = (films.get(exemplar.universeId)?.temporalStructure?.keyframes ?? []).find(
          (k) => k.id === exemplar.runtimeKeyframeId,
        );
        if (!keyframe?.tags.includes('approximate_position')) {
          problems.push(`${trope.tropeId}: "${exemplar.runtimeKeyframeId}" is unverified but not tagged approximate`);
        }
      }
    }
    expect(problems).toEqual([]);
  });
});

describe('the tropes projection (#76, #90)', () => {
  test('the collection is non-fiction and the films are fiction — derived, not hand-set', () => {
    const container = RealityGradientAnalyzer.analyzeUniverse(eightiesMovieTropesUniverse);
    expect(container.level).toBeLessThanOrEqual(0.1);

    const offenders = eightiesTropeFilmUniverses
      .map((u) => ({ id: idOf(u), level: RealityGradientAnalyzer.analyzeUniverse(u).level }))
      .filter(({ level }) => level < 0.7);
    expect(offenders).toEqual([]);
  });

  test('every epoch carries an explicit epochId and the window strategy is in the closed union', () => {
    const strategies = new Set(['scene_based', 'time_based', 'phase_based', 'countdown_based']);

    for (const universe of tropesUniverses) {
      for (const layer of universe.layers ?? []) {
        for (const epoch of Object.values(layer.epochs ?? {})) {
          // #19: an epoch without its own epochId is renamed by the registry to the
          // layer key, which silently changes what every reference to it means.
          expect((epoch as { epochId?: string }).epochId).toBeTruthy();
        }
      }
      const strategy = (universe.temporalStructure?.windows as { strategy?: string } | undefined)?.strategy;
      if (strategy) expect(strategies.has(strategy)).toBe(true);
    }
  });
});
