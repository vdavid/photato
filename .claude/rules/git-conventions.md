# Git conventions

Commit-message style is set at user level (`~/.claude/rules/commit-messages.md` and `no-co-author.md`): lead with
impact, verbose bulleted bodies are welcome, no word wrap, entities in backticks, no `Co-Authored-By`. An optional
prefix like `Bugfix:`, `Docs:`, `Tooling:`, or `Backend:` is fine.

We land changes on `main` via fast-forward merge from a worktree branch, no PRs (see the user-level
`solo-dev-workflow.md`). If David ever asks for a PR explicitly: casual, informal title, a concise bulleted description
with no headings, and a single `## Test plan` heading at the bottom explaining how the change was tested.
