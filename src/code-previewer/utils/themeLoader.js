/**
 * Common theme loading utilities for CodeMirror
 * Provides lazy loading and caching for theme modules
 */

/**
 * Cache for loaded theme modules
 */
const themeModuleCache = new Map();

/**
 * Get theme extension with lazy loading
 * @param {string} themeName - The name of the theme to load
 */
export async function getThemeExtension(themeName) {
	const normalizedTheme = normalizeThemeName(themeName);
	
	if (themeModuleCache.has(normalizedTheme)) {
		return themeModuleCache.get(normalizedTheme);
	}
	
	let theme;
	try {
		switch (normalizedTheme) {
			case 'light':
				const bbeditModule = await import('@uiw/codemirror-theme-bbedit');
				theme = bbeditModule.bbedit;
				themeModuleCache.set('light', theme);
				return theme;
			case 'dark':
				const githubDarkModule = await import('@uiw/codemirror-theme-github');
				theme = githubDarkModule.githubDark;
				themeModuleCache.set('dark', theme);
				return theme;
			case 'cobalt':
				const cobaltModule = await import('thememirror');
				theme = cobaltModule.cobalt;
				themeModuleCache.set('cobalt', theme);
				return theme;
			default:
				const fallbackModule = await import('@uiw/codemirror-theme-github');
				theme = fallbackModule.githubDark;
				themeModuleCache.set('dark', theme);
				return theme;
		}
	} catch (error) {
		// Fallback to dark theme if loading fails
		if (!themeModuleCache.has('dark')) {
			const fallbackModule = await import('@uiw/codemirror-theme-github');
			theme = fallbackModule.githubDark;
			themeModuleCache.set('dark', theme);
		}
		return themeModuleCache.get('dark');
	}
}

/**
 * Normalize theme names to handle variations
 * @param {string} themeName - The name of the theme to normalize
 * @returns {string} The normalized theme name
 */
export function normalizeThemeName(themeName) {
	const themeMap = {
		'bbedit': 'light',
		'github': 'dark',
		'github-dark': 'dark',
		'githubDark': 'dark',
		'cobalt': 'cobalt'
	};
	return themeMap[themeName] || themeName;
}

/**
 * Get available themes list
 * @returns {Array<{value: string, label: string}>} The available themes list
 */
export function getAvailableThemes() {
	return [
		{ value: 'light', label: 'Light (BBEdit)' },
		{ value: 'dark', label: 'Dark (GitHub)' },
		{ value: 'cobalt', label: 'Cobalt' }
	];
}

/**
 * Clears the theme module cache
 */
export function clearThemeCache() {
	themeModuleCache.clear();
}

/**
 * Get theme cache statistics
 * @returns {Object} The theme cache statistics
 */
export function getThemeCacheStats() {
	return {
		size: themeModuleCache.size,
		keys: Array.from(themeModuleCache.keys())
	};
}
