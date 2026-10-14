import { Universe, ZeroReferenceEpoch, TimePrecision, TemporalSegment } from './temporal-system';
// import { ZeroReferenceAddressing } from './zero-reference-addressing';

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
    
    /**
     * A second frame over the **same absolute interval** as `launch`, re-zeroed onto the
     * go/no-go poll five minutes twenty seconds earlier.
     *
     * The origin is sourced (james-gibson/local-time#63). The Apollo 11 PAO launch
     * commentary records the launch-team go/no-go status check completing at
     * "5 minutes, 52 seconds and counting", then "Launch Director Rocco Petrone now
     * gives a Go. We're 5 minutes, 20 seconds and counting" — so the Launch Director's
     * Go is at approximately T-05:20 (13:26:40Z). The earlier fixture asserted 13:26:30
     * (T-05:30), an instant no source records; it is now the citable T-05:20. (The
     * call-out is live narration, so treat the second as accurate to a few seconds.)
     *
     * This is what "treat a prior keyframe as the zero" looks like without inventing a
     * new reference type. `IN_A_PRIOR_KEYFRAME` is deliberately *not* used here: it is a
     * universe-level claim that one universe's zero derives from a keyframe in a *different*
     * universe (see `idiocracy.ts`, whose fictional 2505 frame derives from the real 2005
     * hibernation keyframe). `go_no_go_poll` and `liftoff` are both keyframes inside this
     * one universe, so that type would assert a cross-universe derivation that does not
     * exist.
     *
     * Within a universe, ordering between keyframes is already carried by `timestamp`,
     * which is a bigint. What was missing was a *frame* anchored at the earlier keyframe,
     * so that events could be addressed on a T± axis that starts before liftoff. With this
     * epoch, liftoff is `T+00:05:20` and the ignition sequence `T-00:05:20`, instead of
     * both collapsing onto `T+00:00:00` in the `launch` frame.
     *
     * The span is deliberately identical to `launch`'s: the same real interval, two
     * different origins. Narrowing it to the terminal count would have made the frame too
     * short to project the rest of the launch sequence onto.
     *
     * Note the constraint this does NOT remove: `findEventsInRelativeRange` still ignores
     * its bounds (#55). A second frame is what makes pre-epoch addressing *expressible*;
     * that method is what still fails to honour it.
     */
    go_no_go: {
      epochId: "apollo11:go_no_go",
      startTime: BigInt(Date.UTC(1969, 6, 16, 8, 0, 0)) * 1000000n, // T-5:32:00 from liftoff
      endTime: BigInt(Date.UTC(1969, 6, 16, 19, 0, 0)) * 1000000n,   // T+5:28:00 from liftoff
      precision: TimePrecision.SECOND,
      description: "Apollo 11 launch timeline, zeroed on the go/no-go poll (T-05:20) rather than liftoff",

      // Zero-reference specific properties
      // 13:26:40Z = T-05:20, the Launch Director's "Go" (Apollo 11 PAO launch
      // commentary). Sourced, per james-gibson/local-time#63.
      zeroPoint: BigInt(Date.UTC(1969, 6, 16, 13, 26, 40)) * 1000000n, // Go/no-go poll, T-05:20
      zeroEvent: "Apollo 11 launch status check (go/no-go poll), Launch Director's Go at T-05:20",
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
        timestamp: BigInt(Date.UTC(1969, 6, 16, 13, 26, 40)) * 1000000n, // T-05:20
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
    
    // The two pre-H-Hour keyframes are approximate but inside documented windows
    // (james-gibson/local-time#63): the airborne assault began shortly after midnight
    // on 6 June (pathfinders ~00:15, the main drops ~00:50-01:00), and the US
    // pre-landing naval bombardment of Utah/Omaha ran from ~05:00 to ~06:27. Neither
    // fixture time is a recorded instant, so both are round approximations, not claims.
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
      // T-5:20 (go/no-go poll)
      goNoGo: "nasa:apollo11:1969:launch:T-00:05:20",
      
      // T+0:00 (liftoff)
      liftoff: "nasa:apollo11:1969:launch:T+00:00:00",
      
      // T+2:46 (first stage separation)
      separation: "nasa:apollo11:1969:launch:T+00:02:46"
    };
  }
  
  static generateDDayAddresses() {
    return {
      // H-6:00 (airborne drops)
      airborne: "history:dday:1944:operation:H-06:00:00",
      
      // H+0:00 (H-Hour)
      hhour: "history:dday:1944:operation:H+00:00:00",
      
      // H+1:00 (first wave complete)
      firstWave: "history:dday:1944:operation:H+01:00:00"
    };
  }
  
  static demonstrateConversions() {
    const launchEpoch = apollo11Universe.epochs.launch as ZeroReferenceEpoch;
    
    // Convert T-5:20 to absolute time
    const relativeTime = { prefix: "T-", hours: 0, minutes: 5, seconds: 20, milliseconds: 0 };
    // const absoluteTime = ZeroReferenceAddressing.relativeToAbsolute(relativeTime, launchEpoch);
    
    // Convert back to relative
    // const backToRelative = ZeroReferenceAddressing.absoluteToRelative(absoluteTime, launchEpoch);
    
    return {
      original: relativeTime,
      absolute: launchEpoch.zeroPoint - 320000000000n, // T-5:20 in nanoseconds
      converted: relativeTime
    };
  }
}
