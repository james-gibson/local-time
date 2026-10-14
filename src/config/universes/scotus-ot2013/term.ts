import { Universe, UniverseType, KeyframeType } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import {
  SCOTUS_TERM_ID,
  SCOTUS_MERITS_DOCKET_ID,
  SCOTUS_SHADOW_DOCKET_ID,
  TERM_START_ISO,
  TERM_END_ISO,
  fromIso,
  keyframe,
  scotusUniverse,
} from './shared';

/**
 * The structural universes of SCOTUS October Term 2013 (james-gibson/local-time#89
 * §3.2, §3.3):
 *
 *   term (container)
 *     ├── official docket   (merits collection)
 *     └── shadow docket     (interim/emergency collection)
 *
 * The two dockets are **siblings**, not two copies of the same cases —
 * containment, not duplication (#74). Only the structural universes live here; the
 * cases and applications are in `merits.ts` and `shadow.ts`.
 *
 * ## The retroactive label (§1, §5)
 *
 * "Shadow docket" was coined by William Baude in **2015**, looking back on this
 * term, so the category name post-dates the events it names. That is recorded as
 * `metadata.shadowDocketTermCoined = 2015` on the shadow collection; nothing here
 * invents contemporaneous usage.
 */

/** The term container — the single owner of both dockets. */
export const scotusOctoberTerm2013Universe: Universe = scotusUniverse({
  universeId: SCOTUS_TERM_ID,
  type: UniverseType.LEGAL_TIMELINE,
  canonicalName: 'Supreme Court of the United States — October Term 2013',
  aliases: ['OT2013', 'October Term 2013', 'SCOTUS OT2013'],
  description:
    'The 2013 term of the U.S. Supreme Court, modelled as one container over two parallel, ' +
    'non-duplicative corpora: the official docket (cases granted cert, argued and decided on the ' +
    'merits) and the shadow docket (emergency applications ruled on from the bench without full ' +
    'briefing or argument). Real events and real works; nothing here is invented. The term ran ' +
    'from October 7, 2013 to October 5, 2014.',
  released: new Date(TERM_START_ISO),
  culturalSignificance: 1.0,
  // The term attaches to the government/history levers so CommonUniverseIds can
  // resolve it (and, transitively, every case) as contained by them (#106).
  parents: [CommonUniverseIds.US_GOVERNMENT, CommonUniverseIds.US_HISTORY],
  segments: [
    {
      id: 'ot2013_term',
      start: fromIso(`${TERM_START_ISO}T12:00:00Z`),
      end: fromIso(`${TERM_END_ISO}T12:00:00Z`),
      type: 'legal_period',
      status: 'active',
      jurisdiction: 'United States',
      description:
        'October Term 2013, from the first Monday of October 2013 to the day before the first ' +
        'Monday of October 2014. One segment, no gaps.',
    },
  ],
  keyframes: [
    keyframe('term_opens', `${TERM_START_ISO}T12:00:00Z`, {
      significance: 1.0,
      tags: ['scotus', 'ot2013', 'term'],
      type: KeyframeType.MILESTONE,
      certainty: 1.0,
      description: 'October Term 2013 opens on the first Monday of October 2013.',
    }),
    keyframe('term_closes', `${TERM_END_ISO}T12:00:00Z`, {
      significance: 0.9,
      tags: ['scotus', 'ot2013', 'term'],
      type: KeyframeType.MILESTONE,
      certainty: 1.0,
      description: 'October Term 2013 runs to October 5, 2014.',
    }),
  ],
  // Composition (#75): the shadow docket shares the term's calendar but must not be
  // merged into it. It is an overlay layer, and the dual-track collisions are
  // recorded here rather than resolved away (§3.3). Collisions, not resolutions.
  layers: [
    { layerId: 'primary_layer', type: 'primary', epochs: {} },
    {
      layerId: 'shadow_overlay',
      type: 'subjective',
      epochs: {},
      reality_correspondence: {
        to: SCOTUS_TERM_ID,
        accuracy: 1.0,
        deviations: [
          'Contraceptive mandate — the marquee dual-track matter. Merits: Burwell v. Hobby Lobby ' +
            '(No. 13-354, argued 2014-03-25, decided 2014-06-30, 5-4, Alito) and its companion ' +
            'Conestoga Wood Specialties v. Burwell (No. 13-356, argued and decided the same days). ' +
            'Shadow: Little Sisters of the Poor v. Sebelius (temporary stay 2013-12-31 by Sotomayor, ' +
            'longer stay by the full Court in late January 2014) and Wheaton College v. Burwell ' +
            '(13A1284, emergency injunction 2014-07-03, Sotomayor dissenting). Three days after ' +
            'Hobby Lobby, the Court resolved the follow-on procedural question on the orders list; ' +
            'the pair is kept retrievable as a pair.',
          'Same-sex marriage — the shadow track preceded the merits track. Herbert v. Kitchen ' +
            '(stay 2014-01-06, Utah) preceded the merits line; the merits case (Obergefell) arrives ' +
            'in OT2014, out of scope here. Flagged as a shadow -> merits trajectory.',
        ],
      },
    },
  ],
});

/** The official (merits) docket collection — children are the argued/decided cases. */
export const scotusOt2013OfficialDocketUniverse: Universe = scotusUniverse({
  universeId: SCOTUS_MERITS_DOCKET_ID,
  type: UniverseType.LEGAL_TIMELINE,
  canonicalName: 'SCOTUS OT2013 — Official Docket',
  aliases: ['OT2013 official docket', 'OT2013 merits docket', 'October Term 2013 argued cases'],
  description:
    'The official docket of October Term 2013: cases granted cert, briefed, argued and decided on ' +
    'the merits. SCOTUSblog counts 78 argued docket entries plus 8 decided without oral argument ' +
    '(86 docket entries); the opinions counts (67 signed, 75 numbered, 8 per curiam) and the ' +
    'merits-disposition counts differ methodologically (see the counts keyframe).',
  released: new Date(TERM_START_ISO),
  culturalSignificance: 0.95,
  parents: [SCOTUS_TERM_ID],
  segments: [
    {
      id: 'official_docket_active',
      start: fromIso(`${TERM_START_ISO}T12:00:00Z`),
      end: fromIso(`${TERM_END_ISO}T12:00:00Z`),
      type: 'legal_period',
      status: 'active',
      jurisdiction: 'United States',
      description: 'The official docket across the 2013 term.',
    },
  ],
  keyframes: [
    keyframe('first_arguments', '2013-10-07T12:00:00Z', {
      significance: 0.8,
      tags: ['scotus', 'ot2013', 'merits', 'oral_argument'],
      type: KeyframeType.MILESTONE,
      certainty: 1.0,
      description: 'The October 2013 sitting opens the term with the first oral arguments.',
    }),
    keyframe('decided_without_argument', '2014-05-05T12:00:00Z', {
      significance: 0.7,
      tags: ['scotus', 'ot2013', 'merits', 'without_argument'],
      type: KeyframeType.RULING,
      certainty: 0.6,
      dateRange: { earliest: '2013-11-04T12:00:00Z', latest: '2014-05-05T12:00:00Z' },
      description:
        'Eight docket entries were decided without oral argument (Mount Holly, Cline, Stanton, ' +
        'Ford Motor, Hinton, Tolan, U.S. Forest Service v. Pacific Rivers Council and UBS) — a ' +
        'disputed methodological count recorded with certainty < 1.0, not flattened (§7).',
    }),
  ],
});

/** The shadow docket collection — children are the 13A/14A applications and orders. */
export const scotusOt2013ShadowDocketUniverse: Universe = scotusUniverse({
  universeId: SCOTUS_SHADOW_DOCKET_ID,
  type: UniverseType.LEGAL_TIMELINE,
  canonicalName: 'SCOTUS OT2013 — Shadow Docket',
  aliases: ['OT2013 shadow docket', 'OT2013 emergency applications', '13A applications', '14A applications'],
  description:
    'The emergency/interim docket of the 2013 term: applications for stay, vacatur or injunction ' +
    '(the 13A and 14A series) ruled on from the bench, usually without argument or full opinion — ' +
    'summary reversals, GVRs and routine execution stays. The corpus is drawn from the Journal of ' +
    'the Supreme Court, parsed into the Shadow Docket Database (Kastellec et al.).',
  released: new Date('2013-07-01T12:00:00Z'),
  culturalSignificance: 0.9,
  parents: [SCOTUS_TERM_ID],
  extraMetadata: {
    // "Shadow docket" was coined in 2015, looking back on OT2013 (§1, §5).
    shadowDocketTermCoined: 2015,
  },
  segments: [
    {
      id: 'shadow_docket_active',
      start: fromIso('2013-07-01T12:00:00Z'),
      end: fromIso(`${TERM_END_ISO}T12:00:00Z`),
      type: 'legal_period',
      status: 'active',
      jurisdiction: 'United States',
      description:
        'The interim/emergency docket, tracked from the start of the 13A series in July 2013 through ' +
        'term end. Orders issue on the Monday orders list, ahead of argument.',
    },
  ],
  keyframes: [
    keyframe('summary_reversals', '2014-07-01T12:00:00Z', {
      significance: 0.7,
      tags: ['scotus', 'ot2013', 'shadow_docket', 'summary_reversal'],
      type: KeyframeType.RULING,
      certainty: 0.8,
      dateRange: { earliest: '2013-11-04T12:00:00Z', latest: '2014-07-01T12:00:00Z' },
      description:
        'Five summary reversals in the term (Williams v. Johnson, Martinez v. Illinois, Tolan v. ' +
        'Cotton, Hinton v. Alabama and Stanton v. Sims), alongside routine execution stays. Each is ' +
        'defined once as a merits docket entry — never double-defined here (§4.2, one-owner rule).',
    }),
  ],
});
