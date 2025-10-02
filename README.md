# Code Previewer WordPress Plugin

A powerful WordPress block plugin that provides advanced code editing and syntax highlighting with multi-file support using CodeMirror 6. Perfect for developers, educators, and technical writers who need to showcase code snippets with professional syntax highlighting.

## Table of Contents

- **[Features](#features)**
  - [Multi-File Editor](#multi-file-editor)
  - [Syntax Highlighting](#syntax-highlighting)
  - [Editor Features](#editor-features)
  - [WordPress Integration](#wordpress-integration)
- **[Installation](#installation)**
- **[Usage](#usage)**
  - [Basic Usage](#basic-usage)
  - [Advanced Configuration](#advanced-configuration)
  - [File Management](#file-management)
- **[Development](#development)**
  - [Environment Setup](#environment-setup)
  - [Building the Plugin](#building-the-plugin)
  - [Available Scripts](#available-scripts)
  - [Requirements](#requirements)
- **[Technical Details](#technical-details)**
- **[File Structure](#file-structure)**
- **[Supported Languages](#supported-languages)**
- **[Configuration Options](#configuration-options)**
  - [Editor Settings](#editor-settings)
  - [File Management](#file-management-1)
  - [Advanced Settings](#advanced-settings)
- **[License](#license)**
- **[Author](#author)**
- **[Support](#support)**

## Features

### Multi-File Editor
- **Tabbed Interface**: Manage multiple code files in a single block with intuitive tab navigation
- **File Management**: Add, remove, and rename files dynamically with real-time validation
- **Auto-Detection**: Intelligent language detection based on file extensions
- **Copy to Clipboard**: One-click code copying for each file with success feedback
- **File Switching**: Seamless switching between files with preserved state

### Syntax Highlighting
- **10+ Languages**: JavaScript, TypeScript, HTML, CSS, JSON, PHP, Python, XML, SQL, Markdown
- **Advanced Themes**: Professional Light and Dark themes with ThemeMirror integration
- **Line Highlighting**: Highlight specific lines for emphasis (like GitHub gists)
- **Auto-completion**: Smart bracket and tag closing with intelligent indentation
- **Language Support**: Full syntax highlighting for modern web development languages

### Editor Features
- **Line Numbers**: Toggle line numbers on/off for better code readability
- **Word Wrap**: Configurable line wrapping with intelligent breaking
- **Indentation**: Customizable tab size and space/tab preferences
- **Auto-Height**: Dynamic height adjustment with maximum height limits
- **Error Handling**: Graceful error boundaries for robust editing experience
- **Settings Modal**: Advanced configuration options accessible via toolbar

### WordPress Integration
- **Block Editor**: Full Gutenberg integration with modern block API v3
- **Settings Modal**: Comprehensive configuration options for power users
- **Inspector Controls**: Quick access to common settings in the sidebar
- **Responsive Design**: Works perfectly on all device sizes and orientations
- **Internationalization**: Full i18n support with translation-ready strings
- **Performance Optimized**: Uses blocks-manifest for faster loading in WordPress 6.7+

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

### Environment Setup

Create a `.env` file in the plugin directory with your local WordPress URL. This is required by development scripts.

```bash
# wp-content/plugins/code-previewer-highlighting-block/.env
WORDPRESS_URL=http://example.local
```

If `WORDPRESS_URL` is missing, the dev script will exit with an error. Use your local site URL (e.g., `http://localhost:8000`, `http://wp.local`, etc.).

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

- **Framework**: React/JSX with WordPress components and hooks
- **Editor**: CodeMirror 6.0.2 with extensive language support and ThemeMirror themes
- **Build Tool**: Webpack bundled with @wordpress/scripts 30.23.0
- **Standards**: Follows WordPress coding standards and best practices
- **Block API**: Version 3 with modern registration and blocks-manifest optimization
- **Performance**: Optimized with blocks-manifest for faster loading in WordPress 6.7+
- **Node.js**: Requires Node.js 20+ for development

## File Structure

```
code-previewer/
├── src/
│   └── code-previewer/
│       ├── components/
│       │   ├── CodeEditor.js          # Main CodeMirror wrapper component
│       │   ├── MultiFileEditor.js     # Tabbed file interface with state management
│       │   ├── SingleFileEditor.js    # Single file editor component
│       │   ├── SettingsModal.js       # Advanced settings dialog with comprehensive options
│       │   └── ErrorBoundary.js       # Error handling component for robust editing
│       ├── utils/
│       │   ├── constants.js           # Language/theme options and configuration
│       │   ├── languageLoader.js      # Dynamic language loading with CodeMirror 6
│       │   ├── themeLoader.js         # Theme management with ThemeMirror integration
│       │   ├── copyUtils.js           # Clipboard functionality with user feedback
│       │   ├── highlightUtils.js      # Line highlighting utilities
│       │   └── autoHeight.js          # Dynamic height calculation and limits
│       ├── block.json                 # Block metadata and configuration
│       ├── edit.js                    # Block editor component with React hooks
│       ├── save.js                    # Block save component for data persistence
│       ├── view.js                    # Frontend rendering with CodeMirror initialization
│       ├── index.js                   # Block registration and initialization
│       ├── editor.scss                # Editor styles for admin interface
│       └── style.scss                 # Frontend styles for public display
├── build/                             # Generated build files and assets
│   ├── blocks-manifest.php           # WordPress 6.7+ blocks manifest
│   └── code-previewer/               # Compiled block assets
├── assets/                           # Plugin assets and screenshots
├── node_modules/                     # Dependencies and packages
├── patches/                          # Patch files for dependency modifications
├── scripts/                          # Build scripts and development tools
├── package.json                      # Dependencies, scripts, and configuration
├── package-lock.json                 # Locked dependency versions
├── code-previewer.php               # Main plugin file with WordPress integration
├── README.md                         # Comprehensive documentation
├── readme.txt                        # WordPress.org repository format
├── PLUGIN-SUMMARY.md                 # Plugin overview and capabilities
└── FEATURE-SUGGESTIONS.md            # Future feature roadmap and suggestions
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
- **Theme Selection**: Professional Light and Dark themes with ThemeMirror integration
- **Line Numbers**: Toggle line number display for better code readability
- **Word Wrapping**: Intelligent line wrapping with configurable behavior
- **Auto-close Tags**: Smart bracket and tag closing for HTML, CSS, and JavaScript
- **Indentation**: Customizable tab size and space/tab preferences
- **Line Highlighting**: Highlight specific lines for emphasis and documentation
- **Height Management**: Dynamic height adjustment with maximum height limits
- **File Mode**: Switch between single-file and multi-file editing modes

### File Management
- **Dynamic File Creation**: Add new files with automatic language detection
- **File Renaming**: Inline file renaming with validation
- **File Deletion**: Remove files with minimum file count protection
- **Copy to Clipboard**: One-click code copying with success feedback
- **File Switching**: Seamless tab-based file navigation
- **Language Detection**: Automatic language detection based on file extensions

### Advanced Settings
- **Settings Modal**: Comprehensive configuration dialog accessible via toolbar
- **Inspector Controls**: Quick access to common settings in WordPress sidebar
- **Responsive Design**: Automatic adaptation to different screen sizes
- **Error Handling**: Graceful error boundaries for robust editing experience

## License

GPL-2.0-or-later

## Author

Coulston Luteya

## Support

For issues and feature requests, please use the WordPress plugin repository or contact the plugin author.
