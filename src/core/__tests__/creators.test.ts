import {
  normaliseCreatorName,
  creatorRefs,
  creatorsInRole,
  mergeCreatorRefs,
} from '../creators';
import { UniverseBuilder } from '../universe-builder';
import {
  WELL_KNOWN_UNIVERSES,
  createPersonalUniverseId,
  isPersonUniverseId,
} from '../universe-ids';

/**
 * james-gibson/local-time#148.
 *
 * A creator used to be a display name keyed by role, so the only identity was the spelling.
 * A person is now one entry with a role list, and carries a `personId` when a person
 * universe exists. These assertions pin the three things that decision bought:
 *
 * 1. one person, one entry — the same person under two roles is not two creators;
 * 2. the retrieval text does not move — `metadata.creators` is still ordered names;
 * 3. identity is optional and explicit — a name works without a person universe, and the id
 *    is a `biography:`/`personal:` universe, never a slug invented from the name.
 */
describe('creatorRefs — person-keyed creators (#148)', () => {
  test('a director who also wrote is one creator with two roles', () => {
    expect(
      creatorRefs({
        director: ['Duncan Jones'],
        writer: ['Charles Leavitt', 'Duncan Jones'],
      }),
    ).toEqual([
      { name: 'Duncan Jones', roles: ['director', 'writer'] },
      { name: 'Charles Leavitt', roles: ['writer'] },
    ]);
  });

  test('the same person under two roles keeps the role order used for retrieval', () => {
    const refs = creatorRefs({ director: ['A Person'], writer: ['A Person', 'A Writer'] });
    expect(refs.map((ref) => ref.name)).toEqual(['A Person', 'A Writer']);
    expect(refs[0].roles).toEqual(['director', 'writer']);
  });

  test('a name is the same person after whitespace is collapsed', () => {
    const refs = creatorRefs({ director: ['Duncan  Jones'], writer: ['Duncan Jones'] });
    expect(refs).toEqual([{ name: 'Duncan Jones', roles: ['director', 'writer'] }]);
    expect(normaliseCreatorName('  Duncan \t Jones  ')).toBe('Duncan Jones');
  });

  test('case is not folded — a display name is the label', () => {
    expect(creatorRefs({ director: ['duncan jones'], writer: ['Duncan Jones'] })).toHaveLength(2);
  });

  test('an empty or whitespace-only name is not a creator', () => {
    expect(creatorRefs({ director: ['', '   '] })).toEqual([]);
  });

  test('a personId on any one credit is kept on the person', () => {
    const [ref] = creatorRefs({
      director: ['J.R.R. Tolkien'],
      writer: [{ name: 'J.R.R. Tolkien', personId: WELL_KNOWN_UNIVERSES.TOLKIEN }],
    });
    expect(ref.roles).toEqual(['director', 'writer']);
    expect(ref.personId).toBe('biography:jrr_tolkien:1892-1973');
  });

  test('a name without a person universe carries no personId at all', () => {
    const [ref] = creatorRefs({ director: ['Duncan Jones'] });
    expect(ref).toEqual({ name: 'Duncan Jones', roles: ['director'] });
    expect('personId' in ref).toBe(false);
  });

  test('creatorsInRole reads a role back without re-deriving it from names', () => {
    const refs = creatorRefs({ director: ['A', 'B'], writer: ['B'] });
    expect(creatorsInRole(refs, 'director').map((ref) => ref.name)).toEqual(['A', 'B']);
    expect(creatorsInRole(refs, 'writer').map((ref) => ref.name)).toEqual(['B']);
    expect(creatorsInRole(refs, 'composer')).toEqual([]);
  });

  test('merging two calls keeps one entry per person', () => {
    const first = creatorRefs({ director: ['A', 'B'] });
    const merged = mergeCreatorRefs(first, creatorRefs({ writer: ['B', 'C'] }));
    expect(merged).toEqual([
      { name: 'A', roles: ['director'] },
      { name: 'B', roles: ['director', 'writer'] },
      { name: 'C', roles: ['writer'] },
    ]);
  });
});

describe('isPersonUniverseId — both person idioms are people (#148)', () => {
  test('a span-anchored biography is a person', () => {
    expect(isPersonUniverseId('biography:jrr_tolkien:1892-1973')).toBe(true);
    expect(isPersonUniverseId('biography:britney_spears:1981-present')).toBe(true);
  });

  test('a year-anchored personal universe is a person', () => {
    expect(isPersonUniverseId(createPersonalUniverseId('hillary_clinton', 1947))).toBe(true);
  });

  test('a film is not a person', () => {
    expect(isPersonUniverseId('film:tolkien:2019')).toBe(false);
  });
});

describe('the builder stores and projects the person-keyed shape (#148)', () => {
  const build = () =>
    new UniverseBuilder()
      .film('film', 'movie', 2023)
      .withRuntime(120)
      .withRealityRelation('pure_fiction', 1.0)
      .withCopyright(['A Studio'], 2023)
      .withCreators({ director: ['A Director', 'A Studio'], writer: ['A Writer'] })
      .build();

  test('metadata.creators is still the ordered name projection', () => {
    expect(build().metadata!.creators).toEqual(['A Director', 'A Studio', 'A Writer']);
  });

  test('the same person credited twice is stored once', () => {
    const universe = new UniverseBuilder()
      .film('film', 'movie', 2023)
      .withRuntime(120)
      .withRealityRelation('pure_fiction', 1.0)
      .withCopyright(['A Studio'], 2023)
      .withCreators({ director: ['Duncan Jones'], writer: ['Charles Leavitt', 'Duncan Jones'] })
      .build();

    expect(universe.attribution.creators).toEqual([
      { name: 'Duncan Jones', roles: ['director', 'writer'] },
      { name: 'Charles Leavitt', roles: ['writer'] },
    ]);
  });

  test('a person universe id travels with the credit, and never into retrieval text', () => {
    const universe = new UniverseBuilder()
      .film('film', 'movie', 2023)
      .withRuntime(120)
      .withRealityRelation('pure_fiction', 1.0)
      .withSources(['Wikipedia, "Movie"'])
      .withCreators({ writer: [{ name: 'J.R.R. Tolkien', personId: WELL_KNOWN_UNIVERSES.TOLKIEN }] })
      .build();

    expect(universe.attribution.creators).toEqual([
      { name: 'J.R.R. Tolkien', personId: WELL_KNOWN_UNIVERSES.TOLKIEN, roles: ['writer'] },
    ]);
    expect(universe.metadata!.creators).toEqual(['J.R.R. Tolkien']);
  });

  test('based_on leaves creators entirely — it is a work, not a person', () => {
    const universe = new UniverseBuilder()
      .film('film', 'movie', 2023)
      .withRuntime(120)
      .withRealityRelation('pure_fiction', 1.0)
      .withSources(['Wikipedia, "Movie"'])
      .withCreators({
        writer: ['A Writer'],
        based_on: ['Warcraft by Blizzard Entertainment'],
      })
      .build();

    expect(universe.attribution.creators).toEqual([{ name: 'A Writer', roles: ['writer'] }]);
    expect((universe.metadata as { based_on?: string[] }).based_on).toEqual([
      'Warcraft by Blizzard Entertainment',
    ]);
    expect(universe.metadata!.creators).toEqual(['A Writer']);
  });
});
