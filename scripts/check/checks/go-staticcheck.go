package checks

import (
	"fmt"
	"os/exec"
	"path/filepath"
	"strings"
)

// staticcheckVersion pins the tool. 2026.1 (v0.7.0) supports Go 1.26. Keep it
// pinned (never @latest): an unpinned install would auto-propagate a compromised
// release to every fresh checkout.
const staticcheckVersion = "honnef.co/go/tools/cmd/staticcheck@v0.7.0"

// goStaticcheck returns a check that runs staticcheck in the given module.
func goStaticcheck(module string) CheckFunc {
	return func(ctx *CheckContext) (CheckResult, error) {
		bin, err := EnsureGoTool("staticcheck", staticcheckVersion)
		if err != nil {
			return CheckResult{}, err
		}

		modDir := filepath.Join(ctx.RootDir, module)
		pkgCount := listPackages(modDir)

		cmd := exec.Command(bin, "./...")
		cmd.Dir = modDir
		output, err := RunCommand(cmd, true)
		if err != nil {
			issueText := strings.TrimSpace(output)
			if issueText == "" {
				issueText = err.Error()
			}
			return CheckResult{}, fmt.Errorf("staticcheck found issues in %s\n%s", module, indentSix(issueText))
		}

		if pkgCount > 0 {
			result := Success(fmt.Sprintf("%d %s checked, no issues", pkgCount, Pluralize(pkgCount, "package", "packages")))
			result.Total = pkgCount
			return result, nil
		}
		return Success("No issues found"), nil
	}
}
