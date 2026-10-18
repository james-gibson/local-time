import { 
  UniverseId, 
  createHistoricalUniverseId,
  createMissionUniverseId,
  createLegalUniverseId,
  createCyberSecurityUniverseId,
  createUniverseId,
  isValidUniverseId
} from './universe-ids';

export interface UniverseHierarchy {
  /**
   * The primary parent. Kept for back-compat with the single-parent callers;
   * `parents` is the source of truth and may hold more than one entry (a case
   * can belong to a term *and* to its docket — see james-gibson/local-time#106).
   */
  parent?: UniverseId;
  /** Every declared parent. Supersedes `parent`; both are kept in sync. */
  parents?: Set<UniverseId>;
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
  // `createHistoricalUniverseId` requires a year-ish second argument, so these use
  // each entity's founding year rather than a descriptive slug.
  static readonly HOLLYWOOD_SYSTEM = createHistoricalUniverseId('hollywood', 1913);
  static readonly DISNEY_CORPORATE = createHistoricalUniverseId('disney', 1923);
  static readonly PIXAR_STUDIO = createHistoricalUniverseId('pixar', 1986);
  static readonly MARVEL_COMICS = createHistoricalUniverseId('marvel', 1939);
  static readonly MARVEL_STUDIOS = createHistoricalUniverseId('marvel_studios', 2008);
  // Franchise umbrella universes (founding-film years, or a release span).
  static readonly TOY_STORY_FRANCHISE = createHistoricalUniverseId('toy_story_franchise', 1995);
  static readonly CARS_FRANCHISE = createHistoricalUniverseId('cars_franchise', 2006);

  // Games industry — the `game:` namespace's franchise containers.
  //
  // The container uses the HISTORICAL vocabulary like every other franchise
  // umbrella (a span, not a release year), so it carries the run rather than one
  // title's date. `createGameUniverseId` requires a `\d{4}` release year, which a
  // 1996–2026 container cannot express.
  //
  // There is deliberately no `games_industry` / `blizzard_entertainment` parent
  // yet: no such universe is authored anywhere, and inventing an id would be a
  // dangling anchor (james-gibson/local-time#112 §11.5). The franchise universe
  // below is the only games lever that currently exists.
  static readonly DIABLO_FRANCHISE = createHistoricalUniverseId('diablo_franchise', 1996, '1996-2026');
  
  // Technology Industry
  static readonly SILICON_VALLEY = createHistoricalUniverseId('silicon_valley', 1956);
  static readonly INTERNET_DEVELOPMENT = createCyberSecurityUniverseId('internet', 'infrastructure_evolution');
  static readonly CYBERSECURITY_TIMELINE = createCyberSecurityUniverseId('global', 'security_evolution');

  // Software engineering / version control
  static readonly SOFTWARE_ENGINEERING = createHistoricalUniverseId('software_engineering', '*');
  static readonly VERSION_CONTROL = createHistoricalUniverseId('version_control', '*');

  // Containers the KB's frontmatter already declares.
  //
  // The lore template writes `parent-universes:` as symbolic names
  // (`HOLLYWOOD_SYSTEM`, not `history:hollywood:1913`), and 14 distinct names are
  // in use across the compendia. Nine already had a member here; these five did
  // not, so every edge naming one was dropped (james-gibson/local-time#133).
  //
  // These are *not* invented ids. Unlike the `games_industry` case above, the
  // names are already referenced by declared compendia — creating the container is
  // what makes an existing declaration resolvable rather than a dangling anchor.
  static readonly US_ECONOMIC_HISTORY = createHistoricalUniverseId('us_economic_history', '*');
  static readonly US_GOVERNANCE = createHistoricalUniverseId('us_governance', '*');
  static readonly US_POLITICAL_PARTIES = createHistoricalUniverseId('us_political_parties', '*');
  static readonly US_ELECTION_CYCLE = createHistoricalUniverseId('us_election_cycle', '*');
  static readonly DOCUMENTATION_SYSTEMS = createHistoricalUniverseId('documentation_systems', '*');
  static readonly PERSONAL_PROJECTS = createHistoricalUniverseId('personal_projects', '*');

  // Space Industry
  static readonly NASA_OPERATIONS = createMissionUniverseId('nasa', 'comprehensive_missions', 1958);
  static readonly APOLLO_PROGRAM = createMissionUniverseId('nasa', 'apollo_program', 1961);
  static readonly SPACE_RACE = createHistoricalUniverseId('space_race', 1957);
  
  // === TEMPORAL HIERARCHIES ===
  
  // // 20th Century
  static readonly TWENTIETH_CENTURY = createHistoricalUniverseId('20th_century', 1901);
  // static readonly WORLD_WAR_I = createHistoricalUniverseId('wwi', 1914);
  // static readonly WORLD_WAR_II = createHistoricalUniverseId('wwii', 1939);
  static readonly COLD_WAR = createHistoricalUniverseId('cold_war', 1947);
  
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

    // Software engineering / version control history
    this.addHierarchy(this.SOFTWARE_ENGINEERING, {
      parent: this.WORLD_HISTORY,
      children: new Set([this.VERSION_CONTROL]),
      level: 'global',
      timespan: { start: 1972, end: new Date().getFullYear() }
    });

    this.addHierarchy(this.VERSION_CONTROL, {
      parent: this.SOFTWARE_ENGINEERING,
      children: new Set(),
      level: 'global',
      timespan: { start: 1972, end: new Date().getFullYear() }
    });

    // Placement for the containers the KB already declares (see the statics).
    // Each is a domain umbrella, so it hangs off the closest existing root rather
    // than becoming a second root of its own.
    this.addHierarchy(this.US_ECONOMIC_HISTORY, {
      parent: this.US_HISTORY,
      children: new Set(),
      level: 'national',
      jurisdiction: 'United States'
    });

    this.addHierarchy(this.US_GOVERNANCE, {
      parent: this.US_GOVERNMENT,
      children: new Set(),
      level: 'national',
      jurisdiction: 'United States'
    });

    this.addHierarchy(this.US_POLITICAL_PARTIES, {
      parent: this.US_GOVERNMENT,
      children: new Set(),
      level: 'national',
      jurisdiction: 'United States'
    });

    // The election-issue universes (`history:election_issue_*`, hand-authored in
    // `us-history/`) already declare this parent, so it is a container in use, not
    // a new one.
    this.addHierarchy(this.US_ELECTION_CYCLE, {
      parent: this.US_GOVERNMENT,
      children: new Set(),
      level: 'national',
      jurisdiction: 'United States'
    });

    this.addHierarchy(this.DOCUMENTATION_SYSTEMS, {
      parent: this.SOFTWARE_ENGINEERING,
      children: new Set(),
      level: 'global'
    });

    // The personal umbrella has no parent: it is the root the personal universes
    // (the lab, local-time, the docs site, cocoindex) already declare against.
    this.addHierarchy(this.PERSONAL_PROJECTS, {
      parent: undefined,
      children: new Set(),
      level: 'global'
    });
  }
  
  /**
   * Return the hierarchy entry for `id`, creating an empty one when absent.
   *
   * Entries used to be created only by the explicit `addHierarchy` calls in
   * `initializeHierarchies`, so an id that appeared solely as a *parent* (or
   * solely as a *child*) had no entry. That made the containment queries
   * disagree with each other: `NASA_OPERATIONS` declares `parent:
   * US_GOVERNMENT`, but `US_GOVERNMENT` had no entry, so `getChildren(US_GOVERNMENT)`
   * was empty while `contains(US_GOVERNMENT, NASA_OPERATIONS)` was true
   * (james-gibson/local-time#106). Every id named in an edge now gets an entry.
   */
  private static entryFor(id: UniverseId): UniverseHierarchy {
    let entry = this.hierarchies.get(id);
    if (!entry) {
      entry = { children: new Set(), parents: new Set(), level: 'specific' };
      this.hierarchies.set(id, entry);
    }
    if (!entry.parents) {
      entry.parents = new Set(entry.parent ? [entry.parent] : []);
    }
    return entry;
  }

  /**
   * Record one containment edge — `parent` contains `child` — **on both sides**:
   * the parent gains the child and the child gains the parent. Idempotent.
   *
   * This is the only place edges are written, so `getChildren` and
   * `getParentChain` can never disagree about the same edge.
   */
  private static link(parent: UniverseId, child: UniverseId): void {
    this.entryFor(parent).children.add(child);
    const childEntry = this.entryFor(child);
    childEntry.parents!.add(parent);
    if (!childEntry.parent) childEntry.parent = parent;
  }

  /**
   * Extend the containment graph from outside this file.
   *
   * `CommonUniverseIds` used to be closed: `initializeHierarchies` is a private
   * static block of hard-coded roots and `addHierarchy` is private, so a new
   * collection could never become a descendant of a new container no matter what
   * `connections.natural.parentUniverses` a universe declared. This is the public
   * injection point (james-gibson/local-time#106); `UniverseRegistry` calls it
   * from `registerUniverse`, deriving the edges from the universe's declared
   * parents. Idempotent, and safe to call before or after the parent is declared.
   */
  static registerUniverseLinks(child: UniverseId, parents: readonly UniverseId[]): void {
    for (const parent of parents) {
      this.link(parent, child);
    }
    this.entryFor(child);
  }

  /**
   * Resolve a *declared parent name* to the `UniverseId` it denotes.
   *
   * The KB's `parent-universes` frontmatter is written as symbolic names — the
   * canonical template says `HOLLYWOOD_SYSTEM`, and 14 distinct names are in use
   * across the compendia — while a `CommonUniverseIds` member carries the real id
   * (`history:hollywood:1913`). Nothing bridged the two, so a declared edge naming
   * a container was filtered out by `UniverseRegistry.declaredParentUniverses` and
   * the universe registered with no parents at all (james-gibson/local-time#133).
   *
   * An id is returned for either form, so a compendium may write a name or an id.
   * `undefined` means the name denotes no known container; the caller reports that
   * rather than dropping it in silence.
   */
  static resolveDeclaredName(name: string): UniverseId | undefined {
    const trimmed = typeof name === 'string' ? name.trim() : '';
    if (trimmed === '') return undefined;
    // Already an id — the two hand-typed ids in the compendia take this path.
    if (isValidUniverseId(trimmed)) return createUniverseId(trimmed);
    return this.declaredNameIndex().get(trimmed);
  }

  /** Cache for {@link declaredNameIndex}; `null` until first use. */
  private static declaredNameIndexCache: Map<string, UniverseId> | null = null;

  /**
   * `static member NAME -> UniverseId`, built once by reflecting over the class.
   *
   * Reflection keeps the index in step with the declarations above: a container
   * added as a static is resolvable with no second registration step, which is the
   * class of omission behind james-gibson/local-time#27 and #67 (defined, never
   * reachable).
   */
  private static declaredNameIndex(): Map<string, UniverseId> {
    if (this.declaredNameIndexCache) return this.declaredNameIndexCache;

    const index = new Map<string, UniverseId>();
    for (const [key, value] of Object.entries(this as unknown as Record<string, unknown>)) {
      // Static members are own enumerable properties; the non-string values
      // (this cache, the hierarchy Map) fall out on the typeof check.
      if (typeof value === 'string' && isValidUniverseId(value)) {
        index.set(key, createUniverseId(value));
      }
    }
    this.declaredNameIndexCache = index;
    return index;
  }

  private static addHierarchy(id: UniverseId, hierarchy: UniverseHierarchy) {
    const entry = this.entryFor(id);
    entry.level = hierarchy.level ?? entry.level;
    if (hierarchy.jurisdiction !== undefined) entry.jurisdiction = hierarchy.jurisdiction;
    if (hierarchy.timespan !== undefined) entry.timespan = hierarchy.timespan;

    if (hierarchy.parent) this.link(hierarchy.parent, id);
    for (const parent of hierarchy.parents ?? []) this.link(parent, id);

    for (const child of hierarchy.children) {
      this.link(id, child);
      const childEntry = this.entryFor(child);
      if (!childEntry.level || childEntry.level === 'specific') {
        childEntry.level = hierarchy.level ?? childEntry.level;
      }
    }
  }
  
  // === UTILITY METHODS ===
  
  /**
   * Get all parent universes for a given universe ID.
   *
   * Transitive over **every** declared parent (a universe can have more than one
   * — see `link`), breadth-first so direct parents precede grandparents, and
   * cycle-safe. The old version followed the single `parent` field, so a
   * multi-parent child was invisible to any parent but its first.
   */
  static getParentChain(universeId: UniverseId): UniverseId[] {
    const chain: UniverseId[] = [];
    const seen = new Set<UniverseId>([universeId]);
    let frontier = this.parentsOf(universeId);

    while (frontier.length > 0) {
      const next: UniverseId[] = [];
      for (const parent of frontier) {
        if (seen.has(parent)) continue;
        seen.add(parent);
        chain.push(parent);
        next.push(...this.parentsOf(parent));
      }
      frontier = next;
    }

    return chain;
  }

  /**
   * The **direct** parents declared for `id` — one entry per container it is a
   * member of. `getParentChain` is the transitive closure of this: a universe's
   * direct memberships and its full ancestry are both addressable
   * (james-gibson/local-time#74).
   */
  static getParents(universeId: UniverseId): UniverseId[] {
    return this.parentsOf(universeId);
  }

  /** Every parent declared for `id`; multi-parent aware. */
  private static parentsOf(id: UniverseId): UniverseId[] {
    const entry = this.hierarchies.get(id);
    if (!entry) return [];
    return entry.parents ? Array.from(entry.parents) : entry.parent ? [entry.parent] : [];
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

  /**
   * Get the context universes that apply to any version-control-system entity
   */
  static getVersionControlUniverses(): UniverseId[] {
    return [
      this.VERSION_CONTROL,
      this.SOFTWARE_ENGINEERING,
      this.WORLD_HISTORY
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
