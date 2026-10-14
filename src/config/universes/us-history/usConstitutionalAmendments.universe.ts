import { Universe, UniverseType } from '../../../core/types';
import { CommonUniverseIds } from '../../../core/common-universe-ids';
import { usConstitutionUniverse } from './usFoundingDocuments.universe';

/**
 * U.S. Constitutional Amendments Collection
 *
 * Documents the constitutional amendments ratified after the Bill of Rights
 * (amendments 11-27), each as a distinct universe. It models the ratification
 * moment for each amendment and the unique case of the 21st Amendment repealing
 * the 18th.
 *
 * Research Sources:
 * - Congress.gov: "Constitution of the United States"
 * - National Archives: "The Constitution: Amendments 11-27"
 * - Cornell Law School Legal Information Institute (LII)
 *
 * Hierarchical Context: US_CONSTITUTION -> US_GOVERNMENT -> US_HISTORY
 */

const fromIso = (iso: string): bigint => BigInt(new Date(iso).getTime()) * 1_000_000n;

interface AmendmentData {
  num: number;
  name: string;
  ratified: string;
  summary: string;
  significance: number;
  repeals?: number;
}

const ordinal = (n: number): string =>
  n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th';

const createAmendmentUniverse = (data: AmendmentData): Universe => {
  const year = data.ratified.substring(0, 4);
  const amendmentId = `us:amendment:${data.num}:${year}`;

  const references: Array<Record<string, unknown>> = [
    {
      type: 'AMENDS',
      targetUniverseId: usConstitutionUniverse.universeId,
      description: `Amendment ${data.num} modifies the U.S. Constitution.`,
      confidence: 1.0,
      evidence: ['Article V of the U.S. Constitution'],
    },
  ];

  if (data.repeals) {
    references.push({
      type: 'REPEALS',
      targetUniverseId: `us:amendment:${data.repeals}:1919`,
      description: `The ${data.num}th Amendment repeals the ${data.repeals}th Amendment (Prohibition).`,
      confidence: 1.0,
      evidence: [`Section 1 of the ${data.num}th Amendment`],
    });
  }

  // A repealing amendment is a *later* amendment that terminates this one's
  // legal effect. The repealed amendment is not erased — it is still a ratified
  // fact — but its period of force ends when the repealer is ratified.
  // Cross-reference: 42i treats that as a bounded real segment (tension 0),
  // never as an imaginary branch: it passed, so it has a real axis to end.
  const repealer = amendmentData.find((a) => a.repeals === data.num);
  const effectiveEnd = repealer ? repealer.ratified : data.ratified;

  return {
    universeId: amendmentId,
    type: UniverseType.LEGAL_TIMELINE,
    identifiers: {
      primary: amendmentId,
      aliases: [`${data.num}th Amendment`, data.name],
    },
    realityRelation: {
      type: 'documentary',
      fictionalizationDegree: 0.0,
      realityAnchors: [
        {
          realEventId: amendmentId,
          relationshipType: 'documents',
          confidence: 1.0,
          evidence: ['National Archives'],
        },
      ],
    },
    attribution: {
      public_domain: true,
      sources: ['National Archives'],
      citations_required: false,
      usage_restrictions: [],
    },
    layers: [{ layerId: 'primary', type: 'primary', epochs: {} }],
    epochs: {},
    temporalStructure: {
      segments: [
        {
          id: 'ratification_period',
          // Start time would be the proposal date, which varies; modelled from ratification.
          start: fromIso(`${data.ratified}T12:00:00Z`),
          // A repealed amendment's period of force ends at the repealer's
          // ratification; an unrepealed one is open-ended in this model.
          end: fromIso(`${effectiveEnd}T12:00:00Z`),
          type: 'legal_period',
          status: repealer ? 'overturned' : 'active',
          jurisdiction: 'United States',
          description: repealer
            ? `Ratification of the ${data.num}th Amendment; repealed by the ${repealer.num}th on ${repealer.ratified}.`
            : `Ratification of the ${data.num}th Amendment.`,
        },
      ],
      keyframes: [
        {
          id: 'ratification_complete',
          timestamp: fromIso(`${data.ratified}T12:00:00Z`),
          significance: 1.0,
          tags: ['legal', 'ratification', 'constitutional_law'],
          certainty: 1.0,
        },
        ...(repealer
          ? [
              {
                id: 'repealed',
                timestamp: fromIso(`${repealer.ratified}T12:00:00Z`),
                significance: 0.9,
                tags: ['legal', 'repeal', 'constitutional_law'],
                certainty: 1.0,
              },
            ]
          : []),
      ],
      windows: { strategy: 'phase_based' },
    },
    metadata: {
      canonicalName: `${data.num}${ordinal(data.num)} Amendment: ${data.name}`,
      description: data.summary,
      creators: ['United States Congress', 'State Legislatures'],
      released: new Date(data.ratified),
      cultural_significance: data.significance,
    },
    connections: {
      natural: {
        parentUniverses: [
          usConstitutionUniverse.universeId,
          ...CommonUniverseIds.getUSApplicableUniverses(),
        ],
      },
      references,
    },
  } as unknown as Universe;
};

const amendmentData: AmendmentData[] = [
  // Amendments 1-10 (the Bill of Rights) are modelled in usFoundingDocuments.universe.ts.
  { num: 11, name: 'Suits Against States', ratified: '1795-02-07', summary: 'Limits the ability of individuals to sue states in federal court.', significance: 0.7 },
  { num: 12, name: 'Election of President and Vice-President', ratified: '1804-06-15', summary: 'Revises presidential election procedures by having the Electoral College cast separate ballots.', significance: 0.75 },
  { num: 13, name: 'Abolition of Slavery', ratified: '1865-12-06', summary: 'Abolishes slavery and involuntary servitude, except as punishment for a crime.', significance: 0.99 },
  { num: 14, name: 'Citizenship, Due Process, and Equal Protection', ratified: '1868-07-09', summary: 'Defines citizenship and guarantees equal protection under the law.', significance: 0.99 },
  { num: 15, name: 'Right to Vote Regardless of Race', ratified: '1870-02-03', summary: 'Prohibits the denial of the right to vote based on race, color, or previous condition of servitude.', significance: 0.98 },
  { num: 16, name: 'Income Tax', ratified: '1913-02-03', summary: 'Allows the federal government to collect an income tax.', significance: 0.85 },
  { num: 17, name: 'Direct Election of Senators', ratified: '1913-04-08', summary: 'Establishes the direct election of U.S. senators by popular vote.', significance: 0.8 },
  { num: 18, name: 'Prohibition of Alcohol', ratified: '1919-01-16', summary: 'Prohibited the manufacture, sale, and transportation of alcoholic beverages.', significance: 0.9 },
  { num: 19, name: "Women's Suffrage", ratified: '1920-08-18', summary: 'Prohibits denying the right to vote on the basis of sex.', significance: 0.99 },
  { num: 20, name: 'Presidential Term and Succession', ratified: '1933-01-23', summary: 'Changes the dates of presidential and congressional terms (Lame Duck Amendment).', significance: 0.7 },
  { num: 21, name: 'Repeal of Prohibition', ratified: '1933-12-05', summary: 'Repeals the 18th Amendment, ending the national prohibition of alcohol.', significance: 0.9, repeals: 18 },
  { num: 22, name: 'Presidential Term Limits', ratified: '1951-02-27', summary: 'Limits the president to two terms in office.', significance: 0.8 },
  { num: 23, name: 'Presidential Electors for D.C.', ratified: '1961-03-29', summary: 'Grants the District of Columbia electors in the Electoral College.', significance: 0.65 },
  { num: 24, name: 'Abolition of Poll Taxes', ratified: '1964-01-23', summary: 'Prohibits conditioning the right to vote on payment of a poll tax.', significance: 0.9 },
  { num: 25, name: 'Presidential Disability and Succession', ratified: '1967-02-10', summary: 'Clarifies the line of succession to the presidency and presidential disability.', significance: 0.75 },
  { num: 26, name: 'Right to Vote at Age 18', ratified: '1971-07-01', summary: 'Lowers the voting age from 21 to 18.', significance: 0.85 },
  { num: 27, name: 'Congressional Pay Raises', ratified: '1992-05-07', summary: 'Delays laws affecting Congressional salary from taking effect until after the next election.', significance: 0.6 },
];

export const usConstitutionalAmendments: Universe[] = amendmentData.map(createAmendmentUniverse);
