import { selectAll } from 'd3';
import { RadarDot } from '../../../models/radar-dot';
import { D3Selection } from '../../../models/types/d3-selection';
import { RadarChartModel } from '../../radar-chart/radar-chart.model';

export class HoverAction {
	public hoveredDotId: string = undefined;
	public hoveredClassName: string = 'dot--hovered';
	public blurredClassName: string = 'dot--blurred';

	constructor(private model: RadarChartModel) {}

	public applyTo(container: D3Selection): void {
		const dot: RadarDot = container.datum();
		const self: HoverAction = this;

		container
			.on('mouseenter', function (): void {
				self.hoveredDotId = dot.id;
				self.model.dotHovered$.next({
					dotId: dot.id,
					target: this,
				});
				const allDots: D3Selection = selectAll('g.dot');
				allDots.classed(self.blurredClassName, true);
				container.classed(self.hoveredClassName, self.hoveredDotId === dot.id);
			})
			.on('mouseleave', function (): void {
				self.hoveredDotId = undefined;
				const allDots: D3Selection = selectAll('g.dot');
				allDots.classed(self.hoveredClassName, false);
				allDots.classed(self.blurredClassName, false);
			});
	}
}
