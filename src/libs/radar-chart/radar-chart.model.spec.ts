import { RadarChartModel } from './radar-chart.model';

describe('RadarChartModel', () => {
	let instance: RadarChartModel;

	beforeEach(() => {
		instance = new RadarChartModel();
	});

	it('should create instance', () => {
		expect(instance).toBeTruthy();
	});
});
