/**
 * Common copy utilities for Code Previewer
 * Handles clipboard operations with fallbacks
 */

/**
 * Copy text to clipboard with visual feedback
 * @param {string} text - Text to copy
 * @param {HTMLElement} button - Button element for visual feedback
 * @param {string} successText - Text to show on success (default: '✓')
 * @param {string} errorText - Text to show on error (default: '❌')
 * @param {number} timeout - Timeout for feedback in ms (default: 2000)
 */
export function copyToClipboard(text, button, successText = '✓', errorText = '❌', timeout = 2000) {
	const originalContent = button.innerHTML;
	
	if (navigator.clipboard && navigator.clipboard.writeText) {
		navigator.clipboard.writeText(text).then(() => {
			button.innerHTML = `<span class="copy-icon">${successText}</span>`;
			button.classList.add('copied');
			setTimeout(() => {
				button.innerHTML = originalContent;
				button.classList.remove('copied');
			}, timeout);
		}).catch((err) => {
			button.innerHTML = `<span class="copy-icon">${errorText}</span>`;
			button.classList.add('error');
			setTimeout(() => {
				button.innerHTML = originalContent;
				button.classList.remove('error');
			}, timeout);
		});
	} else {
		// Fallback for older browsers
		const textArea = document.createElement('textarea');
		textArea.value = text;
		document.body.appendChild(textArea);
		textArea.select();
		try {
			document.execCommand('copy');
			button.innerHTML = `<span class="copy-icon">${successText}</span>`;
			button.classList.add('copied');
			setTimeout(() => {
				button.innerHTML = originalContent;
				button.classList.remove('copied');
			}, timeout);
		} catch (err) {
			button.innerHTML = `<span class="copy-icon">${errorText}</span>`;
			button.classList.add('error');
			setTimeout(() => {
				button.innerHTML = originalContent;
				button.classList.remove('error');
			}, timeout);
		}
		document.body.removeChild(textArea);
	}
}

/**
 * Copy file code to clipboard (specific to file operations)
 * @param {string} code - Code content to copy
 * @param {HTMLElement} button - Button element for visual feedback
 */
export function copyFileCode(code, button) {
	copyToClipboard(code, button, '✓', '❌', 2000);
}
