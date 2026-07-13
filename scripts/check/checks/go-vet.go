package checks

import (
	"fmt"
	"os/exec"
	"path/filepath"
)

// goVet returns a check that runs `go vet ./...` in the given module.
func goVet(module string) CheckFunc {
	return func(ctx *CheckContext) (CheckResult, error) {
		modDir := filepath.Join(ctx.RootDir, module)
		pkgCount := listPackages(modDir)

		cmd := exec.Command("go", "vet", "./...")
		cmd.Dir = modDir
		output, err := RunCommand(cmd, true)
		if err != nil {
			return CheckResult{}, fmt.Errorf("go vet found issues in %s\n%s", module, indentSix(output))
		}

		if pkgCount > 0 {
			result := Success(fmt.Sprintf("%d %s checked, no issues", pkgCount, Pluralize(pkgCount, "package", "packages")))
			result.Total = pkgCount
			return result, nil
		}
		return Success("No issues found"), nil
	}
}
