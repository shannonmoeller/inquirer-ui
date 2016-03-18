/**
 * # Inquirer Input Template
 */

import {html} from '../../../scripts/util/template';
import renderLegend from './legend.html';

export default data => html`
	<inquirer-input>
		<fieldset>
			${renderLegend(data)}
			<label>
				<input type="text"
					name="${data.name}"
					value="${data.answer}"
					placeholder="${data.default}" />
			</label>
		</fieldset>
	</inquirer-input>
`;
