import { D3Selection } from '../../models/types/d3-selection';
import { RadarChartConfig } from './radar-chart.config';
import { RadarChartModel } from './radar-chart.model';
import { RingsRenderer } from '../rings/rings.renderer';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Size } from '../../models/size';
import { select, zoom, ZoomBehavior } from 'd3';
import { DividersRenderer } from '../dividers/dividers.renderer';
import { D3ZoomEvent } from '../../models/types/d3-zoom-event';
import { DotsRenderer } from '../dots/dots.renderer';
import { D3ZoomBehavior } from '../../models/types/d3-zoom-behavior';
import { calculateOuterRingRadius } from '../helpers/calculate-outer-ring-radius';

export class RadarChartRenderer {
	private container: D3Selection;

	private ringsRenderer: RingsRenderer;
	private ringsContainer: D3Selection;

	private dotsRenderer: DotsRenderer;
	private dotsContainer: D3Selection;

	private dividersRenderer: DividersRenderer;
	private dividersContainer: D3Selection;

	private zoomBehavior: D3ZoomBehavior;
	private defaultZoom: number;
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

		this.dotsRenderer = new DotsRenderer(this.dotsContainer, this.model, this.config$);

		this.dividersRenderer = new DividersRenderer(this.dividersContainer, this.model, this.config$);

		this.initBehavior();
	}

	private initBehavior(): void {
		this.zoomBehavior = this.initZoomBehavior();

		const scalePointX: number = this.size.width / 2;
		const scalePointY: number = this.size.height / 2;

		this.model.zoomIn$.subscribe(() => {
			this.scale = 2 * this.scale;
			this.rescaleRadarTo(this.container, this.zoomBehavior, [scalePointX, scalePointY]);
		});

		this.model.zoomOut$.subscribe(() => {
			this.scale = this.scale / 2;
			this.rescaleRadarTo(this.container, this.zoomBehavior, [scalePointX, scalePointY]);
		});

		this.model.zoomReset$.subscribe(() => {
			this.scale = this.defaultZoom;
			this.rescaleRadarTo(this.container, this.zoomBehavior, [scalePointX, scalePointY]);
		});

		this.model.isZoomEnabled.subscribe((isZoomEnabled: boolean) => {
			if (isZoomEnabled) {
				this.container.call(this.zoomBehavior);
			} else {
				this.container.on('.zoom', null);
			}
		});

		combineLatest([this.config$, this.size$]).subscribe(() => {
			this.render();
		});
	}

	private initZoomBehavior(): D3ZoomBehavior {
		const self: RadarChartRenderer = this;
		const zoomBehavior: D3ZoomBehavior = zoom().on('zoom', function (event: D3ZoomEvent): void {
			if (self.defaultZoom === undefined) {
				self.defaultZoom = event.transform.k;
			}
			self.zoomContainer.attr('transform', event.transform.toString());
			self.scale = event.transform.k;
			self.model.zoomed$.next();
		});

		this.scale = this.calculateInitialScale();
		const initialTransformX: number = this.config.offsetLeft + this.config.marginLeftRight + this.calculateCenteringTransformX();
		const initialTransformY: number = this.config.marginTopBottom;
		zoomBehavior.scaleTo(this.container, this.scale, [0, 0]);
		zoomBehavior.translateBy(this.container, initialTransformX / this.scale, initialTransformY / this.scale);
		this.calculateCenteringTransformX();

		return zoomBehavior;
	}

	private rescaleRadarTo(container: D3Selection, zoomBehavior: D3ZoomBehavior, [scalePointX, scalePointY]: [number, number]): void {
		container.transition().duration(300).call(zoomBehavior.scaleTo, this.scale, [scalePointX, scalePointY]);
	}

	private calculateInitialScale(): number {
		return this.size.height / this.model.rangeY$.getValue();
	}

	private calculateCenteringTransformX(): number {
		const radarDiameter: number =
			2 * calculateOuterRingRadius(this.model.rangeX$.getValue(), this.model.rangeY$.getValue(), this.config);
		const transform: number = (this.size.width - (this.config.offsetLeft + this.config.offsetRight + this.scale * radarDiameter)) / 2;
		const transformWithoutRightOffset: number = (this.size.width - (this.config.offsetLeft + this.scale * radarDiameter)) / 2;

		return transform >= 0 ? transform : transformWithoutRightOffset;
	}

	private initContainers(): void {
		this.container = select(this.svgElement);

		this.zoomContainer = this.container.append('g').attr('class', 'radar-chart__zoom-container');

		this.ringsContainer = this.zoomContainer.append('g').attr('class', 'radar-chart__rings');

		this.dotsContainer = this.zoomContainer.append('g').attr('class', 'radar-chart__dots');

		this.dividersContainer = this.zoomContainer.append('g').attr('class', 'radar-chart__dividers');
	}

	private render(): void {
		select(this.svgElement)
			.style('background', this.config.backgroundColor)
			.attr('width', this.size.width)
			.attr('height', this.size.height);
	}
}
