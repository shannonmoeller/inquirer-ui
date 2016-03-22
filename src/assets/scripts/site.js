/**
 * # Site-Wide Scripts
 */

/**
 * ## Polyfills
 */

import 'babel-polyfill';
import 'dom-shims';
import 'document-register-element';
import 'whatwg-fetch';
import svg4everybody from 'svg4everybody';

svg4everybody();

/**
 * ## Feature Detection
 */

document.documentElement.classList.remove('no-js');

/**
 * ## Elements
 */
import '../elements/inquirer-form/element';
import '../elements/inquirer-input/element';
import '../elements/inquirer-list/element';
