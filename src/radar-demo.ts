import { select } from 'd3';
import { BehaviorSubject } from 'rxjs';
import { RadarChartConfig } from './libs/radar-chart/radar-chart.config';
import { RadarChartModel } from './libs/radar-chart/radar-chart.model';
import { RadarChartRenderer } from './libs/radar-chart/radar-chart.renderer';
import { Dimension } from './models/dimension';

const model: RadarChartModel = new RadarChartModel();
model.rings.ringNames.next(['Adopt', 'Trial', 'Assess', 'Hold']);
const size$: BehaviorSubject<Dimension> = new BehaviorSubject({
	width: document.body.clientWidth,
	height: window.innerHeight
});

window.onresize = ($event: Event) => {
	size$.next({
		width: document.body.clientWidth,
		height: window.innerHeight
	});
};

export function startDemo(): void {

	const renderer: RadarChartRenderer = new RadarChartRenderer(
		select('svg.radar-chart'),
		model,
		new RadarChartConfig(),
		size$
	);
	renderer.start();
}
