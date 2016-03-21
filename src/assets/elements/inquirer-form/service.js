/**
 * # Inquirer Form Service
 */

/**
 * Prompts are JSON plus functions so they are loaded as text and evaluated.
 * Only load prompts from trusted sources.
 *
 * @method getPrompts
 * @param {String} url
 * @return {Promise<Array<Object>>}
 */
export function getPrompts(url) {
	return fetch(url)
		.then(res => res.text())
		.then(eval); // eslint-disable-line no-eval
}

/**
 * @method getZip
 * @param {String} url
 * @param {Object} params
 * @return {Promise<Object>}
 */
export function getZip(url, params) {
	console.log('get zip', url, params);
}
