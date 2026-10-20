import os
import sys
import json
import argparse
from datetime import datetime, timezone

def load_env_file(filepath):
    """Fallback stdlib dotenv loader"""
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            if '=' in line:
                k, v = line.split('=', 1)
                if k not in os.environ:
                    os.environ[k] = v.strip("'\"")

def fetch_comments():
    import supabase

    load_env_file('.env.production')

    url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
    key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

    if not url or not key:
        print("Error: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set.", file=sys.stderr)
        sys.exit(1)

    client = supabase.create_client(url, key)

    response = client.table('comments').select('*').order('created_at', desc=True).limit(50).execute()
    return response.data

def process_comments(rows, since_hours):
    now = datetime.now(timezone.utc)
    items = []
    aging_count = 0

    for row in rows:
        created_at_str = row.get('created_at')
        if not created_at_str:
            continue

        try:
            created_at = datetime.fromisoformat(created_at_str)
        except ValueError:
            # Handle potential non-iso format issues simply
            continue

        diff = now - created_at
        hours_since = diff.total_seconds() / 3600.0

        # Satisfy strict prompt requirements vs actual schema fields
        reply_count = row.get('reply_count', row.get('replies', 0))
        author = row.get('author', row.get('author_name'))

        # In supabase boolean is returned as boolean or None
        is_aging = (hours_since > since_hours) and (reply_count == 0)

        if is_aging:
            aging_count += 1

        # extract excerpt (first 50 chars of content, removing simple html tags if possible, or just raw)
        content = row.get('content') or ""
        # simple tag removal
        import re
        content_no_tags = re.sub(r'<[^>]+>', '', content)
        excerpt = (content_no_tags[:47] + "...") if len(content_no_tags) > 50 else content_no_tags

        items.append({
            "id": row.get('id'),
            "author": author,
            "excerpt": excerpt,
            "created_at": created_at_str,
            "hours_since": round(hours_since, 2),
            "aging": is_aging
        })

    return {
        "fetched_at": now.isoformat(),
        "total": len(items),
        "aging_count": aging_count,
        "items": items
    }

def main():
    parser = argparse.ArgumentParser(description="Fetch and process blackboard comments")
    parser.add_argument("--since-hours", type=float, default=24.0, help="Threshold in hours for aging comments")
    args = parser.parse_args()

    rows = fetch_comments()
    result = process_comments(rows, args.since_hours)

    print(json.dumps(result, indent=2))

def test_smoke():
    import unittest.mock as mock
    import datetime as dt_module

    mock_data = [
        {
            "id": 1,
            "author_name": "Alice",
            "content": "This is a comment that needs attention.",
            "created_at": (datetime.now(timezone.utc) - dt_module.timedelta(hours=25)).isoformat(),
            "replies": 0
        },
        {
            "id": 2,
            "author_name": "Bob",
            "content": "<p>This is recently replied comment.</p>",
            "created_at": (datetime.now(timezone.utc) - dt_module.timedelta(hours=10)).isoformat(),
            "replies": 1
        }
    ]

    with mock.patch('__main__.fetch_comments', return_value=mock_data):
        rows = fetch_comments()
        result = process_comments(rows, 24.0)

        assert "fetched_at" in result
        assert result["total"] == 2
        assert result["aging_count"] == 1

        items = result["items"]
        assert len(items) == 2

        assert items[0]["id"] == 1
        assert items[0]["author"] == "Alice"
        assert items[0]["aging"] == True
        assert items[0]["hours_since"] >= 25.0
        assert "attention" in items[0]["excerpt"]

        assert items[1]["id"] == 2
        assert items[1]["author"] == "Bob"
        assert items[1]["aging"] == False
        assert items[1]["hours_since"] >= 10.0
        assert "recently replied" in items[1]["excerpt"]

    print("Smoke test passed.")

if __name__ == "__main__":
    if "--test" in sys.argv:
        import datetime as dt_module
        test_smoke()
    else:
        main()
