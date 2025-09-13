import { 
  UniverseId, 
  createFilmUniverseId, 
  createHistoricalUniverseId,
  createPersonalUniverseId,
  createMissionUniverseId,
  createLegalUniverseId,
  createBiographyUniverseId,
  createGameUniverseId,
  createCyberSecurityUniverseId
} from './universe-ids';

export interface UniverseHierarchy {
  parent?: UniverseId;
  children: Set<UniverseId>;
  level: 'global' | 'national' | 'regional' | 'local' | 'specific';
  jurisdiction?: string;
  timespan?: { start: number; end: number };
}

export class CommonUniverseIds {
  private static hierarchies = new Map<UniverseId, UniverseHierarchy>();
  
  // === GEOGRAPHICAL/JURISDICTIONAL HIERARCHIES ===
  
  // Global level
  static readonly WORLD_HISTORY = createHistoricalUniverseId('world', "*");
  static readonly GLOBAL_ECONOMY = createHistoricalUniverseId('global_economic_systems', "*");
  
  // National level - United States
  static readonly US_HISTORY = createHistoricalUniverseId('united_states', 'founded');
  static readonly US_GOVERNMENT = createHistoricalUniverseId('us_gov', 'founded');
  static readonly US_MILITARY = createHistoricalUniverseId('us_military', 'founded');
  static readonly US_COPYRIGHT_LAW = createLegalUniverseId('us_gov','copyright','law_evolution', 1790);
  static readonly US_CONSTITUTION = createLegalUniverseId('us_gov', 'constitution','constitutional_framework', 1787);
  
  // State level examples
  static readonly CALIFORNIA_HISTORY = createHistoricalUniverseId('california_state_timeline', '*');
  static readonly DELAWARE_CORPORATIONS = createLegalUniverseId('us_gov','delaware', 'corporate_law', 1899);
  static readonly NEW_YORK_FINANCE = createHistoricalUniverseId('new_york_financial_district', '*');
  
  // === INDUSTRY/DOMAIN HIERARCHIES ===
  
  // Entertainment Industry
  // static readonly HOLLYWOOD_SYSTEM = createHistoricalUniverseId('hollywood', 'studio_system');
  // static readonly DISNEY_CORPORATE = createHistoricalUniverseId('disney', 'corporate_timeline');
  // static readonly PIXAR_STUDIO = createHistoricalUniverseId('pixar', 'studio_operations');
  // static readonly MARVEL_COMICS = createHistoricalUniverseId('marvel', 'publishing_timeline');
  // static readonly MARVEL_STUDIOS = createHistoricalUniverseId('marvel_studios', 'mcu_development');
  
  // Technology Industry
  // static readonly SILICON_VALLEY = createHistoricalUniverseId('silicon_valley', 'tech_ecosystem');
  static readonly INTERNET_DEVELOPMENT = createCyberSecurityUniverseId('internet', 'infrastructure_evolution');
  static readonly CYBERSECURITY_TIMELINE = createCyberSecurityUniverseId('global', 'security_evolution');
  
  // Space Industry
  static readonly NASA_OPERATIONS = createMissionUniverseId('nasa', 'comprehensive_missions', 1958);
  static readonly APOLLO_PROGRAM = createMissionUniverseId('nasa', 'apollo_program', 1961);
  // static readonly SPACE_RACE = createHistoricalUniverseId('space_race', 'us_soviet_competition');
  
  // === TEMPORAL HIERARCHIES ===
  
  // // 20th Century
  // static readonly TWENTIETH_CENTURY = createHistoricalUniverseId('20th_century', 'global_events');
  // static readonly WORLD_WAR_I = createHistoricalUniverseId('wwi', 'global_conflict');
  // static readonly WORLD_WAR_II = createHistoricalUniverseId('wwii', 'global_conflict');
  // static readonly COLD_WAR = createHistoricalUniverseId('cold_war', 'ideological_conflict');
  
  // Cultural Movements
  // static readonly CIVIL_RIGHTS_MOVEMENT = createHistoricalUniverseId('civil_rights', 'us_social_movement');
  // static readonly COUNTERCULTURE_1960S = createHistoricalUniverseId('counterculture', '1960s_movement');
  
  static {
    // Initialize hierarchies
    this.initializeHierarchies();
  }
  
  private static initializeHierarchies() {
    // Global -> National
    this.addHierarchy(this.US_HISTORY, {
      parent: this.WORLD_HISTORY,
      children: new Set([
        this.US_GOVERNMENT,
        this.US_MILITARY,
        this.US_COPYRIGHT_LAW,
        this.US_CONSTITUTION
      ]),
      level: 'national',
      jurisdiction: 'United States',
      timespan: { start: 1776, end: new Date().getFullYear() }
    });
    
    // National -> State
    this.addHierarchy(this.CALIFORNIA_HISTORY, {
      parent: this.US_HISTORY,
      children: new Set([this.HOLLYWOOD_SYSTEM, this.SILICON_VALLEY]),
      level: 'regional',
      jurisdiction: 'California, USA'
    });
    
    this.addHierarchy(this.DELAWARE_CORPORATIONS, {
      parent: this.US_HISTORY,
      children: new Set(),
      level: 'regional',
      jurisdiction: 'Delaware, USA'
    });
    
    // Industry hierarchies
    this.addHierarchy(this.HOLLYWOOD_SYSTEM, {
      parent: this.CALIFORNIA_HISTORY,
      children: new Set([
        this.DISNEY_CORPORATE,
        this.PIXAR_STUDIO,
        this.MARVEL_STUDIOS
      ]),
      level: 'local',
      jurisdiction: 'California, USA'
    });
    
    this.addHierarchy(this.DISNEY_CORPORATE, {
      parent: this.HOLLYWOOD_SYSTEM,
      children: new Set([this.PIXAR_STUDIO, this.MARVEL_STUDIOS]),
      level: 'specific',
      jurisdiction: 'California, USA'
    });
    
    // Space program hierarchy
    this.addHierarchy(this.NASA_OPERATIONS, {
      parent: this.US_GOVERNMENT,
      children: new Set([this.APOLLO_PROGRAM]),
      level: 'specific',
      jurisdiction: 'United States'
    });
    
    // Temporal hierarchies
    this.addHierarchy(this.COLD_WAR, {
      parent: this.TWENTIETH_CENTURY,
      children: new Set([this.SPACE_RACE]),
      level: 'global',
      timespan: { start: 1947, end: 1991 }
    });
  }
  
  private static addHierarchy(id: UniverseId, hierarchy: UniverseHierarchy) {
    this.hierarchies.set(id, hierarchy);
    
    // Add this as child to parent
    if (hierarchy.parent) {
      const parentHierarchy = this.hierarchies.get(hierarchy.parent);
      if (parentHierarchy) {
        parentHierarchy.children.add(id);
      }
    }
  }
  
  // === UTILITY METHODS ===
  
  /**
   * Get all parent universes for a given universe ID
   */
  static getParentChain(universeId: UniverseId): UniverseId[] {
    const chain: UniverseId[] = [];
    let current = this.hierarchies.get(universeId)?.parent;
    
    while (current) {
      chain.push(current);
      current = this.hierarchies.get(current)?.parent;
    }
    
    return chain;
  }
  
  /**
   * Get all child universes for a given universe ID
   */
  static getChildren(universeId: UniverseId): Set<UniverseId> {
    return this.hierarchies.get(universeId)?.children || new Set();
  }
  
  /**
   * Get all descendant universes (children, grandchildren, etc.)
   */
  static getAllDescendants(universeId: UniverseId): Set<UniverseId> {
    const descendants = new Set<UniverseId>();
    const toProcess = [universeId];
    
    while (toProcess.length > 0) {
      const current = toProcess.pop()!;
      const children = this.getChildren(current);
      
      for (const child of children) {
        if (!descendants.has(child)) {
          descendants.add(child);
          toProcess.push(child);
        }
      }
    }
    
    return descendants;
  }
  
  /**
   * Check if one universe contains another in the hierarchy
   */
  static contains(container: UniverseId, contained: UniverseId): boolean {
    const parentChain = this.getParentChain(contained);
    return parentChain.includes(container);
  }
  
  /**
   * Get applicable universes for a specific context
   * E.g., for a Delaware corporation, get [DELAWARE_CORPORATIONS, US_HISTORY, WORLD_HISTORY]
   */
  static getApplicableUniverses(universeId: UniverseId): UniverseId[] {
    return [universeId, ...this.getParentChain(universeId)];
  }
  
  /**
   * Find common parent universe for multiple universe IDs
   */
  static findCommonParent(universeIds: UniverseId[]): UniverseId | null {
    if (universeIds.length === 0) return null;
    if (universeIds.length === 1) return universeIds[0];
    
    const parentChains = universeIds.map(id => [id, ...this.getParentChain(id)]);
    
    // Find intersection of all parent chains
    const commonParents = parentChains[0].filter(parent =>
      parentChains.every(chain => chain.includes(parent))
    );
    
    // Return the most specific common parent (first in the list)
    return commonParents[0] || null;
  }
  
  /**
   * Get universe hierarchy info
   */
  static getHierarchyInfo(universeId: UniverseId): UniverseHierarchy | undefined {
    return this.hierarchies.get(universeId);
  }
  
  /**
   * Create a network from a parent universe and all its descendants
   */
  static createNetworkFromHierarchy(rootUniverseId: UniverseId): {
    networkId: string;
    universes: Set<UniverseId>;
    hierarchyRoot: UniverseId;
  } {
    const descendants = this.getAllDescendants(rootUniverseId);
    descendants.add(rootUniverseId); // Include the root itself
    
    return {
      networkId: rootUniverseId.replace(/:/g, '_') + '_network',
      universes: descendants,
      hierarchyRoot: rootUniverseId
    };
  }
  
  // === CONVENIENCE METHODS FOR COMMON PATTERNS ===
  
  /**
   * Get all US-related universes that would apply to any US entity
   */
  static getUSApplicableUniverses(): UniverseId[] {
    return [
      this.US_HISTORY,
      this.US_GOVERNMENT,
      this.US_COPYRIGHT_LAW,
      this.US_CONSTITUTION,
      this.WORLD_HISTORY
    ];
  }
  
  /**
   * Get all entertainment industry universes
   */
  static getEntertainmentUniverses(): UniverseId[] {
    return [
      this.HOLLYWOOD_SYSTEM,
      this.DISNEY_CORPORATE,
      this.PIXAR_STUDIO,
      this.MARVEL_STUDIOS,
      this.MARVEL_COMICS
    ];
  }
  
  /**
   * Get all space-related universes
   */
  static getSpaceUniverses(): UniverseId[] {
    return [
      this.NASA_OPERATIONS,
      this.APOLLO_PROGRAM,
      this.SPACE_RACE,
      this.COLD_WAR
    ];
  }
}

// Usage examples:
/*
// Creating a Delaware corporation universe
const delawareCorp = createLegalUniverseId('delaware_corp', 'example_inc');

// Get all applicable universes (Delaware -> US -> World)
const applicable = CommonUniverseIds.getApplicableUniverses(CommonUniverseIds.DELAWARE_CORPORATIONS);
// Returns: [DELAWARE_CORPORATIONS, US_HISTORY, WORLD_HISTORY]

// Check if Disney contains Pixar
const contains = CommonUniverseIds.contains(CommonUniverseIds.DISNEY_CORPORATE, CommonUniverseIds.PIXAR_STUDIO);
// Returns: true

// Create a network for all Disney-related universes
const disneyNetwork = CommonUniverseIds.createNetworkFromHierarchy(CommonUniverseIds.DISNEY_CORPORATE);

// Find common context for Apollo 11 and general NASA operations
const common = CommonUniverseIds.findCommonParent([
  CommonUniverseIds.APOLLO_PROGRAM,
  CommonUniverseIds.NASA_OPERATIONS
]);
// Returns: NASA_OPERATIONS
*/
