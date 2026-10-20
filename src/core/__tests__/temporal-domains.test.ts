import { UniverseBuilder } from '../universe-builder';
import { TimePrecision, Universe } from '../types';
import {
  calendarInstant,
  calendarSpans,
  domainAnchor,
  domainSpan,
  domainSpans,
  domainsOverlapping,
  momentsAtRuntimeFraction,
  parseDomainAnchor,
  runtimeAtFraction,
  runtimeFraction,
  universesInCalendarWindow,
} from '../temporal-domains';

/**
 * james-gibson/local-time#150 — a work has three temporal domains, and only `runtime` had a
 * producer. These assertions pin the model and the two queries the design built the concept
 * for: a runtime-relative position, and a corpus window over calendar time.
 */

const runtime = (minutes: number, seconds = 0): bigint =>
  (BigInt(minutes) * 60n + BigInt(seconds)) * 1_000_000_000n;

const withAllDomains = (): Universe =>
  new UniverseBuilder()
    .film('film', 'test_film', 2020)
    .withRuntime(100)
    .withCopyright(['A Studio'], 2020)
    .withTemporalDomain(
      'narrative',
      '1910-01-01',
      '1911-01-01',
      TimePrecision.YEAR,
      'Story time: 1910.',
    )
    .withTemporalDomain(
      'production',
      '1963-05-01',
      '1964-09-01',
      TimePrecision.MONTH,
      'Principal photography, May to September 1963.',
    )
    .addRuntimeKeyframe(87, 0, 'at_87_percent', 0.9, ['beat'], 'The 87% beat.')
    .build();

describe('the three domains (#150)', () => {
  test('the builder emits all three, in a stable order', () => {
    expect(domainSpans(withAllDomains()).map((span) => span.domain)).toEqual([
      'runtime',
      'narrative',
      'production',
    ]);
  });

  test('each domain resolves to its epoch and precision', () => {
    const universe = withAllDomains();
    expect(domainSpan(universe, 'runtime')?.endTime).toBe(runtime(100));
    expect(domainSpan(universe, 'narrative')?.startTime).toBe(calendarInstant('1910-01-01'));
    expect(domainSpan(universe, 'narrative')?.precision).toBe(TimePrecision.YEAR);
    expect(domainSpan(universe, 'production')?.precision).toBe(TimePrecision.MONTH);
  });

  test('a domain that is not documented is absent, not empty', () => {
    const universe = new UniverseBuilder()
      .film('film', 'runtime_only', 2020)
      .withRuntime(90)
      .withCopyright(['A Studio'], 2020)
      .build();

    expect(domainSpans(universe).map((span) => span.domain)).toEqual(['runtime']);
    expect(domainSpan(universe, 'narrative')).toBeUndefined();
    expect(domainSpan(universe, 'production')).toBeUndefined();
  });

  test('setting the same domain twice replaces its epoch instead of adding a second axis', () => {
    const universe = new UniverseBuilder()
      .film('film', 'twice', 2020)
      .withRuntime(90)
      .withCopyright(['A Studio'], 2020)
      .withTemporalDomain('narrative', '1900-01-01', '1901-01-01', TimePrecision.YEAR, 'first')
      .withTemporalDomain('narrative', '1910-01-01', '1911-01-01', TimePrecision.YEAR, 'second')
      .build();

    expect(domainSpans(universe)).toHaveLength(2);
    expect(domainSpan(universe, 'narrative')?.startTime).toBe(calendarInstant('1910-01-01'));
  });
});

describe('query 1 — a runtime position is a proportion, not a timestamp (#150)', () => {
  test('a moment can be read as a fraction of its own work', () => {
    const universe = withAllDomains();
    expect(runtimeFraction(universe, runtime(87))).toBeCloseTo(0.87, 6);
    expect(runtimeFraction(universe, runtime(0))).toBe(0);
    expect(runtimeFraction(universe, runtime(100))).toBe(1);
  });

  test('"find scenes at the 87% mark" resolves through the runtime domain', () => {
    const universe = withAllDomains();
    expect(momentsAtRuntimeFraction(universe, 0.87).map((m) => m.id)).toEqual(['at_87_percent']);
    expect(momentsAtRuntimeFraction(universe, 0.5)).toEqual([]);
  });

  test('the fraction and its inverse agree', () => {
    const universe = withAllDomains();
    const at = runtimeAtFraction(universe, 0.87)!;
    expect(runtimeFraction(universe, at)).toBeCloseTo(0.87, 9);
  });

  test('a work with no runtime has no fractions', () => {
    const universe = new UniverseBuilder()
      .historical('sometime', 1916)
      .withDateRange(1916, 1, 1, 1916, 12, 31, TimePrecision.DAY)
      .withPublicDomain(['Records'])
      .build();
    expect(runtimeFraction(universe, 0n)).toBeUndefined();
    expect(runtimeAtFraction(universe, 0.87)).toBeUndefined();
  });
});

describe('query 2 — calendar windows ignore playback time (#150)', () => {
  test('calendarSpans skips the runtime layer', () => {
    expect(calendarSpans(withAllDomains()).map((span) => span.layerId)).toEqual([
      'narrative',
      'production',
    ]);
  });

  test('a work is found in a year its story reaches, and not otherwise', () => {
    const universe = withAllDomains();
    const domainsIn = (year: number) =>
      domainsOverlapping(
        universe,
        calendarInstant(`${year}-01-01`),
        calendarInstant(`${year + 1}-01-01`),
      ).map((span) => span.domain);

    expect(domainsIn(1910)).toEqual(['narrative']);
    expect(domainsIn(1964)).toEqual(['production']);
    expect(domainsIn(1916)).toEqual([]);
  });

  test('the corpus window finds any universe with a calendar span, not just films', () => {
    const film = withAllDomains();
    const experience: Universe = {
      universeId: 'personal:someone:wwi_experience:1916',
      type: 'personal_experience' as Universe['type'],
      layers: [
        {
          layerId: 'service_period',
          type: 'primary',
          epochs: {
            military_service: {
              epochId: 'someone:wwi_service',
              startTime: calendarInstant('1916-01-01'),
              endTime: calendarInstant('1917-01-01'),
              precision: TimePrecision.YEAR,
            },
          },
        },
      ],
    } as unknown as Universe;

    const window1916 = universesInCalendarWindow(
      [film, experience],
      calendarInstant('1916-01-01'),
      calendarInstant('1917-01-01'),
    );
    expect(window1916.map((u) => u.universeId)).toEqual(['personal:someone:wwi_experience:1916']);

    const window1910 = universesInCalendarWindow(
      [film, experience],
      calendarInstant('1910-01-01'),
      calendarInstant('1911-01-01'),
    );
    expect(window1910.map((u) => u.universeId)).toEqual(['film:test_film:2020']);
  });
});

describe('anchors are addressed into a domain (#150)', () => {
  test('an anchor names <universeId>:<domain>', () => {
    const anchor = domainAnchor(withAllDomains(), 'narrative', 'umbrella_flight', {
      scene_description: 'The umbrella flight.',
    });
    expect(anchor.domainId).toBe('film:test_film:2020:narrative');
    expect(anchor.eventId).toBe('umbrella_flight');
  });

  test('a work without that domain cannot be the target of an anchor', () => {
    const runtimeOnly = new UniverseBuilder()
      .film('film', 'azeroth', 2016)
      .withRuntime(123)
      .withCopyright(['A Studio'], 2016)
      .build();

    expect(() => domainAnchor(runtimeOnly, 'narrative', 'some_event')).toThrow(
      /has no 'narrative' domain/,
    );
  });

  test('an anchor parses back to its universe and domain', () => {
    expect(
      parseDomainAnchor({
        domainId: 'biography:jrr_tolkien:1892-1973:narrative',
        eventId: 'wwi',
        context: {},
      }),
    ).toEqual({ universeId: 'biography:jrr_tolkien:1892-1973', domain: 'narrative' });

    expect(
      parseDomainAnchor({ domainId: 'film:gotg:2017', eventId: 'x', context: {} }),
    ).toBeUndefined();
  });
});
