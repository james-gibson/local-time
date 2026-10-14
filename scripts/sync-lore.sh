#!/usr/bin/env bash
#
# sync-lore.sh — End-to-end pipeline: KB markdown -> lore JSON -> local-time TS.
#
# Usage:
#   ./scripts/sync-lore.sh [KB-root] [output-dir]
#
# Defaults:
#   KB-root        : ../../kb   (relative to this repo; the vault root, whose
#                  `lore/` dir holds the lore docs — walked recursively)
#   output-dir     : ./src/config/universes/imported
#
# Env:
#   NODE_BIN        : node binary to use (default: `node` on PATH)
#   SKIP_QDRANT     : set to 1 to skip step 3 (Qdrant sync)
#   QDRANT_URL      : Qdrant credentials for step 3 (optional; falls back to the
#   QDRANT_API_KEY  : OpenCode config at ~/.config/opencode/opencode.json)
#
# Steps:
#   1. build-lore-json.js  reads  <root>/lore/**/*.md   writes the .json beside each
#   2. import-lore-json.js reads  <root>/lore/**/*.json writes <out>/*.ts + index.ts
#   3. qdrant-sync.sh      reads  the KB vault           writes the Qdrant `kb` collection

set -euo pipefail

CONTENT_ROOT="${1:-../../kb}"
OUTPUT_DIR="${2:-./src/config/universes/imported}"
NODE_BIN="${NODE_BIN:-node}"
# The lore doc tree — markdown and (generated) JSON both live under here.
LORE_DIR="$CONTENT_ROOT/lore"

echo "=== 1/3  KB markdown -> JSON  ($LORE_DIR) ==="
"$NODE_BIN" scripts/build-lore-json.js "$CONTENT_ROOT"

echo
echo "=== 2/3  JSON -> local-time TypeScript  ($OUTPUT_DIR) ==="
"$NODE_BIN" scripts/import-lore-json.js "$LORE_DIR" "$OUTPUT_DIR"

echo
KB_ROOT="$(cd "$CONTENT_ROOT" && pwd)"
QDRANT_SYNC="$KB_ROOT/scripts/qdrant/qdrant-sync.sh"
echo "=== 3/3  KB -> Qdrant  ($QDRANT_SYNC) ==="
if [[ "${SKIP_QDRANT:-0}" == "1" ]]; then
  echo "SKIP_QDRANT=1 — skipping Qdrant sync."
elif [[ ! -x "$QDRANT_SYNC" ]]; then
  echo "! not found or not executable: $QDRANT_SYNC — skipping Qdrant sync." >&2
elif "$QDRANT_SYNC"; then
  : # synced
else
  rc=$?
  if [[ $rc -eq 78 ]]; then
    echo "! no Qdrant credentials — skipping Qdrant sync." >&2
  else
    echo "! Qdrant sync failed (exit $rc)." >&2
    exit "$rc"
  fi
fi

echo
echo "=== done ==="
