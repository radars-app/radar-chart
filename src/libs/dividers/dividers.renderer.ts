import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { RadarChartModel } from '../radar-chart/radar-chart.model';
import { LabelsRenderer } from '../labels/labels.renderer';
import { RadarChartConfig } from '../radar-chart/radar-chart.config';
import { Divider } from '../../models/divider';
import { D3Selection } from '../../models/types/d3-selection';
import './dividers.scss';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';
import { calculateNewRingRange } from '../helpers/calculate-ring-range';
import { select } from 'd3';

export class DividersRenderer {

	private isLabeledDividerFound: boolean;
	private labelsRenderer: LabelsRenderer;

	private dividers: Divider[];
	private outerRingRadius: number;

	constructor(
		private container: D3Selection,
		private model: RadarChartModel,
		public readonly config$: BehaviorSubject<RadarChartConfig>
	) {
	/*	this.labelsRenderer = new LabelsRenderer(
			this.config
		);*/
		this.initBehavior();
	}

	private get config(): RadarChartConfig {
		return this.config$.getValue();
	}

	private initBehavior(): void {
		combineLatest([this.model.rangeX$, this.model.rangeY$, this.config$, this.model.sectorNames$, this.model.ringNames$])
		.subscribe(([rangeX, rangeY, config, sectorNames, ringNames]: [number, number, RadarChartConfig, string[], string[]]) => {
			// this.labelsRenderer.config = config;
			const [newRangeX, newRangeY]: [number, number] = calculateNewRingRange(rangeX, rangeY, config);
			this.calculateDividers(newRangeX, newRangeY, sectorNames);
			this.render();
		});
	}

	private calculateDividers(rangeX: number, rangeY: number, sectorNames: string[]): void {
		this.outerRingRadius = Math.min(rangeX, rangeY) / 2;
		const rotationDelta: number = 360 / sectorNames.length;
		const startRotation: number = 270;

		let currentRotation: number = startRotation - rotationDelta;
		let nextRotation: number = startRotation;
		this.isLabeledDividerFound = false;
		this.dividers = sectorNames.map((sectorName: string) => {
			currentRotation += rotationDelta;
			nextRotation += rotationDelta;
			return {
				label: sectorName,
				isLabeled: this.isLabeledDividerFound ? false : this.isLabeledDivider(currentRotation, nextRotation),
				rotation: currentRotation
			};
		});
	}

	private isLabeledDivider(currentRotation: number, nextRotation: number): boolean {
		const isCurrentDividerLabeled: boolean = Math.abs(360 - currentRotation) <= Math.abs(360 - nextRotation);
		if (isCurrentDividerLabeled) {
			this.isLabeledDividerFound = true;
			return true;
		} else {
			return false;
		}
	}

	private render(): void {
		const dividersToUpdate: D3Selection = this.container.selectAll('g.divider-container').data(this.dividers);
		const dividersToEnter: D3Selection = dividersToUpdate.enter().append('g');
		const dividersToExit: D3Selection = dividersToUpdate.exit();

		this.update(dividersToUpdate);
		this.enter(dividersToEnter);
		this.exit(dividersToExit);
	}

	private update(container: D3Selection): void {
		const renderer: DividersRenderer = this;

		container.each(function(): void {
			const dividerContainer: D3Selection = select(this);
			const divider: D3Selection = dividerContainer.select('line.divider');

			renderer.renderDividersContainer(dividerContainer);
			renderer.renderDividers(divider);
		});
	}

	private enter(container: D3Selection): void {
		const renderer: DividersRenderer = this;

		container.each(function(): void {
			const dividerContainer: D3Selection = select(this);
			const divider: D3Selection = dividerContainer.append('line');

			renderer.renderDividersContainer(dividerContainer);
			renderer.renderDividers(divider);
		});
	}

	private exit(container: D3Selection): void {
		container.remove();
	}

	private renderDividersContainer(container: D3Selection): void {
		container
			.attr('class', 'divider-container')
			.classed('labeled', (divider: Divider) => divider.isLabeled)
			.attr('transform', (divider: Divider) =>
				`translate(${this.outerRingRadius}, ${this.outerRingRadius}) rotate(${divider.rotation}, 0, 0)`
			);
	}

	private renderDividers(container: D3Selection): void {
		container
			.attr('class', 'divider')
			.attr('x1', 0).attr('y1', 0)
			.attr('x2', this.outerRingRadius).attr('y2', 0)
			.attr('stroke', this.config.dividersConfig.dividerColor)
			.attr('stroke-width', this.config.dividersConfig.strokeWidth);
	}
}
