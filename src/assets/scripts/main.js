/**
 * # Site-Wide Scripts
 */

import 'babel-polyfill';
import 'document-register-element';
import 'dom4';
import 'whatwg-fetch';
import keyboardeventKey from 'keyboardevent-key-polyfill';
import svg4everybody from 'svg4everybody';

import '../elements/inquirer-form/element';
import '../elements/inquirer-input/element';
import '../elements/inquirer-list/element';

/**
 * ## Feature Detection
 */

const docEl = document.documentElement;

docEl.classList.remove('no-js');
docEl.classList.add('js');

/**
 * ## Polyfills
 */

keyboardeventKey.polyfill();
svg4everybody();
