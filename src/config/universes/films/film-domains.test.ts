import { createFilmUniverse, FilmSpec } from './film-universe';
import { TimePrecision } from '../../../core/types';
import { calendarInstant, domainSpans } from '../../../core/temporal-domains';

/**
 * james-gibson/local-time#150 — the film spec must make the three domains the ordinary shape,
 * not a special case bolted onto one universe.
 *
 * `runtime` is always emitted (a film is watched from zero). The calendar domains are emitted
 * when the spec documents them and omitted when it does not, which is why the spec carries
 * them as optional ranges rather than a single "when did this happen" field.
 */

const SPEC: FilmSpec = {
  studio: 'universal',
  slug: 'domain_fixture',
  year: 2020,
  title: 'Domain Fixture',
  runtimeMinutes: 100,
  realityRelation: { type: 'pure_fiction', fictionalizationDegree: 1 },
  copyright: { holders: ['A Studio'], year: 2020, status: 'active' },
  sources: ['Fixture source.'],
  released: '2020-06-01',
  culturalSignificance: 0.1,
  culturalNote: 'A fixture, not a claim.',
  description: 'A fixture used to pin the three temporal domains.',
  tags: ['fixture'],
  acts: [
    { id: 'act_i', endsAtMinute: 50, description: 'First half.' },
    { id: 'act_ii', endsAtMinute: 100, description: 'Second half.' },
  ],
  moments: [
    { id: 'beat', minute: 50, significance: 0.5, tags: ['midpoint'], description: 'Midpoint.' },
  ],
};

describe('the film spec carries the three temporal domains (#150)', () => {
  test('runtime is always there; a documented narrative and production are added', () => {
    const universe = createFilmUniverse({
      ...SPEC,
      narrative: {
        start: '1910-01-01',
        end: '1911-01-01',
        precision: TimePrecision.YEAR,
        description: 'Story time: 1910.',
      },
      production: {
        start: '1963-05-01',
        end: '1964-09-01',
        precision: TimePrecision.MONTH,
        description: 'Principal photography, May to September 1963.',
      },
    });

    expect(domainSpans(universe).map((span) => span.domain)).toEqual([
      'runtime',
      'narrative',
      'production',
    ]);
    expect(universe.layers?.find((layer) => layer.layerId === 'production')?.type).toBe('meta');
  });

  test('omitting a range omits the domain — the invented-world case is the default', () => {
    expect(domainSpans(createFilmUniverse(SPEC)).map((span) => span.domain)).toEqual(['runtime']);
  });

  test('the runtime epoch still ends at the spec runtime', () => {
    const runtime = domainSpans(createFilmUniverse(SPEC)).find((span) => span.domain === 'runtime')!;
    expect(runtime.endTime).toBe(100n * 60n * 1_000_000_000n);
    expect(runtime.startTime).toBe(0n);
  });

  test('a narrative range is stored as a calendar span, not playback time', () => {
    const universe = createFilmUniverse({
      ...SPEC,
      narrative: {
        start: '1910-01-01',
        end: '1911-01-01',
        precision: TimePrecision.YEAR,
        description: 'Story time: 1910.',
      },
    });
    const narrative = domainSpans(universe).find((span) => span.domain === 'narrative')!;
    expect(narrative.startTime).toBe(calendarInstant('1910-01-01'));
  });
});
