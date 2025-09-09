// import { License } from '@rocket.chat/license';

import { ContactImporter } from './ContactImporter';
import { Importers } from '../../importer/server';

Importers.add({
	key: 'omnichannel_contact',
	name: 'omnichannel_contacts_importer',
	importer: ContactImporter,
});
