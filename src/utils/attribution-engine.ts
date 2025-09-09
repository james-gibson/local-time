import { Universe, ReferenceType } from '../core/types';

export interface AttributionRequirement {
  citation_required: boolean;
  permission_required: boolean;
  fees_required: boolean;
  restrictions: string[];
  fair_use_likely: boolean;
  copyright_status: 'active' | 'expired' | 'public_domain' | 'unknown' | "invalid";
  risk_level: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export class AttributionEngine {
  validateReference(
    source: Universe, 
    target: Universe, 
    referenceType: ReferenceType,
    context?: {
      purpose?: 'commercial' | 'educational' | 'criticism' | 'parody' | 'research';
      extent?: 'minimal' | 'substantial' | 'complete';
      transformative?: boolean;
    }
  ): AttributionRequirement {
    const requirement: AttributionRequirement = {
      citation_required: false,
      permission_required: false,
      fees_required: false,
      restrictions: [],
      fair_use_likely: false,
      copyright_status: 'unknown',
      risk_level: 'medium',
      recommendations: []
    };

    // Determine copyright status
    requirement.copyright_status = this.determineCopyrightStatus(target);

    // Public domain works
    if (requirement.copyright_status === 'public_domain') {
      requirement.citation_required = true; // Still good practice
      requirement.risk_level = 'low';
      requirement.recommendations.push('Public domain - citation recommended for academic integrity');
      return requirement;
    }

    // Historical events and facts
    if (target.realityRelation.type === 'documentary' && 
        target.attribution.public_domain) {
      requirement.copyright_status = 'public_domain';
      requirement.citation_required = true;
      requirement.risk_level = 'low';
      requirement.recommendations.push('Historical facts are not copyrightable - cite sources');
      return requirement;
    }

    // Active copyright works
    if (requirement.copyright_status === 'active') {
      requirement.citation_required = true;
      
      // Assess fair use likelihood
      const fairUseAssessment = this.assessFairUse(source, target, referenceType, context);
      requirement.fair_use_likely = fairUseAssessment.likely;
      requirement.restrictions.push(...fairUseAssessment.restrictions);
      requirement.recommendations.push(...fairUseAssessment.recommendations);

      // High-risk reference types that typically need permission
      const highRiskTypes = [
        ReferenceType.RECREATES,
        ReferenceType.QUOTES, // if substantial
        ReferenceType.DEPICTS // if substantial
      ];

      if (highRiskTypes.includes(referenceType)) {
        if (!requirement.fair_use_likely) {
          requirement.permission_required = true;
          requirement.fees_required = true;
          requirement.risk_level = 'high';
          requirement.recommendations.push('Consider seeking permission or legal advice');
        } else {
          requirement.risk_level = 'medium';
          requirement.recommendations.push('Fair use may apply - document transformative purpose');
        }
      }

      // Commercial vs non-commercial considerations
      if (context?.purpose === 'commercial') {
        requirement.risk_level = requirement.risk_level === 'low' ? 'medium' : 'high';
        requirement.recommendations.push('Commercial use increases copyright risk');
      }

      // Educational and criticism contexts
      if (context?.purpose === 'educational' || context?.purpose === 'criticism') {
        requirement.fair_use_likely = true;
        requirement.risk_level = 'low';
        requirement.recommendations.push('Educational/critical use supports fair use claim');
      }

      // Parody has strong fair use protection
      if (referenceType === ReferenceType.PARODIES) {
        requirement.fair_use_likely = true;
        requirement.risk_level = 'low';
        requirement.recommendations.push('Parody has strong fair use protection');
      }
    }

    // Expired copyright
    if (requirement.copyright_status === 'expired') {
      requirement.citation_required = true;
      requirement.risk_level = 'low';
      requirement.recommendations.push('Copyright expired - work in public domain');
    }

    // Add general recommendations
    this.addGeneralRecommendations(requirement, referenceType);

    return requirement;
  }

  private determineCopyrightStatus(universe: Universe): "active" | "expired" | "public_domain" | "invalid"  | "unknown" {
    // Explicit public domain
    if (universe.attribution.public_domain) {
      return 'public_domain';
    }

    // Explicit copyright status
    if (universe.attribution.copyright?.status) {
      return universe.attribution.copyright.status;
    }

    // Historical events and government works
    if (universe.realityRelation.type === 'documentary' && 
        universe.attribution.sources?.some(s => s.includes('Government') || s.includes('NASA'))) {
      return 'public_domain';
    }

    // Age-based assessment (rough heuristic)
    const copyrightYear = universe.attribution.copyright!.year;
    if (copyrightYear) {
      const currentYear = new Date().getFullYear();
      const age = currentYear - copyrightYear;
      
      // Very rough heuristic - actual copyright law is much more complex
      if (age > 95) {
        return 'expired';
      }
      if (age < 95) {
        return 'active';
      }
    }

    return 'unknown';
  }

  private assessFairUse(
    source: Universe,
    target: Universe,
    referenceType: ReferenceType,
    context?: {
      purpose?: 'commercial' | 'educational' | 'criticism' | 'parody' | 'research';
      extent?: 'minimal' | 'substantial' | 'complete';
      transformative?: boolean;
    }
  ): { likely: boolean; restrictions: string[]; recommendations: string[] } {
    const assessment = {
      likely: false,
      restrictions: [] as string[],
      recommendations: [] as string[]
    };

    let fairUseScore = 0;

    // Factor 1: Purpose and character of use
    if (context?.purpose === 'educational' || context?.purpose === 'criticism' || context?.purpose === 'research') {
      fairUseScore += 2;
      assessment.recommendations.push('Educational/critical purpose supports fair use');
    }
    if (context?.purpose === 'parody' || referenceType === ReferenceType.PARODIES) {
      fairUseScore += 3;
      assessment.recommendations.push('Parody is strongly protected');
    }
    if (context?.transformative) {
      fairUseScore += 2;
      assessment.recommendations.push('Transformative use supports fair use');
    }
    if (context?.purpose === 'commercial') {
      fairUseScore -= 1;
      assessment.restrictions.push('Commercial use weighs against fair use');
    }

    // Factor 2: Nature of copyrighted work
    if (target.realityRelation.fictionalizationDegree < 0.5) {
      fairUseScore += 1; // Factual works have less protection
    }

    // Factor 3: Amount and substantiality
    if (context?.extent === 'minimal') {
      fairUseScore += 2;
    } else if (context?.extent === 'substantial') {
      fairUseScore -= 2;
      assessment.restrictions.push('Substantial use weighs against fair use');
    } else if (context?.extent === 'complete') {
      fairUseScore -= 3;
      assessment.restrictions.push('Complete use strongly weighs against fair use');
    }

    // Factor 4: Effect on market (hard to assess automatically)
    // We'll be conservative here
    if (context?.purpose === 'commercial') {
      fairUseScore -= 1;
    }

    // Reference type considerations
    const lowRiskTypes = [
      ReferenceType.INSPIRED_BY,
      ReferenceType.HOMAGE,
      ReferenceType.VISUAL_HOMAGE,
      ReferenceType.PARODIES
    ];

    if (lowRiskTypes.includes(referenceType)) {
      fairUseScore += 1;
    }

    // Determine likelihood
    assessment.likely = fairUseScore >= 2;

    if (fairUseScore < 0) {
      assessment.recommendations.push('Fair use unlikely - consider seeking permission');
    } else if (fairUseScore < 2) {
      assessment.recommendations.push('Fair use uncertain - document justification carefully');
    }

    return assessment;
  }

  private addGeneralRecommendations(requirement: AttributionRequirement, referenceType: ReferenceType): void {
    // Always recommend proper attribution
    requirement.recommendations.push('Always provide proper attribution to original creators');

    // Specific recommendations by reference type
    switch (referenceType) {
      case ReferenceType.QUOTES:
        requirement.recommendations.push('Keep quotes brief and provide context');
        break;
      case ReferenceType.VISUAL_HOMAGE:
        requirement.recommendations.push('Ensure homage is transformative, not copying');
        break;
      case ReferenceType.PARODIES:
        requirement.recommendations.push('Ensure parody comments on or criticizes original');
        break;
      case ReferenceType.INSPIRED_BY:
        requirement.recommendations.push('Inspiration generally safe if not copying expression');
        break;
    }

    // Risk-based recommendations
    if (requirement.risk_level === 'high') {
      requirement.recommendations.push('Consider consulting with intellectual property attorney');
      requirement.recommendations.push('Document fair use justification thoroughly');
    }

    if (requirement.permission_required) {
      requirement.recommendations.push('Contact rights holders for permission');
      requirement.recommendations.push('Consider alternative approaches if permission denied');
    }
  }

  /**
   * Generate a copyright compliance report for a reference
   */
  generateComplianceReport(
    source: Universe,
    target: Universe,
    referenceType: ReferenceType,
    context?: {
      purpose?: 'commercial' | 'educational' | 'criticism' | 'parody' | 'research';
      extent?: 'minimal' | 'substantial' | 'complete';
      transformative?: boolean;
    }
  ): string {
    const requirement = this.validateReference(source, target, referenceType, context);
    
    let report = `# Copyright Compliance Report\n\n`;
    report += `**Source:** ${source.metadata?.canonicalName || source.universeId}\n`;
    report += `**Target:** ${target.metadata?.canonicalName || target.universeId}\n`;
    report += `**Reference Type:** ${referenceType}\n`;
    report += `**Copyright Status:** ${requirement.copyright_status}\n`;
    report += `**Risk Level:** ${requirement.risk_level}\n\n`;

    report += `## Requirements\n`;
    report += `- Citation Required: ${requirement.citation_required ? 'Yes' : 'No'}\n`;
    report += `- Permission Required: ${requirement.permission_required ? 'Yes' : 'No'}\n`;
    report += `- Fees Required: ${requirement.fees_required ? 'Yes' : 'No'}\n`;
    report += `- Fair Use Likely: ${requirement.fair_use_likely ? 'Yes' : 'No'}\n\n`;

    if (requirement.restrictions.length > 0) {
      report += `## Restrictions\n`;
      requirement.restrictions.forEach(r => report += `- ${r}\n`);
      report += `\n`;
    }

    report += `## Recommendations\n`;
    requirement.recommendations.forEach(r => report += `- ${r}\n`);

    report += `\n---\n*This is automated guidance only. Consult legal counsel for definitive advice.*`;

    return report;
  }
}
