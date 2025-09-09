import { Apps } from '@rocket.chat/apps';

import { addMigration } from '../../lib/migrations';

addMigration({
	version: 294,
	async up() {
		if (!Apps.self) {
			throw new Error('Apps Orchestrator not registered.');
		}

		Apps.initialize();
	},
});
