/**
 * # Inquirer Input Template
 */

import { html } from '../../../scripts/util/template';
import renderLegend from './legend.html';

export default prompt => html`
	<inquirer-input>
		<fieldset ${prompt.disabled && 'disabled'}>
			${renderLegend(prompt)}
			<label>
				<input type="text"
					name="${prompt.name}"
					value="${prompt.answer}"
					placeholder="${prompt.default}"
					${prompt.disabled && 'disabled'} />
			</label>
		</fieldset>
	</inquirer-input>
`;
