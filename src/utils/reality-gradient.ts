import { Universe, ReferenceType, RealityRelation } from '../core/types.js';

export interface RealityGradient {
  level: number;           // 0.0 = pure reality, 1.0 = pure fiction
  category: RealityCategory;
  confidence: number;      // How certain we are about this classification
  evidence: string[];      // Supporting evidence for this classification
}

export enum RealityCategory {
  PURE_REALITY = 'pure_reality',           // 0.0 - Historical facts, documentaries
  DOCUMENTED_REALITY = 'documented_reality', // 0.1 - Well-documented events
  INTERPRETED_REALITY = 'interpreted_reality', // 0.2 - Historical interpretation
  DRAMATIZED_REALITY = 'dramatized_reality',   // 0.3 - Docudramas, based on true events
  INSPIRED_FICTION = 'inspired_fiction',       // 0.4 - Inspired by real events
  HISTORICAL_FICTION = 'historical_fiction',   // 0.5 - Fictional characters in real settings
  FANTASY_REALISM = 'fantasy_realism',         // 0.6 - Magical realism, alternate history
  SOFT_FICTION = 'soft_fiction',               // 0.7 - Plausible but fictional
  HARD_FICTION = 'hard_fiction',               // 0.8 - Clearly fictional worlds
  PURE_FANTASY = 'pure_fantasy'                // 0.9-1.0 - Complete fantasy/mythology
}

export class RealityGradientAnalyzer {
  /**
   * Analyze the reality gradient of a universe
   */
  static analyzeUniverse(universe: Universe): RealityGradient {
    const relation = universe.realityRelation;
    let level = relation.fictionalizationDegree;
    let category = this.categorizeByLevel(level);
    let confidence = 0.8; // Default confidence
    const evidence: string[] = [];

    // Adjust based on reality relation type
    switch (relation.type) {
      case 'documentary':
        level = Math.min(level, 0.1);
        category = level === 0.0 ? RealityCategory.PURE_REALITY : RealityCategory.DOCUMENTED_REALITY;
        confidence = 0.95;
        evidence.push('Classified as documentary');
        break;

      case 'historical_fiction':
        level = Math.max(level, 0.4);
        category = RealityCategory.HISTORICAL_FICTION;
        evidence.push('Historical fiction with fictional characters');
        break;

      case 'inspired_by':
        level = Math.max(level, 0.3);
        category = level < 0.5 ? RealityCategory.INSPIRED_FICTION : RealityCategory.SOFT_FICTION;
        evidence.push('Inspired by real events');
        break;

      case 'pure_fiction':
        level = Math.max(level, 0.7);
        category = level < 0.9 ? RealityCategory.HARD_FICTION : RealityCategory.PURE_FANTASY;
        evidence.push('Classified as pure fiction');
        break;

      case 'metafiction':
        level = Math.max(level, 0.8);
        category = RealityCategory.PURE_FANTASY;
        evidence.push('Metafictional work');
        break;
    }

    // Adjust based on reality anchors
    if (relation.realityAnchors.length > 0) {
      const avgConfidence = relation.realityAnchors.reduce((sum, anchor) => sum + anchor.confidence, 0) / relation.realityAnchors.length;
      level = level * (1 - avgConfidence * 0.3); // Reality anchors reduce fictionalization
      evidence.push(`${relation.realityAnchors.length} reality anchors with avg confidence ${avgConfidence.toFixed(2)}`);
    }

    // Historical consultants increase reality
    if (relation.historicalConsultants && relation.historicalConsultants.length > 0) {
      level = level * 0.9; // Reduce fictionalization by 10%
      evidence.push(`Historical consultants: ${relation.historicalConsultants.join(', ')}`);
    }

    // Claims of historical accuracy
    if (relation.claimsHistoricalAccuracy) {
      level = level * 0.8; // Reduce fictionalization by 20%
      evidence.push('Claims historical accuracy');
    }

    // Recategorize after adjustments
    category = this.categorizeByLevel(level);

    return {
      level: Math.max(0, Math.min(1, level)), // Clamp to 0-1 range
      category,
      confidence,
      evidence
    };
  }

  /**
   * Analyze the reality gradient of a reference between universes
   */
  static analyzeReference(
    sourceUniverse: Universe,
    targetUniverse: Universe,
    referenceType: ReferenceType
  ): RealityGradient {
    const sourceGradient = this.analyzeUniverse(sourceUniverse);
    const targetGradient = this.analyzeUniverse(targetUniverse);
    
    let level: number;
    let category: RealityCategory;
    const evidence: string[] = [];
    let confidence = Math.min(sourceGradient.confidence, targetGradient.confidence);

    // Calculate reference reality level based on type
    switch (referenceType) {
      case ReferenceType.DOCUMENTS:
      case ReferenceType.DEPICTS:
        // Direct references maintain target's reality level
        level = targetGradient.level;
        category = targetGradient.category;
        evidence.push(`Direct reference maintains target reality level`);
        break;

      case ReferenceType.RECREATES:
        // Recreation adds some fictionalization
        level = Math.min(1.0, targetGradient.level + 0.1);
        category = this.categorizeByLevel(level);
        evidence.push(`Recreation adds fictionalization to target`);
        break;

      case ReferenceType.INSPIRED_BY:
        // Inspiration significantly increases fictionalization
        level = Math.min(1.0, targetGradient.level + 0.3);
        category = this.categorizeByLevel(level);
        evidence.push(`Inspiration increases fictionalization`);
        break;

      case ReferenceType.SUBLIMATED:
      case ReferenceType.ALLEGORIZES:
        // Psychological transformation creates high fictionalization
        level = Math.max(0.6, Math.min(1.0, targetGradient.level + 0.4));
        category = this.categorizeByLevel(level);
        evidence.push(`Psychological transformation creates high fictionalization`);
        break;

      case ReferenceType.PARODIES:
      case ReferenceType.REINTERPRETS:
        // Meta references blend realities
        level = (sourceGradient.level + targetGradient.level) / 2 + 0.2;
        category = this.categorizeByLevel(level);
        evidence.push(`Meta reference blends source and target realities`);
        break;

      case ReferenceType.MYTHOLOGIZES:
        // Mythologizing creates high fictionalization
        level = Math.max(0.8, targetGradient.level);
        category = RealityCategory.PURE_FANTASY;
        evidence.push(`Mythologizing creates high fictionalization`);
        break;

      case ReferenceType.METAFICTION:
        // Metafiction is highly fictional
        level = 0.9;
        category = RealityCategory.PURE_FANTASY;
        evidence.push(`Metafiction is highly fictional`);
        break;

      default:
        // Default: average of source and target
        level = (sourceGradient.level + targetGradient.level) / 2;
        category = this.categorizeByLevel(level);
        evidence.push(`Default: average of source and target reality levels`);
    }

    evidence.push(`Source: ${sourceGradient.category} (${sourceGradient.level.toFixed(2)})`);
    evidence.push(`Target: ${targetGradient.category} (${targetGradient.level.toFixed(2)})`);

    return {
      level: Math.max(0, Math.min(1, level)),
      category,
      confidence,
      evidence
    };
  }

  /**
   * Find universes within a specific reality gradient range
   */
  static findUniversesByRealityLevel(
    universes: Universe[],
    minLevel: number = 0,
    maxLevel: number = 1,
    category?: RealityCategory
  ): Array<{ universe: Universe; gradient: RealityGradient }> {
    return universes
      .map(universe => ({
        universe,
        gradient: this.analyzeUniverse(universe)
      }))
      .filter(({ gradient }) => {
        const levelMatch = gradient.level >= minLevel && gradient.level <= maxLevel;
        const categoryMatch = !category || gradient.category === category;
        return levelMatch && categoryMatch;
      })
      .sort((a, b) => a.gradient.level - b.gradient.level);
  }

  /**
   * Generate a reality gradient report
   */
  static generateRealityReport(universe: Universe): string {
    const gradient = this.analyzeUniverse(universe);
    
    let report = `# Reality Gradient Analysis\n\n`;
    report += `**Universe:** ${universe.metadata?.canonicalName || universe.universeId}\n`;
    report += `**Reality Level:** ${gradient.level.toFixed(3)} (${gradient.category})\n`;
    report += `**Confidence:** ${(gradient.confidence * 100).toFixed(1)}%\n\n`;

    report += `## Classification\n`;
    report += `- **Category:** ${gradient.category.replace('_', ' ').toUpperCase()}\n`;
    report += `- **Fictionalization Degree:** ${universe.realityRelation.fictionalizationDegree}\n`;
    report += `- **Reality Relation:** ${universe.realityRelation.type}\n\n`;

    if (gradient.evidence.length > 0) {
      report += `## Evidence\n`;
      gradient.evidence.forEach(e => report += `- ${e}\n`);
      report += `\n`;
    }

    if (universe.realityRelation.realityAnchors.length > 0) {
      report += `## Reality Anchors\n`;
      universe.realityRelation.realityAnchors.forEach(anchor => {
        report += `- **${anchor.realEventId}** (${anchor.relationshipType}, confidence: ${anchor.confidence})\n`;
      });
    }

    return report;
  }

  private static categorizeByLevel(level: number): RealityCategory {
    if (level <= 0.05) return RealityCategory.PURE_REALITY;
    if (level <= 0.15) return RealityCategory.DOCUMENTED_REALITY;
    if (level <= 0.25) return RealityCategory.INTERPRETED_REALITY;
    if (level <= 0.35) return RealityCategory.DRAMATIZED_REALITY;
    if (level <= 0.45) return RealityCategory.INSPIRED_FICTION;
    if (level <= 0.55) return RealityCategory.HISTORICAL_FICTION;
    if (level <= 0.65) return RealityCategory.FANTASY_REALISM;
    if (level <= 0.75) return RealityCategory.SOFT_FICTION;
    if (level <= 0.85) return RealityCategory.HARD_FICTION;
    return RealityCategory.PURE_FANTASY;
  }
}
