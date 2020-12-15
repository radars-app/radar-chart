import { selectAll } from 'd3';
import { RadarDot } from '../../../models/radar-dot';
import { D3Selection } from '../../../models/types/d3-selection';
import { RadarChartModel } from '../../radar-chart/radar-chart.model';

export class HoverAction {
	public static hoveredDotId: string = undefined;

	public static applyTo(container: D3Selection, model: RadarChartModel): void {
		const hoveredClassName: string = 'dot--hovered';
		const blurredClassName: string = 'dot--blurred';
		const dot: RadarDot = container.datum();

		container
			.on('mouseenter', function (): void {
				HoverAction.hoveredDotId = dot.id;
				model.dotHovered$.next({
					dotId: dot.id,
					target: this,
				});
				selectAll('g.dot').classed(blurredClassName, true);
				container.classed(hoveredClassName, HoverAction.hoveredDotId === dot.id);
			})
			.on('mouseleave', function (): void {
				selectAll('g.dot').classed(hoveredClassName, false);
				selectAll('g.dot').classed(blurredClassName, false);
				this.classList.remove(hoveredClassName);
				HoverAction.hoveredDotId = undefined;
			});
	}
}
