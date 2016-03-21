/**
 * # Inquirer Form Helpers
 */

import { runAsync } from '../../scripts/util/function';

/**
 * @method normalizeChoice
 * @param {Object|String} choice
 * @return {Object}
 */
function normalizeChoice(choice) {
	if (typeof choice === 'string') {
		return {
			name: choice,
			value: choice
		};
	}

	return choice;
}

/**
 * @method resolveChoice
 * @param {Object|String} choice
 * @param {Number} index
 * @param {String|Number|Array<String|Number>} currentValue
 * @param {Object} answers
 * @return {Promise<Object>}
 */
export async function resolveChoice(choice, index, currentValue, answers) {
	const localChoice = normalizeChoice(choice);

	const name = localChoice.name || localChoice.value;
	const value = localChoice.value == null ? localChoice.value : localChoice.name;

	const checkedList = [].concat(currentValue);
	const disabled = await runAsync(localChoice.disabled, answers);

	return {
		...localChoice,

		name,
		value,
		short: localChoice.short || name || value,
		checked: checkedList.includes(index) || checkedList.includes(value),
		disabled
	};
}

/**
 * @method resolvePrompt
 * @param {Object} prompt
 * @param {Object} answers
 * @return {Promise<Object>}
 */
export async function resolvePrompt(prompt, answers) {
	const message = await runAsync(prompt.message, answers);
	const choices = await runAsync(prompt.choices, answers);

	const answer = answers[prompt.name];
	const defaultValue = await runAsync(prompt.default, answers);
	const currentValue = answer || defaultValue;

	const resolvedChoices = choices && await Promise.all(
		choices.map((choice, index) =>
			resolveChoice(choice, index, currentValue, answers)
		)
	);

	return {
		...prompt,

		message,
		answer,
		default: defaultValue,
		choices: resolvedChoices
	};
}

/**
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
