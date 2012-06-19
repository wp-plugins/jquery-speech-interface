<?php
/**
 * Theme actions and filters
 * ------------------------------------------------
 * In this file you can find all actions and filters
 * added when someone visiting the public page
 *
 * @package jquery-speech-interface
 */

add_action('template_redirect', 'jqspeech_init');
function jqspeech_init() {

    // Load and initiate plugin if activated
    $settings = JquerySpeechPluginFactory::load();
    if($settings->isActive()) {


        // Enqueue necessary scripts
        wp_enqueue_script('jquery');
        wp_register_script('jquery-speech-interface', JQSPEECH_PLUGIN_URL . '/static/jquery.speechinterface.js', array('jquery'));
        wp_enqueue_script('jquery-speech-interface');


        // Add footer script that initiates the jquery plugin
        add_action('wp_footer', 'jqspeech_init_jquery_plugin');
        function jqspeech_init_jquery_plugin() {
            $settings = JquerySpeechPluginFactory::load();
            ?>
            <script type="text/javascript">
                jQuery(document).ready(function() {
                    jQuery('body').speechInterface({
                        <?php if(is_user_logged_in()): ?>
                            posY : 40,
                            <? endif; ?>
                        debugMode : <?=$settings->getDebugMode()?>,
                        scrollLength : jQuery(window).height() * 0.4,
                        notSupportedMessage: <?php echo $settings->getNotSupportedMessage() == '' ? 'false':'\''.$settings->getNotSupportedMessage().'\'' ?>
                    });
                });
            </script>
            <?php
        }
    }
}