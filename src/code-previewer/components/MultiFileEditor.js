/**
 * Multi-File Editor Component
 * Handles multiple code files with tabbed interface
 */

import { useState, useMemo, useCallback, useRef, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import CodeEditor from './CodeEditor';
import { getLanguageOptions } from '../utils/constants';
import { copyFileCode } from '../utils/copyUtils';
import { normalizeLanguage } from '../utils/languageLoader';

export default function MultiFileEditor({
	files,
	activeFileIndex,
	theme,
	showLineNumbers,
	autoCloseTags,
	autoCloseBrackets,
	highlightedLines,
	maxHeight,
	onFilesChange,
	onActiveFileChange
}) {
	const [newFileName, setNewFileName] = useState('');
	const [editingFileIndex, setEditingFileIndex] = useState(null);
	const filesRef = useRef(files);

	useEffect(() => {
		filesRef.current = files;
	}, [files]);

	const getLanguageFromFileName = useCallback((fileName) => {
		const ext = fileName.split('.').pop()?.toLowerCase();
		return normalizeLanguage(ext) || 'javascript';
	}, []);

	const addFile = useCallback(() => {
		if (!newFileName.trim()) return;
		
		const language = getLanguageFromFileName(newFileName);
		const newFile = {
			name: newFileName.trim(),
			language: language,
			code: ''
		};
		
		const updatedFiles = [...files, newFile];
		onFilesChange(updatedFiles);
		// Don't automatically switch to the new file, keep current active index
		setNewFileName('');
	}, [newFileName, files, getLanguageFromFileName, onFilesChange]);

	const removeFile = useCallback((index) => {
		if (files.length <= 1) return;
		
		const updatedFiles = files.filter((_, i) => i !== index);
		onFilesChange(updatedFiles);
		
		// Adjust active file index if necessary
		if (activeFileIndex >= updatedFiles.length) {
			onActiveFileChange(updatedFiles.length - 1);
		} else if (activeFileIndex > index) {
			onActiveFileChange(activeFileIndex - 1);
		}
	}, [files, activeFileIndex, onFilesChange, onActiveFileChange]);

	const updateFileName = useCallback((index, newName) => {
		const updatedFiles = [...files];
		updatedFiles[index] = {
			...updatedFiles[index],
			name: newName,
			language: getLanguageFromFileName(newName)
		};
		onFilesChange(updatedFiles);
		setEditingFileIndex(null);
	}, [files, getLanguageFromFileName, onFilesChange]);

	const startEditingFileName = useCallback((index) => {
		setEditingFileIndex(index);
	}, []);

	const handleFileNameKeyPress = useCallback((e) => {
		if (e.key === 'Enter') {
			setEditingFileIndex(null);
		} else if (e.key === 'Escape') {
			setEditingFileIndex(null);
		}
	}, []);

	const updateFileCode = useCallback((newCode) => {
		const updatedFiles = [...filesRef.current];
		updatedFiles[activeFileIndex] = {
			...updatedFiles[activeFileIndex],
			code: newCode
		};
		onFilesChange(updatedFiles);
	}, [activeFileIndex, onFilesChange]);

	const currentFile = files[activeFileIndex] || files[0];

	return (
		<div className="multi-file-editor">
			{/* File Tabs */}
			<div className="file-tabs">
				{files.map((file, index) => (
					<div key={index} className={`file-tab ${index === activeFileIndex ? 'active' : ''}`}>
						{editingFileIndex === index ? (
							<input
								type="text"
								value={file.name}
								onChange={(e) => updateFileName(index, e.target.value)}
								className="file-name-input editing"
								onBlur={(e) => {
									if (!e.target.value.trim()) {
										updateFileName(index, `file${index + 1}.js`);
									} else {
										setEditingFileIndex(null);
									}
								}}
								onKeyDown={(e) => handleFileNameKeyPress(e, index)}
								autoFocus
							/>
						) : (
							<>
								<button
									className="tab-button"
									onClick={() => onActiveFileChange(index)}
									title={`Switch to ${file.name}`}
								>
									{file.name}
								</button>
								<button
									className="edit-filename-button"
									onClick={() => startEditingFileName(index)}
									title={`Rename ${file.name}`}
								>
									✏️
								</button>
							</>
						)}
						{files.length > 1 && (
							<button
								className="remove-file"
								onClick={() => removeFile(index)}
								title={`Remove ${file.name}`}
							>
								×
							</button>
						)}
						<button
							className="copy-code-button"
							onClick={(e) => copyFileCode(file.code, e.target)}
							title={`Copy ${file.name} to clipboard`}
						>
							📋
						</button>
					</div>
				))}
				
				{/* Add New File */}
				<div className="add-file-tab">
					<input
						type="text"
						value={newFileName}
						onChange={(e) => setNewFileName(e.target.value)}
						placeholder="filename.js"
						className="file-name-input"
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								addFile();
							}
						}}
					/>
					<button
						onClick={addFile}
						disabled={!newFileName.trim()}
						title="Add new file"
					>
						+ Add File
					</button>
				</div>
			</div>

			{/* Editor */}
			<CodeEditor
				code={currentFile.code}
				language={currentFile.language}
				theme={theme}
				showLineNumbers={showLineNumbers}
				highlightedLines={highlightedLines}
				autoCloseBrackets={autoCloseBrackets}
				autoCloseTags={autoCloseTags}
				maxHeight={maxHeight}
				onChange={updateFileCode}
			/>
		</div>
	);
}
