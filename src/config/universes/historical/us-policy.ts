import { UniverseBuilder, createHistoricalUniverseId, TimePrecision } from '../../../index';
import {createHistoricalEventOwnerId} from '../../../core/universe-ids';

/**
 * @universe history:us_native_american_policy:1787-present
 * @description This universe documents the major eras and pivotal events related to the United States government's policies toward Native American peoples. It covers the periods of treaty-making, forced removal, assimilation, termination, and self-determination, highlighting the profound and lasting impact of these policies on Native American sovereignty, land, and culture.
 * @temporal-strategy This universe is structured around major policy eras, defined as epochs. Key legislation, court decisions, and significant historical events are marked as keyframes within these epochs.
 * @reality-relation Documentary, based on federal laws, treaties, and historical records. Fictionalization degree is 0.0.
 * @significance The relationship between the U.S. government and Native American nations is a foundational and defining aspect of American history, holding the highest possible cultural and historical significance (1.0).
 */
export const usNativeAmericanPolicyUniverse = new UniverseBuilder()
    .historical("history:us_gov_native_american","1787")
    .withDescription('A temporal documentation of U.S. federal policies concerning Native Americans, from early treaties to the modern era of self-determination.')
    .withRealityRelation('documentary', 0.0)
    // Source: Based on public records from the National Archives, Bureau of Indian Affairs, and historical academic sources.
    .withCopyright(['Public Domain'], 1787, 'public_domain')
    .withCulturalSignificance(1.0)
    .withTags(['us_history', 'native_american', 'federal_policy', 'sovereignty', 'civil_rights', 'land_rights'])

    // --- Epoch 1: Treaty and Removal Era (c. 1787 - 1887) ---
    // This period was characterized by treating tribes as sovereign nations for treaty purposes, but increasingly shifted towards a policy of forced removal from ancestral lands to open them for white settlement.
    .addEpoch('1787-07-13', '1887-02-07', 'treaty_and_removal_era', 0.98, ['treaties', 'land_cession', 'forced_migration'], {
        description: 'An era defined by treaty-making with sovereign tribal nations, which progressively led to policies of forced land cessions and the removal of Native peoples from their ancestral homelands east of the Mississippi River.',
    })
    .addKeyframe('1787-07-13', 'northwest_ordinance', 0.8, ['policy', 'land_rights'], {
        epochId: 'treaty_and_removal_era',
        description: 'The Northwest Ordinance is passed, stating that Native American land should not be taken without their consent, a principle that was frequently violated.',
    })
    .addKeyframe('1830-05-28', 'indian_removal_act', 1.0, ['law', 'forced_migration', 'policy'], {
        epochId: 'treaty_and_removal_era',
        description: 'President Andrew Jackson signs the Indian Removal Act, authorizing the government to forcibly relocate Southern tribes to territory west of the Mississippi River.',
    })
    .addKeyframe('1838-01-01', 'trail_of_tears', 1.0, ['forced_migration', 'cherokee', 'humanitarian_crisis'], {
        epochId: 'treaty_and_removal_era',
        // Note: The Trail of Tears refers to the forced relocations of several tribes over a period of years. 1838 marks the particularly devastating Cherokee removal.
        description: 'The forced removal of the Cherokee Nation from their lands, a brutal march that resulted in the deaths of thousands. It is a central event of the Removal Era.',
        precision: TimePrecision.YEAR,
    })
    .addKeyframe('1876-06-25', 'battle_of_little_bighorn', 0.9, ['resistance', 'sioux', 'military_conflict'], {
        epochId: 'treaty_and_removal_era',
        description: 'Lakota, Cheyenne, and Arapaho forces defeat the U.S. 7th Cavalry in a significant act of resistance against U.S. encroachment on tribal lands.',
    })
    .addKeyframe('1890-12-29', 'wounded_knee_massacre', 1.0, ['massacre', 'sioux', 'end_of_era'], {
        // While technically after the start of the next epoch, this event is the tragic culmination of the Indian Wars of the Removal Era.
        epochId: 'treaty_and_removal_era',
        description: 'The massacre of hundreds of Lakota men, women, and children by the U.S. Army at Wounded Knee Creek, marking a symbolic end to major armed Native American resistance.',
    })

    // --- Epoch 2: Allotment and Assimilation Era (c. 1887 - 1934) ---
    // This era's policy aimed to destroy tribal culture and governance by breaking up communally-held reservation lands into individual plots and forcing cultural assimilation, primarily through boarding schools.
    .addEpoch('1887-02-08', '1934-06-17', 'allotment_and_assimilation_era', 0.98, ['assimilation', 'land_allotment', 'cultural_destruction'], {
        description: 'An era focused on assimilating Native Americans into mainstream American society by breaking up tribal lands and governments and suppressing traditional cultures, often through coercive education systems.',
    })
    .addKeyframe('1887-02-08', 'dawes_act', 1.0, ['law', 'land_allotment', 'policy'], {
        epochId: 'allotment_and_assimilation_era',
        description: 'The General Allotment Act (Dawes Act) is passed, authorizing the division of communal tribal lands into individual parcels. This resulted in the loss of millions of acres of tribal land.',
    })
    .addKeyframe('1879-01-01', 'carlisle_school_founding', 0.95, ['assimilation', 'education', 'boarding_schools'], {
        epochId: 'allotment_and_assimilation_era',
        description: 'The Carlisle Indian Industrial School opens in Pennsylvania, becoming the model for a national system of off-reservation boarding schools designed to forcibly assimilate Native children.',
        precision: TimePrecision.YEAR,
    })
    .addKeyframe('1924-06-02', 'indian_citizenship_act', 0.9, ['law', 'civil_rights', 'citizenship'], {
        epochId: 'allotment_and_assimilation_era',
        description: 'The Indian Citizenship Act is signed, granting U.S. citizenship to all Native Americans born within the territorial limits of the United States.',
    })

    // --- Epoch 3: Reorganization and Termination Era (c. 1934 - 1968) ---
    // A contradictory period that began with the "Indian New Deal" to restore tribal governance, but was later overshadowed by the "Termination Policy" which sought to dissolve the federal-tribal relationship entirely.
    .addEpoch('1934-06-18', '1968-04-10', 'reorganization_and_termination_era', 0.95, ['policy_shift', 'reorganization', 'termination'], {
        description: 'A conflicting era that started with the Indian Reorganization Act to reverse assimilationist policies, but was later dominated by the Termination Policy, which sought to end federal recognition of many tribes.',
    })
    .addKeyframe('1934-06-18', 'indian_reorganization_act', 0.95, ['law', 'policy_reversal', 'tribal_government'], {
        epochId: 'reorganization_and_termination_era',
        description: 'The Wheeler-Howard Act (Indian Reorganization Act) is passed, ending the allotment policy and encouraging tribal self-government and cultural preservation.',
    })
    .addKeyframe('1953-08-01', 'termination_policy', 0.95, ['policy', 'termination', 'sovereignty_threat'], {
        epochId: 'reorganization_and_termination_era',
        description: 'House Concurrent Resolution 108 is passed, marking the official start of the "Termination Policy" to end the special trustee relationship between the federal government and over 100 tribes.',
    })

    // --- Epoch 4: Self-Determination Era (c. 1968 - Present) ---
    // This modern era, born from Native American activism, focuses on strengthening tribal sovereignty, self-governance, and cultural revitalization.
    .addEpoch('1968-04-11', new Date().toISOString().split('T')[0], 'self_determination_era', 0.98, ['self_determination', 'sovereignty', 'activism', 'cultural_revitalization'], {
        description: 'The current era, defined by policies that promote tribal sovereignty, self-governance, and cultural preservation, largely driven by Native American activism and a rejection of past assimilation and termination policies.',
    })
    .addKeyframe('1968-04-11', 'indian_civil_rights_act', 0.9, ['law', 'civil_rights'], {
        epochId: 'self_determination_era',
        description: 'The Indian Civil Rights Act is passed, guaranteeing many, but not all, of the Bill of Rights protections to individual tribal members under tribal law.',
    })
    .addKeyframe('1975-01-04', 'indian_self_determination_act', 1.0, ['law', 'self_determination', 'sovereignty'], {
        epochId: 'self_determination_era',
        description: 'The Indian Self-Determination and Education Assistance Act is signed, marking a major shift in federal policy by authorizing tribal governments to contract for the administration of federal programs.',
    })
    .addKeyframe('1978-08-11', 'american_indian_religious_freedom_act', 0.85, ['law', 'religious_freedom', 'culture'], {
        epochId: 'self_determination_era',
        description: 'A federal law enacted to protect and preserve the traditional religious rights and cultural practices of Native Americans, including access to sacred sites.',
    })
    .addKeyframe('1990-11-16', 'nagpra', 0.9, ['law', 'repatriation', 'culture'], {
        epochId: 'self_determination_era',
        description: 'The Native American Graves Protection and Repatriation Act (NAGPRA) is passed, requiring federal agencies and institutions to return Native American cultural items and human remains to their respective peoples.',
    })
    .build();

// --- Usage Example ---
/*
import { usNativeAmericanPolicyUniverse } from './us-native-american-policy';
import { UniverseRegistry } from './core/universe-registry';

// Create a new registry instance
const registry = new UniverseRegistry();

// Register the generated universe
registry.registerUniverse(usNativeAmericanPolicyUniverse);

// You can now query the registry for events within this universe
const assimilationEpoch = registry.getEpochById(usNativeAmericanPolicyUniverse.universeId, 'allotment_and_assimilation_era');
console.log(assimilationEpoch?.description);

const keyframe = registry.findKeyframeById(usNativeAmericanPolicyUniverse.universeId, 'indian_removal_act');
console.log(keyframe?.metadata.description);
*/
