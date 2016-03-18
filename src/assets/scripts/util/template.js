/**
 * # Template String Utilities
 */

/**
 * http://www.2ality.com/2015/01/template-strings-html.html
 *
 * @method htmlEscape
 * @param {String} str
 * @return {String}
 */
export function htmlEscape(str) {
	return String(str || '')
		.replace(/&/g, '&amp;') // first!
		.replace(/>/g, '&gt;')
		.replace(/</g, '&lt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')
		.replace(/`/g, '&#96;');
}

/**
 * http://www.2ality.com/2015/01/template-strings-html.html
 *
 * @method html
 * @param {Array<String>} listeralSections
 * @param {*} ...substs
 * @return {String}
 */
export function html(literalSections, ...substs) {
	// Use raw literal sections: we don’t want
	// backslashes (\n etc.) to be interpreted
	const raw = literalSections.raw;
	let result = '';

	substs.forEach(function (subst, i) {
		// Retrieve the literal section preceding
		// the current substitution
		let lit = raw[i];

		// In the example, map() returns an array:
		// If substitution is an array (and not a string),
		// we turn it into a string
		if (Array.isArray(subst)) {
			subst = subst.join('');
		}

		// Don't print a literal null, undefined, or Boolean.
		if (subst === undefined || subst === null || typeof subst === 'boolean') {
			subst = '';
		}

		// If the substitution is preceded by a dollar sign,
		// we escape special characters in it
		if (lit.endsWith('$')) {
			subst = htmlEscape(subst);
			lit = lit.slice(0, -1);
		}

		result += lit;
		result += subst;
	});

	// Take care of last literal section
	// (Never fails, because an empty template string
	// produces one literal section, an empty string)
	result += raw[raw.length - 1]; // (A)

	return result;
}
