/**
 * Simple CodeMirror Editor for HTML, JavaScript, and CSS
 */
import { useEffect, useRef } from '@wordpress/element';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';

const CodeEditor = ({ 
	code, 
	language, 
	showLineNumbers, 
	readOnly, 
	onChange 
}) => {
	const editorRef = useRef(null);
	const viewRef = useRef(null);

	useEffect(() => {
		if (!editorRef.current) return;

		const extensions = [basicSetup];
		
		// Add language support
		switch (language) {
			case 'javascript':
			case 'js':
				extensions.push(javascript());
				break;
			case 'html':
				extensions.push(html());
				break;
			case 'css':
				extensions.push(css());
				break;
		}

		// Hide line numbers if not needed
		if (!showLineNumbers) {
			extensions.push(EditorView.theme({
				'.cm-gutters': { display: 'none' }
			}));
		}

		// Add read-only if needed
		if (readOnly) {
			extensions.push(EditorState.readOnly.of(true));
		}

		// Add onChange handler
		if (onChange && !readOnly) {
			extensions.push(EditorView.updateListener.of((update) => {
				if (update.docChanged) {
					onChange(update.state.doc.toString());
				}
			}));
		}

		const state = EditorState.create({
			doc: code || '',
			extensions,
		});

		const view = new EditorView({
			state,
			parent: editorRef.current,
		});

		viewRef.current = view;

		// Cleanup
		return () => {
			if (viewRef.current) {
				viewRef.current.destroy();
				viewRef.current = null;
			}
		};
	}, [code, language, showLineNumbers, readOnly, onChange]);

	// Update content when code changes externally
	useEffect(() => {
		if (viewRef.current && viewRef.current.state.doc.toString() !== code) {
			const transaction = viewRef.current.state.update({
				changes: {
					from: 0,
					to: viewRef.current.state.doc.length,
					insert: code || '',
				},
			});
			viewRef.current.dispatch(transaction);
		}
	}, [code]);

	return (
		<div 
			ref={editorRef} 
			className="code-editor"
		/>
	);
};

export default CodeEditor;

