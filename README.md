# Code Previewer WordPress Plugin

A simple WordPress block plugin that provides syntax highlighting for HTML, JavaScript, and CSS using CodeMirror 6.

## Features

- **Syntax Highlighting**: Support for HTML, JavaScript, and CSS
- **Line Numbers**: Toggle line numbers on/off
- **Responsive Design**: Works well on all device sizes
- **WordPress Block Editor Integration**: Full integration with Gutenberg editor

## Installation

1. Upload the plugin folder to `/wp-content/plugins/`
2. Activate the plugin through the 'Plugins' menu in WordPress
3. The "Code Previewer" block will be available in the block editor under the "Widgets" category

## Development

### Building the Plugin

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start development mode
npm start
```

### Requirements

- Node.js 14+ (recommend using nvm)
- npm 6+
- WordPress 6.7+
- PHP 7.4+

## Technical Details

- Built with React/JSX
- Uses CodeMirror 6 for syntax highlighting
- Webpack bundled with @wordpress/scripts
- Follows WordPress coding standards
- Block API version 3

## File Structure

```
code-previewer/
├── src/
│   └── code-previewer/
│       ├── components/
│       │   └── CodeMirrorEditor.js
│       ├── block.json
│       ├── edit.js
│       ├── save.js
│       ├── view.js
│       ├── index.js
│       ├── editor.scss
│       └── style.scss
├── build/ (generated)
├── package.json
└── code-previewer.php
```

## License

GPL-2.0-or-later

## Support

For issues and feature requests, please use the WordPress plugin repository or contact the plugin author.
