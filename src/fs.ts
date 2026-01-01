export interface FileSystem {
  exists(path: string): Promise<boolean>;
  lstat(path: string): Promise<{ isSymbolicLink(): boolean }>;
  rename(oldPath: string, newPath: string): Promise<void>;
  symlink(target: string, path: string): Promise<void>;
}

export function isNotFoundError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as any).code === 'ENOENT'
  );
}
