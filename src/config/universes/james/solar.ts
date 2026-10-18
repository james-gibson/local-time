import { createTechnicalUniverseId } from '../../../core/universe-ids';
import {
    Universe,
    UniverseType,
    Keyframe,
    Segment,
    RealityRelationType,
    UsageRestriction,
    CopyrightStatus,
} from '../../../core/types';

/**
 * Custom metadata interface to capture the specific context of this home energy log.
 */
export interface HomeEnergyMetadata {
    location: string;
    timeZone: string;
    utilityProvider: string;
    dataGranularitySeconds: number;
    touSchedule: {
        [key: string]: string;
    };
    solarSystem: {
        installDate: string;
        arrays: SolarArrayDetails[];
        knownIssues: string[];
    };
}

export interface SolarArrayDetails {
    id: 'east_array' | 'west_array';
    panelCount: number;
    orientation: 'East' | 'West';
    performanceNotes: string;
}

// Helper function to create UTC bigint timestamps from Mountain Daylight Time (MDT is UTC-6)
const mdtToUtcBigInt = (dateString: string): bigint => {
    return BigInt(new Date(`${dateString}-06:00`).getTime() / 1000);
};

/**
 * Home Energy Monitoring Log - September 2025
 *
 * This universe documents a real-world log of 15-minute interval energy data from a single-family home
 * in the Denver, Colorado area during September 2025. The data includes grid imports, solar exports,
 * and telemetry anomalies, providing a high-fidelity snapshot of residential energy patterns and the
 * performance of a distributed energy resource (DER).
 *
 * The dataset is particularly significant for its clear illustration of a common solar installation issue:
 * the performance impact of partial shading on one of two arrays. The east-facing array consistently
 * outperforms the west-facing array, which is subject to significant tree shading, especially in the
 * afternoon. This provides a valuable real-world case study for modeling shade losses and evaluating
 * mitigation strategies.
 *
 * Cultural Significance: 0.1 - While not culturally significant to the public, this dataset is a
 * defining record for the system owner and a perfect archetype for residential energy analysis,
 * representing a common challenge in suburban solar installations.
 *
 * Reality Relation: 'documents' with 0.0 fictionalization. This is a direct log of real-world data.
 *
 * Research Sources:
 * - User-provided interval data charts from a utility or monitoring portal, submitted over the course of the conversation.
 * - Contextual information provided by the user regarding solar array orientation, shading, and installation date.
 * - Timestamps and values transcribed directly from the provided charts.
 *
 * Hierarchical Context: This technical log exists within the context of broader energy systems.
 * Natural Connections Discovered:
 * - Parent Context: CommonUniverseIds.ENERGY_GRID_TECHNOLOGY, CommonUniverseIds.RENEWABLE_ENERGY
 * - Sibling Contexts: Other residential DER monitoring datasets.
 */
export const homeEnergyLogSept2025Universe: Universe = {
    universeId: createTechnicalUniverseId('home_energy_monitoring', 'user_redacted_202509'),
    type: UniverseType.TECHNICAL_LOG,
    canonicalName: 'Home Energy Monitoring Log - September 2025',
    description:
        'A 15-minute interval data log from a residence with a two-array solar system in Denver, CO, highlighting the performance impact of partial shading.',

    temporalStructure: {
        segments: [
            {
                id: 'data_log_period',
                start: mdtToUtcBigInt('2025-09-01 23:30:00'),
                end: mdtToUtcBigInt('2025-09-10 14:30:00'),
                type: 'phase',
                status: 'active',
            },
        ] as Segment[],
        keyframes: [
            {
                id: 'initial_telemetry_failure',
                timestamp: mdtToUtcBigInt('2025-09-02 00:12:04'),
                significance: 0.7,
                tags: ['anomaly', 'telemetry_error', 'data_quality'],
                certainty: 1.0,
            },
            {
                id: 'peak_export_s02',
                timestamp: mdtToUtcBigInt('2025-09-02 11:15:00'),
                significance: 0.8,
                tags: ['peak_performance', 'solar_export', 'grid_injection'],
                certainty: 1.0,
            },
            {
                id: 'evening_import_spike_s03',
                timestamp: mdtToUtcBigInt('2025-09-03 19:15:00'),
                significance: 0.75,
                tags: ['peak_load', 'grid_import', 'on_peak_behavior'],
                certainty: 1.0,
            },
            {
                id: 'peak_export_s10',
                timestamp: mdtToUtcBigInt('2025-09-10 11:15:00'),
                significance: 0.85,
                tags: ['peak_performance', 'solar_export', 'load_shifting_opportunity'],
                certainty: 1.0,
            },
        ] as Keyframe[],
        windows: {
            strategy: 'time_based',
            // 15 minutes as a bigint, matching every other universe; the literal `900`
            // predates the field being typed and only survived the `as unknown as
            // Universe` cast below (james-gibson/local-time#153).
            avgWindowSize: 900n,
            description: 'Data is structured in 15-minute intervals as provided by the utility meter.',
        },
    },

    realityRelation: {
        type: RealityRelationType.DOCUMENTS,
        fictionalizationDegree: 0.0,
        realityAnchors: [
            {
                anchorId: 'user_provided_data',
                description: 'The universe is based entirely on interval data charts provided by the system owner.',
                evidence: ['Conversation thread containing user-uploaded charts for Sep 1-4 and Sep 10, 2025.'],
                confidence: 1.0,
            },
        ],
    },

    attribution: {
        // Rewritten in the current `Attribution` shape when this universe was registered
        // (james-gibson/local-time#153). It carried the retired flat fields —
        // `copyright_holders` / `copyright_year` / `copyright_status` — which nothing
        // reads, so `hasProvenance` was false and the corpus invariant in
        // `universe-builder-behaviour.test.ts` would not accept it. `status` is `active`
        // rather than the old `PRIVATE`: the `Attribution` union has no private member,
        // and the privacy intent is already carried by `usage_restrictions`.
        copyright: {
            holders: ['Anonymous User'],
            year: 2025,
            status: CopyrightStatus.ACTIVE,
        },
        citations_required: false,
        usage_restrictions: [
            UsageRestriction.INTERNAL_ANALYSIS_ONLY,
            UsageRestriction.NO_COMMERCIAL_USE,
            UsageRestriction.ANONYMIZATION_REQUIRED,
        ],
    },

    metadata: {
        location: 'Denver, Colorado, USA (approx.)',
        timeZone: 'America/Denver',
        utilityProvider: 'Unknown',
        dataGranularitySeconds: 900,
        touSchedule: {
            off_peak: 'Before 3:00 PM and after 7:00 PM weekdays, all weekend.',
            on_peak: '3:00 PM to 7:00 PM weekdays.',
            mid_peak: 'Not explicitly defined in user data, but appears between Off-peak and On-peak.',
        },
        solarSystem: {
            installDate: '2023-02-04',
            arrays: [
                {
                    id: 'east_array',
                    panelCount: 12,
                    orientation: 'East',
                    performanceNotes: 'Unshaded. Consistently high performer, especially in the morning. Serves as the performance baseline.',
                },
                {
                    id: 'west_array',
                    panelCount: 9,
                    orientation: 'West',
                    performanceNotes: 'Partially to fully shaded by trees in the afternoon. Consistently underperforms the east array by ~35%.',
                },
            ],
            knownIssues: ['Significant afternoon shading on the west-facing array, causing a ~3,006 kWh cumulative production loss to date.'],
        },
    } as HomeEnergyMetadata,
} as unknown as Universe;
