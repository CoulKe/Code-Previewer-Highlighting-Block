/**
 * Common language loading utilities for CodeMirror
 * Provides lazy loading and caching for language modules
 */

/**
 * Cache for loaded language modules
 */
const languageModuleCache = new Map();

// Get language extension with lazy loading
export async function getLanguageExtension(lang) {
	// Normalize language name
	const normalizedLang = normalizeLanguage(lang);
	
	// Check cache first
	if (languageModuleCache.has(normalizedLang)) {
		const module = languageModuleCache.get(normalizedLang);
		return module();
	}
	
	// Load language module dynamically
	let module;
	try {
		switch (normalizedLang) {
			case 'javascript':
				module = await import('@codemirror/lang-javascript');
				languageModuleCache.set('javascript', module.javascript);
				return module.javascript();
			case 'typescript':
				module = await import('@codemirror/lang-javascript');
				languageModuleCache.set('typescript', module.javascript);
				return module.javascript({ typescript: true });
			case 'html':
			case 'htm':
				module = await import('@codemirror/lang-html');
				languageModuleCache.set('html', module.html);
				return module.html();
			case 'css':
			case 'scss':
			case 'sass':
			case 'less':
			case 'stylus':
				module = await import('@codemirror/lang-css');
				languageModuleCache.set('css', module.css);
				return module.css();
			case 'json':
				module = await import('@codemirror/lang-json');
				languageModuleCache.set('json', module.json);
				return module.json();
			case 'php':
				module = await import('@codemirror/lang-php');
				languageModuleCache.set('php', module.php);
				return module.php();
			case 'python':
				module = await import('@codemirror/lang-python');
				languageModuleCache.set('python', module.python);
				return module.python();
			case 'xml':
				module = await import('@codemirror/lang-xml');
				languageModuleCache.set('xml', module.xml);
				return module.xml();
			case 'sql':
				module = await import('@codemirror/lang-sql');
				languageModuleCache.set('sql', module.sql);
				return module.sql();
			case 'markdown':
				module = await import('@codemirror/lang-markdown');
				languageModuleCache.set('markdown', module.markdown);
				return module.markdown();
			default:
				// Fallback to javascript
				module = await import('@codemirror/lang-javascript');
				languageModuleCache.set('javascript', module.javascript);
				return module.javascript();
		}
	} catch (error) {
		// Fallback to javascript if loading fails
		if (!languageModuleCache.has('javascript')) {
			module = await import('@codemirror/lang-javascript');
			languageModuleCache.set('javascript', module.javascript);
		}
		return languageModuleCache.get('javascript')();
	}
}

/**
 * Normalize language names to handle aliases
 * @param {string} lang - The language name to normalize
 * @returns {string} The normalized language name
 */
export function normalizeLanguage(lang) {
	const languageMap = {
		'js': 'javascript',
		'ts': 'typescript',
		'py': 'python',
		'md': 'markdown'
	};
	return languageMap[lang] || lang;
}

/**
 * Clears the language module cache
 */
export function clearLanguageCache() {
	languageModuleCache.clear();
}

/**
 * Gets cache statistics
 */
export function getCacheStats() {
	return {
		size: languageModuleCache.size,
		keys: Array.from(languageModuleCache.keys())
	};
}
