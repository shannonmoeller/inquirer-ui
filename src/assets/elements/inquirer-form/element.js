/**
 * # `inquirer-form` Element
 *
 *     <inquirer-form
 *	       src="/api/prompts"
 *	       action="/api/generate">
 *     </inquirer-form>
 */

import {getTarget, getValues, registerElement, setInnerHTML} from '../../scripts/util/dom';
import {createUndoStore} from '../../scripts/lib/store';
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
		this.addEventListener('click', this.onNextClicked, this);
		this.addEventListener('click', this.onPrevClicked, this);
		this.addEventListener('click', this.onGenerateClicked, this);

		this.create();
	},

	/**
	 * @method detachedCallback
	 * @callback
	 */
	detachedCallback() {
		this.removeEventListener('click', this.onNextClicked, this);
		this.removeEventListener('click', this.onPrevClicked, this);
		this.removeEventListener('click', this.onGenerateClicked, this);

		this.destroy();
	},

	/**
	 * @method attributeChangedCallback
	 * @param {String} name
	 * @callback
	 */
	attributeChangedCallback(name) {
		if (name === 'src') {
			return;
		}

		this
			.destroy()
			.create();
	},

	/**
	 * @method create
	 * @callback
	 */
	create() {
		const store = createUndoStore(
			formActions.init(),
			formActions
		);

		store.addListener(() => this.render());

		formService
			.getPrompts(this.getAttribute('src'))
			.then(prompts => store.fetchSuccess({prompts}))
			.catch(error => store.fetchError({error}));

		this.store = store;
	},

	/**
	 * @method destroy
	 * @callback
	 */
	destroy() {
		this.store = null;
	},

	/**
	 * @method render
	 * @callback
	 */
	render() {
		const store = this.store;

		if (!store) {
			return;
		}

		const {past, present, future} = store.getState();
		const {prompts, step} = present;

		console.log(present, past, future);

		setInnerHTML(this, renderForm({
			...present,

			prompts: prompts.slice(0, step + 1),
			hasPrevious: past.length > 1,
			hasNext: true
		}));
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

		const store = this.store;

		if (!store) {
			return;
		}

		const url = this.getAttribute('action');
		const {answers} = store.getState();

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

		const store = this.store;

		if (!store) {
			return;
		}

		const answers = getValues(this);

		store.next({answers});
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

		const store = this.store;

		if (!store) {
			return;
		}

		store.undo();
	}
});
