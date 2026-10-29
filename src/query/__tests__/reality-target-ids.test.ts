import { allUniverses } from '../../config/universes';
import { isValidUniverseId } from '../../core/universe-ids';
import type { Universe } from '../../core/types';

/**
 * james-gibson/local-time#184 — an id-shaped field must hold an id.
 *
 * `RealityAnchor.realEventId`, `UniverseReference.targetUniverseId`,
 * `TemporalLayer.reality_correspondence.to` and a keyframe's `targetUniverseId`
 * all name a universe. A keyframe id, a display label or a place can never
 * resolve: `UniverseRegistry.getUniverse` looks up registered universes and
 * `CommonUniverseIds.resolveDeclaredName` resolves declared names, not prose.
 *
 * The graph reports such a target in `graph.dangling`, but dangling includes the
 * valid-but-unregistered class (#69, #133), which is a different defect. This test
 * is about *shape*: every target must at least be a string the grammar accepts, so
 * a registration pass has something to register.
 *
 * ## The draft exceptions, and why they are not the same bug
 *
 * #184 listed nine sites, and all nine are fixed. The entries below are references
 * introduced *after* #184 was filed, by the #200/#207/#221 draft families, to
 * records those families have deliberately not minted yet (#221: fourteen drafts
 * remain unlanded, and their corrections have nowhere to land). They are recorded
 * here rather than silently excluded so that the debt is visible and cannot grow:
 * the list may only shrink, and an entry that stops being referenced fails the test.
 *
 * The follow-up is james-gibson/local-time#232, which owns emptying this set.
 * Fixing one means minting the universe it names (or dropping the reference), not
 * widening this list.
 */
const DRAFT_TARGETS_NOT_YET_UNIVERSES = new Set([
  // #232 — the unlanded #200 analysis drafts reference specs and events that were
  // drafted but never committed as universes.
  'spec:usps_permit_imprint_regime',
  'spec:usps_full_service_mid',
  'spec:usps_eddm',
  'spec:llm_typicality_bias',
  'spec:print_spec_guidance',
  'spec:usps_tabbing',
  'spec:coating_inkjet_interaction',
  'spec:coating_cost_direction',
  'spec:imb_verification_threshold',
  'spec:finishing_and_tabbing',
  'event:glenn_beck_program_2026_10_21',
  'event:texas_trans_mailers_2026_10',
  'analysis:single_payer_claim',
  // #207/#220 — the Texas TTSU mailer family's unlanded organisations.
  'entity:transgender_education_network_of_texas',
  'channel:the_real_texas_paul',
  'statute:one_big_beautiful_bill_act_2025',
]);

/**
 * The exact labels #184 found, kept as an explicit ledger so a regression names
 * the ticket rather than only failing a shape check. None may return.
 */
const RETIRED_LABELS = [
  'Wikidata (Q2013)',
  'enron_restatement_2001',
  'enron_chapter_11_2001',
  'flight_recorders_2001',
  'post_911_cinematic_censorship_2001',
  'nist_wtc_investigation_2005',
  'icc_building_code_2003',
  'geography:england:countryside',
  'history:operation_overlord:1944:omaha_beach',
] as const;

interface Target {
  /** The id-shaped value as authored. */
  id: string;
  /** The field that carries it: `realEventId`, `targetUniverseId`, … */
  field: string;
  /** The universe that declares it. */
  from: string;
}

const collectTargets = (universes: readonly Universe[]): Target[] => {
  const targets: Target[] = [];

  for (const universe of universes) {
    const from = String(universe.universeId);

    for (const anchor of universe.realityRelation?.realityAnchors ?? []) {
      if (typeof anchor?.realEventId === 'string') {
        targets.push({ id: anchor.realEventId.trim(), field: 'realEventId', from });
      }
    }

    for (const reference of universe.connections?.references ?? []) {
      if (typeof reference?.targetUniverseId === 'string') {
        targets.push({ id: reference.targetUniverseId.trim(), field: 'targetUniverseId', from });
      }
    }

    for (const layer of universe.layers ?? []) {
      const to = layer?.reality_correspondence?.to;
      if (typeof to === 'string') {
        targets.push({ id: to.trim(), field: 'reality_correspondence.to', from });
      }
    }

    for (const keyframe of universe.temporalStructure?.keyframes ?? []) {
      if (typeof keyframe?.targetUniverseId === 'string') {
        targets.push({ id: keyframe.targetUniverseId.trim(), field: 'targetUniverseId', from });
      }
    }
  }

  return targets;
};

const targets = collectTargets(allUniverses as Universe[]);
const invalid = targets.filter((target) => target.id !== '' && !isValidUniverseId(target.id));
const label = (target: Target): string => `${target.field} "${target.id}" in ${target.from}`;

describe('every reality target is a valid universe id (#184)', () => {
  test('the corpus declares targets, so the assertions below are not vacuous', () => {
    expect(targets.length).toBeGreaterThan(100);
  });

  test('no target is label-shaped or keyframe-shaped', () => {
    const unexpected = invalid.filter((target) => !DRAFT_TARGETS_NOT_YET_UNIVERSES.has(target.id));
    expect(unexpected.map(label)).toEqual([]);
  });

  test('every target is trimmed', () => {
    for (const target of targets) {
      expect(target.id).toBe(target.id.trim());
    }
  });

  test('the nine labels this ticket retired are gone from every field', () => {
    const present = targets.filter((target) =>
      (RETIRED_LABELS as readonly string[]).includes(target.id),
    );
    expect(present.map(label)).toEqual([]);
  });
});

describe('the draft exceptions stay honest (#221, #207)', () => {
  test('each draft target is still referenced, so the entry is not stale', () => {
    const referenced = new Set(targets.map((target) => target.id));
    const stale = [...DRAFT_TARGETS_NOT_YET_UNIVERSES].filter((id) => !referenced.has(id));
    expect(stale).toEqual([]);
  });

  test('no draft target has been minted; if it has, drop the exception', () => {
    const registered = new Set(allUniverses.map((universe) => String(universe.universeId)));
    const minted = [...DRAFT_TARGETS_NOT_YET_UNIVERSES].filter((id) => registered.has(id));
    expect(minted).toEqual([]);
  });
});
