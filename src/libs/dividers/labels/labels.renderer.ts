import { RadarChartConfig } from '../../radar-chart/radar-chart.config';
import { DividersLabel } from '../../../models/dividers-label';
import { D3Selection } from '../../../models/types/d3-selection';
import { LabelsConfig } from './labels.config';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { scaleLinear, ScaleLinear, selectAll } from 'd3';
import './labels.scss';

export class LabelsRenderer {

	constructor(public readonly config$: BehaviorSubject<RadarChartConfig>) {}

	private get config(): RadarChartConfig {
		return this.config$.getValue();
	}

	private get labelsConfig(): LabelsConfig {
		return this.config$.getValue().ringsConfig.labelsConfig;
	}

	public render(backgroundContainer: D3Selection, textContainer: D3Selection, range: number, ringNames: string[]): void {
		const labels: DividersLabel[] = this.calculateLabels(range, ringNames);
		const textToUpdate: D3Selection = textContainer.selectAll('text.text').data(labels);
		const textToEnter: D3Selection = textToUpdate.enter().append('text');
		const textToExit: D3Selection = textToUpdate.exit();

		this.renderText(textToUpdate);
		this.renderText(textToEnter);
		textToExit.remove();

		this.calculateBackgroundWidth(selectAll('text.text'));
		const backgroundToUpdate: D3Selection = backgroundContainer.selectAll('rect.background').data(labels);
		const backgroundToEnter: D3Selection = backgroundToUpdate.enter().append('rect');
		const backgroundToExit: D3Selection = backgroundToUpdate.exit();

		this.renderBackground(backgroundToUpdate);
		this.renderBackground(backgroundToEnter);
		backgroundToExit.remove();
	}

	private renderBackground(container: D3Selection): void {
		container
			.classed('background', true)
			.attr('width', (label: DividersLabel) => label.backgroundWidth + 7)
			.attr('height', this.labelsConfig.lineHeight)
			.attr('fill', this.config.backgroundColor)
			.attr('transform', (label: DividersLabel) => `translate(${label.x - label.backgroundWidth / 2 - 3}, ${-this.labelsConfig.lineHeight / 2})`);
	}

	private renderText(container: D3Selection): void {
		container
			.classed('text', true)
			.text((label: DividersLabel) => label.text)
			.attr('x', (label: DividersLabel) => label.x)
			.attr('font-family', this.labelsConfig.fontFamily)
			.attr('font-size',  this.labelsConfig.fontSize)
			.attr('fill', this.labelsConfig.textColor)
			.attr('dominant-baseline', 'middle');
	}

	private calculateBackgroundWidth(text: D3Selection): void {
		text.each(function(label: DividersLabel): void {
			label.backgroundWidth = this.getComputedTextLength();
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
}
