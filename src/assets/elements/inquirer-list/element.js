/**
 * # `inquirer-list` Element
 *
 *     <inquirer-list>
 *     </inquirer-list>
 */

import {
	getTarget,
	registerElement
} from '../../scripts/util/dom';

const SELECTOR_INPUT = 'input:not([disabled]):not([hidden])';
const SELECTOR_TYPE_CHECKBOX = '[type="checkbox"]';

/**
 * @class InquirerListElement
 * @extends HTMLElement
 */
export default registerElement('inquirer-list', HTMLElement, {
	/**
	 * @method attachedCallback
	 * @callback
	 */
	attachedCallback() {
		this.addEventListener('keydown', this.onKeyPressed);
	},

	/**
	 * Gives focus to the first input, preferring checked inputs, if any.
	 *
	 * @method setFocus
	 * @chainable
	 */
	setFocus() {
		const inputs = Array.from(this.queryAll(SELECTOR_INPUT));
		const checked = inputs.filter(i => i.checked);
		const target = checked[0] || inputs[0];

		if (target) {
			target.focus();
		}

		return this;
	},

	/**
	 * Shifts focus from the current element to another in a list based on an
	 * offset. Wraps around the start and end of the list as needed. Has no
	 * effect if there is only one element.
	 *
	 * @method shiftFocus
	 * @param {Number} offset
	 * @chainable
	 */
	shiftFocus(offset = 1) {
		const inputs = Array.from(this.queryAll(SELECTOR_INPUT));
		const oldIndex = inputs.indexOf(document.activeElement);
		const newIndex = (offset + oldIndex + inputs.length) % inputs.length;

		if (!isNaN(newIndex)) {
			inputs[newIndex].focus();
		}

		return this;
	},

	/**
	 * @method onKeyPressed
	 * @param {Event} event
	 * @callback
	 */
	onKeyPressed(event) {
		if (!getTarget(this, event, SELECTOR_TYPE_CHECKBOX)) {
			return;
		}

		switch (event.key) {
			case 'ArrowLeft':
			case 'ArrowUp':
				event.preventDefault();

				return this.shiftFocus(-1);

			case 'ArrowRight':
			case 'ArrowDown':
				event.preventDefault();

				return this.shiftFocus(1);

			// no default
		}
	}
});
