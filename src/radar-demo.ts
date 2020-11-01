import { select } from 'd3';
import { BehaviorSubject } from 'rxjs';
import { RadarChartConfig } from './libs/radar-chart/radar-chart.config';
import { RadarChartModel } from './libs/radar-chart/radar-chart.model';
import { RadarChartRenderer } from './libs/radar-chart/radar-chart.renderer';
import { Dimension } from './models/dimension';

const model: RadarChartModel = new RadarChartModel();
model.rings.ringNames.next(['Hold', 'Assess', 'Trial', 'Adopt'].reverse());
model.rings.sectors.sectorNames.next([
	'Technologies',
	'Startups',
	'Libraries',
	'Devices',
	'Languages-And-Frameworks',
	'Tools',
	'Platforms',
	'Techniques'
]);

const size$: BehaviorSubject<Dimension> = new BehaviorSubject({
	width: document.body.clientWidth,
	height: window.innerHeight
});

const config$: BehaviorSubject<RadarChartConfig> = new BehaviorSubject<RadarChartConfig>(new RadarChartConfig);

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
		config$,
		size$
	);
	renderer.start();
}

select('button.change-ringNames')
	.on('click', () => {
		model.rings.ringNames.next(['Build', 'Trials']);
	});

select('button.change-sectorNames')
	.on('click', () => {
		model.rings.sectors.sectorNames.next(['Tech', 'Mech', 'Heh']);
	});
