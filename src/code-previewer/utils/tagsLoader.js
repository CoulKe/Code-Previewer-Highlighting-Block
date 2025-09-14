/**
 * Lazy loading utility for autoCloseTags extension
 * Only loads when actually needed (admin editor)
 */

/**
 * Cache for loaded tags module
 */
let tagsModuleCache = null;

/**
 * Get autoCloseTags extension with lazy loading
 * @param {boolean} autoCloseTags - Whether to enable auto-close tags
 * @param {boolean} isReadOnly - Whether the editor is read-only (frontend)
 * @returns {Promise<Array<Extension>>} CodeMirror extensions for auto-close tags
 */
export async function getAutoCloseTagsExtension(autoCloseTags, isReadOnly = false) {
	// Don't load tags functionality for read-only editors (frontend)
	if (isReadOnly || !autoCloseTags) {
		return [];
	}

	if (tagsModuleCache) {
		return [tagsModuleCache];
	}

	try {
		const module = await import('@codemirror/lang-html');
		tagsModuleCache = module.autoCloseTags;
		return [tagsModuleCache];
	} catch (error) {
		return [];
	}
}

/**
 * Clears the tags module cache
 */
export function clearTagsCache() {
	tagsModuleCache = null;
}
