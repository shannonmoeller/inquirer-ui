/**
 * # State Store Creators
 */

/**
 * @method createStore
 * @param {*} state
 * @param {Object<String,Function()>} actions
 * @return {Object} Store
 */
export function createStore(state, actions) {
	const store = {};
	const handlers = [];
	let isDispatching = false;

	function getState() {
		return state;
	}

	function addListener(handler) {
		if (typeof handler !== 'function') {
			throw new Error('The handler must be a function.');
		}

		if (handlers.indexOf(handler) === -1) {
			handlers.push(handler);
		}
	}

	function removeListener(handler) {
		const index = handlers.indexOf(handler);

		if (index !== -1) {
			handlers.splice(index, 1);
		}
	}

	function dispatch(action, data) {
		if (isDispatching) {
			throw new Error('Dispatch in progress.');
		}

		isDispatching = true;
		state = action(state, data);
		handlers.slice().forEach(h => h());
		isDispatching = false;
	}

	function makeDispatcher(name) {
		const action = actions[name];

		if (typeof action !== 'function') {
			throw new Error('The action must be a function.');
		}

		store[name] = function (data) {
			dispatch(action, data);

			return this;
		};
	}

	Object.keys(actions).forEach(makeDispatcher);

	Object.assign(store, {
		getState,
		addListener,
		removeListener
	});

	return store;
}

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
			present: future[0],
			past: [...past, present],
			future: future.slice(1)
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

	Object.assign(undoableActions, {
		undo,
		redo
	});

	return createStore(undoableState, undoableActions);
}
