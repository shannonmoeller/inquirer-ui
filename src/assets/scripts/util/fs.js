/**
 * # File System Utilities
 */

import globby from 'globby';

/**
 * @type {Function}
 * @param {String|Array<String>} glob
 * @return {Promise<Array<String>>}
 */
export async function find(glob) {
	const srcFiles = await globby(glob);
	const destFiles = srcFiles.map(file => file.replace('src/', 'dist/'));

	return {srcFiles, destFiles};
}
