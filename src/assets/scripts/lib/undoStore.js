/**
 * # Undoable State Store
 */

import { createStore } from './store';

/**
 * @method createUndoStore
 * @param {*} state
 * @param {Object<String,Function()>} actions
 * @return {Object} UndoStore
 */
export function createUndoStore(state, actions) {
	const undoableActions = {};
	const undoableState = {
		present: state,
		past: [],
		future: []
	};

	function undo(state, data) {
		const { past, present, future } = state;

		if (past.length === 0) {
			return state;
		}

		return {
			present: past[past.length - 1],
			past: past.slice(0, -1),
			future: [{ ...present, ...data }, ...future]
		};
	}

	function redo(state, data) {
		const { past, present, future } = state;

		if (future.length === 0) {
			return state;
		}

		return {
			present: future[0],
			past: [...past, { ...present, ...data }],
			future: future.slice(1)
		};
	}

	function act(action, state, data) {
		const { past, present } = state;

		return {
			present: action(present, data),
			past: [...past, present],
			future: []
		};
	}

	Object.keys(actions).forEach(name => {
		const action = actions[name];

		if (typeof action !== 'function') {
			throw new Error('The action must be a function.');
		}

		undoableActions[name] = (state, data) => act(action, state, data);
	});

	Object.assign(undoableActions, {
		undo,
		redo
	});

	return createStore(undoableState, undoableActions);
}
