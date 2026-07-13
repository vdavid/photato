package checks

import "fmt"

// RunFrontendESLint runs ESLint on the frontend package. Locally it uses
// `lint:fix` (autofixes what it can); in CI it uses `lint` (report-only). The
// gate is errors-only — `no-console` is warn-level by design (frontend/CLAUDE.md),
// and warnings never fail the run.
func RunFrontendESLint(ctx *CheckContext) (CheckResult, error) {
	script := "lint:fix"
	if ctx.CI {
		script = "lint"
	}
	output, err := RunCommand(pnpmFilter(ctx.RootDir, "./frontend", script), true)
	if err != nil {
		return CheckResult{}, fmt.Errorf("frontend eslint found errors (run `pnpm --filter ./frontend lint:fix`)\n%s", indentSix(output))
	}
	return Success("lint passed"), nil
}
