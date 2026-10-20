import { Universe } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { createHistoricalBuilder } from '../../../core/universe-builder';

/**
 * Gaza: Israel-Hamas War (2023-2025)
 *
 * This universe documents the major events of the war in Gaza that began on October 7, 2023, following a large-scale attack by Hamas on southern Israel. It covers the initial attack, the subsequent Israeli military response, the ensuing humanitarian crisis, and the complex international diplomatic reactions. The universe highlights the critical role of Al Jazeera's on-the-ground reporting in shaping global understanding of the conflict.
 *
 * Cultural Significance: 1.0 - This conflict represents one of the most significant geopolitical events of the early 21st century, triggering a severe humanitarian crisis, widespread international protests, and legal challenges in international courts. It has profoundly impacted Israeli-Palestinian relations and reshaped diplomatic alignments in the Middle East and globally.
 *
 * Reality Relation: Documentary with 0.0 fictionalization. This universe is based entirely on documented historical events.
 *
 * Research Sources:
 * - Al Jazeera Media Network: Continuous live coverage, special reports, and field journalism from Gaza.
 * - United Nations (OCHA, UNRWA, OHCHR): Situation reports, press briefings, and resolutions.
 * - Council on Foreign Relations: "Conflict in Ukraine" (for comparative context on international response).
 * - Reuters & Associated Press: News archives and timelines of the conflict.
 * - Human Rights Watch & Amnesty International: Reports on human rights conditions and potential war crimes.
 * - Official statements from the governments of Israel, the Palestinian Authority, the United States, the European Union, and the Arab League.
 *
 * Key Facts Verified:
 * - Conflict Start Date: October 7, 2023.
 * - Israeli Ground Invasion of Gaza Begins: October 27, 2023.
 * - Humanitarian Crisis: Widespread famine and displacement reported by UN agencies by early 2024.
 * - Al Jazeera's Role: The network's offices were targeted, and several of its journalists were killed while reporting, making its coverage a central part of the story.
 *
 * Hierarchical Context: MIDDLE_EAST_HISTORY -> WORLD_HISTORY
 * Applicable Parent Universes: [CommonUniverseIds.WORLD_HISTORY]
 *
 * ## Repaired while wiring the namespace (#126, #102)
 *
 * The module previously threw on import: `createHistoricalUniverseId('gaza',
 * 'israel_hamas_war', '2023_2025')` produced `history:gaza:2023_2025` — an
 * underscore range no pattern accepts. Timestamps were milliseconds in fields
 * typed nanoseconds (a 1,000,000× error that only stayed invisible because
 * nothing imported the module), segments used the wrong field names, and
 * `realityRelation.type: 'documents'` / `realWorldEvent` are not the canonical
 * shapes. It is now assembled by the builder, so `build()` validates it.
 */
const gaza = createHistoricalBuilder()
    .historical('gaza:israel_hamas_war', 2023, 2025)
    .withAliases(['Gaza War 2023', 'Operation Al-Aqsa Flood', 'Operation Iron Swords'])
    .withCanonicalName('Gaza: Israel-Hamas War (2023-2025)')
    .withDescription(
        'A historical timeline of the Israel-Hamas War starting in October 2023, detailing military operations, the humanitarian impact, and key international statements. Special focus is given to the on-the-ground reporting by Al Jazeera.',
    )
    .withReleased('2023-10-07')
    .withCulturalSignificance(1.0)
    .withRealityRelation('documentary', 0.0, [
        {
            realEventId: 'history:israel:october_7_attacks:2023',
            relationshipType: 'documents',
            confidence: 1.0,
            evidence: [
                'Official statements from the Israeli government',
                'Verified video footage and eyewitness accounts',
                'Reporting from international news agencies',
            ],
        },
        {
            realEventId: 'history:gaza:israeli_military_operations:2023-2025',
            relationshipType: 'documents',
            confidence: 1.0,
            evidence: [
                "IDF Spokesperson's Unit announcements",
                'Satellite imagery analysis of Gaza',
                'On-the-ground reporting from Al Jazeera and other news outlets',
            ],
        },
        {
            realEventId: 'history:gaza:humanitarian_crisis:2023-2025',
            relationshipType: 'documents',
            confidence: 1.0,
            evidence: [
                'UN Office for the Coordination of Humanitarian Affairs (OCHA) reports',
                'World Food Programme (WFP) famine warnings',
                'Statements from international NGOs operating in Gaza',
            ],
        },
    ])
    .withPublicDomain([
        'Al Jazeera Media Network',
        'United Nations',
        'Reuters',
        'Associated Press',
        'Amnesty International',
    ])
    .withUsageRestrictions([
        'The situation is ongoing and subject to intense information warfare. Casualty figures from different sources vary and are contested. Cross-reference with primary sources is essential.',
    ])
    .addParent(CommonUniverseIds.WORLD_HISTORY)
    .addEpoch(
        '2023-10-07T00:00:00Z',
        '2023-10-26T23:59:59Z',
        'initial_assault_and_response',
        undefined,
        undefined,
        {
            description:
                'Begins with the Hamas-led attack on Israel and covers the initial phase of Israeli airstrikes on Gaza before the ground invasion.',
        },
    )
    .addEpoch(
        '2023-10-27T00:00:00Z',
        '2025-12-31T23:59:59Z',
        'ground_invasion_and_humanitarian_crisis',
        undefined,
        undefined,
        {
            description:
                'Covers the period of intense Israeli ground operations, the systematic destruction of infrastructure, mass displacement, and the severe humanitarian crisis, including famine.',
        },
    )
    .addDateSegment(
        '2023-10-07',
        '2023-12-31',
        'initial_conflict_and_escalation',
        'phase',
        'active',
        undefined,
        'From the initial Hamas attack through the first months of intense Israeli bombardment and ground operations.',
    )
    .addDateSegment(
        '2024-01-01',
        '2025-12-31',
        'protracted_war_and_diplomacy',
        'phase',
        'active',
        undefined,
        'Characterized by ongoing military operations, a deepening humanitarian catastrophe, and persistent but largely unsuccessful international diplomatic efforts for a sustained ceasefire.',
    )
    .addDateKeyframe('2023-10-07T03:30:00Z', 'hamas_attack_on_israel', 1.0, ['attack', 'casus_belli', 'israel', 'hamas'], {
        certainty: 1.0,
        description:
            'Hamas launches a large-scale, coordinated surprise attack on southern Israel from the Gaza Strip, killing hundreds and taking numerous hostages, initiating the war.',
    })
    .addDateKeyframe('2023-10-08T00:00:00Z', 'israel_declares_war_begins_airstrikes', 1.0, ['declaration_of_war', 'airstrikes', 'retaliation'], {
        certainty: 1.0,
        description:
            'Israel formally declares war on Hamas and commences an intense bombing campaign across the Gaza Strip. US President Biden issues a statement affirming "rock-solid and unwavering" support for Israel.',
    })
    .addDateKeyframe('2023-10-28T00:00:00Z', 'israeli_ground_invasion_begins', 0.95, ['invasion', 'ground_offensive', 'escalation'], {
        certainty: 1.0,
        description:
            'The Israel Defense Forces (IDF) launch a large-scale ground invasion into the northern Gaza Strip, marking a new phase of the conflict.',
    })
    .addDateKeyframe('2024-03-01T00:00:00Z', 'un_warns_of_famine', 0.9, ['humanitarian_crisis', 'famine', 'united_nations', 'aid_blockade'], {
        certainty: 1.0,
        description:
            'UN agencies and humanitarian organizations formally warn of widespread famine in northern Gaza due to the ongoing conflict and restrictions on aid delivery. UN Secretary-General António Guterres states, "The level of death and destruction is shocking."',
    })
    .addDateKeyframe('2025-07-21T00:00:00Z', 'joint_statement_for_ceasefire', 0.8, ['diplomacy', 'ceasefire', 'international_pressure'], {
        certainty: 1.0,
        description:
            'A coalition of 28 countries, including many Western nations, issues a joint statement demanding an immediate end to the war in Gaza, reflecting growing international pressure on Israel.',
    })
    .addDateKeyframe('2025-07-30T00:00:00Z', 'arab_league_condemns_hamas', 0.85, ['diplomacy', 'arab_league', 'hamas', 'two_state_solution'], {
        certainty: 1.0,
        description:
            'In a significant diplomatic shift, the Arab League issues a declaration condemning the October 7 attacks by Hamas and calling for the group to disarm as part of a two-state solution.',
    })
    .addDateKeyframe('2025-09-01T00:00:00Z', 'israel_begins_gaza_city_operation', 0.9, ['gaza_city', 'escalation', 'displacement'], {
        certainty: 1.0,
        description:
            'Israel announces a major new operation in Gaza City, ordering mass evacuations and intensifying airstrikes, leading to widespread condemnation. Amnesty International calls it a move that will have "catastrophic and irreversible consequences."',
    })
    .addDateKeyframe('2025-09-10T00:00:00Z', 'eu_proposes_sanctions', 0.85, ['eu', 'sanctions', 'diplomacy', 'international_pressure'], {
        certainty: 1.0,
        description:
            'European Commission President Ursula von der Leyen announces plans to seek sanctions and a partial trade suspension against Israel over the war, signaling a major shift in EU policy.',
    })
    .withWindowing('phase_based')
    .build();

// `metadata.creators` has no builder setter (a collective is not a credited
// person); see the residue table in the `local-time-universe` skill.
gaza.metadata = {
    ...gaza.metadata,
    creators: ['Historical Actors of Israel, Hamas, Palestinian Authority, USA, EU, UN, and Arab Nations'],
};

export const gazaConflict2023Universe: Universe = gaza;
