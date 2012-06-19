<?php
/**
 * Admin actions and filters
 * ------------------------------------------------
 * In this file you can find all actions and filters
 * added when the user is visiting wp-admin
 *
 * @package jquery-speech-interface
 */


// Remove saved data on deactivation
register_deactivation_hook(__FILE__, 'jqspeech_deactivate');
function jqspeech_deactivate() {
    JquerySpeechPluginFactory::remove();
}

// Add options page
add_action('admin_init', 'jqspeech_admin_init');
add_action('admin_menu', 'jqspeech_admin_menu');

function jqspeech_admin_init() {
    wp_enqueue_style("jqspeech_admin", JQSPEECH_PLUGIN_URL . '/static/admin-page.css');
}

function jqspeech_admin_menu() {

    add_options_page(
        __('Speech Interface'),
        __('Speech Interface'),
        'manage_options',
        'jquery-speech-interface',
        'jqspeech_admin_page'
    );

    function jqspeech_admin_page() {
        require  JQSPEECH_PLUGIN_PATH . '/includes/admin-page.php';
    }
}