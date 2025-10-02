/**
 * Error Boundary Component for Code Previewer
 * Catches JavaScript errors anywhere in the component tree and displays a fallback UI
 */
import { Component } from '@wordpress/element';

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			hasError: false, 
			error: null, 
			errorInfo: null 
		};
	}

	static getDerivedStateFromError(error) {
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		this.setState({
			error: error,
			errorInfo: errorInfo
		});
		
		if (window.wp && window.wp.data && window.wp.data.dispatch) {
			window.wp.data.dispatch('core/notices').createNotice('error', 
				'Code previewer encountered an error. Please refresh the page or contact support.', 
				{ 
					isDismissible: true,
					id: 'code-previewer-error-boundary'
				}
			);
		}

		if (window.wp && window.wp.hooks) {
			window.wp.hooks.doAction('code-previewer.error', {
				type: 'error-boundary',
				error: error,
				errorInfo: errorInfo,
				componentStack: errorInfo.componentStack
			});
		}
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="code-previewer-error-boundary">
					<div className="error-content">
						<div className="error-icon">
							<span className="dashicons dashicons-warning"></span>
						</div>
						<div className="error-message">
							<h3>Code Preview Unavailable</h3>
							<p>
								The code preview encountered an error and cannot be displayed. 
								Please refresh the page or contact support.
							</p>
							{this.props.showErrorDetails && this.state.error && (
								<details className="error-details">
									<summary>Error Details</summary>
									<pre>{this.state.error.toString()}</pre>
									{this.state.errorInfo && (
										<pre>{this.state.errorInfo.componentStack}</pre>
									)}
								</details>
							)}
						</div>
					</div>
					<style jsx>{`
						.code-previewer-error-boundary {
							border: 1px solid #dc3232;
							border-radius: 4px;
							background: #fbeaea;
							padding: 20px;
							margin: 10px 0;
							font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
						}
						
						.error-content {
							display: flex;
							align-items: flex-start;
							gap: 15px;
						}
						
						.error-icon {
							flex-shrink: 0;
						}
						
						.error-icon .dashicons {
							font-size: 24px;
							color: #dc3232;
						}
						
						.error-message h3 {
							margin: 0 0 10px 0;
							color: #dc3232;
							font-size: 16px;
						}
						
						.error-message p {
							margin: 0 0 15px 0;
							color: #666;
							line-height: 1.5;
						}
						
						.error-details {
							margin-top: 15px;
						}
						
						.error-details summary {
							cursor: pointer;
							font-weight: 600;
							color: #333;
							margin-bottom: 10px;
						}
						
						.error-details pre {
							background: #f1f1f1;
							padding: 10px;
							border-radius: 3px;
							font-size: 12px;
							overflow-x: auto;
							margin: 5px 0;
						}
					`}</style>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
