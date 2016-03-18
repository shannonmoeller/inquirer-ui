/**
 * # Inquirer Legend Template
 */

import {html} from '../../../scripts/util/template';
import renderMeta from './meta.html';

export default data => html`
	<legend>
		${data.message}
		${renderMeta(data)}
	</legend>
`;
