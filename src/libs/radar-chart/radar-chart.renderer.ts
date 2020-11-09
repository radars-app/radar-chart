import { D3Selection } from '../../models/types/d3-selection';
import { RadarChartConfig } from './radar-chart.config';
import { RadarChartModel } from './radar-chart.model';
import { RingsRenderer } from '../rings/rings.renderer';
import { BehaviorSubject } from 'rxjs';
import { Size } from '../../models/size';
import { zoom } from 'd3';
import { DividersRenderer } from '../dividers/dividers.renderer';
import { D3ZoomEvent } from '../../models/types/d3-zoom-event';
import { SubscriptionPool } from '../helpers/subscription-pool';

export class RadarChartRenderer {

	private subscriptions: SubscriptionPool;

	private ringsRenderer: RingsRenderer;
	private ringsContainer: D3Selection;

	private dividersRenderer: DividersRenderer;
	private dividersContainer: D3Selection;

	constructor(
		private svg: D3Selection,
		private model: RadarChartModel,
		private config$: BehaviorSubject<RadarChartConfig>,
		private size$: BehaviorSubject<Size>
	) {
		this.initContainers(this.svg);
		this.initSizing();
	}

	private get config(): RadarChartConfig {
		return this.config$.getValue();
	}

	private get size(): Size {
		return this.size$.getValue();
	}

	public start(): void {
		this.ringsRenderer = new RingsRenderer(
			this.ringsContainer,
			this.model,
			new BehaviorSubject(this.config)
		);

		this.dividersRenderer = new DividersRenderer(
			this.dividersContainer,
			this.model,
			new BehaviorSubject(this.config)
		);

		this.subscribeConfig();
	}

	private subscribeConfig(): void {
		this.config$.subscribe((config: RadarChartConfig) => {
			this.ringsRenderer.config$.next(config);
			this.dividersRenderer.config$.next(config);
			this.render();
		});
	}

	private initSizing(): void {
		this.size$.subscribe((size: Size) => {
			this.setRange(size);
			this.render();
		});
	}

	private initZoom(container: D3Selection): void {
		this.svg.call(zoom().on('zoom', function (event: D3ZoomEvent): void {
			container.attr('transform', event.transform.toString());
		}));
	}

	private setRange(size: Size): void {
		this.model.rangeX$.next(size.width);
		this.model.rangeY$.next(size.height);
	}

	private initContainers(container: D3Selection): void {
		const zoomContainer: D3Selection = container
			.append('g')
			.attr('class', 'radar-chart__zoom-container');

		this.initZoom(zoomContainer);

		this.ringsContainer = this.svg.select('g.radar-chart__zoom-container')
			.append('g')
			.attr('class', 'radar-chart__rings');

		this.dividersContainer = this.svg.select('g.radar-chart__zoom-container')
			.append('g')
			.attr('class', 'radar-chart__dividers');
	}

	private render(): void {
		this.svg
			.style('background', this.config.backgroundColor)
			.attr('width', this.size.width)
			.attr('height', this.size.height);

		this.ringsContainer
			.attr('transform', `translate(${this.config.offsetLeftRight}, ${this.config.offsetTopBottom})`);

		this.dividersContainer
			.attr('transform', `translate(${this.config.offsetLeftRight}, ${this.config.offsetTopBottom})`);
	}
}
