import fs from 'node:fs/promises';
import type { FileSystem } from './fs';

export const nodeFs: FileSystem = {
  async exists(p: string) {
    try {
      await fs.access(p);
      return true;
    } catch {
      return false;
    }
  },
  lstat(p: string) {
    return fs.lstat(p);
  },
  rename(oldPath: string, newPath: string) {
    return fs.rename(oldPath, newPath);
  },
  symlink(target: string, p: string) {
    return fs.symlink(target, p);
  },
};
