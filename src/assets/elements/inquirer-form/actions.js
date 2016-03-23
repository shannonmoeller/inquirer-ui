/**
 * # Inquirer Form Actions
 */

/**
 * @method init
 * @return {Object} Initial state.
 */
export function init() {
	return {
		isLoading: true,
		prompts: [],
		answers: {},
		error: null,
		step: 0
	};
}

/**
 * @method fetchSuccess
 * @param {Object} state
 * @param {Object} data
 * @param {Array<Object>} data.prompts
 * @return {Object} New state.
 */
export function fetchSuccess(state, { prompts }) {
	return {
		...state,

		isLoading: false,
		prompts: prompts,
		error: null,
		step: 1
	};
}

/**
 * @method fetchError
 * @param {Object} state
 * @param {Object} data
 * @param {Object} data.error
 * @return {Object} New state.
 */
export function fetchError(state, { error }) {
	return {
		...state,

		isLoading: false,
		prompts: [],
		error: error,
		step: 0
	};
}

/**
 * @method fetchNext
 * @param {Object} state
 * @param {Object} data
 * @param {Object} data.answers
 * @return {Object} New state.
 */
export function next(state, { answers }) {
	return {
		...state,

		answers: answers,
		step: state.step + 1
	};
}
