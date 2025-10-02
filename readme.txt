=== Code Previewer Highlighting Block ===
Contributors:      luteya
Tags:              code, snippets, syntax highlighting, codemirror, editor
Tested up to:      6.8
Stable tag:        0.1.3
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A powerful WordPress block plugin for advanced code editing and syntax highlighting with multi-file support.

== Description ==

A comprehensive WordPress block plugin that provides advanced code editing and syntax highlighting with multi-file support using CodeMirror 6. Perfect for developers, educators, and technical writers who need to showcase code snippets with professional syntax highlighting.

**Key Features:**
* **Multi-File Editor** - Manage multiple code files in a single block with intuitive tab navigation
* **10+ Programming Languages** - JavaScript, TypeScript, HTML, CSS, JSON, PHP, Python, XML, SQL, Markdown
* **Professional Themes** - Light and Dark themes with ThemeMirror integration
* **Advanced Settings** - Comprehensive configuration options via settings modal
* **Copy to Clipboard** - One-click code copying for each file with success feedback
* **Line Highlighting** - Highlight specific lines for emphasis (like GitHub gists)
* **WordPress Integration** - Full Gutenberg integration with modern block API v3
* **Responsive Design** - Works perfectly on all device sizes and orientations
* **Internationalization** - Full i18n support with translation-ready strings

== Source Code ==

This plugin includes human-readable, non-compiled source code in the `src/` directory. Compiled assets that WordPress loads are in the `build/` directory.

Full source repository and development instructions:
https://github.com/CoulKe/Code-Previewer-Highlighting-Block

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/code-previewer-highlighting-block` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. The Code Previewer Highlighting Block will be available in the block editor


== Frequently Asked Questions ==

= How do I add a code preview block? =

Simply click the "+" button in the block editor, search for "Code Previewer Highlighting Block", and add the block to your post or page.

= What programming languages are supported? =

The plugin supports 10+ programming languages: JavaScript, TypeScript, HTML, CSS, JSON, PHP, Python, XML, SQL, and Markdown. Language detection is automatic based on file extensions.

= Can I manage multiple files in one block? =

Yes! The plugin features a multi-file editor with tabbed interface. You can add, remove, and rename files dynamically. Each file can have different programming languages.

= Can I copy the code from the preview? =

Yes! Each file includes a copy button that allows users to easily copy the code to their clipboard with success feedback.

= Can I customize the appearance of the code preview? =

Yes, the plugin includes various themes and customization options in the block settings to match your site's design.

== Screenshots ==

1. Code Previewer block in the WordPress block editor showing syntax highlighting and copy functionality
2. Example of code previewer custom settings

== Changelog ==

= 0.1.3 =
* Release

== Features ==

* **Multi-File Editor** - Manage multiple code files in a single block with intuitive tab navigation
* **Syntax Highlighting** - Professional syntax highlighting for 10+ programming languages using CodeMirror 6
* **Copy to Clipboard** - One-click code copying functionality with success feedback for each file
* **Professional Themes** - Light and Dark themes with ThemeMirror integration
* **Line Numbers** - Optional line numbering for better code readability
* **Auto-Detection** - Automatic language detection based on file extensions
* **Advanced Settings** - Comprehensive configuration options via settings modal
* **Line Highlighting** - Highlight specific lines for emphasis (like GitHub gists)
* **File Management** - Add, remove, and rename files dynamically with validation
* **Word Wrap** - Intelligent line wrapping with configurable behavior
* **Auto-close Tags** - Smart bracket and tag closing for HTML, CSS, and JavaScript
* **Responsive Design** - Works perfectly on desktop and mobile devices
* **WordPress Integration** - Full Gutenberg integration with modern block API v3
* **Internationalization** - Full i18n support with translation-ready strings
* **Performance Optimized** - Uses blocks-manifest for faster loading in WordPress 6.7+
* **Error Handling** - Graceful error boundaries for robust editing experience

== Third-Party Libraries ==

This plugin uses the following open-source libraries:

* **CodeMirror 6.0.2** – MIT License
  https://codemirror.net/
  https://github.com/codemirror/dev

* **ThemeMirror Themes** – MIT License
  - @uiw/codemirror-theme-github (4.25.1)
  - @uiw/codemirror-theme-bbedit (4.25.1)

* **WordPress Scripts** – GPL-2.0-or-later
  - @wordpress/scripts (30.23.0)
