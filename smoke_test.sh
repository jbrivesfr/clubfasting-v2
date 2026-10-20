#!/bin/bash
set -e

echo "Testing --help output:"
python3 blackboard_stripe_panel.py --help

echo ""
echo "Testing --dry-run output with mock key:"
STRIPE_SECRET_KEY="sk_test_dummy" python3 blackboard_stripe_panel.py --dry-run
