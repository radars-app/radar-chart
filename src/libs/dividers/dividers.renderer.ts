import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { RadarChartModel } from '../radar-chart/radar-chart.model';
import { RadarChartConfig } from '../radar-chart/radar-chart.config';
import { Divider } from '../../models/divider';
import { D3Selection } from '../../models/types/d3-selection';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { calculateNewRingRange } from '../helpers/calculate-ring-range';
import { select } from 'd3';
import { LabelsRenderer } from './labels/labels.renderer';
import { DividersLabel } from 'src/models/dividers-label';
import './dividers.scss';

export class DividersRenderer {

	private labelsRenderer: LabelsRenderer;

	constructor(
		private container: D3Selection,
		private model: RadarChartModel,
		public readonly config$: BehaviorSubject<RadarChartConfig>
	) {
		this.labelsRenderer = new LabelsRenderer(new BehaviorSubject(this.config));
		this.initBehavior();
	}

	private get config(): RadarChartConfig {
		return this.config$.getValue();
	}

	private initBehavior(): void {
		combineLatest([this.model.rangeX$, this.model.rangeY$, this.config$, this.model.sectorNames$, this.model.ringNames$])
		.subscribe(([rangeX, rangeY, config, sectorNames, ringNames]: [number, number, RadarChartConfig, string[], string[]]) => {
			this.labelsRenderer.config$.next(config);
			const range: number = this.calculateRange(rangeX, rangeY, config);
			const dividers: Divider[] = this.calculateDividers(sectorNames);
			const labels: DividersLabel[] = this.calculateLabels(range, ringNames);
			this.render(range, dividers, labels);
		});
	}

	private calculateRange(rangeX: number, rangeY: number, config: RadarChartConfig): number {
		const [newRangeX, newRangeY]: [number, number] = calculateNewRingRange(rangeX, rangeY, config);
		return Math.min(newRangeX, newRangeY) / 2;
	}

	private calculateDividers(sectorNames: string[]): Divider[] {
		const rotationDelta: number = 360 / sectorNames.length;
		const startRotation: number = 270;

		let currentRotation: number = startRotation - rotationDelta;
		const dividers: Divider[] = sectorNames.map((sectorName: string) => {
			return {
				isLabeled: false,
				rotation: currentRotation += rotationDelta
			};
		});
		this.markLabeledDivider(dividers);
		return dividers;
	}

	private markLabeledDivider(dividers: Divider[]): void {
		dividers.some((divider: Divider, index: number) => {
			const currentRotation: number = dividers[index].rotation;
			const nextRotation: number = dividers[index + 1] ? dividers[index + 1].rotation : currentRotation;

			const isLabeledDivider: boolean = Math.abs(360 - currentRotation) <= Math.abs(360 - nextRotation);

			if (isLabeledDivider) {
				divider.isLabeled = true;
				return true;
			}
		});
	}

	private calculateLabels(range: number, ringNames: string[]): DividersLabel[] {
		const deltaX: number = range / ringNames.length;
		const startX: number = deltaX / 2;

		let currentX: number = startX - deltaX;
		const labels: DividersLabel[] = ringNames.map((ringName: string) => {
			return {
				text: ringName,
				x: currentX += deltaX
			};
		});
		return labels;
	}

	private render(range: number, dividers: Divider[], labels: DividersLabel[]): void {
		const dividersToUpdate: D3Selection = this.container.selectAll('g.divider-container').data(dividers);
		const dividersToEnter: D3Selection = dividersToUpdate.enter().append('g');
		const dividersToExit: D3Selection = dividersToUpdate.exit();

		this.update(dividersToUpdate, range);
		this.enter(dividersToEnter, range);
		this.exit(dividersToExit);
	}

	private update(container: D3Selection, range: number): void {
		const self: DividersRenderer = this;
		container.each(function(): void {
			const dividerContainer: D3Selection = select(this);
			const divider: D3Selection = dividerContainer.select('line.divider');
			self.renderDividersContainer(dividerContainer, range);
			self.renderDividers(divider, range);
		});
	}

	private enter(container: D3Selection, range: number): void {
		const self: DividersRenderer = this;
		container.each(function(): void {
			const dividerContainer: D3Selection = select(this);
			const divider: D3Selection = dividerContainer.append('line');
			self.renderDividersContainer(dividerContainer, range);
			self.renderDividers(divider, range);
		});
	}

	private exit(container: D3Selection): void {
		container.remove();
	}

	private renderDividersContainer(container: D3Selection, range: number): void {
		container
			.attr('class', 'divider-container')
			.classed('divider-container--labeled', (divider: Divider) => divider.isLabeled)
			.attr('transform', (divider: Divider) =>
				`translate(${range}, ${range}) rotate(${divider.rotation}, 0, 0)`
			);
	}

	private renderDividers(container: D3Selection, range: number): void {
		container
			.attr('class', 'divider')
			.attr('x1', 0).attr('y1', 0)
			.attr('x2', range).attr('y2', 0)
			.attr('stroke', this.config.dividersConfig.dividerColor)
			.attr('stroke-width', this.config.dividersConfig.strokeWidth);
	}
}
