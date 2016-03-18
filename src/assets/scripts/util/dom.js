/**
 * # DOM Utilities
 */

import morphdom from 'morphdom';

const reduce = Array.prototype.reduce;

/**
 * Adds an input key-value pair to a data object, if enabled.
 *
 * @example
 *     <input type="text" name="string" value="string" />
 *     <input type="password" name="string" value="string" />
 *     <input type="checkbox" name="array[]" checked />
 *     <input type="checkbox" name="array[]" value="string" />
 *     <input type="radio" name="string" value="string" />
 *
 * @type {Function}
 * @param {Object} data
 * @param {HTMLElement} element
 * @return {Object}
 */
function parseInput(data, input) {
	if (input.disabled) {
		return data;
	}

	let name = input.name;
	const value = input.value;
	const checked = input.checked;

	switch (input.type) {
		case 'checkbox':
			name = name.slice(0, -2);
			data[name] = data[name] || [];

			if (checked) {
				data[name].push(value || checked);
			}

			break;

		case 'radio':
			if (checked) {
				data[name] = value;
			}

			break;

		default:
			data[name] = value || null;

			break;
	}

	return data;
}

/**
 * Determines an event target based on a CSS selector.
 *
 * @method getTarget
 * @param {HTMLElement} element
 * @param {Event} event
 * @param {String} selector
 * @return {HTMLElement|null}
 */
export function getTarget(element, event, selector) {
	var target = event.target.closest(selector);

	if (target && element.contains(target)) {
		return target;
	}

	return null;
}

/**
 * A naive input serializer.
 *
 * @method getValues
 * @param {HTMLElement} element
 * @return {Object}
 */
export function getValues(element) {
	return reduce.call(
		element.getElementsByTagName('input'),
		parseInput,
		{}
	);
}

/**
 * Convenience wrapper for registering a new DOM element.
 *
 * @method registerElement
 * @param {String} tagName
 * @param {HTMLElement} parent
 * @param {Object} child
 * @return {HTMLElement}
 */
export function registerElement(tagName, parent, child) {
	return document.registerElement(tagName, {
		prototype: Object.assign(
			Object.create(parent.prototype),
			child
		)
	});
}

/**
 * Set the innerHTML of an element with DOM patching.
 *
 * @method setInnerHTML
 * @param {HTMLElement} fromElement
 * @param {HTMLElement|String} toElement
 * @param {Object} options
 * @return {HTMLElement}
 */
export function setInnerHTML(fromElement, toElement, options = {}) {
	options.childrenOnly = true;

	if (typeof toElement === 'string') {
		const fragment = document.createElement('div');

		fragment.innerHTML = toElement;

		toElement = fragment;
	}

	return morphdom(fromElement, toElement, options);
}
