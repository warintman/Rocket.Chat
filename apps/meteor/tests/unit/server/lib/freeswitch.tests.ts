import { describe } from 'mocha';

// Those tests still need a proper freeswitch environment configured in order to run
// So for now they are being deliberately skipped on CI
describe.skip('VoIP', () => {
	describe('FreeSwitch', () => {
		return true;
	});
});
