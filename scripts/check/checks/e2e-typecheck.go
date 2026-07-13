package checks

import "fmt"

// RunE2ETypecheck runs `tsc --noEmit` on the e2e specs. Playwright strips types
// without checking, so this is the type gate for the suite (e2e/CLAUDE.md).
func RunE2ETypecheck(ctx *CheckContext) (CheckResult, error) {
	output, err := RunCommand(pnpmFilter(ctx.RootDir, "e2e", "typecheck"), true)
	if err != nil {
		return CheckResult{}, fmt.Errorf("e2e typecheck found type errors\n%s", indentSix(output))
	}
	return Success("no type errors"), nil
}
