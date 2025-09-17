/**
 * Settings Modal Component
 * Advanced settings for the code editor
 */

import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
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
	const [highlightedLinesInput, setHighlightedLinesInput] = useState(settings.highlightedLines.join(', '));
	const [maxHeightInput, setMaxHeightInput] = useState(settings.maxHeight.toString());

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
				<div className="components-base-control">
					<label className="components-base-control__label">
						{__('Highlighted Lines', 'code-previewer')}
					</label>
					<input
						type="text"
						className="components-text-control__input"
						value={highlightedLinesInput}
						onChange={(e) => {
							const value = e.target.value;
							setHighlightedLinesInput(value);
						}}
						onBlur={(e) => {
							const value = e.target.value;
							const lines = value.split(',').map(line => {
								const trimmed = line.trim();
								// Handle range notation like "2-5"
								if (trimmed.includes('-')) {
									const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()));
									if (!isNaN(start) && !isNaN(end) && start <= end) {
										return Array.from({length: end - start + 1}, (_, i) => start + i);
									}
									return [];
								}
								return parseInt(trimmed);
							}).flat().filter(line => !isNaN(line) && line > 0);
							updateSetting('highlightedLines', lines);
						}}
						placeholder="1, 5, 10-15"
					/>
					<p className="components-base-control__help">
						{__('Comma-separated list of line numbers to highlight. Supports individual lines and ranges (e.g., 1, 5, 10-15).', 'code-previewer')}
					</p>
				</div>
			</PanelBody>

			<PanelBody title={__('Editor Size', 'code-previewer')} initialOpen={false}>
				<div className="components-base-control">
					<label className="components-base-control__label">
						{__('Maximum Height (px)', 'code-previewer')}
					</label>
					<input
						type="number"
						className="components-text-control__input"
						value={maxHeightInput}
						onChange={(e) => setMaxHeightInput(e.target.value)}
						onBlur={(e) => {
							const value = parseInt(e.target.value);
							if (!isNaN(value) && value >= 100 && value <= 1000) {
								updateSetting('maxHeight', value);
							} else {
								updateSetting('maxHeight', 400);
								setMaxHeightInput('400');
							}
						}}
						min={100}
						max={1000}
					/>
					<p className="components-base-control__help">
						{__('Maximum height of the code editor in pixels. Editor will auto-resize based on content up to this limit.', 'code-previewer')}
					</p>
				</div>
			</PanelBody>

			<div style={{ marginTop: '20px', textAlign: 'right' }}>
				<Button variant="primary" onClick={onClose}>
					{__('Close', 'code-previewer')}
				</Button>
			</div>
		</Modal>
	);
}
