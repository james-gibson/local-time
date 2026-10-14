import { Universe, UniverseType, KeyframeType, TemporalKeyframe } from '../../../core/types';
import {
  SCOTUS_TERM_ID,
  SCOTUS_MERITS_DOCKET_ID,
  TERM_START_ISO,
  TERM_END_ISO,
  fromIso,
  monthBounds,
  keyframe,
  scotusUniverse,
  slug,
} from './shared';

/**
 * The OT2013 official docket — one universe per docket entry
 * (james-gibson/local-time#89 §4.1).
 *
 * The argument-sitting roster is from SCOTUSblog's OT2013 term page. Where the
 * ticket gives only the sitting month, the argument keyframe carries
 * `certainty: 0.5` and a `dateRange` spanning that month rather than an invented
 * day; where it gives an exact date (the key dispositions), the keyframe is
 * certain. Consolidated parties are separate docket entries with a
 * `CONSOLIDATED_WITH` reference — the ticket counts them separately (Oct: 13,
 * Feb/Mar: 12) and the one-owner rule forbids merging them.
 */

interface MeritCase {
  /** The id segment; explicit because captions carry punctuation (§3.1). */
  slug: string;
  caption: string;
  /** The `YYYY-MM` sitting the argument was heard in (or the filing month). */
  sitting: string;
  issueArea: string;
  /** Exact argument date (ISO `YYYY-MM-DD`) when the ticket gives one. */
  argued?: string;
  /** Exact decision date (ISO `YYYY-MM-DD`) when the ticket gives one. */
  decided?: string;
  /** A `YYYY-MM` decision month when only the month is known. */
  decidedMonth?: string;
  disposition?: string;
  vote?: string;
  author?: string;
  significance?: number;
  /** Decided without oral argument (§4.1's eight). */
  noArgument?: boolean;
  /** Dismissed from the argument docket. */
  dismissed?: boolean;
  /** A summary reversal (§4.2) — flagged on the decision keyframe. */
  summaryReversal?: boolean;
  crossReference?: { targetUniverseId: string; description: string };
  dualTrack?: { description: string; shadowDate: string };
}

const caseId = (slugValue: string): string => `history:scotus_ot2013_case_${slugValue}:2013`;

const createMeritsCase = (data: MeritCase): Universe => {
  const universeId = caseId(data.slug);
  const bounds = monthBounds(data.sitting);
  const arguedIso = data.argued ? `${data.argued}T12:00:00Z` : bounds.start;
  const decidedIso = data.decided ? `${data.decided}T12:00:00Z` : null;
  const decidedBounds = data.decidedMonth ? monthBounds(data.decidedMonth) : null;
  const significance = data.significance ?? 0.85;

  const references: Array<Record<string, unknown>> = [];
  if (data.crossReference) {
    references.push({
      type: 'CONSOLIDATED_WITH',
      targetUniverseId: data.crossReference.targetUniverseId,
      description: data.crossReference.description,
      confidence: 1.0,
      evidence: ['SCOTUSblog OT2013 term page'],
    });
  }
  if (data.dualTrack) {
    references.push({
      type: 'dual_track',
      targetUniverseId: SCOTUS_TERM_ID,
      description: data.dualTrack.description,
      confidence: 1.0,
      evidence: ['Shadow Docket Database', 'Baude, Foreword: The Supreme Court\u2019s Shadow Docket'],
    });
  }

  const keyframes: TemporalKeyframe[] = [];

  if (data.dismissed) {
    keyframes.push(
      keyframe('dismissed_from_argument_docket', `${bounds.end}`, {
        significance: 0.5,
        tags: ['scotus', 'ot2013', 'merits', 'dismissed', slug(data.issueArea)],
        type: KeyframeType.MILESTONE,
        certainty: 0.5,
        description: `${data.caption} was dismissed from the argument docket.`,
      }),
    );
  } else if (data.noArgument) {
    keyframes.push(
      keyframe('decided_without_argument', decidedIso ?? `${TERM_END_ISO}T12:00:00Z`, {
        significance: data.significance ?? 0.7,
        tags: ['scotus', 'ot2013', 'merits', 'without_argument', slug(data.issueArea)],
        type: KeyframeType.RULING,
        certainty: decidedIso ? 1.0 : 0.4,
        ...(decidedIso ? {} : { dateRange: { earliest: `${TERM_START_ISO}T12:00:00Z`, latest: `${TERM_END_ISO}T12:00:00Z` } }),
        description:
          `${data.caption} — decided without oral argument` +
          `${data.disposition ? `: ${data.disposition}` : ''}.` +
          (decidedIso ? '' : ' Exact date not stated in the source.'),
      }),
    );
  } else {
    keyframes.push(
      keyframe('oral_argument', arguedIso, {
        significance: 0.6,
        tags: ['scotus', 'ot2013', 'merits', 'oral_argument', slug(data.issueArea)],
        type: KeyframeType.MILESTONE,
        certainty: data.argued ? 1.0 : 0.5,
        ...(data.argued ? {} : { dateRange: { earliest: bounds.start, latest: bounds.end } }),
        description: `Oral argument in ${data.caption} (${data.sitting} sitting, ${data.issueArea}).`,
      }),
    );
  }

  if (!data.dismissed) {
    if (decidedIso) {
      keyframes.push(
        keyframe('decision', decidedIso, {
          significance: Math.min(1.0, significance + 0.05),
          tags: [
            'scotus',
            'ot2013',
            'merits',
            'decision',
            ...(data.summaryReversal ? ['summary_reversal'] : []),
            slug(data.issueArea),
          ],
          type: KeyframeType.RULING,
          certainty: 1.0,
          description:
            `${data.caption} — ${data.disposition ?? 'decided on the merits'}` +
            `${data.vote ? `, ${data.vote}` : ''}${data.author ? `, opinion by ${data.author}` : ''}.` +
            (data.summaryReversal ? ' Summary reversal.' : ''),
        }),
      );
    } else if (decidedBounds) {
      keyframes.push(
        keyframe('decision', `${decidedBounds.end}`, {
          significance,
          tags: ['scotus', 'ot2013', 'merits', 'decision', slug(data.issueArea)],
          type: KeyframeType.RULING,
          certainty: 0.6,
          dateRange: { earliest: decidedBounds.start, latest: decidedBounds.end },
          description: `${data.caption} was decided in ${data.decidedMonth}; exact date not stated in the source.`,
        }),
      );
    } else if (!data.noArgument) {
      // The term is over, so every argued case was decided — but the source gives no
      // date. Record the decision with a term-wide window and low certainty rather
      // than invent a day (§7).
      keyframes.push(
        keyframe('decision', `${TERM_END_ISO}T12:00:00Z`, {
          significance,
          tags: ['scotus', 'ot2013', 'merits', 'decision', slug(data.issueArea)],
          type: KeyframeType.RULING,
          certainty: 0.3,
          dateRange: { earliest: `${TERM_START_ISO}T12:00:00Z`, latest: `${TERM_END_ISO}T12:00:00Z` },
          description: `${data.caption} was decided during OT2013; exact date not stated in the source.`,
        }),
      );
    }
  }

  if (data.dualTrack) {
    keyframes.push(
      keyframe('shadow_docket_stay', `${data.dualTrack.shadowDate}T12:00:00Z`, {
        significance: 0.9,
        tags: ['scotus', 'ot2013', 'shadow_docket', 'dual_track'],
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
    aliases: [data.caption, `${data.caption} (OT2013)`],
    description:
      `${data.caption} — a case on the October Term 2013 official docket (${data.issueArea}).` +
      (data.disposition ? ` Disposition: ${data.disposition}.` : ''),
    released: new Date(arguedIso),
    culturalSignificance: significance,
    parents: [SCOTUS_TERM_ID, SCOTUS_MERITS_DOCKET_ID],
    segments: [
      {
        id: 'case_on_docket',
        start: fromIso(arguedIso),
        end: fromIso(decidedIso ?? (decidedBounds ? `${decidedBounds.end}` : `${TERM_END_ISO}T12:00:00Z`)),
        type: 'court_jurisdiction',
        status: !data.dismissed && (decidedIso || decidedBounds) ? 'inactive' : 'active',
        jurisdiction: 'United States',
        description: data.dismissed
          ? 'Dismissed from the argument docket.'
          : decidedIso || decidedBounds
            ? `From the ${data.sitting} sitting to the decision.`
            : `Pending on the OT2013 docket after the ${data.sitting} sitting.`,
      },
    ],
    keyframes,
    references,
  });
};

const meritCases: MeritCase[] = [
  // --- October 2013 sitting (13) ---
  { slug: 'madigan_v_levin', caption: 'Madigan v. Levin', sitting: '2013-10', issueArea: 'Civil' },
  { slug: 'burt_v_titlow', caption: 'Burt v. Titlow', sitting: '2013-10', issueArea: 'Habeas Corpus' },
  { slug: 'chadbourne_parke_v_troice', caption: "Chadbourne & Parke LLP v. Troice", sitting: '2013-10', issueArea: 'Securities', crossReference: { targetUniverseId: caseId('willis_of_colorado_v_troice'), description: 'Consolidated with Willis of Colorado v. Troice and Proskauer Rose v. Troice.' } },
  { slug: 'willis_of_colorado_v_troice', caption: 'Willis of Colorado Inc. v. Troice', sitting: '2013-10', issueArea: 'Securities', crossReference: { targetUniverseId: caseId('chadbourne_parke_v_troice'), description: 'Consolidated with Chadbourne & Parke v. Troice and Proskauer Rose v. Troice.' } },
  { slug: 'proskauer_rose_v_troice', caption: 'Proskauer Rose LLP v. Troice', sitting: '2013-10', issueArea: 'Securities', crossReference: { targetUniverseId: caseId('chadbourne_parke_v_troice'), description: 'Consolidated with Chadbourne & Parke v. Troice and Willis of Colorado v. Troice.' } },
  { slug: 'mccutcheon_v_fec', caption: 'McCutcheon v. FEC', sitting: '2013-10', issueArea: 'Campaign Finance', significance: 1.0, argued: '2013-10-08', decided: '2014-04-02', disposition: 'aggregate contribution limits struck down', vote: '5-4', author: 'Roberts' },
  { slug: 'united_states_v_woods', caption: 'United States v. Woods', sitting: '2013-10', issueArea: 'Tax' },
  { slug: 'atlantic_marine_constr_v_us_district_court', caption: 'Atlantic Marine Construction Co. v. U.S. District Court', sitting: '2013-10', issueArea: 'Civil Procedure' },
  { slug: 'daimler_ag_v_bauman', caption: 'Daimler AG v. Bauman', sitting: '2013-10', issueArea: 'Civil Procedure' },
  { slug: 'schuette_v_bamn', caption: 'Schuette v. BAMN', sitting: '2013-10', issueArea: 'Affirmative Action', significance: 0.95, argued: '2013-10-15', decided: '2014-04-22', disposition: 'state ballot-measure ban upheld' },
  { slug: 'heimeshoff_v_hartford_life', caption: 'Heimeshoff v. Hartford Life & Accident Ins. Co.', sitting: '2013-10', issueArea: 'ERISA' },
  { slug: 'kaley_v_united_states', caption: 'Kaley v. United States', sitting: '2013-10', issueArea: 'Asset Forfeiture' },
  { slug: 'kansas_v_cheever', caption: 'Kansas v. Cheever', sitting: '2013-10', issueArea: 'Criminal' },

  // --- November 2013 sitting (12) ---
  { slug: 'sandifer_v_us_steel', caption: 'Sandifer v. United States Steel Corp.', sitting: '2013-11', issueArea: 'Labor' },
  { slug: 'walden_v_fiore', caption: 'Walden v. Fiore', sitting: '2013-11', issueArea: 'Civil Procedure' },
  { slug: 'bond_v_united_states', caption: 'Bond v. United States', sitting: '2013-11', issueArea: 'Treaty Power' },
  { slug: 'sprint_communications_v_jacobs', caption: 'Sprint Communications, Inc. v. Jacobs', sitting: '2013-11', issueArea: 'Civil Procedure' },
  { slug: 'medtronic_v_mirowski', caption: 'Medtronic, Inc. v. Mirowski Family Ventures, LLC', sitting: '2013-11', issueArea: 'Patent' },
  { slug: 'town_of_greece_v_galloway', caption: 'Town of Greece v. Galloway', sitting: '2013-11', issueArea: 'First Amendment', significance: 0.95, argued: '2013-11-06', decided: '2014-05-05', disposition: 'legislative prayer upheld' },
  { slug: 'mississippi_ex_rel_hood_v_au_optronics', caption: 'Mississippi ex rel. Hood v. AU Optronics Corp.', sitting: '2013-11', issueArea: 'Civil Procedure' },
  { slug: 'lawson_v_fmr_llc', caption: 'Lawson v. FMR LLC', sitting: '2013-11', issueArea: 'Whistleblower' },
  { slug: 'rosemond_v_united_states', caption: 'Rosemond v. United States', sitting: '2013-11', issueArea: 'Criminal' },
  { slug: 'burrage_v_united_states', caption: 'Burrage v. United States', sitting: '2013-11', issueArea: 'Criminal' },
  { slug: 'unite_here_local_355_v_mulhall', caption: 'Unite Here Local 355 v. Mulhall', sitting: '2013-11', issueArea: 'Labor' },
  { slug: 'fernandez_v_california', caption: 'Fernandez v. California', sitting: '2013-11', issueArea: 'Fourth Amendment' },

  // --- December 2013 sitting (11) ---
  { slug: 'bg_group_plc_v_republic_of_argentina', caption: 'BG Group plc v. Republic of Argentina', sitting: '2013-12', issueArea: 'Arbitration' },
  { slug: 'michigan_v_bay_mills_indian_community', caption: 'Michigan v. Bay Mills Indian Community', sitting: '2013-12', issueArea: 'Tribal Sovereignty' },
  { slug: 'northwest_inc_v_ginsberg', caption: 'Northwest, Inc. v. Ginsberg', sitting: '2013-12', issueArea: 'Preemption' },
  { slug: 'lexmark_v_static_control', caption: 'Lexmark International, Inc. v. Static Control Components, Inc.', sitting: '2013-12', issueArea: 'Antitrust' },
  { slug: 'united_states_v_apel', caption: 'United States v. Apel', sitting: '2013-12', issueArea: 'First Amendment' },
  { slug: 'air_wisconsin_airlines_v_hoeper', caption: 'Air Wisconsin Airlines Corp. v. Hoeper', sitting: '2013-12', issueArea: 'Aviation Immunity' },
  { slug: 'ray_haluch_gravel_co_v_central_pension_fund', caption: 'Ray Haluch Gravel Co. v. Central Pension Fund', sitting: '2013-12', issueArea: 'ERISA' },
  { slug: 'scialabba_v_cuellar_de_osorio', caption: 'Scialabba v. Cuellar de Osorio', sitting: '2013-12', issueArea: 'Immigration' },
  { slug: 'epa_v_eme_homer_city', caption: 'EPA v. EME Homer City Generation, L.P.', sitting: '2013-12', issueArea: 'Environment', significance: 0.95, argued: '2013-12-10', decided: '2014-04-29', disposition: 'Cross-State Air Pollution Rule upheld' },
  { slug: 'white_v_woodall', caption: 'White v. Woodall', sitting: '2013-12', issueArea: 'Habeas Corpus' },
  { slug: 'lozano_v_alvarez', caption: 'Lozano v. Alvarez', sitting: '2013-12', issueArea: 'Hague Convention' },

  // --- January 2014 sitting (12) ---
  { slug: 'nlrb_v_noel_canning', caption: 'NLRB v. Noel Canning', sitting: '2014-01', issueArea: 'Recess Appointments', significance: 1.0, argued: '2014-01-13', decided: '2014-06-26', disposition: 'recess appointments during intra-session breaks invalid' },
  { slug: 'law_v_siegel', caption: 'Law v. Siegel', sitting: '2014-01', issueArea: 'Bankruptcy' },
  { slug: 'marvin_m_brandt_revocable_trust_v_united_states', caption: 'Marvin M. Brandt Revocable Trust v. United States', sitting: '2014-01', issueArea: 'Property' },
  { slug: 'executive_benefits_ins_agency_v_arkison', caption: 'Executive Benefits Insurance Agency v. Arkison', sitting: '2014-01', issueArea: 'Bankruptcy' },
  { slug: 'united_states_v_quality_stores', caption: 'United States v. Quality Stores, Inc.', sitting: '2014-01', issueArea: 'Tax' },
  { slug: 'mccullen_v_coakley', caption: 'McCullen v. Coakley', sitting: '2014-01', issueArea: 'First Amendment', significance: 0.95, argued: '2014-01-15', decided: '2014-06-26', disposition: 'abortion-clinic buffer zones struck down' },
  { slug: 'united_states_v_castleman', caption: 'United States v. Castleman', sitting: '2014-01', issueArea: 'Firearms' },
  { slug: 'harris_v_quinn', caption: 'Harris v. Quinn', sitting: '2014-01', issueArea: 'Labor', significance: 0.9, argued: '2014-01-21', decided: '2014-06-30', disposition: 'partial-public union agency fees struck down' },
  { slug: 'petrella_v_mgm', caption: 'Petrella v. Metro-Goldwyn-Mayer, Inc.', sitting: '2014-01', issueArea: 'Copyright' },
  { slug: 'navarette_v_california', caption: 'Navarette v. California', sitting: '2014-01', issueArea: 'Fourth Amendment' },
  { slug: 'abramski_v_united_states', caption: 'Abramski v. United States', sitting: '2014-01', issueArea: 'Firearms' },
  { slug: 'paroline_v_united_states', caption: 'Paroline v. United States', sitting: '2014-01', issueArea: 'Restitution' },

  // --- February/March 2014 sitting (12) ---
  { slug: 'utility_air_regulatory_group_v_epa', caption: 'Utility Air Regulatory Group v. EPA', sitting: '2014-02', issueArea: 'Environment', significance: 0.95, argued: '2014-02-24', decided: '2014-06-23', disposition: 'greenhouse-gas permitting partly upheld', crossReference: { targetUniverseId: caseId('american_chemistry_council_v_epa'), description: 'Consolidated with five related EPA greenhouse-gas petitions (American Chemistry Council, Energy-Intensive Manufacturers, Southeastern Legal Foundation, Texas and the Chamber of Commerce).' } },
  { slug: 'american_chemistry_council_v_epa', caption: 'American Chemistry Council v. EPA', sitting: '2014-02', issueArea: 'Environment', argued: '2014-02-24', decided: '2014-06-23', crossReference: { targetUniverseId: caseId('utility_air_regulatory_group_v_epa'), description: 'Consolidated with Utility Air Regulatory Group v. EPA and the related greenhouse-gas petitions.' } },
  { slug: 'energy_intensive_manufacturers_v_epa', caption: 'Energy-Intensive Manufacturers Working Group on Greenhouse Gas Regulation v. EPA', sitting: '2014-02', issueArea: 'Environment', argued: '2014-02-24', decided: '2014-06-23', crossReference: { targetUniverseId: caseId('utility_air_regulatory_group_v_epa'), description: 'Consolidated with Utility Air Regulatory Group v. EPA and the related greenhouse-gas petitions.' } },
  { slug: 'southeastern_legal_foundation_v_epa', caption: 'Southeastern Legal Foundation v. EPA', sitting: '2014-02', issueArea: 'Environment', argued: '2014-02-24', decided: '2014-06-23', crossReference: { targetUniverseId: caseId('utility_air_regulatory_group_v_epa'), description: 'Consolidated with Utility Air Regulatory Group v. EPA and the related greenhouse-gas petitions.' } },
  { slug: 'texas_v_epa', caption: 'Texas v. EPA', sitting: '2014-02', issueArea: 'Environment', argued: '2014-02-24', decided: '2014-06-23', crossReference: { targetUniverseId: caseId('utility_air_regulatory_group_v_epa'), description: 'Consolidated with Utility Air Regulatory Group v. EPA and the related greenhouse-gas petitions.' } },
  { slug: 'chamber_of_commerce_v_epa', caption: 'Chamber of Commerce v. EPA', sitting: '2014-02', issueArea: 'Environment', argued: '2014-02-24', decided: '2014-06-23', crossReference: { targetUniverseId: caseId('utility_air_regulatory_group_v_epa'), description: 'Consolidated with Utility Air Regulatory Group v. EPA and the related greenhouse-gas petitions.' } },
  { slug: 'robers_v_united_states', caption: 'Robers v. United States', sitting: '2014-02', issueArea: 'Restitution' },
  { slug: 'highmark_v_allcare', caption: 'Highmark Inc. v. Allcare Health Management System', sitting: '2014-02', issueArea: 'Patent' },
  { slug: 'octane_fitness_v_icon', caption: 'Octane Fitness, LLC v. ICON Health & Fitness, Inc.', sitting: '2014-02', issueArea: 'Patent' },
  { slug: 'hall_v_florida', caption: 'Hall v. Florida', sitting: '2014-02', issueArea: 'Death Penalty' },
  { slug: 'plumhoff_v_rickard', caption: 'Plumhoff v. Rickard', sitting: '2014-02', issueArea: 'Qualified Immunity' },
  { slug: 'halliburton_v_erica_p_john_fund', caption: 'Halliburton Co. v. Erica P. John Fund, Inc.', sitting: '2014-02', issueArea: 'Securities', significance: 0.9, argued: '2014-03-05', decided: '2014-06-23', disposition: 'fraud-on-the-market presumption retained' },

  // --- March/April 2014 sitting (7) ---
  { slug: 'clark_v_rameker', caption: 'Clark v. Rameker', sitting: '2014-03', issueArea: 'Bankruptcy' },
  { slug: 'burwell_v_hobby_lobby', caption: 'Burwell v. Hobby Lobby Stores, Inc.', sitting: '2014-03', issueArea: 'Religious Liberty', significance: 1.0, argued: '2014-03-25', decided: '2014-06-30', disposition: 'contraceptive mandate opt-out for closely held corporations under RFRA', vote: '5-4', author: 'Alito', crossReference: { targetUniverseId: caseId('conestoga_wood_specialties_v_burwell'), description: 'Consolidated with Conestoga Wood Specialties v. Burwell (No. 13-356); the same RFRA contraceptive-mandate question.' }, dualTrack: { description: 'The contraceptive mandate is the term\u2019s marquee dual-track matter: the merits question was decided here (Hobby Lobby / Conestoga, 2014-06-30) while the shadow track ran as Little Sisters of the Poor v. Sebelius (stay 2013-12-31) and Wheaton College v. Burwell (13A1284, 2014-07-03).', shadowDate: '2014-07-03' } },
  { slug: 'conestoga_wood_specialties_v_burwell', caption: 'Conestoga Wood Specialties Corp. v. Burwell', sitting: '2014-03', issueArea: 'Religious Liberty', significance: 1.0, argued: '2014-03-25', decided: '2014-06-30', disposition: 'contraceptive mandate opt-out for closely held corporations under RFRA', vote: '5-4', author: 'Alito', crossReference: { targetUniverseId: caseId('burwell_v_hobby_lobby'), description: 'Consolidated with Burwell v. Hobby Lobby Stores, Inc. (No. 13-354); the same RFRA contraceptive-mandate question.' } },
  { slug: 'wood_v_moss', caption: 'Wood v. Moss', sitting: '2014-03', issueArea: 'Civil Procedure' },
  { slug: 'alice_corp_v_cls_bank', caption: 'Alice Corp. v. CLS Bank International', sitting: '2014-03', issueArea: 'Patent', significance: 0.9, argued: '2014-03-31', decided: '2014-06-19', disposition: 'abstract-idea patent claims ineligible' },
  { slug: 'loughrin_v_united_states', caption: 'Loughrin v. United States', sitting: '2014-03', issueArea: 'Bank Fraud' },
  { slug: 'fifth_third_bancorp_v_dudenhoeffer', caption: 'Fifth Third Bancorp v. Dudenhoeffer', sitting: '2014-03', issueArea: 'ERISA' },

  // --- April 2014 sitting (11) ---
  { slug: 'pom_wonderful_v_coca_cola', caption: 'POM Wonderful LLC v. Coca-Cola Co.', sitting: '2014-04', issueArea: 'Lanham Act' },
  { slug: 'republic_of_argentina_v_nml_capital', caption: 'Republic of Argentina v. NML Capital, Ltd.', sitting: '2014-04', issueArea: 'Sovereign Immunity' },
  { slug: 'susan_b_anthony_list_v_driehaus', caption: 'Susan B. Anthony List v. Driehaus', sitting: '2014-04', issueArea: 'First Amendment' },
  { slug: 'abc_v_aereo', caption: 'American Broadcasting Cos. v. Aereo, Inc.', sitting: '2014-04', issueArea: 'Copyright', significance: 0.9, argued: '2014-04-22', decided: '2014-06-25', disposition: 'Aereo\u2019s streaming infringed the public-performance right' },
  { slug: 'united_states_v_clarke', caption: 'United States v. Clarke', sitting: '2014-04', issueArea: 'Tax' },
  { slug: 'cts_corp_v_waldburger', caption: 'CTS Corp. v. Waldburger', sitting: '2014-04', issueArea: 'Environment' },
  { slug: 'nautilus_v_biosig', caption: 'Nautilus, Inc. v. Biosig Instruments, Inc.', sitting: '2014-04', issueArea: 'Patent' },
  { slug: 'lane_v_franks', caption: 'Lane v. Franks', sitting: '2014-04', issueArea: 'First Amendment' },
  { slug: 'riley_v_california', caption: 'Riley v. California', sitting: '2014-04', issueArea: 'Fourth Amendment', significance: 1.0, argued: '2014-04-29', decided: '2014-06-25', disposition: 'warrant required to search a cell phone incident to arrest', crossReference: { targetUniverseId: caseId('united_states_v_wurie'), description: 'Consolidated with United States v. Wurie; one opinion on cell-phone searches incident to arrest.' } },
  { slug: 'united_states_v_wurie', caption: 'United States v. Wurie', sitting: '2014-04', issueArea: 'Fourth Amendment', significance: 0.95, argued: '2014-04-29', decided: '2014-06-25', disposition: 'warrant required to search a cell phone incident to arrest', crossReference: { targetUniverseId: caseId('riley_v_california'), description: 'Consolidated with Riley v. California; one opinion on cell-phone searches incident to arrest.' } },
  { slug: 'limelight_networks_v_akamai', caption: 'Limelight Networks, Inc. v. Akamai Technologies, Inc.', sitting: '2014-04', issueArea: 'Patent' },

  // --- Decided without oral argument (8) ---
  { slug: 'cline_v_oklahoma_coalition', caption: 'Cline v. Oklahoma Coalition for Reproductive Justice', sitting: '2013-11', issueArea: 'Reproductive Rights', noArgument: true, decided: '2013-11-04', disposition: 'cert dismissed as improvidently granted' },
  { slug: 'stanton_v_sims', caption: 'Stanton v. Sims', sitting: '2013-11', issueArea: 'Qualified Immunity', noArgument: true, summaryReversal: true, decided: '2013-11-04', disposition: 'summary reversal' },
  { slug: 'mount_holly_v_mt_holly_gardens', caption: 'Mount Holly v. Mt. Holly Gardens Citizens in Action, Inc.', sitting: '2013-11', issueArea: 'Fair Housing', noArgument: true, decided: '2013-11-13', disposition: 'cert dismissed as improvidently granted' },
  { slug: 'ford_motor_v_united_states', caption: 'Ford Motor Co. v. United States', sitting: '2013-12', issueArea: 'Tax', noArgument: true, decided: '2013-12-02', disposition: 'revenue-ruling challenge dismissed' },
  { slug: 'hinton_v_alabama', caption: 'Hinton v. Alabama', sitting: '2014-02', issueArea: 'Habeas Corpus', noArgument: true, summaryReversal: true, decided: '2014-02-24', disposition: 'summary reversal (ineffective assistance of counsel)' },
  { slug: 'tolan_v_cotton', caption: 'Tolan v. Cotton', sitting: '2014-05', issueArea: 'Qualified Immunity', noArgument: true, summaryReversal: true, decided: '2014-05-05', disposition: 'summary reversal (qualified immunity)' },
  { slug: 'us_forest_service_v_pacific_rivers', caption: 'United States Forest Service v. Pacific Rivers Council', sitting: '2014-06', issueArea: 'Environment', noArgument: true },
  { slug: 'ubs_v_union_de_empleados', caption: 'UBS Financial Services Inc. v. Union de Empleados de Muelles de Puerto Rico', sitting: '2014-06', issueArea: 'Arbitration', dismissed: true },

  // --- Summary reversals decided by order (2; also merits-table entries, §4.2) ---
  { slug: 'martinez_v_illinois', caption: 'Martinez v. Illinois', sitting: '2014-05', issueArea: 'Criminal', noArgument: true, summaryReversal: true, decided: '2014-05-27', disposition: 'summary reversal' },
  { slug: 'williams_v_johnson', caption: 'Williams v. Johnson', sitting: '2014-07', issueArea: 'Habeas Corpus', noArgument: true, summaryReversal: true, decided: '2014-07-01', disposition: 'summary reversal' },
];

export const scotusOt2013MeritsCases: Universe[] = meritCases.map(createMeritsCase);

/** How many docket entries this subtree models (asserted by the registration test). */
export const scotusOt2013MeritsCaseCount = meritCases.length;
