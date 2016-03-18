/**
 * # State Container
 */

export const STORE_UNDO = 'STORE_UNDO';
export const STORE_REDO = 'STORE_REDO';

export function makeUndoable(reducer) {
	const initialUndoState = {
		present: reducer(undefined, {}),
		past: [],
		future: []
	};

	return function undoableReducer(state = initialUndoState, action) {
		const {past, present, future} = state;

		if (!action || !action.type) {
			return state;
		}

		switch (action.type) {
			case STORE_UNDO:
				return {
					present: past[past.length - 1],
					past: past.slice(0, -1),
					future: [present, ...future]
				};

			case STORE_REDO:
				return {
					present: future[0],
					past: [...past, present],
					future: future.slice(1)
				};

			default:
				return {
					present: reducer(present, action),
					past: [...past, present],
					future: []
				};
		}
	};
}

export function createReducer(initialState, actions) {
	return function reducer(state = initialState, action) {
		if (!action || !action.type) {
			return state;
		}

		return actions[action.type](state, action);
	};
}

export function createStore(reducer, state) {
	const handlers = [];
	let isDispatching = false;

	function getState() {
		return state;
	}

	function subscribe(handler) {
		if (typeof handler !== 'function') {
			throw new Error('Invalid handler.');
		}

		if (handlers.indexOf(handler) === -1) {
			handlers.push(handler);
		}

		return function unsubscribe() {
			const index = handlers.indexOf(handler);

			if (index !== -1) {
				handlers.splice(index, 1);
			}
		};
	}

	function dispatch(action) {
		if (!action) {
			throw new Error('Invalid action.');
		}

		if (!action.type) {
			throw new Error('Invalid action type.');
		}

		if (isDispatching) {
			throw new Error('Dispatch in progress.');
		}

		if (!action || !action.type) {
			return action;
		}

		isDispatching = true;
		state = reducer(state, action);
		handlers.slice().forEach(h => h());
		isDispatching = false;

		return action;
	}

	state = reducer(state, {});

	return {
		getState,
		subscribe,
		dispatch
	};
}
