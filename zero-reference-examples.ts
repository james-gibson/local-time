import { Universe, ZeroReferenceEpoch, TimePrecision, TemporalSegment } from './temporal-system';
import { ZeroReferenceAddressing } from './zero-reference-addressing';

// Apollo 11 Mission Universe with T-minus/T-plus timeline
export const apollo11Universe: Universe = {
  universeId: "nasa:apollo11:1969",
  type: 'mission',
  
  epochs: {
    launch: {
      epochId: "apollo11:launch",
      startTime: BigInt(Date.UTC(1969, 6, 16, 8, 0, 0)) * 1000000n, // T-5:32:00
      endTime: BigInt(Date.UTC(1969, 6, 16, 19, 0, 0)) * 1000000n,   // T+5:28:00
      precision: TimePrecision.SECOND,
      description: "Apollo 11 launch timeline",
      
      // Zero-reference specific properties
      zeroPoint: BigInt(Date.UTC(1969, 6, 16, 13, 32, 0)) * 1000000n, // Liftoff
      zeroEvent: "Apollo 11 liftoff",
      beforePrefix: "T-",
      afterPrefix: "T+",
      relativeFormat: 'HMS'
    } as ZeroReferenceEpoch,
    
    mission: {
      epochId: "apollo11:mission",
      startTime: BigInt(Date.UTC(1969, 6, 16, 13, 32, 0)) * 1000000n,
      endTime: BigInt(Date.UTC(1969, 6, 24, 16, 50, 0)) * 1000000n,
      precision: TimePrecision.MINUTE,
      description: "Full Apollo 11 mission timeline"
    }
  },
  
  temporalStructure: {
    segments: [
      {
        id: "final_countdown",
        start: BigInt(Date.UTC(1969, 6, 16, 13, 22, 0)) * 1000000n, // T-10:00
        end: BigInt(Date.UTC(1969, 6, 16, 13, 32, 0)) * 1000000n,   // T+00:00
        type: 'countdown'
      },
      {
        id: "first_stage",
        start: BigInt(Date.UTC(1969, 6, 16, 13, 32, 0)) * 1000000n, // T+00:00
        end: BigInt(Date.UTC(1969, 6, 16, 13, 34, 46)) * 1000000n,  // T+02:46
        type: 'mission_phase'
      },
      {
        id: "second_stage",
        start: BigInt(Date.UTC(1969, 6, 16, 13, 34, 46)) * 1000000n, // T+02:46
        end: BigInt(Date.UTC(1969, 6, 16, 13, 44, 0)) * 1000000n,    // T+12:00
        type: 'mission_phase'
      }
    ],
    
    keyframes: [
      {
        id: "go_no_go_poll",
        timestamp: BigInt(Date.UTC(1969, 6, 16, 13, 26, 30)) * 1000000n, // T-05:30
        significance: 0.9,
        tags: ["critical_decision", "go_no_go"]
      },
      {
        id: "liftoff",
        timestamp: BigInt(Date.UTC(1969, 6, 16, 13, 32, 0)) * 1000000n, // T+00:00
        significance: 1.0,
        tags: ["liftoff", "zero_point", "historic"]
      },
      {
        id: "first_stage_separation",
        timestamp: BigInt(Date.UTC(1969, 6, 16, 13, 34, 46)) * 1000000n, // T+02:46
        significance: 0.8,
        tags: ["separation", "milestone"]
      }
    ],
    
    windows: {
      strategy: 'countdown_based',
      avgWindowSize: 5n * 60n * 1000000000n // 5-minute windows
    }
  },
  
  metadata: {
    canonicalName: "Apollo 11",
    creators: ["NASA", "Wernher von Braun"],
    released: new Date("1969-07-16"),
    cultural_significance: 1.0
  }
};

// D-Day Historical Event with H-Hour system
export const ddayUniverse: Universe = {
  universeId: "history:dday:1944",
  type: 'historical_event',
  
  epochs: {
    operation: {
      epochId: "dday:hhour",
      startTime: BigInt(Date.UTC(1944, 5, 6, 0, 0, 0)) * 1000000n,  // H-06:30
      endTime: BigInt(Date.UTC(1944, 5, 6, 18, 0, 0)) * 1000000n,   // H+11:30
      precision: TimePrecision.MINUTE,
      description: "D-Day Operation Overlord H-Hour timeline",
      
      zeroPoint: BigInt(Date.UTC(1944, 5, 6, 6, 30, 0)) * 1000000n, // H-Hour
      zeroEvent: "First wave landings begin",
      beforePrefix: "H-",
      afterPrefix: "H+",
      relativeFormat: 'HMS'
    } as ZeroReferenceEpoch
  },
  
  temporalStructure: {
    segments: [
      {
        id: "pre_assault",
        start: BigInt(Date.UTC(1944, 5, 6, 0, 0, 0)) * 1000000n,   // H-06:30
        end: BigInt(Date.UTC(1944, 5, 6, 6, 30, 0)) * 1000000n,    // H+00:00
        type: 'phase'
      },
      {
        id: "first_wave",
        start: BigInt(Date.UTC(1944, 5, 6, 6, 30, 0)) * 1000000n,  // H+00:00
        end: BigInt(Date.UTC(1944, 5, 6, 7, 30, 0)) * 1000000n,    // H+01:00
        type: 'phase'
      }
    ],
    
    keyframes: [
      {
        id: "airborne_drops",
        timestamp: BigInt(Date.UTC(1944, 5, 6, 0, 30, 0)) * 1000000n, // H-06:00
        significance: 0.9,
        tags: ["airborne", "preparation"]
      },
      {
        id: "naval_bombardment",
        timestamp: BigInt(Date.UTC(1944, 5, 6, 5, 30, 0)) * 1000000n, // H-01:00
        significance: 0.8,
        tags: ["bombardment", "preparation"]
      },
      {
        id: "hhour",
        timestamp: BigInt(Date.UTC(1944, 5, 6, 6, 30, 0)) * 1000000n, // H+00:00
        significance: 1.0,
        tags: ["hhour", "zero_point", "historic", "invasion"]
      }
    ],
    
    windows: {
      strategy: 'phase_based'
    }
  },
  
  metadata: {
    canonicalName: "D-Day Operation Overlord",
    creators: ["Allied Forces", "Dwight D. Eisenhower"],
    cultural_significance: 1.0
  }
};

// Example usage and conversions
export class ZeroReferenceExamples {
  
  static generateApollo11Addresses() {
    const launchEpoch = apollo11Universe.epochs.launch as ZeroReferenceEpoch;
    
    return {
      // T-5:30 (go/no-go poll)
      goNoGo: ZeroReferenceAddressing.generateRelativeAddress(
        "nasa:apollo11:1969", "launch", "T-", 0, 5, 30
      ),
      
      // T+0:00 (liftoff)
      liftoff: ZeroReferenceAddressing.generateRelativeAddress(
        "nasa:apollo11:1969", "launch", "T+", 0, 0, 0
      ),
      
      // T+2:46 (first stage separation)
      separation: ZeroReferenceAddressing.generateRelativeAddress(
        "nasa:apollo11:1969", "launch", "T+", 0, 2, 46
      )
    };
  }
  
  static generateDDayAddresses() {
    return {
      // H-6:00 (airborne drops)
      airborne: ZeroReferenceAddressing.generateRelativeAddress(
        "history:dday:1944", "operation", "H-", 6, 0, 0
      ),
      
      // H+0:00 (H-Hour)
      hhour: ZeroReferenceAddressing.generateRelativeAddress(
        "history:dday:1944", "operation", "H+", 0, 0, 0
      ),
      
      // H+1:00 (first wave complete)
      firstWave: ZeroReferenceAddressing.generateRelativeAddress(
        "history:dday:1944", "operation", "H+", 1, 0, 0
      )
    };
  }
  
  static demonstrateConversions() {
    const launchEpoch = apollo11Universe.epochs.launch as ZeroReferenceEpoch;
    
    // Convert T-5:30 to absolute time
    const relativeTime = { prefix: "T-", hours: 0, minutes: 5, seconds: 30, milliseconds: 0 };
    const absoluteTime = ZeroReferenceAddressing.relativeToAbsolute(relativeTime, launchEpoch);
    
    // Convert back to relative
    const backToRelative = ZeroReferenceAddressing.absoluteToRelative(absoluteTime, launchEpoch);
    
    return {
      original: relativeTime,
      absolute: absoluteTime,
      converted: backToRelative
    };
  }
}
