package checks

import "testing"

// reservedForTest mirrors main.reservedSelectorNames. Kept here so the checks
// package can assert no check name shadows a selector keyword without importing main.
var reservedForTest = []string{"backend", "scripts", "frontend", "e2e", "other", "go"}

func TestValidateCheckNames(t *testing.T) {
	if err := ValidateCheckNames(reservedForTest...); err != nil {
		t.Fatalf("AllChecks failed validation: %v", err)
	}
}

func TestEveryDependencyExists(t *testing.T) {
	known := make(map[string]bool, len(AllChecks))
	for _, c := range AllChecks {
		known[c.ID] = true
	}
	for _, c := range AllChecks {
		for _, dep := range c.DependsOn {
			if !known[dep] {
				t.Errorf("check %q depends on unknown check %q", c.ID, dep)
			}
		}
	}
}

func TestEveryCheckHasRunAndApp(t *testing.T) {
	for _, c := range AllChecks {
		if c.Run == nil {
			t.Errorf("check %q has no Run function", c.ID)
		}
		if c.App == "" {
			t.Errorf("check %q has no App", c.ID)
		}
		if c.Tech == "" {
			t.Errorf("check %q has no Tech", c.ID)
		}
	}
}

func TestGetChecksByTechFindsGoChecks(t *testing.T) {
	if len(GetChecksByTech(techGo)) == 0 {
		t.Fatal("expected at least one Go-tech check")
	}
}
