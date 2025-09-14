/**
 * Line highlighting utilities for CodeMirror
 * Provides functionality to highlight specific lines
 */

import { EditorView } from 'codemirror';
import { ViewPlugin, Decoration } from '@codemirror/view';

/**
 * Create a line highlighting extension for CodeMirror
 * @param {Array<number>} highlightedLines - Array of line numbers to highlight (1-indexed)
 * @returns {Array<Extension>} CodeMirror extensions for line highlighting
 */
export function createLineHighlightExtension(highlightedLines = []) {
	if (!highlightedLines || highlightedLines.length === 0) {
		return [];
	}

	// Convert 1-indexed line numbers to 0-indexed
	const linesToHighlight = highlightedLines.map(line => line - 1);

	// Line highlight marker
	const lineHighlightMark = Decoration.line({
		class: 'cm-line-highlighted'
	});

	// Plugin that applies highlighting
	const lineHighlightPlugin = ViewPlugin.fromClass(class {
		constructor(view) {
			this.decorations = this.buildDecorations(view);
		}

		update(update) {
			if (update.docChanged) {
				this.decorations = this.buildDecorations(update.view);
			}
		}

		buildDecorations(view) {
			const decorations = [];
			
			linesToHighlight.forEach(lineNumber => {
				if (lineNumber >= 0 && lineNumber < view.state.doc.lines) {
					const line = view.state.doc.line(lineNumber + 1);
					decorations.push(lineHighlightMark.range(line.from));
				}
			});
			
			return Decoration.set(decorations);
		}
	}, {
		decorations: v => v.decorations
	});

	return [
		lineHighlightPlugin,
		EditorView.theme({
			'.cm-line-highlighted': {
				backgroundColor: 'rgba(255, 235, 59, 0.3)',
				borderLeft: '3px solid #ffc107',
				paddingLeft: '8px',
				marginLeft: '-8px'
			}
		})
	];
}

/**
 * Parse highlighted lines string (comma-separated) into array of numbers
 * @param {string} highlightedLinesStr - Comma-separated string of line numbers
 * @returns {Array<number>} Array of line numbers
 */
export function parseHighlightedLines(highlightedLinesStr) {
	if (!highlightedLinesStr || typeof highlightedLinesStr !== 'string') {
		return [];
	}
	
	return highlightedLinesStr
		.split(',')
		.map(line => parseInt(line.trim()))
		.filter(line => !isNaN(line) && line > 0);
}

/**
 * Validate highlighted lines array
 * @param {Array<number>} highlightedLines - Array of line numbers
 * @param {number} maxLines - Maximum number of lines in document
 * @returns {Array<number>} Validated array of line numbers
 */
export function validateHighlightedLines(highlightedLines, maxLines = Infinity) {
	if (!Array.isArray(highlightedLines)) {
		return [];
	}
	
	return highlightedLines
		.filter(line => typeof line === 'number' && line > 0 && line <= maxLines)
		.sort((a, b) => a - b);
}
