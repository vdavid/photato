package checks

import "fmt"

// RunFrontendTest runs the frontend unit tests (vitest, `pnpm --filter
// ./frontend test`). Pure-logic tests, no DOM — see frontend/vite.config.ts.
func RunFrontendTest(ctx *CheckContext) (CheckResult, error) {
	output, err := RunCommand(pnpmFilter(ctx.RootDir, "./frontend", "test"), true)
	if err != nil {
		return CheckResult{}, fmt.Errorf("frontend unit tests failed\n%s", indentSix(output))
	}
	return Success("tests passed"), nil
}
