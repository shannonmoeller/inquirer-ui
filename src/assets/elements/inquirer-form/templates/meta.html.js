/**
 * # Inquirer Metadata Template
 */

import { html } from '../../../scripts/util/template';

export default data => html`
	${data.meta && html`
		<small>
			<ul>
				${Object.keys(data.meta).map(key => html`
					<li>${data.meta[key] === true ? 'Requires build step.' : data.meta[key]}</li>
				`)}
			</ul>
		</small>
	`}
`;
