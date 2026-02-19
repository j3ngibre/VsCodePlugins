"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
function activate(context) {
    const commentBlocks = (editor) => {
        if (!editor.document.fileName.endsWith('.adb') && !editor.document.fileName.endsWith('.ads'))
            return;
        const document = editor.document;
        const lines = document.getText().split('\n');
        const edit = new vscode.WorkspaceEdit();
        let startLine = -1;
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line === '-/') {
                if (startLine === -1) {
                    startLine = i;
                }
                else {
                    const endLine = i;
                    // Comentar todo el bloque incluyendo los marcadores
                    for (let j = startLine; j <= endLine; j++) {
                        const text = document.lineAt(j).text;
                        if (!text.trimStart().startsWith('--')) {
                            edit.replace(document.uri, new vscode.Range(j, 0, j, text.length), '-- ' + text);
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
        if (editor)
            commentBlocks(editor);
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
function deactivate() { }
//# sourceMappingURL=extension.js.map