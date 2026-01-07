# AGENTS.md Sync (VS Code extension)

Keeps `AGENTS.md` and `CLAUDE.md` aligned inside a workspace.

Rules (on save of either file):

- If `AGENTS.md` exists and `CLAUDE.md` is missing, create a symlink `CLAUDE.md -> AGENTS.md`.
- If `CLAUDE.md` exists and `AGENTS.md` is missing, rename `CLAUDE.md` to `AGENTS.md` and then create `CLAUDE.md -> AGENTS.md`.

This is meant to support agent-based coding workflows: use Claude Code, Codex, Cursor, and other coding agents interchangeably while keeping workspace guidance in sync.
