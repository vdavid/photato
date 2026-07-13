package checks

import "fmt"

// RunFrontendBuild runs the Vite production build. A broken build must block the
// deploy the same way a failing test does, so it runs in the default lane.
func RunFrontendBuild(ctx *CheckContext) (CheckResult, error) {
	output, err := RunCommand(pnpmFilter(ctx.RootDir, "./frontend", "build"), true)
	if err != nil {
		return CheckResult{}, fmt.Errorf("frontend build failed\n%s", indentSix(output))
	}
	return Success("build succeeded"), nil
}
