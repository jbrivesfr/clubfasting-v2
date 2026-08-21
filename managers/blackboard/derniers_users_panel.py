#!/usr/bin/env python3
"""
Usage:
  This script connects to Supabase as a service role to query the latest 20 users from auth.users.
  It extracts ID, email, created_at, last_sign_in_at, and the 'source' from user metadata.
  It anonymizes the email address (first 3 chars + '***') and prints the results as a JSON array.

  Environment Variables required:
    - SUPABASE_URL
    - SUPABASE_SERVICE_ROLE_KEY

  Run directly:
    $ python3 derniers_users_panel.py

  Run smoke test:
    $ python3 derniers_users_panel.py --test
"""

import os
import sys
import json
import unittest
from unittest.mock import patch, MagicMock

from supabase import create_client, ClientOptions

def fetch_latest_users():
    """Fetches and formats the latest 20 users from Supabase."""
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    if not supabase_url or not supabase_key:
        print(json.dumps({"error": "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."}))
        sys.exit(1)

    try:
        opts = ClientOptions(schema="auth")
        supabase = create_client(supabase_url, supabase_key, options=opts)

        response = supabase.table("users").select(
            "id, email, created_at, last_sign_in_at, raw_user_meta_data"
        ).order("created_at", desc=True).limit(20).execute()

        results = []
        for user in response.data:
            email = user.get("email", "")
            if email and len(email) > 3:
                email_anon = email[:3] + "***"
            elif email:
                email_anon = email + "***"
            else:
                email_anon = "***"

            metadata = user.get("raw_user_meta_data") or {}
            source = metadata.get("source")

            results.append({
                "id": user.get("id"),
                "email_anon": email_anon,
                "created_at": user.get("created_at"),
                "last_seen": user.get("last_sign_in_at"),
                "source": source
            })

        return results

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

def main():
    if len(sys.argv) > 1 and sys.argv[1] == "--test":
        sys.argv = [sys.argv[0]]
        unittest.main()
    else:
        users = fetch_latest_users()
        print(json.dumps(users, indent=2))

class TestDerniersUsersPanel(unittest.TestCase):
    @patch(f"{__name__}.create_client" if __name__ != '__main__' else "__main__.create_client")
    @patch.dict(os.environ, {"SUPABASE_URL": "http://test", "SUPABASE_SERVICE_ROLE_KEY": "test-key"})
    def test_fetch_latest_users(self, mock_create_client):
        # Mocking the Supabase response
        mock_supabase = MagicMock()
        mock_response = MagicMock()

        mock_response.data = [
            {
                "id": "user-1",
                "email": "john.doe@example.com",
                "created_at": "2023-10-01T12:00:00Z",
                "last_sign_in_at": "2023-10-02T12:00:00Z",
                "raw_user_meta_data": {"source": "facebook"}
            },
            {
                "id": "user-2",
                "email": "ab@example.com",
                "created_at": "2023-10-01T13:00:00Z",
                "last_sign_in_at": "2023-10-01T14:00:00Z",
                "raw_user_meta_data": {}
            },
            {
                "id": "user-3",
                "email": "",
                "created_at": "2023-10-01T15:00:00Z",
                "last_sign_in_at": None,
                "raw_user_meta_data": None
            }
        ]

        mock_supabase.table.return_value.select.return_value.order.return_value.limit.return_value.execute.return_value = mock_response
        mock_create_client.return_value = mock_supabase

        # Call the function
        users = fetch_latest_users()

        # Assertions
        self.assertEqual(len(users), 3)

        # User 1
        self.assertEqual(users[0]["id"], "user-1")
        self.assertEqual(users[0]["email_anon"], "joh***")
        self.assertEqual(users[0]["created_at"], "2023-10-01T12:00:00Z")
        self.assertEqual(users[0]["last_seen"], "2023-10-02T12:00:00Z")
        self.assertEqual(users[0]["source"], "facebook")

        # User 2
        self.assertEqual(users[1]["id"], "user-2")
        self.assertEqual(users[1]["email_anon"], "ab@***")
        self.assertEqual(users[1]["source"], None)

        # User 3
        self.assertEqual(users[2]["id"], "user-3")
        self.assertEqual(users[2]["email_anon"], "***")
        self.assertEqual(users[2]["source"], None)

        # Output is serializable to JSON
        json_output = json.dumps(users)
        self.assertIn("joh***", json_output)

if __name__ == "__main__":
    main()
