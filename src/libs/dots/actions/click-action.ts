import { select, selectAll } from 'd3';
import { Cluster } from '../../../models/cluster';
import { D3Selection } from '../../../models/types/d3-selection';
import { RadarChartModel } from '../../radar-chart/radar-chart.model';
import { DotAction } from './dot-action';

export class ClickAction extends DotAction {
	constructor(private model: RadarChartModel) {
		super();
	}

	public applyTo(container: D3Selection): void {
		const cluster: Cluster = container.datum();
		const self: ClickAction = this;
		container.on('click', function (event: MouseEvent): void {
			event.stopPropagation();
			self.model.dotClicked$.next({
				items: cluster.items,
				target: this,
			});
			if (cluster.items.length >= 2) {
				const allDots: D3Selection = selectAll('g.dot');
				allDots.classed(self.blurredClusterClassName, true);
				container.classed(self.focusedClusterClassName, true);
			}
		});

		select(window).on('click', function (event: MouseEvent): void {
			self.resetDotFocus();
		});
	}
}
