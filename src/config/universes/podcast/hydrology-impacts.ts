import { UniverseBuilder } from '../../../index';
import { Universe, ConnectionRelationship } from '../../../core/types';
import { damImpactTimelineUniverse } from '../us-gov/hydrological'; // Assuming sibling file
import { CommonUniverseIds } from '../../../core/common-universe-ids';

/**
 * "The Dammed River: Progress, Problems, and Price Tags" Podcast Episode
 *
 * This universe represents a 28-minute podcast episode based on the provided production outline. The episode
 * serves as an audio documentary, narrating the historical timeline of large-scale dam construction and the
 * subsequent recognition of their ecological and economic consequences, as detailed in the
 * `damImpactTimelineUniverse`.
 *
 * The episode is structured into three acts, mirroring the historical phases: the initial era of ambitious
 * construction, the period of growing environmental awareness, and the modern era of economic reassessment.
 *
 * Cultural Significance: 0.75 - A well-researched and accessible piece of audio journalism that synthesizes
 * complex environmental and economic history for a broad audience, making an important topic engaging.
 *
 * Reality Relation: depicts with 0.05 fictionalization. The content is factual and documentary, but the
 * presentation (narration, music, editing) constitutes a minor degree of creative work. It directly
 * depicts the events and facts anchored in the `damImpactTimelineUniverse`.
 *
 * Research Sources:
 * - This episode's factual content is derived from the sources cited in the `damImpactTimelineUniverse`,
 *   including reports from the U.S. Bureau of Reclamation, EPA, World Commission on Dams, and American Rivers.
 *
 * Natural Connections Discovered:
 * - Primary Connection: This universe directly DOCUMENTS the `damImpactTimelineUniverse`.
 * - Parent Context: As a piece of media discussing US history and policy, it exists within the context of
 *   CommonUniverseIds.US_HISTORY and CommonUniverseIds.US_GOVERNMENT.
 */
export const damPodcastEpisodeUniverse: Universe = new UniverseBuilder()
    .media('podcast', 'The Dammed River', 2025)
    .withEpisodeInfo('Progress, Problems, and Price Tags', 1, 1)
    .withRuntime(28)
    .withDescription(
        'An audio documentary exploring the history of large dams, from symbols of progress to subjects of ecological and economic scrutiny.'
    )
    .withRealityRelation(
        'depicts',
        0.05,
        [
            {
                id: 'anchor_reclamation_act',
                description: 'The episode discusses the U.S. Reclamation Act of 1902 as the start of the large-dam era.',
                confidence: 1.0,
                evidence: ['Narration in Act 1 references the Act and its purpose.'],
            },
            {
                id: 'anchor_salmon_impact',
                description: 'The episode details the negative impact of dams on Pacific Northwest salmon populations, a central theme of Act 2.',
                confidence: 1.0,
                evidence: ['Segment discussing declining fish stocks and the economic impact on fisheries.'],
            },
            {
                id: 'anchor_dam_removal',
                description: 'The episode features the Edwards Dam removal as a case study for the modern era of economic and ecological reassessment.',
                confidence: 1.0,
                evidence: ['Narration in Act 3 focuses on the 1999 Edwards Dam breaching.'],
            },
        ],
        'The podcast presents verified historical events, with minor fictionalization from narrative structure, music, and sound design.'
    )
    .withCopyright(['Local Time Productions'], 2025, 'active')
    .withCreators({
        host: ['Alex Rivera'],
        producer: ['Jasmine Chen'],
        researcher: ['Ben Carter'],
    })
    .withCulturalSignificance(
        0.75,
        'A well-researched and accessible piece of audio journalism that synthesizes complex environmental and economic history for a broad audience.'
    )
    .addConnection({
        targetUniverseId: damImpactTimelineUniverse.universeId,
        relationship: 'documents',
        description:
            'This podcast episode directly documents and narrates the historical events, phases, and key moments outlined in the damImpactTimelineUniverse.',
        confidence: 1.0,
    })
    // --- Temporal Structure based on 28-minute runtime ---
    // Intro (0:00 - 3:00)
    .addRuntimeKeyframe(0, 30, 'intro_hook', 0.8, ['hook', 'thematic_intro'])
    // Act 1: The Age of Concrete Ambition (3:00 - 10:00)
    .addRuntimeKeyframe(4, 0, 'act1_reclamation_act', 0.9, ['history', 'legislation', 'us_west'])
    .addRuntimeKeyframe(7, 15, 'act1_tva_and_new_deal', 0.85, ['public_works', 'economic_stimulus'])
    // Act 2: Cracks in the Concrete (10:00 - 18:00)
    .addRuntimeKeyframe(11, 0, 'act2_salmon_decline', 1.0, ['ecology', 'economic_impact', 'fisheries', 'defining_conflict'])
    .addRuntimeKeyframe(16, 30, 'act2_nepa_and_esa', 0.95, ['environmental_law', 'policy_shift', 'conservation'])
    // Act 3: The Reckoning and Reassessment (18:00 - 25:00)
    .addRuntimeKeyframe(19, 0, 'act3_wcd_report', 0.9, ['global_policy', 'research', 'turning_point'])
    .addRuntimeKeyframe(22, 0, 'act3_edwards_dam_removal', 1.0, ['dam_removal', 'case_study', 'river_restoration'])
    // Outro (25:00 - 28:00)
    .addRuntimeKeyframe(27, 0, 'outro_summary', 0.8, ['summary', 'conclusion', 'legacy'])
    .build();
