import { Universe, UniverseType, TimePrecision } from '../../../core/types';
import { dateToNanoseconds, createKeyframe, createSegment } from '../../../utils/temporal-conversion';

export const jfkAssassinationUniverse: Universe = {
  universeId: "history:jfk_assassination:1963",
  type: UniverseType.HISTORICAL_EVENT,
  epochs: undefined,
  identifiers: {
    primary: "history:jfk_assassination:1963",
    aliases: ["jfk_assassination", "kennedy_assassination", "dallas_1963"]
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: []
  },
  attribution: {
    public_domain: true,
    sources: ["Warren Commission Report", "House Select Committee on Assassinations", "National Archives"],
    citations_required: false
  },
  layers: [
    {
      layerId: "official_timeline",
      type: 'primary',
      epochs: {
        assassination_day: {
          epochId: "jfk:assassination_day",
          startTime: dateToNanoseconds(1963, 11, 22), // Nov 22, 1963
          endTime: dateToNanoseconds(1963, 11, 23),   // Nov 23, 1963
          precision: TimePrecision.SECOND,
          description: "November 22, 1963 - Day of assassination"
        }
      }
    },
    {
      layerId: "conspiracy_theories",
      type: 'meta',
      epochs: {
        investigation_period: {
          epochId: "jfk:investigations",
          startTime: BigInt(Date.UTC(1963, 10, 22)) * 1000000n,
          endTime: BigInt(Date.now()) * 1000000n, // Ongoing theories
          precision: TimePrecision.YEAR,
          description: "Period of investigations and conspiracy theories"
        }
      }
    }
  ],
  temporalStructure: {
    segments: [
      createSegment(
        1963, 11, 22, 11, // 11:40 AM CST
        1963, 11, 22, 12, // 12:00 PM CST
        'dallas_arrival',
        'phase'
      ),
      createSegment(
        1963, 11, 22, 12, // 12:00 PM CST
        1963, 11, 22, 12, // 12:30 PM CST
        'motorcade_route',
        'phase'
      ),
      createSegment(
        1963, 11, 22, 12, // 12:29 PM CST
        1963, 11, 22, 12, // 12:31 PM CST
        'dealey_plaza',
        'phase'
      ),
      createSegment(
        1963, 11, 22, 12, // 12:35 PM CST
        1963, 11, 22, 13, // 1:00 PM CST
        'hospital_response',
        'phase'
      )
    ],
    keyframes: [
      createKeyframe(
        1963, 11, 22, 12, 30, 0,
        'first_shot',
        1.0,
        ['assassination', 'first_shot', 'dealey_plaza'],
        0.9
      ),
      createKeyframe(
        1963, 11, 22, 12, 30, 3,
        'fatal_shot',
        1.0,
        ['assassination', 'fatal_shot', 'zapruder_film'],
        0.95
      ),
      createKeyframe(
        1963, 11, 22, 13, 0, 0,
        'pronounced_dead',
        1.0,
        ['death', 'parkland_hospital', 'official'],
        1.0
      ),
      createKeyframe(
        1963, 11, 22, 13, 50, 0,
        'oswald_arrested',
        0.9,
        ['arrest', 'lee_harvey_oswald', 'texas_theater'],
        1.0
      )
    ],
    windows: {
      strategy: 'time_based',
      avgWindowSize: 5n * BigInt(TimePrecision.MINUTE)
    }
  },
  metadata: {
    canonicalName: "JFK Assassination",
    creators: ["Historical Event"],
    released: new Date("1963-11-22"),
    cultural_significance: 1.0
  }
};

export const jfkMoonSpeechUniverse: Universe = {
  universeId: "history:jfk_moon_speech:1961",
  type: UniverseType.HISTORICAL_EVENT,
  epochs: undefined,
  identifiers: {
    primary: "history:jfk_moon_speech:1961",
    aliases: ["moon_speech", "jfk_congress_1961", "man_on_moon_speech"]
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: "nasa:apollo11:1969",
        relationshipType: 'inspired_by',
        confidence: 1.0,
        evidence: ["Congressional records", "NASA archives"]
      }
    ]
  },
  attribution: {
    public_domain: true,
    sources: ["Congressional Record", "JFK Presidential Library", "NASA Archives"],
    citations_required: false
  },
  layers: [
    {
      layerId: "speech_event",
      type: 'primary',
      epochs: {
        congress_session: {
          epochId: "jfk:congress_speech",
          startTime: dateToNanoseconds(1961, 5, 25, 17, 0, 0), // May 25, 1961, ~5:00 PM EST
          endTime: dateToNanoseconds(1961, 5, 25, 18, 0, 0),
          precision: TimePrecision.MINUTE,
          description: "JFK's special message to Congress"
        }
      }
    }
  ],
  temporalStructure: {
    segments: [
      createSegment(
        1961, 5, 25, 17, // 5:00 PM EST
        1961, 5, 25, 17, // 5:10 PM EST
        'speech_opening',
        'phase'
      ),
      createSegment(
        1961, 5, 25, 17, // 5:35 PM EST
        1961, 5, 25, 17, // 5:40 PM EST
        'moon_commitment',
        'phase'
      )
    ],
    keyframes: [
      createKeyframe(
        1961, 5, 25, 17, 37, 0,
        'moon_landing_commitment',
        1.0,
        ['moon_landing', 'space_race', 'national_commitment', 'before_decade_out'],
        1.0
      )
    ],
    windows: {
      strategy: 'time_based',
      avgWindowSize: 5n * BigInt(TimePrecision.MINUTE)
    }
  },
  metadata: {
    canonicalName: "JFK Moon Landing Speech",
    creators: ["John F. Kennedy"],
    released: new Date("1961-05-25"),
    cultural_significance: 0.95
  }
};

export const historicalUniverses = [
  jfkAssassinationUniverse,
  jfkMoonSpeechUniverse
];
