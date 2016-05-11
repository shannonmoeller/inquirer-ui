/**
 * # `inquirer-form` Element
 *
 *     <inquirer-form
 *	       src="/api/prompts"
 *	       action="/api/generate">
 *     </inquirer-form>
 */

import {
	getTarget,
	getValues,
	registerElement,
	setInnerHTML
} from '../../scripts/util/dom';

import { createUndoStore } from '../../scripts/lib/undoStore';
import { resolvePrompts } from './helpers';
import * as formActions from './actions';
import * as formService from './service';
import renderForm from './templates/form.html';

// const ATTRIBUTE_ACTION = 'action';
const ATTRIBUTE_SOURCE = 'src';

const SELECTOR_FOCUSABLE = 'inquirer-input,inquirer-list';
const SELECTOR_INPUT = 'input:not([disabled]):not([hidden])';
const SELECTOR_NEXT = '[inquirer-next]';
const SELECTOR_PREV = '[inquirer-prev]';

/**
 * @class InquirerFormElement
 * @extends HTMLElement
 */
export default registerElement('inquirer-form', HTMLElement, {
	/**
	 * @method attachedCallback
	 * @callback
	 */
	attachedCallback() {
		this.create();

		this.addEventListener('change', this.onChanged);
		this.addEventListener('click', this.onNextClicked);
		this.addEventListener('click', this.onPrevClicked);
		this.addEventListener('keydown', this.onKeyPressed);
	},

	/**
	 * @method attributeChangedCallback
	 * @param {String} name
	 * @callback
	 */
	attributeChangedCallback(name) {
		if (name !== 'src') {
			return;
		}

		this.create();
	},

	/**
	 * @method create
	 * @chainable
	 */
	create() {
		const url = this.getAttribute(ATTRIBUTE_SOURCE);
		const store = createUndoStore(formActions.init(), formActions);

		store.addListener(() => this.render());

		formService
			.getPrompts(url)
			.then(
				prompts => store.fetchSuccess({ prompts }),
				error => store.fetchError({ error })
			);

		this.hasChanged = false;
		this.store = store;

		return this;
	},

	/**
	 * @method render
	 * @callback
	 */
	async render() {
		const { past, present } = this.store.getState();
		const { prompts, answers, step } = present;

		const localAnswers = {
			...getValues(this),
			...answers
		};

		setInnerHTML(this, renderForm({
			...present,

			prompts: await resolvePrompts(prompts, localAnswers, step),
			hasPrevious: past.length > 1,
			hasNext: true
		}));

		this.hasChanged = false;
		this.setFocus();
	},

	/**
	 * @method setFocus
	 * @chainable
	 */
	setFocus() {
		const focusableElements = this.queryAll(SELECTOR_FOCUSABLE);

		// focus latest prompt
		focusableElements[focusableElements.length - 1].setFocus();

		return this;
	},

	/**
	 * @method next
	 * @chainable
	 */
	next() {
		const store = this.store;
		const { future } = store.getState();

		if (!this.hasChanged && future.length > 0) {
			store.redo();
		}
		else {
			store.next({ answers: getValues(this) });
		}

		return this;
	},

	/**
	 * @method prev
	 * @chainable
	 */
	prev() {
		const store = this.store;
		const { past } = store.getState();

		// don't undo to the initial loading state
		if (past.length > 1) {
			store.undo({
				answers: getValues(this)
			});
		}

		return this;
	},

	/**
	 * @method onChange
	 * @callback
	 */
	onChanged() {
		this.hasChanged = true;
	},

	/**
	 * @method onKeyPressed
	 * @param {Event} event
	 * @callback
	 */
	onKeyPressed(event) {
		if (!getTarget(this, event, SELECTOR_INPUT)) {
			return;
		}

		if (event.key === 'Enter') {
			event.preventDefault();

			if (event.shiftKey) {
				this.prev();
			}
			else {
				this.next();
			}
		}
	},

	/**
	 * @method onNextClicked
	 * @param {Event} event
	 * @callback
	 */
	onNextClicked(event) {
		if (!getTarget(this, event, SELECTOR_NEXT)) {
			return;
		}

		this.next();
	},

	/**
	 * @method onPrevClicked
	 * @param {Event} event
	 * @callback
	 */
	onPrevClicked(event) {
		if (!getTarget(this, event, SELECTOR_PREV)) {
			return;
		}

		this.prev();
	}
});
