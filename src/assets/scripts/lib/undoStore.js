/**
 * # Undoable State Store
 */

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

	function undo(state) {
		const { past, present, future } = state;

		return {
			present: past[past.length - 1],
			past: past.slice(0, -1),
			future: [present, ...future]
		};
	}

	function redo(state) {
		const { past, present, future } = state;

		return {
			present: future[0],
			past: [...past, present],
			future: future.slice(1)
		};
	}

	function makeAction(name) {
		const action = actions[name];

		if (typeof action !== 'function') {
			throw new Error('The action must be a function.');
		}

		undoableActions[name] = (state, data) => {
			const { past, present } = state;

			return {
				present: action(present, data),
				past: [...past, present],
				future: []
			};
		};
	}

	Object.keys(actions).forEach(makeAction);

	Object.assign(undoableActions, {
		undo,
		redo
	});

	return createStore(undoableState, undoableActions);
}
