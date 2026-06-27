<?php
/**
 * Plugin Name: Preview Link Block
 * Plugin URI: https://github.com/ericburnsonline/preview-link-block
 * Description: Custom Gutenberg block for links with hoverable preview text and optional images
 * Version: 1.0.0
 * Author: Eric Burns
 * Author URI: https://ericburnsonline.com
 * License: MIT
 * Text Domain: preview-link-block
 * Domain Path: /languages
 *
 * @package PreviewLinkBlock
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Register the Preview Link block
 */
function preview_link_block_register() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'preview_link_block_register' );

/**
 * Enqueue frontend script for preview tooltip behavior
 */
function preview_link_block_enqueue_frontend() {
	// Only enqueue on front-end (not in editor)
	if ( is_admin() ) {
		return;
	}

	wp_enqueue_script(
		'preview-link-block-frontend',
		plugin_dir_url( __FILE__ ) . 'src/frontend.js',
		array(),
		'1.0.0',
		true
	);

	wp_enqueue_style(
		'preview-link-block-style',
		plugin_dir_url( __FILE__ ) . 'src/style.css',
		array(),
		'1.0.0'
	);
}
add_action( 'wp_enqueue_scripts', 'preview_link_block_enqueue_frontend' );

/**
 * Enqueue block editor styles
 */
function preview_link_block_enqueue_editor() {
	wp_enqueue_style(
		'preview-link-block-editor',
		plugin_dir_url( __FILE__ ) . 'src/editor.css',
		array(),
		'1.0.0'
	);
}
add_action( 'enqueue_block_editor_assets', 'preview_link_block_enqueue_editor' );
