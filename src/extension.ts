import path from 'node:path';
import * as vscode from 'vscode';
import { nodeFs } from './nodeFs';
import { syncAgentsAndClaude } from './sync';

let isRunning = false;

function isAgentsOrClaude(doc: vscode.TextDocument): boolean {
  const base = path.basename(doc.uri.fsPath);
  return base === 'AGENTS.md' || base === 'CLAUDE.md';
}

export function activate(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('agentsMdSync');
  const enabled = config.get<boolean>('enabled', true);
  if (!enabled) return;

  const runForFolder = async (workspaceFolder: vscode.WorkspaceFolder) => {
    if (isRunning) return;
    isRunning = true;
    try {
      await syncAgentsAndClaude(nodeFs, { workspaceFolder: workspaceFolder.uri.fsPath });
    } finally {
      isRunning = false;
    }
  };

  const runForUri = async (uri: vscode.Uri) => {
    const folder = vscode.workspace.getWorkspaceFolder(uri);
    if (!folder) return;
    await runForFolder(folder);
  };

  const onSave = vscode.workspace.onDidSaveTextDocument(async (doc: vscode.TextDocument) => {
    if (!isAgentsOrClaude(doc)) return;
    await runForUri(doc.uri);

    const folderUri = vscode.Uri.file(path.dirname(doc.uri.fsPath));
    const agentsUri = vscode.Uri.file(path.join(folderUri.fsPath, 'AGENTS.md'));
    const claudeUri = vscode.Uri.file(path.join(folderUri.fsPath, 'CLAUDE.md'));

    try {
      await vscode.workspace.fs.stat(agentsUri);
      await vscode.commands.executeCommand('vscode.open', agentsUri, { preview: true, preserveFocus: true });
    } catch {
      // ignore
    }

    try {
      await vscode.workspace.fs.stat(claudeUri);
      await vscode.commands.executeCommand('vscode.open', claudeUri, { preview: true, preserveFocus: true });
    } catch {
      // ignore
    }
  });

  context.subscriptions.push(onSave);

  for (const folder of vscode.workspace.workspaceFolders ?? []) {
    void runForFolder(folder);
  }
}

export function deactivate() {
  // noop
}
