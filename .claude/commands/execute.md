Lead a team of Opus agents to deliver on this plan.

## Setup

- Work on the worktree where the plan lives (the `plan` command creates one). If the plan was made on the main clone,
  move it to a worktree branched off local `main` first, so your context is preserved for follow-up tweaks. Keep `main`
  clean (see the user-level `solo-dev-workflow.md`).

## You (the lead)

- You don't do the implementation work, you oversee the agents. You keep this project together; they do the work. I need
  your context window free for post-implementation checks, fixes, thinking, and the verification below.
- Run agents sequentially, we're in no rush, unless you predict the quality is better in parallel. Look at what each
  agent did between milestones, and feed the previous agent's output into the next one's input.

## Agents

- It's your responsibility that the _whole_ plan gets executed. Agents sometimes skip parts of their scope. Give them a
  clear scope and ask them to do the whole thing. They only say "done" when every part of their job is finished and
  thoroughly self-reviewed.
- Agents sometimes do the opposite: they ignore their milestone boundary and jump on the whole plan. That tanks quality,
  because they run out of context, auto-compress, and the compressed agent loses our values and intent. So give each a
  clear, bounded scope.
- Make every agent reflect: "Is what I've done solid AND elegant? Am I proud and confident about it?" If "no" to either,
  adjust and repeat.
- They should also fix latent bugs near their work (small, ~10-15 LoC changes). Correctness and bug-free code over
  crystal-clean commits.

## Feedback loops are mandatory

Don't fly blind. At checkpoints (and especially after a feature milestone), run the app and confirm the change actually
looks and feels right. Photato is a Svelte SPA on a Go backend, so:

- Run the backend (`cd backend-go && mise exec -- go run .`) and the frontend dev server
  (`pnpm --filter ./frontend dev`), then drive the flow in a browser.
- For anything auth-touching, check it against `docs/auth-contract.md` end to end (magic link then session token).
- Spawn an agent to run the app and exercise it when that's a good use of a fresh context.

## Testing and checks

- Cover new features with tests, using real red then green TDD wherever reasonable (see the user-level `tdd-red-green.md`).
- Run `./scripts/check.sh` after each milestone and read its full output (never tail or truncate it; see the user-level
  `no-tail-checker.md`). The autofixers only run in a worktree, so run it from the worktree.
- Playwright E2E runs in Docker only (pixel baselines are Linux-only): `pnpm test:e2e:docker`. When working a specific
  feature, run only its E2E set. Never regenerate pixel baselines to make a failure pass (see `e2e/CLAUDE.md`).

## Lead verification (you own delegated work)

Don't integrate on trust (see the user-level `verify-delegated-work.md`):

- Re-run the security- and data-safety-critical tests yourself (auth, upload signing, the salvage master's read-only
  invariant).
- Read the actual diffs. Confirm the scope matches the plan's intent: nothing skipped, nothing stray.
- Rebase the worktree onto CURRENT local `main` before the fast-forward merge (it can advance mid-session).

## Keep docs current

Agents keep `CLAUDE.md` files and other docs up to date continuously as they work, so we end in a good documented state,
not with a doc-sync chore at the end.

## Final review

- Ask +1 Opus agent to thoroughly review the execution and flag anything skipped, broken, or incomplete.
- Have +1 Opus agent run `./scripts/check.sh` and confirm it's green (even if unrelated checks fail, surface those).
- Strip milestone tags from the touched code and docs. Plan-specific names like "M1", "M2a", "Milestone 3", "Phase 2"
  leak into inline comments, test helper prefixes, doc strings, and `CLAUDE.md` text during execution. Grep the touched
  files (`rg -n '\b(M[0-9][a-z]?|Milestone\s*[0-9]|Phase\s*[0-9])\b' <paths>`) and replace each hit with a descriptive
  reference so a future reader doesn't need the plan in hand. The plan file itself keeps its milestone structure. Leave
  pre-existing milestone references in unrelated code alone.
- Do a review yourself, and report: is this something you're proud of? Is this solid AND elegant? Is anything missing?

## Wrap

Fast-forward merge the worktree into local `main`, then delete the worktree and branch (see the user-level
`solo-dev-workflow.md`). Don't push, and don't offer to: David pushes on his own schedule (see the user-level
`push-cadence.md`). We're done when the work is committed and we've discussed the follow-ups.
