#!/usr/bin/env python3
"""
GSC Pulse - Google Search Console Data Exporter

Fetches the last 28 days of search analytics data for fasting.fr (offset by 2 days)
and writes it to state/gsc-pulse-latest.csv.

Required Environment Variables:
  GOOGLE_APPLICATION_CREDENTIALS: Path to or stringified JSON of the service account credentials

Required Dependencies:
  pip install google-auth google-api-python-client
"""

import os
import csv
import json
import tempfile
from datetime import datetime, timedelta
from google.oauth2 import service_account
from googleapiclient.discovery import build

SITE_URL = 'sc-domain:fasting.fr'
OUTPUT_FILE = 'state/gsc-pulse-latest.csv'
ROW_LIMIT = 5000

def get_credentials():
    creds_env = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
    if not creds_env:
        raise ValueError("GOOGLE_APPLICATION_CREDENTIALS environment variable is required")

    # If it's a valid JSON string, write it to a temp file
    if creds_env.strip().startswith('{'):
        creds_info = json.loads(creds_env)
        return service_account.Credentials.from_service_account_info(
            creds_info,
            scopes=['https://www.googleapis.com/auth/webmasters.readonly']
        )

    # Otherwise treat it as a path
    return service_account.Credentials.from_service_account_file(
        creds_env,
        scopes=['https://www.googleapis.com/auth/webmasters.readonly']
    )

def main():
    print(f"Authenticating to Google Search Console...")
    try:
        credentials = get_credentials()
        service = build('searchconsole', 'v1', credentials=credentials)
    except Exception as e:
        print(f"Error authenticating: {e}")
        return

    # Offset by 2 days per standard GSC lag, fetch 28 days of data (inclusive)
    end_date = datetime.now() - timedelta(days=2)
    start_date = end_date - timedelta(days=27)

    start_date_str = start_date.strftime('%Y-%m-%d')
    end_date_str = end_date.strftime('%Y-%m-%d')

    print(f"Fetching data for {SITE_URL} from {start_date_str} to {end_date_str}...")

    request_body = {
        'startDate': start_date_str,
        'endDate': end_date_str,
        'dimensions': ['page', 'query'],
        'rowLimit': ROW_LIMIT
    }

    try:
        response = service.searchanalytics().query(siteUrl=SITE_URL, body=request_body).execute()
    except Exception as e:
        print(f"Error querying Search Console API: {e}")
        return

    rows = response.get('rows', [])
    print(f"Received {len(rows)} rows of data.")

    # Sort by impressions descending
    rows.sort(key=lambda x: x.get('impressions', 0), reverse=True)

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

    print(f"Writing to {OUTPUT_FILE}...")
    with open(OUTPUT_FILE, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['page', 'query', 'impressions', 'clicks', 'ctr', 'position'])

        for row in rows:
            keys = row.get('keys', [])
            page = keys[0] if len(keys) > 0 else ''
            query = keys[1] if len(keys) > 1 else ''
            impressions = row.get('impressions', 0)
            clicks = row.get('clicks', 0)
            ctr = row.get('ctr', 0)
            position = row.get('position', 0)

            writer.writerow([page, query, impressions, clicks, ctr, position])

    print("Done.")

if __name__ == '__main__':
    main()
