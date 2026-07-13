package checks

import (
	"fmt"
	"os/exec"
	"path/filepath"
	"strings"
)

// goFmt returns a check that formats Go code in the given module with
// `gofmt -s`. Outside CI it auto-fixes; in CI it reports drift as a failure.
func goFmt(module string) CheckFunc {
	return func(ctx *CheckContext) (CheckResult, error) {
		modDir := filepath.Join(ctx.RootDir, module)
		fileCount := countFilesWithExt(modDir, ".go")

		// -l lists files that need formatting.
		checkCmd := exec.Command("gofmt", "-s", "-l", ".")
		checkCmd.Dir = modDir
		checkOutput, err := RunCommand(checkCmd, true)
		if err != nil {
			return CheckResult{}, fmt.Errorf("gofmt check failed in %s\n%s", module, indentSix(checkOutput))
		}

		var needsFormat []string
		if strings.TrimSpace(checkOutput) != "" {
			needsFormat = strings.Split(strings.TrimSpace(checkOutput), "\n")
		}

		if ctx.CI {
			if len(needsFormat) > 0 {
				return CheckResult{}, fmt.Errorf("files need formatting, run `gofmt -s -w .` in %s locally\n%s", module, indentSix(checkOutput))
			}
			return goFmtResult(fileCount, 0, false), nil
		}

		if len(needsFormat) > 0 {
			fmtCmd := exec.Command("gofmt", "-s", "-w", ".")
			fmtCmd.Dir = modDir
			if out, err := RunCommand(fmtCmd, true); err != nil {
				return CheckResult{}, fmt.Errorf("gofmt failed in %s\n%s", module, indentSix(out))
			}
			return goFmtResult(fileCount, len(needsFormat), true), nil
		}
		return goFmtResult(fileCount, 0, false), nil
	}
}

// goFmtResult builds the success result for gofmt with counts.
func goFmtResult(total, formatted int, changed bool) CheckResult {
	var result CheckResult
	if changed {
		result = SuccessWithChanges(fmt.Sprintf("Formatted %d of %d %s", formatted, total, Pluralize(total, "file", "files")))
	} else {
		result = Success(fmt.Sprintf("%d %s already formatted", total, Pluralize(total, "file", "files")))
	}
	result.Total = total
	result.Issues = formatted
	result.Changes = formatted
	return result
}

// indentSix indents each non-empty line by six spaces (matches the runner's
// failure-body indent).
func indentSix(output string) string {
	lines := strings.Split(output, "\n")
	var sb strings.Builder
	for _, line := range lines {
		if strings.TrimSpace(line) != "" {
			sb.WriteString("      ")
			sb.WriteString(line)
			sb.WriteString("\n")
		}
	}
	return sb.String()
}
