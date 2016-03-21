/**
 * # Inquirer Form Helpers
 */

import { runAsync } from '../../scripts/util/function';

/**
 * Ensures that a choice is an object and has an index.
 *
 * @method normalizeChoice
 * @param {Object|String} choice
 * @param {Number} index
 * @return {Object}
 */
export function normalizeChoice(choice, index) {
	if (typeof choice === 'string') {
		return {
			name: choice,
			value: choice,
			index
		};
	}

	return {
		...choice,
		index
	};
}

/**
 * Derives the final properties of a prompt list choice.
 *
 * @method resolveChoice
 * @param {Object} choice
 * @param {Array<String|Number>} checkedList
 * @param {Object} answers
 * @return {Promise<Object>}
 */
export async function resolveChoice(choice, checkedList, answers) {
	const { index } = choice;
	const name = choice.name || choice.value;
	const value = choice.value != null ? choice.value : choice.name;

	return {
		...choice,

		name,
		value,
		short: choice.short || name || value,
		checked: checkedList.includes(index) || checkedList.includes(value),
		disabled: await runAsync(choice.disabled, answers)
	};
}

/**
 * Derives the final properties of a propmt object.
 *
 * @method resolvePrompt
 * @param {Object} prompt
 * @param {Object} answers
 * @return {Promise<Object>}
 */
export async function resolvePrompt(prompt, answers) {
	const answer = answers[prompt.name];
	const defaultValue = await runAsync(prompt.default, answers);
	const checkedList = [].concat(answer || defaultValue);

	const choices = await runAsync(prompt.choices, answers);
	const resolvedChoices = choices && await Promise.all(
		choices
			.map(normalizeChoice)
			.map(choice => resolveChoice(
				choice,
				checkedList,
				answers
			))
	);

	return {
		...prompt,

		answer,
		default: defaultValue,
		choices: resolvedChoices,
		message: await runAsync(prompt.message, answers)
	};
}

/**
 * Derives a list of propmts suitable for displaying to the user.
 *
 * @method resolvePrompts
 * @param {Array<Object>} prompts
 * @param {Object} answers
 * @param {Number} limit
 * @return {Promise<Object>}
 */
export async function resolvePrompts(prompts, answers, limit) {
	const resolvedPrompts = [];
	const { length } = prompts;
	const isLimited = limit != null;

	let i = 0;
	let j = 0;

	for (; i < length; i++) {
		const prompt = prompts[i];
		const isRunnable = await runAsync(prompt.when, answers);

		if (isRunnable === false) {
			continue;
		}

		if (isLimited && ++j > limit) {
			break;
		}

		resolvedPrompts.push(resolvePrompt(prompt, answers));
	}

	return Promise.all(resolvedPrompts);
}
