# Backend-go intentional divergences from the legacy backend

The Go backend (`backend-go/`) reproduces the legacy API's *observable* contract, not its internal Lambda mechanics. Where the two differ on purpose, it is listed here so phase 3b implements the intended behavior rather than "matching legacy" blindly. Each item is encoded in the phase-3a Go tests.

## Routing and status codes

- **Lambda functionName routing → REST path+method.** The legacy stack routed by matching the AWS Lambda `functionName` (`photato-website-backend-<env>-<fn>`) plus HTTP method. The Go backend is a single `net/http` server routing by path + method (`GET /version`, `GET /photos/list-for-week`, `PUT /upload/...`, etc.).
- **Unknown route → 404, not 405.** Legacy returned 405 ("Method Not Allowed") whenever no `functionName` route matched. REST semantics are cleaner: unknown path → 404, known path with wrong method → 405. The legacy suite never asserted the 405-for-everything behavior, so nothing is lost.
- **The 420 "Method Failure" is not ported.** Legacy `Router` returned 420 when a middleware chain produced no output — an internal safety net that never fires with well-formed handlers, and never asserted by the legacy Jest suite. Dropped.
- **Invalid environment.** Legacy returned 400 for an environment outside `{development,staging,production}`. The Go backend does not carry a per-request `environment` routing concept the same way; environment is a request parameter for path building, validated as part of upload-metadata validation (400 on bad input). Not a separate 400 gate.

## Auth

- **Admin gating is actually enforced (legacy bug fixed).** The legacy `AuthMiddleware.isAdmin` had a missing `await`: it called `this.isUser(...)` without awaiting, so the returned Promise was always truthy and the admin check in the `if (!authResult)` branch was never reached. Effect: the admin-only routes (`get-all-messages`, `list-for-week`, and `/version`, all wired behind `isAdmin`) were effectively open to any authenticated user. The legacy unit test `isAdmin rejects non-admins` even asserts the broken result (`undefined`, not a 403). The Go backend enforces admin properly: **403 for a non-admin** on admin-only endpoints.
- **`/version` requires a valid user but not admin.** The legacy `getVersion` route sat behind `isAdmin`; the `index-gateway` test confirms **401 without a token**. The Go backend keeps "valid user required" (401 without a Bearer token) but does not require admin — version info is not sensitive, and the legacy admin gate on it was the buggy no-op above. If phase 3b wants `/version` fully public, that is a further, deliberate loosening.
- **Auth0 token rejection.** Legacy `Auth0Authorizer` returned `null` for any non-200 from `/userinfo`. The Go `Auth0HTTPClient.GetUserInfo` returns `(nil, nil)` for non-200 (invalid token, not a transport error); the authenticator maps an unrecognized token to a nil user → 401 upstream.

## Uploads

- **Server-side size enforcement (new capability, not a regression).** The 50 KB–25 MB bounds lived only in the frontend config (`imageUpload`). The legacy backend could not enforce them: it handed out an S3 presigned PUT and S3 received the bytes directly. The Go backend receives the PUT itself, so it enforces the bounds and returns **400** for an out-of-range body. Bounds are `photos.MinUploadBytes` / `photos.MaxUploadBytes`.
- **Invalid upload metadata → 400, not 500.** Legacy `PhotoMetadataBuilder.createFromRawFields` threw on bad input; the throw was uncaught in the controller and surfaced as a 500 via the router's try/catch. The Go backend validates and returns **400 Bad Request** (`photos.ErrInvalidMetadata`). Non-JPEG mime type is part of this (400), matching the observable "reject non-image/jpeg" intent.
- **Email match preserved.** `get-signed-url` still requires the `emailAddress` param to equal the authenticated user's email; mismatch → **403** ("Mismatching email address."), exactly as legacy `GetSignedUrlController`.
- **Single-use preserved.** The first successful PUT marks the signature expired, so a second PUT to the same URL → **403**. Same rule as legacy `ValidateSignedUrlController.handlePutRequest`.
- **Metadata stored DECODED.** Legacy stored S3 custom metadata (`title`, `original-file-name`, `email-address`) percent-encoded. The Go backend stores **decoded UTF-8** in SQLite. (The phase-3c migration tool must urldecode the salvaged values — see the revival plan's "CRITICAL metadata gotcha".)

## Storage layout and signing

- **Photo storage path preserved exactly:** `<environment>/photos/<courseName>/week-<weekIndex>/<email>.jpg`. Note: the environment comes **first** (`production/photos/hu-4/week-2/user@example.com.jpg`), not `photos/production/...`.
- **Signatures move from S3 objects to SQLite rows.** Legacy stored `signatures/valid/<hash>` and `signatures/expired/<hash>` as S3 objects. The Go backend stores them as rows in `upload_signatures`. Preserved: the hash is `SHA256(path)` hex-encoded, and a path is valid iff a `valid` marker exists **and** an `expired` marker does not. The golden hash vectors in `internal/signing/signing_test.go` therefore stay stable across the storage change.
- **Listing response shape preserved.** `/photos/list-for-week` returns a JSON array whose objects carry the exact legacy field names: `key`, `fileName`, `url`, `emailAddress`, `title`, `contentType`, `sizeInBytes`, `lastModifiedDate`. The React frontend consumes these verbatim. The `getDetails` fast path (title/contentType omitted when false) is preserved.
- **New photo-serving route (`GET /photos/{key...}`).** Legacy served photo bytes directly from S3/CloudFront; the `url` in the listing pointed at the S3/CloudFront object. The Go backend owns the bytes on its own volume, so it adds an admin-gated serving route (`BASE_URL` + `/photos/` + key) and the listing `url` points there. Same admin gating as the listing itself (the whole listing surface is admin-only). Path traversal (`..` in the key) is rejected.
- **`list-for-week` visibility is admin-only and unfiltered.** There is no per-user filtering: an admin sees *every* photo for the week. (This corrects a phase-3a task guess that non-admins might see only their own — the legacy route is entirely admin-gated and returns the whole week.)

## Response headers

- **Bogus `Content-Encoding: UTF-8` dropped.** Legacy `ResponseHelper` set `Content-Encoding: UTF-8` on every response — invalid (UTF-8 is a charset, not a content encoding). The Go backend does not send it.
- **CORS preserved.** Responses carry `Access-Control-Allow-Origin: *` and `Access-Control-Allow-Headers: *`; preflight (`OPTIONS`) responses additionally carry `Access-Control-Allow-Methods` and return 200. The frontend is cross-origin during the migration, so CORS is load-bearing.
