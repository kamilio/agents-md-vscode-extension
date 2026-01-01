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

## Publishing

The extension is automatically published to the VS Code Marketplace when you create a GitHub Release.

### One-time setup

1. **Create a publisher** (if you don't have one):
   - Go to https://marketplace.visualstudio.com/manage
   - Sign in with your Microsoft account
   - Create a publisher with the ID matching `publisher` in package.json

2. **Get a Personal Access Token**:
   - Go to https://dev.azure.com
   - Sign in and click your profile icon (top right) → Personal Access Tokens
   - Click "New Token"
   - Name: `vsce` (or anything you like)
   - Organization: Select "All accessible organizations"
   - Expiration: Set as needed (max 1 year)
   - Scopes: Click "Custom defined", then find **Marketplace** and check **Manage**
   - Click "Create" and copy the token

3. **Add the token to GitHub**:
   - Go to your repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `VSCE_PAT`
   - Value: paste your token
   - Click "Add secret"

### Releasing a new version

1. Update `version` in package.json
2. Update CHANGELOG.md
3. Commit and push to main
4. Create a GitHub Release (e.g., tag `v0.1.0`)
5. The workflow will automatically publish to the Marketplace
