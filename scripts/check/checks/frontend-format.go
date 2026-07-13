package checks

// RunFrontendFormat checks (and locally fixes) frontend formatting. oxfmt owns
// `.ts`/`.js`/`.json`/`index.html`; prettier owns `.svelte` (frontend/CLAUDE.md).
// Both run through the package's `format:check` / `format` scripts.
func RunFrontendFormat(ctx *CheckContext) (CheckResult, error) {
	return runFormatCheck(ctx, "./frontend")
}
