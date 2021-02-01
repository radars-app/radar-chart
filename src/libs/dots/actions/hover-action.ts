import { select, selectAll } from 'd3';
import { Cluster } from '../../../models/cluster';
import { RadarDot } from '../../../models/radar-dot';
import { D3Selection } from '../../../models/types/d3-selection';
import { RadarChartModel } from '../../radar-chart/radar-chart.model';
import { DotAction } from './dot-action';

export class HoverAction extends DotAction {
	public hoveredDataSet: RadarDot[] = undefined;

	constructor(private model: RadarChartModel) {
		super();
	}

	public applyTo(container: D3Selection): void {
		const cluster: Cluster = container.datum();
		const self: HoverAction = this;

		container
			.on('mouseenter', function (): void {
				const allDots: D3Selection = self.resetDotFocus();
				self.hoveredDataSet = cluster.items;
				self.model.dotHovered$.next({
					items: cluster.items,
					target: this,
				});
				allDots.classed(self.blurredClassName, true);
				container.classed(self.hoveredClassName, self.hoveredDataSet === cluster.items);
			})
			.on('mouseleave', function (): void {
				const isFocusedCluster: Boolean = this.classList.contains(this.clickedClusterClassName);
				if (!isFocusedCluster) {
					self.hoveredDataSet = undefined;
					self.resetDotFocus();
				}
			});
	}
}
