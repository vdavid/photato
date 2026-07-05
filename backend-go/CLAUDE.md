# Photato backend (Go)

The replacement Photato backend: a single Go binary with pure-Go SQLite
(`modernc.org/sqlite`, no cgo). It serves the same observable API as the legacy
AWS Lambda + S3 + MongoDB stack, with the intentional differences captured in
[`../docs/backend-go-divergences.md`](../docs/backend-go-divergences.md).

## Run

Go is managed by mise (`.mise.toml` pins the toolchain), so run Go through it:

```sh
cd backend-go
mise exec -- go run ./cmd/server        # starts on http://localhost:19003
```

Or build a binary:

```sh
mise exec -- go build -o server ./cmd/server
DATA_DIR=/var/lib/photato ./server
```

On startup the server creates `DATA_DIR` (and `DATA_DIR/photos`), opens/creates
the SQLite database, and runs the schema migration (idempotent
`CREATE TABLE IF NOT EXISTS`, versioned via `PRAGMA user_version`).

## Store and schema (load-bearing decisions)

- **Layout:** `cmd/server/` (entrypoint + wiring) and `internal/{signing,photos,auth,magiclink,email,messages,store,httpapi}`. Domain packages define interfaces; `store` (SQLite) implements them; `httpapi` is the HTTP surface; `cmd/server` wires it. `cmd/migrate` is the one-shot data-migration tool (see below).
- **SQLite pragmas:** opened WAL + `busy_timeout=5000` + `foreign_keys=on`, with `SetMaxOpenConns(1)`. SQLite serializes writes; a single connection is what keeps "database is locked" from appearing under `-race` and concurrent uploads. Don't raise the connection cap.
- **Tables:** `users`, `sessions`, `used_login_nonces`, `login_attempts`, `photos`, `upload_signatures`. The v1→v2 migration dropped the Auth0-era profile blob and recreated the empty `users`/`sessions` (production started empty — they only cached Auth0 data); `photos`/`upload_signatures` are untouched.
- **Admin is derived from `ADMIN_EMAILS` at auth time** (authoritative). The stored `users.is_admin` column is informational — editing it grants nothing.
- **Single-use uploads are enforced at the HTTP layer, not the store.** The `signing.Store` interface is check-marker + put-marker (no atomic delete), so the check-and-expire claim runs under an in-process mutex (fine for a single binary). A signature hashes the canonical storage path (not the query string), so it's stable regardless of URL encoding. Consequence (same as the legacy S3 markers): once a path's signature is expired, re-uploading to that exact path stays blocked.
- **Single-use login is DB-enforced, race-safe:** the magic-link nonce is burned via `INSERT OR IGNORE` into `used_login_nonces` — with the primary key + single write connection, exactly one of N concurrent verifies wins. Rate limiting is SQLite-backed (`login_attempts`): 3/email/15min + 20/IP/15min; over-limit still returns 200 but sends nothing (no enumeration).

## Configuration (environment variables)

All config is env-var only; there are no config files or secrets in the repo.

- `PORT`: TCP port to listen on. Default `19003` (a random high port per the
  no-standard-ports rule; the deploy sits behind Caddy, which owns public 443).
- `DATA_DIR`: root for persisted state. Default `./data`. Holds the SQLite file
  (`photato.db`) and the photos tree (`photos/`).
- `BASE_URL`: public origin used to build the returned upload URLs and the photo
  `url` field. No trailing slash. Default `http://localhost:$PORT`. In
  production set it to the API's public origin (e.g. `https://api.photato.eu`).
- `ADMIN_EMAILS`: comma-separated admin allowlist. Default
  `veszelovszki@gmail.com,dorah.nemeth@gmail.com`. This is the authoritative
  source of admin status at auth time (the stored `users.is_admin` column is
  informational).

Magic-link login (see `../docs/auth-contract.md` for the full wire contract):

- `AUTH_LINK_SECRET`: HMAC-SHA256 key that signs magic-link tokens. **Required**
  for login — when empty, `/auth/request-link` and `/auth/verify` refuse to mint
  or accept tokens (the server logs a warning at boot).
- `FRONTEND_BASE_URL`: origin of the frontend verify page, no trailing slash.
  Default `https://photato.eu`. The emailed link is
  `FRONTEND_BASE_URL + "/login/verify?token=..."`.
- `TEST_LOGIN_SECRET`: when non-empty, enables the `POST /auth/test-login` e2e
  backdoor (constant-time secret compare). Unset in normal operation.
- `SMTP_HOST`, `SMTP_PORT` (default `587`), `SMTP_USERNAME`, `SMTP_PASSWORD`,
  `SMTP_FROM_ADDRESS`, `SMTP_FROM_NAME` (default `Photato`): SMTP submission
  config for sending the link (generic `net/smtp` + STARTTLS; Photato uses
  SMTP2GO). When `SMTP_HOST`/`SMTP_FROM_ADDRESS` are unset, links can't be mailed
  (the server logs a warning); `/auth/request-link` still returns 200.

Notes on config this backend does NOT use:

- No `AUTH0_*`: Auth0 is gone. Sessions are our own opaque tokens, minted by the
  magic-link flow and looked up locally.
- No `ENVIRONMENT`: the photo `environment` (`development`/`staging`/
  `production`) is a per-request parameter on `get-signed-url` and
  `list-for-week`, not a server-wide setting.

## Endpoints

Login is passwordless email magic links (`internal/{auth,magiclink,email}`); the
full wire contract is in `../docs/auth-contract.md`. Data endpoints authorize
with `Authorization: Bearer <sessionToken>` — an opaque 256-bit token minted by
the login flow and looked up in the local `sessions` table. Admin gating is
enforced from `ADMIN_EMAILS`.

- `POST /auth/request-link`: `{email}` → always `200 {ok:true}` (no enumeration);
  rate-limited; mails a single-use, 15-minute link.
- `POST /auth/verify`: `{token}` → `{sessionToken, user}` (single-use), or 401.
- `POST /auth/test-login`: `{email, secret}` e2e backdoor, only when
  `TEST_LOGIN_SECRET` is set (else 404).
- `GET /auth/me`: Bearer → `{emailAddress, isAdmin}` (401 without).
- `POST /auth/logout`: Bearer → burns the session.
- `GET /version`: valid user required (401 without a token); returns the version
  string. Not admin-gated.
- `GET /messages/get-all-messages`: admin only (401/403). Returns the static
  course-message catalog as JSON.
- `GET /photos/list-for-week?environment&courseName&weekIndex&getDetails`: admin
  only. Returns every photo for the week (no per-user filter) with the legacy
  field names (`key`, `fileName`, `url`, `emailAddress`, `title`, `contentType`,
  `sizeInBytes`, `lastModifiedDate`). `url` points at the serving route below.
- `GET /photos/{key...}`: admin only (same gating as the listing). Streams a
  stored photo file from disk. Path traversal is rejected.
- `GET /get-signed-url?environment&emailAddress&courseName&weekIndex&originalFileName&title&mimeType`:
  valid user required. Validates the metadata (400 on bad input, including
  non-`image/jpeg`), requires `emailAddress` to equal the authenticated user's
  email (403 on mismatch), and returns a single-use upload URL on this server.
- `PUT /upload/{key...}`: the signed upload target. No Bearer required — a valid
  signature is the authorization (matching the legacy Lambda@Edge validator).
  Enforces the 50 KB – 25 MB size bounds (400), streams the body to disk,
  records a photo row (metadata stored decoded UTF-8), and expires the signature
  so the URL is single-use (403 on reuse).

CORS: every response carries `Access-Control-Allow-Origin: *` and
`Access-Control-Allow-Headers: *`; `OPTIONS` preflight also carries
`Access-Control-Allow-Methods` and returns 200. The frontend is cross-origin
during the migration.

## Storage layout

Photo files live under `DATA_DIR/photos/` keyed by the preserved legacy S3 key
shape: `{environment}/photos/{courseName}/week-{weekIndex}/{email}.jpg`. Because
the key itself begins with `{environment}/photos/…`, the on-disk path has
`photos` twice, e.g.:

```
DATA_DIR/photos/production/photos/hu-4/week-2/user@example.com.jpg
```

The `migrate` tool and `list-for-week` both depend on this layout.

## Data migration (the `migrate` tool)

`cmd/migrate` turns the S3 salvage master into this live layout: it hardlinks
each salvaged file into place and writes one `photos` row per photo object. It
**hardlinks, never copies** (`os.Link` on the same ext4 volume), so it costs
~zero bytes and leaves the salvage tree pristine — load-bearing, because the
Hetzner volume has less free space than the 2.4 GB of photos occupy. It reuses
the `store` package for the rows, so schema and upsert semantics stay identical
to the running server.

What it does with the 1392 salvaged objects:

- **642 photos** (`<env>/photos/…`): hardlinked to `DATA_DIR/photos/<key>`, one
  `photos` row each (path = the S3 key, which is unique, so the run upserts).
  Custom metadata (`uuid`, `original-file-name`, `email-address`, `title`) is
  percent-decoded before storing (e.g. `Ly%C3%A1ny` → `Lyány`); `title` may be
  empty. `last_modified` (RFC1123) becomes the row's `last_modified`.
- **750 external-articles**: hardlinked to `DATA_DIR/external-articles/<rest>`
  (the leading `external-articles/` segment dropped), a plain static tree with
  no `photos` rows. It lives **outside** `DATA_DIR/photos/` on purpose: that
  tree is admin-gated, while Caddy serves the articles as public static files
  (`root * DATA_DIR/external-articles`), and the frontend's
  `thirdPartyArticlesBaseUrl` repoints there.

It is **idempotent** (re-running skips already-linked files and re-upserts rows,
no duplication) and safe to interrupt.

```sh
mise exec -- go build -o migrate ./cmd/migrate
migrate --source <salvage-root> --data-dir <DATA_DIR> [--dry-run] [--verify]
```

Flags: `--source` (salvage root holding `s3/` and `metadata.json`), `--data-dir`
(the backend `DATA_DIR`), `--sqlite` (default `<data-dir>/photato.db`),
`--external-articles-dir` (default `<data-dir>/external-articles`), `--dry-run`
(print the plan and counts, write nothing), `--verify` (recount files/rows and
MD5-check `--verify-samples` random photos against the manifest ETag), which
exits non-zero on any mismatch.

**Deploy constraint:** `--data-dir` MUST sit on the same filesystem as
the salvage `s3/` tree (both on the Hetzner volume), or the hardlinks fail with
a cross-device error rather than silently copying. The command to run on the box
(salvage at `/mnt/HC_Volume_105883537/photato`):

```sh
migrate \
  --source  /mnt/HC_Volume_105883537/photato \
  --data-dir /mnt/HC_Volume_105883537/photato-data \
  --verify
```

That populates `/mnt/HC_Volume_105883537/photato-data/{photos,external-articles}`
plus `photato.db`; point the server's `DATA_DIR` at the same path and Caddy's
article root at `…/photato-data/external-articles`.

## Development

```sh
mise exec -- go test ./...          # unit tests
mise exec -- go test -race ./...    # race detector
mise exec -- go vet ./...
mise exec -- gofmt -l .             # should print nothing
```

The message catalog is embedded from `internal/messages/photato-messages.json`,
generated from the legacy `backend/messages/photato-messages.js` by requiring
the module and dumping JSON (preserving the Hungarian UTF-8 verbatim). Regenerate
it with:

```sh
node -e "const {photatoMessages}=require('../backend/messages/photato-messages.js');const fs=require('fs');const out=photatoMessages.map(m=>{const o={slug:m.slug,title:m.title,courseDayIndex:m.courseDayIndex,channel:m.channel,audience:m.audience,locale:m.locale};if(m.subject!==undefined)o.subject=m.subject;o.contentType=m.contentType;o.content=m.content;return o;});fs.writeFileSync('internal/messages/photato-messages.json',JSON.stringify(out,null,2)+'\n');"
```
