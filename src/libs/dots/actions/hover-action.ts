import { selectAll } from 'd3';
import { Cluster } from '../../../models/cluster';
import { RadarDot } from '../../../models/radar-dot';
import { D3Selection } from '../../../models/types/d3-selection';
import { RadarChartModel } from '../../radar-chart/radar-chart.model';

export class HoverAction {
	public hoveredDataSet: RadarDot[] = undefined;
	public hoveredClassName: string = 'dot--hovered';
	public blurredClassName: string = 'dot--blurred';

	constructor(private model: RadarChartModel) {}

	public applyTo(container: D3Selection): void {
		const cluster: Cluster = container.datum();
		const self: HoverAction = this;

		container
			.on('mouseenter', function (): void {
				self.hoveredDataSet = cluster.items;
				self.model.dotHovered$.next({
					items: cluster.items,
					target: this,
				});
				const allDots: D3Selection = selectAll('g.dot');
				allDots.classed(self.blurredClassName, true);
				container.classed(self.hoveredClassName, self.hoveredDataSet === cluster.items);
			})
			.on('mouseleave', function (): void {
				self.hoveredDataSet = undefined;
				const allDots: D3Selection = selectAll('g.dot');
				allDots.classed(self.hoveredClassName, false);
				allDots.classed(self.blurredClassName, false);
			});
	}
}
