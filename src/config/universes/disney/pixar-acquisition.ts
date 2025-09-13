import { UniverseBuilder, TimePrecision } from '../../../index';


/**
 * Universe definition for the acquisition of Pixar by The Walt Disney Company in 2006.
 *
 * This historical universe documents the timeline of one of the most significant
 * business transactions in modern entertainment history. The acquisition was valued
 * at approximately $7.4 billion and resulted in Pixar's creative leadership
 * taking over Walt Disney Animation Studios, sparking a new era of success known
 * as the Disney Revival. The timeline is based on publicly available financial
 * and news records.
 *
 * - Source: The Walt Disney Company SEC Filings, news reports.【1】【2】
 */
export const disneyPixarAcquisition2006Universe = new UniverseBuilder()
    .historical('disney', 'pixar_acquisition', 2006)
    .withDateEpoch('2006-01-01', '2006-12-31', 'Acquisition Year', TimePrecision.DAY)
    .withRealityRelation('documentary', 0.0)
    .withAttribution('public_domain', 'Publicly announced business transaction.')
    .withCreators({
        // Key figures leading the respective companies during the acquisition.
        participant: ['Bob Iger (Disney CEO)', 'Steve Jobs (Pixar CEO)'],
    })
    .withCulturalSignificance(
        0.9,
        'A landmark acquisition that reshaped the animation industry, revitalized Walt Disney Animation, and solidified Pixar\'s creative influence.'
    )
    // Keyframe for the official public announcement of the deal.
    .addDateKeyframe('2006-01-24', 'acquisition_announced', 1.0, [
        'announcement',
        'business',
        'merger',
        'financial',
    ])
    // Keyframe for the official completion of the acquisition after shareholder approval.
    .addDateKeyframe('2006-05-05', 'acquisition_completed', 1.0, [
        'completion',
        'business',
        'integration',
        'finalization',
    ])
    // Segment representing the period between announcement and closing, when regulatory
    // and shareholder approvals were sought.
    .addDateSegment(
        '2006-01-24',
        '2006-05-04',
        'regulatory_approval',
        'phase'
    )
    // Segment representing the beginning of the integration of Pixar into Disney's corporate structure.
    .addDateSegment(
        '2006-05-05',
        '2006-12-31',
        'integration_period',
        'phase'
    )
    .build();

// --- Usage Example ---

/*
import { UniverseRegistry } from './core/universe-registry';
import { disneyPixarAcquisition2006Universe } from './disney-pixar-acquisition-universe';

// Example of how this universe might be registered and used.
const registry = new UniverseRegistry();

registry.registerUniverse(disneyPixarAcquisition2006Universe.universeId, disneyPixarAcquisition2006Universe);

console.log('Registered Historical Event:', registry.getUniverse(disneyPixarAcquisition2006Universe.universeId)?.universeId.toString());

// You can now query the registry for specific dates in the acquisition timeline.
const announcementDay = registry.getTemporalPointer('history:disney:pixar_acquisition:2006:date:2006-01-24');
console.log('Found key moment:', announcementDay?.keyframe?.id); // Outputs: 'acquisition_announced'
*/
