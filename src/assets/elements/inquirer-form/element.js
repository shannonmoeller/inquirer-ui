/**
 * # `inquirer-form` Element
 *
 *     <inquirer-form
 *	       src="/api/prompts"
 *	       action="/api/generate">
 *     </inquirer-form>
 */

import { getTarget, getValues, registerElement, setInnerHTML } from '../../scripts/util/dom';
import { createUndoStore } from '../../scripts/lib/store';
import { resolvePrompts } from './helpers';
import * as formActions from './actions';
import * as formService from './service';
import renderForm from './templates/form.html';

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

		this.addEventListener('keyup', this.onKeyReleased);
		this.addEventListener('click', this.onGenerateClicked);
		this.addEventListener('click', this.onNextClicked);
		this.addEventListener('click', this.onPrevClicked);
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
	 * @callback
	 */
	create() {
		const url = this.getAttribute('src');
		const store = createUndoStore(formActions.init(), formActions);

		store.addListener(() => this.render());

		formService
			.getPrompts(url)
			.then(
				prompts => store.fetchSuccess({ prompts }),
				error => store.fetchError({ error })
			);

		this.store = store;
	},

	/**
	 * @method render
	 * @callback
	 */
	async render() {
		const { past, present } = this.store.getState();
		const { prompts, step } = present;
		const answers = getValues(this);
		const resolvedPrompts = await resolvePrompts(prompts, answers, step);

		setInnerHTML(this, renderForm({
			...present,

			prompts: resolvedPrompts,
			hasPrevious: past.length > 1,
			hasNext: true
		}));
	},

	/**
	 * @method onKeyReleased
	 * @param {Event} event
	 * @callback
	 */
	onKeyReleased(event) {
		console.log(event);
	},

	/**
	 * @method onGenerateClicked
	 * @param {Event} event
	 * @callback
	 */
	onGenerateClicked(event) {
		if (!getTarget(this, event, '[inquirer-generate]')) {
			return;
		}

		const url = this.getAttribute('action');
		const { answers } = this.store.getState();

		formService.getZip(url, answers);
	},

	/**
	 * @method onNextClicked
	 * @param {Event} event
	 * @callback
	 */
	onNextClicked(event) {
		if (!getTarget(this, event, '[inquirer-next]')) {
			return;
		}

		this.store
			.next({ answers: getValues(this) });
	},

	/**
	 * @method onPrevClicked
	 * @param {Event} event
	 * @callback
	 */
	onPrevClicked(event) {
		if (!getTarget(this, event, '[inquirer-prev]')) {
			return;
		}

		this.store
			.undo();
	}
});
