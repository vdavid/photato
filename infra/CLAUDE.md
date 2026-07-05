# Infra (deploy, box, Caddy, backups)

Photato runs on David's Hetzner box (ssh alias `hetzner`, user `david`, in the `docker` group). This directory holds the deploy machinery that lives *in this repo*; the box-level pieces (Caddy, backups) live in the separate **`infra` repo** (`~/projects-git/vdavid/infra`, deployed to the box at `/home/david/infra`) and are pointed to below — **not** the dead `hetzner-server` repo.

## What's here

- `docker-compose.yml`: the `photato` backend service. Image **built on the box** (multi-stage `backend-go/Dockerfile`, static CGO-free binary on distroless), runs as uid 1000 on `proxy-net`, `restart: unless-stopped`. Non-secret config inline (`PORT=9003`, `DATA_DIR=/data`, `BASE_URL`, `FRONTEND_BASE_URL`, `ADMIN_EMAILS`); `DATA_DIR` bind-mounts `/mnt/HC_Volume_105883537/photato-data`. Caddy reaches it as `photato:9003` — the port is **not** host-published.
- `deploy-webhook/`: the autodeploy hook. `hooks.json` (adnanh/webhook config, HMAC-SHA256 verify), `deploy-photato.sh` (the deploy script), and `README.md` (**the first-time box-install runbook** — secrets file, systemd unit). Read that README before installing or debugging the webhook.
- `deploy-photato-webhook.service`: the systemd unit for the webhook listener (**port 9004** — 9003 was already taken by another service; an older "use 9003" note in the history doc is stale).

## Deploy flow

Push to `main` touching `backend-go/**`, `frontend/**`, `infra/**`, or `.github/workflows/deploy.yml`:

1. GitHub Actions (`.github/workflows/deploy.yml`) runs the lean gate: Go gofmt/vet/test, then `svelte-check` + `vite build`. No browsers, no `-race`, no Docker build. On any failure the webhook never fires, so a broken commit can't deploy.
2. On success it POSTs an HMAC-signed empty payload to `https://api.photato.eu/hooks/deploy-photato` (Caddy routes `/hooks/*` to the box-local listener on port 9004).
3. The listener verifies the signature and runs `deploy-photato.sh`, which: `git reset --hard origin/main`; materializes the container secrets from `/etc/photato-deploy.env`; `docker compose build && up -d` (the old container keeps serving during the build); then builds the frontend bundle in a throwaway `node:24-alpine` and `rsync -a --delete`s `frontend/dist/` to `/mnt/HC_Volume_105883537/photato-frontend`.

**Deploy-script gotcha:** a change to `deploy-photato.sh` only takes effect on the **next** webhook trigger. The webhook runs the on-disk script, whose first step is `git reset --hard` — so the currently-running deploy uses the *previous* checkout's script. After landing a script change, fire a second (no-op) deploy to actually run the new version.

## Secrets

One root-owned 600 file on the box, `/etc/photato-deploy.env`, holds both the webhook HMAC secret (`DEPLOY_WEBHOOK_SECRET`) and the app runtime secrets (`AUTH_LINK_SECRET`, `TEST_LOGIN_SECRET`, `SMTP_*`). The webhook systemd unit loads the whole file; `deploy-photato.sh` materializes the app subset (webhook secret filtered out) into a david-owned 600 `infra/photato-secrets.env` (git-ignored) that docker compose reads via `env_file`. david is in the docker group but has no passwordless sudo, so a throwaway root container is what copies the root:600 master. Non-secret config stays inline in `docker-compose.yml`. **No secret ever lives in the repo.** Setup steps in `deploy-webhook/README.md`.

## Caddy (in the `infra` repo)

Caddy config is in `~/projects-git/vdavid/infra`, `hetzner/services/caddy/Caddyfile` (`proxy-net` docker network). Site blocks:

- `api.photato.eu`: reverse-proxies to `photato:9003`, serves `/external-articles/*` as public static from the mounted `photato-data/external-articles`, and routes `/hooks/*` to the webhook listener.
- `photato.eu` (+ `new.photato.eu` alias): `root * /srv/photato-frontend` (bind-mounted read-only from `/mnt/HC_Volume_105883537/photato-frontend`) + `try_files {path} /index.html` (SPA deep-link fallback) + `file_server`. `www` 301s to the apex.
- **Adding a new domain needs a fresh cert → restart (not reload) Caddy.**

## Backups (in the `infra` repo)

Photato rides the box's existing nightly NAS→offsite 3-2-1 flow; all machinery is in the `infra` repo `hetzner/scripts/backup-to-nas/` (nightly cron ~03:08 runs `backup.sh`). Backed up: `/mnt/HC_Volume_105883537/photato-data/` (app layout + dated DB dumps) and `/mnt/HC_Volume_105883537/photato/` (the pristine S3 salvage master — critical, since AWS is being wiped).

- **DB (WAL) is never plain-copied:** a helper dumps it via `sqlite3 'VACUUM INTO'` on a read-only handle to a self-contained snapshot, then `PRAGMA integrity_check`s it. Retention: 14 daily + 6 monthly. The live `photato.db`/`-wal`/`-shm` are excluded from the rsync — the dated dumps carry the DB.
- **Photos + salvage keep hardlinks:** both trees rsync in one `rsync -aH` so the shared bytes (photos are hardlinked into the salvage) are stored once on the NAS, not doubled.
- **Restore runbook:** `infra` repo `hetzner/docs/disaster-recovery.md` → "Restore data" → Photato.

## Box facts

- Volume `/mnt/HC_Volume_105883537` is ~9.8G and filling — watch free space before staging large data; don't stage on the root disk.
- ssh sessions can drop — use `nohup` for long-running jobs.
- david can do root-equivalent file ops via docker (e.g. an `alpine` container with a bind mount) since there's no passwordless sudo; systemctl for root-owned units needs the same kind of workaround.

## Dead infrastructure (do not try to reach)

The old MongoDB cluster is deleted (the `users` table started empty). The AWS account is being wiped (salvage is safe on box + NAS). Leaked AWS creds in `backend/config.js` **git history** are dead — do **not** scrub history to remove them; it would rewrite every commit and break blame for no security benefit.
