/**
 * # State
 */

/**
 * @class State
 */
export class State {
	/**
	 * @constructor
	 */
	constructor(data) {
		/**
		 * @property {*} data
		 */
		this.data = data;

		/**
		 * @property {Array<Function>} listeners
		 */
		this.listeners = []

		/**
		 * @property {Boolean} isDispatching
		 */
		this.isDispatching = false;
	}

	/**
	 * @method get
	 * @return {*} Current data.
	 */
	get() {
		return this.data;
	}

	/**
	 * @method set
	 * @param {*} data
	 * @chainable
	 */
	set(data) {
		console.trace('state change');

		if (this.isDispatching) {
			throw new Error('Dispatch in progress.');
		}

		this.isDispatching = true;
		this.data = data;
		this.listeners.slice().forEach(l => l());
		this.isDispatching = false;

		return this;
	}

	/**
	 * @method addListener
	 * @param {Function} handler
	 * @chainable
	 */
	addListener(handler) {
		if (typeof handler !== 'function') {
			throw new Error('Invalid handler.');
		}

		const listeners = this.listeners;

		if (listeners.indexOf(handler) === -1) {
			listeners.push(handler);
		}

		return this;
	}

	/**
	 * @method removeListener
	 * @param {Function} handler
	 * @chainable
	 */
	removeListener(handler) {
		if (typeof handler !== 'function') {
			throw new Error('Invalid handler.');
		}

		const listeners = this.listeners;
		const index = listeners.indexOf(handler);

		if (index !== -1) {
			listeners.splice(index, 1);
		}

		return this;
	}
}
