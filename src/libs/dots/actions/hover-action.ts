import { selectAll } from 'd3';
import { Cluster } from '../../../models/cluster';
import { D3Selection } from '../../../models/types/d3-selection';
import { RadarChartModel } from '../../radar-chart/radar-chart.model';
import { ActionBase } from './action-base';
import { DotsConfig } from '../dots.config';

export class HoverAction extends ActionBase {
	constructor(private model: RadarChartModel, private dotsConfig: DotsConfig) {
		super();
	}

	public applyTo(container: D3Selection): void {
		const cluster: Cluster = container.datum();
		const self: HoverAction = this;
		const isCluster: boolean = cluster.items.length > 1;
		const allDots: D3Selection = selectAll('g.dot');

		container.on('mouseenter.hover-action', null);
		container.on('mouseleave.hover-action', null);

		container
			.on('mouseenter.hover-action', function (): void {
				if (cluster.items.length === 1) {
					self.resetDotHover(allDots, self.dotsConfig);
				}
				self.model.dotHovered$.next({
					items: cluster.items,
					target: this,
				});
				container.classed(self.hoveredClassName, true);
				allDots.classed(self.blurredClassName, true);

				if (isCluster) {
					container.select('circle').attr('r', self.dotsConfig.clusterRadius + 1);
				} else {
					container.select('circle').attr('r', self.dotsConfig.dotRadius + 1);
				}
			})
			.on('mouseleave.hover-action', function (): void {
				self.resetDotHover(allDots, self.dotsConfig);
			});
	}
}
