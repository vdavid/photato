package checks

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"time"
)

// pnpmMarkerName lives under the root node_modules and records the lockfile
// mtime of the last successful local install, so a repeat run with an unchanged
// lockfile skips `pnpm install`.
const pnpmMarkerName = ".pnpm-install-marker"

// pnpmFilter builds a `pnpm --filter <filter> <args...>` command rooted at the
// repo. Every frontend/e2e check goes through the package's own npm scripts
// (see frontend/CLAUDE.md, e2e/CLAUDE.md) so the checker never re-encodes their
// tooling. filter is `./frontend` or `e2e`.
func pnpmFilter(rootDir, filter string, args ...string) *exec.Cmd {
	cmd := exec.Command("pnpm", append([]string{"--filter", filter}, args...)...)
	cmd.Dir = rootDir
	return cmd
}

// runFormatCheck verifies formatting via the package's `format:check` script.
// In CI a drift is a hard failure. Locally it auto-fixes via `format` and
// reports the changes (mirroring how the Go gofmt check behaves).
func runFormatCheck(ctx *CheckContext, filter string) (CheckResult, error) {
	output, err := RunCommand(pnpmFilter(ctx.RootDir, filter, "format:check"), true)
	if err == nil {
		return Success("formatting OK"), nil
	}
	if ctx.CI {
		return CheckResult{}, fmt.Errorf("%s is not formatted (run `pnpm --filter %s format`)\n%s", filter, filter, indentSix(output))
	}
	fixOutput, fixErr := RunCommand(pnpmFilter(ctx.RootDir, filter, "format"), true)
	if fixErr != nil {
		return CheckResult{}, fmt.Errorf("%s formatting failed\n%s", filter, indentSix(fixOutput))
	}
	return SuccessWithChanges("formatted files"), nil
}

// EnsurePnpmDependencies runs `pnpm install` at the repo root so the workspace's
// node_modules is present before any frontend/e2e check runs. It skips the
// install when the lockfile hasn't changed since the last successful local run.
// In CI it uses --frozen-lockfile and never skips. Returns true if it skipped.
func EnsurePnpmDependencies(ctx *CheckContext) (skipped bool, err error) {
	lockfilePath := filepath.Join(ctx.RootDir, "pnpm-lock.yaml")
	markerPath := filepath.Join(ctx.RootDir, "node_modules", pnpmMarkerName)

	if !ctx.CI {
		if lockInfo, lockErr := os.Stat(lockfilePath); lockErr == nil {
			if markerContent, markerErr := os.ReadFile(markerPath); markerErr == nil {
				if string(markerContent) == formatMtime(lockInfo) {
					return true, nil
				}
			}
		}
	}

	args := []string{"install"}
	if ctx.CI {
		args = append(args, "--frozen-lockfile")
	}
	cmd := exec.Command("pnpm", args...)
	cmd.Dir = ctx.RootDir
	if output, runErr := RunCommand(cmd, true); runErr != nil {
		return false, fmt.Errorf("pnpm install failed:\n%s", indentSix(output))
	}

	if lockInfo, lockErr := os.Stat(lockfilePath); lockErr == nil {
		_ = os.WriteFile(markerPath, []byte(formatMtime(lockInfo)), 0644)
	}
	return false, nil
}

// formatMtime renders a file's modification time as a stable marker string.
func formatMtime(info os.FileInfo) string {
	return info.ModTime().UTC().Format(time.RFC3339Nano)
}
