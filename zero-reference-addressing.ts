import { ZeroReferenceEpoch, TimePrecision } from './temporal-system';

export interface RelativeTimeComponents {
  prefix: string;      // "T-", "T+", "H-", "H+", etc.
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds?: number;
}

export class ZeroReferenceAddressing {
  
  /**
   * Generate a relative temporal address
   * Format: "universe:epoch:prefix:HH:MM:SS"
   * Example: "nasa:apollo11:1969:launch:T-00:05:30"
   */
  static generateRelativeAddress(
    universeId: string,
    epochId: string,
    prefix: string,
    hours: number,
    minutes: number,
    seconds: number = 0,
    milliseconds: number = 0
  ): string {
    const timeStr = this.formatRelativeTime(hours, minutes, seconds, milliseconds);
    return `${universeId}:${epochId}:${prefix}${timeStr}`;
  }
  
  /**
   * Parse a relative temporal address
   */
  static parseRelativeAddress(address: string): {
    universeId: string;
    epochId: string;
    relativeTime: RelativeTimeComponents;
    isValid: boolean;
  } {
    const parts = address.split(':');
    if (parts.length < 4) {
      return { universeId: '', epochId: '', relativeTime: null, isValid: false };
    }
    
    const universeId = parts.slice(0, -2).join(':');
    const epochId = parts[parts.length - 2];
    const timeComponent = parts[parts.length - 1];
    
    const relativeTime = this.parseRelativeTime(timeComponent);
    if (!relativeTime) {
      return { universeId, epochId, relativeTime: null, isValid: false };
    }
    
    return {
      universeId,
      epochId,
      relativeTime,
      isValid: true
    };
  }
  
  /**
   * Convert relative time to absolute timestamp
   */
  static relativeToAbsolute(
    relativeTime: RelativeTimeComponents,
    zeroEpoch: ZeroReferenceEpoch
  ): bigint {
    const totalMs = (
      relativeTime.hours * 3600 +
      relativeTime.minutes * 60 +
      relativeTime.seconds
    ) * 1000 + (relativeTime.milliseconds || 0);
    
    const offsetNs = BigInt(totalMs) * 1000000n;
    
    if (relativeTime.prefix.endsWith('-')) {
      return zeroEpoch.zeroPoint - offsetNs;
    } else {
      return zeroEpoch.zeroPoint + offsetNs;
    }
  }
  
  /**
   * Convert absolute timestamp to relative time
   */
  static absoluteToRelative(
    absoluteTime: bigint,
    zeroEpoch: ZeroReferenceEpoch
  ): RelativeTimeComponents {
    const diffNs = absoluteTime - zeroEpoch.zeroPoint;
    const isNegative = diffNs < 0n;
    const absDiffNs = isNegative ? -diffNs : diffNs;
    
    const totalMs = Number(absDiffNs / 1000000n);
    const hours = Math.floor(totalMs / (1000 * 60 * 60));
    const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((totalMs % (1000 * 60)) / 1000);
    const milliseconds = totalMs % 1000;
    
    const prefix = isNegative ? zeroEpoch.beforePrefix : zeroEpoch.afterPrefix;
    
    return {
      prefix,
      hours,
      minutes,
      seconds,
      milliseconds
    };
  }
  
  private static formatRelativeTime(
    hours: number,
    minutes: number,
    seconds: number,
    milliseconds: number = 0
  ): string {
    const h = hours.toString().padStart(2, '0');
    const m = minutes.toString().padStart(2, '0');
    const s = seconds.toString().padStart(2, '0');
    
    if (milliseconds > 0) {
      const ms = milliseconds.toString().padStart(3, '0');
      return `${h}:${m}:${s}.${ms}`;
    }
    
    return `${h}:${m}:${s}`;
  }
  
  private static parseRelativeTime(timeStr: string): RelativeTimeComponents | null {
    // Match patterns like "T-00:05:30" or "H+02:30:45.123"
    const match = timeStr.match(/^([A-Z][+-])(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?$/);
    if (!match) return null;
    
    const [, prefix, hours, minutes, seconds, milliseconds] = match;
    
    return {
      prefix,
      hours: parseInt(hours, 10),
      minutes: parseInt(minutes, 10),
      seconds: parseInt(seconds, 10),
      milliseconds: milliseconds ? parseInt(milliseconds, 10) : 0
    };
  }
}
