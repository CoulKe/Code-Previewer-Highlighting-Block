/**
 * Settings Modal Component
 * Advanced settings for the code editor
 */

import { __ } from '@wordpress/i18n';
import { 
	Modal, 
	PanelBody, 
	SelectControl, 
	ToggleControl, 
	TextControl, 
	Button 
} from '@wordpress/components';
import { getThemeOptions } from '../utils/constants';

export default function SettingsModal({ isOpen, onClose, settings, onSettingsChange }) {
	const themeOptions = getThemeOptions(__);

	const updateSetting = (key, value) => {
		onSettingsChange({
			...settings,
			[key]: value
		});
	};

	if (!isOpen) return null;

	return (
		<Modal
			title={__('Code Editor Settings', 'code-previewer')}
			onRequestClose={onClose}
			className="code-previewer-settings-modal"
		>
			<PanelBody title={__('Appearance', 'code-previewer')} initialOpen={true}>
				<SelectControl
					label={__('Theme', 'code-previewer')}
					value={settings.theme}
					options={themeOptions}
					onChange={(value) => updateSetting('theme', value)}
					help={__('Choose the color theme for the code editor.', 'code-previewer')}
				/>
				<ToggleControl
					label={__('Show Line Numbers', 'code-previewer')}
					checked={settings.showLineNumbers}
					onChange={(value) => updateSetting('showLineNumbers', value)}
					help={__('Display line numbers in the editor.', 'code-previewer')}
				/>
			</PanelBody>

			<PanelBody title={__('Editor Behavior', 'code-previewer')} initialOpen={false}>
				<ToggleControl
					label={__('Word Wrap', 'code-previewer')}
					checked={settings.wordWrap}
					onChange={(value) => updateSetting('wordWrap', value)}
					help={__('Wrap long lines instead of showing horizontal scrollbar.', 'code-previewer')}
				/>
				<ToggleControl
					label={__('Auto Close Tags', 'code-previewer')}
					checked={settings.autoCloseTags}
					onChange={(value) => updateSetting('autoCloseTags', value)}
					help={__('Automatically close HTML tags.', 'code-previewer')}
				/>
				<ToggleControl
					label={__('Auto Close Brackets', 'code-previewer')}
					checked={settings.autoCloseBrackets}
					onChange={(value) => updateSetting('autoCloseBrackets', value)}
					help={__('Automatically close brackets and quotes.', 'code-previewer')}
				/>
			</PanelBody>

			<PanelBody title={__('Indentation', 'code-previewer')} initialOpen={false}>
				<TextControl
					label={__('Tab Size', 'code-previewer')}
					type="number"
					value={settings.tabSize}
					onChange={(value) => updateSetting('tabSize', parseInt(value) || 4)}
					min={1}
					max={8}
					help={__('Number of spaces per tab.', 'code-previewer')}
				/>
				<ToggleControl
					label={__('Use Spaces', 'code-previewer')}
					checked={settings.useSpaces}
					onChange={(value) => updateSetting('useSpaces', value)}
					help={__('Use spaces instead of tabs for indentation.', 'code-previewer')}
				/>
			</PanelBody>

			<PanelBody title={__('Line Highlighting', 'code-previewer')} initialOpen={false}>
				<TextControl
					label={__('Highlighted Lines', 'code-previewer')}
					value={settings.highlightedLines.join(', ')}
					onChange={(value) => {
						const lines = value.split(',').map(line => parseInt(line.trim())).filter(line => !isNaN(line));
						updateSetting('highlightedLines', lines);
					}}
					help={__('Comma-separated list of line numbers to highlight (e.g., 1, 5, 10-15).', 'code-previewer')}
				/>
			</PanelBody>

			<PanelBody title={__('Editor Size', 'code-previewer')} initialOpen={false}>
				<TextControl
					label={__('Maximum Height (px)', 'code-previewer')}
					type="number"
					value={settings.maxHeight}
					onChange={(value) => updateSetting('maxHeight', parseInt(value) || 400)}
					min={100}
					max={1000}
					help={__('Maximum height of the code editor in pixels. Editor will auto-resize based on content up to this limit.', 'code-previewer')}
				/>
			</PanelBody>

			<div style={{ marginTop: '20px', textAlign: 'right' }}>
				<Button variant="primary" onClick={onClose}>
					{__('Close', 'code-previewer')}
				</Button>
			</div>
		</Modal>
	);
}
