import { RadarChart } from './radar-chart';

describe('RadarChart', () => {
	let instance: RadarChart;

	beforeEach(() => {
		instance = new RadarChart();
	});

	it('should create instance', () => {
		expect(instance).toBeTruthy();
	});
});
