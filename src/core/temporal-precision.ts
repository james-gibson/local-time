import { TimePrecision } from './types.js';

export class TemporalConverter {
  static toNanoseconds(value: number, precision: TimePrecision): bigint {
    return BigInt(value) * precision;
  }
  
  static fromNanoseconds(nanoseconds: bigint, precision: TimePrecision): number {
    return Number(nanoseconds / precision);
  }
  
  static alignToWindow(timestamp: bigint, windowSize: TimePrecision): bigint {
    return (timestamp / windowSize) * windowSize;
  }
  
  static calculateWindow(timestamp: number, windowSizeMs: number = 5000): number {
    return Math.floor(timestamp / windowSizeMs);
  }
}
