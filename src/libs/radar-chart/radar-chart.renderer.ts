import { D3Selection } from '../../models/types/d3-selection';
import { RadarChartConfig } from './radar-chart.config';
import { RadarChartModel } from './radar-chart.model';
import { RingsRenderer } from '../rings/rings.renderer';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Size } from '../../models/size';
import { select, zoom } from 'd3';
import { DividersRenderer } from '../dividers/dividers.renderer';
import { D3ZoomEvent } from '../../models/types/d3-zoom-event';
import { DotsRenderer } from '../dots/dots.renderer';
import { D3ZoomBehavior } from '../../models/types/d3-zoom-behavior';

export class RadarChartRenderer {
	private container: D3Selection;

	private ringsContainer: D3Selection;
	private dividersContainer: D3Selection;
	private dotsContainer: D3Selection;

	constructor(
		private svgElement: SVGElement,
		private model: RadarChartModel,
		private config$: BehaviorSubject<RadarChartConfig>,
		private size$: BehaviorSubject<Size>
	) {
		this.initContainers();
	}

	private get config(): RadarChartConfig {
		return this.config$.getValue();
	}

	private get size(): Size {
		return this.size$.getValue();
	}

	public start(): void {
		const ringsRenderer: RingsRenderer = new RingsRenderer(this.ringsContainer, this.model, this.config$);

		const dividersRenderer: DividersRenderer = new DividersRenderer(this.dividersContainer, this.model, this.config$);

		const dotsRenderer: DotsRenderer = new DotsRenderer(this.dotsContainer, this.model, this.config$);

		this.initBehavior();
	}

	private initBehavior(): void {
		combineLatest([this.config$, this.size$]).subscribe(() => {
			this.render();
		});
	}

	private initZoomBehavior(zoomContainer: D3Selection): void {
		const zoomBehavior: D3ZoomBehavior = zoom().on('zoom', function (event: D3ZoomEvent): void {
			zoomContainer.attr('transform', event.transform.toString());
		});

		const initialScale: number = this.calculateInitialScale();
		const initialTransformX: number = this.config.offsetLeft + this.config.marginLeftRight;
		const initialTransformY: number = this.config.marginTopBottom;
		zoomBehavior.scaleBy(this.container, initialScale, [0, 0]);
		zoomBehavior.translateBy(this.container, initialTransformX, initialTransformY);

		this.container.call(zoomBehavior);
	}

	private calculateInitialScale(): number {
		return this.size.height / this.model.rangeY$.getValue();
	}

	private initContainers(): void {
		this.container = select(this.svgElement);

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
	}
}
