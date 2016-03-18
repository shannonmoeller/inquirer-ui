/**
 * # Undo Store
 */

import {createStore} from './store';

export function createUndoStore(state, reducers) {
	const undoableReducers = {};
	const undoableState = {
		present: state,
		past: [],
		future: []
	};

	function undo(state) {
		const {past, present, future} = state;

		return {
			present: past[past.length - 1],
			past: past.slice(0, -1),
			future: [present, ...future]
		};
	}

	function redo(state) {
		const {past, present, future} = state;

		return {
			present: past[past.length - 1],
			past: past.slice(0, -1),
			future: [present, ...future]
		};
	}

	function makeReducer(name) {
		const reducer = reducers[name];

		if (typeof reducer !== 'function') {
			throw new Error('The reducer must be a function.');
		}

		undoableReducers[name] = (state, data) => {
			const {past, present} = state;

			return {
				present: reducer(present, data),
				past: [...past, present],
				future: []
			};
		};
	}

	Object.keys(reducers).forEach(makeReducer);

	return createStore(undoableState, {
		undo,
		redo,

		...undoableReducers
	});
}
