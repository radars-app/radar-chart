import { select } from 'd3';
import { BehaviorSubject } from 'rxjs';
import { RadarChartConfig } from './libs/radar-chart/radar-chart.config';
import { RadarChartModel } from './libs/radar-chart/radar-chart.model';
import { RadarChartRenderer } from './libs/radar-chart/radar-chart.renderer';
import { Size } from './models/size';

const model: RadarChartModel = new RadarChartModel();
model.ringNames$.next(['Hold', 'Assess', 'Trial', 'Adopt'].reverse());
model.sectorNames$.next([
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

const primaryColor: string = '#5E6670';
const secondaryColor: string = '#2D3443';
darkConfig.backgroundColor = secondaryColor;
darkConfig.ringsConfig.ringsColor = primaryColor;
darkConfig.ringsConfig.labelsConfig.textColor = primaryColor;
darkConfig.dividersConfig.dividerColor = primaryColor;

const config$: BehaviorSubject<RadarChartConfig> = new BehaviorSubject<RadarChartConfig>(lightConfig);

const size$: BehaviorSubject<Size> = new BehaviorSubject({
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

function* getRingNames(): Generator {
	while (true) {
		yield ['Deployment', 'Implementation'];
		yield ['Deploy', 'Demo', 'Build', 'Develop'];
		yield ['Deploy', 'Demo', 'Build', 'Develop', 'DevOps', 'Render'];
	}
}
const ringNamesGenerator: Generator = getRingNames();
select('button.change-ringNames')
	.on('click', () => {
		model.ringNames$.next(ringNamesGenerator.next().value);
	});

function* getSectorNames(): Generator {
	while (true) {
		yield [	'Technologies', 'Startups', 'Libraries' ];
		yield [	'Technologies', 'Startups' ];
		yield [	'Technologies', 'Startups', 'Libraries', 'Devices', 'Languages-And-Frameworks', 'Tools', 'Platforms', 'Techniques' ];
		yield [	'Technologies', 'Startups', 'Libraries', 'Devices', 'Languages-And-Frameworks', 'Tools', ];
		yield [	'Technologies', 'Startups', 'Libraries', 'Devices', 'Languages-And-Frameworks' ];
	}
}
const sectorNamesGenerator: Generator = getSectorNames();
select('button.change-sectorNames')
	.on('click', () => {
		model.sectorNames$.next(sectorNamesGenerator.next().value);
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
