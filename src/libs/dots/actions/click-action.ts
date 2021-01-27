import { Cluster } from '../../../models/cluster';
import { D3Selection } from '../../../models/types/d3-selection';
import { RadarChartModel } from '../../radar-chart/radar-chart.model';

export class ClickAction {
	constructor(private model: RadarChartModel) {}

	public applyTo(container: D3Selection): void {
		const cluster: Cluster = container.datum();
		const self: ClickAction = this;
		container.on('click', function (event: MouseEvent): void {
			event.stopPropagation();
			self.model.dotClicked$.next({
				items: cluster.items,
				target: this,
			});
		});
	}
}
