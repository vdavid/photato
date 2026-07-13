package main

import (
	"errors"
	"flag"
	"fmt"
	"io"
	"os"
	"os/signal"
	"sort"
	"strings"
	"syscall"
	"time"

	"github.com/vdavid/photato/scripts/check/checks"
)

// stringSlice implements flag.Value for accumulating multiple flag values.
type stringSlice []string

func (s *stringSlice) String() string {
	return strings.Join(*s, ",")
}

func (s *stringSlice) Set(value string) error {
	for v := range strings.SplitSeq(value, ",") {
		v = strings.TrimSpace(v)
		if v != "" {
			*s = append(*s, v)
		}
	}
	return nil
}

// cliFlags holds the parsed command-line flags.
type cliFlags struct {
	goOnly      bool
	appNames    []string
	checkNames  []string
	ciMode      bool
	verbose     bool
	includeSlow bool
	onlySlow    bool
	failFast    bool
	noLog       bool
	allowMain   bool // permit running in the main clone instead of a worktree (checks mutate the tree)
}

func main() {
	// Kill all child process groups on Ctrl+C / SIGTERM so no orphans are left behind.
	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-sigCh
		checks.KillAllProcesses()
		os.Exit(130) // 128 + SIGINT(2)
	}()

	// Validate check configuration at startup to catch nickname collisions early.
	if err := checks.ValidateCheckNames(reservedSelectorNames...); err != nil {
		printError("Bad check configuration: %v", err)
		os.Exit(1)
	}

	var cliArgs []string
	if len(os.Args) > 1 {
		cliArgs = os.Args[1:]
	}
	flags, err := parseFlags(cliArgs)
	if errors.Is(err, flag.ErrHelp) {
		showUsage()
		return
	}
	if err != nil {
		printError("%v", err)
		os.Exit(1)
	}

	rootDir, err := findRootDir()
	if err != nil {
		printError("Error: %v", err)
		os.Exit(1)
	}

	enforceMainCloneGuard(flags, rootDir)

	ctx := &checks.CheckContext{
		CI:      flags.ciMode,
		Verbose: flags.verbose,
		RootDir: rootDir,
	}

	checksToRun, err := selectChecks(flags)
	if err != nil {
		printError("Error: %v", err)
		os.Exit(1)
	}

	checksToRun = applyLaneFilters(checksToRun, flags)

	if len(checksToRun) == 0 {
		fmt.Println("No checks to run.")
		os.Exit(0)
	}

	ensurePnpmIfNeeded(ctx, checksToRun)

	runChecks(ctx, checksToRun, flags.failFast, flags.noLog)
}

// ensurePnpmIfNeeded installs the pnpm workspace deps once, up front, when any
// selected check needs them (frontend/e2e). Pure-Go runs skip this entirely, so
// they never pay for a node_modules install.
func ensurePnpmIfNeeded(ctx *checks.CheckContext, checksToRun []checks.CheckDefinition) {
	if !needsPnpmInstall(checksToRun) {
		return
	}
	fmt.Print("📦 Ensuring pnpm dependencies are installed... ")
	skipped, err := checks.EnsurePnpmDependencies(ctx)
	if err != nil {
		fmt.Printf("%sFAILED%s\n", colorRed, colorReset)
		printError("%v", err)
		os.Exit(1)
	}
	if skipped {
		fmt.Printf("%sOK%s (lockfile unchanged)\n\n", colorGreen, colorReset)
	} else {
		fmt.Printf("%sOK%s\n\n", colorGreen, colorReset)
	}
}

// needsPnpmInstall reports whether any selected check runs through pnpm (the
// frontend or e2e apps).
func needsPnpmInstall(checksToRun []checks.CheckDefinition) bool {
	for _, c := range checksToRun {
		if c.App == checks.AppFrontend || c.App == checks.AppE2E {
			return true
		}
	}
	return false
}

// applyLaneFilters narrows the selected checks by the slow lane flags.
func applyLaneFilters(checksToRun []checks.CheckDefinition, flags *cliFlags) []checks.CheckDefinition {
	checksToRun = checks.FilterSlowChecks(checksToRun, flags.includeSlow)
	if !flags.onlySlow {
		return checksToRun
	}
	var slow []checks.CheckDefinition
	for _, c := range checksToRun {
		if c.IsSlow {
			slow = append(slow, c)
		}
	}
	return slow
}

// reservedSelectorNames are the app and tech-group keywords accepted as
// positional selectors (and by --app / the group flags). ValidateCheckNames
// rejects any check ID/nickname that would shadow one, because positional
// resolution tries check names first.
var reservedSelectorNames = []string{"backend", "scripts", "frontend", "e2e", "other", "go"}

// parseFlags parses command-line flags and positional selectors (check names,
// app names, and the go tech group, in any order and mix; commas work too).
// Returns flag.ErrHelp when help was requested.
func parseFlags(args []string) (*cliFlags, error) {
	fs := flag.NewFlagSet("check", flag.ContinueOnError)
	fs.SetOutput(io.Discard) // Errors are returned, not printed; main owns the output.
	var (
		goOnly      = fs.Bool("go", false, "Run only Go checks (backend + scripts)")
		goOnly2     = fs.Bool("go-only", false, "Run only Go checks (backend + scripts)")
		appNames    stringSlice
		checkNames  stringSlice
		ciMode      = fs.Bool("ci", false, "Disable auto-fixing (for CI)")
		verbose     = fs.Bool("verbose", false, "Show detailed output")
		includeSlow = fs.Bool("include-slow", false, "Include slow checks (excluded by default)")
		onlySlow    = fs.Bool("only-slow", false, "Run only slow checks")
		failFast    = fs.Bool("fail-fast", false, "Stop on first failure")
		noLog       = fs.Bool("no-log", false, "Disable CSV stats logging")
		allowMain   = fs.Bool("allow-main", false, "Allow running in the main clone instead of a worktree")
		help        = fs.Bool("help", false, "Show help message")
		h           = fs.Bool("h", false, "Show help message")
	)
	fs.Var(&appNames, "app", "Run checks for specific apps (repeatable or comma-separated)")
	fs.Var(&checkNames, "check", "Run specific checks by ID (same as naming them positionally)")
	// `-m` is the short alias for --allow-main.
	fs.BoolVar(allowMain, "m", false, "Allow running in the main clone (short for --allow-main)")

	positionals, err := parseInterspersed(fs, args)
	if err != nil {
		return nil, err
	}
	if *help || *h {
		return nil, flag.ErrHelp
	}

	flags := &cliFlags{
		goOnly:     *goOnly || *goOnly2,
		appNames:   appNames,
		checkNames: checkNames,
		ciMode:     *ciMode,
		verbose:    *verbose,
		onlySlow:   *onlySlow,
		failFast:   *failFast,
		noLog:      *noLog || *ciMode,
		allowMain:  *allowMain,
	}

	if err := applyPositionalSelectors(flags, positionals); err != nil {
		return nil, err
	}

	// Named checks (positional or --check) run even when slow, an escape hatch;
	// group/app selectors keep the default lanes.
	flags.includeSlow = *includeSlow || *onlySlow || len(flags.checkNames) > 0

	return flags, nil
}

// parseInterspersed parses flags and positional args in any order. Go's stdlib
// flag stops at the first positional arg, so this re-parses the remainder until
// everything is consumed.
func parseInterspersed(fs *flag.FlagSet, args []string) ([]string, error) {
	var positionals []string
	for {
		if err := fs.Parse(args); err != nil {
			return nil, err
		}
		rest := fs.Args()
		if len(rest) == 0 {
			return positionals, nil
		}
		n := 0
		for n < len(rest) && !strings.HasPrefix(rest[n], "-") {
			n++
		}
		if n == 0 {
			// Only reachable after a literal `--`: treat the rest as positional.
			return append(positionals, rest...), nil
		}
		positionals = append(positionals, rest[:n]...)
		if n == len(rest) {
			return positionals, nil
		}
		args = rest[n:]
	}
}

// applyPositionalSelectors classifies each positional token (splitting on
// commas) into the matching cliFlags fields.
func applyPositionalSelectors(flags *cliFlags, positionals []string) error {
	for _, token := range positionals {
		for part := range strings.SplitSeq(token, ",") {
			part = strings.TrimSpace(part)
			if part == "" {
				continue
			}
			if err := applySelector(flags, part); err != nil {
				return err
			}
		}
	}
	return nil
}

// applySelector classifies one positional selector. Check IDs/nicknames behave
// like --check (named checks run even if slow); app names and the `go` tech
// group behave like --app / --go. Keep the keywords in sync with
// reservedSelectorNames; a test guards the pairing.
func applySelector(flags *cliFlags, name string) error {
	if checks.GetCheckByID(name) != nil {
		flags.checkNames = append(flags.checkNames, name)
		return nil
	}
	switch strings.ToLower(name) {
	case "backend", "scripts", "frontend", "e2e", "other":
		flags.appNames = append(flags.appNames, strings.ToLower(name))
	case "go":
		flags.goOnly = true
	default:
		return fmt.Errorf("unknown check or group: %s\nRun './scripts/check.sh --help' to see available checks and groups", name)
	}
	return nil
}

// selectChecks determines which checks to run based on flags.
// Selectors are additive: `check gofmt backend` runs gofmt plus all backend checks.
func selectChecks(flags *cliFlags) ([]checks.CheckDefinition, error) {
	hasFilter := len(flags.checkNames) > 0 || len(flags.appNames) > 0 || flags.goOnly
	if !hasFilter {
		return checks.AllChecks, nil
	}

	seen := make(map[string]bool)
	var result []checks.CheckDefinition
	addUnique := func(cs []checks.CheckDefinition) {
		for _, c := range cs {
			if !seen[c.ID] {
				seen[c.ID] = true
				result = append(result, c)
			}
		}
	}

	if len(flags.checkNames) > 0 {
		named, err := selectChecksByID(flags.checkNames)
		if err != nil {
			return nil, err
		}
		addUnique(named)
	}
	for _, appName := range flags.appNames {
		byApp, err := selectChecksByApp(appName)
		if err != nil {
			return nil, err
		}
		addUnique(byApp)
	}
	if flags.goOnly {
		addUnique(checks.GetChecksByTech("🐹 Go"))
	}

	return result, nil
}

// selectChecksByID returns checks matching the given IDs.
func selectChecksByID(names []string) ([]checks.CheckDefinition, error) {
	var result []checks.CheckDefinition
	for _, name := range names {
		check := checks.GetCheckByID(name)
		if check == nil {
			return nil, fmt.Errorf("unknown check ID: %s\nRun with --help to see available checks", name)
		}
		result = append(result, *check)
	}
	return result, nil
}

// selectChecksByApp returns checks for the given app name.
func selectChecksByApp(appName string) ([]checks.CheckDefinition, error) {
	app := checks.App(strings.ToLower(appName))
	switch app {
	case checks.AppBackend, checks.AppScripts, checks.AppFrontend, checks.AppE2E, checks.AppOther:
		return checks.GetChecksByApp(app), nil
	default:
		return nil, fmt.Errorf("unknown app: %s\nAvailable apps: backend, scripts, frontend, e2e, other", appName)
	}
}

// runChecks executes the checks and prints results.
func runChecks(ctx *checks.CheckContext, checksToRun []checks.CheckDefinition, failFast, noLog bool) {
	fmt.Printf("🔍 Running %d %s...\n\n", len(checksToRun), checks.Pluralize(len(checksToRun), "check", "checks"))

	startTime := time.Now()
	runner := NewRunner(ctx, checksToRun, failFast, noLog)
	failed, failedChecks := runner.Run()

	totalDuration := time.Since(startTime)
	fmt.Println()
	fmt.Printf("%s⏱️  Total runtime: %s%s\n", colorYellow, formatDuration(totalDuration), colorReset)

	if failed {
		printFailure(failedChecks)
		os.Exit(1)
	}

	fmt.Printf("%s✅ All checks passed!%s\n", colorGreen, colorReset)
}

// printFailure prints the failure message with rerun instructions.
func printFailure(failedChecks []string) {
	fmt.Printf("%s❌ Some checks failed.%s\n", colorRed, colorReset)
	if len(failedChecks) > 0 {
		fmt.Println()
		checkWord := "check"
		if len(failedChecks) > 1 {
			checkWord = "checks"
		}
		fmt.Printf("To rerun the failed %s: ./scripts/check.sh --check %s\n", checkWord, strings.Join(failedChecks, ","))
	}
}

// showUsage displays the help message with dynamically generated check list.
func showUsage() {
	fmt.Println("Usage: ./scripts/check.sh [OPTIONS] [CHECK|GROUP ...]")
	fmt.Println()
	fmt.Println("Run code quality checks for the Photato project.")
	fmt.Println()
	fmt.Println("Name what to run as positional args, in any mix (flags can go anywhere):")
	fmt.Println("    - Check IDs or nicknames (run even if slow): gofmt, vet, backend-tests, ...")
	fmt.Println("    - App names: backend, scripts, frontend, e2e, other")
	fmt.Println("    - Tech group: go")
	fmt.Println("Comma-separated works too: ./scripts/check.sh gofmt,vet")
	fmt.Println()
	fmt.Println("OPTIONS:")
	fmt.Println("    --app NAME               Run checks for specific apps (repeatable or comma-separated)")
	fmt.Println("    --go, --go-only          Run only Go checks (backend + scripts)")
	fmt.Println("    --check ID               Run specific checks by ID (same as naming them positionally)")
	fmt.Println("    --ci                     Disable auto-fixing (for CI)")
	fmt.Println("    --allow-main, -m         Allow running in the main clone instead of a worktree")
	fmt.Println("    --verbose                Show detailed output")
	fmt.Println("    --include-slow           Include slow checks (excluded by default)")
	fmt.Println("    --only-slow              Run only slow checks")
	fmt.Println("    --fail-fast              Stop on first failure")
	fmt.Println("    --no-log                 Disable CSV stats logging (~/" + csvFileName + ")")
	fmt.Println("    -h, --help               Show this help message")
	fmt.Println()
	fmt.Println("If nothing is named, runs all non-slow checks.")
	fmt.Println()
	fmt.Println("EXAMPLES:")
	fmt.Println("    ./scripts/check.sh                    # Run all checks")
	fmt.Println("    ./scripts/check.sh gofmt              # Run one check")
	fmt.Println("    ./scripts/check.sh backend            # Run the backend app group")
	fmt.Println("    ./scripts/check.sh go                 # Run all Go checks")
	fmt.Println("    ./scripts/check.sh --include-slow     # Include slow checks")
	fmt.Println("    ./scripts/check.sh --ci --fail-fast   # CI mode, stop on first failure")
	fmt.Println()
	fmt.Println("Available checks:")
	fmt.Println()

	printCheckList()
}

// printCheckList prints all registered checks grouped by app and tech.
func printCheckList() {
	type checkGroup struct {
		app  checks.App
		tech string
		ids  []string
	}

	groupMap := make(map[string]*checkGroup)
	var groupOrder []string

	for _, check := range checks.AllChecks {
		key := string(check.App) + "|" + check.Tech
		if _, ok := groupMap[key]; !ok {
			groupMap[key] = &checkGroup{app: check.App, tech: check.Tech}
			groupOrder = append(groupOrder, key)
		}
		name := check.CLIName()
		if check.IsSlow {
			name += " (slow)"
		}
		groupMap[key].ids = append(groupMap[key].ids, name)
	}

	sort.Slice(groupOrder, func(i, j int) bool {
		gi, gj := groupMap[groupOrder[i]], groupMap[groupOrder[j]]
		if gi.app != gj.app {
			return gi.app < gj.app
		}
		return gi.tech < gj.tech
	})

	for _, key := range groupOrder {
		g := groupMap[key]
		fmt.Printf("  %s: %s\n", checks.AppDisplayName(g.app), g.tech)
		for _, id := range g.ids {
			fmt.Printf("    - %s\n", id)
		}
	}
}
