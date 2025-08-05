import { KSUIDConverter } from './ksuid-converter.js';
import { TimePrecision, ReferenceChain, ReferenceType, TemporalReference, TemporalAnchor } from '../core/types.js';

export class ReferenceHelpers {
  /**
   * Generate a unique reference ID using KSUID
   */
  static generateReferenceId(): string {
    return KSUIDConverter.generate();
  }

  /**
   * Generate a temporal ID for a specific moment in a film/universe
   * @param domainId - The domain identifier (e.g., 'film:zootopia:runtime')
   * @param minutes - Minutes into the runtime
   * @param seconds - Seconds into the runtime
   * @param milliseconds - Optional milliseconds
   */
  static generateTemporalId(
    domainId: string, 
    minutes: number, 
    seconds: number, 
    milliseconds: number = 0
  ): string {
    // Convert to nanoseconds from start
    const totalNanoseconds = BigInt(
      (minutes * 60 + seconds) * 1000 + milliseconds
    ) * BigInt(TimePrecision.MILLISECOND);
    
    // Create a temporal event ID with timestamp and random component
    const timestamp = totalNanoseconds.toString(16).padStart(16, '0');
    const randomId = KSUIDConverter.generate().slice(-8);
    
    return `${timestamp}_${randomId}`;
  }

  /**
   * Parse a temporal ID back to its components
   */
  static parseTemporalId(temporalId: string): {
    nanoseconds: bigint;
    randomComponent: string;
  } {
    const [timestampHex, randomComponent] = temporalId.split('_');
    const nanoseconds = BigInt('0x' + timestampHex);
    
    return {
      nanoseconds,
      randomComponent
    };
  }

  /**
   * Convert nanoseconds to human-readable time format
   */
  static nanosecondsToTime(nanoseconds: bigint): {
    minutes: number;
    seconds: number;
    milliseconds: number;
  } {
    const totalMs = Number(nanoseconds / BigInt(TimePrecision.MILLISECOND));
    const minutes = Math.floor(totalMs / 60000);
    const seconds = Math.floor((totalMs % 60000) / 1000);
    const milliseconds = totalMs % 1000;
    
    return { minutes, seconds, milliseconds };
  }
}

/**
 * Create Tolkien multilayer influence chain reference
 */
export function createTolkienInfluenceChain(): ReferenceChain {
  return {
    chainId: "influence:wwi_tolkien_middleearth",
    nodes: [
      {
        universeId: "history:wwi:battle_of_somme:1916",
        type: 'historical_event',
        elements: ["Mechanized warfare", "Trench warfare", "Gas attacks", "Mass death", "Industrial destruction"]
      },
      {
        universeId: "personal:tolkien:wwi_experience:1916",
        type: 'personal_experience',
        elements: ["PTSD", "Loss of friends", "Trench fever", "Survivor guilt", "War trauma"],
        privacy: 'historical_figure'
      },
      {
        universeId: "literature:tolkien:lotr:1954",
        type: 'creative_work',
        elements: ["Dead Marshes", "Industrial destruction", "Loss of innocence", "Environmental destruction", "Mechanized evil"]
      }
    ],
    connections: [
      {
        from: "history:wwi:battle_of_somme:1916",
        to: "personal:tolkien:wwi_experience:1916",
        type: ReferenceType.EXPERIENCED,
        documented: true,
        influence_type: 'traumatic',
        specific_mappings: [
          {
            source_element: "Trench warfare",
            target_element: "Personal trauma",
            transformation: 'psychological_impact'
          },
          {
            source_element: "Mechanized warfare",
            target_element: "Horror of industrial war",
            transformation: 'direct_experience'
          }
        ]
      },
      {
        from: "personal:tolkien:wwi_experience:1916",
        to: "literature:tolkien:lotr:1954",
        type: ReferenceType.SUBLIMATED,
        documented: true,
        influence_type: 'artistic_transformation',
        specific_mappings: [
          {
            source_element: "Trench warfare trauma",
            target_element: "Dead Marshes",
            transformation: 'mythologized',
            tolkien_acknowledged: true
          },
          {
            source_element: "Industrial warfare horror",
            target_element: "Saruman's industrialization",
            transformation: 'allegorized',
            tolkien_acknowledged: false // He denied direct allegory
          },
          {
            source_element: "Loss of friends",
            target_element: "Fellowship bonds and sacrifice",
            transformation: 'emotional_sublimation',
            tolkien_acknowledged: true
          }
        ]
      }
    ],
    metadata: {
      type: 'trauma_sublimation'
    }
  };
}

/**
 * Create Back to the Future test case references
 */
export function createBTTFTestReferences() {
  const references = [];
  
  // Johnny B. Goode paradox reference
  references.push({
    referenceId: generateReferenceId(),
    type: 'temporal_paradox',
    description: 'Marty performs Johnny B. Goode in 1955, before Chuck Berry writes it',
    anchors: [
      {
        domainId: 'film:bttf:1985:narrative_1955',
        eventId: generateTemporalId('film:bttf:1985:narrative_1955', 87, 0),
        context: {
          scene_description: 'Marty performs Johnny B. Goode at enchantment dance',
          significance: 'Creates temporal paradox - song performed before written'
        }
      },
      {
        domainId: 'history:chuck_berry:career',
        eventId: 'johnny_b_goode_composed_1958',
        context: {
          scene_description: 'Chuck Berry composes Johnny B. Goode',
          significance: 'Original composition of the song'
        }
      }
    ],
    metadata: {
      cultural_context: ['temporal_paradox', 'music_history', 'time_travel'],
      confidence: 1.0,
      direction: 'backward'
    }
  });
  
  // Calvin Klein reference
  references.push({
    referenceId: generateReferenceId(),
    type: 'anachronism',
    description: 'Calvin Klein underwear seen in 1955, before brand existed',
    anchors: [
      {
        domainId: 'film:bttf:1985:narrative_1985',
        eventId: generateTemporalId('film:bttf:1985:narrative_1985', 10, 0),
        context: {
          scene_description: 'Marty wears Calvin Klein underwear',
          significance: '1980s fashion item'
        }
      },
      {
        domainId: 'film:bttf:1985:narrative_1955',
        eventId: generateTemporalId('film:bttf:1985:narrative_1955', 45, 0),
        context: {
          scene_description: 'Lorraine sees Calvin Klein on underwear',
          significance: 'Brand name creates identity confusion'
        }
      }
    ],
    metadata: {
      cultural_context: ['anachronism', 'fashion', 'product_placement'],
      confidence: 1.0,
      direction: 'backward'
    }
  });
  
  return references;
}

/**
 * Create multilayer temporal references that span multiple universes and transformation types
 */
export function createMultilayerReference(
  sourceUniverse: string,
  targetUniverse: string,
  intermediateUniverse?: string,
  transformationType: 'direct' | 'sublimated' | 'allegorized' = 'direct'
): TemporalReference {
  const anchors: TemporalAnchor[] = [
    {
      domainId: sourceUniverse,
      eventId: generateReferenceId(),
      context: {
        significance: 'Source experience or event'
      }
    },
    {
      domainId: targetUniverse,
      eventId: generateReferenceId(),
      context: {
        significance: 'Transformed creative expression'
      }
    }
  ];

  // Add intermediate layer if provided (like personal experience between historical event and creative work)
  if (intermediateUniverse) {
    anchors.splice(1, 0, {
      domainId: intermediateUniverse,
      eventId: generateReferenceId(),
      context: {
        significance: 'Intermediate personal/psychological layer'
      }
    });
  }

  return {
    referenceId: generateReferenceId(),
    type: transformationType === 'direct' ? ReferenceType.DEPICTS : 
          transformationType === 'sublimated' ? ReferenceType.SUBLIMATED :
          ReferenceType.ALLEGORIZES,
    description: `Multilayer ${transformationType} reference across temporal universes`,
    anchors,
    metadata: {
      cultural_context: ['multilayer_influence', 'artistic_transformation'],
      confidence: 0.8,
      direction: 'forward'
    }
  };
}

// Export convenience functions for backward compatibility
export const generateReferenceId = ReferenceHelpers.generateReferenceId;
export const generateTemporalId = ReferenceHelpers.generateTemporalId;
