import { Universe } from '../../src/core/types';
import { UNIVERSE_ID_PATTERNS, isValidUniverseId } from '../../src/core/universe-ids';
import { CommonUniverseIds } from '../../src/core/common-universe-ids';
import { allUniverses } from '../../src/config/universes';
import { ConfigLoader } from '../../src/config/config-loader';
import { UniverseRegistry } from '../../src/config/universe-registry';
import {
  UNITED_STATES_UNIVERSE_ID,
  unitedStatesUniverse,
} from '../../src/config/universes/historical/united-states';

/**
 * james-gibson/local-time#122 — the US domain, and the container the corpus already uses.
 *
 * Two things are pinned here. First, the decision: `us:` is a *declared* domain, not a shape
 * the year-terminated catch-all happens to accept — and `us` is reserved, so FILM refuses
 * those ids. Second, the artefact: `history:united_states:founded` is the parent named by 93
 * universes and was owned by none; it now exists, its milestones are keyframed, and
 * containment resolves through the registry.
 */

const u = unitedStatesUniverse;
const idOf = (x: Universe) => String(x.universeId);
const registered = new Set((allUniverses as unknown as Universe[]).map(idOf));

const keyframes = (): any[] => ((u.temporalStructure as any)?.keyframes ?? []) as any[];
const segments = (): any[] => ((u.temporalStructure as any)?.segments ?? []) as any[];

describe('the US domain (#122)', () => {
  test('`us:` is a declared domain, not catch-all-only', () => {
    // The id #122's namespace is for: a numbered series member.
    expect(UNIVERSE_ID_PATTERNS.US.test('us:amendment:11:1795')).toBe(true);
    expect(UNIVERSE_ID_PATTERNS.US.test('us:united_states:1776')).toBe(true);
    expect(isValidUniverseId('us:united_states:1776')).toBe(true);
  });

  test('`us` is reserved, so FILM no longer accepts a us: id', () => {
    // #149's fix, pinned: before the US pattern existed, `us:constitution:1787` validated
    // only as a *film* because FILM is the generic three-segment shape.
    expect(UNIVERSE_ID_PATTERNS.FILM.test('us:constitution:1787')).toBe(false);
  });

  test('the domain root is the container the corpus already names', () => {
    expect(idOf(u)).toBe(CommonUniverseIds.US_HISTORY);
    expect(UNITED_STATES_UNIVERSE_ID).toBe('history:united_states:founded');
    expect(registered.has(CommonUniverseIds.US_HISTORY)).toBe(true);
  });

  test('the us: address resolves to the same universe', () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    registry.registerUniverse(idOf(u), u);
    expect(registry.getUniverse(idOf(u))).toBeDefined();
    // The alias is how the domain id is addressed without a second owner (#74).
    expect(registry.getUniverse('us:united_states:1776')).toBeDefined();
  });

  test('containment that used to point at nothing now resolves', () => {
    const registry = new UniverseRegistry(new ConfigLoader());
    // Containment is a property of the registered pair: the child declares the parent, and
    // the parent has to exist for `contains` to answer through it.
    for (const entry of allUniverses as unknown as Universe[]) {
      registry.registerUniverse(idOf(entry), entry);
    }
    // A universe that has always declared this parent.
    expect(registry.getMemberships('history:texas_trans_student_mailer_controversy:2026'))
      .toContain(CommonUniverseIds.US_HISTORY);
    expect(registry.contains(CommonUniverseIds.US_HISTORY as never, 'history:texas_trans_student_mailer_controversy:2026'))
      .toBe(true);
  });

  test('milestones are keyframed in order, inside the segments', () => {
    const kfs = keyframes();
    expect(kfs).toHaveLength(12);
    for (let i = 1; i < kfs.length; i += 1) {
      expect(kfs[i].timestamp).toBeGreaterThan(kfs[i - 1].timestamp);
    }
    const segs = segments();
    for (let i = 1; i < segs.length; i += 1) {
      expect(segs[i].start).toBe(segs[i - 1].end);
    }
    for (const kf of kfs) {
      expect(kf.timestamp).toBeGreaterThanOrEqual(segs[0].start);
      expect(kf.timestamp).toBeLessThanOrEqual(segs[segs.length - 1].end);
    }
  });

  test('the lookup table matches the keyframes one for one', () => {
    const table = (u.metadata as any).milestones as Array<{ id: string; date: string }>;
    expect(table.map((m) => m.id)).toEqual(keyframes().map((kf: any) => kf.id));
    for (const row of table) {
      expect(row.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
    // The dates are the ones a reader will quote.
    expect(table[0]).toEqual({ id: 'declaration_of_independence', date: '1776-07-04' });
    expect(table.find((m) => m.id === 'nineteenth_amendment')!.date).toBe('1920-08-18');
  });

  test('every crosswalk points at a registered universe', () => {
    const crosswalks = Object.entries((u.metadata as any).crosswalks as Record<string, string>);
    expect(crosswalks.length).toBeGreaterThan(0);
    const dangling = crosswalks.filter(([, id]) => !registered.has(id));
    expect(dangling).toEqual([]);
  });
});
