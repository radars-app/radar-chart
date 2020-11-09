import { Dimension } from '../../models/dimension';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { RadarChartModel } from '../radar-chart/radar-chart.model';
import { LabelsRenderer } from '../labels/labels.renderer';
import { RadarChartConfig } from '../radar-chart/radar-chart.config';
import { Divider } from '../../models/divider';
import { D3Selection } from '../../models/types/d3-selection';
import './dividers.scss';
import { combineLatest } from 'rxjs/internal/observable/combineLatest';

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
			this.labelsRenderer.config = config;
			this.calculateDividers(rangeX, rangeY, sectorNames);
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

	private getContainerTransform(divider: Divider): string {
		return 	`translate(${this.outerRingRadius}, ${this.outerRingRadius}) rotate(${divider.rotation}, 0, 0)`;
	}

	private update(container: D3Selection): void {
		container
			.attr('class', 'divider')
			.attr('x1', 0).attr('y1', 0)
			.attr('x2', this.outerRingRadius).attr('y2', 0)
			.attr('stroke', this.config.dividersConfig.dividerColor)
			.attr('stroke-width', this.config.dividersConfig.strokeWidth);
	}

	private enter(container: D3Selection): void {
		const dividersToEnter: D3Selection = container
			.enter()
				.append('g')
					.attr('class', 'divider-container')
					.classed('labeled', (divider: Divider) => divider.isLabeled)
					.attr('transform', (divider: Divider) => this.getContainerTransform(divider))
						.append('line');

		this.update(dividersToEnter);
	}

	private exit(container: D3Selection): void {
		container.exit().remove();
	}

	private render(): void {
		const dividerContainer: D3Selection = this.container.selectAll('g.divider-container').data(this.dividers);
		const container: D3Selection = this.container.selectAll('g.divider-container > line.divider').data(this.dividers);

		this.enter(container);
		this.update(container);
		dividerContainer
			.classed('labeled', (divider: Divider) => divider.isLabeled)
			.attr('transform', (divider: Divider) => this.getContainerTransform(divider));
		this.exit(dividerContainer);
	}

	private renderLabels(ringNames: string[]): void {
		const labeledContainer: D3Selection = this.container.select('g.divider-container.labeled');
		this.labelsRenderer.render(labeledContainer, this.outerRingRadius, ringNames);
	}
}
