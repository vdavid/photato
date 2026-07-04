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

## Configuration (environment variables)

All config is env-var only; there are no config files or secrets in the repo.

- `PORT`: TCP port to listen on. Default `19003` (a random high port per the
  no-standard-ports rule; the deploy sits behind Caddy, which owns public 443).
- `DATA_DIR`: root for persisted state. Default `./data`. Holds the SQLite file
  (`photato.db`) and the photos tree (`photos/`).
- `BASE_URL`: public origin used to build the returned upload URLs and the photo
  `url` field. No trailing slash. Default `http://localhost:$PORT`. In
  production set it to the API's public origin (e.g. `https://api.photato.eu`).
- `AUTH0_USERINFO_URL`: Auth0 `/userinfo` endpoint used to validate Bearer
  access tokens on a session-cache miss. Default
  `https://photato.eu.auth0.com/userinfo`.
- `ADMIN_EMAILS`: comma-separated admin allowlist. Default
  `veszelovszki@gmail.com,dorah.nemeth@gmail.com`. This is the authoritative
  source of admin status at auth time (the stored `users.is_admin` column is
  informational).

Notes on config the task brief mentioned but this backend does not need:

- No `AUTH0_ISSUER` / `AUTH0_AUDIENCE`: tokens are validated by calling Auth0
  `/userinfo`, not by verifying a JWT signature locally, so issuer/audience
  aren't consumed.
- No `ENVIRONMENT`: the photo `environment` (`development`/`staging`/
  `production`) is a per-request parameter on `get-signed-url` and
  `list-for-week`, not a server-wide setting.

## Endpoints

All data endpoints are Bearer-authed via Auth0 (token → local session cache →
Auth0 `/userinfo` on miss). Admin gating is enforced from `ADMIN_EMAILS`.

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

The phase-3c migration tool and `list-for-week` both depend on this layout.

## Data migration (phase 3c)

`cmd/migrate` turns the Phase-0 S3 salvage into this live layout: it hardlinks
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
  tree is admin-gated, while Phase 4 serves the articles as public static files
  via Caddy (`root * DATA_DIR/external-articles`), and the frontend's
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

**Deploy constraint (phase 4):** `--data-dir` MUST sit on the same filesystem as
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
mise exec -- go test ./...          # unit tests (the phase-3a spec)
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
