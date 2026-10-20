import { Universe, UniverseType } from '../../../core/types';
import { UniverseBuilder } from '../../../core/universe-builder';
import { createLegalUniverseId } from '../../../core/universe-ids';

/**
 * The Sokovia Accords (2016)
 *
 * The United Nations treaty at the centre of *Captain America: Civil War*: 117
 * countries agree to register and direct enhanced individuals, and the Avengers
 * split over whether to sign. It is the in-universe legal instrument, not the
 * film — the film is `marvel_studios:captain_america_civil_war:2016`, and it
 * carries a `DEPICTS` edge to this universe.
 *
 * ## Why it is a `legal-` universe in the Marvel collection
 *
 * The id namespace describes what the thing *is*, not which folder it lives in
 * (the rule in `docs/adr/0002-politics-namespaces.md`): an accord is a law, so
 * it uses the legal grammar — `legal-<jurisdiction>:<category>:<law>:<year>` —
 * the same one as `legal-us_gov:copyright:law_evolution:1790`. The folder is
 * authoring organisation; containment and network membership are what place it
 * in the Marvel corpus.
 *
 * ## What this universe demonstrates
 *
 * - a fictional in-universe document typed as `LEGAL_TIMELINE` and built through
 *   `UniverseBuilder`, with the same id/attribution validation as any other;
 * - exact and approximate keyframes side by side: the films rarely give a date,
 *   so the pre-accords events carry a `dateRange` and low `certainty` instead of
 *   pretending to a day;
 * - a typed cross-universe edge, `RESPONDS_TO` the Battle of Sokovia — and the
 *   reciprocal `DEPICTS` from the film;
 * - membership of the Marvel network, which gives it the network's shared
 *   corporate epoch at registration (`UniverseRegistry.inheritSharedEpochs`).
 *
 * Source: *Captain America: Civil War* (2016), Marvel Studios. In-universe dates
 * are not stated on screen; where the film gives only an event, the keyframe's
 * date is marked approximate with a `dateRange`.
 */

const ACCORDS_ID = createLegalUniverseId('united_nations', 'sokovia_accords', 'law_evolution', 2016);

/** The day this record was authored; the accords' own status after 2016 is contested. */
const AUTHORED = '2026-10-19T00:00:00Z';

const at = (iso: string): bigint => BigInt(new Date(iso).getTime()) * 1_000_000n;

const accords = new UniverseBuilder(ACCORDS_ID, UniverseType.LEGAL_TIMELINE)
    .withAliases(['Sokovia Accords', 'The Accords', 'UN Sokovia Accords'])
    .withCanonicalName('The Sokovia Accords')
    .withDescription(
        'The United Nations framework that requires enhanced individuals to register with, and operate under the direction of, a UN panel. Drafted by 117 countries after the Battle of Sokovia and the Lagos incident, its signing splits the Avengers.',
    )
    .withReleased('2016-05-06')
    .withCulturalSignificance(
        0.9,
        'The device that turns the Avengers from a team into a political question; the film’s central conflict is whether the Accords are legitimate.',
    )
    // The Accords are fictional, so there is no real event to anchor them to. The
    // *film* is the reality relation, and it points here, not the other way round.
    .withRealityRelation('pure_fiction', 1.0, [])
    .withCopyright(['Marvel Studios', 'The Walt Disney Company'], 2016, 'active')
    .withCreators({
        writer: ['Christopher Markus', 'Stephen McFeely'],
    })
    .withSources([
        'Captain America: Civil War (2016), Marvel Studios — the Accords, their authorship by 117 countries, and the Vienna signing are stated on screen.',
    ])
    .withUsageRestrictions([
        'An in-universe document from a film. It has no real legal force and must not be cited as law.',
    ])
    .addEpoch(
        '2015-05-01T00:00:00Z',
        '2016-04-30T23:59:59Z',
        'negotiation',
        undefined,
        undefined,
        {
            description:
                'From the Battle of Sokovia to the eve of the signing: the period in which the Accords are drafted and the Avengers are lobbied.',
        },
    )
    .addEpoch('2016-05-01T00:00:00Z', AUTHORED, 'signed_and_contested', undefined, undefined, {
        description:
            'The Accords are signed at the United Nations in Vienna and immediately contested — the signing itself is attacked, and the Avengers split over ratification.',
    })
    .addDateSegment(
        '2015-05-01',
        '2016-04-30',
        'drafting_and_negotiation',
        'phase',
        'active',
        'United Nations',
        'The 117 signatory nations negotiate a registration and oversight regime for enhanced individuals.',
    )
    .addDateSegment(
        '2016-05-01',
        '2026-10-19',
        'signing_and_enforcement',
        'phase',
        'active',
        'United Nations',
        'The signing at Vienna, the Avengers schism, and the Accords’ contested afterlife in the later films.',
    )
    // Approximate dates: the film shows the events but does not date them. The
    // timestamp is the best single guess; `dateRange` carries the honest bound.
    .addKeyframe('2015-05-01T00:00:00Z', 'battle_of_sokovia', 1.0, ['precipitating_event', 'sokovia', 'avengers'], {
        certainty: 0.5,
        dateRange: { earliest: at('2015-01-01T00:00:00Z'), latest: at('2015-12-31T23:59:59Z') },
        description:
            'The Avengers’ defence of Sokovia ends with the city lifted into the air and destroyed. The civilian cost is the immediate argument for international oversight.',
    })
    .addKeyframe('2016-04-01T00:00:00Z', 'lagos_incident', 0.95, ['precipitating_event', 'lagos', 'collateral_damage'], {
        certainty: 0.4,
        dateRange: { earliest: at('2016-01-01T00:00:00Z'), latest: at('2016-06-30T23:59:59Z') },
        description:
            'A mission in Lagos ends with civilian deaths caused by an Avenger. The incident is the direct trigger for the drafting of the Accords.',
    })
    .addKeyframe('2016-04-15T00:00:00Z', 'accords_drafted', 0.9, ['drafting', 'united_nations', '117_nations'], {
        certainty: 0.4,
        dateRange: { earliest: at('2016-01-01T00:00:00Z'), latest: at('2016-04-30T23:59:59Z') },
        description:
            'The Accords are drafted and presented to the Avengers by Secretary of State Thaddeus Ross: 117 countries agree that the team should be registered and directed by a UN panel.',
    })
    .addKeyframe('2016-05-06T00:00:00Z', 'vienna_signing', 1.0, ['signing', 'vienna', 'united_nations', 'bombing'], {
        certainty: 0.4,
        dateRange: { earliest: at('2016-04-01T00:00:00Z'), latest: at('2016-06-30T23:59:59Z') },
        description:
            'The Accords are signed at the United Nations in Vienna. The signing is bombed, killing King T’Chaka of Wakanda and turning the political dispute into a manhunt.',
    })
    .addKeyframe('2016-05-06T00:00:00Z', 'avengers_split', 1.0, ['schism', 'leipzig', 'civil_war'], {
        certainty: 0.4,
        dateRange: { earliest: at('2016-04-01T00:00:00Z'), latest: at('2016-06-30T23:59:59Z') },
        description:
            'The pro- and anti-Accords factions fight at Leipzig/Halle airport; the team that assembled in 2012 is formally divided.',
        })
    .addReference({
        type: 'RESPONDS_TO',
        targetUniverseId: 'marvel_studios:avengers_age_of_ultron:2015',
        description: 'The Accords are a direct response to the destruction of Sokovia.',
        confidence: 1.0,
        evidence: ['Captain America: Civil War (2016) — the Accords are named for Sokovia.'],
    })
    .withWindowing('phase_based')
    .build();

export const sokoviaAccords2016Universe: Universe = accords;

export { ACCORDS_ID as sokoviaAccordsUniverseId };
