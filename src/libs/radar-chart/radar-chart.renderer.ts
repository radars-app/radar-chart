import { D3Selection } from '../../models/types/d3-selection';
import { RadarChartConfig } from './radar-chart.config';
import { RadarChartModel } from './radar-chart.model';
import { RingsRenderer } from '../rings/rings.renderer';
import { BehaviorSubject } from 'rxjs';
import { Size } from '../../models/size';
import { select, zoom } from 'd3';
import { DividersRenderer } from '../dividers/dividers.renderer';
import { D3ZoomEvent } from '../../models/types/d3-zoom-event';
import { DotsRenderer } from '../dots/dots.renderer';
import { D3ZoomBehavior } from '../../models/types/d3-zoom-behavior';

export class RadarChartRenderer {
	private container: D3Selection;
	private scale: number;

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

	private initZoomBehavior(zoomContainer: D3Selection): void {
		const zoomBehavior: D3ZoomBehavior = zoom().on('zoom', function (event: D3ZoomEvent): void {
			zoomContainer.attr('transform', event.transform.toString());
		});

		this.container.call(zoomBehavior);

		this.scale = this.calculateInitialScale();
		zoomBehavior.scaleBy(this.container, this.scale, [0, 0]);
	}

	private calculateInitialScale(): number {
		return this.size.height / this.model.rangeY$.getValue();
	}

	private initContainers(): void {
		this.container = select(this.svgElement).append('g').attr('class', 'radar-chart__container');

		const zoomContainer: D3Selection = this.container.append('g').attr('class', 'radar-chart__zoom-container');

		this.initZoomBehavior(zoomContainer);

		this.ringsContainer = zoomContainer.append('g').attr('class', 'radar-chart__rings');

		this.dividersContainer = zoomContainer.append('g').attr('class', 'radar-chart__dividers');

		this.dotsContainer = zoomContainer.append('g').attr('class', 'radar-chart__dots');
	}

	private render(): void {
		select(this.svgElement)
			.style('background', this.config.backgroundColor)
			.attr('width', this.size.width)
			.attr('height', this.size.height);

		this.container.attr(
			'transform',
			`translate(${this.config.offsetLeft + this.config.marginLeftRight}, ${this.config.marginTopBottom})`
		);
	}
}
