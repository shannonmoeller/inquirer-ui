/**
 * # `inquirer-input` Element
 *
 *     <inquirer-input>
 *     </inquirer-input>
 */

import { registerElement } from '../../scripts/util/dom';

const SELECTOR_INPUT = 'input:not([disabled]):not([hidden])';

/**
 * @class InquirerInputElement
 * @extends HTMLElement
 */
export default registerElement('inquirer-input', HTMLElement, {
	/**
	 * @method setFocus
	 * @callback
	 */
	setFocus() {
		const input = this.querySelector(SELECTOR_INPUT);

		if (input) {
			input.focus();
		}

		return this;
	}
});
