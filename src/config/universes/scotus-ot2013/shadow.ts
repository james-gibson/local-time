import { Universe, UniverseType, KeyframeType } from '../../../core/types';
import { SCOTUS_TERM_ID, SCOTUS_SHADOW_DOCKET_ID, fromIso, keyframe, scotusUniverse, slug } from './shared';

/**
 * The OT2013 shadow docket — one universe per emergency application
 * (james-gibson/local-time#89 §4.2).
 *
 * Each application carries one `ruling` keyframe per recorded order. A matter
 * ruled on more than once (*Little Sisters of the Poor v. Sebelius* — a temporary
 * stay on New Year's Eve 2013, then a longer stay by the full Court in late
 * January 2014) is defined **once**, with both rulings as keyframes, rather than
 * duplicated — the ticket's one-owner rule (§3.1).
 *
 * The term's five summary reversals (*Williams*, *Martinez*, *Tolan*, *Hinton*,
 * *Stanton*) are **not** repeated here: they live on their merits docket entries,
 * once each (§4.2).
 *
 * Dates, outcomes and recorded dissents are from §4.2 (the Journal of the Supreme
 * Court and the Shadow Docket Database; Baude's foreword for the dissents).
 */

interface ShadowRuling {
  /** Exact ISO `YYYY-MM-DD`, when the source gives one. */
  date?: string;
  /** A `YYYY-MM` month when only the month is known. */
  dateMonth?: string;
  outcome: string;
  dissents?: string;
  significance?: number;
  description?: string;
}

interface ShadowApplication {
  slug: string;
  caption: string;
  /** The `13A`/`14A` number, when the ticket gives it (§3.1). */
  applicationNumber?: string;
  rulings: ShadowRuling[];
  significance?: number;
}

const shadowId = (data: ShadowApplication): string =>
  `history:scotus_ot2013_shadow_${data.applicationNumber ? `${data.applicationNumber}_` : ''}${data.slug}:2013`;

const monthWindow = (month: string): { start: string; end: string } => {
  const [year, mon] = month.split('-').map(Number);
  const lastDay = new Date(Date.UTC(year, mon, 0)).getUTCDate();
  return { start: `${month}-01T12:00:00Z`, end: `${month}-${String(lastDay).padStart(2, '0')}T12:00:00Z` };
};

const createShadowApplication = (data: ShadowApplication): Universe => {
  const universeId = shadowId(data);
  const significance = data.significance ?? 0.5;

  const ordered = [...data.rulings].sort((a, b) =>
    (a.date ?? a.dateMonth ?? '').localeCompare(b.date ?? b.dateMonth ?? ''),
  );
  const isoOf = (r: ShadowRuling): string => (r.date ? `${r.date}T12:00:00Z` : `${monthWindow(r.dateMonth!).end}`);
  const firstIso = isoOf(ordered[0]);
  const lastIso = isoOf(ordered[ordered.length - 1]);

  const keyframes = ordered.map((ruling, index) => {
    const window = ruling.dateMonth ? monthWindow(ruling.dateMonth) : null;
    return keyframe(
      ordered.length > 1 ? `ruling_${index + 1}` : 'ruling',
      isoOf(ruling),
      {
        significance: ruling.significance ?? significance,
        tags: ['scotus', 'ot2013', 'shadow_docket', slug(ruling.outcome)],
        type: KeyframeType.RULING,
        certainty: ruling.date ? 1.0 : 0.5,
        ...(window ? { dateRange: { earliest: window.start, latest: window.end } } : {}),
        description:
          `${data.caption} — ${ruling.outcome}${ruling.dissents ? `; dissent: ${ruling.dissents}` : ''}.` +
          `${ruling.description ? ` ${ruling.description}` : ''}` +
          (ruling.date ? '' : ` Exact date not stated in the source; recorded within ${ruling.dateMonth}.`),
      },
    );
  });

  return scotusUniverse({
    universeId,
    type: UniverseType.LEGAL_TIMELINE,
    canonicalName: data.caption,
    aliases: [
      data.caption,
      `${data.caption} (OT2013)`,
      ...(data.applicationNumber ? [`${data.applicationNumber} application`] : []),
    ],
    description:
      `${data.caption} — an emergency/interim application on the October Term 2013 shadow docket, ` +
      `ruled on from the bench without full briefing or argument.`,
    released: new Date(firstIso),
    culturalSignificance: significance,
    parents: [SCOTUS_TERM_ID, SCOTUS_SHADOW_DOCKET_ID],
    segments: [
      {
        id: 'application_on_shadow_docket',
        start: fromIso(firstIso),
        end: fromIso(lastIso),
        type: 'court_jurisdiction',
        status: 'inactive',
        jurisdiction: 'United States',
        description: `${ordered.length} recorded order${ordered.length > 1 ? 's' : ''} on the shadow docket.`,
      },
    ],
    keyframes,
  });
};

const applications: ShadowApplication[] = [
  {
    slug: 'little_sisters_of_the_poor_v_sebelius',
    caption: 'Little Sisters of the Poor v. Sebelius',
    significance: 0.9,
    rulings: [
      {
        date: '2013-12-31',
        outcome: 'temporary stay granted by Justice Sotomayor (in-chambers)',
        dissents: 'none recorded (in-chambers order)',
        description: 'Contraceptive mandate; New Year\u2019s Eve in-chambers stay pending the full Court.',
      },
      {
        dateMonth: '2014-01',
        outcome: 'longer stay granted by the full Court',
        description: 'Contraceptive mandate; the full Court extended the stay.',
      },
    ],
  },
  {
    slug: 'herbert_v_kitchen',
    caption: 'Herbert v. Kitchen',
    rulings: [
      {
        date: '2014-01-06',
        outcome: 'stay granted (application to Sotomayor, referred to the Court)',
        description: 'Stayed Utah\u2019s same-sex-marriage ruling pending appeal; the shadow track preceded the merits line (Obergefell, OT2014, out of scope).',
      },
    ],
  },
  {
    slug: 'wheaton_college_v_burwell',
    caption: 'Wheaton College v. Burwell',
    applicationNumber: '13a1284',
    significance: 0.9,
    rulings: [
      {
        date: '2014-07-03',
        outcome: 'emergency injunction granted',
        dissents: 'Sotomayor, joined by two others',
        significance: 0.9,
        description:
          'Contraceptive mandate; Sotomayor accused the Court of contradicting its own Hobby Lobby ' +
          'decision and of improperly using the All Writs Act — "undermin[ing] confidence in this institution". ' +
          'Three days after Hobby Lobby was decided.',
      },
    ],
  },
  {
    slug: 'wood_v_arizona_execution',
    caption: 'Wood v. Arizona (execution stay)',
    significance: 0.6,
    rulings: [
      {
        date: '2014-07-23',
        outcome: 'Ninth Circuit stay vacated',
        description: 'Arizona execution; Joseph Wood gasped for roughly two hours before dying.',
      },
    ],
  },
  {
    slug: 'husted_v_ohio_naacp',
    caption: 'Husted v. Ohio NAACP',
    applicationNumber: '14a336',
    significance: 0.8,
    rulings: [
      {
        date: '2014-09-29',
        outcome: 'stay granted 5-4',
        dissents: 'Ginsburg, Breyer, Kagan and Sotomayor would have denied',
        description: 'Ohio cut early voting from 35 to 28 days, ending the "Golden Week".',
      },
    ],
  },
];

export const scotusOt2013ShadowApplications: Universe[] = applications.map(createShadowApplication);

/** How many shadow applications this subtree models (asserted by the registration test). */
export const scotusOt2013ShadowApplicationCount = applications.length;
