/**
 * # Inquirer Radio-List Template
 */

import { html } from '../../../scripts/util/template';
import renderLegend from './legend.html';
import renderMeta from './meta.html';

export default prompt => html`
	<inquirer-list>
		<fieldset ${prompt.disabled && 'disabled'}>
			${renderLegend(prompt)}
			${prompt.choices.map(choice => html`
				<label>
					<input type="radio"
						name="${prompt.name}"
						value="${choice.value}"
						${choice.checked && 'checked'}
						${choice.disabled && 'disabled'} />
					${choice.name}
					${renderMeta(choice)}
				</label>
			`)}
		</fieldset>
	</inquirer-list>
`;
