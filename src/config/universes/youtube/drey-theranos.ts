import {
  KeyframeType,
  TimePrecision,
  UniverseType,
} from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { creatorRefs } from '../../../core/creators';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * Theranos Isn't About Elizabeth Holmes. — The Drey Dossier (2026).
 *
 * A 46:35 investigative video essay. Its received subject is the Theranos fraud;
 * its argument is that the fraud is the smaller half of the story. The patents that
 * secured Theranos's last loan passed through Fortress, SoftBank, Labrador and Golden
 * Diagnostics; the company's blood-testing architecture was built to feed a database,
 * not to run a machine; and a version of that architecture is now argued to sit inside
 * the Stargate LLC consortium, whose underwriters include Oracle, SoftBank and MGX.
 *
 * THE WORK IS THE UNIT. This record models the video, not the history it argues about.
 * Every keyframe is addressed on the video's own clock, at publication + offset, and
 * every description is what the work says at that point — not a free-standing claim
 * about Theranos. The history is carried in `attribution.sources` and in the keyframe
 * `certainty` values; it is not asserted here as ground truth.
 *
 * ID: `series:theranos_isnt_about_elizabeth_holmes:2026`. `series:` is the namespace the
 * two existing YouTube works use (`youtube/beck-responder-clocks.ts`), because
 * `UniverseType` has no documentary or video-essay member and `doc:` is not a declared
 * namespace — an id in it would only validate through `ANY_YEAR_TERMINATED`
 * (james-gibson/local-time#57). The id is produced by `createSeriesUniverseId` and
 * guarded by `isSeriesUniverseId` in the test, not merely by `isValidUniverseId`.
 *
 * TIME BASE. YouTube reports `lengthSeconds: 2795` — 46:35 — and
 * `uploadDate: 2026-10-24T14:32:58-07:00` (= 21:32:58Z). The ticket's 46:31 is the last
 * transcript cue, not the end of the video, so the publication epoch is 2795 s and the
 * final segment ends there. Keyframes are absolute instants inside that epoch, the
 * pattern `openttd/master-hellish-ai-vs-community.ts` established; they are NOT
 * nanoseconds from zero, which is the zero-reference model used for a clip addressed on
 * a parent clock.
 *
 * REALITY RELATION. `documentary` at 0.0 fictionalization. Nothing in the work is
 * invented, but two of its claims are the author's reading and are recorded as such:
 * C-12, the continuity thesis, is tagged `thesis` and scored at its own certainty
 * (`THESIS_CLAIM_CERTAINTY`), never above it; C-13, that Ellison sat on the Theranos
 * board, is carried in `metadata.disputedClaims` at 0.4 with its contradiction. An
 * internal inconsistency (C-14, "first full day" vs "second day in office") is recorded
 * verbatim in `metadata.deviations` rather than normalised away.
 *
 * NO REALITY ANCHORS YET. Every subject this work documents — Theranos, the CIA STAR
 * GATE programme, BioWatch, the Stargate LLC consortium — is unregistered in this
 * corpus. A `realAnchor` to an invented id is a permanent dangling edge
 * (james-gibson/local-time#112 §11.5, #129), so the evidence lives in
 * `attribution.sources` until the historical universes exist. The test asserts that any
 * anchor added later resolves.
 *
 * CONTAINMENT. One owner, many memberships (#74): the work is a member of the US history
 * and US government containers because its subject matter is a US company, US courts and
 * US biodefence policy. `CommonUniverseIds` members are containers, not registered works,
 * which is what the registry folds them into.
 *
 * Sources: the video `youtube:PgWNQH4FWNI` (title, author, duration and publication from
 * YouTube metadata and the oEmbed endpoint, retrieved 2026-10-25); the Substack mirror;
 * and the primary documents the work relies on, listed in `attribution.sources`.
 */

/** The work's id. `createSeriesUniverseId('series', SLUG, 2026)` produces this string. */
export const DREY_THERANOS_UNIVERSE_ID =
  'series:theranos_isnt_about_elizabeth_holmes:2026';

/** Publication instant: 2026-10-24T14:32:58-07:00 == 2026-10-24T21:32:58Z. */
export const DREY_THERANOS_PUBLISHED = dateToNanoseconds(
  new Date('2026-10-24T21:32:58Z'),
);

/** YouTube `lengthSeconds`. 2795 s = 46:35. */
export const DREY_THERANOS_RUNTIME_SECONDS = 2795;

const NS_PER_SECOND = 1_000_000_000n;

/** A runtime offset on the video's own clock: publication instant + mm:ss. */
const at = (minutes: number, seconds = 0): bigint =>
  DREY_THERANOS_PUBLISHED +
  BigInt(minutes * 60 + seconds) * NS_PER_SECOND;

/* ------------------------------------------------------------------ *
 * Claim certainties that the keyframes carry, and the thesis derivation
 * ------------------------------------------------------------------ */

/**
 * C-12 — the work's unifying thesis: the machine was never the point, the system was
 * built to collect blood and feed a database, and that architecture now sits inside the
 * Stargate consortium. This is the author's inference from the documents, not a
 * documented fact, so it is scored at 0.55 and never above it.
 */
export const THESIS_CLAIM_CERTAINTY = 0.55;

/**
 * A thesis keyframe's significance is not authored independently of its inputs.
 *
 * Significance answers "how much of the work turns on this", certainty answers "how sure
 * is the work". The thesis frames are the organising claims, so their *importance* is
 * high, but they rest entirely on an inference; allowing them to inherit a documented
 * fact's weight is what makes an argument look like evidence. The score is therefore the
 * mean certainty of the claims the thesis depends on, capped at the thesis's own
 * certainty — an input, not a hand-set number.
 *
 * Test pin: every `thesis` keyframe is `< 0.9` and `<= THESIS_CLAIM_CERTAINTY`.
 */
export const thesisSignificance = (...supportingCertainties: number[]): number => {
  if (supportingCertainties.length === 0) return 0;
  const mean =
    supportingCertainties.reduce((total, value) => total + value, 0) /
    supportingCertainties.length;
  return Math.min(mean, THESIS_CLAIM_CERTAINTY);
};

/* ------------------------------------------------------------------ *
 * The roster — who the work names, in what role, and when
 * ------------------------------------------------------------------ */

/** A person the work names, with the role the argument gives them. Not a credit. */
export interface NamedSubject {
  /** Display name, as the work uses it. */
  name: string;
  /** The part the person plays *in the argument*, not a production credit. */
  role: string;
  /** Runtime offset of the first mention, in seconds from 0:00. */
  firstMentionSeconds: number;
}

/**
 * 21 named people, with the runtime second of their first mention.
 *
 * This is deliberately NOT `attribution.creators`: only The Drey Dossier is credited.
 * Filing a Theranos director or a former secretary of state as a `participant` would
 * assert an involvement in the work that does not exist. `metadata.people` is the
 * roster of subjects; the credits stay in `attribution.creators`, and the distinction is
 * the #148 person-keyed rule applied to a documentary.
 */
export const dreyTheranosPeople: NamedSubject[] = [
  { name: 'Elizabeth Holmes', role: 'Theranos founder and CEO; chairman during the 2018 database handover', firstMentionSeconds: 2 },
  { name: 'Sunny Balwani', role: 'Theranos president and COO; Holmes\'s co-defendant', firstMentionSeconds: 18 },
  { name: 'Sam Altman', role: 'OpenAI; Stargate principal', firstMentionSeconds: 30 },
  { name: 'Larry Ellison', role: 'Oracle founder; Theranos early investor via Tako Ventures; a Stargate principal', firstMentionSeconds: 87 },
  { name: 'Donald Trump', role: 'US president; announced Stargate LLC in the Roosevelt Room', firstMentionSeconds: 92 },
  { name: 'Masayoshi Son', role: 'SoftBank CEO; Stargate chairman', firstMentionSeconds: 175 },
  { name: 'Andrea Gothing', role: 'Fortress executive; signed both sides of the 2023 Labrador→Golden patent assignment', firstMentionSeconds: 233 },
  { name: 'John Carreyrou', role: 'Wall Street Journal reporter; author of Bad Blood', firstMentionSeconds: 401 },
  { name: 'Rupert Murdoch', role: 'News Corp; Theranos\'s largest investor at $125M, and Carreyrou\'s ultimate employer', firstMentionSeconds: 566 },
  { name: 'David Boies', role: 'Theranos attorney; named among those the work says were wronged', firstMentionSeconds: 939 },
  { name: 'Don Lucas', role: 'Theranos chairman, as discussed in Bad Blood', firstMentionSeconds: 963 },
  { name: 'George Shultz', role: 'Former Secretary of State; Theranos board member from 2011', firstMentionSeconds: 1008 },
  { name: 'Henry Kissinger', role: 'Former Secretary of State; Theranos board member', firstMentionSeconds: 1010 },
  { name: 'William Perry', role: 'Former Secretary of Defense; Theranos board member; controlled Pentagon research funding for STAR GATE by 1980', firstMentionSeconds: 1012 },
  { name: 'Sam Nunn', role: 'Former chair, Senate Armed Services Committee; Theranos board member', firstMentionSeconds: 1021 },
  { name: 'Gary Roughead', role: 'Admiral, former Chief of Naval Operations; Theranos board member', firstMentionSeconds: 1025 },
  { name: 'James Mattis', role: 'General; Theranos board member; proposed deploying the devices at Bagram', firstMentionSeconds: 1029 },
  { name: 'Pat Price', role: 'STAR GATE remote viewer, the programme\'s "star pupil"', firstMentionSeconds: 1146 },
  { name: 'Joshua Lederberg', role: 'Nobel laureate and Rockefeller University president; bioweapons alarm-raiser and Ellison\'s friend', firstMentionSeconds: 1585 },
  { name: 'Philip Simon', role: 'Ellison\'s money manager; Tako Ventures; Quark chairman', firstMentionSeconds: 1793 },
  { name: 'Bruce Ivins', role: 'Fort Detrick scientist; the FBI\'s anthrax-letters suspect, who died before charge', firstMentionSeconds: 1965 },
];

/* ------------------------------------------------------------------ *
 * The universe
 * ------------------------------------------------------------------ */

export const dreyTheranosUniverse = {
  universeId: DREY_THERANOS_UNIVERSE_ID,
  type: UniverseType.SERIES,

  identifiers: {
    primary: DREY_THERANOS_UNIVERSE_ID,
    aliases: [
      'Theranos Isn\'t About Elizabeth Holmes.',
      'Theranos isn\'t about Elizabeth Holmes.',
      'The Drey Dossier — Theranos Isn\'t About Elizabeth Holmes.',
      'youtube:PgWNQH4FWNI',
    ],
  },

  realityRelation: {
    type: 'documentary' as const,
    // Nothing is invented. The interpretive weight is carried by the thesis
    // keyframes' certainty and by metadata.disputedClaims, not by this number.
    fictionalizationDegree: 0.0,
    // Deliberately empty: no subject of this work is registered yet, and an anchor to
    // an invented id is a dangling edge. See the header note.
    realityAnchors: [],
  },

  attribution: {
    copyright: {
      holders: ['The Drey Dossier'],
      year: 2026,
      status: 'active' as const,
    },
    // One maker, three roles — `creatorRefs` keys by person, so this is one entry.
    creators: creatorRefs({
      writer: ['The Drey Dossier'],
      producer: ['The Drey Dossier'],
      researcher: ['The Drey Dossier'],
    }),
    citations_required: true,
    public_domain: false,
    usage_restrictions: [
      'Copyrighted video essay. Link and short quotation only; do not redistribute the transcript in bulk.',
      'Creator credit "The Drey Dossier" must accompany any embedded keyframe description.',
      'Embedded third-party footage (White House pool, Oracle archival, broadcast clips) retains its own rights; US government-produced material is public domain.',
      'The author\'s thesis (C-12) must be attributed as interpretation, not presented as established fact.',
      'Named private individuals are limited to those named in the work and in public records; no additional personal data.',
    ],
    sources: [
      'The Drey Dossier, "Theranos Isn\'t About Elizabeth Holmes.", YouTube, https://www.youtube.com/watch?v=PgWNQH4FWNI — title, author, 2795 s runtime, upload 2026-10-24T21:32:58Z (retrieved 2026-10-25)',
      'The Drey Dossier, "Theranos Isn\'t About Elizabeth Holmes.", Substack, 24 Oct 2026, https://thedreydossier.substack.com/p/theranos-isnt-about-elizabeth-holmes',
      'Verification layer: White House DCPD-202500157; N.D. Cal. 18-cr-258 exhibits and orders; CIA Reading Room STAR GATE collection, including the 1994 human-subjects package and the 1995 AIR evaluation; DOJ Amerithrax investigative summary; USPTO 7,291,497 / 8,862,448 / 11,195,624; Fortress and Mubadala closing statements (2024-05-15)',
    ],
  },

  epochs: undefined,

  layers: [
    {
      layerId: 'primary_layer',
      type: 'primary' as const,
      epochs: {
        publication: {
          // #19 — an explicit epochId is mandatory; without it the registry silently
          // renames the epoch to the layer key.
          epochId: `${DREY_THERANOS_UNIVERSE_ID}:publication`,
          startTime: DREY_THERANOS_PUBLISHED,
          endTime:
            DREY_THERANOS_PUBLISHED +
            BigInt(DREY_THERANOS_RUNTIME_SECONDS) * NS_PER_SECOND,
          precision: TimePrecision.SECOND,
          description:
            'The published video: 46:35 of runtime, expressed on the wall clock from ' +
            'the verified publication instant (2026-10-24T21:32:58Z). Keyframes are ' +
            'absolute instants inside this epoch.',
        },
      },
    },
  ],

  temporalStructure: {
    /**
     * Twelve contiguous segments, 0:00 → 46:35. Each boundary is the next segment's
     * start, so the partition is gapless by construction; the last ends at the runtime.
     */
    segments: [
      {
        id: 'seg_cold_open',
        start: at(0, 0),
        end: at(1, 27),
        type: 'scene' as const,
        status: 'active' as const,
        description:
          'The received Theranos story, opened on Ellison describing a cancer vaccine ' +
          'and early detection from a blood test at the White House.',
      },
      {
        id: 'seg_patent_chain',
        start: at(1, 27),
        end: at(5, 21),
        type: 'sequence' as const,
        status: 'active' as const,
        description:
          'The patents as collateral: Fortress, SoftBank, Labrador, Golden Diagnostics, ' +
          'and the Mubadala/MGX link to Stargate.',
      },
      {
        id: 'seg_blood_question',
        start: at(5, 21),
        end: at(9, 12),
        type: 'sequence' as const,
        status: 'active' as const,
        description:
          '"Where did the blood go?" — the 1.5M tests, the patients, and Bad Blood\'s ' +
          'blind spot.',
      },
      {
        id: 'seg_murdoch',
        start: at(9, 12),
        end: at(12, 45),
        type: 'scene' as const,
        status: 'active' as const,
        description:
          'Murdoch\'s $125M, the six Holmes–Murdoch meetings, and the sourcing gaps in ' +
          'the endnotes.',
      },
      {
        id: 'seg_court_record',
        start: at(12, 45),
        end: at(16, 44),
        type: 'scene' as const,
        status: 'active' as const,
        description:
          'The court record: the encrypted database handed over without its key, the ' +
          'verdict, and the $452M restitution order.',
      },
      {
        id: 'seg_board',
        start: at(16, 44),
        end: at(17, 46),
        type: 'scene' as const,
        status: 'active' as const,
        description:
          'The 2011 board roster and the question of what the "war cabinet" was for.',
      },
      {
        id: 'seg_stargate_program',
        start: at(17, 46),
        end: at(26, 9),
        type: 'act' as const,
        status: 'active' as const,
        description:
          'STAR GATE, 1972–1995: remote viewing, Pat Price, Perry\'s control of the ' +
          'research money, and Ellison\'s CIA database.',
      },
      {
        id: 'seg_lederberg',
        start: at(26, 9),
        end: at(34, 36),
        type: 'act' as const,
        status: 'active' as const,
        description:
          'Lederberg, the anthrax letters, BioWatch, and the fear-to-database pattern ' +
          'the work names.',
      },
      {
        id: 'seg_first_patent',
        start: at(34, 36),
        end: at(39, 12),
        type: 'scene' as const,
        status: 'active' as const,
        description:
          'The 11 Sep 2003 provisional patent, the 2009 Health Shield patent, and ' +
          'Ellison\'s exit from Theranos.',
      },
      {
        id: 'seg_bagram_walgreens',
        start: at(39, 12),
        end: at(41, 24),
        type: 'scene' as const,
        status: 'active' as const,
        description:
          'The abandoned Bagram plan, the Walgreens deployment in Arizona, and the ' +
          'shutdown.',
      },
      {
        id: 'seg_handoff',
        start: at(41, 24),
        end: at(43, 8),
        type: 'sequence' as const,
        status: 'active' as const,
        description:
          'Oracle–Cerner and Oracle Health, the Labrador continuation filing, Stargate ' +
          'LLC, and the patient settlements.',
      },
      {
        id: 'seg_coda',
        start: at(43, 8),
        end: at(46, 35),
        type: 'scene' as const,
        status: 'active' as const,
        description:
          'Ellison on DNA and records, and the closing thesis.',
      },
    ],

    /**
     * 34 keyframes. `certainty` is present wherever the work's claim is less than
     * photographic — the value is the claim's confidence, not its importance.
     */
    keyframes: [
      {
        id: 'ellison_cancer_vaccine_clip',
        timestamp: at(0, 29),
        significance: 0.85,
        tags: ['stargate', 'ellison', 'blood_test'],
        type: KeyframeType.PUBLIC_STATEMENT,
        certainty: 0.85,
        description:
          'In the cold open, Ellison describes early cancer detection from a blood test ' +
          'and a cancer vaccine at the White House.',
      },
      {
        id: 'stargate_announcement_identified',
        timestamp: at(1, 27),
        significance: 0.95,
        tags: ['stargate', 'white_house', 'roosevelt_room', 'disputed:ellison_board'],
        type: KeyframeType.ANNOUNCEMENT,
        certainty: 0.98,
        description:
          'The clip is identified as the Stargate announcement, with Ellison named as a ' +
          'Theranos early investor — and, at 1:43, as a Theranos board member, which the ' +
          'work elsewhere contradicts (C-13).',
      },
      {
        id: 'fortress_loan_collateral',
        timestamp: at(2, 26),
        significance: 0.9,
        tags: ['fortress', 'patents', 'collateral'],
        type: KeyframeType.CONTRACT,
        certainty: 0.9,
        description:
          'December 2017: Theranos borrows from Fortress and pledges its patents as ' +
          'collateral.',
      },
      {
        id: 'softbank_buys_fortress',
        timestamp: at(2, 46),
        significance: 0.9,
        tags: ['softbank', 'fortress'],
        type: KeyframeType.ACQUISITION,
        certainty: 0.9,
        description:
          'In the same month, SoftBank completes its purchase of Fortress — the firm now ' +
          'holding Theranos\'s patents as collateral.',
      },
      {
        id: 'labrador_diagnostics_formed',
        timestamp: at(3, 14),
        significance: 0.8,
        tags: ['labrador', 'patents'],
        type: KeyframeType.INCORPORATION,
        certainty: 0.8,
        description:
          'In 2018 Fortress parks the patents in Labrador Diagnostics.',
      },
      {
        id: 'golden_diagnostics_transfer',
        timestamp: at(3, 23),
        significance: 0.9,
        tags: ['golden_diagnostics', 'nevada', 'patents'],
        type: KeyframeType.ACQUISITION,
        certainty: 0.9,
        description:
          'In 2023 Labrador sells the earliest patents to Golden Diagnostics, a Nevada ' +
          'company created four days earlier whose officers list Fortress\'s New York address.',
      },
      {
        id: 'gothing_double_signing',
        timestamp: at(3, 52),
        significance: 1.0,
        tags: ['andrea_gothing', 'signature', 'assignment', 'signed:andrea_gothing'],
        type: KeyframeType.CONTRACT,
        certainty: 0.9,
        description:
          'Andrea Gothing signs the patents away for Labrador and, the same day, accepts ' +
          'them for Golden Diagnostics.',
      },
      {
        id: 'mubadala_mgx_link',
        timestamp: at(4, 16),
        significance: 0.95,
        tags: ['mubadala', 'mgx', 'stargate'],
        type: KeyframeType.INCORPORATION,
        certainty: 0.95,
        description:
          'Mubadala, buyer of most of Fortress, co-founded MGX — one of the four ' +
          'underwriters of Stargate LLC.',
      },
      {
        id: 'where_did_the_blood_go',
        timestamp: at(6, 19),
        significance: thesisSignificance(0.9, 0.9),
        tags: ['patients', 'database', 'thesis'],
        type: KeyframeType.MILESTONE,
        certainty: THESIS_CLAIM_CERTAINTY,
        description:
          'The organising question: 1.5M tests on 175,000+ Arizonans, and no accounting ' +
          'of what happened to the blood or the results — the work\'s thesis that the ' +
          'machine was never the point.',
      },
      {
        id: 'murdoch_125m_disclosure',
        timestamp: at(9, 12),
        significance: 0.95,
        tags: ['murdoch', 'carreyrou', 'conflict'],
        type: KeyframeType.PUBLICATION,
        certainty: 0.85,
        description:
          'Murdoch — whose company owned the Wall Street Journal — was Theranos\'s ' +
          'largest investor at $125M, a conflict revealed in chapter 23 of Bad Blood.',
      },
      {
        id: 'six_meetings_endnote',
        timestamp: at(11, 38),
        significance: 0.8,
        tags: ['murdoch', 'endnotes'],
        type: KeyframeType.MILESTONE,
        certainty: 0.8,
        description:
          'The endnotes list six Holmes–Murdoch meetings, two of them after publication, ' +
          'with no sourcing for what was said.',
      },
      {
        id: 'encrypted_database_order',
        timestamp: at(13, 4),
        significance: 1.0,
        tags: ['database', 'evidence', 'holmes'],
        type: KeyframeType.RULING,
        certainty: 0.9,
        description:
          'A judge\'s order finds that Theranos knowingly handed prosecutors an ' +
          'unopenable encrypted database and that its key was destroyed two days later.',
      },
      {
        id: 'holmes_verdict',
        timestamp: at(14, 23),
        significance: 0.98,
        tags: ['verdict', 'investors', 'patients'],
        type: KeyframeType.RULING,
        certainty: 0.9,
        description:
          'January 2022: Holmes is convicted as to investors and acquitted as to patients.',
      },
      {
        id: 'restitution_452m',
        timestamp: at(14, 34),
        significance: 0.95,
        tags: ['restitution', 'murdoch'],
        type: KeyframeType.RULING,
        certainty: 0.9,
        description:
          '$452M in restitution, all of it to investors — with the largest cheque to ' +
          'Murdoch.',
      },
      {
        id: 'theranos_board_roster',
        timestamp: at(16, 44),
        significance: 0.85,
        tags: ['board', 'shultz', 'kissinger', 'perry', 'nunn', 'roughead', 'mattis'],
        type: KeyframeType.MILESTONE,
        certainty: 0.85,
        description:
          'The 2011 board: two former secretaries of state, a former defense secretary, ' +
          'a former Senate Armed Services chair, a former chief of naval operations and a ' +
          'general.',
      },
      {
        id: 'stargate_name_origin',
        timestamp: at(17, 46),
        significance: 0.9,
        tags: ['stargate', 'remote_viewing', 'cia'],
        type: KeyframeType.MILESTONE,
        certainty: 0.85,
        description:
          'Before the AI consortium, "Stargate" was a Cold War programme that paid ' +
          'psychics to spy for the CIA, the Army and the DIA.',
      },
      {
        id: 'pat_price_sessions',
        timestamp: at(19, 6),
        significance: 0.75,
        tags: ['pat_price', 'sri', 'remote_viewing'],
        type: KeyframeType.MILESTONE,
        certainty: 0.75,
        description:
          'The star viewer\'s hits and misses, including CIA notes that much of what he ' +
          'produced was "vague and incorrect".',
      },
      {
        id: 'ellison_cia_database',
        timestamp: at(21, 36),
        significance: 0.9,
        tags: ['ellison', 'oracle', 'cia'],
        type: KeyframeType.CONTRACT,
        certainty: 0.85,
        description:
          'Ellison and partners build a CIA person-lookup database — the project the ' +
          'agency itself called Oracle.',
      },
      {
        id: 'perry_controls_psychic_funding',
        timestamp: at(22, 19),
        significance: 0.9,
        tags: ['perry', 'pentagon', 'stargate'],
        type: KeyframeType.MILESTONE,
        certainty: 0.85,
        description:
          'By 1980 the Pentagon official controlling the programme\'s research money was ' +
          'William Perry, later a Theranos director.',
      },
      {
        id: 'baxter_effect_biomonitoring',
        timestamp: at(23, 4),
        significance: 0.85,
        tags: ['biomonitoring', 'blood', 'army'],
        type: KeyframeType.MILESTONE,
        certainty: 0.85,
        description:
          'The unit\'s purchase list includes biomonitoring gear, and Army intelligence ' +
          'discusses detecting a subject\'s state from blood.',
      },
      {
        id: 'human_subjects_finding',
        timestamp: at(24, 30),
        significance: 0.95,
        tags: ['human_subjects', 'fort_detrick', 'ethics'],
        type: KeyframeType.RULING,
        certainty: 0.85,
        description:
          'The agency running the programme puts in writing that it constitutes ' +
          'experimentation on human subjects.',
      },
      {
        id: 'stargate_program_closed',
        timestamp: at(25, 40),
        significance: 0.8,
        tags: ['cia', '1995', 'stargate'],
        type: KeyframeType.SHUTDOWN,
        certainty: 0.85,
        description:
          'In 1995 the programme is handed back to the CIA and shut down; the public gets ' +
          'a "wasted money on psychics" headline.',
      },
      {
        id: 'lederberg_introduced',
        timestamp: at(26, 21),
        significance: 0.8,
        tags: ['lederberg', 'bioweapons'],
        type: KeyframeType.MILESTONE,
        certainty: 0.8,
        description:
          'Lederberg is introduced: a Nobel laureate at 33, Rockefeller University ' +
          'president, and for decades a member of the Defense Science Board.',
      },
      {
        id: 'lederberg_papers_online',
        timestamp: at(27, 39),
        significance: 0.8,
        tags: ['lederberg', 'nlm', 'archive'],
        type: KeyframeType.PUBLICATION,
        certainty: 0.85,
        description:
          'In 1999 the National Library of Medicine posts his private papers, in which ' +
          'Perry and Ellison recur.',
      },
      {
        id: 'quark_biotech_bridge',
        timestamp: at(29, 43),
        significance: 0.9,
        tags: ['quark', 'ellison', 'son', 'tako'],
        type: KeyframeType.ACQUISITION,
        certainty: 0.9,
        description:
          'Lederberg steers Ellison to Quark Biotech; SoftBank\'s SBI buys in and owns it ' +
          'by 2013 — the first Ellison–Son venture.',
      },
      {
        id: 'anthrax_letters',
        timestamp: at(31, 0),
        significance: 0.85,
        tags: ['anthrax', 'fort_detrick', 'ivins', 'alleged'],
        type: KeyframeType.MILESTONE,
        certainty: 0.85,
        description:
          'The anthrax letters kill five people; the FBI pins them on a Fort Detrick ' +
          'scientist who dies before trial.',
      },
      {
        id: 'biowatch_announced',
        timestamp: at(33, 14),
        significance: 0.85,
        tags: ['biowatch', 'bush', 'sensors'],
        type: KeyframeType.ANNOUNCEMENT,
        certainty: 0.85,
        description:
          'In January 2003 BioWatch places air samplers in 30+ cities — but the ' +
          'individual-body piece of the plan is never built.',
      },
      {
        id: 'ellison_fear_database_pattern',
        timestamp: at(34, 36),
        significance: thesisSignificance(0.85, 0.9, 0.95),
        tags: ['ellison', 'surveillance', 'databases', 'thesis'],
        type: KeyframeType.MILESTONE,
        certainty: THESIS_CLAIM_CERTAINTY,
        description:
          'The recurring move the work names: fear creates demand for surveillance, and ' +
          'surveillance runs on databases.',
      },
      {
        id: 'first_patent_filed',
        timestamp: at(35, 28),
        significance: 1.0,
        tags: ['patent', 'anthrax', '2003', 'signed:elizabeth_holmes'],
        type: KeyframeType.MILESTONE,
        certainty: 0.9,
        description:
          'On 11 September 2003 Holmes files a provisional patent for a wearable or ' +
          'swallowable continuous-testing device, naming anthrax and "defense departments ' +
          'worldwide".',
      },
      {
        id: 'health_shield_patent',
        timestamp: at(37, 57),
        significance: 1.0,
        tags: ['health_shield', 'central_monitoring', 'government', 'signed:elizabeth_holmes'],
        type: KeyframeType.PUBLICATION,
        certainty: 0.9,
        description:
          'The 2009 "Integrated health data capture and analysis system" routes results ' +
          'to a "central monitoring site, e.g., that of a governmental agency".',
      },
      {
        id: 'bagram_plan_shelved',
        timestamp: at(39, 24),
        significance: 0.85,
        tags: ['bagram', 'mattis', 'dod'],
        type: KeyframeType.MILESTONE,
        certainty: 0.85,
        description:
          'The agreed plan — two devices in a Bagram hospital lab, on de-identified ' +
          'leftover blood, results to a cloud — is never executed.',
      },
      {
        id: 'walgreens_deployment',
        timestamp: at(40, 23),
        significance: 0.85,
        tags: ['walgreens', 'edison', 'arizona'],
        type: KeyframeType.LAUNCH,
        certainty: 0.85,
        description:
          'The system is deployed in pharmacies instead, where the Edison runs 12 of its ' +
          '250 menu tests.',
      },
      {
        id: 'oracle_cerner_oracle_health',
        timestamp: at(41, 24),
        significance: 0.9,
        tags: ['oracle', 'cerner', 'ehr'],
        type: KeyframeType.ACQUISITION,
        certainty: 0.9,
        description:
          'Oracle buys Cerner, and Oracle Health patents location-based health monitoring ' +
          'that cites Health Shield.',
      },
      {
        id: 'patient_settlements',
        timestamp: at(42, 15),
        significance: 0.8,
        tags: ['arizona', 'walgreens', 'patients'],
        type: KeyframeType.RULING,
        certainty: 0.8,
        description:
          'Patients recover test fees through Arizona\'s attorney general, and Walgreens ' +
          'settles for $44M without admitting fault.',
      },
    ],

    windows: { strategy: 'scene_based' as const },
  },

  /**
   * Containment (#74): one owner, many memberships. The containers are
   * `CommonUniverseIds` members — valid, resolvable ids that are deliberately not
   * registered works. No `history:theranos` parent: that universe does not exist yet.
   */
  connections: {
    natural: {
      parentUniverses: [
        CommonUniverseIds.US_HISTORY,
        CommonUniverseIds.US_GOVERNMENT,
      ],
    },
  },

  metadata: {
    canonicalName: 'Theranos Isn\'t About Elizabeth Holmes.',
    description:
      'A 46:35 investigative video essay arguing that the Theranos fraud is the smaller ' +
      'half of the story: that the company\'s patents passed through Fortress, SoftBank, ' +
      'Labrador and Golden Diagnostics, that its blood-testing architecture was built to ' +
      'feed a database rather than run a machine, and that a version of that architecture ' +
      'is now argued to sit inside the Stargate LLC consortium. The continuity claim is ' +
      'the author\'s interpretation and is recorded at its own certainty, not as fact.',
    creators: ['The Drey Dossier (writer, producer, researcher)'],
    released: new Date('2026-10-24T21:32:58Z'),
    cultural_significance: 0.75,

    externalIds: { youtubeVideoId: 'PgWNQH4FWNI' },
    metricsAsOf: '2026-10-25',

    /** Subjects, not credits. See `NamedSubject` and `dreyTheranosPeople`. */
    people: dreyTheranosPeople,

    /**
     * C-13 — disputed, and recorded rather than embedded. Most reporting describes
     * Ellison as an investor through Tako Ventures, not a director.
     */
    disputedClaims: [
      {
        id: 'C-13',
        claim: 'Larry Ellison sat on the Theranos board.',
        certainty: 0.4,
        statedAtSeconds: 103,
        contradiction:
          'The work elsewhere treats him as an investor via Tako Ventures; the mirror ' +
          'text says his name came off "the Theranos board" in 2010. Most reporting ' +
          'describes an investor-only relationship.',
        handling:
          'Carried here and tagged on stargate_announcement_identified; not asserted in ' +
          'metadata.description and not given a keyframe of its own.',
      },
    ],

    /**
     * C-14 — two framings of one date, both referring to 2025-01-21 (the first full day
     * and the second calendar day of the term). Recorded, not normalised.
     */
    deviations: [
      'C-14: at 1:32 the announcement is called "Trump\'s first full day back in ' +
        'office"; at 41:47 it is "the president\'s second day in office". Both refer to ' +
        '2025-01-21 and neither is corrected.',
      'The runtime is 46:35 per the platform; the transcript\'s last cue begins at ' +
        '46:31. The four seconds of tail are not captioned.',
      'The thesis (C-12) asserts continuity of intent from the 2003 patent to the 2025 ' +
        'Stargate announcement; no document evidences an unbroken plan.',
      'The work treats the absence of patient-data accountability as structural rather ' +
        'than negligent; that is an interpretation, not a finding.',
    ],

    retrieval: {
      domain: 'investigative video essay / corporate and government accountability',
      format: 'video essay',
      subjects: [
        'Theranos',
        'Elizabeth Holmes',
        'patent assignment',
        'Fortress Investment Group',
        'SoftBank',
        'Labrador Diagnostics',
        'Golden Diagnostics',
        'Mubadala',
        'MGX',
        'Stargate LLC',
        'Oracle',
        'Cerner',
        'CIA STAR GATE',
        'remote viewing',
        'BioWatch',
        'anthrax letters',
        'medical surveillance',
        'whistleblowing',
      ],
      charge_source: 'realityRelation.type = documentary -> +1 (non-fiction tier)',
      weight_source:
        'RealityGradient.level folded with cultural_significance (0.75), keyframe ' +
        'significances and certainties, and the thesis cap (0.55)',
    },
  },
};
