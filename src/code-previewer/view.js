/**
 * Frontend JavaScript for Code Previewer Block
 * Uses CodeMirror for syntax highlighting
 */

import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { json } from '@codemirror/lang-json';
import { php } from '@codemirror/lang-php';
import { python } from '@codemirror/lang-python';
import { xml } from '@codemirror/lang-xml';
import { sql } from '@codemirror/lang-sql';
import { markdown } from '@codemirror/lang-markdown';
import { indentUnit } from '@codemirror/language';
import { closeBrackets } from '@codemirror/autocomplete';
import {
	dracula,
	solarizedLight,
	cobalt,
	tomorrow
} from 'thememirror';

// Get language extension
function getLanguageExtension(lang) {
	switch (lang) {
		case 'javascript':
		case 'js':
		case 'jsx':
			return javascript();
		case 'typescript':
		case 'ts':
		case 'tsx':
			return javascript({ typescript: true });
		case 'html':
			return html();
		case 'css':
			return css();
		case 'json':
			return json();
		case 'php':
			return php();
		case 'python':
		case 'py':
			return python();
		case 'xml':
			return xml();
		case 'sql':
			return sql();
		case 'markdown':
		case 'md':
			return markdown();
		default:
			return javascript();
	}
}

// Get theme extension using ThemeMirror
function getThemeExtension(themeName) {
	const themes = {
		'light': solarizedLight,
		'cobalt': cobalt,
		'dracula': dracula,
		'tomorrow': tomorrow,
	};
	return themes[themeName] || themes['tomorrow'];
}

// Initialize CodeMirror for single file blocks
function initializeSingleFileEditor(block, code, language, theme, showLineNumbers, wordWrap, autoCloseBrackets, tabSize, useSpaces) {
	const preElement = block.querySelector('pre.code-previewer-content');
	if (!preElement) return;

	const editorDiv = document.createElement('div');
	editorDiv.className = 'code-previewer-editor';

	preElement.parentNode.replaceChild(editorDiv, preElement);

	const extensions = [basicSetup];

	extensions.push(getLanguageExtension(language));

	if (wordWrap) {
		extensions.push(EditorView.lineWrapping);
	}

	if (autoCloseBrackets) {
		extensions.push(closeBrackets());
	}

	// Tab size and indentation
	extensions.push(indentUnit.of(useSpaces ? ' '.repeat(tabSize) : '\t'));
	extensions.push(EditorState.tabSize.of(tabSize));

	extensions.push(getThemeExtension(theme));

	if (!showLineNumbers) {
		extensions.push(EditorView.theme({
			'.cm-gutters': { display: 'none !important' }
		}));
	}

	// Make read-only for frontend
	extensions.push(EditorState.readOnly.of(true));

	const state = EditorState.create({
		doc: code || '',
		extensions,
	});

	new EditorView({
		state,
		parent: editorDiv,
	});
}

// Initialize CodeMirror for all code previewer blocks
function initializeCodePreviewer() {
	const codeBlocks = document.querySelectorAll('.code-previewer-wrapper');
	
	codeBlocks.forEach(function (block) {
		const filesData = block.dataset.files;
		const activeFileIndex = parseInt(block.dataset.activeFileIndex) || 0;
		const theme = block.dataset.theme || 'tomorrow';
		const showLineNumbers = block.dataset.showLineNumbers === 'true';
		const wordWrap = block.dataset.wordWrap === 'true';
		const autoCloseBrackets = block.dataset.autoCloseBrackets !== 'false';
		const tabSize = parseInt(block.dataset.tabSize) || 4;
		const useSpaces = block.dataset.useSpaces === 'true';

		if (!filesData) {
			const code = block.dataset.code;
			const language = block.dataset.language || 'javascript';

			if (code) {
				const copyButton = block.querySelector('.copy-code-button');
				if (copyButton) {
					copyButton.onclick = () => copyToClipboard(code, `code.${language}`);
				}

				// Initialize CodeMirror for single file
				initializeSingleFileEditor(block, code, language, theme, showLineNumbers, wordWrap, autoCloseBrackets, tabSize, useSpaces);
			}
			return;
		}

		let files;
		try {
			files = JSON.parse(filesData);
		} catch (e) {
			console.error('Failed to parse files data:', e);
			return;
		}

		// Create file tabs
		const tabsContainer = document.createElement('div');
		tabsContainer.className = 'frontend-file-tabs';

		files.forEach((file, index) => {
			const tab = document.createElement('button');
			tab.className = `frontend-file-tab ${index === activeFileIndex ? 'active' : ''}`;
			tab.textContent = file.name;
			tab.onclick = () => switchFile(block, index);
			tab.setAttribute('title', `View ${file.name}`);

			// Add copy button for each file
			const copyButton = document.createElement('button');
			copyButton.className = 'copy-code-button';
			copyButton.innerHTML = '📋';
			copyButton.setAttribute('title', `Copy ${file.name} to clipboard`);
			copyButton.onclick = (e) => {
				e.stopPropagation();
				copyToClipboard(file.code, file.name);
			};

			// Tab wrapper to hold both tab and copy button
			const tabWrapper = document.createElement('div');
			tabWrapper.className = 'frontend-tab-wrapper';
			tabWrapper.appendChild(tab);
			tabWrapper.appendChild(copyButton);

			tabsContainer.appendChild(tabWrapper);
		});

		// Insert tabs before the file contents
		block.insertBefore(tabsContainer, block.firstChild);

		// Initialize CodeMirror for each file
		const fileContents = block.querySelectorAll('.file-content');
		fileContents.forEach((fileContent, index) => {
			const file = files[index];
			if (!file) return;

			const preElement = fileContent.querySelector('pre.code-previewer-content');
			if (!preElement) return;

			// Create a new div for CodeMirror
			const editorDiv = document.createElement('div');
			editorDiv.className = 'code-previewer-editor';

			preElement.parentNode.replaceChild(editorDiv, preElement);

			const extensions = [basicSetup];

			extensions.push(getLanguageExtension(file.language));

			if (wordWrap) {
				extensions.push(EditorView.lineWrapping);
			}

			if (autoCloseBrackets) {
				extensions.push(closeBrackets());
			}

			// Tab size and indentation
			extensions.push(indentUnit.of(useSpaces ? ' '.repeat(tabSize) : '\t'));
			extensions.push(EditorState.tabSize.of(tabSize));

			// Add theme FIRST to set base styling
			extensions.push(getThemeExtension(theme));

			if (!showLineNumbers) {
				extensions.push(EditorView.theme({
					'.cm-gutters': { display: 'none !important' }
				}));
			}

			// Make read-only for frontend
			extensions.push(EditorState.readOnly.of(true));

			const state = EditorState.create({
				doc: file.code || '',
				extensions,
			});

			new EditorView({
				state,
				parent: editorDiv,
			});
		});
	});
}

function copyToClipboard(code, filename) {
	if (!navigator.clipboard) {
		// Fallback for older browsers
		const textArea = document.createElement('textarea');
		textArea.value = code;
		textArea.style.position = 'fixed';
		textArea.style.left = '-9999px';
		document.body.appendChild(textArea);
		textArea.select();

		try {
			document.execCommand('copy');
			showCopyFeedback(`${filename} copied to clipboard!`, 'success');
		} catch (err) {
			showCopyFeedback('Failed to copy code', 'error');
		}

		document.body.removeChild(textArea);
		return;
	}

	// Modern clipboard API
	navigator.clipboard.writeText(code).then(() => {
		showCopyFeedback(`${filename} copied to clipboard!`, 'success');
	}).catch(() => {
		showCopyFeedback('Failed to copy code', 'error');
	});
}

// Show copy feedback notification
function showCopyFeedback(message, type) {
	// Remove any existing notifications
	const existingNotification = document.querySelector('.copy-notification');
	if (existingNotification) {
		existingNotification.remove();
	}

	// Create notification element
	const notification = document.createElement('div');
	notification.className = `copy-notification copy-notification-${type}`;
	notification.textContent = message;
	notification.style.cssText = `
		position: fixed;
		top: 20px;
		right: 20px;
		background: ${type === 'success' ? '#4CAF50' : '#f44336'};
		color: white;
		padding: 12px 20px;
		border-radius: 4px;
		box-shadow: 0 2px 10px rgba(0,0,0,0.2);
		z-index: 10000;
		font-size: 14px;
		transition: all 0.3s ease;
	`;

	document.body.appendChild(notification);

	// Auto-remove after 3 seconds
	setTimeout(() => {
		if (notification.parentNode) {
			notification.style.opacity = '0';
			notification.style.transform = 'translateX(100%)';
			setTimeout(() => {
				if (notification.parentNode) {
					notification.remove();
				}
			}, 300);
		}
	}, 3000);
}

// Switch between files on frontend
function switchFile(block, fileIndex) {
	const tabs = block.querySelectorAll('.frontend-file-tab');
	tabs.forEach((tab, index) => {
		tab.classList.toggle('active', index === fileIndex);
	});

	// Update file content visibility
	const fileContents = block.querySelectorAll('.file-content');
	fileContents.forEach((content, index) => {
		content.classList.toggle('active', index === fileIndex);
		content.classList.toggle('hidden', index !== fileIndex);
	});
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', function () {
		console.log('Code Previewer: DOM loaded, initializing...');
		initializeCodePreviewer();
	});
} else {
	console.log('Code Previewer: DOM already loaded, initializing...');
	initializeCodePreviewer();
}
