import { Universe, UniverseType, TimePrecision } from '../../../core/types';
import { dateToNanoseconds, createKeyframe, createSegment } from '../../../utils/temporal-conversion';

export const tlsVersionsUniverse: Universe = {
  universeId: "cybersecurity:tls_versions:timeline",
  type: UniverseType.HISTORICAL_EVENT,
  epochs: undefined,
  identifiers: {
    primary: "cybersecurity:tls_versions:timeline",
    aliases: ["tls_timeline", "ssl_tls_history", "transport_layer_security"]
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: "cybersecurity:netscape:ssl_creation",
        relationshipType: 'inspired_by',
        confidence: 1.0,
        evidence: ["RFC documents", "IETF standards", "Protocol specifications"]
      }
    ]
  },
  attribution: {
    public_domain: true,
    sources: ["IETF RFCs", "Protocol specifications", "Standards documentation", "Security research"],
    citations_required: false
  },
  layers: [
    {
      layerId: "protocol_evolution",
      type: 'primary',
      epochs: {
        ssl_tls_era: {
          epochId: "tls:protocol_era",
          startTime: dateToNanoseconds(1994, 1, 1),  // SSL 1.0 development
          endTime: dateToNanoseconds(2023, 12, 31),  // Current TLS 1.3 era
          precision: TimePrecision.DAY,
          description: "Complete SSL/TLS protocol evolution timeline"
        }
      }
    },
    {
      layerId: "standardization",
      type: 'primary',
      epochs: {
        ietf_standardization: {
          epochId: "tls:ietf_standards",
          startTime: dateToNanoseconds(1999, 1, 1),  // TLS 1.0 RFC
          endTime: dateToNanoseconds(2023, 12, 31),  // Ongoing standards
          precision: TimePrecision.DAY,
          description: "IETF standardization of TLS protocols"
        }
      }
    },
    {
      layerId: "vulnerability_responses",
      type: 'meta',
      epochs: {
        security_evolution: {
          epochId: "tls:security_responses",
          startTime: dateToNanoseconds(2011, 1, 1),  // BEAST attack era
          endTime: dateToNanoseconds(2023, 12, 31),  // Modern security
          precision: TimePrecision.DAY,
          description: "TLS security vulnerability responses and improvements"
        }
      }
    }
  ],
  temporalStructure: {
    segments: [
      createSegment(
        1994, 1, 1, 0,   // SSL development begins
        1999, 1, 1, 0,   // TLS 1.0 standardized
        'ssl_era',
        'phase'
      ),
      createSegment(
        1999, 1, 1, 0,   // TLS 1.0
        2006, 4, 1, 0,   // TLS 1.1
        'tls_1_0_era',
        'phase'
      ),
      createSegment(
        2006, 4, 1, 0,   // TLS 1.1
        2008, 8, 1, 0,   // TLS 1.2
        'tls_1_1_era',
        'phase'
      ),
      createSegment(
        2008, 8, 1, 0,   // TLS 1.2
        2018, 8, 1, 0,   // TLS 1.3
        'tls_1_2_era',
        'phase'
      ),
      createSegment(
        2018, 8, 1, 0,   // TLS 1.3
        2023, 12, 31, 23, // Current
        'tls_1_3_era',
        'phase'
      )
    ],
    keyframes: [
      createKeyframe(
        1994, 1, 1, 0, 0, 0,
        'ssl_1_0_development',
        0.8,
        ['ssl_1.0', 'netscape', 'never_released'],
        0.9
      ),
      createKeyframe(
        1995, 2, 1, 0, 0, 0,
        'ssl_2_0_released',
        0.85,
        ['ssl_2.0', 'netscape', 'first_public_ssl'],
        1.0
      ),
      createKeyframe(
        1996, 1, 1, 0, 0, 0,
        'ssl_3_0_released',
        0.9,
        ['ssl_3.0', 'netscape', 'widely_adopted'],
        1.0
      ),
      createKeyframe(
        1999, 1, 1, 0, 0, 0,
        'tls_1_0_rfc',
        0.95,
        ['tls_1.0', 'rfc_2246', 'ietf_standard', 'ssl_successor'],
        1.0
      ),
      createKeyframe(
        2006, 4, 1, 0, 0, 0,
        'tls_1_1_rfc',
        0.8,
        ['tls_1.1', 'rfc_4346', 'cbc_attacks_mitigation'],
        1.0
      ),
      createKeyframe(
        2008, 8, 1, 0, 0, 0,
        'tls_1_2_rfc',
        0.9,
        ['tls_1.2', 'rfc_5246', 'aead_ciphers', 'sha256'],
        1.0
      ),
      createKeyframe(
        2011, 9, 1, 0, 0, 0,
        'beast_attack_disclosed',
        0.85,
        ['beast_attack', 'tls_1.0_vulnerability', 'cbc_cipher_attack'],
        1.0
      ),
      createKeyframe(
        2014, 4, 7, 18, 0, 0,
        'heartbleed_affects_tls',
        0.95,
        ['heartbleed', 'openssl_vulnerability', 'tls_implementation_bug'],
        1.0
      ),
      createKeyframe(
        2016, 3, 1, 0, 0, 0,
        'tls_1_0_1_1_deprecation_begins',
        0.8,
        ['deprecation_timeline', 'pci_dss', 'security_standards'],
        0.9
      ),
      createKeyframe(
        2018, 8, 10, 0, 0, 0,
        'tls_1_3_rfc',
        1.0,
        ['tls_1.3', 'rfc_8446', 'perfect_forward_secrecy', 'reduced_handshake'],
        1.0
      ),
      createKeyframe(
        2020, 6, 30, 0, 0, 0,
        'tls_1_0_1_1_disabled',
        0.9,
        ['major_browsers', 'deprecation_complete', 'security_improvement'],
        1.0
      )
    ],
    windows: {
      strategy: 'phase_based',
      avgWindowSize: 365n * BigInt(TimePrecision.DAY)
    }
  },
  metadata: {
    canonicalName: "TLS Protocol Versions Timeline",
    creators: ["IETF", "Netscape", "Security Community"],
    released: new Date("1994-01-01"),
    cultural_significance: 0.9
  }
};

export const tlsUniverses = [
  tlsVersionsUniverse
];
