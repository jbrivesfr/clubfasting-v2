#!/bin/bash
cd "$(dirname "$0")/.."
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S")
bash tools/healthcheck.sh | while read line; do
  echo "[$TIMESTAMP] $line"
done
