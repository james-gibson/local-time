import { RelativeTimeComponents, ZeroReferenceEpoch } from '../core/types.js';

export class ZeroReferenceAddressing {
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
  
  static parseRelativeAddress(address: string): {
    universeId: string;
    epochId: string;
    relativeTime: RelativeTimeComponents;
    isValid: boolean;
  } {
    const parts = address.split(':');
    if (parts.length < 3) {
      return { universeId: '', epochId: '', relativeTime: { prefix: '', hours: 0, minutes: 0, seconds: 0 }, isValid: false };
    }
    
    const universeId = parts.slice(0, -2).join(':');
    const epochId = parts[parts.length - 2];
    const timeStr = parts[parts.length - 1];
    
    const relativeTime = this.parseRelativeTime(timeStr);
    if (!relativeTime) {
      return { universeId: '', epochId: '', relativeTime: { prefix: '', hours: 0, minutes: 0, seconds: 0 }, isValid: false };
    }
    
    return {
      universeId,
      epochId,
      relativeTime,
      isValid: true
    };
  }
  
  static relativeToAbsolute(
    relativeTime: RelativeTimeComponents,
    zeroEpoch: ZeroReferenceEpoch
  ): bigint {
    const totalMs = (relativeTime.hours * 3600 + relativeTime.minutes * 60 + relativeTime.seconds) * 1000 + (relativeTime.milliseconds || 0);
    const offsetNs = BigInt(totalMs) * 1000000n;
    
    if (relativeTime.prefix.endsWith('-')) {
      return zeroEpoch.zeroPoint - offsetNs;
    } else {
      return zeroEpoch.zeroPoint + offsetNs;
    }
  }
  
  static absoluteToRelative(
    absoluteTime: bigint,
    zeroEpoch: ZeroReferenceEpoch
  ): RelativeTimeComponents {
    const diffNs = absoluteTime - zeroEpoch.zeroPoint;
    const diffMs = Number(diffNs / 1000000n);
    const isNegative = diffMs < 0;
    const absDiffMs = Math.abs(diffMs);
    
    const hours = Math.floor(absDiffMs / (1000 * 60 * 60));
    const minutes = Math.floor((absDiffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((absDiffMs % (1000 * 60)) / 1000);
    const milliseconds = absDiffMs % 1000;
    
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
