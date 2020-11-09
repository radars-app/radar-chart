import { RadarChartConfig } from '../../radar-chart/radar-chart.config';
import { DividersLabel } from '../../../models/dividers-label';
import { D3Selection } from '../../../models/types/d3-selection';
import { LabelsConfig } from './labels.config';
import './labels.scss';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

export class LabelsRenderer {

	private labels: DividersLabel[];

	constructor(public readonly config$: BehaviorSubject<RadarChartConfig>) {}

	private get labelsConfig(): LabelsConfig {
		return this.config$.getValue().ringsConfig.labelsConfig;
	}

	public update(container: D3Selection): void {

	}

	public enter(container: D3Selection): void {

	}

	public exit(container: D3Selection): void {

	}

	private renderContainer(container: D3Selection): void {

	}

	private renderBackground(container: D3Selection): void {

	}

	private renderLabel(container: D3Selection): void {

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
