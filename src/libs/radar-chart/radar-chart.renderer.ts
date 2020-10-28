import { D3Selection } from '../../models/d3-selection';
import { RadarChartConfig } from './radar-chart.config';
import { RadarChartModel } from './radar-chart.model';
import { RingsRenderer } from '../rings/rings.renderer';
import { BehaviorSubject } from 'rxjs';
import { Dimension } from '../../models/dimension';
import { ScaleLinear, scaleLinear } from 'd3';

export class RadarChartRenderer {

	private scaleX: ScaleLinear<number, number>;
	private scaleY: ScaleLinear<number, number>;

	private ringsRenderer: RingsRenderer;
	private ringsContainer: D3Selection;

	constructor(
		private container: D3Selection,
		private model: RadarChartModel,
		private config: RadarChartConfig,
		private size$: BehaviorSubject<Dimension>
	) {
		this.initContainers();
		this.initScaling();
	}

	public start(): void {
		this.ringsRenderer = new RingsRenderer(
			this.ringsContainer,
			this.model.rings,
			this.config.ringsConfig,
			this.size$
		);
	}

	private initScaling(): void {
		this.size$.subscribe((size: Dimension) => {
			this.scaleX = scaleLinear()
				.domain([0, this.config.domainX])
				.range([0, size.width]);

			this.scaleY = scaleLinear()
				.domain([0, this.config.domainY])
				.range([0, size.height]);

			this.update();
		});
	}

	private initContainers(): void {
		this.container
			.style('background', this.config.backgroundColor);
		this.ringsContainer = this.container.append('rect')
			.attr('class', 'radar-chart__root-circle');
	}

	private update(): void {
		const size: Dimension = this.size$.getValue();
		this.container
			.attr('width', size.width)
			.attr('height', () => size.height <= this.config.minHeight ? this.config.minHeight : size.height);

		this.ringsContainer
			.attr('transform', `translate(${this.scaleX(this.config.transformX)}, ${this.scaleY(this.config.transformY)})`)
			.attr('width', this.scaleX(this.config.ringsContainerSize))
			.attr('height', this.scaleX(this.config.ringsContainerSize));
	}
}
