// import path from 'path';

const vscode = require('vscode');
const path = require("path")
const fs = require("fs")

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	var Module = {
		handleSource: function() {
			vscode.window.showInformationMessage('Beautifier is still initializing... try again');
			return null;
		},
	};

	const js_path = path.join(context.extensionPath, "beautifier", "script.js");

	const js_code = fs.readFileSync(js_path, "utf8");
	eval(js_code);

	const disposable = vscode.commands.registerCommand('luau-beautifier.beautifyLuau', async function () {
		var text_editor = vscode.window.activeTextEditor;
		if (!text_editor) {
			vscode.window.showErrorMessage('No open file to beautify.');
			return;
		}

		try {
			const result = Module.handleSource(text_editor.document.getText(), false, false, false);

			if (result) {
				text_editor.edit((edit_builder) => {
					edit_builder.replace(new vscode.Range(0, 0, text_editor.document.lineCount, 0), result);
				});
			};
		} catch (err) {
			vscode.window.showErrorMessage(err);
		};
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
