import { 
  TemporalConversion,
  dateToNanoseconds,
  nanosecondsToDate,
  createEpoch,
  createKeyframe,
  createRuntimeEpoch,
  formatDuration
} from '../temporal-conversion';
import { TimePrecision } from '../../core/types';

describe('TemporalConversion', () => {
  describe('dateToNanoseconds', () => {
    test('converts simple dates correctly', () => {
      // January 1, 2000, 00:00:00 UTC
      const result = dateToNanoseconds(2000, 1, 1);
      const expected = BigInt(Date.UTC(2000, 0, 1)) * 1000000n;
      expect(result).toBe(expected);
    });

    test('handles full date and time', () => {
      // July 20, 1969, 20:17:40 UTC (Apollo 11 moon landing)
      const result = dateToNanoseconds(1969, 7, 20, 20, 17, 40);
      const expected = BigInt(Date.UTC(1969, 6, 20, 20, 17, 40)) * 1000000n;
      expect(result).toBe(expected);
    });

    test('handles milliseconds', () => {
      const result = dateToNanoseconds(2023, 12, 25, 12, 30, 45, 123);
      const expected = BigInt(Date.UTC(2023, 11, 25, 12, 30, 45, 123)) * 1000000n;
      expect(result).toBe(expected);
    });
  });

  describe('nanosecondsToDate', () => {
    test('converts nanoseconds back to date', () => {
      const originalDate = new Date('2023-06-15T14:30:00.000Z');
      const nanoseconds = BigInt(originalDate.getTime()) * 1000000n;
      const result = nanosecondsToDate(nanoseconds);
      expect(result.getTime()).toBe(originalDate.getTime());
    });

    test('handles Unix epoch', () => {
      const result = nanosecondsToDate(0n);
      expect(result.getTime()).toBe(0);
      expect(result.toISOString()).toBe('1970-01-01T00:00:00.000Z');
    });
  });

  describe('createEpoch', () => {
    test('creates epoch for historical event', () => {
      // JFK assassination day
      const epoch = createEpoch(
        1963, 11, 22,  // November 22, 1963
        1963, 11, 22,  // Same day
        TimePrecision.HOUR,
        'jfk:assassination_day',
        'Day of JFK assassination'
      );

      expect(epoch.epochId).toBe('jfk:assassination_day');
      expect(epoch.description).toBe('Day of JFK assassination');
      expect(epoch.precision).toBe(TimePrecision.HOUR);
      expect(epoch.startTime).toBe(dateToNanoseconds(1963, 11, 22));
      expect(epoch.endTime).toBe(dateToNanoseconds(1963, 11, 22, 23, 59, 59, 999));
    });

    test('creates multi-year epoch', () => {
      // WWII period
      const epoch = createEpoch(
        1939, 9, 1,    // September 1, 1939
        1945, 9, 2,    // September 2, 1945
        TimePrecision.DAY,
        'wwii:global_conflict',
        'World War II period'
      );

      expect(epoch.startTime).toBe(dateToNanoseconds(1939, 9, 1));
      expect(epoch.endTime).toBe(dateToNanoseconds(1945, 9, 2, 23, 59, 59, 999));
    });
  });

  describe('createKeyframe', () => {
    test('creates keyframe for historical moment', () => {
      // Moon landing moment
      const keyframe = createKeyframe(
        1969, 7, 20, 20, 17, 40,
        'moon_landing',
        1.0,
        ['historic', 'space', 'achievement']
      );

      expect(keyframe.id).toBe('moon_landing');
      expect(keyframe.significance).toBe(1.0);
      expect(keyframe.tags).toEqual(['historic', 'space', 'achievement']);
      expect(keyframe.certainty).toBe(1.0);
      expect(keyframe.timestamp).toBe(dateToNanoseconds(1969, 7, 20, 20, 17, 40));
    });

    test('creates keyframe with custom certainty', () => {
      const keyframe = createKeyframe(
        1963, 11, 22, 12, 30, 0,
        'jfk_shot',
        1.0,
        ['assassination', 'tragic'],
        0.95 // Some uncertainty about exact timing
      );

      expect(keyframe.certainty).toBe(0.95);
    });
  });

  describe('createRuntimeEpoch', () => {
    test('creates film runtime epoch', () => {
      // Mary Poppins runtime (139 minutes)
      const epoch = createRuntimeEpoch(
        139,
        TimePrecision.MILLISECOND,
        'mary_poppins:runtime',
        'Mary Poppins film runtime'
      );

      expect(epoch.epochId).toBe('mary_poppins:runtime');
      expect(epoch.startTime).toBe(0n);
      expect(epoch.endTime).toBe(BigInt(139) * BigInt(TimePrecision.MINUTE));
      expect(epoch.precision).toBe(TimePrecision.MILLISECOND);
    });
  });

  describe('formatDuration', () => {
    test('formats seconds', () => {
      const duration = BigInt(45) * BigInt(TimePrecision.SECOND);
      expect(formatDuration(duration)).toBe('45s');
    });

    test('formats minutes and seconds', () => {
      const duration = BigInt(125) * BigInt(TimePrecision.SECOND); // 2m 5s
      expect(formatDuration(duration)).toBe('2m 5s');
    });

    test('formats hours', () => {
      const duration = BigInt(2) * BigInt(TimePrecision.HOUR);
      expect(formatDuration(duration)).toBe('2h');
    });

    test('formats complex duration', () => {
      const duration = BigInt(90) * BigInt(TimePrecision.MINUTE); // 1h 30m
      expect(formatDuration(duration)).toBe('1h 30m');
    });

    test('formats days', () => {
      const duration = BigInt(3) * BigInt(TimePrecision.DAY) + BigInt(5) * BigInt(TimePrecision.HOUR);
      expect(formatDuration(duration)).toBe('3d 5h');
    });
  });

  describe('utility functions', () => {
    test('yearsToNanoseconds approximates correctly', () => {
      const oneYear = TemporalConversion.yearsToNanoseconds(1);
      const expectedMs = 365.25 * 24 * 60 * 60 * 1000;
      const expected = BigInt(Math.round(expectedMs)) * 1000000n;
      expect(oneYear).toBe(expected);
    });

    test('daysToNanoseconds converts correctly', () => {
      const threeDays = TemporalConversion.daysToNanoseconds(3);
      expect(threeDays).toBe(BigInt(3) * BigInt(TimePrecision.DAY));
    });

    test('isWithinRange works correctly', () => {
      const start = dateToNanoseconds(2023, 1, 1);
      const end = dateToNanoseconds(2023, 12, 31);
      const middle = dateToNanoseconds(2023, 6, 15);
      const before = dateToNanoseconds(2022, 12, 31);
      const after = dateToNanoseconds(2024, 1, 1);

      expect(TemporalConversion.isWithinRange(middle, start, end)).toBe(true);
      expect(TemporalConversion.isWithinRange(before, start, end)).toBe(false);
      expect(TemporalConversion.isWithinRange(after, start, end)).toBe(false);
    });
  });

  describe('integration with existing universe definitions', () => {
    test('can recreate JFK assassination timeline', () => {
      const assassinationDay = createEpoch(
        1963, 11, 22,
        1963, 11, 22,
        TimePrecision.SECOND,
        'jfk:assassination_day',
        'November 22, 1963 - Day of assassination'
      );

      const firstShot = createKeyframe(
        1963, 11, 22, 12, 30, 0,
        'first_shot',
        1.0,
        ['assassination', 'first_shot', 'dealey_plaza'],
        0.9
      );

      const fatalShot = createKeyframe(
        1963, 11, 22, 12, 30, 3,
        'fatal_shot',
        1.0,
        ['assassination', 'fatal_shot', 'zapruder_film'],
        0.95
      );

      expect(assassinationDay.startTime).toBe(dateToNanoseconds(1963, 11, 22));
      expect(firstShot.timestamp).toBe(dateToNanoseconds(1963, 11, 22, 12, 30, 0));
      expect(fatalShot.timestamp).toBe(dateToNanoseconds(1963, 11, 22, 12, 30, 3));
      
      // Verify temporal ordering
      expect(firstShot.timestamp).toBeLessThan(fatalShot.timestamp);
    });

    test('can recreate film runtime structure', () => {
      const runtime = createRuntimeEpoch(
        121, // Star Wars runtime
        TimePrecision.MILLISECOND,
        'sw:runtime',
        'Star Wars runtime'
      );

      const openingCrawl = TemporalConversion.createRuntimeKeyframe(
        0, 0, 'opening_crawl_start', 0.9, ['opening', 'exposition', 'iconic']
      );

      const deathStarDestroyed = TemporalConversion.createRuntimeKeyframe(
        118, 0, 'death_star_destroyed', 1.0, ['climax', 'victory', 'force']
      );

      expect(runtime.startTime).toBe(0n);
      expect(runtime.endTime).toBe(BigInt(121) * BigInt(TimePrecision.MINUTE));
      expect(openingCrawl.timestamp).toBe(0n);
      expect(deathStarDestroyed.timestamp).toBe(BigInt(118 * 60 * 1000) * BigInt(TimePrecision.MILLISECOND));
    });
  });
});
