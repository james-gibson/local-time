import { Universe } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { createHistoricalBuilder } from '../../../core/universe-builder';

/**
 * Ukraine: Path to Conflict (1991-2014)
 *
 * This universe documents the critical historical period for Ukraine, beginning with its declaration of
 * independence from the collapsing Soviet Union and culminating in the initial phase of armed conflict
 * with Russia. It covers the nation's struggle for sovereignty, its geopolitical balancing act between
 * Western and Russian spheres of influence, and the internal political turmoil that ultimately led to the
 * Revolution of Dignity, the annexation of Crimea, and the war in Donbas.
 *
 * Cultural Significance: 1.0 - This sequence of events represents a major geopolitical shift in post-Cold
 * War Europe, directly leading to the largest land war on the continent since World War II. Its impact on
 * international law, global alliances (like NATO), and energy security is profound and ongoing.
 *
 * Reality Relation: Documentary with 0.0 fictionalization. This universe is based entirely on documented
 * historical events.
 *
 * Research Sources:
 * - Council on Foreign Relations: "Conflict in Ukraine"
 * - Britannica Encyclopedia: "Ukraine crisis of 2013-14", "Orange Revolution"
 * - NATO Archives: "Charter on a Distinctive Partnership between NATO and Ukraine" (July 9, 1997)
 * - United Nations General Assembly Resolution 68/262: "Territorial integrity of Ukraine"
 * - Associated Press & Reuters archives (1991-2014)
 * - Wilson Center, Kennan Institute publications on Ukrainian history.
 *
 * Key Facts Verified:
 * - Ukraine Independence Declared: August 24, 1991. Referendum: December 1, 1991.
 * - Orange Revolution: November 2004 - January 2005.
 * - Euromaidan/Revolution of Dignity: November 21, 2013 - February 22, 2014.
 * - Russian Annexation of Crimea: February 20 - March 18, 2014.
 * - War in Donbas Start: April 6, 2014.
 *
 * Hierarchical Context: UKRAINE_HISTORY -> SOVIET_UNION_COLLAPSE -> COLD_WAR -> WORLD_HISTORY
 * Applicable Parent Universes: [CommonUniverseIds.COLD_WAR, CommonUniverseIds.WORLD_HISTORY]
 *
 * ## Repaired while wiring the namespace (#126, #102)
 *
 * The module previously threw on import (`history:ukraine:1991_2014`, an
 * underscore range), stored milliseconds in nanosecond fields, used
 * `segmentId`/`startTime`/`endTime` instead of `TemporalSegment`, and declared
 * `realityRelation.type: 'documents'` with `realWorldEvent` anchors. It is now
 * assembled by the builder, so `build()` validates it.
 */
const ukraine = createHistoricalBuilder()
    .historical('ukraine:path_to_conflict', 1991, 2014)
    .withAliases(['Post-Soviet Ukraine History', 'Origins of the Russo-Ukrainian War'])
    .withCanonicalName('Ukraine: Path to Conflict (1991-2014)')
    .withDescription(
        'A historical timeline detailing the key events from Ukrainian independence to the onset of the Russo-Ukrainian War in 2014.',
    )
    .withReleased('1991-08-24')
    .withCulturalSignificance(1.0)
    .withRealityRelation('documentary', 0.0, [
        {
            realEventId: 'history:soviet_union:dissolution:1991',
            relationshipType: 'documents',
            confidence: 1.0,
            evidence: [
                'Belovezha Accords (December 8, 1991)',
                'Alma-Ata Protocol (December 21, 1991)',
            ],
        },
        {
            realEventId: 'history:nato:enlargement:1997-2004',
            relationshipType: 'documents',
            confidence: 1.0,
            evidence: [
                'NATO summit records (1997, 1999, 2004)',
                'Charter on a Distinctive Partnership with Ukraine (1997)',
            ],
        },
        {
            realEventId: 'history:russo_ukrainian_war:2014-present',
            relationshipType: 'documents',
            confidence: 1.0,
            evidence: [
                'UN General Assembly Resolution 68/262',
                'OSCE Special Monitoring Mission to Ukraine reports',
            ],
        },
    ])
    .withPublicDomain([
        'Council on Foreign Relations',
        'Britannica',
        'NATO Archives',
        'United Nations',
    ])
    .withUsageRestrictions([
        'Subject to historical interpretation; cross-reference with primary sources is advised.',
    ])
    .addParent(CommonUniverseIds.COLD_WAR)
    .addParent(CommonUniverseIds.WORLD_HISTORY)
    .addEpoch(
        '1991-08-24T00:00:00Z',
        '2004-11-21T23:59:59Z',
        'independence_era',
        undefined,
        undefined,
        {
            description:
                "Period following Ukraine's declaration of independence, characterized by nation-building, economic struggles, and navigating relations with Russia and the West.",
        },
    )
    .addEpoch(
        '2004-11-22T00:00:00Z',
        '2014-01-31T23:59:59Z',
        'revolutionary_period',
        undefined,
        undefined,
        {
            description:
                "A decade of intense political turmoil, including two major pro-Western revolutions (Orange and Euromaidan) that defined Ukraine's geopolitical orientation.",
        },
    )
    .addEpoch(
        '2014-02-01T00:00:00Z',
        '2014-12-31T23:59:59Z',
        'conflict_begins',
        undefined,
        undefined,
        {
            description:
                'The immediate aftermath of the Revolution of Dignity, leading to the Russian annexation of Crimea and the start of the war in Donbas.',
        },
    )
    .addDateSegment(
        '1991-08-24',
        '2004-11-21',
        'independence_and_early_statehood',
        'phase',
        'active',
        undefined,
        'From independence to the eve of the Orange Revolution.',
    )
    .addDateSegment(
        '2004-11-22',
        '2014-04-06',
        'political_upheaval_and_geopolitical_shift',
        'phase',
        'active',
        undefined,
        'From the Orange Revolution to the start of the Donbas war.',
    )
    .addDateKeyframe('1991-08-24T17:00:00Z', 'declaration_of_independence', 1.0, ['sovereignty', 'nation-building', 'soviet_collapse'], {
        certainty: 1.0,
        description:
            "The Verkhovna Rada of the Ukrainian SSR declares Ukraine's independence from the Soviet Union, a pivotal moment confirmed by a national referendum in December 1991.",
    })
    .addDateKeyframe('1997-07-09T12:00:00Z', 'nato_charter_partnership', 0.8, ['nato', 'foreign_policy', 'geopolitics'], {
        certainty: 1.0,
        description:
            "Ukraine and NATO sign the Charter on a Distinctive Partnership, establishing a formal consultation mechanism and signaling Ukraine's Western foreign policy alignment.",
    })
    .addDateKeyframe('2004-11-22T00:00:00Z', 'orange_revolution_begins', 0.95, ['revolution', 'democracy', 'protest', 'election_fraud'], {
        certainty: 1.0,
        description:
            'Widespread protests begin against the fraudulent results of the 2004 presidential run-off election, ultimately leading to an annulment and a repeat vote.',
    })
    .addDateKeyframe('2013-11-21T12:00:00Z', 'euromaidan_begins', 0.95, ['protest', 'eu_integration', 'revolution'], {
        certainty: 1.0,
        description:
            "Protests erupt in Kyiv after President Viktor Yanukovych's government suspends preparations for signing an Association Agreement with the European Union.",
    })
    .addDateKeyframe('2014-02-22T00:00:00Z', 'yanukovych_ousted', 1.0, ['revolution_of_dignity', 'regime_change', 'geopolitics'], {
        certainty: 1.0,
        description:
            'Following deadly clashes, President Yanukovych flees Kyiv and is removed from office by the Ukrainian Parliament, marking the climax of the Revolution of Dignity.',
    })
    .addDateKeyframe('2014-02-20T00:00:00Z', 'crimea_annexation_begins', 1.0, ['invasion', 'annexation', 'international_law'], {
        certainty: 1.0,
        description:
            'Unmarked Russian troops begin seizing control of the Crimean Peninsula, initiating the process of its annexation by the Russian Federation.',
    })
    .addDateKeyframe('2014-04-06T00:00:00Z', 'donbas_war_begins', 1.0, ['war', 'separatism', 'conflict'], {
        certainty: 1.0,
        description:
            'Pro-Russian separatist groups, supported by Russia, seize government buildings in Donetsk and Luhansk, sparking the armed conflict known as the War in Donbas.',
    })
    .withWindowing('phase_based')
    .build();

// `metadata.creators` has no builder setter (a collective is not a credited
// person); see the residue table in the `local-time-universe` skill.
ukraine.metadata = {
    ...ukraine.metadata,
    creators: ['Historical Actors of Ukraine, Russia, USA, and EU'],
};

export const ukraineWarOriginsUniverse: Universe = ukraine;
