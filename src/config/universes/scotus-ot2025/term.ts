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
  SCOTUS_CREATOR,
} from './shared';

/**
 * The structural universes of SCOTUS October Term 2025 (james-gibson/local-time#88
 * §3.2, §3.3):
 *
 *   term (container)
 *     ├── merits docket   (collection)
 *     └── shadow docket   (collection)
 *
 * The dockets are **siblings**, not two copies of the same arguments — containment,
 * not duplication (#74). Only the structural universes live here; the cases and
 * applications are in `merits.ts` and `shadow.ts`.
 */

/** The term container — the single owner of both dockets. */
export const scotusOctoberTerm2025Universe: Universe = scotusUniverse({
  universeId: SCOTUS_TERM_ID,
  type: UniverseType.LEGAL_TIMELINE,
  canonicalName: 'Supreme Court of the United States — October Term 2025',
  aliases: ['OT2025', 'October Term 2025', 'SCOTUS OT2025'],
  description:
    'The 2025 term of the U.S. Supreme Court, modelled as one container over two parallel, ' +
    'non-duplicative corpora: the merits docket (cases granted cert, argued and decided) and the ' +
    'shadow docket (emergency applications ruled on from the bench). Real events and real works; ' +
    'nothing here is invented.',
  released: new Date(TERM_START_ISO),
  culturalSignificance: 1.0,
  // The term attaches to the government/history levers so CommonUniverseIds can
  // resolve it (and, transitively, every case) as contained by them (#106).
  parents: [CommonUniverseIds.US_GOVERNMENT, CommonUniverseIds.US_HISTORY],
  segments: [
    {
      id: 'ot2025_term',
      start: fromIso(`${TERM_START_ISO}T12:00:00Z`),
      end: fromIso(`${TERM_END_ISO}T12:00:00Z`),
      type: 'legal_period',
      status: 'active',
      jurisdiction: 'United States',
      description:
        'The 2025 term, from the first Monday of October 2025 to the first Monday of October 2026.',
    },
  ],
  keyframes: [
    keyframe('term_opens', `${TERM_START_ISO}T12:00:00Z`, {
      significance: 1.0,
      tags: ['scotus', 'ot2025', 'term'],
      type: KeyframeType.MILESTONE,
      certainty: 1.0,
      description: 'October Term 2025 opens on the first Monday of October 2025.',
    }),
    keyframe('term_closes', `${TERM_END_ISO}T12:00:00Z`, {
      significance: 0.9,
      tags: ['scotus', 'ot2025', 'term'],
      type: KeyframeType.MILESTONE,
      certainty: 1.0,
      description: 'October Term 2025 runs to the first Monday of October 2026.',
    }),
  ],
  // Composition (#75): the shadow docket shares the term's calendar but must not be
  // merged into it. It is an overlay layer, and the dual-track collisions are
  // recorded here rather than resolved away (§3.3).
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
          'Trump v. Slaughter: merits No. 25-332 (independent-agency removal) and shadow 25A264 ' +
            '(stay granted 2025-09-22) — the same dispute on two tracks; modelled once, on the merits case.',
          'Trump v. CASA: shadow ruling 2025-06-27 (nationwide-injunction question); the Court also ' +
            'ordered merits argument — dual track.',
          'Noem v. Doe / Trump v. Miot: oral argument ordered on a matter that had already been ruled ' +
            'on from the bench — dual track.',
        ],
      },
    },
  ],
});

/** The merits docket collection — children are the argued/decided cases. */
export const scotusOt2025MeritsDocketUniverse: Universe = scotusUniverse({
  universeId: SCOTUS_MERITS_DOCKET_ID,
  type: UniverseType.LEGAL_TIMELINE,
  canonicalName: 'SCOTUS OT2025 — Merits Docket',
  aliases: ['OT2025 merits docket', 'October Term 2025 argued cases'],
  description:
    'The merits docket of October Term 2025: cases granted cert, briefed, argued and decided on ' +
    'the merits. ~58 arguments held across the October 2025–April 2026 sittings, plus cases decided ' +
    'without argument.',
  released: new Date(TERM_START_ISO),
  culturalSignificance: 0.95,
  parents: [SCOTUS_TERM_ID],
  segments: [
    {
      id: 'merits_docket_active',
      start: fromIso(`${TERM_START_ISO}T12:00:00Z`),
      end: fromIso(`${TERM_END_ISO}T12:00:00Z`),
      type: 'legal_period',
      status: 'active',
      jurisdiction: 'United States',
      description: 'The merits docket across the 2025 term.',
    },
  ],
  keyframes: [
    keyframe('first_arguments', '2025-10-06T12:00:00Z', {
      significance: 0.8,
      tags: ['scotus', 'ot2025', 'merits', 'oral_argument'],
      certainty: 0.6,
      dateRange: { earliest: '2025-10-06T12:00:00Z', latest: '2025-10-31T12:00:00Z' },
      description: 'The October 2025 sitting of the merits docket.',
    }),
    keyframe('decided_without_argument', `${TERM_END_ISO}T12:00:00Z`, {
      significance: 0.6,
      tags: ['scotus', 'ot2025', 'merits'],
      certainty: 0.7,
      dateRange: { earliest: `${TERM_START_ISO}T12:00:00Z`, latest: `${TERM_END_ISO}T12:00:00Z` },
      description:
        'Cases decided without oral argument: SCOTUSblog counts 9 for OT2025, Ballotpedia 16. ' +
        'Recorded as a disputed count (certainty < 1.0) rather than flattened (§7).',
    }),
  ],
});

/** The shadow docket collection — children are the 25A emergency applications. */
export const scotusOt2025ShadowDocketUniverse: Universe = scotusUniverse({
  universeId: SCOTUS_SHADOW_DOCKET_ID,
  type: UniverseType.LEGAL_TIMELINE,
  canonicalName: 'SCOTUS OT2025 — Shadow Docket',
  aliases: ['OT2025 shadow docket', 'OT2025 emergency applications', '25A applications'],
  description:
    'The emergency/interim docket of the 2025 term: applications for stay, vacatur or injunction ' +
    '(the 25A series) ruled on from the bench, usually without argument or full opinion. 250 numbered ' +
    '25A applications were filed in the 2025 series; 237 were ruled on.',
  released: new Date('2025-01-01T12:00:00Z'),
  culturalSignificance: 0.9,
  parents: [SCOTUS_TERM_ID],
  segments: [
    {
      id: 'shadow_docket_active',
      start: fromIso('2025-01-01T12:00:00Z'),
      end: fromIso(`${TERM_END_ISO}T12:00:00Z`),
      type: 'legal_period',
      status: 'active',
      jurisdiction: 'United States',
      description: 'The emergency docket, tracked from January 1, 2025.',
    },
  ],
  keyframes: [
    keyframe('shadow_docket_volume', '2025-12-31T12:00:00Z', {
      significance: 0.7,
      tags: ['scotus', 'ot2025', 'shadow_docket'],
      certainty: 0.8,
      dateRange: { earliest: '2025-01-01T12:00:00Z', latest: '2025-12-31T12:00:00Z' },
      description:
        '250 numbered 25A applications in the 2025 series; 237 ruled on (19 granted incl. partial, ' +
        '218 denied), 28 with a recorded dissent, median 14 days to ruling (supremecourtcasetracker.com).',
    }),
  ],
});

export { SCOTUS_CREATOR };
