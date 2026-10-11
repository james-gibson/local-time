import { Universe, UniverseType } from '../../../core/types';
import { US_HISTORY, US_GOVERNMENT } from './parents';
import { usConstitutionUniverse } from './usFoundingDocuments.universe';

/**
 * U.S. Statehood History Collection
 *
 * Documents the history of each U.S. state's admission to the Union. For states
 * that joined the Confederacy, it also includes keyframes for secession and
 * subsequent readmission.
 *
 * Research Sources:
 * - U.S. Congress Archives (congress.gov)
 * - National Archives and Records Administration (archives.gov)
 * - Official State Historical Societies and Archives
 *
 * Hierarchical Context: US_HISTORY -> US_GOVERNMENT
 */

const fromIso = (iso: string): bigint => BigInt(new Date(iso).getTime()) * 1_000_000n;
const PRESENT = fromIso('2025-09-14T12:00:00Z');

interface StateData {
  name: string;
  admission: string;
  secession?: string;
  readmission?: string;
}

const createStateUniverse = (data: StateData): Universe => {
  const slug = data.name.toLowerCase().replace(/ /g, '_');
  const year = data.admission.substring(0, 4);
  const stateId = `history:${slug}:${year}`;

  const keyframes: Array<Record<string, unknown>> = [
    {
      id: 'admission_to_union',
      timestamp: fromIso(`${data.admission}T12:00:00Z`),
      significance: 1.0,
      tags: ['statehood', 'admission', 'us_history'],
      certainty: 1.0,
    },
  ];

  if (data.secession) {
    keyframes.push({
      id: 'secession_from_union',
      timestamp: fromIso(`${data.secession}T12:00:00Z`),
      significance: 0.95,
      tags: ['secession', 'civil_war', 'confederacy'],
      certainty: 1.0,
    });
  }

  if (data.readmission) {
    keyframes.push({
      id: 'readmission_to_union',
      timestamp: fromIso(`${data.readmission}T12:00:00Z`),
      significance: 0.9,
      tags: ['readmission', 'reconstruction', 'us_history'],
      certainty: 1.0,
    });
  }

  keyframes.sort((a, b) => Number((a.timestamp as bigint) - (b.timestamp as bigint)));

  return {
    universeId: stateId,
    type: UniverseType.HISTORICAL_EVENT,
    identifiers: { primary: stateId, aliases: [data.name] },
    realityRelation: {
      type: 'documentary',
      fictionalizationDegree: 0.0,
      realityAnchors: [
        {
          realEventId: stateId,
          relationshipType: 'documents',
          confidence: 1.0,
          evidence: ['U.S. Congressional Records'],
        },
      ],
    },
    attribution: {
      public_domain: true,
      sources: ['U.S. Congressional Records'],
      citations_required: false,
      usage_restrictions: [],
    },
    layers: [{ layerId: 'primary', type: 'primary', epochs: {} }],
    epochs: {},
    temporalStructure: {
      segments: [
        {
          id: 'statehood_era',
          start: fromIso(`${data.admission}T12:00:00Z`),
          end: PRESENT,
          type: 'legal_period',
          status: 'active',
          jurisdiction: 'United States',
          description: `Period from ${data.name}'s admission to the Union to the present day.`,
        },
      ],
      keyframes,
      windows: { strategy: 'phase_based' },
    },
    metadata: {
      canonicalName: `History of ${data.name} Statehood`,
      description: `The timeline of ${data.name}'s status within the United States of America.`,
      creators: ['United States Congress'],
      released: new Date(data.admission),
      cultural_significance: 0.8,
    },
    connections: {
      natural: { parentUniverses: [US_HISTORY, US_GOVERNMENT] },
      references: [
        {
          type: 'BASED_ON',
          targetUniverseId: usConstitutionUniverse.universeId,
          description: 'Statehood is granted under the authority of the U.S. Constitution.',
          confidence: 1.0,
          evidence: ['Article IV, Section 3 of the U.S. Constitution'],
        },
      ],
    },
  } as unknown as Universe;
};

const stateData: StateData[] = [
  { name: 'Delaware', admission: '1787-12-07' },
  { name: 'Pennsylvania', admission: '1787-12-12' },
  { name: 'New Jersey', admission: '1787-12-18' },
  { name: 'Georgia', admission: '1788-01-02', secession: '1861-01-19', readmission: '1870-07-15' },
  { name: 'Connecticut', admission: '1788-01-09' },
  { name: 'Massachusetts', admission: '1788-02-06' },
  { name: 'Maryland', admission: '1788-04-28' },
  { name: 'South Carolina', admission: '1788-05-23', secession: '1860-12-20', readmission: '1868-07-09' },
  { name: 'New Hampshire', admission: '1788-06-21' },
  { name: 'Virginia', admission: '1788-06-25', secession: '1861-04-17', readmission: '1870-01-26' },
  { name: 'New York', admission: '1788-07-26' },
  { name: 'North Carolina', admission: '1789-11-21', secession: '1861-05-20', readmission: '1868-07-04' },
  { name: 'Rhode Island', admission: '1790-05-29' },
  { name: 'Vermont', admission: '1791-03-04' },
  { name: 'Kentucky', admission: '1792-06-01' },
  { name: 'Tennessee', admission: '1796-06-01', secession: '1861-06-08', readmission: '1866-07-24' },
  { name: 'Ohio', admission: '1803-03-01' },
  { name: 'Louisiana', admission: '1812-04-30', secession: '1861-01-26', readmission: '1868-07-09' },
  { name: 'Indiana', admission: '1816-12-11' },
  { name: 'Mississippi', admission: '1817-12-10', secession: '1861-01-09', readmission: '1870-02-23' },
  { name: 'Illinois', admission: '1818-12-03' },
  { name: 'Alabama', admission: '1819-12-14', secession: '1861-01-11', readmission: '1868-07-13' },
  { name: 'Maine', admission: '1820-03-15' },
  { name: 'Missouri', admission: '1821-08-10' },
  { name: 'Arkansas', admission: '1836-06-15', secession: '1861-05-06', readmission: '1868-06-22' },
  { name: 'Michigan', admission: '1837-01-26' },
  { name: 'Florida', admission: '1845-03-03', secession: '1861-01-10', readmission: '1868-06-25' },
  { name: 'Texas', admission: '1845-12-29', secession: '1861-02-01', readmission: '1870-03-30' },
  { name: 'Iowa', admission: '1846-12-28' },
  { name: 'Wisconsin', admission: '1848-05-29' },
  { name: 'California', admission: '1850-09-09' },
  { name: 'Minnesota', admission: '1858-05-11' },
  { name: 'Oregon', admission: '1859-02-14' },
  { name: 'Kansas', admission: '1861-01-29' },
  { name: 'West Virginia', admission: '1863-06-20' },
  { name: 'Nevada', admission: '1864-10-31' },
  { name: 'Nebraska', admission: '1867-03-01' },
  { name: 'Colorado', admission: '1876-08-01' },
  { name: 'North Dakota', admission: '1889-11-02' },
  { name: 'South Dakota', admission: '1889-11-02' },
  { name: 'Montana', admission: '1889-11-08' },
  { name: 'Washington', admission: '1889-11-11' },
  { name: 'Idaho', admission: '1890-07-03' },
  { name: 'Wyoming', admission: '1890-07-10' },
  { name: 'Utah', admission: '1896-01-04' },
  { name: 'Oklahoma', admission: '1907-11-16' },
  { name: 'New Mexico', admission: '1912-01-06' },
  { name: 'Arizona', admission: '1912-02-14' },
  { name: 'Alaska', admission: '1959-01-03' },
  { name: 'Hawaii', admission: '1959-08-21' },
];

export const usStatehoodHistory: Universe[] = stateData.map(createStateUniverse);
