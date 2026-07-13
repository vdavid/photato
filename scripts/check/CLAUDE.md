# Check runner

Go CLI that runs Photato's code-quality checks in parallel with dependency
ordering. Invoked via `./scripts/check.sh` from the repo root. Its own Go module
(`scripts/check/go.mod`), separate from `backend-go`.

For check authoring (how to add one, `CheckDefinition` shape, allowlists), see
[`checks/CLAUDE.md`](checks/CLAUDE.md).

## Quick start

```bash
./scripts/check.sh                    # All non-slow checks
./scripts/check.sh backend            # One app group (backend, scripts, frontend, e2e, other)
./scripts/check.sh gofmt vet          # Named checks (run even if slow)
./scripts/check.sh go                 # The Go tech group (backend + scripts)
./scripts/check.sh --include-slow     # Add slow checks (race tests)
./scripts/check.sh --ci --fail-fast   # CI mode (no auto-fix), stop on first failure
```

Positional args and flags mix in any order; commas work (`gofmt,vet`). Run
`--help` for the full flag list and a generated check inventory.

## Module map

- `main.go`: entry point — flag/positional parsing, root discovery, selection, lane filtering, runner delegation.
- `runner.go`: parallel executor (NumCPU semaphore, `DependsOn` graph, live TTY status line).
- `utils.go`: `findRootDir` (walks up to `AGENTS.md`) and the main-clone guard.
- `stats.go`: CSV run log (`~/photato-check-log.csv`); `colors.go`: ANSI helpers.
- `checks/`: one file per check + the registry. See its CLAUDE.md.

## Must-knows

- **Checks refuse to run in the main clone.** The auto-fixers (gofmt, allowlist shrink-wrap) reformat tracked files, and the solo-dev workflow only mutates a worktree. Detection: `--git-dir` == `--git-common-dir`. CI is exempt via `--ci`; override a deliberate local main run with `--allow-main` / `-m`.
- **Go is run through mise.** `check.sh` calls `go run .` (not `*.go`, so `_test.go` files don't break it); the mise shims on PATH resolve Go 1.26.4 from the root `.mise.toml`. A fresh clone must `mise trust` the two `.mise.toml` files once.
- **Tool installs are pinned.** staticcheck / gocyclo / deadcode / misspell install at an explicit `@vX.Y.Z` via `EnsureGoTool` (never `@latest`) — an unpinned install would auto-propagate a compromised release. Bump versions deliberately.
- **Two Go modules are covered:** `backend-go` (app `backend`, nicknamed checks like `gofmt`, `vet`) and `scripts/check` itself (app `scripts`, ID-only checks like `scripts-gofmt`). Each Go check is one factory (`goFmt`, `goVet`, …) registered once per module.
- **Warn-only checks never fail the run.** `claude-md-length` / `claude-md-reminder` and the gocyclo allowlist shrink-wrap emit warnings/changes but exit 0. Only a `FAILED` (returned error) or a blocked dependency exits 1.
- **Frontend/e2e checks run through pnpm.** They shell out to each package's own npm scripts (`pnpm --filter ./frontend <script>` / `pnpm --filter e2e <script>`), so the checker never re-encodes eslint/oxfmt/prettier config. Before any of them runs, the runner does one `pnpm install` at the repo root (`ensurePnpmIfNeeded` in `main.go` → `checks.EnsurePnpmDependencies`); a pure-Go selection skips the install entirely. eslint and format autofix locally and become report-only in `--ci` (`format:check` hard-fails on drift). Within each app, `format` waits on `eslint` and the read-only checks wait on `format`, so the two autofixers never race on the same files.
- **The slow lane has two checks.** `backend-tests-race` (data-race detector, ~15-20s) and `e2e-playwright` (the Docker pixel suite). Both are excluded by default and from `--ci`; `e2e-playwright` skips gracefully when Docker is absent. Give `--include-slow` / `--only-slow` runs a generous timeout.

## Extending

New checks are registered in `checks/registry.go` under their `App`
(`AppBackend`, `AppScripts`, `AppFrontend`, `AppE2E`, `AppOther`); the runner,
selectors, `--help`, and CI wiring pick them up with no other change. The
frontend and e2e lanes are already wired (eslint, format, svelte-check/typecheck,
vite build, plus the slow Docker Playwright suite) — add a pnpm-backed check by
dropping a file that calls `pnpmFilter(ctx.RootDir, "./frontend"|"e2e", script)`
and adding its registry row.
