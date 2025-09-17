/**
 * Frontend JavaScript for Code Previewer Block
 * Uses CodeMirror for syntax highlighting with multi-file support
 */

import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { indentUnit } from '@codemirror/language';
import { getLanguageExtension } from './utils/languageLoader';
import { getThemeExtension, getAvailableThemes } from './utils/themeLoader';
import { copyFileCode } from './utils/copyUtils';
import { createLineHighlightExtension } from './utils/highlightUtils';
import { createSimpleAutoHeight } from './utils/autoHeight';

// Code Previewer Initialization
function initializeCodePreviewer() {
	const codeBlocks = document.querySelectorAll('.code-previewer-wrapper');
	
	codeBlocks.forEach(function(block) {
		// Add frontend class to distinguish from admin editor
		block.classList.add('frontend');
		
		const filesData = block.dataset.files;
		const activeFileIndex = 0;
		const theme = block.dataset.theme || 'dark';
		const highlightedLines = JSON.parse(block.dataset.highlightedLines || '[]');
		
		if (!filesData) return;
		
		let files;
		try {
			files = JSON.parse(filesData);
		} catch (e) {
			const l10n = window.codePreviewerL10n || {};
			block.innerHTML = `
				<div class="code-previewer-error">
					<div class="error-content">
						<span class="dashicons dashicons-warning"></span>
						<span>${l10n.loadError || 'Failed to load code preview. Please check the block configuration.'}</span>
					</div>
				</div>
			`;
			return;
		}
		
		// Create file tabs
		const tabsContainer = document.createElement('div');
		tabsContainer.className = 'frontend-file-tabs';
		
		// Add theme toggle
		const themeToggle = document.createElement('div');
		themeToggle.className = 'frontend-theme-toggle';
		
		const themeLabel = document.createElement('span');
		themeLabel.className = 'theme-label';
		themeLabel.textContent = window.codePreviewerL10n?.themeLabel || 'Theme:';
		
		const themeSelect = document.createElement('select');
		themeSelect.className = 'theme-select';
		
		// Get user's preferred theme from localStorage or use admin default
		const userThemeKey = `code-previewer-theme-${block.closest('.wp-block-luteya-code-previewer')?.id || 'default'}`;
		const currentTheme = localStorage.getItem(userThemeKey) || theme;
		
		const l10n = window.codePreviewerL10n || {};
		const themeOptions = [
			...getAvailableThemes(),
			{ 
				value: theme, 
				label: `${l10n.defaultTheme || 'Default'} (${theme === 'light' ? (l10n.light || 'Light') : theme === 'cobalt' ? (l10n.cobalt || 'Cobalt') : (l10n.dark || 'Dark')})` 
			}
		];
		
		themeOptions.forEach(option => {
			const optionElement = document.createElement('option');
			optionElement.value = option.value;
			optionElement.textContent = option.label;
			if (option.value === currentTheme) {
				optionElement.selected = true;
			}
			themeSelect.appendChild(optionElement);
		});
		
		themeSelect.addEventListener('change', async (e) => {
			const newTheme = e.target.value;
			localStorage.setItem(userThemeKey, newTheme);
			await updateBlockTheme(block, newTheme, highlightedLines);
		});
		
		themeToggle.appendChild(themeLabel);
		themeToggle.appendChild(themeSelect);
		tabsContainer.appendChild(themeToggle);
		
		files.forEach((file, index) => {
			const tabWrapper = document.createElement('div');
			tabWrapper.className = 'frontend-tab-wrapper';
			
			const tab = document.createElement('button');
			const isActive = index === activeFileIndex;

			tab.className = `frontend-file-tab ${isActive ? 'active' : ''}`;
			tab.textContent = file.name;
			tab.onclick = () => switchFile(block, index);
			tab.setAttribute('title', `${l10n.viewFile || 'View'} ${file.name}`);
			
			const copyButton = document.createElement('button');
			copyButton.className = 'copy-code-button';
			copyButton.innerHTML = '📋';
			copyButton.setAttribute('title', `${l10n.copyFile || 'Copy'} ${file.name} ${l10n.toClipboard || 'to clipboard'}`);
			copyButton.onclick = () => copyFileCode(file.code, copyButton);
			
			tabWrapper.appendChild(tab);
			tabWrapper.appendChild(copyButton);
			tabsContainer.appendChild(tabWrapper);
		});
		
		// Insert tabs before the file contents
		block.insertBefore(tabsContainer, block.firstChild);
		
		// Initialize CodeMirror for each file
		const fileContents = block.querySelectorAll('.file-content');
		fileContents.forEach(async (fileContent, index) => {
			const file = files[index];
			if (!file) return;
			
			const preElement = fileContent.querySelector('pre.code-previewer-content');
			if (!preElement) return;
			
			const editorDiv = document.createElement('div');
			editorDiv.className = 'code-previewer-editor';
			
			preElement.parentNode.replaceChild(editorDiv, preElement);
			
			const extensions = await createEditorExtensions(file, block, currentTheme, highlightedLines);
			
			const state = EditorState.create({
				doc: file.code || '',
				extensions,
			});
			
			const editorView = new EditorView({
				state,
				parent: editorDiv,
			});
			
			editorDiv.cmView = editorView;

			const copyButton = fileContent.querySelector('.copy-code-button');
			if (copyButton) {
				copyButton.onclick = () => copyFileCode(file.code, copyButton);
			}
		});
		switchFile(block, activeFileIndex);
	});
}

/**
 * Creates CodeMirror extensions for a file
 * @param {Object} file - The file object
 * @param {Object} block - The block object
 * @param {string} theme - The theme name
 * @param {Array<number>} highlightedLines - The highlighted lines
 */
async function createEditorExtensions(file, block, theme, highlightedLines = []) {
	const showLineNumbers = block.dataset.showLineNumbers === 'true';
	const wordWrap = block.dataset.wordWrap === 'true';
	const tabSize = parseInt(block.dataset.tabSize) || 4;
	const useSpaces = block.dataset.useSpaces === 'true';
	const maxHeight = parseInt(block.dataset.maxHeight) || 400;
	
	const extensions = [basicSetup];
	
	const languageExtension = await getLanguageExtension(file.language);
	extensions.push(languageExtension);

	if (wordWrap) {
		extensions.push(EditorView.lineWrapping);
	}


	extensions.push(indentUnit.of(useSpaces ? ' '.repeat(tabSize) : '\t'));
	extensions.push(EditorState.tabSize.of(tabSize));
	
	const themeExtension = await getThemeExtension(theme);
	extensions.push(themeExtension);

	// Line highlighting
	const highlightExtensions = createLineHighlightExtension(highlightedLines);
	extensions.push(...highlightExtensions);

	// Auto-height functionality with custom maxHeight
	extensions.push(createSimpleAutoHeight({ maxHeight }));

	// Hide line numbers if not needed (after theme is applied)
	if (!showLineNumbers) {
		extensions.push(EditorView.theme({
			'.cm-gutters': { display: 'none !important' }
		}));
	}

	// Read-only for frontend
	extensions.push(EditorState.readOnly.of(true));
	
	return extensions;
}

/**
 * Update theme for a block
 * @param {Object} block - The block object
 * @param {string} newTheme - The new theme name
 * @param {Array<number>} highlightedLines - The highlighted lines
 */
async function updateBlockTheme(block, newTheme, highlightedLines = []) {
	// Get highlightedLines from block data if not provided
	if (highlightedLines.length === 0) {
		highlightedLines = JSON.parse(block.dataset.highlightedLines || '[]');
	}
	
	const editorDivs = block.querySelectorAll('.code-previewer-editor');
	
	const updatePromises = Array.from(editorDivs).map(async (editorDiv) => {
		if (editorDiv.cmView) {
			// Get current content
			const currentContent = editorDiv.cmView.state.doc.toString();
			
			// Get language from the file content div
			const fileContent = editorDiv.closest('.file-content');
			const language = fileContent ? fileContent.dataset.language : 'javascript';
			
			// File object for utility function
			const file = { language };
			
			editorDiv.cmView.destroy();
			
			const extensions = await createEditorExtensions(file, block, newTheme, highlightedLines);
			
			const state = EditorState.create({
				doc: currentContent,
				extensions,
			});
			
			const editorView = new EditorView({
				state,
				parent: editorDiv,
			});
			
			editorDiv.cmView = editorView;
		}
	});
	
	await Promise.all(updatePromises);
	
	const themeSelect = block.querySelector('.theme-select');
	if (themeSelect) {
		themeSelect.value = newTheme;
	}
}

/**
 * Switch between files on frontend
 * @param {Object} block - The block object
 * @param {number} fileIndex - The file index
 */
function switchFile(block, fileIndex) {
	const tabs = block.querySelectorAll('.frontend-file-tab');
	tabs.forEach((tab, index) => {
		tab.classList.toggle('active', index === fileIndex);
	});
	
	const fileContents = block.querySelectorAll('.file-content');
	fileContents.forEach((content, index) => {
		content.classList.toggle('active', index === fileIndex);
		content.classList.toggle('hidden', index !== fileIndex);
	});
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', function() {
		initializeCodePreviewer();
	});
} else {
	initializeCodePreviewer();
}