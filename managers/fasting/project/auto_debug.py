import sys
import json
import time
import urllib.request
import urllib.error
import unittest
from unittest.mock import patch, MagicMock

URLS = [
    "https://clubfasting.com/",
    "https://clubfasting.com/login",
    "https://clubfasting.com/communaute",
    "https://fasting.fr/"
]

TIMEOUT = 10

def check_url(url):
    start_time = time.time()
    try:
        # User-Agent is often required to avoid 403s on standard hosting
        req = urllib.request.Request(url, headers={'User-Agent': 'FastingManager-AutoDebug/1.0'})
        with urllib.request.urlopen(req, timeout=TIMEOUT) as response:
            status_code = response.getcode()
            latency_ms = int((time.time() - start_time) * 1000)
            return {
                "url": url,
                "status_code": status_code,
                "latency_ms": latency_ms,
                "ok": 200 <= status_code < 400
            }
    except urllib.error.HTTPError as e:
        latency_ms = int((time.time() - start_time) * 1000)
        return {
            "url": url,
            "status_code": e.code,
            "latency_ms": latency_ms,
            "ok": False
        }
    except urllib.error.URLError as e:
        latency_ms = int((time.time() - start_time) * 1000)
        return {
            "url": url,
            "status_code": None,
            "latency_ms": latency_ms,
            "ok": False
        }
    except Exception as e:
        latency_ms = int((time.time() - start_time) * 1000)
        return {
            "url": url,
            "status_code": None,
            "latency_ms": latency_ms,
            "ok": False
        }

def run_checks():
    results = []
    all_ok = True
    for url in URLS:
        res = check_url(url)
        results.append(res)
        if not res["ok"]:
            all_ok = False

    print(json.dumps(results, indent=2))
    return 0 if all_ok else 1


class TestAutoDebug(unittest.TestCase):
    @patch('urllib.request.urlopen')
    def test_check_url_success(self, mock_urlopen):
        # Mock a successful response
        mock_response = MagicMock()
        mock_response.getcode.return_value = 200
        mock_response.__enter__.return_value = mock_response
        mock_urlopen.return_value = mock_response

        res = check_url("https://example.com")
        self.assertEqual(res["url"], "https://example.com")
        self.assertEqual(res["status_code"], 200)
        self.assertTrue(res["ok"])
        self.assertIn("latency_ms", res)

    @patch('urllib.request.urlopen')
    def test_check_url_http_error(self, mock_urlopen):
        # Mock an HTTP error response
        mock_urlopen.side_effect = urllib.error.HTTPError("https://example.com", 500, "Internal Server Error", {}, None)

        res = check_url("https://example.com")
        self.assertEqual(res["url"], "https://example.com")
        self.assertEqual(res["status_code"], 500)
        self.assertFalse(res["ok"])

    @patch('urllib.request.urlopen')
    def test_check_url_timeout(self, mock_urlopen):
        # Mock a timeout/URLError
        mock_urlopen.side_effect = urllib.error.URLError("Timeout")

        res = check_url("https://example.com")
        self.assertEqual(res["url"], "https://example.com")
        self.assertIsNone(res["status_code"])
        self.assertFalse(res["ok"])

    @patch('__main__.check_url')
    def test_run_checks_all_ok(self, mock_check_url):
        mock_check_url.return_value = {"url": "https://test.com", "status_code": 200, "latency_ms": 50, "ok": True}
        exit_code = run_checks()
        self.assertEqual(exit_code, 0)

    @patch('__main__.check_url')
    def test_run_checks_failure(self, mock_check_url):
        mock_check_url.side_effect = [
            {"url": "https://test1.com", "status_code": 200, "latency_ms": 50, "ok": True},
            {"url": "https://test2.com", "status_code": 500, "latency_ms": 50, "ok": False},
            {"url": "https://test3.com", "status_code": 200, "latency_ms": 50, "ok": True},
            {"url": "https://test4.com", "status_code": 200, "latency_ms": 50, "ok": True},
        ]
        exit_code = run_checks()
        self.assertEqual(exit_code, 1)

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--test":
        # Run tests
        sys.argv.pop(1)
        unittest.main()
    else:
        sys.exit(run_checks())
