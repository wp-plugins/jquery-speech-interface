<?php
/*
Plugin Name: jQuery Speech Interface
Plugin URI: https://github.com/victorjonsson/jQuery-Speech-Interface/
Description: With this plugin you make it possible for your visitors to scroll and navigate your website by talking to the browser. This plugin is mostly for fun since it only works in Google Chrome at the moment (supporting -webkit-speech)
Version: 1.0.4
Author: <a href="http://victorjonsson.se">Victor Jonsson</a> (<a href="http://twitter.com/victor_jonsson">@victor_jonsson</a>)
License: GPL2
License URI: http://www.gnu.org/licenses/gpl-2.0.html
*/

// TODO: Translate plugin...

// Initial constants
define('JQSPEECH_PLUGIN_PATH', dirname(__FILE__));
define('JQSPEECH_PLUGIN_URL', plugin_dir_url(__FILE__));

// Load classes used by this plugin
require JQSPEECH_PLUGIN_PATH . '/includes/lib.php';

if( is_admin() ) {
    // Load actions taking place in admin
    require JQSPEECH_PLUGIN_PATH . '/includes/admin-actions.php';
}
else {
    // Load actions taking place in the theme
    require JQSPEECH_PLUGIN_PATH .'/includes/theme-actions.php';
}
