import { Universe, UniverseType, TimePrecision } from '../core/types.js';
import { UniverseRegistry } from '../config/universe-registry.js';

export interface BiographicalQuery {
  personName?: string;
  birthYear?: number;
  deathYear?: number;
  educationPeriod?: boolean;
  militaryService?: boolean;
  publicService?: boolean;
  profession?: string;
  lifeStage?: 'childhood' | 'education' | 'career' | 'retirement';
}

export interface LegalQuery {
  jurisdiction?: string;
  lawType?: 'constitutional' | 'statutory' | 'case_law' | 'regulation';
  status?: 'active' | 'inactive' | 'overturned' | 'amended';
  enactedAfter?: Date;
  enactedBefore?: Date;
  subject?: string;
}

export class BiographicalQueryService {
  constructor(private registry: UniverseRegistry) {}

  /**
   * Find biographical universes matching criteria
   */
  async findBiographies(query: BiographicalQuery): Promise<Universe[]> {
    let universes = this.registry.getAllUniverses()
      .filter(u => u.type === UniverseType.BIOGRAPHY);

    if (query.personName) {
      universes = universes.filter(u => 
        u.metadata?.canonicalName.toLowerCase().includes(query.personName!.toLowerCase()) ||
        u.identifiers.aliases?.some(alias => 
          alias.toLowerCase().includes(query.personName!.toLowerCase())
        )
      );
    }

    if (query.birthYear) {
      universes = universes.filter(u => {
        const birthKeyframe = u.temporalStructure?.keyframes.find(k => k.tags.includes('birth'));
        if (birthKeyframe) {
          const birthDate = new Date(Number(birthKeyframe.timestamp / 1000000n));
          return birthDate.getFullYear() === query.birthYear;
        }
        return false;
      });
    }

    if (query.deathYear) {
      universes = universes.filter(u => {
        const deathKeyframe = u.temporalStructure?.keyframes.find(k => k.tags.includes('death'));
        if (deathKeyframe) {
          const deathDate = new Date(Number(deathKeyframe.timestamp / 1000000n));
          return deathDate.getFullYear() === query.deathYear;
        }
        return false;
      });
    }

    if (query.educationPeriod) {
      universes = universes.filter(u => 
        u.temporalStructure?.segments.some(s => s.type === 'education')
      );
    }

    if (query.militaryService) {
      universes = universes.filter(u => 
        u.temporalStructure?.segments.some(s => s.type === 'public_service') &&
        u.temporalStructure?.keyframes.some(k => k.tags.includes('military'))
      );
    }

    return universes;
  }

  /**
   * Find legal timelines matching criteria
   */
  async findLegalTimelines(query: LegalQuery): Promise<Universe[]> {
    let universes = this.registry.getAllUniverses()
      .filter(u => u.type === UniverseType.LEGAL_TIMELINE);

    if (query.jurisdiction) {
      universes = universes.filter(u => 
        u.temporalStructure?.segments.some(s => 
          s.jurisdiction?.toLowerCase().includes(query.jurisdiction!.toLowerCase())
        )
      );
    }

    if (query.status) {
      universes = universes.filter(u => 
        u.temporalStructure?.segments.some(s => s.status === query.status)
      );
    }

    if (query.enactedAfter) {
      const afterTimestamp = BigInt(query.enactedAfter.getTime()) * 1000000n;
      universes = universes.filter(u => {
        const enactmentKeyframe = u.temporalStructure?.keyframes.find(k => 
          k.tags.includes('enactment') || k.tags.includes('decision_rendered')
        );
        return enactmentKeyframe && enactmentKeyframe.timestamp >= afterTimestamp;
      });
    }

    if (query.enactedBefore) {
      const beforeTimestamp = BigInt(query.enactedBefore.getTime()) * 1000000n;
      universes = universes.filter(u => {
        const enactmentKeyframe = u.temporalStructure?.keyframes.find(k => 
          k.tags.includes('enactment') || k.tags.includes('decision_rendered')
        );
        return enactmentKeyframe && enactmentKeyframe.timestamp <= beforeTimestamp;
      });
    }

    return universes;
  }

  /**
   * Find people who were alive during a specific time period
   */
  async findPeopleAliveDuring(startDate: Date, endDate: Date): Promise<Array<{
    universe: Universe;
    lifeStage: string;
    age: number;
  }>> {
    const startTimestamp = BigInt(startDate.getTime()) * 1000000n;
    const endTimestamp = BigInt(endDate.getTime()) * 1000000n;

    const biographies = this.registry.getAllUniverses()
      .filter(u => u.type === UniverseType.BIOGRAPHY);

    const results = [];

    for (const bio of biographies) {
      const birthKeyframe = bio.temporalStructure?.keyframes.find(k => k.tags.includes('birth'));
      const deathKeyframe = bio.temporalStructure?.keyframes.find(k => k.tags.includes('death'));

      if (birthKeyframe) {
        const birthTime = birthKeyframe.timestamp;
        const deathTime = deathKeyframe?.timestamp || BigInt(Date.now()) * 1000000n;

        // Check if person was alive during the period
        if (birthTime <= endTimestamp && deathTime >= startTimestamp) {
          // Calculate age at start of period
          const ageAtStart = Number((startTimestamp - birthTime) / (BigInt(365.25 * 24 * 60 * 60 * 1000) * 1000000n));
          
          // Determine life stage
          const lifeStage = this.determineLifeStage(bio, startTimestamp);
          
          results.push({
            universe: bio,
            lifeStage,
            age: Math.max(0, ageAtStart)
          });
        }
      }
    }

    return results.sort((a, b) => a.age - b.age);
  }

  /**
   * Find laws that were active during a specific time period
   */
  async findActiveLawsDuring(startDate: Date, endDate: Date, jurisdiction?: string): Promise<Array<{
    universe: Universe;
    status: string;
    activeSegments: string[];
  }>> {
    const startTimestamp = BigInt(startDate.getTime()) * 1000000n;
    const endTimestamp = BigInt(endDate.getTime()) * 1000000n;

    let legalTimelines = this.registry.getAllUniverses()
      .filter(u => u.type === UniverseType.LEGAL_TIMELINE);

    if (jurisdiction) {
      legalTimelines = legalTimelines.filter(u => 
        u.temporalStructure?.segments.some(s => 
          s.jurisdiction?.toLowerCase().includes(jurisdiction.toLowerCase())
        )
      );
    }

    const results = [];

    for (const legal of legalTimelines) {
      const activeSegments = legal.temporalStructure?.segments.filter(s => 
        s.start <= endTimestamp && s.end >= startTimestamp
      ) || [];

      if (activeSegments.length > 0) {
        const currentStatus = activeSegments[activeSegments.length - 1].status || 'unknown';
        
        results.push({
          universe: legal,
          status: currentStatus,
          activeSegments: activeSegments.map(s => s.id)
        });
      }
    }

    return results;
  }

  private determineLifeStage(biography: Universe, timestamp: bigint): string {
    const segments = biography.temporalStructure?.segments || [];
    
    for (const segment of segments) {
      if (segment.start <= timestamp && segment.end >= timestamp) {
        return segment.type;
      }
    }
    
    return 'unknown';
  }

  /**
   * Answer age-based queries about biographical events
   */
  async answerAgeQuery(
    personName: string,
    eventTag: string,
    ageThreshold: number
  ): Promise<{
    answer: boolean;
    details: {
      personAge: number;
      eventDate: Date;
      birthdayDate: Date;
      ageAtEvent: number;
      eventDescription: string;
    } | null;
    confidence: number;
  }> {
    // Find the person's biography
    const biographies = await this.findBiographies({ personName });
    
    if (biographies.length === 0) {
      return {
        answer: false,
        details: null,
        confidence: 0
      };
    }

    const biography = biographies[0];
    
    // Find birth event
    const birthKeyframe = biography.temporalStructure?.keyframes.find(k => 
      k.tags.includes('birth')
    );
    
    // Find the specific event
    const eventKeyframe = biography.temporalStructure?.keyframes.find(k => 
      k.tags.includes(eventTag)
    );

    if (!birthKeyframe || !eventKeyframe) {
      return {
        answer: false,
        details: null,
        confidence: 0
      };
    }

    const birthDate = new Date(Number(birthKeyframe.timestamp / 1000000n));
    const eventDate = new Date(Number(eventKeyframe.timestamp / 1000000n));
    
    // Calculate age at event
    const ageAtEvent = this.calculateAge(birthDate, eventDate);
    
    return {
      answer: ageAtEvent >= ageThreshold,
      details: {
        personAge: this.calculateAge(birthDate, new Date()),
        eventDate,
        birthdayDate: birthDate,
        ageAtEvent,
        eventDescription: eventKeyframe.id.replace('_', ' ')
      },
      confidence: Math.min(birthKeyframe.certainty || 1.0, eventKeyframe.certainty || 1.0)
    };
  }

  /**
   * Find specific award or achievement events
   */
  async findAwardEvents(personName: string): Promise<Array<{
    eventName: string;
    date: Date;
    ageAtEvent: number;
    tags: string[];
    significance: number;
  }>> {
    const biographies = await this.findBiographies({ personName });
    
    if (biographies.length === 0) {
      return [];
    }

    const biography = biographies[0];
    const birthKeyframe = biography.temporalStructure?.keyframes.find(k => 
      k.tags.includes('birth')
    );

    if (!birthKeyframe) {
      return [];
    }

    const birthDate = new Date(Number(birthKeyframe.timestamp / 1000000n));
    
    // Find all award-related events
    const awardEvents = biography.temporalStructure?.keyframes.filter(k => 
      k.tags.some(tag => ['award', 'achievement', 'milestone'].includes(tag))
    ) || [];

    return awardEvents.map(event => {
      const eventDate = new Date(Number(event.timestamp / 1000000n));
      return {
        eventName: event.id.replace('_', ' '),
        date: eventDate,
        ageAtEvent: this.calculateAge(birthDate, eventDate),
        tags: event.tags,
        significance: event.significance
      };
    }).sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  private calculateAge(birthDate: Date, eventDate: Date): number {
    const ageInMs = eventDate.getTime() - birthDate.getTime();
    return Math.floor(ageInMs / (365.25 * 24 * 60 * 60 * 1000));
  }

  /**
   * Calculate time between two events using one as T=0
   * Example: "Free Britney" meme to conservatorship termination
   */
  async calculateTimeBetweenEvents(
    personName: string,
    zeroEventTag: string,
    targetEventTag: string
  ): Promise<{
    success: boolean;
    timeElapsed?: {
      days: number;
      months: number;
      years: number;
      totalDays: number;
    };
    zeroEvent?: {
      name: string;
      date: Date;
      description: string;
    };
    targetEvent?: {
      name: string;
      date: Date;
      description: string;
    };
    confidence: number;
  }> {
    const biographies = await this.findBiographies({ personName });
    
    if (biographies.length === 0) {
      return { success: false, confidence: 0 };
    }

    const biography = biographies[0];
    
    // Find zero event (T=0)
    const zeroKeyframe = biography.temporalStructure?.keyframes.find(k => 
      k.tags.includes(zeroEventTag)
    );
    
    // Find target event
    const targetKeyframe = biography.temporalStructure?.keyframes.find(k => 
      k.tags.includes(targetEventTag)
    );

    if (!zeroKeyframe || !targetKeyframe) {
      return { success: false, confidence: 0 };
    }

    const zeroDate = new Date(Number(zeroKeyframe.timestamp / 1000000n));
    const targetDate = new Date(Number(targetKeyframe.timestamp / 1000000n));
    
    // Calculate time difference
    const timeDiff = targetDate.getTime() - zeroDate.getTime();
    const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    // Calculate years, months, days
    const years = Math.floor(totalDays / 365.25);
    const remainingDays = totalDays - Math.floor(years * 365.25);
    const months = Math.floor(remainingDays / 30.44); // Average month length
    const days = Math.floor(remainingDays - (months * 30.44));
    
    return {
      success: true,
      timeElapsed: {
        days,
        months,
        years,
        totalDays
      },
      zeroEvent: {
        name: zeroKeyframe.id.replace('_', ' '),
        date: zeroDate,
        description: `T=0: ${zeroKeyframe.id.replace('_', ' ')}`
      },
      targetEvent: {
        name: targetKeyframe.id.replace('_', ' '),
        date: targetDate,
        description: targetKeyframe.id.replace('_', ' ')
      },
      confidence: Math.min(zeroKeyframe.certainty || 1.0, targetKeyframe.certainty || 1.0)
    };
  }

  /**
   * Generate a biographical timeline report
   */
  generateBiographicalReport(universe: Universe): string {
    if (universe.type !== UniverseType.BIOGRAPHY) {
      return 'Not a biographical universe';
    }

    let report = `# Biographical Timeline: ${universe.metadata?.canonicalName}\n\n`;

    const keyframes = universe.temporalStructure?.keyframes || [];
    const segments = universe.temporalStructure?.segments || [];

    // Life events
    report += `## Key Life Events\n`;
    keyframes
      .sort((a, b) => Number(a.timestamp - b.timestamp))
      .forEach(event => {
        const date = new Date(Number(event.timestamp / 1000000n));
        const certainty = event.certainty ? ` (${(event.certainty * 100).toFixed(0)}% certain)` : '';
        report += `- **${date.toDateString()}**: ${event.id.replace('_', ' ')}${certainty}\n`;
      });

    // Life periods
    report += `\n## Life Periods\n`;
    segments
      .sort((a, b) => Number(a.start - b.start))
      .forEach(period => {
        const startDate = new Date(Number(period.start / 1000000n));
        const endDate = new Date(Number(period.end / 1000000n));
        report += `- **${period.type.replace('_', ' ')}**: ${startDate.getFullYear()} - ${endDate.getFullYear()}\n`;
      });

    return report;
  }
}
