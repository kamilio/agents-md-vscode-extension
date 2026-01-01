import path from 'node:path';
import type { FileSystem } from './fs';

export type SyncResult =
  | { changed: false; reason: 'noop' | 'already-symlinked' | 'both-exist' }
  | { changed: true; action: 'created-symlink' | 'renamed-and-symlinked' };

export interface SyncOptions {
  workspaceFolder: string;
}

export async function syncAgentsAndClaude(
  fs: FileSystem,
  options: SyncOptions,
): Promise<SyncResult> {
  const agentsPath = path.join(options.workspaceFolder, 'AGENTS.md');
  const claudePath = path.join(options.workspaceFolder, 'CLAUDE.md');

  const agentsExists = await fs.exists(agentsPath);
  const claudeExists = await fs.exists(claudePath);

  if (agentsExists && claudeExists) {
    try {
      const st = await fs.lstat(claudePath);
      if (st.isSymbolicLink()) return { changed: false, reason: 'already-symlinked' };
    } catch {
      // ignore
    }
    return { changed: false, reason: 'both-exist' };
  }

  if (agentsExists && !claudeExists) {
    await fs.symlink('AGENTS.md', claudePath);
    return { changed: true, action: 'created-symlink' };
  }

  if (!agentsExists && claudeExists) {
    await fs.rename(claudePath, agentsPath);
    await fs.symlink('AGENTS.md', claudePath);
    return { changed: true, action: 'renamed-and-symlinked' };
  }

  return { changed: false, reason: 'noop' };
}
