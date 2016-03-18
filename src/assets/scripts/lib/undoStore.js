/**
 * # Undo Store
 */

import {createStore} from './store';

export function createUndoStore(state, actions) {
	const undoableActions = {};
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

	function makeAction(name) {
		const reducer = actions[name];

		if (typeof reducer !== 'function') {
			throw new Error('The reducer must be a function.');
		}

		undoableActions[name] = (state, data) => {
			const {past, present} = state;

			return {
				present: reducer(present, data),
				past: [...past, present],
				future: []
			};
		};
	}

	Object.keys(actions).forEach(makeAction);

	return createStore(undoableState, {
		undo,
		redo,

		...undoableActions
	});
}
