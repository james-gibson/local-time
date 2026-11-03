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
 * ## The draft exceptions are gone (#232)
 *
 * #184 listed nine sites, and all nine were fixed. A further sixteen landed with the
 * #200/#207/#221 draft families and were carried in an allowlist while the debt was
 * open. #232 emptied that set: the three that named already-minted universes (the TENT
 * organisation, the mailer controversy) were repointed, and the rest — specs, the
 * unregistered broadcast, a channel, a statute and an analysis artifact — were dropped
 * in favour of citing them in `attribution.sources`. The guard is now strict: every
 * reality target in the corpus must be a string the grammar accepts.
 */

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
    expect(invalid.map(label)).toEqual([]);
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
