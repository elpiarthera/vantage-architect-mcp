#!/usr/bin/env bash
# CI gate : EN/FR i18n key parity (Section 6 of the spec).
# Fails if the two locale files drift.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
EN="$ROOT/src/ui/i18n/en.json"
FR="$ROOT/src/ui/i18n/fr.json"

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required for i18n parity check" >&2
  exit 2
fi

EN_KEYS=$(jq -r 'keys | sort | .[]' "$EN")
FR_KEYS=$(jq -r 'keys | sort | .[]' "$FR")

if [ "$EN_KEYS" != "$FR_KEYS" ]; then
  echo "i18n key drift detected" >&2
  diff <(echo "$EN_KEYS") <(echo "$FR_KEYS") || true
  exit 1
fi

echo "i18n parity OK ($(echo "$EN_KEYS" | wc -l | tr -d ' ') keys)"
