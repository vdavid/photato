// Command migrate turns the S3 salvage master into the Go backend's live data
// layout: photo files hardlinked into DATA_DIR/photos, external-article files
// hardlinked into a public static dir, and one SQLite photos row per photo.
//
// It hardlinks (never copies) so it costs ~zero bytes and leaves the salvage
// tree pristine, and it is idempotent (safe to re-run). See the migration
// section in backend-go/CLAUDE.md for the exact deploy command.
package main

import (
	"context"
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/vdavid/photato/backend-go/internal/migrate"
)

func main() {
	log.SetFlags(0)

	var (
		source     = flag.String("source", "", "salvage root: the dir holding s3/ and metadata.json (required)")
		dataDir    = flag.String("data-dir", "", "backend DATA_DIR; photos land under <data-dir>/photos (required)")
		sqlitePath = flag.String("sqlite", "", "SQLite path (default <data-dir>/photato.db)")
		extDir     = flag.String("external-articles-dir", "", "where external-article files are hardlinked (default <data-dir>/external-articles)")
		dryRun     = flag.Bool("dry-run", false, "print the plan and counts, write nothing")
		verify     = flag.Bool("verify", false, "after migrating, recount files/rows and MD5-check sample photos")
		samples    = flag.Int("verify-samples", 20, "number of random photos to MD5-check in --verify")
	)
	flag.Parse()

	if *source == "" || *dataDir == "" {
		flag.Usage()
		log.Fatal("\n--source and --data-dir are required")
	}

	opts := migrate.Options{
		SourceDir:           *source,
		DataDir:             *dataDir,
		SQLitePath:          *sqlitePath,
		ExternalArticlesDir: *extDir,
		DryRun:              *dryRun,
	}
	ctx := context.Background()

	res, err := migrate.Run(ctx, opts)
	if err != nil {
		log.Fatalf("migrate: %v", err)
	}
	printResult(opts, res)

	if *verify {
		if opts.DryRun {
			log.Println("\n--verify skipped: nothing was written in --dry-run")
			return
		}
		vres, err := migrate.Verify(ctx, opts, *samples, nil)
		if err != nil {
			log.Fatalf("verify: %v", err)
		}
		printVerify(vres)
		if !vres.OK() {
			os.Exit(1)
		}
	}
}

func printResult(opts migrate.Options, res migrate.Result) {
	mode := "MIGRATE"
	if opts.DryRun {
		mode = "DRY-RUN (nothing written)"
	}
	fmt.Printf("=== %s ===\n", mode)
	fmt.Printf("photos:           %d linked, %d already present, %d rows upserted\n", res.PhotosLinked, res.PhotosSkipped, res.PhotoRows)
	fmt.Printf("external-articles: %d linked, %d already present\n", res.ExternalLinked, res.ExternalSkipped)
	if res.Unknown > 0 {
		fmt.Printf("unknown (skipped): %d\n", res.Unknown)
	}
	if res.MissingSource > 0 {
		fmt.Printf("missing source:    %d\n", res.MissingSource)
	}
	if res.LinkConflicts > 0 {
		fmt.Printf("link conflicts:    %d\n", res.LinkConflicts)
	}
	if len(res.Warnings) > 0 {
		fmt.Printf("\n%d warning(s):\n", len(res.Warnings))
		for _, w := range res.Warnings {
			fmt.Printf("  - %s\n", w)
		}
	}
}

func printVerify(v migrate.VerifyResult) {
	fmt.Printf("\n=== VERIFY ===\n")
	fmt.Printf("photo files on disk:    %d\n", v.PhotoFilesOnDisk)
	fmt.Printf("external files on disk: %d\n", v.ExternalFilesOnDisk)
	fmt.Printf("photo rows in db:       %d\n", v.PhotoRowsInDB)
	fmt.Printf("MD5-checked samples:    %d\n", v.SamplesChecked)
	for _, p := range v.Problems {
		fmt.Printf("  PROBLEM: %s\n", p)
	}
	for _, m := range v.SampleMismatches {
		fmt.Printf("  MISMATCH: %s\n", m)
	}
	if v.OK() {
		fmt.Println("verify: OK")
	} else {
		fmt.Println("verify: FAILED")
	}
}
