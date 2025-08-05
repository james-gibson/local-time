const KSUID = require('ksuid');

export class KSUIDConverter {
  static generate(): string {
    return KSUID.randomSync().string;
  }
  
  static generateWithTimestamp(timestamp: Date): string {
    return KSUID.randomSync(timestamp).string;
  }
  
  static toUTC(ksuidString: string): number {
    try {
      const parsed = KSUID.parse(ksuidString);
      return parsed.date.getTime();
    } catch {
      return NaN;
    }
  }
  
  static fromUTC(timestamp: number): string {
    try {
      return KSUID.randomSync(new Date(timestamp)).string;
    } catch {
      throw new Error('Invalid timestamp for KSUID generation');
    }
  }
  
  static isValid(ksuidString: string): boolean {
    try {
      KSUID.parse(ksuidString);
      return true;
    } catch {
      return false;
    }
  }
  
  static getTimestamp(ksuidString: string): number {
    try {
      const parsed = KSUID.parse(ksuidString);
      return parsed.timestamp;
    } catch {
      return NaN;
    }
  }
}
