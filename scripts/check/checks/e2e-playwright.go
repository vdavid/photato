package checks

import "fmt"

// RunE2EPlaywright runs the Playwright + pixel-baseline suite through Docker.
// It's a SLOW check and stays out of CI on purpose: the pixel baselines are
// Linux/Docker-only and CI has no browsers (AGENTS.md, e2e/CLAUDE.md). When
// Docker isn't available it skips rather than failing — the suite can only run
// where a Docker daemon is present.
func RunE2EPlaywright(ctx *CheckContext) (CheckResult, error) {
	if !CommandExists("docker") {
		return Skipped("docker not available"), nil
	}
	output, err := RunCommand(pnpmFilter(ctx.RootDir, "e2e", "test:e2e:docker"), true)
	if err != nil {
		return CheckResult{}, fmt.Errorf("e2e Playwright suite failed\n%s", indentSix(output))
	}
	return Success("e2e suite passed"), nil
}
