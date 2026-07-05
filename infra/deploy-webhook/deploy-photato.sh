#!/bin/bash
set -euo pipefail

# Photato deploy: triggered by GitHub Actions via a signed webhook after CI
# (Go checks + frontend build) passes. The server BUILDS everything here — CI
# stays lean and pushes no artifacts. The SQLite DB, photos, and external-articles
# live on the mounted volume (/mnt/HC_Volume_105883537/photato-data); the built
# frontend is synced to /mnt/HC_Volume_105883537/photato-frontend, which Caddy
# serves at new.photato.eu. Both persist across deploys.
#
# Output goes to the webhook service journal (journalctl -u deploy-photato-webhook).
# Don't add a custom /var/log file: the webhook runs unprivileged and a failed
# mkdir under `set -e` would abort the whole deploy.

# Pinned to keep box builds reproducible; bump together with the repo's toolchain.
NODE_IMAGE="node:24-alpine"
PNPM_VERSION="11.0.9"
FRONTEND_SERVE_DIR="/mnt/HC_Volume_105883537/photato-frontend"

echo ""
echo "=== photato deploy $(date --iso-8601=seconds) ==="

cd /home/david/photato

echo "Refreshing the repo..."
git fetch origin main
git reset --hard origin/main

cd infra

echo "Building the backend image (the old container keeps serving during the build)..."
docker compose build

echo "Rolling the backend container..."
docker compose up -d

echo "Pruning dangling images..."
docker image prune -f || true

echo "Status:"
docker compose ps

# --- Frontend: build the Vite bundle in a throwaway Node container, then sync it ---
# node_modules and dist land under frontend/ owned by root; both are gitignored, so
# the next `git reset --hard` leaves them untouched. The pnpm store is a named volume
# so installs are incremental. --frozen-lockfile means the 3-day age gate never blocks.
echo "Building the frontend bundle..."
cd /home/david/photato
docker run --rm \
  -v /home/david/photato:/work \
  -v photato-fe-pnpm-store:/pnpm-store \
  -w /work \
  "${NODE_IMAGE}" sh -c "
    corepack enable &&
    corepack prepare pnpm@${PNPM_VERSION} --activate &&
    pnpm install --filter ./frontend --frozen-lockfile --store-dir /pnpm-store --config.confirmModulesPurge=false &&
    pnpm --filter ./frontend build
  "

echo "Syncing the built frontend to the Caddy-served dir (${FRONTEND_SERVE_DIR})..."
mkdir -p "${FRONTEND_SERVE_DIR}"
rsync -a --delete /home/david/photato/frontend/dist/ "${FRONTEND_SERVE_DIR}/"

echo "=== photato deploy done ==="
