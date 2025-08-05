import { Universe, TemporalWindow, WindowAlignment, UniverseType, TimePrecision } from '../core/types.js';
import { UniverseRegistry } from '../config/universe-registry.js';

export interface WindowSearchOptions {
  universeTypes?: UniverseType[];
  maxFictionalizationDegree?: number;
  realityRelation?: string;
  sortBy?: 'cultural_significance' | 'temporal_overlap';
  order?: 'asc' | 'desc';
}

export class WindowSearch {
  constructor(private registry: UniverseRegistry) {}
  
  async findUniversesInWindow(windowId: string, options: WindowSearchOptions = {}): Promise<Universe[]> {
    const window = await this.getWindow(windowId);
    if (!window) return [];
    
    let universes = this.registry.getAllUniverses();
    
    // Filter by temporal overlap
    universes = universes.filter(universe => this.hasTemporalOverlap(universe, window));
    
    // Apply filters
    if (options.universeTypes) {
      universes = universes.filter(u => options.universeTypes!.includes(u.type));
    }
    
    if (options.maxFictionalizationDegree !== undefined) {
      universes = universes.filter(u => u.realityRelation.fictionalizationDegree <= options.maxFictionalizationDegree!);
    }
    
    if (options.realityRelation) {
      universes = universes.filter(u => u.realityRelation.type === options.realityRelation);
    }
    
    // Sort results
    if (options.sortBy === 'cultural_significance') {
      universes.sort((a, b) => {
        const aScore = a.metadata.cultural_significance;
        const bScore = b.metadata.cultural_significance;
        return options.order === 'desc' ? bScore - aScore : aScore - bScore;
      });
    }
    
    return universes;
  }
  
  async getWindow(windowId: string): Promise<TemporalWindow | null> {
    // Handle calendar windows like "cal:1916"
    if (windowId.startsWith('cal:')) {
      const year = parseInt(windowId.substring(4));
      if (!isNaN(year)) {
        return {
          windowId,
          startTime: BigInt(Date.UTC(year, 0, 1)) * 1000000n,
          endTime: BigInt(Date.UTC(year, 11, 31, 23, 59, 59, 999)) * 1000000n,
          precision: TimePrecision.YEAR,
          aliases: [
            { format: 'year', value: year.toString() }
          ]
        };
      }
    }
    
    // Look for window in registered universes
    for (const universe of this.registry.getAllUniverses()) {
      if (universe.temporalWindows) {
        const window = universe.temporalWindows.find(w => w.windowId === windowId);
        if (window) return window;
      }
    }
    
    return null;
  }
  
  async getWindowAlignments(windowId: string): Promise<WindowAlignment[]> {
    const sourceWindow = await this.getWindow(windowId);
    if (!sourceWindow) return [];
    
    const alignments: WindowAlignment[] = [];
    const universes = this.registry.getAllUniverses();
    
    for (const universe of universes) {
      if (universe.temporalWindows) {
        for (const window of universe.temporalWindows) {
          const overlap = this.calculateOverlap(sourceWindow, window);
          if (overlap.percentage > 0) {
            alignments.push({
              sourceWindow: windowId,
              targetWindow: window.windowId,
              overlap,
              semanticAlignment: this.checkSemanticAlignment(sourceWindow, window)
            });
          }
        }
      }
    }
    
    return alignments;
  }
  
  private hasTemporalOverlap(universe: Universe, window: TemporalWindow): boolean {
    // Check if any layer/epoch overlaps with the window
    for (const layer of universe.layers) {
      for (const epoch of Object.values(layer.epochs)) {
        if (epoch.startTime < window.endTime && epoch.endTime > window.startTime) {
          return true;
        }
      }
    }
    
    // Check temporal windows
    if (universe.temporalWindows) {
      for (const uWindow of universe.temporalWindows) {
        if (uWindow.startTime < window.endTime && uWindow.endTime > window.startTime) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  private calculateOverlap(window1: TemporalWindow, window2: TemporalWindow): { percentage: number; duration: bigint } {
    const overlapStart = window1.startTime > window2.startTime ? window1.startTime : window2.startTime;
    const overlapEnd = window1.endTime < window2.endTime ? window1.endTime : window2.endTime;
    
    if (overlapStart >= overlapEnd) {
      return { percentage: 0, duration: 0n };
    }
    
    const overlapDuration = overlapEnd - overlapStart;
    const window1Duration = window1.endTime - window1.startTime;
    const percentage = Number(overlapDuration * 100n / window1Duration) / 100;
    
    return { percentage, duration: overlapDuration };
  }
  
  private checkSemanticAlignment(window1: TemporalWindow, window2: TemporalWindow): boolean {
    // Check if windows have semantic relationship through aliases
    for (const alias1 of window1.aliases) {
      for (const alias2 of window2.aliases) {
        if (alias1.value === alias2.value && alias1.format === alias2.format) {
          return true;
        }
      }
    }
    return false;
  }
}
