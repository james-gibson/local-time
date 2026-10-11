export * from './usFoundingDocuments.universe';
export * from './usConstitutionalAmendments.universe';
export * from './usStatehoodHistory.universe';

import { Universe } from '../../../core/types';
import { usConstitutionUniverse, billOfRightsUniverse } from './usFoundingDocuments.universe';
import { usConstitutionalAmendments } from './usConstitutionalAmendments.universe';
import { usStatehoodHistory } from './usStatehoodHistory.universe';

/**
 * All universes derived from james-gibson/local-time#5 — the founding
 * documents, the post-Bill-of-Rights amendments, and the statehood history of
 * the fifty states.
 */
export const usHistoryUniverses: Universe[] = [
  usConstitutionUniverse,
  billOfRightsUniverse,
  ...usConstitutionalAmendments,
  ...usStatehoodHistory,
];
