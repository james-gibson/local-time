import { KSUIDConverter } from './ksuid-converter.js';
import { TimePrecision } from '../core/types.js';

export class ReferenceHelpers {
  /**
   * Generate a unique reference ID using KSUID
   */
  static generateReferenceId(): string {
    return KSUIDConverter.generate();
  }

  /**
   * Generate a temporal ID for a specific moment in a film/universe
   * @param domainId - The domain identifier (e.g., 'film:zootopia:runtime')
   * @param minutes - Minutes into the runtime
   * @param seconds - Seconds into the runtime
   * @param milliseconds - Optional milliseconds
   */
  static generateTemporalId(
    domainId: string, 
    minutes: number, 
    seconds: number, 
    milliseconds: number = 0
  ): string {
    // Convert to nanoseconds from start
    const totalNanoseconds = BigInt(
      (minutes * 60 + seconds) * 1000 + milliseconds
    ) * BigInt(TimePrecision.MILLISECOND);
    
    // Create a temporal event ID with timestamp and random component
    const timestamp = totalNanoseconds.toString(16).padStart(16, '0');
    const randomId = KSUIDConverter.generate().slice(-8);
    
    return `${timestamp}_${randomId}`;
  }

  /**
   * Parse a temporal ID back to its components
   */
  static parseTemporalId(temporalId: string): {
    nanoseconds: bigint;
    randomComponent: string;
  } {
    const [timestampHex, randomComponent] = temporalId.split('_');
    const nanoseconds = BigInt('0x' + timestampHex);
    
    return {
      nanoseconds,
      randomComponent
    };
  }

  /**
   * Convert nanoseconds to human-readable time format
   */
  static nanosecondsToTime(nanoseconds: bigint): {
    minutes: number;
    seconds: number;
    milliseconds: number;
  } {
    const totalMs = Number(nanoseconds / BigInt(TimePrecision.MILLISECOND));
    const minutes = Math.floor(totalMs / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const milliseconds = totalMs % 1000;
    
    return { minutes, seconds, milliseconds };
  }
}

// Export convenience functions for backward compatibility
export const generateReferenceId = ReferenceHelpers.generateReferenceId;
export const generateTemporalId = ReferenceHelpers.generateTemporalId;
