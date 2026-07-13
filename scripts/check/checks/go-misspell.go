package checks

import (
	"fmt"
	"os/exec"
	"path/filepath"
	"strings"
)

// misspellVersion pins the tool (never @latest; see go-staticcheck.go).
const misspellVersion = "github.com/client9/misspell/cmd/misspell@v0.3.4"

// misspellIgnore lists domain terms misspell wrongly "corrects". "hardlinked" /
// "hardlinks" are correct here (the migrate tool hardlinks salvage files) but
// misspell maps them to "hardline". Comma-separated, passed to `misspell -i`.
const misspellIgnore = "hardlinked,hardlinks"

// goMisspell returns a check that scans the given module's Go files for common
// English spelling mistakes in comments and strings. It deliberately scans .go
// files only, not data files: the message catalog (photato-messages.json) is
// Hungarian, and an English spell-checker only produces false positives there.
func goMisspell(module string) CheckFunc {
	return func(ctx *CheckContext) (CheckResult, error) {
		bin, err := EnsureGoTool("misspell", misspellVersion)
		if err != nil {
			return CheckResult{}, err
		}

		modDir := filepath.Join(ctx.RootDir, module)
		files := goFilesIn(modDir)
		if len(files) == 0 {
			return Success("No Go files to check"), nil
		}

		args := append([]string{"-error", "-i", misspellIgnore}, files...)
		cmd := exec.Command(bin, args...)
		cmd.Dir = modDir
		output, err := RunCommand(cmd, true)
		if err != nil {
			issueText := strings.TrimSpace(output)
			if issueText == "" {
				issueText = err.Error()
			}
			return CheckResult{}, fmt.Errorf("spelling mistakes found in %s\n%s", module, indentSix(issueText))
		}

		result := Success(fmt.Sprintf("%d %s checked, no misspellings", len(files), Pluralize(len(files), "file", "files")))
		result.Total = len(files)
		return result, nil
	}
}
