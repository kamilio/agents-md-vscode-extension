# AGENTS.md Sync – Roadmap

A simple VS Code extension that ensures a symlink relationship between `AGENTS.md` and `CLAUDE.md` in each workspace folder.

## Behavior (implemented)

Triggered on:

- VS Code startup (for each open workspace folder)
- Save of `AGENTS.md` or `CLAUDE.md`

Rules:

- If `AGENTS.md` exists and `CLAUDE.md` is missing → create symlink `CLAUDE.md -> AGENTS.md`
- If `CLAUDE.md` exists and `AGENTS.md` is missing → rename `CLAUDE.md` to `AGENTS.md` and then create symlink `CLAUDE.md -> AGENTS.md`
- If both exist → do nothing (never overwrites user content)

## Coding constraints

- TDD: unit tests use a fake filesystem (`memfs`), no real filesystem changes.
- Keep it simple, lightweight, and avoid leaks (single in-flight sync guard).

## Next ideas

- Add a command to run sync manually.
- Add an option to prefer copying instead of symlinks on platforms where symlinks are problematic.
- Add telemetry-free status output (output channel) behind a setting.
