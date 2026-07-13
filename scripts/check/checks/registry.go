package checks

import "fmt"

// techGo is the tech label shared by every Go check (backend + scripts). The
// `go` selector group filters on it.
const techGo = "🐹 Go"

const techDocs = "📝 Docs"

// techSvelte labels the frontend Svelte SPA checks; techTS labels the e2e
// TypeScript/Playwright checks. Each app groups under one tech in --help.
const techSvelte = "🎨 Svelte"

const techTS = "🟦 TypeScript"

// AllChecks is the canonical ordered list of check definitions with their
// metadata. DependsOn defines which checks must complete before this one runs.
//
// Extension points: frontend (Svelte) and e2e (Playwright) checks are owned by
// those areas' maintainers. Add them under AppFrontend / AppE2E here, following
// the same shape; the runner, selectors, and CI wiring pick them up automatically.
var AllChecks = []CheckDefinition{
	// Backend — Go checks (backend-go module).
	{ID: "backend-gofmt", Nickname: "gofmt", DisplayName: "gofmt", App: AppBackend, Tech: techGo, Run: goFmt("backend-go")},
	{ID: "backend-vet", Nickname: "vet", DisplayName: "go vet", App: AppBackend, Tech: techGo, DependsOn: []string{"backend-gofmt"}, Run: goVet("backend-go")},
	{ID: "backend-staticcheck", Nickname: "staticcheck", DisplayName: "staticcheck", App: AppBackend, Tech: techGo, DependsOn: []string{"backend-gofmt"}, Run: goStaticcheck("backend-go")},
	{ID: "backend-misspell", Nickname: "misspell", DisplayName: "misspell", App: AppBackend, Tech: techGo, Run: goMisspell("backend-go")},
	{ID: "backend-gocyclo", Nickname: "gocyclo", DisplayName: "gocyclo", App: AppBackend, Tech: techGo, DependsOn: []string{"backend-gofmt"}, Run: goGocyclo("backend-go")},
	{ID: "backend-deadcode", Nickname: "deadcode", DisplayName: "deadcode", App: AppBackend, Tech: techGo, DependsOn: []string{"backend-vet"}, Run: goDeadcode("backend-go")},
	{ID: "backend-tests", Nickname: "tests", DisplayName: "tests", App: AppBackend, Tech: techGo, DependsOn: []string{"backend-vet"}, Run: goTests("backend-go", false)},
	{ID: "backend-tests-race", Nickname: "tests-race", DisplayName: "tests (race)", App: AppBackend, Tech: techGo, IsSlow: true, DependsOn: []string{"backend-tests"}, Run: goTests("backend-go", true)},

	// Scripts — Go checks (the check runner itself; keeps this tooling clean).
	{ID: "scripts-gofmt", DisplayName: "gofmt", App: AppScripts, Tech: techGo, Run: goFmt("scripts/check")},
	{ID: "scripts-vet", DisplayName: "go vet", App: AppScripts, Tech: techGo, DependsOn: []string{"scripts-gofmt"}, Run: goVet("scripts/check")},
	{ID: "scripts-staticcheck", DisplayName: "staticcheck", App: AppScripts, Tech: techGo, DependsOn: []string{"scripts-gofmt"}, Run: goStaticcheck("scripts/check")},
	{ID: "scripts-misspell", DisplayName: "misspell", App: AppScripts, Tech: techGo, Run: goMisspell("scripts/check")},
	{ID: "scripts-gocyclo", DisplayName: "gocyclo", App: AppScripts, Tech: techGo, DependsOn: []string{"scripts-gofmt"}, Run: goGocyclo("scripts/check")},
	{ID: "scripts-deadcode", DisplayName: "deadcode", App: AppScripts, Tech: techGo, DependsOn: []string{"scripts-vet"}, Run: goDeadcode("scripts/check")},
	{ID: "scripts-tests", DisplayName: "tests", App: AppScripts, Tech: techGo, DependsOn: []string{"scripts-vet"}, Run: goTests("scripts/check", false)},

	// Frontend — Svelte SPA checks (frontend package, via pnpm). eslint (autofix)
	// and format (autofix) both mutate the tree locally, so format waits on
	// eslint and the read-only checks wait on format — same serialization the Go
	// checks use to avoid racing on the same files. Harmless ordering in CI (no
	// mutation there).
	{ID: "frontend-eslint", DisplayName: "eslint", App: AppFrontend, Tech: techSvelte, Run: RunFrontendESLint},
	{ID: "frontend-format", DisplayName: "format", App: AppFrontend, Tech: techSvelte, DependsOn: []string{"frontend-eslint"}, Run: RunFrontendFormat},
	{ID: "frontend-svelte-check", DisplayName: "svelte-check", App: AppFrontend, Tech: techSvelte, DependsOn: []string{"frontend-format"}, Run: RunFrontendSvelteCheck},
	{ID: "frontend-test", DisplayName: "vitest", App: AppFrontend, Tech: techSvelte, DependsOn: []string{"frontend-format"}, Run: RunFrontendTest},
	{ID: "frontend-build", DisplayName: "vite build", App: AppFrontend, Tech: techSvelte, DependsOn: []string{"frontend-svelte-check"}, Run: RunFrontendBuild},

	// E2E — Playwright suite (e2e package, via pnpm). Same eslint→format
	// serialization; typecheck reads after format settles. The Docker pixel suite
	// is slow and CI-excluded (no browsers in CI).
	{ID: "e2e-eslint", DisplayName: "eslint", App: AppE2E, Tech: techTS, Run: RunE2EESLint},
	{ID: "e2e-format", DisplayName: "format", App: AppE2E, Tech: techTS, DependsOn: []string{"e2e-eslint"}, Run: RunE2EFormat},
	{ID: "e2e-typecheck", DisplayName: "typecheck", App: AppE2E, Tech: techTS, DependsOn: []string{"e2e-format"}, Run: RunE2ETypecheck},
	{ID: "e2e-playwright", DisplayName: "playwright (docker)", App: AppE2E, Tech: techTS, IsSlow: true, Run: RunE2EPlaywright},

	// Repo-wide — docs hygiene (warn-only).
	{ID: "claude-md-length", DisplayName: "CLAUDE.md length", App: AppOther, Tech: techDocs, Run: RunClaudeMdLength},
	{ID: "claude-md-reminder", DisplayName: "CLAUDE.md reminder", App: AppOther, Tech: techDocs, Run: RunClaudeMdReminder},
}

// GetCheckByID returns a check definition by its ID or nickname.
func GetCheckByID(id string) *CheckDefinition {
	for i := range AllChecks {
		if AllChecks[i].ID == id || AllChecks[i].Nickname == id {
			return &AllChecks[i]
		}
	}
	return nil
}

// CLIName returns the name to display/accept in CLI (nickname if set, else ID).
func (c *CheckDefinition) CLIName() string {
	if c.Nickname != "" {
		return c.Nickname
	}
	return c.ID
}

// ValidateCheckNames checks for duplicate IDs/nicknames and for any check name
// that would shadow a reserved selector keyword (app/group names). Called at
// startup to catch configuration mistakes early.
func ValidateCheckNames(reserved ...string) error {
	reservedSet := make(map[string]bool, len(reserved))
	for _, r := range reserved {
		reservedSet[r] = true
	}

	seen := make(map[string]string) // name -> check ID that owns it
	claim := func(name, ownerID, kind string) error {
		if reservedSet[name] {
			return fmt.Errorf("check %s '%s' shadows the reserved selector keyword '%s'", kind, ownerID, name)
		}
		if prev, exists := seen[name]; exists {
			return fmt.Errorf("duplicate check name '%s': used by both '%s' and '%s'", name, prev, ownerID)
		}
		seen[name] = ownerID
		return nil
	}

	for _, check := range AllChecks {
		if err := claim(check.ID, check.ID, "ID"); err != nil {
			return err
		}
		if check.Nickname != "" {
			if err := claim(check.Nickname, check.ID, "nickname"); err != nil {
				return err
			}
		}
	}
	return nil
}

// GetChecksByApp returns all checks for a specific app.
func GetChecksByApp(app App) []CheckDefinition {
	var result []CheckDefinition
	for _, check := range AllChecks {
		if check.App == app {
			result = append(result, check)
		}
	}
	return result
}

// GetChecksByTech returns all checks with a specific tech label, across apps.
func GetChecksByTech(tech string) []CheckDefinition {
	var result []CheckDefinition
	for _, check := range AllChecks {
		if check.Tech == tech {
			result = append(result, check)
		}
	}
	return result
}

// FilterSlowChecks removes slow checks unless includeSlow is true.
func FilterSlowChecks(defs []CheckDefinition, includeSlow bool) []CheckDefinition {
	if includeSlow {
		return defs
	}
	var result []CheckDefinition
	for _, def := range defs {
		if !def.IsSlow {
			result = append(result, def)
		}
	}
	return result
}
