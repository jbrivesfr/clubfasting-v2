#!/usr/bin/env python3
import os
import sys
import json
import urllib.request
from urllib.error import URLError, HTTPError
from datetime import datetime, timedelta, timezone

def fetch_count(table, start_iso, end_iso, extra_filter=""):
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")

    if not supabase_url or not supabase_key:
        print(json.dumps({"signals": [], "trend": "unknown", "error": "Missing SUPABASE_URL or SUPABASE_SERVICE_KEY"}))
        sys.exit(2)

    url = f"{supabase_url}/rest/v1/{table}?select=id&created_at=gte.{start_iso}&created_at=lt.{end_iso}&limit=1{extra_filter}"

    try:
        req = urllib.request.Request(url, headers={
            "apikey": supabase_key,
            "Authorization": f"Bearer {supabase_key}",
            "Prefer": "count=exact"
        })
        with urllib.request.urlopen(req) as response:
            if response.status not in (200, 206):  # 206 Partial Content is valid for limit requests with count
                print(json.dumps({"signals": [], "trend": "unknown", "error": f"HTTP {response.status}"}))
                sys.exit(2)
            cr = response.headers.get("Content-Range")
            if cr:
                # Content-Range: 0-0/123 -> take the 123
                return int(cr.split("/")[-1])
            return 0
    except HTTPError as e:
        print(json.dumps({"signals": [], "trend": "unknown", "error": f"HTTPError {e.code}: {e.reason}"}))
        sys.exit(2)
    except URLError as e:
        print(json.dumps({"signals": [], "trend": "unknown", "error": str(e.reason)}))
        sys.exit(2)
    except json.JSONDecodeError as e:
        print(json.dumps({"signals": [], "trend": "unknown", "error": str(e)}))
        sys.exit(2)
    except Exception as e:
        print(json.dumps({"signals": [], "trend": "unknown", "error": str(e)}))
        sys.exit(2)

def calculate_delta(current, prior):
    if prior == 0:
        return 100.0 if current > 0 else 0.0
    return round(((current - prior) / prior) * 100, 1)

def main():
    now = datetime.now(timezone.utc)
    prior_end = now - timedelta(days=7)
    prior_start = prior_end - timedelta(days=7)

    now_iso = now.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
    prior_end_iso = prior_end.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'
    prior_start_iso = prior_start.strftime('%Y-%m-%dT%H:%M:%S.%f')[:-3] + 'Z'

    signals_def = [
        {"name": "comments", "table": "comments", "filter": ""},
        {"name": "likes", "table": "likes", "filter": ""},
        {"name": "profiles", "table": "profiles", "filter": "&role=eq.user"},
        {"name": "newsfeed_posts", "table": "newsfeed_posts", "filter": ""}
    ]

    signals_out = []
    deltas = []

    for sig in signals_def:
        current_count = fetch_count(sig["table"], prior_end_iso, now_iso, sig["filter"])
        prior_count = fetch_count(sig["table"], prior_start_iso, prior_end_iso, sig["filter"])
        delta_pct = calculate_delta(current_count, prior_count)

        signals_out.append({
            "name": sig["name"],
            "current": current_count,
            "prior": prior_count,
            "delta_pct": delta_pct
        })
        deltas.append(delta_pct)

    avg_delta = sum(deltas) / len(deltas) if deltas else 0

    if avg_delta > 5:
        trend = "up"
    elif avg_delta < -5:
        trend = "down"
    else:
        trend = "flat"

    run_at = now.isoformat().replace("+00:00", "Z")

    print(json.dumps({
        "signals": signals_out,
        "trend": trend,
        "run_at": run_at
    }))

if __name__ == "__main__":
    main()
