# Code Previewer WordPress Plugin

A powerful WordPress block plugin that provides advanced code editing and syntax highlighting with multi-file support using CodeMirror 6.

## Features

### Multi-File Editor
- **Tabbed Interface**: Manage multiple code files in a single block
- **File Management**: Add, remove, and rename files dynamically
- **Auto-Detection**: Language detection based on file extensions
- **Copy to Clipboard**: One-click code copying for each file

### Syntax Highlighting
- **10+ Languages**: JavaScript, TypeScript, HTML, CSS, JSON, PHP, Python, XML, SQL, Markdown
- **Advanced Themes**: Light, Dark, and Cobalt themes
- **Line Highlighting**: Highlight specific lines for emphasis
- **Auto-completion**: Smart bracket and tag closing

### Editor Features
- **Line Numbers**: Toggle line numbers on/off
- **Word Wrap**: Configurable line wrapping
- **Indentation**: Customizable tab size and space/tab preferences
- **Auto-Height**: Dynamic height adjustment with maximum height limits
- **Error Handling**: Graceful error boundaries for robust editing

### WordPress Integration
- **Block Editor**: Full Gutenberg integration
- **Settings Modal**: Advanced configuration options
- **Inspector Controls**: Quick access to common settings
- **Responsive Design**: Works perfectly on all device sizes
- **Internationalization**: Full i18n support

## Installation

1. Upload the plugin folder to `/wp-content/plugins/`
2. Activate the plugin through the 'Plugins' menu in WordPress
3. The "Code Previewer" block will be available in the block editor under the "Widgets" category

## Usage

### Basic Usage
1. Add the "Code Previewer" block to your post/page
2. Start typing code in the default file (index.js)
3. Use the "+ Add File" button to create additional files
4. Switch between files using the tab interface

### Advanced Configuration
1. Click the settings icon in the block toolbar
2. Configure themes, editor behavior, indentation, and line highlighting
3. Use the Inspector panel for quick access to basic settings

### File Management
- **Adding Files**: Type a filename and press Enter or click "Add File"
- **Renaming**: Click the edit icon (✏️) next to any filename
- **Removing**: Click the × button (minimum one file required)
- **Copying**: Click the 📋 button to copy file contents

## Development

### Building the Plugin

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start development mode with hot reload
npm start

# Development with browser sync
npm run dev
```

### Available Scripts

- `npm run build` - Build for production
- `npm run start` - Start development mode
- `npm run dev` - Development with browser sync
- `npm run format` - Format code
- `npm run lint:js` - Lint JavaScript
- `npm run lint:css` - Lint CSS
- `npm run plugin-zip` - Create plugin zip file

### Requirements

- Node.js 20+ (required)
- npm 6+
- WordPress 6.7+
- PHP 7.4+

## Technical Details

- **Framework**: React/JSX with WordPress components
- **Editor**: CodeMirror 6 with extensive language support
- **Build Tool**: Webpack bundled with @wordpress/scripts
- **Standards**: Follows WordPress coding standards
- **Block API**: Version 3 with modern registration
- **Performance**: Optimized with blocks-manifest for faster loading

## File Structure

```
code-previewer/
├── src/
│   └── code-previewer/
│       ├── components/
│       │   ├── CodeEditor.js          # Main CodeMirror wrapper
│       │   ├── MultiFileEditor.js     # Tabbed file interface
│       │   ├── SettingsModal.js       # Advanced settings dialog
│       │   └── ErrorBoundary.js       # Error handling component
│       ├── utils/
│       │   ├── constants.js           # Language/theme options
│       │   ├── languageLoader.js      # Dynamic language loading
│       │   ├── themeLoader.js         # Theme management
│       │   ├── copyUtils.js           # Clipboard functionality
│       │   ├── highlightUtils.js      # Line highlighting
│       │   ├── autoHeight.js          # Dynamic height calculation
│       │   ├── bracketsLoader.js      # Auto-bracket features
│       │   └── tagsLoader.js          # Auto-tag features
│       ├── block.json                 # Block metadata
│       ├── edit.js                    # Block editor component
│       ├── save.js                    # Block save component
│       ├── view.js                    # Frontend rendering
│       ├── index.js                   # Block registration
│       ├── editor.scss                # Editor styles
│       └── style.scss                 # Frontend styles
├── build/                             # Generated build files
├── node_modules/                      # Dependencies
├── patches/                           # Patch files for dependencies
├── scripts/                           # Build scripts
├── package.json                       # Dependencies and scripts
└── code-previewer.php                # Main plugin file
```

## Supported Languages

- **JavaScript** (.js, .jsx)
- **TypeScript** (.ts, .tsx)
- **HTML** (.html, .htm)
- **CSS** (.css, .scss, .sass)
- **JSON** (.json)
- **PHP** (.php)
- **Python** (.py)
- **XML** (.xml)
- **SQL** (.sql)
- **Markdown** (.md)

## Configuration Options

### Editor Settings
- Theme selection (Light, Dark, Cobalt)
- Line number display
- Word wrapping
- Auto-close tags and brackets
- Tab size and indentation preferences
- Line highlighting
- Maximum height limits

### File Management
- Dynamic file creation and deletion
- Automatic language detection
- File renaming capabilities
- Copy to clipboard functionality

## License

GPL-2.0-or-later

## Author

Coulston Luteya

## Support

For issues and feature requests, please use the WordPress plugin repository or contact the plugin author.
