<?php
/**
 * Plugin Name:       Code Previewer
 * Description:       A wordpress plugin for previewing code snippets with syntax highlighting.
 * Version:           0.1.0
 * Author:            Coulston Luteya
 * Author URI:        https://luteya.com
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       code-previewer
 *
 * @package Luteya
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
function luteya_code_previewer_block_init() {
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
add_action( 'init', 'luteya_code_previewer_block_init' );

/**
 * Localize frontend script with translatable strings
 */
function luteya_code_previewer_localize_script() {
	// Only localize on frontend
	if ( is_admin() ) {
		return;
	}
	
	// Get the correct script handle for the view script
	$script_handle = 'luteya-code-previewer-view-script';
	
	wp_localize_script( 
		$script_handle, 
		'codePreviewerL10n', 
		array(
			'themeLabel' => __( 'Theme:', 'code-previewer' ),
			'defaultTheme' => __( 'Default', 'code-previewer' ),
			'light' => __( 'Light', 'code-previewer' ),
			'dark' => __( 'Dark', 'code-previewer' ),
			'cobalt' => __( 'Cobalt', 'code-previewer' ),
			'viewFile' => __( 'View', 'code-previewer' ),
			'copyFile' => __( 'Copy', 'code-previewer' ),
			'toClipboard' => __( 'to clipboard', 'code-previewer' ),
			'loadError' => __( 'Failed to load code preview. Please check the block configuration.', 'code-previewer' ),
		)
	);
}
add_action( 'wp_enqueue_scripts', 'luteya_code_previewer_localize_script' );
