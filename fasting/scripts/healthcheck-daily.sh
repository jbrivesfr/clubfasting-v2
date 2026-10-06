#!/bin/bash
set -euo pipefail

URLS=(
  'https://clubfasting.com'
  'https://fasting.fr'
  'https://app.clubfasting.com/login'
  'https://app.clubfasting.com/register'
  'https://app.clubfasting.com/newsfeed'
)

ts=$(date -Iseconds)
results="[]"
all_ok=true
error_summary=""

for url in "${URLS[@]}"; do
  # Capture HTTP code. Suppress curl errors but output code.
  # If it completely fails, code may be empty, so handle that.
  code=$(curl -fsSL -o /dev/null -w '%{http_code}' --max-time 10 "$url" 2>/dev/null || true)
  if [[ -z "$code" ]]; then
    code="000"
  fi

  if [[ "$code" != "200" ]]; then
    all_ok=false
    error_summary+="${url} returned ${code}\n"
  fi

  results=$(echo "$results" | jq -c --arg url "$url" --arg code "$code" '. += [{url: $url, code: ($code|tonumber)}]')
done

final_json=$(jq -n -c --arg ts "$ts" --argjson results "$results" --argjson ok "$all_ok" \
  '{ts: $ts, results: $results, ok: $ok}')

mkdir -p state
echo "$final_json" >> state/healthcheck-log.jsonl

if [[ "$all_ok" != "true" ]]; then
  echo -e "Healthcheck failed:\n$error_summary" >&2
  exit 1
fi

exit 0
