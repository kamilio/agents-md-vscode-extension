import path from 'node:path';
import * as vscode from 'vscode';
import { nodeFs } from './nodeFs';
import { syncAgentsAndClaude } from './sync';

const runningFor = new Set<string>();

function isAgentsOrClaude(doc: vscode.TextDocument): boolean {
  const base = path.basename(doc.uri.fsPath);
  return base === 'AGENTS.md' || base === 'CLAUDE.md';
}

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('agentsMdSync');
  const enabled = config.get<boolean>('enabled', true);
  if (!enabled) return;

  const runForDirectory = async (directoryPath: string) => {
    if (runningFor.has(directoryPath)) return;
    runningFor.add(directoryPath);
    try {
      await syncAgentsAndClaude(nodeFs, { workspaceFolder: directoryPath });
    } finally {
      runningFor.delete(directoryPath);
    }
  };

  const runForUri = async (uri: vscode.Uri) => {
    if (uri.scheme !== 'file') return;
    const folder = vscode.workspace.getWorkspaceFolder(uri);
    if (!folder) return;

    await runForDirectory(path.dirname(uri.fsPath));
  };

  const onSave = vscode.workspace.onDidSaveTextDocument(async (doc: vscode.TextDocument) => {
    if (!isAgentsOrClaude(doc)) return;
    await runForUri(doc.uri);
  });

  context.subscriptions.push(onSave);

  const initialSync = async () => {
    for (const folder of vscode.workspace.workspaceFolders ?? []) {
      await runForDirectory(folder.uri.fsPath);
    }

    const candidates = await vscode.workspace.findFiles(
      '**/{AGENTS.md,CLAUDE.md}',
      '**/{node_modules,.git,dist,out}/**',
    );
    const directories = new Set(candidates.map((uri) => path.dirname(uri.fsPath)));
    for (const directory of directories) {
      await runForDirectory(directory);
    }
  };

  void initialSync();
}

export function deactivate() {
  // noop
}
