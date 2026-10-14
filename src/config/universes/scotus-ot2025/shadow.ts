import { Universe, UniverseType, KeyframeType } from '../../../core/types';
import {
  SCOTUS_TERM_ID,
  SCOTUS_SHADOW_DOCKET_ID,
  fromIso,
  keyframe,
  scotusUniverse,
  slug,
} from './shared';

/**
 * The OT2025 shadow docket — one universe per emergency application
 * (james-gibson/local-time#88 §4.2).
 *
 * Each application carries one `ruling` keyframe per recorded order. A matter
 * that was ruled on more than once (Noem v. National TPS Alliance, May 19 and
 * October 3, 2025) is defined **once**, with both rulings as keyframes, rather
 * than duplicated — the ticket's one-owner rule (§3.1). Trump v. Slaughter's
 * shadow stay lives on its merits case (`trump_v_slaughter`), not here.
 *
 * Dates, outcomes and recorded dissents are from the shadow-docket tables in §4.2
 * (Britannica, supremecourtcasetracker.com, Brennan Center).
 */

interface ShadowRuling {
  date: string;
  outcome: string;
  dissents?: string;
  significance?: number;
  description?: string;
}

interface ShadowApplication {
  slug: string;
  caption: string;
  /** The `25A` number, when the ticket gives it (§3.1). */
  applicationNumber?: string;
  rulings: ShadowRuling[];
  significance?: number;
}

const shadowId = (data: ShadowApplication): string =>
  `history:scotus_ot2025_shadow_${data.applicationNumber ? `${data.applicationNumber}_` : ''}${data.slug}:2025`;

const createShadowApplication = (data: ShadowApplication): Universe => {
  const universeId = shadowId(data);
  const sorted = [...data.rulings].sort((a, b) => a.date.localeCompare(b.date));
  const firstDate = sorted[0].date;
  const lastDate = sorted[sorted.length - 1].date;
  const significance = data.significance ?? 0.5;

  const keyframes = sorted.map((ruling, index) =>
    keyframe(sorted.length > 1 ? `ruling_${index + 1}` : 'ruling', `${ruling.date}T12:00:00Z`, {
      significance: ruling.significance ?? significance,
      tags: ['scotus', 'ot2025', 'shadow_docket', slug(ruling.outcome)],
      type: KeyframeType.RULING,
      certainty: 1.0,
      description:
        `${data.caption} — ${ruling.outcome}${ruling.dissents ? `; dissent: ${ruling.dissents}` : ''}` +
        `${ruling.description ? `. ${ruling.description}` : '.'}`,
    }),
  );

  return scotusUniverse({
    universeId,
    type: UniverseType.LEGAL_TIMELINE,
    canonicalName: data.caption,
    aliases: [
      data.caption,
      ...(data.applicationNumber ? [data.applicationNumber.toUpperCase()] : []),
    ],
    description:
      `${data.caption} — an emergency (shadow docket) application to the Supreme Court, ruled on ` +
      `${sorted.map((r) => `${r.date} (${r.outcome})`).join(' and ')}.`,
    released: new Date(`${firstDate}T12:00:00Z`),
    culturalSignificance: significance,
    parents: [SCOTUS_TERM_ID, SCOTUS_SHADOW_DOCKET_ID],
    segments: [
      {
        id: 'emergency_application',
        start: fromIso('2025-01-01T12:00:00Z'),
        end: fromIso(`${lastDate}T12:00:00Z`),
        type: 'court_jurisdiction',
        status: 'inactive',
        jurisdiction: 'United States',
        description: 'Emergency/interim application to the Court.',
      },
    ],
    keyframes,
  });
};

const shadowApplications: ShadowApplication[] = [
  { slug: 'department_of_state_v_aids_vaccine_advocacy_coalition', caption: "Dep't of State v. AIDS Vaccine Advocacy Coalition", rulings: [{ date: '2025-03-05', outcome: 'denied', dissents: 'Kagan, Sotomayor, Jackson', description: 'Foreign-aid freeze' }] },
  { slug: 'department_of_education_v_california', caption: "Dep't of Education v. California", rulings: [{ date: '2025-04-04', outcome: 'granted' }] },
  { slug: 'opm_v_afge', caption: 'OPM v. AFGE', rulings: [{ date: '2025-04-08', outcome: 'granted', description: '16,000 reinstatements stayed' }] },
  { slug: 'a_a_r_p_v_trump', caption: 'A.A.R.P. v. Trump', rulings: [{ date: '2025-04-19', outcome: 'denied', dissents: 'Alito (joined by Thomas)', description: 'Alien Enemies Act' }] },
  { slug: 'trump_v_j_g_g', caption: 'Trump v. J.G.G.', rulings: [{ date: '2025-04-27', outcome: 'granted' }] },
  { slug: 'united_states_v_shilling', caption: 'United States v. Shilling', rulings: [{ date: '2025-05-06', outcome: 'granted', description: 'Military; gender dysphoria' }] },
  { slug: 'noem_v_national_tps_alliance', caption: 'Noem v. National TPS Alliance', rulings: [{ date: '2025-05-19', outcome: 'granted' }, { date: '2025-10-03', outcome: 'granted', dissents: 'Sotomayor, Kagan, Jackson' }], significance: 0.6 },
  { slug: 'trump_v_wilcox', caption: 'Trump v. Wilcox', rulings: [{ date: '2025-05-22', outcome: 'granted', description: 'NLRB / MSPB' }] },
  { slug: 'noem_v_doe', caption: 'Noem v. Doe', rulings: [{ date: '2025-05-30', outcome: 'granted', description: 'Parole programs' }] },
  { slug: 'ssa_v_afscme', caption: 'SSA v. AFSCME', rulings: [{ date: '2025-06-06', outcome: 'granted', description: 'DOGE records' }] },
  { slug: 'dhs_v_d_v_d', caption: 'DHS v. D.V.D.', rulings: [{ date: '2025-06-23', outcome: 'granted', description: 'Third-country removal' }] },
  { slug: 'trump_v_casa', caption: 'Trump v. CASA', rulings: [{ date: '2025-06-27', outcome: 'granted', description: 'Nationwide-injunction question; the Court also ordered merits argument (dual track)' }], significance: 0.7 },
  { slug: 'trump_v_afge', caption: 'Trump v. AFGE', rulings: [{ date: '2025-07-08', outcome: 'granted', description: 'RIF plans' }] },
  { slug: 'mcmahon_v_new_york', caption: 'McMahon v. New York', rulings: [{ date: '2025-07-14', outcome: 'granted', description: '1,378 Education Department employees' }] },
  { slug: 'trump_v_boyle', caption: 'Trump v. Boyle', rulings: [{ date: '2025-07-23', outcome: 'granted', dissents: 'Kagan, Sotomayor, Jackson', description: 'CPSC' }] },
  { slug: 'nih_v_american_public_health_assn', caption: "NIH v. American Public Health Ass'n", rulings: [{ date: '2025-08-21', outcome: 'granted in part', dissents: '8 dissents (incl. Roberts, Kavanaugh)' }], significance: 0.6 },
  { slug: 'noem_v_perdomo', caption: 'Noem v. Perdomo', applicationNumber: '25a169', rulings: [{ date: '2025-09-08', outcome: 'granted', dissents: 'Sotomayor, Kagan, Jackson', description: 'Investigative stops' }], significance: 0.6 },
  { slug: 'south_carolina_v_doe', caption: 'South Carolina v. Doe', rulings: [{ date: '2025-09-10', outcome: 'denied', dissents: 'Thomas, Alito, Gorsuch' }] },
  { slug: 'trump_v_orr', caption: 'Trump v. Orr', rulings: [{ date: '2025-11-06', outcome: 'granted', dissents: 'Jackson, Kagan, Sotomayor', description: 'Passport gender markers' }], significance: 0.6 },
  { slug: 'abbott_v_lulac', caption: 'Abbott v. LULAC', rulings: [{ date: '2025-12-04', outcome: 'granted', dissents: 'Kagan, Sotomayor, Jackson', description: 'Texas redistricting map' }], significance: 0.6 },
  { slug: 'trump_v_illinois', caption: 'Trump v. Illinois', applicationNumber: '25a443', rulings: [{ date: '2025-12-23', outcome: 'denied', dissents: 'Alito, Thomas, Gorsuch', description: 'National Guard deployment' }], significance: 0.6 },
  { slug: 'tangipa_v_newsom', caption: 'Tangipa v. Newsom', rulings: [{ date: '2026-02-04', outcome: 'denied' }] },
  { slug: 'mirabelli_v_bonta', caption: 'Mirabelli v. Bonta', rulings: [{ date: '2026-02-26', outcome: 'granted in part' }] },
  { slug: 'bannon_v_united_states', caption: 'Bannon v. United States', rulings: [{ date: '2026-04-06', outcome: 'vacated and remanded' }] },
  // Capital cases decided in days.
  { slug: 'anthony_boyd_v_hamm', caption: 'Anthony Boyd v. Hamm', rulings: [{ date: '2025-01-01', outcome: 'denied', significance: 0.4, description: 'Capital case; 2 days to ruling (date approximate)' }], significance: 0.4 },
  { slug: 'michael_bell_v_dixon', caption: 'Michael Bell v. Dixon', rulings: [{ date: '2025-01-01', outcome: 'denied', significance: 0.4, description: 'Capital case; 1 day to ruling (date approximate)' }], significance: 0.4 },
];

export const scotusOt2025ShadowApplications: Universe[] = shadowApplications.map(
  createShadowApplication,
);
