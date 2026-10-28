/**
 * docs-site.test.js — the committed documentation artefact must work.
 *
 * `docs/site/` is built in the sibling `personal/docs` project and committed
 * here, where GitHub Pages serves it. Nothing else in this repo reads it, so
 * without this test a broken build (placeholders instead of a stylesheet URL, a
 * nav entry for a section that was never generated, a doubled subpath) reaches
 * the live site on the next push. See james-gibson/local-time#226.
 *
 * Run: node --test scripts/__tests__/
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { checkDocsSite } from '../check-docs-site.mjs';

const SITE = 'https://james-gibson.github.io/local-time/docs/site/';

/** A throwaway artefact; `pages` maps a relative path to its HTML. */
function artefact(pages) {
  const root = mkdtempSync(join(tmpdir(), 'docs-site-'));
  for (const [rel, html] of Object.entries(pages)) {
    const full = join(root, rel);
    mkdirSync(join(full, '..'), { recursive: true });
    writeFileSync(full, html);
  }
  return root;
}

const page = (body = '') => `<!doctype html><html><head><title>fixture</title></head><body>${body}</body></html>`;

test('the committed artefact has no placeholders, localhost, or dead internal links', () => {
  const { pages, problems } = checkDocsSite();
  assert.ok(pages > 0, 'expected a built site in docs/site');
  assert.deepEqual(problems, []);
});

test('an unprocessed PostCSS placeholder is a failure', () => {
  const root = artefact({
    'index.html': '<link rel=stylesheet href="__h_pp_l1_1_RelPermalink__e=">',
  });
  const { problems } = checkDocsSite({ root, siteUrl: SITE });
  assert.match(problems.join('\n'), /unprocessed Hugo placeholders/);
});

test('a nav link to a section that was never generated is a failure', () => {
  const root = artefact({
    'index.html': page('<a href="/local-time/docs/site/docs/lore/">Lore</a>'),
  });
  const { problems } = checkDocsSite({ root, siteUrl: SITE });
  assert.match(problems.join('\n'), /docs\/lore\/ resolves to nothing/);
});

test('a baseURL applied twice is a failure, not a valid path', () => {
  const root = artefact({
    'index.html': page('<link rel=apple-touch-icon href="/local-time/docs/site/local-time/docs/site/apple-touch-icon.png">'),
  });
  const { problems } = checkDocsSite({ root, siteUrl: SITE });
  assert.match(problems.join('\n'), /resolves to nothing|outside/);
});

test('a resolved subpath, relative link, and external link all pass', () => {
  const root = artefact({
    'index.html': page(`
      <a href="/local-time/docs/site/docs/guides/">Guides</a>
      <a href="docs/guides/">Guides (relative)</a>
      <a href="https://github.com/james-gibson/local-time">Repository</a>
      <img src="${SITE}cover.png">`),
    'docs/index.html': page('<a href="guides/">Guides</a>'),
    'docs/guides/index.html': page('<a href="../">up</a>'),
    'cover.png': 'png',
  });
  const { problems } = checkDocsSite({ root, siteUrl: SITE });
  assert.deepEqual(problems, []);
});
