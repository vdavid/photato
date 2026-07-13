# Photato

Photato is the website for a Hungarian 12-week online photography course. Every week, students upload one photo, and the
site lists and displays each week's submissions. It's live at [photato.eu](https://photato.eu).

The course ran on a hosted stack years ago, went dark, and now runs again on a single small server. This repo is that
revived version: one Go binary with an embedded SQLite database on the backend, and a Svelte single-page app on the
frontend.

## What's in here

This is a monorepo. Each area has its own `CLAUDE.md` with the details, and the root
[`AGENTS.md`](AGENTS.md) is the map that ties them together.

- `backend-go/`: the live backend. One Go binary, standard-library HTTP, pure-Go SQLite, no framework.
- `frontend/`: the Svelte 5 single-page app (TypeScript, vanilla CSS, Vite).
- `e2e/`: the Playwright end-to-end and pixel-baseline tests.
- `infra/`: how the site deploys and where it lives.
- `backend/`: the original Node.js backend. It's frozen as a reference for the old API contract, not deployed. Please
  don't try to run it, the cloud infra behind it is gone.
- `docs/`: the auth contract, the intentional differences from the old backend, and the revival log.

## How it fits together

- The **backend** serves the API at `api.photato.eu`. It stores everything in one SQLite file plus a photos folder on a
  mounted volume.
- The **frontend** is a static build served at the apex `photato.eu`, with client-side routing.
- **Sign-in** is passwordless. You get a magic link by email, click it, and the site hands you a session token. The full
  wire contract is in [`docs/auth-contract.md`](docs/auth-contract.md), so read that before you touch anything auth.
- **Analytics** are self-hosted and cookieless. No Google Analytics, no Facebook Pixel.

## Run it locally

You'll need Go and Node, both managed by [mise](https://mise.jdx.dev/), plus pnpm for the frontend.

Backend:

```bash
cd backend-go && mise exec -- go run ./cmd/server
```

Frontend dev server:

```bash
pnpm --filter ./frontend dev
```

The colocated `CLAUDE.md` files in `backend-go/` and `frontend/` cover the environment variables and the finer points.

## Test and check

Run the full check suite from the repo root before you call a change done, and read all of its output:

```bash
./scripts/check.sh
```

It runs the Go and frontend checks. The end-to-end tests run in Docker (the pixel baselines are Linux-only), so they
have their own command:

```bash
pnpm test:e2e:docker
```

See [`e2e/CLAUDE.md`](e2e/CLAUDE.md) for how the pixel baselines work and why they're Docker-only.

## Deploy

Deploys are automatic. Push to `main`, and if the checks pass, a webhook tells the server to pull, rebuild the backend
image, rebuild the frontend bundle, and swap in the new files. The full flow and the server runbook live in
[`infra/CLAUDE.md`](infra/CLAUDE.md).

## A note on the data

The site holds the only surviving copy of the original photos, salvaged from the old cloud storage. One folder on the
server is the pristine master copy, and it's read-only on purpose. The live photos are hard links into it, so keeping it
untouched costs nothing. [`AGENTS.md`](AGENTS.md) spells out the details, and they matter, so give them a read before
you go near the stored files.
