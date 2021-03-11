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
import { appendNodeIfNotExist } from '../helpers/append-node-if-not-exists';
import { DotStateIconService } from './services/dot-state-icon.service';
import { DotStatus } from '../../models/dot-status';

export class DotsRenderer {
	private possiblePointsService: PossiblePointsService;
	private clustersService: ClustersService;
	private dotStateIconService: DotStateIconService;

	private dotsContainer: D3Selection;

	private radarDiameter: number;

	private clickAction: ClickAction;
	private hoverAction: HoverAction;

	private get config(): RadarChartConfig {
		return this.config$.getValue();
	}

	constructor(private container: D3Selection, private model: RadarChartModel, private config$: BehaviorSubject<RadarChartConfig>) {
		this.possiblePointsService = new PossiblePointsService(config$, model);
		this.dotStateIconService = new DotStateIconService();
		this.clustersService = new ClustersService();
		this.radarDiameter =
			2 * calculateOuterRingRadius(this.model.rangeX$.getValue(), this.model.rangeY$.getValue(), this.config$.getValue());
		this.initContainers();
		this.initBehavior();
		this.initIcons(container);
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

	private initIcons(container: D3Selection): void {
		const hiddenContainer: D3Selection = container.append('g').style('display', 'none');

		this.dotStateIconService.renderDotMovedIcon(hiddenContainer.append('g'));
		this.dotStateIconService.renderDotUpdatedIcon(hiddenContainer.append('g'));
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

			const circle: D3Selection = container.append('g');
			const dotColor: string = self.getColorBySectorName(firstItem.sector);
			self.renderCircle(circle, dotColor, self.isClusteredDot(cluster), firstItem.status);
			self.positionCluster(container, cluster);

			if (self.config.dotsConfig.isNumberShown) {
				const number: D3Selection = container.append('text');
				const dotsNumber: string = self.isClusteredDot(cluster) ? `${cluster.items.length}` : `${firstItem.number}`;
				const isClustered: boolean = self.isClusteredDot(cluster);
				self.renderNumber(number, dotsNumber, isClustered);

				const star: D3Selection = appendNodeIfNotExist(container, 'dot__star', 'text');
				if (isClustered) {
					self.renderStar(star);
				} else {
					star.remove();
				}
			}
		});
	}

	private update(clusters: D3Selection): void {
		const self: DotsRenderer = this;
		clusters.each(function (cluster: Cluster): void {
			const firstItem: RadarDot = cluster.items[0];
			const container: D3Selection = select(this);
			self.renderClusterContainer(container);

			const circle: D3Selection = container.select('g.dot__circle');
			const dotColor: string = self.getColorBySectorName(firstItem.sector);
			self.renderCircle(circle, dotColor, self.isClusteredDot(cluster), firstItem.status);
			self.positionCluster(container, cluster);

			if (self.config.dotsConfig.isNumberShown) {
				const number: D3Selection = container.select('text.dot__number');
				const dotsNumber: string = self.isClusteredDot(cluster) ? `${cluster.items.length}` : `${firstItem.number}`;
				const isClustered: boolean = self.isClusteredDot(cluster);
				self.renderNumber(number, dotsNumber, isClustered);

				const star: D3Selection = appendNodeIfNotExist(container, 'dot__star', 'text');
				if (isClustered) {
					self.renderStar(star);
				} else {
					star.remove();
				}
			}
		});
	}

	private exit(dots: D3Selection): void {
		dots.remove();
	}

	private renderClusterContainer(container: D3Selection): void {
		container.classed('dot', true);

		if (this.config.dotsConfig.hasClickAction) {
			this.clickAction.applyTo(container);
		}
		if (this.config.dotsConfig.hasHoverAction) {
			this.hoverAction.applyTo(container);
		}
	}

	private isClusteredDot(cluster: Cluster): boolean {
		return cluster.items.length >= 2;
	}

	private renderStar(container: D3Selection): void {
		container
			.classed('dot__star', true)
			.attr('font-size', this.config.dotsConfig.starFontSize)
			.attr('fill', '#FFFFFF')
			.attr('font-family', this.config.dotsConfig.numberFontFamily)
			.attr('style', () => {
				return `transform: rotate(-90deg) translate(-${this.config.dotsConfig.clusterRadius / 2 + 1}px, ${
					this.config.dotsConfig.clusterRadius / 2 + 1
				}px);`;
			})
			.text('*');
	}

	private renderCircle(container: D3Selection, color: string, isClusteredDot: boolean, status: DotStatus): void {
		container.selectAll('*').remove();
		container.classed('dot__circle', true);

		if (isClusteredDot) {
			container.append('circle').attr('r', this.config.dotsConfig.clusterRadius).attr('fill', color);
		} else {
			if (status === DotStatus.NoChanges) {
				container.append('circle').attr('r', this.config.dotsConfig.dotRadius).attr('fill', color);
			}

			if (status === DotStatus.Updated) {
				this.dotStateIconService
					.renderDotUpdatedIcon(container)
					.attr('transform', `translate(-${this.config.dotsConfig.dotRadius + 2}, -${this.config.dotsConfig.dotRadius + 2})`)
					.select('svg')
					.attr('width', this.config.dotsConfig.dotDiameterForStatusIcon)
					.attr('height', this.config.dotsConfig.dotDiameterForStatusIcon)
					.attr('fill', color);
			}

			if (status === DotStatus.Moved) {
				this.dotStateIconService
					.renderDotMovedIcon(container)
					.attr('transform', `translate(-${this.config.dotsConfig.dotRadius + 2}, -${this.config.dotsConfig.dotRadius + 2})`)
					.select('svg')
					.attr('width', this.config.dotsConfig.dotDiameterForStatusIcon)
					.attr('height', this.config.dotsConfig.dotDiameterForStatusIcon)
					.attr('fill', color);
			}
		}
	}

	private renderNumber(container: D3Selection, number: string, isClusteredDot: boolean): void {
		container
			.classed('dot__number', true)
			.attr('fill', '#FFFFFF')
			.attr('font-family', this.config.dotsConfig.numberFontFamily)
			.attr('font-size', () => {
				return isClusteredDot ? this.config.dotsConfig.clusterNumberFontSize : this.config.dotsConfig.numberFontSize;
			})
			.attr('dominant-baseline', 'central')
			.attr('style', () => {
				return isClusteredDot
					? `transform: rotate(-90deg) translate(2px, ${this.config.dotsConfig.clusterRadius / 2 - 1}px);`
					: 'transform: rotate(-90deg);';
			})
			.text(() => {
				if (isClusteredDot) {
					return Boolean(number) && parseInt(number, 10) <= 99 ? number : '...';
				} else {
					return number;
				}
			});
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
