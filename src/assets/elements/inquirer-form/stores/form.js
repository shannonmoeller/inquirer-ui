/**
 * # Inquirer Form Store
 */

import {
	DEDUCE_UNDO,
	DEDUCE_REDO,
	makeUndoable,
	createReducer,
	createStore
} from '../../../scripts/lib/store';

export const FORM_FETCH_SUCCESS = 'FORM_FETCH_SUCCESS';
export const FORM_FETCH_ERROR = 'FORM_FETCH_ERROR';
export const FORM_STEP_NEXT = 'FORM_STEP_NEXT';
export const FORM_UNDO = DEDUCE_UNDO;
export const FORM_REDO = DEDUCE_REDO;

const initialState = {
	answers: {},
	error: null,
	isLoading: true,
	prompts: null,
	step: 0
};

const formActions = {
	[FORM_FETCH_SUCCESS](state, action) {
		return {
			...state,
			isLoading: false,
			prompts: action.prompts,
			step: 1
		};
	},

	[FORM_FETCH_ERROR](state, action) {
		return {
			...state,
			isLoading: false,
			error: action.error
		};
	},

	[FORM_STEP_NEXT](state, action) {
		return {
			...state,
			answers: action.answers,
			step: state.step + 1
		};
	}
};

export function createFormStore(state = initialState) {
	const formReducer = createReducer(state, formActions);
	const undoableFormReducer = makeUndoable(formReducer);
	const store = createStore(undoableFormReducer);

	return store;
}
