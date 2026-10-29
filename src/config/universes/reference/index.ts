export { xkcd1491AuthorityUniverse, XKCD_1491_DISPUTED_ENTRIES } from './xkcd_1491_authority';
export { xkcd1491CorrectionsUniverse } from './xkcd_1491_corrections';

import { xkcd1491AuthorityUniverse } from './xkcd_1491_authority';
import { xkcd1491CorrectionsUniverse } from './xkcd_1491_corrections';

/**
 * The chart fixture pair (james-gibson/local-time#229, #230): a closed rendering
 * authority and its one-way erratum. Registered so the corpus can reach them by id,
 * but excluded from the default chart corpus — a fixture that draws itself as a row
 * is measuring its own ruler.
 */
export const referenceUniverses = [xkcd1491AuthorityUniverse, xkcd1491CorrectionsUniverse];
