import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    const commentBlocks = (editor: vscode.TextEditor) => {
        if (!editor.document.fileName.endsWith('.adb') && !editor.document.fileName.endsWith('.ads')) return;

        const document = editor.document;
        const lines = document.getText().split('\n');

        const edit = new vscode.WorkspaceEdit();
        let startLine = -1;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (line === '-/') {
                if (startLine === -1) {
                    startLine = i;
                } else {
                    const endLine = i;

                    // Comentar todo el bloque incluyendo los marcadores
                    for (let j = startLine; j <= endLine; j++) {
                        const text = document.lineAt(j).text;
                        if (!text.trimStart().startsWith('--')) {
                            edit.replace(
                                document.uri,
                                new vscode.Range(j, 0, j, text.length),
                                '-- ' + text
                            );
                        }
                    }

                    startLine = -1;
                }
            }
        }

        if (edit.entries().length > 0) {
            vscode.workspace.applyEdit(edit);
        }
    };

    // Ejecutar para todos los editores ya abiertos
    vscode.window.visibleTextEditors.forEach(editor => commentBlocks(editor));

    // Auto-comentar al abrir un archivo
    const openDisposable = vscode.workspace.onDidOpenTextDocument(doc => {
        const editor = vscode.window.visibleTextEditors.find(e => e.document === doc);
        if (editor) commentBlocks(editor);
    });

    // Auto-comentar al cambiar un documento
    const changeDisposable = vscode.workspace.onDidChangeTextDocument(event => {
        const editor = vscode.window.visibleTextEditors.find(e => e.document === event.document);
        if (editor) {
            setTimeout(() => commentBlocks(editor), 50);
        }
    });

    context.subscriptions.push(openDisposable, changeDisposable);
}

export function deactivate() {}
