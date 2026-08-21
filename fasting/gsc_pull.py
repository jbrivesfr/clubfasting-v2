import os
import json
import urllib.parse
from datetime import datetime, timedelta
import requests
from google.oauth2.service_account import Credentials
import google.auth.transport.requests

def main():
    creds_json_str = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS_JSON")
    if not creds_json_str:
        print("Error: GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable not set.")
        return

    try:
        creds_info = json.loads(creds_json_str)
        credentials = Credentials.from_service_account_info(
            creds_info,
            scopes=["https://www.googleapis.com/auth/webmasters.readonly"]
        )
    except Exception as e:
        print(f"Error loading credentials: {e}")
        return

    auth_req = google.auth.transport.requests.Request()
    credentials.refresh(auth_req)
    access_token = credentials.token

    site_url = "sc-domain:fasting.fr"
    encoded_site_url = urllib.parse.quote(site_url, safe="")

    # Calculate date range
    today = datetime.now()
    end_date = (today - timedelta(days=2)).strftime("%Y-%m-%d")
    start_date = (today - timedelta(days=29)).strftime("%Y-%m-%d")

    endpoint = f"https://searchconsole.googleapis.com/webmasters/v3/sites/{encoded_site_url}/searchAnalytics/query"

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    payload = {
        "startDate": start_date,
        "endDate": end_date,
        "dimensions": ["page"],
        "rowLimit": 25000
    }

    response = requests.post(endpoint, headers=headers, json=payload)
    if not response.ok:
        print(f"Error fetching data: {response.status_code} {response.text}")
        return

    data = response.json()
    rows = data.get("rows", [])

    results = []
    for row in rows:
        page = row["keys"][0]
        impressions = row.get("impressions", 0)
        ctr = row.get("ctr", 0)

        opportunity_score = impressions * (1 - ctr)

        results.append({
            "page": page,
            "impressions": impressions,
            "ctr": ctr,
            "opportunity_score": opportunity_score
        })

    # Sort by opportunity score descending
    results.sort(key=lambda x: x["opportunity_score"], reverse=True)

    # Output top 5
    top_5 = results[:5]
    print(json.dumps(top_5, indent=2))

if __name__ == "__main__":
    main()
