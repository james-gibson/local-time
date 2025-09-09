import { describe, it, expect, beforeEach } from '@jest/globals';
import { UniverseRegistry } from '../../src/config/universe-registry';
import { ConfigLoader } from '../../src/config/config-loader';
import { WindowSearch } from '../../src/query/window-search';
import { 
  heartbleedCVEUniverse,
  tlsVersionsUniverse,
  webServersUniverse
} from '../../src/config/universes/cybersecurity/index';
import { dateToNanoseconds } from '../../src/utils/temporal-conversion';
import { TimePrecision, ReferenceType } from '../../src/core/types';
import {createCyberSecurityUniverseId} from '../../src/core/universe-ids';

describe('Cybersecurity Universe Crossover and Temporal References', () => {
  let registry: UniverseRegistry;
  let windowSearch: WindowSearch;

  beforeEach(async () => {
    const configLoader = new ConfigLoader();
    registry = new UniverseRegistry(configLoader);
    windowSearch = new WindowSearch(registry);
    
    // Register our cybersecurity universes
    registry.registerUniverse(createCyberSecurityUniverseId('heartbleed','2014-0160'), heartbleedCVEUniverse);
    registry.registerUniverse(tlsVersionsUniverse.universeId, tlsVersionsUniverse);
    registry.registerUniverse(webServersUniverse.universeId, webServersUniverse);
  });

  describe('Heartbleed Cross-Universe Impact', () => {
    it('should demonstrate Heartbleed as a temporal anchor across all three universes', () => {
      const heartbleedTimestamp = dateToNanoseconds(2014, 4, 7, 18, 0, 0);
      
      // Find Heartbleed events in each universe
      const cveHeartbleed = heartbleedCVEUniverse.temporalStructure?.keyframes
        .find((k: any) => k.id === 'public_disclosure');
      const tlsHeartbleed = tlsVersionsUniverse.temporalStructure?.keyframes
        .find((k: any) => k.id === 'heartbleed_affects_tls');
      const serverHeartbleed = webServersUniverse.temporalStructure?.keyframes
        .find((k: any) => k.id === 'heartbleed_affects_servers');
      
      // All should exist and have the same timestamp
      expect(cveHeartbleed?.timestamp).toBe(heartbleedTimestamp);
      expect(tlsHeartbleed?.timestamp).toBe(heartbleedTimestamp);
      expect(serverHeartbleed?.timestamp).toBe(heartbleedTimestamp);
      
      // All should have high significance
      expect(cveHeartbleed?.significance).toBe(1.0);
      expect(tlsHeartbleed?.significance).toBe(0.95);
      expect(serverHeartbleed?.significance).toBe(0.95);
    });

    it('should show cascading effects of Heartbleed across domains', () => {
      // CVE universe shows the vulnerability itself
      const cveStructure = heartbleedCVEUniverse.temporalStructure!;
      const vulnIntroduced = cveStructure.keyframes.find((k: any) => k.id === 'vulnerability_introduced');
      const publicDisclosure = cveStructure.keyframes.find((k: any) => k.id === 'public_disclosure');
      const patchReleased = cveStructure.keyframes.find((k: any) => k.id === 'openssl_patch_released');
      
      expect(vulnIntroduced?.timestamp).toBeLessThan(publicDisclosure!.timestamp);
      expect(publicDisclosure?.timestamp).toBeLessThan(patchReleased!.timestamp);
      
      // TLS universe shows protocol-level impact
      const tlsStructure = tlsVersionsUniverse.temporalStructure!;
      const tlsImpact = tlsStructure.keyframes.find((k: any) => k.id === 'heartbleed_affects_tls');
      expect(tlsImpact?.tags).toContain('tls_implementation_bug');
      
      // Web servers universe shows infrastructure impact
      const serverStructure = webServersUniverse.temporalStructure!;
      const serverImpact = serverStructure.keyframes.find((k: any) => k.id === 'heartbleed_affects_servers');
      expect(serverImpact?.tags).toContain('server_patching');
      expect(serverImpact?.tags).toContain('mass_updates');
    });
  });

  describe('TLS Evolution and Web Server Adoption', () => {
    it('should show correlation between TLS versions and web server capabilities', () => {
      const tlsStructure = tlsVersionsUniverse.temporalStructure!;
      const serverStructure = webServersUniverse.temporalStructure!;
      
      // TLS 1.0 (1999) should precede major web server adoption
      const tls10 = tlsStructure.keyframes.find((k: any) => k.id === 'tls_1_0_rfc');
      const apacheFoundation = serverStructure.keyframes.find((k: any) => k.id === 'apache_software_foundation');
      
      expect(tls10?.timestamp).toBeLessThan(apacheFoundation!.timestamp);
      
      // Modern servers should support modern TLS
      const tls13 = tlsStructure.keyframes.find((k: any) => k.id === 'tls_1_3_rfc');
      const http3Support = serverStructure.keyframes.find((k: any) => k.id === 'http3_server_support');
      
      expect(tls13?.timestamp).toBeLessThan(http3Support!.timestamp);
    });

    it('should demonstrate security evolution driving server updates', () => {
      const tlsStructure = tlsVersionsUniverse.temporalStructure!;
      const serverStructure = webServersUniverse.temporalStructure!;
      
      // TLS deprecation should drive server updates
      const tlsDeprecation = tlsStructure.keyframes.find((k: any) => k.id === 'tls_1_0_1_1_deprecation_begins');
      const modernServerEra = serverStructure.segments.find((s: any) => s.id === 'modern_server_era');
      
      expect(tlsDeprecation?.timestamp).toBeGreaterThan(modernServerEra!.start);
      expect(tlsDeprecation?.timestamp).toBeLessThan(modernServerEra!.end);
    });
  });

  describe('Temporal Window Queries', () => {
    it('should find all cybersecurity events during Heartbleed crisis period', async () => {
      // Create a temporal window around Heartbleed disclosure
      const heartbleedStart = dateToNanoseconds(2014, 4, 7, 0, 0, 0);
      const heartbleedEnd = dateToNanoseconds(2014, 4, 8, 23, 59, 59);
      
      const allUniverses = [heartbleedCVEUniverse, tlsVersionsUniverse, webServersUniverse];
      const eventsInWindow = [];
      
      for (const universe of allUniverses) {
        const keyframes = universe.temporalStructure?.keyframes || [];
        const relevantEvents = keyframes.filter((k: any) => 
          k.timestamp >= heartbleedStart && k.timestamp <= heartbleedEnd
        );
        eventsInWindow.push(...relevantEvents.map((k: any) => ({
          universe: universe.universeId,
          event: k.id,
          timestamp: k.timestamp,
          significance: k.significance
        })));
      }
      
      // Should find Heartbleed-related events in all three universes
      expect(eventsInWindow).toHaveLength(5);
      expect(eventsInWindow.map(e => e.event)).toEqual([
        'public_disclosure',
        'openssl_patch_released',
        'major_sites_patched',
        'heartbleed_affects_tls',
        'heartbleed_affects_servers'
      ])
    });

    it('should demonstrate temporal clustering of related events', () => {
      // Events should cluster around major milestones
      const allKeyframes = [
        ...heartbleedCVEUniverse.temporalStructure?.keyframes || [],
        ...tlsVersionsUniverse.temporalStructure?.keyframes || [],
        ...webServersUniverse.temporalStructure?.keyframes || []
      ];
      
      // Group events by year to show clustering
      const eventsByYear = new Map<number, number>();
      allKeyframes.forEach(k => {
        const year = new Date(Number(k.timestamp / 1000000n)).getFullYear();
        eventsByYear.set(year, (eventsByYear.get(year) || 0) + 1);
      });
      
      // 2014 should have high activity due to Heartbleed
      expect(eventsByYear.get(2014)).toBeGreaterThan(2);
      
      // Early years should show foundational events
      expect(eventsByYear.get(1995)).toBeGreaterThan(0); // Apache
      expect(eventsByYear.get(1999)).toBeGreaterThan(0); // TLS 1.0
    });
  });

  describe('Reference Chain Analysis', () => {
    it('should create a reference chain showing vulnerability propagation', () => {
      // Create a reference chain from OpenSSL vulnerability to server impact
      const referenceChain = {
        chainId: 'heartbleed_propagation',
        nodes: [
          {
            universeId: 'cybersecurity:heartbleed:cve-2014-0160',
            type: 'historical_event' as const,
            elements: ['openssl_vulnerability', 'memory_disclosure'],
            privacy: 'public'
          },
          {
            universeId: 'cybersecurity:tls_versions:timeline',
            type: 'historical_event' as const,
            elements: ['tls_implementation', 'protocol_security'],
            privacy: 'public'
          },
          {
            universeId: 'cybersecurity:web_servers:timeline',
            type: 'historical_event' as const,
            elements: ['server_infrastructure', 'mass_patching'],
            privacy: 'public'
          }
        ],
        connections: [
          {
            from: 'cybersecurity:heartbleed:cve-2014-0160',
            to: 'cybersecurity:tls_versions:timeline',
            type: ReferenceType.DEPICTS,
            documented: true,
            influence_type: 'security_vulnerability',
            specific_mappings: [{
              source_element: 'openssl_vulnerability',
              target_element: 'tls_implementation_bug',
              transformation: 'direct_impact'
            }]
          },
          {
            from: 'cybersecurity:tls_versions:timeline',
            to: 'cybersecurity:web_servers:timeline',
            type: ReferenceType.DEPICTS,
            documented: true,
            influence_type: 'infrastructure_impact',
            specific_mappings: [{
              source_element: 'tls_implementation_bug',
              target_element: 'server_patching',
              transformation: 'remediation_response'
            }]
          }
        ],
        metadata: {
          type: 'vulnerability_propagation'
        }
      };
      
      expect(referenceChain.nodes).toHaveLength(3);
      expect(referenceChain.connections).toHaveLength(2);
      expect(referenceChain.connections[0].type).toBe(ReferenceType.DEPICTS);
    });

    it('should show bidirectional influences between TLS and web servers', () => {
      // TLS evolution influences server capabilities
      // Server needs influence TLS development
      const bidirectionalRef = {
        from: 'cybersecurity:tls_versions:timeline',
        to: 'cybersecurity:web_servers:timeline',
        type: ReferenceType.INFLUENCED,
        documented: true,
        influence_type: 'protocol_adoption',
        bidirectional: true,
        specific_mappings: [
          {
            source_element: 'tls_1.3_features',
            target_element: 'http3_server_support',
            transformation: 'protocol_enhancement'
          },
          {
            source_element: 'server_performance_needs',
            target_element: 'tls_optimization',
            transformation: 'requirement_driven_development'
          }
        ]
      };
      
      expect(bidirectionalRef.type).toBe(ReferenceType.INFLUENCED);
      expect(bidirectionalRef.specific_mappings).toHaveLength(2);
    });
  });

  describe('Cultural Significance Correlation', () => {
    it('should show high cultural significance for foundational events', () => {
      // Heartbleed should have very high significance
      expect(heartbleedCVEUniverse.metadata?.cultural_significance).toBe(0.95);
      
      // TLS evolution should have high significance
      expect(tlsVersionsUniverse.metadata?.cultural_significance).toBe(0.9);
      
      // Web servers should have good significance
      expect(webServersUniverse.metadata?.cultural_significance).toBe(0.85);
      
      // Events that appear in multiple universes should have high significance
      const heartbleedEvents = [
        heartbleedCVEUniverse.temporalStructure?.keyframes.find((k: any) => k.id === 'public_disclosure'),
        tlsVersionsUniverse.temporalStructure?.keyframes.find((k: any) => k.id === 'heartbleed_affects_tls'),
        webServersUniverse.temporalStructure?.keyframes.find((k: any) => k.id === 'heartbleed_affects_servers')
      ];
      
      heartbleedEvents.forEach(event => {
        expect(event?.significance).toBeGreaterThan(0.9);
      });
    });
  });

  describe('Precision and Windowing Strategy', () => {
    it('should use appropriate precision for different event types', () => {
      // CVE disclosure should use hour precision for crisis response
      const cveLayer = heartbleedCVEUniverse.layers.find((l: any) => l.layerId === 'disclosure_timeline');
      expect(cveLayer?.epochs.disclosure_period.precision).toBe(TimePrecision.HOUR);
      
      // TLS evolution should use day/month precision for standards
      const tlsLayer = tlsVersionsUniverse.layers.find((l: any) => l.layerId === 'standardization');
      expect(tlsLayer?.epochs.ietf_standardization.precision).toBe(TimePrecision.DAY);
      
      // Web server evolution should use month precision for releases
      const serverLayer = webServersUniverse.layers.find((l: any) => l.layerId === 'server_evolution');
      expect(serverLayer?.epochs.web_server_era.precision).toBe(TimePrecision.DAY);
    });

    it('should use appropriate windowing strategies', () => {
      // CVE should use phase-based windowing for crisis management
      expect(heartbleedCVEUniverse.temporalStructure?.windows.strategy).toBe('phase_based');
      
      // TLS should use phase-based windowing for version eras
      expect(tlsVersionsUniverse.temporalStructure?.windows.strategy).toBe('phase_based');
      
      // Web servers should use phase-based windowing for technology eras
      expect(webServersUniverse.temporalStructure?.windows.strategy).toBe('phase_based');
    });
  });
});
