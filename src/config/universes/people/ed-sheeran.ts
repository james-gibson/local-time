import { UniverseBuilder,createHistoricalUniverseId,TimePrecision } from '../../../index';

/**
 * @universeName Ed Sheeran "Thinking Out Loud" Copyright Trial
 * @universeId history:ed_sheeran_copyright_trial:2023
 * @description This universe documents the key events of the 2023 copyright infringement trial where musician Ed Sheeran was accused of copying Marvin Gaye's "Let's Get It On" for his hit song "Thinking Out Loud".
 * The trial is notable for the moment Sheeran played his guitar and sang on the witness stand to demonstrate his songwriting process to the jury.
 * The event has a high cultural significance due to its high-profile nature and its implications for music copyright law.
 */
export const edSheeranCopyrightTrial2023Universe = new UniverseBuilder()
    .historical("Ed Sheeran 'Thinking Out Loud' Copyright Trial", 2023, 2023)
    // The universe describes a real, documented legal proceeding.
    .withRealityRelation('documentary', 0.0)
    // The facts of the court case are public record.
    .withAttribution('public_domain', 2023, 'active')
    // The trial was a major news story in the entertainment and legal worlds, sparking widespread discussion on creative ownership and musical influence.
    .withCulturalSignificance(0.7)
    // --- Segments defining the trial period ---
    .addDateSegment('2023-04-25', '2023-05-04', 'jury_trial', 'legal_period', undefined, undefined, 'The period during which testimony was presented to the jury, concluding with the verdict.')

    // --- Keyframes for specific historical events ---

    // On April 27, 2023, Ed Sheeran took the witness stand with his guitar to explain and demonstrate the chord progression and creation of "Thinking Out Loud".【1】【2】
    .addDateKeyframe('2023-04-27', 'sheeran_guitar_testimony', 1.0, ['testimony', 'live_performance', 'courtroom', 'evidence'], TimePrecision.DAY)
    // On May 4, 2023, the jury in the Manhattan federal court reached a verdict, finding that Ed Sheeran had not infringed on the copyright of Marvin Gaye's song.【3】【4】
    .addDateKeyframe('2023-05-04', 'verdict_delivered', 0.95, ['verdict', 'legal_outcome', 'acquittal'], TimePrecision.DAY)
    .build();

/**
 * ## Usage Example
 *
 * This example demonstrates how to register and access the universe for Ed Sheeran's 2023 copyright trial.
 *
 * ```typescript

 * import { UniverseRegistry } from &#x27;./core/universe-registry&#x27;;
 * import { edSheeranCopyrightTrial2023Universe } from &#x27;./universes/historical/ed-sheeran-copyright-trial-2023&#x27;;
 *

 * // Assuming a UniverseRegistry instance is available
 * const registry = new UniverseRegistry();
 * registry.registerUniverse(edSheeranCopyrightTrial2023Universe.universeId, edSheeranCopyrightTrial2023Universe);
 *

 * // Retrieve the universe from the registry
 * const universe = registry.getUniverse(&#x27;history:ed_sheeran_copyright_trial:2023&#x27;);
 *

 * console.log(universe?.metadata.title); // Output: Ed Sheeran &#x27;Thinking Out Loud&#x27; Copyright Trial
 *

 * // Find the keyframe for Sheeran&#x27;s testimony
 * const testimonyKeyframe = universe?.temporal.keyframes[&#x27;2023-04-27:sheeran_guitar_testimony&#x27;];
 * console.log(testimonyKeyframe?.significance); // Output: 1.0
 * ```
 */
