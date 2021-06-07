import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { RadarChartModel } from '../radar-chart/radar-chart.model';
import { RadarChartConfig } from '../radar-chart/radar-chart.config';
import { Divider } from '../../models/divider';
import { D3Selection } from '../../models/types/d3-selection';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { LabelsRenderer } from './labels/labels.renderer';
import { calculateOuterRingRadius } from '../helpers/calculate-outer-ring-radius';
import { select } from 'd3';
import { Sector } from '../../models/sector';
import { appendNodeIfNotExist } from '../helpers/append-node-if-not-exists';

export class DividersRenderer {
	private labelsRenderer: LabelsRenderer;

	constructor(private container: D3Selection, private model: RadarChartModel, private config$: BehaviorSubject<RadarChartConfig>) {
		this.labelsRenderer = new LabelsRenderer(this.config$);
		this.initBehavior();
	}

	private get config(): RadarChartConfig {
		return this.config$.getValue();
	}

	private initBehavior(): void {
		combineLatest([this.model.rangeX$, this.model.rangeY$, this.config$, this.model.sectors$, this.model.ringNames$]).subscribe(
			([rangeX, rangeY, config, sectors, ringNames]: [number, number, RadarChartConfig, Sector[], string[]]) => {
				const outerRingRadius: number = calculateOuterRingRadius(rangeX, rangeY, config);
				const dividers: Divider[] = this.createDividerModels(sectors);
				this.render(outerRingRadius, dividers, ringNames);
			}
		);
	}

	private createDividerModels(sectors: Sector[]): Divider[] {
		const startDegree: number = 270;
		const dividers: Divider[] = this.initDividers(startDegree, sectors);
		return dividers;
	}

	private initDividers(startDegree: number, sectors: Sector[]): Divider[] {
		const deltaDegree: number = 360 / sectors.length;
		let currentDegree: number = startDegree - deltaDegree;
		return sectors.map(() => {
			currentDegree += deltaDegree;
			return {
				isLabeled: currentDegree === 270,
				rotation: currentDegree,
			};
		});
	}

	private render(range: number, dividerModels: Divider[], ringNames: string[]): void {
		const dividersToUpdate: D3Selection = this.container.selectAll('g.divider').data(dividerModels);
		const dividersToEnter: D3Selection = dividersToUpdate.enter().append('g');
		const dividersToExit: D3Selection = dividersToUpdate.exit();

		this.update(dividersToUpdate, range, ringNames);
		this.enter(dividersToEnter, range, ringNames);
		this.exit(dividersToExit);
	}

	private update(container: D3Selection, range: number, ringNames: string[]): void {
		const self: DividersRenderer = this;
		container.each(function (): void {
			const dividerContainer: D3Selection = select(this);
			const dividerLine: D3Selection = dividerContainer.select('line.divider__line');
			self.renderDividersContainer(dividerContainer, range);
			self.renderLabels(dividerContainer, range);
			self.renderDividers(dividerLine, range);
		});
	}

	private enter(container: D3Selection, range: number, ringNames: string[]): void {
		const self: DividersRenderer = this;
		container.each(function (): void {
			const dividerContainer: D3Selection = select(this);
			const dividerLine: D3Selection = dividerContainer.append('line');
			self.renderDividersContainer(dividerContainer, range);
			self.renderLabels(dividerContainer, range);
			self.renderDividers(dividerLine, range);
		});
	}

	private exit(container: D3Selection): void {
		container.remove();
	}

	private renderDividersContainer(container: D3Selection, range: number): void {
		container
			.attr('class', 'divider')
			.attr('transform', (divider: Divider) => `translate(${range}, ${range}) rotate(${divider.rotation}, 0, 0)`);
	}

	private renderDividers(container: D3Selection, range: number): void {
		container
			.attr('class', 'divider__line')
			.attr('x1', 0)
			.attr('y1', 0)
			.attr('x2', range)
			.attr('y2', 0)
			.attr('stroke', this.config.dividersConfig.dividerColor)
			.attr('stroke-width', this.config.dividersConfig.strokeWidth);
	}

	private renderLabels(container: D3Selection, range: number): void {
		if (this.config.ringsConfig.labelsConfig.isLabelShown) {
			const ringNamesToRender: string[] = container.datum().isLabeled ? this.model.ringNames$.getValue() : [];
			const backgroundContainer: D3Selection = appendNodeIfNotExist(container, 'divider__labels-background');
			const textContainer: D3Selection = appendNodeIfNotExist(container, 'divider__labels');
			textContainer.attr('transform', 'translateZ(0)');
			this.labelsRenderer.render(backgroundContainer, textContainer, range, ringNamesToRender);
		}
	}
}
