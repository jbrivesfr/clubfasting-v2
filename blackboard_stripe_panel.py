import os
import sys
import json
import argparse
import urllib.request
import urllib.error
from datetime import datetime

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

def parse_args():
    parser = argparse.ArgumentParser(description="Fetch Stripe charges for blackboard panel")
    parser.add_argument("--dry-run", action="store_true", help="Perform a dry run without making external API calls.")
    return parser.parse_args()

def fetch_stripe_charges(api_key):
    url = "https://api.stripe.com/v1/charges?limit=20"
    req = urllib.request.Request(url)
    req.add_header("Authorization", f"Bearer {api_key}")
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            return data.get("data", [])
    except urllib.error.URLError as e:
        print(f"Error fetching Stripe data: {e}", file=sys.stderr)
        return []

def filter_and_format_charges(charges):
    results = []
    for charge in charges:
        metadata = charge.get("metadata", {})
        product = metadata.get("product", "")
        if "fasting" in product.lower() or "club" in product.lower():
            # Stripe amounts are in cents
            amount_eur = charge.get("amount", 0) / 100.0
            currency = charge.get("currency", "").lower()

            created_epoch = charge.get("created", 0)
            date_str = datetime.utcfromtimestamp(created_epoch).isoformat() + "Z" if created_epoch else None

            customer_email = charge.get("billing_details", {}).get("email")
            if not customer_email:
                customer_email = charge.get("receipt_email")

            results.append({
                "date": date_str,
                "customer_email": customer_email,
                "product": product,
                "amount_eur": amount_eur,
                "currency": currency
            })
    return results

def main():
    args = parse_args()

    if args.dry_run:
        print(json.dumps([]))
        return

    load_env_file('.env.production')

    api_key = os.environ.get("STRIPE_SECRET_KEY")
    if not api_key:
        print("Error: STRIPE_SECRET_KEY environment variable is missing.", file=sys.stderr)
        sys.exit(1)

    charges = fetch_stripe_charges(api_key)
    results = filter_and_format_charges(charges)
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    main()
