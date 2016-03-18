/**
 * # Inquirer Form Actions
 */

/**
 * @method fetchSuccess
 * @param {Object} state
 * @param {Object} data
 * @param {Object} data.prompts
 * @return {Object} New state.
 */
export function fetchSuccess(state, {prompts}) {
	return {
		...state,

		isLoading: false,
		prompts: prompts,
		step: 0
	};
}

/**
 * @method fetchError
 * @param {Object} state
 * @param {Object} data
 * @param {Object} data.error
 * @return {Object} New state.
 */
export function fetchError(state, {error}) {
	return {
		...state,

		isLoading: false,
		error: error
	};
}

/**
 * @method fetchNext
 * @param {Object} state
 * @param {Object} data
 * @param {Object} data.answers
 * @return {Object} New state.
 */
export function next(state, {answers}) {
	return {
		...state,

		answers: answers,
		step: state.step + 1
	};
}
