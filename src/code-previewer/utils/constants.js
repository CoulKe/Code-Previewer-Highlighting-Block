/**
 * Common constants for Code Previewer
 * Centralized language and theme options
 */

// Language options with internationalization support
export const getLanguageOptions = (__) => [
	{ label: __('JavaScript', 'code-previewer'), value: 'javascript' },
	{ label: __('TypeScript', 'code-previewer'), value: 'typescript' },
	{ label: __('HTML', 'code-previewer'), value: 'html' },
	{ label: __('CSS', 'code-previewer'), value: 'css' },
	{ label: __('JSON', 'code-previewer'), value: 'json' },
	{ label: __('PHP', 'code-previewer'), value: 'php' },
	{ label: __('Python', 'code-previewer'), value: 'python' },
	{ label: __('XML', 'code-previewer'), value: 'xml' },
	{ label: __('SQL', 'code-previewer'), value: 'sql' },
	{ label: __('Markdown', 'code-previewer'), value: 'markdown' }
];

// Theme options with internationalization support
export const getThemeOptions = (__) => [
	{ label: __('Light', 'code-previewer'), value: 'light' },
	{ label: __('Dark', 'code-previewer'), value: 'dark' },
	{ label: __('Cobalt', 'code-previewer'), value: 'cobalt' }
];

// File extension to language mapping
export const FILE_EXTENSION_MAP = {
	'js': 'javascript',
	'jsx': 'javascript',
	'ts': 'typescript',
	'tsx': 'typescript',
	'html': 'html',
	'htm': 'html',
	'css': 'css',
	'scss': 'css',
	'sass': 'css',
	'json': 'json',
	'php': 'php',
	'py': 'python',
	'xml': 'xml',
	'sql': 'sql',
	'md': 'markdown'
};

// Default settings
export const DEFAULT_SETTINGS = {
	theme: 'dark',
	showLineNumbers: true,
	wordWrap: false,
	tabSize: 4,
	useSpaces: true,
	highlightedLines: [],
	maxHeight: 400
};
