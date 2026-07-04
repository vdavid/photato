package photos

import (
	"encoding/json"
	"errors"
	"testing"
	"time"
)

// validFields mirrors the legacy PhotoRepository.u.test.js "Uploads image" case.
func validFields() map[string]string {
	return map[string]string{
		"emailAddress":     "test@user.com",
		"courseName":       "xx-1",
		"weekIndex":        "5",
		"originalFileName": "test.jpg",
		"title":            "Some title",
		"mimeType":         "image/jpeg",
	}
}

func TestParseAndValidateAcceptsValidFields(t *testing.T) {
	m, err := ParseAndValidate(validFields())
	if err != nil {
		t.Fatalf("ParseAndValidate(valid) returned error: %v", err)
	}
	if m.EmailAddress != "test@user.com" {
		t.Errorf("EmailAddress = %q, want test@user.com", m.EmailAddress)
	}
	if m.CourseName != "xx-1" {
		t.Errorf("CourseName = %q, want xx-1", m.CourseName)
	}
	if m.WeekIndex != 5 {
		t.Errorf("WeekIndex = %d, want 5", m.WeekIndex)
	}
	if m.OriginalFileName != "test.jpg" {
		t.Errorf("OriginalFileName = %q, want test.jpg", m.OriginalFileName)
	}
	if m.Title != "Some title" {
		t.Errorf("Title = %q, want 'Some title'", m.Title)
	}
	if m.MimeType != "image/jpeg" {
		t.Errorf("MimeType = %q, want image/jpeg", m.MimeType)
	}
}

// TestParseAndValidateRejectsBadFields ports the field constraints from the
// legacy PhotoMetadataBuilder._validateInput.
func TestParseAndValidateRejectsBadFields(t *testing.T) {
	mutate := func(key, val string) map[string]string {
		f := validFields()
		f[key] = val
		return f
	}
	cases := []struct {
		name   string
		fields map[string]string
	}{
		{"empty email", mutate("emailAddress", "")},
		{"malformed email", mutate("emailAddress", "not-an-email")},
		{"course name wrong pattern", mutate("courseName", "abc")},
		{"course name too long", mutate("courseName", "hu-12")},
		{"course name uppercase", mutate("courseName", "HU-1")},
		{"week index below zero", mutate("weekIndex", "-1")},
		{"week index above twelve", mutate("weekIndex", "13")},
		{"empty file name", mutate("originalFileName", "")},
		{"file name too long", mutate("originalFileName", makeString(256))},
		{"title too long", mutate("title", makeString(151))},
		{"non-jpeg mime type", mutate("mimeType", "text/plain")},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			_, err := ParseAndValidate(c.fields)
			if !errors.Is(err, ErrInvalidMetadata) {
				t.Fatalf("ParseAndValidate(%s) error = %v, want ErrInvalidMetadata", c.name, err)
			}
		})
	}
}

func TestParseAndValidateAllowsEmptyTitleAndBoundaryWeeks(t *testing.T) {
	for _, week := range []string{"0", "12"} {
		f := validFields()
		f["weekIndex"] = week
		f["title"] = ""
		if _, err := ParseAndValidate(f); err != nil {
			t.Errorf("ParseAndValidate(week=%s, empty title) = %v, want nil", week, err)
		}
	}
}

// TestBuildUploadPath locks the exact storage layout. The golden value comes
// from PhotoRepository.u.test.js ("development/photos/xx-1/week-5/...").
func TestBuildUploadPath(t *testing.T) {
	m := Metadata{
		EmailAddress: "test@user.com",
		CourseName:   "xx-1",
		WeekIndex:    5,
		MimeType:     "image/jpeg",
	}
	got := BuildUploadPath("development", m)
	want := "development/photos/xx-1/week-5/test@user.com.jpg"
	if got != want {
		t.Fatalf("BuildUploadPath = %q, want %q", got, want)
	}
}

func TestBuildUploadPathProduction(t *testing.T) {
	m := Metadata{EmailAddress: "user@example.com", CourseName: "hu-4", WeekIndex: 2, MimeType: "image/jpeg"}
	got := BuildUploadPath("production", m)
	want := "production/photos/hu-4/week-2/user@example.com.jpg"
	if got != want {
		t.Fatalf("BuildUploadPath = %q, want %q", got, want)
	}
}

func TestValidateUploadSize(t *testing.T) {
	cases := []struct {
		name    string
		size    int64
		wantErr bool
	}{
		{"below minimum", MinUploadBytes - 1, true},
		{"at minimum", MinUploadBytes, false},
		{"mid range", 2 * 1024 * 1024, false},
		{"at maximum", MaxUploadBytes, false},
		{"above maximum", MaxUploadBytes + 1, true},
		{"zero", 0, true},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			err := ValidateUploadSize(c.size)
			if c.wantErr {
				if !errors.Is(err, ErrUploadSize) {
					t.Fatalf("ValidateUploadSize(%d) = %v, want ErrUploadSize", c.size, err)
				}
			} else if err != nil {
				t.Fatalf("ValidateUploadSize(%d) = %v, want nil", c.size, err)
			}
		})
	}
}

// TestPhotoInfoJSONFieldNames guards the wire contract the React frontend
// depends on: field names and order-independent presence.
func TestPhotoInfoJSONFieldNames(t *testing.T) {
	p := PhotoInfo{
		Key:              "production/photos/hu-4/week-2/a@b.com.jpg",
		FileName:         "a@b.com.jpg",
		URL:              "https://api.photato.eu/photos/...",
		EmailAddress:     "a@b.com",
		Title:            "Lyány",
		ContentType:      "image/jpeg",
		SizeInBytes:      1024,
		LastModifiedDate: time.Date(2011, 11, 11, 0, 0, 0, 0, time.UTC),
	}
	raw, err := json.Marshal(p)
	if err != nil {
		t.Fatalf("json.Marshal: %v", err)
	}
	var m map[string]json.RawMessage
	if err := json.Unmarshal(raw, &m); err != nil {
		t.Fatalf("json.Unmarshal: %v", err)
	}
	for _, field := range []string{"key", "fileName", "url", "emailAddress", "title", "contentType", "sizeInBytes", "lastModifiedDate"} {
		if _, ok := m[field]; !ok {
			t.Errorf("PhotoInfo JSON missing field %q; got %s", field, raw)
		}
	}
}

func makeString(n int) string {
	b := make([]byte, n)
	for i := range b {
		b[i] = 'a'
	}
	return string(b)
}
