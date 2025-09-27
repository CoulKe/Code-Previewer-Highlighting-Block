/**
 * Single File Editor Component
 * Handles single code file with language selection while typing
 */

import { useState, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { SelectControl, ToggleControl } from '@wordpress/components';

import CodeEditor from './CodeEditor';
import { getLanguageOptions } from '../utils/constants';
import { copyFileCode } from '../utils/copyUtils';

export default function SingleFileEditor({
	file,
	theme,
	showLineNumbers,
	highlightedLines,
	maxHeight,
	onCodeChange,
	onLanguageChange,
	onFileNameChange
}) {
	const [showFileName, setShowFileName] = useState(false);
	const [tempFileName, setTempFileName] = useState(file.name || '');

	const languageOptions = getLanguageOptions(__);

	const handleLanguageChange = useCallback((newLanguage) => {
		onLanguageChange(newLanguage);
	}, [onLanguageChange]);

	const handleFileNameChange = useCallback((newFileName) => {
		setTempFileName(newFileName);
		onFileNameChange(newFileName);
	}, [onFileNameChange]);

	const handleShowFileNameToggle = useCallback((newShowFileName) => {
		setShowFileName(newShowFileName);
		if (!newShowFileName) {
			// Clear file name when toggling off
			onFileNameChange('');
		}
	}, [onFileNameChange]);

	return (
		<div className="single-file-editor">
			{/* File Header */}
			<div className="file-header">
				<div className="file-info">
					{/* File Name Toggle and Input */}
					<div className="file-name-section">
						<ToggleControl
							label={__('Show File Name', 'code-previewer-highlighting-block')}
							checked={showFileName}
							onChange={handleShowFileNameToggle}
						/>
						<div className="file-name-input-container">
							<input
								type="text"
								value={tempFileName}
								onChange={(e) => handleFileNameChange(e.target.value)}
								className={`file-name-input ${showFileName ? 'active' : 'inactive'}`}
								placeholder={showFileName ? "filename.js" : ""}
								disabled={!showFileName}
							/>
						</div>
					</div>
					
					<div className="language-section">
						<label className="language-label-text">
							{__('Language:', 'code-previewer-highlighting-block')}
						</label>
						<SelectControl
							value={file.language}
							options={languageOptions}
							onChange={handleLanguageChange}
							className="language-select"
						/>
					</div>
				</div>
				<button
					className="copy-code-button"
					onClick={(e) => copyFileCode(file.code, e.target)}
					title={__('Copy to clipboard', 'code-previewer-highlighting-block')}
				>
					📋
				</button>
			</div>

			{/* Editor */}
			<CodeEditor
				code={file.code}
				language={file.language}
				theme={theme}
				showLineNumbers={showLineNumbers}
				highlightedLines={highlightedLines}
				maxHeight={maxHeight}
				onChange={onCodeChange}
			/>
		</div>
	);
}
