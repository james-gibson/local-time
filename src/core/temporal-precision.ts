import { TimePrecision } from './types.js';

export class TemporalConverter {
  static toNanoseconds(value: number, precision: TimePrecision): bigint {
    return BigInt(value) * BigInt(precision);
  }
  
  static fromNanoseconds(nanoseconds: bigint, precision: TimePrecision): number {
    return Number(nanoseconds / BigInt(precision));
  }
  
  static alignToWindow(timestamp: bigint, windowSize: TimePrecision): bigint {
    const windowSizeBigInt = BigInt(windowSize);
    return (timestamp / windowSizeBigInt) * windowSizeBigInt;
  }
  
  static calculateWindow(timestamp: number, windowSizeMs: number = 5000): number {
    return Math.floor(timestamp / windowSizeMs);
  }
}
