/**
 * Frontend JavaScript for Code Previewer Block
 * Uses CodeMirror for syntax highlighting with multi-file support
 */

import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { indentUnit } from '@codemirror/language';
import { getLanguageExtension } from './utils/languageLoader';
import { getThemeExtension } from './utils/themeLoader';
import { copyFileCode } from './utils/copyUtils';
import { createLineHighlightExtension } from './utils/highlightUtils';
import { createSimpleAutoHeight } from './utils/autoHeight';

// Code Previewer Initialization
function initializeCodePreviewer() {
	const codeBlocks = document.querySelectorAll('.code-previewer-wrapper');
	
	codeBlocks.forEach(function(block) {
		// Frontend class to distinguish from admin editor
		block.classList.add('frontend');
		
		const filesData = block.dataset.files;
		const activeFileIndex = 0;
		const theme = block.dataset.theme || 'dark';
		const highlightedLines = JSON.parse(block.dataset.highlightedLines || '[]');
		const isMultiFile = block.dataset.isMultiFile !== 'false';
		
		if (!filesData) return;
		
		let files;
		try {
			files = JSON.parse(filesData);
		} catch (e) {
			const l10n = window.codePreviewerHighlightingBlockL10n || {};
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
		
		// File tabs
		const tabsContainer = document.createElement('div');
		tabsContainer.className = 'frontend-file-tabs';
		
		const themeToggle = document.createElement('div');
		themeToggle.className = 'frontend-theme-toggle';
		
		const themeLabel = document.createElement('span');
		themeLabel.className = 'theme-label';
		themeLabel.textContent = window.codePreviewerHighlightingBlockL10n?.themeLabel || 'Theme:';
		
		const themeSelect = document.createElement('select');
		themeSelect.className = 'theme-select';
		
		const userThemeKey = `code-previewer-theme-${block.closest('.wp-block-code-previewer-highlighting-block-code-previewer')?.id || 'default'}`;
		const currentTheme = localStorage.getItem(userThemeKey) || theme;
		
		const l10n = window.codePreviewerHighlightingBlockL10n || {};
		
		const localizedThemeOptions = [
			{ value: 'light', label: l10n.light || 'Light' },
			{ value: 'dark', label: l10n.dark || 'Dark' }
		];
		
		const themeOptions = [
			...localizedThemeOptions,
			{ 
				value: theme, 
				label: `${l10n.defaultTheme || 'Default'} (${theme === 'light' ? (l10n.light || 'Light') : (l10n.dark || 'Dark')})` 
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
			
			// Update all blocks with the new theme
			const allBlocks = document.querySelectorAll('.code-previewer-wrapper.frontend');
			const updatePromises = Array.from(allBlocks).map(async (otherBlock) => {
				const otherHighlightedLines = JSON.parse(otherBlock.dataset.highlightedLines || '[]');
				await updateBlockTheme(otherBlock, newTheme, otherHighlightedLines);
			});
			
			// Update all theme selectors to reflect the new selection
			const allThemeSelects = document.querySelectorAll('.code-previewer-wrapper.frontend .theme-select');
			allThemeSelects.forEach(select => {
				select.value = newTheme;
			});
			
			await Promise.all(updatePromises);
		});
		
		themeToggle.appendChild(themeLabel);
		themeToggle.appendChild(themeSelect);
		tabsContainer.appendChild(themeToggle);
		
		if (isMultiFile) {
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
				const copyTitle = `${l10n.copyFile || 'Copy'} ${file.name} ${l10n.toClipboard || 'to clipboard'}`;
				copyButton.setAttribute('title', copyTitle);
				copyButton.onclick = () => copyFileCode(file.code, copyButton);
				
				tabWrapper.appendChild(tab);
				tabWrapper.appendChild(copyButton);
				tabsContainer.appendChild(tabWrapper);
			});
		}
		
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
				const localizedTitle = `${l10n.copyFile || 'Copy'} ${file.name} ${l10n.toClipboard || 'to clipboard'}`;
				copyButton.setAttribute('title', localizedTitle);
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
	if (highlightedLines.length === 0) {
		highlightedLines = JSON.parse(block.dataset.highlightedLines || '[]');
	}
	
	const editorDivs = block.querySelectorAll('.code-previewer-editor');
	
	// Loading overlay to prevent layout shift
	const loadingOverlay = document.createElement('div');
	loadingOverlay.className = 'theme-loading-overlay';
	loadingOverlay.innerHTML = '<div class="theme-loading-spinner"></div>';
	loadingOverlay.style.cssText = `
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(255, 255, 255, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
	`;
	
	const updatePromises = Array.from(editorDivs).map(async (editorDiv) => {
		if (editorDiv.cmView) {
			// Store current dimensions to prevent layout shift
			const currentHeight = editorDiv.offsetHeight;
			const currentWidth = editorDiv.offsetWidth;
			
			editorDiv.style.position = 'relative';
			editorDiv.appendChild(loadingOverlay);
			
			const currentContent = editorDiv.cmView.state.doc.toString();
			
			const fileContent = editorDiv.closest('.file-content');
			const language = fileContent ? fileContent.dataset.language : 'javascript';
			
			const file = { language };
			
			editorDiv.cmView.destroy();
			
			// Maintain dimensions during recreation
			editorDiv.style.height = currentHeight + 'px';
			editorDiv.style.width = currentWidth + 'px';
			
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
			
			if (editorDiv.contains(loadingOverlay)) {
				editorDiv.removeChild(loadingOverlay);
			}
			
			editorDiv.style.height = '';
			editorDiv.style.width = '';
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