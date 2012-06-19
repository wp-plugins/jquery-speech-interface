/*
*
* jQuery Speech Control
* ------------------------------------------
* Created by Victor Jonsson <http://www.victorjonsson.se>
*
* (c) 2011 Victor Jonsson, Sweden.
* Dual licensed under the MIT or GPL Version 2 licenses
*
* $version 0.1
*
*/

 (function(jQuery) {
    jQuery.extend(jQuery.fn, {

        speechInterface : function(config) {

            var self = jQuery(this);
            var settings = {
                speechInput : false,
                debugMode : false,
                posX : 15,
                posY : 15,
                notSupportedMessage : 'Your browser does not support webkit-speech',
                scrollLength : Math.round(jQuery(this).height() * 0.4)
            };

            if (config)
                jQuery.extend(settings, config);

            //
            // Create message container
            //
            var containerCSS = {
                    position : 'fixed',
                    top : settings.posY,
                    left : settings.posX,
                    borderRadius : '5px',
                    boxShadow : '2px 2px 2px #ccc',
                    zIndex : 9999,
                    minWidth: '190px',
                    fontSize : '11px',
                    fontFamily : 'Helvetica, sans-serif',
                    padding: '5px',
                    margin: '0px',
                    verticalAlign : '25px',
                    minHeight : '40px',
                    backgroundColor : '#F9F9F9',
                    background: '-webkit-gradient(linear, 0% 0%, 0% 100%, from(#E1E1E1), to(#FFF))'
                };
            settings.messageContainer = jQuery('<DIV />').css(containerCSS).appendTo('body');

            // Create speech input
            var append = false;
            var inputCSS = {
                    width:'10px',
                    cursor : 'pointer',
                    background : '#FFFFFF',
                    border : '0px',
                    padding : '0px 0px 0px',
                    verticalAlign : '-3px'
                };
            
            settings.speechInput = jQuery('<INPUT />', {'x-webkit-speech':'x-webkit-speech'}).css(inputCSS);
            settings.speechInput.appendTo(settings.messageContainer);

            settings.messageContainer.append('<span style="margin: 0 0 0 4px; color:#999; padding: 0">jQuery Speech Interface</span>');

            /**
             * Makes it possible to show debug messages
             * @class Messenger
             * @param {jQuery} el
             */
            var Messenger = function(el) {
                this.el = el;

                this.clear = function() {
                    this.el.find('.message_wrapper').remove();
                };

                this.showMessage = function(message, fadeOut, css) {
                    var mess = jQuery('<DIV />', {'class' : 'message_wrapper'}).html('<div style="padding: 4px 4px 0px;">'+message+'</div>');
                    if(css)
                        mess.css(css);

                    this.el.append(mess);

                    if(fadeOut) {
                        setTimeout(function() {
                            mess.fadeOut('normal', function() {
                                jQuery(this).remove();
                            });

                        }, 3000);
                    }
                };
            };

            // webkit-speech not supported
            if(document.createElement("input").webkitSpeech === undefined) {
                settings.speechInput.hide();
                if(settings.notSupportedMessage)
                    new Messenger(settings.messageContainer).showMessage(settings.notSupportedMessage, false, {color: 'red'});
                else
                    settings.messageContainer.hide();
            }
            else {

                 /**
                 * Responsible for interpret sentences as commands
                 * @class Interpreter
                 */
                var Interpreter = function() {

                    this.command = '';
                    this.words = [];

                     /**
                      * @param {String} word
                      * @return {String}
                      */
                    this.metaphone = function(word, phones) {
                        // +   original by: Greg Frazier
                        // +   improved by: Brett Zamir (http://brett-zamir.me)
                        // *     example 1: metaphone('Gnu');
                        // *     returns 1: 'N'
                        // As far as use of the String() constructor, the author recalls IE 6 giving errors otherwise

                        var wordlength = word.length,
                            x = 0,
                            tempchar = '',
                            metaword = '',
                            removedbl = function (word) {
                                var wordlength = word.length,
                                    tempword = word.toLowerCase(),
                                    rebuilt, tempchar1, tempchar2, x;

                                tempchar1 = tempword.charAt(0);
                                rebuilt = tempchar1;
                                for (x = 1; x < wordlength; x++) {
                                    tempchar2 = tempword.charAt(x);
                                    if (tempchar2 != tempchar1 || tempchar2 == 'c' || tempchar2 == 'g') {
                                        rebuilt += tempchar2;
                                    }
                                    tempchar1 = tempchar2;
                                }
                                return rebuilt;
                            },
                            isVowel = function (a) {
                                            return (/[aeiou]/).test(a.toLowerCase());
                            },
                            tempword = removedbl(word.toLowerCase());

                        //Special wh- case
                        if (tempword.charAt(0) == 'w' && tempword.charAt(1) == 'h') {
                            // Remove "h" and rebuild the string
                            tempword = "w" + tempword.substr(2);
                        }

                        for (x = 0; x < wordlength; x++) {
                            tempchar = String(tempword).charAt(x);
                            if (x === 0 && x + 1 <= wordlength) {
                                switch (tempchar) {
                                case 'a':
                                    if (tempword.charAt(x + 1) == 'e') {
                                        metaword += 'e';
                                    } else {
                                        metaword += 'a';
                                    }
                                    break;
                                case 'e': case 'i': case 'o': case 'u':
                                    metaword += tempchar;
                                    break;
                                case 'g':
                                    if (String(tempword).charAt(x + 1) == 'n') {
                                        x += 1;
                                        tempchar = String(tempword).charAt(x);
                                    }
                                    break;
                                case 'k':
                                    if (String(tempword).charAt(x + 1) == 'n') {
                                        x += 1;
                                        tempchar = String(tempword).charAt(x);
                                    }
                                    break;
                                case 'p':
                                    if (String(tempword).charAt(x + 1) == 'n') {
                                        x += 1;
                                        tempchar = String(tempword).charAt(x);
                                    }
                                    break;
                                case 'w':
                                    if (String(tempword).charAt(x + 1) == 'r') {
                                        x += 1;
                                        tempchar = String(tempword).charAt(x);
                                        break;
                                    }
                                    break;
                                }
                            }
                            if (isVowel(tempchar) === false) {
                                switch (tempchar) {
                                case 'b':
                                    if (String(tempword).charAt(x - 1) == 'm') {
                                        break;
                                    } else {
                                        metaword += 'b';
                                    }
                                    break;
                                case 'c':
                                    if (x + 1 <= wordlength) {
                                        if (String(tempword).charAt(x + 1) == 'h' && String(tempword).charAt(x - 1) != 's') {
                                            if (x === 0 && (x + 2 <= wordlength) && isVowel(String(tempword).charAt(x + 2))) {
                                                metaword += 'k';
                                            } else {
                                                metaword += 'x';
                                            }
                                        } else if (String(tempword).charAt(x + 1) == 'i' && String(tempword).charAt(x + 2) == 'a') {
                                            metaword += 'x';
                                        } else if (String(tempword).charAt(x + 1) == 'i' || String(tempword).charAt(x + 1) == 'e' || String(tempword).charAt(x + 1) == 'y') {
                                            if (x > 0) {
                                                if (String(tempword).charAt(x - 1) == 's') {
                                                    break;
                                                } else {
                                                    metaword += 's';
                                                }
                                            } else {
                                                metaword += 's';
                                            }
                                        } else {
                                            metaword += 'k';
                                        }
                                    } else {
                                        metaword += 'k';
                                    }
                                    break;
                                case 'd':
                                    if (x + 2 <= wordlength) {
                                        if (String(tempword).charAt(x + 1) == 'g') {
                                            if (String(tempword).charAt(x + 2) == 'e' || String(tempword).charAt(x + 2) == 'y' || String(tempword).charAt(x + 2) == 'i') {
                                                metaword += 'j';
                                                x += 2;
                                            } else {
                                                metaword += 't';
                                            }
                                        } else {
                                            metaword += 't';
                                        }
                                    } else {
                                        metaword += 't';
                                    }
                                    break;
                                case 'f':
                                    metaword += 'f';
                                    break;
                                case 'g':
                                    if (x < wordlength) {
                                        if ((String(tempword).charAt(x + 1) == 'n' && x + 1 == wordlength - 1) || (String(tempword).charAt(x + 1) == 'n' && String(tempword).charAt(x + 2) == 's' && x + 2 == wordlength - 1)) {
                                            break;
                                        }
                                        if (String(tempword).charAt(x + 1) == 'n' && String(tempword).charAt(x + 2) == 'e' && String(tempword).charAt(x + 3) == 'd' && x + 3 == wordlength - 1) {
                                            break;
                                        }
                                        if (String(tempword).charAt(x - 1) == 'n' && String(tempword).charAt(x - 2) == 'i' && x == wordlength - 1) {
                                            break;
                                        }
                                        if (String(tempword).charAt(x + 1) == 'h' && x + 1 <= wordlength - 1 && String(tempword).charAt(x - 1) == 'u' && String(tempword).charAt(x - 2) == 'o') {
                                            metaword += 'f';
                                            break;
                                        }
                                        if (String(tempword).charAt(x + 1) == 'h' && x + 2 <= wordlength) {
                                            if (isVowel(String(tempword).charAt(x + 2)) === false) {
                                                break; /*silent*/
                                            } else {
                                                metaword += 'k';
                                            }
                                        } else if (x + 1 == wordlength) {
                                            if (String(tempword).charAt(x + 1) == 'n') {
                                                break;
                                            } else {
                                                metaword += 'k';
                                            }
                                        } else if (x + 3 == wordlength) {
                                            if (String(tempword).charAt(x + 1) == 'n' && String(tempword).charAt(x + 2) == 'e' && String(tempword).charAt(x + 3) == 'd') {} else {
                                                metaword += 'k';
                                            }
                                        } else if (x + 1 <= wordlength) {
                                            if (String(tempword).charAt(x + 1) == 'i' || String(tempword).charAt(x + 1) == 'e' || String(tempword).charAt(x + 1) == 'y') {
                                                if (String(tempword).charAt(x - 1) != 'g') {
                                                    metaword += 'j';
                                                }
                                            } else if (x > 0) {
                                                if (String(tempword).charAt(x - 1) == 'd') {
                                                    switch (String(tempword).charAt(x + 1)) {
                                                    case 'e':
                                                    case 'y':
                                                    case 'i':
                                                        break;
                                                    default:
                                                        metaword += 'k';
                                                    }
                                                } else {
                                                    metaword += 'k';
                                                }
                                            } else {
                                                metaword += 'k';
                                            }
                                        } else {
                                            metaword += 'k';
                                        }
                                    } else {
                                        metaword += 'k';
                                    }
                                    break;
                                case 'm': case 'j': case 'n': case 'r': case 'l':
                                    metaword += tempchar;
                                    break;
                                case 'q':
                                    metaword += 'k';
                                    break;
                                case 'v':
                                    metaword += 'f';
                                    break;
                                case 'z':
                                    metaword += 's';
                                    break;
                                case 'x':
                                    metaword += (x === 0) ? 's' : 'ks';
                                    break;
                                case 'k':
                                    if (x > 0) {
                                        if (String(tempword).charAt(x - 1) != 'c') {
                                            metaword += 'k';
                                        }
                                    } else {
                                        metaword += 'k';
                                    }
                                    break;
                                case 'p':
                                    if (x + 1 <= wordlength) {
                                        if (String(tempword).charAt(x + 1) == 'h') {
                                            metaword += 'f';
                                        } else {
                                            metaword += 'p';
                                        }
                                    } else {
                                        metaword += 'p';
                                    }
                                    break;
                                case 'y':
                                    if (x + 1 <= wordlength) {
                                        if (isVowel(String(tempword).charAt(x + 1)) === true) {
                                            metaword += 'y';
                                        }
                                    } else {
                                        metaword += 'y';
                                    }
                                    break;
                                case 'h':
                                    if (x === 0 || 'csptg'.indexOf(String(tempword).charAt(x - 1)) === -1) {
                                        if (isVowel(String(tempword).charAt(x + 1)) === true) {
                                            metaword += 'h';
                                        }
                                    }
                                    break;
                                case 's':
                                    if (x + 1 <= wordlength) {
                                        if (String(tempword).charAt(x + 1) == 'h') {
                                            metaword += 'x';
                                        } else if (x + 2 <= wordlength) {
                                            if (String(tempword).charAt(x + 1) == 'i') {
                                                if (String(tempword).charAt(x + 2) == 'o' || String(tempword).charAt(x + 2) == 'a') {
                                                    metaword += 'x';
                                                } else {
                                                    metaword += 's';
                                                }
                                            } else {
                                                metaword += 's';
                                            }
                                        } else {
                                            metaword += 's';
                                        }
                                    } else {
                                        metaword += 's';
                                    }
                                    break;
                                case 't':
                                    if (x + 1 <= wordlength) {
                                        if (String(tempword).charAt(x + 1) == 'h') {
                                            metaword += '0';
                                        } else if (x + 2 <= wordlength) {
                                            if (String(tempword).charAt(x + 1) == 'i') {
                                                if (String(tempword).charAt(x + 2) == 'o' || String(tempword).charAt(x + 2) == 'a') {
                                                    metaword += 'x';
                                                } else {
                                                    metaword += 't';
                                                }
                                            } else {
                                                metaword += 't';
                                            }
                                        } else {
                                            metaword += 't';
                                        }
                                    } else {
                                        metaword += 't';
                                    }
                                    break;
                                case 'w':
                                    if (x + 1 <= wordlength) {
                                        if (isVowel(String(tempword).charAt(x + 1)) === true) {
                                            metaword += 'w';
                                        }
                                    }
                                    break;
                                }
                            }
                        }

                        phones = parseInt(phones, 10);
                        if (metaword.length > phones) {
                            return metaword.substr(0, phones).toUpperCase();
                        }
                        return metaword.toUpperCase();
                    };

                     /**
                      * @param {String} s1
                      * @param {String} s2
                      * @return {Number}
                      */
                    this.levenshtein = function(s1, s2) {
                        // Calculate Levenshtein distance between two strings
                        //
                        // version: 1107.2516
                        // discuss at: http://phpjs.org/functions/levenshtein
                        // +            original by: Carlos R. L. Rodrigues (http://www.jsfromhell.com)
                        // +            bugfixed by: Onno Marsman
                        // +             revised by: Andrea Giammarchi (http://webreflection.blogspot.com)
                        // + reimplemented by: Brett Zamir (http://brett-zamir.me)
                        // + reimplemented by: Alexander M Beedie
                        // *                example 1: levenshtein('Kevin van Zonneveld', 'Kevin van Sommeveld');
                        // *                returns 1: 3
                        if (s1 == s2) {
                            return 0;
                        }

                        var s1_len = s1.length;
                        var s2_len = s2.length;
                        if (s1_len === 0) {
                            return s2_len;
                        }
                        if (s2_len === 0) {
                            return s1_len;
                        }

                        // BEGIN STATIC
                        var split = false;
                        try {
                            split = !('0')[0];
                        } catch (e) {
                            split = true; // Earlier IE may not support access by string index
                        }
                        // END STATIC
                        if (split) {
                            s1 = s1.split('');
                            s2 = s2.split('');
                        }

                        var v0 = new Array(s1_len + 1);
                        var v1 = new Array(s1_len + 1);

                        var s1_idx = 0,
                            s2_idx = 0,
                            cost = 0;
                        for (s1_idx = 0; s1_idx < s1_len + 1; s1_idx++) {
                            v0[s1_idx] = s1_idx;
                        }
                        var char_s1 = '',
                            char_s2 = '';
                        for (s2_idx = 1; s2_idx <= s2_len; s2_idx++) {
                            v1[0] = s2_idx;
                            char_s2 = s2[s2_idx - 1];

                            for (s1_idx = 0; s1_idx < s1_len; s1_idx++) {
                                char_s1 = s1[s1_idx];
                                cost = (char_s1 == char_s2) ? 0 : 1;
                                var m_min = v0[s1_idx + 1] + 1;
                                var b = v1[s1_idx] + 1;
                                var c = v0[s1_idx] + cost;
                                if (b < m_min) {
                                    m_min = b;
                                }
                                if (c < m_min) {
                                    m_min = c;
                                }
                                v1[s1_idx + 1] = m_min;
                            }
                            var v_tmp = v0;
                            v0 = v1;
                            v1 = v_tmp;
                        }
                        return v0[s1_len];
                    };

                     /**
                      * @param {String} wordA
                      * @param {String} wordB
                      * @return {Boolean}
                      */
                    this.isEqual = function(wordA, wordB) {
                        if(typeof(wordA) == 'string' && typeof(wordB) == 'string')
                            return this.levenshtein(this.metaphone(wordA), this.metaphone(wordB)) < 2;
                        else if(typeof(wordA) == 'number' && typeof(wordB) == 'number')
                            return wordA == wordB;

                        return false;
                    };

                    /**
                      * @param {String} command
                      */
                    this.setCommand = function(command) {
                        this.command = jQuery.trim(command);
                        this.words = this.command.split(' ');
                    };

                    /**
                     * @return {Number} (check against Interpreter.COMMANDS)
                     */
                    this.interpret = function() {
                        if(this.commandContains('scroll')) {
                            if(this.commandContains('up'))
                                return Interpreter.COMMANDS.SCROLL_UP;
                            else if(this.commandContains('down'))
                                return Interpreter.COMMANDS.SCROLL_DOWN;
                            else
                                return Interpreter.COMMANDS.SCROLL;
                        }
                        else if(this.commandContains('link'))
                            return Interpreter.COMMANDS.LINK;

                        return false;
                    };

                     /**
                      * @param {String} word
                      * @return {Boolean}
                      */
                    this.commandContains = function(word) {
                        for(var i=0; i < this.words.length; i++) {
                            if(this.isEqual(word, this.words[i]))
                                return true;
                        }
                        return false;
                    };

                    /**
                     * interpreted
                     * @param {jQuery} htmlNode
                     * @return {jQuery}
                     */
                    this.findInterpretedLink = function(htmlNode) {

                        var self = this;
                        var interpretNumber = function(posNumber) {
                            var n = parseInt(posNumber);
                            if(!isNaN(n))
                                return n;
                            else {
                                if(self.isEqual(posNumber, 'to') || self.isEqual(posNumber, 'who'))
                                    return 2;
                                else if(self.isEqual(posNumber, 'ate') || self.isEqual(posNumber, 'hate'))
                                    return 8;
                            }
                            
                            return NaN;
                        };

                        for(var i=0; i < this.words.length; i++) {
                            var number = interpretNumber(this.words[i]);
                            if(!isNaN(number))
                                return htmlNode.find('span[data-link='+number+']').parent();
                        }

                        return false;
                    };

                    /**
                     * @return {Array}
                     */
                    this.getCommandWords = function() {
                        return this.words;
                    };
                };

                /**
                 * Available commands
                 */
                Interpreter.COMMANDS = {
                    SCROLL : 1,
                    SCROLL_UP : 2,
                    SCROLL_DOWN : 3,
                    LINK : 4
                };

                /**
                 * @class InterfaceManager
                 * @param {jQuery} el
                 */
                var InterfaceManager = function(el) {

                    this.currentScrollPosition = 0,
                    this.el = el;
                    this.onInitialScroll = true;
                    var self = this;

                    jQuery(window).scroll(function() {
                        if(self.onInitialScroll) {
                            self.onInitialScroll = false;
                            self.el.scrollTop(0);
                        }
                    });

                    /**
                     * @param {Number} positionChange
                     * @return {Boolean}
                     */
                    this.scroll = function(positionChange) {
                        this.onInitialScroll = false;
                        var newScrollPos = this.currentScrollPosition + positionChange;
                        messenger.showMessage(this.currentScrollPosition +' '+positionChange);
                        if((this.currentScrollPosition <= 0 && newScrollPos <= 0) || newScrollPos >= this.el.height()) {
                            if(this.currentScrollPosition <= 0 && newScrollPos <= 0)
                                this.currentScrollPosition = 0;
                            else
                                this.currentScrollPosition = this.el.height();

                            this.el.scrollTop(this.currentScrollPosition);
                            return false;
                        }
                        else {
                            this.el.scrollTop(newScrollPos);
                            this.currentScrollPosition = newScrollPos;
                            return true;
                        }
                    };
                };

                var interpretation = false;
                var previousInterpretation = false;
                var interp = new Interpreter();
                var ui = new InterfaceManager(jQuery(this));
                var messenger = new Messenger(settings.messageContainer);

                //
                // Event handler that interprets and executes the command
                //
                settings.speechInput.get(0).onwebkitspeechchange = function(e) {

                    previousInterpretation = interpretation;
                    interp.setCommand( jQuery(this).val() );
                    interpretation = interp.interpret();
                    jQuery(this).val('');
                    messenger.clear();

                    if(settings.debugMode == 2)
                        messenger.showMessage('Sentence: '+interp.command);

                    switch(interpretation) {
                        // Link to new page
                        case Interpreter.COMMANDS.LINK:
                            var linkElement = interp.findInterpretedLink(self);
                            if(linkElement) {
                                if(settings.debugMode)
                                    messenger.showMessage('Executing link command');

                                ui.el.scrollTop( linkElement.offset().top - 50 );
                                linkElement
                                    .css({
                                        background : 'yellow',
                                        opacity : 0.85
                                    })
                                    .addClass('found-by-interpreter');

                                document.location = linkElement.get(0).href;
                            }
                            else if(settings.debugMode)
                                messenger.showMessage('Could not found requested link', true, {color : 'red'});
                                
                            break;

                        // scroll up
                        case Interpreter.COMMANDS.SCROLL_UP:
                            if(!ui.scroll(-settings.scrollLength) && settings.debugMode)
                                messenger.showMessage('You have scrolled to the top of the document', true, {color : 'green'});
                            break;

                        // scroll down
                        case Interpreter.COMMANDS.SCROLL_DOWN:
                            if(!ui.scroll(settings.scrollLength) && settings.debugMode)
                                messenger.showMessage('You have scrolled to the bottom of the document', true, {color : 'green'});
                            break;


                        // Continue scroll
                        case Interpreter.COMMANDS.SCROLL:
                            if(previousInterpretation == Interpreter.COMMANDS.SCROLL_UP) {
                                if(!ui.scroll(-settings.scrollLength)) {
                                    previousInterpretation = Interpreter.COMMANDS.SCROLL_DOWN;
                                    ui.scroll(settings.scrollLength);
                                }
                            }
                            else if(previousInterpretation == Interpreter.COMMANDS.SCROLL_DOWN) {
                                if(!ui.scroll(settings.scrollLength)) {
                                    previousInterpretation = Interpreter.COMMANDS.SCROLL_UP;
                                    ui.scroll(-settings.scrollLength);
                                }
                            }
                            else if(!ui.scroll(settings.scrollLength)) {
                                previousInterpretation = Interpreter.COMMANDS.SCROLL_UP;
                                ui.scroll(-settings.scrollLength);
                            }

                            if(settings.debugMode == 2)
                                messenger.showMessage('Executing scroll command, previous command being '+previousInterpretation);
                            break;

                        // Command unknown
                        default:
                            if(interp.getCommandWords().length <= 3 || settings.debugMode)
                                messenger.showMessage('Command "'+interp.command+'" is unknown');
                            break;

                    }
                };

                // Add link elements
                jQuery(this).find('a').each(function(i) {
                    var linkNode = jQuery('<span data-link="'+(i+1)+'">'+(i+1)+'</span>');
                    linkNode.css({
                        fontWeight: 'bold',
                        fontSize : '13px',
                        background : '#666',
                        color : 'white',
                        borderRadius : '20px',
                        padding : '3px 6px',
                        margin : '0 3px',
                        border : 'yellow solid 2px',
                        textDecoration : 'none !important'
                    });

                    jQuery(this).append(linkNode);
                });

                // Set focus on input to record what the persons says
                if(typeof settings.speechInput.get(0).startSpeechInput != 'undefined') {
                    // This is not implemented ny any browser at the moment :(
                }
            }

            return jQuery(this);
        }
    });
})(jQuery);