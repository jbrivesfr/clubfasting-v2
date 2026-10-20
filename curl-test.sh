# Documentation of the requested tests to include in PR description
echo "- (a) comment created 25h ago without reply = INCLUDED (overdue_only=true sets .lt('created_at', 24h))"
echo "- (b) comment created 23h ago without reply = EXCLUDED (overdue_only=true filters out < 24h)"
echo "- (c) comment created 25h ago with reply = EXCLUDED (existing logic already filters out comments with replied child)"
