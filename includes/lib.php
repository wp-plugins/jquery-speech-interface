<?php
/**
 * Class library for jQuery Speech Interface
 * ------------------------------------------
 * This file contains all classes used by this plugin
 *
 * @package jquery-speech-interface
 */


/**
 * Class containing all settings for this plugin
 *
 * @see JquerySpeechPluginFactory::load
 * @class JquerySpeechPlugin
 */
class JquerySpeechPlugin {

    /**
     * @var string
     */
    private $not_supported_message;

    /**
     * @var bool
     */
    private $is_active;

    /**
     * @var int
     */
    private $debug_mode;

    /**
     * @constructor
     */
    public function __construct() {
        $this->not_supported_message = __('Your browser does not support -webkit-speech');
        $this->is_active = true;
        $this->debug_mode = 2;
    }

    /**
     * @param bool $active
     */
    public function setIsActive($active) {
        $this->is_active = (bool)$active;
    }

    /**
     * @return bool
     */
    public function isActive() {
        return $this->is_active;
    }

    /**
     * @param string $not_supported_message
     */
    public function setNotSupportedMessage($not_supported_message) {
        $this->not_supported_message = $not_supported_message;
    }

    /**
     * @return string
     */
    public function getNotSupportedMessage() {
        return $this->not_supported_message;
    }

    /**
     * @param int $debug_mode
     */
    public function setDebugMode($debug_mode) {
        $this->debug_mode = (int)$debug_mode;
    }

    /**
     * @return int
     */
    public function getDebugMode() {
        return $this->debug_mode;
    }
}


/**
 * Class responsible of creating, saving and deleting the
 * object containing the settings for this plugin
 *
 * @class JquerySpeechPluginFactory
 */
class JquerySpeechPluginFactory {

    const OPT_NAME = 'jqspeech';

    /**
     * @static
     * @return JquerySpeechPlugin
     */
    public static function load() {
        $plugin = get_option(self::OPT_NAME, false);

        if( $plugin === false) {
            $plugin = new JquerySpeechPlugin();
            self::save($plugin);
        }

        return $plugin;
    }

    /**
     * @static
     * @param JquerySpeechPlugin $jqspeech_plugin
     */
    public static function save($jqspeech_plugin) {
        update_option(self::OPT_NAME, $jqspeech_plugin);
    }

    /**
     * @static
     */
    public static function remove() {
        delete_option(self::OPT_NAME);
    }
}