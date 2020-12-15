import { D3Selection } from '../../models/types/d3-selection';
import { RadarChartConfig } from './radar-chart.config';
import { RadarChartModel } from './radar-chart.model';
import { RingsRenderer } from '../rings/rings.renderer';
import { BehaviorSubject, combineLatest, merge } from 'rxjs';
import { Size } from '../../models/size';
import { select, zoom, ZoomBehavior } from 'd3';
import { DividersRenderer } from '../dividers/dividers.renderer';
import { D3ZoomEvent } from '../../models/types/d3-zoom-event';
import { DotsRenderer } from '../dots/dots.renderer';
import { D3ZoomBehavior } from '../../models/types/d3-zoom-behavior';

export class RadarChartRenderer {
	private container: D3Selection;

	private ringsRenderer: RingsRenderer;
	private ringsContainer: D3Selection;

	private dividersRenderer: DividersRenderer;
	private dividersContainer: D3Selection;

	private dotsRenderer: DotsRenderer;
	private dotsContainer: D3Selection;

	private zoomContainer: D3Selection;

	private scale: number;

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
		this.ringsRenderer = new RingsRenderer(this.ringsContainer, this.model, this.config$);

		this.dividersRenderer = new DividersRenderer(this.dividersContainer, this.model, this.config$);

		this.dotsRenderer = new DotsRenderer(this.dotsContainer, this.model, this.config$);

		this.initBehavior();
	}

	private initBehavior(): void {
		this.initZoomBehavior();

		combineLatest([this.config$, this.size$]).subscribe(() => {
			this.render();
		});
	}

	private initZoomBehavior(): void {
		const self: RadarChartRenderer = this;
		const zoomBehavior: D3ZoomBehavior = zoom().on('zoom', function (event: D3ZoomEvent): void {
			self.zoomContainer.attr('transform', event.transform.toString());
			self.scale = event.transform.k;
			self.model.zoomEmitted$.next(true);
		});

		this.scale = this.calculateInitialScale();
		const initialTransformX: number = this.config.offsetLeft + this.config.marginLeftRight;
		const initialTransformY: number = this.config.marginTopBottom;
		zoomBehavior.scaleTo(this.container, this.scale, [0, 0]);
		zoomBehavior.translateBy(this.container, initialTransformX, initialTransformY);

		const scalePointX: number = this.size.width / 2;
		const scalePointY: number = this.size.height / 2;

		this.model.zoomIn$.subscribe(() => {
			this.scale = 2 * this.scale;
			this.rescaleRadarTo(this.container, zoomBehavior, [scalePointX, scalePointY]);
		});

		this.model.zoomOut$.subscribe(() => {
			this.scale = this.scale / 2;
			this.rescaleRadarTo(this.container, zoomBehavior, [scalePointX, scalePointY]);
		});

		this.container.call(zoomBehavior);
	}

	private rescaleRadarTo(container: D3Selection, zoomBehavior: D3ZoomBehavior, [scalePointX, scalePointY]: [number, number]): void {
		container.transition().duration(300).call(zoomBehavior.scaleTo, this.scale, [scalePointX, scalePointY]);
	}

	private calculateInitialScale(): number {
		return this.size.height / this.model.rangeY$.getValue();
	}

	private initContainers(): void {
		this.container = select(this.svgElement);

		this.zoomContainer = this.container.append('g').attr('class', 'radar-chart__zoom-container');

		this.ringsContainer = this.zoomContainer.append('g').attr('class', 'radar-chart__rings');

		this.dividersContainer = this.zoomContainer.append('g').attr('class', 'radar-chart__dividers');

		this.dotsContainer = this.zoomContainer.append('g').attr('class', 'radar-chart__dots');
	}

	private render(): void {
		select(this.svgElement)
			.style('background', this.config.backgroundColor)
			.attr('width', this.size.width)
			.attr('height', this.size.height);
	}
}
