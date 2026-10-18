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
    /**
     * The scrubbing record — how the usage terms were applied to this data.
     *
     * The scrubbing rules are the privacy contract the corpus is generated under
     * (`src/config/mcp-prompts/personal-prompt.ts`): personal information is removed from
     * personal data unless it is explicitly public, and living individuals are not named in
     * it. The removal is the *application* of the usage term in
     * `attribution.usage_restrictions` to the data — it is not a statement about the
     * holder. The holder is named; the data is anonymised.
     *
     * Which fields were removed is deliberately not enumerated: enumerating them would be
     * the disclosure the scrub exists to prevent, so this records the decision and its
     * authority, not a reconstruction of the raw capture.
     */
    scrubbing: {
        /** Always true for this universe: what is published here is not the raw capture. */
        applied: boolean;
        /** The usage term this discharges, so the record and the terms cannot drift apart. */
        enforcedBy: string;
        /** What the scrub acts on — the data, never the attribution. */
        appliesTo: 'data';
        note: string;
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
 * Ownership and publication: this is one of the system owner's private notes, published as an
 * exemplar, and it is attributed to the person who holds it. The lab universe
 * (`personal:lab:2026`) carries the reference back to it; containment is deliberately not
 * declared, because it is a referenced artefact of the owner rather than a member of the lab.
 *
 * Scrubbing: the dataset is anonymised; the work is not. Personal information was removed from
 * the log as the usage terms were applied, which is the privacy rule the corpus is generated
 * under — personal data loses its personal information unless it is explicitly public. So the
 * attribution names a holder while the data names nobody: what is removed is the personal
 * information *in the data*, not the identity of the author. Recorded on the universe itself in
 * `metadata.scrubbing` and anchored in the universe's sole `realityAnchor` evidence. What was
 * removed is not enumerated here on purpose — enumerating it would be the disclosure the scrub
 * exists to prevent.
 *
 * Research Sources:
 * - User-provided interval data charts from a utility or monitoring portal, submitted over the course of the conversation.
 * - Contextual information provided by the user regarding solar array orientation, shading, and installation date.
 * - Timestamps and values transcribed directly from the provided charts.
 *
 * Hierarchical Context: This technical log exists within the context of broader energy systems.
 * Natural Connections Discovered:
 * - Sibling Contexts: Other residential DER monitoring datasets.
 * - The parents this header used to name (`ENERGY_GRID_TECHNOLOGY`, `RENEWABLE_ENERGY`) are not
 *   `CommonUniverseIds` members at all, so they were never declared and could not have resolved.
 *   A dangling anchor is worse than an absent one (james-gibson/local-time#112 §11.5), so nothing
 *   is declared here; a real container should be created first if one is wanted.
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
        // Both anchors that used to sit here were authored in a shape `RealityAnchor` does
        // not declare — `{ anchorId, description }` instead of
        // `{ realEventId, relationshipType }` — so nothing read either of them, and the
        // `as unknown as Universe` cast below is what let that survive (the same failure as
        // the attribution fields above). Collapsed into one anchor in the declared shape:
        // the provenance is one claim, and the scrubbing is recorded where it can be read,
        // in `metadata.scrubbing`.
        realityAnchors: [
            {
                realEventId: 'home_energy_monitoring:user_redacted_202509:2026',
                relationshipType: 'documents',
                confidence: 1.0,
                evidence: [
                    'Interval data charts from a utility or monitoring portal, Sep 1-4 and Sep 10, 2025.',
                    'The published form is the scrubbed derivative of that capture: personal information is removed as the usage terms are applied — see `metadata.scrubbing`, which names the term it discharges.',
                ],
            },
        ],
    },

    attribution: {
        // Rewritten in the current `Attribution` shape when this universe was registered
        // (james-gibson/local-time#153). It carried the retired flat fields —
        // `copyright_holders` / `copyright_year` / `copyright_status` — which nothing
        // reads, so `hasProvenance` was false and the corpus invariant in
        // `universe-builder-behaviour.test.ts` would not accept it.
        //
        // The holder is the person, not `Anonymous User`. That placeholder read the
        // privacy rule backwards: the rule anonymises the *data* (personal information is
        // removed as the usage terms are applied — see `metadata.scrubbing`), and says
        // nothing about the holder being unknown. `status` is `active` rather than the old
        // `PRIVATE`, which the `Attribution` union cannot express and which the usage
        // restriction already carries.
        copyright: {
            holders: ['James Gibson'],
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
        scrubbing: {
            applied: true,
            enforcedBy: UsageRestriction.ANONYMIZATION_REQUIRED,
            appliesTo: 'data',
            note:
                'Personal information was removed from the interval log before publication — that removal is how the usage terms in `attribution.usage_restrictions` are applied to this data. The scrub acts on the data, not on the attribution: the work is not anonymous, the dataset is.',
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
