import { RadarChartConfig } from '../../radar-chart/radar-chart.config';
import { DividersLabel } from '../../../models/dividers-label';
import { D3Selection } from '../../../models/types/d3-selection';
import { LabelsConfig } from './labels.config';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import './labels.scss';
import { select, selectAll } from 'd3';

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
			.attr('width', (label: DividersLabel) => label.backgroundWidth + 6)
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
			.attr('font-size', this.labelsConfig.fontSize)
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
	/*private render(container: D3Selection, outerRingRadius: number, ringNames: string[]): void {
		const rectContainer: D3Selection = container
			.append('g')
			.attr('class', 'rect-container');

		const textContainer: D3Selection = container
			.append('g')
			.attr('class', 'label-container');

		const texts: D3Selection = textContainer.selectAll('text.label--ring-name').data(this.labels);

		this.enter(texts);
		this.update(texts);
		this.exit(texts);

		const rects: D3Selection = rectContainer.selectAll('rect.label-background').data(this.labels);
		this.enterRects(rects);
		this.updateRects(rects);
		this.exitRects(rects);

		const rectContainerAgain: D3Selection = rectContainer.selectAll('rect.label-background');
		const textContainerAgain: D3Selection = textContainer.selectAll('text.label--ring-name');

		const config: RadarChartConfig = this.config;
		textContainerAgain.each(function(labels: RingNameLabel, index: number): void {
			const rect: Size = {
				width: this.getComputedTextLength(),
				height: 12
			};
			select(rectContainerAgain.nodes()[index])
				.attr('width', this.getComputedTextLength() + 6)
				.attr('height', 12)
				.attr('fill', config.backgroundColor)
				.attr('transform', (label: RingNameLabel) => `translate(${label.x - rect.width / 2 - 3}, ${-rect.height / 2})`);
		});
	}

	private updateRects(container: D3Selection): D3Selection {
		return container
			.attr('class', 'label-background');
	}

	private enterRects(container: D3Selection): void {
		const rectsToEnter: D3Selection = container
			.enter()
				.append('rect');

		this.updateRects(rectsToEnter);
	}

	private exitRects(container: D3Selection): void {
		container.exit().remove();
	}

	private update(container: D3Selection): D3Selection {
		return container
			.text((label: RingNameLabel) => label.text)
			.attr('x', (label: RingNameLabel) => label.x)
			.attr('font-family', this.labelsConfig.fontFamily)
			.attr('fill', this.labelsConfig.textColor);
	}

	private enter(container: D3Selection): void {
		const labelsToEnter: D3Selection = container
			.enter()
				.append('text')
				.attr('class', 'label--ring-name')
				.attr('dominant-baseline', 'middle');

		this.update(labelsToEnter);
	}

	private exit(container: D3Selection): void {
		container.exit().remove();
	}*/
}
