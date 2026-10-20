import { allUniverses } from './index';
import { maryPoppinsUniverse } from './maryPoppinsUniverse';
import { tolkienWWIExperience } from './tolkienWWIExperience';
import {
  calendarInstant,
  domainAnchor,
  domainSpan,
  domainSpans,
  momentsAtRuntimeFraction,
  runtimeFraction,
  universesInCalendarWindow,
} from '../../core/temporal-domains';
import { Universe, UniverseType } from '../../core/types';

/**
 * james-gibson/local-time#150 — the first producer of all three domains.
 *
 * The ticket called Mary Poppins "the natural first producer ... it is registered" — and it
 * is, through the `filmUniverses` spread rather than a top-level entry in
 * `config/universes/index.ts`. That is pinned here too, because "carries the domains" and
 * "can be found" are different claims, and the surrounding corpus has several universes that
 * were defined, exported and reached by nothing (#27, #153).
 *
 * The spans are the documented ones, not `example.ts.md`'s illustrative dates: a design
 * record is not evidence.
 */
describe('Mary Poppins is a work with three temporal domains (#150)', () => {
  test('it is registered — reachable through the film barrel, not only exported', () => {
    expect(allUniverses).toContain(maryPoppinsUniverse);
    expect(maryPoppinsUniverse.type).toBe(UniverseType.FILM);
  });

  test('it carries runtime, narrative and production, and no more', () => {
    expect(domainSpans(maryPoppinsUniverse).map((span) => span.domain)).toEqual([
      'runtime',
      'narrative',
      'production',
    ]);
  });

  test('the narrative domain is the documented year, 1910', () => {
    const narrative = domainSpan(maryPoppinsUniverse, 'narrative')!;
    expect(narrative.startTime).toBe(calendarInstant('1910-01-01'));
    expect(narrative.endTime).toBe(calendarInstant('1911-01-01'));
    // The plot spans about a week; the sources date it only to the year, so the domain says
    // a year rather than pretending to days.
    expect(narrative.description).toMatch(/1910/);
  });

  test('the production domain runs from principal photography to the release', () => {
    const production = domainSpan(maryPoppinsUniverse, 'production')!;
    expect(production.startTime).toBe(calendarInstant('1963-05-01'));
    expect(production.endTime).toBe(calendarInstant('1964-09-01'));
    expect(production.description).toMatch(/1963/);
    // The claim is month-granular because the source is ("May-September 1963").
    expect(production.description).toMatch(/1964/);
  });

  test('every moment sits inside the runtime — the design example did not', () => {
    // `example.ts.md:511` encodes "87:15" as `87n * 60n * 15n`, which is 1305 minutes: 9.4x
    // the 139m runtime. The corpus had copied it, so the design's own worked example had a
    // keyframe an hour outside its own film. Nothing read the timestamp, so nothing failed.
    const runtime = domainSpan(maryPoppinsUniverse, 'runtime')!;
    for (const keyframe of maryPoppinsUniverse.temporalStructure!.keyframes!) {
      expect(keyframe.timestamp).toBeGreaterThanOrEqual(runtime.startTime);
      expect(keyframe.timestamp).toBeLessThanOrEqual(runtime.endTime);
    }
  });

  test('both calendar spans are sourced, not lifted from the design transcript', () => {
    const sources = maryPoppinsUniverse.attribution?.sources ?? [];
    expect(sources.length).toBeGreaterThan(0);
    expect(sources.join(' ')).toMatch(/1963/);
    expect(sources.join(' ')).toMatch(/1910/);
  });
});

describe('the two design queries resolve through the domains (#150)', () => {
  // "Find scenes at the 87% mark of their runtimes" (example.ts.md:730-738). The umbrella
  // descent is at 87m15s of a 139m runtime, so it is the 62.8% mark — the query must report
  // that, not round it to the design's illustrative 87.
  test('the runtime domain gives a moment a fraction of its own work', () => {
    const descent = maryPoppinsUniverse.temporalStructure!.keyframes!.find(
      (keyframe) => keyframe.id === 'umbrella_descent',
    )!;
    expect(runtimeFraction(maryPoppinsUniverse, descent.timestamp)).toBeCloseTo(0.6277, 3);
  });

  test('a proportional query finds the moment at its real position, and nothing at 87%', () => {
    expect(momentsAtRuntimeFraction(maryPoppinsUniverse, 0.6277, 0.001).map((m) => m.id)).toEqual([
      'umbrella_descent',
    ]);
    expect(momentsAtRuntimeFraction(maryPoppinsUniverse, 0.87)).toEqual([]);
  });

  // "Find all 1916 references across every universe" (proposal.md:224-231). The window is
  // calendar time, so a playback runtime must never satisfy it — a 1916 window cannot match
  // Mary Poppins' 139-minute runtime, which in nanoseconds looks like 1970.
  test('a calendar window finds universes by story/production time', () => {
    const in1910 = universesInCalendarWindow(
      allUniverses as Universe[],
      calendarInstant('1910-01-01'),
      calendarInstant('1911-01-01'),
    ).map((universe) => String(universe.universeId));

    expect(in1910).toContain('disney:mary_poppins:1964');
    expect(in1910).not.toContain('film:star_wars:a_new_hope:1977');
  });

  test('the same query reaches a non-work universe, which is what "across every universe" means', () => {
    const in1916 = universesInCalendarWindow(
      allUniverses as Universe[],
      calendarInstant('1916-01-01'),
      calendarInstant('1917-01-01'),
    ).map((universe) => String(universe.universeId));

    expect(in1916).toContain('personal:tolkien:wwi_experience:1916');
    expect(in1916).not.toContain('disney:mary_poppins:1964');
  });

  test('Mary Poppins can be the target of a narrative anchor; a film with no narrative cannot', () => {
    expect(domainAnchor(maryPoppinsUniverse, 'narrative', 'umbrella_flight').domainId).toBe(
      'disney:mary_poppins:1964:narrative',
    );

    // Warcraft is set in Azeroth: no real-calendar story time, so no narrative anchor.
    const warcraft = allUniverses.find(
      (universe) => String((universe as Universe).universeId) === 'universal:warcraft:2016',
    ) as Universe | undefined;
    expect(warcraft).toBeDefined();
    expect(() => domainAnchor(warcraft!, 'narrative', 'dark_portal')).toThrow(/narrative/);
  });

  test('a film set in an invented world carries runtime only, by omission', () => {
    // Warcraft is set in Azeroth; there is no real-calendar story time to declare, and its
    // production dates are not in the sources gathered for it (#142). The omission is the
    // fact, so the work has one domain rather than an invented one.
    const warcraft = allUniverses.find(
      (universe) => String((universe as Universe).universeId) === 'universal:warcraft:2016',
    ) as Universe | undefined;

    expect(warcraft).toBeDefined();
    expect(domainSpans(warcraft!).map((span) => span.domain)).toEqual(['runtime']);
  });

  test('the WWI experience is still addressable in its own non-domain layer', () => {
    // The window query reads every non-runtime layer, not only the three domains; a
    // historical universe keeps its own layer id.
    expect(tolkienWWIExperience.layers?.[0].layerId).toBe('service_period');
  });
});
