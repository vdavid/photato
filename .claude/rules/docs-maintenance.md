# Docs: keep them in sync and current

When you change code in a directory that has a colocated `CLAUDE.md` (`backend-go/`, `frontend/`, `e2e/`, `infra/`),
check whether your change affects the documented architecture, decisions, or gotchas. If it does, update that
`CLAUDE.md` so it stays in sync. Repo-wide facts live in the root `AGENTS.md`. Skip this for trivial changes
(formatting, small fixes that don't change architecture).

If something failed because of a wrong assumption, add a `Gotcha/Why` entry to the nearest `CLAUDE.md`. For a key
decision, add a `Decision/Why` entry there. When a decision has rich evidence (benchmarks, detailed analysis), put the
evidence in `docs/` and link to it from the `CLAUDE.md`.

**Single-source.** A load-bearing technical claim lives in exactly one canonical doc (the nearest colocated `CLAUDE.md`,
or the topic doc under `docs/` like `auth-contract.md`); everywhere else points to it by path instead of restating it.
Copied prose rots independently.

**Current state, not history.** Docs describe the code as it is now; git holds the history. Drop narration of previous
shapes; keep the non-obvious why, actionable guardrails, and historical pain that encodes a constraint the current code
must still defend. Full drop/keep lists and the code-comment carve-outs live in David's user-level
`describe-current-not-history` rule.
