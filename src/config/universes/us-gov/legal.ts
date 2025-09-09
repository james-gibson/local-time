import { Universe, UniverseType, TimePrecision } from '../../../core/types';

export const copyrightActUniverse: Universe = {
  universeId: "legal:us:copyright_act:1976",
  type: UniverseType.LEGAL_TIMELINE,
  identifiers: {
    primary: "legal:us:copyright_act:1976",
    aliases: ["copyright_act_1976", "us_copyright_law"]
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: []
  },
  attribution: {
    public_domain: true,
    sources: ["US Congress", "Legal databases", "Federal Register"],
    citations_required: false
  },
  layers: [
    {
      layerId: "legislation_timeline",
      type: 'primary',
      epochs: {
        active_period: {
          epochId: "copyright_act:active",
          startTime: BigInt(Date.UTC(1978, 0, 1)) * 1000000n, // Effective date
          endTime: BigInt(Date.now()) * 1000000n, // Still active
          precision: TimePrecision.DAY,
          description: "Copyright Act of 1976 active period"
        }
      }
    }
  ],
  temporalStructure: {
    segments: [
      {
        id: "pre_enactment",
        start: BigInt(Date.UTC(1976, 9, 19)) * 1000000n, // Signed into law
        end: BigInt(Date.UTC(1978, 0, 1)) * 1000000n,    // Effective date
        type: "legal_period",
        status: "inactive"
      },
      {
        id: "original_act",
        start: BigInt(Date.UTC(1978, 0, 1)) * 1000000n,
        end: BigInt(Date.UTC(1998, 10, 27)) * 1000000n, // Before Sonny Bono Act
        type: "legislation_active",
        status: "active",
        jurisdiction: "United States"
      },
      {
        id: "post_sonny_bono",
        start: BigInt(Date.UTC(1998, 10, 27)) * 1000000n, // Sonny Bono Act
        end: BigInt(Date.now()) * 1000000n,
        type: "legislation_active",
        status: "amended",
        jurisdiction: "United States"
      }
    ],
    keyframes: [
      {
        id: "signed_into_law",
        timestamp: BigInt(Date.UTC(1976, 9, 19)) * 1000000n,
        significance: 1.0,
        tags: ["enactment", "legislation", "copyright"],
        certainty: 1.0
      },
      {
        id: "effective_date",
        timestamp: BigInt(Date.UTC(1978, 0, 1)) * 1000000n,
        significance: 0.9,
        tags: ["effective", "implementation", "copyright"],
        certainty: 1.0
      },
      {
        id: "sonny_bono_amendment",
        timestamp: BigInt(Date.UTC(1998, 10, 27)) * 1000000n,
        significance: 0.8,
        tags: ["amendment", "term_extension", "copyright"],
        certainty: 1.0
      }
    ],
    windows: {
      strategy: 'phase_based'
    }
  },
  metadata: {
    canonicalName: "US Copyright Act of 1976",
    creators: ["US Congress"],
    released: new Date("1976-10-19"),
    cultural_significance: 0.9
  }
};

export const roeVWadeUniverse: Universe = {
  universeId: "legal:us:roe_v_wade:1973-2022",
  type: UniverseType.LEGAL_TIMELINE,
  identifiers: {
    primary: "legal:us:roe_v_wade:1973-2022",
    aliases: ["roe_v_wade", "abortion_rights_precedent"]
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: []
  },
  attribution: {
    public_domain: true,
    sources: ["Supreme Court Records", "Legal databases"],
    citations_required: false
  },
  layers: [
    {
      layerId: "precedent_timeline",
      type: 'primary',
      epochs: {
        active_precedent: {
          epochId: "roe:precedent",
          startTime: BigInt(Date.UTC(1973, 0, 22)) * 1000000n, // Decision date
          endTime: BigInt(Date.UTC(2022, 5, 24)) * 1000000n,   // Overturned
          precision: TimePrecision.DAY,
          description: "Roe v. Wade as binding precedent"
        }
      }
    }
  ],
  temporalStructure: {
    segments: [
      {
        id: "active_precedent",
        start: BigInt(Date.UTC(1973, 0, 22)) * 1000000n,
        end: BigInt(Date.UTC(2022, 5, 24)) * 1000000n,
        type: "court_jurisdiction",
        status: "active",
        jurisdiction: "United States"
      },
      {
        id: "overturned_period",
        start: BigInt(Date.UTC(2022, 5, 24)) * 1000000n,
        end: BigInt(Date.now()) * 1000000n,
        type: "court_jurisdiction",
        status: "overturned",
        jurisdiction: "United States"
      }
    ],
    keyframes: [
      {
        id: "decision_rendered",
        timestamp: BigInt(Date.UTC(1973, 0, 22)) * 1000000n,
        significance: 1.0,
        tags: ["supreme_court", "precedent", "constitutional_law"],
        certainty: 1.0
      },
      {
        id: "dobbs_decision",
        timestamp: BigInt(Date.UTC(2022, 5, 24)) * 1000000n,
        significance: 1.0,
        tags: ["supreme_court", "overturned", "constitutional_law"],
        certainty: 1.0
      }
    ],
    windows: {
      strategy: 'phase_based'
    }
  },
  metadata: {
    canonicalName: "Roe v. Wade Legal Timeline",
    creators: ["US Supreme Court"],
    released: new Date("1973-01-22"),
    cultural_significance: 1.0
  }
};

export const legalUniverses = [
  copyrightActUniverse,
  roeVWadeUniverse
];
