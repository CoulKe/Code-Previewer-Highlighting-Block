/**
 * Common constants for Code Previewer Highlighting Block
 * Centralized language and theme options
 */

export const getLanguageOptions = (__) => [
	{ label: __('JavaScript', 'code-previewer-highlighting-block'), value: 'javascript' },
	{ label: __('TypeScript', 'code-previewer-highlighting-block'), value: 'typescript' },
	{ label: __('HTML', 'code-previewer-highlighting-block'), value: 'html' },
	{ label: __('CSS', 'code-previewer-highlighting-block'), value: 'css' },
	{ label: __('JSON', 'code-previewer-highlighting-block'), value: 'json' },
	{ label: __('PHP', 'code-previewer-highlighting-block'), value: 'php' },
	{ label: __('Python', 'code-previewer-highlighting-block'), value: 'python' },
	{ label: __('XML', 'code-previewer-highlighting-block'), value: 'xml' },
	{ label: __('SQL', 'code-previewer-highlighting-block'), value: 'sql' },
	{ label: __('Markdown', 'code-previewer-highlighting-block'), value: 'markdown' }
];

export const getThemeOptions = (__) => [
	{ label: __('Light', 'code-previewer-highlighting-block'), value: 'light' },
	{ label: __('Dark', 'code-previewer-highlighting-block'), value: 'dark' },
	{ label: __('Cobalt', 'code-previewer-highlighting-block'), value: 'cobalt' }
];

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

export const DEFAULT_SETTINGS = {
	theme: 'dark',
	showLineNumbers: true,
	wordWrap: false,
	tabSize: 4,
	useSpaces: true,
	highlightedLines: [],
	maxHeight: 400
};
