#!/bin/bash

# Usage:
# SUPABASE_SERVICE_ROLE_KEY="your-key" ./daily-moderation-check.sh
#
# Suggested Cron:
# 0 8 * * * SUPABASE_SERVICE_ROLE_KEY="your-key" /path/to/daily-moderation-check.sh >> /var/log/daily-moderation-check.log 2>&1

set -euo pipefail

if [ -z "${SUPABASE_SERVICE_ROLE_KEY:-}" ]; then
  echo "Error: SUPABASE_SERVICE_ROLE_KEY environment variable is missing." >&2
  exit 1
fi

NOW_MINUS_24H=$(date -u -d "24 hours ago" +"%Y-%m-%dT%H:%M:%S.000Z")

API_URL="https://lyyevuyejxrjpsaisaal.supabase.co/rest/v1/comments?response_sent_at=is.null&created_at=lt.${NOW_MINUS_24H}&select=id"

if ! CURL_OUTPUT=$(curl -sS -f -X GET "$API_URL" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json"); then
  echo "Error: Network error during curl." >&2
  exit 2
fi

echo "$CURL_OUTPUT" | jq -c '{count: length, ids: map(.id)}'
