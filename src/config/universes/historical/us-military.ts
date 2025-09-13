import { UniverseBuilder, createHistoricalUniverseId, TimePrecision } from '../../../index';
import {createHistoricalEventOwnerId} from '../../../core/universe-ids';

/**
 * @universe history:us_gov_military_operations:1870-1989
 * @description This universe documents major and minor public military operations undertaken by the United States Armed Forces from 1870 through November 9, 1989. It captures a period of significant global change, including the end of the American Indian Wars, two World Wars, the Cold War, and numerous interventions worldwide. The timeline concludes with the symbolic end of the Cold War era, the fall of the Berlin Wall.
 * @temporal-strategy This universe uses a date-based windowing strategy. Major, multi-year conflicts are defined as epochs, while shorter-term interventions and significant events are marked as keyframes.
 * @reality-relation Documentary, based on public historical records. Fictionalization degree is 0.0.
 * @significance This collection of events holds extremely high cultural and historical significance (0.95), shaping global politics, international relations, and American identity over more than a century.
 */
export const usMilitaryOperationsUniverse = new UniverseBuilder()
    .historical("history:us_gov:timeline","1981")
    .withDescription('A temporal documentation of public U.S. military operations from 1870 to the fall of the Berlin Wall.')
    .withRealityRelation('documentary', 0.0)
    // Source: Based on public records, primarily from the Congressional Research Service report RL30172 and historical timelines.【1】
    .withCopyright(['Public Domain'], 1870, 'public_domain')
    .withCulturalSignificance(0.95)
    .withTags(['military_history', 'us_history', 'foreign_policy', 'cold_war'])

    // --- Late 19th Century ---
    .addKeyframe('1871-06-10', 'korea_expedition_1871', 0.5, ['intervention', 'korea'], {
        description: 'A U.S. naval force attacks and captures five Korean forts in a punitive expedition to force trade negotiations.',
    })
    .addKeyframe('1876-06-25', 'great_sioux_war_1876', 0.7, ['indian_wars', 'domestic'], {
        description: 'The Great Sioux War, including the Battle of the Little Bighorn, representing a major conflict in the American Indian Wars.',
    })
    .addKeyframe('1885-03-31', 'panama_intervention_1885', 0.4, ['intervention', 'panama'], {
        description: 'U.S. forces land in Colón and Panama City to protect American interests and reestablish freedom of transit during a revolutionary period.',
    })
    .addKeyframe('1890-12-29', 'wounded_knee_massacre_1890', 0.8, ['indian_wars', 'domestic', 'massacre'], {
        description: 'The Wounded Knee Massacre occurs, marking the end of the major American Indian Wars.',
    })
    .addKeyframe('1898-04-25', 'spanish_american_war_start', 0.85, ['war', 'cuba', 'philippines'], {
        description: 'The United States declares war on Spain, leading to conflicts in Cuba and the Philippines and marking the U.S. emergence as a global power.',
    })
    .addKeyframe('1899-02-04', 'philippine_american_war_start', 0.8, ['war', 'philippines', 'insurgency'], {
        description: 'The Philippine-American War begins as Filipino nationalists resist American occupation following the Spanish-American War.',
    })

    // --- Early 20th Century & World War I ---
    .addKeyframe('1900-05-24', 'boxer_rebellion_intervention', 0.7, ['intervention', 'china'], {
        description: 'American troops participate in the Eight-Nation Alliance to protect foreign lives during the Boxer Rebellion in China.',
    })
    .addEpoch('1914-07-28', '1918-11-11', 'world_war_i', 0.98, ['world_war', 'europe'], {
        description: 'Epoch covering World War I. The U.S. officially entered the conflict in 1917.',
    })
    .addKeyframe('1917-04-06', 'wwi_us_entry', 0.95, ['world_war', 'declaration_of_war'], {
        epochId: 'world_war_i',
        description: 'The United States declares war on Germany, officially entering World War I.',
    })
    .addKeyframe('1918-09-26', 'meuse_argonne_offensive', 0.9, ['world_war', 'battle', 'france'], {
        epochId: 'world_war_i',
        description: 'Start of the Meuse-Argonne Offensive, the largest and one of the deadliest operations in the history of the American Expeditionary Forces.',
    })

    // --- Interwar Period ---
    .addKeyframe('1927-03-21', 'nanking_incident_1927', 0.5, ['intervention', 'china'], {
        description: 'American and British naval forces shell Nanjing to protect foreign citizens during civil unrest.',
    })
    .addKeyframe('1932-07-28', 'bonus_army_dispersal', 0.6, ['domestic', 'protest'], {
        description: 'U.S. Army troops under Gen. Douglas MacArthur are deployed to clear the "Bonus Army" of WWI veterans from Washington, D.C.',
    })

    // --- World War II ---
    .addEpoch('1939-09-01', '1945-09-02', 'world_war_ii', 1.0, ['world_war', 'global_conflict'], {
        description: 'Epoch covering World War II, the deadliest conflict in human history. The U.S. entered after the attack on Pearl Harbor.',
    })
    .addKeyframe('1941-12-07', 'pearl_harbor_attack', 1.0, ['world_war', 'us_entry', 'hawaii'], {
        epochId: 'world_war_ii',
        description: 'The Imperial Japanese Navy attacks Pearl Harbor, leading to the United States\' formal entry into World War II.',
    })
    .addKeyframe('1944-06-06', 'd_day_normandy_landings', 1.0, ['world_war', 'invasion', 'france'], {
        epochId: 'world_war_ii',
        description: 'Allied forces, including a massive U.S. contingent, launch the D-Day landings in Normandy, beginning the liberation of Western Europe.',
    })
    .addKeyframe('1945-05-08', 've_day', 0.98, ['world_war', 'victory', 'europe'], {
        epochId: 'world_war_ii',
        description: 'Victory in Europe Day (V-E Day) marks the formal acceptance by the Allies of Nazi Germany\'s unconditional surrender.',
    })
    .addKeyframe('1945-08-06', 'atomic_bombing_hiroshima', 1.0, ['world_war', 'atomic_bomb', 'japan'], {
        epochId: 'world_war_ii',
        description: 'The United States drops an atomic bomb on Hiroshima, Japan.',
    })
    .addKeyframe('1945-09-02', 'vj_day', 0.98, ['world_war', 'victory', 'japan'], {
        epochId: 'world_war_ii',
        description: 'Victory over Japan Day (V-J Day) marks the surrender of Japan, officially ending World War II.',
    })

    // --- Cold War Era ---
    .addKeyframe('1948-06-24', 'berlin_airlift_start', 0.9, ['cold_war', 'humanitarian', 'germany'], {
        description: 'The United States and its allies begin the Berlin Airlift to supply West Berlin after a Soviet land blockade.',
    })
    .addEpoch('1950-06-25', '1953-07-27', 'korean_war', 0.95, ['cold_war', 'war', 'korea'], {
        description: 'Epoch for the Korean War, where U.S. forces intervened on behalf of South Korea under a UN mandate.',
    })
    .addKeyframe('1950-09-15', 'incheon_landing', 0.9, ['korean_war', 'battle', 'amphibious_assault'], {
        epochId: 'korean_war',
        description: 'U.S. forces lead a surprise amphibious assault at Incheon, a turning point in the Korean War.',
    })
    .addEpoch('1955-11-01', '1975-04-30', 'vietnam_war', 0.98, ['cold_war', 'war', 'vietnam'], {
        description: 'Epoch covering the Vietnam War, a long and divisive conflict in Southeast Asia.',
    })
    .addKeyframe('1964-08-07', 'gulf_of_tonkin_resolution', 0.95, ['vietnam_war', 'escalation'], {
        epochId: 'vietnam_war',
        description: 'The U.S. Congress passes the Gulf of Tonkin Resolution, granting broad military authority to President Johnson and leading to major escalation.',
    })
    .addKeyframe('1968-01-30', 'tet_offensive', 0.95, ['vietnam_war', 'battle'], {
        epochId: 'vietnam_war',
        description: 'North Vietnamese and Viet Cong forces launch the Tet Offensive, a major military campaign that became a psychological turning point in the war.',
    })
    .addKeyframe('1973-01-27', 'paris_peace_accords', 0.9, ['vietnam_war', 'peace_treaty'], {
        epochId: 'vietnam_war',
        description: 'The Paris Peace Accords are signed, intended to establish peace in Vietnam and end the war.',
    })
    .addKeyframe('1962-10-22', 'cuban_missile_crisis', 0.98, ['cold_war', 'nuclear_standoff', 'cuba'], {
        description: 'President Kennedy institutes a naval "quarantine" of Cuba, initiating a tense 13-day standoff with the Soviet Union over nuclear missiles.',
    })
    .addKeyframe('1965-04-28', 'dominican_republic_intervention_1965', 0.6, ['intervention', 'dominican_republic'], {
        description: 'U.S. forces intervene in the Dominican Republic during a civil war, citing the need to protect American lives and prevent a potential communist takeover.',
    })
    .addKeyframe('1983-10-25', 'grenada_invasion', 0.7, ['intervention', 'grenada', 'cold_war'], {
        description: 'Operation Urgent Fury: The U.S. invades the island of Grenada following a coup, to protect American students and counter Cuban influence.',
    })
    .addKeyframe('1986-04-15', 'libya_bombing_1986', 0.65, ['airstrike', 'libya', 'counter_terrorism'], {
        description: 'Operation El Dorado Canyon: U.S. air and naval forces conduct bombing strikes against Libya in response to state-sponsored terrorism.',
    })
    .addKeyframe('1987-07-24', 'operation_earnest_will', 0.6, ['persian_gulf', 'convoy', 'iran_iraq_war'], {
        description: 'Start of Operation Earnest Will, the U.S. Navy mission to protect Kuwaiti-owned tankers from Iranian attack in the Persian Gulf.',
    })
    .addKeyframe('1989-05-11', 'panama_troop_increase_1989', 0.5, ['panama', 'diplomatic_pressure'], {
        description: 'In response to General Noriega nullifying election results, President Bush orders a brigade-sized force to Panama to augment U.S. forces.',
    })
    .addKeyframe('1989-09-15', 'andean_initiative', 0.5, ['war_on_drugs', 'south_america'], {
        description: 'President Bush announces the Andean Initiative, sending military and law enforcement assistance to Colombia, Bolivia, and Peru to combat drug trafficking.',
    })
    .addKeyframe('1989-11-09', 'fall_of_berlin_wall', 1.0, ['cold_war', 'end_of_era', 'germany'], {
        description: 'The fall of the Berlin Wall. While not a U.S. military operation, it serves as the terminal keyframe for this universe, symbolizing the end of the Cold War era that defined much of this period\'s military posture.',
        precision: TimePrecision.DAY,
    })
    .build();

// --- Usage Example ---
/*
import { usMilitaryOperations1870to1989Universe } from './us-military-operations-1870-1989';
import { UniverseRegistry } from './core/universe-registry';

// Create a new registry instance
const registry = new UniverseRegistry();

// Register the generated universe
registry.registerUniverse(usMilitaryOperations1870to1989Universe);

// You can now query the registry for events within this universe
const ww2Epoch = registry.getEpochById(usMilitaryOperations1870to1989Universe.universeId, 'world_war_ii');
console.log(ww2Epoch?.description);

const keyframe = registry.findKeyframeByDate(usMilitaryOperations1870to1989Universe.universeId, new Date('1944-06-06T12:00:00Z'));
console.log(keyframe?.metadata.description);
*/
