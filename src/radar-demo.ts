import { select } from 'd3';
import { BehaviorSubject, config } from 'rxjs';
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

const lightConfig: RadarChartConfig = new RadarChartConfig();
const darkConfig: RadarChartConfig = new RadarChartConfig();
darkConfig.backgroundColor = '#2D3443';
darkConfig.ringsConfig.sectorsConfig.textColor = '#5E6670';
darkConfig.ringsConfig.sectorsConfig.dividerColor = '#5E6670';

const config$: BehaviorSubject<RadarChartConfig> = new BehaviorSubject<RadarChartConfig>(lightConfig);

const size$: BehaviorSubject<Dimension> = new BehaviorSubject({
	width: document.body.clientWidth - 17,
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

enum Theme {
	Light = 'light-theme',
	Dark = 'dark-theme'
}

select('select.change-theme')
	.on('change', ($event: Event) => {
		const selectElement: HTMLSelectElement = $event.target as HTMLSelectElement;
		switch (selectElement.value) {
			case Theme.Light:
				config$.next(lightConfig);
			break;
			case Theme.Dark:
				config$.next(darkConfig);
			break;
		}
	});
