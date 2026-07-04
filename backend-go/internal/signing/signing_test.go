package signing

import (
	"errors"
	"testing"
)

// Golden SHA256 vectors, computed from the exact strings the legacy backend
// hashes. These are load-bearing: the signed-URL and validate-signed-url
// controllers hash the request path, so these hex values must never drift.
//
//   - "test-path": the unit-test path from the legacy SignatureRepository suite.
//   - The two realistic upload paths are the exact strings the legacy
//     GetSignedUrl / ValidateSignedUrl controllers hashed in their suites
//     (path + "?" + querystring). Note the second has no leading slash, exactly
//     as the legacy Lambda@Edge event produced it.
func TestHashGoldenVectors(t *testing.T) {
	cases := []struct {
		name string
		path string
		want string
	}{
		{
			name: "legacy unit-test path",
			path: "test-path",
			want: "8bab307750db7c8070e6a8219715a595782df6a52f946b05b940bb86a9943474",
		},
		{
			name: "get-signed-url path with leading slash",
			path: "/development/photos/hu-3/week-2/test@user.com.jpg?a=1",
			want: "6c311f0e5c17eb06d08cd1bc313a0bc1b892bb18dc8e69c15a42b5dbf6620b06",
		},
		{
			name: "validate path without leading slash",
			path: "development/photos/xx-1/week-5/test@user.com.jpg?a=1",
			want: "760f639343dd04b36ee536867ad9663bfde630553f79653e9f6d463195e895c1",
		},
		{
			name: "production upload path",
			path: "production/photos/hu-4/week-2/user@example.com.jpg",
			want: "2689709dfca13af819645e8e8d76230a37c599121fc40a7567c24d4e72c8b865",
		},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			if got := Hash(c.path); got != c.want {
				t.Fatalf("Hash(%q) = %q, want %q", c.path, got, c.want)
			}
		})
	}
}

// fakeStore is an in-memory Store, mirroring the legacy S3Mock in
// SignatureRepository.u.test.js.
type fakeStore struct {
	markers map[string]bool // key: string(status) + "/" + hash
}

func newFakeStore() *fakeStore { return &fakeStore{markers: map[string]bool{}} }

func (f *fakeStore) key(hash string, status Status) string { return string(status) + "/" + hash }

func (f *fakeStore) PutSignature(hash string, status Status) error {
	f.markers[f.key(hash, status)] = true
	return nil
}

func (f *fakeStore) HasSignature(hash string, status Status) (bool, error) {
	return f.markers[f.key(hash, status)], nil
}

func TestCreateAndValidateSignatures(t *testing.T) {
	repo := NewRepository(newFakeStore())
	const testPath = "test-path"

	if err := repo.CreateValidForPath(testPath); err != nil {
		t.Fatalf("CreateValidForPath: unexpected error: %v", err)
	}

	valid, err := repo.IsValidForPath(testPath)
	if err != nil {
		t.Fatalf("IsValidForPath: unexpected error: %v", err)
	}
	if !valid {
		t.Errorf("IsValidForPath(%q) = false, want true after creating a valid signature", testPath)
	}

	valid, err = repo.IsValidForPath("invalid-path")
	if err != nil {
		t.Fatalf("IsValidForPath(invalid): unexpected error: %v", err)
	}
	if valid {
		t.Errorf("IsValidForPath(invalid-path) = true, want false for an unsigned path")
	}
}

func TestExpireSignatures(t *testing.T) {
	repo := NewRepository(newFakeStore())
	const path1 = "test-path1"
	const path2 = "test-path2"

	if err := repo.CreateValidForPath(path1); err != nil {
		t.Fatalf("CreateValidForPath(path1): %v", err)
	}
	if err := repo.CreateValidForPath(path2); err != nil {
		t.Fatalf("CreateValidForPath(path2): %v", err)
	}
	if err := repo.MarkExpiredForPath(path1); err != nil {
		t.Fatalf("MarkExpiredForPath(path1): %v", err)
	}

	valid, err := repo.IsValidForPath(path1)
	if err != nil {
		t.Fatalf("IsValidForPath(path1): %v", err)
	}
	if valid {
		t.Errorf("IsValidForPath(path1) = true after expiring, want false")
	}

	valid, err = repo.IsValidForPath(path2)
	if err != nil {
		t.Fatalf("IsValidForPath(path2): %v", err)
	}
	if !valid {
		t.Errorf("IsValidForPath(path2) = false, want true (only path1 was expired)")
	}
}

// TestValidRequiresValidMarkerAndNoExpired locks in the exact rule: valid marker
// present AND expired marker absent.
func TestValidRequiresValidMarkerAndNoExpired(t *testing.T) {
	store := newFakeStore()
	repo := NewRepository(store)
	const path = "some/upload/path.jpg"
	hash := Hash(path)

	// Only an expired marker, no valid marker: not valid.
	if err := store.PutSignature(hash, StatusExpired); err != nil {
		t.Fatalf("seed expired: %v", err)
	}
	valid, err := repo.IsValidForPath(path)
	if err != nil {
		t.Fatalf("IsValidForPath: %v", err)
	}
	if valid {
		t.Errorf("expired-only path reported valid, want invalid")
	}
}

func TestNotImplementedSentinel(t *testing.T) {
	// Guards the red phase: while unimplemented, the methods surface
	// errNotImplemented. This test flips to passing trivially once real logic
	// lands (the sentinel is no longer returned), so it documents intent
	// without blocking green.
	repo := NewRepository(newFakeStore())
	err := repo.CreateValidForPath("x")
	if err != nil && !errors.Is(err, errNotImplemented) {
		t.Fatalf("unexpected error kind: %v", err)
	}
}
