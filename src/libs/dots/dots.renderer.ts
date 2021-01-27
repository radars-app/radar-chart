import { BehaviorSubject, combineLatest } from 'rxjs';
import { D3Selection } from '../../models/types/d3-selection';
import { calculateOuterRingRadius } from '../helpers/calculate-outer-ring-radius';
import { RadarChartConfig } from '../radar-chart/radar-chart.config';
import { RadarChartModel } from '../radar-chart/radar-chart.model';
import { RadarDot } from '../../models/radar-dot';
import { PossiblePointsService } from './services/possible-points.service';
import { select } from 'd3';
import { Sector } from '../../models/sector';
import { ClickAction } from './actions/click-action';
import { HoverAction } from './actions/hover-action';
import { PossiblePoint } from '../../models/possible-point';
import { ClustersService } from './services/clusters.service';
import { Cluster } from '../../models/cluster';

export class DotsRenderer {
	private possiblePointsService: PossiblePointsService;
	private clustersService: ClustersService;

	private dotsContainer: D3Selection;

	private radarDiameter: number;

	private clickAction: ClickAction;
	private hoverAction: HoverAction;

	private get config(): RadarChartConfig {
		return this.config$.getValue();
	}

	constructor(private container: D3Selection, private model: RadarChartModel, private config$: BehaviorSubject<RadarChartConfig>) {
		this.possiblePointsService = new PossiblePointsService(config$, model);
		this.clustersService = new ClustersService();
		this.radarDiameter =
			2 * calculateOuterRingRadius(this.model.rangeX$.getValue(), this.model.rangeY$.getValue(), this.config$.getValue());
		this.initContainers();
		this.initBehavior();
	}

	private initBehavior(): void {
		this.hoverAction = new HoverAction(this.model);
		this.clickAction = new ClickAction(this.model);

		combineLatest([
			this.model.rangeX$,
			this.model.rangeY$,
			this.config$,
			this.model.sectors$,
			this.model.ringNames$,
			this.model.dots$,
		]).subscribe(
			([rangeX, rangeY, config, sectors, ringNames, dots]: [number, number, RadarChartConfig, Sector[], string[], RadarDot[]]) => {
				if (this.isDotsValid(ringNames, sectors, dots)) {
					const possiblePoints: Map<string, PossiblePoint[]> = this.possiblePointsService.calculatePossiblePoints(
						this.dotsContainer
					);
					this.render(this.container, possiblePoints);
				} else {
					console.warn('Dataset is not valid. Check that your rings and sectors are appropriate for dots.');
				}
			}
		);
	}

	private initContainers(): void {
		this.dotsContainer = this.container.attr('transform', `translate(${this.radarDiameter}, 0) rotate(90)`);
	}

	private isDotsValid(ringNames: string[], sectors: Sector[], dots: RadarDot[]): boolean {
		const isRingsValid: boolean = dots.every((dot: RadarDot) => ringNames.find((ringName: string) => ringName === dot.ring));
		const isDotsValid: boolean =
			isRingsValid && dots.every((dot: RadarDot) => sectors.find((sector: Sector) => sector.name === dot.sector));

		return isDotsValid;
	}

	private render(container: D3Selection, possiblePoints: Map<string, PossiblePoint[]>): void {
		const dots: RadarDot[] = this.model.dots$.getValue();
		const clusters: Cluster[] = this.clustersService.calculateClusters(dots, possiblePoints);

		const clustersToUpdate: D3Selection = container.selectAll('g.dot').data(clusters);
		const clustersToEnter: D3Selection = clustersToUpdate.enter().append('g');
		const clustersToExit: D3Selection = clustersToUpdate.exit();

		this.update(clustersToUpdate);
		this.enter(clustersToEnter);
		this.exit(clustersToExit);
	}

	private enter(clusters: D3Selection): void {
		const self: DotsRenderer = this;
		clusters.each(function (cluster: Cluster): void {
			const firstItem: RadarDot = cluster.items[0];
			const container: D3Selection = select(this);
			self.renderClusterContainer(container);

			const circle: D3Selection = container.append('circle');
			const dotColor: string = self.getColorBySectorName(firstItem.sector);
			self.renderCircle(circle, dotColor);
			self.positionCluster(container, cluster);

			if (self.config.dotsConfig.isNumberShown) {
				const number: D3Selection = container.append('text');
				const dotsNumber: string = self.isClusteredDot(cluster) ? `${cluster.items.length}*` : `${firstItem.number}`;
				self.renderNumber(number, dotsNumber);
			}
		});
	}

	private update(clusters: D3Selection): void {
		const self: DotsRenderer = this;
		clusters.each(function (cluster: Cluster): void {
			const firstItem: RadarDot = cluster.items[0];
			const container: D3Selection = select(this);
			self.renderClusterContainer(container);

			const circle: D3Selection = container.append('circle');
			const dotColor: string = self.getColorBySectorName(firstItem.sector);
			self.renderCircle(circle, dotColor);
			self.positionCluster(container, cluster);

			if (self.config.dotsConfig.isNumberShown) {
				const number: D3Selection = container.append('text');
				const dotsNumber: string = self.isClusteredDot(cluster) ? `${cluster.items.length}*` : `${firstItem.number}`;
				self.renderNumber(number, dotsNumber);
			}
		});
	}

	private exit(dots: D3Selection): void {
		dots.remove();
	}

	private renderClusterContainer(container: D3Selection): void {
		container.classed('dot', true);

		if (this.config.dotsConfig.hasHoverAction) {
			this.clickAction.applyTo(container);
		}
		if (this.config.dotsConfig.hasHoverAction) {
			this.hoverAction.applyTo(container);
		}
	}

	private isClusteredDot(cluster: Cluster): boolean {
		return cluster.items.length >= 2;
	}

	private renderCircle(container: D3Selection, color: string): void {
		container.classed('dot__circle', true).attr('r', this.config.dotsConfig.dotRadius).attr('fill', color);
	}

	private renderNumber(container: D3Selection, number: string): void {
		container
			.classed('dot__number', true)
			.attr('fill', '#FFFFFF')
			.attr('font-family', this.config.dotsConfig.numberFontFamily)
			.attr('font-size', this.config.dotsConfig.numberFontSize)
			.attr('dominant-baseline', 'central')
			.text(number);
	}

	private positionCluster(container: D3Selection, cluster: Cluster): void {
		container.attr('transform', `translate(${cluster.x}, ${cluster.y})`);
	}

	private getColorBySectorName(sectorName: string): string {
		const sectors: Sector[] = this.model.sectors$.getValue();
		const sectorWithTheName: Sector = sectors.find((sector: Sector) => sectorName === sector.name);
		return sectorWithTheName.color;
	}
}
