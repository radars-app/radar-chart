import { BehaviorSubject, combineLatest } from 'rxjs';
import { D3Selection } from '../../models/types/d3-selection';
import { calculateOuterRingRadius } from '../helpers/calculate-outer-ring-radius';
import { RadarChartConfig } from '../radar-chart/radar-chart.config';
import { RadarChartModel } from '../radar-chart/radar-chart.model';
import { RadarDot } from '../../models/radar-dot';
import { PossiblePointsService } from './services/possible-points.service';
import { select } from 'd3';
import { Sector } from '../../models/sector';

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
		combineLatest([this.model.rangeX$, this.model.rangeY$, this.config$, this.model.sectors$, this.model.ringNames$]).subscribe(
			([rangeX, rangeY, config, sectors, ringNames]: [number, number, RadarChartConfig, Sector[], string[]]) => {
				const possiblePoints: Map<string, PossiblePoint[]> = this.possiblePointsService.getPossiblePoints(
					this.dotsContainer,
					this.model
				);
				this.render(this.container, possiblePoints);
			}
		);
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
			container.classed('dot', true);

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
			container.classed('dot', true);

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

	private renderCircle(container: D3Selection, color: string): void {
		container.classed('dot__circle', true).attr('r', this.config.dotsConfig.dotRadius).attr('fill', color);
	}

	private renderNumber(container: D3Selection, number: number): void {
		container
			.classed('dot__number', true)
			.attr('fill', 'white')
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

		const lengthDiffs: number[] = possiblePointsForDot.map((possiblePoint: PossiblePoint) => {
			const lengthsBetween: number[] = pointsToAvoid.map((pointToAvoid: PossiblePoint) => {
				const diffX: number = pointToAvoid.x - possiblePoint.x;
				const diffY: number = pointToAvoid.y - possiblePoint.y;
				const lengthBetween: number = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
				return lengthBetween;
			});

			const lengthDifference: number = lengthsBetween.reduce((sum: number, length: number) => {
				return sum + Math.abs(length - lengthsBetween[0]);
			}, 0);
			return lengthDifference;
		});

		const maxLength: number = Math.min(...lengthDiffs);
		const bestPointIndex: number = lengthDiffs.findIndex((length: number) => length === maxLength);
		possiblePointsForDot[bestPointIndex].isOccupied = true;
		return possiblePointsForDot[bestPointIndex];
	}

	private getColorBySectorName(sectorName: string): string {
		const sectors: Sector[] = this.model.sectors$.getValue();
		const sectorWithTheName: Sector = sectors.find((sector: Sector) => sectorName === sector.name);
		return sectorWithTheName.color;
	}
}
