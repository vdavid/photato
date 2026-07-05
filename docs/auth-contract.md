# Auth contract (magic-link login)

Photato's backend authenticates with self-hosted, passwordless **email magic
links** — no Auth0, no passwords. This doc is the wire contract the frontend
(the Svelte rewrite) builds against. Backend implementation lives in
`backend-go/internal/{auth,magiclink,email}` and `backend-go/internal/httpapi`.

Base URL: `https://api.photato.eu`. All requests/responses are JSON unless noted.
Every response carries permissive CORS headers (`Access-Control-Allow-Origin: *`).

## Flow overview

1. User types their email on the login page → `POST /auth/request-link`.
2. Backend mails a link: `https://photato.eu/login/verify?token=<token>`.
3. User clicks it → the frontend `/login/verify` route reads `token` from the
   query string and calls `POST /auth/verify {token}`.
4. Backend returns `{sessionToken, user}`. The frontend stores `sessionToken`
   and sends it as `Authorization: Bearer <sessionToken>` on every later request.
5. `GET /auth/me` re-hydrates the user on app load; `POST /auth/logout` ends the
   session.

Session tokens are opaque 256-bit random strings, valid for **3 days**. Magic-link
tokens are single-use and valid for **15 minutes**.

## Endpoints

### POST /auth/request-link

Request a login link. **Always returns 200**, whether the email is known,
unknown, or malformed (no account enumeration). Rate-limited server-side; a
throttled request also returns 200 but silently sends nothing.

- Request: `{"email": "person@example.com"}`
- Response: `200 {"ok": true}`

The account is created (or reused) at verify time, so requesting a link never
reveals whether an account exists.

### POST /auth/verify

Exchange a magic-link token for a session. Single-use: a token works once.

- Request: `{"token": "<token from the email link>"}`
- Success: `200`
  ```json
  {
    "sessionToken": "<opaque 256-bit hex>",
    "user": { "emailAddress": "person@example.com", "isAdmin": false }
  }
  ```
- Failure: `401 invalid or expired link` — for a tampered, malformed, expired, or
  already-used token (all indistinguishable, by design). `500` on a server error.

### GET /auth/me

Return the current user. Requires `Authorization: Bearer <sessionToken>`.

- Success: `200 {"emailAddress": "person@example.com", "isAdmin": false}`
- Failure: `401` when the token is missing, unknown, or expired.

### POST /auth/logout

Burn the current session. Requires the Bearer token. Always `200 {"ok": true}`
(logging out an unknown/expired token is a no-op).

### POST /auth/test-login  (e2e backdoor — not for the real UI)

Mint a session without the email round-trip, for automated tests only. Disabled
(`404`) unless the backend has `TEST_LOGIN_SECRET` set. See "e2e backdoor" below.

- Request: `{"email": "person@example.com", "secret": "<TEST_LOGIN_SECRET>"}`
- Success: `200` — same `{sessionToken, user}` shape as `/auth/verify`.
- Failure: `404` (backdoor off), `403` (wrong secret), `400` (bad email/body).

## Authorizing the rest of the API

Every existing data endpoint authorizes with `Authorization: Bearer
<sessionToken>` (the token from verify/test-login). Behavior is unchanged from
before, only the token's origin differs (was an Auth0 access token, now our
opaque session token):

- `GET /version` — valid session required (401 without). Not admin-gated.
- `GET /messages/get-all-messages` — admin only (403 for a non-admin).
- `GET /photos/list-for-week?...` — admin only.
- `GET /photos/{key...}` — admin only.
- `GET /get-signed-url?...` — valid session; the `emailAddress` param must equal
  the session user's email (403 on mismatch).
- `PUT /upload/{key...}` — no Bearer; the signed URL is the authorization.

Admin status comes from the backend's `ADMIN_EMAILS` allowlist, authoritative at
auth time. The frontend should treat `isAdmin` as read-only truth from the API.

## Frontend `/login/verify` route (what the Svelte app must build)

1. On load, read `token` from `location.search`.
2. `POST /auth/verify {token}`.
3. On `200`: store `sessionToken` (e.g. `localStorage`), set the app's auth
   state from `user`, redirect to the app (e.g. `/`).
4. On `401`: show "This link is invalid or has expired — request a new one" and
   link back to the login page. Don't retry the same token (it's burned).

The login page itself: an email field → `POST /auth/request-link` → show "Check
your email for a login link" regardless of the response (it's always 200).

## Token lifetimes & limits

- Magic-link token: 15 minutes, single-use.
- Session token: 3 days.
- Rate limit on `/auth/request-link`: 3 per email per 15 min, plus a per-IP cap
  (20 per 15 min). Over the limit → still 200, no email sent.

## Secrets & the e2e backdoor (values NOT in this doc)

None of the secrets live here or in the repo. They're in `/etc/photato-deploy.env`
on the Hetzner box (root-owned 600), materialized into the container at deploy
time (see `infra/deploy-webhook/deploy-photato.sh`):

- `AUTH_LINK_SECRET` — HMAC key signing magic-link tokens.
- `TEST_LOGIN_SECRET` — enables `POST /auth/test-login`. To run e2e against the
  live backend, put this value in `e2e/.env` (git-ignored) as `TEST_LOGIN_SECRET`
  and drive login via `POST /auth/test-login {email, secret}`. Get the value from
  the box env file (`docker run --rm -v /etc/photato-deploy.env:/f:ro alpine grep
  TEST_LOGIN_SECRET /f`), never from source control.
- `SMTP_*` — SMTP2GO submission creds; mail is sent from `Photato
  <photato@veszelovszki.com>`.
