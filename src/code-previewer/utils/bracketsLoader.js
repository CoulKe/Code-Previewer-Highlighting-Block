/**
 * Lazy loading utility for closeBrackets extension
 * Only loads when actually needed (admin editor)
 */

let bracketsModuleCache = null;

/**
 * Get closeBrackets extension with lazy loading
 * @param {boolean} autoCloseBrackets - Whether to enable auto-close brackets
 * @param {boolean} isReadOnly - Whether the editor is read-only (frontend)
 * @returns {Promise<Array<Extension>>} CodeMirror extensions for brackets
 */
export async function getCloseBracketsExtension(autoCloseBrackets, isReadOnly = false) {
	// Don't load brackets functionality for read-only editors (frontend)
	if (isReadOnly || !autoCloseBrackets) {
		return [];
	}

	if (bracketsModuleCache) {
		return [bracketsModuleCache()];
	}

	try {
		const module = await import('@codemirror/autocomplete');
		bracketsModuleCache = module.closeBrackets;
		return [bracketsModuleCache()];
	} catch (error) {
		return [];
	}
}

/**
 * Clears the brackets module cache
 */
export function clearBracketsCache() {
	bracketsModuleCache = null;
}
