/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save({ attributes }) {
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
	
	const blockProps = useBlockProps.save({
		className: 'code-previewer-block',
	});

	return (
		<div {...blockProps}>
			<div 
				className="code-previewer-wrapper"
				data-files={JSON.stringify(files)}
				data-active-file-index={activeFileIndex}
				data-theme={theme}
				data-show-line-numbers={showLineNumbers}
				data-word-wrap={wordWrap}
				data-tab-size={tabSize}
				data-use-spaces={useSpaces}
				data-highlighted-lines={JSON.stringify(highlightedLines)}
				data-max-height={maxHeight}
				data-is-multi-file={isMultiFile}
			>
				{files.map((file, index) => (
					<div 
						key={index}
						className={`file-content ${index === activeFileIndex ? 'active' : 'hidden'}`}
						data-file-name={file.name}
						data-language={file.language}
					>
						<div className="code-previewer-header">
							{isMultiFile && <span className="code-previewer-language">{file.name}</span>}
							{!isMultiFile && file.name && file.name.trim() && <span className="code-previewer-language">{file.name}</span>}
							<button 
								className="copy-code-button" 
								title={`Copy ${isMultiFile ? file.name : (file.name && file.name.trim() ? file.name : file.language)} to clipboard`}
								data-file-index={index}
							>
								📋 Copy
							</button>
						</div>
						<pre className="code-previewer-content">
							<code className={`language-${file.language}`}>
								{file.code}
							</code>
						</pre>
					</div>
				))}
			</div>
		</div>
	);
}
