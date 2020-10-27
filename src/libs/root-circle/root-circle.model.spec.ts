import { RootCircleModel } from './root-circle.model';

describe('RootCircleModel', () => {
	let instance: RootCircleModel;

	beforeEach(() => {
		instance = new RootCircleModel();
	});

	it('should create instance', () => {
		expect(instance).toBeTruthy();
	});
});
