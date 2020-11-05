import { select, selectAll } from 'd3';
import { Dimension } from 'src/models/dimension';
import { RingNameLabel } from 'src/models/ring-name-label';
import { D3Selection } from 'src/models/types/d3-selection';
import { RadarChartConfig } from '../radar-chart/radar-chart.config';
import { LabelsConfig } from './labels.config';
import './labels.scss';

export class LabelsRenderer {

	private labels: RingNameLabel[];

	constructor(public config: RadarChartConfig) {}

	private get labelsConfig(): LabelsConfig {
		return this.config.ringsConfig.labelsConfig;
	}

	public render(container: D3Selection, outerRingRadius: number, ringNames: string[]): void {
		this.calculateLabels(outerRingRadius, ringNames);
		selectAll('g.rect-container').remove();
		selectAll('g.label-container').remove();

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
			const rect: Dimension = {
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
	}

	private calculateLabels(outerRingRadius: number, ringNames: string[]): void {
		const deltaX: number = outerRingRadius / ringNames.length;
		const startX: number = deltaX / 2;

		let currentX: number = startX - deltaX;
		this.labels = ringNames.map((ringName: string) => {
			return {
				text: ringName,
				x: currentX += deltaX
			};
		});
	}
}
