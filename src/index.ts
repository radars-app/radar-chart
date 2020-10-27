import './index.scss';

export { RadarChartModel as RadarChart } from './libs/radar-chart/radar-chart.model';

if (process.env.NODE_ENV !== 'production') {
	import ('./radar-demo')
	.then((m: typeof import('./radar-demo')) => {
		m.startRootCircleDemo();
	});
}
