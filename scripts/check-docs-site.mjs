#!/usr/bin/env node
/**
 * check-docs-site.mjs — validate the published documentation artefact.
 *
 * `docs/site/` is a committed Hugo build that GitHub Pages serves from
 * `/local-time/docs/site/` (legacy Pages: branch `main`, path `/`). The build
 * happens in the sibling `personal/docs` project, so nothing in this repository
 * observes it: an artefact can be committed stale, half-written, or with links
 * to pages that were never generated. This checks the tree that is actually
 * committed, which is the only copy this repository controls.
 *
 * Three failure modes have already shipped here or sat one `git commit` away:
 *
 *   - a `hugo` run whose PostCSS step panicked still writes HTML, with
 *     `__h_pp_…` placeholders where the stylesheet URL belongs;
 *   - the main menu links `/docs/lore/` while the section had no `_index.md`;
 *   - asset URLs built from a subpath `baseurl` can carry that subpath twice.
 *
 * Run directly (`npm run check:docs`) or via the tests (`npm run test:scripts`).
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

/** Where the artefact lives in the repo. */
export const DOCS_ROOT = resolve(HERE, '..', 'docs', 'site');

/** The URL the artefact is published at — `config/production/hugo.toml` baseurl. */
export const DOCS_SITE_URL = 'https://james-gibson.github.io/local-time/docs/site/';

const isFile = (p) => {
  try { return statSync(p).isFile(); } catch { return false; }
};

/** A linked path resolves if the file exists, or the directory has an index. */
const resolves = (p) => isFile(p) || isFile(join(p, 'index.html'));

/**
 * @param {{root?: string, siteUrl?: string}} options
 * @returns {{pages: number, problems: string[]}}
 */
export function checkDocsSite({ root = DOCS_ROOT, siteUrl = DOCS_SITE_URL } = {}) {
  const problems = [];
  if (!existsSync(root)) return { pages: 0, problems: [`no artefact at ${root}`] };
  if (!isFile(join(root, 'index.html'))) problems.push(`no index.html at ${root}`);

  const base = siteUrl.replace(/\/?$/, '/');
  const basePath = new URL(base).pathname;

  const pages = [];
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.html')) pages.push(full);
    }
  };
  walk(root);

  const reported = new Set();
  const report = (message) => {
    if (reported.has(message)) return;
    reported.add(message);
    problems.push(message);
  };

  for (const page of pages) {
    const rel = relative(root, page);
    const html = readFileSync(page, 'utf-8');

    if (html.includes('__h_pp_')) {
      report(`${rel}: unprocessed Hugo placeholders — the PostCSS step failed, so no stylesheet loads`);
    }
    if (/https?:\/\/localhost[:/]/.test(html)) {
      report(`${rel}: links http://localhost`);
    }

    for (const match of html.matchAll(/(?:href|src)=(["']?)([^"' >]+)\1/g)) {
      const raw = match[2];
      if (!raw || raw.startsWith('#') || /^(?:mailto|tel|data|javascript):/i.test(raw)) continue;

      const absolute = /^https?:/i.test(raw) || raw.startsWith('//');
      if (absolute && !raw.startsWith(base)) continue; // an external link
      if (!absolute && !raw.startsWith('/') && /^[a-z][a-z0-9+.-]*:/i.test(raw)) continue;

      let pathname;
      if (raw.startsWith(base)) {
        pathname = raw.slice(base.length);
      } else if (raw.startsWith('/')) {
        // A subpath-absolute link must sit under the deployment URL. Anything
        // else escapes the site — including a baseURL applied twice.
        if (!raw.startsWith(basePath)) {
          report(`${rel}: ${raw} is outside ${basePath}`);
          continue;
        }
        pathname = raw.slice(basePath.length);
      } else {
        pathname = relative(root, resolve(dirname(page), raw));
      }

      pathname = decodeURIComponent(pathname.split('#')[0].split('?')[0]);
      if (!pathname) pathname = '.';
      if (!resolves(resolve(root, pathname))) report(`${rel}: ${raw} resolves to nothing`);
    }
  }

  return { pages: pages.length, problems };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { pages, problems } = checkDocsSite();
  if (problems.length) {
    console.error(`check-docs-site: REFUSING — the committed artefact does not work (${pages} page(s)):`);
    for (const p of problems.slice(0, 40)) console.error(`  ${p}`);
    process.exit(1);
  }
  console.log(`check-docs-site: ok — ${pages} page(s), no placeholders, no localhost, every internal link resolves`);
}
