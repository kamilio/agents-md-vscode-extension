import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { syncAgentsAndClaude } from '../src/sync';
import { createFakeFs } from './fakeFs';

describe('syncAgentsAndClaude', () => {
  it('creates CLAUDE.md symlink when only AGENTS.md exists', async () => {
    const workspaceFolder = '/ws';
    const agentsPath = path.join(workspaceFolder, 'AGENTS.md');
    const claudePath = path.join(workspaceFolder, 'CLAUDE.md');

    const { fs, vol } = createFakeFs({ [agentsPath]: 'hello' }, workspaceFolder);

    const result = await syncAgentsAndClaude(fs, { workspaceFolder });

    expect(result).toEqual({ changed: true, action: 'created-symlink' });
    expect(vol.lstatSync(claudePath).isSymbolicLink()).toBe(true);
    expect(vol.readFileSync(claudePath, 'utf8')).toBe('hello');
  });

  it('renames CLAUDE.md to AGENTS.md and recreates symlink', async () => {
    const workspaceFolder = '/ws';
    const agentsPath = path.join(workspaceFolder, 'AGENTS.md');
    const claudePath = path.join(workspaceFolder, 'CLAUDE.md');

    const { fs, vol } = createFakeFs({ [claudePath]: 'hello' }, workspaceFolder);

    const result = await syncAgentsAndClaude(fs, { workspaceFolder });

    expect(result).toEqual({ changed: true, action: 'renamed-and-symlinked' });
    expect(vol.readFileSync(agentsPath, 'utf8')).toBe('hello');
    expect(vol.lstatSync(claudePath).isSymbolicLink()).toBe(true);
    expect(vol.readFileSync(claudePath, 'utf8')).toBe('hello');
  });

  it('noops when neither exists', async () => {
    const workspaceFolder = '/ws';
    const { fs } = createFakeFs({}, workspaceFolder);

    const result = await syncAgentsAndClaude(fs, { workspaceFolder });

    expect(result).toEqual({ changed: false, reason: 'noop' });
  });

  it('noops when both exist (does not overwrite)', async () => {
    const workspaceFolder = '/ws';
    const agentsPath = path.join(workspaceFolder, 'AGENTS.md');
    const claudePath = path.join(workspaceFolder, 'CLAUDE.md');

    const { fs, vol } = createFakeFs(
      { [agentsPath]: 'agents', [claudePath]: 'claude' },
      workspaceFolder,
    );

    const result = await syncAgentsAndClaude(fs, { workspaceFolder });

    expect(result).toEqual({ changed: false, reason: 'both-exist' });
    expect(vol.readFileSync(agentsPath, 'utf8')).toBe('agents');
    expect(vol.readFileSync(claudePath, 'utf8')).toBe('claude');
  });
});
