# Changelog

All notable changes to the "AGENTS.md Sync" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2025-01-01

### Added

- Initial release
- Automatic syncing between AGENTS.md and CLAUDE.md via symlinks
- Creates symlink CLAUDE.md -> AGENTS.md when AGENTS.md exists
- Renames CLAUDE.md to AGENTS.md and creates symlink when only CLAUDE.md exists
- Triggers on workspace startup and file save
- Configuration option to enable/disable syncing
