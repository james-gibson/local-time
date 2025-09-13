import { UniverseBuilder, createHistoricalUniverseId, TimePrecision } from '../../../core';

/**
 * @universe us_gov:aumf_2001:2001-present
 * @description This universe documents the 2001 Authorization for Use of Military Force (AUMF), Public Law 107-40. Enacted in the immediate aftermath of the September 11, 2001 attacks, this 60-word resolution has served as the primary domestic legal basis for U.S. counterterrorism operations for over two decades. It documents the AUMF's application and interpretation across four presidential administrations, evolving from a specific mandate against the perpetrators of 9/11 to a broad authority for actions against various groups in numerous countries.
 * @temporal-strategy The universe is structured with epochs representing each presidential administration. Keyframes within these epochs mark the initial enactment, significant military operations, key policy speeches, and major legal interpretations or challenges related to the AUMF's scope.
 * @reality-relation Documentary, based on public laws, executive branch statements, and Congressional Research Service reports. Fictionalization degree is 0.0.
 * @significance The 2001 AUMF is a document of immense historical and legal significance (1.0). It fundamentally reshaped the legal architecture of U.S. military action in the 21st century, authorizing operations in at least 22 countries and sparking a long-running debate over war powers between the executive and legislative branches.【1】
 */
export const aumf2001UsageUniverse = new UniverseBuilder()
    .historical(
        createHistoricalUniverseId('us_gov', 'aumf_2001_usage', '2001-present'),
        'Presidential Usage of the 2001 AUMF'
    )
    .withDescription('A documentation of the 2001 Authorization for Use of Military Force and its application by U.S. Presidents.')
    .withRealityRelation('documentary', 0.0)
    // Source: Based on public law texts, Congressional Research Service reports (e.g., "The 2001 AUMF: A Brief Overview"), and White House/DOD statements.
    .withCopyright(['Public Domain'], 2001, 'public_domain')
    .withCulturalSignificance(1.0)
    .withTags(['us_law', 'war_powers', 'counter_terrorism', 'foreign_policy', 'aumf', 'september_11'])

    // --- Enactment ---
    .addKeyframe('2001-09-18', 'aumf_enactment', 1.0, ['law', 'enactment', 'congress'], {
        description: 'President George W. Bush signs into law Senate Joint Resolution 23, the "Authorization for Use of Military Force" (AUMF). The resolution authorizes the President to use all "necessary and appropriate force" against those nations, organizations, or persons he determines planned, authorized, committed, or aided the September 11th attacks.【2】',
    })

    // --- Epoch 1: George W. Bush Administration (2001-2009) ---
    .addEpoch('2001-01-20', '2009-01-19', 'bush_administration', 0.98, ['george_w_bush', 'war_on_terror'], {
        description: 'The Bush administration oversaw the enactment of the AUMF and initiated its first applications, primarily targeting al-Qaeda and the Taliban in Afghanistan. The initial scope was directly tied to the perpetrators of the 9/11 attacks.',
    })
    .addKeyframe('2001-10-07', 'operation_enduring_freedom', 1.0, ['invasion', 'afghanistan', 'taliban', 'al_qaeda'], {
        epochId: 'bush_administration',
        description: 'The United States, with its allies, begins military operations in Afghanistan. This is the first and most direct application of the 2001 AUMF, targeting the Taliban for harboring al-Qaeda.',
    })

    // --- Epoch 2: Barack Obama Administration (2009-2017) ---
    .addEpoch('2009-01-20', '2017-01-19', 'obama_administration', 0.98, ['barack_obama', 'scope_expansion'], {
        description: 'The Obama administration continued operations under the AUMF but expanded its legal interpretation to include "associated forces" of al-Qaeda, such as ISIS. This significantly broadened the scope of the authorization beyond the original 9/11-related groups.【3】',
    })
    .addKeyframe('2011-05-02', 'osama_bin_laden_raid', 0.95, ['special_operations', 'pakistan', 'al_qaeda'], {
        epochId: 'obama_administration',
        description: 'U.S. Navy SEALs conduct a raid in Abbottabad, Pakistan, killing Osama bin Laden. The operation is cited as a key use of force under the AUMF against a primary target of the authorization.',
    })
    .addKeyframe('2013-05-23', 'obama_ndu_speech', 0.9, ['policy', 'aumf_repeal', 'legal_framework'], {
        epochId: 'obama_administration',
        description: 'In a major speech at the National Defense University, President Obama calls on Congress to repeal and replace the 2001 AUMF, stating the need to refine and ultimately repeal the AUMF\'s mandate to avoid a "perpetual war."',
    })
    .addKeyframe('2014-09-10', 'isis_intervention', 1.0, ['airstrikes', 'iraq', 'syria', 'isis', 'associated_forces'], {
        epochId: 'obama_administration',
        description: 'President Obama announces a strategy of airstrikes against the Islamic State of Iraq and Syria (ISIS). The administration legally justifies this action under the 2001 AUMF by designating ISIS as an "associated force" of al-Qaeda, a major expansion of the law\'s scope.【4】',
    })

    // --- Epoch 3: Donald Trump Administration (2017-2021) ---
    .addEpoch('2017-01-20', '2021-01-19', 'trump_administration', 0.95, ['donald_trump', 'continued_use'], {
        description: 'The Trump administration continued the broad interpretation of the AUMF, using it to justify actions against a wide range of groups and individuals, including those with tenuous or no connection to the 9/11 attacks.',
    })
    .addKeyframe('2020-01-03', 'qasem_soleimani_strike', 0.9, ['airstrike', 'iran', 'iraq', 'war_powers_debate'], {
        epochId: 'trump_administration',
        description: 'The U.S. conducts a drone strike that kills Iranian General Qasem Soleimani. While the administration primarily cited Article II authority, it also referenced the 2002 AUMF (Iraq), sparking intense debate about the stretching of AUMF justifications.',
    })

    // --- Epoch 4: Joe Biden Administration (2021-2025) ---
    .addEpoch('2021-01-20', '2025-01-19', 'biden_administration', 0.95, ['joe_biden', 'repeal_efforts'], {
        description: 'The Biden administration has expressed support for repealing and replacing the 2001 AUMF while continuing to use it for counterterrorism operations. This era is marked by active legislative efforts to reclaim congressional war powers.【1】',
    })
    .addKeyframe('2021-08-29', 'kabul_drone_strike', 0.85, ['drone_strike', 'afghanistan_withdrawal', 'isis-k'], {
        epochId: 'biden_administration',
        description: 'During the chaotic withdrawal from Afghanistan, the U.S. conducts a drone strike in Kabul, citing the AUMF to target suspected ISIS-K planners. The strike, which resulted in civilian casualties, highlighted the ongoing reliance on the AUMF.',
    })
    .addKeyframe('2023-06-14', 'senate_repeal_vote', 0.9, ['legislative_action', 'congress', 'repeal'], {
        epochId: 'biden_administration',
        description: 'The U.S. Senate votes to repeal the 1991 and 2002 AUMFs related to Iraq, signaling growing bipartisan momentum to reform and repeal outdated war authorizations, including renewed calls to address the 2001 AUMF.',
    })
    .build();

// --- Usage Example ---
/*
import { aumf2001UsageUniverse } from './aumf-2001-usage';
import { UniverseRegistry } from './core/universe-registry';

// Create a new registry instance
const registry = new UniverseRegistry();

// Register the generated universe
registry.registerUniverse(aumf2001UsageUniverse);

// Query for the keyframe that expanded the AUMF's scope to ISIS
const isisKeyframe = registry.findKeyframeById(aumf2001UsageUniverse.universeId, 'isis_intervention');
console.log(`AUMF scope was expanded to ISIS on: ${isisKeyframe?.timestamp}`);
console.log(isisKeyframe?.metadata.description);

// Get the Obama administration epoch
const obamaEpoch = registry.getEpochById(aumf2001UsageUniverse.universeId, 'obama_administration');
console.log(obamaEpoch?.description);
*/
