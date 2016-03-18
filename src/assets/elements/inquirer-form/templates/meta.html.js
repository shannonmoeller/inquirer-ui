/**
 * # Inquirer Metadata Template
 */

import {html} from '../../../scripts/util/template';

export default data => html`
	${null && data.meta && html`
		<small>
			<ul>
				${data.meta.map(item => html`
					<li>${item}</li>
				`)}
			</ul>
		</small>
	`}
`;
