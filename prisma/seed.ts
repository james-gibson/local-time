/**
 * `npm run db:seed` — the CLI entry point.
 *
 * The seeding itself lives in `./seed-database.ts` so that `tests/prisma/seed.test.ts`
 * can run it against a throwaway SQLite file without spawning a script
 * (james-gibson/local-time#58). Nothing in this file should grow beyond wiring.
 *
 * `tsx` does not read `.env` the way the Prisma CLI does, so a bare `npm run db:seed`
 * would otherwise fail on a missing `DATABASE_URL`. The default matches what
 * `prisma db push` writes for `.env.example`'s `file:./dev.db`, resolved from the repo
 * root (the CLI resolves it from `prisma/`).
 */
import { PrismaClient } from '@prisma/client';
import { seedDatabase } from './seed-database.js';

const databaseUrl = process.env.DATABASE_URL ?? 'file:./prisma/dev.db';
const prisma = new PrismaClient({ datasourceUrl: databaseUrl });

console.log(`🌱 Seeding ${databaseUrl}`);

seedDatabase(prisma)
  .then((summary) => {
    console.log(
      [
        '✅ Database seeded.',
        `   universes   ${summary.universes}`,
        `   layers      ${summary.layers}`,
        `   epochs      ${summary.epochs}`,
        `   windows     ${summary.windows}`,
        `   segments    ${summary.segments}`,
        `   keyframes   ${summary.keyframes}`,
        `   networks    ${summary.networks}`,
        `   memberships ${summary.memberships}`,
      ].join('\n'),
    );

    if (summary.unresolvedMemberships > 0) {
      console.warn(
        `⚠️  ${summary.unresolvedMemberships} network member(s) name a universe that is not ` +
          'registered, so no membership row was written.',
      );
    }
  })
  .catch((error: unknown) => {
    console.error('❌ Error seeding database:', error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
