#!/usr/bin/env bash
#
# sync-lore.sh — End-to-end pipeline: KB markdown -> lore JSON -> local-time TS.
#
# Usage:
#   ./scripts/sync-lore.sh [KB-content-root] [output-dir]
#
# Defaults:
#   KB-content-root : ../../kb/lore   (relative to this repo; the OpenKnowledge project root)
#   output-dir      : ./src/config/universes/imported
#
# Env:
#   NODE_BIN        : node binary to use (default: `node` on PATH)
#
# Steps:
#   1. build-lore-json.js  reads  <root>/lore/*.md   writes <root>/lore/*.json
#   2. import-lore-json.js reads  <root>/lore/*.json writes <out>/*.ts + index.ts

set -euo pipefail

CONTENT_ROOT="${1:-../../kb/lore}"
OUTPUT_DIR="${2:-./src/config/universes/imported}"
NODE_BIN="${NODE_BIN:-node}"
LORE_DIR="$CONTENT_ROOT/lore"

echo "=== 1/2  KB markdown -> JSON  ($LORE_DIR) ==="
"$NODE_BIN" scripts/build-lore-json.js "$CONTENT_ROOT"

echo
echo "=== 2/2  JSON -> local-time TypeScript  ($OUTPUT_DIR) ==="
"$NODE_BIN" scripts/import-lore-json.js "$LORE_DIR" "$OUTPUT_DIR"

echo
echo "=== done ==="
