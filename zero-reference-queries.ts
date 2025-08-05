import { Universe, ZeroReferenceEpoch } from './temporal-system';
import { ZeroReferenceAddressing, RelativeTimeComponents } from './zero-reference-addressing';

export interface ZeroReferenceQuery {
  relativeTime?: string;        // "T-00:05:30"
  zeroReferenceType?: string;   // "launch", "hhour", "surgery_start"
  beforeAfter?: 'before' | 'after' | 'both';
  timeRange?: {
    from: RelativeTimeComponents;
    to: RelativeTimeComponents;
  };
}

export interface WindowAlignment {
  sourceWindow: string;
  targetWindow: string;
  overlap: {
    percentage: number;
    duration: bigint;
  };
  semanticAlignment: boolean;
}

export class ZeroReferenceQueryService {
  private universes: Map<string, Universe> = new Map();
  
  registerUniverse(universe: Universe) {
    this.universes.set(universe.universeId, universe);
  }
  
  /**
   * Find all universes that have events at a specific relative time
   * Example: Find all missions at "T-00:05:00" (5 minutes before zero)
   */
  async findUniversesAtRelativeTime(
    relativeTimeStr: string,
    options: ZeroReferenceQuery = {}
  ): Promise<Universe[]> {
    const parsed = ZeroReferenceAddressing.parseRelativeAddress(`dummy:dummy:${relativeTimeStr}`);
    if (!parsed.isValid) {
      throw new Error(`Invalid relative time format: ${relativeTimeStr}`);
    }
    
    const results: Universe[] = [];
    
    for (const universe of this.universes.values()) {
      for (const epoch of Object.values(universe.epochs)) {
        if (this.isZeroReferenceEpoch(epoch)) {
          const zeroEpoch = epoch as ZeroReferenceEpoch;
          
          // Check if this epoch matches the query criteria
          if (options.zeroReferenceType && 
              !zeroEpoch.epochId.includes(options.zeroReferenceType)) {
            continue;
          }
          
          // Check if the relative time falls within this epoch's range
          const absoluteTime = ZeroReferenceAddressing.relativeToAbsolute(
            parsed.relativeTime, 
            zeroEpoch
          );
          
          if (absoluteTime >= zeroEpoch.startTime && absoluteTime <= zeroEpoch.endTime) {
            // Check if there are any keyframes or events at this time
            const hasEventAtTime = universe.temporalStructure.keyframes.some(
              keyframe => Math.abs(Number(keyframe.timestamp - absoluteTime)) < 30000000000n // Within 30 seconds
            );
            
            if (hasEventAtTime) {
              results.push(universe);
              break; // Don't add the same universe multiple times
            }
          }
        }
      }
    }
    
    return results;
  }
  
  /**
   * Find aligned windows across different zero-reference systems
   * Example: Find all "T-5 minute" events across different launches
   */
  async findAlignedZeroReferenceWindows(
    sourceRelativeTime: string,
    targetZeroReferenceType?: string
  ): Promise<WindowAlignment[]> {
    const alignments: WindowAlignment[] = [];
    const sourceUniverses = await this.findUniversesAtRelativeTime(sourceRelativeTime);
    
    for (const sourceUniverse of sourceUniverses) {
      const targetUniverses = await this.findUniversesAtRelativeTime(
        sourceRelativeTime,
        { zeroReferenceType: targetZeroReferenceType }
      );
      
      for (const targetUniverse of targetUniverses) {
        if (sourceUniverse.universeId !== targetUniverse.universeId) {
          alignments.push({
            sourceWindow: `${sourceUniverse.universeId}:${sourceRelativeTime}`,
            targetWindow: `${targetUniverse.universeId}:${sourceRelativeTime}`,
            overlap: {
              percentage: 1.0, // Same relative time = perfect alignment
              duration: 0n
            },
            semanticAlignment: true
          });
        }
      }
    }
    
    return alignments;
  }
  
  /**
   * Convert between different zero-reference systems
   * Example: What time in Apollo 11 corresponds to H+1:00 in D-Day?
   */
  async convertBetweenZeroReferenceSystems(
    sourceAddress: string,
    targetUniverseId: string,
    targetEpochId: string
  ): Promise<string | null> {
    const parsed = ZeroReferenceAddressing.parseRelativeAddress(sourceAddress);
    if (!parsed.isValid) return null;
    
    const sourceUniverse = this.universes.get(parsed.universeId);
    const targetUniverse = this.universes.get(targetUniverseId);
    
    if (!sourceUniverse || !targetUniverse) return null;
    
    const sourceEpoch = sourceUniverse.epochs[parsed.epochId] as ZeroReferenceEpoch;
    const targetEpoch = targetUniverse.epochs[targetEpochId] as ZeroReferenceEpoch;
    
    if (!this.isZeroReferenceEpoch(sourceEpoch) || !this.isZeroReferenceEpoch(targetEpoch)) {
      return null;
    }
    
    // Convert source relative time to absolute
    const absoluteTime = ZeroReferenceAddressing.relativeToAbsolute(
      parsed.relativeTime,
      sourceEpoch
    );
    
    // Convert absolute time to target relative time
    const targetRelativeTime = ZeroReferenceAddressing.absoluteToRelative(
      absoluteTime,
      targetEpoch
    );
    
    return ZeroReferenceAddressing.generateRelativeAddress(
      targetUniverseId,
      targetEpochId,
      targetRelativeTime.prefix,
      targetRelativeTime.hours,
      targetRelativeTime.minutes,
      targetRelativeTime.seconds,
      targetRelativeTime.milliseconds
    );
  }
  
  /**
   * Find events in a relative time range
   * Example: Find all events between T-10:00 and T+5:00
   */
  async findEventsInRelativeRange(
    universeId: string,
    epochId: string,
    fromRelative: RelativeTimeComponents,
    toRelative: RelativeTimeComponents
  ): Promise<any[]> {
    const universe = this.universes.get(universeId);
    if (!universe) return [];
    
    const epoch = universe.epochs[epochId] as ZeroReferenceEpoch;
    if (!this.isZeroReferenceEpoch(epoch)) return [];
    
    const fromAbsolute = ZeroReferenceAddressing.relativeToAbsolute(fromRelative, epoch);
    const toAbsolute = ZeroReferenceAddressing.relativeToAbsolute(toRelative, epoch);
    
    const startTime = fromAbsolute < toAbsolute ? fromAbsolute : toAbsolute;
    const endTime = fromAbsolute < toAbsolute ? toAbsolute : fromAbsolute;
    
    return universe.temporalStructure.keyframes.filter(
      keyframe => keyframe.timestamp >= startTime && keyframe.timestamp <= endTime
    );
  }
  
  private isZeroReferenceEpoch(epoch: any): epoch is ZeroReferenceEpoch {
    return epoch && 
           typeof epoch.zeroPoint === 'bigint' &&
           typeof epoch.zeroEvent === 'string' &&
           typeof epoch.beforePrefix === 'string' &&
           typeof epoch.afterPrefix === 'string';
  }
}
