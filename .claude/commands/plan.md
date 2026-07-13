Plan the feature implementation we discussed.

1. **Work on a worktree.** Create a worktree branched off local `main` and write the plan there, so execution can run on
   the same worktree with your context preserved (see the user-level `solo-dev-workflow.md` and
   `worktree-base-local-main.md`). For a tiny plan you don't intend to execute as a separate effort, ask first whether a
   worktree is warranted.
2. Collect context from the root `AGENTS.md`, the colocated `CLAUDE.md` for each area you'll touch (`backend-go/`,
   `frontend/`, `e2e/`, `infra/`), and the relevant topic docs under `docs/` (for auth, read `docs/auth-contract.md`
   first). Plan with the product intent front of mind: this is a live photography-course site, so don't break the auth
   contract or the served data.
3. Save the plan to `docs/specs/{feature}-plan.md` (inside the worktree).
4. Capture the INTENTION behind each decision, not just the steps. The implementing agent or human should know the
   "why"s and be able to adapt dynamically.
5. Use milestones if needed. For each milestone, name the docs updates, the tests that prove it (Go unit/integration?
   `svelte-check`? Playwright E2E?), and which tests are written test-first as a real red then green sequence (see the
   user-level `tdd-red-green.md`) versus written after. Lean on TDD for bug fixes and risky logic. Include the checks to
   run (`./scripts/check.sh`).
6. Leave notes about what can be executed in parallel, but only if it's extremely safe. We're usually not in a hurry and
   sequential running is totally fine.
7. DO NOT enter "Plan mode" unless specifically asked to "Enter plan mode". Use `docs/specs`.
8. Get an Opus agent to review the plan with fresh eyes and point out any mistakes. Then fix up the plan based on that.
   Link the most crucial docs to the agent.
9. Do this review round again and again, until the reviewer agent has no meaningful input, or maximum five times.
