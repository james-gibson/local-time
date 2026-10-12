import { Universe, UniverseType, TimePrecision, TemporalEpoch, TemporalKeyframe, TemporalSegment, TemporalLayer, RealityRelation, Attribution, TemporalStructure, WindowingStrategy, RealityRelationTypeEnum } from './types';
import { UniverseId, createFilmUniverseId } from './universe-ids';

/**
 * Universe types that are not required to carry a timeline. A specification describes a
 * shape, not a stretch of time. Keyed by type, not by id, so the exemption is deliberate
 * rather than an id special-case.
 */
const NON_TEMPORAL_TYPES = new Set<string>([
  UniverseType.TECHNICAL_SPECIFICATION,
  UniverseType.TECHNICAL_LOG,
  UniverseType.ABSTRACT_CONCEPT,
]);

export class UniverseBuilder {
  private universe: Partial<Universe>;

  /**
   * Defaults supplied by the convenience factories (#45). `build()` applies them only when
   * the caller has not set the field explicitly, so `withRealityRelation` always wins over
   * `createHistoricalBuilder`'s `documentary`.
   */
  private defaults?: {
    realityRelationType?: string;
    fictionalizationDegree?: number;
    windowsStrategy?: string;
  };

  /** Explicitly set by a fluent call, which must beat any default. */
  private realityRelationWasSet = false;
  private windowsWereSet = false;

  /**
   * Apply type-appropriate defaults. Used by {@link createFilmBuilder} and
   * {@link createHistoricalBuilder}, which previously applied none at all: both just
   * forwarded to the constructor, so a "historical" builder still produced a universe with
   * `realityRelation.type: 'pure_fiction'` and `fictionalizationDegree: 1.0`.
   */
  withDefaults(realityRelationType: string, fictionalizationDegree: number, windowsStrategy: string): this {
    this.defaults = { realityRelationType, fictionalizationDegree, windowsStrategy };
    return this;
  }

  constructor(universeId?: UniverseId | string, type?: UniverseType) {
    this.universe = {
      universeId: universeId || '',
      type: type || UniverseType.FILM,
      identifiers: {
        primary: (universeId as string) || ''
      },
      realityRelation: {
        type: 'pure_fiction',
        realityAnchors: [],
        fictionalizationDegree: 1.0
      },
      attribution: {
        citations_required: true
      },
      layers: []
    };
  }

  // Fluent API methods for different universe types
  film(studio: string, title: string, year: number, subtitle?: string): this {
    // Route through the validating factory so a film universe can never carry an
    // ID the film validators reject. This method used to concatenate — studios
    // like `Saturn_International` and titles like `Across the Universe` passed
    // straight through (local-time#26).
    const id = createFilmUniverseId(
      studio,
      subtitle ? `${title}_${subtitle}` : title,
      year,
    );
    this.universe.universeId = id;
    this.universe.type = UniverseType.FILM;
    if (this.universe.identifiers) {
      this.universe.identifiers.primary = id;
    }
    return this;
  }

  historical(event: string, startYear: number | string, endYear?: number | string): this {
    const yearRange = endYear ? `${startYear}-${endYear}` : startYear.toString();
    const id = `history:${event.toLowerCase().replace(/\s+/g, '_')}:${yearRange}`;
    this.universe.universeId = id;
    this.universe.type = UniverseType.HISTORICAL_EVENT;
    if (this.universe.identifiers) {
      this.universe.identifiers.primary = id;
    }
    return this;
  }

  historicalEvent(event: string, year: number): this {
    return this.historical(event, year);
  }

  mission(agency: string, mission: string, year: number): this {
    const id = `${agency}:${mission}:${year}`;
    this.universe.universeId = id;
    this.universe.type = UniverseType.MISSION;
    if (this.universe.identifiers) {
      this.universe.identifiers.primary = id;
    }
    return this;
  }

  biography(person: string, birthYear: number, deathYear?: number): this {
    const endYear = deathYear ? deathYear.toString() : 'present';
    const id = `biography:${person}:${birthYear}-${endYear}`;
    this.universe.universeId = id;
    this.universe.type = UniverseType.BIOGRAPHY;
    if (this.universe.identifiers) {
      this.universe.identifiers.primary = id;
    }
    return this;
  }

  media(type: string, title: string, year: number): this {
    const id = `${type}:${title.toLowerCase().replace(/\s+/g, '_')}:${year}`;
    this.universe.universeId = id;
    this.universe.type = UniverseType.SERIES; // Default to series for media
    if (this.universe.identifiers) {
      this.universe.identifiers.primary = id;
    }
    return this;
  }

  // Additional fluent API methods
  withId(id: string): this {
    this.universe.universeId = id;
    if (this.universe.identifiers) {
      this.universe.identifiers.primary = id;
    }
    return this;
  }

  withRuntime(minutes: number): this {
    const nanoseconds = BigInt(minutes) * BigInt(60) * BigInt(1_000_000_000);
    this.addEpoch('runtime', 'main', {
      startTime: 0n,
      endTime: nanoseconds,
      precision: TimePrecision.SECOND,
      description: `${minutes} minute runtime`
    });
    return this;
  }

  withRealityRelation(type: string, degree: number, anchors?: any[], description?: string): this {
    this.realityRelationWasSet = true;
    this.universe.realityRelation = {
      type: type as any,
      realityAnchors: anchors || [],
      fictionalizationDegree: degree
    };
    if (description && !this.universe.metadata) {
      this.universe.metadata = {};
    }
    if (description) {
      (this.universe.metadata as any).realityDescription = description;
    }
    return this;
  }

  withDescription(description: string): this {
    if (!this.universe.metadata) {
      this.universe.metadata = {};
    }
    (this.universe.metadata as any).description = description;
    return this;
  }

  withDateRange(startYear: number, startMonth: number, startDay: number, 
                endYear: number, endMonth: number, endDay: number, 
                precision: TimePrecision): this {
    const startDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);
    const startTime = BigInt(startDate.getTime()) * BigInt(1_000_000);
    const endTime = BigInt(endDate.getTime()) * BigInt(1_000_000);
    
    this.addEpoch('main', 'timespan', {
      startTime,
      endTime,
      precision,
      description: `${startYear}-${endYear} timespan`
    });
    return this;
  }

  withDateEpoch(startDate: string, endDate: string, description: string, precision: TimePrecision): this {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startTime = BigInt(start.getTime()) * BigInt(1_000_000);
    const endTime = BigInt(end.getTime()) * BigInt(1_000_000);
    
    this.addEpoch('primary', 'date_epoch', {
      startTime,
      endTime,
      precision,
      description
    });
    return this;
  }

  withZeroReference(year: number, month: number, day: number, 
                   hour: number, minute: number, second: number,
                   event: string, beforePrefix: string, afterPrefix: string,
                   durationHours: number): this {
    const zeroDate = new Date(year, month - 1, day, hour, minute, second);
    const zeroTime = BigInt(zeroDate.getTime()) * BigInt(1_000_000);
    const duration = BigInt(durationHours) * BigInt(3600) * BigInt(1_000_000_000);
    
    const zeroEpoch = {
      epochId: 'zero_ref',
      startTime: zeroTime,
      endTime: zeroTime + duration,
      precision: TimePrecision.SECOND,
      zeroPoint: zeroTime,
      zeroEvent: event,
      beforePrefix,
      afterPrefix,
      relativeFormat: 'HMS' as const
    };
    
    this.addLayer({
      layerId: 'zero_reference',
      type: 'primary',
      epochs: { zero_ref: zeroEpoch }
    });
    return this;
  }

  withZeroReferenceEpoch(config: any): this {
    this.addLayer({
      layerId: 'zero_reference',
      type: 'primary',
      epochs: { zero_ref: config }
    });
    return this;
  }

  withEpisodeInfo(title: string, season: number, episode: number): this {
    if (!this.universe.metadata) {
      this.universe.metadata = {};
    }
    (this.universe.metadata as any).episodeTitle = title;
    (this.universe.metadata as any).season = season;
    (this.universe.metadata as any).episode = episode;
    return this;
  }

  withReleaseDate(date: string): this {
    if (!this.universe.metadata) {
      this.universe.metadata = {};
    }
    (this.universe.metadata as any).releaseDate = new Date(date);
    return this;
  }
  withAttribution(type: string, yearOrDescription?: number | string, status?: string): this {
    const description = typeof yearOrDescription === 'string' ? yearOrDescription : undefined;
    if (type === 'public_domain') {
      this.universe.attribution = {
        public_domain: true,
        citations_required: false,
        sources: description ? [description] : []
      };
    } else {
      this.universe.attribution = {
        citations_required: true,
        sources: description ? [description] : []
      };
    }
    return this;
  }

  withCopyright(holders: string[], year: number, status?: string): this {
    this.universe.attribution = {
      copyright: {
        holders,
        year,
        status: (status as any) || 'active'
      },
      citations_required: true
    };
    return this;
  }

  withAliases(aliases: string[]): this {
    if (!this.universe.identifiers) {
      this.universe.identifiers = {
        primary: this.universe.universeId as string
      };
    }
    this.universe.identifiers.aliases = aliases;
    return this;
  }

  withCreators(creators: { 
    director?: string[]; 
    writer?: string[]; 
    historical_advisors?: string[];
    participant?: string[];
    based_on?: string[];
    host?: string[];
    producer?: string[];
    researcher?: string[];
  }): this {
    if (!this.universe.attribution) {
      this.universe.attribution = {
        citations_required: true
      };
    }
    if (!this.universe.attribution.creators) {
      this.universe.attribution.creators = {};
    }
    if (creators.director) {
      this.universe.attribution.creators.director = creators.director;
    }
    if (creators.writer) {
      this.universe.attribution.creators.writer = creators.writer;
    }
    if (creators.historical_advisors) {
      this.universe.attribution.creators.historical_advisors = creators.historical_advisors;
    }
    // Store additional creator types in metadata
    if (!this.universe.metadata) {
      this.universe.metadata = {};
    }
    if (creators.participant) {
      (this.universe.metadata as any).participants = creators.participant;
    }
    if (creators.based_on) {
      (this.universe.metadata as any).based_on = creators.based_on;
    }
    if (creators.host) {
      (this.universe.metadata as any).host = creators.host;
    }
    if (creators.producer) {
      (this.universe.metadata as any).producer = creators.producer;
    }
    if (creators.researcher) {
      (this.universe.metadata as any).researcher = creators.researcher;
    }
    return this;
  }

  withCulturalSignificance(significance: number, description?: string): this {
    if (!this.universe.metadata) {
      this.universe.metadata = {};
    }
    this.universe.metadata.cultural_significance = significance;
    if (description) {
      (this.universe.metadata as any).cultural_description = description;
    }
    return this;
  }

  withPublicDomain(sources: string[]): this {
    this.universe.attribution = {
      public_domain: true,
      citations_required: false,
      sources: sources
    };
    return this;
  }

  withTags(tags: string[]): this {
    if (!this.universe.metadata) {
      this.universe.metadata = {};
    }
    (this.universe.metadata as any).tags = tags;
    return this;
  }


  addDateSegment(startDate: string, endDate: string, id: string, type: TemporalSegment['type'], status?: string, jurisdiction?: string, description?: string): this {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startTime = BigInt(start.getTime()) * BigInt(1_000_000);
    const endTime = BigInt(end.getTime()) * BigInt(1_000_000);
    return this.addSegment(id, startTime, endTime, type, description);
  }

  addSegment(id: string, start: bigint, end: bigint, type: TemporalSegment['type'], description?: string): this {
    if (!this.universe.temporalStructure) {
      this.universe.temporalStructure = {
        segments: [],
        keyframes: [],
        windows: { strategy: 'time_based' }
      };
    }
    
    this.universe.temporalStructure.segments.push({
      id,
      start,
      end,
      type
    });
    return this;
  }

  addRuntimeSegment(startMinutes: number, startSeconds: number, endMinutes: number, endSeconds: number, id: string, type: TemporalSegment['type']): this {
    const startTime = BigInt(startMinutes) * BigInt(60) * BigInt(1_000_000_000) + BigInt(startSeconds) * BigInt(1_000_000_000);
    const endTime = BigInt(endMinutes) * BigInt(60) * BigInt(1_000_000_000) + BigInt(endSeconds) * BigInt(1_000_000_000);
    return this.addSegment(id, startTime, endTime, type);
  }

  addConnection(connection: any): this {
    // Store connections in metadata for now
    if (!this.universe.metadata) {
      this.universe.metadata = {};
    }
    if (!(this.universe.metadata as any).connections) {
      (this.universe.metadata as any).connections = [];
    }
    (this.universe.metadata as any).connections.push(connection);
    return this;
  }

  withIdentifiers(identifiers: any): this {
    this.universe.identifiers = { ...this.universe.identifiers, ...identifiers };
    return this;
  }

  setRealityRelation(realityRelation: RealityRelation): this {
    this.universe.realityRelation = realityRelation;
    return this;
  }

  setAttribution(attribution: Attribution): this {
    this.universe.attribution = attribution;
    return this;
  }

  addLayer(layerIdOrLayer: string | TemporalLayer, type?: string, epochs?: any): this {
    let layer: TemporalLayer;
    
    if (typeof layerIdOrLayer === 'string') {
      layer = {
        layerId: layerIdOrLayer,
        type: (type as any) || 'primary',
        epochs: epochs || {}
      };
    } else {
      layer = layerIdOrLayer;
    }
    if (!this.universe.layers) {
      this.universe.layers = [];
    }
    this.universe.layers.push(layer);
    return this;
  }

  addEpoch(layerId: string, epochId: string, epoch: TemporalEpoch): this;
  addEpoch(startDate: string, endDate: string, epochId: string, significance?: number, tags?: string[], options?: any): this;
  addEpoch(
    layerIdOrStartDate: string,
    epochIdOrEndDate: string,
    epochOrEpochId: TemporalEpoch | string,
    significance?: number,
    tags?: string[],
    options?: any
  ): this {
    if (typeof epochOrEpochId === 'string') {
      // Date string format: addEpoch('2023-01-01', '2023-12-31', 'year_2023')
      const start = new Date(layerIdOrStartDate);
      const end = new Date(epochIdOrEndDate);
      const epoch: TemporalEpoch = {
        epochId: epochOrEpochId,
        startTime: BigInt(start.getTime()) * BigInt(1_000_000),
        endTime: BigInt(end.getTime()) * BigInt(1_000_000),
        precision: TimePrecision.DAY,
        description: options?.description
      };
      
      if (!this.universe.layers) {
        this.universe.layers = [];
      }
      
      let layer = this.universe.layers.find(l => l.layerId === 'main');
      if (!layer) {
        layer = {
          layerId: 'main',
          type: 'primary',
          epochs: {}
        };
        this.universe.layers.push(layer);
      }
      
      layer.epochs[epochOrEpochId] = epoch;
      return this;
    } else {
      // Original format: addEpoch(layerId, epochId, epoch)
      const layerId = layerIdOrStartDate;
      const epochId = epochIdOrEndDate;
      const epoch = epochOrEpochId;
      if (!this.universe.layers) {
        this.universe.layers = [];
      }
      
      let layer = this.universe.layers.find(l => l.layerId === layerId);
      if (!layer) {
        layer = {
          layerId,
          type: 'primary',
          epochs: {}
        };
        this.universe.layers.push(layer);
      }
      
      // Stamp the epochId onto the epoch object itself. Callers of this 3-arg
      // form (e.g. `withRuntime` / `withDateRange` / `withDateEpoch`) pass an
      // epoch literal without `epochId`; without this the registry would drop
      // the whole universe (james-gibson/local-time#19).
      if (!epoch.epochId) epoch.epochId = epochId;
      layer.epochs[epochId] = epoch;
      return this;
    }
  }

  addKeyframe(id: string, timestamp: bigint, significance: number, tags: string[], options?: any): this;
  addKeyframe(dateStr: string, id: string, significance: number, tags: string[], options?: any): this;
  addKeyframe(
    idOrDateStr: string,
    timestampOrId: bigint | string,
    significanceOrSignificance: number,
    tagsOrTags: string[],
    options?: any
  ): this {
    let id: string;
    let timestamp: bigint;
    let significance: number;
    let tags: string[];
    
    if (typeof timestampOrId === 'string') {
      // Date string format: addKeyframe('2023-04-27', 'id', 1.0, ['tags'])
      const date = new Date(idOrDateStr);
      id = timestampOrId;
      timestamp = BigInt(date.getTime()) * BigInt(1_000_000);
      significance = significanceOrSignificance;
      tags = tagsOrTags;
    } else {
      // Original format: addKeyframe(id, timestamp, significance, tags)
      id = idOrDateStr;
      timestamp = timestampOrId;
      significance = significanceOrSignificance;
      tags = tagsOrTags;
    }
    if (!this.universe.temporalStructure) {
      this.universe.temporalStructure = {
        segments: [],
        keyframes: [],
        windows: { strategy: 'time_based' }
      };
    }

    // `options` carries the fields the positional signature has no room for:
    // certainty, dateRange, type, and a cross-universe target. It was previously
    // accepted and silently dropped, so every universe built through the builder
    // was flat — no certainty, no ranges, no typing. See local-time#3.
    this.universe.temporalStructure.keyframes.push({
      id,
      timestamp,
      significance,
      tags,
      ...(options?.certainty !== undefined ? { certainty: options.certainty } : {}),
      ...(options?.dateRange ? { dateRange: options.dateRange } : {}),
      ...(options?.type ? { type: options.type } : {}),
      ...(options?.targetUniverseId ? { targetUniverseId: options.targetUniverseId } : {}),
      ...(options?.targetKeyframeId ? { targetKeyframeId: options.targetKeyframeId } : {}),
      ...(options?.targetKeyframeType ? { targetKeyframeType: options.targetKeyframeType } : {}),
    });
    return this;
  }

  addRuntimeKeyframe(minutes: number, seconds: number, id: string, significance: number, tags: string[], description?: string): this {
    const timestamp = BigInt(minutes) * BigInt(60) * BigInt(1_000_000_000) + BigInt(seconds) * BigInt(1_000_000_000);
    return this.addKeyframe(id, timestamp, significance, tags);
  }


  addDateKeyframe(dateStr: string, id: string, significance: number, tags: string[], precision?: any): this;
  addDateKeyframe(year: number, month: number, day: number, hour: number, minute: number, second: number, id: string, significance: number, tags: string[], options?: any): this;
  addDateKeyframe(
    dateStrOrYear: string | number,
    monthOrId: number | string,
    dayOrSignificance?: number,
    hourOrTags?: number | string[],
    minuteOrPrecision?: number | any,
    second?: number,
    id?: string,
    significance?: number,
    tags?: string[],
    options?: any
  ): this {
    if (typeof dateStrOrYear === 'string') {
      // String date format: addDateKeyframe('2023-04-27', 'id', 1.0, ['tags'])
      const date = new Date(dateStrOrYear);
      const timestamp = BigInt(date.getTime()) * BigInt(1_000_000);
      return this.addKeyframe(monthOrId as string, timestamp, dayOrSignificance!, hourOrTags as string[], minuteOrPrecision);
    } else {
      // Numeric format: addDateKeyframe(year, month, day, hour, minute, second, id, significance, tags)
      const date = new Date(dateStrOrYear, (monthOrId as number) - 1, dayOrSignificance!, hourOrTags as number, minuteOrPrecision!, second!);
      const timestamp = BigInt(date.getTime()) * BigInt(1_000_000);
      return this.addKeyframe(id!, timestamp, significance!, tags!, options);
    }
  }

  withWindowing(strategy: string, windowSize?: bigint): this {
    if (!this.universe.temporalStructure) {
      this.universe.temporalStructure = {
        segments: [],
        keyframes: [],
        windows: { strategy: 'time_based' }
      };
    }
    
    this.universe.temporalStructure.windows = {
      strategy: strategy as any,
      avgWindowSize: windowSize
    };
    return this;
  }

  build(): Universe {
    // Flatten epochs from all layers
    const epochs: Record<string, TemporalEpoch> = {};
    if (this.universe.layers) {
      for (const layer of this.universe.layers) {
        Object.assign(epochs, layer.epochs);
      }
    }
    this.universe.epochs = epochs;

    // Defaults first, so validation runs against the values that will actually ship.
    if (this.defaults && !this.realityRelationWasSet) {
      this.universe.realityRelation = {
        type: this.defaults.realityRelationType as any,
        fictionalizationDegree: this.defaults.fictionalizationDegree!,
        realityAnchors: [],
      };
    }
    if (this.defaults && !this.windowsWereSet) {
      const structure = this.ensureTemporalStructure();
      structure.windows = { strategy: this.defaults.windowsStrategy as any };
    }

    this.validate();
    this.extractMetadata();

    return this.universe as Universe;
  }

  private ensureTemporalStructure(): any {
    if (!this.universe.temporalStructure) {
      this.universe.temporalStructure = {
        segments: [],
        keyframes: [],
        windows: { strategy: 'time_based' },
      } as any;
    }
    return this.universe.temporalStructure;
  }

  /**
   * #45: `build()` validated nothing. Every invalid universe built successfully, which is
   * why this file is the only failing suite in the repo.
   *
   * Order is deliberate and load-bearing. The tests assert distinct messages for distinct
   * faults, so a check that runs early must not mask one that runs later:
   *
   *   1. attribution      - a universe with no provenance at all is unusable
   *   2. realityRelation  - `fictionalizationDegree` outside [0,1]
   *   3. cultural_significance
   *   4. keyframe significance
   *   5. primary layer    - last, because several callers reach it with no layer at all and
   *                         would otherwise see this error instead of the one they caused
   */
  private validate(): void {
    const errors: string[] = [];
    const universe = this.universe;

    // 1. Attribution. The constructor seeds `{ citations_required: true }`, so presence of
    // the object is not enough - it has to actually say where the content came from.
    const attribution = universe.attribution as any;
    const hasCopyright = Boolean(attribution?.copyright?.holders?.length);
    const hasPublicDomain = Boolean(attribution?.public_domain);
    const hasSources = Boolean(attribution?.sources?.length);
    if (!hasCopyright && !hasPublicDomain && !hasSources) {
      errors.push(
        'Attribution is required: set public_domain, copyright, or sources (at least one).',
      );
    }

    // 2. fictionalizationDegree
    const degree = universe.realityRelation?.fictionalizationDegree;
    if (typeof degree !== 'number' || degree < 0 || degree > 1) {
      errors.push(
        `fictionalizationDegree must be between 0.0 and 1.0 (got ${String(degree)}).`,
      );
    }

    // 3. cultural_significance
    const significance = (universe.metadata as any)?.cultural_significance;
    if (significance !== undefined && (significance < 0 || significance > 1)) {
      errors.push(
        `cultural_significance must be between 0.0 and 1.0 (got ${significance}).`,
      );
    }

    // 4. Keyframe significance
    const inUnit = (v: unknown) => typeof v === 'number' && v >= 0 && v <= 1;
    for (const layer of universe.layers ?? []) {
      for (const keyframe of Object.values(layer.epochs ?? {}) as any[]) {
        const frames = (keyframe as any).keyframes;
        if (!Array.isArray(frames)) continue;
        for (const frame of frames) {
          if (!inUnit(frame?.significance)) {
            errors.push(
              `Keyframe significance must be between 0.0 and 1.0 ` +
              `(keyframe "${frame?.id ?? 'unknown'}" has ${String(frame?.significance)}).`,
            );
          }
        }
      }
    }
    const structureKeyframes = universe.temporalStructure?.keyframes;
    if (Array.isArray(structureKeyframes)) {
      for (const frame of structureKeyframes) {
        if (!inUnit(frame?.significance)) {
          errors.push(
            `Keyframe significance must be between 0.0 and 1.0 ` +
            `(keyframe "${frame?.id ?? 'unknown'}" has ${String(frame?.significance)}).`,
          );
        }
      }
    }

    // 5. Temporal content.
    //
    // This was originally "at least one layer with type 'primary'", which was wrong and
    // broke four suites on first run. `addDateKeyframe` / `addDateSegment` populate
    // `temporalStructure` directly and never touch `layers`, so `ed-sheeran.ts` builds a
    // universe with 1 segment and 2 keyframes and zero layers - real temporal content that
    // a layer check refuses to see. Worse, it builds at module scope, so the throw happened
    // during import and took the entire `allUniverses` barrel down with it.
    //
    // The rule that matches reality: the universe must carry temporal content by *either*
    // route. A builder that adds neither has nothing to place on a timeline.
    const hasPrimaryLayer = (universe.layers ?? []).some((layer: any) => layer.type === 'primary');
    const structure = universe.temporalStructure;
    const hasStructureContent =
      Boolean(structure?.segments?.length) || Boolean(structure?.keyframes?.length) ||
      // build() flattens every layer's epochs onto the universe, so a builder that only
      // declared epochs (withRuntime, withDateRange, withZeroReference) has content there.
      Object.keys(universe.epochs ?? {}).length > 0;

    // Not every universe is a stretch of time. `system:ids:static_id_schema:v1` describes
    // the shape of an id, and its version suffix `v1` is not a year — demanding a timeline
    // of it would be inventing one. Exempt by type rather than by id, so the next spec or
    // concept inherits the exemption deliberately.
    //
    // `ABSTRACT_CONCEPT` currently has exactly one member, so this is not a broad hole:
    // it was measured across all 225 registered universes before being added.
    const isNonTemporal = NON_TEMPORAL_TYPES.has(universe.type as UniverseType);
    if (!isNonTemporal && !hasPrimaryLayer && !hasStructureContent) {
      errors.push(
        'At least one primary temporal layer is required: the universe has neither a ' +
        'primary layer nor any temporal structure content (segments or keyframes).',
      );
    }

    if (errors.length) {
      throw new Error(`Universe validation failed: ${errors.join(' ')}`);
    }
  }

  /**
   * #45: `build()` extracted no metadata either, so every builder-produced universe shipped
   * with an empty or absent `metadata` block. These three are the derivable ones - a caller
   * who set them explicitly keeps their value.
   */
  private extractMetadata(): void {
    const universe = this.universe;
    const id = universe.universeId as string;
    if (!id) return;

    const metadata = (universe.metadata ?? {}) as any;
    universe.metadata = metadata;

    // canonicalName from the id slug: `film:test_movie:2023` -> "Test Movie".
    // Explicit values are never overwritten.
    if (!metadata.canonicalName) {
      const parts = id.split(':');
      // Three-segment ids are `namespace:slug:year`; anything longer is
      // `namespace:...:slug:year`, so take the segment before the trailing year.
      const slug = parts.length <= 3 ? parts[1] : parts[parts.length - 2];
      if (slug) {
        metadata.canonicalName = slug
          .replace(/[_.]+/g, ' ')
          .trim()
          .split(/\s+/)
          .filter(Boolean)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    }

    // released from the id's trailing year.
    if (!metadata.released) {
      const parts = id.split(':');
      const trailing = parts[parts.length - 1] ?? '';
      const yearMatch = trailing.match(/^(\d{4})/);
      if (yearMatch) {
        metadata.released = new Date(Number(yearMatch[1]), 0, 1);
      }
    }

    // creators: role lists in a stable order, then copyright holders. Copyright holders are
    // a studio, which is a creator of the work but not a role, so they go last.
    if (!metadata.creators) {
      const creators = (universe.attribution as any)?.creators;
      const roles: string[] = [
        'director', 'writer', 'producer', 'host', 'researcher',
        'historical_advisors', 'participant', 'based_on',
      ];
      const collected: string[] = [];
      for (const role of roles) {
        for (const name of creators?.[role] ?? []) {
          if (!collected.includes(name)) collected.push(name);
        }
      }
      for (const holder of (universe.attribution as any)?.copyright?.holders ?? []) {
        if (!collected.includes(holder)) collected.push(holder);
      }
      if (collected.length) metadata.creators = collected;
    }
  }
}

export function createFilmBuilder(universeId?: UniverseId | string): UniverseBuilder {
  return new UniverseBuilder(universeId, UniverseType.FILM)
    .withDefaults('pure_fiction', 1.0, 'scene_based');
}

export function createHistoricalBuilder(universeId?: UniverseId | string): UniverseBuilder {
  // Previously forwarded straight to the constructor, so a "historical" builder produced
  // `pure_fiction` / 1.0 - the opposite of the point of the factory.
  return new UniverseBuilder(universeId, UniverseType.HISTORICAL_EVENT)
    .withDefaults('documentary', 0.0, 'time_based');
}

export function createMissionBuilder(universeId?: UniverseId | string): UniverseBuilder {
  return new UniverseBuilder(universeId, UniverseType.MISSION);
}

export function createBiographyBuilder(universeId?: UniverseId | string): UniverseBuilder {
  return new UniverseBuilder(universeId, UniverseType.BIOGRAPHY);
}
