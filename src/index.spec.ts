import { Main } from './';

describe('Main', () => {
	let instance: Main;

	beforeEach(() => {
		instance = new Main();
	});

	it('should create instance', () => {
		expect(instance).toBeTruthy();
	});
});
