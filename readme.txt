=== jQuery Speech Interface ===

Contributors: victor_jonsson
Plugin URI: https://github.com/victorjonsson/jQuery-Speech-Interface/
Tags: jquery, speech, interface
Requires at least: 2.7
Tested up to: 3.3.4
Stable tag: 1.0.2
License: GPL2
License URI: http://www.gnu.org/licenses/gpl-2.0.html

With this plugin you make it possible for your visitors to scroll and navigate your website by talking to the browser.

== Description ==

The idea behind this plugin is to give people with **disabilities** (that makes it difficult or impossible to use a mouse) a better website experience.


> **NOTICE!** This plugin is mostly for fun and can't really be put into use since Chrome is the only browser implementing _-webkit-speech_ at the moment. It's also not possible to trigger the speech input without clicking on the input field, which is in contradiction to the purpose of this plugin. But as soon as the browsers adds the event _startSpeechInput_ to speech inputs this will be possible to achieve.

= How does it work? =
After that you've installed the plugin a dialog box will appear in the left corner of your website. In the dialog box there will be a small microphone-icon. Click on the icon and a recording will start (remember that this is only supported by Google Chrome at the moment).

Say one of the following commands and the magic will happen (*you have to say it loud and clear, otherwise googles servers gets a bit muddle-headed*).

* "scroll down"
* "scroll up"
* "scroll" - Will trigger the last scroll command you said
* "link X" - There will be a number in a gray circle beside every link on your page. You navigate to a link simply by saying "link" followed by the number.


== Installation ==

1. Install the via the WordPress.org plugin directory.
2. That's all folks! (You can change the settings of the plugin by navigation to "Settings" -> "Speech Interface" in wp-admin)

== Screenshots ==

1. The speech interface controller that will show up in the right corner of your website
2. Settings page in wp-admin
