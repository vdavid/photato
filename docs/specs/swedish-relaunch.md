# Swedish relaunch — master checklist

The task list for reviving Photato for a Swedish audience. David manages this list and makes the ⚖️ decisions; agents execute the rest. Headings are roughly sequential milestones. Sources: the 2026-07-13 security, code-quality, and UX audits, plus the roadmap in `AGENTS.md`. Keep items one line; when an item needs its own spec, link it.

## ⚖️ Decisions to make first (they reshape everything downstream)

- [ ] **Content strategy:** does Sweden get fully authored Swedish course materials + weekly challenges, or a UI-only translation over Hungarian content? The ~80 content modules are HU prose and Hungarian-publisher third-party articles that can't be machine-translated meaningfully. This changes the size of milestone 4 by an order of magnitude.
- [ ] **Join mechanism:** keep a Google Form, or build in-app signup on top of the existing magic-link auth (accounts already get created on first verify)? Decides milestones 3 and 5.
- [ ] **Student photo gallery:** should students see each other's weekly submissions in-product? Today the photo-list endpoints are admin-only and the community surface is an external Facebook group — a fresh Swedish cohort starts with no such group.
- [ ] **Support address:** pick one canonical address. Code shows `photatophotato@gmail.com`; the revived infra sends/receives as `photato@photato.eu` / `hello@` / `info@`.

## 0. Baseline hygiene (done 2026-07-13)

- [x] Check runner (`./scripts/check.sh`, 23 checks + slow lane), strict ESLint/oxfmt/prettier, CI gate rewired
- [x] `.claude/` infra (rules, plan/execute commands, session hook), README, AGENTS.md wiring

## 1. Bug and security fixes (worth doing regardless of the relaunch)

- [ ] Fix `convertObjectToQueryString` (`frontend/src/website/httpHelper.ts`): no URL-encoding, so `+`-addressed emails get 403 on upload and `&`/`=`/`#` in photo titles corrupt the query — switch to `URLSearchParams`
- [ ] Fix the rate-limit IP bucket (`backend-go/internal/httpapi/server.go` `clientIP`): trusts the leftmost (client-controlled) `X-Forwarded-For` entry, defeating the per-IP cap on login-email sends — use the rightmost hop Caddy appends
- [ ] Bind upload metadata to the signature (or re-validate on PUT): title/email/contentType on the photo row currently come unverified from the PUT query string (spoofing now, stored-XSS if a title is ever rendered unescaped)
- [ ] Sniff magic bytes on upload so stored `.jpg` files are really JPEGs
- [ ] Store sessions as `SHA256(token)` instead of plaintext (defense in depth for DB/backup leaks)
- [ ] Validate the `environment` param on `get-signed-url` against the known set
- [ ] Delete the winter/summer-course concept (`config.ts` `isWinterOrSummerCourse` + the broken `_calculateDates` ternary it feeds — the flagged precedence bug dies with it; compute `liveEventDate` explicitly)
- [ ] Make `toISODateString`/`toISODateStringWithHHMM` honor their `timeZone` param (`dateTimeHelper.ts`) — directly needed for a Stockholm cohort
- [ ] Make the `alt` prop real in `SimpleFigure.svelte` and `FullWidthLocalImage.svelte` (currently dropped; the working prop is the oddly-named `altText`, so natural `alt="…"` yields no alt text)
- [ ] Replace the literal `<p>TODO</p>` in the non-HU branch of `CoursePage.svelte:73` (needs content)

## 2. De-vestige and cleanup (do before building new features on top)

- [ ] Rename session tokens from `accessToken` / "JWT" to `sessionToken` in the admin repos and `PhotoUploader` (they're opaque 256-bit session tokens, not JWTs)
- [ ] Rename `S3PhotoMetadata` / `S3PhotoMetadataWire` (no S3 — photos live on the Hetzner volume)
- [ ] Rename the `PhotatoMessage*` files/classes to match the backend's `Message` concept (also updates the `photatoMessages` sessionStorage key); it's inconsistent with the un-prefixed admin photos code
- [ ] Simplify `PhotoUploader` retry logic: comments describe a Lambda@Edge 503 timeout that no longer exists, and it actually retries on any error — decide if retry is still wanted
- [ ] Delete dead config: `featureSwitches` (declared/merged, never read), `defaultLocaleCode`, `availableLanguageCodes` (`i18n/locales.ts`)
- [ ] Convert JS-era `@type` JSDoc to real TS (`challengeRepository.ts`, `articles-repository.ts`, `uploadPageStatuses.ts` — make the string-keyed objects `as const` / unions)
- [ ] Clean `articles-repository.ts`: two commented-out slugs whose `.svelte` files still exist on disk (restore or delete the orphans)
- [ ] Fix `frontend/package.json` metadata: arbitrary `version: "8.0.0"`, `license: "ISC"` on a proprietary site, npm-package `keywords`
- [ ] Clarify `CourseDateConverter` (`getWeekDeadline`'s unexplained `+ 1 + 1`, and the Monday-vs-Sunday contradiction between the JSDoc and `config.ts startDay`)
- [ ] Consider splitting the 690-line `httpapi/server.go` (auth vs photo/upload handlers) — optional, revisit if the backend grows for passkeys

## 3. New-cohort config (make the course runnable again)

- [ ] Lift cohort data out of `config.ts` into its own data shape — there's no cohort abstraction today; ~12 fields (name, titles, dates, student count, survey/signup/FB URLs, timezone) are interleaved with app config
- [ ] Set the new cohort's dates/config so the upload and course pages leave the "course is already over" state (`UploadPage.svelte`, `CoursePage.svelte`, `courseData.ts` all resolve from `startYear`)
- [ ] Kill the hardcoded `subscribedStudentCount = 336` (has an in-code TODO noting it "led to mistakes"); derive it or make it clearly per-cohort data

## 4. Swedish localization

- [ ] Build the real language switcher: `i18nHelper.ts` `getDefaultLocaleCodeByNavigatorPreferences` hard-returns `hu-HU` and the navigator path is a linter-placating no-op; also fix `_getLocaleCodeByNavigatorPreference` returning a bare `hu` instead of `hu-HU`
- [ ] Author `sv-SE.ts` UI translations (the easy ~10%); audit the existing `en-US.ts` for holes first (its fallback branches still contain Hungarian, e.g. `ContactPage.svelte`)
- [ ] Localize `index.html` `lang`, meta, keywords, and OG tags (all Hungarian today)
- [ ] Produce Swedish course content per the ⚖️ content-strategy decision (materials + weekly challenges; the `hu/`-keyed content dirs and `/:languageCode/` routes are already plumbed for a second language)

## 5. Google Forms + spreadsheet migration into the app

- [ ] Retire the orphaned 2021 sign-up Google Form (`config.ts signUpFormUrl` → `bit.ly/3ccXkMp` → a live "Photato 2021" form still collecting responses into a void) per the join-mechanism decision
- [ ] Migrate the mid-course and final survey Google Forms (`midTimeSurveyUrl`, `finalSurveyUrl`) into the app, or replace them
- [ ] Migrate the source spreadsheet data (David to provide) into the SQLite backend — scope once the forms/sheets are handed over

## 6. UX and redesign

- [ ] Add magic-link recovery affordances: "we sent it to X", resend, try a different address (`LoginPage`, `LoginVerifyPage`) — cheap, worth doing before relaunch
- [ ] Make joining vs signing in coherent in the UI (accounts are created on first magic-link verify, but the two are framed as unrelated doors)
- [ ] Accept HEIC/PNG uploads (or offer conversion) — iPhones shoot HEIC, screenshots are PNG; JPEG-only is a phone-first wall (`UploadPage.svelte`)
- [ ] Remove the duplicate "already enrolled" block on `FrontPage.svelte` (rendered at lines 25 and 135)
- [ ] Rebuild the hamburger toggle as a real `<button>` with `aria-expanded` (`NavigationBar.svelte:77` is a non-focusable `<div onclick>` — no keyboard/AT access)
- [ ] Fix the invalid `<header role="navigation">` landmark (`NavigationBar.svelte:36` → `banner`, or drop the role)
- [ ] In the redesign, bake in accessible inline links (today: color-only, ~1.23:1 contrast, no underline — Lighthouse `link-in-text-block` scored 0); don't reproduce color-only links for pixel parity
- [ ] Visual redesign (roadmap item) — the pixel-parity constraints (`main > *` CSS, documented a11y warts) are freed once parity is intentionally dropped

## 7. Later / roadmap

- [ ] Passkeys layered on the magic-link auth (`AGENTS.md` roadmap)
- [ ] Student photo gallery, if the ⚖️ decision says yes (needs new non-admin list/serve endpoints + a route)
- [ ] Turn `SitemapGeneratorPage` (an admin page that emits XML for a human to paste into `public/sitemap.xml`, with a hardcoded 2020 date) into a build-time step
- [ ] Refactor the three gocyclo-allowlisted backend functions (`migrate.Run`, `migrate.Verify`, `handleUpload`) when convenient (allowlisted as accepted debt; tests are green)

## Owner actions (from `AGENTS.md`, unrelated to the relaunch but open)

- [ ] Retire the old Netlify site + redundant DNS zone; wipe the AWS account; close the Mongo Atlas subscription
</content>
