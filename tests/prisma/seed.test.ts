/**
 * Prisma in the ordinary test flow (james-gibson/local-time#58).
 *
 * Before this file, `prisma/` was exercised by nothing: `npm run typecheck` did not
 * include it (#161), `eslint` covered `src` only, and no jest suite imported it. The
 * consequence was not theoretical — the seed had never been run, and its first run
 * failed three times in a row (objects handed to `String` columns, `bigint` in
 * `JSON.stringify`, `precision` stored as a nanosecond `Int`). A database boundary is
 * precisely where those surface, so the seed now runs on every `npm test` against a
 * throwaway SQLite file: `prisma db push` builds the schema, `seedDatabase` fills it,
 * and the assertions below read it back.
 *
 * Nothing here touches a developer's `prisma/dev.db`: the database is a fresh file in
 * the OS temp directory, removed in `afterAll`.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PrismaClient } from '@prisma/client';
import { seedDatabase, type SeedSummary } from '../../prisma/seed-database';
import { allNetworks, allUniverses } from '../../src/config/universes/index';
import { TimePrecision } from '../../src/core/types';

jest.setTimeout(120_000);

const repoRoot = join(__dirname, '..', '..');
const workDir = mkdtempSync(join(tmpdir(), 'local-time-prisma-'));
const databaseUrl = `file:${join(workDir, 'test.db')}`;

let prisma: PrismaClient;
let summary: SeedSummary;

beforeAll(async () => {
  // The schema is applied by the Prisma CLI rather than by a checked-in `.sql` dump, so
  // the thing under test is the same `prisma/schema.prisma` the app would use. It is the
  // slowest step in the suite (~1 s) and happens once.
  execFileSync(
    process.execPath,
    [
      require.resolve('prisma/build/index.js'),
      'db',
      'push',
      '--skip-generate',
      '--schema',
      join(repoRoot, 'prisma', 'schema.prisma'),
    ],
    { env: { ...process.env, DATABASE_URL: databaseUrl }, stdio: 'pipe' },
  );

  prisma = new PrismaClient({ datasourceUrl: databaseUrl });
  summary = await seedDatabase(prisma);
});

afterAll(async () => {
  await prisma?.$disconnect();
  rmSync(workDir, { recursive: true, force: true });
});

const idOf = (universeId: unknown): string => String(universeId);

describe('seedDatabase', () => {
  test('writes one row per registered universe, and drops none silently', async () => {
    expect(summary.universes).toBe(allUniverses.length);
    expect(await prisma.universe.count()).toBe(allUniverses.length);

    // The seed accepts two authored segment shapes (see `SegmentLike`). A segment that
    // matches neither is skipped rather than crashed on — assert there are none, so a
    // third shape in future data fails here instead of vanishing from the database.
    expect(summary.unmodelledSegments).toBe(0);

    const segments = await prisma.temporalSegment.count();
    expect(segments).toBe(summary.segments);
  });

  test('every network membership points at a universe that exists', async () => {
    const registered = new Set(allUniverses.map((universe) => idOf(universe.universeId)));

    let expectedMemberships = 0;
    let expectedUnresolved = 0;
    for (const network of allNetworks) {
      const members = Array.isArray(network.universes)
        ? network.universes
        : Array.from(network.universes ?? []);
      for (const member of members) {
        if (registered.has(idOf(member))) expectedMemberships += 1;
        else expectedUnresolved += 1;
      }
    }

    expect(summary.networks).toBe(allNetworks.length);
    expect(summary.memberships).toBe(expectedMemberships);
    expect(summary.unresolvedMemberships).toBe(expectedUnresolved);
    expect(await prisma.universeNetworkMembership.count()).toBe(expectedMemberships);

    // A membership row that names a missing universe is only possible with foreign keys
    // off, which is SQLite's default. Read the join back rather than trusting the count.
    const orphans = await prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) AS count
      FROM universe_network_memberships m
      LEFT JOIN universes u ON u.id = m.universeId
      WHERE u.id IS NULL
    `;
    expect(Number(orphans[0].count)).toBe(0);
  });

  test('JSON columns are stored as JSON, not as Prisma-coerced objects', async () => {
    const rows = await prisma.universe.findMany({
      select: { id: true, identifiers: true, realityRelation: true },
    });
    const byId = new Map(rows.map((row) => [row.id, row]));

    for (const universe of allUniverses) {
      const row = byId.get(idOf(universe.universeId));
      expect(row).toBeDefined();
      // `toEqual` on the parsed value is the point: the first version of the seed passed
      // the object straight through and Prisma rejected it on the first universe.
      //
      // A container universe (`container()` in `src/config/universes/`, e.g. the energy
      // log) declares no `identifiers` at all, so `null` is the only honest value — the
      // column is nullable for exactly that shape.
      const stored = row!.identifiers;
      if (universe.identifiers === undefined) {
        expect(stored).toBeNull();
      } else {
        expect(stored).not.toBeNull();
        expect(JSON.parse(stored!)).toEqual(universe.identifiers);
      }
      expect(JSON.parse(row!.realityRelation)).toEqual(universe.realityRelation);
    }
  });

  test('the search projection carries person-keyed creator names (#148)', async () => {
    const rows = await prisma.universeSearchView.findMany({
      select: { universeId: true, searchText: true },
    });
    const searchText = new Map(rows.map((row) => [row.universeId, row.searchText]));

    const withCreators = allUniverses.filter((universe) => universe.attribution?.creators?.length);
    expect(withCreators.length).toBeGreaterThan(0);

    for (const universe of withCreators) {
      const text = searchText.get(idOf(universe.universeId));
      expect(text).toBeDefined();
      for (const creator of universe.attribution.creators ?? []) {
        // The pre-#148 code read `creators.director.join(' ')`, which threw for the
        // person-keyed shape. Reading the name back out of the projection is the gate.
        expect(text).toContain(String(creator.name));
      }
    }
  });

  test('temporal bounds are numeric, not lexicographic', async () => {
    const epochs = await prisma.temporalEpoch.findMany({
      select: { layer: { select: { universeId: true } }, startTime: true, endTime: true },
    });

    const bounds = new Map<string, { earliest?: bigint; latest?: bigint }>();
    for (const epoch of epochs) {
      const universeId = epoch.layer.universeId;
      const current = bounds.get(universeId) ?? {};
      const start = epoch.startTime === null ? undefined : BigInt(epoch.startTime);
      const end = epoch.endTime === null ? undefined : BigInt(epoch.endTime);
      if (start !== undefined && (current.earliest === undefined || start < current.earliest)) {
        current.earliest = start;
      }
      if (end !== undefined && (current.latest === undefined || end > current.latest)) {
        current.latest = end;
      }
      bounds.set(universeId, current);
    }

    const rows = await prisma.universeSearchView.findMany({
      select: { universeId: true, earliestTime: true, latestTime: true },
    });

    let checked = 0;
    for (const row of rows) {
      const expected = bounds.get(row.universeId) ?? {};
      // Comparing the decimal strings instead of the values sorts `'999'` after `'1000'`
      // and every negative (pre-1970) timestamp before every positive one. The seed used
      // to do exactly that, so this pins the fix across every universe, including the
      // pre-1970 ones where the two answers differ.
      expect(row.earliestTime).toBe(expected.earliest?.toString() ?? null);
      expect(row.latestTime).toBe(expected.latest?.toString() ?? null);
      checked += 1;
    }
    expect(checked).toBe(allUniverses.length);
  });

  test('precision is stored as a TimePrecision name, or null when undeclared', async () => {
    const names = new Set(
      Object.values(TimePrecision).filter((value): value is string => typeof value === 'string'),
    );
    const epochs = await prisma.temporalEpoch.findMany({ select: { precision: true } });

    const undeclared = epochs.filter((epoch) => epoch.precision === null).length;
    for (const epoch of epochs) {
      if (epoch.precision === null) continue;
      expect(names.has(epoch.precision)).toBe(true);
    }

    // The enum's numeric value is a nanosecond span — DAY is 86_400_000_000_000 — so it
    // fits neither `Int` nor, at MILLION_YEARS, SQLite's 64-bit INTEGER. The name is the
    // storage form; `undeclared` is the visible count of epochs that carry no precision,
    // which is older data debt (#58 follow-up), not something this seed may invent.
    expect(undeclared).toBeLessThan(epochs.length);
    expect(epochs.length).toBe(summary.epochs);
  });

  test('re-seeding replaces the previous contents instead of duplicating them', async () => {
    const second = await seedDatabase(prisma);

    expect(second).toEqual(summary);
    expect(await prisma.universe.count()).toBe(allUniverses.length);
    expect(await prisma.temporalKeyframe.count()).toBe(summary.keyframes);
    expect(await prisma.universeSearchView.count()).toBe(allUniverses.length);
  });
});
