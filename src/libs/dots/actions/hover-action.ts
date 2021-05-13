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

		container.on('mouseenter.hover-action', null);
		container.on('mouseleave.hover-action', null);

		container
			.on('mouseenter.hover-action', function (): void {
				const allDots: D3Selection = selectAll('g.dot');
				if (cluster.items.length === 1) {
					self.resetDotHover(allDots);
					self.resetDotFocus(allDots);
				}
				self.model.dotHovered$.next({
					items: cluster.items,
					target: this,
				});
				container.classed(self.hoveredClassName, true);
				allDots.classed(self.blurredClassName, true);
			})
			.on('mouseleave.hover-action', function (): void {
				const allDots: D3Selection = selectAll('g.dot');
				self.resetDotHover(allDots);
			});
	}
}
