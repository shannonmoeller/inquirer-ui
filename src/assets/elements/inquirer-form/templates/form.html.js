/**
 * # Inquirer Form Template
 */

import { html } from '../../../scripts/util/template';
import renderInput from './input.html';
import renderListCheckbox from './checkbox.html';
import renderListRadio from './radio.html';

const typeTemplates = {
	checkbox: renderListCheckbox,
	confirm: renderInput,
	download: renderInput,
	expand: renderListRadio,
	input: renderInput,
	list: renderListRadio,
	password: renderInput,
	rawlist: renderListRadio
};

export default data => html`
	${data.prompts && data.prompts.map((prompt, i, prompts) =>
		typeTemplates[prompt.type](prompt, i, prompts)
	)}

	${data.hasNext && html`
		<button inquirer-next>
			Next
			<small>(or press <kbd>enter</kbd>)</small>
		</button>
	`}

	${data.hasPrevious && html`
		<button inquirer-prev>Previous</button>
	`}
`;
