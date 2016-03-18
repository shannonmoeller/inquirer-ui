/**
 * # Inquirer Form Service
 */

/**
 * @class FormService
 * @static
 */
export const FormService = {
	/**
	 * Prompts are JSON plus functions so they are loaded as text and evaluated.
	 *
	 * @method getPrompts
	 * @param {String} url
	 * @return {Promise<Array<Object>>}
	 */
	getPrompts: function (url) {
		return fetch(url)
			.then(res => res.text())
			.then(eval); // eslint-disable-line no-eval
	},

	/**
	 * @method getZip
	 * @param {String} url
	 * @param {Object} params
	 * @return {Promise<Object>}
	 */
	getZip: function (url, params) {
		console.log(url, params);
	}
};
