import { UniverseBuilder } from '../../../index';
// Assuming the core types are in a file like this.
// If the path is different, please adjust the import.
// import { TimePrecision, UniverseType, RealityRelationType } from './core/types';

/**
 * Universe definition for the 'Toy Story 2' data recovery mission of 1998.
 *
 * This universe chronicles the near-catastrophic accidental deletion of roughly 90%
 * of the 'Toy Story 2' film assets from Pixar's servers. The timeline is structured
 * as a zero-reference mission, with H=0 marking the moment the deletion command
 * was executed. The subsequent phases and keyframes map the discovery of the error,
 * the failure of the primary backups, and the heroic recovery from a personal
 * home backup maintained by supervising technical director Galyn Susman. This event
 * has become a legendary cautionary tale in the tech and animation industries.
 *
 * Source: Widely reported industry event, often recounted by Pixar employees.
 * One notable account is from Oren Jacob, former CTO of Pixar.
 */
export const toyStory2RecoveryMissionUniverse = new UniverseBuilder()
    .mission('pixar', 'toy_story_2_recovery', 1998)
    .withZeroReferenceEpoch({
        // Estimated date of the incident, which occurred about a year before the film's release.
        zeroPoint: '1998-11-18T17:00:00.000Z', // Approx. 9:00 AM PST
        zeroEvent: "Accidental execution of 'rm -rf *' on the Toy Story 2 asset database.",
        beforePrefix: 'H-',
        afterPrefix: 'H+',
        relativeFormat: 'HMS',
        precision: 'MINUTE',
    })
    .withRealityRelation('documentary', 0.0,)
    .withCopyright(['Pixar Animation Studios'], 1998, 'internal_event')
    .withCreators({
        // Key personnel involved in the recovery.
        participant: ['Oren Jacob', 'Galyn Susman', 'Larry Cutler', 'Tom Porter'],
    })
    .withCulturalSignificance(
        0.85,
        'A legendary event in tech and animation history, serving as a critical lesson on backup strategy and human ingenuity.'
    )
    // H+00:00:00 - The Deletion
    .addRuntimeKeyframe(0, 0, 'deletion_command_executed', 1.0, ['mission_start', 'catastrophe', 'inciting_incident'])
    // H+00:30:00 - Discovery
    .addRuntimeKeyframe(0, 30, 'asset_disappearance_noticed', 0.9, ['discovery', 'problem_identification'])
    // H+02:00:00 - System Shutdown
    .addRuntimeKeyframe(120, 0, 'servers_unplugged', 0.8, ['containment', 'damage_control'])
    // H+03:30:00 - The Backup Failure
    .addRuntimeKeyframe(210, 0, 'backup_failure_confirmed', 0.95, ['crisis', 'turning_point', 'despair'])
    // H+04:30:00 - The Hope
    .addRuntimeKeyframe(270, 0, 'susman_home_backup_confirmed', 1.0, ['hope', 'solution_identified', 'turning_point'])
    // H+08:00:00 - Recovery Begins
    .addRuntimeKeyframe(480, 0, 'home_backup_retrieved', 0.9, ['recovery_phase', 'action'])
    // H+10:00:00 - Restore Process
    .addRuntimeKeyframe(600, 0, 'data_restore_begins', 0.85, ['recovery_phase', 'restoration'])
    // H+60:00:00 - Verification (Approx. 2.5 days later)
    .addRuntimeKeyframe(3600, 0, 'full_restore_verified', 1.0, ['mission_success', 'resolution', 'validation'])
    .build();

// --- Usage Example ---

/*
import { UniverseRegistry } from './core/universe-registry';
import { toyStory2RecoveryMissionUniverse } from './toy-story-recovery-universe';

// Example of how this universe might be registered and used.
const registry = new UniverseRegistry();

registry.registerUniverse(toyStory2RecoveryMissionUniverse.universeId, toyStory2RecoveryMissionUniverse);

console.log('Registered Mission:', registry.getUniverse(toyStory2RecoveryMissionUniverse.universeId)?.universeId.toString());

// You can now query the registry for specific moments in the crisis.
const momentOfHope = registry.getTemporalPointer('pixar:toy_story_2_recovery:1998:mission:H+04h30m00s');
console.log('Found key moment:', momentOfHope?.keyframe?.id); // Outputs: 'susman_home_backup_confirmed'
*/
