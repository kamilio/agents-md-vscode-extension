# AGENTS.md Sync (VS Code extension)

Keeps `AGENTS.md` and `CLAUDE.md` aligned inside a workspace.

Rules (on save of either file):

- If `AGENTS.md` exists and `CLAUDE.md` is missing, create a symlink `CLAUDE.md -> AGENTS.md`.
- If `CLAUDE.md` exists and `AGENTS.md` is missing, rename `CLAUDE.md` to `AGENTS.md` and then create `CLAUDE.md -> AGENTS.md`.

This happens without prompts.

## Development

- Install deps: `npm i`
- Build: `npm run build`
- Unit tests (fake FS): `npm test`

## Configuration

- `agentsMdSync.enabled` (default: `true`)
