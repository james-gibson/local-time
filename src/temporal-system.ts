// Core temporal system with zero-reference support

export enum TimePrecision {
  NANOSECOND = 1,
  MICROSECOND = 1_000,
  MILLISECOND = 1_000_000,
  SECOND = 1_000_000_000,
  MINUTE = 60_000_000_000,
  HOUR = 3_600_000_000_000,
  DAY = 86_400_000_000_000,
  YEAR = 31_536_000_000_000_000,
  MILLION_YEARS = 31_536_000_000_000_000_000_000
}

export interface TemporalEpoch {
  epochId: string;
  startTime: bigint;
  endTime: bigint;
  precision: TimePrecision;
  description: string;
}

export interface ZeroReferenceEpoch extends TemporalEpoch {
  zeroPoint: bigint;           // The T=0 moment in absolute time
  zeroEvent: string;           // Description of the zero event
  beforePrefix: string;        // "T-", "H-", "D-"
  afterPrefix: string;         // "T+", "H+", "D+"
  relativeFormat: 'HMS' | 'seconds' | 'minutes' | 'hours' | 'days';
}

export interface Universe {
  universeId: string;
  type: 'film' | 'series' | 'book' | 'historical_event' | 'mission' | 'medical_procedure';
  
  epochs: {
    [key: string]: TemporalEpoch | ZeroReferenceEpoch;
  };
  
  temporalStructure: {
    segments: TemporalSegment[];
    keyframes: TemporalKeyframe[];
    windows: WindowingStrategy;
  };
  
  metadata: {
    canonicalName: string;
    creators: string[];
    released?: Date;
    cultural_significance?: number;
  };
}

export interface TemporalSegment {
  id: string;
  start: bigint;
  end: bigint;
  type: 'sequence' | 'act' | 'scene' | 'phase' | 'countdown' | 'mission_phase';
}

export interface TemporalKeyframe {
  id: string;
  timestamp: bigint;
  significance: number;
  tags: string[];
}

export interface WindowingStrategy {
  strategy: 'scene_based' | 'time_based' | 'phase_based' | 'countdown_based';
  avgWindowSize?: bigint;
}

export enum ReferenceType {
  VISUAL_HOMAGE = 'visual_homage',
  DEPICTS = 'depicts',
  DOCUMENTS = 'documents',
  INSPIRED_BY = 'inspired_by',
  FULFILLS_PROMISE = 'fulfills_promise',
  TEMPORAL_PARADOX = 'temporal_paradox'
}
