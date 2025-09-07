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
	const { code, language, showLineNumbers, readOnly } = attributes;
	
	const blockProps = useBlockProps.save({
		className: 'code-previewer-block',
	});

	return (
		<div {...blockProps}>
			<div 
				className="code-previewer-wrapper"
				data-code={code}
				data-language={language}
				data-show-line-numbers={showLineNumbers}
				data-read-only={readOnly}
			>
				<div className="code-previewer-header">
					<span className="code-previewer-language">{language.toUpperCase()}</span>
					<button className="copy-code-button" title="Copy code to clipboard">
						📋 Copy
					</button>
				</div>
				<pre className="code-previewer-content">
					<code className={`language-${language}`}>
						{code}
					</code>
				</pre>
			</div>
		</div>
	);
}
