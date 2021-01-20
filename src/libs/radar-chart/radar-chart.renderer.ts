import { D3Selection } from '../../models/types/d3-selection';
import { RadarChartConfig } from './radar-chart.config';
import { RadarChartModel } from './radar-chart.model';
import { RingsRenderer } from '../rings/rings.renderer';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Size } from '../../models/size';
import { select, zoom, ZoomBehavior, zoomIdentity, zoomTransform, ZoomTransform } from 'd3';
import { DividersRenderer } from '../dividers/dividers.renderer';
import { D3ZoomEvent } from '../../models/types/d3-zoom-event';
import { DotsRenderer } from '../dots/dots.renderer';
import { D3ZoomBehavior } from '../../models/types/d3-zoom-behavior';
import { calculateOuterRingRadius } from '../helpers/calculate-outer-ring-radius';
import { Point } from '../../models/point';

export class RadarChartRenderer {
	private container: D3Selection;

	private ringsRenderer: RingsRenderer;
	private ringsContainer: D3Selection;

	private dotsRenderer: DotsRenderer;
	private dotsContainer: D3Selection;

	private dividersRenderer: DividersRenderer;
	private dividersContainer: D3Selection;

	private zoomBehavior: D3ZoomBehavior;
	private zoomContainer: D3Selection;

	private scale: number;
	private initialScale: number;
	private initialTranslate: Point;

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

		const scalePointX: number = (this.size.width - this.config.offsetLeft - this.config.offsetRight) / 2 + this.config.offsetLeft;
		const scalePointY: number = this.size.height / 2;

		this.model.zoomIn$.subscribe(() => {
			this.scale = 2 * this.scale;
			this.applyScale([scalePointX, scalePointY]);
		});

		this.model.zoomOut$.subscribe(() => {
			this.scale = this.scale / 2;
			this.applyScale([scalePointX, scalePointY]);
		});

		this.model.zoomReset$.subscribe(() => {
			this.scale = this.initialScale;
			this.applyInitialTransform();
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
			self.zoomContainer.attr('transform', event.transform.toString());
			self.scale = event.transform.k;
			self.model.zoomed$.next();
		});

		this.scale = this.initialScale = this.calculateInitialScale();
		this.initialTranslate = {
			x: this.config.offsetLeft + this.config.marginLeftRight + this.calculateCenteringTransformX(),
			y: this.config.marginTopBottom,
		};
		zoomBehavior.scaleTo(this.container, this.initialScale, [0, 0]);
		zoomBehavior.translateBy(this.container, this.initialTranslate.x / this.initialScale, this.initialTranslate.y / this.initialScale);

		return zoomBehavior;
	}

	private applyScale([scalePointX, scalePointY]: [number, number]): void {
		this.container
			.transition()
			.duration(this.config.zoomTransitionTime)
			.call(this.zoomBehavior.scaleTo, this.scale, [scalePointX, scalePointY]);
	}

	private applyInitialTransform(): void {
		const transform: ZoomTransform = zoomIdentity.translate(this.initialTranslate.x, this.initialTranslate.y).scale(this.initialScale);
		this.container.transition().duration(this.config.zoomTransitionTime).call(this.zoomBehavior.transform, transform);
	}

	private calculateInitialScale(): number {
		return this.size.height / this.model.rangeY$.getValue();
	}

	private calculateCenteringTransformX(): number {
		const radarDiameter: number =
			2 * calculateOuterRingRadius(this.model.rangeX$.getValue(), this.model.rangeY$.getValue(), this.config);
		const transform: number = (this.size.width - (this.config.offsetLeft + this.config.offsetRight + this.scale * radarDiameter)) / 2;

		return transform;
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
