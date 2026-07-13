package checks

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"syscall"
)

// ANSI colors reused inside check messages (the runner owns the rest).
const (
	ansiYellow = "\033[33m"
	ansiReset  = "\033[0m"
)

// App represents the application a check belongs to.
type App string

const (
	AppBackend  App = "backend"  // backend-go module
	AppScripts  App = "scripts"  // scripts/check module (the checker itself)
	AppFrontend App = "frontend" // Svelte SPA (checks added by the frontend owner)
	AppE2E      App = "e2e"      // Playwright suite (checks added by the e2e owner)
	AppOther    App = "other"    // repo-wide checks (docs hygiene, etc.)
)

// AppDisplayName returns a human-readable name for an app with icon.
func AppDisplayName(app App) string {
	switch app {
	case AppBackend:
		return "⚙️  Backend"
	case AppScripts:
		return "📜 Scripts"
	case AppFrontend:
		return "🎨 Frontend"
	case AppE2E:
		return "🎭 E2E"
	case AppOther:
		return "📦 Other"
	default:
		return string(app)
	}
}

// ResultCode indicates the outcome of a check.
type ResultCode int

const (
	ResultSuccess ResultCode = iota
	ResultWarning
	ResultSkipped
)

// CheckResult is returned by checks on success.
type CheckResult struct {
	Code        ResultCode
	Message     string
	MadeChanges bool // true if the check modified files (for example, formatted code)
	Total       int  // items checked (-1 = N/A)
	Issues      int  // items needing attention (-1 = N/A)
	Changes     int  // files modified (-1 = N/A)
}

// Success creates a success result with the given message (no changes made).
func Success(message string) CheckResult {
	return CheckResult{Code: ResultSuccess, Message: message, Total: -1, Issues: -1, Changes: -1}
}

// SuccessWithChanges creates a success result indicating files were modified.
func SuccessWithChanges(message string) CheckResult {
	return CheckResult{Code: ResultSuccess, Message: message, MadeChanges: true, Total: -1, Issues: -1, Changes: -1}
}

// Warning creates a warn-only result (the run still passes).
func Warning(message string) CheckResult {
	return CheckResult{Code: ResultWarning, Message: message, Total: -1, Issues: -1, Changes: -1}
}

// Skipped creates a skipped result (the run still passes). Used when a check
// can't run because a prerequisite is absent (for example, Docker missing for
// the Playwright suite), rather than because anything is wrong.
func Skipped(message string) CheckResult {
	return CheckResult{Code: ResultSkipped, Message: message, Total: -1, Issues: -1, Changes: -1}
}

// CheckContext holds the context for running checks.
type CheckContext struct {
	CI      bool
	Verbose bool
	RootDir string
}

// CheckFunc is the function signature for check implementations.
type CheckFunc func(ctx *CheckContext) (CheckResult, error)

// CheckDefinition defines a check's metadata and implementation.
type CheckDefinition struct {
	ID          string
	Nickname    string // Short alias shown in --help and accepted by --check (if empty, ID is used)
	DisplayName string
	App         App
	Tech        string
	IsSlow      bool
	DependsOn   []string
	Run         CheckFunc
}

// processTracker keeps track of all running child processes so they can be
// killed as a group on Ctrl+C. Each command is started with its own process
// group (Setpgid), so killing -pgid cleans up all its descendants too.
var processTracker = struct {
	mu    sync.Mutex
	procs map[*exec.Cmd]struct{}
}{procs: make(map[*exec.Cmd]struct{})}

// KillAllProcesses sends SIGTERM to the process group of every tracked child.
func KillAllProcesses() {
	processTracker.mu.Lock()
	defer processTracker.mu.Unlock()
	for cmd := range processTracker.procs {
		if cmd.Process != nil {
			// Kill the entire process group (negative PID).
			_ = syscall.Kill(-cmd.Process.Pid, syscall.SIGTERM)
		}
	}
}

// RunCommand executes a command and captures its output. The command is started
// in its own process group so that all of its descendants can be killed together
// on shutdown.
func RunCommand(cmd *exec.Cmd, captureOutput bool) (string, error) {
	var stdout, stderr bytes.Buffer
	if captureOutput {
		cmd.Stdout = &stdout
		cmd.Stderr = &stderr
	} else {
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
	}

	// Give the child its own process group so we can kill the whole tree.
	cmd.SysProcAttr = &syscall.SysProcAttr{Setpgid: true}

	if err := cmd.Start(); err != nil {
		return "", err
	}

	processTracker.mu.Lock()
	processTracker.procs[cmd] = struct{}{}
	processTracker.mu.Unlock()

	err := cmd.Wait()

	processTracker.mu.Lock()
	delete(processTracker.procs, cmd)
	processTracker.mu.Unlock()

	output := stdout.String()
	if stderr.Len() > 0 {
		output += stderr.String()
	}
	return output, err
}

// CommandExists checks if a command exists in PATH.
func CommandExists(name string) bool {
	_, err := exec.LookPath(name)
	return err == nil
}

// EnsureGoTool ensures a Go tool is installed and returns the path to the binary.
// installPath MUST pin an explicit version (`@vX.Y.Z`, never `@latest`): an
// unpinned install lets a compromised tool repo auto-propagate to every fresh
// checkout. If the tool is already in PATH, returns just the name; otherwise it
// runs `go install installPath` and returns the full path to the installed binary.
func EnsureGoTool(name, installPath string) (string, error) {
	if CommandExists(name) {
		return name, nil
	}

	goBin := getGoBinDir()
	if goBin == "" {
		return "", fmt.Errorf("could not determine Go bin directory")
	}

	installCmd := exec.Command("go", "install", installPath)
	if out, err := RunCommand(installCmd, true); err != nil {
		return "", fmt.Errorf("failed to install %s: %w\n%s", name, err, out)
	}

	return filepath.Join(goBin, name), nil
}

// getGoBinDir returns the directory where `go install` puts binaries.
func getGoBinDir() string {
	if out, err := RunCommand(exec.Command("go", "env", "GOBIN"), true); err == nil {
		if bin := strings.TrimSpace(out); bin != "" {
			return bin
		}
	}
	if out, err := RunCommand(exec.Command("go", "env", "GOPATH"), true); err == nil {
		if gopath := strings.TrimSpace(out); gopath != "" {
			return filepath.Join(gopath, "bin")
		}
	}
	if home, err := os.UserHomeDir(); err == nil {
		return filepath.Join(home, "go", "bin")
	}
	return ""
}

// Pluralize returns singular if count is 1, plural otherwise.
func Pluralize(count int, singular, plural string) string {
	if count == 1 {
		return singular
	}
	return plural
}

// countFilesWithExt counts files with the given extension under dir (recursive).
func countFilesWithExt(dir, ext string) int {
	findCmd := exec.Command("find", ".", "-name", "*"+ext, "-type", "f")
	findCmd.Dir = dir
	out, _ := RunCommand(findCmd, true)
	if strings.TrimSpace(out) == "" {
		return 0
	}
	return len(strings.Split(strings.TrimSpace(out), "\n"))
}

// goFilesIn returns paths (relative to dir) of every .go file under dir.
func goFilesIn(dir string) []string {
	findCmd := exec.Command("find", ".", "-name", "*.go", "-type", "f")
	findCmd.Dir = dir
	out, _ := RunCommand(findCmd, true)
	var files []string
	for line := range strings.SplitSeq(strings.TrimSpace(out), "\n") {
		if line != "" {
			files = append(files, line)
		}
	}
	return files
}

// listPackages returns the count of Go packages under modDir (`go list ./...`).
func listPackages(modDir string) int {
	listCmd := exec.Command("go", "list", "./...")
	listCmd.Dir = modDir
	out, _ := RunCommand(listCmd, true)
	if strings.TrimSpace(out) == "" {
		return 0
	}
	return len(strings.Split(strings.TrimSpace(out), "\n"))
}

// findClaudeMdFiles returns repo-relative paths to all tracked CLAUDE.md files.
// Git-aware (uses `git ls-files`), so it excludes gitignored scratch/build output
// and never-committed files, and it agrees with what actually ships.
func findClaudeMdFiles(rootDir string) ([]string, error) {
	cmd := exec.Command("git", "ls-files", "CLAUDE.md", "*/CLAUDE.md")
	cmd.Dir = rootDir
	out, err := RunCommand(cmd, true)
	if err != nil {
		return nil, fmt.Errorf("git ls-files: %w\n%s", err, out)
	}
	var files []string
	for line := range strings.SplitSeq(strings.TrimSpace(out), "\n") {
		if line != "" {
			files = append(files, line)
		}
	}
	return files, nil
}
