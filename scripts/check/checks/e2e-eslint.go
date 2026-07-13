package checks

import "fmt"

// RunE2EESLint runs ESLint on the e2e package. Locally it autofixes (`lint:fix`);
// in CI it reports only (`lint`). Errors-only gate, same as the frontend.
func RunE2EESLint(ctx *CheckContext) (CheckResult, error) {
	script := "lint:fix"
	if ctx.CI {
		script = "lint"
	}
	output, err := RunCommand(pnpmFilter(ctx.RootDir, "e2e", script), true)
	if err != nil {
		return CheckResult{}, fmt.Errorf("e2e eslint found errors (run `pnpm --filter e2e lint:fix`)\n%s", indentSix(output))
	}
	return Success("lint passed"), nil
}
