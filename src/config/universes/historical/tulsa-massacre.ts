import {UniverseBuilder, createHistoricalUniverseId, TimePrecision, HistoricalUniverseId} from '../../../index';
import {createHistoricalEventOwnerId} from '../../../core/universe-ids';

/**
 * @universe history:tulsa_race_massacre:1921
 * @description This universe provides a detailed temporal account of the Tulsa Race Massacre, which occurred between May 31 and June 1, 1921. During this event, a white mob attacked residents, homes, and businesses in the prosperous, predominantly African American Greenwood District of Tulsa, Oklahoma, known as "Black Wall Street." The event stands as one of the most severe incidents of racial violence in U.S. history.
 * @temporal-strategy The universe is structured around a single, high-resolution epoch spanning the 48 hours of the massacre. Key moments, from the inciting incident to the imposition of martial law, are captured as keyframes with hour-level precision to illustrate the rapid escalation of violence.
 * @reality-relation Documentary, based on historical records, survivor testimonies, and the 2001 Oklahoma Commission report. Fictionalization degree is 0.0.
 * @significance This event holds the highest cultural and historical significance (1.0) due to the scale of the destruction, the profound loss of life and generational wealth, and the decades-long, deliberate suppression of its history.
 */
export const tulsaRaceMassacre1921Universe = new UniverseBuilder()
    .historical(createHistoricalUniverseId("tulsa_race_massacre","*"),"1921")
    .withDescription('A temporal documentation of the 1921 Tulsa Race Massacre and the destruction of the Greenwood District.')
    .withRealityRelation('documentary', 0.0)
    // Source: Based on historical records, including the final report of the "Oklahoma Commission to Study the Tulsa Race Riot of 1921" (published in 2001).
    .withCopyright(['Public Domain'], 1921, 'public_domain')
    .withCulturalSignificance(1.0)
    .withTags(['racial_violence', 'massacre', 'us_history', 'oklahoma', 'greenwood', 'black_wall_street', 'civil_rights'])

    // --- The Massacre Epoch ---
    // This single epoch covers the entire span of the event, from the initial incident to the end of the widespread violence.
    .addEpoch('1921-05-31T09:00:00Z', '1921-06-01T23:59:59Z', 'tulsa_massacre', 1.0, ['massacre', 'racial_violence'], {
        description: 'The primary epoch covering the events of the Tulsa Race Massacre, from the inciting incident at the Drexel Building to the declaration of martial law and the destruction of the Greenwood District.',
        // Timezone Note: All times are approximate and reflect local time (CST). UTC is used for standardization.
    })

    // --- Keyframes: The Escalation and Attack ---
    .addKeyframe('1921-05-31T15:00:00Z', 'inciting_incident', 0.9, ['trigger_event'], {
        epochId: 'tulsa_massacre',
        description: 'Dick Rowland, a 19-year-old Black shoe shiner, is arrested and taken into custody following an incident with Sarah Page, a 17-year-old white elevator operator, in the Drexel Building. Inflammatory and false reports in the Tulsa Tribune incite public anger.',
        precision: TimePrecision.HOUR,
    })
    .addKeyframe('1921-05-31T21:00:00Z', 'courthouse_standoff', 0.95, ['confrontation', 'escalation'], {
        epochId: 'tulsa_massacre',
        description: 'A large, armed white mob gathers outside the Tulsa County Courthouse, demanding Rowland be handed over. A group of armed Black men, many of them WWI veterans, arrives to offer protection, leading to a tense standoff.',
        precision: TimePrecision.HOUR,
    })
    .addKeyframe('1921-05-31T22:00:00Z', 'first_shots', 1.0, ['violence_begins'], {
        epochId: 'tulsa_massacre',
        description: 'Shots are fired outside the courthouse after a white man attempts to disarm a Black veteran. This exchange of gunfire marks the beginning of the massacre as the vastly outnumbered Black group retreats to Greenwood.',
        precision: TimePrecision.HOUR,
    })
    .addKeyframe('1921-06-01T01:00:00Z', 'invasion_of_greenwood', 1.0, ['invasion', 'arson'], {
        epochId: 'tulsa_massacre',
        description: 'Throughout the night, white mobs, deputized and armed by city officials, begin a full-scale invasion of the Greenwood District, looting homes and businesses and shooting Black residents on sight.',
        precision: TimePrecision.HOUR,
    })
    .addKeyframe('1921-06-01T05:00:00Z', 'aerial_attack', 1.0, ['aerial_attack', 'arson'], {
        epochId: 'tulsa_massacre',
        description: 'As dawn breaks, private aircraft are reportedly used to drop incendiary devices (such as turpentine balls) onto Greenwood buildings, accelerating the district\'s destruction by fire.',
        precision: TimePrecision.HOUR,
    })
    .addKeyframe('1921-06-01T09:15:00Z', 'martial_law', 0.9, ['government_response', 'internment'], {
        epochId: 'tulsa_massacre',
        description: 'Oklahoma Governor James B. A. Robertson declares martial law. National Guard troops arrive, but instead of stopping the mob, they begin rounding up and interning thousands of Black residents in makeshift camps.',
        precision: TimePrecision.MINUTE,
    })
    .addKeyframe('1921-06-01T12:00:00Z', 'destruction_complete', 1.0, ['destruction', 'aftermath'], {
        epochId: 'tulsa_massacre',
        description: 'By midday, the Greenwood District, a thriving community of over 35 square blocks, is completely destroyed, reduced to smoldering ruins. The massacre results in hundreds of deaths and leaves over 10,000 residents homeless.',
        precision: TimePrecision.HOUR,
    })
    .build();


/**
 * @universe history:tulsa_massacre_media_coverage:1921-06
 * @description This universe documents the media landscape in June 1921 concerning the Tulsa Race Massacre. It focuses on how local newspapers in Tulsa actively fueled the violence and then, along with national outlets, initiated a decades-long period of silence and suppression. The universe highlights the near-total absence of immediate international coverage, showing that the news did not spread globally but was instead deliberately buried.
 * @temporal-strategy The primary epoch covers June 1921, capturing the immediate media aftermath. Keyframes identify the initial inflammatory reporting, the subsequent news blackout, and the limited, often biased, coverage that did appear. A final, out-of-epoch keyframe is included to represent the eventual, much later, international recognition of the event.
 * @reality-relation Documentary, based on media analysis and historical records of newspaper archives. Fictionalization degree is 0.0.
 * @significance The deliberate suppression of the Tulsa Race Massacre by the media is a significant historical event in itself (0.98), demonstrating the power of the press to shape, and erase, historical memory.
 */
export const tulsaMassacreMediaCoverageUniverse = new UniverseBuilder()
    .historical(createHistoricalUniverseId("tulsa_race_massacre_media_coverage","*"),"1921")
    .withDescription('A documentation of the immediate media response to the Tulsa Race Massacre, focusing on the initial incitement, subsequent suppression, and lack of international dissemination.')
    .withRealityRelation('documentary', 0.0)
    // Source: Analysis based on the Library of Congress newspaper archives and the 2001 Oklahoma Commission report, which studied media complicity.【1】
    .withCopyright(['Public Domain'], 1921, 'public_domain')
    .withCulturalSignificance(0.98)
    .withTags(['media_history', 'journalism', 'censorship', 'tulsa_race_massacre', 'historical_memory', 'us_history'])

    // --- Epoch: The Month of Silence (June 1921) ---
    // This epoch represents the immediate aftermath and the beginning of the news suppression.
    .addEpoch('1921-06-01', '1921-06-30', 'june_1921_aftermath', 1.0, ['news_suppression', 'aftermath'], {
        description: 'The month immediately following the Tulsa Race Massacre, characterized by a local and national effort to suppress the story, downplay the severity of the violence, and control the narrative, leading to a near-complete absence of international coverage.',
    })

    // --- Keyframes: The Narrative Control ---
    .addKeyframe('1921-05-31', 'media_incitement', 1.0, ['incitement', 'yellow_journalism'], {
        // Note: This keyframe is technically the day before the epoch but is the direct cause of the events within it.
        description: 'The Tulsa Tribune publishes an inflammatory front-page article titled "Nab Negro for Attacking Girl in Elevator," which is widely credited with inciting the white mob that gathered at the courthouse. This edition was later systematically destroyed.【1】',
    })
    .addKeyframe('1921-06-01', 'initial_biased_reporting', 0.95, ['biased_reporting', 'local_media'], {
        epochId: 'june_1921_aftermath',
        description: 'The first newspaper reports emerge in Tulsa. The Tulsa World describes the event as a "Negro Uprising," placing blame on the Black community. This narrative is picked up by some wire services and distributed nationally.【2】',
    })
    .addKeyframe('1921-06-03', 'news_blackout_begins', 1.0, ['censorship', 'suppression'], {
        epochId: 'june_1921_aftermath',
        description: 'Tulsa\'s white leadership, including law enforcement and city officials, begins a deliberate campaign to suppress the story. Police and local editors refuse to discuss the event with outside reporters, and official records are destroyed. This marks the start of a decades-long "conspiracy of silence."【3】',
    })
    .addKeyframe('1921-06-10', 'limited_national_coverage', 0.7, ['national_news', 'downplaying'], {
        epochId: 'june_1921_aftermath',
        // TypeScript comment for user decision:
        // The exact reach and tone of every national article is a subject of ongoing research.
        // This keyframe represents the general trend of limited and often distorted coverage that appeared in the U.S.
        description: 'Fragmented and often inaccurate reports appear in some national U.S. newspapers, such as The New York Times. The coverage is minimal, often buried in back pages, and typically frames the event as a "riot" rather than a massacre, significantly downplaying the scale of destruction and death toll.',
    })
    .addKeyframe('1921-06-30', 'international_silence', 0.98, ['no_coverage', 'global_unawareness'], {
        epochId: 'june_1921_aftermath',
        description: 'By the end of June 1921, there is no evidence of significant, widespread international media coverage of the Tulsa Race Massacre. The local and national suppression was effective in preventing the story from reaching a global audience.',
    })

    // --- Keyframe: The Eventual Spread ---
    // This keyframe is placed far outside the primary epoch to illustrate the long delay in the story's dissemination.
    .addKeyframe('2001-02-28', 'oklahoma_commission_report', 1.0, ['rediscovery', 'international_recognition'], {
        description: 'The Oklahoma Commission to Study the Tulsa Race Riot of 1921 publishes its final report. This official acknowledgment, coupled with academic work and survivor testimonies, finally breaks the silence and leads to widespread national and international media coverage, nearly 80 years after the event.【4】',
    })
    .build();

// --- Usage Example ---
/*
import { tulsaRaceMassacre1921Universe } from './tulsa-race-massacre-1921';
import { UniverseRegistry } from './core/universe-registry';

// Create a new registry instance
const registry = new UniverseRegistry();

// Register the generated universe
registry.registerUniverse(tulsaRaceMassacre1921Universe);

// You can now query the registry for events within this universe
const keyframe = registry.findKeyframeById(tulsaRaceMassacre1921Universe.universeId, 'first_shots');
console.log(`The violence began at approximately: ${keyframe?.timestamp}`);
console.log(keyframe?.metadata.description);

const massacreEpoch = registry.getEpochById(tulsaRaceMassacre1921Universe.universeId, 'tulsa_massacre');
console.log(massacreEpoch?.description);
*/
