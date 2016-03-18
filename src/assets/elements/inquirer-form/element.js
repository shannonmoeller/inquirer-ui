/**
 * # `inquirer-form` Element
 *
 *     <inquirer-form
 *	       src="/api/prompts"
 *	       action="/api/generate">
 *     </inquirer-form>
 */

import {getEventTarget, getFormValues, registerElement, setInnerHTML} from '../../scripts/util/dom';
import {FormService} from './services/form';
import {FormState} from './states/form';
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
	 * @callback
	 */
	attributeChangedCallback(name) {
		if (name !== 'src') {
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
		const state = new FormState();

		state.addListener(() => this.render());

		FormService
			.getPrompts(this.getAttribute('src'))
			.then(prompts => state.setPrompts(prompts))
			.catch(err => state.setError(err));

		this.state = state;
	},

	/**
	 * @method destroy
	 * @callback
	 */
	destroy() {
		this.state = null;
	},

	/**
	 * @method render
	 * @callback
	 */
	render() {
		const state = this.state;

		if (!state) {
			return;
		}

		const data = state.get();
		const {answers, prompts, step} = data;

		console.log(answers);

		setInnerHTML(this, renderForm({
			...state,

			prompts: prompts.slice(0, step + 1),
			hasPrevious: state.past.length > 1,
			hasNext: true
		}));
	},

	/**
	 * @method onNextClicked
	 * @param {Event} event
	 * @callback
	 */
	onNextClicked(event) {
		if (!getEventTarget(this, event, 'button[inquirer-next]')) {
			return;
		}

		this.state
			.setNext(getFormValues(this));
	},

	/**
	 * @method onPrevClicked
	 * @param {Event} event
	 * @callback
	 */
	onPrevClicked(event) {
		if (!getEventTarget(this, event, 'button[inquirer-prev]')) {
			return;
		}

		this.state
			.undo();
	},

	/**
	 * @method onGenerateClicked
	 * @param {Event} event
	 * @callback
	 */
	onGenerateClicked(event) {
		if (!getEventTarget(this, event, 'button[inquirer-generate]')) {
			return;
		}

		const {answers} = this.state.get();

		FormService
			.getZip(this.getAttribute('action'), answers);
	}
});
