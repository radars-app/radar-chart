import { Dimension } from '../../models/dimension';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import './dividers.scss';
import { RadarChartModel } from '../radar-chart/radar-chart.model';
import { LabelsRenderer } from '../labels/labels.renderer';
import { RadarChartConfig } from '../radar-chart/radar-chart.config';
import { Divider } from '../../models/divider';
import { D3Selection } from '../../models/types/d3-selection';

export class DividersRenderer {

	private isLabeledDividerFound: boolean;
	private labelsRenderer: LabelsRenderer;

	private outerRingRadius: number;
	private dividers: Divider[];

	constructor(
		private container: D3Selection,
		private model: RadarChartModel,
		public readonly config$: BehaviorSubject<RadarChartConfig>,
		private range$: BehaviorSubject<Dimension>
	) {
		this.labelsRenderer = new LabelsRenderer(
			this.config
		);
		this.subscribeConfig();
		this.initBehavior();
		this.initSizing();
	}

	private get config(): RadarChartConfig {
		return this.config$.getValue();
	}

	private get sectorNames(): string[] {
		return this.model.dividers.sectorNames.getValue();
	}

	private get range(): Dimension {
		return this.range$.getValue();
	}

	private initBehavior(): void {
		this.model.dividers.sectorNames.subscribe((sectorNames: string[]) => {
			this.render();
		});

		this.model.rings.ringNames.subscribe((ringNames: string[]) => {
			this.renderLabels(ringNames);
		});
	}

	private subscribeConfig(): void {
		this.config$.subscribe((config: RadarChartConfig) => {
			this.labelsRenderer.config = config;
			this.render();
		});
	}

	private initSizing(): void {
		this.range$.subscribe(() => {
			this.render();
		});
	}

	private calculateDividers(): void {
		this.outerRingRadius = Math.min(this.range.width, this.range.height) / 2;
		const rotationDelta: number = 360 / this.sectorNames.length;
		const startRotation: number = 270;

		let currentRotation: number = startRotation - rotationDelta;
		let nextRotation: number = startRotation;
		this.isLabeledDividerFound = false;
		this.dividers = this.sectorNames.map((sectorName: string) => {
			currentRotation += rotationDelta;
			nextRotation += rotationDelta;
			return {
				label: sectorName,
				isLabeled: this.isLabeledDividerFound ? false : this.isLabeledDivider(currentRotation, nextRotation, rotationDelta),
				rotation: currentRotation
			};
		});
	}

	private isLabeledDivider(currentRotation: number, nextRotation: number, rotationDelta: number): boolean {
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
		this.calculateDividers();
		const dividerContainer: D3Selection = this.container.selectAll('g.divider-container').data(this.dividers);
		const container: D3Selection = this.container.selectAll('g.divider-container > line.divider').data(this.dividers);

		this.enter(container);
		this.update(container);
		dividerContainer
			.classed('labeled', (divider: Divider) => divider.isLabeled)
			.attr('transform', (divider: Divider) => this.getContainerTransform(divider));
		this.exit(dividerContainer);

		this.renderLabels(this.model.rings.ringNames.getValue());
	}

	private renderLabels(ringNames: string[]): void {
		const labeledContainer: D3Selection = this.container.select('g.divider-container.labeled');
		this.labelsRenderer.render(labeledContainer, this.outerRingRadius, ringNames);
	}
}
