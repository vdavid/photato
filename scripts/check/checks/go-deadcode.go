package checks

import (
	"fmt"
	"os/exec"
	"path/filepath"
	"strings"
)

// deadcodeVersion pins the tool (never @latest; see go-staticcheck.go).
const deadcodeVersion = "golang.org/x/tools/cmd/deadcode@v0.48.0"

// goDeadcode returns a check that flags unreachable functions in the given
// module using Go's deadcode tool.
func goDeadcode(module string) CheckFunc {
	return func(ctx *CheckContext) (CheckResult, error) {
		bin, err := EnsureGoTool("deadcode", deadcodeVersion)
		if err != nil {
			return CheckResult{}, fmt.Errorf("failed to install deadcode: %w", err)
		}

		modDir := filepath.Join(ctx.RootDir, module)

		// deadcode exits 0 even when it finds issues; findings go to stdout.
		cmd := exec.Command(bin, "./...")
		cmd.Dir = modDir
		output, err := RunCommand(cmd, true)
		if err != nil {
			return CheckResult{}, fmt.Errorf("deadcode failed in %s: %w\n%s", module, err, indentSix(output))
		}

		output = strings.TrimSpace(output)
		if output != "" {
			lines := strings.Split(output, "\n")
			return CheckResult{}, fmt.Errorf("found %d unreachable %s in %s:\n%s",
				len(lines), Pluralize(len(lines), "function", "functions"), module, indentSix(output))
		}

		return Success("no dead code"), nil
	}
}
