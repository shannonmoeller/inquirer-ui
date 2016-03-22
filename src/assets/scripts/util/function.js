/**
 * # Function Utilities
 */

/**
 * @method debounce
 * @param {Function} fn
 * @param {Number=} delay
 * @return {Function}
 */
export function debounce(fn, delay = 400) {
	return function debounced() {
		if (debounced.timeout) {
			clearTimeout(debounced.timeout);
		}

		debounced.timeout = setTimeout(fn, delay);
	};
}

/**
 * Utility method to run a function that may or may not be async,
 * using Inquirer's `this.async()` style.
 *
 *     function ajax() {
 *         var done = this.async();
 *
 *         fetch('url').then(done);
 *     }
 *
 * @method runAsync
 * @param {*} func
 * @param {...*} args
 * @return {Promise}
 */
export function runAsync(func, ...args) {
	if (typeof func !== 'function') {
		return Promise.resolve(func);
	}

	return new Promise(function (resolve) {
		let isAsync = false;

		function done() {
			isAsync = true;

			return resolve;
		}

		const retval = func.apply({ async: done }, args);

		if (!isAsync) {
			resolve(retval);
		}
	});
}

/**
 * @method timer
 * @param {String} name
 * @return {Function}
 */
export function timer(name) {
	console.log(name + '...');
	console.time(name);

	return () => console.timeEnd(name);
}
