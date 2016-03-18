/**
 * # Inquirer Radio-List Template
 */

import {html} from '../../../scripts/util/template';
import renderLegend from './legend.html';
import renderMeta from './meta.html';

export default data => html`
	<inquirer-list>
		<fieldset>
			${renderLegend(data)}
			${data.choices.map(choice => html`
				<label>
					<input type="radio"
						name="${data.name}"
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
