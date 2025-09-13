import { Universe, UniverseType, TimePrecision, TemporalEpoch, TemporalKeyframe, TemporalSegment, TemporalLayer, RealityRelation, Attribution, TemporalStructure, WindowingStrategy, RealityRelationTypeEnum } from './types';
import { UniverseId } from './universe-ids';

export class UniverseBuilder {
  private universe: Partial<Universe>;

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
    const id = subtitle ? `${studio}:${title}_${subtitle}:${year}` : `${studio}:${title}:${year}`;
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
      epochId: 'zero_reference',
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
      epochs: { zero_reference: zeroEpoch }
    });
    return this;
  }

  withZeroReferenceEpoch(config: any): this {
    this.addLayer({
      layerId: 'zero_reference',
      type: 'primary',
      epochs: { zero_reference: config }
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
    
    this.universe.temporalStructure.keyframes.push({
      id,
      timestamp,
      significance,
      tags
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

    return this.universe as Universe;
  }
}

export function createFilmBuilder(universeId?: UniverseId | string): UniverseBuilder {
  return new UniverseBuilder(universeId, UniverseType.FILM);
}

export function createHistoricalBuilder(universeId?: UniverseId | string): UniverseBuilder {
  return new UniverseBuilder(universeId, UniverseType.HISTORICAL_EVENT);
}

export function createMissionBuilder(universeId?: UniverseId | string): UniverseBuilder {
  return new UniverseBuilder(universeId, UniverseType.MISSION);
}

export function createBiographyBuilder(universeId?: UniverseId | string): UniverseBuilder {
  return new UniverseBuilder(universeId, UniverseType.BIOGRAPHY);
}
