/**
 * # Undo State
 */

import {State} from './state';

/**
 * @class UndoState
 * @extends State
 */
export class UndoState extends State {
	/**
	 * @constructor
	 */
	constructor(data) {
		super(data)

		/**
		 * @property past
		 * @type {Array}
		 */
		this.past = [];

		/**
		 * @property future
		 * @type {Array}
		 */
		this.future = [];
	}

	/**
	 * @method set
	 * @param {*} data
	 * @chainable
	 */
	set(data) {
		this.past.push(this.data);
		this.future.length = 0;

		return super.set(data);
	}

	/**
	 * @method undo
	 * @chainable
	 */
	undo() {
		console.log('undo');
		this.future.unshift(this.data);

		return super.set(this.past.pop());
	}

	/**
	 * @method redo
	 * @chainable
	 */
	redo() {
		this.past.push(this.data);

		return super.set(this.future.shift());
	}
}
