/**
 * # Inquirer Form State
 */

import {UndoState} from '../../../scripts/lib/undoState';

/**
 * @class FormState
 * @extends UndoState
 */
export class FormState extends UndoState {
	/**
	 * @constructor
	 */
	constructor(data) {
		super({
			answers: {},
			error: null,
			isLoading: true,
			prompts: null,
			step: 0,

			...data
		});
	}

	/**
	 * @method setPrompts
	 * @param {Object} prompts
	 * @chainable
	 */
	setPrompts(prompts) {
		var state = this.get();

		return this.set({
			...state,

			isLoading: false,
			step: 0,
			prompts
		});
	}

	/**
	 * @method setError
	 * @param {String} error
	 * @chainable
	 */
	setError(error) {
		var state = this.get();

		return this.set({
			...state,

			isLoading: false,
			error
		});
	}

	/**
	 * @method setNext
	 * @param {Object} answers
	 * @chainable
	 */
	setNext(answers) {
		var state = this.get();

		return this.set({
			...state,

			step: state.step + 1,
			answers
		});
	}
}
