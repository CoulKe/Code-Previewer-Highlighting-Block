<?php
/**
 * Plugin Name:       Code Previewer Highlighting Block
 * Description:       A wordpress plugin for previewing code snippets with syntax highlighting.
 * Version:           0.1.1
 * Author:            Coulston Luteya
 * Author URI:        https://luteya.com
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
	// Only localize on frontend
	if ( is_admin() ) {
		return;
	}
	
	// Get the correct script handle for the view script
	// WordPress generates handles based on the block name and file path
	$possible_handles = [
		'code-previewer-highlighting-block-view-script',
		'code-previewer-highlighting-block-view',
		'code-previewer-view-script',
		'code-previewer-view'
	];
	
	$script_handle = null;
	foreach ( $possible_handles as $handle ) {
		if ( wp_script_is( $handle, 'registered' ) ) {
			$script_handle = $handle;
			break;
		}
	}
	
	// If no handle found, return early
	if ( ! $script_handle ) {
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
 * Set script translations for admin scripts
 */
function code_previewer_highlighting_block_set_admin_translations() {
	// Only set translations on admin
	if ( ! is_admin() ) {
		return;
	}
	
	// Get all registered scripts to find the correct handle
	global $wp_scripts;
	$possible_handles = [];
	
	if ( isset( $wp_scripts->registered ) ) {
		foreach ( $wp_scripts->registered as $handle => $script ) {
			if ( strpos( $handle, 'code-previewer-highlighting-block' ) !== false || 
				 strpos( $handle, 'code-previewer' ) !== false || 
				 strpos( $handle, 'code-previewer' ) !== false ) {
				$possible_handles[] = $handle;
			}
		}
	}
	
	// Add common patterns
	$common_handles = [
		'code-previewer-highlighting-block-editor-script',
		'code-previewer-highlighting-block-editor',
		'code-previewer-editor-script',
		'code-previewer-editor'
	];
	
	$possible_handles = array_merge( $possible_handles, $common_handles );
	
	// Try to set translations for each possible handle
	foreach ( $possible_handles as $handle ) {
		if ( wp_script_is( $handle, 'registered' ) ) {
			wp_set_script_translations( $handle, 'code-previewer-highlighting-block' );
		}
	}
}
add_action( 'admin_enqueue_scripts', 'code_previewer_highlighting_block_set_admin_translations', 20 );

/**
 * Alternative approach: Use wp_localize_script with a more reliable method
 */
function code_previewer_highlighting_block_localize_admin_script() {
	// Only localize on admin
	if ( ! is_admin() ) {
		return;
	}
	
	// Get all registered scripts to find the correct handle
	global $wp_scripts;
	$possible_handles = [];
	
	if ( isset( $wp_scripts->registered ) ) {
		foreach ( $wp_scripts->registered as $handle => $script ) {
			if ( strpos( $handle, 'code-previewer-highlighting-block' ) !== false || 
				 strpos( $handle, 'code-previewer' ) !== false || 
				 strpos( $handle, 'code-previewer' ) !== false ) {
				$possible_handles[] = $handle;
			}
		}
	}
	
	// Try to localize with each possible handle
	foreach ( $possible_handles as $handle ) {
		if ( wp_script_is( $handle, 'registered' ) ) {
			wp_localize_script( 
				$handle, 
				'codePreviewerHighlightingBlockAdminL10n', 
				array(
					'switchTo' => __( 'Switch to', 'code-previewer-highlighting-block' ),
					'rename' => __( 'Rename', 'code-previewer-highlighting-block' ),
					'remove' => __( 'Remove', 'code-previewer-highlighting-block' ),
					'copy' => __( 'Copy', 'code-previewer-highlighting-block' ),
					'toClipboard' => __( 'to clipboard', 'code-previewer-highlighting-block' ),
					'addNewFile' => __( 'Add new file', 'code-previewer-highlighting-block' ),
					'addFile' => __( 'Add File', 'code-previewer-highlighting-block' ),
				)
			);
		}
	}
}
add_action( 'admin_enqueue_scripts', 'code_previewer_highlighting_block_localize_admin_script', 25 );
