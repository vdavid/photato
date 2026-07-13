package checks

import "fmt"

// RunFrontendSvelteCheck runs svelte-check, the frontend type gate (Vite strips
// types without checking). 0 errors is the bar; ~10 intentional a11y warnings
// don't fail it (frontend/CLAUDE.md).
func RunFrontendSvelteCheck(ctx *CheckContext) (CheckResult, error) {
	output, err := RunCommand(pnpmFilter(ctx.RootDir, "./frontend", "check"), true)
	if err != nil {
		return CheckResult{}, fmt.Errorf("svelte-check found type errors\n%s", indentSix(output))
	}
	return Success("no type errors"), nil
}
