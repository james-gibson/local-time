import { TimePrecision, Universe } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { createHistoricalBuilder } from '../../../core/universe-builder';
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
 * ## One container, fifty members (james-gibson/local-time#103)
 *
 * Every state declares a single membership — `US_STATEHOOD` — and that container
 * is itself a child of `US_HISTORY` and `US_GOVERNMENT`, so the fifty states keep
 * both ancestors transitively without each repeating the pair. The Civil War is
 * the same national event in every state's timeline, so it is one shared epoch
 * constant rather than fifty copies.
 *
 * The universes are assembled through `UniverseBuilder`, not a hand-written
 * literal with an `as unknown as Universe` cast: the builder can now express the
 * parent edge, the typed reference, the segment prose and the released date
 * (#103, #100, #147).
 */

const fromIso = (iso: string): bigint => BigInt(new Date(iso).getTime()) * 1_000_000n;
const PRESENT_ISO = '2025-09-14T12:00:00Z';

/**
 * The American Civil War, shared by every statehood timeline.
 *
 * It is national context, not a state-specific claim: a state's own admission,
 * secession and readmission keyframes remain distinct, and the war is one epoch
 * every state can be located inside.
 */
const CIVIL_WAR_EPOCH = {
  epochId: 'civil_war',
  startTime: fromIso('1861-04-12T12:00:00Z'),
  endTime: fromIso('1865-04-09T12:00:00Z'),
  precision: TimePrecision.DAY,
  description:
    'The American Civil War, from the attack on Fort Sumter to the surrender at Appomattox Court House.',
};

interface StateData {
  name: string;
  admission: string;
  secession?: string;
  readmission?: string;
}

const createStateUniverse = (data: StateData): Universe => {
  const slug = data.name.toLowerCase().replace(/ /g, '_');
  const year = Number(data.admission.substring(0, 4));

  const builder = createHistoricalBuilder()
    .historical(slug, year)
    .withAliases([data.name])
    .withCanonicalName(`History of ${data.name} Statehood`)
    .withDescription(`The timeline of ${data.name}'s status within the United States of America.`)
    .withReleased(data.admission)
    .withCulturalSignificance(0.8)
    .withRealityRelation('documentary', 0.0, [
      {
        realEventId: `history:${slug}:${year}`,
        relationshipType: 'documents',
        confidence: 1.0,
        evidence: ['U.S. Congressional Records'],
      },
    ])
    .withPublicDomain(['U.S. Congressional Records'])
    .addParent(CommonUniverseIds.US_STATEHOOD)
    .addReference({
      type: 'BASED_ON',
      targetUniverseId: usConstitutionUniverse.universeId,
      description: 'Statehood is granted under the authority of the U.S. Constitution.',
      confidence: 1.0,
      evidence: ['Article IV, Section 3 of the U.S. Constitution'],
    })
    .addEpoch('primary', 'civil_war', { ...CIVIL_WAR_EPOCH })
    .addDateSegment(
      `${data.admission}T12:00:00Z`,
      PRESENT_ISO,
      'statehood_era',
      'legal_period',
      'active',
      'United States',
      `Period from ${data.name}'s admission to the Union to the present day.`,
    )
    .addDateKeyframe(
      `${data.admission}T12:00:00Z`,
      'admission_to_union',
      1.0,
      ['statehood', 'admission', 'us_history'],
      { certainty: 1.0 },
    )
    .withWindowing('phase_based');

  if (data.secession) {
    builder.addDateKeyframe(
      `${data.secession}T12:00:00Z`,
      'secession_from_union',
      0.95,
      ['secession', 'civil_war', 'confederacy'],
      { certainty: 1.0 },
    );
  }

  if (data.readmission) {
    builder.addDateKeyframe(
      `${data.readmission}T12:00:00Z`,
      'readmission_to_union',
      0.9,
      ['readmission', 'reconstruction', 'us_history'],
      { certainty: 1.0 },
    );
  }

  const universe = builder.build();
  // `metadata.creators` has no builder setter: `withCreators` records roles, and
  // Congress is the authorising body rather than a credited person. Assigning the
  // typed field after `build()` keeps the value without a literal or a cast.
  universe.metadata = { ...universe.metadata, creators: ['United States Congress'] };
  return universe;
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
