package main

import (
	"testing"

	"github.com/vdavid/photato/scripts/check/checks"
)

// TestApplySelectorHandlesEveryReservedName guards the pairing between
// reservedSelectorNames and applySelector: every reserved keyword must resolve
// to an app or group selector, never fall through to the error branch.
func TestApplySelectorHandlesEveryReservedName(t *testing.T) {
	for _, name := range reservedSelectorNames {
		flags := &cliFlags{}
		if err := applySelector(flags, name); err != nil {
			t.Errorf("reserved selector %q not handled by applySelector: %v", name, err)
		}
	}
}

// TestUnknownSelectorErrors ensures a bogus selector is rejected.
func TestUnknownSelectorErrors(t *testing.T) {
	if err := applySelector(&cliFlags{}, "nope-not-a-check"); err == nil {
		t.Error("expected error for unknown selector")
	}
}

// TestAppSelectorsResolve ensures each app keyword maps to a known app.
func TestAppSelectorsResolve(t *testing.T) {
	for _, app := range []checks.App{checks.AppBackend, checks.AppScripts, checks.AppFrontend, checks.AppE2E, checks.AppOther} {
		if _, err := selectChecksByApp(string(app)); err != nil {
			t.Errorf("app %q not resolvable: %v", app, err)
		}
	}
}
