export { RadarChartRenderer } from './libs/radar-chart/radar-chart.renderer';
export { RadarChartModel } from './libs/radar-chart/radar-chart.model';
export { RadarChartConfig } from './libs/radar-chart/radar-chart.config';

if (process.env.NODE_ENV !== 'production') {
	import ('./radar-demo')
	.then((m: typeof import('./radar-demo')) => {
		m.startDemo();
	});
}
