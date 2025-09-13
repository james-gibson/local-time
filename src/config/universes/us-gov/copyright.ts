import { UniverseBuilder,createHistoricalUniverseId,TimePrecision } from '../../../index';

/**
 * @universeName Major Changes in U.S. Copyright Law
 * @universeId history:us_copyright_law_changes:1790-present
 * @description This universe documents the historical evolution of copyright law in the United States,
 * capturing the major legislative acts that have shaped intellectual property rights from the nation's founding to the digital age.
 * The timeline is structured around key acts of Congress that expanded the scope, duration, and nature of copyright protection.
 */
export const usCopyrightLawChangesUniverse = new UniverseBuilder()
    .historical('Major Changes in U.S. Copyright Law', 1790)
    // The universe describes a series of real, documented legislative events.
    .withRealityRelation('documentary', 0.0)
    // The legislative acts are public records and part of the public domain.
    .withAttribution('public_domain', 1790, 'active')
    // U.S. Copyright Law is foundational to the creative and technological industries, making its history highly significant.
    .withCulturalSignificance(0.9)
    // --- Segments defining major eras of copyright legislation ---
    .addDateSegment('1790-05-31', '1909-03-03', 'foundational_era', 'legislation_active', undefined, undefined, 'The initial period of U.S. copyright, establishing basic protections for authors.')
    .addDateSegment('1909-03-04', '1976-10-18', 'modernization_era', 'legislation_active', undefined, undefined, 'A major overhaul to address new technologies and expand the scope of copyright.')
    .addDateSegment('1976-10-19', '1998-10-27', 'comprehensive_revision_era', 'legislation_active', undefined, undefined, 'The era of the 1976 Act, which fundamentally reshaped U.S. copyright to its modern form.')
    .addDateSegment('1998-10-28', '2025-09-10', 'digital_age_era', 'legislation_active', undefined, undefined, 'The current era, focused on adapting copyright law for the internet, digital media, and streaming.')

    // --- Keyframes for specific legislative acts ---

    // May 31, 1790: The first U.S. federal copyright law is enacted, granting authors of books, maps, and charts an initial term of 14 years, with the option to renew for another 14 years.【1】【2】
    .addDateKeyframe('1790-05-31', 'copyright_act_of_1790', 1.0, ['legislation', 'founding_law', 'term_limit'], TimePrecision.DAY)
    // March 4, 1909: The Copyright Act of 1909 is signed into law. It extends the renewal term to 28 years (for a total of 56 years) and expands protections to include all "writings of an author," a broader category.【3】
    .addDateKeyframe('1909-03-04', 'copyright_act_of_1909', 1.0, ['legislation', 'term_extension', 'scope_expansion', 'modernization'], TimePrecision.DAY)
    // October 19, 1976: The Copyright Act of 1976 is signed, making sweeping changes. It changes the copyright term to the life of the author plus 50 years, codifies the "fair use" doctrine, and extends federal protection to unpublished works.【4】【5】
    .addDateKeyframe('1976-10-19', 'copyright_act_of_1976', 1.0, ['legislation', 'life_plus_50', 'fair_use', 'comprehensive_revision'], TimePrecision.DAY)
    // October 27, 1998: The Sonny Bono Copyright Term Extension Act (CTEA) is signed, extending the copyright term to life of the author plus 70 years, and for works of corporate authorship to 120 years after creation or 95 years after publication, whichever is earlier.【6】【7】
    .addDateKeyframe('1998-10-27', 'copyright_term_extension_act', 0.9, ['legislation', 'term_extension', 'life_plus_70', 'sonny_bono_act'], TimePrecision.DAY)
    // October 28, 1998: The Digital Millennium Copyright Act (DMCA) is signed into law. It addresses copyright in the internet age, creating "safe harbor" provisions for online service providers and criminalizing the circumvention of anti-piracy measures.【8】【9】
    .addDateKeyframe('1998-10-28', 'digital_millennium_copyright_act', 1.0, ['legislation', 'internet', 'safe_harbor', 'dmca', 'anti-circumvention'], TimePrecision.DAY)
    // October 11, 2018: The Music Modernization Act (MMA) is signed. It modernizes music licensing laws to address issues with streaming services, creating a blanket license for digital services and ensuring royalties for pre-1972 sound recordings.【10】【11】
    .addDateKeyframe('2018-10-11', 'music_modernization_act', 0.85, ['legislation', 'music', 'streaming', 'licensing', 'royalties'], TimePrecision.DAY)
    .build();

/**
 * ## Usage Example
 *
 * This example demonstrates how to register and access the universe for U.S. Copyright Law changes.
 *
 * ```typescript

 * import { UniverseRegistry } from &#x27;./core/universe-registry&#x27;;
 * import { usCopyrightLawChangesUniverse } from &#x27;./universes/historical/us-copyright-law-changes&#x27;;
 *

 * // Assuming a UniverseRegistry instance is available
 * const registry = new UniverseRegistry();
 * registry.registerUniverse(usCopyrightLawChangesUniverse.universeId, usCopyrightLawChangesUniverse);
 *

 * // Retrieve the universe from the registry
 * const universe = registry.getUniverse(&#x27;history:us_copyright_law_changes:1790-present&#x27;);
 *

 * console.log(universe?.metadata.title); // Output: Major Changes in U.S. Copyright Law
 *

 * // Find the keyframe for the DMCA
 * const dmcaKeyframe = universe?.temporal.keyframes[&#x27;1998-10-28:digital_millennium_copyright_act&#x27;];
 * console.log(dmcaKeyframe?.tags); // Output: [&#x27;legislation&#x27;, &#x27;internet&#x27;, &#x27;safe_harbor&#x27;, &#x27;dmca&#x27;, &#x27;anti-circumvention&#x27;]
 * ```
 */
