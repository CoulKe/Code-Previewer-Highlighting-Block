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

import {
	PanelBody,
	SelectControl,
	ToggleControl,
	TextareaControl,
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

import CodeEditor from './components/CodeEditor';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const { code, language, showLineNumbers, readOnly } = attributes;

	const blockProps = useBlockProps({
		className: 'code-previewer-block',
	});

	const languageOptions = [
		{ label: 'JavaScript', value: 'javascript' },
		{ label: 'HTML', value: 'html' },
		{ label: 'CSS', value: 'css' },
	];

	const handleCodeChange = (newCode) => {
		setAttributes({ code: newCode });
	};

	const toggleReadOnly = () => {
		setAttributes({ readOnly: !readOnly });
	};

	return (
		<div {...blockProps}>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarButton
						icon={readOnly ? 'edit' : 'visibility'}
						label={readOnly ? __('Enable editing', 'code-previewer') : __('Preview mode', 'code-previewer')}
						onClick={toggleReadOnly}
						isPressed={readOnly}
					/>
				</ToolbarGroup>
			</BlockControls>

			<InspectorControls>
				<PanelBody title={__('Code Settings', 'code-previewer')} initialOpen={true}>
					<SelectControl
						label={__('Language', 'code-previewer')}
						value={language}
						options={languageOptions}
						onChange={(newLanguage) => setAttributes({ language: newLanguage })}
					/>
					<ToggleControl
						label={__('Show Line Numbers', 'code-previewer')}
						checked={showLineNumbers}
						onChange={(newShowLineNumbers) => setAttributes({ showLineNumbers: newShowLineNumbers })}
					/>
					<ToggleControl
						label={__('Read Only', 'code-previewer')}
						checked={readOnly}
						onChange={(newReadOnly) => setAttributes({ readOnly: newReadOnly })}
					/>
				</PanelBody>
				<PanelBody title={__('Code Input', 'code-previewer')} initialOpen={false}>
					<TextareaControl
						label={__('Code', 'code-previewer')}
						value={code}
						onChange={handleCodeChange}
						rows={10}
						help={__('Enter your code here, or use the editor above.', 'code-previewer')}
					/>
				</PanelBody>
			</InspectorControls>

			<div className="code-previewer-wrapper">
				<div className="code-previewer-header">
					<h4>{__('Code Previewer', 'code-previewer')} - {language.toUpperCase()}</h4>
				</div>
				<CodeEditor
					code={code}
					language={language}
					showLineNumbers={showLineNumbers}
					readOnly={readOnly}
					onChange={handleCodeChange}
				/>
			</div>
		</div>
	);
}
