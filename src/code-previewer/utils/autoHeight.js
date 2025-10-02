/**
 * Auto-height utility for CodeMirror
 * Automatically adjusts editor height based on content
 */

import { ViewPlugin } from '@codemirror/view';

/**
 * Create an auto-height extension for CodeMirror
 * @param {Object} options - Configuration options
 * @param {number} options.minHeight - Minimum height in pixels (default: 100)
 * @param {number} options.maxHeight - Maximum height in pixels (default: 500)
 * @param {number} options.lineHeight - Line height in pixels (default: 1.5)
 * @returns {Extension} CodeMirror extension for auto-height
 */
export function createAutoHeightExtension(options = {}) {
	const {
		minHeight = 100,
		maxHeight = 500,
		lineHeight = 1.5
	} = options;

	return ViewPlugin.fromClass(class {
		constructor(view) {
			this.view = view;
			this.updateHeight();
		}

		update(update) {
			if (update.docChanged || update.viewportChanged) {
				this.updateHeight();
			}
		}

		updateHeight() {
			const doc = this.view.state.doc;
			const lineCount = doc.lines;
			
			// Calculate height based on line count
			const fontSize = parseInt(getComputedStyle(this.view.dom).fontSize) || 14;
			const calculatedHeight = Math.max(
				minHeight,
				Math.min(maxHeight, lineCount * fontSize * lineHeight + 24) // 24px for padding
			);
			
			this.view.dom.style.height = `${calculatedHeight}px`;
			
			const parent = this.view.dom.parentElement;
			if (parent && parent.classList.contains('code-previewer-editor')) {
				parent.style.height = 'auto';
			}
		}
	});
}

/**
 * Create a simple auto-height extension with default settings
 * @param {Object} options - Configuration options (optional)
 * @returns {Extension} CodeMirror extension for auto-height
 */
export function createSimpleAutoHeight(options = {}) {
	return createAutoHeightExtension({
		minHeight: 100,
		maxHeight: 400,
		lineHeight: 1.5,
		...options
	});
}
