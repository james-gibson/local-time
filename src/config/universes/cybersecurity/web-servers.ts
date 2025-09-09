import { Universe, UniverseType, TimePrecision } from '../../../core/types';
import { dateToNanoseconds, createKeyframe, createSegment } from '../../../utils/temporal-conversion';

export const webServersUniverse: Universe = {
  universeId: "cybersecurity:web_servers:timeline",
  type: UniverseType.HISTORICAL_EVENT,
  epochs: undefined,
  identifiers: {
    primary: "cybersecurity:web_servers:timeline",
    aliases: ["web_servers", "http_servers", "apache_nginx_node"]
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: "history:world_wide_web:1990",
        relationshipType: 'inspired_by',
        confidence: 1.0,
        evidence: ["Software release history", "Open source repositories", "Usage statistics"]
      }
    ]
  },
  attribution: {
    public_domain: true,
    sources: ["Apache Software Foundation", "Nginx Inc", "Node.js Foundation", "Go Team", "GitHub repositories"],
    citations_required: false
  },
  layers: [
    {
      layerId: "server_evolution",
      type: 'primary',
      epochs: {
        web_server_era: {
          epochId: "web_servers:evolution",
          startTime: dateToNanoseconds(1995, 4, 1),  // Apache HTTP Server 0.6.2
          endTime: dateToNanoseconds(2023, 12, 31),  // Current era
          precision: TimePrecision.DAY,
          description: "Evolution of major open source web servers"
        }
      }
    },
    {
      layerId: "market_adoption",
      type: 'meta',
      epochs: {
        adoption_timeline: {
          epochId: "web_servers:adoption",
          startTime: dateToNanoseconds(1996, 1, 1),  // Apache dominance begins
          endTime: dateToNanoseconds(2023, 12, 31),  // Current market
          precision: TimePrecision.YEAR,
          description: "Market adoption and usage patterns"
        }
      }
    },
    {
      layerId: "security_evolution",
      type: 'meta',
      epochs: {
        security_timeline: {
          epochId: "web_servers:security",
          startTime: dateToNanoseconds(2000, 1, 1),  // Security focus era
          endTime: dateToNanoseconds(2023, 12, 31),  // Modern security
          precision: TimePrecision.DAY,
          description: "Web server security evolution and vulnerability responses"
        }
      }
    }
  ],
  temporalStructure: {
    segments: [
      createSegment(
        1995, 4, 1, 0,   // Apache birth
        2004, 10, 1, 0,  // Nginx development begins
        'apache_dominance',
        'phase'
      ),
      createSegment(
        2004, 10, 1, 0,  // Nginx development
        2009, 5, 27, 0,  // Node.js announced
        'nginx_emergence',
        'phase'
      ),
      createSegment(
        2009, 5, 27, 0,  // Node.js era begins
        2012, 3, 28, 0,  // Go 1.0 released
        'nodejs_revolution',
        'phase'
      ),
      createSegment(
        2012, 3, 28, 0,  // Go HTTP server capabilities
        2023, 12, 31, 23, // Current
        'modern_server_era',
        'phase'
      )
    ],
    keyframes: [
      createKeyframe(
        1995, 4, 1, 0, 0, 0,
        'apache_http_server_released',
        0.95,
        ['apache_0.6.2', 'open_source', 'http_server', 'foundation'],
        1.0
      ),
      createKeyframe(
        1999, 6, 30, 0, 0, 0,
        'apache_software_foundation',
        0.9,
        ['asf_founded', 'governance', 'open_source_model'],
        1.0
      ),
      createKeyframe(
        2004, 10, 4, 0, 0, 0,
        'nginx_development_begins',
        0.9,
        ['igor_sysoev', 'nginx_0.1.0', 'high_performance', 'event_driven'],
        1.0
      ),
      createKeyframe(
        2008, 7, 11, 0, 0, 0,
        'nginx_public_release',
        0.85,
        ['nginx_0.6.0', 'public_availability', 'performance_focus'],
        1.0
      ),
      createKeyframe(
        2009, 5, 27, 0, 0, 0,
        'nodejs_announced',
        0.9,
        ['ryan_dahl', 'jsconf', 'javascript_server', 'event_loop'],
        1.0
      ),
      createKeyframe(
        2009, 11, 8, 0, 0, 0,
        'nodejs_first_release',
        0.85,
        ['node_0.0.1', 'v8_engine', 'non_blocking_io'],
        1.0
      ),
      createKeyframe(
        2012, 3, 28, 0, 0, 0,
        'go_1_0_released',
        0.8,
        ['go_1.0', 'google', 'http_package', 'built_in_server'],
        1.0
      ),
      createKeyframe(
        2014, 4, 7, 18, 0, 0,
        'heartbleed_affects_servers',
        0.95,
        ['heartbleed', 'openssl_vulnerability', 'server_patching', 'mass_updates'],
        1.0
      ),
      createKeyframe(
        2016, 10, 25, 0, 0, 0,
        'nodejs_foundation_merger',
        0.7,
        ['nodejs_foundation', 'js_foundation', 'governance_evolution'],
        0.9
      ),
      createKeyframe(
        2019, 3, 19, 0, 0, 0,
        'nodejs_foundation_openjs',
        0.7,
        ['openjs_foundation', 'linux_foundation', 'ecosystem_growth'],
        0.9
      ),
      createKeyframe(
        2020, 1, 1, 0, 0, 0,
        'http3_server_support',
        0.8,
        ['http3', 'quic_protocol', 'nginx_support', 'performance_improvement'],
        0.8
      )
    ],
    windows: {
      strategy: 'phase_based',
      avgWindowSize: 180n * BigInt(TimePrecision.DAY)
    }
  },
  metadata: {
    canonicalName: "Open Source Web Servers Timeline",
    creators: ["Apache Software Foundation", "Igor Sysoev", "Ryan Dahl", "Go Team"],
    released: new Date("1995-04-01"),
    cultural_significance: 0.85
  }
};

export const webServerUniverses = [
  webServersUniverse
];
