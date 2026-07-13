package checks

import (
	"bytes"
	"encoding/json"
	"fmt"
	"os"
	"sort"
)

// Shared plumbing for allowlist shrink-wrapping: a check that owns a JSON
// allowlist verifies its own entries are still needed (dead files, satisfied
// constraints) and — outside CI — rewrites the allowlist to drop what's stale.
// The verdict logic stays in each check; only the rewrite plumbing is shared.

// writeJSONAllowlist marshals v (2-space indent, no HTML escaping, trailing
// newline) and writes it to path atomically via temp+rename.
func writeJSONAllowlist(path string, v any) error {
	var buf bytes.Buffer
	enc := json.NewEncoder(&buf)
	enc.SetEscapeHTML(false)
	enc.SetIndent("", "  ")
	if err := enc.Encode(v); err != nil {
		return fmt.Errorf("marshal allowlist: %w", err)
	}
	tmp := path + ".tmp"
	if err := os.WriteFile(tmp, buf.Bytes(), 0o644); err != nil {
		return fmt.Errorf("write allowlist: %w", err)
	}
	if err := os.Rename(tmp, path); err != nil {
		return fmt.Errorf("rename allowlist: %w", err)
	}
	return nil
}

// sortedKeys returns the map's keys in sorted order, for deterministic output.
func sortedKeys[V any](m map[string]V) []string {
	keys := make([]string, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	sort.Strings(keys)
	return keys
}
