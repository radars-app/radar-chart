import { D3Selection } from '../../models/types/d3-selection';
import { RadarChartConfig } from './radar-chart.config';
import { RadarChartModel } from './radar-chart.model';
import { RingsRenderer } from '../rings/rings.renderer';
import { BehaviorSubject } from 'rxjs';
import { Size } from '../../models/size';
import { select, zoom, ZoomBehavior } from 'd3';
import { DividersRenderer } from '../dividers/dividers.renderer';
import { D3ZoomEvent } from '../../models/types/d3-zoom-event';
import { SubscriptionPool } from '../helpers/subscription-pool';
import { DotsRenderer } from '../dots/dots.renderer';
import { calculateOuterRingRadius } from '../helpers/calculate-outer-ring-radius';

export class RadarChartRenderer {
	private subscriptions: SubscriptionPool;

	private container: D3Selection;

	private ringsRenderer: RingsRenderer;
	private ringsContainer: D3Selection;

	private dividersRenderer: DividersRenderer;
	private dividersContainer: D3Selection;

	private dotsRenderer: DotsRenderer;
	private dotsContainer: D3Selection;

	constructor(
		private svgElement: SVGElement,
		private model: RadarChartModel,
		private config$: BehaviorSubject<RadarChartConfig>,
		private size$: BehaviorSubject<Size>
	) {
		this.initContainers();
		this.initSizing();
		this.initRange();
	}

	private get config(): RadarChartConfig {
		return this.config$.getValue();
	}

	private get size(): Size {
		return this.size$.getValue();
	}

	public start(): void {
		this.ringsRenderer = new RingsRenderer(this.ringsContainer, this.model, this.config$);

		this.dividersRenderer = new DividersRenderer(this.dividersContainer, this.model, this.config$);

		this.dotsRenderer = new DotsRenderer(this.dotsContainer, this.model, this.config$);

		this.subscribeConfig();
	}

	private subscribeConfig(): void {
		this.config$.subscribe((config: RadarChartConfig) => {
			this.render();
		});
	}

	private initSizing(): void {
		this.size$.subscribe((size: Size) => {
			this.render();
		});
	}

	private initZoom(zoomContainer: D3Selection): void {
		const zoomBehavior: any = zoom().on('zoom', function (event: D3ZoomEvent): void {
			zoomContainer.attr('transform', event.transform.toString());
		});

		this.container.call(zoomBehavior);

		zoomBehavior.scaleTo(this.container, 1);
	}

	private initRange(): void {
		this.model.rangeX$.next(1366); // TODO move range into the config
		this.model.rangeY$.next(662);
	}

	private calculateInitialScale(): number {
		// TODO: refactor this after rewriting into
		const outerRingRadius: number = calculateOuterRingRadius(
			this.model.rangeX$.getValue(),
			this.model.rangeY$.getValue(),
			this.config$.getValue()
		);

		return this.model.rangeY$.getValue() / outerRingRadius;
	}

	private initContainers(): void {
		this.container = select(this.svgElement);

		const zoomContainer: D3Selection = this.container.append('g').attr('class', 'radar-chart__zoom-container');

		this.initZoom(zoomContainer);

		this.ringsContainer = zoomContainer.append('g').attr('class', 'radar-chart__rings');

		this.dividersContainer = zoomContainer.append('g').attr('class', 'radar-chart__dividers');

		this.dotsContainer = zoomContainer.append('g').attr('class', 'radar-chart__dots');
	}

	private render(): void {
		this.container.style('background', this.config.backgroundColor).attr('width', this.size.width).attr('height', this.size.height);

		this.ringsContainer.attr(
			'transform',
			`translate(${this.config.offsetLeft + this.config.marginLeftRight}, ${this.config.marginTopBottom})`
		);

		this.dividersContainer.attr(
			'transform',
			`translate(${this.config.offsetLeft + this.config.marginLeftRight}, ${this.config.marginTopBottom})`
		);

		this.dotsContainer.attr(
			'transform',
			`translate(${this.config.offsetLeft + this.config.marginLeftRight}, ${this.config.marginTopBottom})`
		);
	}
}
