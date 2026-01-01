import { Volume } from 'memfs';
import type { FileSystem } from '../src/fs';

export function createFakeFs(initialFiles: Record<string, string>, cwd = '/ws'): {
  fs: FileSystem;
  vol: Volume;
  cwd: string;
} {
  const vol = Volume.fromJSON(initialFiles, cwd);

  const fs: FileSystem = {
    async exists(p: string) {
      try {
        vol.statSync(p);
        return true;
      } catch {
        return false;
      }
    },
    async lstat(p: string) {
      return vol.lstatSync(p) as any;
    },
    async rename(oldPath: string, newPath: string) {
      vol.renameSync(oldPath, newPath);
    },
    async symlink(target: string, p: string) {
      vol.symlinkSync(target, p);
    },
  };

  return { fs, vol, cwd };
}
