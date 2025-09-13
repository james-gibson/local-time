import { TimePrecision, TemporalEpoch, TemporalKeyframe, TemporalSegment } from '../core/types';

/**
 * Temporal conversion utilities for working with nanosecond timestamps
 * and creating temporal epochs with proper precision handling
 */
export class TemporalConversion {
  
  /**
   * Convert a date to nanoseconds since Unix epoch
   * @param year - Full year (e.g., 1969, 2023)
   * @param month - Month (1-12, not 0-11 like Date constructor)
   * @param day - Day of month (1-31)
   * @param hour - Hour (0-23), defaults to 0
   * @param minute - Minute (0-59), defaults to 0
   * @param second - Second (0-59), defaults to 0
   * @param millisecond - Millisecond (0-999), defaults to 0
   * @returns Nanoseconds since Unix epoch as BigInt
   */
  static dateToNanoseconds(
    year: number,
    month: number,
    day: number,
    hour: number = 0,
    minute: number = 0,
    second: number = 0,
    millisecond: number = 0
  ): bigint {
    // Convert to 0-based month for Date constructor
    const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second, millisecond));
    const milliseconds = BigInt(date.getTime());
    return milliseconds * 1000000n; // Convert to nanoseconds
  }

  /**
   * Convert a Date object to nanoseconds since Unix epoch
   */
  static dateObjectToNanoseconds(date: Date): bigint {
    const milliseconds = BigInt(date.getTime());
    return milliseconds * 1000000n; // Convert to nanoseconds
  }

  /**
   * Convert nanoseconds since Unix epoch to a Date object
   * @param nanoseconds - Nanoseconds since Unix epoch
   * @returns JavaScript Date object
   */
  static nanosecondsToDate(nanoseconds: bigint): Date {
    const milliseconds = Number(nanoseconds / 1000000n);
    return new Date(milliseconds);
  }

  /**
   * Create a temporal epoch with proper start/end times and precision
   * @param startYear - Start year
   * @param startMonth - Start month (1-12)
   * @param startDay - Start day
   * @param endYear - End year
   * @param endMonth - End month (1-12)
   * @param endDay - End day
   * @param precision - Temporal precision to use
   * @param epochId - Optional epoch ID
   * @param description - Optional description
   * @returns Temporal epoch object
   */
  static createEpoch(
    startYear: number,
    startMonth: number,
    startDay: number,
    endYear: number,
    endMonth: number,
    endDay: number,
    precision: TimePrecision,
    epochId?: string,
    description?: string
  ): TemporalEpoch {
    return {
      epochId,
      startTime: TemporalConversion.dateToNanoseconds(startYear, startMonth, startDay),
      endTime: TemporalConversion.dateToNanoseconds(endYear, endMonth, endDay, 23, 59, 59, 999),
      precision,
      description
    };
  }

  /**
   * Create a temporal epoch for a single day
   * @param year - Year
   * @param month - Month (1-12)
   * @param day - Day
   * @param precision - Temporal precision to use
   * @param epochId - Optional epoch ID
   * @param description - Optional description
   */
  static createDayEpoch(
    year: number,
    month: number,
    day: number,
    precision: TimePrecision = TimePrecision.HOUR,
    epochId?: string,
    description?: string
  ) {
    return TemporalConversion.createEpoch(year, month, day, year, month, day, precision, epochId, description);
  }

  /**
   * Create a temporal epoch for a full year
   * @param year - Year
   * @param precision - Temporal precision to use
   * @param epochId - Optional epoch ID
   * @param description - Optional description
   */
  static createYearEpoch(
    year: number,
    precision: TimePrecision = TimePrecision.DAY,
    epochId?: string,
    description?: string
  ) {
    return TemporalConversion.createEpoch(year, 1, 1, year, 12, 31, precision, epochId, description);
  }

  /**
   * Create a temporal keyframe at a specific date and time
   * @param year - Year
   * @param month - Month (1-12)
   * @param day - Day
   * @param hour - Hour (0-23), defaults to 0
   * @param minute - Minute (0-59), defaults to 0
   * @param second - Second (0-59), defaults to 0
   * @param id - Keyframe ID
   * @param significance - Significance (0.0-1.0)
   * @param tags - Tags for the keyframe
   * @param certainty - Certainty level (0.0-1.0), defaults to 1.0
   * @returns Temporal keyframe object
   */
  static createKeyframe(
    year: number,
    month: number,
    day: number,
    hour: number = 0,
    minute: number = 0,
    second: number = 0,
    id: string,
    significance: number,
    tags: string[],
    certainty: number = 1.0
  ): TemporalKeyframe {
    return {
      id,
      timestamp: TemporalConversion.dateToNanoseconds(year, month, day, hour, minute, second),
      significance,
      tags,
      certainty
    };
  }

  /**
   * Create a temporal segment between two dates
   * @param startYear - Start year
   * @param startMonth - Start month (1-12)
   * @param startDay - Start day
   * @param startHour - Start hour, defaults to 0
   * @param endYear - End year
   * @param endMonth - End month (1-12)
   * @param endDay - End day
   * @param endHour - End hour, defaults to 23
   * @param id - Segment ID
   * @param type - Segment type
   * @param status - Optional status
   * @param jurisdiction - Optional jurisdiction
   * @returns Temporal segment object
   */
  static createSegment(
    startYear: number,
    startMonth: number,
    startDay: number,
    startHour: number = 0,
    endYear: number,
    endMonth: number,
    endDay: number,
    endHour: number = 23,
    id: string,
    type: 'sequence' | 'act' | 'scene' | 'phase' | 'countdown' | 'mission_phase' | 
          'life_period' | 'education' | 'career' | 'public_service' | 'legal_period' | 
          'legislation_active' | 'court_jurisdiction',
    status?: 'active' | 'inactive' | 'suspended' | 'overturned' | 'amended',
    jurisdiction?: string
  ): TemporalSegment {
    return {
      id,
      start: TemporalConversion.dateToNanoseconds(startYear, startMonth, startDay, startHour),
      end: TemporalConversion.dateToNanoseconds(endYear, endMonth, endDay, endHour, 59, 59, 999),
      type,
      status,
      jurisdiction
    };
  }

  /**
   * Create a runtime-based epoch for films/media (starts at 0)
   * @param durationMinutes - Duration in minutes
   * @param precision - Temporal precision to use
   * @param epochId - Optional epoch ID
   * @param description - Optional description
   * @returns Runtime epoch starting at 0
   */
  static createRuntimeEpoch(
    durationMinutes: number,
    precision: TimePrecision = TimePrecision.MILLISECOND,
    epochId?: string,
    description?: string
  ): TemporalEpoch {
    return {
      epochId,
      startTime: 0n,
      endTime: BigInt(durationMinutes) * BigInt(TimePrecision.MINUTE),
      precision,
      description
    };
  }

  /**
   * Create a runtime keyframe at a specific time in a film/media
   * @param minutes - Minutes into runtime
   * @param seconds - Seconds into runtime
   * @param id - Keyframe ID
   * @param significance - Significance (0.0-1.0)
   * @param tags - Tags for the keyframe
   * @param milliseconds - Optional milliseconds, defaults to 0
   * @returns Runtime keyframe object
   */
  static createRuntimeKeyframe(
    minutes: number,
    seconds: number,
    id: string,
    significance: number,
    tags: string[],
    milliseconds: number = 0
  ): TemporalKeyframe {
    const totalMs = (minutes * 60 + seconds) * 1000 + milliseconds;
    return {
      id,
      timestamp: BigInt(totalMs) * BigInt(TimePrecision.MILLISECOND),
      significance,
      tags
    };
  }

  /**
   * Create a runtime segment for films/media
   * @param startMinutes - Start minutes
   * @param startSeconds - Start seconds
   * @param endMinutes - End minutes
   * @param endSeconds - End seconds
   * @param id - Segment ID
   * @param type - Segment type
   * @returns Runtime segment object
   */
  static createRuntimeSegment(
    startMinutes: number,
    startSeconds: number,
    endMinutes: number,
    endSeconds: number,
    id: string,
    type: 'sequence' | 'act' | 'scene' | 'phase'
  ): TemporalSegment {
    const startMs = (startMinutes * 60 + startSeconds) * 1000;
    const endMs = (endMinutes * 60 + endSeconds) * 1000;
    
    return {
      id,
      start: BigInt(startMs) * BigInt(TimePrecision.MILLISECOND),
      end: BigInt(endMs) * BigInt(TimePrecision.MILLISECOND),
      type
    };
  }

  /**
   * Format nanoseconds as human-readable duration
   * @param nanoseconds - Duration in nanoseconds
   * @returns Human-readable duration string
   */
  static formatDuration(nanoseconds: bigint): string {
    const totalSeconds = Number(nanoseconds / BigInt(TimePrecision.SECOND));
    
    if (totalSeconds < 60) {
      return `${totalSeconds}s`;
    }
    
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    if (minutes < 60) {
      return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours < 24) {
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
    
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  }

  /**
   * Calculate the duration between two nanosecond timestamps
   * @param start - Start timestamp in nanoseconds
   * @param end - End timestamp in nanoseconds
   * @returns Duration in nanoseconds
   */
  static calculateDuration(start: bigint, end: bigint): bigint {
    return end - start;
  }

  /**
   * Check if a timestamp falls within a given range
   * @param timestamp - Timestamp to check
   * @param rangeStart - Range start timestamp
   * @param rangeEnd - Range end timestamp
   * @returns True if timestamp is within range
   */
  static isWithinRange(timestamp: bigint, rangeStart: bigint, rangeEnd: bigint): boolean {
    return timestamp >= rangeStart && timestamp <= rangeEnd;
  }

  /**
   * Convert years to nanoseconds (approximate, using 365.25 days per year)
   * @param years - Number of years
   * @returns Nanoseconds equivalent
   */
  static yearsToNanoseconds(years: number): bigint {
    return BigInt(Math.round(years * 365.25 * 24 * 60 * 60 * 1000)) * 1000000n;
  }

  /**
   * Convert days to nanoseconds
   * @param days - Number of days
   * @returns Nanoseconds equivalent
   */
  static daysToNanoseconds(days: number): bigint {
    return BigInt(days) * BigInt(TimePrecision.DAY);
  }

  /**
   * Convert hours to nanoseconds
   * @param hours - Number of hours
   * @returns Nanoseconds equivalent
   */
  static hoursToNanoseconds(hours: number): bigint {
    return BigInt(hours) * BigInt(TimePrecision.HOUR);
  }

  /**
   * Convert minutes to nanoseconds
   * @param minutes - Number of minutes
   * @returns Nanoseconds equivalent
   */
  static minutesToNanoseconds(minutes: number): bigint {
    return BigInt(minutes) * BigInt(TimePrecision.MINUTE);
  }
}

// Export convenience functions for common operations
export const {
  nanosecondsToDate,
  createEpoch,
  createDayEpoch,
  createYearEpoch,
  createKeyframe,
  createSegment,
  createRuntimeEpoch,
  createRuntimeKeyframe,
  createRuntimeSegment,
  formatDuration,
  calculateDuration,
  isWithinRange,
  yearsToNanoseconds,
  daysToNanoseconds,
  hoursToNanoseconds,
  minutesToNanoseconds
} = TemporalConversion;

// Export dateToNanoseconds with overloads for different signatures
export function dateToNanoseconds(date: Date): bigint;
export function dateToNanoseconds(year: number, month: number, day: number): bigint;
export function dateToNanoseconds(year: number, month: number, day: number, hour: number, minute: number, second: number): bigint;
export function dateToNanoseconds(year: number, month: number, day: number, hour: number, minute: number, second: number, millisecond: number): bigint;
export function dateToNanoseconds(
  dateOrYear: Date | number,
  month?: number,
  day?: number,
  hour?: number,
  minute?: number,
  second?: number,
  millisecond?: number
): bigint {
  if (dateOrYear instanceof Date) {
    return TemporalConversion.dateObjectToNanoseconds(dateOrYear);
  } else {
    return TemporalConversion.dateToNanoseconds(
      dateOrYear,
      month!,
      day!,
      hour || 0,
      minute || 0,
      second || 0,
      millisecond || 0
    );
  }
}
