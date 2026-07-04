#!/usr/bin/env bash
#
# Runs the Playwright baseline suite inside the official Playwright Docker image so pixel screenshots
# render on Linux, reproducibly, regardless of the host OS. Baselines committed to the repo are Linux
# baselines; generating or comparing them anywhere else will not match.
#
# Usage:
#   pnpm test:e2e:docker                      # run the suite, compare against committed baselines
#   pnpm test:e2e:docker:update               # (re)generate baselines
#   bash scripts/docker-test.sh --grep front  # pass any extra `playwright test` args through
#
# The image tag is pinned to the @playwright/test version in package.json; keep them in lockstep so the
# browser build (and therefore rendering) matches the runtime.
set -euo pipefail

IMAGE="mcr.microsoft.com/playwright:v1.61.1-noble"
PNPM_VERSION="11.0.9"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

# Single-quoted so the inner shell's "$@" stays literal here and is filled from the args we append
# after `_` below. Only PNPM_VERSION is interpolated at build time.
INNER='corepack enable'
INNER+=" && corepack prepare pnpm@${PNPM_VERSION} --activate"
INNER+=' && pnpm --filter e2e install --frozen-lockfile --store-dir /pnpm-store --config.confirmModulesPurge=false'
INNER+=' && pnpm --filter e2e exec playwright test "$@"'

exec docker run --rm --init --ipc=host \
  -v "${REPO_ROOT}:/work" \
  -v photato-e2e-pnpm-store:/pnpm-store \
  -w /work \
  -e CI="${CI:-}" \
  "${IMAGE}" \
  bash -lc "${INNER}" _ "$@"
