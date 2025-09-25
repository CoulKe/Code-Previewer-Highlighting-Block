/**
 * Simple CodeMirror Editor for HTML, JavaScript, and CSS
 */
import { useEffect, useRef, useState } from '@wordpress/element';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { getLanguageExtension } from '../utils/languageLoader';
import { getThemeExtension } from '../utils/themeLoader';
import { createLineHighlightExtension } from '../utils/highlightUtils';
import { createSimpleAutoHeight } from '../utils/autoHeight';


const CodeEditor = ({ 
	code, 
	language, 
	theme = 'dark',
	showLineNumbers,
	highlightedLines = [],
	maxHeight = 400,
	onChange 
}) => {
	const editorRef = useRef(null);
	const viewRef = useRef(null);
	const onChangeRef = useRef(onChange);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	useEffect(() => {
		if (!editorRef.current) return;

		const initializeEditor = async () => {
			setIsLoading(true);

			if (viewRef.current) {
				viewRef.current.destroy();
				viewRef.current = null;
			}

			const extensions = [basicSetup];

			try {
				const languageExtension = await getLanguageExtension(language);
				extensions.push(languageExtension);
			} catch (error) {
				// Fallback to javascript
				const fallbackExtension = await getLanguageExtension('javascript');
				extensions.push(fallbackExtension);
			}

			const themeExtension = await getThemeExtension(theme);
			extensions.push(themeExtension);

			const highlightExtensions = createLineHighlightExtension(highlightedLines);
			extensions.push(...highlightExtensions);


			// Auto-height functionality with custom maxHeight
			extensions.push(createSimpleAutoHeight({ maxHeight }));

			// Hide line numbers if not needed
			if (!showLineNumbers) {
				extensions.push(EditorView.theme({
					'.cm-gutters': { display: 'none' }
				}));
			}

			extensions.push(EditorView.updateListener.of((update) => {
				if (update.docChanged && onChangeRef.current) {
					onChangeRef.current(update.state.doc.toString());
				}
			}));

			const state = EditorState.create({
				doc: code || '',
				extensions,
			});

			const view = new EditorView({
				state,
				parent: editorRef.current,
			});

			viewRef.current = view;
			setIsLoading(false);
		};

		initializeEditor();

		return () => {
			if (viewRef.current) {
				viewRef.current.destroy();
				viewRef.current = null;
			}
		};
	}, [language, theme, showLineNumbers, highlightedLines, maxHeight]);

	// Update content when code changes externally (but not from user input)
	useEffect(() => {
		if (viewRef.current) {
			const currentContent = viewRef.current.state.doc.toString();
			if (currentContent !== (code || '')) {
				const transaction = viewRef.current.state.update({
					changes: {
						from: 0,
						to: viewRef.current.state.doc.length,
						insert: code || '',
					},
				});
				viewRef.current.dispatch(transaction);
			}
		}
	}, [code]);

	return (
		<div className="code-editor-wrapper">
			{isLoading && (
				<div className="code-editor-loading">
					<div className="code-editor-spinner"></div>
					<span>Loading language support...</span>
				</div>
			)}
			<div 
				ref={editorRef} 
				className="code-editor"
				style={{ display: isLoading ? 'none' : 'block' }}
			/>
		</div>
	);
};

export default CodeEditor;

