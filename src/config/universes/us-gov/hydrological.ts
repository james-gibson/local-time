import {
    Universe,
    UniverseType,
    TimePrecision,
    TemporalReference,
    ReferenceType,
} from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import {createHistoricalUniverseId, HistoricalUniverseId} from '../../../core/universe-ids';

/**
 * Economic & Ecological Impact Timeline of Hydrological Dams
 *
 * This universe documents the historical timeline of large-scale dam construction and the subsequent recognition
 * of its complex ecological and economic consequences. It traces the shift from viewing dams purely as instruments
 * of progress (for irrigation, power, and flood control) to a more nuanced understanding that includes their
 * negative externalities, such as habitat destruction, impacts on fisheries, and the long-term costs of
 * maintenance and safety.
 *
 * The timeline is structured in three distinct phases: an initial era of ambitious government-led construction,
 * a period of growing environmental awareness, and a modern era of economic reassessment and dam removal.
 *
 * Cultural Significance: 0.9 - This timeline represents a fundamental shift in environmental policy, public
 * works philosophy, and the economic valuation of natural ecosystems. It underpins major environmental
 * legislation and the modern conservation movement.
 *
 * Reality Relation: documents with 0.0 fictionalization. This universe chronicles verifiable historical,
 * legislative, and economic trends.
 *
 * Research Sources:
 * - U.S. Bureau of Reclamation. "The Reclamation Act of 1902." https://www.usbr.gov/history/reclamation_act.html
 * - U.S. Environmental Protection Agency. "Summary of the National Environmental Policy Act." https://www.epa.gov/nepa
 * - U.S. Fish & Wildlife Service. "Endangered Species Act | A History of the ESA." https://www.fws.gov/law/endangered-species-act
 * - World Commission on Dams. "Dams and Development: A New Framework for Decision-Making." (2000).
 * - American Rivers. "Dam Removal." https://www.americanrivers.org/threats-solutions/restoring-damaged-rivers/dam-removal/
 *
 * Hierarchical Context:
 * This universe is naturally contained within several broader contexts, discovered via CommonUniverseIds:
 * - Parent Contexts: US_GOVERNMENT, US_HISTORY, WORLD_HISTORY
 */
export const damImpactTimelineUniverse: Universe = {
    universeId: createHistoricalUniverseId('societal', 'dam_impact_timeline', '1902-2000') as HistoricalUniverseId,
    type: UniverseType.HISTORICAL_EVENT,
    epochs: undefined,
    identifiers: {
        primary: 'history:societal:dam_impact_timeline',
        aliases: ['History of Dam Construction and Environmental Impact', 'Dam Economic Lifecycle'],
    },
    metadata: {
        canonicalName: 'Economic & Ecological Impact Timeline of Hydrological Dams',
        description: 'A timeline tracking the societal perception of large dams, from symbols of progress to subjects of ecological and economic scrutiny.',
        creators: ['U.S. Government', 'Global Environmental Movement', 'World Commission on Dams'],
        released: new Date('1902-06-17T00:00:00Z'),
        cultural_significance: 0.9,
        tags: ['environmental_history', 'economic_policy', 'infrastructure', 'conservation', 'public_works'],
    },
    realityRelation: {
        type: 'documents',
        fictionalizationDegree: 0.0,
        realityAnchors: [
            {
                id: 'reclamation_act_1902',
                description: 'The U.S. Reclamation Act of 1902, which funded massive irrigation projects in the American West, initiating the large-dam era.',
                confidence: 1.0,
                evidence: ['Official text of the Reclamation Act of 1902.'],
            },
            {
                id: 'nepa_1970',
                description: 'The U.S. National Environmental Policy Act (NEPA) of 1970, which mandated environmental impact assessments for all major federal projects, including dams.',
                confidence: 1.0,
                evidence: ['Official text of NEPA.'],
            },
            {
                id: 'wcd_report_2000',
                description: 'The World Commission on Dams 2000 report, which synthesized global knowledge on the extensive environmental and social costs of large dams.',
                confidence: 1.0,
                evidence: ['"Dams and Development: A New Framework for Decision-Making" final report.'],
            },
        ],
    },
    attribution: {
        public_domain: true,
        sources: ['U.S. Bureau of Reclamation', 'U.S. EPA', 'World Commission on Dams', 'American Rivers'],
        citations_required: false,
        usage_restrictions: [],
    },
    temporalStructure: {
        segments: [
            {
                segmentId: 'era_of_ambition',
                startTime: -2129222400000000000n, // 1902-06-17
                endTime: -315619200000000000n, // 1959-12-31
                description: 'The Era of Ambition: Governments, particularly in the U.S., champion large dams for irrigation, hydropower, and flood control as essential to national development and economic progress.',
                tags: ['construction', 'development', 'hydropower'],
            },
            {
                segmentId: 'ecological_awakening',
                startTime: -315532800000000000n, // 1960-01-01
                endTime: 631152000000000000n, // 1989-12-31
                description: 'The Ecological Awakening: The rise of the environmental movement brings widespread recognition of the negative impacts of dams, such as blocked fish migration (e.g., salmon), habitat loss, and altered river ecosystems. This leads to landmark environmental legislation.',
                tags: ['environmentalism', 'conservation', 'legislation', 'fisheries_impact'],
            },
            {
                segmentId: 'economic_reckoning',
                startTime: 631238400000000000n, // 1990-01-01
                endTime: 1757299200000000000n, // 2025-09-10 (current date)
                description: 'The Economic Reckoning: The focus shifts to the long-term economics of dams, including high maintenance costs for aging infrastructure, safety risks, and liability. The economic benefits of river restoration lead to a growing trend of dam removal.',
                tags: ['dam_removal', 'restoration_ecology', 'economic_analysis', 'infrastructure_aging'],
            },
        ],
        keyframes: [
            {
                id: 'reclamation_act',
                timestamp: -2129222400000000000n, // 1902-06-17
                significance: 0.9,
                description: 'The U.S. Reclamation Act is signed, officially launching the era of massive, federally-funded dam projects in the American West.',
                tags: ['legislation', 'us_history', 'water_rights'],
                certainty: 1.0,
            },
            {
                id: 'tva_established',
                timestamp: -1156032000000000000n, // 1933-05-18
                significance: 0.85,
                description: 'The Tennessee Valley Authority (TVA) is created, becoming a model for integrated regional development based on large-scale dam and hydropower systems.',
                tags: ['new_deal', 'public_works', 'regional_development'],
                certainty: 1.0,
            },
            {
                id: 'nepa_signed',
                timestamp: 0n, // 1970-01-01
                significance: 0.95,
                description: 'The National Environmental Policy Act (NEPA) is signed into law, requiring formal environmental impact statements and marking a turning point in how public works are evaluated.',
                tags: ['legislation', 'environmental_law', 'policy_shift'],
                certainty: 1.0,
            },
            {
                id: 'esa_signed',
                timestamp: 125884800000000000n, // 1973-12-28
                significance: 0.95,
                description: 'The Endangered Species Act (ESA) is enacted, providing a powerful legal tool to protect species impacted by dams, most notably Pacific salmon.',
                tags: ['legislation', 'conservation', 'endangered_species'],
                certainty: 1.0,
            },
            {
                id: 'edwards_dam_removal',
                timestamp: 930806400000000000n, // 1999-07-01
                significance: 0.9,
                description: 'The Edwards Dam on the Kennebec River in Maine is breached, marking the first time the U.S. government ordered a dam removed for environmental reasons and symbolizing the start of the dam removal era.',
                tags: ['dam_removal', 'river_restoration', 'milestone'],
                certainty: 1.0,
            },
            {
                id: 'wcd_report_release',
                timestamp: 974380800000000000n, // 2000-11-16
                significance: 1.0,
                description: 'The World Commission on Dams releases its final report, providing a comprehensive global framework for assessing the costs and benefits of dams and defining a new international standard.',
                tags: ['global_policy', 'research', 'defining_moment'],
                certainty: 1.0,
            },
        ],
        windows: {
            strategy: 'phase_based',
            avgWindowSize: 946728000000000000n, // ~30 years
        },
    },
    connections: [
        {
            referenceId: 'cold_war_connection',
            type: ReferenceType.DEPICTS,
            description: 'The technological optimism and national competition of the Cold War era fueled the construction of large-scale infrastructure projects, including major dams.',
            anchors: [
                {
                    context: {
                        significance: 'Correlation of dam construction boom with post-WWII technological investment.'
                    }
                }
            ],
            metadata: {
                confidence: 0.7,
            },
        } as TemporalReference,
    ],
} as unknown as Universe;
