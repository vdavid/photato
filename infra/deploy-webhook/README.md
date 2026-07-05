# Photato deploy webhook

Auto-deploy for the Photato backend, mirroring the other sites on David's Hetzner
box (cmdr, prvw, agu, lang). On push to `main` touching `backend-go/**` or
`infra/**`, GitHub Actions runs the Go checks, then POSTs an HMAC-signed webhook
to the box, which **builds the image on the box** and rolls the container.

- `hooks.json`: adnanh/webhook config. The `deploy-photato` hook verifies the
  HMAC-SHA256 signature (`X-Hub-Signature-256`) against `DEPLOY_WEBHOOK_SECRET`,
  then runs `deploy-photato.sh`.
- `deploy-photato.sh`: `git reset --hard origin/main`, `docker compose build`,
  `docker compose up -d`, prune. Runs as `david`; output goes to the webhook
  service journal.
- `../deploy-photato-webhook.service`: the systemd unit (listens on port 9004).

## First-time install on the box

The repo is cloned at `/home/david/photato` (public repo, https clone — no deploy
key needed). Then:

```sh
# 1. Install the box secrets (root-owned 600, not committed) in /etc/photato-deploy.env.
#    This one file holds BOTH the webhook HMAC secret AND the app's runtime secrets:
#      DEPLOY_WEBHOOK_SECRET  — same value as the GitHub Actions repo secret (webhook only)
#      AUTH_LINK_SECRET       — HMAC key for magic-link tokens
#      TEST_LOGIN_SECRET      — enables the /auth/test-login e2e backdoor
#      SMTP_HOST/PORT/USERNAME/PASSWORD/FROM_ADDRESS/FROM_NAME — SMTP2GO submission
#    The webhook systemd unit loads the whole file (EnvironmentFile); deploy-photato.sh
#    materializes the app subset into infra/photato-secrets.env for docker compose.
sudo tee /etc/photato-deploy.env >/dev/null <<'EOF'
DEPLOY_WEBHOOK_SECRET=THE-WEBHOOK-SECRET
AUTH_LINK_SECRET=64-hex-chars
TEST_LOGIN_SECRET=64-hex-chars
SMTP_HOST=mail.smtp2go.com
SMTP_PORT=2525
SMTP_USERNAME=veszelovszki.com
SMTP_PASSWORD=the-smtp2go-password
SMTP_FROM_ADDRESS=photato@veszelovszki.com
SMTP_FROM_NAME=Photato
EOF
sudo chmod 600 /etc/photato-deploy.env

# 2. Install + start the webhook listener.
cp infra/deploy-photato-webhook.service /tmp/deploy-photato-webhook.service
sudo mv /tmp/deploy-photato-webhook.service /etc/systemd/system/deploy-photato-webhook.service
sudo systemctl daemon-reload
sudo systemctl enable --now deploy-photato-webhook.service
```

Caddy routes `https://api.photato.eu/hooks/*` to `host.docker.internal:9004`
(outside any auth), so GitHub can reach the listener. The GitHub side needs the
`DEPLOY_WEBHOOK_SECRET` repo secret (`gh secret set DEPLOY_WEBHOOK_SECRET`).
