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
		this.create();

		this.addEventListener('click', this.onGenerateClicked, this);
		this.addEventListener('click', this.onNextClicked, this);
		this.addEventListener('click', this.onPrevClicked, this);
	},

	/**
	 * @method detachedCallback
	 * @callback
	 */
	detachedCallback() {
		this.removeEventListener('click', this.onGenerateClicked, this);
		this.removeEventListener('click', this.onNextClicked, this);
		this.removeEventListener('click', this.onPrevClicked, this);
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
	 * @method render
	 * @callback
	 */
	render() {
		const {past, present, future} = this.store.getState();
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
		if (getTarget(this, event, '[inquirer-generate]')) {
			return;
		}

		const url = this.getAttribute('action');
		const {answers} = this.store.getState();

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

		const answers = getValues(this);

		this.store
			.next({answers});
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
