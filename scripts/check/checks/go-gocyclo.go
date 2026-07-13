package checks

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
)

// gocycloVersion pins the tool (never @latest; see go-staticcheck.go).
const gocycloVersion = "github.com/fzipp/gocyclo/cmd/gocyclo@v0.6.0"

// GocycloThreshold is the maximum cyclomatic complexity allowed per function.
// Functions above it must either be simplified or carry an allowlist entry
// (accepted, ratchet-only debt) in gocyclo-allowlist.json.
const GocycloThreshold = 15

// gocycloAllowlist is the on-disk shape of gocyclo-allowlist.json. `Functions`
// maps "<module>::<pkg>.<func>" to the accepted complexity — a ratchet the
// function may not exceed. New over-threshold functions (not listed) fail.
type gocycloAllowlist struct {
	Comment   string         `json:"$comment,omitempty"`
	Functions map[string]int `json:"functions"`
}

// overThresholdFunc is one gocyclo finding above the threshold.
type overThresholdFunc struct {
	key        string // "<module>::<pkg>.<func>"
	complexity int
	display    string // human-readable "<complexity> <pkg> <func> <file>:<line>"
}

func gocycloAllowlistPath(rootDir string) string {
	return filepath.Join(rootDir, "scripts", "check", "checks", "gocyclo-allowlist.json")
}

func loadGocycloAllowlist(rootDir string) gocycloAllowlist {
	list := gocycloAllowlist{Functions: map[string]int{}}
	data, err := os.ReadFile(gocycloAllowlistPath(rootDir))
	if err != nil {
		return list
	}
	if err := json.Unmarshal(data, &list); err != nil {
		return gocycloAllowlist{Functions: map[string]int{}}
	}
	if list.Functions == nil {
		list.Functions = map[string]int{}
	}
	return list
}

// goGocyclo returns a check that flags functions in the given module whose
// cyclomatic complexity exceeds GocycloThreshold, minus allowlisted (ratcheted)
// functions. Outside CI it shrink-wraps the allowlist for this module: entries
// whose function dropped under the threshold or shrank are removed/ratcheted.
func goGocyclo(module string) CheckFunc {
	return func(ctx *CheckContext) (CheckResult, error) {
		bin, err := EnsureGoTool("gocyclo", gocycloVersion)
		if err != nil {
			return CheckResult{}, err
		}

		modDir := filepath.Join(ctx.RootDir, module)
		fileCount := countFilesWithExt(modDir, ".go")

		// gocyclo exits 1 and prints one line per function over the threshold.
		cmd := exec.Command(bin, "-over", strconv.Itoa(GocycloThreshold), ".")
		cmd.Dir = modDir
		output, _ := RunCommand(cmd, true)
		over := parseGocyclo(module, output)

		allowlist := loadGocycloAllowlist(ctx.RootDir)
		staleChanges := shrinkwrapGocyclo(module, &allowlist, over)
		if len(staleChanges) > 0 && !ctx.CI {
			if err := writeJSONAllowlist(gocycloAllowlistPath(ctx.RootDir), allowlist); err != nil {
				return CheckResult{}, err
			}
		}

		var violations []overThresholdFunc
		for _, f := range over {
			if allowed, ok := allowlist.Functions[f.key]; ok && f.complexity <= allowed {
				continue
			}
			violations = append(violations, f)
		}

		if len(violations) > 0 {
			return CheckResult{}, fmt.Errorf("%s", formatGocycloViolations(module, violations, allowlist))
		}

		return gocycloSuccess(fileCount, len(over), staleChanges, ctx.CI), nil
	}
}

// parseGocyclo turns gocyclo's output into structured over-threshold findings.
// Line shape: "<complexity> <pkg> <func> <file>:<line>:<col>".
func parseGocyclo(module, output string) []overThresholdFunc {
	var out []overThresholdFunc
	for line := range strings.SplitSeq(strings.TrimSpace(output), "\n") {
		fields := strings.Fields(line)
		if len(fields) < 4 {
			continue
		}
		complexity, err := strconv.Atoi(fields[0])
		if err != nil {
			continue
		}
		pkg, fn := fields[1], fields[2]
		out = append(out, overThresholdFunc{
			key:        module + "::" + pkg + "." + fn,
			complexity: complexity,
			display:    fmt.Sprintf("%d %s %s %s/%s", complexity, pkg, fn, module, fields[3]),
		})
	}
	return out
}

// shrinkwrapGocyclo removes/ratchets this module's stale allowlist entries: an
// entry whose function is no longer over the threshold is removed; one whose
// complexity dropped is ratcheted down. Only touches keys for this module, so a
// per-module run never disturbs another module's entries. Returns one line per change.
func shrinkwrapGocyclo(module string, list *gocycloAllowlist, over []overThresholdFunc) []string {
	current := make(map[string]int, len(over))
	for _, f := range over {
		current[f.key] = f.complexity
	}
	prefix := module + "::"

	var changes []string
	for _, key := range sortedKeys(list.Functions) {
		if !strings.HasPrefix(key, prefix) {
			continue
		}
		allowed := list.Functions[key]
		cur, stillOver := current[key]
		switch {
		case !stillOver:
			delete(list.Functions, key)
			changes = append(changes, fmt.Sprintf("removed %s (now under the %d threshold)", key, GocycloThreshold))
		case cur < allowed:
			list.Functions[key] = cur
			changes = append(changes, fmt.Sprintf("ratcheted %s: %d → %d", key, allowed, cur))
		}
	}
	return changes
}

// formatGocycloViolations builds the failure body for new/grown over-threshold functions.
func formatGocycloViolations(module string, violations []overThresholdFunc, list gocycloAllowlist) string {
	sort.Slice(violations, func(i, j int) bool { return violations[i].key < violations[j].key })
	var sb strings.Builder
	for _, v := range violations {
		note := ""
		if allowed, ok := list.Functions[v.key]; ok {
			note = fmt.Sprintf("  (allowlisted at %d, now %d — reduce it or update the allowlist deliberately)", allowed, v.complexity)
		}
		sb.WriteString("  " + v.display + note + "\n")
	}
	return fmt.Sprintf("functions exceed complexity threshold of %d in %s:\n%s"+
		"Simplify them, or (for accepted debt) add a gocyclo-allowlist.json entry.",
		GocycloThreshold, module, sb.String())
}

// gocycloSuccess builds the pass result, folding in any allowlist shrink-wrap note.
func gocycloSuccess(fileCount, overCount int, staleChanges []string, ci bool) CheckResult {
	msg := fmt.Sprintf("%d %s checked, complexity OK", fileCount, Pluralize(fileCount, "file", "files"))
	if overCount > 0 {
		msg += fmt.Sprintf(" (%d allowlisted)", overCount)
	}
	if len(staleChanges) == 0 {
		result := Success(msg)
		result.Total = fileCount
		return result
	}
	verb := "Shrink-wrapped allowlist"
	if ci {
		verb = "Stale allowlist entries (a local run shrink-wraps them)"
	}
	msg += fmt.Sprintf("; %s:\n  - %s", verb, strings.Join(staleChanges, "\n  - "))
	if ci {
		return Warning(msg)
	}
	result := SuccessWithChanges(msg)
	result.Total = fileCount
	return result
}
