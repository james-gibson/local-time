import { Universe, ZeroReferenceEpoch } from './temporal-system';
import { ZeroReferenceAddressing } from './addressing/zero-reference-addressing';
// import { ZeroReferenceAddressing, RelativeTimeComponents } from './zero-reference-addressing';

export interface RelativeTimeComponents {
  prefix: string;
  days?: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds?: number;
}

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
    // Simple parsing for now - would use ZeroReferenceAddressing when available
    if (!relativeTimeStr.match(/^[TH][+-]\d{2}:\d{2}:\d{2}$/)) {
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
          // Simple conversion for now - would use ZeroReferenceAddressing when available
          const absoluteTime = zeroEpoch.zeroPoint;
          
          if (absoluteTime >= zeroEpoch.startTime && absoluteTime <= zeroEpoch.endTime) {
            // Check if there are any keyframes or events at this time
            const hasEventAtTime = universe.temporalStructure?.keyframes?.some(
              (keyframe: any) => Math.abs(Number(keyframe.timestamp - absoluteTime)) < 30000000000n // Within 30 seconds
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
  /**
   * Convert an address from one zero-reference frame into another.
   *
   * #56: this was a stub. It parsed well enough to look like it had worked, and then
   * returned the literal string "converted_time" instead of an address. That is worse than
   * an obvious failure: a caller could believe two addresses referred to the same moment.
   *
   * The old parse was wrong in a way that only stayed harmless because the result was
   * discarded:
   *
   *   'nasa:apollo11:1969:launch:T-00:00:00'.split(':')
   *     -> ['nasa','apollo11','1969','launch','T-00','00','00']
   *
   * A relative offset contains colons, so `slice(0, -2)` produced the source universe id
   * `nasa:apollo11:1969:launch` and the source epoch `T-00`. Both wrong.
   *
   * The universe id is resolved here by matching the longest *registered* id that prefixes
   * the address, rather than assuming a segment count. `parseRelativeAddress` hardcodes
   * `parts.splice(0, 3)`, which is correct for the three-segment ids in this repo today and
   * silently wrong for any other.
   *
   * Returns null when the address cannot be resolved, names an unknown universe or epoch,
   * or carries an unparseable offset.
   */
  async convertBetweenZeroReferenceSystems(
    sourceAddress: string,
    targetUniverseId: string,
    targetEpochId: string
  ): Promise<string | null> {
    const source = this.resolveAddress(sourceAddress);
    if (!source) return null;

    const sourceUniverse = this.universes.get(source.universeId);
    const targetUniverse = this.universes.get(targetUniverseId);
    if (!sourceUniverse || !targetUniverse) return null;

    const sourceEpoch = sourceUniverse.epochs[source.epochId] as ZeroReferenceEpoch;
    const targetEpoch = targetUniverse.epochs[targetEpochId] as ZeroReferenceEpoch;
    if (!this.isZeroReferenceEpoch(sourceEpoch) || !this.isZeroReferenceEpoch(targetEpoch)) {
      return null;
    }

    let relative: RelativeTimeComponents;
    try {
      const parsed = ZeroReferenceAddressing.parseRelativeTime(source.timeStr);
      if (!parsed) return null;
      relative = parsed;
    } catch {
      // parseRelativeTime throws on a non-match despite its declared `| null` return type.
      return null;
    }

    const absolute = ZeroReferenceAddressing.relativeToAbsolute(relative, sourceEpoch);
    const inTarget = ZeroReferenceAddressing.absoluteToRelative(absolute, targetEpoch);

    // generateRelativeAddress rather than a hand-built string: it is the canonical
    // formatter and wraps hours into days itself.
    //
    // Limitation worth stating plainly: it ignores the target epoch's own
    // `relativeFormat`. Apollo 11 to D-Day is ~9,131 days, and no HH:MM:SS form can
    // express that, so the day form is emitted regardless. The address is correct and
    // lossless; it is not always re-parseable by `parseRelativeAddress`, whose pattern
    // accepts only two-digit hours. Filed as a follow-up rather than fixed here.
    return ZeroReferenceAddressing.generateRelativeAddress(
      targetUniverseId,
      targetEpochId,
      inTarget.prefix,
      inTarget.hours,
      inTarget.minutes,
      inTarget.seconds,
      inTarget.milliseconds,
    );
  }

  /**
   * Split `<universeId>:<epochId>:<relative offset>` using the universe registry to decide
   * where the universe id ends, rather than assuming a segment count.
   */
  private resolveAddress(
    address: string,
  ): { universeId: string; epochId: string; timeStr: string } | null {
    let best: { universeId: string; epochId: string; timeStr: string } | null = null;
    for (const universeId of this.universes.keys()) {
      const prefix = `${universeId}:`;
      if (!address.startsWith(prefix)) continue;
      const rest = address.slice(prefix.length);
      const sep = rest.indexOf(':');
      if (sep === -1) continue;
      const candidate = {
        universeId,
        epochId: rest.slice(0, sep),
        timeStr: rest.slice(sep + 1),
      };
      // One universe id can prefix another, so take the longest match: more specific wins.
      if (!best || candidate.universeId.length > best.universeId.length) best = candidate;
    }
    return best;
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
    
    // Resolve both bounds through the addressing module rather than inventing a second
    // conversion here. The previous implementation ignored both arguments entirely and
    // returned [zeroPoint, zeroPoint + 1h], so a query for T-00:10:00..T+00:05:00 silently
    // returned the hour *after* liftoff - which excluded go_no_go_poll at 13:26:40, the
    // very event a pre-liftoff range exists to ask about.
    //
    // The prefix is validated against the epoch's own before/after prefixes. A mismatch
    // used to be impossible to detect because the prefix was never read; guessing the sign
    // would return a well-formed timestamp for the wrong interval, which is the failure
    // mode this function is being fixed for.
    this.assertUsablePrefix(epoch, fromRelative);
    this.assertUsablePrefix(epoch, toRelative);

    const fromAbsolute = ZeroReferenceAddressing.relativeToAbsolute(fromRelative, epoch);
    const toAbsolute = ZeroReferenceAddressing.relativeToAbsolute(toRelative, epoch);

    // A caller may legitimately pass the bounds in either order (e.g. an address dragged
    // backwards), so normalise rather than returning nothing.
    const startTime = fromAbsolute <= toAbsolute ? fromAbsolute : toAbsolute;
    const endTime = fromAbsolute <= toAbsolute ? toAbsolute : fromAbsolute;

    const keyframes = universe.temporalStructure?.keyframes ?? [];
    return keyframes.filter(
      (keyframe: any) => keyframe.timestamp >= startTime && keyframe.timestamp <= endTime
    );
  }
  
  /**
   * A relative bound is only meaningful against the epoch that interprets it. An
   * unrecognised prefix is rejected rather than guessed at, because a wrong guess produces
   * a valid-looking timestamp for the wrong interval - indistinguishable from a correct
   * answer to anyone reading the result.
   */
  private assertUsablePrefix(epoch: ZeroReferenceEpoch, relative: RelativeTimeComponents): void {
    const known = [epoch.beforePrefix, epoch.afterPrefix];
    if (!known.includes(relative.prefix)) {
      throw new Error(
        `Unrecognised prefix "${relative.prefix}" for epoch "${epoch.epochId}"; ` +
        `expected one of ${known.map(p => `"${p}"`).join(' or ')}.`
      );
    }
  }

  private isZeroReferenceEpoch(epoch: any): epoch is ZeroReferenceEpoch {
    return epoch && 
           typeof epoch.zeroPoint === 'bigint' &&
           typeof epoch.zeroEvent === 'string' &&
           typeof epoch.beforePrefix === 'string' &&
           typeof epoch.afterPrefix === 'string';
  }
}
