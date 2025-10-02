/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

// Get localized strings from PHP
const { codePreviewerHighlightingBlockAdminL10n = {} } = window;

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	useBlockProps,
	InspectorControls,
	BlockControls
} from '@wordpress/block-editor';

import { useCallback, useState, useMemo } from '@wordpress/element';

import {
	PanelBody,
	ToggleControl,
	ToolbarGroup,
	ToolbarButton
} from '@wordpress/components';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

import MultiFileEditor from './components/MultiFileEditor';
import SingleFileEditor from './components/SingleFileEditor';
import SettingsModal from './components/SettingsModal';
import ErrorBoundary from './components/ErrorBoundary';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const {
		files,
		activeFileIndex,
		theme,
		showLineNumbers,
		wordWrap,
		tabSize,
		useSpaces,
		highlightedLines,
		maxHeight,
		isMultiFile = true
	} = attributes;

	const [isSettingsOpen, setIsSettingsOpen] = useState(false);

	const blockProps = useBlockProps({
		className: 'code-previewer-block',
	});

	const handleFilesChange = useCallback((newFiles) => {
		setAttributes({ files: newFiles });
	}, [setAttributes]);

	const handleActiveFileChange = useCallback((newIndex) => {
		setAttributes({ activeFileIndex: newIndex });
	}, [setAttributes]);

	const handleSettingsChange = useCallback((newSettings) => {
		setAttributes({
			theme: newSettings.theme,
			showLineNumbers: newSettings.showLineNumbers,
			wordWrap: newSettings.wordWrap,
			tabSize: newSettings.tabSize,
			useSpaces: newSettings.useSpaces,
			highlightedLines: newSettings.highlightedLines,
			maxHeight: newSettings.maxHeight
		});
	}, [setAttributes]);

	const handleSingleFileCodeChange = useCallback((newCode) => {
		if (!isMultiFile && files.length > 0) {
			const updatedFiles = [...files];
			updatedFiles[0] = {
				...updatedFiles[0],
				code: newCode
			};
			setAttributes({ files: updatedFiles });
		}
	}, [isMultiFile, files, setAttributes]);

	const handleSingleFileLanguageChange = useCallback((newLanguage) => {
		if (!isMultiFile && files.length > 0) {
			const updatedFiles = [...files];
			updatedFiles[0] = {
				...updatedFiles[0],
				language: newLanguage
			};
			setAttributes({ files: updatedFiles });
		}
	}, [isMultiFile, files, setAttributes]);

	const handleSingleFileNameChange = useCallback((newFileName) => {
		if (!isMultiFile && files.length > 0) {
			const updatedFiles = [...files];
			updatedFiles[0] = {
				...updatedFiles[0],
				name: newFileName
			};
			setAttributes({ files: updatedFiles });
		}
	}, [isMultiFile, files, setAttributes]);



	const currentSettings = useMemo(() => ({
		theme,
		showLineNumbers,
		wordWrap,
		tabSize,
		useSpaces,
		highlightedLines,
		maxHeight
	}), [theme, showLineNumbers, wordWrap, tabSize, useSpaces, highlightedLines, maxHeight]);

	return (
		<div {...blockProps}>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon="admin-generic"
						label={codePreviewerHighlightingBlockAdminL10n.settings || __('Settings', 'code-previewer-highlighting-block')}
						onClick={() => setIsSettingsOpen(true)}
					/>
				</ToolbarGroup>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={codePreviewerHighlightingBlockAdminL10n.fileMode || __('File Mode', 'code-previewer-highlighting-block')} initialOpen={true}>
					<ToggleControl
						label={codePreviewerHighlightingBlockAdminL10n.multiFileMode || __('Multi-file Mode', 'code-previewer-highlighting-block')}
						checked={isMultiFile}
						onChange={(newIsMultiFile) => {
							setAttributes({ isMultiFile: newIsMultiFile });
							// If switching to single file mode, ensure we have at least one file
							if (!newIsMultiFile) {
								if (files.length === 0) {
									setAttributes({
										files: [{ name: '', language: 'javascript', code: '' }],
										activeFileIndex: 0
									});
								} else {
									// Clear default file name when switching to single-file mode
									const updatedFiles = [...files];
									if (updatedFiles[0] && updatedFiles[0].name === 'index.js') {
										updatedFiles[0] = { ...updatedFiles[0], name: '' };
										setAttributes({ files: updatedFiles });
									}
								}
							}
						}}
						help={isMultiFile ?
							(codePreviewerHighlightingBlockAdminL10n.fileNamesAreRequired || __('File names are required for each file', 'code-previewer-highlighting-block')) :
							''
						}
					/>
				</PanelBody>
				<PanelBody title={codePreviewerHighlightingBlockAdminL10n.files || __('Files', 'code-previewer-highlighting-block')} initialOpen={true}>
					<p>{codePreviewerHighlightingBlockAdminL10n.files || __('Files:', 'code-previewer-highlighting-block')} {files.length}</p>
					<p>{codePreviewerHighlightingBlockAdminL10n.active || __('Active:', 'code-previewer-highlighting-block')} {files[activeFileIndex]?.name || (codePreviewerHighlightingBlockAdminL10n.none || __('None', 'code-previewer-highlighting-block'))}</p>
				</PanelBody>
				<PanelBody title={codePreviewerHighlightingBlockAdminL10n.basicSettings || __('Basic Settings', 'code-previewer-highlighting-block')} initialOpen={false}>
					<ToggleControl
						label={codePreviewerHighlightingBlockAdminL10n.showLineNumbers || __('Show Line Numbers', 'code-previewer-highlighting-block')}
						checked={showLineNumbers}
						onChange={(newShowLineNumbers) => setAttributes({ showLineNumbers: newShowLineNumbers })}
					/>
					<ToggleControl
						label={codePreviewerHighlightingBlockAdminL10n.wordWrap || __('Word Wrap', 'code-previewer-highlighting-block')}
						checked={wordWrap}
						onChange={(newWordWrap) => setAttributes({ wordWrap: newWordWrap })}
					/>
				</PanelBody>
			</InspectorControls>

			<div className="code-previewer-wrapper">
				<ErrorBoundary showErrorDetails={false}>
					{isMultiFile ? (
						<MultiFileEditor
							files={files}
							activeFileIndex={activeFileIndex}
							theme={theme}
							showLineNumbers={showLineNumbers}
							highlightedLines={highlightedLines}
							maxHeight={maxHeight}
							onFilesChange={handleFilesChange}
							onActiveFileChange={handleActiveFileChange}
						/>
					) : (
						<SingleFileEditor
							file={files[0] || { name: '', language: 'javascript', code: '' }}
							theme={theme}
							showLineNumbers={showLineNumbers}
							highlightedLines={highlightedLines}
							maxHeight={maxHeight}
							onCodeChange={handleSingleFileCodeChange}
							onLanguageChange={handleSingleFileLanguageChange}
							onFileNameChange={handleSingleFileNameChange}
						/>
					)}
				</ErrorBoundary>
			</div>

			<ErrorBoundary showErrorDetails={false}>
				<SettingsModal
					isOpen={isSettingsOpen}
					onClose={() => setIsSettingsOpen(false)}
					settings={currentSettings}
					onSettingsChange={handleSettingsChange}
				/>
			</ErrorBoundary>
		</div>
	);
}
