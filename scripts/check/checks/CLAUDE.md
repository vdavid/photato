# Check authoring

Every check lives here as a single Go file, registered in `registry.go`'s
`AllChecks` slice. For the runner (parallel executor, CLI, guard), see
[`../CLAUDE.md`](../CLAUDE.md).

## Module map

- `common.go`: core types (`CheckDefinition`, `CheckResult`, `CheckContext`, `CheckFunc`, `App`), result constructors (`Success`, `SuccessWithChanges`, `Warning`), and shared helpers (`RunCommand`, `EnsureGoTool`, `CommandExists`, `goFilesIn`, `listPackages`, `findClaudeMdFiles`).
- `registry.go`: `AllChecks` (canonical ordered list) plus lookups (`GetCheckByID`, `GetChecksByApp`, `GetChecksByTech`, `FilterSlowChecks`, `ValidateCheckNames`).
- `go-*.go`: the Go checks, each a factory `goX(module string) CheckFunc` so one implementation registers once per module (`backend-go`, `scripts/check`).
- `frontend-*.go` / `e2e-*.go`: the pnpm-backed checks. Each shells out to the package's own npm script via `pnpmFilter` (`pnpm.go`) — the checker never re-encodes eslint/oxfmt/prettier config. `pnpm.go` also holds `EnsurePnpmDependencies` (the one up-front root install) and `runFormatCheck` (shared `format:check`/`format` logic: hard-fail in CI, autofix locally).
- `claude-md-*.go`: warn-only docs hygiene. `allowlist.go`: shared `writeJSONAllowlist` + `sortedKeys` for allowlist shrink-wrap.

## Adding a check

1. Add `checks/{area}-{name}.go` with `func RunX(ctx *CheckContext) (CheckResult, error)` (or a `func x(module string) CheckFunc` factory for a per-module Go check).
2. Register it in `AllChecks`: set `ID`, optional `Nickname`, `App`, `Tech`, `DependsOn`, `IsSlow`, `Run`.
3. Return `Success("stats message")` on pass, `fmt.Errorf(...)` on fail, `Warning(...)` for a warn-only nudge. `SuccessWithChanges` when the check auto-fixed local files (CI mode must still error on the same drift).
4. Run `./scripts/check.sh scripts-vet scripts-staticcheck` after — staticcheck is strict about idiomatic Go, and the whole-program `deadcode` check fails if you leave an unused helper.

## Must-knows

- **Pin every tool install.** `EnsureGoTool` takes `installPath@vX.Y.Z`, never `@latest`. Version consts live at the top of each `go-*.go`.
- **Error output uses `indentSix()`**: `fmt.Errorf("failed in %s\n%s", module, indentSix(output))`. Success messages carry stats ("11 packages passed"), not a bare "OK".
- **IDs vs nicknames.** `--check` and positional selection accept either. Nicknames must be unique and must not shadow a reserved selector keyword (`backend`, `scripts`, `frontend`, `e2e`, `other`, `go`); `ValidateCheckNames` fails startup otherwise. Backend Go checks carry the short nicknames; the `scripts/check` copies use ID-only names to avoid collision.
- **Allowlists are ratchet-only and self-cleaning.** `gocyclo-allowlist.json` (accepted pre-existing complexity, keyed `<module>::<pkg>.<func>`) and `claude-md-length-allowlist.json` (long CLAUDE.md word counts) suppress known debt but fail on anything new or grown. A local run shrink-wraps them (removes satisfied entries, ratchets shrunk ones down); CI only reports. Never raise a value to make a check pass — reduce the underlying thing, or add the entry deliberately with a reason.
- **misspell scans Go files only.** The message catalog (`backend-go/internal/messages/photato-messages.json`) is Hungarian; an English spell-checker only false-positives there. Domain terms it wrongly "corrects" go in `misspellIgnore` (`hardlinked`).
- **`DependsOn` serializes tree-mutating order.** Non-CI `gofmt` writes files, so `vet`/`staticcheck`/`gocyclo` depend on the module's `gofmt` to avoid racing on the same files; `deadcode`/`tests` depend on `vet`.

## Tests

`registry_test.go` guards config integrity (no dup/shadowing names, every `DependsOn` resolves, every check has `Run`/`App`/`Tech`). `../cli_test.go` guards that every reserved selector keyword resolves. Run `./scripts/check.sh scripts-tests`.
