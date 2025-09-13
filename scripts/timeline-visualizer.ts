#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client';
import { parseUniverseId, UniverseId } from '../src/core/universe-ids.js';
import { UniverseRegistry } from '../src/config/universe-registry.js';
import { ConfigLoader } from '../src/config/config-loader.js';
import { ReferenceType } from '../src/core/types.js';

interface TimelineNode {
  universeId: string;
  timestamp: bigint;
  category: string;
  name: string;
  parents: string[];
  children: string[];
  realityLevel: number;
  type: string;
}

class TimelineVisualizer {
  // private prisma = new PrismaClient();
  private registry: UniverseRegistry;
  private nodes: Map<string, TimelineNode> = new Map();

  constructor() {
    this.registry = new UniverseRegistry(new ConfigLoader());
  }

  async initialize() {
    await this.registry.initialize();
    await this.loadTimelineData();
  }

  private async loadTimelineData() {
    // Load from database first
    // const dbUniverses = await this.prisma.universe.findMany({
    //   include: {
    //     layers: {
    //       include: {
    //         epochs: true
    //       }
    //     },
    //     windows: true,
    //     references: true,
    //     referencedBy: true
    //   }
    // });

    // Load from registry
    const registryUniverses = this.registry.getAllUniverses();

    // Merge data sources
    const allUniverses = new Map<string, any>();
    
    // Add registry universes
    for (const universe of registryUniverses) {
      allUniverses.set(universe.universeId as string, {
        source: 'registry',
        data: universe
      });
    }

    // Add/update with database universes
    // for (const dbUniverse of dbUniverses) {
    //   allUniverses.set(dbUniverse.id, {
    //     source: allUniverses.has(dbUniverse.id) ? 'both' : 'database',
    //     data: dbUniverse,
    //     dbData: dbUniverse
    //   });
    // }

    // Build timeline nodes
    for (const [universeId, universeInfo] of allUniverses) {
      const node = this.createTimelineNode(universeId, universeInfo);
      this.nodes.set(universeId, node);
    }

    // Add parent/child relationships from references
    await this.buildReferenceConnections();
  }

  private async buildReferenceConnections() {
    // const references = await this.prisma.temporalReference.findMany();
    //
    // for (const ref of references) {
    //   const sourceNode = this.nodes.get(ref.sourceUniverseId);
    //   const targetNode = this.nodes.get(ref.targetUniverseId);
    //
    //   if (sourceNode && targetNode) {
    //     // Determine direction based on reference type
    //     const refType = ref.type as ReferenceType;
    //
    //     if (this.isInfluenceReference(refType)) {
    //       // Source influences target (source is parent)
    //       sourceNode.children.push(ref.targetUniverseId);
    //       targetNode.parents.push(ref.sourceUniverseId);
    //     } else if (this.isDocumentaryReference(refType)) {
    //       // Target documents source (target is child)
    //       targetNode.children.push(ref.sourceUniverseId);
    //       sourceNode.parents.push(ref.targetUniverseId);
    //     }
    //   }
    // }
  }

  private isInfluenceReference(type: ReferenceType): boolean {
    return [
      ReferenceType.INSPIRED_BY,
      ReferenceType.SUBLIMATED,
      ReferenceType.QUOTES
    ].includes(type);
  }

  private isDocumentaryReference(type: ReferenceType): boolean {
    return [
      ReferenceType.DEPICTS,
      ReferenceType.DOCUMENTS,
      ReferenceType.RECREATES
    ].includes(type);
  }

  private createTimelineNode(universeId: string, universeInfo: any): TimelineNode {
    const data = universeInfo.data;
    let parsed: any;
    // console.dir(universeInfo)
    try {
      parsed = parseUniverseId(universeId as UniverseId);
    } catch {
      // Fallback parsing for malformed IDs
      const parts = universeId.split(':');
      parsed = {
        category: parts[0] || 'unknown',
        identifier: parts[1] || 'unknown',
        timestamp: parts[2] || '0'
      };
    }
    
    // Get primary temporal epoch
    const timestamp = this.extractTimestamp(data, universeInfo.data);
    const realityLevel = this.extractRealityLevel(data, universeInfo.data);
    
    return {
      universeId,
      timestamp,
      category: parsed.category,
      name: this.extractName(data, universeInfo.data) || parsed.identifier,
      parents: [],
      children: [],
      realityLevel,
      type: universeInfo.source
    };
  }

  private extractTimestamp(registryData: any, dbData: any): bigint {
    // Try database first
    if (dbData?.layers?.[0]?.epochs?.[0]?.startTime) {
      return BigInt(dbData.layers[0].epochs[0].startTime);
    }
    // i added this metadata released check because when the
    // unix epoch exists (which it always does in
    // real events in recent history) it overrides
    // the node's position to zero. this probably
    // isnt the real fix
    // if (registryData?.metadata?.released) {
    //   return BigInt(registryData?.metadata?.released);
    // }

    // Fallback to parsing year from ID
    const yearMatch = (registryData?.universeId || dbData?.id)?.match(/:(\d{4})$/);
    if (yearMatch) {
      const year = parseInt(yearMatch[1]);
      return BigInt(new Date(year, 0, 1).getTime()) * BigInt(1000000); // Convert to nanoseconds
    }
    // Try registry epochs
    // TODO: this prioritizes the unix epoch blindly
    if (registryData?.epochs) {
      const epochKeys = Object.keys(registryData.epochs);
      const primaryKey = epochKeys.find(key => key.includes('primary')) || epochKeys[0];

      if (primaryKey && registryData.epochs[primaryKey]?.startTime) {
        return BigInt(registryData.epochs[primaryKey].startTime);
      }
    }

    return BigInt(0);
  }

  private extractRealityLevel(registryData: any, dbData: any): number {
    if (registryData?.realityRelation?.fictionalizationDegree !== undefined) {
      return registryData.realityRelation.fictionalizationDegree;
    }
    
    if (dbData?.realityRelation) {
      try {
        const parsed = JSON.parse(dbData.realityRelation);
        return parsed.fictionalizationDegree || 0.5;
      } catch {
        return 0.5;
      }
    }
    
    return 0.5;
  }

  private extractName(registryData: any, dbData: any): string {
    return registryData?.metadata?.canonicalName || 
           dbData?.canonicalName || 
           registryData?.identifiers?.primary ||
           'Unknown';
  }

  async visualizeTimeline() {
    console.log('\n🌌 Universe Timeline Visualization\n');
    console.log(`📊 Total Universes: ${this.nodes.size}`);
    
    // Sort nodes by timestamp
    const sortedNodes = Array.from(this.nodes.values())
      .sort((a, b) => Number(a.timestamp - b.timestamp));
console.dir(sortedNodes);
    // Group by time periods for better visualization
    const timeGroups = this.groupByTimePeriods(sortedNodes);
    
    for (const [period, nodes] of timeGroups) {
      console.log(`\n📅 ${period} (${nodes.length} universes)`);
      console.log('─'.repeat(60));
      
      // Sort within period by category then name
      const sortedPeriodNodes = nodes.sort((a, b) => {
        if (a.category !== b.category) return a.category.localeCompare(b.category);
        return a.name.localeCompare(b.name);
      });
      
      for (const node of sortedPeriodNodes) {
        this.renderNode(node);
      }
    }
  }

  private groupByTimePeriods(nodes: TimelineNode[]): Map<string, TimelineNode[]> {
    const groups = new Map<string, TimelineNode[]>();
    
    for (const node of nodes) {

      const period = this.getTimePeriod(node.timestamp);
      if (!groups.has(period)) {
        groups.set(period, [node]);
      } else {
        groups.get(period)!.push(node);
      }

    }
    console.dir({groups})
    return groups;
  }

  private getTimePeriod(timestamp: bigint): string {
    if (timestamp === BigInt(0)) return '🔮 Unknown/Timeless';
    
    const date = new Date(Number(timestamp / BigInt(1000000))); // Convert from nanoseconds
    const year = date.getFullYear();
    
    // if (year < 1900) return `🏛️  Pre-1900 (${year})`;
    // if (year < 1950) return `🎭 Early 20th Century (${Math.floor(year/10)*10}s)`;
    // if (year < 2000) return `🎬 Late 20th Century (${Math.floor(year/10)*10}s)`;
    return `(${Math.floor(year/10)*10}s)`;
  }

  private renderNode(node: TimelineNode) {
    const indent = this.calculateIndent(node);
    const branch = this.getBranchSymbol(node);
    const realityIndicator = this.getRealityIndicator(node.realityLevel);
    const sourceIndicator = this.getSourceIndicator(node.type);
    
    console.log(`${indent}${branch} ${realityIndicator}${sourceIndicator} [${node.category}] ${node.name}`);
    console.log(`${indent}   └─ ID: ${this.getShortId(node.universeId)}`);
    
    if (node.parents.length > 0) {
      console.log(`${indent}   └─ ⬆️  Parents: ${node.parents.map(p => this.getShortId(p)).join(', ')}`);
    }
    
    if (node.children.length > 0) {
      console.log(`${indent}   └─ ⬇️  Children: ${node.children.map(c => this.getShortId(c)).join(', ')}`);
    }
    
    console.log(''); // Empty line for readability
  }

  private calculateIndent(node: TimelineNode): string {
    // Simple indentation based on parent count
    return '  '.repeat(Math.min(node.parents.length, 3));
  }

  private getBranchSymbol(node: TimelineNode): string {
    if (node.parents.length === 0 && node.children.length === 0) return '●';
    if (node.parents.length === 0) return '┌─';
    if (node.children.length === 0) return '└─';
    if (node.parents.length === 1 && node.children.length === 1) return '├─';
    if (node.parents.length > 1 || node.children.length > 1) return '┼─';
    return '├─';
  }

  private getRealityIndicator(level: number): string {
    if (level <= 0.2) return '📚'; // Documentary/Historical
    if (level <= 0.4) return '🎭'; // Dramatized reality
    if (level <= 0.6) return '🎬'; // Historical fiction
    if (level <= 0.8) return '✨'; // Fantasy/Fiction
    return '🌟'; // Pure fiction
  }

  private getSourceIndicator(type: string): string {
    switch (type) {
      case 'registry': return '📋';
      case 'database': return '💾';
      case 'both': return '🔄';
      default: return '❓';
    }
  }

  private getShortId(universeId: string): string {
    const parts = universeId.split(':');
    return parts.length > 2 ? parts.slice(-2).join(':') : universeId;
  }

  async validateNewEntries() {
    console.log('\n🔍 Validating Recent Database Entries\n');
    
    // Get recent entries from database
    const recentEntries = [] ; /*await this.prisma.universe.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        layers: {
          include: {
            epochs: true
          }
        }
      }
    } as unknown as any)*/;

    console.log(`Found ${recentEntries.length} recent entries:\n`);

    for (const entry of recentEntries) {
      const node = this.nodes.get(entry.id);
      
      console.log(`📝 Entry: ${entry.canonicalName || entry.id}`);
      console.log(`   Universe ID: ${entry.id}`);
      console.log(`   Type: ${entry.type}`);
      console.log(`   Created: ${entry.createdAt.toISOString()}`);
      
      if (node) {
        console.log(`   ✅ Found in timeline`);
        console.log(`   📍 Timeline Position: ${this.getTimePeriod(node.timestamp)}`);
        console.log(`   🔗 Connections: ${node.parents.length} parents, ${node.children.length} children`);
        console.log(`   📊 Reality Level: ${node.realityLevel.toFixed(2)}`);
        
        // Validate expected relationships
        if (node.parents.length === 0 && node.children.length === 0) {
          console.log(`   ⚠️  Isolated universe - no connections`);
        }
      } else {
        console.log(`   ❌ NOT found in timeline - potential sync issue!`);
      }
      
      console.log('');
    }
  }

  async close() {
    // await this.prisma.$disconnect();
  }
}

// Main execution
async function main() {
  const visualizer = new TimelineVisualizer();
  
  try {
    console.log('🚀 Initializing Timeline Visualizer...');
    await visualizer.initialize();
    
    await visualizer.visualizeTimeline();
    await visualizer.validateNewEntries();
    
  } catch (error) {
    console.error('❌ Error:', error);
    console.error((error as Error).stack);
  } finally {
    await visualizer.close();
  }
}
main()
// if (require.main === module) {
//   main().catch(console.error);
// }
