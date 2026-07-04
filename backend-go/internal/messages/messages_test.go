package messages

import (
	"encoding/json"
	"testing"
)

// TestGetAllReturnsCatalog checks the repository yields the ported catalog. The
// legacy catalog had 68 entries; phase 3b ports the data and this asserts a
// non-empty result.
func TestGetAllReturnsCatalog(t *testing.T) {
	repo := NewRepository()
	msgs, err := repo.GetAll()
	if err != nil {
		t.Fatalf("GetAll: unexpected error: %v", err)
	}
	if len(msgs) == 0 {
		t.Fatalf("GetAll returned no messages, want the ported catalog")
	}
}

// TestMessageJSONFieldNames guards the wire contract for the admin messages
// page: the field names must match the legacy photato-messages.js objects.
func TestMessageJSONFieldNames(t *testing.T) {
	raw, err := json.Marshal(Message{
		Slug:           "coming-soon",
		Title:          "Coming soon",
		CourseDayIndex: -13,
		Channel:        "facebook",
		Audience:       "page",
		Locale:         "hu-HU",
		ContentType:    "text/plain",
		Content:        "Hamarosan…",
	})
	if err != nil {
		t.Fatalf("json.Marshal: %v", err)
	}
	var m map[string]json.RawMessage
	if err := json.Unmarshal(raw, &m); err != nil {
		t.Fatalf("json.Unmarshal: %v", err)
	}
	for _, field := range []string{"slug", "title", "courseDayIndex", "channel", "audience", "locale", "contentType", "content"} {
		if _, ok := m[field]; !ok {
			t.Errorf("Message JSON missing field %q; got %s", field, raw)
		}
	}
}
