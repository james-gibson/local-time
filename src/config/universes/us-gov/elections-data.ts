import { PoliticalParty, ElectionRecord } from './election-types';

/**
 * Every U.S. presidential election, 1788-89 through 2024.
 *
 * local-time#6. The issue asked for seven elections (1860, 1932, 1968, 1980, 2000,
 * 2008, 2016) plus a longitudinal list of recurring issues; the module previously
 * held only six elections (1789, 1792, 1796, 1800, 2020, 2024) and carried no
 * notion of issues at all. This table is the complete series.
 *
 * Provenance and method
 * ---------------------
 * Dates and candidates were extracted mechanically from the `{{Infobox election}}`
 * block of each of the 60 Wikipedia articles titled "<year> United States presidential
 * election" (the 1788-89 article uses an en-dash year). Nothing here was recalled.
 *
 * Two things that extraction forced, both of which the old module got wrong:
 *
 * 1. **Voting spans, not days.** Before 1845 there was no single Election Day. Voting
 *    ran for weeks: 1792 opened 2 November and closed 5 December; 1840 ran 30 October
 *    to 23 November; 1788-89 ran 15 December 1788 to 7 January 1789, straddling a
 *    calendar year. All 15 elections up to and including 1844 are multi-day; all 45
 *    from 1848 onward are single-day. The old `createElectionUniverse` hardcoded
 *    `startTime + 24h` for every election, which was simply wrong for a quarter of them.
 *
 * 2. **The 1789 anchor moved.** The old module dated the first election 1789-01-10,
 *    the date the Electoral College is commonly said to have met. Wikipedia's infobox
 *    gives the election itself as 1788-12-15 to 1789-01-07. This table records the
 *    voting span, and `createElectionUniverse` puts the outcome keyframe at
 *    `votingCloses`. Note that `src/addressing/__tests__/temporal-42i.elections.test.ts`
 *    hardcodes 1789-01-10 independently and is unaffected — it never reads this table.
 *
 * Minor-candidate coverage follows each article's infobox, which is the same
 * "received electoral votes or 5% of the popular vote" bar the Wikipedia summary table
 * uses. Some infoboxes are thinner than others: the 1796 article lists only Adams and
 * Jefferson, so Pinckney and Burr (both present in the previous module) are dropped.
 */
export const US_ELECTION_RECORDS: ElectionRecord[] = [
  {
    year: 1788,
    idYear: '1788-1789',
    votingOpens: '1788-12-15',
    votingCloses: '1789-01-07',
    candidates: [
      { name: 'George Washington', party: PoliticalParty.INDEPENDENT, role: 'Presidential', status: 'Winner' },
    ],
  },
  {
    year: 1792,
    idYear: '1792',
    votingOpens: '1792-11-02',
    votingCloses: '1792-12-05',
    candidates: [
      { name: 'George Washington', party: PoliticalParty.INDEPENDENT, role: 'Presidential', status: 'Winner' },
    ],
  },
  {
    year: 1796,
    idYear: '1796',
    votingOpens: '1796-11-04',
    votingCloses: '1796-12-07',
    candidates: [
      { name: 'John Adams', party: PoliticalParty.FEDERALIST, role: 'Presidential', status: 'Winner' },
      { name: 'Thomas Jefferson', party: PoliticalParty.DEMOCRATIC_REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
    ],
  },
  {
    year: 1800,
    idYear: '1800',
    votingOpens: '1800-10-30',
    votingCloses: '1800-12-03',
    candidates: [
      { name: 'Thomas Jefferson', party: PoliticalParty.DEMOCRATIC_REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'Aaron Burr', party: PoliticalParty.DEMOCRATIC_REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'John Adams', party: PoliticalParty.FEDERALIST, role: 'Presidential', status: 'Loser' },
      { name: 'Charles Cotesworth Pinckney', party: PoliticalParty.FEDERALIST, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1804,
    idYear: '1804',
    votingOpens: '1804-11-01',
    votingCloses: '1804-12-04',
    candidates: [
      { name: 'Thomas Jefferson', party: PoliticalParty.DEMOCRATIC_REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'George Clinton', party: PoliticalParty.DEMOCRATIC_REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Charles Cotesworth Pinckney', party: PoliticalParty.FEDERALIST, role: 'Presidential', status: 'Loser' },
      { name: 'Rufus King', party: PoliticalParty.FEDERALIST, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1808,
    idYear: '1808',
    votingOpens: '1808-11-04',
    votingCloses: '1808-12-07',
    candidates: [
      { name: 'James Madison', party: PoliticalParty.DEMOCRATIC_REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'George Clinton', party: PoliticalParty.DEMOCRATIC_REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Charles Cotesworth Pinckney', party: PoliticalParty.FEDERALIST, role: 'Presidential', status: 'Loser' },
      { name: 'Rufus King', party: PoliticalParty.FEDERALIST, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1812,
    idYear: '1812',
    votingOpens: '1812-10-30',
    votingCloses: '1812-12-02',
    candidates: [
      { name: 'James Madison', party: PoliticalParty.DEMOCRATIC_REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'Elbridge Gerry', party: PoliticalParty.DEMOCRATIC_REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'DeWitt Clinton', party: PoliticalParty.DEMOCRATIC_REPUBLICAN, role: 'Presidential', status: 'Loser' },
      { name: 'Jared Ingersoll', party: PoliticalParty.DEMOCRATIC_REPUBLICAN, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1816,
    idYear: '1816',
    votingOpens: '1816-11-01',
    votingCloses: '1816-12-03',
    candidates: [
      { name: 'James Monroe', party: PoliticalParty.DEMOCRATIC_REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'Daniel D. Tompkins', party: PoliticalParty.DEMOCRATIC_REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Rufus King', party: PoliticalParty.FEDERALIST, role: 'Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1820,
    idYear: '1820',
    votingOpens: '1820-11-01',
    votingCloses: '1820-12-06',
    candidates: [
      { name: 'James Monroe', party: PoliticalParty.DEMOCRATIC_REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'Daniel D. Tompkins', party: PoliticalParty.DEMOCRATIC_REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
    ],
  },
  {
    year: 1824,
    idYear: '1824',
    votingOpens: '1824-10-26',
    votingCloses: '1824-12-02',
    candidates: [
      { name: 'John Quincy Adams', party: PoliticalParty.DEMOCRATIC_REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'John C. Calhoun', party: PoliticalParty.DEMOCRATIC_REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Andrew Jackson', party: PoliticalParty.DEMOCRATIC_REPUBLICAN, role: 'Presidential', status: 'Loser' },
      { name: 'John C. Calhoun', party: PoliticalParty.DEMOCRATIC_REPUBLICAN, role: 'Vice Presidential', status: 'Loser' },
      { name: 'William H. Crawford', party: PoliticalParty.DEMOCRATIC_REPUBLICAN, role: 'Presidential', status: 'Loser' },
      { name: 'Nathaniel Macon', party: PoliticalParty.DEMOCRATIC_REPUBLICAN, role: 'Vice Presidential', status: 'Loser' },
      { name: 'Henry Clay', party: PoliticalParty.DEMOCRATIC_REPUBLICAN, role: 'Presidential', status: 'Loser' },
      { name: 'Nathan Sanford', party: PoliticalParty.DEMOCRATIC_REPUBLICAN, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1828,
    idYear: '1828',
    votingOpens: '1828-10-31',
    votingCloses: '1828-12-02',
    candidates: [
      { name: 'Andrew Jackson', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Winner' },
      { name: 'John C. Calhoun', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Winner' },
      { name: 'John Quincy Adams', party: PoliticalParty.NATIONAL_REPUBLICAN, role: 'Presidential', status: 'Loser' },
      { name: 'Richard Rush', party: PoliticalParty.NATIONAL_REPUBLICAN, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1832,
    idYear: '1832',
    votingOpens: '1832-11-02',
    votingCloses: '1832-12-05',
    candidates: [
      { name: 'Andrew Jackson', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Winner' },
      { name: 'Martin Van Buren', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Henry Clay', party: PoliticalParty.NATIONAL_REPUBLICAN, role: 'Presidential', status: 'Loser' },
      { name: 'John Sergeant', party: PoliticalParty.NATIONAL_REPUBLICAN, role: 'Vice Presidential', status: 'Loser' },
      { name: 'John Floyd', party: PoliticalParty.NULLIFIER, role: 'Presidential', status: 'Loser' },
      { name: 'Henry Lee', party: PoliticalParty.NULLIFIER, role: 'Vice Presidential', status: 'Loser' },
      { name: 'William Wirt', party: PoliticalParty.ANTI_MASONIC, role: 'Presidential', status: 'Loser' },
      { name: 'Amos Ellmaker', party: PoliticalParty.ANTI_MASONIC, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1836,
    idYear: '1836',
    votingOpens: '1836-11-04',
    votingCloses: '1836-12-06',
    candidates: [
      { name: 'Martin Van Buren', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Winner' },
      { name: 'Richard Mentor Johnson', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Winner' },
      { name: 'William Henry Harrison', party: PoliticalParty.WHIG, role: 'Presidential', status: 'Loser' },
      { name: 'Francis Granger', party: PoliticalParty.WHIG, role: 'Vice Presidential', status: 'Loser' },
      { name: 'Hugh Lawson White', party: PoliticalParty.WHIG, role: 'Presidential', status: 'Loser' },
      { name: 'John Tyler', party: PoliticalParty.WHIG, role: 'Vice Presidential', status: 'Loser' },
      { name: 'Daniel Webster', party: PoliticalParty.WHIG, role: 'Presidential', status: 'Loser' },
      { name: 'Francis Granger', party: PoliticalParty.WHIG, role: 'Vice Presidential', status: 'Loser' },
      { name: 'Willie P. Mangum', party: PoliticalParty.WHIG, role: 'Presidential', status: 'Loser' },
      { name: 'John Tyler', party: PoliticalParty.WHIG, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1840,
    idYear: '1840',
    votingOpens: '1840-10-30',
    votingCloses: '1840-11-23',
    candidates: [
      { name: 'William Henry Harrison', party: PoliticalParty.WHIG, role: 'Presidential', status: 'Winner' },
      { name: 'John Tyler', party: PoliticalParty.WHIG, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Martin Van Buren', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1844,
    idYear: '1844',
    votingOpens: '1844-11-01',
    votingCloses: '1844-12-01',
    candidates: [
      { name: 'James K. Polk', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Winner' },
      { name: 'George M. Dallas', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Henry Clay', party: PoliticalParty.WHIG, role: 'Presidential', status: 'Loser' },
      { name: 'Theodore Frelinghuysen', party: PoliticalParty.WHIG, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1848,
    idYear: '1848',
    votingOpens: '1848-11-07',
    votingCloses: '1848-11-07',
    candidates: [
      { name: 'Zachary Taylor', party: PoliticalParty.WHIG, role: 'Presidential', status: 'Winner' },
      { name: 'Millard Fillmore', party: PoliticalParty.WHIG, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Lewis Cass', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Loser' },
      { name: 'William O. Butler', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Loser' },
      { name: 'Martin Van Buren', party: PoliticalParty.FREE_SOIL, role: 'Presidential', status: 'Loser' },
      { name: 'Charles Francis Adams Sr.', party: PoliticalParty.FREE_SOIL, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1852,
    idYear: '1852',
    votingOpens: '1852-11-02',
    votingCloses: '1852-11-02',
    candidates: [
      { name: 'Franklin Pierce', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Winner' },
      { name: 'William R. King', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Winfield Scott', party: PoliticalParty.WHIG, role: 'Presidential', status: 'Loser' },
      { name: 'William Alexander Graham', party: PoliticalParty.WHIG, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1856,
    idYear: '1856',
    votingOpens: '1856-11-04',
    votingCloses: '1856-11-04',
    candidates: [
      { name: 'James Buchanan', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Winner' },
      { name: 'John C. Breckinridge', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Winner' },
      { name: 'John C. Frémont', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Loser' },
      { name: 'William L. Dayton', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Loser' },
      { name: 'Millard Fillmore', party: PoliticalParty.AMERICAN, role: 'Presidential', status: 'Loser' },
      { name: 'Andrew Jackson Donelson', party: PoliticalParty.AMERICAN, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1860,
    idYear: '1860',
    votingOpens: '1860-11-06',
    votingCloses: '1860-11-06',
    candidates: [
      { name: 'Abraham Lincoln', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'Hannibal Hamlin', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'John C. Breckinridge', party: PoliticalParty.SOUTHERN_DEMOCRATIC, role: 'Presidential', status: 'Loser' },
      { name: 'Joseph Lane', party: PoliticalParty.SOUTHERN_DEMOCRATIC, role: 'Vice Presidential', status: 'Loser' },
      { name: 'John Bell', party: PoliticalParty.CONSTITUTIONAL_UNION, role: 'Presidential', status: 'Loser' },
      { name: 'Edward Everett', party: PoliticalParty.CONSTITUTIONAL_UNION, role: 'Vice Presidential', status: 'Loser' },
      { name: 'Stephen A. Douglas', party: PoliticalParty.NORTHERN_DEMOCRATIC, role: 'Presidential', status: 'Loser' },
      { name: 'Herschel V. Johnson', party: PoliticalParty.NORTHERN_DEMOCRATIC, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1864,
    idYear: '1864',
    votingOpens: '1864-11-08',
    votingCloses: '1864-11-08',
    candidates: [
      { name: 'Abraham Lincoln', party: PoliticalParty.NATIONAL_UNION, role: 'Presidential', status: 'Winner' },
      { name: 'Andrew Johnson', party: PoliticalParty.NATIONAL_UNION, role: 'Vice Presidential', status: 'Winner' },
      { name: 'George B. McClellan', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Loser' },
      { name: 'George H. Pendleton', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1868,
    idYear: '1868',
    votingOpens: '1868-11-03',
    votingCloses: '1868-11-03',
    candidates: [
      { name: 'Ulysses S. Grant', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'Schuyler Colfax', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Horatio Seymour', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Loser' },
      { name: 'Francis Preston Blair Jr.', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1872,
    idYear: '1872',
    votingOpens: '1872-11-05',
    votingCloses: '1872-11-05',
    candidates: [
      { name: 'Ulysses S. Grant', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'Henry Wilson', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Horace Greeley', party: PoliticalParty.LIBERAL_REPUBLICAN, role: 'Presidential', status: 'Loser' },
      { name: 'B. Gratz Brown', party: PoliticalParty.LIBERAL_REPUBLICAN, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1876,
    idYear: '1876',
    votingOpens: '1876-11-07',
    votingCloses: '1876-11-07',
    candidates: [
      { name: 'Rutherford B. Hayes', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'William A. Wheeler', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Samuel J. Tilden', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Loser' },
      { name: 'Thomas A. Hendricks', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1880,
    idYear: '1880',
    votingOpens: '1880-11-02',
    votingCloses: '1880-11-02',
    candidates: [
      { name: 'James A. Garfield', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'Chester A. Arthur', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Winfield Scott Hancock', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Loser' },
      { name: 'William Hayden English', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1884,
    idYear: '1884',
    votingOpens: '1884-11-04',
    votingCloses: '1884-11-04',
    candidates: [
      { name: 'Grover Cleveland', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Winner' },
      { name: 'Thomas A. Hendricks', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Winner' },
      { name: 'James G. Blaine', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Loser' },
      { name: 'John A. Logan', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1888,
    idYear: '1888',
    votingOpens: '1888-11-06',
    votingCloses: '1888-11-06',
    candidates: [
      { name: 'Benjamin Harrison', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'Levi P. Morton', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Grover Cleveland', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Loser' },
      { name: 'Allen G. Thurman', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1892,
    idYear: '1892',
    votingOpens: '1892-11-08',
    votingCloses: '1892-11-08',
    candidates: [
      { name: 'Grover Cleveland', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Winner' },
      { name: 'Adlai Stevenson I', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Benjamin Harrison', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Loser' },
      { name: 'Whitelaw Reid', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Loser' },
      { name: 'James B. Weaver', party: PoliticalParty.POPULIST, role: 'Presidential', status: 'Loser' },
      { name: 'James G. Field', party: PoliticalParty.POPULIST, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1896,
    idYear: '1896',
    votingOpens: '1896-11-03',
    votingCloses: '1896-11-03',
    candidates: [
      { name: 'William McKinley', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'Garret Hobart', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'William Jennings Bryan', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Loser' },
      { name: 'Arthur Sewall', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1900,
    idYear: '1900',
    votingOpens: '1900-11-06',
    votingCloses: '1900-11-06',
    candidates: [
      { name: 'William McKinley', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'Theodore Roosevelt', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'William Jennings Bryan', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Loser' },
      { name: 'Adlai Stevenson I', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1904,
    idYear: '1904',
    votingOpens: '1904-11-08',
    votingCloses: '1904-11-08',
    candidates: [
      { name: 'Theodore Roosevelt', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'Charles W. Fairbanks', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Alton B. Parker', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Loser' },
      { name: 'Henry G. Davis', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1908,
    idYear: '1908',
    votingOpens: '1908-11-03',
    votingCloses: '1908-11-03',
    candidates: [
      { name: 'William Howard Taft', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'James S. Sherman', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'William Jennings Bryan', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Loser' },
      { name: 'John W. Kern', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1912,
    idYear: '1912',
    votingOpens: '1912-11-05',
    votingCloses: '1912-11-05',
    candidates: [
      { name: 'Woodrow Wilson', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Winner' },
      { name: 'Thomas R. Marshall', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Theodore Roosevelt', party: PoliticalParty.PROGRESSIVE, role: 'Presidential', status: 'Loser' },
      { name: 'Hiram Johnson', party: PoliticalParty.PROGRESSIVE, role: 'Vice Presidential', status: 'Loser' },
      { name: 'William Howard Taft', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Loser' },
      { name: 'Nicholas Murray Butler', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Loser' },
      { name: 'Eugene V. Debs', party: PoliticalParty.SOCIALIST, role: 'Presidential', status: 'Loser' },
      { name: 'Emil Seidel', party: PoliticalParty.SOCIALIST, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1916,
    idYear: '1916',
    votingOpens: '1916-11-07',
    votingCloses: '1916-11-07',
    candidates: [
      { name: 'Woodrow Wilson', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Winner' },
      { name: 'Thomas R. Marshall', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Charles Evans Hughes', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Loser' },
      { name: 'Charles W. Fairbanks', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1920,
    idYear: '1920',
    votingOpens: '1920-11-02',
    votingCloses: '1920-11-02',
    candidates: [
      { name: 'Warren G. Harding', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'Calvin Coolidge', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'James M. Cox', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Loser' },
      { name: 'Franklin D. Roosevelt', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1924,
    idYear: '1924',
    votingOpens: '1924-11-04',
    votingCloses: '1924-11-04',
    candidates: [
      { name: 'Calvin Coolidge', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'Charles G. Dawes', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'John W. Davis', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Loser' },
      { name: 'Charles W. Bryan', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Loser' },
      { name: 'Robert M. La Follette', party: PoliticalParty.PROGRESSIVE, role: 'Presidential', status: 'Loser' },
      { name: 'Burton K. Wheeler', party: PoliticalParty.PROGRESSIVE, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1928,
    idYear: '1928',
    votingOpens: '1928-11-06',
    votingCloses: '1928-11-06',
    candidates: [
      { name: 'Herbert Hoover', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'Charles Curtis', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Al Smith', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Loser' },
      { name: 'Joseph T. Robinson', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1932,
    idYear: '1932',
    votingOpens: '1932-11-08',
    votingCloses: '1932-11-08',
    candidates: [
      { name: 'Franklin D. Roosevelt', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Winner' },
      { name: 'John Nance Garner', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Herbert Hoover', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Loser' },
      { name: 'Charles Curtis', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1936,
    idYear: '1936',
    votingOpens: '1936-11-03',
    votingCloses: '1936-11-03',
    candidates: [
      { name: 'Franklin D. Roosevelt', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Winner' },
      { name: 'John Nance Garner', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Alf Landon', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Loser' },
      { name: 'Frank Knox', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1940,
    idYear: '1940',
    votingOpens: '1940-11-05',
    votingCloses: '1940-11-05',
    candidates: [
      { name: 'Franklin D. Roosevelt', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Winner' },
      { name: 'Henry A. Wallace', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Wendell Willkie', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Loser' },
      { name: 'Charles L. McNary', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1944,
    idYear: '1944',
    votingOpens: '1944-11-07',
    votingCloses: '1944-11-07',
    candidates: [
      { name: 'Franklin D. Roosevelt', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Winner' },
      { name: 'Harry S. Truman', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Thomas E. Dewey', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Loser' },
      { name: 'John W. Bricker', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1948,
    idYear: '1948',
    votingOpens: '1948-11-02',
    votingCloses: '1948-11-02',
    candidates: [
      { name: 'Harry S. Truman', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Winner' },
      { name: 'Alben W. Barkley', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Thomas E. Dewey', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Loser' },
      { name: 'Earl Warren', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Loser' },
      { name: 'Strom Thurmond', party: PoliticalParty.STATES_RIGHTS_DEMOCRATIC, role: 'Presidential', status: 'Loser' },
      { name: 'Fielding L. Wright', party: PoliticalParty.STATES_RIGHTS_DEMOCRATIC, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1952,
    idYear: '1952',
    votingOpens: '1952-11-04',
    votingCloses: '1952-11-04',
    candidates: [
      { name: 'Dwight D. Eisenhower', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'Richard Nixon', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Adlai Stevenson II', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Loser' },
      { name: 'John Sparkman', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1956,
    idYear: '1956',
    votingOpens: '1956-11-06',
    votingCloses: '1956-11-06',
    candidates: [
      { name: 'Dwight D. Eisenhower', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'Richard Nixon', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Adlai Stevenson II', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Loser' },
      { name: 'Estes Kefauver', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1960,
    idYear: '1960',
    votingOpens: '1960-11-08',
    votingCloses: '1960-11-08',
    candidates: [
      { name: 'John F. Kennedy', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Winner' },
      { name: 'Lyndon B. Johnson', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Richard Nixon', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Loser' },
      { name: 'Henry Cabot Lodge Jr.', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1964,
    idYear: '1964',
    votingOpens: '1964-11-03',
    votingCloses: '1964-11-03',
    candidates: [
      { name: 'Lyndon B. Johnson', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Winner' },
      { name: 'Hubert Humphrey', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Barry Goldwater', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Loser' },
      { name: 'William E. Miller', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1968,
    idYear: '1968',
    votingOpens: '1968-11-05',
    votingCloses: '1968-11-05',
    candidates: [
      { name: 'Richard Nixon', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'Spiro Agnew', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Hubert Humphrey', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Loser' },
      { name: 'Edmund Muskie', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Loser' },
      { name: 'George Wallace', party: PoliticalParty.AMERICAN_INDEPENDENT, role: 'Presidential', status: 'Loser' },
      { name: 'Curtis LeMay', party: PoliticalParty.AMERICAN_INDEPENDENT, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1972,
    idYear: '1972',
    votingOpens: '1972-11-07',
    votingCloses: '1972-11-07',
    candidates: [
      { name: 'Richard Nixon', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'Spiro Agnew', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'George McGovern', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Loser' },
      { name: 'Sargent Shriver', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1976,
    idYear: '1976',
    votingOpens: '1976-11-02',
    votingCloses: '1976-11-02',
    candidates: [
      { name: 'Jimmy Carter', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Winner' },
      { name: 'Walter Mondale', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Gerald Ford', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Loser' },
      { name: 'Bob Dole', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1980,
    idYear: '1980',
    votingOpens: '1980-11-04',
    votingCloses: '1980-11-04',
    candidates: [
      { name: 'Ronald Reagan', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'George H. W. Bush', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Jimmy Carter', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Loser' },
      { name: 'Walter Mondale', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Loser' },
      { name: 'John B. Anderson', party: PoliticalParty.INDEPENDENT, role: 'Presidential', status: 'Loser' },
      { name: 'Patrick Lucey', party: PoliticalParty.INDEPENDENT, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1984,
    idYear: '1984',
    votingOpens: '1984-11-06',
    votingCloses: '1984-11-06',
    candidates: [
      { name: 'Ronald Reagan', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'George H. W. Bush', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Walter Mondale', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Loser' },
      { name: 'Geraldine Ferraro', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1988,
    idYear: '1988',
    votingOpens: '1988-11-08',
    votingCloses: '1988-11-08',
    candidates: [
      { name: 'George H. W. Bush', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'Dan Quayle', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Michael Dukakis', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Loser' },
      { name: 'Lloyd Bentsen', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1992,
    idYear: '1992',
    votingOpens: '1992-11-03',
    votingCloses: '1992-11-03',
    candidates: [
      { name: 'Bill Clinton', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Winner' },
      { name: 'Al Gore', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Winner' },
      { name: 'George H. W. Bush', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Loser' },
      { name: 'Dan Quayle', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Loser' },
      { name: 'Ross Perot', party: PoliticalParty.INDEPENDENT, role: 'Presidential', status: 'Loser' },
      { name: 'James Stockdale', party: PoliticalParty.INDEPENDENT, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 1996,
    idYear: '1996',
    votingOpens: '1996-11-05',
    votingCloses: '1996-11-05',
    candidates: [
      { name: 'Bill Clinton', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Winner' },
      { name: 'Al Gore', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Bob Dole', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Loser' },
      { name: 'Jack Kemp', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Loser' },
      { name: 'Ross Perot', party: PoliticalParty.REFORM, role: 'Presidential', status: 'Loser' },
      { name: 'Pat Choate', party: PoliticalParty.REFORM, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 2000,
    idYear: '2000',
    votingOpens: '2000-11-07',
    votingCloses: '2000-11-07',
    candidates: [
      { name: 'George W. Bush', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'Dick Cheney', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Al Gore', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Loser' },
      { name: 'Joe Lieberman', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 2004,
    idYear: '2004',
    votingOpens: '2004-11-02',
    votingCloses: '2004-11-02',
    candidates: [
      { name: 'George W. Bush', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'Dick Cheney', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'John Kerry', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Loser' },
      { name: 'John Edwards', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 2008,
    idYear: '2008',
    votingOpens: '2008-11-04',
    votingCloses: '2008-11-04',
    candidates: [
      { name: 'Barack Obama', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Winner' },
      { name: 'Joe Biden', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Winner' },
      { name: 'John McCain', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Loser' },
      { name: 'Sarah Palin', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 2012,
    idYear: '2012',
    votingOpens: '2012-11-06',
    votingCloses: '2012-11-06',
    candidates: [
      { name: 'Barack Obama', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Winner' },
      { name: 'Joe Biden', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Mitt Romney', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Loser' },
      { name: 'Paul Ryan', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 2016,
    idYear: '2016',
    votingOpens: '2016-11-08',
    votingCloses: '2016-11-08',
    candidates: [
      { name: 'Donald Trump', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'Mike Pence', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Hillary Clinton', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Loser' },
      { name: 'Tim Kaine', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 2020,
    idYear: '2020',
    votingOpens: '2020-11-03',
    votingCloses: '2020-11-03',
    candidates: [
      { name: 'Joe Biden', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Winner' },
      { name: 'Kamala Harris', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Donald Trump', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Loser' },
      { name: 'Mike Pence', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
  {
    year: 2024,
    idYear: '2024',
    votingOpens: '2024-11-05',
    votingCloses: '2024-11-05',
    candidates: [
      { name: 'Donald Trump', party: PoliticalParty.REPUBLICAN, role: 'Presidential', status: 'Winner' },
      { name: 'JD Vance', party: PoliticalParty.REPUBLICAN, role: 'Vice Presidential', status: 'Winner' },
      { name: 'Kamala Harris', party: PoliticalParty.DEMOCRATIC, role: 'Presidential', status: 'Loser' },
      { name: 'Tim Walz', party: PoliticalParty.DEMOCRATIC, role: 'Vice Presidential', status: 'Loser' },
    ],
  },
];
