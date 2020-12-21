import { RadarChartConfig } from '../../radar-chart/radar-chart.config';
import { DividersLabel } from '../../../models/dividers-label';
import { D3Selection } from '../../../models/types/d3-selection';
import { LabelsConfig } from './labels.config';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

export class LabelsRenderer {
	constructor(private config$: BehaviorSubject<RadarChartConfig>) {}

	private get config(): RadarChartConfig {
		return this.config$.getValue();
	}

	private get labelsConfig(): LabelsConfig {
		return this.config.ringsConfig.labelsConfig;
	}

	public render(backgroundContainer: D3Selection, textContainer: D3Selection, range: number, ringNames: string[]): void {
		const labels: DividersLabel[] = this.calculateLabels(range, ringNames);
		const textToUpdate: D3Selection = textContainer.selectAll('text.label').data(labels);
		const textToEnter: D3Selection = textToUpdate.enter().append('text');
		const textToExit: D3Selection = textToUpdate.exit();

		this.renderText(textToUpdate);
		this.renderText(textToEnter);
		textToExit.remove();

		const backgroundToUpdate: D3Selection = backgroundContainer.selectAll('rect.label-background').data(labels);
		const backgroundToEnter: D3Selection = backgroundToUpdate.enter().append('rect');
		const backgroundToExit: D3Selection = backgroundToUpdate.exit();

		this.renderBackground(backgroundToUpdate);
		this.renderBackground(backgroundToEnter);
		backgroundToExit.remove();
	}

	private renderBackground(container: D3Selection): void {
		container
			.classed('label-background', true)
			.attr('width', (label: DividersLabel) => label.backgroundWidth)
			.attr('height', this.labelsConfig.lineHeight)
			.attr('fill', this.config.backgroundColor)
			.attr('transform', (label: DividersLabel) => {
				return `translate(${label.x - label.backgroundWidth / 2}, ${-this.labelsConfig.lineHeight / 2}) rotate(90, ${
					label.backgroundWidth / 2
				}, ${this.labelsConfig.lineHeight / 2})`;
			});
	}

	private renderText(container: D3Selection): void {
		container
			.classed('label', true)
			.text((label: DividersLabel) => label.text)
			.attr('x', (label: DividersLabel) => label.x)
			.attr('font-family', this.labelsConfig.fontFamily)
			.attr('font-size', this.labelsConfig.fontSize)
			.attr('letter-spacing', this.labelsConfig.letterSpacing)
			.attr('fill', this.labelsConfig.textColor)
			.attr('dominant-baseline', 'central')
			.attr('transform', (label: DividersLabel) => `rotate(90, ${label.x}, 0)`);
	}

	private calculateLabels(range: number, ringNames: string[]): DividersLabel[] {
		const deltaX: number = range / ringNames.length;
		const startX: number = deltaX / 2;

		let currentX: number = startX - deltaX;
		const labels: DividersLabel[] = ringNames.map((ringName: string) => {
			return {
				text: ringName,
				x: currentX += deltaX,
				backgroundWidth: this.config.ringsConfig.strokeWidth + 1,
			};
		});
		return labels;
	}
}
