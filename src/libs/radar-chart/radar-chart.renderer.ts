import { D3Selection } from '../../models/types/d3-selection';
import { RadarChartConfig } from './radar-chart.config';
import { RadarChartModel } from './radar-chart.model';
import { RingsRenderer } from '../rings/rings.renderer';
import { BehaviorSubject } from 'rxjs';
import { Dimension } from '../../models/dimension';
import { Scaler } from '../helpers/scaler';

export class RadarChartRenderer {

	private scaler: Scaler;

	private ringsRenderer: RingsRenderer;
	private ringsContainer: D3Selection;

	constructor(
		private container: D3Selection,
		private model: RadarChartModel,
		private config$: BehaviorSubject<RadarChartConfig>,
		private size$: BehaviorSubject<Dimension>
	) {
		this.initContainers();
		this.initScaling();
	}

	private get config(): RadarChartConfig {
		return this.config$.getValue();
	}

	public start(): void {
		this.config$.subscribe(() => {
			this.ringsRenderer = new RingsRenderer(
				this.ringsContainer,
				this.model.rings,
				this.config.ringsConfig,
				this.scaler
			);
		});
	}

	private initScaling(): void {
		this.scaler = new Scaler(this.size$);
		this.scaler.containerUpdaters.push(this.update.bind(this));
		this.scaler.startContainerResizer();
	}

	private initContainers(): void {
		this.container
			.style('background', this.config.backgroundColor);
		this.ringsContainer = this.container.append('g')
			.attr('class', 'radar-chart__rings');
	}

	private update(): void {
		const size: Dimension = this.size$.getValue();
		this.container
			.attr('width', size.width)
			.attr('height', () => this.scaler.containerX(this.config.minHeight));

		this.ringsContainer
			.attr('transform', `translate(${this.scaler.containerX(this.config.transformX)}, ${this.scaler.containerX(this.config.transformY)})`);
	}
}
