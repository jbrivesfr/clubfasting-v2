import os
import urllib.request
import urllib.parse
import json
import datetime
import html
import re
import sys

def get_env_var(name):
    val = os.environ.get(name)
    if val:
        return val
    # Fallback to .env.production parsing
    try:
        with open('.env.production', 'r') as f:
            for line in f:
                if line.startswith(f'{name}='):
                    return line.split('=', 1)[1].strip()
                if line.startswith(f'NEXT_PUBLIC_{name}='):
                    return line.split('=', 1)[1].strip()
    except Exception:
        pass
    return None

def strip_html_tags(text):
    if not text:
        return ""
    clean = re.compile('<.*?>')
    return re.sub(clean, '', text)

def main():
    supabase_url = get_env_var('SUPABASE_URL')
    supabase_key = get_env_var('SUPABASE_ANON_KEY')

    if not supabase_url or not supabase_key:
        print("Error: SUPABASE_URL and/or SUPABASE_ANON_KEY not found.", file=sys.stderr)
        return

    now = datetime.datetime.now(datetime.timezone.utc)
    threshold = now - datetime.timedelta(hours=24)
    threshold_str = threshold.isoformat()

    # Query parameters
    params = urllib.parse.urlencode({
        'created_at': f'lt.{threshold_str}',
        'reply_to': 'is.null',
        'select': 'created_at,author_name,content'
    })

    url = f"{supabase_url}/rest/v1/comments?{params}"

    req = urllib.request.Request(url, headers={
        'apikey': supabase_key,
        'Authorization': f'Bearer {supabase_key}'
    })

    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print(f"Error fetching data: {e}", file=sys.stderr)
        return
    except Exception as e:
        print(f"Error fetching data: {e}", file=sys.stderr)
        return

    print("# Stale Comments Brief")
    print(f"Total stale comments: {len(data)}\n")

    for item in data:
        author = item.get('author_name') or 'Anonymous'
        content = item.get('content') or ''

        # Strip HTML and truncate to 80 chars
        content_text = strip_html_tags(content)
        content_text = html.unescape(content_text).strip()
        # Collapse whitespace
        content_text = re.sub(r'\s+', ' ', content_text)
        snippet = content_text[:80] + ('...' if len(content_text) > 80 else '')

        # Calculate age in hours
        created_at_str = item.get('created_at')
        if created_at_str:
            try:
                # Add +00:00 if it ends with Z
                created_at_dt = datetime.datetime.fromisoformat(created_at_str.replace('Z', '+00:00'))
                age_delta = now - created_at_dt
                age_hours = int(age_delta.total_seconds() / 3600)
            except Exception:
                age_hours = '>24'
        else:
            age_hours = 'unknown'

        print(f"- **{author}** ({age_hours}h ago): {snippet}")

if __name__ == '__main__':
    main()
