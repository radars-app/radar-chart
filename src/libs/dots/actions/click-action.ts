import { Cluster } from '../../../models/cluster';
import { D3Selection } from '../../../models/types/d3-selection';
import { RadarChartModel } from '../../radar-chart/radar-chart.model';
import { ActionBase } from './action-base';

export class ClickAction extends ActionBase {
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
		});
	}
}
