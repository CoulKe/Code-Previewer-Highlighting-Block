/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

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
		autoCloseTags,
		autoCloseBrackets,
		tabSize,
		useSpaces,
		highlightedLines,
		maxHeight
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
			autoCloseTags: newSettings.autoCloseTags,
			autoCloseBrackets: newSettings.autoCloseBrackets,
			tabSize: newSettings.tabSize,
			useSpaces: newSettings.useSpaces,
			highlightedLines: newSettings.highlightedLines,
			maxHeight: newSettings.maxHeight
		});
	}, [setAttributes]);



	const currentSettings = useMemo(() => ({
		theme,
		showLineNumbers,
		wordWrap,
		autoCloseTags,
		autoCloseBrackets,
		tabSize,
		useSpaces,
		highlightedLines,
		maxHeight
	}), [theme, showLineNumbers, wordWrap, autoCloseTags, autoCloseBrackets, tabSize, useSpaces, highlightedLines, maxHeight]);

	return (
		<div {...blockProps}>
		<BlockControls>
			<ToolbarGroup>
				<ToolbarButton
					icon="admin-generic"
					label={__('Settings', 'code-previewer')}
					onClick={() => setIsSettingsOpen(true)}
				/>
			</ToolbarGroup>
		</BlockControls>

			<InspectorControls>
				<PanelBody title={__('Files', 'code-previewer')} initialOpen={true}>
					<p>{__('Files:', 'code-previewer')} {files.length}</p>
					<p>{__('Active:', 'code-previewer')} {files[activeFileIndex]?.name || 'None'}</p>
				</PanelBody>
				<PanelBody title={__('Basic Settings', 'code-previewer')} initialOpen={false}>
					<ToggleControl
						label={__('Show Line Numbers', 'code-previewer')}
						checked={showLineNumbers}
						onChange={(newShowLineNumbers) => setAttributes({ showLineNumbers: newShowLineNumbers })}
					/>
					<ToggleControl
						label={__('Word Wrap', 'code-previewer')}
						checked={wordWrap}
						onChange={(newWordWrap) => setAttributes({ wordWrap: newWordWrap })}
					/>
				</PanelBody>
			</InspectorControls>

			<div className="code-previewer-wrapper">
				<ErrorBoundary showErrorDetails={false}>
					<MultiFileEditor
						files={files}
						activeFileIndex={activeFileIndex}
						theme={theme}
						showLineNumbers={showLineNumbers}
						autoCloseTags={autoCloseTags}
						autoCloseBrackets={autoCloseBrackets}
						highlightedLines={highlightedLines}
						maxHeight={maxHeight}
						onFilesChange={handleFilesChange}
						onActiveFileChange={handleActiveFileChange}
					/>
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
