import { CommonUniverseIds } from '../../../core/common-universe-ids';
import {
  KeyframeType,
  RealityAnchor,
  TimePrecision,
  Universe,
  UniverseType,
} from '../../../core/types';
import { UniverseBuilder } from '../../../core/universe-builder';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';
import {
  TropeCategory,
  TropeCollectionMetadata,
  TropeDefinition,
} from './types';

/**
 * 1980s Movie Tropes — the collection container for the decade's defining
 * cinematic conventions (james-gibson/local-time#130).
 *
 * ## What this universe is, and is not
 *
 * It is a **container**, not a work. The guide's hard content rule is "real
 * content only — real events and real works; never invent a universe for content
 * that does not exist". A trope is neither, so it does not get a `universeId` of
 * its own: the tropes are typed data (`metadata.tropes`) inside this one
 * universe, and the real films that canonised them are ordinary film universes
 * (`<studio>:<title>:<year>`) that declare membership of this container.
 *
 * That is containment, one owner / many memberships (james-gibson/local-time#74):
 * *Back to the Future* is owned by the film namespace and is named here as a
 * membership edge — never re-declared. *Ferris Bueller's Day Off* is the anchor
 * for two tropes and is still one universe with one owner.
 *
 * ## Two id corrections to the ticket, both measurable
 *
 * - The container id it proposed, `collection:eighties_movie_tropes:1980-1989`,
 *   is not a valid universe id at all (see the next section).
 * - Every anchor id it proposed, e.g.
 *   `film:universal:back_to_the_future:1985`, has **four** segments. No declared
 *   pattern accepts that shape — only the `ANY_YEAR_TERMINATED` catch-all (#50),
 *   which is why `isValidUniverseId` returns `true` for it and why the catch-all is
 *   not the guard to trust. The film vocabulary is `<studio-token>:<title>:<year>`,
 *   so the anchors below are `columbia:…`, `universal:…` and `paramount:…`; *Back
 *   to the Future* is `universal:back_to_the_future:1985`, renamed in #182 from the
 *   legacy `film:bttf:1985` the film namespace used to own.
 *
 * ## Why the container id is `history:` and not `collection:`
 *
 * `UNIVERSE_ID_PATTERNS` has no `collection` namespace, and
 * `ANY_YEAR_TERMINATED` requires a bare four-digit final segment, so `1980-1989`
 * fails even the catch-all. The container is therefore built through
 * `createHistoricalUniverseId('eighties_movie_tropes', 1980, '1980-1989')` — the
 * same span form every other umbrella container uses (`DIABLO_FRANCHISE`,
 * `TOY_STORY_FRANCHISE`), because a decade-long collection cannot express its run
 * in a `<studio>:<title>:<year>` id and must not claim a distributor it does not
 * have.
 *
 * ## Timestamps
 *
 * Every keyframe here is the **release date of the anchor film**, not a
 * position invented to make the registry happy. The ticket's proposed
 * `Date.UTC(1980 + i)` was fabricated: it spread seven tropes one year apart from
 * 1980, which is neither how the films were released nor what any source says.
 * `anchorReleased` is cross-checked against the anchor film's
 * `metadata.released` by `tropes-registration.test.ts`, so the two cannot drift.
 *
 * ## Research Sources
 *
 * - Wikipedia, "The Karate Kid" (1984) — distributor, release date, runtime
 *   (127 min; BBFC submitted 126:43).
 * - Wikipedia, "Ghostbusters" (1984) — distributor, release date, runtime (105
 *   min; theatrical 105:08).
 * - Wikipedia, "The Breakfast Club" — distributor, US release 1985-02-15,
 *   runtime 97 min.
 * - Wikipedia, "Ferris Bueller's Day Off" — distributor, US release 1986-06-11,
 *   runtime 103 min.
 * - Wikipedia, "Top Gun" — distributor, US release 1986-05-16, runtime 109 min.
 * - Wikipedia, "St. Elmo's Fire (film)" — distributor, release 1985-06-28,
 *   runtime 108 min.
 * - Wikipedia, "Back to the Future" — distributor, release 1985-07-03, runtime
 *   116 min (theatrical 115:51).
 * - Encyclopaedia Britannica, "Brat Pack" — the label, its 1985 origin, and the
 *   *Breakfast Club* / *St. Elmo's Fire* membership criterion.
 * - TV Tropes, "Training Montage" and "Films of the 1980s" — the named
 *   conventions and their 1980s examples.
 *
 * Hierarchical Context: EIGHTIES_MOVIE_TROPES → HOLLYWOOD_SYSTEM → US_HISTORY
 */

/** ISO-8601 -> nanoseconds since the Unix epoch, via the shared helper. */
const ns = (iso: string): bigint => dateToNanoseconds(new Date(iso));

/**
 * The tropes, as data.
 *
 * | trope | anchor film | anchor id |
 * | --- | --- | --- |
 * | training_montage | The Karate Kid (1984) | columbia:the_karate_kid:1984 |
 * | teen_archetype_ensemble | The Breakfast Club (1985) | universal:the_breakfast_club:1985 |
 * | freeze_frame_ending | Ferris Bueller's Day Off (1986) | paramount:ferris_buellers_day_off:1986 |
 * | fourth_wall_break | Ferris Bueller's Day Off (1986) | paramount:ferris_buellers_day_off:1986 |
 * | wisecracking_ensemble | Ghostbusters (1984) | columbia:ghostbusters:1984 |
 * | maverick_ace | Top Gun (1986) | paramount:top_gun:1986 |
 * | modified_vehicle_time_machine | Back to the Future (1985) | universal:back_to_the_future:1985 |
 *
 * The last row is the one that matters for #74: *Back to the Future* is already
 * registered (as `universal:back_to_the_future:1985`, the film's own id since #182),
 * so naming it here is a membership, and this file must never restate its universe.
 */
export const TROPES: readonly TropeDefinition[] = [
  {
    tropeId: 'training_montage',
    name: 'The Training Montage',
    category: TropeCategory.MONTAGE,
    anchorFilmId: 'columbia:the_karate_kid:1984',
    anchorReleased: '1984-06-22',
    anchorKeyframeId: 'canonised_training_montage',
    culturalSignificance: 0.9,
    culturalNote:
      'A recognised named convention rather than a generic device: the music-driven preparation sequence became shorthand for 1980s film grammar, and the anchor is the film most cited for it.',
    description:
      "A wordless, music-driven sequence compressing months of physical preparation into minutes, in which an underdog is rebuilt under a mentor's discipline. The Karate Kid's training sequences are the 1980s reference case: the work is training, the montage is how it is shown.",
    exemplars: [
      {
        universeId: 'columbia:the_karate_kid:1984',
        runtimeKeyframeId: 'training_sequence',
        verified: false,
      },
    ],
  },
  {
    tropeId: 'teen_archetype_ensemble',
    name: 'The Archetype Ensemble',
    category: TropeCategory.CHARACTER,
    anchorFilmId: 'universal:the_breakfast_club:1985',
    anchorReleased: '1985-02-15',
    anchorKeyframeId: 'canonised_teen_archetype_ensemble',
    alsoExhibitedBy: ['columbia:st_elmos_fire:1985'],
    culturalSignificance: 0.95,
    culturalNote:
      "Above 0.9 because the film is the Brat Pack cycle's centre, and the label itself (New York, 1985) is a stable critical category, not a retro-fit. Membership is measured, not asserted: appearing in both The Breakfast Club and St. Elmo's Fire is the usual core criterion (Britannica).",
    description:
      'A cast assembled from labelled social roles — the jock, the brain, the princess, the basket case, the criminal — who are shown to be more than their label while the room keeps assigning it. Canonised by John Hughes in 1985, and the template for the teen ensemble thereafter.',
    exemplars: [
      {
        universeId: 'universal:the_breakfast_club:1985',
        runtimeKeyframeId: 'saturday_detention_begins',
        verified: false,
      },
    ],
  },
  {
    tropeId: 'freeze_frame_ending',
    name: 'The Freeze-Frame Ending',
    category: TropeCategory.STRUCTURAL,
    anchorFilmId: 'paramount:ferris_buellers_day_off:1986',
    anchorReleased: '1986-06-11',
    anchorKeyframeId: 'canonised_freeze_frame_ending',
    alsoExhibitedBy: ['universal:the_breakfast_club:1985'],
    culturalSignificance: 0.85,
    culturalNote:
      'A structural device that became an ending convention across the decade and is still read as an 80s marker; rated below 0.9 because the technique predates and outlives the period, and the anchor is the exemplar rather than the invention.',
    description:
      'The film stops on a held pose, suspending the characters at the instant of their triumph instead of resolving what happens next. The final frame is a still, so the ending is a composition rather than a plot beat.',
    exemplars: [
      {
        universeId: 'paramount:ferris_buellers_day_off:1986',
        runtimeKeyframeId: 'final_frame',
        verified: true,
      },
    ],
  },
  {
    tropeId: 'fourth_wall_break',
    name: 'Direct Address',
    category: TropeCategory.STRUCTURAL,
    anchorFilmId: 'paramount:ferris_buellers_day_off:1986',
    anchorReleased: '1986-06-11',
    anchorKeyframeId: 'canonised_fourth_wall_break',
    culturalSignificance: 0.9,
    culturalNote:
      'The device is not new, but the 1980s slacker-hero film made the protagonist\'s address to camera load-bearing: the audience is recruited as co-conspirator, which is what makes the withholding of the adult world a joke rather than a gap.',
    description:
      'The protagonist speaks straight to camera, recruiting the audience as co-conspirator against the adult world. The narration is not a voice-over aside — the character knows there is a lens, and the film is built on that complicity.',
    exemplars: [
      {
        universeId: 'paramount:ferris_buellers_day_off:1986',
        runtimeKeyframeId: 'opening_address_to_camera',
        verified: false,
      },
    ],
  },
  {
    tropeId: 'wisecracking_ensemble',
    name: 'The Wisecracking Ensemble',
    category: TropeCategory.CHARACTER,
    anchorFilmId: 'columbia:ghostbusters:1984',
    anchorReleased: '1984-06-08',
    anchorKeyframeId: 'canonised_wisecracking_ensemble',
    culturalSignificance: 0.95,
    culturalNote:
      'Above 0.9 because the film redefined what a comedy blockbuster could be — performers deadpanning through a supernatural threat — and its lines became a franchise reflex ("who you gonna call") rather than a period joke.',
    description:
      'A comedy troupe plays straight-faced professionals inside a supernatural or action premise, deadpanning through escalating threat. The joke is the register, not the gag: nobody in the film thinks it is funny.',
    exemplars: [
      {
        universeId: 'columbia:ghostbusters:1984',
        runtimeKeyframeId: 'first_containment_job',
        verified: false,
      },
    ],
  },
  {
    tropeId: 'maverick_ace',
    name: 'The Maverick Ace',
    category: TropeCategory.CHARACTER,
    anchorFilmId: 'paramount:top_gun:1986',
    anchorReleased: '1986-05-16',
    anchorKeyframeId: 'canonised_maverick_ace',
    culturalSignificance: 0.9,
    culturalNote:
      'The highest-grossing film of 1986 and the decade\'s clearest statement of the type: the gifted rule-breaker disciplined for breaking rules and vindicated by them, sold on a synth-anthem soundtrack and accelerated-cut action.',
    description:
      'The reckless-but-gifted prodigy who breaks the rules, is disciplined for it, and is vindicated by it. Inseparable from the synthesised-anthem soundtrack and the accelerated-cut action beat.',
    exemplars: [
      {
        universeId: 'paramount:top_gun:1986',
        runtimeKeyframeId: 'final_dogfight',
        verified: false,
      },
    ],
  },
  {
    tropeId: 'modified_vehicle_time_machine',
    name: 'The Modified-Vehicle Time Machine',
    category: TropeCategory.PREMISE,
    anchorFilmId: 'universal:back_to_the_future:1985',
    anchorReleased: '1985-07-03',
    anchorKeyframeId: 'canonised_modified_vehicle_time_machine',
    culturalSignificance: 0.95,
    culturalNote:
      'Above 0.9 because the premise is the film\'s defining contribution and was absorbed into popular shorthand for time travel; the machine is a consumer object, which is what made the paradox domestic rather than laboratory-bound.',
    description:
      'Time travel delivered by a recognisable consumer object rather than a laboratory: the machine is a car, and the paradox is a teenager\'s problem. Cited here as a membership reference only — the anchor universe is owned by the film namespace and is NOT redefined in this collection.',
    // No exemplar: the film's runtime keyframes were authored for a different
    // purpose (its music and anachronism beats), and this collection may not add
    // keyframes to a universe it does not own. The trope is asserted against the
    // film as a whole.
  },
];

/** Lookup by id, for consumers that hold a trope id and need the record. */
export const TROPES_BY_ID: ReadonlyMap<string, TropeDefinition> = new Map(
  TROPES.map((trope) => [trope.tropeId, trope]),
);

/**
 * Reality anchors: the collection documents real, released works.
 *
 * `relationshipType: 'documents'` and not `'depicts'`: the container asserts the
 * films' release facts and their conventions, and depicts nothing itself. A
 * taxonomy that adds fictional content would have no honest anchor here.
 */
const REALITY_ANCHORS: readonly RealityAnchor[] = TROPES.filter(
  // One anchor per film, not one per trope: Ferris Bueller anchors two tropes.
  (trope, index, all) =>
    all.findIndex((other) => other.anchorFilmId === trope.anchorFilmId) === index,
).map((trope) => ({
  realEventId: trope.anchorFilmId,
  relationshipType: 'documents' as const,
  confidence: 0.95,
  evidence: [
    `The film is a real, released work (${trope.anchorReleased}).`,
    'Release date, distributor and runtime are recorded on the film universe itself.',
  ],
}));

const RESEARCH_SOURCES: readonly string[] = [
  'Wikipedia, "The Karate Kid" (1984) — distributor, release date, runtime',
  'Wikipedia, "Ghostbusters" (1984) — distributor, release date, runtime',
  'Wikipedia, "The Breakfast Club" — distributor, release date, runtime',
  "Wikipedia, \"Ferris Bueller's Day Off\" — distributor, release date, runtime",
  'Wikipedia, "Top Gun" — distributor, release date, runtime',
  "Wikipedia, \"St. Elmo's Fire (film)\" — distributor, release date, runtime",
  'Wikipedia, "Back to the Future" — distributor, release date, runtime',
  'Encyclopaedia Britannica, "Brat Pack" — the label, its 1985 origin, and the two-film membership criterion',
  'TV Tropes, "Training Montage" and "Films of the 1980s" — the named conventions and their 1980s exemplars',
];

const DECADE_START = ns('1980-01-01');
const DECADE_END = ns('1990-01-01');

const containerBuilder = new UniverseBuilder(
  CommonUniverseIds.EIGHTIES_MOVIE_TROPES,
  UniverseType.ABSTRACT_CONCEPT,
)
  .withCanonicalName('1980s Movie Tropes')
  .withAliases(['80s movie tropes', 'eighties film grammar', 'eighties_movie_tropes'])
  .withDescription(
    'A taxonomy of the cinematic conventions canonised by 1980s Hollywood, and the real films that anchor them. ' +
      'The container holds the trope registry; the films are separately owned universes that declare membership of it.',
  )
  // Documentary at degree 0.0: the container adds no fictional content. The films
  // are real works, and their fictionality lives on their own universes, never here.
  .withRealityRelation('documentary', 0.0, [...REALITY_ANCHORS])
  .withSources([...RESEARCH_SOURCES])
  .withUsageRestrictions([
    'No still images, no verbatim screenplay or dialogue, no footage excerpts.',
    'Trope names are descriptive cultural categories, not trademarks to be used commercially.',
    'Cite the anchor film for any exemplar moment; this record is a taxonomy, not a source for the work.',
  ])
  .withTags(['film', 'trope', 'taxonomy', '1980s', 'hollywood', 'collection'])
  .withReleased('1980-01-01')
  .withCulturalSignificance(
    0.85,
    'The 1980s canon is a recognised, self-conscious style period, and "80s movie tropes" is a stable critical category ' +
      'rather than a marketing retro-fit. Rated below 0.9 because a taxonomy of conventions is a lens on the works, ' +
      'not itself a defining work.',
  )
  .addEpoch('decade_layer', 'epoch:1980s_film_tropes:1980-1989', {
    epochId: 'epoch:1980s_film_tropes:1980-1989',
    startTime: DECADE_START,
    endTime: DECADE_END,
    precision: TimePrecision.YEAR,
    description:
      'The 1980s theatrical release window in which these conventions were set. Precision is YEAR: the decade is not a dated event.',
  })
  .addSegment(
    'early_80s',
    DECADE_START,
    ns('1984-01-01'),
    'phase',
    'The early decade: the conventions are formed (Ghostbusters, The Karate Kid, 1984).',
  )
  .addSegment(
    'mid_80s',
    ns('1984-01-01'),
    ns('1987-01-01'),
    'phase',
    'The middle of the decade: the teen ensemble and the slacker-hero film are codified (1985-86).',
  )
  .addSegment(
    'late_80s',
    ns('1987-01-01'),
    DECADE_END,
    'phase',
    'The late decade: the conventions are recycled and the period closes.',
  )
  .withWindowing('phase_based');

// One keyframe per trope, dated to its anchor film's release — never to an
// invented year. `KeyframeType.RELEASE` says what the date means.
for (const trope of TROPES) {
  containerBuilder.addDateKeyframe(
    trope.anchorReleased,
    trope.anchorKeyframeId,
    trope.culturalSignificance,
    ['trope', trope.category, 'canonising_release'],
    {
      type: KeyframeType.RELEASE,
      certainty: 1,
      description: `${trope.name}: canonised by the release of ${trope.anchorFilmId}.`,
    },
  );
}

/** The container universe. The registry goes on `metadata.tropes`, typed below. */
export const eightiesMovieTropesUniverse: Universe = containerBuilder.build();

const containerMetadata = eightiesMovieTropesUniverse.metadata as TropeCollectionMetadata;
containerMetadata.tropes = TROPES;
