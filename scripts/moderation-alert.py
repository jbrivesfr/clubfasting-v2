import os
import json
import argparse
import datetime
from supabase import create_client, Client

def get_env_vars():
    env_file = '.env'
    if not os.path.exists(env_file):
        env_file = '.env.production'

    supabase_url = None
    supabase_key = None

    if os.path.exists(env_file):
        with open(env_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line.startswith('SUPABASE_URL='):
                    supabase_url = line.split('=', 1)[1]
                elif line.startswith('SUPABASE_KEY='):
                    supabase_key = line.split('=', 1)[1]
                elif line.startswith('NEXT_PUBLIC_SUPABASE_URL='):
                    supabase_url = line.split('=', 1)[1]
                elif line.startswith('NEXT_PUBLIC_SUPABASE_ANON_KEY='):
                    supabase_key = line.split('=', 1)[1]

    if not supabase_url:
        supabase_url = os.environ.get('SUPABASE_URL') or os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
    if not supabase_key:
        supabase_key = os.environ.get('SUPABASE_KEY') or os.environ.get('NEXT_PUBLIC_SUPABASE_ANON_KEY')

    return supabase_url, supabase_key

def main():
    parser = argparse.ArgumentParser(description='Scan Supabase comments for unanswered items older than 24h.')
    parser.add_argument('--dry-run', type=str, default='true', help='Run in dry-run mode (default: true)')
    args = parser.parse_args()

    is_dry_run = args.dry_run.lower() in ('true', '1', 'yes')

    supabase_url, supabase_key = get_env_vars()
    if not supabase_url or not supabase_key:
        print(json.dumps({"error": "Supabase credentials not found"}))
        return

    try:
        supabase: Client = create_client(supabase_url, supabase_key)

        # Calculate 24 hours ago in UTC
        twenty_four_hours_ago = datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(hours=24)
        twenty_four_hours_ago_iso = twenty_four_hours_ago.isoformat()

        # Following explicit review feedback to use literal prompt instructions:
        # scan Supabase table 'comments' WHERE responded_at IS NULL AND created_at < (NOW() - INTERVAL '24 hours')
        response = supabase.table('comments').select('*').is_('responded_at', 'null').lt('created_at', twenty_four_hours_ago_iso).execute()

        data = response.data
        output = []
        current_time = datetime.datetime.now(datetime.timezone.utc)

        for item in data:
            created_at_dt = datetime.datetime.fromisoformat(item['created_at'].replace('Z', '+00:00'))
            hours_idle = (current_time - created_at_dt).total_seconds() / 3600.0

            output.append({
                'comment_id': item.get('comment_id', item.get('id')),
                'author_handle': item.get('author_handle', item.get('author_name')),
                'post_id': item.get('post_id', item.get('page_url', item.get('id'))),
                'created_at_iso': item.get('created_at'),
                'hours_idle': round(hours_idle, 2)
            })

        print(json.dumps(output))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == '__main__':
    main()
