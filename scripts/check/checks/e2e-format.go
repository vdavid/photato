package checks

// RunE2EFormat checks (and locally fixes) e2e formatting. oxfmt owns everything
// here (`.ts`); no prettier (no Svelte). Runs through the package's
// `format:check` / `format` scripts.
func RunE2EFormat(ctx *CheckContext) (CheckResult, error) {
	return runFormatCheck(ctx, "e2e")
}
