/**
 * # State Store
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

		return store;
	}

	function removeListener(handler) {
		const index = handlers.indexOf(handler);

		if (index !== -1) {
			handlers.splice(index, 1);
		}

		return store;
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

			return store;
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
