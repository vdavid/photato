#!/usr/bin/env bash
#
# Local pixel smoke: build the Svelte frontend, serve it with `vite preview`, and run the Playwright
# baseline suite against it — all inside the pinned Playwright Docker image so screenshots render on
# Linux and match the committed baselines. Frontend and preview both live on localhost in the one
# container (the app talks to api.photato.eu only for authed calls, which the anonymous specs don't
# make; the determinism layer blocks trackers and non-deterministic assets).
#
# Usage:
#   bash scripts/docker-local-test.sh                 # run the whole suite against the local build
#   bash scripts/docker-local-test.sh --grep front    # pass extra `playwright test` args through
#   UPDATE=1 bash scripts/docker-local-test.sh --grep upload   # (re)generate baselines
set -euo pipefail

IMAGE="mcr.microsoft.com/playwright:v1.61.1-noble"
PNPM_VERSION="11.0.9"
PORT=18730

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

PLAYWRIGHT_ARGS=("$@")
[ "${UPDATE:-}" = "1" ] && PLAYWRIGHT_ARGS+=(--update-snapshots)

INNER='set -e'
INNER+=" && corepack enable && corepack prepare pnpm@${PNPM_VERSION} --activate"
INNER+=' && pnpm --filter ./frontend install --frozen-lockfile --store-dir /pnpm-store --config.confirmModulesPurge=false'
INNER+=' && pnpm --filter e2e install --frozen-lockfile --store-dir /pnpm-store --config.confirmModulesPurge=false'
INNER+=' && pnpm --filter ./frontend build'
INNER+=" && (pnpm --filter ./frontend exec vite preview --port ${PORT} --host 127.0.0.1 --strictPort &)"
INNER+=" && for i in \$(seq 1 60); do curl -sf http://127.0.0.1:${PORT}/ >/dev/null && break || sleep 1; done"
INNER+=" && BASE_URL=http://127.0.0.1:${PORT} pnpm --filter e2e exec playwright test \"\$@\""

exec docker run --rm --init --ipc=host \
  -v "${REPO_ROOT}:/work" \
  -v photato-e2e-pnpm-store:/pnpm-store \
  -w /work \
  -e CI="${CI:-}" \
  "${IMAGE}" \
  bash -lc "${INNER}" _ "${PLAYWRIGHT_ARGS[@]}"
