import { describe, beforeEach, after } from 'mocha';
import sinon from 'sinon';

const workOnPdfStub = sinon.stub();
const queueWorkStub = sinon.stub();

describe('requestPdfTranscript', () => {
	const currentTestModeValue = process.env.TEST_MODE;

	beforeEach(() => {
		workOnPdfStub.reset();
		queueWorkStub.reset();
	});

	after(() => {
		process.env.TEST_MODE = currentTestModeValue;
	});
});
