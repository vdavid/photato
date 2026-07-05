#!/bin/bash
set -euo pipefail

# Photato backend deploy: triggered by GitHub Actions via a signed webhook after
# CI (gofmt + go vet + go test) passes. The server BUILDS the image here — CI
# stays lean and pushes no registry image. The SQLite DB, photos, and
# external-articles live on the mounted volume (/mnt/HC_Volume_105883537/
# photato-data), so they persist across deploys.
#
# Output goes to the webhook service journal (journalctl -u deploy-photato-webhook).
# Don't add a custom /var/log file: the webhook runs unprivileged and a failed
# mkdir under `set -e` would abort the whole deploy.

echo ""
echo "=== photato deploy $(date --iso-8601=seconds) ==="

cd /home/david/photato

echo "Refreshing the repo..."
git fetch origin main
git reset --hard origin/main

cd infra

echo "Building the image (the old container keeps serving during the build)..."
docker compose build

echo "Rolling the container..."
docker compose up -d

echo "Pruning dangling images..."
docker image prune -f || true

echo "Status:"
docker compose ps
echo "=== photato deploy done ==="
