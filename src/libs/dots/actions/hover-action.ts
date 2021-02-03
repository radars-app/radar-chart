import { selectAll } from 'd3';
import { Cluster } from '../../../models/cluster';
import { D3Selection } from '../../../models/types/d3-selection';
import { RadarChartModel } from '../../radar-chart/radar-chart.model';
import { ActionBase } from './action-base';

export class HoverAction extends ActionBase {
	constructor(private model: RadarChartModel) {
		super();
	}

	public applyTo(container: D3Selection): void {
		const cluster: Cluster = container.datum();
		const self: HoverAction = this;

		container
			.on('mouseenter', function (): void {
				const allDots: D3Selection = selectAll('g.dot');
				self.resetDotHover(allDots);
				self.resetDotFocus(allDots);
				self.model.dotHovered$.next({
					items: cluster.items,
					target: this,
				});
				container.classed(self.hoveredClassName, true);
				allDots.classed(self.blurredClassName, true);
			})
			.on('mouseleave', function (): void {
				const allDots: D3Selection = selectAll('g.dot');
				self.resetDotHover(allDots);
			});
	}
}
