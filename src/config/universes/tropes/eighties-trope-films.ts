import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { Universe } from '../../../core/types';
import { FilmSpec, createFilmUniverse } from '../films';
import { TROPES } from './eighties-movie-tropes';
import { TropeExemplar, TropeFilmMetadata } from './types';

/**
 * The real films that anchor the 1980s tropes collection
 * (james-gibson/local-time#130).
 *
 * ## Only the films this collection *owns*
 *
 * *Back to the Future* is deliberately absent. It is already registered as
 * `film:bttf:1985` by the film namespace, and it anchors
 * `modified_vehicle_time_machine` as a **membership**, not a second definition —
 * the exact case the guide says should signal "stop, model containment" (#74).
 * Restating its id here would put a duplicate in `allUniverses` and hand the
 * registry two owners for one film.
 *
 * ## What is authored, and what is derived
 *
 * The prose and the numbers that need a source are authored in each `FilmSpec`
 * below. What must agree with something else is derived, so it cannot disagree:
 *
 * - the id, the studio container and the `DISTRIBUTED_BY` reference all come
 *   from the one `studio` token (`createFilmUniverse`, james-gibson/local-time#115);
 * - the trope memberships in `metadata.tropes` are authored per film **and**
 *   cross-checked against the registry in `tropes-registration.test.ts`, so a
 *   trope that is added to one side and not the other fails the suite;
 * - the exemplar pointers are read from the registry rather than copied, so a
 *   runtime keyframe is named in exactly one place.
 *
 * ## Runtime positions
 *
 * The act cuts are **structural judgements**, not frame-exact positions: no
 * source used here timestamps the act breaks. Every moment whose minute is an
 * estimate carries the `approximate_position` tag, and no moment is claimed for
 * a film whose beats the sources do not document (see *St. Elmo's Fire*).
 * `TropeExemplar.verified` is `false` for every estimate: an unverified exemplar
 * says "this film has the moment", never "the moment is at minute N".
 *
 * Research Sources (per film, three or more):
 * - Wikipedia film entries — distributor, release date, runtime, credited cast
 *   and crew.
 * - BBFC classification entries — submitted theatrical runtime.
 * - Roger Ebert, Chicago Sun-Times reviews — contemporary critical reception.
 * - Encyclopaedia Britannica, "Brat Pack" — the *Breakfast Club* / *St. Elmo's
 *   Fire* membership criterion.
 *
 * Hierarchical Context: each film → its `film_studio:` container and
 * HOLLYWOOD_SYSTEM → EIGHTIES_MOVIE_TROPES.
 */

/** Every exemplar pointer the registry records for one film. */
const exemplarsFor = (universeId: string): TropeExemplar[] =>
  TROPES.flatMap((trope) =>
    (trope.exemplars ?? [])
      .filter((exemplar) => exemplar.universeId === universeId)
      .map((exemplar) => ({ ...exemplar })),
  );

/**
 * The collection every film below is a member of.
 *
 * Declared as a container on the *child* (`containers`, which the factory writes
 * to `connections.natural.parentUniverses`) rather than by listing the films on
 * the container. Containment is declared by the member, so one owner / many
 * memberships holds and the container never restates a child's id (#74).
 */
const CONTAINER = CommonUniverseIds.EIGHTIES_MOVIE_TROPES;

/**
 * Attach the trope memberships to the film's own metadata.
 *
 * The membership is declared for the film (its owner) rather than restated on
 * the container, which is one owner / many memberships (#74). The exemplars are
 * derived, so the runtime keyframe id is never typed twice.
 */
const withTropes = (universe: Universe, tropeIds: readonly string[]): Universe => {
  const metadata = universe.metadata as TropeFilmMetadata;
  metadata.tropes = tropeIds;
  const exemplars = exemplarsFor(universe.universeId as string);
  if (exemplars.length > 0) metadata.tropeExemplars = exemplars;
  return universe;
};

interface TropeFilm {
  spec: FilmSpec;
  /** tropeIds this film anchors or exhibits. Cross-checked against the registry. */
  tropeIds: readonly string[];
}

const TROPE_FILMS: readonly TropeFilm[] = [
  {
    tropeIds: ['training_montage'],
    spec: {
      studio: 'columbia',
      slug: 'the_karate_kid',
      year: 1984,
      title: 'The Karate Kid',
      aliases: ['The Karate Kid (1984)', 'Karate Kid'],
      runtimeMinutes: 127,
      containers: [CONTAINER],
      realityRelation: {
        type: 'pure_fiction',
        fictionalizationDegree: 1.0,
        // The work is real; Daniel LaRusso and Miyagi are invented, and no
        // reality anchor may imply otherwise. There is no "based on a true
        // story" claim to anchor.
        anchors: [],
      },
      copyright: {
        holders: ['Columbia Pictures'],
        year: 1984,
        status: 'active',
      },
      creators: {
        director: ['John G. Avildsen'],
        writer: ['Robert Mark Kamen'],
      },
      usageRestrictions: [
        'Copyrighted. No stills, dialogue, screenplay text or footage excerpts.',
        'Use as the anchor for the training-montage trope; do not treat the film as a documentary about karate.',
      ],
      sources: [
        'Wikipedia, "The Karate Kid" (1984) — distributor Columbia Pictures, release 1984-06-22, runtime 127 min',
        'BBFC classification entry — submitted theatrical runtime 126:43, released print 127 min',
        'Roger Ebert, Chicago Sun-Times review (1984) — contemporary reception',
      ],
      released: '1984-06-22',
      culturalSignificance: 0.9,
      culturalNote:
        'Codified the training montage as 1980s film grammar and launched a franchise; rated at the top of the 0.85-0.94 "significant cultural impact within domain" band rather than above 0.9, because its influence is generic (the montage) rather than film-defining.',
      description:
        "John G. Avildsen's story of Daniel LaRusso, taught karate by the handyman Miyagi, whose training sequences became the decade's reference case for the music-driven preparation montage.",
      tags: ['film', '1980s', 'sports', 'coming_of_age', 'karate', 'training_montage'],
      acts: [
        {
          id: 'act_i',
          endsAtMinute: 40,
          description:
            "Daniel and his mother arrive in Reseda; the Cobra Kai harassment begins and Miyagi intervenes. (Cut point is a structural judgement, not a sourced timestamp.)",
        },
        {
          id: 'act_ii',
          endsAtMinute: 100,
          description:
            'The training: Miyagi agrees to teach Daniel, and the preparation sequences carry the film. (Structural judgement.)',
        },
        {
          id: 'act_iii',
          endsAtMinute: 127,
          description:
            'The All-Valley Tournament: the crane kick and the resolution. (Structural judgement.)',
        },
      ],
      moments: [
        {
          id: 'training_sequence',
          minute: 55,
          significance: 0.9,
          tags: ['training_montage', 'montage', 'approximate_position'],
          description:
            "The training sequences: wax-on/wax-off and the physical preparation montage, where the underdog is rebuilt under Miyagi's discipline. The minute is an estimate, not a sourced cue-in — hence `approximate_position`.",
        },
        {
          id: 'crane_kick_final',
          minute: 126,
          significance: 0.95,
          tags: ['climax', 'tournament', 'approximate_position'],
          description:
            'The final of the All-Valley Tournament: the crane kick decides the match. Placed in the last minute of the runtime; the exact second is not sourced here.',
        },
      ],
    },
  },
  {
    tropeIds: ['teen_archetype_ensemble', 'freeze_frame_ending'],
    spec: {
      studio: 'universal',
      slug: 'the_breakfast_club',
      year: 1985,
      title: 'The Breakfast Club',
      aliases: ['The Breakfast Club (1985)', 'Breakfast Club'],
      runtimeMinutes: 97,
      containers: [CONTAINER],
      realityRelation: {
        type: 'pure_fiction',
        fictionalizationDegree: 1.0,
        anchors: [],
      },
      copyright: {
        holders: ['Universal Pictures', 'A&M Films'],
        year: 1985,
        status: 'active',
      },
      creators: {
        director: ['John Hughes'],
        writer: ['John Hughes'],
      },
      usageRestrictions: [
        'Copyrighted. No stills, dialogue, screenplay text or footage excerpts.',
        'The Brat Pack label is a critical category, not a contractual credit.',
      ],
      sources: [
        'Wikipedia, "The Breakfast Club" — distributor Universal Pictures, US release 1985-02-15 (LA premiere 1985-02-07), runtime 97 min',
        'BBFC classification entry — submitted theatrical runtime 97:03',
        'Roger Ebert, Chicago Sun-Times review (1985) — contemporary reception',
        'Encyclopaedia Britannica, "Brat Pack" — the label and its 1985 origin',
      ],
      released: '1985-02-15',
      culturalSignificance: 0.95,
      culturalNote:
        'Above 0.9 because it is the centre of the Brat Pack cycle and the template for the labelled-ensemble teen film: the five roles are still how the genre is described, and the label itself is a stable critical category (Britannica) rather than a marketing retro-fit.',
      description:
        "John Hughes's single-day film: five students from different social groups spend Saturday detention together, are assigned one essay, and discover that the labels they arrived with do not survive the day.",
      tags: ['film', '1980s', 'teen', 'coming_of_age', 'ensemble', 'brat_pack'],
      acts: [
        {
          id: 'act_i',
          endsAtMinute: 22,
          description:
            'The drop-off: five students, one detention, and the roles they perform for each other. (Structural judgement.)',
        },
        {
          id: 'act_ii',
          endsAtMinute: 78,
          description:
            'The day in the library: the confessions, the confrontation, and the breaking of the labels. (Structural judgement.)',
        },
        {
          id: 'act_iii',
          endsAtMinute: 97,
          description:
            'The essay and the departure: the group reforms into its old roles, then the fist raised to the sky. (Structural judgement.)',
        },
      ],
      moments: [
        {
          id: 'saturday_detention_begins',
          minute: 2,
          significance: 0.8,
          tags: ['ensemble', 'archetypes', 'approximate_position'],
          description:
            'Saturday detention begins and the five social roles are introduced in one room — jock, brain, princess, basket case, criminal. The minute is an estimate.',
        },
        {
          id: 'final_frame',
          minute: 97,
          significance: 0.95,
          tags: ['ending', 'freeze_frame_ending'],
          description:
            "The closing freeze-frame: Bender's fist raised to the sky as the film stops on a held pose, with the essay voice-over landing over it. The final frame is structurally the last frame, not an estimate.",
        },
      ],
    },
  },
  {
    tropeIds: ['freeze_frame_ending', 'fourth_wall_break'],
    spec: {
      studio: 'paramount',
      slug: 'ferris_buellers_day_off',
      year: 1986,
      title: "Ferris Bueller's Day Off",
      aliases: ['Ferris Buellers Day Off', 'Ferris Bueller'],
      runtimeMinutes: 103,
      containers: [CONTAINER],
      realityRelation: {
        type: 'pure_fiction',
        fictionalizationDegree: 1.0,
        anchors: [],
      },
      copyright: {
        holders: ['Paramount Pictures'],
        year: 1986,
        status: 'active',
      },
      creators: {
        director: ['John Hughes'],
        writer: ['John Hughes'],
      },
      usageRestrictions: [
        'Copyrighted. No stills, dialogue, screenplay text or footage excerpts.',
        'The direct-address device is described, never quoted.',
      ],
      sources: [
        'Wikipedia, "Ferris Bueller\'s Day Off" — distributor Paramount Pictures, US release 1986-06-11, runtime 103 min',
        'BBFC classification entry — submitted theatrical runtime',
        'Roger Ebert, Chicago Sun-Times review (1986) — contemporary reception',
      ],
      released: '1986-06-11',
      culturalSignificance: 0.95,
      culturalNote:
        'Above 0.9 because the film is the decade\'s definitive slacker-hero text and the anchor for two separate structural conventions (direct address and the freeze-frame ending), both of which are still read as 80s markers.',
      description:
        "John Hughes's day off: Ferris Bueller fakes illness, takes his girlfriend and his best friend into Chicago, and narrates the whole thing straight to camera while the school principal hunts him.",
      tags: ['film', '1980s', 'comedy', 'teen', 'slacker', 'fourth_wall', 'freeze_frame'],
      acts: [
        {
          id: 'act_i',
          endsAtMinute: 33,
          description:
            'The deception: the fake illness, the direct address that recruits the audience, and the borrow of the car. (Structural judgement.)',
        },
        {
          id: 'act_ii',
          endsAtMinute: 80,
          description:
            'The day in Chicago: the parade, the museum, and Rooney closing in. (Structural judgement.)',
        },
        {
          id: 'act_iii',
          endsAtMinute: 103,
          description:
            'The return and the freeze-frame: the car is destroyed, the day is survived, and the film stops on a held pose. (Structural judgement.)',
        },
      ],
      moments: [
        {
          id: 'opening_address_to_camera',
          minute: 1,
          significance: 0.9,
          tags: ['fourth_wall_break', 'direct_address', 'approximate_position'],
          description:
            'Ferris speaks straight to camera, establishing the audience as co-conspirator for the rest of the film. The minute is an estimate; the device, not its cue-in, is the claim.',
        },
        {
          id: 'final_frame',
          minute: 103,
          significance: 0.95,
          tags: ['ending', 'freeze_frame_ending'],
          description:
            'The film stops on a held pose — the freeze-frame ending — rather than resolving what happens next. The final frame is structurally the last frame.',
        },
      ],
    },
  },
  {
    tropeIds: ['wisecracking_ensemble'],
    spec: {
      studio: 'columbia',
      slug: 'ghostbusters',
      year: 1984,
      title: 'Ghostbusters',
      aliases: ['Ghostbusters (1984)', 'Ghost Busters'],
      runtimeMinutes: 105,
      containers: [CONTAINER],
      realityRelation: {
        type: 'pure_fiction',
        fictionalizationDegree: 1.0,
        anchors: [],
      },
      copyright: {
        holders: ['Columbia Pictures'],
        year: 1984,
        status: 'active',
      },
      creators: {
        director: ['Ivan Reitman'],
        writer: ['Dan Aykroyd', 'Harold Ramis'],
      },
      usageRestrictions: [
        'Copyrighted. No stills, dialogue, screenplay text or footage excerpts.',
        'The franchise marks are Columbia/Sony properties; this record is criticism and indexing only.',
      ],
      sources: [
        'Wikipedia, "Ghostbusters" (1984) — distributor Columbia Pictures, release 1984-06-08, runtime 105 min (theatrical 105:08)',
        'BBFC classification entry — submitted theatrical runtime',
        'Roger Ebert, Chicago Sun-Times review (1984) — contemporary reception',
      ],
      released: '1984-06-08',
      culturalSignificance: 0.95,
      culturalNote:
        'Above 0.9 because it established the template for the comedy blockbuster built on a deadpan ensemble, was a cultural phenomenon on release, and its lines became a franchise reflex rather than a period joke.',
      description:
        'Three parapsychologists lose their university funding, start a ghost-removal business in New York, and deadpan their way through an escalating supernatural threat until the city itself is at stake.',
      tags: ['film', '1980s', 'comedy', 'supernatural', 'ensemble', 'blockbuster'],
      acts: [
        {
          id: 'act_i',
          endsAtMinute: 38,
          description:
            'The setup: the university dismissal, the firehouse, and the first containment jobs. (Structural judgement.)',
        },
        {
          id: 'act_ii',
          endsAtMinute: 85,
          description:
            'The business takes off and the threat escalates: Dana\'s apartment, the EPA, and the containment unit. (Structural judgement.)',
        },
        {
          id: 'act_iii',
          endsAtMinute: 105,
          description:
            'The climax: the Stay Puft Marshmallow Man and the choice of the destructor form. (Structural judgement.)',
        },
      ],
      moments: [
        {
          id: 'first_containment_job',
          minute: 30,
          significance: 0.8,
          tags: ['ensemble', 'deadpan', 'approximate_position'],
          description:
            'The first hotel containment job: the ensemble plays professionals straight-faced while the situation is absurd — the register the trope names. The minute is an estimate.',
        },
        {
          id: 'stay_puft_climax',
          minute: 95,
          significance: 0.95,
          tags: ['climax', 'approximate_position'],
          description:
            'The Stay Puft Marshmallow Man arrives and the team chooses the form of the destructor. The minute is an estimate; the sequence, not its cue-in, is the claim.',
        },
      ],
    },
  },
  {
    tropeIds: ['maverick_ace'],
    spec: {
      studio: 'paramount',
      slug: 'top_gun',
      year: 1986,
      title: 'Top Gun',
      aliases: ['Top Gun (1986)'],
      runtimeMinutes: 109,
      containers: [CONTAINER],
      realityRelation: {
        type: 'pure_fiction',
        fictionalizationDegree: 1.0,
        // A fictional story in a real institution. The Navy cooperated with
        // production, which is a production fact, not an anchor: the characters
        // and the mission are invented, and no anchor may imply otherwise.
        anchors: [],
      },
      copyright: {
        holders: ['Paramount Pictures', 'Don Simpson/Jerry Bruckheimer Films'],
        year: 1986,
        status: 'active',
      },
      creators: {
        director: ['Tony Scott'],
        writer: ['Jim Cash', 'Jack Epps Jr.'],
      },
      usageRestrictions: [
        'Copyrighted. No stills, dialogue, screenplay text or footage excerpts.',
        'The US Navy cooperation is recorded as a production fact, not as an accuracy claim.',
      ],
      sources: [
        'Wikipedia, "Top Gun" — distributor Paramount Pictures, US release 1986-05-16 (NYC premiere 1986-05-12), runtime 109 min',
        'BBFC classification entry — submitted theatrical runtime',
        'Roger Ebert, Chicago Sun-Times review (1986) — contemporary reception',
      ],
      released: '1986-05-16',
      culturalSignificance: 0.9,
      culturalNote:
        'The highest-grossing film of 1986 and the decade\'s clearest statement of the maverick-ace type, inseparable from its synth-anthem soundtrack; rated at the top of the 0.85-0.94 band because its influence is generic (the type and the action beat) rather than film-defining.',
      description:
        'A Navy fighter pilot with a reckless instinct is sent to the Top Gun school, is disciplined for the instinct, and is vindicated by it in the final engagement.',
      tags: ['film', '1980s', 'action', 'aviation', 'maverick', 'blockbuster'],
      acts: [
        {
          id: 'act_i',
          endsAtMinute: 35,
          description:
            'The setup: the invitation to Top Gun and the rivalry that defines the protagonist. (Structural judgement.)',
        },
        {
          id: 'act_ii',
          endsAtMinute: 80,
          description:
            'The school: the training accidents, the loss, and the discipline that follows. (Structural judgement.)',
        },
        {
          id: 'act_iii',
          endsAtMinute: 109,
          description:
            'The final engagement: the instinct is vindicated and the survivor returns. (Structural judgement.)',
        },
      ],
      moments: [
        {
          id: 'opening_credits',
          minute: 0,
          significance: 0.8,
          tags: ['opening', 'title_sequence', 'synth_anthem'],
          description:
            'The opening title sequence on the carrier deck: the accelerated-cut, synth-anthem grammar the film is remembered for. The first frame is structurally the opening, not an estimate.',
        },
        {
          id: 'final_dogfight',
          minute: 100,
          significance: 0.95,
          tags: ['climax', 'approximate_position'],
          description:
            'The final dogfight: the maverick instinct that was disciplined is what wins the engagement. The minute is an estimate.',
        },
      ],
    },
  },
  {
    tropeIds: ['teen_archetype_ensemble'],
    spec: {
      studio: 'columbia',
      slug: 'st_elmos_fire',
      year: 1985,
      title: "St. Elmo's Fire",
      aliases: ['St. Elmos Fire', "St Elmo's Fire"],
      runtimeMinutes: 108,
      containers: [CONTAINER],
      realityRelation: {
        type: 'pure_fiction',
        fictionalizationDegree: 1.0,
        anchors: [],
      },
      copyright: {
        holders: ['Columbia Pictures'],
        year: 1985,
        status: 'active',
      },
      creators: {
        director: ['Joel Schumacher'],
        writer: ['Joel Schumacher', 'Carl Kurlander'],
      },
      usageRestrictions: [
        'Copyrighted. No stills, dialogue, screenplay text or footage excerpts.',
        'Included as the second film in the Brat Pack membership criterion, not as a trope anchor.',
      ],
      sources: [
        'Wikipedia, "St. Elmo\'s Fire (film)" — distributor Columbia Pictures, release 1985-06-28, runtime 108 min',
        'BBFC classification entry — submitted theatrical runtime',
        'Roger Ebert, Chicago Sun-Times review (1985) — contemporary reception',
        'Encyclopaedia Britannica, "Brat Pack" — the two-film membership criterion',
      ],
      released: '1985-06-28',
      culturalSignificance: 0.8,
      culturalNote:
        'Notable rather than defining: it is one of the two films that the Brat Pack label is measured against, but the ensemble convention is canonised by The Breakfast Club, and this film is recorded as an exhibition, not an anchor.',
      description:
        'Seven Georgetown graduates enter adult life in Washington, D.C., and find that the friendships that organised their student years do not survive the transition intact.',
      tags: ['film', '1980s', 'drama', 'ensemble', 'brat_pack'],
      acts: [
        {
          id: 'act_i',
          endsAtMinute: 34,
          description:
            'The group is introduced after graduation, and each member\'s post-university life is established. (Structural judgement.)',
        },
        {
          id: 'act_ii',
          endsAtMinute: 82,
          description:
            'The friendships strain: the affairs, the jobs, and the mismatch between ambition and outcome. (Structural judgement.)',
        },
        {
          id: 'act_iii',
          endsAtMinute: 108,
          description:
            'The group confronts what it has become, and the film ends on the distance between them. (Structural judgement.)',
        },
      ],
      // No runtime moment is claimed. The sources used here document the film's
      // release, cast and runtime — not its beats — and an invented cue-in would
      // be fabricated data. The absence is the fact (the same rule #150 applies to
      // undocumented narrative domains).
      moments: [],
    },
  },
];

/**
 * The anchor films this collection owns.
 *
 * *Back to the Future* is not in this array — see the file header.
 */
export const eightiesTropeFilmUniverses: Universe[] = TROPE_FILMS.map(({ spec, tropeIds }) =>
  withTropes(createFilmUniverse(spec), tropeIds),
);

/** The collection id every film above is a member of. */
export const TROPES_CONTAINER_ID = CommonUniverseIds.EIGHTIES_MOVIE_TROPES;
