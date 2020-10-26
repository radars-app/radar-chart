import { RadarChartModel } from './radar-chart-model';

describe('RadarChart', () => {
	let instance: RadarChartModel;

	beforeEach(() => {
		instance = new RadarChartModel();
	});

	it('should create instance', () => {
		expect(instance).toBeTruthy();
	});
});
