import { Universe, UniverseType, TimePrecision } from '../../../core/types';
import { dateToNanoseconds, createKeyframe, createSegment } from '../../../utils/temporal-conversion';

export const heartbleedCVEUniverse: Universe = {
  universeId: "cybersecurity:heartbleed:cve-2014-0160",
  type: UniverseType.HISTORICAL_EVENT,
  epochs: undefined,
  identifiers: {
    primary: "cybersecurity:heartbleed:cve-2014-0160",
    aliases: ["heartbleed", "cve-2014-0160", "openssl_heartbleed"]
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: "cybersecurity:openssl:1.0.1",
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: ["CVE database", "OpenSSL commit history", "Security advisories"]
      }
    ]
  },
  attribution: {
    public_domain: true,
    sources: ["CVE Database", "OpenSSL Security Advisory", "NIST NVD", "Security research papers"],
    citations_required: false
  },
  layers: [
    {
      layerId: "vulnerability_timeline",
      type: 'primary',
      epochs: {
        vulnerability_lifecycle: {
          epochId: "heartbleed:lifecycle",
          startTime: dateToNanoseconds(2012, 3, 14), // OpenSSL 1.0.1 release (vulnerability introduced)
          endTime: dateToNanoseconds(2014, 4, 7),   // Patch released
          precision: TimePrecision.DAY,
          description: "Heartbleed vulnerability lifecycle from introduction to patch"
        }
      }
    },
    {
      layerId: "disclosure_timeline",
      type: 'primary',
      epochs: {
        disclosure_period: {
          epochId: "heartbleed:disclosure",
          startTime: dateToNanoseconds(2014, 4, 1), // Discovery reported
          endTime: dateToNanoseconds(2014, 4, 7),   // Public disclosure
          precision: TimePrecision.HOUR,
          description: "Coordinated disclosure period"
        }
      }
    },
    {
      layerId: "impact_assessment",
      type: 'meta',
      epochs: {
        global_impact: {
          epochId: "heartbleed:impact",
          startTime: dateToNanoseconds(2014, 4, 7),  // Public disclosure
          endTime: dateToNanoseconds(2014, 12, 31),  // End of major remediation
          precision: TimePrecision.DAY,
          description: "Global impact and remediation period"
        }
      }
    }
  ],
  temporalStructure: {
    segments: [
      createSegment(
        2012, 3, 14, 0,  // Vulnerability introduced
        2014, 4, 1, 0,   // Discovery
        'vulnerability_dormant',
        'phase'
      ),
      createSegment(
        2014, 4, 1, 0,   // Discovery
        2014, 4, 7, 18,  // Public disclosure
        'coordinated_disclosure',
        'phase'
      ),
      createSegment(
        2014, 4, 7, 18,  // Public disclosure
        2014, 4, 8, 0,   // Immediate response
        'crisis_response',
        'phase'
      ),
      createSegment(
        2014, 4, 8, 0,   // Immediate response
        2014, 12, 31, 23, // End of major remediation
        'global_remediation',
        'phase'
      )
    ],
    keyframes: [
      createKeyframe(
        2012, 3, 14, 0, 0, 0,
        'vulnerability_introduced',
        0.9,
        ['openssl_1.0.1', 'code_commit', 'vulnerability_birth'],
        1.0
      ),
      createKeyframe(
        2014, 4, 1, 0, 0, 0,
        'vulnerability_discovered',
        0.95,
        ['discovery', 'google_security', 'codenomicon'],
        1.0
      ),
      createKeyframe(
        2014, 4, 7, 18, 0, 0,
        'public_disclosure',
        1.0,
        ['cve_published', 'heartbleed_logo', 'media_coverage', 'global_panic'],
        1.0
      ),
      createKeyframe(
        2014, 4, 7, 18, 30, 0,
        'openssl_patch_released',
        1.0,
        ['openssl_1.0.1g', 'patch_available', 'fix_released'],
        1.0
      ),
      createKeyframe(
        2014, 4, 8, 12, 0, 0,
        'major_sites_patched',
        0.9,
        ['google_patched', 'facebook_patched', 'yahoo_patched', 'mass_patching'],
        0.9
      ),
      createKeyframe(
        2014, 4, 11, 0, 0, 0,
        'certificate_revocation_spike',
        0.85,
        ['ssl_certificates', 'mass_revocation', 'ca_response'],
        0.95
      )
    ],
    windows: {
      strategy: 'phase_based',
      avgWindowSize: 24n * BigInt(TimePrecision.HOUR)
    }
  },
  metadata: {
    canonicalName: "Heartbleed CVE-2014-0160",
    creators: ["OpenSSL Project", "Security Researchers"],
    released: new Date("2014-04-07"),
    cultural_significance: 0.95
  }
};

export const cybersecurityUniverses = [
  heartbleedCVEUniverse
];
