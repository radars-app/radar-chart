import { D3Selection } from '../../models/types/d3-selection';
import { RadarChartConfig } from './radar-chart.config';
import { RadarChartModel } from './radar-chart.model';
import { RingsRenderer } from '../rings/rings.renderer';
import { BehaviorSubject } from 'rxjs';
import { Dimension } from '../../models/dimension';
import { scaleLinear, ScaleLinear, select } from 'd3';
import { zoom } from 'd3-zoom';
import { DividersRenderer } from '../dividers/dividers.renderer';

export class RadarChartRenderer {

	private sizeX: ScaleLinear<number, number>;
	private ringsRange$: BehaviorSubject<Dimension> = new BehaviorSubject(null);

	private ringsRenderer: RingsRenderer;
	private ringsContainer: D3Selection;

	private dividersRenderer: DividersRenderer;
	private dividersContainer: D3Selection;

	constructor(
		private svg: D3Selection,
		private model: RadarChartModel,
		private config$: BehaviorSubject<RadarChartConfig>,
		private size$: BehaviorSubject<Dimension>
	) {
		this.initContainers();
		this.initSizing();
		this.initZoom();
	}

	private get config(): RadarChartConfig {
		return this.config$.getValue();
	}

	public start(): void {
		this.ringsRenderer = new RingsRenderer(
			this.ringsContainer,
			this.model.rings,
			new BehaviorSubject(this.config.ringsConfig),
			this.ringsRange$
		);

		this.dividersRenderer = new DividersRenderer(
			this.dividersContainer,
			this.model,
			new BehaviorSubject(this.config),
			this.ringsRange$
		);

		this.subscribeConfig();
	}

	private subscribeConfig(): void {
		this.config$.subscribe((config: RadarChartConfig) => {
			this.ringsRenderer.config$.next(config.ringsConfig);
			this.dividersRenderer.config$.next(config);
			this.render();
		});
	}

	private initSizing(): void {
		this.size$.subscribe((size: Dimension) => {
			this.calculateRange(size);
			this.render();
		});
	}

	private initZoom(): void {
		this.svg.call(zoom().on('zoom', function (event: any): void {
			select('svg.radar-chart > g.radar-chart__zoom-container').attr('transform', event.transform);
		}));
	}

	private calculateRange(size: Dimension): void {
		this.sizeX = scaleLinear()
			.domain([0, this.config.containerDomainX])
			.range([0, size.width]);

		this.ringsRange$.next({
			width: size.width - this.sizeX(this.config.transformX) - this.config.offsetX * 2,
			height: size.height - this.config.offsetY * 2
		});
	}

	private initContainers(): void {
		this.svg.append('g')
			.attr('class', 'radar-chart__zoom-container');

		this.ringsContainer = this.svg.select('g').append('g')
			.attr('class', 'radar-chart__rings');

		this.dividersContainer = this.svg.select('g').append('g')
			.attr('class', 'radar-chart__dividers');
	}

	private render(): void {
		const size: Dimension = this.size$.getValue();
		this.svg
			.style('background', this.config.backgroundColor)
			.attr('width', size.width)
			.attr('height', size.height);

		this.ringsContainer
			.attr('transform', `translate(${this.sizeX(this.config.transformX)  + this.config.offsetX}, ${this.config.offsetY})`);

		this.dividersContainer
			.attr('transform', `translate(${this.sizeX(this.config.transformX)  + this.config.offsetX}, ${this.config.offsetY})`);
	}
}
