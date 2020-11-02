import { D3Selection } from '../../models/types/d3-selection';
import { RadarChartConfig } from './radar-chart.config';
import { RadarChartModel } from './radar-chart.model';
import { RingsRenderer } from '../rings/rings.renderer';
import { BehaviorSubject } from 'rxjs';
import { Dimension } from '../../models/dimension';
import { scaleLinear, ScaleLinear } from 'd3';

export class RadarChartRenderer {

	private sizeX: ScaleLinear<number, number>;
	private ringsRange$: BehaviorSubject<Dimension> = new BehaviorSubject(null);

	private ringsRenderer: RingsRenderer;
	private ringsContainer: D3Selection;

	constructor(
		private container: D3Selection,
		private model: RadarChartModel,
		private config$: BehaviorSubject<RadarChartConfig>,
		private size$: BehaviorSubject<Dimension>
	) {
		this.initContainers();
		this.initSizing();
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

		this.subscribeConfig();
	}

	private subscribeConfig(): void {
		this.config$.subscribe((config: RadarChartConfig) => {
			this.ringsRenderer.config$.next(config.ringsConfig);
			this.render();
		});
	}

	private initSizing(): void {
		this.size$.subscribe((size: Dimension) => {
			this.calculateRange(size);
			this.render();
		});
	}

	private calculateRange(size: Dimension): void {
		this.sizeX = scaleLinear()
			.domain([0, this.config.containerDomainX])
			.range([0, size.width]);
		this.ringsRange$.next({
			width: size.width - this.sizeX(this.config.transformX),
			height: size.height - this.sizeX(this.config.offsetY * 2)
		});
	}

	private initContainers(): void {
		this.ringsContainer = this.container.append('g')
			.attr('class', 'radar-chart__rings');
	}

	private render(): void {
		const size: Dimension = this.size$.getValue();
		this.container
			.style('background', this.config.backgroundColor)
			.attr('width', size.width)
			.attr('height', size.height);

		this.ringsContainer
			.attr('transform', `translate(${this.sizeX(this.config.transformX)}, ${this.config.offsetY})`);
	}
}
