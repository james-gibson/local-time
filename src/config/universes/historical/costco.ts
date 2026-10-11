import { Universe, UniverseType, CommonUniverseIds } from '../../../core';
import { dateToNanoseconds } from '../../../utils/temporal-conversion';

/**
 * Costco Wholesale Corporation — `history:costco:1983`.
 *
 * james-gibson/local-time#41.
 *
 * A real company given its own universe so that a work of fiction can *anchor*
 * to it rather than merely mention it. Idiocracy (2006) reimagines Costco as
 * the future state itself; this universe is the real referent that anchor
 * points at (see `realityAnchors` in the Idiocracy universe).
 *
 * The zero-point is the opening of the first warehouse club in Seattle in 1983,
 * the conventional date the company was founded.
 *
 * Hierarchical Context: GLOBAL_ECONOMY -> US_HISTORY -> WORLD_HISTORY
 */

/** ISO-8601 -> nanoseconds since the Unix epoch, via the shared conversion helper. */
const ns = (iso: string): bigint => dateToNanoseconds(new Date(iso));

export const costcoUniverse: Universe = {
  universeId: 'history:costco:1983',
  type: UniverseType.INSTITUTIONAL_PERIOD,
  identifiers: {
    primary: 'history:costco:1983',
    aliases: ['Costco', 'Costco Wholesale', 'Costco Wholesale Corporation', 'Price Club'],
  },
  realityRelation: {
    type: 'documentary',
    fictionalizationDegree: 0.0,
    realityAnchors: [
      {
        realEventId: 'history:costco:1983',
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: [
          'Costco Wholesale Corporation corporate filings and annual reports',
          'Company history: first warehouse opened in Seattle, 1983',
        ],
      },
    ],
  },
  attribution: {
    copyright: {
      holders: ['Costco Wholesale Corporation'],
      year: 1983,
      status: 'active',
    },
    citations_required: true,
    usage_restrictions: [
      'Company marks and financial data are the property of Costco Wholesale Corporation.',
    ],
    sources: [
      'Costco Wholesale Corporation — corporate history and annual reports',
      'Wikipedia — Costco',
    ],
  },
  layers: [
    {
      layerId: 'primary',
      type: 'primary',
      epochs: {
        founding: {
          epochId: 'costco:founding',
          startTime: ns('1983-01-01T00:00:00Z'),
          endTime: ns('1993-01-01T00:00:00Z'),
          description: 'Warehouse-club formation era, from founding to the Price Club merger.',
        },
      },
    },
  ],
  epochs: {},
  temporalStructure: {
    segments: [
      {
        id: 'warehouse-club-formation',
        start: ns('1983-09-15T00:00:00Z'),
        end: ns('1993-10-01T00:00:00Z'),
        type: 'phase',
        description: 'From the first Seattle warehouse to the merger with Price Club (1983-1993).',
      },
      {
        id: 'scale-and-private-label',
        start: ns('1993-10-01T00:00:00Z'),
        end: ns('2026-01-01T00:00:00Z'),
        type: 'phase',
        description: 'Scale era: the Price Club merger, the Kirkland Signature private label, and global expansion.',
      },
    ],
    keyframes: [
      {
        id: 'founded',
        timestamp: ns('1983-09-15T00:00:00Z'),
        significance: 1.0,
        tags: ['zero-point', 'founding', 'seattle', 'warehouse-club'],
        certainty: 0.9,
      },
      {
        id: 'price-club-merger',
        timestamp: ns('1993-10-01T00:00:00Z'),
        significance: 0.9,
        tags: ['merger', 'growth', 'price-club'],
        certainty: 0.5,
        dateRange: {
          earliest: ns('1993-09-01T00:00:00Z'),
          latest: ns('1993-12-31T00:00:00Z'),
        },
      },
      {
        id: 'kirkland-signature-launch',
        timestamp: ns('1995-01-01T00:00:00Z'),
        significance: 0.8,
        tags: ['private-label', 'branding', 'retail'],
        certainty: 0.4,
        dateRange: {
          earliest: ns('1995-01-01T00:00:00Z'),
          latest: ns('1996-12-31T00:00:00Z'),
        },
      },
    ],
    windows: { strategy: 'phase_based' },
  },
  metadata: {
    canonicalName: 'Costco Wholesale Corporation',
    description:
      'An American multinational warehouse-club retailer founded in 1983, the largest membership warehouse chain in the world.',
    creators: ['James Sinegal', 'Jeffrey Brotman'],
    released: new Date('1983-09-15T00:00:00Z'),
    cultural_significance: 0.6,
    tags: ['retail', 'warehouse-club', 'corporation', 'costco', 'business'],
    significance:
      'A defining institution of American consumer capitalism, and — after 2006 — a running shorthand for the corporation-as-institution in popular satire.',
  },
  connections: {
    natural: {
      parentUniverses: [
        CommonUniverseIds.GLOBAL_ECONOMY,
        CommonUniverseIds.US_HISTORY,
        CommonUniverseIds.WORLD_HISTORY,
      ],
    },
    references: [],
  },
} as unknown as Universe;

/** All universes derived from james-gibson/local-time#41. */
export const costcoUniverses: Universe[] = [costcoUniverse];
