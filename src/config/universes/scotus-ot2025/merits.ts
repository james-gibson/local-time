import { Universe, UniverseType, KeyframeType, TemporalKeyframe } from '../../../core/types';
import {
  SCOTUS_TERM_ID,
  SCOTUS_MERITS_DOCKET_ID,
  TERM_END_ISO,
  fromIso,
  monthBounds,
  keyframe,
  scotusUniverse,
  slug,
} from './shared';

/**
 * The OT2025 merits docket — one universe per case (james-gibson/local-time#88 §4.1).
 *
 * Argument-sitting roster from SCOTUSblog's OT2025 term page; the four measured
 * dispositions are cross-verified across SCOTUSblog and Ballotpedia. Where only the
 * sitting month is known, the argument keyframe carries `certainty: 0.5` and a
 * `dateRange` spanning that month rather than an invented day.
 */

interface MeritCase {
  /** The id segment; explicit where the ticket pins one (§3.1). */
  slug: string;
  caption: string;
  /** The `YYYY-MM` sitting the argument was heard in. */
  sitting: string;
  issueArea: string;
  /** Exact argument date (ISO `YYYY-MM-DD`) when known. */
  argued?: string;
  /** Exact decision date (ISO `YYYY-MM-DD`) when known. */
  decided?: string;
  disposition?: string;
  vote?: string;
  author?: string;
  significance?: number;
  dismissed?: boolean;
  crossReference?: { targetUniverseId: string; description: string };
  dualTrack?: { description: string; shadowDate: string };
}

const createMeritsCase = (data: MeritCase): Universe => {
  const universeId = `history:scotus_ot2025_case_${data.slug}:2025`;
  const bounds = monthBounds(data.sitting);
  const arguedIso = data.argued ? `${data.argued}T12:00:00Z` : bounds.start;
  const decidedIso = data.decided ? `${data.decided}T12:00:00Z` : null;
  const significance = data.significance ?? 0.85;

  const references: Array<Record<string, unknown>> = [];
  if (data.crossReference) {
    references.push({
      type: 'CONSOLIDATED_WITH',
      targetUniverseId: data.crossReference.targetUniverseId,
      description: data.crossReference.description,
      confidence: 1.0,
      evidence: ['SCOTUSblog OT2025'],
    });
  }
  if (data.dualTrack) {
    references.push({
      type: 'dual_track',
      targetUniverseId: SCOTUS_MERITS_DOCKET_ID,
      description: data.dualTrack.description,
      confidence: 1.0,
      evidence: ['Brennan Center shadow docket tracker'],
    });
  }

  const keyframes: TemporalKeyframe[] = [];
  if (data.dismissed) {
    keyframes.push(
      keyframe('dismissed_from_argument_docket', arguedIso, {
        significance: 0.5,
        tags: ['scotus', 'ot2025', 'merits', 'dismissed', slug(data.issueArea)],
        type: KeyframeType.MILESTONE,
        certainty: 0.5,
      }),
    );
  } else {
    keyframes.push(
      keyframe('oral_argument', arguedIso, {
        significance: 0.6,
        tags: ['scotus', 'ot2025', 'merits', 'oral_argument', slug(data.issueArea)],
        type: KeyframeType.MILESTONE,
        certainty: data.argued ? 1.0 : 0.5,
        ...(data.argued ? {} : { dateRange: { earliest: bounds.start, latest: bounds.end } }),
        description: `Oral argument in ${data.caption} (${data.sitting} sitting, ${data.issueArea}).`,
      }),
    );
  }

  if (decidedIso) {
    keyframes.push(
      keyframe('decision', decidedIso, {
        significance: Math.min(1.0, significance + 0.05),
        tags: ['scotus', 'ot2025', 'merits', 'decision', slug(data.issueArea)],
        type: KeyframeType.RULING,
        certainty: 1.0,
        description:
          `${data.caption} — ${data.disposition ?? 'decided'}` +
          `${data.vote ? `, ${data.vote}` : ''}${data.author ? `, opinion by ${data.author}` : ''}.`,
      }),
    );
  }

  if (data.dualTrack) {
    keyframes.push(
      keyframe('shadow_docket_stay', `${data.dualTrack.shadowDate}T12:00:00Z`, {
        significance: 0.85,
        tags: ['scotus', 'ot2025', 'shadow_docket', 'dual_track'],
        type: KeyframeType.RULING,
        certainty: 1.0,
        description: data.dualTrack.description,
      }),
    );
  }

  return scotusUniverse({
    universeId,
    type: UniverseType.LEGAL_TIMELINE,
    canonicalName: data.caption,
    aliases: [data.caption, `${data.caption} (OT2025)`],
    description:
      `${data.caption} — a merits case on the October Term 2025 docket (${data.issueArea}).` +
      (decidedIso ? ` Decided: ${data.disposition ?? 'see keyframes'}.` : ''),
    released: new Date(arguedIso),
    culturalSignificance: significance,
    parents: [SCOTUS_TERM_ID, SCOTUS_MERITS_DOCKET_ID],
    segments: [
      {
        id: 'case_on_docket',
        start: fromIso(arguedIso),
        end: decidedIso ? fromIso(decidedIso) : fromIso(`${TERM_END_ISO}T12:00:00Z`),
        type: 'court_jurisdiction',
        status: decidedIso ? 'inactive' : 'active',
        jurisdiction: 'United States',
        description: decidedIso
          ? `From the ${data.sitting} sitting to the decision.`
          : `Pending on the OT2025 docket after the ${data.sitting} sitting.`,
      },
    ],
    keyframes,
    references,
  });
};

const meritCases: MeritCase[] = [
  // --- October 2025 sitting (10) ---
  { slug: 'berk_v_choy', caption: 'Berk v. Choy', sitting: '2025-10', issueArea: 'Civil', significance: 0.9, argued: '2025-10-06' },
  { slug: 'villarreal_v_texas', caption: 'Villarreal v. Texas', sitting: '2025-10', issueArea: 'Criminal' },
  { slug: 'chiles_v_salazar', caption: 'Chiles v. Salazar', sitting: '2025-10', issueArea: 'First Amendment', significance: 0.9, argued: '2025-10-07' },
  { slug: 'barrett_v_united_states', caption: 'Barrett v. United States', sitting: '2025-10', issueArea: 'Criminal' },
  { slug: 'usps_v_konan', caption: 'USPS v. Konan', sitting: '2025-10', issueArea: 'Civil' },
  { slug: 'bost_v_illinois_state_board_of_elections', caption: 'Bost v. Illinois State Board of Elections', sitting: '2025-10', issueArea: 'Elections', significance: 0.9 },
  { slug: 'ellingburg_v_united_states', caption: 'Ellingburg v. United States', sitting: '2025-10', issueArea: 'Criminal' },
  { slug: 'bowe_v_united_states', caption: 'Bowe v. United States', sitting: '2025-10', issueArea: 'Criminal' },
  {
    slug: 'louisiana_v_callais',
    caption: 'Louisiana v. Callais',
    sitting: '2025-10',
    issueArea: 'Voting Rights Act',
    significance: 1.0,
    argued: '2025-10-15',
    decided: '2026-04-29',
    disposition: 'affirmed and remanded',
    vote: '6-3',
    author: 'Alito',
  },
  { slug: 'case_v_montana', caption: 'Case v. Montana', sitting: '2025-10', issueArea: 'Civil' },

  // --- November 2025 sitting (9) ---
  { slug: 'hencely_v_fluor_corp', caption: 'Hencely v. Fluor Corp.', sitting: '2025-11', issueArea: 'Preemption' },
  { slug: 'rico_v_united_states', caption: 'Rico v. United States', sitting: '2025-11', issueArea: 'Criminal' },
  { slug: 'hain_celestial_group_v_palmquist', caption: 'Hain Celestial Group v. Palmquist', sitting: '2025-11', issueArea: 'Civil' },
  { slug: 'coney_island_auto_parts_v_burton', caption: 'Coney Island Auto Parts v. Burton', sitting: '2025-11', issueArea: 'Civil' },
  {
    slug: 'learning_resources_v_trump',
    caption: 'Learning Resources, Inc. v. Trump',
    sitting: '2025-11',
    issueArea: 'Tariffs / Executive Power',
    significance: 1.0,
    argued: '2025-11-05',
    decided: '2026-02-20',
    disposition: 'vacated and remanded',
    vote: '6-3',
    author: 'Roberts',
  },
  { slug: 'landor_v_louisiana_doc', caption: 'Landor v. Louisiana Department of Corrections', sitting: '2025-11', issueArea: 'Religious Liberty', significance: 0.9 },
  { slug: 'geo_group_v_menocal', caption: 'GEO Group v. Menocal', sitting: '2025-11', issueArea: 'Civil' },
  { slug: 'fernandez_v_united_states', caption: 'Fernandez v. United States', sitting: '2025-11', issueArea: 'Criminal' },
  { slug: 'rutherford_v_united_states', caption: 'Rutherford v. United States', sitting: '2025-11', issueArea: 'Criminal' },

  // --- December 2025 sitting (8) ---
  { slug: 'cox_communications_v_sony_music', caption: 'Cox Communications v. Sony Music', sitting: '2025-12', issueArea: 'Copyright' },
  { slug: 'urias_orellana_v_bondi', caption: 'Urias-Orellana v. Bondi', sitting: '2025-12', issueArea: 'Immigration' },
  { slug: 'first_choice_womens_resource_centers_v_davenport', caption: "First Choice Women's Resource Centers v. Davenport", sitting: '2025-12', issueArea: 'First Amendment' },
  { slug: 'olivier_v_city_of_brandon_miss', caption: 'Olivier v. City of Brandon, Miss.', sitting: '2025-12', issueArea: 'First Amendment' },
  {
    slug: 'trump_v_slaughter',
    caption: 'Trump v. Slaughter',
    sitting: '2025-12',
    issueArea: 'Independent Agencies',
    significance: 0.95,
    argued: '2025-12-08',
    dualTrack: {
      description:
        'Trump v. Slaughter is the same dispute on two tracks: merits No. 25-332 (argued December 2025) ' +
        'and shadow 25A264 (FTC removal; stay granted 2025-09-22, Kagan, Sotomayor and Jackson dissenting).',
      shadowDate: '2025-09-22',
    },
  },
  { slug: 'nrsc_v_fec', caption: 'NRSC v. FEC', sitting: '2025-12', issueArea: 'Campaign Finance' },
  { slug: 'fs_credit_opportunities_v_saba_capital', caption: 'FS Credit Opportunities v. Saba Capital', sitting: '2025-12', issueArea: 'Civil' },
  { slug: 'hamm_v_smith', caption: 'Hamm v. Smith', sitting: '2025-12', issueArea: 'Death Penalty' },

  // --- January 2026 sitting (7) ---
  { slug: 'chevron_usa_v_plaquemines_parish', caption: 'Chevron USA v. Plaquemines Parish', sitting: '2026-01', issueArea: 'Civil' },
  {
    slug: 'little_v_hecox',
    caption: 'Little v. Hecox',
    sitting: '2026-01',
    issueArea: 'Transgender Athletes',
    significance: 0.95,
    argued: '2026-01-13',
    decided: '2026-06-30',
    disposition: 'reversed and remanded',
    vote: '6-3',
    author: 'Kavanaugh',
    crossReference: {
      targetUniverseId: 'history:scotus_ot2025_case_west_virginia_v_b_p_j:2025',
      description: 'Little v. Hecox and West Virginia v. B.P.J. share one opinion despite two arguments.',
    },
  },
  {
    slug: 'west_virginia_v_b_p_j',
    caption: 'West Virginia v. B.P.J.',
    sitting: '2026-01',
    issueArea: 'Transgender Athletes',
    significance: 0.95,
    argued: '2026-01-13',
    decided: '2026-06-30',
    disposition: 'reversed and remanded',
    vote: '6-3',
    author: 'Kavanaugh',
    crossReference: {
      targetUniverseId: 'history:scotus_ot2025_case_little_v_hecox:2025',
      description: 'West Virginia v. B.P.J. and Little v. Hecox share one opinion despite two arguments.',
    },
  },
  { slug: 'galette_v_nj_transit', caption: 'Galette v. NJ Transit', sitting: '2026-01', issueArea: 'Civil' },
  { slug: 'm_k_employee_solutions_v_iam_pension_fund', caption: 'M&K Employee Solutions v. IAM Pension Fund', sitting: '2026-01', issueArea: 'Civil' },
  { slug: 'wolford_v_lopez', caption: 'Wolford v. Lopez', sitting: '2026-01', issueArea: 'Gun Rights', significance: 0.9 },
  { slug: 'trump_v_cook', caption: 'Trump v. Cook', sitting: '2026-01', issueArea: 'Independent Agencies', significance: 0.95 },

  // --- February 2026 sitting (7) ---
  { slug: 'exxon_mobil_v_corporacion_cimex', caption: 'Exxon Mobil v. Corporación Cimex', sitting: '2026-02', issueArea: 'Civil' },
  { slug: 'havana_docks_corp_v_royal_caribbean', caption: 'Havana Docks Corp. v. Royal Caribbean', sitting: '2026-02', issueArea: 'Civil' },
  { slug: 'enbridge_energy_v_nessel', caption: 'Enbridge Energy v. Nessel', sitting: '2026-02', issueArea: 'Environment' },
  { slug: 'pung_v_isabella_county_mich', caption: 'Pung v. Isabella County, Mich.', sitting: '2026-02', issueArea: 'Civil' },
  { slug: 'united_states_v_hemani', caption: 'United States v. Hemani', sitting: '2026-02', issueArea: 'Gun Rights' },
  { slug: 'hunter_v_united_states', caption: 'Hunter v. United States', sitting: '2026-02', issueArea: 'Criminal' },
  { slug: 'montgomery_v_caribe_transport_ii', caption: 'Montgomery v. Caribe Transport II', sitting: '2026-02', issueArea: 'Civil' },

  // --- March 2026 sitting (8) ---
  { slug: 'watson_v_rnc', caption: 'Watson v. RNC', sitting: '2026-03', issueArea: 'Election Law' },
  { slug: 'mullin_v_al_otro_lado', caption: 'Mullin v. Al Otro Lado', sitting: '2026-03', issueArea: 'Immigration' },
  { slug: 'keathley_v_buddy_ayers_construction', caption: 'Keathley v. Buddy Ayers Construction', sitting: '2026-03', issueArea: 'Civil' },
  { slug: 'flowers_foods_v_brock', caption: 'Flowers Foods v. Brock', sitting: '2026-03', issueArea: 'Civil' },
  { slug: 'jules_v_andre_balazs_properties', caption: 'Jules v. Andre Balazs Properties', sitting: '2026-03', issueArea: 'Civil' },
  { slug: 'abouammo_v_united_states', caption: 'Abouammo v. United States', sitting: '2026-03', issueArea: 'Criminal' },
  { slug: 'pitchford_v_cain', caption: 'Pitchford v. Cain', sitting: '2026-03', issueArea: 'Death Penalty' },
  { slug: 'trump_v_barbara', caption: 'Trump v. Barbara', sitting: '2026-03', issueArea: 'Birthright Citizenship', significance: 1.0 },

  // --- April 2026 sitting (9) ---
  { slug: 't_m_v_univ_of_maryland_medical_system', caption: 'T.M. v. Univ. of Maryland Medical System', sitting: '2026-04', issueArea: 'Civil' },
  { slug: 'sripetch_v_sec', caption: 'Sripetch v. SEC', sitting: '2026-04', issueArea: 'Civil' },
  { slug: 'fcc_v_at_t', caption: 'FCC v. AT&T', sitting: '2026-04', issueArea: 'Telecommunications' },
  { slug: 'blanche_v_lau', caption: 'Blanche v. Lau', sitting: '2026-04', issueArea: 'Immigration' },
  { slug: 'monsanto_v_durnell', caption: 'Monsanto v. Durnell', sitting: '2026-04', issueArea: 'Civil' },
  { slug: 'chatrie_v_united_states', caption: 'Chatrie v. United States', sitting: '2026-04', issueArea: 'Criminal' },
  { slug: 'cisco_systems_v_doe_i', caption: 'Cisco Systems v. Doe I', sitting: '2026-04', issueArea: 'Civil' },
  { slug: 'hikma_pharmaceuticals_v_amarin', caption: 'Hikma Pharmaceuticals v. Amarin', sitting: '2026-04', issueArea: 'Civil' },
  { slug: 'mullin_v_doe', caption: 'Mullin v. Doe', sitting: '2026-04', issueArea: 'Immigration' },

  // --- Dismissed from the argument docket (1) ---
  {
    slug: 'department_of_education_v_career_colleges_and_schools_of_texas',
    caption: 'Department of Education v. Career Colleges and Schools of Texas',
    sitting: '2025-10',
    issueArea: 'Civil',
    dismissed: true,
  },
];

export const scotusOt2025MeritsCases: Universe[] = meritCases.map(createMeritsCase);
