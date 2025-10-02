<?php
/**
 * Plugin Name:       Code Previewer Highlighting Block
 * Description:       A wordpress plugin for previewing code snippets with syntax highlighting.
 * Version:           0.1.1
 * Author:            Coulston Luteya
 * Author URI:        https://luteya.com
 * Plugin URI:        https://github.com/CoulKe/Code-Previewer-Highlighting-Block
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       code-previewer-highlighting-block
 *
 * @package Code_Previewer_Highlighting_Block
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}
/**
 * Registers the block using a `blocks-manifest.php` file, which improves the performance of block type registration.
 * Behind the scenes, it also registers all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
 */
function code_previewer_highlighting_block_init() {
	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` and registers the block type(s)
	 * based on the registered block metadata.
	 * Added in WordPress 6.8 to simplify the block metadata registration process added in WordPress 6.7.
	 *
	 * @see https://make.wordpress.org/core/2025/03/13/more-efficient-block-type-registration-in-6-8/
	 */
	if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
		wp_register_block_types_from_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
		return;
	}

	/**
	 * Registers the block(s) metadata from the `blocks-manifest.php` file.
	 * Added to WordPress 6.7 to improve the performance of block type registration.
	 *
	 * @see https://make.wordpress.org/core/2024/10/17/new-block-type-registration-apis-to-improve-performance-in-wordpress-6-7/
	 */
	if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
		wp_register_block_metadata_collection( __DIR__ . '/build', __DIR__ . '/build/blocks-manifest.php' );
	}
	/**
	 * Registers the block type(s) in the `blocks-manifest.php` file.
	 *
	 * @see https://developer.wordpress.org/reference/functions/register_block_type/
	 */
	$manifest_data = require __DIR__ . '/build/blocks-manifest.php';
	foreach ( array_keys( $manifest_data ) as $block_type ) {
		register_block_type( __DIR__ . "/build/{$block_type}" );
	}
}
add_action( 'init', 'code_previewer_highlighting_block_init' );

/**
 * Localize frontend script with translatable strings
 */
function code_previewer_highlighting_block_localize_frontend_script() {
	if ( is_admin() ) {
		return;
	}
	
	$script_handle = 'code-previewer-highlighting-block-code-previewer-view-script';
	
	if ( ! wp_script_is( $script_handle, 'registered' ) ) {
		return;
	}
	
    wp_localize_script( 
		$script_handle, 
		'codePreviewerHighlightingBlockL10n', 
		array(
            'themeLabel' => __( 'Theme:', 'code-previewer-highlighting-block' ),
            'defaultTheme' => __( 'Default', 'code-previewer-highlighting-block' ),
            'light' => __( 'Light', 'code-previewer-highlighting-block' ),
            'dark' => __( 'Dark', 'code-previewer-highlighting-block' ),
            'viewFile' => __( 'View', 'code-previewer-highlighting-block' ),
            'copyFile' => __( 'Copy', 'code-previewer-highlighting-block' ),
            'toClipboard' => __( 'to clipboard', 'code-previewer-highlighting-block' ),
            'loadError' => __( 'Failed to load code preview. Please check the block configuration.', 'code-previewer-highlighting-block' ),
		)
	);
}
add_action( 'wp_enqueue_scripts', 'code_previewer_highlighting_block_localize_frontend_script', 20 );

/**
 * Set script translations and localize admin scripts
 */
function code_previewer_highlighting_block_setup_admin_scripts() {
	if ( ! is_admin() ) {
		return;
	}
	
	$script_handle = 'code-previewer-highlighting-block-code-previewer-editor-script';
	
	if ( wp_script_is( $script_handle, 'registered' ) ) {
		wp_set_script_translations( $script_handle, 'code-previewer-highlighting-block' );
		
		wp_localize_script( 
			$script_handle, 
			'codePreviewerHighlightingBlockAdminL10n', 
			array(
				'switchTo' => __( 'Switch to', 'code-previewer-highlighting-block' ),
				'rename' => __( 'Rename', 'code-previewer-highlighting-block' ),
				'remove' => __( 'Remove', 'code-previewer-highlighting-block' ),
				'copy' => __( 'Copy', 'code-previewer-highlighting-block' ),
				'toClipboard' => __( 'to clipboard', 'code-previewer-highlighting-block' ),
				'addNewFile' => __( 'Add new file', 'code-previewer-highlighting-block' ),
				'addFile' => __( 'Add File', 'code-previewer-highlighting-block' ),
				'language' => __( 'Language:', 'code-previewer-highlighting-block' ),
				'showFileName' => __( 'Show File Name', 'code-previewer-highlighting-block' ),
				'showLineNumbers' => __( 'Show Line Numbers', 'code-previewer-highlighting-block' ),
				'wordWrap' => __( 'Word Wrap', 'code-previewer-highlighting-block' ),
				'settings' => __( 'Settings', 'code-previewer-highlighting-block' ),
				'files' => __( 'Files:', 'code-previewer-highlighting-block' ),
				'active' => __( 'Active:', 'code-previewer-highlighting-block' ),
				'none' => __( 'None', 'code-previewer-highlighting-block' ),
				'fileNamesAreRequired' => __( 'File names are required for each file', 'code-previewer-highlighting-block' ),
				'multiFileMode' => __( 'Multi-file Mode', 'code-previewer-highlighting-block' ),
				'singleFileMode' => __( 'Single-file Mode', 'code-previewer-highlighting-block' ),
				'fileMode' => __( 'File Mode', 'code-previewer-highlighting-block' ),
				'basicSettings' => __( 'Basic Settings', 'code-previewer-highlighting-block' ),
			)
		);
	}
}
add_action( 'admin_enqueue_scripts', 'code_previewer_highlighting_block_setup_admin_scripts', 20 );
