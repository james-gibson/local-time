import type {
  TemporalEpoch,
  TemporalKeyframe,
  TemporalLayer,
  TemporalSegment,
  Universe,
} from './types';
import { isSystemUniverseId, type UniverseId } from './universe-ids';

/**
 * Composition: overlaying whole universes and recording what wins (local-time#75).
 *
 * Containment (#74) is one way to combine universes — a collection owns members. This is
 * the other: two whole universes speak to the same moments, and the overlap has to be
 * resolved. The design answer is **layered**, not merged:
 *
 * - the base keeps every layer and every assertion it had;
 * - an overlay contributes its own layers, typed `recreation` / `subjective` / `meta` and
 *   carrying `reality_correspondence.to` = the overlay universe;
 * - a collision is **recorded, not resolved away**: the winner is chosen by a total
 *   precedence order, and the losing value is kept verbatim in this record.
 *
 * That is what makes "as composed" and "ground truth" both answerable. The base is
 * returned unchanged by {@link groundTruth} — composition is a *view*, not a mutation and
 * not a clone (the #76 constraint: a composed universe that cannot tell you which
 * assertions are premise and which are real cannot be embedded usefully).
 *
 * ## What is deliberately absent
 *
 * A composed universe is **not registered**. It is a value produced on read, so it cannot
 * reintroduce the duplicate-id problem composition exists to avoid (`allUniverses` is
 * flat with one owner per id). Its id is derived from its inputs and its declaration —
 * {@link composeUniverseId} — so the same composition is addressable and reproducible
 * without an entry in the registry, and a different declaration gets a different id.
 *
 * ## Precedence, highest first, and total
 *
 * 1. an explicit `overrides` id (the overlay declares it wins);
 * 2. layer type: `subjective` > `recreation` > `meta` > `primary`;
 * 3. higher correspondence `accuracy`;
 * 4. later declaration order (the base is order `-1`, so an overlay wins a tie).
 *
 * Precedence only decides *which value the composed view shows*. It never deletes the
 * other one, and a fiction overlay is never allowed to overwrite a documentary layer
 * *silently* — the collision is in {@link CompositionRecord.collisions} either way.
 */

/** The layer types an overlay may contribute. An overlay is never `primary`. */
export type CompositionLayerType = Extract<
  TemporalLayer['type'],
  'recreation' | 'subjective' | 'meta'
>;

/** How an overlay entered the composition. Everything here affects the derived id. */
export interface CompositionDeclaration {
  universeId: string;
  layerType: CompositionLayerType;
  /** How faithfully the overlay corresponds to its source, 0..1. */
  accuracy: number;
  /** Ids of keyframes/segments/epochs this overlay is declared to win outright. */
  overrides: string[];
  /** Deviations the overlay declares, merged into each contributed layer. */
  deviations?: string[];
  /** Why the overlay exists; recorded verbatim. */
  role?: string;
}

/** A universe offered as an overlay, plus the precedence facts about it. */
export interface CompositionOverlay {
  universe: Universe;
  /**
   * The epistemic status of the layer this overlay contributes. Defaults to
   * `recreation` for a fiction overlay and `meta` for a documentary one — a counterfactual
   * is a recreation of the real timeline, not a second primary.
   */
  layerType?: CompositionLayerType;
  /** Correspondence accuracy, 0..1. Defaults to `0.5`; a layer's own value wins. */
  accuracy?: number;
  /** See {@link CompositionDeclaration.overrides}. */
  overrides?: string[];
  /** See {@link CompositionDeclaration.deviations}. */
  deviations?: string[];
  /** See {@link CompositionDeclaration.role}. */
  role?: string;
}

export type CompositionCollisionKind = 'keyframe' | 'segment' | 'epoch';

export type CompositionPrecedence = 'override' | 'layer-type' | 'accuracy' | 'declaration-order';

/**
 * One overlap, kept so "what survived" is answerable without re-running the composition.
 *
 * `losingValue` is the assertion the composed view does not show. It is here, not deleted,
 * because a composition is only useful if it can show you where it diverges.
 */
export interface CompositionCollision {
  kind: CompositionCollisionKind;
  id: string;
  winner: { universeId: string; layerId?: string };
  loser: { universeId: string; layerId?: string };
  reason: CompositionPrecedence;
  losingValue: TemporalKeyframe | TemporalSegment | TemporalEpoch;
  /** The winning overlay layer that now carries the deviation, or `composition`. */
  recordedIn: string;
}

export interface CompositionRecord {
  base: string;
  overlays: CompositionDeclaration[];
  collisions: CompositionCollision[];
  /** The order above, spelled out so an explanation does not have to be re-derived. */
  precedence: CompositionPrecedence[];
}

/** A composed view: an ordinary `Universe` with the composition record attached. */
export interface ComposedUniverse extends Universe {
  composition: CompositionRecord;
}

/** A view of a composition: the overlay applied, or the base as it stands. */
export type CompositionView = 'composed' | 'ground-truth';

const LAYER_RANK: Record<TemporalLayer['type'], number> = {
  primary: 0,
  meta: 1,
  recreation: 2,
  subjective: 3,
};

const PRECEDENCE: CompositionPrecedence[] = [
  'override',
  'layer-type',
  'accuracy',
  'declaration-order',
];

/**
 * The ground truth behind each composed value.
 *
 * A `WeakMap`, not a field: keeping the base inside the returned object would inline the
 * whole corpus into every composed view (and make the value un-serialisable if the base
 * ever pointed back). The composed universe is a view produced on read, and so is this
 * lookup — the base object itself is returned, never copied.
 */
const BASE_OF = new WeakMap<Universe, Universe>();

/**
 * A derived id that is computed from the sources *and* the declaration.
 *
 * `system:` because a composed view is a fixture-like value rather than a corpus entry —
 * the default chart already excludes `system:` (#228), so a composition cannot appear as
 * a row of the library's own corpus.
 */
export function composeUniverseId(
  base: string,
  declarations: CompositionDeclaration[],
): UniverseId {
  const fingerprint = fnv1a64(JSON.stringify({
    base,
    declarations: declarations.map((declaration) => ({
      universeId: declaration.universeId,
      layerType: declaration.layerType,
      accuracy: declaration.accuracy,
      overrides: [...declaration.overrides].sort(),
      deviations: [...(declaration.deviations ?? [])].sort(),
      role: declaration.role ?? '',
    })),
  }));
  const id = `system:composed_${fingerprint}:v1`;
  if (!isSystemUniverseId(id)) {
    throw new Error(`composeUniverse: derived id is not a valid system id: ${id}`);
  }
  return id as UniverseId;
}

/**
 * Compose `base` with `overlays`, returning a derived view.
 *
 * Neither the base nor any overlay is mutated: layers are copied, epochs are copied, and
 * the base is retained (not cloned) for {@link groundTruth}.
 */
export function composeUniverse(
  base: Universe,
  overlays: CompositionOverlay[] = [],
): ComposedUniverse {
  const baseId = String(base.universeId);
  const specs = overlays.map((overlay, index) => normaliseOverlay(overlay, index, baseId));

  const seen = new Set<string>();
  for (const spec of specs) {
    if (seen.has(spec.universeId)) {
      throw new Error(
        `composeUniverse: ${spec.universeId} is declared twice; one declaration per overlay`,
      );
    }
    seen.add(spec.universeId);
  }

  const declarations: CompositionDeclaration[] = specs.map((spec) => ({
    universeId: spec.universeId,
    layerType: spec.layerType,
    accuracy: spec.accuracy,
    overrides: [...spec.overrides],
    deviations: [...spec.deviations],
    ...(spec.role ? { role: spec.role } : {}),
  }));
  const composedId = composeUniverseId(baseId, declarations);

  const collisions: CompositionCollision[] = [];
  const layers: TemporalLayer[] = [];
  const layerSources: Holder[] = [];
  const layerIndexBySource = new Map<string, number[]>();
  const usedLayerIds = new Set<string>();

  for (const layer of base.layers ?? []) {
    usedLayerIds.add(layer.layerId);
    layers.push(cloneLayer(layer));
    layerSources.push({
      universeId: baseId,
      layerType: layer.type,
      accuracy: layer.reality_correspondence?.accuracy ?? 0,
      order: -1,
    });
  }

  for (const spec of specs) {
    const contributed: number[] = [];
    for (const source of spec.universe.layers ?? []) {
      const layer = cloneLayer(source);
      layer.layerId = uniqueLayerId(
        `${slug(spec.universeId)}::${source.layerId}`,
        usedLayerIds,
      );
      // A composed layer is never the composed view's primary: it is a reading of the
      // base, and calling it `primary` would claim it is the ground truth (#75).
      if (layer.type === 'primary') layer.type = spec.layerType;
      const prior = source.reality_correspondence;
      layer.reality_correspondence = {
        to: spec.universeId,
        accuracy: prior?.accuracy ?? spec.accuracy,
        deviations: dedupe([...(prior?.deviations ?? []), ...spec.deviations]),
      };
      layers.push(layer);
      layerSources.push({
        universeId: spec.universeId,
        layerType: layer.type,
        accuracy: layer.reality_correspondence.accuracy,
        order: spec.index,
        layerId: layer.layerId,
      });
      contributed.push(layers.length - 1);
    }
    layerIndexBySource.set(spec.universeId, contributed);
  }

  const noteCollision = (
    kind: CompositionCollisionKind,
    id: string,
    winner: Holder,
    loser: Holder,
    reason: CompositionPrecedence,
    losingValue: TemporalKeyframe | TemporalSegment | TemporalEpoch,
  ): void => {
    const winnerLayerIndex =
      winner.layerId !== undefined
        ? layers.findIndex((layer) => layer.layerId === winner.layerId)
        : layerIndexBySource.get(winner.universeId)?.[0];
    const hasLayer = winnerLayerIndex !== undefined && winnerLayerIndex >= 0;
    const recordedIn =
      winner.universeId === baseId || !hasLayer ? 'composition' : layers[winnerLayerIndex].layerId;
    collisions.push({
      kind,
      id,
      winner: { universeId: winner.universeId, ...(winner.layerId ? { layerId: winner.layerId } : {}) },
      loser: { universeId: loser.universeId, ...(loser.layerId ? { layerId: loser.layerId } : {}) },
      reason,
      losingValue,
      recordedIn,
    });
    if (recordedIn !== 'composition') {
      // The losing assertion is retained in the winning overlay layer's deviations, so a
      // reader of that layer is told what it replaced (#75).
      layers[winnerLayerIndex!].reality_correspondence?.deviations.push(
        `${kind} ${id}: ${loser.universeId} asserted a different value; ` +
          `${winner.universeId} wins by ${reason}`,
      );
    }
  };

  const keyframes = new Map<string, { value: TemporalKeyframe; holder: Holder }>();
  for (const keyframe of base.temporalStructure?.keyframes ?? []) {
    keyframes.set(keyframe.id, {
      value: keyframe,
      holder: { universeId: baseId, layerType: 'primary', accuracy: 0, order: -1 },
    });
  }
  for (const spec of specs) {
    for (const keyframe of spec.universe.temporalStructure?.keyframes ?? []) {
      const incoming = holderFor(spec);
      const held = keyframes.get(keyframe.id);
      if (!held) {
        keyframes.set(keyframe.id, { value: keyframe, holder: incoming });
        continue;
      }
      const { winner, reason } = resolvePrecedence(
        held.holder,
        incoming,
        spec.overrides.includes(keyframe.id),
      );
      if (winner === 'incoming') {
        noteCollision('keyframe', keyframe.id, incoming, held.holder, reason, held.value);
        keyframes.set(keyframe.id, { value: keyframe, holder: incoming });
      } else {
        noteCollision('keyframe', keyframe.id, held.holder, incoming, reason, keyframe);
      }
    }
  }

  const segments = new Map<string, { value: TemporalSegment; holder: Holder }>();
  for (const segment of base.temporalStructure?.segments ?? []) {
    segments.set(segment.id, {
      value: segment,
      holder: { universeId: baseId, layerType: 'primary', accuracy: 0, order: -1 },
    });
  }
  for (const spec of specs) {
    for (const segment of spec.universe.temporalStructure?.segments ?? []) {
      const incoming = holderFor(spec);
      const held = segments.get(segment.id);
      if (!held) {
        segments.set(segment.id, { value: segment, holder: incoming });
        continue;
      }
      const { winner, reason } = resolvePrecedence(
        held.holder,
        incoming,
        spec.overrides.includes(segment.id),
      );
      if (winner === 'incoming') {
        noteCollision('segment', segment.id, incoming, held.holder, reason, held.value);
        segments.set(segment.id, { value: segment, holder: incoming });
      } else {
        noteCollision('segment', segment.id, held.holder, incoming, reason, segment);
      }
    }
  }

  // Epochs stay inside their layers — flattening is a *registry* view, and a duplicate
  // epoch id across sources is exactly what the flattening would silently hide. The
  // composed `epochs` takes the precedence winner; the losing epoch remains in its layer.
  const epochs: Record<string, TemporalEpoch> = {};
  const epochHolders = new Map<string, Holder>();
  for (let index = 0; index < layers.length; index += 1) {
    const source = layerSources[index];
    for (const [key, epoch] of Object.entries(layers[index].epochs ?? {})) {
      const epochId = (epoch as TemporalEpoch).epochId ?? `${layers[index].layerId}/${key}`;
      const incoming: Holder = { ...source };
      const held = epochHolders.get(epochId);
      if (!held) {
        epochHolders.set(epochId, incoming);
        epochs[epochId] = epoch as TemporalEpoch;
        continue;
      }
      if (held.universeId === incoming.universeId) continue; // one universe's own layers
      const { winner, reason } = resolvePrecedence(
        held,
        incoming,
        overridesOf(specs, incoming.universeId).includes(epochId),
      );
      if (winner === 'incoming') {
        noteCollision('epoch', epochId, incoming, held, reason, epochs[epochId]);
        epochHolders.set(epochId, incoming);
        epochs[epochId] = epoch as TemporalEpoch;
      } else {
        noteCollision('epoch', epochId, held, incoming, reason, epoch as TemporalEpoch);
      }
    }
  }

  const windows =
    base.temporalStructure?.windows ??
    specs.find((spec) => spec.universe.temporalStructure)?.universe.temporalStructure?.windows ??
    { strategy: 'scene_based' as const };

  const composed: ComposedUniverse = {
    ...base,
    universeId: composedId,
    identifiers: {
      ...base.identifiers,
      primary: composedId,
      aliases: dedupe([
        ...(base.identifiers.aliases ?? []),
        baseId,
        ...specs.map((spec) => spec.universeId),
        `${baseId}+${specs.map((spec) => spec.universeId).join('+')}`,
      ]),
    },
    attribution: {
      ...base.attribution,
      sources: dedupe([
        ...(base.attribution.sources ?? []),
        `Composed view of ${baseId} with ${specs.map((spec) => spec.universeId).join(', ')}`,
      ]),
    },
    layers,
    epochs,
    temporalStructure: {
      segments: [...segments.values()].map((entry) => entry.value),
      keyframes: [...keyframes.values()].map((entry) => entry.value),
      windows,
    },
    ...(base.metadata
      ? { metadata: { ...base.metadata, canonicalName: `${base.metadata.canonicalName} (composed)` } }
      : {}),
    composition: {
      base: baseId,
      overlays: declarations,
      collisions,
      precedence: [...PRECEDENCE],
    },
  };

  BASE_OF.set(composed, base);
  return composed;
}

/**
 * The base a composed view was made from — the same object, unchanged.
 *
 * A universe that was not produced by {@link composeUniverse} is its own ground truth, so
 * this is safe to call on any universe and in a query path that does not know whether it
 * holds a composition.
 */
export function groundTruth(composed: Universe): Universe {
  return BASE_OF.get(composed) ?? composed;
}

/** `'composed'` shows the overlay applied; `'ground-truth'` shows the base untouched. */
export function viewOf(composed: ComposedUniverse, view: CompositionView = 'composed'): Universe {
  return view === 'ground-truth' ? groundTruth(composed) : composed;
}

/**
 * The layer an unqualified query reads by default: the highest epistemic rank present
 * (`subjective` > `recreation` > `meta` > `primary`), ties broken by declaration order.
 */
export function defaultLayer(universe: Universe): TemporalLayer | undefined {
  let best: TemporalLayer | undefined;
  let bestRank = -1;
  for (const layer of universe.layers ?? []) {
    const rank = LAYER_RANK[layer.type] ?? 0;
    if (rank >= bestRank) {
      best = layer;
      bestRank = rank;
    }
  }
  return best;
}

// ---------------------------------------------------------------------------
// internals
// ---------------------------------------------------------------------------

interface OverlaySpec {
  universe: Universe;
  universeId: string;
  index: number;
  layerType: CompositionLayerType;
  accuracy: number;
  overrides: string[];
  deviations: string[];
  role?: string;
}

/** Where a value came from and what precedence facts it carries. */
interface Holder {
  universeId: string;
  layerType: TemporalLayer['type'];
  accuracy: number;
  order: number;
  layerId?: string;
}

function normaliseOverlay(overlay: CompositionOverlay, index: number, baseId: string): OverlaySpec {
  const universe = overlay?.universe;
  const universeId = universe ? String(universe.universeId) : '';
  if (!universeId) {
    throw new Error(`composeUniverse: overlay ${index} has no universeId`);
  }
  if (universeId === baseId) {
    throw new Error(`composeUniverse: ${baseId} cannot be composed with itself`);
  }
  const layerType: CompositionLayerType =
    overlay.layerType ??
    (universe.realityRelation.type === 'documentary' ? 'meta' : 'recreation');
  if (layerType !== 'recreation' && layerType !== 'subjective' && layerType !== 'meta') {
    throw new Error(
      `composeUniverse: ${universeId} layerType must be recreation, subjective or meta; got ${String(layerType)}`,
    );
  }
  const accuracy = overlay.accuracy ?? 0.5;
  if (!Number.isFinite(accuracy) || accuracy < 0 || accuracy > 1) {
    throw new Error(`composeUniverse: ${universeId} accuracy must be within 0..1; got ${accuracy}`);
  }
  return {
    universe,
    universeId,
    index,
    layerType,
    accuracy,
    overrides: [...(overlay.overrides ?? [])],
    deviations: [...(overlay.deviations ?? [])],
    ...(overlay.role ? { role: overlay.role } : {}),
  };
}

function holderFor(spec: OverlaySpec): Holder {
  return {
    universeId: spec.universeId,
    layerType: spec.layerType,
    accuracy: spec.accuracy,
    order: spec.index,
  };
}

function overridesOf(specs: OverlaySpec[], universeId: string): string[] {
  const spec = specs.find((candidate) => candidate.universeId === universeId);
  return spec ? spec.overrides : [];
}

/**
 * The total order from the module doc. Returns the winner, never a partial answer — the
 * point is that "what survived" is deterministic and explainable.
 *
 * Internal: `Holder` is not public API. The order is exercised through
 * `composeUniverse`, and recorded per collision as `reason`.
 */
function resolvePrecedence(
  existing: Holder,
  incoming: Holder,
  override: boolean,
): { winner: 'existing' | 'incoming'; reason: CompositionPrecedence } {
  if (override) return { winner: 'incoming', reason: 'override' };
  const existingRank = LAYER_RANK[existing.layerType] ?? 0;
  const incomingRank = LAYER_RANK[incoming.layerType] ?? 0;
  if (incomingRank !== existingRank) {
    return incomingRank > existingRank
      ? { winner: 'incoming', reason: 'layer-type' }
      : { winner: 'existing', reason: 'layer-type' };
  }
  if (incoming.accuracy !== existing.accuracy) {
    return incoming.accuracy > existing.accuracy
      ? { winner: 'incoming', reason: 'accuracy' }
      : { winner: 'existing', reason: 'accuracy' };
  }
  return incoming.order >= existing.order
    ? { winner: 'incoming', reason: 'declaration-order' }
    : { winner: 'existing', reason: 'declaration-order' };
}

function cloneLayer(layer: TemporalLayer): TemporalLayer {
  return {
    ...layer,
    epochs: { ...layer.epochs },
    ...(layer.contains ? { contains: [...layer.contains] } : {}),
    ...(layer.reality_correspondence
      ? {
          reality_correspondence: {
            ...layer.reality_correspondence,
            deviations: [...layer.reality_correspondence.deviations],
          },
        }
      : {}),
  };
}

function uniqueLayerId(candidate: string, used: Set<string>): string {
  let id = candidate;
  let suffix = 2;
  while (used.has(id)) {
    id = `${candidate}#${suffix}`;
    suffix += 1;
  }
  used.add(id);
  return id;
}

function slug(value: string): string {
  return value.replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'overlay';
}

function dedupe(values: string[]): string[] {
  return [...new Set(values)];
}

/** FNV-1a, 64-bit, as 16 hex characters. Deterministic and dependency-free. */
function fnv1a64(input: string): string {
  const prime = 0x100000001b3n;
  const mask = 0xffffffffffffffffn;
  let hash = 0xcbf29ce484222325n;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= BigInt(input.charCodeAt(index));
    hash = (hash * prime) & mask;
  }
  return hash.toString(16).padStart(16, '0');
}
