package checks

import (
	"fmt"
	"os/exec"
	"path/filepath"
	"regexp"
)

var (
	goTestOKRe     = regexp.MustCompile(`(?m)^ok\s+`)
	goTestNoTestRe = regexp.MustCompile(`(?m)\[no test files]`)
)

// goTests returns a check that runs `go test ./...` in the given module. When
// race is true it adds `-race` (the data-race detector), which is slower and is
// therefore registered as a slow-lane check.
func goTests(module string, race bool) CheckFunc {
	return func(ctx *CheckContext) (CheckResult, error) {
		modDir := filepath.Join(ctx.RootDir, module)

		args := []string{"test"}
		if race {
			args = append(args, "-race")
		}
		args = append(args, "./...")

		cmd := exec.Command("go", args...)
		cmd.Dir = modDir
		output, err := RunCommand(cmd, true)
		if err != nil {
			return CheckResult{}, fmt.Errorf("tests failed in %s\n%s", module, indentSix(output))
		}

		pkgCount := len(goTestOKRe.FindAllString(output, -1)) + len(goTestNoTestRe.FindAllString(output, -1))
		label := "passed"
		if race {
			label = "passed (race)"
		}
		if pkgCount > 0 {
			result := Success(fmt.Sprintf("%d %s %s", pkgCount, Pluralize(pkgCount, "package", "packages"), label))
			result.Total = pkgCount
			return result, nil
		}
		return Success("all tests " + label), nil
	}
}
