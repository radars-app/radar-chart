import { BehaviorSubject, combineLatest } from 'rxjs';
import { D3Selection } from '../../models/types/d3-selection';
import { calculateOuterRingRadius } from '../helpers/calculate-outer-ring-radius';
import { RadarChartConfig } from '../radar-chart/radar-chart.config';
import { RadarChartModel } from '../radar-chart/radar-chart.model';
import { RadarDot } from '../../models/radar-dot';
import { PossiblePointsService } from './services/possible-points.service';
import { easeLinear, select } from 'd3';
import { Sector } from '../../models/sector';
import { DotHoveredEvent } from '../../models/dot-hovered-event';

export class DotsRenderer {
	private possiblePointsService: PossiblePointsService;
	private dotsContainer: D3Selection;

	private radarDiameter: number;

	private get config(): RadarChartConfig {
		return this.config$.getValue();
	}

	constructor(private container: D3Selection, private model: RadarChartModel, private config$: BehaviorSubject<RadarChartConfig>) {
		this.possiblePointsService = new PossiblePointsService(config$, model);
		this.radarDiameter =
			2 * calculateOuterRingRadius(this.model.rangeX$.getValue(), this.model.rangeY$.getValue(), this.config$.getValue());
		this.initContainers();
		this.initBehavior();
	}

	private initBehavior(): void {
		combineLatest([
			this.model.rangeX$,
			this.model.rangeY$,
			this.config$,
			this.model.sectors$,
			this.model.ringNames$,
			this.model.dots$,
		]).subscribe(
			([rangeX, rangeY, config, sectors, ringNames, dots]: [number, number, RadarChartConfig, Sector[], string[], RadarDot[]]) => {
				const possiblePoints: Map<string, PossiblePoint[]> = this.possiblePointsService.calculatePossiblePoints(this.dotsContainer);
				this.render(this.container, possiblePoints);
			}
		);

		this.model.hoveredDot$.subscribe(() => {
			const possiblePoints: Map<string, PossiblePoint[]> =
				this.possiblePointsService.cachedPossiblePoints || this.possiblePointsService.calculatePossiblePoints(this.dotsContainer);
			this.render(this.container, possiblePoints);
		});
	}

	private initContainers(): void {
		this.dotsContainer = this.container.attr('transform', `translate(${this.radarDiameter}, 0) rotate(90)`);
	}

	private render(container: D3Selection, possiblePoints: Map<string, PossiblePoint[]>): void {
		const dots: RadarDot[] = this.model.dots$.getValue();

		const dotsToUpdate: D3Selection = container.selectAll('g.dot').data(dots);
		const dotsToEnter: D3Selection = dotsToUpdate.enter().append('g');
		const dotsToExit: D3Selection = dotsToUpdate.exit();

		this.update(dotsToUpdate, possiblePoints);
		this.enter(dotsToEnter, possiblePoints);
		this.exit(dotsToExit);
	}

	private enter(dots: D3Selection, points: Map<string, PossiblePoint[]>): void {
		const self: DotsRenderer = this;
		dots.each(function (dot: RadarDot): void {
			const container: D3Selection = select(this);
			self.renderDotContainer(container);

			const circle: D3Selection = container.append('circle');
			const dotColor: string = self.getColorBySectorName(dot.sector);
			self.renderCircle(circle, dotColor);

			const number: D3Selection = container.append('text');
			self.renderNumber(number, dot.number);

			const point: PossiblePoint = self.choosePoint(dot, points);
			self.positionDot(container, point);
		});
	}

	private update(dots: D3Selection, points: Map<string, PossiblePoint[]>): void {
		const self: DotsRenderer = this;
		dots.each(function (dot: RadarDot): void {
			const container: D3Selection = select(this);
			self.renderDotContainer(container);

			const circle: D3Selection = container.select('circle.dot__circle');
			const dotColor: string = self.getColorBySectorName(dot.sector);
			self.renderCircle(circle, dotColor);

			const number: D3Selection = container.select('text.dot__number');
			self.renderNumber(number, dot.number);

			const point: PossiblePoint = self.choosePoint(dot, points);
			self.positionDot(container, point);
		});
	}

	private exit(dots: D3Selection): void {
		dots.remove();
	}

	private renderDotContainer(container: D3Selection): void {
		const self: DotsRenderer = this;
		const dot: RadarDot = container.datum();
		container
			.classed('dot', true)
			.on('mouseover', function (event: Event): void {
				const positionedDot: DotHoveredEvent = {
					dotId: dot.id,
					target: event.target as SVGGElement,
				};
				self.model.hoveredDot$.next(positionedDot);
			})
			.on('mouseout', function (): void {
				self.model.hoveredDot$.next(null);
			})
			.transition()
			.duration(200)
			.ease(easeLinear)
			.attr('fill-opacity', function (): number {
				const hoveredDot: DotHoveredEvent = self.model.hoveredDot$.getValue();
				let opacity: number;
				if (hoveredDot === null) {
					opacity = 0.8;
				} else {
					opacity = hoveredDot.dotId === dot.id ? 1 : 0.6;
				}
				return opacity;
			});
	}

	private renderCircle(container: D3Selection, color: string): void {
		container.classed('dot__circle', true).attr('r', this.config.dotsConfig.dotRadius).attr('fill', color);
	}

	private renderNumber(container: D3Selection, number: number): void {
		container
			.classed('dot__number', true)
			.attr('fill', '#FFFFFF')
			.attr('font-family', this.config.dotsConfig.numberFontFamily)
			.attr('font-size', this.config.dotsConfig.numberFontSize)
			.attr('dominant-baseline', 'central')
			.text(number);
	}

	private positionDot(container: D3Selection, point: PossiblePoint): void {
		container.attr('transform', `translate(${point.x}, ${point.y})`);
	}

	private choosePoint(dot: RadarDot, possiblePoints: Map<string, PossiblePoint[]>): PossiblePoint {
		const sectorsPoints: PossiblePoint[] = possiblePoints.get(`${dot.ring}-${dot.sector}`);
		const possiblePointsForDot: PossiblePoint[] = sectorsPoints.filter((point: PossiblePoint) => {
			return !Boolean(point.isOccupied);
		});
		const pointsToAvoid: PossiblePoint[] = sectorsPoints.filter((point: PossiblePoint) => {
			return point.isEdgePoint || point.isOccupied;
		});

		let candidatePoint: PossiblePoint = null;
		let candidateDistance: number = 0;
		possiblePointsForDot.forEach((possiblePoint: PossiblePoint, index: number) => {
			let currentDistance: number = 300;
			pointsToAvoid.forEach((pointToAvoid: PossiblePoint) => {
				const diffX: number = pointToAvoid.x - possiblePoint.x;
				const diffY: number = pointToAvoid.y - possiblePoint.y;
				const lengthBetween: number = Math.sqrt(diffX ** 2 + diffY ** 2);
				if (lengthBetween < currentDistance) {
					currentDistance = lengthBetween;
				}
			});

			if (currentDistance > candidateDistance) {
				candidatePoint = possiblePointsForDot[index];
				candidateDistance = currentDistance;
			}
		});

		if (candidatePoint === null) {
			candidatePoint = possiblePointsForDot[0];
		}

		if (candidatePoint === undefined) {
			throw new Error('implement clusters');
		}

		candidatePoint.isOccupied = true;
		return candidatePoint;
	}

	private getColorBySectorName(sectorName: string): string {
		const sectors: Sector[] = this.model.sectors$.getValue();
		const sectorWithTheName: Sector = sectors.find((sector: Sector) => sectorName === sector.name);
		return sectorWithTheName.color;
	}
}
